import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, Role } from '../models';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

export interface AuthSessionDto {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDto;
}

export interface AuthUserDto {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  isFirstLogin: boolean;
}

export interface RefreshTokenDto {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userStorageKey = 'clinic.auth.user';
  private readonly api = inject(ApiService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  login(email: string, password: string): Observable<AuthUser> {
    return this.api.post<AuthSessionDto>('auth/login', {
      email: email.trim(),
      password
    }).pipe(
      tap((res) => this.storeTokens(res.accessToken, res.refreshToken)),
      map((res) => this.toAuthUser(res.user, res.accessToken))
    );
  }

  loginWithGoogle(idToken?: string): Observable<AuthUser> {
    if (idToken) {
      return this.postGoogleTokens({ idToken, accessToken: '' });
    }
    // Get token from Google Identity Services popup
    return new Observable<AuthUser>((subscriber) => {
      this.getGoogleTokenViaPopup()
        .then((tokens) => this.postGoogleTokens(tokens).subscribe(subscriber))
        .catch((err: unknown) => subscriber.error(err));
    });
  }

  loginWithFacebook(accessToken?: string, userId?: string): Observable<AuthUser> {
    if (accessToken && userId) {
      return this.postFacebookToken(accessToken, userId);
    }
    // No accessToken/userId — get them from the Facebook SDK popup
    return new Observable<AuthUser>((subscriber) => {
      this.getFacebookTokenViaPopup()
        .then(({ accessToken: fbToken, userId: fbUserId }) =>
          this.postFacebookToken(fbToken, fbUserId).subscribe(subscriber)
        )
        .catch((err: unknown) => subscriber.error(err));
    });
  }

  registerPatient(
    firstName: string,
    middleName: string | undefined,
    lastName: string,
    email: string,
    password: string
  ): Observable<AuthUser> {
    return this.api.post<AuthSessionDto>('auth/register', {
      firstName: firstName.trim(),
      middleName: middleName?.trim() || undefined,
      lastName: lastName.trim(),
      email: email.trim(),
      password
    }).pipe(
      tap((res) => this.storeTokens(res.accessToken, res.refreshToken)),
      map((res) => this.toAuthUser(res.user, res.accessToken))
    );
  }

  refreshTokens(): Observable<void> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('Session expired.'));
    }

    return this.api.post<RefreshTokenDto>('auth/refresh-token', { refreshToken }).pipe(
      tap((res) => this.storeTokens(res.accessToken, res.refreshToken)),
      map(() => void 0),
      catchError((error: unknown) => {
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  restoreSession(): Observable<AuthUser | null> {
    const hasTokens = this.tokenService.hasAccessToken() || this.tokenService.hasRefreshToken();
    if (!hasTokens) {
      this.clearSession();
      return of(null);
    }

    return this.api.get<AuthUserDto>('auth/me').pipe(
      map((user) => this.toAuthUser(user, this.tokenService.getAccessToken() ?? undefined)),
      catchError((error: unknown) => {
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  setPassword(newPassword: string, confirmPassword: string): Observable<AuthUser> {
    if (newPassword !== confirmPassword) {
      return throwError(() => new Error('Passwords do not match.'));
    }

    return this.api.post<AuthUserDto>('auth/set-password', { newPassword, confirmPassword }).pipe(
      map((user) => this.toAuthUser(user, this.tokenService.getAccessToken() ?? undefined))
    );
  }

  updateProfile(payload: { fullName?: string; avatarUrl?: string }): Observable<AuthUserDto> {
    return this.api.put<AuthUserDto>('auth/me', payload).pipe(
      tap((user) => {
        const current = this.getStoredUser();
        if (current) {
          this.persistUser({ ...current, fullName: user.fullName, avatarUrl: user.avatarUrl ?? undefined });
        }
      })
    );
  }

  logout(): void {
    const refreshToken = this.tokenService.getRefreshToken();
    const request$ = refreshToken
      ? this.api.post('auth/logout', { refreshToken }).pipe(catchError(() => of(void 0)))
      : of(void 0);

    request$.pipe(
      tap(() => this.clearSession()),
      tap(() => void this.router.navigate(['/auth/login'], { replaceUrl: true }))
    ).subscribe();
  }

  persistUser(user: AuthUser): void {
    localStorage.setItem(this.userStorageKey, JSON.stringify(user));
  }

  clearSession(): void {
    this.tokenService.clearTokens();
    localStorage.removeItem(this.userStorageKey);
  }

  navigateByRole(user: AuthUser): void {
    if (user.isFirstLogin) {
      void this.router.navigate(['/auth/set-password']);
      return;
    }

    switch (user.role) {
      case 'Admin':
        void this.router.navigate(['/admin/dashboard']);
        break;
      case 'Staff':
        void this.router.navigate(['/staff/dashboard']);
        break;
      case 'Doctor':
        void this.router.navigate(['/doctor/dashboard']);
        break;
      case 'Patient':
        void this.router.navigate(['/patient/dashboard']);
        break;
      default:
        void this.router.navigate(['/auth/login']);
    }
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    this.tokenService.setTokens(accessToken, refreshToken);
  }

  private toAuthUser(user: AuthUserDto, accessToken?: string): AuthUser {
    const resolvedRole = this.resolveRole(user.role, accessToken);
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: resolvedRole,
      avatarUrl: user.avatarUrl ?? undefined,
      isFirstLogin: user.isFirstLogin
    };
  }

  private resolveRole(roleValue: unknown, accessToken?: string): Role {
    const normalized = normalizeRole(roleValue);
    if (normalized) return normalized;

    if (accessToken) {
      const fromToken = this.resolveRoleFromToken(accessToken);
      if (fromToken) return fromToken;
    }

    throw new Error('Unable to determine authenticated user role.');
  }

  private resolveRoleFromToken(token: string): Role | undefined {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      for (const key of ['role', 'Role', 'roles', 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
        const candidate = payload[key];
        const resolved = normalizeRole(candidate);
        if (resolved) return resolved;
        if (Array.isArray(candidate)) {
          for (const value of candidate) {
            const r = normalizeRole(value);
            if (r) return r;
          }
        }
      }
    } catch { /* ignore */ }
    return undefined;
  }

  private getStoredUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(this.userStorageKey);
      return raw ? JSON.parse(raw) as AuthUser : null;
    } catch {
      return null;
    }
  }

  // ── Google Identity Services ──

  private async getGoogleTokenViaPopup(): Promise<{ idToken?: string; accessToken: string }> {
    console.log('[AuthService] Loading Google Identity Script...');
    await this.loadGoogleIdentityScript();

    const clientId = environment.googleClientId;
    if (!clientId) {
      console.error('[AuthService] Missing googleClientId in environment!');
      throw new Error('Google login is not configured. Missing googleClientId in environment.');
    }

    return new Promise<{ idToken?: string; accessToken: string }>((resolve, reject) => {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid email profile',
          callback: (response: any) => {
            console.log('[AuthService] GIS callback fired:', { hasIdToken: !!response.id_token, hasAccessToken: !!response.access_token, error: response.error });
            if (response.error) {
              reject(new Error(response.error ?? 'Google login failed'));
              return;
            }
            if (response.id_token) {
              resolve({ idToken: response.id_token, accessToken: response.access_token });
            } else if (response.access_token) {
              // No id_token — send the access_token instead (backend will call Google UserInfo API)
              resolve({ accessToken: response.access_token });
            } else {
              reject(new Error('Google login did not return any token.'));
            }
          },
          error_callback: (err: any) => {
            console.error('[AuthService] GIS error_callback:', err);
            reject(new Error(err?.message ?? 'Google login failed'));
          }
        });
        client.requestAccessToken();
      } catch (e) {
        console.error('[AuthService] Exception:', e);
        reject(e);
      }
    });
  }

  private postGoogleTokens(tokens: { idToken?: string; accessToken: string }): Observable<AuthUser> {
    return this.api.post<AuthSessionDto>('auth/google', {
      provider: 'Google',
      idToken: tokens.idToken ?? null,
      accessToken: tokens.accessToken
    }).pipe(
      tap((res) => this.storeTokens(res.accessToken, res.refreshToken)),
      map((res) => this.toAuthUser(res.user, res.accessToken))
    );
  }

  // ── Facebook SDK ──

  private async getFacebookTokenViaPopup(): Promise<{ accessToken: string; userId: string }> {
    await this.loadFacebookSdk();

    const appId = environment.facebookAppId;
    if (!appId) {
      throw new Error('Facebook login is not configured. Missing facebookAppId in environment.');
    }

    return new Promise<{ accessToken: string; userId: string }>((resolve, reject) => {
      (window as any).FB.login(
        (response: { authResponse?: { accessToken: string; userID: string }; status?: string }) => {
          if (response.authResponse) {
            resolve({
              accessToken: response.authResponse.accessToken,
              userId: response.authResponse.userID
            });
          } else {
            reject(new Error('Facebook login was cancelled or failed.'));
          }
        },
        { scope: 'email,public_profile' }
      );
    });
  }

  private postFacebookToken(accessToken: string, userId: string): Observable<AuthUser> {
    return this.api.post<AuthSessionDto>('auth/facebook', {
      accessToken,
      userId
    }).pipe(
      tap((res) => this.storeTokens(res.accessToken, res.refreshToken)),
      map((res) => this.toAuthUser(res.user, res.accessToken))
    );
  }

  // ── Dynamic SDK loading ──

  private async loadGoogleIdentityScript(): Promise<void> {
    if ((window as any).google?.accounts?.oauth2) {
      console.log('[AuthService] GIS already loaded');
      return;
    }
    console.log('[AuthService] Injecting GIS script...');
    await this.injectScript('https://accounts.google.com/gsi/client', 'google-identity-script');
    console.log('[AuthService] GIS script injected, waiting for init...');
    // Wait up to 5 seconds for GIS to initialize
    for (let i = 0; i < 50; i++) {
      if ((window as any).google?.accounts?.oauth2) {
        console.log('[AuthService] GIS initialized after', (i + 1) * 100, 'ms');
        return;
      }
      await new Promise((r) => setTimeout(r, 100));
    }
    console.warn('[AuthService] GIS did not initialize after 5s, continuing anyway');
  }

  private async loadFacebookSdk(): Promise<void> {
    if ((window as any).FB?.init) {
      return;
    }
    (window as any).fbAsyncInit = () => {
      (window as any).FB.init({
        appId: environment.facebookAppId || '',
        version: environment.facebookSdkVersion || 'v25.0',
        xfbml: false
      });
    };
    await this.injectScript('https://connect.facebook.net/en_US/sdk.js', 'facebook-jssdk');
    await new Promise<void>((resolve) => {
      const check = () => {
        if ((window as any).FB?.init) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  private injectScript(src: string, id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (document.getElementById(id)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.id = id;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }
}

function normalizeRole(value: unknown): Role | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  const roles: Role[] = ['Admin', 'Staff', 'Doctor', 'Patient'];
  return roles.find((r) => r.toLowerCase() === normalized);
}

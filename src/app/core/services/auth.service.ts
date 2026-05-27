import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthUser, Role } from '../models';
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
  phoneNumber?: string | null;
}

export interface RefreshTokenDto {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userStorageKey = 'clinic.auth.user';
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  persistUser(user: AuthUser): void {
    localStorage.setItem(this.userStorageKey, JSON.stringify(user));
  }

  clearSession(): void {
    this.tokenService.clearTokens();
    localStorage.removeItem(this.userStorageKey);
  }

  storeTokens(accessToken: string, refreshToken: string): void {
    this.tokenService.setTokens(accessToken, refreshToken);
  }

  toAuthUser(user: AuthUserDto, accessToken?: string): AuthUser {
    const resolvedRole = this.resolveRole(user.role, accessToken);
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: resolvedRole,
      avatarUrl: user.avatarUrl ?? undefined,
      isFirstLogin: user.isFirstLogin,
      phoneNumber: user.phoneNumber ?? undefined
    };
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

  async getGoogleTokenViaPopup(): Promise<{ idToken?: string; accessToken: string }> {
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
            console.log('[AuthService] GIS callback fired:', {
              hasIdToken: !!response.id_token,
              hasAccessToken: !!response.access_token,
              error: response.error
            });
            if (response.error) {
              reject(new Error(response.error ?? 'Google login failed'));
              return;
            }
            if (response.id_token) {
              resolve({ idToken: response.id_token, accessToken: response.access_token });
            } else if (response.access_token) {
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

  async getFacebookTokenViaPopup(): Promise<{ accessToken: string; userId: string }> {
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
    } catch {
      /* ignore */
    }
    return undefined;
  }

  private async loadGoogleIdentityScript(): Promise<void> {
    if ((window as any).google?.accounts?.oauth2) {
      console.log('[AuthService] GIS already loaded');
      return;
    }
    console.log('[AuthService] Injecting GIS script...');
    await this.injectScript('https://accounts.google.com/gsi/client', 'google-identity-script');
    console.log('[AuthService] GIS script injected, waiting for init...');
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

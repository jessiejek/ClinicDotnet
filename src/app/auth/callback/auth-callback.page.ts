import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { AuthUser } from '../../core/models';
import { AuthStateService } from '../../core/services/auth-state.service';
import { AuthService, AuthUserDto } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div class="auth-callback">
      <div class="auth-callback__spinner"></div>
      <p>{{ statusText }}</p>
    </div>
  `,
  styles: [`
    .auth-callback { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100dvh; padding: 2rem; text-align: center; color: var(--ion-color-medium); }
    .auth-callback__spinner { width: 32px; height: 32px; border: 3px solid var(--ion-color-light); border-top-color: var(--ion-color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AuthCallbackPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthStateService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  statusText = 'Completing sign in...';

  async ngOnInit(): Promise<void> {
    try {
      const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
      const tokenFromHash = hashParams.get('access_token');
      const errorFromHash = hashParams.get('error');

      if (errorFromHash) {
        this.statusText = 'Sign in failed. Redirecting...';
        await new Promise((r) => setTimeout(r, 1500));
        void this.router.navigate(['/auth/login']);
        return;
      }

      if (tokenFromHash) {
        const refreshToken = hashParams.get('refresh_token') ?? '';
        this.tokenService.setTokens(tokenFromHash, refreshToken);

        this.statusText = 'Loading your account...';
        const user = await this.restoreSession();
        if (user) {
          this.authState.setUser(user);
          this.authService.navigateByRole(user);
          return;
        }
      }

      const user2 = await this.restoreSession();
      if (user2) {
        this.authState.setUser(user2);
        this.authService.navigateByRole(user2);
        return;
      }

      this.statusText = 'No active session. Redirecting...';
      await new Promise((r) => setTimeout(r, 1000));
      void this.router.navigate(['/auth/login']);
    } catch (err) {
      console.error('[AuthCallback] Error:', err);
      this.statusText = 'Sign in failed.';
      await new Promise((r) => setTimeout(r, 2000));
      void this.router.navigate(['/auth/login']);
    }
  }

  private async restoreSession(): Promise<AuthUser | null> {
    const hasTokens = this.tokenService.hasAccessToken() || this.tokenService.hasRefreshToken();
    if (!hasTokens) {
      this.authService.clearSession();
      return null;
    }

    try {
      const user = await firstValueFrom(this.apiService.get<AuthUserDto>('auth/me'));
      return this.authService.toAuthUser(user, this.tokenService.getAccessToken() ?? undefined);
    } catch (error) {
      this.authService.clearSession();
      throw error;
    }
  }
}

import { AsyncPipe, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  ViewChild,
  inject
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline, closeOutline, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { catchError, finalize, map, tap, throwError } from 'rxjs';
import { APP_VERSION } from '../../core/version';
import { environment } from '../../../environments/environment';
import { AuthLayoutComponent } from '../components/auth-layout/auth-layout.component';
import { BannerComponent } from '../../shared/components/banner/banner.component';
import { ApiService } from '../../core/services/api.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { AuthService, AuthSessionDto } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonSpinner,
    AuthLayoutComponent,
    BannerComponent
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  readonly appVersion = APP_VERSION;

  private readonly fb = inject(FormBuilder);
  private readonly authState = inject(AuthStateService);
  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly toastController = inject(ToastController);

  readonly isProduction = environment.production;
  readonly isLoading$ = this.authState.isLoading$;
  readonly error$ = this.authState.error$;

  showPassword = false;
  devExpanded = false;

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor() {
    addIcons({ alertCircleOutline, closeOutline, eyeOutline, eyeOffOutline });
  }

  fillCreds(email: string, password: string): void {
    this.loginForm.patchValue({ email, password });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.getRawValue();
    this.authState.clearError();
    this.authState.setLoading(true);
    this.apiService
      .post<AuthSessionDto>('auth/login', {
        email: email.trim(),
        password
      })
      .pipe(
        tap((res) => this.authService.storeTokens(res.accessToken, res.refreshToken)),
        map((res) => this.authService.toAuthUser(res.user, res.accessToken)),
        tap((user) => {
          this.authState.setUser(user);
          this.authService.navigateByRole(user);
        }),
        catchError((error: unknown) => {
          const message = extractApiErrorMessage(error, 'Login failed.');
          this.authState.setError(message);
          return throwError(() => new Error(message));
        }),
        finalize(() => this.authState.setLoading(false))
      )
      .subscribe({ error: () => undefined });
  }

  async onGoogleLogin(): Promise<void> {
    this.authState.clearError();
    this.authState.setLoading(true);
    try {
      const tokens = await this.authService.getGoogleTokenViaPopup();
      this.apiService
        .post<AuthSessionDto>('auth/google', {
          provider: 'Google',
          idToken: tokens.idToken ?? null,
          accessToken: tokens.accessToken
        })
        .pipe(
          tap((res) => this.authService.storeTokens(res.accessToken, res.refreshToken)),
          map((res) => this.authService.toAuthUser(res.user, res.accessToken)),
          tap((user) => {
            this.authState.setUser(user);
            this.authService.navigateByRole(user);
          }),
          catchError((error: unknown) => {
            const message = extractApiErrorMessage(error, 'Google login failed.');
            this.authState.setError(message);
            return throwError(() => new Error(message));
          }),
          finalize(() => this.authState.setLoading(false))
        )
        .subscribe({ error: () => undefined });
    } catch (error) {
      const message = extractApiErrorMessage(error, 'Google login failed.');
      this.authState.setError(message);
      this.authState.setLoading(false);
    }
  }

  async onFacebookLogin(): Promise<void> {
    this.authState.clearError();
    this.authState.setLoading(true);
    try {
      const tokens = await this.authService.getFacebookTokenViaPopup();
      this.apiService
        .post<AuthSessionDto>('auth/facebook', {
          accessToken: tokens.accessToken,
          userId: tokens.userId
        })
        .pipe(
          tap((res) => this.authService.storeTokens(res.accessToken, res.refreshToken)),
          map((res) => this.authService.toAuthUser(res.user, res.accessToken)),
          tap((user) => {
            this.authState.setUser(user);
            this.authService.navigateByRole(user);
          }),
          catchError((error: unknown) => {
            const message = extractApiErrorMessage(error, 'Facebook login failed.');
            this.authState.setError(message);
            return throwError(() => new Error(message));
          }),
          finalize(() => this.authState.setLoading(false))
        )
        .subscribe({ error: () => undefined });
    } catch (error) {
      const message = extractApiErrorMessage(error, 'Facebook login failed.');
      this.authState.setError(message);
      this.authState.setLoading(false);
    }
  }

  async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }
}

function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const errorBody = error.error as {
      message?: string;
      errors?: Record<string, string[] | string>;
    } | null;

    if (typeof errorBody?.message === 'string' && errorBody.message.trim()) {
      return errorBody.message;
    }

    if (errorBody?.errors) {
      for (const value of Object.values(errorBody.errors)) {
        const values = Array.isArray(value) ? value : [value];
        const firstValidationError = values.find((item) => typeof item === 'string' && item.trim().length > 0);
        if (typeof firstValidationError === 'string') {
          return firstValidationError;
        }
      }
    }

    if (typeof error.message === 'string' && error.message.trim()) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
}

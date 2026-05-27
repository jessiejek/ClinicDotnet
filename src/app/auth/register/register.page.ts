import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonCheckbox,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonSpinner
} from '@ionic/angular/standalone';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/services/api.service';
import { AuthService, AuthSessionDto } from '../../core/services/auth.service';
import { AuthLayoutComponent } from '../components/auth-layout/auth-layout.component';
import { BannerComponent } from '../../shared/components/banner/banner.component';
import { getPasswordStrength, passwordStrengthValidator } from '../../shared/validators/password-strength.validator';
import { AuthStateService } from '../../core/services/auth-state.service';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('password')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw === cpw ? null : { passwordMismatch: true };
}

@Component({
  standalone: true,
  selector: 'app-register-page',
  imports: [
    NgIf, NgFor, AsyncPipe, ReactiveFormsModule, RouterLink,
    AuthLayoutComponent, BannerComponent,
    IonItem, IonLabel, IonInput, IonNote, IonCheckbox, IonSpinner
  ],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss'
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly authState = inject(AuthStateService);
  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthService);


  readonly isProduction = environment.production;
  readonly isLoading$ = this.authState.isLoading$;
  readonly error$ = this.authState.error$;

  readonly strengthIndexes = [0, 1, 2, 3];
  passwordStrength: 0 | 1 | 2 | 3 | 4 = 0;

  registerForm = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      middleName: ['', [Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
      consentAccepted: [false, Validators.requiredTrue]
    },
    { validators: passwordMatchValidator }
  );

  ngOnInit(): void {
    this.registerForm.get('password')?.valueChanges.subscribe((v) => {
      this.passwordStrength = getPasswordStrength(String(v ?? ''));
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const { firstName, middleName, lastName, email, password } = this.registerForm.getRawValue();
    this.authState.clearError();
    this.authState.setLoading(true);
    this.apiService
      .post<AuthSessionDto>('auth/register', {
        firstName: firstName.trim(),
        middleName: middleName?.trim() || undefined,
        lastName: lastName.trim(),
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
          const message = extractApiErrorMessage(error, 'Registration failed.');
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

  get strengthLabel(): string {
    switch (this.passwordStrength) {
      case 0: return '';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
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

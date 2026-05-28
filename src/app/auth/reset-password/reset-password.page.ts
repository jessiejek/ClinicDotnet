import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonInput, IonItem, IonLabel, ToastController } from '@ionic/angular/standalone';
import { catchError, finalize, of } from 'rxjs';
import { AuthLayoutComponent } from '../components/auth-layout/auth-layout.component';
import { passwordStrengthValidator } from '../../shared/validators/password-strength.validator';
import { ApiService } from '../../core/services/api.service';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('newPassword')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw === cpw ? null : { passwordMismatch: true };
}

@Component({
  standalone: true,
  selector: 'app-reset-password-page',
  imports: [NgIf, ReactiveFormsModule, RouterLink, AuthLayoutComponent, IonItem, IonLabel, IonInput],
  templateUrl: './reset-password.page.html',
  styleUrl: './reset-password.page.scss'
})
export class ResetPasswordPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastController);
  private readonly api = inject(ApiService);

  token = '';
  email = '';
  saving = false;

  form = this.fb.nonNullable.group(
    {
      newPassword: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', Validators.required]
    },
    { validators: passwordMatchValidator }
  );

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;

    const newPassword = this.form.getRawValue().newPassword;

    this.api.post<any>('auth/reset-password', {
      email: this.email,
      token: this.token,
      newPassword
    }).pipe(
      catchError((error: any) => {
        const message = typeof error === 'object' && error?.error?.message
          ? error.error.message
          : 'Password reset failed. The link may be expired or invalid.';
        return of({ error: true, message });
      }),
      finalize(() => {
        this.saving = false;
      })
    ).subscribe(async (result: any) => {
      if (result?.error) {
        const t = await this.toast.create({
          message: result.message,
          duration: 4000,
          color: 'danger'
        });
        await t.present();
      } else {
        const t = await this.toast.create({
          message: 'Password changed successfully',
          duration: 2000,
          color: 'success'
        });
        await t.present();
        void this.router.navigate(['/auth/login']);
      }
    });
  }
}

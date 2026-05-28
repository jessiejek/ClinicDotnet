import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonIcon, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
import { catchError, finalize, of } from 'rxjs';
import { AuthLayoutComponent } from '../components/auth-layout/auth-layout.component';
import { ApiService } from '../../core/services/api.service';

@Component({
  standalone: true,
  selector: 'app-forgot-password-page',
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    AuthLayoutComponent,
    IonItem,
    IonLabel,
    IonInput,
    IonIcon
  ],
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.scss'
})
export class ForgotPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);

  showSuccess = false;
  submitting = false;
  submittedEmail = '';
  errorMessage = '';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor() {
    addIcons({ checkmarkCircle });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.errorMessage = '';
    this.submittedEmail = this.form.getRawValue().email;

    this.api.post<any>('auth/forgot-password', { email: this.submittedEmail }).pipe(
      catchError(() => {
        this.errorMessage = 'Something went wrong. Please try again later.';
        return of(null);
      }),
      finalize(() => {
        this.submitting = false;
      })
    ).subscribe(() => {
      // Always show success — do not reveal whether the email exists
      this.showSuccess = true;
    });
  }
}

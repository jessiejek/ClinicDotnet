import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastController } from '@ionic/angular/standalone';
import { catchError, finalize, of } from 'rxjs';
import { AuthUser } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { AuthUserDto } from '../../../core/services/auth.service';
import { passwordStrengthValidator, getPasswordStrength } from '../../../shared/validators/password-strength.validator';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('newPassword')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw === cpw ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-staff-profile-page',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ReactiveFormsModule, PageHeaderComponent, AvatarComponent],
  templateUrl: './staff-profile.page.html',
  styleUrl: './staff-profile.page.scss'
})
export class StaffProfilePage implements OnInit {
  private readonly authState = inject(AuthStateService);
  private readonly apiService = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly toastCtrl = inject(ToastController);
  private readonly currentUserSignal = this.authState.currentUser;

  strengthIndexes = [0, 1, 2, 3];
  passwordStrength: 0 | 1 | 2 | 3 | 4 = 0;
  changingPassword = false;

  personalForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    contactNumber: ['']
  });

  passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', Validators.required]
    },
    { validators: passwordMatchValidator }
  );

  ngOnInit(): void {
    const user = this.currentUser();
    if (user) {
      this.personalForm.patchValue({
        fullName: user.fullName,
        contactNumber: user.phoneNumber ?? ''
      });
    }

    this.passwordForm.get('newPassword')?.valueChanges.subscribe((value) => {
      this.passwordStrength = getPasswordStrength(String(value ?? ''));
    });
  }

  currentUser(): AuthUser | null {
    return this.currentUserSignal();
  }

  previewUrl: string | null = null;
  isUploading = false;
  uploadError = '';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Preview locally
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.uploadAvatar(file);
  }

  uploadAvatar(file: File): void {
    this.isUploading = true;
    this.uploadError = '';
    const formData = new FormData();
    formData.append('file', file);

    this.apiService.postFormData<{ avatarUrl: string }>('auth/avatar', formData).subscribe({
      next: (result) => {
        this.isUploading = false;
        this.previewUrl = result.avatarUrl;
        // Update the auth state with new avatar URL
        const user = this.currentUser();
        if (user) {
          this.authState.setUser({ ...user, avatarUrl: result.avatarUrl });
        }
        void this.presentToast('Profile photo updated.', 'success');
      },
      error: (err) => {
        this.isUploading = false;
        this.uploadError = err.error?.message || err.message || 'Failed to upload photo.';
        this.previewUrl = null;
      }
    });
  }

  get strengthLabel(): string {
    switch (this.passwordStrength) {
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  }

  saveProfile(): void {
    if (this.personalForm.invalid) {
      this.personalForm.markAllAsTouched();
      return;
    }

    const { fullName, contactNumber } = this.personalForm.getRawValue();

    this.apiService
      .put<AuthUserDto>('auth/me', {
        fullName: fullName.trim(),
        phoneNumber: contactNumber.trim() || undefined
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          const msg = err.error?.message || err.message || 'Failed to update profile.';
          void this.presentToast(msg, 'danger');
          return of(null);
        })
      )
      .subscribe((user) => {
        if (!user) return;
        this.authState.setUser({
          ...this.currentUser()!,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl ?? undefined,
          phoneNumber: user.phoneNumber ?? undefined
        });
        void this.presentToast('Profile updated', 'success');
      });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.changingPassword = true;
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.getRawValue();

    this.apiService
      .post<void>('auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      })
      .pipe(
        finalize(() => { this.changingPassword = false; }),
        catchError(async (err: HttpErrorResponse) => {
          const msg = err.error?.message || err.message || 'Failed to update password. Please try again.';
          const toast = await this.toastCtrl.create({
            message: msg,
            duration: 4000,
            color: 'danger',
            position: 'top'
          });
          await toast.present();
          return of();
        })
      )
      .subscribe(async () => {
        this.passwordForm.reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        this.passwordStrength = 0;
        const toast = await this.toastCtrl.create({
          message: 'Password updated successfully',
          duration: 2200,
          color: 'success',
          position: 'top'
        });
        await toast.present();
      });
  }

  private async presentToast(message: string, color: 'danger' | 'success' = 'success'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
      position: 'top'
    });
    await toast.present();
  }
}

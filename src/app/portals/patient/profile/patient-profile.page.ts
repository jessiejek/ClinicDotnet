import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline, lockClosedOutline } from 'ionicons/icons';
import { catchError, finalize, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthUser, Patient, UpdatePatientRequest } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import {
  getPasswordStrength,
  passwordStrengthValidator
} from '../../../shared/validators/password-strength.validator';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

interface NameParts {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-patient-profile-page',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    DatePipe,
    ReactiveFormsModule,
    IonItem,
    IonLabel,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
  ],
  templateUrl: './patient-profile.page.html',
  styleUrl: './patient-profile.page.scss'
})
export class PatientProfilePage implements OnInit {
  private readonly authState = inject(AuthStateService);
  private readonly apiService = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly toastCtrl = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);

  currentUser: AuthUser | null = null;
  currentPatient: Patient | null = null;
  loadError: string | null = null;
  readonly consentVersion = '1.0';
  strengthIndexes = [0, 1, 2, 3];
  passwordStrength: 0 | 1 | 2 | 3 | 4 = 0;
  isLoadingProfile = true;
  savingProfile = false;
  changingPassword = false;
  consentAcknowledged = false;
  consentSubmitting = false;

  profileForm = this.fb.nonNullable.group({
    firstName: [''],
    middleName: [''],
    lastName: [''],
    dateOfBirth: [''],
    sex: ['Male'],
    civilStatus: [''],
    bloodType: [''],
    contactNumber: [''],
    email: [{ value: '', disabled: true }],
    address: [''],
    city: [''],
    zipCode: [''],
    emergencyContactName: [''],
    emergencyContactRelationship: [''],
    emergencyContactNumber: [''],
    hmoProvider: [''],
    hmoCardNumber: [''],
    philHealthNumber: ['']
  });

  passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', Validators.required]
    },
    { validators: passwordMatchValidator }
  );

  constructor() {
    addIcons({ lockClosedOutline, alertCircleOutline });
    this.passwordForm.controls.newPassword.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.passwordStrength = getPasswordStrength(String(value ?? ''));
      });
  }

  ngOnInit(): void {
    this.authState.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.currentUser = user;
        if (user && !this.currentPatient) {
          this.patchFromUser(user);
        }
      });

    this.loadProfile();
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

  get hasConsented(): boolean {
    return Boolean(this.currentPatient?.consentedAt);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    if (!this.currentPatient) {
      void this.presentToast('No linked patient record found for this account.', 'danger');
      return;
    }

    const value = this.profileForm.getRawValue();
    const payload: UpdatePatientRequest = {
      firstName: value.firstName.trim(),
      middleName: value.middleName.trim() || undefined,
      lastName: value.lastName.trim(),
      dateOfBirth: value.dateOfBirth,
      sex: value.sex,
      civilStatus: value.civilStatus.trim() || undefined,
      bloodType: value.bloodType.trim() || undefined,
      contactNumber: value.contactNumber.trim() || undefined,
      email: value.email.trim() || undefined,
      address: value.address.trim() || undefined,
      city: value.city.trim() || undefined,
      zipCode: value.zipCode.trim() || undefined,
      emergencyContactName: value.emergencyContactName.trim() || undefined,
      emergencyContactRelationship: value.emergencyContactRelationship.trim() || undefined,
      emergencyContactNumber: value.emergencyContactNumber.trim() || undefined,
      hmoProvider: value.hmoProvider.trim() || undefined,
      hmoCardNumber: value.hmoCardNumber.trim() || undefined,
      philHealthNumber: value.philHealthNumber.trim() || undefined
    };

    this.savingProfile = true;
    this.apiService
      .put<any>('patients/me', payload)
      .pipe(
        catchError((error: unknown) => {
          void this.presentToast(extractApiErrorMessage(error, 'Failed to update profile.'), 'danger');
          return of(null);
        }),
        finalize(() => {
          this.savingProfile = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((updated) => {
        if (!updated) {
          return;
        }

        this.currentPatient = updated;
        this.patchFromPatient(updated);
        if (this.currentUser) {
          this.authState.setUser({
            ...this.currentUser,
            fullName: buildFullName(updated.firstName, updated.middleName, updated.lastName),
            email: updated.email ?? this.currentUser.email
          });
        }
        void this.presentToast('Profile updated successfully.', 'success');
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
        catchError((err: unknown) => {
          const msg = extractApiErrorMessage(err, 'Failed to update password. Please try again.');
          void this.presentToast(msg, 'danger');
          return of();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(async () => {
        this.passwordForm.reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        this.passwordStrength = 0;
        await this.presentToast('Password updated successfully.', 'success');
      });
  }

  submitConsent(): void {
    if (!this.currentPatient || this.hasConsented || !this.consentAcknowledged || this.consentSubmitting) {
      return;
    }

    this.consentSubmitting = true;
    this.apiService
      .post<any>('patients/me/consent', { consentVersion: this.consentVersion })
      .pipe(
        catchError((error: unknown) => {
          void this.presentToast(extractApiErrorMessage(error, 'Failed to submit consent.'), 'danger');
          return of(null);
        }),
        finalize(() => {
          this.consentSubmitting = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((updated) => {
        if (!updated) {
          return;
        }

        this.currentPatient = updated;
        this.patchFromPatient(updated);
        this.consentAcknowledged = false;
        void this.presentToast('Consent submitted successfully.', 'success');
      });
  }

  private loadProfile(): void {
    this.isLoadingProfile = true;
    this.loadError = null;

    this.apiService
      .get<any>('patients/me')
      .pipe(
        catchError((error: unknown) => {
          this.loadError = extractApiErrorMessage(error, 'The patient profile could not be loaded.');
          void this.presentToast(this.loadError, 'danger');
          return of(null);
        }),
        finalize(() => {
          this.isLoadingProfile = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((patient) => {
        if (!patient) {
          return;
        }

        this.currentPatient = patient;
        this.patchFromPatient(patient);
        this.consentAcknowledged = false;
      });
  }

  private patchFromUser(user: AuthUser): void {
    const nameParts = splitName(user.fullName);
    this.profileForm.patchValue({
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      email: user.email
    });
  }

  private patchFromPatient(patient: Patient): void {
    const fallback = this.currentUser ? splitName(this.currentUser.fullName) : { firstName: '', lastName: '' };
    this.profileForm.patchValue({
      firstName: patient.firstName || fallback.firstName,
      middleName: patient.middleName ?? '',
      lastName: patient.lastName || fallback.lastName,
      dateOfBirth: patient.dateOfBirth,
      sex: patient.sex,
      civilStatus: patient.civilStatus ?? '',
      bloodType: patient.bloodType ?? '',
      contactNumber: patient.contactNumber ?? '',
      email: patient.email ?? this.currentUser?.email ?? '',
      address: patient.address ?? '',
      city: patient.city ?? '',
      zipCode: patient.zipCode ?? '',
      emergencyContactName: patient.emergencyContactName ?? '',
      emergencyContactRelationship: patient.emergencyContactRelationship ?? '',
      emergencyContactNumber: patient.emergencyContactNumber ?? '',
      hmoProvider: patient.hmoProvider ?? '',
      hmoCardNumber: patient.hmoCardNumber ?? '',
      philHealthNumber: patient.philHealthNumber ?? ''
    });
  }

  onConsentToggle(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.consentAcknowledged = Boolean(target?.checked);
  }

  private async presentToast(message: string, color: 'danger' | 'success' = 'danger'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1800,
      color,
      position: 'top'
    });
    await toast.present();
  }
}

function splitName(fullName: string): NameParts {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
}

function buildFullName(firstName: string, middleName: string | undefined, lastName: string): string {
  return [firstName, middleName ?? '', lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ');
}

function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const body = (error as { error?: unknown }).error;
    const message = extractFirstMessage(body);
    if (message) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

function extractFirstMessage(body: unknown): string | null {
  if (typeof body === 'string' && body.trim()) {
    return body.trim();
  }

  if (typeof body !== 'object' || body === null) {
    return null;
  }

  const record = body as Record<string, unknown>;
  for (const key of ['message', 'detail', 'error', 'title']) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  const errors = record['errors'];
  if (Array.isArray(errors)) {
    for (const entry of errors) {
      const nested = extractFirstMessage(entry);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
}

import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ToastController, IonIcon, IonNote, IonProgressBar, IonSpinner } from '@ionic/angular/standalone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, map, of } from 'rxjs';
import { Doctor } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { passwordStrengthValidator, getPasswordStrength } from '../../../shared/validators/password-strength.validator';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
interface SummaryItem {
  label: string;
  value: string;
}

@Component({
  standalone: true,
  selector: 'app-doctor-profile-page',
  imports: [
    NgFor,
    NgIf,
    NgClass,
    ReactiveFormsModule,
    RouterLink,
    IonIcon,
    IonNote,
    IonProgressBar,
    IonSpinner,
    PageHeaderComponent,
    EmptyStateComponent,
    StatusBadgeComponent
  ],
  templateUrl: './doctor-profile.page.html',
  styleUrl: './doctor-profile.page.scss'
})
export class DoctorProfilePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly toastController = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);

  isLoading = true;
  isSaving = false;
  loadError: string | null = null;
  doctor: Doctor | null = null;
  photoPreviewUrl: string | null = null;

  strengthIndexes = [0, 1, 2, 3];
  passwordStrength: 0 | 1 | 2 | 3 | 4 = 0;
  changingPassword = false;

  profileForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    specialization: ['', Validators.required],
    bio: [''],
    consultationFee: [0, [Validators.required, Validators.min(0)]],
    licenseNumber: [''],
    ptrNumber: [''],
    s2Number: ['']
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
    this.loadProfile();

    this.passwordForm.get('newPassword')?.valueChanges.subscribe((value) => {
      this.passwordStrength = getPasswordStrength(String(value ?? ''));
    });
  }

  get doctorInitials(): string {
    const value = this.profileForm.get('fullName')?.value?.trim() || this.doctor?.fullName || '';
    const initials = value
      .split(/\s+/)
      .filter(Boolean)
      .map((name: string) => name[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
    return initials || 'DR';
  }

  get bioLength(): number {
    return this.profileForm.get('bio')?.value?.length ?? 0;
  }

  get profileIsComplete(): boolean {
    const f = this.profileForm.value;
    return !!(f.fullName?.trim() && f.specialization?.trim() && f.bio?.trim() && f.consultationFee !== null && f.licenseNumber?.trim());
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

  get completenessPercent(): number {
    const fields = ['fullName', 'specialization', 'bio', 'consultationFee', 'licenseNumber', 'ptrNumber'];
    const filled = fields.filter((field) => {
      const raw = this.profileForm.get(field)?.value;
      return raw !== null && raw !== undefined && String(raw).trim() !== '';
    }).length;
    return Math.round((filled / fields.length) * 100);
  }

  get profileSummaryItems(): SummaryItem[] {
    if (!this.doctor) {
      return [];
    }

    return [
      { label: 'Consultation Fee', value: `PHP ${this.doctor.consultationFee.toLocaleString('en-PH')}` },
      { label: 'License Number', value: this.doctor.licenseNumber || 'N/A' },
      { label: 'PTR Number', value: this.doctor.ptrNumber || 'N/A' },
      { label: 'S2 Number', value: this.doctor.s2Number || 'N/A' }
    ];
  }

  get scheduleSummaryItems(): SummaryItem[] {
    if (!this.doctor) {
      return [];
    }

    return [
      { label: 'Slot Duration', value: `${this.doctor.slotDurationMinutes} minutes` },
      {
        label: 'Slot Capacity',
        value: `${this.doctor.slotCapacity} ${this.doctor.slotCapacity === 1 ? 'slot' : 'slots'}`
      },
      {
        label: 'Daily Patient Limit',
        value:
          this.doctor.dailyPatientLimit === null
            ? 'No limit'
            : `${this.doctor.dailyPatientLimit} ${this.doctor.dailyPatientLimit === 1 ? 'patient' : 'patients'}`
      }
    ];
  }

  reload(): void {
    this.loadProfile();
  }

  onPhotoUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  save(): void {
    if (!this.doctor) {
      return;
    }

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const values = this.profileForm.getRawValue();
    if (this.doctor.slotDurationMinutes <= 0 || this.doctor.slotCapacity <= 0) {
      void this.presentToast('Slot duration and slot capacity must be greater than zero.');
      return;
    }

    const payload = {
      fullName: values.fullName.trim(),
      specialization: values.specialization.trim(),
      bio: values.bio.trim() || this.doctor.bio || '',
      licenseNumber: values.licenseNumber.trim() || this.doctor.licenseNumber || '',
      ptrNumber: values.ptrNumber.trim() || this.doctor.ptrNumber || '',
      s2Number: values.s2Number.trim() || this.doctor.s2Number || '',
      consultationFee: values.consultationFee,
      slotDurationMinutes: this.doctor.slotDurationMinutes,
      slotCapacity: this.doctor.slotCapacity,
      dailyPatientLimit: this.doctor.dailyPatientLimit ?? null,
      status: this.doctor.status
    };

    this.isSaving = true;

    this.apiService
      .put<any>('doctors/me', payload)
      .pipe(
        map((data) => mapDoctorRow(data as Record<string, unknown>)),
        catchError((error: unknown) => {
          void this.presentToast(extractApiErrorMessage(error, 'Failed to update profile.'));
          return of(null);
        }),
        finalize(() => {
          this.isSaving = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((updated) => {
        if (!updated) {
          return;
        }

        this.doctor = { ...this.doctor, ...updated };
        this.patchForm(this.doctor);
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
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.passwordForm.reset({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          this.passwordStrength = 0;
          void this.presentToast('Password updated successfully.', 'success');
        },
        error: (error: unknown) => {
          void this.presentToast(extractApiErrorMessage(error, 'Failed to update password. Please try again.'));
        }
      });
  }

  private loadProfile(): void {
    this.isLoading = true;
    this.loadError = null;
    this.doctor = null;

    this.apiService
      .get<any>('doctors/me')
      .pipe(
        map((data) => {
          if (!data) {
            throw new Error('Doctor profile not found.');
          }
          return mapDoctorRow(data as Record<string, unknown>);
        }),
        catchError((error: unknown) => {
          this.loadError = extractApiErrorMessage(error, 'The doctor profile could not be loaded.');
          void this.presentToast(this.loadError);
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((doctor) => {
        if (!doctor) {
          return;
        }

        this.doctor = { ...doctor };
        this.patchForm(this.doctor);
      });
  }

  private patchForm(doctor: Doctor): void {
    this.profileForm.patchValue({
      fullName: doctor.fullName,
      specialization: doctor.specialization,
      bio: doctor.bio ?? '',
      consultationFee: doctor.consultationFee,
      licenseNumber: doctor.licenseNumber ?? '',
      ptrNumber: doctor.ptrNumber ?? '',
      s2Number: doctor.s2Number ?? ''
    });
  }

  private async presentToast(message: string, color: 'danger' | 'success' = 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1800,
      color,
      position: 'top'
    });
    await toast.present();
  }
}

function mapDoctorRow(row: Record<string, unknown>): Doctor {
  return {
    id: resolveStr(row, 'id') ?? '',
    userId: resolveStr(row, 'userId') ?? '',
    fullName: resolveStr(row, 'fullName') ?? 'Doctor',
    specialization: resolveStr(row, 'specialization') ?? '',
    bio: resolveStr(row, 'bio'),
    profilePhotoUrl: resolveStr(row, 'profilePhotoUrl') ?? resolveStr(row, 'profile_photo_url'),
    licenseNumber: resolveStr(row, 'licenseNumber') ?? '',
    ptrNumber: resolveStr(row, 'ptrNumber') ?? '',
    s2Number: resolveStr(row, 's2Number') ?? '',
    consultationFee: resolveNum(row, 'consultationFee') ?? 0,
    slotDurationMinutes: resolveNum(row, 'slotDurationMinutes') ?? 30,
    slotCapacity: resolveNum(row, 'slotCapacity') ?? 1,
    dailyPatientLimit: resolveNum(row, 'dailyPatientLimit') ?? null,
    status: (resolveStr(row, 'status') as Doctor['status']) ?? 'Active',
    averageRating: resolveNum(row, 'averageRating') ?? undefined,
    reviewCount: resolveNum(row, 'reviewCount') ?? undefined
  };
}

function resolveStr(row: Record<string, unknown>, key: string): string | undefined {
  const snake = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
  const val = row[key] ?? row[snake];
  if (typeof val !== 'string') return undefined;
  const trimmed = val.trim();
  return trimmed || undefined;
}

function resolveNum(row: Record<string, unknown>, key: string): number | null {
  const snake = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
  const val = row[key] ?? row[snake];
  if (val === null || val === undefined) return null;
  if (typeof val === 'number' && isFinite(val)) return val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    if (isFinite(parsed)) return parsed;
  }
  return null;
}

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('newPassword')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw === cpw ? null : { passwordMismatch: true };
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

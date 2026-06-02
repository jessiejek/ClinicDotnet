import { NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
import { catchError, finalize, forkJoin, map, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Doctor, DoctorSchedule } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-admin-doctors-page',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    IonIcon,
    IonSpinner,
    AvatarComponent,
    ConfirmModalComponent,
    EmptyStateComponent,
    StatusBadgeComponent
  ],
  templateUrl: './doctors.page.html',
  styleUrl: './doctors.page.scss'
})
export class DoctorsPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);

  doctors: Doctor[] = [];
  schedulesByDoctorId = new Map<string, DoctorSchedule[]>();
  busyDoctorIds = new Set<string>();
  isLoading = true;
  deleteOpen = false;
  pendingDeactivateDoctorId: string | null = null;

  constructor() {
    addIcons({ 'edit-outline': createOutline, trashOutline });
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  addDoctor(): void {
    void this.router.navigate(['/admin/doctors/new']);
  }

  editDoctor(id: string): void {
    void this.router.navigate(['/admin/doctors', id, 'edit']);
  }

  askDeactivate(id: string, event: Event): void {
    event.stopPropagation();
    if (this.isBusy(id)) {
      return;
    }
    this.pendingDeactivateDoctorId = id;
    this.deleteOpen = true;
  }

  cancelDeactivate(): void {
    this.deleteOpen = false;
    this.pendingDeactivateDoctorId = null;
  }

  confirmDeactivate(): void {
    const doctorId = this.pendingDeactivateDoctorId;
    if (!doctorId || this.isBusy(doctorId)) {
      this.cancelDeactivate();
      return;
    }

    this.deleteOpen = false;
    this.busyDoctorIds.add(doctorId);
    this.apiService
      .put(`doctors/${doctorId}`, { status: 'Inactive' })
      .pipe(
        finalize(() => {
          this.busyDoctorIds.delete(doctorId);
          this.pendingDeactivateDoctorId = null;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          void this.presentToast('Doctor deactivated successfully.');
          this.loadDoctors();
        },
        error: (error: unknown) => {
          void this.presentToast(extractApiErrorMessage(error, 'Failed to deactivate doctor.'));
        }
      });
  }

  workingDays(doctorId: string): string {
    const days = (this.schedulesByDoctorId.get(doctorId) ?? [])
      .map((schedule) => schedule.dayOfWeek.slice(0, 3))
      .join(', ');
    return days || 'N/A';
  }

  isBusy(doctorId: string): boolean {
    return this.busyDoctorIds.has(doctorId);
  }

  private loadDoctors(): void {
    this.isLoading = true;

    this.apiService
      .get<any[]>('doctors/admin')
      .pipe(
        map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDoctorSummary)),
        catchError((error: unknown) => {
          void this.presentToast(extractApiErrorMessage(error, 'Failed to load doctors.'));
          return of([] as Doctor[]);
        }),
        switchMap((doctors) => {
          this.doctors = doctors;

          if (!doctors.length) {
            return of([] as Array<{ doctorId: string; schedules: DoctorSchedule[] }>);
          }

          return forkJoin(
            doctors.map((doctor) =>
              this.apiService.get<any[]>('doctors/' + doctor.id + '/schedule').pipe(
                map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapScheduleRow)),
                catchError((error: unknown) => {
                  void this.presentToast(
                    extractApiErrorMessage(error, `Failed to load schedule for ${doctor.fullName}.`)
                  );
                  return of([] as DoctorSchedule[]);
                }),
                map((schedules) => ({ doctorId: doctor.id, schedules }))
              )
            )
          );
        }),
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((scheduleEntries) => {
        this.schedulesByDoctorId = new Map(scheduleEntries.map((entry) => [entry.doctorId, entry.schedules]));
      });
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2400,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }
}

function mapDoctorSummary(dto: Record<string, unknown>): Doctor {
  return {
    id: resolveStr(dto, 'id') || '',
    userId: resolveStr(dto, 'userId') || resolveStr(dto, 'id') || '',
    fullName: resolveStr(dto, 'fullName') || 'Doctor',
    specialization: resolveStr(dto, 'specialization') || '',
    bio: resolveStr(dto, 'bio'),
    profilePhotoUrl: resolveStr(dto, 'profilePhotoUrl'),
    licenseNumber: resolveStr(dto, 'licenseNumber'),
    ptrNumber: resolveStr(dto, 'ptrNumber'),
    s2Number: resolveStr(dto, 's2Number'),
    consultationFee: resolveNum(dto, 'consultationFee') ?? 0,
    slotDurationMinutes: resolveNum(dto, 'slotDurationMinutes') ?? 30,
    slotCapacity: resolveNum(dto, 'slotCapacity') ?? 1,
    dailyPatientLimit: resolveNum(dto, 'dailyPatientLimit') ?? null,
    status: ['Active', 'Inactive', 'OnLeave'].includes(resolveStr(dto, 'status') || 'Active')
      ? (resolveStr(dto, 'status') as Doctor['status'])
      : 'Active',
    averageRating: resolveNum(dto, 'averageRating') ?? undefined,
    reviewCount: resolveNum(dto, 'reviewCount') ?? undefined
  };
}

function mapScheduleRow(dto: Record<string, unknown>): DoctorSchedule {
  return {
    id: resolveStr(dto, 'id') || '',
    doctorId: resolveStr(dto, 'doctorId') || '',
    dayOfWeek: (resolveStr(dto, 'dayOfWeek') || 'Monday') as DoctorSchedule['dayOfWeek'],
    startTime: normalizeTime(resolveStr(dto, 'startTime')),
    endTime: normalizeTime(resolveStr(dto, 'endTime'))
  };
}

function resolveStr(row: Record<string, unknown>, key: string): string | undefined {
  const snake = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
  const val = row[key] ?? row[snake];
  if (typeof val !== 'string') return undefined;
  const t = val.trim();
  return t || undefined;
}

function resolveNum(row: Record<string, unknown>, key: string): number | undefined {
  const snake = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
  const val = row[key] ?? row[snake];
  if (val === null || val === undefined) return undefined;
  if (typeof val === 'number' && isFinite(val)) return val;
  if (typeof val === 'string') {
    const p = parseFloat(val);
    if (isFinite(p)) return p;
  }
  return undefined;
}

function normalizeTime(value: string | undefined): string {
  const t = (value || '').trim();
  return t.length >= 5 ? t.slice(0, 5) : t || '00:00';
}

function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const body = (error as { error?: unknown }).error;
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (typeof body === 'object' && body !== null && 'message' in body) {
      const message = (body as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

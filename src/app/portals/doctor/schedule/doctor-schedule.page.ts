import { AsyncPipe, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { EMPTY, forkJoin } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../core/services/api.service';
import {
  DoctorBlockedDate,
  DayOfWeek,
  DoctorScheduleInput,
  TimeSlot
} from '../../../core/models';
import {
  DoctorScheduleEditorComponent,
  DoctorScheduleSavePayload,
  DoctorWeeklyScheduleDraft
} from '../components/doctor-schedule-editor/doctor-schedule-editor.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

const DAY_NAMES: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

@Component({
  standalone: true,
  selector: 'app-doctor-schedule-page',
  imports: [AsyncPipe, NgIf, DoctorScheduleEditorComponent, SkeletonComponent],
  template: `
    <section class="schedule-page-head">
      <div class="schedule-page-head__copy">
        <div class="schedule-page-head__title-row">
          <h1>Schedule</h1>
          <span class="schedule-page-head__status schedule-page-head__status--dirty" *ngIf="isDirty">
            <span aria-hidden="true">●</span>
            Unsaved changes
          </span>
          <span class="schedule-page-head__status schedule-page-head__status--saved" *ngIf="isSaved">
            <span aria-hidden="true">✓</span>
            Saved
          </span>
        </div>
        <p>Weekly availability and blocked dates</p>
      </div>
    </section>

    <app-skeleton *ngIf="isLoading" variant="card" [count]="2"></app-skeleton>

    <div *ngIf="error" class="er">
      <p>Unable to load schedule. Please try again.</p>
      <button type="button" class="btn-primary" (click)="loadData()">Retry</button>
    </div>

    <ng-container *ngIf="doctorId && !isLoading && !error">
      <app-doctor-schedule-editor
        [schedules]="draftSchedules"
        [blockedDates]="blockedDates"
        [previewSlots]="previewSlots"
        [previewDate]="previewDate"
        [isSaving]="isSaving"
        [dailyPatientLimit]="dailyPatientLimit"
        [previewDayIsActive]="previewDayIsActive"
        [previewDayHasSlots]="previewDayHasSlots"
        [previewDayIsBlocked]="previewDayIsBlocked"
        (schedulesSaved)="saveSchedules($event)"
        (blockedDateAdded)="addBlockedDate($event.blockedDate, $event.reason)"
        (blockedDateRemoved)="removeBlockedDate($event)"
        (previewDateChanged)="updatePreviewDate($event)"
        (dirtyChanged)="markDirty()"
      ></app-doctor-schedule-editor>
    </ng-container>
  `,
  styleUrl: './doctor-schedule.page.scss'
})
export class DoctorSchedulePage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly toastController = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);

  doctorId = '';
  currentDoctor: { slotDurationMinutes: number; slotCapacity: number; dailyPatientLimit: number | null } | null = null;
  isLoading = true;
  error = false;
  isSaving = false;
  isDirty = false;
  isSaved = false;
  previewDate = new Date().toISOString().slice(0, 10);
  previewSlots: TimeSlot[] = [];
  draftSchedules: DoctorWeeklyScheduleDraft[] = [];
  blockedDates: DoctorBlockedDate[] = [];
  dailyPatientLimit: number | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = false;
    this.apiService.get<any>('doctors/me').pipe(
      map((data) => {
        if (!data) {
          throw new Error('Doctor profile not found.');
        }
        return mapDoctorRow(data as Record<string, unknown>);
      }),
      catchError(() => {
        this.isLoading = false;
        this.error = true;
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((doctor) => {
      if (!doctor || !doctor.id) {
        this.isLoading = false;
        this.error = true;
        return;
      }
      this.doctorId = doctor.id;
      this.currentDoctor = {
        slotDurationMinutes: doctor.slotDurationMinutes,
        slotCapacity: doctor.slotCapacity,
        dailyPatientLimit: doctor.dailyPatientLimit ?? null
      };
      this.dailyPatientLimit = this.currentDoctor.dailyPatientLimit;
      forkJoin([
        this.apiService.get<any[]>('doctors/' + doctor.id + '/schedule').pipe(
          map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDoctorScheduleRow))
        ),
        this.apiService.get<any[]>('doctors/' + doctor.id + '/blocked-dates').pipe(
          map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDoctorBlockedDateRow))
        )
      ]).pipe(
        catchError(() => {
          this.isLoading = false;
          this.error = true;
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(([schedules, blockedDates]) => {
        this.draftSchedules = this.buildDraftSchedules(schedules, doctor.slotDurationMinutes, doctor.slotCapacity);
        this.blockedDates = blockedDates;
        this.isLoading = false;
        this.refreshPreview();
      });
    });
  }

  saveSchedules(payload: DoctorScheduleSavePayload): void {
    this.isDirty = true;
    this.isSaved = false;
    const drafts = payload.schedules.map((d) => ({ ...d }));
    this.draftSchedules = drafts;
    this.dailyPatientLimit = payload.dailyPatientLimit;
    const activeSchedules = drafts
      .filter((d) => d.isActive)
      .map((d) => ({
        dayOfWeek: d.dayOfWeek,
        startTime: this.toBackendTime(d.startTime),
        endTime: this.toBackendTime(d.endTime)
      } as DoctorScheduleInput));
    const scheduleSettings = this.draftSchedules.find((item) => item.isActive) ?? this.draftSchedules[0] ?? {
      slotDurationMinutes: this.currentDoctor?.slotDurationMinutes ?? 30,
      slotCapacity: this.currentDoctor?.slotCapacity ?? 1
    };

    this.isSaving = true;
    this.apiService.put<any[]>('doctors/' + this.doctorId + '/schedule', {
      schedules: activeSchedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime
      }))
    }).pipe(
      switchMap(() =>
        this.apiService.put<any>('doctors/' + this.doctorId, {
          slotDurationMinutes: scheduleSettings.slotDurationMinutes,
          slotCapacity: scheduleSettings.slotCapacity,
          dailyPatientLimit: this.dailyPatientLimit
        }).pipe(
          map((data) => mapDoctorRow((data ?? {}) as Record<string, unknown>))
        )
      ),
      finalize(() => (this.isSaving = false)),
      catchError(() => {
        void this.presentToast('Failed to save schedule.', 'danger');
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.refreshPreview();
      this.onSaveSuccess();
      void this.presentToast('Schedule saved successfully.', 'success');
    });
  }

  addBlockedDate(blockedDate: string, reason: string): void {
    if (!this.doctorId) {
      return;
    }
    this.isSaving = true;
    this.apiService.post<any>('doctors/' + this.doctorId + '/blocked-dates', {
      date: blockedDate,
      reason: reason || null
    }).pipe(
      map((data) => mapDoctorBlockedDateRow((data ?? {}) as Record<string, unknown>)),
      finalize(() => (this.isSaving = false)),
      catchError(() => {
        void this.presentToast('Failed to add blocked date.', 'danger');
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((record) => {
      this.blockedDates = [...this.blockedDates, record];
      this.refreshPreview();
      void this.presentToast('Blocked date added.', 'success');
    });
  }

  removeBlockedDate(id: string): void {
    if (!this.doctorId) {
      return;
    }
    this.isSaving = true;
    this.apiService.delete('doctors/' + this.doctorId + '/blocked-dates/' + id).pipe(
      map(() => void 0),
      finalize(() => (this.isSaving = false)),
      catchError(() => {
        void this.presentToast('Failed to remove blocked date.', 'danger');
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.blockedDates = this.blockedDates.filter((item) => item.id !== id);
      this.refreshPreview();
      void this.presentToast('Blocked date removed.', 'success');
    });
  }

  updatePreviewDate(date: string): void {
    this.previewDate = date;
    this.refreshPreview();
  }

  markDirty(): void {
    this.isDirty = true;
    this.isSaved = false;
  }

  get previewDayIsActive(): boolean {
    const day = this.getPreviewScheduleDay();
    return day?.isActive ?? false;
  }

  get previewDayIsBlocked(): boolean {
    return !!this.previewDate && this.blockedDates.some((item) => item.blockedDate === this.previewDate);
  }

  get previewDayHasSlots(): boolean {
    return this.previewSlots.length > 0;
  }

  private buildDraftSchedules(
    schedules: { dayOfWeek: DayOfWeek; startTime: string; endTime: string }[],
    slotDurationMinutes = 30,
    slotCapacity = 1
  ): DoctorWeeklyScheduleDraft[] {
    return DAY_NAMES.map((dayOfWeek) => {
      const schedule = schedules.find((item) => item.dayOfWeek === dayOfWeek);
      return {
        dayOfWeek,
        startTime: schedule?.startTime ? this.toDisplayTime(schedule.startTime) : '08:00',
        endTime: schedule?.endTime ? this.toDisplayTime(schedule.endTime) : '17:00',
        isActive: !!schedule,
        slotDurationMinutes,
        slotCapacity
      };
    });
  }

  /** Convert HH:mm:ss backend format to HH:mm for the time input. */
  private toDisplayTime(time: string): string {
    return time.length >= 5 ? time.substring(0, 5) : time;
  }

  /** Ensure time is HH:mm format (strip seconds if present). */
  private toBackendTime(time: string): string {
    const trimmed = time.trim();
    // Already HH:mm
    if (trimmed.length === 5) {
      return trimmed;
    }
    // Strip :ss from HH:mm:ss
    if (trimmed.length >= 5) {
      return trimmed.substring(0, 5);
    }
    return trimmed;
  }

  private refreshPreview(): void {
    this.previewSlots = this.generatePreviewSlots(this.previewDate);
  }

  private onSaveSuccess(): void {
    this.isDirty = false;
    this.isSaved = true;
    window.setTimeout(() => {
      this.isSaved = false;
    }, 3000);
  }

  private generatePreviewSlots(date: string): TimeSlot[] {
    if (!this.doctorId || !date) {
      return [];
    }

    const previewDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(previewDate.getTime())) {
      return [];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (previewDate < today) {
      return [];
    }

    if (this.blockedDates.some((blockedDate) => blockedDate.blockedDate === date)) {
      return [];
    }

    const schedule = this.getPreviewScheduleDay();
    if (!schedule) {
      return [];
    }

    const startMinutes = this.minutesFromTime(schedule.startTime);
    const endMinutes = this.minutesFromTime(schedule.endTime);
    const duration = Math.max(5, schedule.slotDurationMinutes);
    const slots: TimeSlot[] = [];

    for (let current = startMinutes; current + duration <= endMinutes; current += duration) {
      const time = this.timeFromMinutes(current);
      const endTime = this.timeFromMinutes(current + duration);
      slots.push({
        time,
        endTime,
        status: 'available'
      });
    }

    return slots;
  }

  private getPreviewScheduleDay(): DoctorWeeklyScheduleDraft | undefined {
    if (!this.previewDate) {
      return undefined;
    }

    const previewDate = new Date(`${this.previewDate}T00:00:00`);
    if (Number.isNaN(previewDate.getTime())) {
      return undefined;
    }

    const dayName = DAY_NAMES[previewDate.getDay()];
    return this.draftSchedules.find((item) => item.dayOfWeek === dayName);
  }

  private minutesFromTime(time: string): number {
    const [hours, minutes] = time.split(':').map((value) => Number(value));
    return hours * 60 + minutes;
  }

  private timeFromMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  private async presentToast(message: string, color: string = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1800,
      color,
      position: 'top'
    });
    await toast.present();
  }
}

function mapDoctorRow(row: Record<string, unknown>): { slotDurationMinutes: number; slotCapacity: number; dailyPatientLimit: number | null; id: string } & Record<string, unknown> {
  return {
    id: resolveStr(row, 'id') ?? '',
    slotDurationMinutes: resolveNum(row, 'slotDurationMinutes') ?? 30,
    slotCapacity: resolveNum(row, 'slotCapacity') ?? 1,
    dailyPatientLimit: resolveNum(row, 'dailyPatientLimit') ?? null,
    fullName: resolveStr(row, 'fullName') ?? 'Doctor',
    specialization: resolveStr(row, 'specialization') ?? '',
    bio: resolveStr(row, 'bio'),
    licenseNumber: resolveStr(row, 'licenseNumber') ?? '',
    ptrNumber: resolveStr(row, 'ptrNumber') ?? '',
    s2Number: resolveStr(row, 's2Number') ?? '',
    consultationFee: resolveNum(row, 'consultationFee') ?? 0,
    status: resolveStr(row, 'status') ?? 'Active'
  };
}

function mapDoctorScheduleRow(row: Record<string, unknown>): { dayOfWeek: DayOfWeek; startTime: string; endTime: string } {
  return {
    dayOfWeek: normalizeDayOfWeek(resolveStr(row, 'dayOfWeek')),
    startTime: normalizeTime(resolveStr(row, 'startTime')),
    endTime: normalizeTime(resolveStr(row, 'endTime'))
  };
}

function mapDoctorBlockedDateRow(row: Record<string, unknown>): DoctorBlockedDate {
  return {
    id: resolveStr(row, 'id') ?? '',
    doctorId: resolveStr(row, 'doctorId') ?? '',
    blockedDate: resolveStr(row, 'blockedDate') ?? resolveStr(row, 'date') ?? '',
    reason: resolveStr(row, 'reason')
  };
}

function normalizeDayOfWeek(value: string | undefined): DayOfWeek {
  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  if (!value) return 'Monday';
  const normalized = value.trim().toLowerCase();
  return days.find((d) => d.toLowerCase() === normalized) ?? 'Monday';
}

function normalizeTime(value: string | undefined): string {
  if (!value) return '00:00';
  return value.length >= 5 ? value.slice(0, 5) : value;
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

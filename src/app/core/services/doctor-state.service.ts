import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Doctor, DoctorDayStatus, DoctorStatus } from '../models';
import { ApiService } from './api.service';

export interface DoctorInfo {
  id: string;
  userId: string;
  name: string;
  specialty: string;
}

export interface DoctorDetailedAvailability {
  date: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  bufferMinutes: number;
  isAvailable: boolean;
  reason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorStateService {
  private readonly api = inject(ApiService);

  private readonly doctorsSubject = new BehaviorSubject<Doctor[]>([]);
  private readonly todayStatusSubject = new BehaviorSubject<DoctorDayStatus | null>(null);
  private readonly dayStatusesSubject = new BehaviorSubject<Record<string, DoctorDayStatus>>({});
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  readonly doctors$ = this.doctorsSubject.asObservable();
  readonly todayStatus$ = this.todayStatusSubject.asObservable();
  readonly dayStatuses$ = this.dayStatusesSubject.asObservable();
  readonly isLoading$ = this.loadingSubject.asObservable();

  constructor() {
    this.loadDoctorsFromApi();
  }

  /** @deprecated Use doctors$ directly. */
  getDoctors(): Observable<Doctor[]> {
    return this.doctors$;
  }

  /** @deprecated Use loadDoctorsFromApi() directly. */
  refresh(): void {
    this.loadDoctorsFromApi();
  }

  /** @deprecated Use todayStatus$ + loadTodayDoctorStatus(). */
  getDoctorDayStatus(doctorId: string): Observable<DoctorDayStatus | null> {
    this.loadTodayDoctorStatus(doctorId);
    return this.todayStatus$;
  }

  /** @deprecated Use updateDayStatus(). */
  updateDayStatusViaApi(doctorUserId: string, status: string, runningLateMinutes?: number): Observable<DoctorDayStatus | null> {
    this.updateDayStatus(doctorUserId, { status: status as any, runningLateMinutes } as any);
    return this.todayStatus$;
  }

  /** Load all doctors (for staff pages). */
  loadDoctorsFromApi(): void {
    this.loadingSubject.next(true);
    this.api.get<any[]>('doctors').subscribe({
      next: (data: any[]) => {
        try {
          const doctors: Doctor[] = (data ?? [])
            .map((row: any) => this.normalizeDoctor(row))
            .filter((d: Doctor | undefined): d is Doctor => !!d && !!d.id);
          this.doctorsSubject.next(doctors);
        } finally {
          this.loadingSubject.next(false);
        }
      },
      error: (err: any) => {
        console.warn('Failed to load doctors:', err);
        this.loadingSubject.next(false);
      }
    });
  }

  /** Load today's day status for a single doctor. */
  loadTodayDoctorStatus(doctorUserId: string): void {
    this.api.get<DoctorDayStatus>('doctor-day-status/' + doctorUserId).subscribe({
      next: (status: DoctorDayStatus | null) => {
        this.todayStatusSubject.next(status);
      },
      error: (err: any) => {
        console.warn('Failed to load today status:', err);
      }
    });
  }

  /** Update day status, then refresh local state. */
  updateDayStatus(doctorUserId: string, status: Partial<DoctorDayStatus>): void {
    this.api.post<DoctorDayStatus>('doctor-day-status/' + doctorUserId + '/status', status).subscribe({
      next: (updated: DoctorDayStatus) => {
        this.todayStatusSubject.next(updated);
      },
      error: (err: any) => {
        console.warn('Failed to update day status:', err);
      }
    });
  }

  private normalizeDoctor(row: any): Doctor | undefined {
    if (!row) return undefined;
    return {
      id: row.id ?? row.doctorId ?? '',
      userId: row.userId ?? row.user_id ?? '',
      fullName: row.name ?? row.fullName ?? row.full_name ?? row.doctorName ?? '',
      specialization: row.specialty ?? row.specialization ?? row.clinic ?? '',
      consultationFee: row.consultationFee ?? row.consultation_fee ?? row.fee ?? 0,
      slotDurationMinutes: row.slotDurationMinutes ?? row.slot_duration_minutes ?? 30,
      slotCapacity: row.slotCapacity ?? row.slot_capacity ?? 1,
      dailyPatientLimit: row.dailyPatientLimit ?? row.daily_patient_limit ?? null,
      status: (row.status ?? 'Active') as DoctorStatus,
      bio: row.bio ?? undefined,
      profilePhotoUrl: row.profilePhotoUrl ?? row.profile_photo_url ?? undefined,
      licenseNumber: row.licenseNumber ?? row.license_number ?? undefined,
      ptrNumber: row.ptrNumber ?? row.ptr_number ?? undefined,
      s2Number: row.s2Number ?? row.s2_number ?? undefined,
      averageRating: row.averageRating ?? row.average_rating ?? undefined,
      reviewCount: row.reviewCount ?? row.review_count ?? undefined,
      isActive: row.isActive ?? row.is_active ?? undefined,
      workingDays: row.workingDays ?? row.working_days ?? undefined,
    };
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Doctor, DoctorDayStatus, DoctorStatus } from '../models';

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
  private readonly doctorsSubject = new BehaviorSubject<Doctor[]>([]);
  private readonly todayStatusSubject = new BehaviorSubject<DoctorDayStatus | null>(null);
  private readonly dayStatusesSubject = new BehaviorSubject<Record<string, DoctorDayStatus>>({});
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  readonly doctors$ = this.doctorsSubject.asObservable();
  readonly todayStatus$ = this.todayStatusSubject.asObservable();
  readonly dayStatuses$ = this.dayStatusesSubject.asObservable();
  readonly isLoading$ = this.loadingSubject.asObservable();

  /** State helper for pages that want an observable of the doctor list. */
  getDoctors(): Observable<Doctor[]> {
    return this.doctors$;
  }

  /** State helper for pages that need to look up a doctor by user id. */
  getDoctorByUserId(userId: string): Observable<Doctor | undefined> {
    return this.doctors$.pipe(map((doctors) => doctors.find((doctor) => doctor.userId === userId)));
  }

  /** State helper for the current doctor's day status. */
  getDoctorDayStatus(doctorId: string): Observable<DoctorDayStatus | null> {
    void doctorId;
    return this.todayStatus$;
  }

  setDoctors(doctors: Doctor[]): void {
    this.doctorsSubject.next(doctors);
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  setTodayStatus(status: DoctorDayStatus | null): void {
    this.todayStatusSubject.next(status);
  }

  setDayStatuses(statuses: Record<string, DoctorDayStatus>): void {
    this.dayStatusesSubject.next(statuses);
  }

  mergeDayStatus(doctorId: string, status: DoctorDayStatus | null): void {
    if (!status) {
      const next = { ...this.dayStatusesSubject.value };
      delete next[doctorId];
      this.dayStatusesSubject.next(next);
      return;
    }

    this.dayStatusesSubject.next({
      ...this.dayStatusesSubject.value,
      [doctorId]: status
    });
  }

  normalizeDoctorRows(rows: any[] | null | undefined): Doctor[] {
    return (rows ?? [])
      .map((row: any) => this.normalizeDoctorRow(row))
      .filter((doctor: Doctor | undefined): doctor is Doctor => !!doctor && !!doctor.id);
  }

  normalizeDoctorRow(row: any): Doctor | undefined {
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

  normalizeDoctorDayStatusRow(row: Record<string, unknown>): DoctorDayStatus {
    return {
      id: this.readValue(row, 'id') ?? '',
      doctorId: this.readValue(row, 'doctorId') ?? '',
      date: this.readValue(row, 'date') ?? this.readValue(row, 'targetDate') ?? this.readValue(row, 'target_date') ?? '',
      status: (this.readValue(row, 'status') as DoctorDayStatus['status']) ?? 'Available',
      runningLateMinutes: this.readNumber(row, 'runningLateMinutes') ?? this.readNumber(row, 'running_late_minutes') ?? undefined
    };
  }

  private readValue(row: Record<string, unknown>, key: string): string | undefined {
    const snake = key.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase());
    const value = row[key] ?? row[snake];
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
  }

  private readNumber(row: Record<string, unknown>, key: string): number | undefined {
    const snake = key.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase());
    const value = row[key] ?? row[snake];
    return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
  }
}

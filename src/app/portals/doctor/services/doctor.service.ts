import { Injectable, inject } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  AvailabilityStatus, DayOfWeek, Doctor, DoctorBlockedDate, DoctorDayStatus,
  DoctorSchedule, DoctorScheduleInput, DoctorStatus
} from '../../../core/models';

export type DoctorDetail = Doctor;

export interface UpdateDoctorDto {
  fullName: string;
  specialization: string;
  bio: string;
  licenseNumber: string;
  ptrNumber: string;
  s2Number: string;
  consultationFee: number;
  slotDurationMinutes: number;
  slotCapacity: number;
  dailyPatientLimit: number | null;
  status: DoctorStatus;
}

export interface UpdateScheduleSettingsDto {
  slotDurationMinutes: number;
  slotCapacity: number;
  dailyPatientLimit: number | null;
}

export interface SetDayStatusDto {
  date: string;
  status: AvailabilityStatus;
  runningLateMinutes: number | null;
}

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly api = inject(ApiService);

  getMyProfile(): Observable<DoctorDetail> {
    return this.api.get<any>('doctors/me').pipe(
      map((data) => {
        if (!data) throw new Error('Doctor profile not found.');
        return mapDoctorRow(data as Record<string, unknown>);
      })
    );
  }

  updateMyProfile(dto: UpdateDoctorDto): Observable<DoctorDetail> {
    return this.api.put<any>('doctors/me', dto).pipe(
      map((data) => mapDoctorRow(data as Record<string, unknown>))
    );
  }

  getMySchedule(): Observable<DoctorSchedule[]> {
    return this.api.get<any>('doctors/me').pipe(
      map((profile) => (profile as Record<string, unknown>)['id'] as string),
      switchMap((doctorId) => this.api.get<any[]>('doctors/' + doctorId + '/schedule')),
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDoctorScheduleRow))
    );
  }

  getDayStatus(doctorId: string): Observable<DoctorDayStatus> {
    return this.api.get<any[]>('doctors/' + doctorId + '/day-status').pipe(
      map((data) => {
        const rows = (data ?? []) as Record<string, unknown>[];
        const today = new Date().toISOString().slice(0, 10);
        const match = rows.find((r) => (r['date'] ?? r['targetDate'] ?? r['target_date']) === today);
        return match
          ? mapDoctorDayStatusRow(match)
          : { id: '', doctorId, date: today, status: 'Available' as AvailabilityStatus };
      })
    );
  }

  setDayStatus(doctorId: string, dto: SetDayStatusDto): Observable<DoctorDayStatus> {
    return this.api.post<any>('doctors/' + doctorId + '/day-status', {
      date: dto.date,
      status: dto.status,
      runningLateMinutes: dto.runningLateMinutes,
    }).pipe(
      map((data) => mapDoctorDayStatusRow((data ?? {}) as Record<string, unknown>))
    );
  }

  getCurrentDoctor(userId: string): Observable<Doctor | undefined> {
    return this.api.get<any>('doctors/me').pipe(
      map((data) => data ? (mapDoctorRow(data as Record<string, unknown>) as Doctor) : undefined),
    );
  }

  getDoctorSchedules(doctorId: string): Observable<DoctorSchedule[]> {
    return this.api.get<any[]>('doctors/' + doctorId + '/schedule').pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDoctorScheduleRow))
    );
  }

  getDoctorBlockedDates(doctorId: string): Observable<DoctorBlockedDate[]> {
    return this.api.get<any[]>('doctors/' + doctorId + '/blocked-dates').pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDoctorBlockedDateRow))
    );
  }

  updateSchedule(doctorId: string, schedules: DoctorScheduleInput[]): Observable<DoctorSchedule[]> {
    return this.api.put<any[]>('doctors/' + doctorId + '/schedule', {
      schedules: schedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      }))
    }).pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDoctorScheduleRow))
    );
  }

  updateScheduleSettings(doctorId: string, dto: UpdateScheduleSettingsDto): Observable<DoctorDetail> {
    return this.api.put<any>('doctors/' + doctorId, {
      slotDurationMinutes: dto.slotDurationMinutes,
      slotCapacity: dto.slotCapacity,
      dailyPatientLimit: dto.dailyPatientLimit,
    }).pipe(
      map((data) => mapDoctorRow((data ?? {}) as Record<string, unknown>))
    );
  }

  createBlockedDate(doctorId: string, payload: { blockedDate: string; reason?: string | null }): Observable<DoctorBlockedDate> {
    return this.api.post<any>('doctors/' + doctorId + '/blocked-dates', {
      date: payload.blockedDate,
      reason: payload.reason ?? null,
    }).pipe(
      map((data) => mapDoctorBlockedDateRow((data ?? {}) as Record<string, unknown>))
    );
  }

  deleteBlockedDate(doctorId: string, blockedDateId: string): Observable<void> {
    return this.api.delete('doctors/' + doctorId + '/blocked-dates/' + blockedDateId).pipe(
      map(() => void 0)
    );
  }
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
    status: (resolveStr(row, 'status') as DoctorStatus) ?? 'Active',
    averageRating: resolveNum(row, 'averageRating') ?? undefined,
    reviewCount: resolveNum(row, 'reviewCount') ?? undefined,
  };
}

function mapDoctorScheduleRow(row: Record<string, unknown>): DoctorSchedule {
  return {
    id: resolveStr(row, 'id') ?? '',
    doctorId: resolveStr(row, 'doctorId') ?? '',
    dayOfWeek: normalizeDayOfWeek(resolveStr(row, 'dayOfWeek')),
    startTime: normalizeTime(resolveStr(row, 'startTime')),
    endTime: normalizeTime(resolveStr(row, 'endTime')),
  };
}

function mapDoctorBlockedDateRow(row: Record<string, unknown>): DoctorBlockedDate {
  return {
    id: resolveStr(row, 'id') ?? '',
    doctorId: resolveStr(row, 'doctorId') ?? '',
    blockedDate: resolveStr(row, 'blockedDate') ?? resolveStr(row, 'date') ?? '',
    reason: resolveStr(row, 'reason'),
  };
}

function mapDoctorDayStatusRow(row: Record<string, unknown>): DoctorDayStatus {
  return {
    id: resolveStr(row, 'id') ?? '',
    doctorId: resolveStr(row, 'doctorId') ?? '',
    date: resolveStr(row, 'date') ?? resolveStr(row, 'targetDate') ?? '',
    status: (resolveStr(row, 'status') as AvailabilityStatus) ?? 'Available',
    runningLateMinutes: resolveNum(row, 'runningLateMinutes') ?? undefined,
  };
}

function normalizeDayOfWeek(value: string | undefined): DayOfWeek {
  if (!value) return 'Monday';
  const v = value.trim().toLowerCase();
  return DAYS.find((d) => d.toLowerCase() === v) ?? 'Monday';
}

function normalizeTime(value: string | undefined): string {
  if (!value) return '00:00';
  return value.length >= 5 ? value.slice(0, 5) : value;
}

function resolveStr(row: Record<string, unknown>, key: string): string | undefined {
  const snake = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
  const val = row[key] ?? row[snake];
  if (typeof val !== 'string') return undefined;
  const t = val.trim();
  return t || undefined;
}

function resolveNum(row: Record<string, unknown>, key: string): number | null {
  const snake = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
  const val = row[key] ?? row[snake];
  if (val === null || val === undefined) return null;
  if (typeof val === 'number' && isFinite(val)) return val;
  if (typeof val === 'string') { const p = parseFloat(val); if (isFinite(p)) return p; }
  return null;
}

import { Injectable, inject } from '@angular/core';
import { Observable, catchError, from, of, shareReplay, throwError } from 'rxjs';
import {
  Announcement,
  ClinicSettings,
  DayOfWeek,
  Doctor,
  DoctorSchedule,
  DoctorStatus,
  Review,
  Service,
  ServiceCategory
} from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { ClinicSettingsService } from '../../../core/services/clinic-settings.service';

type NullableString = string | null | undefined;

export interface DoctorSummary extends Doctor {}

export type DoctorDetail = (Doctor & { services?: Service[] }) | undefined;

export interface AvailableSlot {
  slotStartTime: string;
  slotEndTime: string;
  isAvailable: boolean;
  bookedCount: number;
  capacity: number;
  time: string;
  endTime: string;
  IsAvailable: boolean;
}

@Injectable({ providedIn: 'root' })
export class PublicService {
  private readonly api = inject(ApiService);
  private readonly clinicSettingsService = inject(ClinicSettingsService);

  private doctorsCache$?: Observable<DoctorSummary[]>;
  private servicesCache$?: Observable<Service[]>;

  getDoctors(forceRefresh = false): Observable<DoctorSummary[]> {
    if (forceRefresh) this.doctorsCache$ = undefined;
    if (!this.doctorsCache$) {
      this.doctorsCache$ = from(this.fetchPublicDoctors()).pipe(
        catchError((error: unknown) => {
          this.doctorsCache$ = undefined;
          return throwError(() => normalizeError(error, 'Failed to load doctors.'));
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.doctorsCache$;
  }

  refreshDoctors(): Observable<DoctorSummary[]> { return this.getDoctors(true); }

  getDoctorById(id: string): Observable<DoctorDetail> {
    return this.refreshDoctorById(id).pipe(catchError(() => of(undefined)));
  }

  refreshDoctorById(id: string): Observable<DoctorDetail> {
    return from(this.fetchPublicDoctorById(id)).pipe(
      catchError((error: unknown) => throwError(() => normalizeError(error, 'Failed to load doctor.')))
    );
  }

  getServices(): Observable<Service[]> {
    if (!this.servicesCache$) {
      this.servicesCache$ = from(this.fetchPublicServices()).pipe(
        catchError((error: unknown) => {
          this.servicesCache$ = undefined;
          return throwError(() => normalizeError(error, 'Failed to load services.'));
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.servicesCache$;
  }

  getAvailableSlots(doctorId: string, date: string): Observable<AvailableSlot[]> {
    return from(this.fetchAvailableSlots(doctorId, date)).pipe(
      catchError((error: unknown) => throwError(() => normalizeError(error, 'Failed to load available slots.')))
    );
  }

  getAnnouncements(): Observable<Announcement[]> {
    return from(this.fetchActiveAnnouncements());
  }

  getClinicSettings(): Observable<ClinicSettings> {
    return this.clinicSettingsService.settings$;
  }

  getDoctorReviews(doctorId: string): Observable<Review[]> {
    return from(this.fetchDoctorReviews(doctorId));
  }

  getDoctorServices(doctorId: string): Observable<Service[]> {
    return from(this.fetchDoctorServices(doctorId)).pipe(catchError(() => of([])));
  }

  getDoctorSchedules(doctorId: string): Observable<DoctorSchedule[]> {
    return from(this.fetchDoctorSchedules(doctorId)).pipe(catchError(() => of([])));
  }

  private async fetchPublicDoctors(): Promise<DoctorSummary[]> {
    const data = await this.api.get<any[]>('doctors').toPromise();
    return (data ?? []).map(mapDoctorRow);
  }

  private async fetchPublicDoctorById(id: string): Promise<DoctorDetail> {
    const data = await this.api.get<any>(`doctors/${id}`).toPromise();
    if (!data) return undefined;
    return {
      ...mapDoctorRow(data),
      services: parseDoctorServices(data['services'] ?? data['doctorServices'] ?? [], id)
    };
  }

  private async fetchPublicServices(): Promise<Service[]> {
    const data = await this.api.get<any[]>('services').toPromise();
    return mapServicesFromAllDoctors(data ?? []);
  }

  private async fetchDoctorServices(doctorId: string): Promise<Service[]> {
    const data = await this.api.get<any[]>(`doctors/${doctorId}/services`).toPromise();
    return (data ?? []).map((r: Record<string, unknown>) => mapServiceRow(r, doctorId)).filter(Boolean) as Service[];
  }

  private async fetchDoctorSchedules(doctorId: string): Promise<DoctorSchedule[]> {
    const data = await this.api.get<any[]>(`doctors/${doctorId}/schedule`).toPromise();
    return (data ?? []).map(mapScheduleRow);
  }

  private async fetchAvailableSlots(doctorId: string, date: string): Promise<AvailableSlot[]> {
    const data = await this.api.get<any[]>(`doctors/${doctorId}/available-slots?date=${encodeURIComponent(date)}`).toPromise();
    const doctor = await this.fetchPublicDoctorById(doctorId);
    const schedules = await this.fetchDoctorSchedules(doctorId);
    const slotTimes = buildScheduledSlotTimes(date, schedules, Math.max(5, doctor?.slotDurationMinutes ?? 30));
    const capacity = Math.max(1, doctor?.slotCapacity ?? 1);
    return slotTimes.map((slotTime, index) =>
      mapAvailableSlotRow(
        (data ?? []).find((row: any) => normalizeString(row.slotStartTime ?? row.slot_start_time) === slotTime.startTime)
        ?? { slot_start_time: slotTime.startTime, slot_end_time: slotTime.endTime, is_available: true, booked_count: 0, capacity },
        slotTime
      )
    );
  }

  private async fetchActiveAnnouncements(): Promise<Announcement[]> {
    const data = await this.api.get<any[]>('announcements').toPromise();
    return (data ?? []).map(mapAnnouncementRow);
  }

  private async fetchDoctorReviews(doctorId: string): Promise<Review[]> {
    const data = await this.api.get<any[]>(`reviews?doctorId=${doctorId}`).toPromise();
    return (data ?? []).map(mapReviewRow);
  }
}

function mapDoctorRow(row: Record<string, unknown>): DoctorSummary {
  const statusStr = resolveStr(row, 'status') || 'Active';
  const status: DoctorStatus = ['Active', 'Inactive', 'OnLeave'].includes(statusStr) ? statusStr as DoctorStatus : 'Active';
  return {
    id: resolveStr(row, 'id') || '',
    userId: resolveStr(row, 'userId') || resolveStr(row, 'id') || '',
    fullName: resolveStr(row, 'fullName') || 'Doctor',
    specialization: resolveStr(row, 'specialization') || '',
    bio: resolveStr(row, 'bio'),
    profilePhotoUrl: resolveStr(row, 'profilePhotoUrl'),
    consultationFee: resolveNum(row, 'consultationFee') ?? 0,
    slotDurationMinutes: resolveNum(row, 'slotDurationMinutes') ?? 30,
    slotCapacity: resolveNum(row, 'slotCapacity') ?? 1,
    dailyPatientLimit: resolveNum(row, 'dailyPatientLimit') ?? null,
    status,
    isActive: status === 'Active',
    averageRating: resolveNum(row, 'averageRating') ?? undefined,
    reviewCount: resolveNum(row, 'reviewCount') ?? undefined,
  };
}

function parseDoctorServices(value: unknown, doctorId: string): Service[] {
  if (!Array.isArray(value)) return [];
  return value.map((item: any) => mapServiceRow(item, doctorId)).filter(Boolean) as Service[];
}

function mapServiceRow(row: Record<string, unknown>, doctorId: string): Service | undefined {
  const id = resolveStr(row, 'id');
  const name = resolveStr(row, 'name');
  if (!id || !name) return undefined;
  return {
    id, name,
    description: resolveStr(row, 'description'),
    estimatedDurationMinutes: resolveNum(row, 'estimatedDurationMinutes') ?? 0,
    price: resolveNum(row, 'price') ?? 0,
    category: normalizeCategory(resolveStr(row, 'category')),
    doctorIds: [doctorId],
  };
}

function mapServicesFromAllDoctors(rows: Record<string, unknown>[]): Service[] {
  const map = new Map<string, Service>();
  for (const row of rows) {
    const id = resolveStr(row, 'id');
    const name = resolveStr(row, 'name');
    if (!id || !name) continue;
    const existing = map.get(id);
    if (existing) {
      const docId = resolveStr(row, 'doctorId');
      if (docId && !existing.doctorIds.includes(docId)) existing.doctorIds.push(docId);
      continue;
    }
    const docId = resolveStr(row, 'doctorId');
    map.set(id, {
      id, name,
      description: resolveStr(row, 'description'),
      estimatedDurationMinutes: resolveNum(row, 'estimatedDurationMinutes') ?? 0,
      price: resolveNum(row, 'price') ?? 0,
      category: normalizeCategory(resolveStr(row, 'category')),
      doctorIds: docId ? [docId] : [],
    });
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function mapScheduleRow(row: Record<string, unknown>): DoctorSchedule {
  return {
    id: resolveStr(row, 'id') || '',
    doctorId: resolveStr(row, 'doctorId') || '',
    dayOfWeek: normalizeDay(resolveStr(row, 'dayOfWeek')),
    startTime: normalizeTimeStr(resolveStr(row, 'startTime')),
    endTime: normalizeTimeStr(resolveStr(row, 'endTime')),
  };
}

function mapAvailableSlotRow(row: Record<string, unknown>, fallback?: { startTime: string; endTime: string }): AvailableSlot {
  const sst = fallback?.startTime || resolveStr(row, 'slot_start_time') || resolveStr(row, 'slotStartTime') || '';
  const set = fallback?.endTime || resolveStr(row, 'slot_end_time') || resolveStr(row, 'slotEndTime') || '';
  const avail = row['is_available'] ?? row['isAvailable'] ?? true;
  return {
    slotStartTime: sst,
    slotEndTime: set,
    isAvailable: !!avail,
    bookedCount: resolveNum(row, 'booked_count') ?? resolveNum(row, 'bookedCount') ?? 0,
    capacity: resolveNum(row, 'capacity') ?? 0,
    time: sst,
    endTime: set,
    IsAvailable: !!avail,
  };
}

function mapAnnouncementRow(row: Record<string, unknown>): Announcement {
  return {
    id: String(resolveStr(row, 'id') ?? ''),
    title: String(resolveStr(row, 'title') ?? ''),
    body: String(resolveStr(row, 'body') ?? ''),
    imageUrl: resolveStr(row, 'imageUrl'),
    isActive: row['isActive'] === true || row['is_active'] === true || true,
    createdAt: resolveStr(row, 'createdAt') ?? resolveStr(row, 'created_at') ?? new Date().toISOString(),
  };
}

function mapReviewRow(row: Record<string, unknown>): Review {
  return {
    id: String(resolveStr(row, 'id') ?? ''),
    bookingId: String(resolveStr(row, 'bookingId') ?? ''),
    doctorId: String(resolveStr(row, 'doctorId') ?? ''),
    patientId: String(resolveStr(row, 'patientId') ?? ''),
    rating: resolveNum(row, 'rating') || 0,
    comment: resolveStr(row, 'comment'),
    patientName: resolveStr(row, 'patientName') ?? '',
    createdAt: resolveStr(row, 'createdAt') ?? resolveStr(row, 'created_at') ?? new Date().toISOString(),
  };
}

function buildScheduledSlotTimes(
  date: string,
  schedules: DoctorSchedule[],
  slotDurationMinutes: number
): Array<{ startTime: string; endTime: string }> {
  const previewDate = new Date(date + 'T00:00:00');
  if (isNaN(previewDate.getTime())) return [];
  const duration = Math.max(5, Math.round(slotDurationMinutes || 30));
  const dayName = DAY_NAMES[previewDate.getDay()];
  const schedule = schedules.find((s) => s.dayOfWeek === dayName);
  if (!schedule) return [];
  const start = timeToMins(schedule.startTime);
  const end = timeToMins(schedule.endTime);
  if (start === null || end === null || end <= start) return [];
  const slots: Array<{ startTime: string; endTime: string }> = [];
  for (let c = start; c + duration <= end; c += duration) {
    slots.push({ startTime: minsToTime(c), endTime: minsToTime(c + duration) });
  }
  return slots;
}

function timeToMins(v: NullableString): number | null {
  if (!v) return null;
  const parts = v.trim().slice(0, 5).split(':');
  const h = Number(parts[0]), m = Number(parts[1] ?? '0');
  return isFinite(h) && isFinite(m) ? h * 60 + m : null;
}

function minsToTime(t: number): string {
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}

const DAY_NAMES: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function resolveStr(row: Record<string, unknown>, key: string): string | undefined {
  const val = row[key] ?? row[camelToSnake(key)];
  return typeof val === 'string' && val.trim() ? val.trim() : undefined;
}

function resolveNum(row: Record<string, unknown>, key: string): number | undefined {
  const val = row[key] ?? row[camelToSnake(key)];
  if (typeof val === 'number' && isFinite(val)) return val;
  if (typeof val === 'string') { const p = parseFloat(val); if (isFinite(p)) return p; }
  return undefined;
}

function camelToSnake(s: string): string {
  return s.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
}

function normalizeCategory(v: string | undefined): ServiceCategory {
  const allowed: ServiceCategory[] = ['Consultation', 'Procedure', 'Laboratory', 'Diagnostic'];
  if (!v) return 'Consultation';
  const n = v.trim().toLowerCase();
  return allowed.find((a) => a.toLowerCase() === n) ?? 'Consultation';
}

function normalizeDay(v: string | undefined): DayOfWeek {
  const allowed: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  if (!v) return 'Monday';
  const n = v.trim().toLowerCase();
  return allowed.find((a) => a.toLowerCase() === n) ?? 'Monday';
}

function normalizeTimeStr(v: NullableString): string {
  const t = (v || '').trim();
  return t.length >= 5 ? t.slice(0, 5) : t || '00:00';
}

function normalizeString(v: string | null | undefined): string | undefined {
  const t = v?.trim();
  return t || undefined;
}

function normalizeError(error: unknown, fallback: string): Error {
  if (error instanceof Error) return error;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === 'string' && msg.trim()) return new Error(msg);
  }
  return new Error(fallback);
}

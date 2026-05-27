import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable, map } from 'rxjs';
import {
  DayOfWeek,
  Doctor,
  DoctorBlockedDate,
  DoctorSchedule,
  DoctorStatus
} from '../../../core/models';

type NullableString = string | null | undefined;

export interface DoctorSummary extends Doctor {}
export type DoctorDetail = Doctor;

export interface CreateDoctorDto {
  fullName: string;
  specialization: string;
  bio?: string;
  licenseNumber?: string;
  ptrNumber?: string;
  s2Number?: string;
  consultationFee: number;
  slotDurationMinutes: number;
  slotCapacity: number;
  dailyPatientLimit: number | null;
  doctorEmail: string;
  tempPassword: string;
}

export type UpdateDoctorDto = Partial<CreateDoctorDto> & { status?: DoctorStatus };

export interface UpsertSchedulesDto {
  schedules: Array<Pick<DoctorSchedule, 'dayOfWeek' | 'startTime' | 'endTime'>>;
}

export interface BlockDateDto {
  blockedDate: string;
  reason?: string;
}

export type BlockedDate = DoctorBlockedDate;

export interface CreateDoctorInviteDto {
  fullName: string;
  email: string;
  specialization: string;
  bio?: string;
  licenseNumber?: string;
  ptrNumber?: string;
  s2Number?: string;
  consultationFee: number;
  slotDurationMinutes: number;
  slotCapacity: number;
  dailyPatientLimit: number | null;
  serviceIds: string[];
  schedule?: Array<{ dayOfWeek: string; startTime: string; endTime: string }>;
}

@Injectable({ providedIn: 'root' })
export class AdminDoctorsService {
  private readonly api = inject(ApiService);

  getAllDoctors(): Observable<DoctorSummary[]> {
    return this.api.get<any[]>('doctors/admin').pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDtoToDoctor))
    );
  }

  getDoctors(): Observable<DoctorSummary[]> {
    return this.getAllDoctors();
  }

  createDoctor(dto: CreateDoctorDto): Observable<DoctorDetail> {
    return this.api.post('doctors', {
      fullName: dto.fullName,
      specialization: dto.specialization,
      bio: dto.bio ?? null,
      licenseNumber: dto.licenseNumber ?? null,
      ptrNumber: dto.ptrNumber ?? null,
      s2Number: dto.s2Number ?? null,
      consultationFee: dto.consultationFee,
      slotDurationMinutes: dto.slotDurationMinutes,
      slotCapacity: dto.slotCapacity,
      dailyPatientLimit: dto.dailyPatientLimit ?? null,
      doctorEmail: dto.doctorEmail,
      tempPassword: dto.tempPassword,
    }).pipe(map((data) => mapDtoToDoctor((data ?? {}) as Record<string, unknown>)));
  }

  addDoctor(doctor: CreateDoctorDto): Observable<DoctorDetail> {
    return this.createDoctor(doctor);
  }

  createDoctorInvite(dto: CreateDoctorInviteDto): Observable<{ inviteId: string }> {
    throw new Error('Doctor invites need a .NET backend endpoint. Use POST /api/doctors/invite when implemented.');
  }

  updateDoctor(id: string, dto: UpdateDoctorDto): Observable<DoctorDetail> {
    const payload: Record<string, unknown> = {};
    if (dto.fullName !== undefined) payload['fullName'] = dto.fullName;
    if (dto.specialization !== undefined) payload['specialization'] = dto.specialization;
    if (dto.bio !== undefined) payload['bio'] = dto.bio;
    if (dto.licenseNumber !== undefined) payload['licenseNumber'] = dto.licenseNumber;
    if (dto.ptrNumber !== undefined) payload['ptrNumber'] = dto.ptrNumber;
    if (dto.s2Number !== undefined) payload['s2Number'] = dto.s2Number;
    if (dto.consultationFee !== undefined) payload['consultationFee'] = dto.consultationFee;
    if (dto.slotDurationMinutes !== undefined) payload['slotDurationMinutes'] = dto.slotDurationMinutes;
    if (dto.slotCapacity !== undefined) payload['slotCapacity'] = dto.slotCapacity;
    if (dto.dailyPatientLimit !== undefined) payload['dailyPatientLimit'] = dto.dailyPatientLimit;
    if (dto.status !== undefined) payload['status'] = dto.status;
    return this.api.put(`doctors/${id}`, payload).pipe(map((data) => mapDtoToDoctor((data ?? {}) as Record<string, unknown>)));
  }

  updateDoctorLegacy(doctor: Doctor): Observable<DoctorDetail> {
    return this.updateDoctor(doctor.id, doctor as unknown as UpdateDoctorDto);
  }

  deactivateDoctor(id: string): Observable<void> {
    return this.api.put(`doctors/${id}`, { status: 'Inactive' }).pipe(map(() => void 0));
  }

  getSchedule(id: string): Observable<DoctorSchedule[]> {
    return this.api.get<any[]>('doctors/' + id + '/schedule').pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDtoToSchedule))
    );
  }

  updateSchedule(id: string, dto: UpsertSchedulesDto): Observable<DoctorSchedule[]> {
    return this.api.put<any[]>('doctors/' + id + '/schedule', {
      schedules: dto.schedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      }))
    }).pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDtoToSchedule))
    );
  }

  getBlockedDates(id: string): Observable<BlockedDate[]> {
    return this.api.get<any[]>('doctors/' + id + '/blocked-dates').pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDtoToBlockedDate))
    );
  }

  addBlockedDate(id: string, dto: BlockDateDto): Observable<BlockedDate> {
    return this.api.post('doctors/' + id + '/blocked-dates', {
      date: dto.blockedDate,
      reason: dto.reason ?? null,
    }).pipe(map((data) => mapDtoToBlockedDate((data ?? {}) as Record<string, unknown>)));
  }

  deleteBlockedDate(doctorId: string, bdId: string): Observable<void> {
    return this.api.delete('doctors/' + doctorId + '/blocked-dates/' + bdId).pipe(map(() => void 0));
  }

  private normalizeDoctorFromRow(row: Record<string, unknown>): DoctorSummary {
    return mapDtoToDoctor(row);
  }
}

const DOCTOR_STATUSES: DoctorStatus[] = ['Active', 'Inactive', 'OnLeave'];

function mapDtoToDoctor(dto: Record<string, unknown>): DoctorSummary {
  const statusStr = resolveStr(dto, 'status') || 'Active';
  const status: DoctorStatus = DOCTOR_STATUSES.includes(statusStr as DoctorStatus)
    ? statusStr as DoctorStatus
    : 'Active';

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
    status,
    averageRating: resolveNum(dto, 'averageRating') ?? undefined,
    reviewCount: resolveNum(dto, 'reviewCount') ?? undefined,
  };
}

function mapDtoToSchedule(dto: Record<string, unknown>): DoctorSchedule {
  return {
    id: resolveStr(dto, 'id') || '',
    doctorId: resolveStr(dto, 'doctorId') || '',
    dayOfWeek: normalizeDayOfWeek(resolveStr(dto, 'dayOfWeek')),
    startTime: normalizeTime(resolveStr(dto, 'startTime')),
    endTime: normalizeTime(resolveStr(dto, 'endTime')),
  };
}

function mapDtoToBlockedDate(dto: Record<string, unknown>): BlockedDate {
  return {
    id: resolveStr(dto, 'id') || '',
    doctorId: resolveStr(dto, 'doctorId') || '',
    blockedDate: resolveStr(dto, 'blockedDate') || resolveStr(dto, 'date') || '',
    reason: resolveStr(dto, 'reason'),
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
  if (typeof val === 'string') { const p = parseFloat(val); if (isFinite(p)) return p; }
  return undefined;
}

function normalizeDayOfWeek(value: string | undefined): DayOfWeek {
  const allowed: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  if (!value) return 'Monday';
  const n = value.trim().toLowerCase();
  return allowed.find((a) => a.toLowerCase() === n) ?? 'Monday';
}

function normalizeTime(value: string | undefined): string {
  const t = (value || '').trim();
  return t.length >= 5 ? t.slice(0, 5) : t || '00:00';
}

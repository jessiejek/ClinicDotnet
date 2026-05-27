import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  createDoctorInvite(dto: CreateDoctorInviteDto): Observable<{ inviteId: string }> {
    throw new Error('Doctor invites need a .NET backend endpoint. Use POST /api/doctors/invite when implemented.');
  }
}

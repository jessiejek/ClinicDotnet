import { AvailabilityStatus, Doctor, DoctorStatus } from '../../../core/models';

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

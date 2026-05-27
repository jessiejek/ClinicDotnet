import type { Service } from '../../../core/models';

export interface AvailableSlot {
  date: string;
  startTime: string;
  endTime: string;
  time?: string;
  slotStartTime?: string;
  slotEndTime?: string;
  bookedCount?: number;
  capacity?: number;
  isAvailable?: boolean;
  IsAvailable?: boolean;
}

export interface DoctorSummary {
  id: string;
  fullName: string;
  specialization?: string;
  status?: string;
  profilePhotoUrl?: string;
  consultationFee?: number;
  licenseNumber?: string;
  ptrNumber?: string;
  averageRating?: number;
  bio?: string;
}

export interface DoctorDetail {
  id: string;
  fullName: string;
  specialization?: string;
  bio?: string;
  profilePhotoUrl?: string;
  status?: string;
  consultationFee?: number;
  licenseNumber?: string;
  ptrNumber?: string;
  averageRating?: number;
  reviewCount?: number;
  services?: Service[];
}

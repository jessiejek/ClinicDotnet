import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

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
}

@Injectable({ providedIn: 'root' })
export class PublicService {
  private readonly api = inject(ApiService);

  getDoctorById(id: string): Observable<any> {
    return this.api.get<any>('doctors/' + id);
  }

  getDoctorSchedule(doctorId: string): Observable<any[]> {
    return this.api.get<any[]>('doctors/' + doctorId + '/schedule').pipe(map((data) => (data ?? []) as Record<string, unknown>[]));
  }

  getDoctorSchedules(doctorId: string): Observable<any[]> {
    return this.getDoctorSchedule(doctorId);
  }

  getDoctorReviews(doctorId: string): Observable<any[]> {
    return this.api.get<any[]>('reviews?doctorId=' + doctorId).pipe(map((data) => (data ?? []) as Record<string, unknown>[]));
  }

}

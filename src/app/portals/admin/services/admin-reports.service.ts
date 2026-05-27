import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

export interface DailyBookingSummaryRow { date: string; totalBookings: number; completed: number; cancelled: number; noShow: number; revenue: number; }
export interface PendingFollowUpReportRow { bookingId: string; patient: string; doctor: string; followUpDate: string; reason: string; status: string; }
export interface UnpaidCompletedVisitReportRow { bookingId: string; patient: string; doctor: string; service: string; visitDate: string; amount: number; paymentStatus: string; }

@Injectable({ providedIn: 'root' })
export class AdminReportsService {
  private readonly api = inject(ApiService);

  fetchAllBookings(): Observable<any[]> {
    return this.api.get<any[]>('bookings?pageSize=1000').pipe(
      map((data) => (data ?? []) as Record<string, unknown>[] as any[])
    );
  }

  getUnpaidCompletedVisits(): Observable<UnpaidCompletedVisitReportRow[]> {
    return this.api.get<any[]>('reports/unpaid-completed-visits').pipe(
      map((rows) => (rows ?? []) as UnpaidCompletedVisitReportRow[])
    );
  }

  getPendingFollowUps(): Observable<PendingFollowUpReportRow[]> {
    return this.api.get<any[]>('reports/pending-follow-ups').pipe(
      map((rows) => (rows ?? []) as PendingFollowUpReportRow[])
    );
  }

  getDailyBookingSummary(): Observable<DailyBookingSummaryRow[]> {
    return this.api.get<any[]>('reports/daily-booking-summary').pipe(
      map((rows) => (rows ?? []) as DailyBookingSummaryRow[])
    );
  }
}

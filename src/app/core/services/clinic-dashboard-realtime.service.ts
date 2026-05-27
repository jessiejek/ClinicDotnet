import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// ── Event types — same interface consumers expect ──

export type ClinicDashboardEventName =
  | 'BookingCreated'
  | 'BookingCancelled'
  | 'PatientCheckedIn'
  | 'PatientCheckInUndone'
  | 'DoctorCompletedConsultation'
  | 'PaymentCompleted'
  | 'PaymentWaived'
  | 'DoctorScheduleUpdated'
  | 'DoctorServicesUpdated'
  | 'PatientProfileUpdated';

export interface ClinicDashboardEvent {
  eventName: ClinicDashboardEventName;
  bookingId?: string | null;
  patientId?: string | null;
  doctorId?: string | null;
  status?: string | null;
  paymentStatus?: string | null;
  finalAmount?: number | null;
  isProfessionalFeeWaived?: boolean | null;
  timestamp?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ClinicDashboardRealtimeService {
  private readonly eventsSubject = new Subject<ClinicDashboardEvent>();
  readonly events$: Observable<ClinicDashboardEvent> = this.eventsSubject.asObservable();
  private channels: any[] = [];

  constructor() {
    console.warn('[ClinicDashboardRealtime] API Realtime removed. Connect to SignalR hub /hubs/clinic-dashboard instead.');
  }

  /** Push a simulated event (useful for testing or when SignalR is not yet wired up). */
  emit(event: ClinicDashboardEvent): void {
    this.eventsSubject.next(event);
  }

  subscribeToBookingUpdates(callback: (payload: any) => void): void {
    // TODO: Replace with SignalR connection
    console.warn('[ClinicDashboardRealtime] subscribeToBookingUpdates not implemented. Use SignalR.');
  }

  subscribeToQueueUpdates(callback: (payload: any) => void): void {
    // TODO: Replace with SignalR connection
    console.warn('[ClinicDashboardRealtime] subscribeToQueueUpdates not implemented. Use SignalR.');
  }

  subscribeToDoctorStatusUpdates(callback: (payload: any) => void): void {
    // TODO: Replace with SignalR connection
    console.warn('[ClinicDashboardRealtime] subscribeToDoctorStatusUpdates not implemented. Use SignalR.');
  }

  subscribeToAnnouncementUpdates(callback: (payload: any) => void): void {
    // TODO: Replace with SignalR connection
    console.warn('[ClinicDashboardRealtime] subscribeToAnnouncementUpdates not implemented. Use SignalR.');
  }

  unsubscribeAll(): void {
    this.channels = [];
  }
}

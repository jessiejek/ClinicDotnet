import { Injectable, OnDestroy, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

// ── Event types ──

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

/**
 * All event names the backend can push. Used to subscribe dynamically.
 */
const ALL_EVENT_NAMES: ClinicDashboardEventName[] = [
  'BookingCreated',
  'BookingCancelled',
  'PatientCheckedIn',
  'PatientCheckInUndone',
  'DoctorCompletedConsultation',
  'PaymentCompleted',
  'PaymentWaived',
  'DoctorScheduleUpdated',
  'DoctorServicesUpdated',
  'PatientProfileUpdated'
];

@Injectable({ providedIn: 'root' })
export class ClinicDashboardRealtimeService implements OnDestroy {
  private readonly tokenService = inject(TokenService);

  private hubConnection: signalR.HubConnection | null = null;
  private readonly eventsSubject = new Subject<ClinicDashboardEvent>();
  readonly events$: Observable<ClinicDashboardEvent> = this.eventsSubject.asObservable();
  private isConnected = false;

  constructor() {
    this.connect();
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.eventsSubject.complete();
  }

  // ── Public API ──

  /** Manually emit an event (useful for testing or local-first scenarios). */
  emit(event: ClinicDashboardEvent): void {
    this.eventsSubject.next(event);
  }

  /** Subscribe to a specific event type via callback (legacy API). */
  subscribeToBookingUpdates(callback: (payload: any) => void): void {
    this.events$.subscribe((e) => {
      if (['BookingCreated', 'BookingCancelled', 'PatientCheckedIn', 'PatientCheckInUndone', 'DoctorCompletedConsultation'].includes(e.eventName)) {
        callback(e);
      }
    });
  }

  subscribeToQueueUpdates(callback: (payload: any) => void): void {
    this.events$.subscribe((e) => {
      if (['PatientCheckedIn', 'PatientCheckInUndone'].includes(e.eventName)) {
        callback(e);
      }
    });
  }

  subscribeToDoctorStatusUpdates(callback: (payload: any) => void): void {
    this.events$.subscribe((e) => {
      if (['DoctorScheduleUpdated', 'DoctorServicesUpdated'].includes(e.eventName)) {
        callback(e);
      }
    });
  }

  subscribeToAnnouncementUpdates(callback: (payload: any) => void): void {
    this.events$.subscribe((e) => {
      if (e.eventName === 'BookingCreated') {
        callback(e);
      }
    });
  }

  unsubscribeAll(): void {
    // RxJS — consumers manage their own subscriptions via .pipe(takeUntil(...)).
    // No-op here.
  }

  /** Whether the SignalR connection is active. */
  get connected(): boolean {
    return this.isConnected;
  }

  // ── Connection lifecycle ──

  private connect(): void {
    const accessToken = this.tokenService.getAccessToken();
    if (!accessToken) {
      console.warn('[ClinicDashboardRealtime] No access token available. Will retry on next auth change.');
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalrHubUrl, {
        accessTokenFactory: () => this.tokenService.getAccessToken() ?? '',
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // Register handlers for all known event names
    for (const eventName of ALL_EVENT_NAMES) {
      this.hubConnection.on(eventName, (payload: any) => {
        console.debug(`[ClinicDashboardRealtime] Received: ${eventName}`, payload);
        this.eventsSubject.next({
          eventName,
          ...(typeof payload === 'object' && payload !== null ? payload : {})
        } as ClinicDashboardEvent);
      });
    }

    this.hubConnection.onreconnecting((error) => {
      console.warn('[ClinicDashboardRealtime] Reconnecting...', error);
      this.isConnected = false;
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('[ClinicDashboardRealtime] Reconnected. Connection ID:', connectionId);
      this.isConnected = true;
    });

    this.hubConnection.onclose((error) => {
      console.warn('[ClinicDashboardRealtime] Disconnected.', error);
      this.isConnected = false;
    });

    this.hubConnection.start()
      .then(() => {
        this.isConnected = true;
        console.log('[ClinicDashboardRealtime] Connected to SignalR hub');
      })
      .catch((err) => {
        this.isConnected = false;
        console.error('[ClinicDashboardRealtime] Failed to connect:', err);
      });
  }

  private disconnect(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = null;
      this.isConnected = false;
    }
  }
}

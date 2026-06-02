import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
  ToastController
} from '@ionic/angular/standalone';
import { catchError, map, of, switchMap, throwError } from 'rxjs';
import { Booking } from '../../../core/models';
import {
  BookingService,
  DoctorCompleteBookingRequest,
  DoctorTodaySummary
} from '../../../core/services/booking.service';
import { ClinicDashboardRealtimeService } from '../../../core/services/clinic-dashboard-realtime.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

type DoctorQueueFilter = 'all' | 'Confirmed' | 'CheckedIn' | 'Completed' | 'NoShow' | 'Cancelled';

@Component({
  standalone: true,
  selector: 'app-doctor-appointments-page',
  imports: [
    DatePipe,
    FormsModule,
    NgFor,
    NgIf,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonModal,
    IonTitle,
    IonToolbar,
    PageHeaderComponent,
    EmptyStateComponent,
    StatusBadgeComponent
  ],
  templateUrl: './doctor-appointments.page.html',
  styleUrl: './doctor-appointments.page.scss'
})
export class DoctorAppointmentsPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly bookingService = inject(BookingService);
  private readonly realtime = inject(ClinicDashboardRealtimeService);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);

  summary: DoctorTodaySummary | null = null;
  isLoading = false;
  searchQuery = '';
  selectedFilter: DoctorQueueFilter = 'all';
  completeModalOpen = false;
  selectedBooking: Booking | null = null;
  isProfessionalFeeWaived = false;
  finalAmount = 0;
  professionalFeeWaivedReason = '';
  soapNotes = '';
  doctorFeeNotes = '';
  notes = '';
  isSubmittingComplete = false;

  readonly filterOptions: Array<{ label: string; value: DoctorQueueFilter }> = [
    { label: 'All', value: 'all' },
    { label: 'Booked', value: 'Confirmed' },
    { label: 'In Clinic', value: 'CheckedIn' },
    { label: 'Completed', value: 'Completed' },
    { label: 'No Show', value: 'NoShow' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  get filteredBookings(): Booking[] {
    const bookings = this.summary?.items ?? [];
    const normalizedSearch = this.searchQuery.trim().toLowerCase();

    return bookings
      .filter((booking) => (this.selectedFilter === 'all' ? true : booking.status === this.selectedFilter))
      .filter((booking) => {
        if (!normalizedSearch) {
          return true;
        }

        return [
          booking.patientName ?? '',
          booking.doctorName ?? '',
          servicesLabel(booking),
          booking.slotStartTime ?? '',
          booking.queueNumber?.toString() ?? ''
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);
      })
      .sort((a, b) => {
        const aQueue = a.queueNumber ?? Number.MAX_SAFE_INTEGER;
        const bQueue = b.queueNumber ?? Number.MAX_SAFE_INTEGER;
        if (aQueue !== bQueue) {
          return aQueue - bQueue;
        }

        return `${a.appointmentDate} ${a.slotStartTime}`.localeCompare(`${b.appointmentDate} ${b.slotStartTime}`);
      });
  }

  ngOnInit(): void {
    this.loadSummary();

    // Realtime: auto-refresh on booking changes
    this.realtime.events$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: any) => {
        if ([
          'BookingCreated',
          'BookingCancelled',
          'PatientCheckedIn',
          'PatientCheckInUndone',
          'DoctorCompletedConsultation',
          'PaymentCompleted',
          'PaymentWaived'
        ].includes(event.eventName)) {
          this.loadSummary();
        }
      });
  }

  loadSummary(): void {
    this.isLoading = true;
    this.apiService.get<any[]>('bookings/doctor/today').pipe(
      switchMap((todayData) => {
        const queue = ((todayData ?? []) as Record<string, unknown>[])
          .map((row) => normalizeQueueBooking(row))
          .filter((booking): booking is Booking => Boolean(booking));

        return this.apiService.get<any>('bookings/doctor/today-summary').pipe(
          map((summaryResponse) => {
            const row = (summaryResponse ?? {}) as Record<string, unknown>;
            return {
              bookedToday: normalizeNumber(row['today_total'], queue.length),
              checkedIn: normalizeNumber(row['checked_in_count']),
              waiting: normalizeNumber(row['checked_in_count']) + normalizeNumber(row['in_progress_count']),
              completed: normalizeNumber(row['completed_count']),
              noShow: normalizeNumber(row['no_show_count']),
              cancelled: 0,
              items: queue
            } as DoctorTodaySummary;
          })
        );
      }),
      catchError((error: unknown) =>
        throwError(() => new Error(extractApiErrorMessage(error, 'Failed to load today summary from API.')))
      )
    ).subscribe({
      next: (summary) => {
        this.summary = summary;
      },
      error: async (error) => {
        this.summary = null;
        await this.presentToast(extractApiErrorMessage(error, 'Failed to load today summary.'), 'danger');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  view(bookingId: string): void {
    void this.router.navigate(['/doctor/appointments', bookingId]);
  }

  consult(bookingId: string): void {
    void this.router.navigate(['/doctor/consultation', bookingId]);
  }

  canStartConsultation(booking: Booking): boolean {
    return booking.status === 'CheckedIn' || booking.status === 'InProgress';
  }

  canComplete(booking: Booking): boolean {
    return booking.status === 'CheckedIn' || booking.status === 'InProgress';
  }

  timeRangeLabel(booking: Booking): string {
    return timeRangeLabel(booking);
  }

  servicesLabel(booking: Booking): string {
    return servicesLabel(booking);
  }

  openCompleteModal(booking: Booking): void {
    this.selectedBooking = booking;
    this.completeModalOpen = true;
    this.isProfessionalFeeWaived = false;
    this.finalAmount = Math.max(0, booking.finalAmount ?? 0);
    this.professionalFeeWaivedReason = booking.professionalFeeWaivedReason ?? '';
    this.soapNotes = '';
    this.doctorFeeNotes = '';
    this.notes = '';
  }

  closeCompleteModal(): void {
    this.completeModalOpen = false;
    this.selectedBooking = null;
    this.isSubmittingComplete = false;
  }

  setWaived(value: boolean): void {
    this.isProfessionalFeeWaived = value;
    if (value) {
      this.finalAmount = 0;
    }
  }

  submitCompletion(): void {
    if (!this.selectedBooking || this.isSubmittingComplete) {
      return;
    }

    if (!this.isProfessionalFeeWaived && (this.finalAmount < 0 || Number.isNaN(this.finalAmount))) {
      void this.presentToast('Enter a valid final amount.', 'warning');
      return;
    }

    if (this.isProfessionalFeeWaived && !this.professionalFeeWaivedReason.trim()) {
      void this.presentToast('A waived reason is required.', 'warning');
      return;
    }

    const payload: DoctorCompleteBookingRequest = {
      finalAmount: this.isProfessionalFeeWaived ? 0 : this.finalAmount,
      isProfessionalFeeWaived: this.isProfessionalFeeWaived,
      professionalFeeWaivedReason: this.professionalFeeWaivedReason.trim() || undefined,
      soapNotes: this.soapNotes.trim() || undefined,
      doctorFeeNotes: this.doctorFeeNotes.trim() || undefined,
      notes: this.notes.trim() || undefined
    };

    this.isSubmittingComplete = true;
    const bookingId = this.selectedBooking.id;
    this.apiService.patch('bookings/' + bookingId + '/doctor-complete', payload).pipe(
      switchMap(() =>
        payload.isProfessionalFeeWaived
          ? this.apiService.patch('payments/' + bookingId + '/waive', {
              reason: payload.professionalFeeWaivedReason ?? 'Professional fee waived.'
            })
          : of(void 0)
      ),
      catchError((error: unknown) =>
        throwError(() => new Error(extractApiErrorMessage(error, 'Failed to complete consultation.')))
      )
    ).subscribe({
      next: async () => {
        this.closeCompleteModal();
        this.loadSummary();
        await this.presentToast('Consultation completed.', 'success');
      },
      error: async (error) => {
        this.isSubmittingComplete = false;
        await this.presentToast(extractApiErrorMessage(error, 'Failed to complete consultation.'), 'danger');
      }
    });
  }

  private async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning' = 'success'
  ): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
      position: 'top'
    });
    await toast.present();
  }
}

function servicesLabel(booking: Booking): string {
  if (booking.serviceNames?.length) {
    return booking.serviceNames.join(', ');
  }

  const names = booking.services?.map((service) => service.name).filter((name) => name.trim().length > 0) ?? [];
  if (names.length > 0) {
    return names.join(', ');
  }

  return booking.serviceName?.trim() || '—';
}

function timeRangeLabel(booking: Booking): string {
  const start = booking.slotStartTime?.trim() ?? '';
  const end = booking.slotEndTime?.trim() ?? '';

  if (!start) {
    return 'Time not available';
  }

  if (!end || end === start) {
    return start;
  }

  return `${start} - ${end}`;
}

function normalizeQueueBooking(row: Record<string, unknown>): Booking | undefined {
  const id = trimOptionalString(row['id'] ?? row['booking_id'] ?? row['bookingId']);
  if (!id) {
    return undefined;
  }

  const appointmentDate = trimOptionalString(row['appointmentDate'] ?? row['appointment_date']) ?? '';
  const slotStartTime = trimOptionalString(row['slotStartTime'] ?? row['slot_start_time']) ?? '';
  const slotEndTime = trimOptionalString(row['slotEndTime'] ?? row['slot_end_time']) ?? slotStartTime;

  return {
    id,
    patientId: trimOptionalString(row['patientId'] ?? row['patient_id']) ?? '',
    patientName: trimOptionalString(row['patientName'] ?? row['patient_name']) ?? 'Patient',
    doctorId: trimOptionalString(row['doctorId'] ?? row['doctor_id']) ?? '',
    doctorName: trimOptionalString(row['doctorName'] ?? row['doctor_name']) ?? 'Doctor',
    serviceId: trimOptionalString(row['serviceId'] ?? row['service_id']) ?? '',
    serviceName: trimOptionalString(row['serviceName'] ?? row['service_name']),
    serviceNames: normalizeTextArray(row['serviceNames'] ?? row['service_names']),
    services: normalizeServices(row['services']),
    appointmentDate,
    slotStartTime,
    slotEndTime,
    status: (trimOptionalString(row['status']) as Booking['status']) ?? 'Pending',
    paymentStatus: (trimOptionalString(row['paymentStatus'] ?? row['payment_status']) as Booking['paymentStatus']) ?? 'Unpaid',
    paymentMode: (trimOptionalString(row['paymentMode'] ?? row['payment_mode']) as Booking['paymentMode']) ?? 'PayAtClinic',
    queueNumber: normalizeNullableNumber(row['queueNumber'] ?? row['queue_number']),
    totalFee: normalizeNumber(row['totalFee'] ?? row['total_fee']),
    consultationFeeSnapshot: normalizeNumber(row['consultationFeeSnapshot'] ?? row['consultation_fee_snapshot']),
    serviceFeeSnapshot: normalizeNumber(row['serviceFeeSnapshot'] ?? row['service_fee_snapshot']),
    isWalkIn: normalizeBoolean(row['isWalkIn'] ?? row['is_walk_in']),
    createdAt: trimOptionalString(row['createdAt'] ?? row['created_at']) ?? new Date().toISOString(),
    finalAmount: normalizeNullableNumber(row['finalAmount'] ?? row['final_amount']),
    amountDue: normalizeNullableNumber(row['amountDue'] ?? row['amount_due']),
    isProfessionalFeeWaived: normalizeBooleanOrUndefined(row['isProfessionalFeeWaived'] ?? row['is_professional_fee_waived']),
    professionalFeeWaivedReason: trimOptionalString(row['professionalFeeWaivedReason'] ?? row['professional_fee_waived_reason'])
  };
}

function trimOptionalString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (value == null) {
    return undefined;
  }

  const text = String(value).trim();
  return text.length > 0 ? text : undefined;
}

function normalizeTextArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value.map((entry) => trimOptionalString(entry)).filter((entry): entry is string => Boolean(entry));
  return items.length > 0 ? items : undefined;
}

function normalizeServices(value: unknown): Booking['services'] {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }
      const row = entry as Record<string, unknown>;
      const id = trimOptionalString(row['id'] ?? row['service_id']);
      const name = trimOptionalString(row['name'] ?? row['service_name']);
      return id && name ? { id, name } : null;
    })
    .filter((entry): entry is NonNullable<Booking['services']>[number] => Boolean(entry));
}

function normalizeNumber(value: unknown, fallback = 0): number {
  const text = trimOptionalString(value);
  if (!text) {
    return fallback;
  }

  const num = Number(text);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeNullableNumber(value: unknown): number | null {
  const text = trimOptionalString(value);
  if (!text) {
    return null;
  }

  const num = Number(text);
  return Number.isFinite(num) ? num : null;
}

function normalizeBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  const text = trimOptionalString(value);
  if (!text) {
    return false;
  }

  return text.toLowerCase() === 'true' || text === '1';
}

function normalizeBooleanOrUndefined(value: unknown): boolean | undefined {
  if (value == null) {
    return undefined;
  }

  return normalizeBoolean(value);
}

function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

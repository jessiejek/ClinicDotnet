import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastController } from '@ionic/angular/standalone';
import { Booking } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { ClinicDashboardRealtimeService } from '../../../core/services/clinic-dashboard-realtime.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

type StaffTodayStatus = 'all' | 'Confirmed' | 'CheckedIn' | 'Completed' | 'NoShow' | 'Cancelled';

@Component({
  selector: 'app-staff-bookings-page',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, FormsModule, PageHeaderComponent, EmptyStateComponent, StatusBadgeComponent],
  template: `
    <app-page-header
      [title]="'Bookings' + (selectedDate ? ' — ' + (selectedDate | date : 'MMMM d, y (EEE)') : '')"
      subtitle="View and manage patient bookings across all dates"
    ></app-page-header>

    <section class="filter-bar">
      <select class="filter-input" [(ngModel)]="doctorFilter" (ngModelChange)="onFiltersChanged()">
        <option value="">All Doctors</option>
        <option *ngFor="let doctor of doctors" [value]="doctor.id">{{ doctor.fullName }}</option>
      </select>

      <select class="filter-input" [(ngModel)]="statusFilter" (ngModelChange)="onFiltersChanged()">
        <option *ngFor="let status of statuses" [value]="status.value">{{ status.label }}</option>
      </select>

      <input
        type="date"
        class="filter-input filter-date"
        [(ngModel)]="dateValue"
        (ngModelChange)="onDateChanged()"
      />

      <button type="button" class="btn-icon" (click)="refresh()" [disabled]="isLoading">
        <span class="btn-icon__text">⟳</span> Refresh
      </button>
    </section>

    <div class="loading-card" *ngIf="isLoading">Loading bookings…</div>

    <ng-container *ngIf="!isLoading">
      <section class="table-card" *ngIf="bookings.length > 0; else emptyState">
        <div class="table-scroll">
          <table class="bookings-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor / Services</th>
                <th>Date / Time</th>
                <th>Queue</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Mode</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let booking of bookings"
                class="booking-row"
                tabindex="0"
                role="button"
                [attr.aria-label]="'Open booking for ' + (booking.patientName || 'patient')"
                (click)="openBooking(booking.id)"
                (keydown.enter)="openBooking(booking.id)"
              >
                <td>
                  <button type="button" class="booking-link" (click)="openBooking(booking.id, $event)">
                    {{ booking.patientName || 'Patient' }}
                  </button>
                </td>
                <td>
                  <div class="doctor-name">{{ booking.doctorName || 'Doctor' }}</div>
                  <div class="doctor-services">{{ servicesLabel(booking) }}</div>
                </td>
                <td>
                  <div>{{ booking.appointmentDate | date : 'MMMM d, y (EEE)' }}</div>
                  <div class="time-range">{{ timeRangeLabel(booking) }}</div>
                </td>
                <td class="col-queue">{{ booking.queueNumber !== null ? '#' + booking.queueNumber : '-' }}</td>
                <td class="col-center">
                  <app-status-badge
                    [status]="booking.status"
                    [labelOverride]="bookingStatusLabel(booking.status)"
                  ></app-status-badge>
                </td>
                <td class="col-center"><app-status-badge [status]="booking.paymentStatus"></app-status-badge></td>
                <td class="col-center">{{ booking.paymentMode }}</td>
                <td class="col-actions">
                  <div class="action-row">
                    <button
                      *ngIf="booking.status === 'Confirmed'"
                      type="button"
                      class="btn-primary"
                      (click)="checkIn(booking, $event)"
                      [disabled]="actionBookingId === booking.id"
                    >
                      Check In
                    </button>
                    <button
                      *ngIf="booking.status === 'CheckedIn'"
                      type="button"
                      class="btn-outline"
                      (click)="undoCheckIn(booking, $event)"
                      [disabled]="actionBookingId === booking.id"
                    >
                      Undo Check-In
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination" *ngIf="totalPages > 1">
          <button class="btn-ghost pagination__button" type="button" (click)="previousPage()" [disabled]="currentPage <= 1 || isLoading">
            Previous
          </button>
          <span class="pagination__page">Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="btn-ghost pagination__button" type="button" (click)="nextPage()" [disabled]="currentPage >= totalPages || isLoading">
            Next
          </button>
        </div>
      </section>

      <!-- Mobile card layout -->
      <section class="mobile-layout" *ngIf="bookings.length > 0">
        <div
          class="mobile-card"
          *ngFor="let booking of bookings"
          tabindex="0"
          role="button"
          [attr.aria-label]="'Open booking for ' + (booking.patientName || 'patient')"
          (click)="openBooking(booking.id)"
          (keydown.enter)="openBooking(booking.id)"
        >
          <div class="mobile-card__header">
            <div class="mobile-card__info">
              <strong>{{ booking.patientName || 'Patient' }}</strong>
              <span class="mobile-card__doctor">{{ booking.doctorName || 'Doctor' }}</span>
              <span class="mobile-card__services">{{ servicesLabel(booking) }}</span>
              <span class="mobile-card__queue">{{ booking.queueNumber !== null ? '#' + booking.queueNumber : '-' }}</span>
            </div>
            <div class="mobile-card__badge">
              <app-status-badge
                [status]="booking.status"
                [labelOverride]="bookingStatusLabel(booking.status)"
              ></app-status-badge>
            </div>
          </div>
          <div class="mobile-card__details">
            <div>
              <dt>Date</dt>
              <dd>{{ booking.appointmentDate | date : 'MMMM d, y (EEE)' }}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{{ timeRangeLabel(booking) }}</dd>
            </div>
            <div>
              <dt>Payment</dt>
              <dd><app-status-badge [status]="booking.paymentStatus"></app-status-badge></dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>{{ booking.paymentMode }}</dd>
            </div>
          </div>
          <div class="mobile-card__actions">
            <button
              *ngIf="booking.status === 'Confirmed'"
              type="button"
              class="btn-primary btn-full"
              (click)="checkIn(booking, $event)"
              [disabled]="actionBookingId === booking.id"
            >
              Check In
            </button>
            <button
              *ngIf="booking.status === 'CheckedIn'"
              type="button"
              class="btn-outline btn-full"
              (click)="undoCheckIn(booking, $event)"
              [disabled]="actionBookingId === booking.id"
            >
              Undo Check-In
            </button>
          </div>
        </div>

        <div class="pagination" *ngIf="totalPages > 1">
          <button class="btn-ghost pagination__button" type="button" (click)="previousPage()" [disabled]="currentPage <= 1 || isLoading">
            Previous
          </button>
          <span class="pagination__page">Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="btn-ghost pagination__button" type="button" (click)="nextPage()" [disabled]="currentPage >= totalPages || isLoading">
            Next
          </button>
        </div>
      </section>
    </ng-container>

    <ng-template #emptyState>
      <app-empty-state
        icon="calendar-outline"
        title="No bookings found"
        description="There are no bookings for the selected date and filters."
      ></app-empty-state>
    </ng-template>
  `,
  styleUrl: './staff-bookings.page.scss'
})
export class StaffBookingsPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);
  private readonly realtime = inject(ClinicDashboardRealtimeService);
  private readonly destroyRef = inject(DestroyRef);

  doctors: Array<{ id: string; fullName: string }> = [];
  bookings: Booking[] = [];
  isLoading = false;
  actionBookingId: string | null = null;
  doctorFilter = '';
  statusFilter: StaffTodayStatus = 'all';
  currentPage = 1;
  pageSize = 20;
  totalPages = 1;
  selectedDate: string = this.toLocalIsoDate();

  get dateValue(): string {
    return this.selectedDate;
  }
  set dateValue(value: string) {
    this.selectedDate = value;
  }

  readonly statuses: Array<{ label: string; value: StaffTodayStatus }> = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Booked', value: 'Confirmed' },
    { label: 'Confirmed', value: 'CheckedIn' },
    { label: 'Completed', value: 'Completed' },
    { label: 'No Show', value: 'NoShow' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  ngOnInit(): void {
    const initialStatus = this.route.snapshot.queryParamMap.get('status');
    if (initialStatus && this.statuses.some((status) => status.value === initialStatus)) {
      this.statusFilter = initialStatus as StaffTodayStatus;
    }

    this.apiService.get<any[]>('doctors').subscribe({
      next: (doctors) => {
        this.doctors = doctors.map((doctor) => ({ id: doctor.id, fullName: doctor.fullName }));
      },
      error: () => {
        this.doctors = [];
      }
    });

    this.loadBookings();

    this.realtime.events$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: any) => {
        const name = event.eventName;
        if (
          name === 'BookingCreated' ||
          name === 'BookingCancelled' ||
          name === 'PatientCheckedIn' ||
          name === 'PatientCheckInUndone' ||
          name === 'DoctorCompletedConsultation' ||
          name === 'PaymentCompleted' ||
          name === 'PaymentWaived'
        ) {
          this.loadBookings();
        }
      });
  }

  onDateChanged(): void {
    this.currentPage = 1;
    this.loadBookings();
  }

  onFiltersChanged(): void {
    this.currentPage = 1;
    this.loadBookings();
  }

  refresh(): void {
    this.loadBookings();
  }

  previousPage(): void {
    if (this.currentPage <= 1 || this.isLoading) {
      return;
    }

    this.currentPage -= 1;
    this.loadBookings();
  }

  nextPage(): void {
    if (this.currentPage >= this.totalPages || this.isLoading) {
      return;
    }

    this.currentPage += 1;
    this.loadBookings();
  }

  openBooking(bookingId: string, event?: Event): void {
    event?.stopPropagation();
    void this.router.navigate(['/staff/bookings', bookingId]);
  }

  checkIn(booking: Booking, event?: Event): void {
    event?.stopPropagation();
    this.actionBookingId = booking.id;
    this.apiService.patch('bookings/' + booking.id + '/check-in', {}).subscribe({
      next: async () => {
        this.actionBookingId = null;
        this.loadBookings();
        await this.presentToast('Patient checked in.', 'success');
      },
      error: async (error) => {
        this.actionBookingId = null;
        await this.presentToast(extractApiErrorMessage(error, 'Failed to check in booking.'), 'danger');
      }
    });
  }

  undoCheckIn(booking: Booking, event?: Event): void {
    event?.stopPropagation();
    this.actionBookingId = booking.id;
    this.apiService.patch('bookings/' + booking.id + '/undo-check-in', {}).subscribe({
      next: async () => {
        this.actionBookingId = null;
        this.loadBookings();
        await this.presentToast('Check-in undone.', 'success');
      },
      error: async (error) => {
        this.actionBookingId = null;
        await this.presentToast(extractApiErrorMessage(error, 'Failed to undo check-in.'), 'danger');
      }
    });
  }

  servicesLabel(booking: Booking): string {
    return servicesLabel(booking);
  }

  bookingStatusLabel(status: StaffTodayStatus | Booking['status']): string {
    switch (status) {
      case 'Confirmed':
        return 'Booked';
      case 'CheckedIn':
        return 'Confirmed';
      case 'Completed':
        return 'Completed';
      case 'Cancelled':
        return 'Cancelled';
      case 'NoShow':
        return 'No Show';
      case 'Pending':
        return 'Pending';
      case 'ProofSubmitted':
        return 'Proof Submitted';
      case 'OnHold':
        return 'On Hold';
      case 'Expired':
        return 'Expired';
      case 'Rescheduled':
        return 'Rescheduled';
      case 'InProgress':
        return 'In Progress';
      default:
        return String(status);
    }
  }

  timeRangeLabel(booking: Booking): string {
    return timeRangeLabel(booking);
  }

  private loadBookings(): void {
    this.isLoading = true;
    this.apiService.get<any>('bookings/staff/all?page=' + this.currentPage + '&pageSize=' + this.pageSize).subscribe({
      next: (data: any) => {
        const rows = (data?.items ?? data ?? []) as Record<string, unknown>[];
        const items = rows
          .map((row) => normalizeStaffBookingRow(row))
          .filter((booking): booking is Booking => Boolean(booking));
        this.bookings = items;
        this.totalPages = Math.max(1, Math.ceil((data?.totalCount ?? items.length) / this.pageSize));
        this.isLoading = false;
      },
      error: async (error) => {
        this.bookings = [];
        this.totalPages = 1;
        this.isLoading = false;
        await this.presentToast(extractApiErrorMessage(error, 'Failed to load bookings.'), 'danger');
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

  private toLocalIsoDate(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
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

  return booking.serviceName?.trim() || 'Service';
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

function normalizeStaffBookingRow(row: Record<string, unknown>): Booking | undefined {
  const id = trimOptionalString(row['id'] ?? row['booking_id'] ?? row['bookingId']);
  if (!id) {
    return undefined;
  }

  const services = Array.isArray(row['services'])
    ? (row['services'] as unknown[])
        .map((item) => (isRecord(item) ? trimOptionalString(item['service_name']) ?? trimOptionalString(item['name']) : undefined))
        .filter((value): value is string => Boolean(value))
    : [];

  const serviceNames = normalizeStringArray(row['serviceNames'] ?? row['service_names']);
  const serviceName = trimOptionalString(row['serviceName'] ?? row['service_name']) ?? services[0] ?? serviceNames[0];

  return {
    id,
    patientId: trimOptionalString(row['patientId'] ?? row['patient_id']) ?? '',
    patientName: trimOptionalString(row['patientName'] ?? row['patient_name']) ?? 'Patient',
    doctorId: trimOptionalString(row['doctorId'] ?? row['doctor_id']) ?? '',
    doctorName: trimOptionalString(row['doctorName'] ?? row['doctor_name']) ?? 'Doctor',
    serviceId: trimOptionalString(row['serviceId'] ?? row['service_id']) ?? '',
    serviceIds: normalizeStringArray(row['serviceIds'] ?? row['service_ids']),
    serviceName,
    serviceNames: serviceNames.length > 0 ? serviceNames : (serviceName ? [serviceName] : []),
    services: services.length > 0 ? services.map((name) => ({ id: name, name })) : [],
    appointmentDate: trimOptionalString(row['appointmentDate'] ?? row['appointment_date']) ?? '',
    slotStartTime: trimOptionalString(row['slotStartTime'] ?? row['slot_start_time']) ?? '',
    slotEndTime: trimOptionalString(row['slotEndTime'] ?? row['slot_end_time']) ?? '',
    status: normalizeBookingStatus(row['booking_status'] ?? row['status']) ?? 'Confirmed',
    paymentStatus: normalizePaymentStatus(row['payment_status'] ?? row['paymentStatus']) ?? 'Unpaid',
    paymentMode: normalizePaymentMode(row['payment_mode'] ?? row['paymentMode']) ?? 'PayAtClinic',
    queueNumber: normalizeNullableNumber(row['queue_number'] ?? row['queueNumber']),
    totalFee: normalizeNumber(row['total_fee'] ?? row['totalFee']),
    finalAmount: normalizeNullableNumber(row['final_amount'] ?? row['finalAmount']),
    amountDue: normalizeNullableNumber(row['amount_due'] ?? row['amountDue']),
    consultationFeeSnapshot: normalizeNumber(row['consultation_fee_snapshot'] ?? row['consultationFeeSnapshot']),
    serviceFeeSnapshot: normalizeNumber(row['service_fee_snapshot'] ?? row['serviceFeeSnapshot']),
    isWalkIn: normalizeBoolean(row['is_walk_in'] ?? row['isWalkIn'], false),
    createdAt: trimOptionalString(row['created_at'] ?? row['createdAt']) ?? new Date().toISOString(),
    doctorCompletedAt: trimOptionalString(row['doctor_completed_at'] ?? row['doctorCompletedAt']),
    payment: undefined
  };
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
}

function normalizeBookingStatus(value: unknown): Booking['status'] | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? (normalized as Booking['status']) : undefined;
}

function normalizePaymentStatus(value: unknown): Booking['paymentStatus'] | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? (normalized as Booking['paymentStatus']) : undefined;
}

function normalizePaymentMode(value: unknown): Booking['paymentMode'] | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? (normalized as Booking['paymentMode']) : undefined;
}

function normalizeNumber(value: unknown, fallback = 0): number {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeNullableNumber(value: unknown): number | null {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : null;
}

function normalizeBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
    if (['false', '0', 'no', 'n'].includes(normalized)) return false;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return fallback;
}

function trimOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return fallback;
}

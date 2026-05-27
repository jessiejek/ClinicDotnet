import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Booking, Doctor } from '../../../core/models';
import { catchError, finalize, map, of } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DoctorStateService } from '../../../core/services/doctor-state.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-admin-calendar-page',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, EmptyStateComponent, SkeletonComponent],
  template: `
    <section class="page-shell">
      <div class="page-shell__header">
        <div>
          <h2 class="page-title">Calendar</h2>
          <p class="page-subtitle">Weekly overview of appointments grouped by doctor.</p>
        </div>
        <div class="week-nav">
          <button type="button" class="btn-ghost" (click)="shiftWeek(-1)">&lt; Prev Week</button>
          <strong>{{ weekLabel }}</strong>
          <button type="button" class="btn-ghost" (click)="shiftWeek(1)">Next Week &gt;</button>
        </div>
      </div>

      <app-skeleton *ngIf="isLoading" variant="card" [count]="2"></app-skeleton>

      <app-empty-state
        *ngIf="!isLoading && weekBookings.length === 0"
        icon="calendar-outline"
        title="No bookings this week"
        description="There are no appointments in the selected week."
      ></app-empty-state>

      <div class="calendar" *ngIf="!isLoading && weekBookings.length > 0">
        <div class="calendar__head">
          <div>Doctor</div>
          <div *ngFor="let day of weekDays">{{ day.label }}</div>
        </div>
        <div class="calendar__row" *ngFor="let doctor of doctors">
          <div class="calendar__doctor">{{ doctor.fullName }}</div>
          <div class="calendar__cell" *ngFor="let day of weekDays">
            <div class="calendar__booking" *ngFor="let booking of bookingsForCell(doctor.id, day.date)">
              <strong>{{ booking.patientName }}</strong>
              <span>{{ booking.slotStartTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './calendar.page.scss'
})
export class CalendarPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly doctorState = inject(DoctorStateService);

  bookings: Booking[] = [];
  doctors: Doctor[] = [];
  isLoading = false;
  currentWeekStart = this.startOfWeek(new Date());

  ngOnInit(): void {
    this.doctorState.doctors$.subscribe((doctors) => (this.doctors = doctors));
    this.loadBookings();
    this.loadDoctors();
  }

  get weekDays(): Array<{ label: string; date: string }> {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(this.currentWeekStart);
      date.setDate(date.getDate() + index);
      return { label: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }), date: this.isoDate(date) };
    });
  }

  get weekLabel(): string {
    const end = new Date(this.currentWeekStart);
    end.setDate(end.getDate() + 6);
    return `${this.currentWeekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }

  get weekBookings(): Booking[] {
    const start = this.isoDate(this.currentWeekStart);
    const end = new Date(this.currentWeekStart);
    end.setDate(end.getDate() + 6);
    const endIso = this.isoDate(end);
    return this.bookings.filter((booking) => booking.appointmentDate >= start && booking.appointmentDate <= endIso);
  }

  shiftWeek(offset: number): void {
    this.currentWeekStart = new Date(this.currentWeekStart);
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + offset * 7);
    this.currentWeekStart = this.startOfWeek(this.currentWeekStart);
  }

  bookingsForCell(doctorId: string, day: string): Booking[] {
    return this.weekBookings.filter((booking) => booking.doctorId === doctorId && booking.appointmentDate === day);
  }

  private loadBookings(): void {
    this.isLoading = true;
    this.apiService
      .get<any>('bookings')
      .pipe(
        map((data: any) => {
          const rows = (data?.items ?? data ?? []) as Record<string, unknown>[];
          return rows
            .map((row) => this.normalizeBookingRow(row))
            .filter((booking): booking is Booking => Boolean(booking));
        }),
        catchError((error: unknown) => {
          console.warn('Failed to load bookings:', error);
          return of([] as Booking[]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((bookings) => {
        this.bookings = bookings;
      });
  }

  private loadDoctors(): void {
    this.doctorState.setLoading(true);
    this.apiService
      .get<any[]>('doctors')
      .pipe(
        map((rows) => this.doctorState.normalizeDoctorRows(rows)),
        catchError((error: unknown) => {
          console.warn('Failed to load doctors:', error);
          return of([] as Doctor[]);
        }),
        finalize(() => this.doctorState.setLoading(false))
      )
      .subscribe((doctors) => {
        this.doctors = doctors;
        this.doctorState.setDoctors(doctors);
      });
  }

  private startOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay() || 7;
    start.setDate(start.getDate() - day + 1);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  private isoDate(date: Date): string {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 10);
  }

  private normalizeBookingRow(row: Record<string, unknown>): Booking | null {
    const id = this.asOptionalString(row['id'] ?? row['bookingId'] ?? row['booking_id']);
    if (!id) {
      return null;
    }

    const serviceNames = this.normalizeStringArray(row['serviceNames'] ?? row['service_names']);
    const serviceName = this.asOptionalString(row['serviceName'] ?? row['primary_service_name']) ?? serviceNames[0];

    return {
      id,
      patientId: this.asOptionalString(row['patientId'] ?? row['patient_id']) ?? '',
      patientName: this.asOptionalString(row['patientName'] ?? row['patient_name']) ?? 'Patient',
      doctorId: this.asOptionalString(row['doctorId'] ?? row['doctor_id']) ?? '',
      doctorName: this.asOptionalString(row['doctorName'] ?? row['doctor_name']) ?? 'Doctor',
      serviceId: this.asOptionalString(row['serviceId'] ?? row['primary_service_id']) ?? '',
      serviceIds: this.normalizeStringArray(row['serviceIds'] ?? row['service_ids']),
      serviceName: serviceName ?? '',
      serviceNames,
      services: [],
      appointmentDate: this.normalizeDateOnly(row['appointmentDate'] ?? row['appointment_date']),
      slotStartTime: this.normalizeTimeOnly(row['slotStartTime'] ?? row['slot_start_time']),
      slotEndTime: this.normalizeTimeOnly(row['slotEndTime'] ?? row['slot_end_time']),
      status: (this.asOptionalString(row['status'] ?? row['booking_status']) as Booking['status']) ?? 'Pending',
      paymentStatus: (this.asOptionalString(row['paymentStatus'] ?? row['payment_status']) as Booking['paymentStatus']) ?? 'Unpaid',
      paymentMode: (this.asOptionalString(row['paymentMode'] ?? row['payment_mode']) as Booking['paymentMode']) ?? 'PayAtClinic',
      queueNumber: this.normalizeNullableNumber(row['queueNumber'] ?? row['queue_number']),
      totalFee: this.normalizeNumber(row['totalFee'] ?? row['total_fee']),
      finalAmount: this.normalizeNullableNumber(row['finalAmount'] ?? row['final_amount']),
      amountDue: this.normalizeNullableNumber(row['amountDue'] ?? row['amount_due']),
      consultationFeeSnapshot: this.normalizeNumber(row['consultationFeeSnapshot'] ?? row['consultation_fee_snapshot']),
      serviceFeeSnapshot: this.normalizeNumber(row['serviceFeeSnapshot'] ?? row['service_fee_snapshot']),
      isWalkIn: this.normalizeBoolean(row['isWalkIn'] ?? row['is_walk_in']),
      createdAt: this.asOptionalString(row['createdAt'] ?? row['created_at']) ?? new Date().toISOString(),
      orNumber: this.asOptionalString(row['orNumber'] ?? row['or_number']),
      checkedInAt: this.asOptionalString(row['checkedInAt'] ?? row['checked_in_at']),
      doctorCompletedAt: this.asOptionalString(row['doctorCompletedAt'] ?? row['doctor_completed_at']),
      isProfessionalFeeWaived: this.normalizeBooleanOrUndefined(row['isProfessionalFeeWaived'] ?? row['is_professional_fee_waived']),
      professionalFeeWaivedReason: this.asOptionalString(row['professionalFeeWaivedReason'] ?? row['professional_fee_waived_reason'])
    };
  }

  private normalizeStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((item) => this.asOptionalString(item)).filter((item): item is string => Boolean(item));
  }

  private normalizeDateOnly(value: unknown): string {
    const raw = this.asOptionalString(value);
    return raw ? raw.slice(0, 10) : '';
  }

  private normalizeTimeOnly(value: unknown): string {
    const raw = this.asOptionalString(value);
    return raw ? raw.slice(0, 5) : '';
  }

  private normalizeNumber(value: unknown): number {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
  }

  private normalizeNullableNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
  }

  private normalizeBoolean(value: unknown): boolean {
    return value === true || value === 'true' || value === 1 || value === '1';
  }

  private normalizeBooleanOrUndefined(value: unknown): boolean | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    return this.normalizeBoolean(value);
  }

  private asOptionalString(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
  }
}

import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Booking, Patient, Service } from '../../../core/models';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ApiService } from '../../../core/services/api.service';
import { DoctorStateService } from '../../../core/services/doctor-state.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { PatientStateService } from '../../../core/services/patient-state.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

interface ConsultationVm {
  booking: Booking;
  patient: Patient;
  service: Service;
}

@Component({
  standalone: true,
  selector: 'app-doctor-consultation-stub-page',
imports: [AsyncPipe, DatePipe, NgIf, PageHeaderComponent, EmptyStateComponent],
  template: `
    <ng-container *ngIf="detail$ | async as detail; else notFound">
      <app-page-header
        title="Consultation Form"
        subtitle="Phase 9 placeholder"
        [showBackButton]="true"
        defaultBackHref="/doctor/appointments"
      ></app-page-header>

      <section class="clinic-card summary-grid">
        <div>
          <p class="section-label">Booking Summary</p>
          <h3>{{ detail.booking.id }}</h3>
          <p>{{ detail.booking.appointmentDate | date:'MMMM d, y (EEE)' }} {{ detail.booking.slotStartTime }}</p>
          <p>{{ detail.booking.status }} • {{ detail.booking.paymentStatus }}</p>
        </div>
        <div>
          <p class="section-label">Patient Summary</p>
          <h3>{{ detail.patient.firstName }} {{ detail.patient.lastName }}</h3>
          <p>{{ detail.patient.patientCode }}</p>
          <p>{{ detail.patient.contactNumber || 'No contact number' }}</p>
        </div>
      </section>

      <app-empty-state
        icon="document-text-outline"
        title="Consultation Form — Phase 9"
        description="SOAP notes, vital signs, diagnosis, prescriptions, labs, and follow-up scheduling will be implemented in Phase 9."
      ></app-empty-state>

      <div class="actions">
        <button type="button" class="btn-primary" (click)="backToAppointment(detail.booking.id)">Back to Appointment</button>
      </div>
    </ng-container>

    <ng-template #notFound>
      <app-empty-state
        icon="document-text-outline"
        title="Consultation unavailable"
        description="This consultation stub is only available for your own appointments."
        ctaLabel="Back to Appointments"
        ctaRoute="/doctor/appointments"
      ></app-empty-state>
    </ng-template>
  `,
  styleUrl: './doctor-consultation-stub.page.scss'
})
export class DoctorConsultationStubPage implements OnInit {
  private readonly authState = inject(AuthStateService);
  private readonly apiService = inject(ApiService);
  private readonly doctorState = inject(DoctorStateService);
  private readonly patientState = inject(PatientStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly mockData = inject(MockDataService);

  readonly detail$ = combineLatest([
    this.route.paramMap.pipe(map((paramMap) => paramMap.get('id') ?? '')),
    this.authState.currentUser$
  ]).pipe(
    switchMap(([bookingId, user]) =>
      bookingId && user
        ? combineLatest([
            this.apiService.get<any>('bookings/' + bookingId).pipe(
              map((data) => normalizeBookingSnapshot(data)),
              catchError(() => of(undefined))
            ),
            this.doctorState.getDoctorByUserId(user.id),
            this.patientState.getPatients()
          ])
        : of([undefined, undefined, []] as const)
    ),
    map(([booking, doctor, patients]) => {
      if (!booking || !doctor || booking.doctorId !== doctor.id) {
        return null;
      }
      const patient = patients.find((item) => item.id === booking.patientId);
      const service = this.mockData.getServiceById(booking.serviceId);
      if (!patient || !service) {
        return null;
      }
      return { booking, patient, service };
    })
  );

  ngOnInit(): void {
    // Stub only. The detail view is read-only until Phase 9.
  }

  backToAppointment(bookingId: string): void {
    void this.router.navigate(['/doctor/appointments', bookingId]);
  }
}

function normalizeBookingSnapshot(value: unknown): Booking | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const row = value as Record<string, unknown>;
  const id = normalizeOptionalString(asString(row['id'] ?? row['bookingId'] ?? row['booking_id']));
  if (!id) {
    return undefined;
  }

  return {
    id,
    patientId: normalizeOptionalString(asString(row['patientId'] ?? row['patient_id'])) ?? '',
    patientName: normalizeOptionalString(asString(row['patientName'] ?? row['patient_name'])),
    doctorId: normalizeOptionalString(asString(row['doctorId'] ?? row['doctor_id'])) ?? '',
    doctorName: normalizeOptionalString(asString(row['doctorName'] ?? row['doctor_name'])),
    serviceId: normalizeOptionalString(asString(row['serviceId'] ?? row['service_id'])) ?? '',
    serviceIds: [],
    serviceName: normalizeOptionalString(asString(row['serviceName'] ?? row['service_name'])) ?? '',
    serviceNames: [],
    services: [],
    appointmentDate: normalizeDateOnly(row['appointmentDate'] ?? row['appointment_date']),
    slotStartTime: normalizeTimeOnly(row['slotStartTime'] ?? row['slot_start_time']),
    slotEndTime: normalizeTimeOnly(row['slotEndTime'] ?? row['slot_end_time']),
    status: (normalizeOptionalString(asString(row['status'] ?? row['booking_status'])) as Booking['status']) ?? 'Pending',
    paymentStatus: (normalizeOptionalString(asString(row['paymentStatus'] ?? row['payment_status'])) as Booking['paymentStatus']) ?? 'Unpaid',
    paymentMode: (normalizeOptionalString(asString(row['paymentMode'] ?? row['payment_mode'])) as Booking['paymentMode']) ?? 'PayAtClinic',
    queueNumber: normalizeNullableNumber(row['queueNumber'] ?? row['queue_number']),
    totalFee: normalizeNumber(row['totalFee'] ?? row['total_fee']),
    finalAmount: normalizeNullableNumber(row['finalAmount'] ?? row['final_amount']),
    amountDue: normalizeNullableNumber(row['amountDue'] ?? row['amount_due']),
    consultationFeeSnapshot: normalizeNumber(row['consultationFeeSnapshot'] ?? row['consultation_fee_snapshot']),
    serviceFeeSnapshot: normalizeNumber(row['serviceFeeSnapshot'] ?? row['service_fee_snapshot']),
    isWalkIn: normalizeBoolean(row['isWalkIn'] ?? row['is_walk_in']),
    createdAt: normalizeOptionalString(asString(row['createdAt'] ?? row['created_at'])) ?? new Date().toISOString(),
    orNumber: normalizeOptionalString(asString(row['orNumber'] ?? row['or_number'])),
    checkedInAt: normalizeOptionalString(asString(row['checkedInAt'] ?? row['checked_in_at'])),
    doctorCompletedAt: normalizeOptionalString(asString(row['doctorCompletedAt'] ?? row['doctor_completed_at'])),
    isProfessionalFeeWaived: normalizeBooleanOrUndefined(row['isProfessionalFeeWaived'] ?? row['is_professional_fee_waived']),
    professionalFeeWaivedReason: normalizeOptionalString(asString(row['professionalFeeWaivedReason'] ?? row['professional_fee_waived_reason']))
  };
}

function normalizeOptionalString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeDateOnly(value: unknown): string {
  const raw = normalizeOptionalString(asString(value));
  return raw ? raw.slice(0, 10) : '';
}

function normalizeTimeOnly(value: unknown): string {
  const raw = normalizeOptionalString(asString(value));
  return raw ? raw.slice(0, 5) : '';
}

function normalizeNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function normalizeNullableNumber(value: unknown): number | null {
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

function normalizeBoolean(value: unknown): boolean {
  return value === true || value === 'true' || value === 1 || value === '1';
}

function normalizeBooleanOrUndefined(value: unknown): boolean | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  return normalizeBoolean(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

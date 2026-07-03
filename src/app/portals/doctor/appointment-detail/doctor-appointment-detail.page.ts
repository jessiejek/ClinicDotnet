import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Booking, Patient, Service } from '../../../core/models';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ApiService } from '../../../core/services/api.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PatientMediaPanelComponent } from '../../../shared/components/patient-media-panel/patient-media-panel.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  standalone: true,
  selector: 'app-doctor-appointment-detail-page',
  imports: [
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    NgFor,
    NgIf,
    PageHeaderComponent,
    EmptyStateComponent,
    PatientMediaPanelComponent,
    StatusBadgeComponent
  ],
  templateUrl: './doctor-appointment-detail.page.html',
  styleUrl: './doctor-appointment-detail.page.scss'
})
export class DoctorAppointmentDetailPage implements OnInit {
  private readonly authState = inject(AuthStateService);
  private readonly apiService = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly detail$ = combineLatest([
    this.route.paramMap.pipe(map((paramMap) => paramMap.get('id') ?? '')),
    this.authState.currentUser$
  ]).pipe(
    switchMap(([bookingId, user]) => {
      if (!bookingId || !user) {
        return of(null);
      }

      return this.apiService.get<any>('bookings/' + bookingId).pipe(
        map((data) => normalizeBookingSnapshot(data)),
        catchError(() => of(undefined)),
        map((booking) => {
          if (!booking || !isOwnedByLoggedInDoctor(booking, user.id)) {
            return null;
          }

          const patient = buildPatientFromBooking(booking);
          const service = buildFallbackService(booking);
          return { booking, patient, service };
        })
      );
    })
  );

  ngOnInit(): void {
    // Data is preloaded by the doctor portal resolver, so the detail view only needs to stay in sync.
  }

  openConsultation(bookingId: string, amend = false): void {
    void this.router.navigate(['/doctor/consultation', bookingId], amend ? { queryParams: { amend: '1' } } : undefined);
  }

  canOpenConsultation(booking: Booking): boolean {
    return booking.status === 'CheckedIn' || booking.status === 'InProgress' || booking.status === 'Completed';
  }

  back(): void {
    void this.router.navigate(['/doctor/appointments']);
  }

  patientName(patient: Patient): string {
    return `${patient.firstName} ${patient.lastName}`;
  }

  timeline(status: Booking['status']): Array<{ label: string; description: string; active: boolean }> {
    const steps = [
      { label: 'Confirmed', description: 'Booking is ready for consultation.' },
      { label: 'In Consultation', description: 'Consultation session in progress.' },
      { label: 'Completed', description: 'Visit has been completed.' }
    ];

    const activeIndex = status === 'Completed' ? 2 : status === 'Confirmed' ? 0 : -1;
    return steps.map((step, index) => ({
      ...step,
      active: index <= activeIndex
    }));
  }

  consultationActionLabel(booking: Booking): string {
    if (booking.status === 'Completed') {
      return 'View Consultation';
    }

    if (booking.status === 'CheckedIn' || booking.status === 'InProgress') {
      return 'Open Consultation';
    }

    return 'Appointment Ready';
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
    professionalFeeWaivedReason: normalizeOptionalString(asString(row['professionalFeeWaivedReason'] ?? row['professional_fee_waived_reason'])),
    doctor: (row['doctor'] ?? undefined) as any,
    patient: (row['patient'] ?? undefined) as any,
    service: (row['service'] ?? undefined) as any
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

function buildFallbackService(booking: Booking): Service {
  return {
    id: booking.serviceId || booking.id,
    name: booking.serviceName || booking.serviceNames?.[0] || 'Service',
    description: booking.serviceNames?.join(', '),
    estimatedDurationMinutes: 0,
    price: booking.consultationFeeSnapshot ?? 0,
    category: 'Consultation',
    doctorIds: booking.doctorId ? [booking.doctorId] : []
  };
}

function isOwnedByLoggedInDoctor(
  booking: Booking,
  currentUserId: string
): boolean {
  if (!booking) {
    return false;
  }

  if (booking.doctor?.userId && booking.doctor.userId === currentUserId) {
    return true;
  }

  if (booking.doctorId && booking.doctor?.id && booking.doctorId === booking.doctor.id) {
    return true;
  }

  return false;
}

function buildPatientFromBooking(booking: Booking): Patient {
  const fullName = booking.patientName?.trim() ?? booking.patient?.fullName?.trim() ?? '';
  const [firstName, ...rest] = fullName.split(/\s+/).filter(Boolean);

  return {
    id: booking.patientId,
    patientCode: booking.patient?.patientCode ?? booking.patientId,
    firstName: booking.patient?.firstName ?? firstName ?? 'Patient',
    middleName: booking.patient?.middleName,
    lastName: booking.patient?.lastName ?? rest.join(' '),
    dateOfBirth: booking.patient?.dateOfBirth ?? '',
    sex: booking.patient?.sex ?? '',
    contactNumber: booking.patient?.contactNumber,
    email: booking.patient?.email,
    isGuest: Boolean(booking.patient?.isGuest)
  };
}




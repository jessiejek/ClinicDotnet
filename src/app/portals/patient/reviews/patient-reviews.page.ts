import { DatePipe, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { firstValueFrom, catchError, combineLatest, map, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Booking, Patient } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { ReviewFormComponent } from '../components/review-form/review-form.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-patient-reviews-page',
  standalone: true,
  imports: [DatePipe, NgIf, ReviewFormComponent, EmptyStateComponent],
  template: `
    <section class="page-shell" *ngIf="booking; else emptyTpl">
      <div class="page-shell__header">
        <div>
          <button type="button" class="btn-ghost" (click)="back()">Back to Booking</button>
          <h2 class="page-title">Leave a Review</h2>
          <p class="page-subtitle data-mono">{{ booking.id }}</p>
        </div>
      </div>

      <div class="clinic-card review-card" *ngIf="canReview; else blockedTpl">
        <div class="section-heading">How was your visit?</div>
        <p *ngIf="submitError" class="error-message" style="color:var(--color-danger);margin-bottom:var(--space-2)">{{ submitError }}</p>
        <app-review-form (submitted)="submitReview($event.rating, $event.comment)" [disabled]="isSubmitting"></app-review-form>
      </div>

      <ng-template #blockedTpl>
        <app-empty-state
          icon="star-outline"
          title="Review unavailable"
          description="Only completed bookings without an existing review can be rated."
          ctaLabel="Back to Booking"
          (ctaClick)="back()"
        ></app-empty-state>
      </ng-template>
    </section>

    <ng-template #emptyTpl>
      <app-empty-state
        icon="calendar-outline"
        title="Booking not found"
        description="We could not load the booking you selected."
        ctaLabel="Back to Bookings"
        ctaRoute="/patient/bookings"
      ></app-empty-state>
    </ng-template>
  `,
  styleUrl: './patient-reviews.page.scss'
})
export class PatientReviewsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly toastCtrl = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);

  booking: Booking | null = null;
  currentPatient: Patient | null = null;
  hasExistingReview = false;
  isSubmitting = false;
  submitError = '';

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('bookingId') ?? '';
    combineLatest([
      this.api.get<any>('patients/me').pipe(catchError(() => of(undefined))),
      this.api.get<any>('bookings/' + bookingId).pipe(
        map((data) => normalizeBookingSnapshot(data)),
        catchError(() => of(undefined))
      )
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([patient, booking]) => {
        this.currentPatient = patient ?? null;
        this.booking =
          booking && this.currentPatient && (!booking.patientId || booking.patientId === this.currentPatient.id)
            ? booking
            : null;
        if (this.booking) {
          this.checkExistingReview(this.booking.id);
        }
      });
  }

  private async checkExistingReview(bookingId: string): Promise<void> {
    try {
      const data = await firstValueFrom(this.api.get('reviews?bookingId=' + bookingId));
      this.hasExistingReview = Array.isArray(data) && data.length > 0;
    } catch {
      console.warn('[PatientReviewsPage] reviews endpoint not available — assuming no existing review.');
      this.hasExistingReview = false;
    }
  }

  get canReview(): boolean {
    return !!this.booking && this.booking.status === 'Completed' && !this.hasExistingReview;
  }

  async submitReview(rating: number, comment: string): Promise<void> {
    if (!this.booking || !this.currentPatient) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const patientName = `${this.currentPatient.firstName} ${this.currentPatient.lastName}`;

    try {
      await firstValueFrom(this.api.post('reviews', {
        bookingId: this.booking.id,
        doctorId: this.booking.doctorId,
        patientId: this.currentPatient.id,
        rating,
        comment: comment || null,
        patientName: patientName
      }));
    } catch (err: any) {
      this.isSubmitting = false;
      this.submitError = 'Could not submit your review. Please try again later.';
      console.warn('[PatientReviewsPage] Could not save review:', err?.message ?? err);
      return;
    }

    this.isSubmitting = false;
    const toast = await this.toastCtrl.create({
      message: 'Review submitted.',
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
    void this.router.navigate(['/patient/bookings', this.booking.id]);
  }

  back(): void {
    if (!this.booking) {
      void this.router.navigate(['/patient/bookings']);
      return;
    }
    void this.router.navigate(['/patient/bookings', this.booking.id]);
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

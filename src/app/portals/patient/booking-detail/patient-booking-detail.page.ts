import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, IonIcon } from '@ionic/angular/standalone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, firstValueFrom, map, of, switchMap, throwError } from 'rxjs';
import { Booking, ReceiptData, Payment } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ReceiptModalComponent } from '../../../shared/components/receipt-modal/receipt-modal.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { BookingTimelineComponent } from '../components/booking-timeline/booking-timeline.component';

@Component({
  selector: 'app-patient-booking-detail-page',
  standalone: true,
  imports: [
    DatePipe,
    NgFor,
    NgIf,
    BookingTimelineComponent,
    ConfirmModalComponent,
    StatusBadgeComponent,
    EmptyStateComponent,
    ReceiptModalComponent,
    IonIcon
  ],
  template: `
    <section class="page-shell" *ngIf="booking; else emptyTpl">
      <div class="page-shell__header">
        <div>
          <button type="button" class="btn-ghost" (click)="back()">Back to Bookings</button>
          <h2 class="page-title">Booking Detail</h2>
          <p class="page-subtitle data-mono">{{ booking.id }}</p>
        </div>
      </div>

      <div class="booking-detail-grid">
        <div class="booking-detail-main">
          <div class="clinic-card booking-summary">
            <div class="booking-summary__top">
              <div>
                <div class="section-heading">Summary</div>
                <h3>{{ servicesDisplayName }}</h3>
                <p>{{ booking.doctorName || 'Doctor' }}</p>
              </div>
              <div class="booking-summary__badges">
                <app-status-badge [status]="displayStatus"></app-status-badge>
                <app-status-badge [status]="displayPaymentStatus"></app-status-badge>
              </div>
            </div>

            <div class="summary-grid">
              <div><span>Appointment Date</span><strong>{{ booking.appointmentDate | date : 'MMMM d, y (EEE)' }}</strong></div>
              <div><span>Time</span><strong>{{ timeRangeLabel }}</strong></div>
              <div><span>Queue Number</span><strong>{{ booking.queueNumber !== null ? '#' + booking.queueNumber : 'Not assigned' }}</strong></div>
              <div><span>Payment Mode</span><strong>{{ booking.paymentMode }}</strong></div>
              <div *ngIf="showAmountDue"><span>Amount Due</span><strong>PHP {{ booking.finalAmount }}</strong></div>
              <div *ngIf="isWaived"><span>Professional Fee</span><strong>Waived</strong></div>
              <div><span>Created</span><strong>{{ booking.createdAt | date : 'MMMM d, y (EEE) h:mm a' }}</strong></div>
            </div>

            <div class="clinic-card clinic-card--accent-green booking-summary__note">
              Payment will be settled at the clinic after consultation.
            </div>
          </div>

          <app-booking-timeline [booking]="booking"></app-booking-timeline>

          <div class="clinic-card payment-panel">
            <div class="section-heading">Payment Details</div>
            <div class="summary-grid summary-grid--compact">
              <div><span>Payment Status</span><strong>{{ displayPaymentStatus }}</strong></div>
              <div><span>Payment Method</span><strong>{{ booking.payment?.paymentMethod || booking.paymentMode }}</strong></div>
              <div *ngIf="showAmountDue"><span>Final Amount Due</span><strong>PHP {{ booking.finalAmount }}</strong></div>
              <div *ngIf="isWaived && booking.professionalFeeWaivedReason">
                <span>Waived Reason</span>
                <strong>{{ booking.professionalFeeWaivedReason }}</strong>
              </div>
            </div>
          </div>

          <div class="clinic-card" *ngIf="canViewReceipt">
            <div class="section-heading">Official Receipt</div>
            <p>Your payment has been recorded. You can open or print the clinic receipt.</p>
            <button type="button" class="btn-primary" (click)="openReceipt()">View Receipt</button>
          </div>

          <div class="clinic-card cancellation-panel" *ngIf="canCancelOnline; else cannotCancelTpl">
            <div class="section-heading">Cancellation</div>
            <p>This booking can still be cancelled online.</p>
            <button type="button" class="btn-danger" (click)="openCancelModal()">Cancel Booking</button>
          </div>
          <ng-template #cannotCancelTpl>
            <div class="clinic-card">
              <p>This booking can no longer be cancelled online. Please contact the clinic if you need help.</p>
            </div>
          </ng-template>
        </div>

        <div class="booking-detail-side">
          <div class="clinic-card">
            <div class="section-heading">Doctor Info</div>
            <p>{{ booking.doctorName || 'Doctor' }}</p>
          </div>

          <div class="clinic-card">
            <div class="section-heading">Services</div>
            <div class="detail-meta">
              <div *ngFor="let serviceName of serviceNamesToDisplay">
                <span>Service</span>
                <strong>{{ serviceName }}</strong>
              </div>
            </div>
          </div>

          <div class="clinic-card">
            <div class="section-heading">Quick Links</div>
            <div class="action-list">
              <button type="button" class="btn-ghost" style="width: 100%; text-align: left; padding-left: 0;" (click)="navigateToDocuments()">
                <ion-icon name="document-text-outline" style="margin-right: 8px; vertical-align: middle;"></ion-icon> My Documents
              </button>
              <button type="button" class="btn-ghost" style="width: 100%; text-align: left; padding-left: 0;" (click)="navigateToLabResults()">
                <ion-icon name="flask-outline" style="margin-right: 8px; vertical-align: middle;"></ion-icon> My Labs
              </button>
            </div>
          </div>
        </div>
      </div>

      <app-confirm-modal
        [isOpen]="cancelModalOpen"
        title="Cancel Booking"
        message="Confirm cancellation for this appointment?"
        confirmLabel="Cancel Booking"
        cancelLabel="Keep Booking"
        [isDanger]="true"
        (confirmed)="confirmCancel()"
        (cancelled)="cancelModalOpen = false"
      ></app-confirm-modal>

      <app-receipt-modal [isOpen]="receiptModalOpen" [data]="receiptData" (closed)="receiptModalOpen = false"></app-receipt-modal>
    </section>

    <ng-template #emptyTpl>
      <app-empty-state
        icon="calendar-outline"
        title="Booking not found"
        description="We could not load this booking or it does not belong to your account."
        ctaLabel="Back to Bookings"
        ctaRoute="/patient/bookings"
      ></app-empty-state>
    </ng-template>
  `,
  styleUrl: './patient-booking-detail.page.scss'
})
export class PatientBookingDetailPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastCtrl = inject(ToastController);

  receiptModalOpen = false;
  receiptData: ReceiptData | null = null;

  booking: Booking | null = null;
  cancelModalOpen = false;

  get displayStatus(): string {
    if (!this.booking) {
      return '-';
    }

    if (this.booking.status === 'Confirmed') {
      return 'Booked';
    }

    if (this.booking.status === 'CheckedIn') {
      return 'InClinic';
    }

    if (this.booking.status === 'Completed' && this.booking.paymentStatus === 'Unpaid') {
      return 'ForPayment';
    }

    if (this.booking.status === 'Completed' && this.isWaived) {
      return 'PFWaived';
    }

    if (this.booking.status === 'Completed' && this.booking.paymentStatus === 'Paid') {
      return 'CompletedPaid';
    }

    return this.booking.status;
  }

  get displayPaymentStatus(): string {
    if (!this.booking) {
      return '-';
    }

    return this.isWaived ? 'Waived' : this.booking.paymentStatus;
  }

  get isWaived(): boolean {
    return !!this.booking && (this.booking.isProfessionalFeeWaived === true || this.booking.paymentStatus === 'Waived');
  }

  get showAmountDue(): boolean {
    return !!this.booking && !this.isWaived && this.booking.finalAmount !== null && this.booking.finalAmount !== undefined;
  }

  get canCancelOnline(): boolean {
    if (!this.booking || ['Cancelled', 'Completed', 'NoShow', 'Expired'].includes(this.booking.status)) {
      return false;
    }

    return new Date(`${this.booking.appointmentDate}T${this.booking.slotStartTime}:00`).getTime() > Date.now();
  }

  get canViewReceipt(): boolean {
    return !!this.booking?.payment?.id && ['Paid', 'Waived'].includes(this.booking.paymentStatus);
  }

  get servicesDisplayName(): string {
    if (!this.booking) {
      return 'Service';
    }

    if (this.booking.serviceNames?.length) {
      return this.booking.serviceNames.join(', ');
    }

    const names = this.booking.services?.map((service) => service.name).filter((name) => name.trim().length > 0) ?? [];
    if (names.length > 0) {
      return names.join(', ');
    }

    return this.booking.serviceName?.trim() || 'Service';
  }

  get serviceNamesToDisplay(): string[] {
    if (!this.booking) {
      return [];
    }

    if (this.booking.serviceNames?.length) {
      return this.booking.serviceNames;
    }

    const names = this.booking.services?.map((service) => service.name).filter((name) => name.trim().length > 0) ?? [];
    if (names.length > 0) {
      return names;
    }

    return this.booking.serviceName?.trim() ? [this.booking.serviceName.trim()] : [];
  }

  get timeRangeLabel(): string {
    if (!this.booking) {
      return 'Time not available';
    }

    return this.timeRangeLabelFor(this.booking);
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const bookingId = params.get('id') ?? '';
          return combineLatest([
            this.apiService.get<any>('patients/me').pipe(catchError(() => of(undefined))),
            this.apiService.get<any>('bookings/' + bookingId).pipe(map((row) => normalizeBookingRow(row)))
          ]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([patient, booking]) => {
        if (!booking || !patient || (booking.patientId && booking.patientId !== patient.id)) {
          this.booking = null;
          return;
        }

        this.booking = booking;
      });
  }

  openCancelModal(): void {
    if (!this.canCancelOnline) {
      return;
    }

    this.cancelModalOpen = true;
  }

  confirmCancel(): void {
    if (!this.booking) {
      return;
    }

    void firstValueFrom(this.apiService.patch('bookings/' + this.booking.id + '/cancel', { reason: 'Cancelled by patient.' }));
    this.booking = {
      ...this.booking,
      status: 'Cancelled',
      cancellationReason: 'Cancelled by patient.'
    };
    this.cancelModalOpen = false;
    void this.presentToast('Booking cancelled.');
  }

  back(): void {
    void this.router.navigate(['/patient/bookings']);
  }

  navigateToDocuments(): void {
    void this.router.navigate(['/patient/documents'], { queryParams: { bookingId: this.booking?.id } });
  }

  navigateToLabResults(): void {
    void this.router.navigate(['/patient/lab-results'], { queryParams: { bookingId: this.booking?.id } });
  }

  async openReceipt(): Promise<void> {
    if (!this.booking?.payment?.id) {
      await this.presentToast('Receipt is not available yet.', 'warning');
      return;
    }

    try {
      this.receiptData = await firstValueFrom(
        this.apiService.get<any>('payments/' + this.booking.payment.id).pipe(
          switchMap((paymentData) => {
            const payment = paymentData ? normalizePaymentRow(paymentData as Record<string, unknown>) : undefined;
            if (!payment) {
              return of(buildEmptyReceipt());
            }

            const bookingId = payment.bookingId;
            return (bookingId ? this.apiService.get<any>('bookings/' + bookingId) : of(undefined)).pipe(
              map((bookingData) => {
                const booking = bookingData ? normalizeBookingRow(bookingData as Record<string, unknown>) : undefined;
                return buildReceiptFromPaymentAndBooking(payment, booking);
              })
            );
          }),
          catchError((error: unknown) =>
            throwError(() => new Error(extractApiErrorMessage(error, 'Failed to load receipt.')))
          )
        )
      );
      this.receiptModalOpen = true;
    } catch (error) {
      await this.presentToast(extractApiErrorMessage(error, 'Failed to load receipt.'), 'danger');
    }
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

  private timeRangeLabelFor(booking: Booking): string {
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
}

function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const body = (error as { error?: unknown }).error;
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (typeof body === 'object' && body !== null && 'message' in body) {
      const message = (body as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

function normalizeBookingRow(payload: unknown): Booking | null {
  const row = isRecord(payload) ? payload : null;
  if (!row) {
    return null;
  }

  const id = trimOptionalString(row['id'] ?? row['bookingId'] ?? row['booking_id']);
  if (!id) {
    return null;
  }

  const services = normalizeServices(row['services']);
  const serviceNames = normalizeStringArray(row['serviceNames'] ?? row['service_names']);
  const serviceIds = normalizeStringArray(row['serviceIds'] ?? row['service_ids']);
  const serviceName = trimOptionalString(row['serviceName'] ?? row['primary_service_name']) ?? serviceNames[0];
  const serviceId = trimOptionalString(row['serviceId'] ?? row['primary_service_id']) ?? serviceIds[0] ?? '';
  const payment = normalizePaymentRow(row['payment']);

  return {
    id,
    patientId: trimOptionalString(row['patientId'] ?? row['patient_id']) ?? '',
    patientName: trimOptionalString(row['patientName'] ?? row['patient_name']) ?? 'Patient',
    doctorId: trimOptionalString(row['doctorId'] ?? row['doctor_id']) ?? '',
    doctorName: trimOptionalString(row['doctorName'] ?? row['doctor_name']) ?? 'Doctor',
    serviceId,
    serviceIds: serviceIds.length > 0 ? serviceIds : serviceId ? [serviceId] : [],
    serviceName,
    serviceNames: serviceNames.length > 0 ? serviceNames : serviceName ? [serviceName] : [],
    services: services.length > 0 ? services : undefined,
    appointmentDate: normalizeDateOnly(row['appointmentDate'] ?? row['appointment_date']),
    slotStartTime: normalizeTimeOnly(row['slotStartTime'] ?? row['slot_start_time']),
    slotEndTime: normalizeTimeOnly(row['slotEndTime'] ?? row['slot_end_time']) || normalizeTimeOnly(row['slotStartTime'] ?? row['slot_start_time']),
    status: (trimOptionalString(row['status'] ?? row['booking_status']) as Booking['status']) ?? 'Pending',
    paymentStatus: payment?.status ?? (trimOptionalString(row['paymentStatus'] ?? row['payment_status']) as Booking['paymentStatus']) ?? 'Unpaid',
    paymentMode: (trimOptionalString(row['paymentMode'] ?? row['payment_mode']) as Booking['paymentMode']) ?? 'PayAtClinic',
    queueNumber: normalizeNullableNumber(row['queueNumber'] ?? row['queue_number']),
    totalFee: normalizeNumber(row['totalFee'] ?? row['total_fee']),
    finalAmount: normalizeNullableNumber(row['finalAmount'] ?? row['final_amount']),
    amountDue: normalizeNullableNumber(row['amountDue'] ?? row['amount_due']),
    consultationFeeSnapshot: normalizeNumber(row['consultationFeeSnapshot'] ?? row['consultation_fee_snapshot']),
    serviceFeeSnapshot: normalizeNumber(row['serviceFeeSnapshot'] ?? row['service_fee_snapshot']),
    isWalkIn: normalizeBoolean(row['isWalkIn'] ?? row['is_walk_in']),
    createdAt: trimOptionalString(row['createdAt'] ?? row['created_at']) ?? new Date().toISOString(),
    orNumber: trimOptionalString(row['orNumber'] ?? row['or_number']),
    checkedInAt: trimOptionalString(row['checkedInAt'] ?? row['checked_in_at']),
    doctorCompletedAt: trimOptionalString(row['doctorCompletedAt'] ?? row['doctor_completed_at']),
    isProfessionalFeeWaived: normalizeBooleanOrUndefined(row['isProfessionalFeeWaived'] ?? row['is_professional_fee_waived']),
    professionalFeeWaivedReason: trimOptionalString(row['professionalFeeWaivedReason'] ?? row['professional_fee_waived_reason']),
    payment: payment ?? undefined
  };
}

function normalizePaymentRow(payload: unknown): Payment | undefined {
  const row = isRecord(payload) ? payload : null;
  if (!row) {
    return undefined;
  }

  const id = trimOptionalString(row['id'] ?? row['paymentId']);
  const bookingId = trimOptionalString(row['bookingId'] ?? row['booking_id']);
  if (!id || !bookingId) {
    return undefined;
  }

  return {
    id,
    bookingId,
    amount: normalizeNumber(row['amount']),
    paymentMethod: (trimOptionalString(row['paymentMethod'] ?? row['payment_method']) as Payment['paymentMethod']) ?? 'PayAtClinic',
    referenceNumber: trimOptionalString(row['referenceNumber'] ?? row['reference_number']),
    proofImageUrl: trimOptionalString(row['proofImageUrl'] ?? row['proof_image_url']),
    status: (trimOptionalString(row['status']) as Payment['status']) ?? 'Unpaid',
    orNumber: trimOptionalString(row['orNumber'] ?? row['or_number']),
    verifiedByUserId: trimOptionalString(row['verifiedByUserId'] ?? row['verified_by_user_id']),
    verifiedAt: trimOptionalString(row['verifiedAt'] ?? row['verified_at']),
    verifiedByName: trimOptionalString(row['verifiedByName'] ?? row['verified_by_name']),
    cashierName: trimOptionalString(row['cashierName'] ?? row['cashier_name']),
    paidAt: trimOptionalString(row['paidAt'] ?? row['paid_at'] ?? row['verified_at']),
    waivedByUserId: trimOptionalString(row['waivedByUserId'] ?? row['waived_by_user_id']),
    waivedAt: trimOptionalString(row['waivedAt'] ?? row['waived_at']),
    waivedByName: trimOptionalString(row['waivedByName'] ?? row['waived_by_name']),
    waivedReason: trimOptionalString(row['waivedReason'] ?? row['waived_reason']),
    refundedByUserId: trimOptionalString(row['refundedByUserId'] ?? row['refunded_by_user_id']),
    refundedAt: trimOptionalString(row['refundedAt'] ?? row['refunded_at']),
    refundReason: trimOptionalString(row['refundReason'] ?? row['refund_reason'])
  };
}

function buildReceiptFromPaymentAndBooking(payment: Payment, booking: Booking | null | undefined): ReceiptData {
  const services = booking?.serviceNames?.length
    ? booking.serviceNames
    : booking?.serviceName
      ? [booking.serviceName]
      : [];

  return {
    bookingId: booking?.id ?? payment.bookingId ?? '',
    paymentId: payment.id ?? '',
    orNumber: payment.orNumber ?? '-',
    patientName: booking?.patientName ?? 'Patient',
    doctorName: booking?.doctorName ?? 'Doctor',
    services,
    appointmentDate: booking?.appointmentDate ?? '',
    slotStartTime: booking?.slotStartTime,
    doctorCompletedAt: booking?.doctorCompletedAt,
    paidAt: payment.paidAt,
    amountPaid: payment.amount,
    paymentMethod: payment.paymentMethod ?? 'Cash',
    referenceNumber: payment.referenceNumber,
    cashierName: payment.cashierName,
    verifiedByName: payment.verifiedByName,
    isWaived: payment.status === 'Waived',
    waivedReason: payment.waivedReason,
    waivedByName: payment.waivedByName,
    waivedAt: payment.waivedAt,
    totalFee: booking?.totalFee,
    consultationFee: booking?.consultationFeeSnapshot,
    serviceFee: booking?.serviceFeeSnapshot,
    queueNumber: booking?.queueNumber,
    paymentStatus: payment.status
  };
}

function buildEmptyReceipt(): ReceiptData {
  return {
    bookingId: '',
    paymentId: '',
    orNumber: '-',
    patientName: 'Patient',
    doctorName: 'Doctor',
    appointmentDate: '',
    paymentMethod: ''
  };
}

function normalizeServices(value: unknown): Array<{ id: string; name: string }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        const name = item.trim();
        return name ? { id: '', name } : undefined;
      }

      if (!isRecord(item)) {
        return undefined;
      }

      return {
        id: trimOptionalString(item['id']) ?? trimOptionalString(item['serviceId']) ?? '',
        name: trimOptionalString(item['name']) ?? trimOptionalString(item['serviceName']) ?? ''
      };
    })
    .filter((item): item is { id: string; name: string } => Boolean(item && (item.id || item.name)));
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => trimOptionalString(item)).filter((item): item is string => Boolean(item));
}

function normalizeDateOnly(value: unknown): string {
  const raw = trimOptionalString(value);
  if (!raw) {
    return '';
  }

  return raw.length >= 10 ? raw.slice(0, 10) : raw;
}

function normalizeTimeOnly(value: unknown): string {
  const raw = trimOptionalString(value);
  if (!raw) {
    return '';
  }

  return raw.length >= 5 ? raw.slice(0, 5) : raw;
}

function normalizeNumber(value: unknown, fallback = 0): number {
  const raw = trimOptionalString(value);
  if (!raw) {
    return fallback;
  }

  const num = Number(raw);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeNullableNumber(value: unknown): number | null {
  const raw = trimOptionalString(value);
  if (!raw) {
    return null;
  }

  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
}

function normalizeBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  const raw = trimOptionalString(value);
  if (!raw) {
    return false;
  }

  return raw.toLowerCase() === 'true' || raw === '1';
}

function normalizeBooleanOrUndefined(value: unknown): boolean | undefined {
  if (value == null) {
    return undefined;
  }

  return normalizeBoolean(value);
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

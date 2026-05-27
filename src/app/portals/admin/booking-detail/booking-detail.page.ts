import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone';
import { BaseComponent } from '../../../core/base/base.component';
import { Booking, Doctor, Patient, PaymentMethod, ReceiptData } from '../../../core/models';
import { ClinicSettingsService } from '../../../core/services/clinic-settings.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { RefundPaymentModalComponent } from '../components/refund-payment-modal/refund-payment-modal.component';
import { WaivePaymentModalComponent } from '../components/waive-payment-modal/waive-payment-modal.component';
import { ReceiptModalComponent } from '../../../shared/components/receipt-modal/receipt-modal.component';

type BookingAction =
  | 'confirm'
  | 'reject'
  | 'confirm-payment'
  | 'mark-complete'
  | 'mark-no-show'
  | 'cancel';

interface PatientDetails {
  firstName: string;
  middleName?: string;
  lastName: string;
  patientCode?: string;
  dateOfBirth?: string;
  contactNumber?: string;
  email?: string;
}

@Component({
  selector: 'app-admin-booking-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    NgIf,
    AvatarComponent,
    ConfirmModalComponent,
    EmptyStateComponent,
    SkeletonComponent,
    StatusBadgeComponent,
    WaivePaymentModalComponent,
    RefundPaymentModalComponent,
    ReceiptModalComponent
  ],
  template: `
    <section class="page-shell" *ngIf="isLoading; else loadedTpl">
      <app-skeleton variant="card" [count]="3"></app-skeleton>
    </section>

    <ng-template #loadedTpl>
      <section class="page-shell" *ngIf="booking; else emptyTpl">
      <div class="page-shell__header">
        <div>
          <button type="button" class="btn-ghost" (click)="goBack()">Back to Bookings</button>
          <h2 class="page-title">Booking Details</h2>
          <div class="page-subtitle data-mono">{{ booking.id }}</div>
        </div>
        <app-status-badge [status]="booking.status"></app-status-badge>
      </div>

      <div class="detail-grid">
        <div class="detail-grid__main">
          <div class="clinic-card">
            <div class="section-heading">Status Timeline</div>
            <div class="timeline">
              <div
                *ngFor="let step of timelineSteps"
                class="timeline__step"
                [class.is-active]="isStepActive(step)"
                [class.is-complete]="isStepComplete(step)"
              >
                <span class="timeline__dot"></span>
                <span>{{ step }}</span>
              </div>
            </div>
          </div>

          <div class="clinic-card">
            <div class="section-heading">Patient Info</div>
            <div class="profile-card">
              <app-avatar [name]="patientName" size="lg"></app-avatar>
              <div>
                <h3>{{ patientName }}</h3>
                <p>{{ patientDetails?.patientCode }}</p>
                <p>{{ patientDetails?.dateOfBirth }} · {{ patientDetails?.contactNumber }}</p>
                <p>{{ patientDetails?.email }}</p>
              </div>
            </div>
          </div>

          <div class="clinic-card">
            <div class="section-heading">Doctor Info</div>
            <div class="profile-card">
              <app-avatar [name]="(doctor?.fullName || 'Doctor')" size="lg"></app-avatar>
              <div>
                <h3>{{ doctor?.fullName }}</h3>
                <p>{{ doctor?.specialization }}</p>
              </div>
            </div>
          </div>

          <div class="detail-card-grid">
            <div class="clinic-card">
              <div class="section-heading">Appointment Details</div>
              <p><strong>Date:</strong> {{ booking.appointmentDate }}</p>
              <p><strong>Time:</strong> {{ booking.slotStartTime }} - {{ booking.slotEndTime }}</p>
              <p><strong>Queue#:</strong> {{ booking.queueNumber ?? '—' }}</p>
              <p><strong>Service:</strong> {{ serviceName }}</p>
            </div>
            <div class="clinic-card">
              <div class="section-heading">Payment Info</div>
              <p><strong>Mode:</strong> {{ booking.paymentMode }}</p>
              <p>
                <strong>Status:</strong>
                <app-status-badge [status]="booking.paymentStatus"></app-status-badge>
              </p>
              <p><strong>Total Fee:</strong> ₱{{ booking.totalFee }}</p>
              <p><strong>Consultation:</strong> ₱{{ booking.consultationFeeSnapshot }}</p>
              <p><strong>Service:</strong> ₱{{ booking.serviceFeeSnapshot }}</p>
              <p *ngIf="booking.proofType === 'ReferenceNumber'">Proof: {{ booking.proofValue }}</p>
              <p *ngIf="booking.proofType === 'Screenshot'">Screenshot: {{ booking.proofValue }}</p>
            </div>
          </div>
        </div>

        <aside class="detail-grid__side">
          <div class="clinic-card action-sidebar">
            <div class="section-heading">Actions</div>

            <ng-container [ngSwitch]="booking.status">
              <div *ngSwitchCase="'Pending'" class="action-stack">
                <button class="btn-primary" type="button" (click)="openConfirm('confirm')">Confirm Booking</button>
                <button class="btn-danger" type="button" (click)="openConfirm('reject', true)">Reject Booking</button>
              </div>

              <div *ngSwitchCase="'ProofSubmitted'" class="action-stack">
                <button class="btn-primary" type="button" (click)="openConfirm('confirm-payment')">Confirm Payment</button>
                <button class="btn-danger" type="button" (click)="openConfirm('reject', true)">Reject Proof</button>
              </div>

              <div *ngSwitchCase="'Confirmed'" class="action-stack">
                <button class="btn-primary" type="button" (click)="openConfirm('mark-complete')">Mark Complete</button>
                <button class="btn-ghost" type="button" (click)="openConfirm('mark-no-show')">Mark No Show</button>
                <button class="btn-outline" type="button" (click)="reschedule()">Reschedule</button>
                <button class="btn-danger" type="button" (click)="openConfirm('cancel', true)">Cancel Booking</button>
              </div>

              <div *ngSwitchCase="'Completed'" class="action-stack">
                <button class="btn-primary" type="button" (click)="openReceipt(booking)">Print Receipt</button>
                <button class="btn-outline" type="button" disabled (click)="soon('Visit Summary')">Download Visit Summary</button>
              </div>

              <div *ngSwitchDefault class="action-stack">
                <button class="btn-ghost" type="button" disabled>No actions available</button>
              </div>
            </ng-container>

            <div class="action-stack payment-actions" *ngIf="canWaive || canRefund">
              <button *ngIf="canWaive" class="btn-ghost" type="button" (click)="waiveModalOpen = true">
                Waive Payment
              </button>
              <button *ngIf="canRefund" class="btn-ghost" type="button" (click)="refundModalOpen = true">
                Refund Payment
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
    </ng-template>

    <ng-template #emptyTpl>
      <app-empty-state
        icon="calendar-outline"
        title="Booking not found"
        description="We could not load this booking record."
        ctaLabel="Back to Bookings"
        ctaRoute="/admin/bookings"
      ></app-empty-state>
    </ng-template>

    <app-confirm-modal
      [isOpen]="confirmOpen"
      [title]="modalTitle"
      [message]="modalMessage"
      [confirmLabel]="modalConfirmLabel"
      [isDanger]="modalDanger"
      [requireReason]="modalReasonRequired"
      (confirmed)="runAction($event)"
      (cancelled)="closeConfirmModal()"
    ></app-confirm-modal>

    <app-waive-payment-modal
      *ngIf="booking"
      [booking]="booking"
      [isOpen]="waiveModalOpen"
      (confirmed)="waivePayment($event.bookingId, $event.reason)"
      (cancelled)="waiveModalOpen = false"
    ></app-waive-payment-modal>

    <app-refund-payment-modal
      *ngIf="booking"
      [booking]="booking"
      [isOpen]="refundModalOpen"
      (confirmed)="refundPaymentAction($event.bookingId, $event.reason)"
      (cancelled)="refundModalOpen = false"
    ></app-refund-payment-modal>

    <app-receipt-modal [isOpen]="receiptModalOpen" [data]="receiptData" (closed)="receiptModalOpen = false"></app-receipt-modal>
  `,
  styleUrl: './booking-detail.page.scss'
})
export class BookingDetailPage extends BaseComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly localToastCtrl = inject(ToastController);
  private readonly clinicSettings = inject(ClinicSettingsService);
  private readonly authState = inject(AuthStateService);

  booking: Booking | null = null;
  doctor: { fullName?: string; specialization?: string } | null = null;
  patientDetails: PatientDetails | null = null;
  serviceName = '';
  timelineSteps = ['Pending', 'Proof Submitted', 'Confirmed', 'Completed'];
  isLoading = true;
  confirmOpen = false;
  waiveModalOpen = false;
  refundModalOpen = false;
  pendingAction: BookingAction | null = null;
  modalReasonRequired = false;
  modalDanger = false;
  modalTitle = 'Confirm Action';
  modalMessage = 'Are you sure?';
  modalConfirmLabel = 'Confirm';
  receiptModalOpen = false;
  receiptData: ReceiptData | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    void this.loadBooking(id);
  }

  private async loadBooking(id: string, trackLoading = true): Promise<void> {
    if (!id) {
      this.booking = null;
      this.doctor = null;
      this.serviceName = '';
      return;
    }

    if (trackLoading) {
      this.isLoading = true;
    }

    try {
      const data: unknown = await firstValueFrom(this.apiService.get('bookings/' + id));
      const booking = normalizeAdminBookingDetail(data);
      this.booking = booking;

      if (booking) {
        this.doctor = booking.doctor
          ? {
              fullName: booking.doctor.fullName,
              specialization: booking.doctor.specialization
            }
          : booking.doctorName
            ? { fullName: booking.doctorName }
            : null;

        this.serviceName = booking.serviceName || '—';
        await this.loadPatientDetails(booking.patientId);
      } else {
        this.doctor = null;
        this.serviceName = '';
      }
    } catch (err: any) {
      console.warn('Could not load booking details:', err?.message);
      this.booking = null;
      this.doctor = null;
      this.serviceName = '';
    } finally {
      if (trackLoading) {
        this.isLoading = false;
      }
    }
  }

  private async loadPatientDetails(patientId: string): Promise<void> {
    try {
      const data: any = await firstValueFrom(this.apiService.get('patients/' + patientId));

      if (data) {
        this.patientDetails = {
          firstName: data['first_name'] ?? '',
          middleName: data['middle_name'] ?? undefined,
          lastName: data['last_name'] ?? '',
          patientCode: data['patient_code'] ?? undefined,
          dateOfBirth: data['date_of_birth'] ?? undefined,
          contactNumber: data['contact_number'] ?? undefined,
          email: data['email'] ?? undefined
        };
      }
    } catch (err: any) {
      console.warn('Could not load patient details:', err?.message);
      if (this.booking) {
        this.patientDetails = {
          firstName: this.booking.patientName || '',
          lastName: '',
          patientCode: this.booking.patient?.patientCode
        };
      }
    }
  }

  get patientName(): string {
    if (this.patientDetails?.firstName || this.patientDetails?.lastName) {
      return [this.patientDetails.firstName, this.patientDetails.lastName].filter(Boolean).join(' ');
    }
    return this.booking?.patientName || 'Unknown Patient';
  }

  get canWaive(): boolean {
    return !!this.booking && this.booking.paymentStatus === 'Unpaid';
  }

  get canRefund(): boolean {
    return !!this.booking && this.booking.paymentStatus === 'Paid';
  }

  goBack(): void {
    void this.router.navigate(['/admin/bookings']);
  }

  isStepActive(step: string): boolean {
    const map: Record<string, Booking['status']> = {
      Pending: 'Pending',
      'Proof Submitted': 'ProofSubmitted',
      Confirmed: 'Confirmed',
      Completed: 'Completed'
    };
    return this.booking?.status === map[step];
  }

  isStepComplete(step: string): boolean {
    const order = ['Pending', 'Proof Submitted', 'Confirmed', 'Completed'];
    const currentIdx = order.findIndex((item) => this.isStepActive(item));
    return order.indexOf(step) < currentIdx;
  }

  openConfirm(action: BookingAction, reasonRequired = false): void {
    this.pendingAction = action;
    this.modalReasonRequired = reasonRequired;
    this.modalDanger = reasonRequired || action === 'reject' || action === 'cancel';
    this.modalConfirmLabel = this.modalDanger ? 'Proceed' : 'Confirm';
    const messages: Record<BookingAction, { title: string; message: string }> = {
      confirm: { title: 'Confirm Booking', message: 'Confirm this booking and notify the patient?' },
      reject: { title: 'Reject Booking', message: 'Reject this booking? The patient will be notified.' },
      'confirm-payment': { title: 'Confirm Payment', message: 'Mark payment as validated?' },
      'mark-complete': { title: 'Mark Complete', message: 'Mark this visit as completed?' },
      'mark-no-show': { title: 'Mark No Show', message: 'Mark patient as no-show?' },
      cancel: { title: 'Cancel Booking', message: 'Cancel this booking? This cannot be undone.' }
    };
    const info = messages[action];
    this.modalTitle = info.title;
    this.modalMessage = info.message;
    this.confirmOpen = true;
  }

  closeConfirmModal(): void {
    this.confirmOpen = false;
    this.pendingAction = null;
  }

  async runAction(reason?: string): Promise<void> {
    const action = this.pendingAction;
    if (!action || !this.booking) return;

    this.confirmOpen = false;
    this.isLoading = true;

    try {
      const bookingId = this.booking.id;
      const currentUserId = this.authState.currentUser()?.id;

      switch (action) {
        case 'confirm':
          await firstValueFrom(this.apiService.patch('bookings/' + bookingId + '/confirm', {}));
          await this.recordAuditLog(bookingId, 'Confirmed booking', currentUserId, reason);
          break;
        case 'reject':
          await firstValueFrom(this.apiService.patch('bookings/' + bookingId + '/cancel', { reason: reason || 'Rejected by admin' }));
          await this.recordAuditLog(bookingId, 'Rejected booking', currentUserId, reason);
          break;
        case 'confirm-payment':
          await firstValueFrom(this.apiService.patch('bookings/' + bookingId + '/confirm', {}));
          await this.recordAuditLog(bookingId, 'Confirmed payment', currentUserId, reason);
          break;
        case 'mark-complete':
          await firstValueFrom(this.apiService.patch('bookings/' + bookingId + '/complete', {}));
          await this.recordAuditLog(bookingId, 'Marked completed', currentUserId, reason);
          break;
        case 'mark-no-show':
          await firstValueFrom(this.apiService.patch('bookings/' + bookingId + '/no-show', {}));
          await this.recordAuditLog(bookingId, 'Marked no-show', currentUserId, reason);
          break;
        case 'cancel':
          await firstValueFrom(this.apiService.patch('bookings/' + bookingId + '/cancel', { reason: reason || 'Cancelled by admin' }));
          await this.recordAuditLog(bookingId, 'Cancelled booking', currentUserId, reason);
          break;
      }

      await this.showToast('Booking updated successfully', 'success');
      await this.refreshBooking();
    } catch (err: any) {
      await this.showToast(err?.message || 'Action failed', 'danger');
    } finally {
      this.isLoading = false;
      this.pendingAction = null;
    }
  }

  private async recordAuditLog(
    entityId: string,
    action: string,
    performedBy?: string,
    details?: string
  ): Promise<void> {
    try {
      await firstValueFrom(this.apiService.post('audit-logs', { entityType: 'Booking', entityId, action, performedBy, details }));
    } catch (err: any) {
      console.warn('Failed to record audit log:', err?.message);
    }
  }

  private async refreshBooking(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    await this.loadBooking(id, false);
  }

  async waivePayment(bookingId: string, reason: string): Promise<void> {
    this.waiveModalOpen = false;
    this.isLoading = true;
    try {
      await firstValueFrom(this.apiService.put('bookings/' + bookingId + '/waive', { reason }));

      await this.recordAuditLog(
        bookingId,
        'Waived payment',
        this.authState.currentUser()?.id,
        reason
      );
      await this.showToast('Payment waived successfully', 'success');
      await this.refreshBooking();
    } catch (err: any) {
      await this.showToast(err?.message || 'Failed to waive payment', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async refundPaymentAction(bookingId: string, reason: string): Promise<void> {
    this.refundModalOpen = false;
    this.isLoading = true;
    try {
      await firstValueFrom(this.apiService.put('bookings/' + bookingId + '/refund', { reason }));

      await this.recordAuditLog(
        bookingId,
        'Refunded payment',
        this.authState.currentUser()?.id,
        reason
      );
      await this.showToast('Payment refunded', 'success');
      await this.refreshBooking();
    } catch (err: any) {
      await this.showToast(err?.message || 'Failed to refund payment', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  reschedule(): void {
    void this.router.navigate(['/admin/bookings', this.booking?.id, 'reschedule']);
  }

  openReceipt(booking: Booking): void {
    this.buildReceiptData(booking);
    this.receiptModalOpen = true;
  }

  private buildReceiptData(booking: Booking): void {
    const settings = this.clinicSettings.load();
    this.receiptData = {
      appointmentDate: booking.appointmentDate || '',
      patientName: this.patientName,
      patientCode: this.patientDetails?.patientCode || '',
      doctorName: this.doctor?.fullName || booking.doctorName || '',
      serviceName: this.serviceName,
      orNumber: `RCP-${booking.id?.slice(0, 8).toUpperCase()}`, // receiptNumber
      totalFee: booking.totalFee,
      paymentMethod: booking.paymentMode || 'PayAtClinic',
      paymentStatus: booking.paymentStatus || 'Unpaid',
      clinicName: settings?.clinicName || 'Clinic',
      clinicAddress: settings?.address || '',
      consultationFee: booking.consultationFeeSnapshot,
      serviceFee: booking.serviceFeeSnapshot,
      queueNumber: booking.queueNumber,
      slotTime: `${booking.slotStartTime} - ${booking.slotEndTime}`
    };
  }

  closeReceiptModal(): void {
    this.receiptModalOpen = false;
  }

  soon(feature?: string): void {
    void this.showToast(`${feature || 'This feature'} is coming soon`, 'danger' as any);
  }

  private async showInlineToast(message: string, color: 'success' | 'danger' | 'warning'): Promise<void> {
    const toast = await this.localToastCtrl.create({ message, color, duration: 3000, position: 'bottom' });
    await toast.present();
  }
}

function normalizeAdminBookingDetail(payload: unknown): Booking | null {
  const row = isRecord(payload) ? payload : null;
  if (!row) {
    return null;
  }

  const id = trimOptionalString(row['id'] ?? row['bookingId'] ?? row['booking_id']);
  if (!id) {
    return null;
  }

  const patient = normalizeBookingPatient(row['patient']);
  const doctor = normalizeBookingDoctor(row['doctor']);
  const payment = normalizePaymentRecord(row['payment']);
  const appointmentDate = trimOptionalString(row['appointmentDate'] ?? row['appointment_date']) ?? '';
  const slotStartTime = trimOptionalString(row['slotStartTime'] ?? row['slot_start_time']) ?? '';
  const slotEndTime = trimOptionalString(row['slotEndTime'] ?? row['slot_end_time']) ?? slotStartTime;
  const serviceId = trimOptionalString(row['serviceId'] ?? row['service_id']) ?? '';
  const serviceName = trimOptionalString(row['serviceName'] ?? row['service_name']);

  return {
    id,
    patientId: trimOptionalString(row['patientId'] ?? row['patient_id']) ?? patient?.id ?? '',
    patientName: trimOptionalString(row['patientName'] ?? row['patient_name']) ?? patient?.fullName ?? '',
    doctorId: trimOptionalString(row['doctorId'] ?? row['doctor_id']) ?? doctor?.id ?? '',
    doctorName: trimOptionalString(row['doctorName'] ?? row['doctor_name']) ?? doctor?.fullName ?? '',
    serviceId,
    serviceIds: serviceId ? [serviceId] : [],
    serviceName,
    serviceNames: serviceName ? [serviceName] : [],
    services: [],
    appointmentDate,
    slotStartTime,
    slotEndTime,
    status: normalizeBookingStatus(row['status'] ?? row['booking_status']) ?? 'Pending',
    paymentStatus: normalizePaymentStatus(row['paymentStatus'] ?? row['payment_status']) ?? payment?.status ?? 'Unpaid',
    paymentMode: normalizePaymentMode(row['paymentMode'] ?? row['payment_mode']) ?? 'PayAtClinic',
    queueNumber: normalizeNullableNumber(row['queueNumber'] ?? row['queue_number']),
    totalFee: normalizeNumber(row['totalFee'] ?? row['total_fee']),
    finalAmount: normalizeNullableNumber(row['finalAmount'] ?? row['final_amount']),
    amountDue: normalizeNullableNumber(row['amountDue'] ?? row['amount_due']),
    consultationFeeSnapshot: normalizeNumber(row['consultationFeeSnapshot'] ?? row['consultation_fee_snapshot']),
    serviceFeeSnapshot: normalizeNumber(row['serviceFeeSnapshot'] ?? row['service_fee_snapshot']),
    isWalkIn: normalizeBoolean(row['isWalkIn'] ?? row['is_walk_in'], false),
    proofType: normalizeProofType(row['proofType'] ?? row['proof_type']),
    proofValue: trimOptionalString(row['proofValue'] ?? row['proof_value']),
    proofSubmittedAt: trimOptionalString(row['proofSubmittedAt'] ?? row['proof_submitted_at']),
    cancellationReason: trimOptionalString(row['cancellationReason'] ?? row['cancellation_reason']),
    notes: trimOptionalString(row['notes']),
    rescheduledFromBookingId: trimOptionalString(row['rescheduledFromBookingId'] ?? row['rescheduled_from_booking_id']),
    receiptUrl: trimOptionalString(row['receiptUrl'] ?? row['receipt_url']),
    createdAt: trimOptionalString(row['createdAt'] ?? row['created_at']) ?? new Date().toISOString(),
    orNumber: trimOptionalString(row['orNumber'] ?? row['or_number']) ?? payment?.orNumber,
    checkedInAt: trimOptionalString(row['checkedInAt'] ?? row['checked_in_at']),
    doctorCompletedAt: trimOptionalString(row['doctorCompletedAt'] ?? row['doctor_completed_at']),
    isProfessionalFeeWaived: normalizeBooleanOrUndefined(row['isProfessionalFeeWaived'] ?? row['is_professional_fee_waived']),
    professionalFeeWaivedReason: trimOptionalString(row['professionalFeeWaivedReason'] ?? row['professional_fee_waived_reason']),
    patient,
    doctor,
    payment
  };
}

function normalizeBookingPatient(payload: unknown): Booking['patient'] | undefined {
  const row = isRecord(payload) ? payload : null;
  if (!row) {
    return undefined;
  }

  const id = trimOptionalString(row['id'] ?? row['patientId']);
  if (!id) {
    return undefined;
  }

  return {
    id,
    patientCode: trimOptionalString(row['patientCode'] ?? row['patient_code']),
    firstName: trimOptionalString(row['firstName'] ?? row['first_name']),
    middleName: trimOptionalString(row['middleName'] ?? row['middle_name']),
    lastName: trimOptionalString(row['lastName'] ?? row['last_name']),
    fullName: trimOptionalString(row['fullName'] ?? row['full_name']),
    dateOfBirth: trimOptionalString(row['dateOfBirth'] ?? row['date_of_birth']),
    sex: trimOptionalString(row['sex']),
    contactNumber: trimOptionalString(row['contactNumber'] ?? row['contact_number']),
    email: trimOptionalString(row['email']),
    isGuest: normalizeBooleanOrUndefined(row['isGuest'] ?? row['is_guest'])
  };
}

function normalizeBookingDoctor(payload: unknown): Booking['doctor'] | undefined {
  const row = isRecord(payload) ? payload : null;
  if (!row) {
    return undefined;
  }

  const id = trimOptionalString(row['id'] ?? row['doctorId']);
  if (!id) {
    return undefined;
  }

  return {
    id,
    userId: trimOptionalString(row['userId'] ?? row['user_id']),
    fullName: trimOptionalString(row['fullName'] ?? row['full_name']),
    specialization: trimOptionalString(row['specialization']),
    consultationFee: normalizeNullableNumber(row['consultationFee'] ?? row['consultation_fee']) ?? undefined,
    status: trimOptionalString(row['status']),
    profilePhotoUrl: trimOptionalString(row['profilePhotoUrl'] ?? row['profile_photo_url'])
  };
}

function normalizePaymentRecord(payload: unknown): Booking['payment'] | undefined {
  const row = isRecord(payload) ? payload : null;
  if (!row) {
    return undefined;
  }

  const id = trimOptionalString(row['id']);
  const bookingId = trimOptionalString(row['bookingId'] ?? row['booking_id']);
  if (!id || !bookingId) {
    return undefined;
  }

  return {
    id,
    bookingId,
    amount: normalizeNumber(row['amount']),
    paymentMethod: normalizePaymentMethod(row['paymentMethod'] ?? row['payment_method']) ?? 'PayAtClinic',
    referenceNumber: trimOptionalString(row['referenceNumber'] ?? row['reference_number']),
    proofImageUrl: trimOptionalString(row['proofImageUrl'] ?? row['proof_image_url']),
    status: normalizePaymentStatus(row['status']) ?? 'Unpaid',
    orNumber: trimOptionalString(row['orNumber'] ?? row['or_number']),
    verifiedByUserId: trimOptionalString(row['verifiedByUserId'] ?? row['verified_by_user_id']),
    verifiedAt: trimOptionalString(row['verifiedAt'] ?? row['verified_at']),
    verifiedByName: trimOptionalString(row['verifiedByName'] ?? row['verified_by_name']),
    cashierName: trimOptionalString(row['cashierName'] ?? row['cashier_name']),
    paidAt: trimOptionalString(row['paidAt'] ?? row['paid_at']),
    waivedByUserId: trimOptionalString(row['waivedByUserId'] ?? row['waived_by_user_id']),
    waivedAt: trimOptionalString(row['waivedAt'] ?? row['waived_at']),
    waivedByName: trimOptionalString(row['waivedByName'] ?? row['waived_by_name']),
    waivedReason: trimOptionalString(row['waivedReason'] ?? row['waived_reason']),
    refundedByUserId: trimOptionalString(row['refundedByUserId'] ?? row['refunded_by_user_id']),
    refundedAt: trimOptionalString(row['refundedAt'] ?? row['refunded_at']),
    refundReason: trimOptionalString(row['refundReason'] ?? row['refund_reason'])
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function trimOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
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

function normalizeBooleanOrUndefined(value: unknown): boolean | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  return normalizeBoolean(value);
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

function normalizePaymentMethod(value: unknown): PaymentMethod | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? (normalized as PaymentMethod) : undefined;
}

function normalizeProofType(value: unknown): Booking['proofType'] | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? (normalized as Booking['proofType']) : undefined;
}


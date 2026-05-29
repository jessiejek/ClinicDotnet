import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap, throwError } from 'rxjs';
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
import { Booking, ReceiptData } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import {
  ConfirmPaymentRequest
} from '../../../core/services/booking.service';
import { ClinicSettingsService } from '../../../core/services/clinic-settings.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import {
  BookingPrintDocumentComponent,
  BookingPrintDocumentData
} from '../../../shared/components/booking-print-document/booking-print-document.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { ReceiptModalComponent } from '../../../shared/components/receipt-modal/receipt-modal.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

type CollectPaymentMethod = 'Cash' | 'GCash' | 'Maya' | 'BankTransfer';

@Component({
  selector: 'app-staff-booking-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    NgFor,
    NgIf,
    FormsModule,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonModal,
    IonTitle,
    IonToolbar,
    AvatarComponent,
    BookingPrintDocumentComponent,
    ConfirmModalComponent,
    StatusBadgeComponent,
    ReceiptModalComponent
  ],
  template: `
    <section class="page-shell no-print">
      <div class="loading-card" *ngIf="isLoading && !booking">Loading booking details...</div>

      <ng-container *ngIf="booking; else missingTpl">
        <div class="page-shell__header">
          <div>
            <button type="button" class="btn-ghost" (click)="goBack()">Back to Bookings</button>
            <h2 class="page-title">Booking Details</h2>
            <div class="page-subtitle data-mono">{{ booking.id }}</div>
          </div>
          <app-status-badge
            [status]="booking.status"
            [labelOverride]="staffStatusLabel(booking.status)"
          ></app-status-badge>
        </div>

        <div class="detail-grid">
          <div class="detail-grid__main">
            <div class="clinic-card">
              <div class="section-heading">Patient Info</div>
              <div class="profile-card">
                <app-avatar [name]="patientDisplayName" size="lg"></app-avatar>
                <div>
                  <h3>{{ patientDisplayName }}</h3>
                  <p *ngIf="booking.patient?.patientCode">{{ booking.patient?.patientCode }}</p>
                  <p *ngIf="booking.patient?.contactNumber">{{ booking.patient?.contactNumber }}</p>
                  <p *ngIf="booking.patient?.email">{{ booking.patient?.email }}</p>
                  <p *ngIf="booking.patient?.sex || booking.patient?.dateOfBirth">
                    <span *ngIf="booking.patient?.sex">{{ booking.patient?.sex }}</span>
                    <span *ngIf="booking.patient?.sex && booking.patient?.dateOfBirth"> | </span>
                    <span *ngIf="booking.patient?.dateOfBirth">
                      {{ booking.patient?.dateOfBirth | date : 'MMMM d, y (EEE)' }}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div class="clinic-card">
              <div class="section-heading">Doctor Info</div>
              <div class="profile-card">
                <app-avatar [name]="doctorDisplayName" size="lg"></app-avatar>
                <div>
                  <h3>{{ doctorDisplayName }}</h3>
                  <p *ngIf="booking.doctor?.specialization">{{ booking.doctor?.specialization }}</p>
                  <p *ngIf="booking.doctor?.status">Status: {{ booking.doctor?.status }}</p>
                </div>
              </div>
            </div>

            <div class="detail-card-grid">
              <div class="clinic-card">
                <div class="section-heading">Appointment Details</div>
                <p><strong>Date:</strong> {{ booking.appointmentDate | date : 'MMMM d, y (EEE)' }}</p>
                <p><strong>Time:</strong> {{ timeRangeLabel }}</p>
                <p><strong>Queue #:</strong> {{ queueLabel }}</p>
                <div>
                  <strong>Services:</strong>
                  <ul class="service-list">
                    <li *ngFor="let serviceName of serviceLabels">{{ serviceName }}</li>
                  </ul>
                </div>
              </div>

              <div class="clinic-card">
                <div class="section-heading">Payment Info</div>
                <p><strong>Mode:</strong> {{ booking.paymentMode }}</p>
                <p>
                  <strong>Status:</strong>
                  <app-status-badge [status]="booking.paymentStatus"></app-status-badge>
                </p>
                <p *ngIf="booking.payment">
                  <strong>Payment Record Amount:</strong> PHP {{ booking.payment.amount }}
                </p>
                <p *ngIf="booking.finalAmount !== null && booking.finalAmount !== undefined">
                  <strong>Final Amount:</strong> PHP {{ booking.finalAmount }}
                </p>
                <p *ngIf="booking.payment?.orNumber"><strong>OR Number:</strong> {{ booking.payment?.orNumber }}</p>
                <p *ngIf="booking.payment?.verifiedAt">
                  <strong>Paid At:</strong> {{ booking.payment?.verifiedAt | date : 'MMMM d, y (EEE) h:mm a' }}
                </p>
                <p *ngIf="booking.payment?.waivedAt">
                  <strong>Waived At:</strong> {{ booking.payment?.waivedAt | date : 'MMMM d, y (EEE) h:mm a' }}
                </p>
                <p *ngIf="booking.payment?.waivedReason">
                  <strong>Waive Reason:</strong> {{ booking.payment?.waivedReason }}
                </p>
              </div>
            </div>
          </div>

          <aside class="detail-grid__side">
            <div class="clinic-card action-sidebar">
              <div class="section-heading">Actions</div>

              <div class="action-stack" *ngIf="hasAvailableActions; else noActionsTpl">
                <button
                  *ngIf="canCheckIn"
                  class="btn-primary"
                  type="button"
                  [disabled]="isActing"
                  (click)="checkIn()"
                >
                  Check In
                </button>

                <button
                  *ngIf="canUndoCheckIn"
                  class="btn-outline"
                  type="button"
                  [disabled]="isActing"
                  (click)="undoCheckIn()"
                >
                  Undo Check-In
                </button>

                <button
                  *ngIf="canConfirmPayment"
                  class="btn-primary"
                  type="button"
                  [disabled]="isActing"
                  (click)="openPaymentModal()"
                >
                  Confirm Payment
                </button>

                <button
                  *ngIf="canWaivePf"
                  class="btn-outline"
                  type="button"
                  [disabled]="isActing"
                  (click)="openWaiveModal()"
                >
                  Waive PF
                </button>

                <button
                  *ngIf="canPrintDocument"
                  class="btn-ghost"
                  type="button"
                  [disabled]="isActing"
                  (click)="printBookingDocument()"
                >
                  {{ printActionLabel }}
                </button>
              </div>

              <ng-template #noActionsTpl>
                <div class="action-stack">
                  <button class="btn-ghost" type="button" disabled>No actions available</button>
                </div>
              </ng-template>
            </div>
          </aside>
        </div>
      </ng-container>
    </section>

    <ng-template #missingTpl>
      <section class="page-shell">
        <div class="clinic-card">
          <p>Booking not found.</p>
        </div>
      </section>
    </ng-template>

    <ion-modal class="no-print" [isOpen]="paymentModalOpen" (didDismiss)="closePaymentModal()">
      <ng-template>
        <ion-header>
          <ion-toolbar>
            <ion-title>Confirm Payment</ion-title>
            <ion-buttons slot="end">
              <ion-button fill="clear" (click)="closePaymentModal()">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div class="clinic-card" *ngIf="booking">
            <div class="section-heading">{{ patientDisplayName }}</div>
            <p>{{ doctorDisplayName }}</p>
            <p>{{ serviceLabels.join(', ') }}</p>
            <p><strong>Amount Due:</strong> PHP {{ amountDue }}</p>
          </div>

          <div class="clinic-card">
            <label class="form-label">Payment Method</label>
            <select
              class="filter-input"
              name="paymentMethod"
              [(ngModel)]="paymentMethod"
              [ngModelOptions]="{ standalone: true }"
            >
              <option *ngFor="let method of paymentMethods" [value]="method">{{ method }}</option>
            </select>
          </div>

          <div class="clinic-card">
            <label class="form-label">Amount Received</label>
            <input
              class="filter-input"
              type="number"
              min="0"
              name="amountReceived"
              [(ngModel)]="amountReceived"
              [ngModelOptions]="{ standalone: true }"
            />
          </div>

          <div class="clinic-card">
            <label class="form-label">Reference Number</label>
            <input
              class="filter-input"
              type="text"
              name="referenceNumber"
              [(ngModel)]="referenceNumber"
              [ngModelOptions]="{ standalone: true }"
            />
          </div>

          <div class="clinic-card">
            <label class="form-label">Notes</label>
            <textarea
              class="filter-input"
              rows="3"
              name="paymentNotes"
              [(ngModel)]="notes"
              [ngModelOptions]="{ standalone: true }"
            ></textarea>
          </div>

          <div class="wizard-actions wizard-actions--split">
            <button type="button" class="btn-outline" (click)="closePaymentModal()">Cancel</button>
            <button type="button" class="btn-primary" [disabled]="isActing" (click)="confirmPayment()">
              {{ isActing ? 'Confirming...' : 'Confirm Payment' }}
            </button>
          </div>
        </ion-content>
      </ng-template>
    </ion-modal>

    <app-confirm-modal
      class="no-print"
      [isOpen]="waiveModalOpen"
      title="Waive PF"
      message="Waive the professional fee for this completed consultation?"
      confirmLabel="Waive PF"
      [isDanger]="true"
      [requireReason]="true"
      [reasonMinLength]="waiverReasonMinLength"
      reasonLabel="Waive reason"
      (confirmed)="confirmWaive($event)"
      (cancelled)="closeWaiveModal()"
    ></app-confirm-modal>

    <app-receipt-modal
      class="no-print"
      [isOpen]="receiptModalOpen"
      [data]="receiptData"
      (closed)="receiptModalOpen = false"
    ></app-receipt-modal>

    <app-booking-print-document [data]="printDocumentData"></app-booking-print-document>
  `,
  styleUrl: './staff-booking-detail.page.scss'
})
export class StaffBookingDetailPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly clinicSettingsService = inject(ClinicSettingsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);

  bookingId = '';
  booking: Booking | null = null;
  isLoading = false;
  isActing = false;

  paymentModalOpen = false;
  paymentMethod: CollectPaymentMethod = 'Cash';
  amountReceived = 0;
  referenceNumber = '';
  notes = '';

  waiveModalOpen = false;
  readonly waiverReasonMinLength = 5;

  receiptModalOpen = false;
  receiptData: ReceiptData | null = null;
  printDocumentData: BookingPrintDocumentData | null = null;

  readonly paymentMethods: CollectPaymentMethod[] = ['Cash', 'GCash', 'Maya', 'BankTransfer'];

  get patientDisplayName(): string {
    if (!this.booking) {
      return 'Unknown Patient';
    }

    return (
      this.booking.patient?.fullName?.trim() ||
      buildNameFromParts(
        this.booking.patient?.firstName,
        this.booking.patient?.middleName,
        this.booking.patient?.lastName
      ) ||
      this.booking.patientName?.trim() ||
      'Unknown Patient'
    );
  }

  get doctorDisplayName(): string {
    if (!this.booking) {
      return 'Doctor not assigned';
    }

    return this.booking.doctor?.fullName?.trim() || this.booking.doctorName?.trim() || 'Doctor not assigned';
  }

  get serviceLabels(): string[] {
    if (!this.booking) {
      return ['No service listed'];
    }

    const fromNames = (this.booking.serviceNames ?? []).map((item) => item.trim()).filter(Boolean);
    if (fromNames.length > 0) {
      return fromNames;
    }

    const fromServices =
      this.booking.services?.map((service) => service.name.trim()).filter((name) => name.length > 0) ?? [];
    if (fromServices.length > 0) {
      return fromServices;
    }

    const fallback =
      this.booking.service?.name?.trim() || this.booking.serviceName?.trim() || '';
    return fallback ? [fallback] : ['No service listed'];
  }

  get timeRangeLabel(): string {
    if (!this.booking) {
      return 'Time not available';
    }

    const start = this.booking.slotStartTime?.trim() ?? '';
    const end = this.booking.slotEndTime?.trim() ?? '';
    if (!start) {
      return 'Time not available';
    }

    if (!end || end === start) {
      return start;
    }

    return `${start} - ${end}`;
  }

  get queueLabel(): string {
    return this.booking?.queueNumber !== null && this.booking?.queueNumber !== undefined
      ? `#${this.booking.queueNumber}`
      : '-';
  }

  get amountDue(): number {
    if (!this.booking) {
      return 0;
    }

    if (typeof this.booking.payment?.amount === 'number') {
      return this.booking.payment.amount;
    }

    if (this.booking.finalAmount !== null && this.booking.finalAmount !== undefined) {
      return this.booking.finalAmount;
    }

    return this.booking.totalFee;
  }

  get canCheckIn(): boolean {
    return this.booking?.status === 'Confirmed';
  }

  get canUndoCheckIn(): boolean {
    return this.booking?.status === 'CheckedIn';
  }

  get canConfirmPayment(): boolean {
    return Boolean(
      this.booking &&
        this.booking.status === 'Completed' &&
        this.booking.paymentStatus === 'Unpaid' &&
        this.booking.payment?.id
    );
  }

  get canWaivePf(): boolean {
    return this.canConfirmPayment;
  }

  get canPrintDocument(): boolean {
    return Boolean(this.booking && this.booking.status === 'Completed');
  }

  get printActionLabel(): string {
    if (!this.booking) {
      return 'Print';
    }

    return this.booking.paymentStatus === 'Unpaid' ? 'Print Summary' : 'Print Receipt';
  }

  get hasAvailableActions(): boolean {
    return this.canCheckIn || this.canUndoCheckIn || this.canConfirmPayment || this.canWaivePf || this.canPrintDocument;
  }

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadBooking(this.bookingId);
    this.printDocumentData = null;
  }

  goBack(): void {
    void this.router.navigate(['/staff/bookings']);
  }

  staffStatusLabel(status: string): string {
    switch (status) {
      case 'Confirmed':
        return 'BOOKED';
      case 'CheckedIn':
        return 'CONFIRMED';
      case 'Completed':
        return 'COMPLETED';
      case 'Cancelled':
        return 'CANCELLED';
      case 'NoShow':
        return 'NO SHOW';
      case 'Pending':
        return 'PENDING';
      case 'ProofSubmitted':
        return 'PROOF SUBMITTED';
      case 'OnHold':
        return 'ON HOLD';
      case 'Expired':
        return 'EXPIRED';
      case 'Rescheduled':
        return 'RESCHEDULED';
      case 'InProgress':
        return 'IN PROGRESS';
      default:
        return status;
    }
  }

  checkIn(): void {
    if (!this.booking || this.isActing) {
      return;
    }

    this.isActing = true;
    this.apiService.patch('bookings/' + this.booking.id + '/check-in', {}).subscribe({
      next: async () => {
        this.isActing = false;
        this.refreshBooking();
        await this.presentToast('Patient checked in.', 'success');
      },
      error: async (error) => {
        this.isActing = false;
        await this.presentToast(extractApiErrorMessage(error, 'Failed to check in booking.'), 'danger');
      }
    });
  }

  undoCheckIn(): void {
    if (!this.booking || this.isActing) {
      return;
    }

    this.isActing = true;
    this.apiService.patch('bookings/' + this.booking.id + '/undo-check-in', {}).subscribe({
      next: async () => {
        this.isActing = false;
        this.refreshBooking();
        await this.presentToast('Check-in undone.', 'success');
      },
      error: async (error) => {
        this.isActing = false;
        await this.presentToast(extractApiErrorMessage(error, 'Failed to undo check-in.'), 'danger');
      }
    });
  }

  openPaymentModal(): void {
    if (!this.booking || !this.canConfirmPayment) {
      return;
    }

    this.waiveModalOpen = false;
    this.paymentMethod = 'Cash';
    this.amountReceived = this.amountDue;
    this.referenceNumber = '';
    this.notes = '';
    this.paymentModalOpen = true;
  }

  closePaymentModal(): void {
    this.paymentModalOpen = false;
    this.isActing = false;
  }

  confirmPayment(): void {
    if (!this.booking?.payment?.id || !this.canConfirmPayment || this.isActing) {
      return;
    }

    if (this.amountReceived < this.amountDue) {
      void this.presentToast('Amount received must be equal to or greater than the amount due.', 'warning');
      return;
    }

    const payload: ConfirmPaymentRequest = {
      paymentMethod: this.paymentMethod,
      amountReceived: this.amountReceived
    };

    const referenceNumber = this.referenceNumber.trim();
    if (referenceNumber) {
      payload.referenceNumber = referenceNumber;
    }

    const notes = this.notes.trim();
    if (notes) {
      payload.notes = notes;
    }

    this.isActing = true;
    const bookingId = this.booking.id;
    this.apiService.patch<any>('payments/' + bookingId + '/confirm', {
      paymentMethod: payload.paymentMethod,
      amountReceived: payload.amountReceived,
      referenceNumber: payload.referenceNumber ?? null,
      notes: null
    }).pipe(
      switchMap((payResult) =>
        this.apiService.get<any>('bookings/' + bookingId).pipe(
          map((bookingData) => {
            const payment = payResult ? normalizePaymentRow(payResult) : undefined;
            const booking = bookingData ? normalizeBookingRow(bookingData) : null;
            return payment ? buildReceiptFromPaymentAndBooking(payment, booking) : buildEmptyReceipt();
          })
        )
      ),
      catchError((error: unknown) =>
        throwError(() => new Error(extractApiErrorMessage(error, 'Failed to confirm payment.')))
      )
    ).subscribe({
      next: async (receipt) => {
        this.closePaymentModal();
        this.refreshBooking();
        this.receiptData = receipt;
        this.printDocumentData = this.buildPrintDocument(receipt);
        window.setTimeout(() => {
          this.receiptModalOpen = true;
        }, 0);
        await this.presentToast('Payment confirmed.', 'success');
      },
      error: async (error) => {
        this.isActing = false;
        await this.presentToast(extractApiErrorMessage(error, 'Failed to confirm payment.'), 'danger');
      }
    });
  }

  openWaiveModal(): void {
    if (!this.canWaivePf || this.isActing) {
      return;
    }

    this.paymentModalOpen = false;
    this.waiveModalOpen = true;
  }

  closeWaiveModal(): void {
    this.waiveModalOpen = false;
    this.isActing = false;
  }

  confirmWaive(reason?: string): void {
    if (!this.booking || this.isActing) {
      return;
    }

    if (!this.canWaivePf) {
      void this.presentToast('This payment is no longer available to waive.', 'warning');
      return;
    }

    const waiveReason = (reason ?? '').trim();
    if (waiveReason.length < this.waiverReasonMinLength) {
      void this.presentToast(
        `Please provide a waiver reason with at least ${this.waiverReasonMinLength} characters.`,
        'warning'
      );
      return;
    }

    this.isActing = true;
    this.apiService.patch('payments/' + this.booking.id + '/waive', { reason: waiveReason }).subscribe({
      next: async () => {
        this.closeWaiveModal();
        this.refreshBooking();
        await this.presentToast('PF waived.', 'success');
      },
      error: async (error) => {
        this.isActing = false;
        await this.presentToast(extractApiErrorMessage(error, 'Failed to waive PF.'), 'danger');
      }
    });
  }

  printBookingDocument(): void {
    if (!this.booking || this.isActing || this.booking.status !== 'Completed') {
      return;
    }

    const paymentId = this.booking.payment?.id;
    if (this.booking.paymentStatus !== 'Unpaid' && paymentId) {
      this.isActing = true;
      this.apiService.get<any>('payments/' + paymentId).pipe(
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
      ).subscribe({
        next: async (receipt) => {
          this.isActing = false;
          this.receiptData = receipt;
          this.printDocumentData = this.buildPrintDocument(receipt);
          window.setTimeout(() => window.print(), 0);
        },
        error: async (error) => {
          this.isActing = false;
          await this.presentToast(extractApiErrorMessage(error, 'Failed to load receipt.'), 'danger');
        }
      });
      return;
    }

    this.printDocumentData = this.buildPrintDocument();
    window.setTimeout(() => window.print(), 0);
  }

  private buildPrintDocument(receipt?: ReceiptData): BookingPrintDocumentData {
    if (!this.booking) {
      throw new Error('Booking is not loaded.');
    }

    const clinicSettings = this.clinicSettingsService.load();
    const isSummary = this.booking.paymentStatus === 'Unpaid' || !receipt;
    const kind: BookingPrintDocumentData['kind'] = receipt?.isWaived
      ? 'waived'
      : isSummary
        ? 'summary'
        : 'receipt';
    const amountDue = this.amountDue;
    const amountPaid = receipt?.amountPaid ?? (this.booking.paymentStatus === 'Unpaid' ? undefined : amountDue);

    return {
      kind,
      title:
        kind === 'summary'
          ? 'BOOKING SUMMARY'
          : kind === 'waived'
            ? 'WAIVED PAYMENT SUMMARY'
            : 'OFFICIAL RECEIPT',
      clinicName: receipt?.clinicName || clinicSettings.clinicName || 'Dr. Grace E. Gavino Medical Clinic',
      clinicAddress: receipt?.clinicAddress || clinicSettings.address || undefined,
      clinicPhone: clinicSettings.phone || undefined,
      clinicEmail: clinicSettings.email || undefined,
      logoUrl: clinicSettings.logoUrl || undefined,
      generatedAt: new Date().toISOString(),
      bookingId: this.booking.id,
      paymentId: receipt?.paymentId || this.booking.payment?.id,
      patientName: this.patientDisplayName,
      patientCode: this.booking.patient?.patientCode,
      contactNumber: this.booking.patient?.contactNumber,
      email: this.booking.patient?.email,
      doctorName: this.doctorDisplayName,
      services: this.serviceLabels,
      appointmentDate: this.booking.appointmentDate,
      slotStartTime: this.booking.slotStartTime,
      slotEndTime: this.booking.slotEndTime,
      queueNumber: this.booking.queueNumber,
      bookingStatus: this.booking.status,
      paymentStatus: this.booking.paymentStatus,
      paymentMode: receipt?.paymentMethod || this.booking.paymentMode,
      amountDue: isSummary ? amountDue : undefined,
      amountPaid: isSummary ? undefined : amountPaid,
      orNumber: receipt?.orNumber || this.booking.orNumber || undefined,
      referenceNumber: receipt?.referenceNumber || this.booking.payment?.referenceNumber || undefined,
      paidAt: receipt?.paidAt || this.booking.payment?.verifiedAt || undefined,
      cashierName: receipt?.cashierName || undefined,
      verifiedByName: receipt?.verifiedByName || undefined,
      doctorCompletedAt: receipt?.doctorCompletedAt || this.booking.doctorCompletedAt || undefined,
      isWaived: Boolean(receipt?.isWaived),
      waivedReason: receipt?.waivedReason || this.booking.professionalFeeWaivedReason || undefined,
      waivedByName: receipt?.waivedByName || undefined,
      waivedAt: receipt?.waivedAt || this.booking.payment?.waivedAt || undefined
    };
  }

  private refreshBooking(): void {
    if (!this.bookingId) {
      return;
    }

    void this.loadBooking(this.bookingId, false);
  }

  private loadBooking(bookingId: string, trackLoading = true): Promise<void> {
    if (!bookingId) {
      return Promise.resolve();
    }

    if (trackLoading) {
      this.isLoading = true;
    }

    return new Promise<void>((resolve) => {
      this.apiService
        .get<any>('bookings/' + bookingId)
        .pipe(
          map((data) => (data ? normalizeBookingRow(data) : null)),
          catchError((error: unknown) => {
            console.error('Failed to load booking details:', error);
            return of(null);
          })
        )
        .subscribe({
          next: (booking) => {
            this.booking = booking;
            if (trackLoading) {
              this.isLoading = false;
            }
          },
          error: () => {
            if (trackLoading) {
              this.isLoading = false;
            }
            resolve();
          },
          complete: () => {
            if (trackLoading) {
              this.isLoading = false;
            }
            resolve();
          }
        });
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

function buildNameFromParts(firstName?: string, middleName?: string, lastName?: string): string {
  return [firstName, middleName, lastName]
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0)
    .join(' ')
    .trim();
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
    services: undefined,
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

function normalizePaymentRow(payload: unknown): import('../../../core/models').Payment | undefined {
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
    paymentMethod: (trimOptionalString(row['paymentMethod'] ?? row['payment_method']) as import('../../../core/models').Payment['paymentMethod']) ?? 'PayAtClinic',
    referenceNumber: trimOptionalString(row['referenceNumber'] ?? row['reference_number']),
    proofImageUrl: trimOptionalString(row['proofImageUrl'] ?? row['proof_image_url']),
    verifiedAt: trimOptionalString(row['verifiedAt'] ?? row['verified_at']),
    verifiedByName: trimOptionalString(row['verifiedByName'] ?? row['verified_by_name']),
    waivedAt: trimOptionalString(row['waivedAt'] ?? row['waived_at']),
    waivedByName: trimOptionalString(row['waivedByName'] ?? row['waived_by_name']),
    waivedReason: trimOptionalString(row['waivedReason'] ?? row['waived_reason']),
    cashierName: trimOptionalString(row['cashierName'] ?? row['cashier_name']),
    status: (trimOptionalString(row['status'] ?? row['payment_status']) as import('../../../core/models').Payment['status']) ?? 'Pending'
  };
}

function buildReceiptFromPaymentAndBooking(
  payment: import('../../../core/models').Payment,
  booking: Booking | null | undefined
): ReceiptData {
  const services = booking?.serviceNames?.length
    ? booking.serviceNames
    : booking?.serviceName
      ? [booking.serviceName]
      : [];

  return {
    paymentId: payment.id,
    bookingId: payment.bookingId,
    orNumber: payment.orNumber ?? '-',
    patientName: booking?.patientName ?? booking?.patient?.fullName ?? 'Patient',
    patientCode: booking?.patient?.patientCode ?? '',
    doctorName: booking?.doctorName ?? booking?.doctor?.fullName ?? 'Doctor',
    services,
    appointmentDate: booking?.appointmentDate ?? '',
    slotStartTime: booking?.slotStartTime ?? '',
    slotTime: booking?.slotEndTime ? `${booking.slotStartTime ?? ''} - ${booking.slotEndTime}` : booking?.slotStartTime,
    queueNumber: booking?.queueNumber ?? null,
    paymentStatus: booking?.paymentStatus ?? 'Unpaid',
    paymentMethod: payment.paymentMethod,
    totalFee: booking?.finalAmount ?? booking?.totalFee ?? payment.amount,
    amountPaid: payment.amount,
    referenceNumber: payment.referenceNumber ?? undefined,
    paidAt: payment.verifiedAt ?? undefined,
    cashierName: payment.cashierName ?? undefined,
    verifiedByName: payment.verifiedByName ?? undefined,
    doctorCompletedAt: booking?.doctorCompletedAt ?? undefined,
    isWaived: Boolean(payment.waivedAt || booking?.isProfessionalFeeWaived),
    waivedReason: payment.waivedReason ?? booking?.professionalFeeWaivedReason ?? undefined,
    waivedByName: payment.waivedByName ?? undefined,
    waivedAt: payment.waivedAt ?? undefined
  };
}

function buildEmptyReceipt(): ReceiptData {
  return {
    paymentId: '',
    bookingId: '',
    orNumber: '-',
    patientName: 'Patient',
    patientCode: '',
    doctorName: 'Doctor',
    services: [],
    appointmentDate: '',
    slotStartTime: '',
    slotTime: '',
    queueNumber: null,
    paymentStatus: 'Unpaid',
    paymentMethod: 'PayAtClinic',
    totalFee: 0,
    amountPaid: undefined,
    referenceNumber: undefined,
    paidAt: undefined,
    cashierName: undefined,
    verifiedByName: undefined,
    doctorCompletedAt: undefined,
    isWaived: false,
    waivedReason: undefined,
    waivedByName: undefined,
    waivedAt: undefined,
    clinicName: undefined,
    clinicAddress: undefined
  };
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function trimOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value.trim() : undefined;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
}

function normalizeServices(value: unknown): Array<{ name: string }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!isRecord(item)) {
        return undefined;
      }

      const name = trimOptionalString(item['name'] ?? item['serviceName'] ?? item['service_name']);
      if (!name) {
        return undefined;
      }

      return { name };
    })
    .filter((item): item is { name: string } => Boolean(item));
}

function normalizeDateOnly(value: unknown): string {
  const text = trimOptionalString(value);
  return text ? text.slice(0, 10) : '';
}

function normalizeTimeOnly(value: unknown): string {
  const text = trimOptionalString(value);
  return text ? text.slice(0, 5) : '';
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
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return normalizeBoolean(value);
}

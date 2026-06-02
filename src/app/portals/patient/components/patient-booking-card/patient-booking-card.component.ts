import { DatePipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Booking, Doctor, Service } from '../../../../core/models';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-patient-booking-card',
  standalone: true,
  imports: [NgIf, DatePipe, StatusBadgeComponent],
  templateUrl: './patient-booking-card.component.html',
  styleUrl: './patient-booking-card.component.scss'
})
export class PatientBookingCardComponent {
  @Input({ required: true }) booking!: Booking;
  @Input() doctor?: Doctor;
  @Input() service?: Service;
  @Input() canSubmitProof = false;
  @Input() canCancel = false;

  @Output() viewDetails = new EventEmitter<string>();
  @Output() submitProof = new EventEmitter<string>();
  @Output() cancelBooking = new EventEmitter<string>();

  get doctorDisplayName(): string {
    return this.booking.doctorName?.trim() || this.doctor?.fullName?.trim() || 'Assigned Doctor';
  }

  get servicesDisplayName(): string {
    if (this.booking.serviceNames?.length) {
      return this.booking.serviceNames.join(', ');
    }

    const namesFromItems = this.booking.services?.map((item) => item.name).filter((name) => name.trim().length > 0) ?? [];
    if (namesFromItems.length > 0) {
      return namesFromItems.join(', ');
    }

    return this.booking.serviceName?.trim() || this.service?.name?.trim() || 'Service';
  }

  get displayStatus(): string {
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
    if (this.isWaived) {
      return 'Waived';
    }

    return this.booking.paymentStatus;
  }

  get showAmountDue(): boolean {
    return !this.isWaived && this.booking.finalAmount !== null && this.booking.finalAmount !== undefined;
  }

  get isWaived(): boolean {
    return this.booking.isProfessionalFeeWaived === true || this.booking.paymentStatus === 'Waived';
  }

  get timeRangeLabel(): string {
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
}

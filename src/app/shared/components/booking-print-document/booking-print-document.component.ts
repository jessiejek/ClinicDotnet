import { DatePipe, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PesoPipe } from '../../pipes/peso.pipe';

export type BookingPrintDocumentKind = 'receipt' | 'waived' | 'summary';

export interface BookingPrintDocumentData {
  kind: BookingPrintDocumentKind;
  clinicName: string;
  clinicAddress?: string;
  clinicPhone?: string;
  clinicEmail?: string;
  logoUrl?: string;
  title: string;
  generatedAt: string;
  bookingId: string;
  paymentId?: string;
  patientName: string;
  patientCode?: string;
  contactNumber?: string;
  email?: string;
  doctorName: string;
  services: string[];
  appointmentDate: string;
  slotStartTime?: string;
  slotEndTime?: string;
  queueNumber?: number | null;
  bookingStatus: string;
  paymentStatus: string;
  paymentMode: string;
  amountDue?: number | null;
  amountPaid?: number | null;
  orNumber?: string;
  referenceNumber?: string;
  paidAt?: string;
  cashierName?: string;
  verifiedByName?: string;
  doctorCompletedAt?: string;
  isWaived: boolean;
  waivedReason?: string;
  waivedByName?: string;
  waivedAt?: string;
}

@Component({
  selector: 'app-booking-print-document',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, UpperCasePipe, PesoPipe],
  templateUrl: './booking-print-document.component.html',
  styleUrls: ['./booking-print-document.component.scss']
})
export class BookingPrintDocumentComponent {
  @Input() data: BookingPrintDocumentData | null = null;

  get servicesLabel(): string {
    if (!this.data) {
      return 'No services listed';
    }

    return this.data.services.length > 0 ? this.data.services.join(', ') : 'No services listed';
  }

  get timeRangeLabel(): string {
    if (!this.data?.slotStartTime) {
      return 'Time not available';
    }

    if (!this.data.slotEndTime || this.data.slotEndTime === this.data.slotStartTime) {
      return this.data.slotStartTime;
    }

    return `${this.data.slotStartTime} - ${this.data.slotEndTime}`;
  }
}

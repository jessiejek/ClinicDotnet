import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Booking } from '../../../../core/models';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-doctor-appointment-card',
  standalone: true,
  imports: [NgIf, StatusBadgeComponent],
  templateUrl: './doctor-appointment-card.component.html',
  styleUrl: './doctor-appointment-card.component.scss'
})
export class DoctorAppointmentCardComponent {
  @Input({ required: true }) booking!: Booking;
  @Input() patientName = '';
  @Input() patientCode = '';
  @Input() serviceName = '';

  @Output() openBooking = new EventEmitter<string>();
  @Output() startConsultation = new EventEmitter<string>();

  get displayPatientName(): string {
    return this.patientName.trim() || this.booking.patientName?.trim() || 'Unknown Patient';
  }

  get displayServiceName(): string {
    return this.serviceName.trim() || this.booking.serviceName?.trim() || 'Unknown Service';
  }

  get scheduleLabel(): string {
    const date = this.booking.appointmentDate?.trim() ?? '';
    const time = this.booking.slotStartTime?.trim() ?? '';

    if (!date) {
      return time || '-';
    }

    if (!time) {
      return date;
    }

    return `${date} ${time}`;
  }

  canStartConsultation(status: string): boolean {
    return status === 'Confirmed' || status === 'InProgress';
  }
}

import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Booking, Patient, Service } from '../../../../core/models';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-doctor-queue-table',
  standalone: true,
  imports: [NgFor, NgIf, EmptyStateComponent, StatusBadgeComponent],
  templateUrl: './doctor-queue-table.component.html',
  styleUrl: './doctor-queue-table.component.scss'
})
export class DoctorQueueTableComponent {
  @Input() bookings: Booking[] = [];
  @Input() patients: Patient[] = [];
  @Input() services: Service[] = [];

  @Output() openBooking = new EventEmitter<string>();
  @Output() startConsultation = new EventEmitter<string>();
  @Output() markComplete = new EventEmitter<string>();
  @Output() markNoShow = new EventEmitter<string>();

  get sortedBookings(): Booking[] {
    return [...this.bookings].sort((a, b) => {
      const aQueue = a.queueNumber ?? Number.MAX_SAFE_INTEGER;
      const bQueue = b.queueNumber ?? Number.MAX_SAFE_INTEGER;
      if (aQueue !== bQueue) {
        return aQueue - bQueue;
      }
      return `${a.appointmentDate} ${a.slotStartTime}`.localeCompare(`${b.appointmentDate} ${b.slotStartTime}`);
    });
  }

  patientName(patientId: string): string {
    const patient = this.patients.find((item) => item.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  }

  patientCode(patientId: string): string {
    return this.patients.find((item) => item.id === patientId)?.patientCode ?? '';
  }

  serviceName(serviceId: string): string {
    return this.services.find((service) => service.id === serviceId)?.name ?? 'Unknown Service';
  }

  canStartConsultation(status: string): boolean {
    return status === 'Confirmed' || status === 'InProgress';
  }

  canMarkComplete(status: string): boolean {
    return status === 'Confirmed' || status === 'InProgress';
  }

  canMarkNoShow(status: string): boolean {
    return status === 'Confirmed';
  }
}

import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Booking, Doctor, Patient, Service } from '../../../../core/models';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import {
  BookingActionsMenuComponent,
  BookingActionItem
} from '../booking-actions-menu/booking-actions-menu.component';

@Component({
  selector: 'app-today-appointments-table',
  standalone: true,
  imports: [
    DatePipe,
    NgFor,
    NgIf,
    RouterLink,
    EmptyStateComponent,
    SkeletonComponent,
    StatusBadgeComponent,
    BookingActionsMenuComponent
  ],
  templateUrl: './today-appointments-table.component.html',
  styleUrl: './today-appointments-table.component.scss'
})
export class TodayAppointmentsTableComponent {
  @Input() bookings: Booking[] = [];
  @Input() doctors: Doctor[] = [];
  @Input() patients: Patient[] = [];
  @Input() services: Service[] = [];
  @Input() isLoading = false;
  @Input() actions: BookingActionItem[] = [
    { label: 'View', value: 'view' },
    { label: 'Confirm', value: 'confirm' },
    { label: 'Reject', value: 'reject', danger: true }
  ];

  @Output() rowClicked = new EventEmitter<Booking>();
  @Output() action = new EventEmitter<{ action: string; id: string }>();

  patientName(patientId: string): string {
    const patient = this.patients.find((item) => item.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  }

  doctorName(doctorId: string): string {
    return this.doctors.find((item) => item.id === doctorId)?.fullName ?? 'Unknown';
  }

  serviceName(serviceId: string): string {
    return this.services.find((item) => item.id === serviceId)?.name ?? 'Unknown';
  }
}

import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonInput } from '@ionic/angular/standalone';
import {
  AvailabilityStatus,
  Doctor,
  DoctorDayStatus
} from '../../../../core/models';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-doctor-status-panel',
  standalone: true,
  imports: [NgIf, IonInput, StatusBadgeComponent],
  templateUrl: './doctor-status-panel.component.html',
  styleUrl: './doctor-status-panel.component.scss'
})
export class DoctorStatusPanelComponent {
  @Input({ required: true }) doctor!: Doctor;
  @Input() status: DoctorDayStatus | null = null;

  @Output() statusChanged = new EventEmitter<{
    doctorId: string;
    status: AvailabilityStatus;
    runningLateMinutes?: number;
  }>();

  runningLateMinutes = 5;

  get currentStatus(): AvailabilityStatus {
    return this.status?.status ?? 'Available';
  }

  setAvailable(): void {
    this.statusChanged.emit({
      doctorId: this.doctor.id,
      status: 'Available'
    });
  }

  setRunningLate(): void {
    const minutes = Math.max(5, Math.floor(this.runningLateMinutes || 0));
    if (minutes < 5) {
      return;
    }
    this.statusChanged.emit({
      doctorId: this.doctor.id,
      status: 'RunningLate',
      runningLateMinutes: minutes
    });
  }

  markUnavailableToday(): void {
    this.statusChanged.emit({
      doctorId: this.doctor.id,
      status: 'UnavailableToday'
    });
  }

  onMinutesChange(event: CustomEvent<{ value?: string | number | null }>): void {
    const nextValue = Number(event.detail?.value ?? 0);
    this.runningLateMinutes = Number.isFinite(nextValue) ? nextValue : 0;
  }
}

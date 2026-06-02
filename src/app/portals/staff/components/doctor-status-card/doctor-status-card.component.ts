import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline, timeOutline } from 'ionicons/icons';
import { AvailabilityStatus, Doctor, DoctorDayStatus } from '../../../../core/models';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-doctor-status-card',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule, IonIcon, AvatarComponent, ConfirmModalComponent],
  templateUrl: './doctor-status-card.component.html',
  styleUrl: './doctor-status-card.component.scss'
})
export class DoctorStatusCardComponent {
  @Input({ required: true }) doctor!: Doctor;
  @Input() dayStatus: DoctorDayStatus | null = null;

  @Output() statusChanged = new EventEmitter<{
    doctorId: string;
    status: AvailabilityStatus;
    runningLateMinutes?: number;
  }>();

  isSettingRunningLate = false;
  confirmOpen = false;
  runningLateMinutes = 15;

  constructor() {
    addIcons({
      checkmarkCircleOutline,
      closeCircleOutline,
      timeOutline
    });
  }

  get currentStatus(): AvailabilityStatus {
    return this.dayStatus?.status ?? 'Available';
  }

  setAvailable(): void {
    this.isSettingRunningLate = false;
    this.statusChanged.emit({ doctorId: this.doctor.id, status: 'Available' });
  }

  setUnavailable(): void {
    this.confirmOpen = true;
  }

  confirmRunningLate(): void {
    this.statusChanged.emit({
      doctorId: this.doctor.id,
      status: 'RunningLate',
      runningLateMinutes: this.runningLateMinutes
    });
    this.isSettingRunningLate = false;
  }

  confirmUnavailable(): void {
    this.statusChanged.emit({ doctorId: this.doctor.id, status: 'UnavailableToday' });
    this.confirmOpen = false;
  }
}

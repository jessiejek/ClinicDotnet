import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Patient } from '../../../../core/models';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-doctor-patient-card',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './doctor-patient-card.component.html',
  styleUrl: './doctor-patient-card.component.scss'
})
export class DoctorPatientCardComponent {
  @Input({ required: true }) patient!: Patient;
  @Input() lastVisit = '';
  @Input() upcomingAppointmentsCount = 0;

  @Output() viewPatient = new EventEmitter<string>();

  get fullName(): string {
    return `${this.patient.firstName} ${this.patient.lastName}`;
  }

  get ageLabel(): string {
    const birthDate = new Date(this.patient.dateOfBirth);
    if (Number.isNaN(birthDate.getTime())) {
      return 'Age unavailable';
    }
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return `${age} years old`;
  }
}

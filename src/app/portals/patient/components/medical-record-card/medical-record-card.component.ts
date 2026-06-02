import { DatePipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Consultation, Doctor } from '../../../../core/models';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-medical-record-card',
  standalone: true,
  imports: [NgIf, DatePipe, StatusBadgeComponent],
  templateUrl: './medical-record-card.component.html',
  styleUrl: './medical-record-card.component.scss'
})
export class MedicalRecordCardComponent {
  @Input({ required: true }) consultation!: Consultation;
  @Input() doctor?: Doctor;

  @Output() viewDetails = new EventEmitter<string>();

  get recordStatus(): string {
    return this.consultation.isLocked ? 'Completed' : 'Draft';
  }
}

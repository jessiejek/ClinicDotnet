import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Doctor, Prescription } from '../../../../core/models';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-prescription-card',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, StatusBadgeComponent],
  templateUrl: './prescription-card.component.html',
  styleUrl: './prescription-card.component.scss'
})
export class PrescriptionCardComponent {
  @Input({ required: true }) prescription!: Prescription;
  @Input() doctor?: Doctor;

  @Output() download = new EventEmitter<string>();
}

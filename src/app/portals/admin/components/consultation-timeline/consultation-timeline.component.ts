import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Consultation } from '../../../../core/models';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-consultation-timeline',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, StatusBadgeComponent],
  templateUrl: './consultation-timeline.component.html',
  styleUrl: './consultation-timeline.component.scss'
})
export class ConsultationTimelineComponent {
  @Input() consultations: Consultation[] = [];
}

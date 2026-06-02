import { Component } from '@angular/core';
import { PatientMediaPanelComponent } from '../../../shared/components/patient-media-panel/patient-media-panel.component';

@Component({
  standalone: true,
  selector: 'app-patient-lab-results-page',
  imports: [PatientMediaPanelComponent],
  templateUrl: './patient-lab-results.page.html',
  styleUrl: './patient-lab-results.page.scss'
})
export class PatientLabResultsPage {}

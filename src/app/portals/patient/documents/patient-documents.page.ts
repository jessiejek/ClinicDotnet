import { Component } from '@angular/core';
import { PatientMediaPanelComponent } from '../../../shared/components/patient-media-panel/patient-media-panel.component';

@Component({
  standalone: true,
  selector: 'app-patient-documents-page',
  imports: [PatientMediaPanelComponent],
  templateUrl: './patient-documents.page.html',
  styleUrl: './patient-documents.page.scss'
})
export class PatientDocumentsPage {}

import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Allergy,
  Consultation,
  FollowUp,
  LabResult,
  Prescription,
  VaccinationRecord
} from '../../../../core/models';
import { ConsultationTimelineComponent } from '../consultation-timeline/consultation-timeline.component';
import { VitalsTrendChartComponent } from '../../../doctor/components/vitals-trend-chart/vitals-trend-chart.component';
import { IonBadge, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonTextarea } from '@ionic/angular/standalone';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-medical-records-tab',
  standalone: true,
  imports: [
    DatePipe,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    ConsultationTimelineComponent,
    VitalsTrendChartComponent,
    IonBadge,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea
  ],
  templateUrl: './medical-records-tab.component.html',
  styleUrl: './medical-records-tab.component.scss'
})
export class MedicalRecordsTabComponent implements OnChanges {
  @Input() patientId = '';
  @Input() consultations: Consultation[] = [];
  @Input() prescriptions: Prescription[] = [];
  @Input() allergies: Allergy[] = [];
  @Input() labResults: LabResult[] = [];
  @Input() vaccinations: VaccinationRecord[] = [];
  @Input() followUps: FollowUp[] = [];

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);

  saving = false;

  readonly allergyForm = this.fb.group({
    allergen: ['', Validators.required],
    reaction: ['', Validators.required],
    severity: ['Moderate', Validators.required],
    notes: ['']
  });

  readonly labResultForm = this.fb.group({
    labRequestId: [''],
    fileName: ['', Validators.required],
    notes: ['']
  });

  readonly vaccinationForm = this.fb.group({
    vaccineName: ['', Validators.required],
    dateGiven: ['', Validators.required],
    remarks: ['']
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patientId']) {
      this.allergyForm.enable({ emitEvent: false });
      this.labResultForm.enable({ emitEvent: false });
      this.vaccinationForm.enable({ emitEvent: false });
    }
  }

  addAllergyEntry(): void {
    if (!this.patientId || this.allergyForm.invalid || this.saving) {
      return;
    }
    this.saving = true;
    const value = this.allergyForm.getRawValue();
    this.api.post<any>('medical-records/allergies', {
      patientId: this.patientId,
      allergen: value.allergen,
      reaction: value.reaction,
      severity: value.severity,
      notes: value.notes
    }).subscribe({
      next: () => {
        this.allergyForm.reset({ severity: 'Moderate' });
        this.saving = false;
        // Reload allergies via parent page on next tab switch
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  addLabResultEntry(): void {
    if (!this.patientId || this.labResultForm.invalid || this.saving) {
      return;
    }
    this.saving = true;
    const value = this.labResultForm.getRawValue();
    this.api.post<any>('medical-records/lab-results', {
      patientId: this.patientId,
      resultTitle: value.fileName,
      resultText: value.notes,
      fileName: value.fileName,
      fileContentType: 'application/octet-stream',
      status: 'Uploaded'
    }).subscribe({
      next: () => {
        this.labResultForm.reset();
        this.saving = false;
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  addVaccinationEntry(): void {
    if (!this.patientId || this.vaccinationForm.invalid || this.saving) {
      return;
    }
    this.saving = true;
    const value = this.vaccinationForm.getRawValue();
    this.api.post<any>('medical-records/vaccinations', {
      patientId: this.patientId,
      vaccineName: value.vaccineName,
      administeredDate: value.dateGiven,
      notes: value.remarks,
      status: 'Completed',
      source: 'AdministeredInClinic'
    }).subscribe({
      next: () => {
        this.vaccinationForm.reset();
        this.saving = false;
      },
      error: () => {
        this.saving = false;
      }
    });
  }
}

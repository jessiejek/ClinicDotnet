import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Diagnosis, PrescriptionItem, VitalSigns } from '../../../../core/models';
import { ClinicalRole } from '../../../../core/models/auth.models';
import { CreatePatientVaccinationRequest } from '../../../../core/models/vaccination.models';
import { AllergyWarningBannerComponent } from '../../components/allergy-warning-banner/allergy-warning-banner.component';
import { DiagnosisPickerComponent } from '../../components/diagnosis-picker/diagnosis-picker.component';
import { FollowUpDraftView, FollowUpFormComponent } from '../../components/follow-up-form/follow-up-form.component';
import { LabRequestDraftView, LabRequestFormComponent } from '../../components/lab-request-form/lab-request-form.component';
import { PrescriptionFormComponent } from '../../components/prescription-form/prescription-form.component';
import { SoapFormComponent, SoapFormValue } from '../../components/soap-form/soap-form.component';
import { VaccinationFormComponent } from '../../components/vaccination-form/vaccination-form.component';
import { VitalSignsFormComponent } from '../../components/vital-signs-form/vital-signs-form.component';
import {
  ProfessionalFeeDecisionFormComponent,
  ProfessionalFeePaymentMode
} from './professional-fee-decision-form.component';
import { ConsultationPageVm } from '../doctor-consultation.types';

@Component({
  selector: 'app-consultation-workspace',
  standalone: true,
  imports: [
    DatePipe,
    NgFor,
    NgIf,
    AllergyWarningBannerComponent,
    VitalSignsFormComponent,
    SoapFormComponent,
    DiagnosisPickerComponent,
    PrescriptionFormComponent,
    LabRequestFormComponent,
    FollowUpFormComponent,
    VaccinationFormComponent,
    ProfessionalFeeDecisionFormComponent
  ],
  templateUrl: './consultation-workspace.component.html',
  styleUrl: './consultation-workspace.component.scss'
})
export class ConsultationWorkspaceComponent {
  @Input({ required: true }) vm!: ConsultationPageVm;
  @Input() locked = false;
  @Input() prescriptionItems: PrescriptionItem[] = [];
  @Input() professionalFee = 0;
  @Input() professionalFeePaymentMode: ProfessionalFeePaymentMode = 'Cash';
  @Input() professionalFeeNotes = '';
  @Input() pendingVaccinations: CreatePatientVaccinationRequest[] = [];
  @Input() clinicalRole: ClinicalRole = 'physician';
  @Input() validationRequested = false;

  @Output() vitalSignsChange = new EventEmitter<VitalSigns>();
  @Output() vitalsValidityChange = new EventEmitter<boolean>();
  @Output() soapChange = new EventEmitter<SoapFormValue>();
  @Output() soapValidityChange = new EventEmitter<boolean>();
  @Output() diagnosesChange = new EventEmitter<Diagnosis[]>();
  @Output() diagnosisValidityChange = new EventEmitter<boolean>();
  @Output() prescriptionItemsChange = new EventEmitter<PrescriptionItem[]>();
  @Output() labRequestsChange = new EventEmitter<LabRequestDraftView[]>();
  @Output() followUpChange = new EventEmitter<FollowUpDraftView | null>();
  @Output() professionalFeeChange = new EventEmitter<number>();
  @Output() professionalFeePaymentModeChange = new EventEmitter<ProfessionalFeePaymentMode>();
  @Output() professionalFeeNotesChange = new EventEmitter<string>();
  @Output() professionalFeeValidityChange = new EventEmitter<boolean>();
  @Output() vaccinationsAdded = new EventEmitter<CreatePatientVaccinationRequest[]>();
  @Output() loadFromLastVisit = new EventEmitter<void>();
  @Output() requestPrescription = new EventEmitter<void>();
  @Output() requestLabOrder = new EventEmitter<void>();

  readonly emptyDiagnoses: Diagnosis[] = [];
  readonly emptyPrescriptionItems: PrescriptionItem[] = [];

  get isPhysician(): boolean {
    return this.clinicalRole === 'physician';
  }

  get canEditVaccinations(): boolean {
    return this.clinicalRole === 'physician' || this.clinicalRole === 'nurse' || this.clinicalRole === 'medical_assistant';
  }

  get showPfDecision(): boolean {
    return this.clinicalRole === 'physician' || this.clinicalRole === 'admin' || this.clinicalRole === 'receptionist';
  }

  getLastVisitSoap(vm: ConsultationPageVm): SoapFormValue | null {
    const last = vm.recentConsultations[0];
    if (!last) {
      return null;
    }

    return {
      chiefComplaint: last.chiefComplaint ?? '',
      subjective: last.subjective ?? last.historyOfPresentIllness ?? '',
      objective: last.objective ?? last.peGeneralFindings ?? '',
      assessment: last.assessment ?? '',
      plan: last.plan ?? ''
    };
  }

  getSectionAuditText(
    sectionKey: 'soap' | 'diagnosis' | 'prescription' | 'lab-orders' | 'vaccinations',
    vm: ConsultationPageVm
  ): string {
    const updatedAt = vm.consultation?.updatedAt || vm.booking.doctorCompletedAt || vm.booking.createdAt;
    const doctorName = vm.doctor.fullName || 'Doctor';
    if (sectionKey === 'soap' && !vm.soap.chiefComplaint.trim() && !vm.soap.subjective.trim() && !vm.soap.objective.trim() && !vm.soap.assessment.trim() && !vm.soap.plan.trim()) {
      return 'Not yet edited this visit';
    }

    const hasContent =
      (sectionKey === 'soap' && Boolean(vm.soap.chiefComplaint.trim() || vm.soap.subjective.trim() || vm.soap.objective.trim() || vm.soap.assessment.trim() || vm.soap.plan.trim())) ||
      (sectionKey === 'diagnosis' && Boolean(vm.consultation?.diagnoses?.length)) ||
      (sectionKey === 'prescription' && (vm.existingPrescription?.items?.length ?? 0) > 0) ||
      (sectionKey === 'lab-orders' && vm.labRequestDrafts.length > 0) ||
      (sectionKey === 'vaccinations' && (vm.vaccinations.length > 0 || this.pendingVaccinations.length > 0));

    if (!hasContent) {
      return 'Not yet edited this visit';
    }

    return `Last edited by ${doctorName} at ${this.formatAuditTime(updatedAt)}`;
  }

  private formatAuditTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
}

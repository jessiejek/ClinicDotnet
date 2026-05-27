import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, from, map, of, throwError } from 'rxjs';
import { ApiService } from './api.service';
import {
  Allergy, Consultation, Diagnosis, FollowUp, LabRequest, LabResult,
  Prescription, PrescriptionItem, VitalSigns
} from '../models';

export interface MedicalRecordsState {
  consultations: Consultation[];
  prescriptions: Prescription[];
  allergies: Allergy[];
  labRequests: LabRequest[];
  labResults: LabResult[];
  vaccinations: VaccinationRecord[];
  followUps: FollowUp[];
  isLoading: boolean;
  error: string | null;
}

export type VaccinationRecord = import('../models').VaccinationRecord;

export interface ConsultationUpsertRequest {
  bookingId: string;
  chiefComplaint: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  historyOfPresentIllness?: string;
  peGeneralFindings?: string;
  followUpDate?: string;
  consultationTime?: string;
}

export interface DiagnosisUpsertRequest {
  icd10Code?: string;
  icd10Description?: string;
  description: string;
  type: Diagnosis['type'];
}

export interface PrescriptionUpsertRequest {
  notes?: string;
  items: Array<{
    medicineName: string; genericName?: string; dosageForm: string; strength: string;
    sig: string; quantity: number; frequency?: string; duration?: string;
    instructions?: string; isControlledSubstance?: boolean; route?: string;
    routeDescription?: string; unitOfMeasure?: string; unitOfMeasureDescription?: string;
    frequencyCode?: string; brandName?: string;
  }>;
}

export interface LabRequestUpsertRequest {
  testName: string;
  reason?: string;
}

@Injectable({ providedIn: 'root' })
export class MedicalRecordsService {
  private readonly api = inject(ApiService);

  // ── Stubbed methods (not yet implemented on .NET) ──
  fetchConsultation(_id: string): Observable<Consultation> {
    return throwError(() => new Error('fetchConsultation — not implemented.'));
  }
  createConsultation(_body: ConsultationUpsertRequest): Observable<Consultation> {
    return throwError(() => new Error('createConsultation — not implemented.'));
  }
  updateConsultation(_id: string, _body: ConsultationUpsertRequest): Observable<Consultation> {
    return throwError(() => new Error('updateConsultation — not implemented.'));
  }
  lockConsultation$(_id: string): Observable<Consultation> {
    return throwError(() => new Error('lockConsultation$ — not implemented.'));
  }
  saveVitalSigns(_consultationId: string, _body: VitalSigns): Observable<VitalSigns> {
    return throwError(() => new Error('saveVitalSigns — not implemented.'));
  }
  addDiagnosis(_consultationId: string, _body: DiagnosisUpsertRequest): Observable<Diagnosis> {
    return throwError(() => new Error('addDiagnosis — not implemented.'));
  }
  deleteDiagnosis(_consultationId: string, _diagnosisId: string): Observable<unknown> {
    return throwError(() => new Error('deleteDiagnosis — not implemented.'));
  }
  addPrescription(_consultationId: string, _body: PrescriptionUpsertRequest): Observable<Prescription> {
    return throwError(() => new Error('addPrescription — not implemented.'));
  }
  updatePrescription(_consultationId: string, _prescriptionId: string, _body: PrescriptionUpsertRequest): Observable<Prescription> {
    return throwError(() => new Error('updatePrescription — not implemented.'));
  }
  deletePrescription(_consultationId: string, _prescriptionId: string): Observable<unknown> {
    return throwError(() => new Error('deletePrescription — not implemented.'));
  }
  addLabRequest(_consultationId: string, _body: LabRequestUpsertRequest): Observable<LabRequest> {
    return throwError(() => new Error('addLabRequest — not implemented.'));
  }
  deleteLabRequest(_consultationId: string, _requestId: string): Observable<unknown> {
    return throwError(() => new Error('deleteLabRequest — not implemented.'));
  }

  // ── Full patient records (via API) ──
  fetchPatientMedicalRecords(patientId: string): Observable<MedicalRecordsState> {
    return forkJoin({
      consultations: this.getConsultationsByPatientId(patientId).pipe(catchError(() => of([]))),
      prescriptions: this.getPrescriptionsByPatientId(patientId).pipe(catchError(() => of([]))),
      allergies: this.getAllergiesByPatientId(patientId).pipe(catchError(() => of([]))),
      labRequests: this.getLabRequestsByPatientId(patientId).pipe(catchError(() => of([]))),
      labResults: this.getLabResultsByPatientId(patientId).pipe(catchError(() => of([]))),
      vaccinations: this.getVaccinationsByPatientId(patientId).pipe(catchError(() => of([]))),
      followUps: this.getFollowUpsByPatientId(patientId).pipe(catchError(() => of([]))),
    }).pipe(
      map((results) => ({ ...results, isLoading: false, error: null })),
      map((state) => state as MedicalRecordsState)
    );
  }

  // ── Individual queries ──

  getConsultationByBookingId(bookingId: string): Observable<Consultation | undefined> {
    return from(this.fetchOne<any>('medical-records/consultations', 'bookingId', bookingId).then(mapConsultationRow));
  }

  getConsultationsByPatientId(patientId: string): Observable<Consultation[]> {
    return from(this.fetchMany<any>('medical-records/consultations', patientId).then((r) => r.map(mapConsultationRow)));
  }

  getPrescriptionsByPatientId(patientId: string): Observable<Prescription[]> {
    return from(this.fetchMany<any>('medical-records/prescriptions', patientId).then((r) => r.map(mapPrescriptionRow)));
  }

  getAllergiesByPatientId(patientId: string): Observable<Allergy[]> {
    return from(this.fetchMany<any>('medical-records/allergies', patientId).then((r) => r.map(mapAllergyRow)));
  }

  getLabRequestsByPatientId(patientId: string): Observable<LabRequest[]> {
    return from(this.fetchMany<any>('medical-records/lab-orders', patientId).then((r) => r.map(mapLabOrderRow)));
  }

  getLabResultsByPatientId(patientId: string): Observable<LabResult[]> {
    return from(this.fetchMany<any>('medical-records/lab-results', patientId).then((r) => r.map(mapLabResultViewRow)));
  }

  getVaccinationsByPatientId(patientId: string): Observable<VaccinationRecord[]> {
    return from(this.fetchMany<any>('medical-records/vaccinations', patientId).then((r) => r.map(mapVaccinationRow)));
  }

  getFollowUpsByPatientId(patientId: string): Observable<FollowUp[]> {
    return from(this.fetchMany<any>('medical-records/follow-ups', patientId).then((r) => r.map(mapFollowUpRow)));
  }

  // ── CRUD operations ──

  createAllergy(allergy: Partial<Allergy>): Observable<Allergy> {
    return from(this.api.post<any>('medical-records/allergies', allergy).toPromise().then(mapAllergyRow));
  }

  updateAllergy(id: string, allergy: Partial<Allergy>): Observable<Allergy> {
    return from(this.api.put<any>('medical-records/allergies/' + id, allergy).toPromise().then(mapAllergyRow));
  }

  addAllergy(allergy: Partial<Allergy>): Observable<Allergy> {
    return this.createAllergy(allergy);
  }

  deleteAllergy(id: string): Observable<unknown> {
    return from(this.api.delete('medical-records/allergies/' + id).toPromise());
  }

  createLabResult(result: Partial<LabResult>): Observable<LabResult> {
    return from(this.api.post<any>('medical-records/lab-results', result).toPromise().then(mapLabResultViewRow));
  }

  addLabResult(result: Partial<LabResult>): Observable<LabResult> {
    return this.createLabResult(result);
  }

  deleteLabResult(id: string): Observable<unknown> {
    return from(this.api.delete('medical-records/lab-results/' + id).toPromise());
  }

  createVaccination(record: Partial<VaccinationRecord>): Observable<VaccinationRecord> {
    return from(this.api.post<any>('medical-records/vaccinations', record).toPromise().then(mapVaccinationRow));
  }

  updateVaccination(id: string, record: Partial<VaccinationRecord>): Observable<VaccinationRecord> {
    return from(this.api.put<any>('medical-records/vaccinations/' + id, record).toPromise().then(mapVaccinationRow));
  }

  addVaccinationRecord(record: Partial<VaccinationRecord>): Observable<VaccinationRecord> {
    return this.createVaccination(record);
  }

  deleteVaccination(id: string): Observable<unknown> {
    return from(this.api.delete('medical-records/vaccinations/' + id).toPromise());
  }

  createFollowUp(followUp: Partial<FollowUp>): Observable<FollowUp> {
    return from(this.api.post<any>('medical-records/follow-ups', followUp).toPromise().then(mapFollowUpRow));
  }

  updateFollowUp(id: string, followUp: Partial<FollowUp>): Observable<FollowUp> {
    return from(this.api.put<any>('medical-records/follow-ups/' + id, followUp).toPromise().then(mapFollowUpRow));
  }

  deleteFollowUp(id: string): Observable<unknown> {
    return from(this.api.delete('medical-records/follow-ups/' + id).toPromise());
  }

  // ── Helpers ──

  private async fetchMany<T>(endpoint: string, patientId: string): Promise<T[]> {
    return (await this.api.get<T[]>(endpoint + '?patientId=' + patientId).toPromise()) ?? [];
  }

  private async fetchOne<T>(endpoint: string, field: string, value: string): Promise<T | undefined> {
    const rows = await this.fetchMany<T>(endpoint, value);
    return rows.length > 0 ? rows[0] : undefined;
  }
}

// ── Mapping functions ──

function mapConsultationRow(row: Record<string, unknown>): Consultation {
  return {
    id: str(row, 'id'),
    bookingId: str(row, 'bookingId'),
    patientId: str(row, 'patientId'),
    doctorId: str(row, 'doctorId'),
    consultationDate: str(row, 'consultationDate'),
    chiefComplaint: str(row, 'chiefComplaint'),
    subjective: str(row, 'subjective'),
    objective: str(row, 'objective'),
    assessment: str(row, 'assessment'),
    plan: str(row, 'plan'),
    diagnoses: (row['diagnoses'] ?? []) as Diagnosis[],
    prescriptionIds: (row['prescriptionIds'] ?? row['prescription_ids'] ?? []) as string[],
    labRequestIds: (row['labRequestIds'] ?? row['lab_request_ids'] ?? []) as string[],
    status: (str(row, 'status') as Consultation['status']) || 'Draft',
    isLocked: Boolean(row['isLocked'] ?? row['is_locked'] ?? false),
    createdAt: str(row, 'createdAt'),
    updatedAt: str(row, 'updatedAt'),
    generalNotes: strOpt(row, 'generalNotes'),
    vitalSigns: row['vitalSigns'] ?? row['vital_signs'] ?? undefined,
    followUpDate: strOpt(row, 'followUpDate'),
    consultationTime: strOpt(row, 'consultationTime'),
    historyOfPresentIllness: strOpt(row, 'historyOfPresentIllness'),
    peGeneralFindings: strOpt(row, 'peGeneralFindings'),
  };
}

function mapPrescriptionRow(row: Record<string, unknown>): Prescription {
  return {
    id: str(row, 'id'),
    consultationId: str(row, 'consultationId'),
    patientId: str(row, 'patientId'),
    doctorId: str(row, 'doctorId'),
    issuedAt: str(row, 'issuedAt'),
    status: (str(row, 'status') as Prescription['status']) || 'Active',
    items: (row['items'] ?? row['prescription_items'] ?? []) as PrescriptionItem[],
    notes: strOpt(row, 'notes'),
  };
}

function mapAllergyRow(row: Record<string, unknown>): Allergy {
  return {
    id: str(row, 'id'),
    patientId: str(row, 'patientId'),
    allergen: str(row, 'allergen'),
    reaction: str(row, 'reaction'),
    severity: (str(row, 'severity') as Allergy['severity']) || 'Mild',
    notes: strOpt(row, 'notes'),
  };
}

function mapLabOrderRow(row: Record<string, unknown>): LabRequest {
  return {
    id: str(row, 'id'),
    consultationId: str(row, 'consultationId'),
    patientId: str(row, 'patientId'),
    doctorId: str(row, 'doctorId'),
    testName: str(row, 'testName'),
    reason: strOpt(row, 'reason'),
    status: (str(row, 'status') as LabRequest['status']) || 'Requested',
    requestedAt: str(row, 'requestedAt'),
  };
}

function mapLabResultViewRow(row: Record<string, unknown>): LabResult {
  return {
    id: str(row, 'id'),
    labRequestId: str(row, 'labRequestId'),
    patientId: str(row, 'patientId'),
    fileName: str(row, 'fileName'),
    resultDate: str(row, 'resultDate'),
    notes: strOpt(row, 'notes'),
  };
}

function mapVaccinationRow(row: Record<string, unknown>): VaccinationRecord {
  return {
    id: str(row, 'id'),
    patientId: str(row, 'patientId'),
    vaccineName: str(row, 'vaccineName'),
    dateGiven: str(row, 'dateGiven'),
    administeredBy: strOpt(row, 'administeredBy'),
    doseNumber: num(row, 'doseNumber'),
    lotNumber: strOpt(row, 'lotNumber'),
    brandName: strOpt(row, 'brandName'),
    dateAdministered: strOpt(row, 'dateAdministered'),
    administeredByUserId: strOpt(row, 'administeredByUserId'),
    nextDoseDate: strOpt(row, 'nextDoseDate'),
    remarks: strOpt(row, 'remarks'),
  };
}

function mapFollowUpRow(row: Record<string, unknown>): FollowUp {
  return {
    id: str(row, 'id'),
    consultationId: str(row, 'consultationId'),
    patientId: str(row, 'patientId'),
    doctorId: str(row, 'doctorId'),
    followUpDate: str(row, 'followUpDate'),
    reason: str(row, 'reason'),
    status: (str(row, 'status') as FollowUp['status']) || 'Pending',
  };
}

function str(row: Record<string, unknown>, key: string): string {
  const snake = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
  const val = row[key] ?? row[snake];
  if (typeof val !== 'string') return '';
  return val.trim();
}

function strOpt(row: Record<string, unknown>, key: string): string | undefined {
  const v = str(row, key);
  return v || undefined;
}

function num(row: Record<string, unknown>, key: string): number | undefined {
  const snake = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
  const val = row[key] ?? row[snake];
  if (typeof val === 'number' && isFinite(val)) return val;
  return undefined;
}

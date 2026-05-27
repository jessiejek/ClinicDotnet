import { Injectable } from '@angular/core';
import {
  Allergy,
  Consultation,
  Diagnosis,
  FollowUp,
  LabRequest,
  LabResult,
  Prescription,
  PrescriptionItem,
  VitalSigns
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
    medicineName: string;
    genericName?: string;
    dosageForm: string;
    strength: string;
    sig: string;
    quantity: number;
    frequency?: string;
    duration?: string;
    instructions?: string;
    isControlledSubstance?: boolean;
    route?: string;
    routeDescription?: string;
    unitOfMeasure?: string;
    unitOfMeasureDescription?: string;
    frequencyCode?: string;
    brandName?: string;
  }>;
}

export interface LabRequestUpsertRequest {
  testName: string;
  reason?: string;
}

export interface ConsultationRecordResponse {
  bookingId: string;
  consultationId?: string | null;
  patientId: string;
  doctorId: string;
  bookingStatus: 'Completed' | 'DoctorCompleted' | 'Billed' | 'Paid' | 'Cancelled' | 'Rejected' | 'CheckedIn' | 'Pending' | 'InProgress' | string;
  generalNotes?: string | null;
  vitalSigns: VitalSigns | null;
  soap: {
    chiefComplaint?: string | null;
    subjective?: string | null;
    objective?: string | null;
    assessment?: string | null;
    plan?: string | null;
  } | null;
  diagnoses: Diagnosis[];
  prescription: {
    id?: string | null;
    notes?: string | null;
    items: Array<{
      id?: string | null;
      medicationName: string;
      strength?: string | null;
      dosage?: string | null;
      route?: string | null;
      frequency?: string | null;
      duration?: string | null;
      quantity?: string | null;
      instructions?: string | null;
    }>;
  } | null;
  labOrders: Array<{
    id?: string | null;
    notes?: string | null;
    items: Array<{
      id?: string | null;
      testName: string;
      testCode?: string | null;
      instructions?: string | null;
    }>;
  }>;
  followUp: {
    id?: string | null;
    followUpDate?: string | null;
    instructions?: string | null;
    reason?: string | null;
  } | null;
}

@Injectable({ providedIn: 'root' })
export class MedicalRecordsService {
  mapConsultationRows(rows: unknown[]): Consultation[] {
    return asRecords(rows).map(mapConsultationRow).filter((item): item is Consultation => Boolean(item));
  }

  mapPrescriptionRows(rows: unknown[]): Prescription[] {
    return asRecords(rows).map(mapPrescriptionRow).filter((item): item is Prescription => Boolean(item));
  }

  mapAllergyRows(rows: unknown[]): Allergy[] {
    return asRecords(rows).map(mapAllergyRow).filter((item): item is Allergy => Boolean(item));
  }

  mapLabRequestRows(rows: unknown[]): LabRequest[] {
    return asRecords(rows).map(mapLabOrderRow).filter((item): item is LabRequest => Boolean(item));
  }

  mapLabResultRows(rows: unknown[]): LabResult[] {
    return asRecords(rows).map(mapLabResultViewRow).filter((item): item is LabResult => Boolean(item));
  }

  mapVaccinationRows(rows: unknown[]): VaccinationRecord[] {
    return asRecords(rows).map(mapVaccinationRow).filter((item): item is VaccinationRecord => Boolean(item));
  }

  mapFollowUpRows(rows: unknown[]): FollowUp[] {
    return asRecords(rows).map(mapFollowUpRow).filter((item): item is FollowUp => Boolean(item));
  }

  mapConsultationRecordRow(row: unknown): ConsultationRecordResponse | null {
    if (!isRecord(row)) {
      return null;
    }
    return mapConsultationRecordRowInternal(row);
  }
}

function mapConsultationRow(row: Record<string, unknown>): Consultation | null {
  const id = str(row, 'id');
  if (!id) {
    return null;
  }

  return {
    id,
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

function mapPrescriptionRow(row: Record<string, unknown>): Prescription | null {
  const id = str(row, 'id');
  if (!id) {
    return null;
  }

  return {
    id,
    consultationId: str(row, 'consultationId'),
    patientId: str(row, 'patientId'),
    doctorId: str(row, 'doctorId'),
    issuedAt: str(row, 'issuedAt'),
    status: (str(row, 'status') as Prescription['status']) || 'Active',
    items: (row['items'] ?? row['prescription_items'] ?? []) as PrescriptionItem[],
    notes: strOpt(row, 'notes'),
  };
}

function mapAllergyRow(row: Record<string, unknown>): Allergy | null {
  const id = str(row, 'id');
  if (!id) {
    return null;
  }

  return {
    id,
    patientId: str(row, 'patientId'),
    allergen: str(row, 'allergen'),
    reaction: str(row, 'reaction'),
    severity: (str(row, 'severity') as Allergy['severity']) || 'Mild',
    notes: strOpt(row, 'notes'),
  };
}

function mapLabOrderRow(row: Record<string, unknown>): LabRequest | null {
  const id = str(row, 'id');
  if (!id) {
    return null;
  }

  return {
    id,
    consultationId: str(row, 'consultationId'),
    patientId: str(row, 'patientId'),
    doctorId: str(row, 'doctorId'),
    testName: str(row, 'testName'),
    reason: strOpt(row, 'reason'),
    status: (str(row, 'status') as LabRequest['status']) || 'Requested',
    requestedAt: str(row, 'requestedAt'),
  };
}

function mapLabResultViewRow(row: Record<string, unknown>): LabResult | null {
  const id = str(row, 'id');
  if (!id) {
    return null;
  }

  return {
    id,
    labRequestId: str(row, 'labRequestId'),
    patientId: str(row, 'patientId'),
    fileName: str(row, 'fileName'),
    resultDate: str(row, 'resultDate'),
    notes: strOpt(row, 'notes'),
  };
}

function mapVaccinationRow(row: Record<string, unknown>): VaccinationRecord | null {
  const id = str(row, 'id');
  if (!id) {
    return null;
  }

  return {
    id,
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

function mapFollowUpRow(row: Record<string, unknown>): FollowUp | null {
  const id = str(row, 'id');
  if (!id) {
    return null;
  }

  return {
    id,
    consultationId: str(row, 'consultationId'),
    patientId: str(row, 'patientId'),
    doctorId: str(row, 'doctorId'),
    followUpDate: str(row, 'followUpDate'),
    reason: str(row, 'reason'),
    status: (str(row, 'status') as FollowUp['status']) || 'Pending',
  };
}

function mapConsultationRecordRowInternal(row: Record<string, unknown>): ConsultationRecordResponse {
  const prescriptionRows = Array.isArray(row['prescriptions']) ? row['prescriptions'] : [];
  const firstPrescription = prescriptionRows.find((item) => typeof item === 'object' && item !== null) as
    | Record<string, unknown>
    | undefined;
  const firstFollowUpRow = Array.isArray(row['follow_ups'])
    ? (row['follow_ups'].find((item) => typeof item === 'object' && item !== null) as Record<string, unknown> | undefined)
    : undefined;

  const prescription = firstPrescription
    ? {
        id: strOpt(firstPrescription, 'id'),
        notes: strOpt(firstPrescription, 'notes'),
        items: Array.isArray(firstPrescription['items'])
          ? firstPrescription['items']
              .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
              .map((item) => ({
                id: strOpt(item, 'id'),
                medicationName: str(item, 'medication_name') ?? '',
                strength: strOpt(item, 'strength'),
                dosage: strOpt(item, 'dosage'),
                route: strOpt(item, 'route'),
                frequency: strOpt(item, 'frequency'),
                duration: strOpt(item, 'duration'),
                quantity: strOpt(item, 'quantity'),
                instructions: strOpt(item, 'instructions')
              }))
              .filter((item) => item.medicationName.length > 0)
          : []
      }
    : null;

  return {
    bookingId: str(row, 'booking_id') ?? '',
    consultationId: strOpt(row, 'consultation_id'),
    patientId: str(row, 'patient_id') ?? '',
    doctorId: str(row, 'doctor_id') ?? '',
    bookingStatus: (str(row, 'booking_status') ?? 'Completed') as ConsultationRecordResponse['bookingStatus'],
    generalNotes: strOpt(row, 'general_notes'),
    vitalSigns: null,
    soap: null,
    diagnoses: [],
    prescription,
    labOrders: [],
    followUp: firstFollowUpRow
      ? {
          id: strOpt(firstFollowUpRow, 'id'),
          followUpDate: strOpt(firstFollowUpRow, 'follow_up_date'),
          instructions: strOpt(firstFollowUpRow, 'instructions'),
          reason: strOpt(firstFollowUpRow, 'reason')
        }
      : null
  };
}

function str(row: Record<string, unknown>, key: string): string {
  const snake = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
  const val = row[key] ?? row[snake];
  if (typeof val !== 'string') return '';
  const trimmed = val.trim();
  return trimmed || '';
}

function strOpt(row: Record<string, unknown>, key: string): string | undefined {
  const value = str(row, key);
  return value || undefined;
}

function num(row: Record<string, unknown>, key: string): number | undefined {
  const snake = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
  const val = row[key] ?? row[snake];
  if (typeof val === 'number' && isFinite(val)) return val;
  return undefined;
}

function asRecords(rows: unknown[]): Record<string, unknown>[] {
  return rows.filter((row): row is Record<string, unknown> => typeof row === 'object' && row !== null);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

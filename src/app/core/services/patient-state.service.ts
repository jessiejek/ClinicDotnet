import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Patient } from '../models';
import { ApiService } from './api.service';

type NullableString = string | null | undefined;

interface PatientRow {
  id: string;
  patient_code?: NullableString;
  first_name?: NullableString;
  middle_name?: NullableString;
  last_name?: NullableString;
  date_of_birth?: NullableString;
  sex?: NullableString;
  civil_status?: NullableString;
  address?: NullableString;
  city?: NullableString;
  zip_code?: NullableString;
  contact_number?: NullableString;
  contact_email?: NullableString;
  emergency_contact_name?: NullableString;
  emergency_contact_number?: NullableString;
  emergency_contact_relationship?: NullableString;
  blood_type?: NullableString;
  phil_health_number?: NullableString;
  hmo_provider?: NullableString;
  hmo_card_number?: NullableString;
  user_id?: NullableString;
  is_guest?: boolean | null;
  is_email_verified?: boolean | null;
  consented_at?: NullableString;
  consent_version?: NullableString;
  created_at?: NullableString;
  updated_at?: NullableString;
}

function rowToPatient(row: PatientRow): Patient {
  return {
    id: row.id,
    patientCode: row.patient_code ?? '',
    firstName: row.first_name ?? '',
    middleName: row.middle_name ?? undefined,
    lastName: row.last_name ?? '',
    dateOfBirth: row.date_of_birth ?? '',
    sex: row.sex ?? '',
    civilStatus: row.civil_status ?? undefined,
    address: row.address ?? undefined,
    city: row.city ?? undefined,
    zipCode: row.zip_code ?? undefined,
    contactNumber: row.contact_number ?? undefined,
    email: row.contact_email ?? undefined,
    emergencyContactName: row.emergency_contact_name ?? undefined,
    emergencyContactNumber: row.emergency_contact_number ?? undefined,
    emergencyContactRelationship: row.emergency_contact_relationship ?? undefined,
    bloodType: row.blood_type ?? undefined,
    philHealthNumber: row.phil_health_number ?? undefined,
    hmoProvider: row.hmo_provider ?? undefined,
    hmoCardNumber: row.hmo_card_number ?? undefined,
    userId: row.user_id ?? undefined,
    hasAccount: row.user_id ? true : false,
    isEmailVerified: row.is_email_verified ?? false,
    isGuest: row.is_guest ?? false,
    consentedAt: row.consented_at ?? undefined,
    consentVersion: row.consent_version ?? undefined,
    // createdAt/updatedAt not in PatientDetail type
  };
}

function mapRows(rows: PatientRow[]): Patient[] {
  return rows.map(rowToPatient);
}

@Injectable({ providedIn: 'root' })
export class PatientStateService {
  private readonly api = inject(ApiService);
  private readonly patientsSubject = new BehaviorSubject<Patient[]>([]);
  private readonly loadingSubject = new BehaviorSubject(false);

  readonly patients$ = this.patientsSubject.asObservable();
  readonly isLoading$ = this.loadingSubject.asObservable();

  refresh(): void {
    this.loadingSubject.next(true);
    this.api.get<any[]>('patients').subscribe({
      next: (data) => {
        this.patientsSubject.next(mapRows(data as PatientRow[]));
        this.loadingSubject.next(false);
      },
      error: () => this.loadingSubject.next(false)
    });
  }

  getPatients(): Observable<Patient[]> {
    if (this.patientsSubject.value.length === 0) this.refresh();
    return this.patients$;
  }

  getPatientById(id: string): Observable<Patient | undefined> {
    return this.api.get<any>('patients/' + id).pipe(
      map((data) => data ? rowToPatient(data as PatientRow) : undefined)
    );
  }

  getPatientByUserId(userId: string): Observable<Patient | undefined> {
    return this.api.get<any[]>('patients?userId=' + userId).pipe(
      map((data) => {
        const rows = (data ?? []) as PatientRow[];
        return rows.length > 0 ? rowToPatient(rows[0]) : undefined;
      })
    );
  }

  getFilteredPatients(query: string): Observable<Patient[]> {
    return this.api.get<any[]>('patients?search=' + encodeURIComponent(query)).pipe(
      map((data) => mapRows((data ?? []) as PatientRow[]))
    );
  }

  addPatient(patient: Omit<Patient, 'id' | 'patientCode'>): Patient {
    const saved: Patient = {
      ...patient,
      id: `pat-${Date.now()}`,
      patientCode: toPatientCode(this.patientsSubject.value.length + 1)
    };
    this.upsert(saved);
    return saved;
  }

  savePatient(patient: Patient): void {
    this.upsert(patient);
    this.api.put(`patients/${patient.id}`, patient).subscribe({
      error: (err) => console.error('[PatientStateService] Failed to save patient:', err)
    });
  }

  updatePatientConsent(patientId: string, consentVersion: string): void {
    this.api.post(`patients/${patientId}/portal-account`, { consentVersion }).subscribe({
      next: () => this.refresh(),
      error: (err) => console.error('[PatientStateService] Failed to update consent:', err)
    });
  }



  private upsert(patient: Patient): void {
    this.patientsSubject.next([
      ...this.patientsSubject.value.filter((item) => item.id !== patient.id),
      { ...patient }
    ]);
  }
}

function toPatientCode(count: number): string {
  return `PT-${new Date().getFullYear()}-${String(count).padStart(5, '0')}`;
}

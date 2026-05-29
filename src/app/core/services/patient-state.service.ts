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

function withCamelCaseFallback(raw: Record<string, unknown>): PatientRow {
  const row: Record<string, unknown> = { ...raw };
  row['patient_code'] = row['patient_code'] ?? row['patientCode'];
  row['first_name'] = row['first_name'] ?? row['firstName'];
  row['middle_name'] = row['middle_name'] ?? row['middleName'];
  row['last_name'] = row['last_name'] ?? row['lastName'];
  row['date_of_birth'] = row['date_of_birth'] ?? row['dateOfBirth'];
  row['civil_status'] = row['civil_status'] ?? row['civilStatus'];
  row['zip_code'] = row['zip_code'] ?? row['zipCode'];
  row['contact_number'] = row['contact_number'] ?? row['contactNumber'];
  row['contact_email'] = row['contact_email'] ?? row['email'];
  row['emergency_contact_name'] = row['emergency_contact_name'] ?? row['emergencyContactName'];
  row['emergency_contact_number'] = row['emergency_contact_number'] ?? row['emergencyContactNumber'];
  row['emergency_contact_relationship'] = row['emergency_contact_relationship'] ?? row['emergencyContactRelationship'];
  row['blood_type'] = row['blood_type'] ?? row['bloodType'];
  row['phil_health_number'] = row['phil_health_number'] ?? row['philHealthNumber'];
  row['hmo_provider'] = row['hmo_provider'] ?? row['hmoProvider'];
  row['hmo_card_number'] = row['hmo_card_number'] ?? row['hmoCardNumber'];
  row['user_id'] = row['user_id'] ?? row['userId'];
  row['is_guest'] = row['is_guest'] ?? row['isGuest'];
  row['is_email_verified'] = row['is_email_verified'] ?? row['isEmailVerified'];
  row['consented_at'] = row['consented_at'] ?? row['consentedAt'];
  row['consent_version'] = row['consent_version'] ?? row['consentVersion'];
  row['created_at'] = row['created_at'] ?? row['createdAt'];
  row['updated_at'] = row['updated_at'] ?? row['updatedAt'];
  return row as unknown as PatientRow;
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
    this.api.get<any>('patients').subscribe({
      next: (data: any) => {
        try {
          const rawRows = (data?.items ?? data ?? []) as Record<string, unknown>[];
          this.patientsSubject.next(rawRows.map(r => rowToPatient(withCamelCaseFallback(r))));
        } finally {
          this.loadingSubject.next(false);
        }
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
      map((data) => data ? rowToPatient(withCamelCaseFallback(data as Record<string, unknown>)) : undefined)
    );
  }

  getPatientByUserId(userId: string): Observable<Patient | undefined> {
    return this.api.get<any[]>('patients?userId=' + userId).pipe(
      map((data) => {
        const rawRows = (data ?? []) as Record<string, unknown>[];
        const rows = rawRows.map(r => withCamelCaseFallback(r));
        return rows.length > 0 ? rowToPatient(rows[0]) : undefined;
      })
    );
  }

  getFilteredPatients(query: string): Observable<Patient[]> {
    return this.api.get<any[]>('patients?search=' + encodeURIComponent(query)).pipe(
      map((data) => {
        const rawRows = (data ?? []) as Record<string, unknown>[];
        return rawRows.map(r => rowToPatient(withCamelCaseFallback(r)));
      })
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

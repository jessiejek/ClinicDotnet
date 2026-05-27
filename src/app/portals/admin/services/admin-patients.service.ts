import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CreatePatientPortalAccountRequest, CreatePatientRequest, PagedResult, PatientDetail, PatientSummary, UpdatePatientRequest } from '../../../core/models';

type NullableString = string | null | undefined;

interface PatientRow {
  id: string;
  patient_code?: NullableString; first_name?: NullableString; middle_name?: NullableString;
  last_name?: NullableString; date_of_birth?: NullableString; sex?: NullableString;
  civil_status?: NullableString; address?: NullableString; city?: NullableString;
  zip_code?: NullableString; contact_number?: NullableString; contact_email?: NullableString;
  emergency_contact_name?: NullableString; emergency_contact_number?: NullableString;
  emergency_contact_relationship?: NullableString; blood_type?: NullableString;
  phil_health_number?: NullableString; hmo_provider?: NullableString; hmo_card_number?: NullableString;
  user_id?: NullableString; is_guest?: boolean | null;
  consented_at?: NullableString; consent_version?: NullableString;
}

function rowToSummary(row: PatientRow): PatientSummary {
  return {
    id: row.id,
    patientCode: row.patient_code ?? '',
    firstName: row.first_name ?? '', middleName: row.middle_name ?? undefined, lastName: row.last_name ?? '',
    fullName: [row.first_name, row.middle_name, row.last_name].filter(Boolean).join(' '),
    dateOfBirth: row.date_of_birth ?? '', sex: row.sex ?? '',
    contactNumber: row.contact_number ?? undefined, email: row.contact_email ?? undefined,
    userId: row.user_id ?? undefined, hasAccount: !!row.user_id, isGuest: row.is_guest ?? false,
  };
}

function rowToDetail(row: PatientRow): PatientDetail {
  return {
    id: row.id, patientCode: row.patient_code ?? '',
    firstName: row.first_name ?? '', middleName: row.middle_name ?? undefined, lastName: row.last_name ?? '',
    dateOfBirth: row.date_of_birth ?? '', sex: row.sex ?? '',
    civilStatus: row.civil_status ?? undefined, address: row.address ?? undefined,
    city: row.city ?? undefined, zipCode: row.zip_code ?? undefined,
    contactNumber: row.contact_number ?? undefined, email: row.contact_email ?? undefined,
    emergencyContactName: row.emergency_contact_name ?? undefined,
    emergencyContactNumber: row.emergency_contact_number ?? undefined,
    emergencyContactRelationship: row.emergency_contact_relationship ?? undefined,
    bloodType: row.blood_type ?? undefined, philHealthNumber: row.phil_health_number ?? undefined,
    hmoProvider: row.hmo_provider ?? undefined, hmoCardNumber: row.hmo_card_number ?? undefined,
    userId: row.user_id ?? undefined, hasAccount: !!row.user_id,
    isEmailVerified: false, isGuest: row.is_guest ?? false,
    consentedAt: row.consented_at ?? undefined, consentVersion: row.consent_version ?? undefined,
  };
}

@Injectable({ providedIn: 'root' })
export class AdminPatientsService {
  private readonly api = inject(ApiService);

  getPatients(page = 1, pageSize = 20, search?: string): Observable<PagedResult<PatientSummary>> {
    let endpoint = `patients?page=${page}&pageSize=${pageSize}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    return from(this.fetchPatients(endpoint));
  }

  createGuestPatient(dto: CreatePatientRequest): Observable<PatientDetail> {
    return this.createPatient(dto);
  }

  getPatientById(id: string): Observable<PatientDetail> {
    return from(this.fetchPatient(id));
  }

  createPatient(dto: CreatePatientRequest): Observable<PatientDetail> {
    return from(this.create(dto));
  }

  updatePatient(id: string, dto: UpdatePatientRequest): Observable<PatientDetail> {
    return from(this.update(id, dto));
  }

  createPortalAccount(patientIdOrRequest: any, request?: any): Observable<any> {
    // Handle both (payload) and (id, payload) signatures
    const payload = request ?? patientIdOrRequest;
    return from(this.api.post('patients', payload).toPromise());
  }

  private async fetchPatients(endpoint: string): Promise<PagedResult<PatientSummary>> {
    const data = await this.api.get<any>(endpoint).toPromise();
    const items = (data?.items ?? data ?? []).map(rowToSummary);
    return {
      items,
      totalCount: data?.totalCount ?? items.length,
      total: data?.total ?? items.length,
      page: data?.page ?? 1,
      pageSize: data?.pageSize ?? items.length,
      totalPages: data?.totalPages ?? 1,
    };
  }

  private async fetchPatient(id: string): Promise<PatientDetail> {
    const data = await this.api.get<any>(`patients/${id}`).toPromise();
    return rowToDetail(data as PatientRow);
  }

  private async create(dto: CreatePatientRequest): Promise<PatientDetail> {
    const data = await this.api.post<any>('patients', dto).toPromise();
    return rowToDetail(data as PatientRow);
  }

  private async update(id: string, dto: UpdatePatientRequest): Promise<PatientDetail> {
    const data = await this.api.put<any>(`patients/${id}`, dto).toPromise();
    return rowToDetail(data as PatientRow);
  }
}

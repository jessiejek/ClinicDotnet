import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { PagedResult } from '../../../core/models';

export interface StaffDoctor {
  id: string;
  fullName: string;
  specialization?: string;
}

export interface StaffPatient {
  id: string;
  patientCode: string;
  fullName: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
  contactNumber: string;
  email: string;
  userId?: string;
  isGuest: boolean;
  hasAccount?: boolean;
}

function toStaffPatient(row: Record<string, unknown>): StaffPatient {
  const firstName = (row['firstName'] ?? row['first_name'] ?? '') as string;
  const middleName = (row['middleName'] ?? row['middle_name']) as string | undefined;
  const lastName = (row['lastName'] ?? row['last_name'] ?? '') as string;
  const id = (row['id'] ?? row['Id'] ?? '') as string;
  return {
    id,
    patientCode: (row['patientCode'] ?? row['patient_code'] ?? '') as string,
    fullName: (row['fullName'] ?? row['FullName'] ?? [firstName, middleName, lastName].filter(Boolean).join(' ')) as string,
    firstName,
    middleName,
    lastName,
    dateOfBirth: (row['dateOfBirth'] ?? row['date_of_birth'] ?? '') as string,
    sex: (row['sex'] ?? row['Sex'] ?? '') as string,
    contactNumber: (row['contactNumber'] ?? row['contact_number'] ?? '') as string,
    email: (row['email'] ?? row['contact_email'] ?? '') as string,
    userId: (row['userId'] ?? row['user_id']) as string | undefined,
    isGuest: (row['isGuest'] ?? row['is_guest'] ?? false) as boolean,
    hasAccount: !!(row['userId'] ?? row['user_id']),
  };
}

@Injectable({ providedIn: 'root' })
export class StaffService {
  private readonly api = inject(ApiService);

  getDoctors(): Observable<StaffDoctor[]> {
    return from(this.fetchDoctors());
  }

  getPatients(page = 1, pageSize = 20, search?: string): Observable<PagedResult<StaffPatient>> {
    return from(this.fetchPatients(page, pageSize, search));
  }

  getPatientById(id: string): Observable<StaffPatient | undefined> {
    return from(this.fetchPatientById(id));
  }

  getPatientByPhone(phone: string): Observable<PagedResult<StaffPatient>> {
    return from(this.fetchPatients(1, 20, phone));
  }

  createPatientPortalAccount(patientId: string, request: any): Observable<any> {
    return from(this.api.post('patients/' + patientId + '/portal-account', request).toPromise());
  }

  private async fetchDoctors(): Promise<StaffDoctor[]> {
    const data = await this.api.get<any[]>('doctors').toPromise();
    return (data ?? []).map((r: Record<string, unknown>) => ({
      id: (r['id'] ?? r['Id'] ?? '') as string,
      fullName: (r['fullName'] ?? r['full_name'] ?? r['FullName'] ?? '') as string,
      specialization: (r['specialization'] ?? r['Specialization']) as string | undefined,
    }));
  }

  private async fetchPatients(page: number, pageSize: number, search?: string): Promise<PagedResult<StaffPatient>> {
    let endpoint = `patients?page=${page}&pageSize=${pageSize}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    const data = await this.api.get<any>(endpoint).toPromise();
    const items = ((data?.items ?? data ?? []) as Record<string, unknown>[]).map(toStaffPatient);
    return {
      items,
      total: data?.total ?? items.length,
      totalCount: data?.totalCount ?? items.length,
      page: data?.page ?? page,
      pageSize: data?.pageSize ?? pageSize,
      totalPages: data?.totalPages ?? 1,
    };
  }

  private async fetchPatientById(id: string): Promise<StaffPatient | undefined> {
    const data = await this.api.get<any>(`patients/${id}`).toPromise();
    return data ? toStaffPatient(data as Record<string, unknown>) : undefined;
  }
}

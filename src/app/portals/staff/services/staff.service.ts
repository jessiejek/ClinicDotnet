import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
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
    return this.api.get<any[]>('doctors').pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map((r) => ({
        id: (r['id'] ?? r['Id'] ?? '') as string,
        fullName: (r['fullName'] ?? r['full_name'] ?? r['FullName'] ?? '') as string,
        specialization: (r['specialization'] ?? r['Specialization']) as string | undefined,
      })))
    );
  }

  getPatients(page = 1, pageSize = 20, search?: string): Observable<PagedResult<StaffPatient>> {
    let endpoint = 'patients?page=' + page + '&pageSize=' + pageSize;
    if (search) endpoint += '&search=' + encodeURIComponent(search);
    return this.api.get<any>(endpoint).pipe(
      map((data) => {
        const items = ((data?.items ?? data ?? []) as Record<string, unknown>[]).map(toStaffPatient);
        return {
          items,
          total: data?.total ?? items.length,
          totalCount: data?.totalCount ?? items.length,
          page: data?.page ?? page,
          pageSize: data?.pageSize ?? pageSize,
        } as PagedResult<StaffPatient>;
      })
    );
  }

  getPatientById(id: string): Observable<StaffPatient | undefined> {
    return this.api.get<any>('patients/' + id).pipe(
      map((data) => data ? toStaffPatient(data as Record<string, unknown>) : undefined)
    );
  }

  getPatientByPhone(phone: string): Observable<PagedResult<StaffPatient>> {
    return this.getPatients(1, 20, phone);
  }

  createPatientPortalAccount(patientId: string, request: any): Observable<any> {
    return this.api.post('patients/' + patientId + '/portal-account', request);
  }
}

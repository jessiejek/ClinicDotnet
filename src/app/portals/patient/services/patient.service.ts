import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { BookingService } from '../../../core/services/booking.service';
import {
  Booking,
  Consultation,
  Patient,
  Prescription,
  UpdatePatientRequest
} from '../../../core/models';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly api = inject(ApiService);
  private readonly authState = inject(AuthStateService);
  private readonly bookingService = inject(BookingService);

  getMyProfile(): Observable<Patient> {
    return from(this.fetchMyPatient());
  }

  updateMyProfile(dto: UpdatePatientRequest): Observable<Patient> {
    return from(this.updateMyPatient(dto));
  }

  submitConsent(version: string): Observable<Patient> {
    return from(this.submitPatientConsent(version));
  }

  getCurrentPatient(userId: string): Observable<Patient | undefined> {
    return from(this.fetchPatientByUserId(userId));
  }

  getPatientBookings(patientId: string): Observable<Booking[]> {
    return this.bookingService.getBookingsByPatientId(patientId);
  }

  getUpcomingBookings(patientId: string): Observable<Booking[]> {
    return this.bookingService.getUpcomingBookingsByPatientId(patientId);
  }

  getPatientConsultations(_patientId: string): Observable<Consultation[]> {
    return from(Promise.resolve([]));
  }

  getPatientPrescriptions(_patientId: string): Observable<Prescription[]> {
    return from(Promise.resolve([]));
  }

  private async fetchMyPatient(): Promise<Patient> {
    const userId = this.authState.snapshot?.id;
    if (!userId) throw new Error('User not authenticated.');
    const patient = await this.fetchPatientByUserId(userId);
    if (!patient) throw new Error('Patient profile not found.');
    return patient;
  }

  private async updateMyPatient(dto: UpdatePatientRequest): Promise<Patient> {
    const data = await this.api.put<any>('patients/me', dto).toPromise();
    return mapPatientRow(data ?? {});
  }

  private async submitPatientConsent(version: string): Promise<Patient> {
    const data = await this.api.post<any>('patients/me/consent', { consentVersion: version }).toPromise();
    return mapPatientRow(data ?? {});
  }

  private async fetchPatientByUserId(_userId: string): Promise<Patient | undefined> {
    const data = await this.api.get<any>('patients/me').toPromise();
    return data ? mapPatientRow(data) : undefined;
  }
}

function mapPatientRow(row: Record<string, unknown>): Patient {
  return {
    id: trimStr(row['id'] ?? row['Id']) ?? '',
    patientCode: trimStr(row['patientCode'] ?? row['patient_code'] ?? row['PatientCode']) ?? '',
    firstName: trimStr(row['firstName'] ?? row['first_name'] ?? row['FirstName']) ?? '',
    middleName: trimStr(row['middleName'] ?? row['middle_name'] ?? row['MiddleName']),
    lastName: trimStr(row['lastName'] ?? row['last_name'] ?? row['LastName']) ?? '',
    dateOfBirth: trimStr(row['dateOfBirth'] ?? row['date_of_birth'] ?? row['DateOfBirth']) ?? '',
    sex: trimStr(row['sex'] ?? row['Sex']) ?? '',
    civilStatus: trimStr(row['civilStatus'] ?? row['civil_status'] ?? row['CivilStatus']),
    address: trimStr(row['address'] ?? row['Address']),
    city: trimStr(row['city'] ?? row['City']),
    zipCode: trimStr(row['zipCode'] ?? row['zip_code'] ?? row['ZipCode']),
    contactNumber: trimStr(row['contactNumber'] ?? row['contact_number'] ?? row['ContactNumber']),
    email: trimStr(row['email'] ?? row['contact_email'] ?? row['Email']),
    emergencyContactName: trimStr(row['emergencyContactName'] ?? row['emergency_contact_name'] ?? row['EmergencyContactName']),
    emergencyContactNumber: trimStr(row['emergencyContactNumber'] ?? row['emergency_contact_number']),
    emergencyContactRelationship: trimStr(row['emergencyContactRelationship'] ?? row['emergency_contact_relationship']),
    bloodType: trimStr(row['bloodType'] ?? row['blood_type'] ?? row['BloodType']),
    philHealthNumber: trimStr(row['philHealthNumber'] ?? row['phil_health_number']),
    hmoProvider: trimStr(row['hmoProvider'] ?? row['hmo_provider']),
    hmoCardNumber: trimStr(row['hmoCardNumber'] ?? row['hmo_card_number']),
    userId: trimStr(row['userId'] ?? row['user_id'] ?? row['UserId']),
    isEmailVerified: undefined,
    isGuest: false,
    consentedAt: trimStr(row['consentedAt'] ?? row['consented_at']),
    consentVersion: trimStr(row['consentVersion'] ?? row['consent_version']),
  };
}

function trimStr(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const t = value.trim();
  return t || undefined;
}

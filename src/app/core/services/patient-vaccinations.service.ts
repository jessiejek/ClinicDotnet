import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  PatientVaccinationDto,
  CreatePatientVaccinationRequest,
  UpdatePatientVaccinationRequest
} from '../models/vaccination.models';

@Injectable({ providedIn: 'root' })
export class PatientVaccinationsService {
  private readonly apiService = inject(ApiService);

  getPatientVaccinations(patientId: string): Observable<PatientVaccinationDto[]> {
    return this.apiService.get<PatientVaccinationDto[]>('patients/' + patientId + '/vaccinations');
  }

  createPatientVaccination(
    patientId: string,
    payload: CreatePatientVaccinationRequest
  ): Observable<PatientVaccinationDto> {
    return this.apiService.post<PatientVaccinationDto>('patients/' + patientId + '/vaccinations', payload);
  }

  updatePatientVaccination(
    patientId: string,
    vaccinationId: string,
    payload: UpdatePatientVaccinationRequest
  ): Observable<PatientVaccinationDto> {
    return this.apiService.put<PatientVaccinationDto>(
      'patients/' + patientId + '/vaccinations/' + vaccinationId,
      payload
    );
  }

  deletePatientVaccination(patientId: string, vaccinationId: string): Observable<void> {
    return this.apiService.delete<void>('patients/' + patientId + '/vaccinations/' + vaccinationId);
  }

  getMyVaccinations(): Observable<PatientVaccinationDto[]> {
    return this.apiService.get<PatientVaccinationDto[]>('patients/me/vaccinations');
  }
}

import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly api = inject(ApiService);

  updateProfile(dto: any): Observable<any> {
    return this.api.put<any>('patients/me', dto);
  }

  updateMyProfile(dto: any): Observable<any> {
    return this.updateProfile(dto);
  }

  submitConsent(dto: any): Observable<any> {
    return this.api.post<any>('patients/me/consent', dto);
  }

  getProfile(): Observable<any> {
    return this.api.get<any>('patients/me');
  }

  getMyProfile(): Observable<any> {
    return this.getProfile();
  }
}

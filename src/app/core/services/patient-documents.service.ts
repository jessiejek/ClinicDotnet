import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PatientDocumentsService {
  getDownloadUrl(patientId: string, documentId: string): string {
    const baseUrl = (environment.apiUrl || environment.apiBaseUrl || '').replace(/\/+$/, '');
    return `${baseUrl}/patients/${patientId}/documents/${documentId}/file`;
  }
}

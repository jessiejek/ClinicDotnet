import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IonSearchbar, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PatientMedicalRecord } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-patient-medical-records-page',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, IonSearchbar, IonSpinner, EmptyStateComponent],
  templateUrl: './patient-medical-records.page.html',
  styleUrl: './patient-medical-records.page.scss'
})
export class PatientMedicalRecordsPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly toastCtrl = inject(ToastController);

  records: PatientMedicalRecord[] = [];
  filteredRecords: PatientMedicalRecord[] = [];
  loading = false;
  error = '';
  errorTitle = 'Unable to load records';
  searchTerm = '';
  private readonly downloading = new Set<string>();
  private readonly downloadingSummary = new Set<string>();

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading = true;
    this.error = '';

    this.apiService.get<any[]>('medical-records/me').subscribe({
      next: (records) => {
        this.records = records;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        this.records = [];
        this.filteredRecords = [];
        this.loading = false;
        this.error = extractMessage(error, 'Unable to load records. Please try again.');
        this.errorTitle = normalizeErrorTitle(this.error);
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.applyFilter();
  }

  downloadMedicalRecord(record: PatientMedicalRecord): void {
    if (this.downloading.has(record.id)) {
      return;
    }

    this.downloading.add(record.id);
    this.apiService.getBlob(`patient-documents/me/medical-records/${record.id}/pdf`).subscribe({
      next: (blob) => {
        this.saveBlob(blob, `medical-record-${record.appointmentDate}-${record.id}.pdf`);
        this.downloading.delete(record.id);
      },
      error: (error) => {
        this.downloading.delete(record.id);
        void this.showToast(extractMessage(error, 'Document not available yet.'));
      }
    });
  }

  downloadConsultationSummary(record: PatientMedicalRecord): void {
    if (this.downloadingSummary.has(record.bookingId)) {
      return;
    }

    this.downloadingSummary.add(record.bookingId);
    this.apiService.getBlob(`patient-documents/me/bookings/${record.bookingId}/pdf`).subscribe({
      next: (blob) => {
        this.saveBlob(blob, `consultation-summary-${record.appointmentDate}-${record.bookingId}.pdf`);
        this.downloadingSummary.delete(record.bookingId);
      },
      error: (error) => {
        this.downloadingSummary.delete(record.bookingId);
        void this.showToast(extractMessage(error, 'Document not available yet.'));
      }
    });
  }

  downloadAllRecords(): void {
    this.apiService.getBlob('patient-documents/me/all.pdf').subscribe({
      next: (blob) => this.saveBlob(blob, `clinical-records-${new Date().toISOString().slice(0, 10)}.pdf`),
      error: (error) => void this.showToast(extractMessage(error, 'Document not available yet.'))
    });
  }

  isDownloading(id: string): boolean {
    return this.downloading.has(id);
  }

  isDownloadingSummary(bookingId: string): boolean {
    return this.downloadingSummary.has(bookingId);
  }

  private applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredRecords = [...this.records];
      return;
    }

    this.filteredRecords = this.records.filter((record) => {
      const haystack = [
        record.doctorName,
        record.diagnosis,
        record.soapNotes,
        record.doctorNotes,
        record.followUpInstructions,
        record.notes,
        record.appointmentDate
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
  }

  private saveBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2400,
      position: 'top'
    });
    await toast.present();
  }
}

function extractMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as { error?: { message?: unknown }; message?: unknown };
    const direct = apiError.error?.message ?? apiError.message;
    if (typeof direct === 'string' && direct.trim()) {
      return direct;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

function normalizeErrorTitle(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('not linked') || lower.includes('patient profile not found')) {
    return 'Patient profile not linked';
  }

  if (lower.includes('unauthorized') || lower.includes('forbidden')) {
    return 'Please sign in again';
  }

  return 'Unable to load records';
}

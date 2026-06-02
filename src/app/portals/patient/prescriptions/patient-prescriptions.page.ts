import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IonSearchbar, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PatientPrescription } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-patient-prescriptions-page',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, IonSearchbar, IonSpinner, EmptyStateComponent],
  templateUrl: './patient-prescriptions.page.html',
  styleUrl: './patient-prescriptions.page.scss'
})
export class PatientPrescriptionsPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly toastCtrl = inject(ToastController);

  prescriptions: PatientPrescription[] = [];
  filteredPrescriptions: PatientPrescription[] = [];
  loading = false;
  error = '';
  errorTitle = 'Unable to load prescriptions';
  searchTerm = '';
  private readonly downloading = new Set<string>();
  private readonly downloadingSummary = new Set<string>();

  ngOnInit(): void {
    this.loadPrescriptions();
  }

  loadPrescriptions(): void {
    this.loading = true;
    this.error = '';

    this.apiService.get<any[]>('prescriptions/me').subscribe({
      next: (records) => {
        this.prescriptions = records;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        this.prescriptions = [];
        this.filteredPrescriptions = [];
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

  downloadPrescription(prescription: PatientPrescription): void {
    if (this.downloading.has(prescription.id)) {
      return;
    }

    this.downloading.add(prescription.id);
    this.apiService.getBlob(`patient-documents/me/prescriptions/${prescription.id}/pdf`).subscribe({
      next: (blob) => {
        this.saveBlob(blob, `prescription-${prescription.appointmentDate}-${prescription.id}.pdf`);
        this.downloading.delete(prescription.id);
      },
      error: (error) => {
        this.downloading.delete(prescription.id);
        void this.showToast(extractMessage(error, 'Document not available yet.'));
      }
    });
  }

  downloadConsultationSummary(prescription: PatientPrescription): void {
    if (this.downloadingSummary.has(prescription.bookingId)) {
      return;
    }

    this.downloadingSummary.add(prescription.bookingId);
    this.apiService.getBlob(`patient-documents/me/bookings/${prescription.bookingId}/pdf`).subscribe({
      next: (blob) => {
        this.saveBlob(blob, `consultation-summary-${prescription.appointmentDate}-${prescription.bookingId}.pdf`);
        this.downloadingSummary.delete(prescription.bookingId);
      },
      error: (error) => {
        this.downloadingSummary.delete(prescription.bookingId);
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
      this.filteredPrescriptions = [...this.prescriptions];
      return;
    }

    this.filteredPrescriptions = this.prescriptions.filter((prescription) => {
      const haystack = [
        prescription.doctorName,
        prescription.medicineName,
        prescription.genericName,
        prescription.strength,
        prescription.route,
        prescription.frequency,
        prescription.duration,
        prescription.instructions,
        ...prescription.items.flatMap((item) => [
          item.medicineName,
          item.genericName,
          item.strength,
          item.route,
          item.frequency,
          item.duration,
          item.instructions,
          item.sig
        ])
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

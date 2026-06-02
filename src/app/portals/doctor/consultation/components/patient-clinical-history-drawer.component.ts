import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PatientClinicalHistoryDto } from '../../../../core/models/patient-clinical-history.models';

@Component({
  selector: 'app-patient-clinical-history-drawer',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, RouterLink],
  templateUrl: './patient-clinical-history-drawer.component.html',
  styleUrl: './patient-clinical-history-drawer.component.scss'
})
export class PatientClinicalHistoryDrawerComponent {
  @Input() isOpen = false;
  @Input() patientName = 'Patient';
  @Input() history: PatientClinicalHistoryDto | null | undefined = undefined;
  @Output() close = new EventEmitter<void>();

  readonly titleId = `pch-title-${Math.random().toString(36).slice(2, 10)}`;
  private openEntries = new Set<number>();

  toggle(index: number): void {
    if (this.openEntries.has(index)) {
      this.openEntries.delete(index);
      return;
    }
    this.openEntries.add(index);
  }

  isOpenEntry(index: number): boolean {
    return this.openEntries.has(index);
  }

  getSoapSummary(consult: PatientClinicalHistoryDto['consultations'][number]): string {
    const parts = [
      this.getSoapField(consult, 'chiefComplaint'),
      this.getSoapField(consult, 'subjective'),
      this.getSoapField(consult, 'objective'),
      this.getSoapField(consult, 'assessment'),
      this.getSoapField(consult, 'plan')
    ]
      .filter((part) => !!part?.trim())
      .map((part) => part!.trim().slice(0, 200));
    return parts.join(' | ') || '-';
  }

  getSoapField(
    consult: PatientClinicalHistoryDto['consultations'][number],
    field: 'chiefComplaint' | 'subjective' | 'objective' | 'assessment' | 'plan'
  ): string {
    return (consult.soap?.[field] ?? '').trim();
  }

  getPrescriptionItems(consult: PatientClinicalHistoryDto['consultations'][number]): Array<{ medicationName?: string; strength?: string | null }> {
    return (consult.prescription?.['items'] ?? []) as Array<{ medicationName?: string; strength?: string | null }>;
  }

  getLabOrderName(order: PatientClinicalHistoryDto['consultations'][number]['labOrders'][number]): string {
    return order.items[0]?.testName || 'Lab order';
  }

  getFollowUpDate(consult: PatientClinicalHistoryDto['consultations'][number]): string {
    return consult.followUp?.['followUpDate'] ?? '';
  }
}

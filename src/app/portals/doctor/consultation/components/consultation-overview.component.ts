import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { Allergy, Consultation, FollowUp, Patient, Prescription } from '../../../../core/models';

@Component({
  selector: 'app-consultation-overview',
  standalone: true,
  imports: [NgIf],
  templateUrl: './consultation-overview.component.html',
  styles: [
    `
      .summary-card--mobile {
        display: none;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-4);
        margin-bottom: var(--space-4);
      }

      .summary-card {
        display: grid;
        gap: var(--space-2);
      }

      .summary-card h3 {
        margin: 0;
      }

      .summary-card__toggle {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-3);
        border: none;
        background: transparent;
        text-align: left;
        padding: 0;
        color: inherit;
        cursor: pointer;
      }

      .summary-card__preview {
        margin: 4px 0 0;
        color: var(--clinic-text-secondary);
        font-size: 0.8rem;
      }

      .summary-card__body {
        display: grid;
        gap: 4px;
        padding-top: 8px;
      }

      @media (max-width: 900px) {
        .summary-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 767px) {
        .summary-grid {
          display: none;
        }

        .summary-card--mobile {
          display: grid;
        }
      }
    `
  ]
})
export class ConsultationOverviewComponent {
  @Input({ required: true }) patient!: Patient;
  @Input() consultation: Consultation | null = null;
  @Input() existingPrescription: Prescription | null = null;
  @Input() allergies: Allergy[] = [];
  @Input() followUps: FollowUp[] = [];
  @Input() recentConsultations: Consultation[] = [];
  mobileExpanded = false;

  get ageLabel(): string {
    const birthDate = new Date(this.patient.dateOfBirth);
    if (Number.isNaN(birthDate.getTime())) {
      return 'Age unavailable';
    }
    const years = new Date().getFullYear() - birthDate.getFullYear();
    return `${years} years old`;
  }

  get allergySummary(): string {
    return this.allergies.length > 0
      ? this.allergies.map((allergy) => allergy.allergen).join(', ')
      : 'None recorded';
  }

  get lastVisit(): string {
    return this.recentConsultations[0]?.consultationDate || 'No prior visit';
  }

  get conditionSummary(): string {
    const diagnoses = this.recentConsultations.flatMap((consultation) =>
      consultation.diagnoses.map((diagnosis) => diagnosis.description)
    );
    const unique = [...new Set(diagnoses)];
    return unique.length > 0 ? unique.slice(0, 3).join(', ') : 'No existing conditions';
  }

  get summaryPreview(): string {
    return `${this.ageLabel} / ${this.patient.sex || '--'} • ${this.consultation?.status || 'Draft'} • ${this.lastVisit}`;
  }
}

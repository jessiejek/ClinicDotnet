import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import {
  CreatePatientVaccinationRequest,
  VACCINATION_DOSE_UNIT_OPTIONS,
  VACCINATION_ROUTE_OPTIONS,
  VACCINATION_SITE_OPTIONS,
  VACCINATION_SOURCE_OPTIONS,
  VACCINATION_STATUS_OPTIONS
} from '../../../../core/models/vaccination.models';

export interface VaccinationFormDraft {
  id?: string;
  vaccineName: string;
  administeredDate: string;
  status: string;
  source: string;
  manufacturer?: string | null;
  lotNumber?: string | null;
  expirationDate?: string | null;
  doseNumber?: string | null;
  doseAmount?: number | null;
  doseUnit?: string | null;
  route?: string | null;
  site?: string | null;
  nextDueDate?: string | null;
  visEditionDate?: string | null;
  visProvidedDate?: string | null;
  notes?: string | null;
  reactionNotes?: string | null;
}

@Component({
  selector: 'app-vaccination-form',
  standalone: true,
  imports: [DatePipe, FormsModule, NgFor, NgIf, IonSelect, IonSelectOption],
  templateUrl: './vaccination-form.component.html',
  styles: [`
    :host{display:block}
    .section-card{display:grid;gap:var(--space-4)}
    .section-card__head h3{margin:0}
    .section-card__head p{margin:4px 0 0;color:var(--clinic-text-secondary)}
    .section-card__title-row{display:flex;justify-content:space-between;gap:var(--space-3);align-items:flex-start;cursor:pointer}
      .vf-expand-btn{border:1px solid #d8c9ea;background:#fff;color:#5b21b6;border-radius:999px;padding:8px 12px;font-size:var(--text-xs);font-weight:700;cursor:pointer;white-space:nowrap}
    .vf-notice{background:#ede9fe;border:1px solid #c4b5fd;border-radius:var(--radius-md);padding:var(--space-2) var(--space-3)}
    .vf-notice p{font-size:var(--text-sm);color:#5b21b6;margin:0}
    .vf-accordion{display:grid;gap:var(--space-4);animation:vf-open 180ms ease-out}
    .vf{display:grid;gap:var(--space-4)}
    .vf-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:var(--space-3)}
    .vf-f{display:grid;gap:4px}
    .vf-f label{font-size:var(--text-xs);font-weight:600;color:#475569;text-transform:uppercase}
    .vf-f input,.vf-f select,.vf-f textarea{padding:var(--space-2) var(--space-3);font-size:var(--text-sm);border:1px solid #e2e8f0;border-radius:var(--radius-md);outline:none;background:#fff;color:var(--clinic-text-primary);width:100%}
    .vf-f input:focus,.vf-f select:focus,.vf-f textarea:focus{border-color:var(--ion-color-primary);box-shadow:0 0 0 2px rgba(93,62,142,.12)}
    .vf-full{grid-column:1/-1}
    .vf-toggle-row{display:flex;justify-content:flex-start}
    .vf-toggle-btn{border:none;background:transparent;color:#5b21b6;font-weight:700;cursor:pointer;padding:0}
    .vf-added{display:grid;gap:var(--space-2)}
    .vf-item{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-3);padding:var(--space-3);background:#f8fafc;border-radius:var(--radius-md);border:1px solid #e2e8f0}
    .vf-item-info{display:grid;gap:2px;min-width:0}
    .vf-item-info strong{font-size:var(--text-sm)}
    .vf-item-info span{font-size:var(--text-xs);color:#64748b}
    .vf-item-detail{color:#6b21a8}
    .vf-item-acts{display:flex;gap:var(--space-1);flex-shrink:0}
    .vf-item-acts button{padding:var(--space-1) var(--space-2);font-size:var(--text-xs);border:1px solid #e2e8f0;border-radius:var(--radius-sm);background:#fff;cursor:pointer;color:#475569}
    .vf-item-acts button:hover{border-color:var(--ion-color-primary);color:var(--ion-color-primary)}
    .vf-remove{color:#dc2626!important}
    .vf-actions{display:flex;justify-content:flex-start}
    @keyframes vf-open{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
      @media(max-width:640px){.vf-grid{grid-template-columns:1fr}.vf-item{flex-direction:column}.section-card__title-row{flex-direction:column}.vf-expand-btn{align-self:flex-start}}
      @media (max-width: 767px) {
        .vf-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .vf-full {
          grid-column: 1 / -1;
        }

        .vf-f input,
        .vf-f ion-select,
        .vf-f textarea {
          min-height: 48px;
        }

        .vf-toggle-btn,
        .vf-expand-btn {
          min-height: 48px;
        }

        .vf-item-acts button {
          min-height: 32px;
        }
      }
      @media (max-width: 374px) {
        .vf-grid {
          grid-template-columns: 1fr;
        }
      }
    `]
})
export class VaccinationFormComponent implements OnChanges {
  @Input() locked = false;
  @Input() canEdit = true;
  @Input() auditText = 'Not yet edited this visit';
  @Input() existingVaccinations: any[] = [];
  @Input() draftVaccinations: CreatePatientVaccinationRequest[] = [];
  @Output() vaccinationsAdded = new EventEmitter<CreatePatientVaccinationRequest[]>();

  expanded = false;
  showAdditionalFields = false;

  draft: VaccinationFormDraft = this.buildDefaultDraft();
  addedVaccinations: VaccinationFormDraft[] = [];
  editIdx = -1;

  readonly statusOptions = VACCINATION_STATUS_OPTIONS;
  readonly sourceOptions = VACCINATION_SOURCE_OPTIONS;
  readonly routeOptions = VACCINATION_ROUTE_OPTIONS;
  readonly siteOptions = VACCINATION_SITE_OPTIONS;
  readonly doseUnitOptions = VACCINATION_DOSE_UNIT_OPTIONS;
  get selectInterface(): 'action-sheet' | 'popover' {
    return typeof window !== 'undefined' && window.innerWidth < 768 ? 'action-sheet' : 'popover';
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  expandAndStart(event: Event): void {
    event.stopPropagation();
    this.expanded = true;
  }

  addVaccination(): void {
    if (!this.draft.vaccineName.trim() || !this.draft.administeredDate) return;

    const item: VaccinationFormDraft = {
      id: this.editIdx >= 0 ? this.addedVaccinations[this.editIdx].id : `vac-${Date.now()}`,
      vaccineName: this.draft.vaccineName.trim(),
      administeredDate: this.draft.administeredDate,
      status: this.draft.status,
      source: this.draft.source,
      manufacturer: this.draft.manufacturer || null,
      lotNumber: this.draft.lotNumber || null,
      expirationDate: this.draft.expirationDate || null,
      doseNumber: this.draft.doseNumber || null,
      doseAmount: this.draft.doseAmount ?? null,
      doseUnit: this.draft.doseUnit || null,
      route: this.draft.route || null,
      site: this.draft.site || null,
      nextDueDate: this.draft.nextDueDate || null,
      visEditionDate: this.draft.visEditionDate || null,
      visProvidedDate: this.draft.visProvidedDate || null,
      notes: this.draft.notes || null,
      reactionNotes: this.draft.reactionNotes || null
    };

    if (this.editIdx >= 0) {
      this.addedVaccinations = this.addedVaccinations.map((v, i) => (i === this.editIdx ? item : v));
      this.editIdx = -1;
    } else {
      this.addedVaccinations = [...this.addedVaccinations, item];
    }

    this.emitChanges();
    this.resetForm();
    this.expanded = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['draftVaccinations']) {
      this.addedVaccinations = this.draftVaccinations.map((item, index) => ({
        id: `vac-draft-${index + 1}`,
        vaccineName: item.vaccineName,
        administeredDate: item.administeredDate,
        status: item.status,
        source: item.source,
        manufacturer: item.manufacturer ?? null,
        lotNumber: item.lotNumber ?? null,
        expirationDate: item.expirationDate ?? null,
        doseNumber: item.doseNumber ?? null,
        doseAmount: item.doseAmount ?? null,
        doseUnit: item.doseUnit ?? null,
        route: item.route ?? null,
        site: item.site ?? null,
        nextDueDate: item.nextDueDate ?? null,
        visEditionDate: item.visEditionDate ?? null,
        visProvidedDate: item.visProvidedDate ?? null,
        notes: item.notes ?? null,
        reactionNotes: item.reactionNotes ?? null
      }));
    }
  }

  editVaccination(idx: number): void {
    const v = this.addedVaccinations[idx];
    if (!v) return;
    this.editIdx = idx;
    this.draft = { ...v };
    this.expanded = true;
  }

  removeVaccination(idx: number): void {
    this.addedVaccinations = this.addedVaccinations.filter((_, i) => i !== idx);
    if (this.editIdx === idx) this.editIdx = -1;
    else if (this.editIdx > idx) this.editIdx--;
    this.emitChanges();
  }

  private buildDefaultDraft(): VaccinationFormDraft {
    return {
      vaccineName: '',
      administeredDate: new Date().toISOString().slice(0, 10),
      status: 'Completed',
      source: 'AdministeredInClinic'
    };
  }

  private resetForm(): void {
    this.draft = this.buildDefaultDraft();
  }

  private emitChanges(): void {
    const payloads: CreatePatientVaccinationRequest[] = this.addedVaccinations.map((v) => ({
      vaccineName: v.vaccineName,
      administeredDate: v.administeredDate,
      status: v.status as any,
      source: v.source as any,
      manufacturer: v.manufacturer,
      lotNumber: v.lotNumber,
      expirationDate: v.expirationDate,
      doseNumber: v.doseNumber,
      doseAmount: v.doseAmount,
      doseUnit: v.doseUnit,
      route: v.route,
      site: v.site,
      nextDueDate: v.nextDueDate,
      visEditionDate: v.visEditionDate,
      visProvidedDate: v.visProvidedDate,
      notes: v.notes,
      reactionNotes: v.reactionNotes,
      bookingId: null,
      consultationId: null,
      doctorId: null,
      vaccineCode: null
    }));
    this.vaccinationsAdded.emit(payloads);
  }
}

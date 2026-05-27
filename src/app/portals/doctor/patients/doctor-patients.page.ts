import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DoctorPatientSummaryDto } from '../../../core/models/doctor-patient-summary.models';
import { ApiService } from '../../../core/services/api.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  standalone: true,
  selector: 'app-doctor-patients-page',
  imports: [NgFor, NgIf, FormsModule, RouterLink, EmptyStateComponent, SkeletonComponent, StatusBadgeComponent],
  template: `
    <div class="ps">
      <div class="psh">
        <div>
          <h2 class="pt">My Patients</h2>
          <p class="psub">All patients who have booked appointments with you.</p>
        </div>
      </div>

      <div class="search-row">
        <input class="si" [(ngModel)]="searchQuery" placeholder="Search by patient name..." />
      </div>

      <app-skeleton *ngIf="loading" variant="card" [count]="5"></app-skeleton>

      <ng-container *ngIf="!loading && filteredPatients.length > 0">
        <div class="pc">
          <div class="pi" *ngFor="let p of filteredPatients" tabindex="0" role="button" (click)="openClinicalHistory(p.patientId)" (keydown.enter)="openClinicalHistory(p.patientId)" [attr.aria-label]="'View patient ' + p.patientName">
            <div class="pih">
              <div class="pii">
                <strong class="pin">{{ p.patientName }}</strong>
                <span class="pis">{{ p.services }}</span>
              </div>
              <div class="pib">
                <app-status-badge [status]="p.status"></app-status-badge>
                <button class="vb" (click)="openAppointment($event, p.latestBookingId)">View Appointment</button>
                <button class="vb" (click)="openClinicalHistoryFromButton($event, p.patientId)">Clinical History</button>
              </div>
            </div>
            <div class="pim">
              <span class="pid">{{ formatLatestVisitDate(p.latestDate) }}</span>
              <span class="pid pid--time" *ngIf="formatLatestVisitTime(p.latestTime) as latestTime">{{ latestTime }}</span>
            </div>
          </div>
        </div>
      </ng-container>

      <app-empty-state
        *ngIf="!loading && filteredPatients.length === 0"
        icon="people-outline"
        title="No patients found yet"
        description="Patients will appear here once they book appointments with you."
      ></app-empty-state>
    </div>
  `,
  styleUrl: './doctor-patients.page.scss'
})
export class DoctorPatientsPage {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  patients: DoctorPatientSummaryDto[] = [];
  loading = true;
  searchQuery = '';

  get filteredPatients(): DoctorPatientSummaryDto[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.patients;
    return this.patients.filter((p) => p.patientName.toLowerCase().includes(q));
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  openClinicalHistory(patientId: string): void {
    if (!patientId) return;
    this.router.navigate(['/doctor/patients', patientId]);
  }

  openClinicalHistoryFromButton(event: Event, patientId: string): void {
    event.stopPropagation();
    this.openClinicalHistory(patientId);
  }

  openAppointment(event: Event, bookingId: string): void {
    event.stopPropagation();
    if (!bookingId) return;
    this.router.navigate(['/doctor/appointments', bookingId]);
  }

  formatLatestVisitDate(dateStr: string): string {
    if (!dateStr) {
      return 'No prior visit';
    }

    const date = new Date(`${dateStr}T12:00:00`);
    if (Number.isNaN(date.getTime())) {
      return dateStr;
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  formatLatestVisitTime(timeStr?: string | null): string {
    return formatTime24To12(timeStr);
  }

  private loadPatients(): void {
    this.loading = true;
    this.apiService.get<any[]>('bookings/doctor/patients').pipe(
      map((rows) => {
        const records = (rows ?? []) as Record<string, unknown>[];
        const patientMap = new Map<string, Record<string, unknown>>();
        for (const row of records) {
          const patientId = trimOptionalString(row['patient_id']);
          if (!patientId || patientMap.has(patientId)) continue;
          patientMap.set(patientId, row);
        }
        return Array.from(patientMap.values()).map((row) => ({
          patientId: trimOptionalString(row['patient_id']) ?? '',
          patientName: trimOptionalString(row['patient_name']) ?? 'Patient',
          patientCode: trimOptionalString(row['patient_code']),
          latestDate: normalizeDateOnly(row['appointment_date']),
          latestTime: normalizeTimeOnly(row['slot_start_time']),
          services: normalizeBookingServices(row['services']).map((s) => s.name).filter(Boolean).join(', '),
          status: normalizeBookingStatus(row['booking_status']) ?? 'Pending',
          queueNumber: normalizeNullableNumber(row['queue_number']),
          latestBookingId: trimOptionalString(row['booking_id']) ?? ''
        }));
      }),
      catchError((err) => {
        console.warn('Failed to load doctor patients from API:', err);
        return of([]);
      }),
      finalize(() => (this.loading = false))
    ).subscribe((patients) => {
      this.patients = patients || [];
    });
  }
}

function trimOptionalString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (value == null) {
    return undefined;
  }

  const text = String(value).trim();
  return text.length > 0 ? text : undefined;
}

function normalizeDateOnly(value: unknown): string {
  return trimOptionalString(value) ?? '';
}

function normalizeTimeOnly(value: unknown): string {
  return trimOptionalString(value) ?? '';
}

function normalizeNullableNumber(value: unknown): number | null {
  const text = trimOptionalString(value);
  if (!text) return null;
  const num = Number(text);
  return Number.isFinite(num) ? num : null;
}

function normalizeBookingStatus(value: unknown): string | undefined {
  return trimOptionalString(value);
}

function normalizeBookingServices(value: unknown): Array<{ name: string }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      const name = trimOptionalString(row['name']);
      return name ? { name } : null;
    })
    .filter((item): item is { name: string } => Boolean(item));
}

function formatTime24To12(value?: string | null): string {
  const time = value?.trim();
  if (!time) {
    return '';
  }

  const parts = time.split(':').map((part) => Number(part));
  if (parts.length < 2 || parts.some((part) => Number.isNaN(part))) {
    return time;
  }

  const [hours, minutes] = parts;
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

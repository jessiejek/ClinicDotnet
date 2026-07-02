import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
  templateUrl: './doctor-patients.page.html',
  styleUrl: './doctor-patients.page.scss'
})
export class DoctorPatientsPage implements OnInit {
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
          const patientId = trimOptionalString(row['patientId'] ?? row['patient_id']);
          if (!patientId || patientMap.has(patientId)) continue;
          patientMap.set(patientId, row);
        }
        return Array.from(patientMap.values()).map((row) => ({
          patientId: trimOptionalString(row['patientId'] ?? row['patient_id']) ?? '',
          patientName: trimOptionalString(row['patientName'] ?? row['patient_name']) ?? 'Patient',
          patientCode: trimOptionalString(row['patientCode'] ?? row['patient_code']),
          latestDate: normalizeDateOnly(row['latestDate'] ?? row['appointment_date']),
          latestTime: normalizeTimeOnly(row['latestTime'] ?? row['slot_start_time']),
          services: trimOptionalString(row['services']) ?? normalizeBookingServices(row['services']).map((s) => s.name).filter(Boolean).join(', '),
          status: normalizeBookingStatus(row['status'] ?? row['booking_status']) ?? 'Pending',
          queueNumber: normalizeNullableNumber(row['queueNumber'] ?? row['queue_number']),
          latestBookingId: trimOptionalString(row['latestBookingId'] ?? row['booking_id']) ?? ''
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

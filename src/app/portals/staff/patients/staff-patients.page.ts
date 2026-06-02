import { NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, finalize, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { PatientSummary } from '../../../core/models';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { toStaffPatient } from '../services/staff.service';

@Component({
  selector: 'app-staff-patients-page',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, EmptyStateComponent, SkeletonComponent, StatusBadgeComponent],
  templateUrl: './staff-patients.page.html',
  styleUrl: './staff-patients.page.scss'
})
export class StaffPatientsPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageSize = 20;
  searchControl = new FormControl('', { nonNullable: true });
  patients: PatientSummary[] = [];
  totalCount = 0;
  currentPage = 1;
  totalPages = 1;
  isLoading = false;

  private searchTerm = '';
  private loadToken = 0;

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => {
        this.searchTerm = query.trim();
        this.loadPatients(1);
      });

    this.loadPatients(1);
  }

  get rangeStart(): number {
    if (this.totalCount === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    if (this.totalCount === 0) {
      return 0;
    }

    return Math.min(this.totalCount, this.rangeStart + this.patients.length - 1);
  }

  get countLabel(): string {
    if (this.totalCount === 0) {
      return 'Showing 0 of 0 patients';
    }

    return `Showing ${this.rangeStart}-${this.rangeEnd} of ${this.totalCount} patients`;
  }

  openDetail(id: string): void {
    void this.router.navigate(['/staff/patients', id]);
  }

  patientDisplayName(patient: PatientSummary): string {
    return patient.fullName || [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(' ') || 'Patient';
  }

  patientAccountStatus(patient: PatientSummary): 'LinkedAccount' | 'NoAccount' | 'AccountUnknown' {
    if (patient.hasAccount === true || Boolean(patient.userId?.trim())) {
      return 'LinkedAccount';
    }

    if (patient.hasAccount === false) {
      return 'NoAccount';
    }

    return 'AccountUnknown';
  }

  patientAccountLabel(patient: PatientSummary): string {
    switch (this.patientAccountStatus(patient)) {
      case 'LinkedAccount':
        return 'Account Linked';
      case 'NoAccount':
        return 'No Account';
      default:
        return 'Account Unknown';
    }
  }

  private loadPatients(page: number): void {
    const nextPage = Math.max(1, page);
    const token = ++this.loadToken;
    this.isLoading = true;
    let endpoint = 'patients?page=' + nextPage + '&pageSize=' + this.pageSize;
    if (this.searchTerm) {
      endpoint += '&search=' + encodeURIComponent(this.searchTerm);
    }

    this.apiService
      .get<any>(endpoint)
      .pipe(
        map((data) => {
          const items = ((data?.items ?? data ?? []) as Record<string, unknown>[]).map((row) => toStaffPatient(row) as PatientSummary);
          return {
            items,
            total: data?.total ?? items.length,
            totalCount: data?.totalCount ?? items.length,
            page: data?.page ?? nextPage,
            pageSize: data?.pageSize ?? this.pageSize,
            totalPages: data?.totalPages ?? Math.max(1, Math.ceil((data?.totalCount ?? items.length) / this.pageSize))
          };
        }),
        finalize(() => {
          if (token === this.loadToken) {
            this.isLoading = false;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (result) => {
          if (token !== this.loadToken) {
            return;
          }

          this.patients = result.items;
          this.totalCount = result.totalCount ?? result.total ?? 0;
          this.currentPage = Math.max(1, result.page || nextPage);
          this.totalPages = Math.max(1, result.totalPages || 1);
        },
        error: () => {
          if (token !== this.loadToken) {
            return;
          }

          this.patients = [];
          this.totalCount = 0;
          this.currentPage = 1;
          this.totalPages = 1;
        }
      });
  }
}

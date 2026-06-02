import { NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Doctor } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { DoctorCardComponent } from '../../public/components/doctor-card/doctor-card.component';
import { formatDoctorScheduleLines } from '../../public/utils/time-format';

@Component({
  selector: 'app-patient-doctors-page',
  standalone: true,
  imports: [NgFor, NgIf, DoctorCardComponent, EmptyStateComponent, SkeletonComponent],
  templateUrl: './patient-doctors.page.html',
  styleUrl: './patient-doctors.page.scss'
})
export class PatientDoctorsPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);

  doctors: Doctor[] = [];
  isLoading = true;
  loadError = '';
  private hasLoadedOnce = false;

  ngOnInit(): void {
    this.loadDoctors();
  }

  ionViewWillEnter(): void {
    if (this.hasLoadedOnce) {
      this.loadDoctors();
      return;
    }

    this.hasLoadedOnce = true;
  }

  get emptyTitle(): string {
    return this.loadError ? 'Unable to load doctors' : 'No active doctors available';
  }

  get emptyDescription(): string {
    return this.loadError || 'There are no active doctors available right now.';
  }

  retry(): void {
    this.loadDoctors();
  }

  doctorScheduleSummary(doctor: Doctor): string | null {
    if (doctor.workingDays?.length) {
      return doctor.workingDays.join(', ');
    }

    if (doctor.schedule?.length) {
      return formatDoctorScheduleLines(doctor.schedule).join(' • ');
    }

    return null;
  }

  private loadDoctors(): void {
    this.isLoading = true;
    this.loadError = '';

    this.apiService
      .get<any[]>('doctors')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (doctors: Doctor[]) => {
          this.doctors = doctors
            .filter((doctor) => isVisibleDoctor(doctor))
            .sort((a, b) => a.fullName.localeCompare(b.fullName));
        },
        error: (error: unknown) => {
          this.doctors = [];
          this.loadError = extractApiErrorMessage(error, 'We could not load doctors right now.');
        }
      });
  }
}

function isVisibleDoctor(doctor: Doctor): boolean {
  if (doctor.isActive === false) {
    return false;
  }

  return !['Inactive', 'OnLeave'].includes(doctor.status);
}

function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const body = (error as { error?: unknown }).error;
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (typeof body === 'object' && body !== null && 'message' in body) {
      const message = (body as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

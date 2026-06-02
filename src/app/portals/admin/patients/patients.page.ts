import { NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonIcon, ModalController, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, searchOutline } from 'ionicons/icons';
import { debounceTime, distinctUntilChanged, finalize, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PatientSummary } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { AdminPatientCreateModalComponent } from './admin-patient-create-modal.component';
import { rowToSummary } from '../services/admin-patients.service';

@Component({
  selector: 'app-admin-patients-page',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, EmptyStateComponent, SkeletonComponent, StatusBadgeComponent, IonIcon],
  templateUrl: './patients.page.html',
  styleUrl: './patients.page.scss'
})
export class PatientsPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly modalCtrl = inject(ModalController);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    addIcons({ addOutline, searchOutline });
  }

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

  get canPreviousPage(): boolean {
    return this.currentPage > 1 && !this.isLoading;
  }

  get canNextPage(): boolean {
    return this.currentPage < this.totalPages && !this.isLoading;
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
    void this.router.navigate(['/admin/patients', id]);
  }

  async openAddPatientModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AdminPatientCreateModalComponent,
      cssClass: 'admin-patient-create-modal'
    });

    await modal.present();

    const result = await modal.onDidDismiss<{ created?: boolean }>();
    if (result.role === 'saved' || result.data?.created) {
      this.loadPatients(1);
    }
  }

  previousPage(): void {
    if (this.canPreviousPage) {
      this.loadPatients(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.canNextPage) {
      this.loadPatients(this.currentPage + 1);
    }
  }

  private loadPatients(page: number): void {
    const nextPage = Math.max(1, page);
    const token = ++this.loadToken;
    this.isLoading = true;
    let endpoint = 'patients?page=' + nextPage + '&pageSize=' + this.pageSize;
    if (this.searchTerm) endpoint += '&search=' + encodeURIComponent(this.searchTerm);

    this.apiService.get<any>(endpoint).pipe(
      map((data) => {
        const items = ((data?.items ?? data ?? []) as Record<string, unknown>[]).map((row) => rowToSummary(row));
        return {
          items,
          totalCount: data?.totalCount ?? items.length,
          page: data?.page ?? 1,
          pageSize: data?.pageSize ?? items.length,
          totalPages: data?.totalPages ?? 1,
          total: data?.total ?? items.length
        };
      }),
      finalize(() => {
        if (token === this.loadToken) {
          this.isLoading = false;
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (result) => {
        if (token !== this.loadToken) {
          return;
        }

        this.patients = result.items;
        this.totalCount = result.totalCount ?? result.total ?? 0;
        this.currentPage = Math.max(1, result.page || nextPage);
        this.totalPages = Math.max(1, result.totalPages || 1);
      },
      error: async () => {
        if (token !== this.loadToken) {
          return;
        }

        this.patients = [];
        this.totalCount = 0;
        this.currentPage = 1;
        this.totalPages = 1;
        await this.presentToast('Failed to load patients.', 'danger');
      }
    });
  }

  private async presentToast(message: string, color: 'success' | 'danger' = 'success'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  patientDisplayName(patient: PatientSummary): string {
    return patient.fullName || [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(' ');
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
}

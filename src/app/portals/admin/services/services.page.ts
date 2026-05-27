import { NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IonModal, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { catchError, finalize, forkJoin, map, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ServiceCategory } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { DoctorSummary } from '../services/admin-doctors.service';
import { ManagedService, ServiceWriteDto, mapServiceRow } from '../services/admin-services.service';

@Component({
  selector: 'app-admin-services-page',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, IonModal, IonSpinner, EmptyStateComponent, StatusBadgeComponent],
  template: `
    <section class="page-shell">
      <div class="page-shell__header">
        <div>
          <h2 class="page-title">Services</h2>
          <p class="page-subtitle">Manage service catalog and assigned doctors.</p>
        </div>
        <button class="btn-primary" type="button" (click)="openModal()">Add Service</button>
      </div>

      <div class="page-loading" *ngIf="isLoading">
        <ion-spinner name="crescent"></ion-spinner>
      </div>

      <ng-container *ngIf="!isLoading">
        <ng-container *ngIf="services.length > 0; else emptyState">
          <div class="clinic-card" *ngFor="let group of groupedServices">
            <div class="section-heading">{{ group.category }}</div>
            <div class="table-scroll-wrap">
              <table class="clinic-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Assigned Doctors</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let service of group.items">
                    <td>{{ service.name }}</td>
                    <td>{{ service.estimatedDurationMinutes }} min</td>
                    <td>PHP {{ service.price }}</td>
                    <td>{{ assignedDoctors(service).join(', ') || 'N/A' }}</td>
                    <td>
                      <app-status-badge [status]="service.isActive ? 'Active' : 'Inactive'"></app-status-badge>
                    </td>
                    <td>
                      <div class="table-actions">
                        <button
                          class="btn-ghost"
                          type="button"
                          [disabled]="isBusy(service.id) || isSaving"
                          (click)="toggle(service)"
                        >
                          {{ service.isActive ? 'Deactivate' : 'Activate' }}
                        </button>
                        <button
                          class="btn-ghost"
                          type="button"
                          [disabled]="isBusy(service.id) || isSaving"
                          (click)="edit(service)"
                        >
                          Edit
                        </button>
                        <button
                          class="btn-ghost"
                          type="button"
                          [disabled]="isBusy(service.id) || isSaving"
                          (click)="remove(service.id)"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ng-container>

        <ng-template #emptyState>
          <app-empty-state
            icon="folder-open-outline"
            title="No data found"
            description="Add the first service to start building the catalog."
            ctaLabel="Add Service"
            (ctaClick)="openModal()"
          ></app-empty-state>
        </ng-template>
      </ng-container>
    </section>

    <ion-modal #serviceModal [backdropDismiss]="!isSaving" (didDismiss)="onModalDismiss()">
      <ng-template>
        <div class="modal-shell">
          <h3>{{ editingId ? 'Edit Service' : 'Add Service' }}</h3>
          <form #serviceForm="ngForm" class="modal-form" novalidate (ngSubmit)="save(serviceForm)">
            <input
              class="filter-input"
              name="name"
              [(ngModel)]="draft.name"
              placeholder="Service name"
              required
            />

            <textarea
              class="textarea"
              name="description"
              [(ngModel)]="draft.description"
              placeholder="Description"
            ></textarea>

            <select class="filter-input" name="category" [(ngModel)]="draft.category" required>
              <option value="" disabled>Select category</option>
              <option *ngFor="let cat of serviceCategories" [ngValue]="cat">{{ cat }}</option>
            </select>

            <input
              class="filter-input"
              type="number"
              name="price"
              [(ngModel)]="draft.price"
              placeholder="Price"
              min="0"
              required
            />
            <input
              class="filter-input"
              type="number"
              name="estimatedDurationMinutes"
              [(ngModel)]="draft.estimatedDurationMinutes"
              placeholder="Duration"
              min="1"
              required
            />

            <div class="modal-actions">
              <button type="button" class="btn-ghost" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="isSaving || serviceForm.invalid">
                {{ isSaving ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </ng-template>
    </ion-modal>
  `,
  styleUrl: './services.page.scss'
})
export class ServicesPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly toastCtrl = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);
  @ViewChild('serviceModal', { read: ElementRef }) private readonly serviceModal?: ElementRef<HTMLElement>;

  services: ManagedService[] = [];
  doctors: DoctorSummary[] = [];
  serviceCategories: ServiceCategory[] = ['Consultation', 'Procedure', 'Laboratory', 'Diagnostic'];
  editingId: string | null = null;
  draft: ManagedService = this.emptyDraft();
  isLoading = true;
  isSaving = false;
  busyServiceIds = new Set<string>();

  ngOnInit(): void {
    this.loadData();
  }

  get groupedServices(): Array<{ category: string; items: ManagedService[] }> {
    const categories = this.serviceCategories.filter((category) =>
      this.services.some((service) => service.category === category)
    );
    return categories.map((category) => ({ category, items: this.services.filter((service) => service.category === category) }));
  }

  assignedDoctors(service: ManagedService): string[] {
    return this.doctors
      .filter((doctor) => service.doctorIds.includes(doctor.id))
      .map((doctor) => doctor.fullName);
  }

  openModal(): void {
    this.editingId = null;
    this.draft = this.emptyDraft();
    void this.presentModal();
  }

  closeModal(): void {
    if (this.isSaving) {
      return;
    }

    void this.dismissModal();
  }

  edit(service: ManagedService): void {
    this.editingId = service.id;
    this.draft = { ...service, doctorIds: [...service.doctorIds], description: service.description ?? '' };
    void this.presentModal();
  }

  toggle(service: ManagedService): void {
    if (this.isBusy(service.id) || this.isSaving) {
      return;
    }

    this.busyServiceIds.add(service.id);
    this.apiService
      .put<any>('services/' + service.id, { isActive: !service.isActive })
      .pipe(
        map(() => ({ ...service, isActive: !service.isActive })),
        finalize(() => {
          this.busyServiceIds.delete(service.id);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (updated) => {
          this.services = this.services.map((item) => (item.id === updated.id ? updated : item));
        },
        error: (error: unknown) => {
          void this.presentToast(extractApiErrorMessage(error, 'Failed to update service status.'));
        }
      });
  }

  remove(id: string): void {
    if (this.isBusy(id) || this.isSaving) {
      return;
    }

    this.busyServiceIds.add(id);
    this.apiService
      .delete('services/' + id)
      .pipe(
        finalize(() => {
          this.busyServiceIds.delete(id);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.services = this.services.filter((service) => service.id !== id);
        },
        error: (error: unknown) => {
          void this.presentToast(extractApiErrorMessage(error, 'Failed to delete service.'));
        }
      });
  }

  save(form: NgForm): void {
    if (this.isSaving) {
      return;
    }

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const payload = this.buildWritePayload(this.draft);
    const request$ = this.editingId
      ? this.apiService.put<any>('services/' + this.editingId, payload).pipe(
          map((data) => mapServiceRow((data ?? {}) as Record<string, unknown>) as ManagedService)
        )
      : this.apiService.post<any>('services', payload).pipe(
          map((data) => mapServiceRow((data ?? {}) as Record<string, unknown>) as ManagedService)
        );

    request$
      .pipe(
        finalize(() => {
          this.isSaving = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          void this.presentToast('Service saved successfully.', 'success');
          void this.dismissModal().then(() => this.loadData());
        },
        error: (error: unknown) => {
          void this.presentToast(extractApiErrorMessage(error, 'Failed to save service.'));
        }
      });
  }

  isBusy(id: string): boolean {
    return this.busyServiceIds.has(id);
  }

  private loadData(): void {
    this.isLoading = true;

    forkJoin({
      services: this.apiService.get<any[]>('services').pipe(
        map((data) => ((data ?? []) as Record<string, unknown>[]).map((row) => mapServiceRow(row) as ManagedService)),
        catchError((error: unknown) => {
          void this.presentToast(extractApiErrorMessage(error, 'Failed to load services.'));
          return of([] as ManagedService[]);
        })
      ),
      doctors: this.apiService.get<any[]>('doctors/admin').pipe(
        map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDoctorSummary)),
        catchError((error: unknown) => {
          void this.presentToast(extractApiErrorMessage(error, 'Failed to load doctors.'));
          return of([] as DoctorSummary[]);
        })
      )
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ services, doctors }) => {
        this.services = services;
        this.doctors = doctors;
      });
  }

  private buildWritePayload(service: ManagedService): ServiceWriteDto {
    return {
      name: service.name.trim(),
      description: service.description?.trim() || '',
      category: service.category,
      price: Number(service.price ?? 0),
      estimatedDurationMinutes: Number(service.estimatedDurationMinutes ?? 0),
      doctorIds: [...(service.doctorIds ?? [])]
    };
  }

  private emptyDraft(): ManagedService {
    return {
      id: '',
      name: '',
      description: '',
      category: 'Consultation',
      price: 0,
      estimatedDurationMinutes: 30,
      doctorIds: [],
      isActive: true
    };
  }

  onModalDismiss(): void {
    this.editingId = null;
    this.draft = this.emptyDraft();
  }

  private async presentModal(): Promise<void> {
    const modal = this.getModalElement();
    if (!modal) {
      return;
    }

    await modal.present();
  }

  private async dismissModal(): Promise<void> {
    const modal = this.getModalElement();
    if (!modal) {
      return;
    }

    await modal.dismiss();
  }

  private getModalElement(): HTMLIonModalElement | null {
    return this.serviceModal?.nativeElement as HTMLIonModalElement | null;
  }

  private async presentToast(message: string, color: 'danger' | 'success' = 'danger'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2400,
      color,
      position: 'top'
    });
    await toast.present();
  }
}

function mapDoctorSummary(dto: Record<string, unknown>): DoctorSummary {
  return {
    id: resolveStr(dto, 'id') || '',
    userId: resolveStr(dto, 'userId') || resolveStr(dto, 'id') || '',
    fullName: resolveStr(dto, 'fullName') || 'Doctor',
    specialization: resolveStr(dto, 'specialization') || '',
    bio: resolveStr(dto, 'bio'),
    profilePhotoUrl: resolveStr(dto, 'profilePhotoUrl'),
    licenseNumber: resolveStr(dto, 'licenseNumber'),
    ptrNumber: resolveStr(dto, 'ptrNumber'),
    s2Number: resolveStr(dto, 's2Number'),
    consultationFee: resolveNum(dto, 'consultationFee') ?? 0,
    slotDurationMinutes: resolveNum(dto, 'slotDurationMinutes') ?? 30,
    slotCapacity: resolveNum(dto, 'slotCapacity') ?? 1,
    dailyPatientLimit: resolveNum(dto, 'dailyPatientLimit') ?? null,
    status: (resolveStr(dto, 'status') || 'Active') as DoctorSummary['status'],
    averageRating: resolveNum(dto, 'averageRating') ?? undefined,
    reviewCount: resolveNum(dto, 'reviewCount') ?? undefined
  };
}

function resolveStr(row: Record<string, unknown>, key: string): string | undefined {
  const snake = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
  const val = row[key] ?? row[snake];
  if (typeof val !== 'string') return undefined;
  const t = val.trim();
  return t || undefined;
}

function resolveNum(row: Record<string, unknown>, key: string): number | undefined {
  const snake = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
  const val = row[key] ?? row[snake];
  if (val === null || val === undefined) return undefined;
  if (typeof val === 'number' && isFinite(val)) return val;
  if (typeof val === 'string') {
    const p = parseFloat(val);
    if (isFinite(p)) return p;
  }
  return undefined;
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

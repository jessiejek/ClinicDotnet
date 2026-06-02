import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IonIcon, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { Subscription, catchError, distinctUntilChanged, finalize, of, switchMap } from 'rxjs';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  checkmarkCircleOutline,
  chevronForwardOutline
} from 'ionicons/icons';
import { Doctor } from '../../../../core/models/doctor.models';
import { Service } from '../../../../core/models';
import { ApiService } from '../../../../core/services/api.service';
import { BookingWizardService } from '../../../../core/services/booking-wizard.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { DoctorSummary } from '../../services/public.service';

@Component({
  selector: 'app-step-doctor-service',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    IonIcon,
    IonSpinner,
    AvatarComponent,
    StatusBadgeComponent,
    EmptyStateComponent
  ],
  templateUrl: './step-doctor-service.component.html',
  styleUrl: './step-doctor-service.component.scss'
})
export class StepDoctorServiceComponent implements OnInit {
  private readonly wizardService = inject(BookingWizardService);
  private readonly apiService = inject(ApiService);
  private readonly toastCtrl = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);
  private readonly subscriptions = new Subscription();

  doctors: DoctorSummary[] = [];
  selectedDoctorServices: Service[] = [];
  isLoading = true;
  selectedDoctorLoading = false;
  selectedDoctorError: string | null = null;

  selectedDoctorId$ = this.wizardService.selectedDoctorId$;
  private latestSelectedDoctorId: string | null = null;
  private latestSelectedServiceIds: string[] = [];

  get selectedDoctor(): DoctorSummary | undefined {
    return this.doctors.find((doctor) => doctor.id === this.latestSelectedDoctorId);
  }

  get canContinue(): boolean {
    return Boolean(this.latestSelectedDoctorId && this.latestSelectedServiceIds.length > 0);
  }

  get hasNoServicesSelected(): boolean {
    return this.latestSelectedServiceIds.length === 0;
  }

  constructor() {
    addIcons({ arrowBackOutline, chevronForwardOutline, checkmarkCircleOutline });

    this.subscriptions.add(
      this.selectedDoctorId$
        .pipe(
          distinctUntilChanged(),
          switchMap((doctorId) => {
            this.latestSelectedDoctorId = doctorId;
            this.selectedDoctorServices = [];
            this.selectedDoctorError = null;

            if (!doctorId) {
              this.selectedDoctorLoading = false;
              return of([]);
            }

            this.selectedDoctorLoading = true;
            return this.loadDoctorServices(doctorId);
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((services) => {
          this.selectedDoctorServices = services;
          if (services.length > 0) {
            this.selectedDoctorError = null;
          }
        })
    );

    this.subscriptions.add(
      this.wizardService.selectedServiceIds$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((serviceIds) => {
          this.latestSelectedServiceIds = serviceIds;
        })
    );
  }

  ngOnInit(): void {
    this.apiService
      .get<any[]>('doctors')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (doctors: DoctorSummary[]) => {
          this.doctors = doctors;
          this.isLoading = false;
        },
        error: (error: unknown) => {
          this.doctors = [];
          this.isLoading = false;
          void this.presentToast(extractApiErrorMessage(error, 'Failed to load doctors.'));
        }
      });

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectDoctor(doctor: any): void {
    this.wizardService.selectDoctor(doctor.id);
  }

  toggleService(serviceId: string): void {
    this.wizardService.toggleService(serviceId);
  }

  changeDoctor(): void {
    this.wizardService.selectDoctor(null);
  }

  isServiceSelected(serviceId: string): boolean {
    return this.latestSelectedServiceIds.includes(serviceId);
  }

  goNext(): void {
    if (this.canContinue) {
      this.wizardService.nextStep();
    }
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2400,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }

  private loadDoctorServices(doctorId: string) {
    return this.apiService.get<any[]>('doctors/' + doctorId + '/services').pipe(
      catchError((error: unknown) => {
        this.selectedDoctorError = extractApiErrorMessage(error, 'Failed to load doctor services.');
        void this.presentToast(this.selectedDoctorError);
        return of([]);
      }),
      finalize(() => {
        this.selectedDoctorLoading = false;
      })
    );
  }
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

import { DatePipe, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonCheckbox, IonItem, IonLabel, ToastController } from '@ionic/angular/standalone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { AuthUser, ClinicSettings, Patient } from '../../../core/models';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ApiService } from '../../../core/services/api.service';
import { ClinicSettingsService } from '../../../core/services/clinic-settings.service';

@Component({
  selector: 'app-patient-privacy-consent-page',
  standalone: true,
  imports: [NgIf, DatePipe, FormsModule, IonItem, IonLabel, IonCheckbox, IonButton],
  templateUrl: './patient-privacy-consent.page.html',
  styleUrl: './patient-privacy-consent.page.scss'
})
export class PatientPrivacyConsentPage implements OnInit {
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly clinicSettingsService = inject(ClinicSettingsService);
  private readonly toastCtrl = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);

  currentUser: AuthUser | null = null;
  currentPatient: Patient | null = null;
  settings: ClinicSettings | null = null;
  accepted = false;

  ngOnInit(): void {
    this.settings = this.clinicSettingsService.load();

    this.authState.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.apiService
          .get<any>('patients/me')
          .pipe(catchError(() => of(null)), takeUntilDestroyed(this.destroyRef))
          .subscribe((patient) => {
            this.currentPatient = patient ?? null;
          });
      }
    });
  }

  async acceptConsent(): Promise<void> {
    if (!this.currentPatient || !this.settings || !this.accepted) {
      return;
    }

    this.apiService
      .post<any>('patients/me/consent', { consentVersion: this.settings.consentVersion })
      .pipe(catchError(() => of(null)), takeUntilDestroyed(this.destroyRef))
      .subscribe(async (updated) => {
        if (!updated) {
          const errorToast = await this.toastCtrl.create({
            message: 'Unable to submit privacy consent.',
            duration: 2200,
            color: 'danger',
            position: 'top'
          });
          await errorToast.present();
          return;
        }

        this.currentPatient = updated;
        const toast = await this.toastCtrl.create({
          message: 'Privacy consent accepted.',
          duration: 2200,
          color: 'success',
          position: 'top'
        });
        await toast.present();
        void this.router.navigate(['/patient/dashboard']);
      });
  }
}

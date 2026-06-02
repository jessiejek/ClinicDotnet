import { CommonModule, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastController } from '@ionic/angular/standalone';
import { finalize, firstValueFrom, map, tap } from 'rxjs';
import { ClinicSettings } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { ClinicSettingsService } from '../../../core/services/clinic-settings.service';
import { mapClinicSettingsRow } from '../../../core/services/clinic-settings.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { OperatingHoursEditorComponent } from '../components/operating-hours-editor/operating-hours-editor.component';
import { ColorPickerComponent } from '../components/color-picker/color-picker.component';

type SettingsTab = 'general' | 'hours' | 'payments' | 'privacy' | 'branding';

@Component({
  selector: 'app-admin-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    EmptyStateComponent,
    SkeletonComponent,
    ConfirmModalComponent,
    OperatingHoursEditorComponent,
    ColorPickerComponent
  ],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss'
})
export class SettingsPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly clinicSettingsService = inject(ClinicSettingsService);
  private readonly toastCtrl = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);

  tabs: Array<{ id: SettingsTab; label: string }> = [
    { id: 'general', label: 'General' },
    { id: 'hours', label: 'Operating Hours' },
    { id: 'payments', label: 'Payments' },
    { id: 'privacy', label: 'Privacy & Consent' },
    { id: 'branding', label: 'Branding' }
  ];

  selectedTab: SettingsTab = 'general';
  draft: ClinicSettings | null = null;
  logoFileName = 'No file selected';
  isLoading = true;
  bumpConsentOpen = false;
  dirty = false;

  ngOnInit(): void {
    this.apiService
      .get<any>('settings')
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        const settings = data ? mapClinicSettingsRow(data as Record<string, unknown>) : this.clinicSettingsService.load();
        this.clinicSettingsService.setSettings(settings);
        this.draft = this.cloneSettings(settings);
        this.logoFileName = settings.logoUrl ? settings.logoUrl.split('/').pop() ?? 'Uploaded logo' : 'No file selected';
        this.applyPrimaryColor(settings.primaryColor);
      });
  }

  markDirty(): void {
    this.dirty = true;
  }

  updateHours(hours: ClinicSettings['operatingHours']): void {
    if (!this.draft) {
      return;
    }
    this.draft = {
      ...this.draft,
      operatingHours: hours
    };
    this.markDirty();
  }

  setPrimaryColor(value: string): void {
    if (!this.draft) {
      return;
    }
    this.draft = {
      ...this.draft,
      primaryColor: value
    };
    this.applyPrimaryColor(value);
    this.markDirty();
  }

  setSecondaryColor(value: string): void {
    if (!this.draft) {
      return;
    }
    this.draft = {
      ...this.draft,
      secondaryColor: value
    };
    this.markDirty();
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.draft) {
      return;
    }
    this.logoFileName = file.name;
    this.draft = {
      ...this.draft,
      logoUrl: `mock-upload://${file.name}`
    };
    this.markDirty();
  }

  saveSettings(): void {
    if (!this.draft || !this.validateDraft(this.draft)) {
      void this.presentToast('Please complete the required settings fields.', 'warning');
      return;
    }

    this.isLoading = true;
    void firstValueFrom(
      this.apiService.put<any>('settings', this.cloneSettings(this.draft)).pipe(
        map((updated) => updated ? mapClinicSettingsRow(updated as Record<string, unknown>) : this.clinicSettingsService.load()),
        tap((settings) => this.clinicSettingsService.setSettings(settings)),
        finalize(() => {
          this.isLoading = false;
        })
      )
    )
      .then((settings) => {
        this.draft = this.cloneSettings(settings);
        this.dirty = false;
        void this.presentToast('Settings saved.');
      })
      .catch((error: unknown) => {
        void this.presentToast(extractApiErrorMessage(error, 'Failed to save settings.'), 'danger');
      });
  }

  openConsentModal(): void {
    this.bumpConsentOpen = true;
  }

  bumpConsent(): void {
    this.clinicSettingsService.bumpConsentVersion();
    this.bumpConsentOpen = false;
    void this.presentToast('Consent version bumped.');
  }

  private validateDraft(settings: ClinicSettings): boolean {
    return !!settings.clinicName.trim() && !!settings.address?.trim() && !!settings.phone?.trim() && !!settings.email?.trim();
  }

  private cloneSettings(settings: ClinicSettings): ClinicSettings {
    return JSON.parse(JSON.stringify(settings)) as ClinicSettings;
  }

  private applyPrimaryColor(value: string): void {
    document.documentElement.style.setProperty('--ion-color-primary', value);
  }

  private async presentToast(message: string, color: 'success' | 'warning' | 'danger' = 'success'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
      position: 'top'
    });
    await toast.present();
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

  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }

  return fallback;
}

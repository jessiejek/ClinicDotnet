import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClinicSettings, OperatingHours } from '../models';

@Injectable({ providedIn: 'root' })
export class ClinicSettingsService {
  private readonly settingsSubject = new BehaviorSubject<ClinicSettings>(this.defaultSettings());

  readonly settings$ = this.settingsSubject.asObservable();

  load(): ClinicSettings {
    return this.settingsSubject.value;
  }

  setSettings(settings: ClinicSettings): void {
    this.settingsSubject.next(settings);
  }

  bumpConsentVersion(): ClinicSettings {
    const current = this.settingsSubject.value;
    const parts = (current.consentVersion || 'v1.0').replace('v', '').split('.');
    const major = parseInt(parts[0], 10) || 1;
    const minor = parseInt(parts[1], 10) || 0;
    const updated = { ...current, consentVersion: `v${major}.${minor + 1}` };
    this.settingsSubject.next(updated);
    return updated;
  }

  private defaultSettings(): ClinicSettings {
    return {
      id: '',
      clinicName: '',
      primaryColor: '#5D3E8E',
      secondaryColor: '#2563eb',
      operatingHours: {
        monday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
        tuesday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
        wednesday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
        thursday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
        friday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
        saturday: { isOpen: false, openTime: '08:00', closeTime: '12:00' },
        sunday: { isOpen: false, openTime: '08:00', closeTime: '12:00' },
      },
      cancellationDeadlineHours: 24,
      patientPortalEnabled: true,
      vaccinationReminderEnabled: true,
      followUpReminderEnabled: true,
      isPayAtClinicMode: false,
      payAtClinicNoShowWindowMinutes: 30,
      consentVersion: 'v1.0',
      paymentSettings: {},
    };
  }
}

export function mapClinicSettingsRow(row: Record<string, unknown>): ClinicSettings {
  const hours = (row['operating_hours'] ?? row['operatingHours'] ?? {}) as Record<string, unknown>;
  const payment = (row['payment_settings'] ?? row['paymentSettings'] ?? {}) as Record<string, unknown>;

  return {
    id: (row['id'] ?? '') as string,
    clinicName: (row['clinic_name'] ?? row['clinicName'] ?? '') as string,
    logoUrl: (row['logo_url'] ?? row['logoUrl']) as string | undefined,
    primaryColor: (row['primary_color'] ?? row['primaryColor'] ?? '#5D3E8E') as string,
    secondaryColor: (row['secondary_color'] ?? row['secondaryColor'] ?? '#2563eb') as string,
    address: row['address'] as string | undefined,
    phone: row['phone'] as string | undefined,
    email: row['email'] as string | undefined,
    facebookUrl: (row['facebook_url'] ?? row['facebookUrl']) as string | undefined,
    instagramUrl: (row['instagram_url'] ?? row['instagramUrl']) as string | undefined,
    operatingHours: {
      monday: (hours['monday'] ?? { isOpen: true, openTime: '08:00', closeTime: '17:00' }) as OperatingHours['monday'],
      tuesday: (hours['tuesday'] ?? { isOpen: true, openTime: '08:00', closeTime: '17:00' }) as OperatingHours['tuesday'],
      wednesday: (hours['wednesday'] ?? { isOpen: true, openTime: '08:00', closeTime: '17:00' }) as OperatingHours['wednesday'],
      thursday: (hours['thursday'] ?? { isOpen: true, openTime: '08:00', closeTime: '17:00' }) as OperatingHours['thursday'],
      friday: (hours['friday'] ?? { isOpen: true, openTime: '08:00', closeTime: '17:00' }) as OperatingHours['friday'],
      saturday: (hours['saturday'] ?? { isOpen: false, openTime: '08:00', closeTime: '12:00' }) as OperatingHours['saturday'],
      sunday: (hours['sunday'] ?? { isOpen: false, openTime: '08:00', closeTime: '12:00' }) as OperatingHours['sunday'],
    },
    cancellationDeadlineHours: (row['cancellation_deadline_hours'] ?? row['cancellationDeadlineHours'] ?? 24) as number,
    patientPortalEnabled: (row['patient_portal_enabled'] ?? row['patientPortalEnabled'] ?? true) as boolean,
    vaccinationReminderEnabled: (row['vaccination_reminder_enabled'] ?? row['vaccinationReminderEnabled'] ?? true) as boolean,
    followUpReminderEnabled: (row['follow_up_reminder_enabled'] ?? row['followUpReminderEnabled'] ?? true) as boolean,
    isPayAtClinicMode: (row['is_pay_at_clinic_mode'] ?? row['isPayAtClinicMode'] ?? false) as boolean,
    payAtClinicNoShowWindowMinutes: (row['pay_at_clinic_no_show_window_minutes'] ?? row['payAtClinicNoShowWindowMinutes'] ?? 30) as number,
    privacyPolicyText: (row['privacy_policy_text'] ?? row['privacyPolicyText']) as string | undefined,
    consentVersion: (row['consent_version'] ?? row['consentVersion'] ?? 'v1.0') as string,
    paymentSettings: {
      gcashQrImageUrl: (payment['gcash_qr_image_url'] ?? payment['gcashQrImageUrl']) as string | undefined,
      gcashAccountName: (payment['gcash_account_name'] ?? payment['gcashAccountName']) as string | undefined,
      gcashNumber: (payment['gcash_number'] ?? payment['gcashNumber']) as string | undefined,
      mayaQrImageUrl: (payment['maya_qr_image_url'] ?? payment['mayaQrImageUrl']) as string | undefined,
      mayaAccountName: (payment['maya_account_name'] ?? payment['mayaAccountName']) as string | undefined,
      mayaNumber: (payment['maya_number'] ?? payment['mayaNumber']) as string | undefined,
      bankName: (payment['bank_name'] ?? payment['bankName']) as string | undefined,
      bankAccountName: (payment['bank_account_name'] ?? payment['bankAccountName']) as string | undefined,
      bankAccountNumber: (payment['bank_account_number'] ?? payment['bankAccountNumber']) as string | undefined,
    },
  };
}

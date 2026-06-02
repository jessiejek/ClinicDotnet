import { NgFor, NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  ModalController,
  ToastController
} from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs';
import { closeOutline } from 'ionicons/icons';
import { PatientDetail, UpdatePatientRequest } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { passwordStrengthValidator } from '../../../shared/validators/password-strength.validator';
import { rowToDetail } from '../services/admin-patients.service';

type PatientEditFormValue = {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
  civilStatus: string;
  address: string;
  city: string;
  zipCode: string;
  contactNumber: string;
  email: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactRelationship: string;
  bloodType: string;
  philHealthNumber: string;
  hmoProvider: string;
  hmoCardNumber: string;
  linkAccount: boolean;
  accountPassword: string;
  accountAvatarUrl: string;
};

@Component({
  selector: 'app-admin-patient-edit-modal',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    IonButton,
    IonCheckbox,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    StatusBadgeComponent
  ],
  templateUrl: './admin-patient-edit-modal.component.html',
  styleUrl: './admin-patient-edit-modal.component.scss'
})
export class AdminPatientEditModalComponent {
  private _patient: PatientDetail | null = null;

  private readonly apiService = inject(ApiService);
  private readonly modalCtrl = inject(ModalController);
  private readonly toastCtrl = inject(ToastController);
  private readonly fb = inject(FormBuilder);
  readonly closeOutline = closeOutline;

  readonly civilStatusOptions = ['Single', 'Married', 'Separated', 'Widowed', 'Other'];
  readonly bloodTypeOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  isSaving = false;
  pendingAccountUserId: string | null = null;

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    sex: ['', Validators.required],
    civilStatus: [''],
    address: [''],
    city: [''],
    zipCode: [''],
    contactNumber: [''],
    email: ['', Validators.email],
    emergencyContactName: [''],
    emergencyContactNumber: [''],
    emergencyContactRelationship: [''],
    bloodType: [''],
    philHealthNumber: [''],
    hmoProvider: [''],
    hmoCardNumber: [''],
    linkAccount: [false],
    accountPassword: [''],
    accountAvatarUrl: ['']
  });

  @Input()
  set patient(value: PatientDetail | null) {
    this._patient = value;
    this.pendingAccountUserId = null;
    if (value) {
      this.patchForm(value);
    }
    this.syncAccountState();
  }

  get patient(): PatientDetail | null {
    return this._patient;
  }

  get accountFieldsVisible(): boolean {
    return !this.patient?.userId && (this.form.controls.linkAccount.value || !!this.pendingAccountUserId);
  }

  get emailErrorMessage(): string {
    return this.form.controls.linkAccount.value || !!this.pendingAccountUserId
      ? 'A valid email is required to create the login account.'
      : 'Enter a valid email address.';
  }

  showError(controlName: keyof PatientEditFormValue): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  showEmailError(): boolean {
    const control = this.form.get('email');
    return !!control && control.hasError('email') && (control.touched || control.dirty);
  }

  async cancel(): Promise<void> {
    if (this.isSaving) {
      return;
    }

    this.resetForm();
    await this.modalCtrl.dismiss(undefined, 'cancel');
  }

  onLinkAccountToggle(): void {
    this.syncAccountState();
  }

  async submit(): Promise<void> {
    if (this.form.invalid || !this.patient) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue() as PatientEditFormValue;
    this.isSaving = true;

    try {
      const accountUserId = await this.resolveAccountUserId(values);
      const dto = this.buildUpdateRequest(values, accountUserId);
      await firstValueFrom(
      this.apiService.put<any>('patients/' + this.patient.id, dto).pipe(
        map((data) => rowToDetail((data ?? {}) as Record<string, unknown>))
      )
      );

      await this.presentToast('Patient updated successfully.');
      this.resetForm();
      await this.modalCtrl.dismiss({ updated: true }, 'saved');
    } catch (error) {
      if (!this.patient?.userId && this.pendingAccountUserId) {
        await this.presentToast(
          'Login account was created, but the patient profile update did not save yet. Please save the patient record again if needed.',
          'danger'
        );
      } else {
        await this.presentToast(extractApiErrorMessage(error, 'Failed to update patient.'), 'danger');
      }
    } finally {
      this.isSaving = false;
    }
  }

  private patchForm(patient: PatientDetail): void {
    this.form.patchValue({
      firstName: patient.firstName ?? '',
      middleName: patient.middleName ?? '',
      lastName: patient.lastName ?? '',
      dateOfBirth: this.normalizeDate(patient.dateOfBirth),
      sex: patient.sex ?? '',
      civilStatus: patient.civilStatus ?? '',
      address: patient.address ?? '',
      city: patient.city ?? '',
      zipCode: patient.zipCode ?? '',
      contactNumber: patient.contactNumber ?? '',
      email: patient.email ?? '',
      emergencyContactName: patient.emergencyContactName ?? '',
      emergencyContactNumber: patient.emergencyContactNumber ?? '',
      emergencyContactRelationship: patient.emergencyContactRelationship ?? '',
      bloodType: patient.bloodType ?? '',
      philHealthNumber: patient.philHealthNumber ?? '',
      hmoProvider: patient.hmoProvider ?? '',
      hmoCardNumber: patient.hmoCardNumber ?? '',
      linkAccount: false,
      accountPassword: '',
      accountAvatarUrl: ''
    });
  }

  private syncAccountState(): void {
    const linkAccountControl = this.form.controls.linkAccount;
    const emailControl = this.form.controls.email;
    const passwordControl = this.form.controls.accountPassword;
    const avatarControl = this.form.controls.accountAvatarUrl;
    const hasLinkedAccount = Boolean(this.patient?.userId);
    const hasPendingAccount = Boolean(this.pendingAccountUserId);

    if (hasPendingAccount) {
      linkAccountControl.setValue(true, { emitEvent: false });
      linkAccountControl.disable({ emitEvent: false });
      emailControl.disable({ emitEvent: false });
      passwordControl.disable({ emitEvent: false });
      avatarControl.disable({ emitEvent: false });
      emailControl.setValidators([Validators.email]);
      passwordControl.clearValidators();
      passwordControl.setValue('', { emitEvent: false });
      avatarControl.setValue('', { emitEvent: false });
    } else if (hasLinkedAccount) {
      linkAccountControl.setValue(false, { emitEvent: false });
      linkAccountControl.disable({ emitEvent: false });
      emailControl.enable({ emitEvent: false });
      passwordControl.disable({ emitEvent: false });
      avatarControl.disable({ emitEvent: false });
      emailControl.setValidators([Validators.email]);
      passwordControl.clearValidators();
      passwordControl.setValue('', { emitEvent: false });
      avatarControl.setValue('', { emitEvent: false });
    } else {
      linkAccountControl.enable({ emitEvent: false });
      emailControl.enable({ emitEvent: false });
      passwordControl.enable({ emitEvent: false });
      avatarControl.enable({ emitEvent: false });

      if (linkAccountControl.value) {
        emailControl.setValidators([Validators.required, Validators.email]);
        passwordControl.setValidators([Validators.required, passwordStrengthValidator]);
      } else {
        emailControl.setValidators([Validators.email]);
        passwordControl.clearValidators();
        passwordControl.setValue('', { emitEvent: false });
        avatarControl.setValue('', { emitEvent: false });
      }
    }

    linkAccountControl.updateValueAndValidity({ emitEvent: false });
    emailControl.updateValueAndValidity({ emitEvent: false });
    passwordControl.updateValueAndValidity({ emitEvent: false });
    avatarControl.updateValueAndValidity({ emitEvent: false });
  }

  private async resolveAccountUserId(values: PatientEditFormValue): Promise<string | null> {
    const patient = this.patient;
    if (!patient) {
      throw new Error('Patient record was not found.');
    }

    if (patient.userId) {
      return patient.userId;
    }

    if (this.pendingAccountUserId) {
      return this.pendingAccountUserId;
    }

    if (!values.linkAccount) {
      return null;
    }

    const createdPatient = await firstValueFrom(
      this.apiService.post<any>('patients', {
        email: this.requiredValue(values.email),
        temporaryPassword: values.accountPassword
      })
    );

    const userId = createdPatient.userId?.trim();
    if (!userId) {
      throw new Error('Portal account was created but no linked user id was returned.');
    }

    this.pendingAccountUserId = userId;
    this.syncAccountState();
    return userId;
  }

  private buildUpdateRequest(values: PatientEditFormValue, userId: string | null): UpdatePatientRequest {
    const dto: UpdatePatientRequest = {
      firstName: this.requiredValue(values.firstName),
      middleName: this.optionalValue(values.middleName),
      lastName: this.requiredValue(values.lastName),
      dateOfBirth: this.requiredValue(values.dateOfBirth),
      sex: this.requiredValue(values.sex),
      civilStatus: this.optionalValue(values.civilStatus),
      address: this.optionalValue(values.address),
      city: this.optionalValue(values.city),
      zipCode: this.optionalValue(values.zipCode),
      contactNumber: this.optionalValue(values.contactNumber),
      email: this.optionalValue(values.email),
      emergencyContactName: this.optionalValue(values.emergencyContactName),
      emergencyContactNumber: this.optionalValue(values.emergencyContactNumber),
      emergencyContactRelationship: this.optionalValue(values.emergencyContactRelationship),
      bloodType: this.optionalValue(values.bloodType),
      philHealthNumber: this.optionalValue(values.philHealthNumber),
      hmoProvider: this.optionalValue(values.hmoProvider),
      hmoCardNumber: this.optionalValue(values.hmoCardNumber)
    };

    if (userId) {
      dto.userId = userId;
    }

    return dto;
  }

  private resetForm(): void {
    this.pendingAccountUserId = null;
    this.form.reset({
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      civilStatus: '',
      address: '',
      city: '',
      zipCode: '',
      contactNumber: '',
      email: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
      emergencyContactRelationship: '',
      bloodType: '',
      philHealthNumber: '',
      hmoProvider: '',
      hmoCardNumber: '',
      linkAccount: false,
      accountPassword: '',
      accountAvatarUrl: ''
    });
    this.syncAccountState();
  }

  private requiredValue(value: string | null | undefined): string {
    return (value ?? '').trim();
  }

  private optionalValue(value: string | null | undefined): string | undefined {
    const trimmed = (value ?? '').trim();
    return trimmed ? trimmed : undefined;
  }

  private normalizeDate(value: string | null | undefined): string {
    const raw = (value ?? '').trim();
    return raw ? raw.slice(0, 10) : '';
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
}

function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }

  if (error && typeof error === 'object') {
    const response = error as {
      error?: { message?: string; detail?: string; title?: string };
      message?: string;
      detail?: string;
      title?: string;
    };

    const message = response.error?.message || response.error?.detail || response.error?.title || response.message || response.detail || response.title;
    if (message && message.trim()) {
      return message.trim();
    }
  }

  return fallback;
}

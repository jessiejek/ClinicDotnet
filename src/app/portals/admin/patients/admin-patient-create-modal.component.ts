import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { closeOutline } from 'ionicons/icons';
import { CreatePatientRequest } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { passwordStrengthValidator } from '../../../shared/validators/password-strength.validator';

type PatientCreateFormValue = {
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
  createAccount: boolean;
  accountPassword: string;
  accountAvatarUrl: string;
};

@Component({
  selector: 'app-admin-patient-create-modal',
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
  templateUrl: './admin-patient-create-modal.component.html',
  styleUrl: './admin-patient-create-modal.component.scss'
})
export class AdminPatientCreateModalComponent {
  private readonly apiService = inject(ApiService);
  private readonly modalCtrl = inject(ModalController);
  private readonly toastCtrl = inject(ToastController);
  private readonly fb = inject(FormBuilder);
  readonly closeOutline = closeOutline;

  readonly sexOptions = ['Male', 'Female'];
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
    email: ['', [Validators.email]],
    emergencyContactName: [''],
    emergencyContactNumber: [''],
    emergencyContactRelationship: [''],
    bloodType: [''],
    philHealthNumber: [''],
    hmoProvider: [''],
    hmoCardNumber: [''],
    createAccount: [false],
    accountPassword: [''],
    accountAvatarUrl: ['']
  });

  get accountFieldsVisible(): boolean {
    return this.form.controls.createAccount.value || !!this.pendingAccountUserId;
  }

  showError(controlName: keyof PatientCreateFormValue): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  async cancel(): Promise<void> {
    if (this.isSaving) {
      return;
    }

    this.resetForm();
    await this.modalCtrl.dismiss(undefined, 'cancel');
  }

  onCreateAccountToggle(): void {
    this.syncAccountState();
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue() as PatientCreateFormValue;
    const wantsAccount = values.createAccount || !!this.pendingAccountUserId;

    this.isSaving = true;

    try {
      const accountUserId = wantsAccount ? await this.ensureAccountUserId(values) : null;
      const dto = this.buildPatientRequest(values, accountUserId);
      await firstValueFrom(this.apiService.post<any>('patients', dto));

      await this.presentToast(wantsAccount ? 'Patient and login account created successfully.' : 'Patient created successfully.');
      this.resetForm();
      await this.modalCtrl.dismiss({ created: true }, 'saved');
    } catch (error) {
      if (wantsAccount && this.pendingAccountUserId) {
        await this.presentToast(
          'Login account was created, but the patient profile was not saved yet. Please save the patient record again.',
          'danger'
        );
      } else {
        await this.presentToast(extractApiErrorMessage(error, 'Failed to create patient.'), 'danger');
      }
    } finally {
      this.isSaving = false;
    }
  }

  private syncAccountState(): void {
    const createAccountControl = this.form.controls.createAccount;
    const emailControl = this.form.controls.email;
    const passwordControl = this.form.controls.accountPassword;
    const avatarControl = this.form.controls.accountAvatarUrl;

    if (this.pendingAccountUserId) {
      createAccountControl.setValue(true, { emitEvent: false });
      createAccountControl.disable({ emitEvent: false });
      emailControl.disable({ emitEvent: false });
      passwordControl.disable({ emitEvent: false });
      avatarControl.disable({ emitEvent: false });
      emailControl.setValidators([Validators.required, Validators.email]);
      passwordControl.clearValidators();
      passwordControl.setValue('', { emitEvent: false });
      avatarControl.setValue('', { emitEvent: false });
    } else {
      createAccountControl.enable({ emitEvent: false });
      emailControl.enable({ emitEvent: false });
      passwordControl.enable({ emitEvent: false });
      avatarControl.enable({ emitEvent: false });

      if (createAccountControl.value) {
        emailControl.setValidators([Validators.required, Validators.email]);
        passwordControl.setValidators([Validators.required, passwordStrengthValidator]);
      } else {
        emailControl.setValidators([Validators.email]);
        passwordControl.clearValidators();
        passwordControl.setValue('', { emitEvent: false });
        avatarControl.setValue('', { emitEvent: false });
      }
    }

    emailControl.updateValueAndValidity({ emitEvent: false });
    passwordControl.updateValueAndValidity({ emitEvent: false });
    avatarControl.updateValueAndValidity({ emitEvent: false });
  }

  private async ensureAccountUserId(values: PatientCreateFormValue): Promise<string | null> {
    if (this.pendingAccountUserId) {
      return this.pendingAccountUserId;
    }

    const accountPayload = {
      firstName: this.requiredValue(values.firstName),
      middleName: this.optionalValue(values.middleName),
      lastName: this.requiredValue(values.lastName),
      email: this.requiredValue(values.email),
      password: values.accountPassword,
      avatarUrl: this.optionalValue(values.accountAvatarUrl)
    };

    const userId = await firstValueFrom(this.apiService.post<any>('patients', accountPayload));
    this.pendingAccountUserId = userId;
    this.syncAccountState();
    return userId;
  }

  private buildPatientRequest(values: PatientCreateFormValue, userId: string | null): CreatePatientRequest {
    return {
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
      hmoCardNumber: this.optionalValue(values.hmoCardNumber),
      userId
    };
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
      createAccount: false,
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

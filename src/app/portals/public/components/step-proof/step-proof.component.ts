import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgIf } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { IonIcon, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUploadOutline, imageOutline, receiptOutline } from 'ionicons/icons';
import { ApiService } from '../../../../core/services/api.service';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { CreateBookingRequest } from '../../../../core/services/booking.service';
import { BookingWizardService } from '../../../../core/services/booking-wizard.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';

type ProofChoice = 'ReferenceNumber' | 'Screenshot';

@Component({
  selector: 'app-step-proof',
  standalone: true,
  imports: [NgIf, FormsModule, AsyncPipe, IonIcon, IonItem, IonInput, IonLabel],
  templateUrl: './step-proof.component.html',
  styleUrl: './step-proof.component.scss'
})
export class StepProofComponent {
  private readonly wizardService = inject(BookingWizardService);
  private readonly authState = inject(AuthStateService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);

  proofType: ProofChoice = 'ReferenceNumber';
  referenceNumber = '';
  screenshotFileName = '';
  isSubmitting = false;

  wizard$ = this.wizardService.state$;

  constructor() {
    addIcons({ receiptOutline, imageOutline, cloudUploadOutline });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.screenshotFileName = file.name;
    }
  }

  get canSubmit(): boolean {
    if (this.proofType === 'ReferenceNumber') {
      return this.referenceNumber.trim().length >= 5;
    }
    return this.screenshotFileName.length > 0;
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting || !this.canSubmit) {
      return;
    }

    await this.createBooking();
  }

  async submitPayAtClinic(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    await this.createBooking(true);
  }

  goBack(): void {
    this.wizardService.prevStep();
  }

  private async createBooking(payAtClinic = false): Promise<void> {
    const wizard = this.wizardService.snapshot;
    const user = this.authState.snapshot;

    if (!wizard.selectedDoctorId || !wizard.selectedServiceId || !wizard.selectedDate || !wizard.selectedSlot) {
      await this.presentToast('Please complete all booking details before submitting.');
      return;
    }

    const patientId = user?.id ? await this.resolvePatientId(user.id) : undefined;

    const payload = this.buildBookingRequest(patientId, payAtClinic ? 'PayAtClinic' : wizard.paymentMode);
    this.isSubmitting = true;

    try {
      const booking = await this.submitBookingRequest(payload);
      this.wizardService.patchState({
        bookingId: booking.id,
        queueNumber: booking.queueNumber ?? null
      });

      if (!user) {
        await this.presentToast('Create an account to track your bookings', 'success');
        await this.router.navigate(['/public/booking-confirmation', booking.id]);
        return;
      }

      await this.router.navigate(['/patient/bookings', booking.id]);
    } catch (error) {
      await this.presentToast(extractApiErrorMessage(error, 'Failed to create booking.'));
    } finally {
      this.isSubmitting = false;
    }
  }

  private async submitBookingRequest(payload: CreateBookingRequest): Promise<{ id: string; queueNumber: number | null }> {
    const body: Record<string, unknown> = {
      doctorId: payload.doctorId,
      serviceIds: payload.serviceIds ?? (payload.serviceId ? [payload.serviceId] : []),
      appointmentDate: payload.appointmentDate,
      slotStartTime: payload.slotStartTime,
      slotEndTime: payload.slotEndTime
    };

    if (payload.notes) {
      body['notes'] = payload.notes;
    }

    const booking = await firstValueFrom(this.apiService.post<any>('bookings', body));
    const bookingId = booking?.id;

    if (!bookingId) {
      throw new Error('Booking was created but no booking ID was returned.');
    }

    return {
      id: bookingId,
      queueNumber: normalizeNullableNumber(booking?.queueNumber ?? booking?.queue_number)
    };
  }

  private buildBookingRequest(patientId: string | undefined, paymentMode: 'Online' | 'PayAtClinic'): CreateBookingRequest {
    const wizard = this.wizardService.snapshot;
    const notes = this.buildNotes(paymentMode);

    const request: CreateBookingRequest = {
      doctorId: wizard.selectedDoctorId ?? '',
      serviceId: wizard.selectedServiceId ?? '',
      appointmentDate: wizard.selectedDate ?? '',
      slotStartTime: wizard.selectedSlot ?? '',
      slotEndTime: wizard.selectedSlotEnd ?? wizard.selectedSlot ?? '',
      paymentMode,
      notes
    };

    if (patientId) {
      request.patientId = patientId;
    }

    return request;
  }

  private buildNotes(paymentMode: 'Online' | 'PayAtClinic'): string | undefined {
    if (paymentMode === 'PayAtClinic') {
      return undefined;
    }

    const proofValue =
      this.proofType === 'ReferenceNumber' ? this.referenceNumber.trim() : this.screenshotFileName.trim();

    if (!proofValue) {
      return undefined;
    }

    return `Payment proof (${this.proofType}): ${proofValue}`;
  }

  private async resolvePatientId(userId: string): Promise<string | undefined> {
    if (!userId) {
      return undefined;
    }

    try {
      const patient = await firstValueFrom(this.apiService.get<any>('patients/me'));
      return patient.userId && patient.userId !== userId ? undefined : patient.id;
    } catch (error) {
      console.warn('Unable to resolve the signed-in patient profile for booking submission.', error);
      return undefined;
    }
  }

  private async presentToast(message: string, color: 'success' | 'danger' | 'warning' | 'medium' = 'danger'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2400,
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

  return fallback;
}

function mapBookingSubmissionResult(
  row: unknown,
  bookingId: string
): { id: string; queueNumber: number | null } {
  const record = isRecord(row) ? row : {};
  return {
    id: trimOptionalString(record['booking_id']) ?? trimOptionalString(record['id']) ?? bookingId,
    queueNumber: normalizeNullableNumber(record['queue_number']) ?? null
  };
}

function trimOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

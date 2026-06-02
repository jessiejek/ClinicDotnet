import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { firstValueFrom, combineLatest, map, of, switchMap, catchError } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { CreateBookingRequest } from '../../../../core/services/booking.service';
import { BookingWizardService } from '../../../../core/services/booking-wizard.service';

@Component({
  selector: 'app-step-payment',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, FormsModule],
  templateUrl: './step-payment.component.html',
  styleUrl: './step-payment.component.scss'
})
export class StepPaymentComponent {
  private readonly wizardService = inject(BookingWizardService);
  private readonly authState = inject(AuthStateService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);

  notes = '';
  isSubmitting = false;

  vm$ = this.wizardService.state$.pipe(
    switchMap((wizard) =>
      combineLatest([
        of(wizard),
        this.apiService.get<any[]>('doctors').pipe(catchError(() => of([]))),
        wizard.selectedDoctorId
          ? this.apiService.get<any[]>('doctors/' + wizard.selectedDoctorId + '/services').pipe(catchError(() => of([])))
          : of([])
      ])
    ),
    map(([wizard, doctors, services]) => {
      const doctor = wizard.selectedDoctorId ? doctors.find((item) => item.id === wizard.selectedDoctorId) : null;
      const selectedServices = services.filter((service) => wizard.selectedServiceIds.includes(service.id));

      return {
        doctorName: doctor?.fullName ?? 'Doctor',
        servicesLabel:
          selectedServices.length > 0
            ? selectedServices.map((service) => service.name).join(', ')
            : `${wizard.selectedServiceIds.length} service${wizard.selectedServiceIds.length === 1 ? '' : 's'} selected`,
        selectedDate: wizard.selectedDate ?? '-',
        selectedSlot: wizard.selectedSlot ?? '-',
        selectedSlotEnd: wizard.selectedSlotEnd ?? wizard.selectedSlot ?? '-'
      };
    })
  );

  async submitBooking(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    if (!this.authState.snapshot) {
      await this.presentToast('Please log in to book an appointment.');
      return;
    }

    const wizard = this.wizardService.snapshot;
    if (
      !wizard.selectedDoctorId ||
      wizard.selectedServiceIds.length === 0 ||
      !wizard.selectedDate ||
      !wizard.selectedSlot ||
      !wizard.selectedSlotEnd
    ) {
      await this.presentToast('Please complete all booking details before submitting.');
      return;
    }

    const payload: CreateBookingRequest = {
      doctorId: wizard.selectedDoctorId,
      serviceIds: wizard.selectedServiceIds,
      appointmentDate: wizard.selectedDate,
      slotStartTime: wizard.selectedSlot,
      slotEndTime: wizard.selectedSlotEnd,
      notes: this.notes.trim() || undefined
    };

    this.isSubmitting = true;

    try {
      // Ensure the logged-in patient has a patients row so current_patient_id() resolves
      await this.authState.ensurePatientRecord();

      const booking = await this.submitBookingRequest(payload);
      this.wizardService.patchState({
        bookingId: booking.id,
        queueNumber: booking.queueNumber ?? null
      });
      await this.presentToast('Booking confirmed.', 'success');
      await this.router.navigate(['/public/booking-confirmation', booking.id]);
      this.wizardService.reset();
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
      queueNumber: booking?.queueNumber ?? null
    };
  }

  goBack(): void {
    this.wizardService.prevStep();
  }

  private async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning' | 'medium' = 'danger'
  ): Promise<void> {
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

  return fallback;
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

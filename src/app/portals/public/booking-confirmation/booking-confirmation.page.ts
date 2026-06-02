import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { BehaviorSubject, combineLatest, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { BookingWizardService } from '../../../core/services/booking-wizard.service';
import { PesoPipe } from '../../../shared/pipes/peso.pipe';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { TimeSlotPipe } from '../../../shared/pipes/time-slot.pipe';

interface BookingConfirmationVm {
  bookingId: string;
  queueNumber: number | null;
  doctorName: string;
  selectedDate: string | null;
  selectedSlot: string | null;
  selectedSlotEnd: string | null;
  serviceName: string;
  totalFee: number;
  paymentMode: string;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-booking-confirmation-page',
  standalone: true,
  imports: [NgIf, AsyncPipe, DatePipe, RouterLink, IonContent, PesoPipe, TimeSlotPipe, StatusBadgeComponent],
  templateUrl: './booking-confirmation.page.html',
  styleUrl: './booking-confirmation.page.scss'
})
export class BookingConfirmationPage {
  private readonly route = inject(ActivatedRoute);
  private readonly authState = inject(AuthStateService);
  private readonly wizardService = inject(BookingWizardService);
  private readonly apiService = inject(ApiService);

  vm$ = combineLatest([
    this.route.paramMap,
    this.wizardService.state$,
    this.authState.isAuthenticated$
  ]).pipe(
    switchMap(([params, wizard, isAuthenticated]) => {
      const bookingId = params.get('bookingId') ?? wizard.bookingId ?? '';

      if (!bookingId) {
        return of({
          bookingId: '-',
          queueNumber: null,
          doctorName: '-',
          selectedDate: null,
          selectedSlot: null,
          selectedSlotEnd: null,
          serviceName: '-',
          totalFee: 0,
          paymentMode: 'PayAtClinic',
          isAuthenticated,
          loading: false,
          error: 'No booking reference found.'
        });
      }

      // If wizard state has data (fresh booking), use it
      if (wizard.selectedDoctorId && wizard.selectedDate) {
        const doctor$ = wizard.selectedDoctorId
          ? this.apiService.get<any[]>('doctors').pipe(
              map((doctors) => doctors.find((d) => d.id === wizard.selectedDoctorId) ?? null)
            )
          : of(null);
        const service$ = wizard.selectedServiceId
          ? this.apiService.get<any[]>('services').pipe(
              map((services) => services.find((s) => s.id === wizard.selectedServiceId) ?? null)
            )
          : of(null);

        return combineLatest([doctor$, service$]).pipe(
          map(([doctor, service]) => ({
            bookingId,
            queueNumber: wizard.queueNumber,
            doctorName: doctor?.fullName ?? '-',
            selectedDate: wizard.selectedDate,
            selectedSlot: wizard.selectedSlot,
            selectedSlotEnd: wizard.selectedSlotEnd,
            serviceName: service?.name ?? '-',
            totalFee: (doctor?.consultationFee ?? 0) + (service?.price ?? 0),
            paymentMode: wizard.paymentMode,
            isAuthenticated,
            loading: false,
            error: null
          }))
        );
      }

      // Fallback: load from public-safe endpoint (direct navigation / bookmark)
      return this.apiService.get<any>(`bookings/${bookingId}/public-summary`).pipe(
        map((data) => ({
          bookingId: data?.id ?? bookingId,
          queueNumber: data?.queueNumber ?? null,
          doctorName: data?.doctorName ?? '-',
          selectedDate: data?.appointmentDate ?? null,
          selectedSlot: data?.slotStartTime ?? null,
          selectedSlotEnd: data?.slotEndTime ?? null,
          serviceName: data?.serviceName ?? '-',
          totalFee: data?.totalFee ?? 0,
          paymentMode: data?.paymentStatus === 'Paid' ? 'Online' : 'PayAtClinic',
          isAuthenticated,
          loading: false,
          error: null
        }))
      );
    })
  );
}

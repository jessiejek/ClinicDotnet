import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { BookingWizardService } from '../../../../core/services/booking-wizard.service';
import { TimeSlotPipe } from '../../../../shared/pipes/time-slot.pipe';

@Component({
  selector: 'app-booking-summary-bar',
  standalone: true,
  imports: [NgIf, AsyncPipe, DatePipe, TimeSlotPipe],
  templateUrl: './booking-summary-bar.component.html',
  styleUrl: './booking-summary-bar.component.scss'
})
export class BookingSummaryBarComponent {
  private readonly wizardService = inject(BookingWizardService);
  private readonly apiService = inject(ApiService);

  wizard$ = this.wizardService.state$;
  currentStep$ = this.wizardService.currentStep$;

  summary$ = this.wizard$.pipe(
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
        doctorName: doctor?.fullName ?? '',
        servicesLabel:
          selectedServices.length > 0
            ? selectedServices.map((service) => service.name).join(', ')
            : '',
        selectedDate: wizard.selectedDate,
        selectedSlot: wizard.selectedSlot,
        selectedSlotEnd: wizard.selectedSlotEnd
      };
    })
  );
}

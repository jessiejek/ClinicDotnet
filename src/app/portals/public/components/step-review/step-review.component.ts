import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { BookingWizardService } from '../../../../core/services/booking-wizard.service';
import { TimeSlotPipe } from '../../../../shared/pipes/time-slot.pipe';

@Component({
  selector: 'app-step-review',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, DatePipe, TimeSlotPipe],
  templateUrl: './step-review.component.html',
  styleUrl: './step-review.component.scss'
})
export class StepReviewComponent {
  private readonly wizardService = inject(BookingWizardService);
  private readonly apiService = inject(ApiService);

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
      const fallbackServiceNames = wizard.selectedServiceIds;

      return {
        doctorName: doctor?.fullName ?? '-',
        doctorSpecialization: doctor?.specialization ?? '',
        services: selectedServices,
        serviceSummary:
          selectedServices.length > 0
            ? selectedServices.map((service) => service.name).join(', ')
            : `${fallbackServiceNames.length} service${fallbackServiceNames.length === 1 ? '' : 's'} selected`,
        selectedDate: wizard.selectedDate,
        selectedSlot: wizard.selectedSlot,
        selectedSlotEnd: wizard.selectedSlotEnd
      };
    })
  );

  onConfirmAndProceed(): void {
    this.wizardService.nextStep();
  }

  goBack(): void {
    this.wizardService.prevStep();
  }
}

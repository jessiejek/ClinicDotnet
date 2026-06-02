import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmark } from 'ionicons/icons';
import { BookingWizardService } from '../../../../core/services/booking-wizard.service';
import { BookingSummaryBarComponent } from '../booking-summary-bar/booking-summary-bar.component';
import { StepAuthCheckComponent } from '../step-auth-check/step-auth-check.component';
import { StepDatePickerComponent } from '../step-date-picker/step-date-picker.component';
import { StepDoctorServiceComponent } from '../step-doctor-service/step-doctor-service.component';
import { StepPaymentComponent } from '../step-payment/step-payment.component';
import { StepReviewComponent } from '../step-review/step-review.component';
import { StepSlotSelectComponent } from '../step-slot-select/step-slot-select.component';

@Component({
  selector: 'app-booking-wizard',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    AsyncPipe,
    IonIcon,
    BookingSummaryBarComponent,
    StepDoctorServiceComponent,
    StepDatePickerComponent,
    StepSlotSelectComponent,
    StepReviewComponent,
    StepAuthCheckComponent,
    StepPaymentComponent
  ],
  templateUrl: './booking-wizard.component.html',
  styleUrl: './booking-wizard.component.scss'
})
export class BookingWizardComponent {
  readonly STEPS = [
    { step: 1, label: 'Doctor & Service' },
    { step: 2, label: 'Select Date' },
    { step: 3, label: 'Select Time' },
    { step: 4, label: 'Review' },
    { step: 5, label: 'Account' },
    { step: 6, label: 'Confirm' }
  ];

  private readonly wizardService = inject(BookingWizardService);

  wizard$ = this.wizardService.state$;
  currentStep$ = this.wizardService.currentStep$;

  constructor() {
    addIcons({ checkmark });
  }
}

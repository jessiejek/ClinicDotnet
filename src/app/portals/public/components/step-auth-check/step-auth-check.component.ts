import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline } from 'ionicons/icons';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { BookingWizardService } from '../../../../core/services/booking-wizard.service';

@Component({
  selector: 'app-step-auth-check',
  standalone: true,
  imports: [NgIf, RouterLink, IonIcon],
  templateUrl: './step-auth-check.component.html',
  styleUrl: './step-auth-check.component.scss'
})
export class StepAuthCheckComponent {
  private readonly authState = inject(AuthStateService);
  private readonly wizardService = inject(BookingWizardService);
  readonly isAuthenticated = !!this.authState.snapshot;

  constructor() {
    addIcons({ lockClosedOutline });
  }

  continue(): void {
    this.wizardService.nextStep();
  }

  goBack(): void {
    this.wizardService.prevStep();
  }
}

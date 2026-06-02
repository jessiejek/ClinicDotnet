import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, menuOutline } from 'ionicons/icons';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { ClinicSettingsService } from '../../../../core/services/clinic-settings.service';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [AsyncPipe, NgClass, NgIf, RouterLink, RouterLinkActive, IonIcon],
  templateUrl: './public-navbar.component.html',
  styleUrl: './public-navbar.component.scss'
})
export class PublicNavbarComponent {
  /** Vertical scroll position of `.public-main` (body/window does not scroll with Ionic defaults). */
  @Input() mainScrollTop = 0;

  readonly currentUser$ = inject(AuthStateService).currentUser$;

  private readonly clinicSettings = inject(ClinicSettingsService);
  readonly settings = this.clinicSettings.load();

  menuOpen = false;

  get navScrolled(): boolean {
    return this.mainScrollTop > 10;
  }

  constructor() {
    addIcons({ menuOutline, closeOutline });
  }

  portalDashboardRoute(role: string): string {
    switch (role) {
      case 'Admin':
        return '/admin/dashboard';
      case 'Staff':
        return '/staff/dashboard';
      case 'Doctor':
        return '/doctor/dashboard';
      default:
        return '/patient/dashboard';
    }
  }

  closeMobile(): void {
    this.menuOpen = false;
  }
}

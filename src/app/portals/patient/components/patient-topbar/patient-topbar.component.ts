import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  closeOutline,
  documentTextOutline,
  gridOutline,
  medicalOutline,
  menuOutline,
  logOutOutline,
  personOutline
} from 'ionicons/icons';
import { AuthUser, NavItem } from '../../../../core/models';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-patient-topbar',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive, IonIcon, AvatarComponent],
  templateUrl: './patient-topbar.component.html',
  styleUrl: './patient-topbar.component.scss'
})
export class PatientTopbarComponent {
  @Input() navItems: NavItem[] = [];
  @Input() currentUser: AuthUser | null = null;
  @Input() clinicName = 'Clinic';
  @Input() portalLabel = 'Patient Portal';

  @Output() logout = new EventEmitter<void>();

  menuOpen = false;

  constructor() {
    addIcons({
      gridOutline,
      calendarOutline,
      medicalOutline,
      documentTextOutline,
      personOutline,
      menuOutline,
      closeOutline,
      logOutOutline
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}

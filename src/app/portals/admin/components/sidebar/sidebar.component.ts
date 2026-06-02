import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, logOutOutline, menuOutline } from 'ionicons/icons';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { AuthUser, NavItem, Role } from '../../../../core/models';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive, IonIcon, AvatarComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() navItems: NavItem[] = [];
  @Input() portalLabel = 'Portal';
  @Input() clinicName = 'Clinic';
  @Input() currentUser: AuthUser | null = null;
  @Input() isOpen = false;

  @Output() logout = new EventEmitter<void>();
  @Output() navClick = new EventEmitter<void>();
  @Output() menuToggle = new EventEmitter<void>();

  private readonly router = inject(Router);
  private readonly profileRoutes: Record<Role, string> = {
    Admin: '/admin/settings',
    Staff: '/staff/profile',
    Doctor: '/doctor/profile',
    Patient: '/patient/profile'
  };

  constructor() {
    addIcons({ closeOutline, logOutOutline, menuOutline });
  }

  get profileRoute(): string | null {
    return this.currentUser ? this.profileRoutes[this.currentUser.role] : null;
  }

  get profileAriaLabel(): string {
    if (!this.currentUser) {
      return 'Open profile';
    }

    return this.currentUser.role === 'Admin' ? 'Open admin settings' : `Open ${this.currentUser.role} profile`;
  }

  goToProfile(): void {
    if (!this.profileRoute) {
      return;
    }

    this.navClick.emit();
    void this.router.navigateByUrl(this.profileRoute);
  }

  onLogoutClick(event: MouseEvent): void {
    event.stopPropagation();
    this.logout.emit();
  }
}

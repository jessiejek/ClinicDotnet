import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, closeOutline, logOutOutline, menuOutline } from 'ionicons/icons';
import { AuthUser, Role } from '../../../../core/models';
import { getClinicalRoleBadge, resolveClinicalRole } from '../../../../core/utils/clinical-role.util';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [IonIcon, AvatarComponent, NotificationBellComponent, NgClass],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  @Input() title = 'Dashboard';
  @Input() portalLabel = 'Portal';
  @Input() currentUser: AuthUser | null = null;
  @Input() unreadCount = 0;
  @Input() sidebarOpen = false;

  @Output() logout = new EventEmitter<void>();
  @Output() menuToggle = new EventEmitter<void>();

  private readonly router = inject(Router);
  private readonly profileRoutes: Record<Role, string> = {
    Admin: '/admin/settings',
    Staff: '/staff/profile',
    Doctor: '/doctor/profile',
    Patient: '/patient/profile'
  };

  constructor() {
    addIcons({ chevronBackOutline, closeOutline, logOutOutline, menuOutline });
  }

  get roleBadge() {
    if (this.currentUser?.role === 'Patient') {
      return { label: 'Patient', className: 'role-badge--patient' };
    }
    return getClinicalRoleBadge(resolveClinicalRole(this.currentUser));
  }

  get displayUserName(): string {
    if (!this.currentUser) {
      return 'Admin User';
    }

    if (this.currentUser.role === 'Doctor') {
      const parts = (this.currentUser.fullName || '').split(' ').filter(Boolean);
      const lastName = parts.length > 1 ? parts[parts.length - 1] : parts[0] || 'Doctor';
      return `Dr. ${lastName}`;
    }

    return this.currentUser.fullName || 'Admin User';
  }

  goToProfile(): void {
    if (!this.currentUser) return;
    const route = this.profileRoutes[this.currentUser.role];
    if (route) {
      void this.router.navigateByUrl(route);
    }
  }
}

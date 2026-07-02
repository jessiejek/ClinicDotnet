import { Component, HostListener, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { catchError, of } from 'rxjs';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  documentTextOutline,
  gridOutline,
  logOutOutline,
  medkitOutline,
  medicalOutline,
  personOutline
} from 'ionicons/icons';
import { ToastController } from '@ionic/angular/standalone';
import { NavItem } from '../../../../core/models';
import { ApiService } from '../../../../core/services/api.service';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { ClinicSettingsService } from '../../../../core/services/clinic-settings.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TokenService } from '../../../../core/services/token.service';
import { SidebarComponent } from '../../../admin/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../admin/components/topbar/topbar.component';
import { PATIENT_NAV_ITEMS } from '../../patient.routes';


@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SidebarComponent, TopbarComponent],
  templateUrl: './patient-layout.component.html',
  styleUrl: './patient-layout.component.scss'
})
export class PatientLayoutComponent implements OnInit {
  private readonly authState = inject(AuthStateService);
  private readonly apiService = inject(ApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly clinicSettingsService = inject(ClinicSettingsService);
  private readonly tokenService = inject(TokenService);
  private readonly toastCtrl = inject(ToastController);

  readonly currentUser = this.authState.currentUser;
  readonly unreadCount = this.notificationService.unreadCount;

  clinicName = '';
  portalLabel = 'Patient Portal';
  portalTitle = 'Dashboard';
  navItems: NavItem[] = PATIENT_NAV_ITEMS;
  sidebarOpen = false;
  private sidebarMode = 'desktop';
  downloadingClinicalRecords = false;

  constructor() {
    addIcons({
      gridOutline,
      calendarOutline,
      documentTextOutline,
      medicalOutline,
      medkitOutline,
      personOutline,
      logOutOutline
    });
  }

  ngOnInit(): void {
    this.clinicName = this.clinicSettingsService.load().clinicName;
    this.syncSidebarState(true);
    this.loadNotifications();
  }

  get pageTitle(): string {
    const route = this.getDeepestChild(this.router.routerState.root);
    return (route.snapshot?.data?.['title'] as string | undefined) ?? this.portalTitle;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.syncSidebarState();
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  handleSidebarNavClick(): void {
    if (this.sidebarMode === 'mobile') {
      this.sidebarOpen = false;
    }
  }

  logout(): void {
    const refreshToken = this.tokenService.getRefreshToken();
    const request$ = refreshToken
      ? this.apiService.post('auth/logout', { refreshToken }).pipe(catchError(() => of(void 0)))
      : of(void 0);

    request$.subscribe({
      next: () => {
        this.authState.logout();
        void this.router.navigate(['/auth/login'], { replaceUrl: true });
      }
    });
  }

  downloadAllClinicalRecords(): void {
    if (this.downloadingClinicalRecords) {
      return;
    }

    this.downloadingClinicalRecords = true;
    this.apiService.getBlob('patient-documents/me/all.pdf').subscribe({
      next: (blob) => {
        this.saveBlob(blob, `clinical-records-${new Date().toISOString().slice(0, 10)}.pdf`);
        this.downloadingClinicalRecords = false;
      },
      error: () => {
        this.downloadingClinicalRecords = false;
        void this.showToast('Document not available yet.');
      }
    });
  }

  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
  }

  private saveBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  private loadNotifications(): void {
    this.apiService
      .get<any[]>('notifications')
      .pipe(catchError(() => of([] as any[])))
      .subscribe((items) => this.notificationService.setNotifications(items as any));
  }

  private syncSidebarState(force = false): void {
    const nextMode = this.getSidebarMode();
    if (!force && nextMode === this.sidebarMode) {
      return;
    }

    this.sidebarMode = nextMode;
    this.sidebarOpen = nextMode === 'desktop';
  }

  private getSidebarMode(): 'desktop' | 'compact' | 'mobile' {
    if (typeof window === 'undefined') {
      return 'desktop';
    }

    if (window.innerWidth < 768) {
      return 'mobile';
    }

    if (window.innerWidth < 1280) {
      return 'compact';
    }

    return 'desktop';
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color: 'dark',
      position: 'bottom'
    });
    await toast.present();
  }
}

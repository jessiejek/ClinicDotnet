import { AsyncPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  inject
} from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { catchError, filter, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  arrowBackOutline,
  cashOutline,
  calendarNumberOutline,
  calendarOutline,
  checkmarkCircleOutline,
  checkmarkOutline,
  closeOutline,
  createOutline,
  documentTextOutline,
  ellipsisVertical,
  eyeOffOutline,
  eyeOutline,
  gridOutline,
  listOutline,
  logOutOutline,
  medicalOutline,
  megaphoneOutline,
  menuOutline,
  notificationsOutline,
  peopleOutline,
  personAddOutline,
  personCircleOutline,
  personRemoveOutline,
  personOutline,
  pricetagOutline,
  refreshOutline,
  searchOutline,
  settingsOutline,
  shieldCheckmarkOutline,
  statsChartOutline,
  timeOutline,
  toggleOutline,
  walkOutline,
  warningOutline
} from 'ionicons/icons';
import { NavItem } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ClinicSettingsService } from '../../../core/services/clinic-settings.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RealtimeInitService } from '../../../core/services/realtime-init.service';
import { TokenService } from '../../../core/services/token.service';
import { SidebarComponent } from '../../../portals/admin/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../portals/admin/components/topbar/topbar.component';

@Component({
  selector: 'app-portal-layout',
  standalone: true,
  imports: [AsyncPipe, RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="portal-layout" [style.--portal-accent]="portalColor">
      <app-admin-sidebar
          class="portal-layout__sidebar"
          [class.is-open]="sidebarOpen"
          [navItems]="resolvedNavItems"
          [portalLabel]="portalLabel"
          [clinicName]="clinicName"
          [currentUser]="currentUser$ | async"
          [isOpen]="sidebarOpen"
          (navClick)="handleSidebarNavClick()"
          (menuToggle)="toggleSidebar()"
          (logout)="logout()"
      ></app-admin-sidebar>

      <div class="portal-layout__main">
        <app-admin-topbar
          [title]="pageTitle"
          [portalLabel]="portalLabel"
          [currentUser]="currentUser$ | async"
          [unreadCount]="(unreadCount$ | async) ?? 0"
          [sidebarOpen]="sidebarOpen"
          (menuToggle)="toggleSidebar()"
          (logout)="logout()"
        ></app-admin-topbar>

        <main class="main-content" [class.main-content--tight-top]="tightTopRoute">
          <router-outlet></router-outlet>
        </main>
      </div>

      <div
        class="sidebar-overlay"
        [class.is-visible]="sidebarOpen"
        (click)="closeSidebar()"
        aria-hidden="true"
      ></div>
    </div>
  `,
  styleUrl: './portal-layout.component.scss'
})
export class PortalLayoutComponent implements OnInit {
  @Input() navItems: NavItem[] = [];
  @Input() portalTitle = 'Dashboard';
  @Input() portalLabel = 'Admin Portal';
  @Input() portalColor = 'var(--ion-color-primary)';

  @HostBinding('style.display') readonly display = 'block';

  private readonly authState = inject(AuthStateService);
  private readonly apiService = inject(ApiService);
  private readonly notificationService = inject(NotificationService);

  readonly currentUser$ = this.authState.currentUser$;
  readonly unreadCount$ = this.notificationService.unreadCount$;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly clinicSettingsService = inject(ClinicSettingsService);
  private readonly tokenService = inject(TokenService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly realtimeInit = inject(RealtimeInitService);

  clinicName = '';
  pageTitle = 'Dashboard';
  resolvedNavItems: NavItem[] = [];
  sidebarOpen = false;
  tightTopRoute = false;
  private sidebarMode = 'desktop';

  constructor() {
    addIcons({
      alertCircleOutline,
      arrowBackOutline,
      cashOutline,
      calendarNumberOutline,
      calendarOutline,
      checkmarkCircleOutline,
      checkmarkOutline,
      closeOutline,
      createOutline,
      documentTextOutline,
      ellipsisVertical,
      eyeOffOutline,
      eyeOutline,
      gridOutline,
      listOutline,
      logOutOutline,
      medicalOutline,
      megaphoneOutline,
      menuOutline,
      notificationsOutline,
      peopleOutline,
      personAddOutline,
      personCircleOutline,
      personRemoveOutline,
      personOutline,
      pricetagOutline,
      refreshOutline,
      searchOutline,
      settingsOutline,
      shieldCheckmarkOutline,
      statsChartOutline,
      timeOutline,
      toggleOutline,
      walkOutline,
      warningOutline
    });
  }

  ngOnInit(): void {
    this.clinicName = this.clinicSettingsService.load().clinicName;
    this.resolvedNavItems = (this.route.snapshot.data['navItems'] as NavItem[]) ?? this.navItems;
    this.portalLabel = (this.route.snapshot.data['portalLabel'] as string | undefined) ?? this.portalLabel;
    this.syncSidebarState(true);
    this.updatePageTitle();
    this.loadNotifications();

    this.router.events
      .pipe(
        filter(
          (event): event is ActivationEnd | NavigationEnd =>
            event instanceof ActivationEnd || event instanceof NavigationEnd
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.updatePageTitle());
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.syncSidebarState();
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  handleSidebarNavClick(): void {
    if (this.sidebarMode === 'mobile') {
      this.sidebarOpen = false;
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
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

  private updatePageTitle(): void {
    const route = this.getDeepestChild(this.route);
    this.pageTitle =
      (route.snapshot.data['title'] as string | undefined) ?? this.portalTitle ?? 'Dashboard';
    const currentUrl = this.router.url.split('?')[0];
    this.tightTopRoute = currentUrl.includes('/doctor/consultation/');
  }

  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
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
}

# ROUTE_FEATURE_INVENTORY

Generated from the uploaded Angular/Ionic frontend source. This is a static code audit; backend behavior, exact runtime data, and server-side authorization are marked [UNCLEAR] where the frontend code does not define them.

## Audit Legend
- [MOCK DATA] — hardcoded, mock service, mock file path, or placeholder data found in source.
- [UNCLEAR] — cannot be determined from frontend code alone.
- [NOT IMPLEMENTED] — route/component exists but implementation appears incomplete, stubbed, or only represented by placeholder behavior.
- [TEAM TO VERIFY] — must be verified by human/backend/API contract owner.

## Global Route Guards and Redirect Rules
|Mechanism|File|Behavior|
|---|---|---|
|authGuard|src/app/core/guards/auth.guard.ts|Reads AuthStateService.isAuthenticated$ once; returns true or UrlTree /auth/login.|
|roleGuard|src/app/core/guards/role.guard.ts|Reads route.data.roles and AuthStateService.userRole$; returns true when role is allowed, else /auth/login.|
|firstLoginGuard|src/app/core/guards/first-login.guard.ts|Requires user; redirects missing user to /auth/login and first-login users to /auth/set-password.|
|APP_INITIALIZER|src/app/app.config.ts|On app start, checks TokenService for access/refresh token; calls GET auth/me; sets AuthStateService user or logs out.|
|authInterceptor|src/app/core/interceptors/auth.interceptor.ts|Adds Bearer token to non-public auth endpoints; on 401 uses POST auth/refresh-token and retries once, else clears session and navigates /auth/login.|

## Route Map Summary
|Role|Route URL|Page/component file|Class|Layout/shell|Access control|
|---|---|---|---|---|---|
|Public/Guest|/public|src/app/portals/public/home/home.page.ts|HomePage|src/app/portals/public/components/public-layout/public-layout.component.ts|None|
|Public/Guest|/public/doctors|src/app/portals/public/doctors/doctors.page.ts|DoctorsPage|src/app/portals/public/components/public-layout/public-layout.component.ts|None|
|Public/Guest|/public/doctors/:id|src/app/portals/public/doctor-profile/doctor-profile.page.ts|DoctorProfilePage|src/app/portals/public/components/public-layout/public-layout.component.ts|None|
|Public/Guest|/public/services|src/app/portals/public/services/services.page.ts|ServicesPage|src/app/portals/public/components/public-layout/public-layout.component.ts|None|
|Public/Guest|/public/announcements|src/app/portals/public/announcements/announcements.page.ts|AnnouncementsPage|src/app/portals/public/components/public-layout/public-layout.component.ts|None|
|Public/Guest|/public/booking|src/app/portals/public/booking/booking.page.ts|BookingPage|src/app/portals/public/components/public-layout/public-layout.component.ts|None|
|Public/Guest|/public/booking-confirmation/:bookingId|src/app/portals/public/booking-confirmation/booking-confirmation.page.ts|BookingConfirmationPage|src/app/portals/public/components/public-layout/public-layout.component.ts|None|
|Public/Guest|/public/privacy-policy|src/app/portals/public/privacy-policy/privacy-policy.page.ts|PrivacyPolicyPage|src/app/portals/public/components/public-layout/public-layout.component.ts|None|
|Auth/Public|/auth/login|src/app/auth/login/login.page.ts|LoginPage|src/app/auth/components/auth-layout/auth-layout.component.ts where used by page|None|
|Auth/Public|/auth/register|src/app/auth/register/register.page.ts|RegisterPage|src/app/auth/components/auth-layout/auth-layout.component.ts where used by page|None|
|Auth/Public|/auth/callback|src/app/auth/callback/auth-callback.page.ts|AuthCallbackPage|src/app/auth/components/auth-layout/auth-layout.component.ts where used by page|None|
|Auth/Public|/auth/forgot-password|src/app/auth/forgot-password/forgot-password.page.ts|ForgotPasswordPage|src/app/auth/components/auth-layout/auth-layout.component.ts where used by page|None|
|Auth/Public|/auth/reset-password|src/app/auth/reset-password/reset-password.page.ts|ResetPasswordPage|src/app/auth/components/auth-layout/auth-layout.component.ts where used by page|None|
|Patient/Auth|/auth/set-password|src/app/auth/set-password/set-password.page.ts|SetPasswordPage|src/app/auth/components/auth-layout/auth-layout.component.ts where used by page|authGuard|
|Patient/Auth|/auth/privacy-consent|src/app/auth/privacy-consent/privacy-consent.page.ts|PrivacyConsentPage|src/app/auth/components/auth-layout/auth-layout.component.ts where used by page|authGuard + roleGuard Patient|
|Admin|/admin/dashboard|src/app/portals/admin/dashboard/dashboard.page.ts|DashboardPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/bookings|src/app/portals/admin/bookings/bookings.page.ts|BookingsPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/bookings/:id|src/app/portals/admin/booking-detail/booking-detail.page.ts|BookingDetailPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/walk-in|src/app/portals/admin/walk-in/walk-in.page.ts|WalkInPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/calendar|src/app/portals/admin/calendar/calendar.page.ts|CalendarPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/doctors|src/app/portals/admin/doctors/doctors.page.ts|DoctorsPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/doctors/new|src/app/portals/admin/doctor-form/doctor-form.page.ts|DoctorFormPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/doctors/:id/edit|src/app/portals/admin/doctor-form/doctor-form.page.ts|DoctorFormPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/services|src/app/portals/admin/services/services.page.ts|ServicesPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/patients|src/app/portals/admin/patients/patients.page.ts|PatientsPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/patients/:id|src/app/portals/admin/patient-detail/patient-detail.page.ts|PatientDetailPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/staff|src/app/portals/admin/staff/staff.page.ts|StaffPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/announcements|src/app/portals/admin/announcements/announcements.page.ts|AnnouncementsPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/settings|src/app/portals/admin/settings/settings.page.ts|SettingsPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/audit-logs|src/app/portals/admin/audit-logs/audit-logs.page.ts|AuditLogsPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/reports|src/app/portals/admin/reports/reports.page.ts|ReportsPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard + firstLoginGuard|
|Staff|/staff/dashboard|src/app/portals/staff/dashboard/staff-dashboard.page.ts|StaffDashboardPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Staff|/staff/bookings|src/app/portals/staff/bookings/staff-bookings.page.ts|StaffBookingsPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Staff|/staff/payments|src/app/portals/staff/payments/staff-payments.page.ts|StaffPaymentsPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Staff|/staff/bookings/:id|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts|StaffBookingDetailPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Staff|/staff/walk-in|src/app/portals/staff/walk-in/staff-walk-in.page.ts|StaffWalkInPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Staff|/staff/patients|src/app/portals/staff/patients/staff-patients.page.ts|StaffPatientsPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Staff|/staff/patients/:id|src/app/portals/staff/patient-detail/staff-patient-detail.page.ts|StaffPatientDetailPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Staff|/staff/doctor-status|src/app/portals/staff/doctor-status/doctor-status.page.ts|DoctorStatusPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Staff|/staff/profile|src/app/portals/staff/profile/staff-profile.page.ts|StaffProfilePage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Doctor|/doctor/dashboard|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts|DoctorDashboardPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Doctor|/doctor/appointments|src/app/portals/doctor/appointments/doctor-appointments.page.ts|DoctorAppointmentsPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Doctor|/doctor/appointments/:id|src/app/portals/doctor/appointment-detail/doctor-appointment-detail.page.ts|DoctorAppointmentDetailPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Doctor|/doctor/patients|src/app/portals/doctor/patients/doctor-patients.page.ts|DoctorPatientsPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Doctor|/doctor/patients/:id|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts|DoctorPatientDetailPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Doctor|/doctor/schedule|src/app/portals/doctor/schedule/doctor-schedule.page.ts|DoctorSchedulePage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Doctor|/doctor/consultation/:bookingId|src/app/portals/doctor/consultation/doctor-consultation.page.ts|DoctorConsultationPage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Doctor|/doctor/my-profile|src/app/portals/doctor/profile/doctor-profile.page.ts|DoctorProfilePage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Doctor|/doctor/profile|src/app/portals/doctor/profile/doctor-profile.page.ts|DoctorProfilePage|src/app/shared/components/portal-layout/portal-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Patient|/patient/dashboard|src/app/portals/patient/dashboard/patient-dashboard.page.ts|PatientDashboardPage|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Patient|/patient/doctors|src/app/portals/patient/doctors/patient-doctors.page.ts|PatientDoctorsPage|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Patient|/patient/bookings|src/app/portals/patient/bookings/patient-bookings.page.ts|PatientBookingsPage|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Patient|/patient/documents|src/app/portals/patient/documents/patient-documents.page.ts|PatientDocumentsPage|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Patient|/patient/lab-results|src/app/portals/patient/lab-results/patient-lab-results.page.ts|PatientLabResultsPage|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Patient|/patient/labs|src/app/portals/patient/labs-redirect/patient-labs-redirect.page.ts|PatientLabsRedirectPage|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Patient|/patient/bookings/:id|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts|PatientBookingDetailPage|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Patient|/patient/medical-records|src/app/portals/patient/medical-records/patient-medical-records.page.ts|PatientMedicalRecordsPage|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Patient|/patient/prescriptions|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts|PatientPrescriptionsPage|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Patient|/patient/vaccinations|src/app/portals/patient/vaccinations/patient-vaccinations.page.ts|PatientVaccinationsPage|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Patient|/patient/profile|src/app/portals/patient/profile/patient-profile.page.ts|PatientProfilePage|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Patient|/patient/reviews/:bookingId|src/app/portals/patient/reviews/patient-reviews.page.ts|PatientReviewsPage|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Patient|/patient/privacy-consent|src/app/portals/patient/privacy-consent/patient-privacy-consent.page.ts|PatientPrivacyConsentPage|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|authGuard + roleGuard (+ top-level firstLoginGuard)|
|Dev/Public|/dev/gallery|src/app/dev/design-system-gallery/design-system-gallery.page.ts|DesignSystemGalleryPage|None|None|

## Navigation Entry Points
### `src/app/portals/admin/admin.routes.ts`
|Label|Route|Icon|Section|
|---|---|---|---|
|Dashboard|/admin/dashboard|grid-outline|Main|
|Bookings|/admin/bookings|calendar-outline||
|Walk-In|/admin/walk-in|walk-outline||
|Calendar|/admin/calendar|calendar-number-outline||
|Patients|/admin/patients|people-outline|Records|
|Doctors|/admin/doctors|medical-outline||
|Services|/admin/services|list-outline||
|Staff Accounts|/admin/staff|person-add-outline|Management|
|Announcements|/admin/announcements|megaphone-outline||
|Reports|/admin/reports|stats-chart-outline|System|
|Audit Logs|/admin/audit-logs|shield-checkmark-outline||
|Settings|/admin/settings|settings-outline||

### `src/app/portals/staff/staff.routes.ts`
|Label|Route|Icon|Section|
|---|---|---|---|
|Dashboard|/staff/dashboard|grid-outline|Main|
|Today Bookings|/staff/bookings|calendar-outline||
|Payments|/staff/payments|cash-outline||
|Walk-In|/staff/walk-in|walk-outline||
|Patients|/staff/patients|people-outline|Records|
|Doctor Status|/staff/doctor-status|medical-outline|Tools|
|My Profile|/staff/profile|person-outline|Account|

### `src/app/portals/doctor/doctor.routes.ts`
|Label|Route|Icon|Section|
|---|---|---|---|
|Dashboard|/doctor/dashboard|grid-outline|Main|
|Appointments|/doctor/appointments|calendar-outline||
|Patients|/doctor/patients|people-outline|Records|
|Schedule|/doctor/schedule|time-outline|Tools|
|My Profile|/doctor/profile|person-outline|Account|

### `src/app/portals/patient/patient.routes.ts`
|Label|Route|Icon|Section|
|---|---|---|---|
|Dashboard|/patient/dashboard|grid-outline||
|Doctors|/patient/doctors|medical-outline||
|Bookings|/patient/bookings|calendar-outline||
|My Documents|/patient/documents|document-text-outline|Records|
|My Lab Results|/patient/lab-results|medkit-outline||
|Medical Records|/patient/medical-records|medical-outline||
|Prescriptions|/patient/prescriptions|document-text-outline||
|Vaccinations|/patient/vaccinations|shield-checkmark-outline||
|Profile|/patient/profile|person-outline||

## Public/Guest Routes

### `/public`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public|
|Page/component file|src/app/portals/public/home/home.page.ts|
|Component class|HomePage|
|Layout/shell|src/app/portals/public/components/public-layout/public-layout.component.ts|
|Access control|PublicLayoutComponent child route, no authGuard/roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|Public nav/header links, routerLink, redirect from / to /public, or deep link|

#### 2. Data Dependencies
- Injected dependencies: ApiService, Router
- API calls detected in component: get('doctors')) line 81, get('services')) line 82, get('announcements')) line 83, get('settings')) line 84

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 16: `<a routerLink="/public/doctors" class="btn-outline">`; visible text/context: `View All Doctors → What We Offer Our Services <div class="services-grid" *n`
- Event/raw template lines detected:
  - Template line 16: `<a routerLink="/public/doctors" class="btn-outline">View All Doctors →</a>`
- Programmatic navigation detected:
  - TS line 110: `router.navigate(['/public/services'], { queryParams: { category } })`
- Child components/selectors rendered by template: `app-announcement-card`, `app-doctor-card`, `app-hero-section`, `app-operating-hours-bar`, `app-service-category-card`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'doctors')|src/app/portals/public/home/home.page.ts:81|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'services')|src/app/portals/public/home/home.page.ts:82|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'announcements')|src/app/portals/public/home/home.page.ts:83|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'settings')|src/app/portals/public/home/home.page.ts:84|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- [UNCLEAR] No obvious loading/empty/error/success keywords detected in component/template.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/public/doctors`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public/doctors|
|Page/component file|src/app/portals/public/doctors/doctors.page.ts|
|Component class|DoctorsPage|
|Layout/shell|src/app/portals/public/components/public-layout/public-layout.component.ts|
|Access control|PublicLayoutComponent child route, no authGuard/roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|Public nav/header links, routerLink, redirect from / to /public, or deep link|

#### 2. Data Dependencies
- Injected dependencies: ApiService, DestroyRef, ToastController
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 10: `<button type="button" *ngFor="let spec of specializations" class="filter-pill" [class.filter-pill--active]="spec === selectedSpecialization" (click)="selectedSpecialization = spec" >`; visible text/context: `{{ spec }}`
- Event/raw template lines detected:
  - Template line 10: `<button`
  - Template line 15: `(click)="selectedSpecialization = spec"`
- Child components/selectors rendered by template: `app-doctor-card`, `app-empty-state`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/public/doctors/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public/doctors/:id|
|Page/component file|src/app/portals/public/doctor-profile/doctor-profile.page.ts|
|Component class|DoctorProfilePage|
|Layout/shell|src/app/portals/public/components/public-layout/public-layout.component.ts|
|Access control|PublicLayoutComponent child route, no authGuard/roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|Public nav/header links, routerLink, redirect from / to /public, or deep link|

#### 2. Data Dependencies
- Route parameter required: id
- Injected dependencies: ActivatedRoute, ApiService, DoctorStateService
- API calls detected in component: get('doctor-day-status/' + id).pipe() line 172, get('doctors/' + id),) line 179, get('reviews?doctorId=' + id),) line 180, get('doctors/' + id + '/schedule')) line 181

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 46: `<a class="profile-book-btn" [routerLink]="['/public/booking']" [queryParams]="{ doctorId: d.id }" >`; visible text/context: `Book Appointment with {{ d.fullName }} About {{ d.fullName }} <p class`
- Event/raw template lines detected:
  - Template line 48: `[routerLink]="['/public/booking']"`
- Child components/selectors rendered by template: `app-avatar`, `app-banner`, `app-empty-state`, `app-review-card`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'doctor-day-status/' + id).pipe(|src/app/portals/public/doctor-profile/doctor-profile.page.ts:172|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'doctors/' + id),|src/app/portals/public/doctor-profile/doctor-profile.page.ts:179|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'reviews?doctorId=' + id),|src/app/portals/public/doctor-profile/doctor-profile.page.ts:180|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'doctors/' + id + '/schedule')|src/app/portals/public/doctor-profile/doctor-profile.page.ts:181|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/public/services`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public/services|
|Page/component file|src/app/portals/public/services/services.page.ts|
|Component class|ServicesPage|
|Layout/shell|src/app/portals/public/components/public-layout/public-layout.component.ts|
|Access control|PublicLayoutComponent child route, no authGuard/roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|Public nav/header links, routerLink, redirect from / to /public, or deep link|

#### 2. Data Dependencies
- Injected dependencies: ActivatedRoute, ApiService, DestroyRef, ToastController
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 10: `<button type="button" *ngFor="let cat of categories" class="filter-pill" [class.filter-pill--active]="cat === selectedCategory" (click)="selectedCategory = cat" >`; visible text/context: `{{ cat === 'All' ? 'All' : cat }} <div class="page-empty" *ngIf="!filteredSe`
- Event/raw template lines detected:
  - Template line 10: `<button`
  - Template line 15: `(click)="selectedCategory = cat"`
- Child components/selectors rendered by template: `app-empty-state`, `app-service-category-card`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/public/announcements`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public/announcements|
|Page/component file|src/app/portals/public/announcements/announcements.page.ts|
|Component class|AnnouncementsPage|
|Layout/shell|src/app/portals/public/components/public-layout/public-layout.component.ts|
|Access control|PublicLayoutComponent child route, no authGuard/roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|Public nav/header links, routerLink, redirect from / to /public, or deep link|

#### 2. Data Dependencies
- Injected dependencies: ApiService
- API calls detected in component: get('announcements').subscribe((list) => {) line 44

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- [UNCLEAR] No button/link/routerLink/click handler detected in this page template.
- Child components/selectors rendered by template: `app-announcement-card`, `app-skeleton`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'announcements').subscribe((list) => {|src/app/portals/public/announcements/announcements.page.ts:44|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Loading.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/public/booking`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public/booking|
|Page/component file|src/app/portals/public/booking/booking.page.ts|
|Component class|BookingPage|
|Layout/shell|src/app/portals/public/components/public-layout/public-layout.component.ts|
|Access control|PublicLayoutComponent child route, no authGuard/roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|Public nav/header links, routerLink, redirect from / to /public, or deep link|

#### 2. Data Dependencies
- Injected dependencies: ActivatedRoute, ApiService, BookingWizardService, DestroyRef
- API calls detected in component: get('services').pipe() line 45

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- [UNCLEAR] No button/link/routerLink/click handler detected in this page template.
- Child components/selectors rendered by template: `app-booking-wizard`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'services').pipe(|src/app/portals/public/booking/booking.page.ts:45|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Error.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/public/booking-confirmation/:bookingId`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public/booking-confirmation/:bookingId|
|Page/component file|src/app/portals/public/booking-confirmation/booking-confirmation.page.ts|
|Component class|BookingConfirmationPage|
|Layout/shell|src/app/portals/public/components/public-layout/public-layout.component.ts|
|Access control|PublicLayoutComponent child route, no authGuard/roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|Public nav/header links, routerLink, redirect from / to /public, or deep link|

#### 2. Data Dependencies
- Route parameter required: bookingId
- Injected dependencies: ActivatedRoute, ApiService, AuthStateService, BookingWizardService
- API calls detected in component: get('doctors').pipe() line 105, get('services').pipe() line 110

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 56: `<button class="btn-primary" routerLink="/patient/bookings" type="button">`; visible text/context: `View My Appointments Create an account to track your bookings. <button class="btn-primary" router`
  - Line 64: `<button class="btn-primary" routerLink="/auth/register" type="button">`; visible text/context: `Create Account Back to Home`
  - Line 68: `<button class="btn-outline" routerLink="/public" type="button">`; visible text/context: `Back to Home`
- Event/raw template lines detected:
  - Template line 56: `<button class="btn-primary" routerLink="/patient/bookings" type="button">`
  - Template line 64: `<button class="btn-primary" routerLink="/auth/register" type="button">`
  - Template line 68: `<button class="btn-outline" routerLink="/public" type="button">Back to Home</button>`
- Child components/selectors rendered by template: `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'doctors').pipe(|src/app/portals/public/booking-confirmation/booking-confirmation.page.ts:105|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'services').pipe(|src/app/portals/public/booking-confirmation/booking-confirmation.page.ts:110|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- [UNCLEAR] No obvious loading/empty/error/success keywords detected in component/template.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/public/privacy-policy`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public/privacy-policy|
|Page/component file|src/app/portals/public/privacy-policy/privacy-policy.page.ts|
|Component class|PrivacyPolicyPage|
|Layout/shell|src/app/portals/public/components/public-layout/public-layout.component.ts|
|Access control|PublicLayoutComponent child route, no authGuard/roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|Public nav/header links, routerLink, redirect from / to /public, or deep link|

#### 2. Data Dependencies
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 5: `<a routerLink="/public" class="back-link">`; visible text/context: `&larr; Back to Home Privacy Policy How we collect, use, and protect your information. Last updated: `
  - Line 25: `<a href="mailto:support@yourclinicdomain.com">`; visible text/context: `support&#64;yourclinicdomain.com . Note: This privacy policy is a draft template. Review by a qualif`
  - Line 31: `<a routerLink="/public" class="back-link">`; visible text/context: `&larr; Return to Home`
- Event/raw template lines detected:
  - Template line 5: `<a routerLink="/public" class="back-link">&larr; Back to Home</a>`
  - Template line 25: `<a href="mailto:support@yourclinicdomain.com">support&#64;yourclinicdomain.com</a>.`
  - Template line 31: `<a routerLink="/public" class="back-link">&larr; Return to Home</a>`

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- [UNCLEAR] No obvious loading/empty/error/success keywords detected in component/template.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

## Auth/Public Routes

### `/auth/login`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/auth/login|
|Page/component file|src/app/auth/login/login.page.ts|
|Component class|LoginPage|
|Layout/shell|src/app/auth/components/auth-layout/auth-layout.component.ts where used by page|
|Access control|None|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|Auth links, redirects, OAuth callback, deep link|

#### 2. Data Dependencies
- Injected dependencies: ApiService, AuthService, AuthStateService, FormBuilder, ToastController
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template file: `src/app/auth/login/login.page.html`
- Clickable/navigation elements detected:
  - Line 34: `<ion-button slot="end" fill="clear" type="button" aria-label="Toggle password visibility" (click)="showPassword = !showPassword" >`; visible text/context: `<ion-`
  - Line 53: `<a routerLink="/auth/forgot-password" class="link-forgot">`; visible text/context: `Forgot password? <ion-spinner *ngIf="(isLoading$ | async) === true" name="crescent" style="width: 16`
  - Line 73: `<button type="button" class="btn-social" (click)="onGoogleLogin()" [disabled]="(isLoading$ | async) === true" >`; visible text/context: `Continue with Google f`
  - Line 82: `<button type="button" class="btn-social btn-social--facebook" (click)="onFacebookLogin()" [disabled]="(isLoading$ | async) === true" >`; visible text/context: `f Continue with Facebook Don't have an account? Create one <a routerLink="/pu`
  - Line 95: `<a routerLink="/auth/register">`; visible text/context: `Create one Privacy Policy v{{ appVersion }} <button type="button" class="dev-credentials__toggle" (c`
  - Line 99: `<a routerLink="/public/privacy-policy">`; visible text/context: `Privacy Policy v{{ appVersion }} Quick Login (Dev Only) {{ devExpanded ? '&#9650;' : '&#9660;' }} </`
  - Line 105: `<button type="button" class="dev-credentials__toggle" (click)="devExpanded = !devExpanded">`; visible text/context: `Quick Login (Dev Only) {{ devExpanded ? '&#9650;' : '&#9660;' }} patient`
  - Line 109: `<button type="button" class="dev-chip" (click)="fillCreds('patient@gavino.clinic', 'Patient@123456')">`; visible text/context: `patient Admin Staff`
  - Line 112: `<button type="button" class="dev-chip" (click)="fillCreds('admin@gavino.clinic', 'Admin@123456')">`; visible text/context: `Admin Staff Do`
  - Line 115: `<button type="button" class="dev-chip" (click)="fillCreds('staff@gavino.clinic', 'Staff@123456')">`; visible text/context: `Staff Doctor`
  - Line 118: `<button type="button" class="dev-chip" (click)="fillCreds('dr.santos@gavino.clinic', 'Doctor@123456')">`; visible text/context: `Doctor First-Login Doctor`
  - Line 121: `<button type="button" class="dev-chip" (click)="fillCreds('dr.reyes@gavino.clinic', 'Doctor@123456')">`; visible text/context: `First-Login Doctor`
- Form/input controls detected:
  - Line 16: `email` from `<ion-input type="email" formControlName="email" autocomplete="email">`
  - Line 31: `password` from `<ion-input [type]="showPassword ? 'text' : 'password'" formControlName="password" autocomplete="current-password" >`
- Reactive forms declared in component:
  - `loginForm` line 69; controls: `email, password`
- Validators detected in TS: `Validators.required, Validators.email`. Exact field-to-validator mapping should be verified against component source. [TEAM TO VERIFY]
- Event/raw template lines detected:
  - Template line 13: `<form [formGroup]="loginForm" (ngSubmit)="onLogin()" novalidate>`
  - Template line 16: `<ion-input type="email" formControlName="email" autocomplete="email"></ion-input>`
  - Template line 31: `formControlName="password"`
  - Template line 34: `<ion-button`
  - Template line 39: `(click)="showPassword = !showPassword"`
  - Template line 42: `</ion-button>`
  - Template line 53: `<a routerLink="/auth/forgot-password" class="link-forgot">Forgot password?</a>`
  - Template line 56: `<button class="btn-primary login-submit" type="submit" [disabled]="(isLoading$ | async) === true">`
  - Template line 73: `<button`
  - Template line 76: `(click)="onGoogleLogin()"`
  - Template line 82: `<button`
  - Template line 85: `(click)="onFacebookLogin()"`
  - Template line 95: `<a routerLink="/auth/register">Create one</a>`
  - Template line 99: `<a routerLink="/public/privacy-policy">Privacy Policy</a>`
  - Template line 105: `<button type="button" class="dev-credentials__toggle" (click)="devExpanded = !devExpanded">`
  - Template line 109: `<button type="button" class="dev-chip" (click)="fillCreds('patient@gavino.clinic', 'Patient@123456')">`
  - Template line 112: `<button type="button" class="dev-chip" (click)="fillCreds('admin@gavino.clinic', 'Admin@123456')">`
  - Template line 115: `<button type="button" class="dev-chip" (click)="fillCreds('staff@gavino.clinic', 'Staff@123456')">`
  - Template line 118: `<button type="button" class="dev-chip" (click)="fillCreds('dr.santos@gavino.clinic', 'Doctor@123456')">`
  - Template line 121: `<button type="button" class="dev-chip" (click)="fillCreds('dr.reyes@gavino.clinic', 'Doctor@123456')">`
- Child components/selectors rendered by template: `app-auth-layout`, `app-banner`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Error, Loading, Spinner, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/auth/register`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/auth/register|
|Page/component file|src/app/auth/register/register.page.ts|
|Component class|RegisterPage|
|Layout/shell|src/app/auth/components/auth-layout/auth-layout.component.ts where used by page|
|Access control|None|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|Auth links, redirects, OAuth callback, deep link|

#### 2. Data Dependencies
- Injected dependencies: ApiService, AuthService, AuthStateService, FormBuilder
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template file: `src/app/auth/register/register.page.html`
- Clickable/navigation elements detected:
  - Line 91: `<a href="#" (click)="$event.preventDefault()">`; visible text/context: `Privacy Policy and Terms of Service <div class="form-error-message" *ngIf="registerForm.get('consent`
  - Line 93: `<a href="#" (click)="$event.preventDefault()">`; visible text/context: `Terms of Service You must accept the privacy policy to continue <bu`
  - Line 120: `<button type="button" class="btn-social" (click)="onGoogleLogin()" [disabled]="(isLoading$ | async) === true" >`; visible text/context: `Continue with Google f`
  - Line 129: `<button type="button" class="btn-social btn-social--facebook" (click)="onFacebookLogin()" [disabled]="(isLoading$ | async) === true" >`; visible text/context: `f Continue with Facebook Already have an account? Sign in <a routerLink="/public`
  - Line 142: `<a routerLink="/auth/login">`; visible text/context: `Sign in Privacy Policy`
  - Line 146: `<a routerLink="/public/privacy-policy">`; visible text/context: `Privacy Policy`
- Form/input controls detected:
  - Line 16: `firstName` from `<ion-input formControlName="firstName" type="text" autocomplete="given-name">`
  - Line 27: `middleName` from `<ion-input formControlName="middleName" type="text" autocomplete="additional-name">`
  - Line 32: `lastName` from `<ion-input formControlName="lastName" type="text" autocomplete="family-name">`
  - Line 43: `email` from `<ion-input type="email" formControlName="email" autocomplete="email">`
  - Line 55: `password` from `<ion-input type="password" formControlName="password" autocomplete="new-password">`
  - Line 78: `confirmPassword` from `<ion-input type="password" formControlName="confirmPassword" autocomplete="new-password">`
  - Line 88: `consentAccepted` from `<ion-checkbox slot="start" formControlName="consentAccepted" color="primary">`
- Reactive forms declared in component:
  - `registerForm` line 55; controls: `firstName, middleName, lastName, email, password, confirmPassword, consentAccepted`
- Validators detected in TS: `Validators.required, Validators.email, Validators.maxLength, Validators.max`. Exact field-to-validator mapping should be verified against component source. [TEAM TO VERIFY]
- Event/raw template lines detected:
  - Template line 13: `<form [formGroup]="registerForm" (ngSubmit)="onSubmit()" novalidate>`
  - Template line 16: `<ion-input formControlName="firstName" type="text" autocomplete="given-name"></ion-input>`
  - Template line 27: `<ion-input formControlName="middleName" type="text" autocomplete="additional-name"></ion-input>`
  - Template line 32: `<ion-input formControlName="lastName" type="text" autocomplete="family-name"></ion-input>`
  - Template line 43: `<ion-input type="email" formControlName="email" autocomplete="email"></ion-input>`
  - Template line 55: `<ion-input type="password" formControlName="password" autocomplete="new-password"></ion-input>`
  - Template line 78: `<ion-input type="password" formControlName="confirmPassword" autocomplete="new-password"></ion-input>`
  - Template line 88: `<ion-checkbox slot="start" formControlName="consentAccepted" color="primary"></ion-checkbox>`
  - Template line 91: `<a href="#" (click)="$event.preventDefault()">Privacy Policy</a>`
  - Template line 93: `<a href="#" (click)="$event.preventDefault()">Terms of Service</a>`
  - Template line 103: `<button class="btn-primary login-submit" type="submit" [disabled]="(isLoading$ | async) === true">`
  - Template line 120: `<button`
  - Template line 123: `(click)="onGoogleLogin()"`
  - Template line 129: `<button`
  - Template line 132: `(click)="onFacebookLogin()"`
  - Template line 142: `<a routerLink="/auth/login">Sign in</a>`
  - Template line 146: `<a routerLink="/public/privacy-policy">Privacy Policy</a>`
- Child components/selectors rendered by template: `app-auth-layout`, `app-banner`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Error, Loading, Spinner.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/auth/callback`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/auth/callback|
|Page/component file|src/app/auth/callback/auth-callback.page.ts|
|Component class|AuthCallbackPage|
|Layout/shell|src/app/auth/components/auth-layout/auth-layout.component.ts where used by page|
|Access control|None|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|Auth links, redirects, OAuth callback, deep link|

#### 2. Data Dependencies
- Injected dependencies: ApiService, AuthService, AuthStateService, Router, TokenService
- API calls detected in component: get('auth/me'))) line 86

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- [UNCLEAR] No button/link/routerLink/click handler detected in this page template.
- Programmatic navigation detected:
  - TS line 43: `router.navigate(['/auth/login'])`
  - TS line 69: `router.navigate(['/auth/login'])`
  - TS line 74: `router.navigate(['/auth/login'])`

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'auth/me'))|src/app/auth/callback/auth-callback.page.ts:86|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Error, Loading, Spinner.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/auth/forgot-password`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/auth/forgot-password|
|Page/component file|src/app/auth/forgot-password/forgot-password.page.ts|
|Component class|ForgotPasswordPage|
|Layout/shell|src/app/auth/components/auth-layout/auth-layout.component.ts where used by page|
|Access control|None|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|Auth links, redirects, OAuth callback, deep link|

#### 2. Data Dependencies
- Injected dependencies: FormBuilder
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template file: `src/app/auth/forgot-password/forgot-password.page.html`
- Clickable/navigation elements detected:
  - Line 15: `<a routerLink="/auth/login">`; visible text/context: `Back to login Check your email We have sent a passwor`
  - Line 24: `<a routerLink="/auth/login" class="btn-primary wide link-btn">`; visible text/context: `Back to login`
- Form/input controls detected:
  - Line 8: `email` from `<ion-input type="email" formControlName="email" autocomplete="email">`
- Reactive forms declared in component:
  - `form` line 34; controls: `email`
- Validators detected in TS: `Validators.required, Validators.email`. Exact field-to-validator mapping should be verified against component source. [TEAM TO VERIFY]
- Event/raw template lines detected:
  - Template line 5: `<form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>`
  - Template line 8: `<ion-input type="email" formControlName="email" autocomplete="email"></ion-input>`
  - Template line 13: `<button class="btn-primary wide" type="submit" [disabled]="submitting">Send reset link</button>`
  - Template line 15: `<p class="hint"><a routerLink="/auth/login">Back to login</a></p>`
  - Template line 24: `<a routerLink="/auth/login" class="btn-primary wide link-btn">Back to login</a>`
- Child components/selectors rendered by template: `app-auth-layout`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Error, Success.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/auth/reset-password`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/auth/reset-password|
|Page/component file|src/app/auth/reset-password/reset-password.page.ts|
|Component class|ResetPasswordPage|
|Layout/shell|src/app/auth/components/auth-layout/auth-layout.component.ts where used by page|
|Access control|None|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|Auth links, redirects, OAuth callback, deep link|

#### 2. Data Dependencies
- Injected dependencies: ActivatedRoute, FormBuilder, Router, ToastController
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template file: `src/app/auth/reset-password/reset-password.page.html`
- Clickable/navigation elements detected:
  - Line 25: `<a routerLink="/auth/login">`; visible text/context: `Back to login`
- Form/input controls detected:
  - Line 8: `newPassword` from `<ion-input type="password" formControlName="newPassword" autocomplete="new-password">`
  - Line 18: `confirmPassword` from `<ion-input type="password" formControlName="confirmPassword" autocomplete="new-password">`
- Reactive forms declared in component:
  - `form` line 32; controls: `newPassword, confirmPassword`
- Validators detected in TS: `Validators.required`. Exact field-to-validator mapping should be verified against component source. [TEAM TO VERIFY]
- Event/raw template lines detected:
  - Template line 5: `<form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>`
  - Template line 8: `<ion-input type="password" formControlName="newPassword" autocomplete="new-password"></ion-input>`
  - Template line 18: `<ion-input type="password" formControlName="confirmPassword" autocomplete="new-password"></ion-input>`
  - Template line 23: `<button class="btn-primary wide" type="submit" [disabled]="saving">Save password</button>`
  - Template line 25: `<p class="hint"><a routerLink="/auth/login">Back to login</a></p>`
- Programmatic navigation detected:
  - TS line 58: `router.navigate(['/auth/login'])`
- Child components/selectors rendered by template: `app-auth-layout`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Error, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

## Patient/Auth Routes

### `/auth/set-password`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/auth/set-password|
|Page/component file|src/app/auth/set-password/set-password.page.ts|
|Component class|SetPasswordPage|
|Layout/shell|src/app/auth/components/auth-layout/auth-layout.component.ts where used by page|
|Access control|authGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|Auth links, redirects, OAuth callback, deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, AuthService, AuthStateService, ClinicSettingsService, FormBuilder, ToastController, TokenService
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template file: `src/app/auth/set-password/set-password.page.html`
- [UNCLEAR] No button/link/routerLink/click handler detected in this page template.
- Form/input controls detected:
  - Line 9: `newPassword` from `<ion-input type="password" formControlName="newPassword" autocomplete="new-password">`
  - Line 19: `confirmPassword` from `<ion-input type="password" formControlName="confirmPassword" autocomplete="new-password">`
- Reactive forms declared in component:
  - `form` line 40; controls: `newPassword, confirmPassword`
- Validators detected in TS: `Validators.required`. Exact field-to-validator mapping should be verified against component source. [TEAM TO VERIFY]
- Event/raw template lines detected:
  - Template line 6: `<form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>`
  - Template line 9: `<ion-input type="password" formControlName="newPassword" autocomplete="new-password"></ion-input>`
  - Template line 19: `<ion-input type="password" formControlName="confirmPassword" autocomplete="new-password"></ion-input>`
  - Template line 24: `<button class="btn-primary wide" type="submit" [disabled]="saving">Save and continue</button>`
- Child components/selectors rendered by template: `app-auth-layout`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Error, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/auth/privacy-consent`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/auth/privacy-consent|
|Page/component file|src/app/auth/privacy-consent/privacy-consent.page.ts|
|Component class|PrivacyConsentPage|
|Layout/shell|src/app/auth/components/auth-layout/auth-layout.component.ts where used by page|
|Access control|authGuard + roleGuard Patient|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|Auth links, redirects, OAuth callback, deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: AuthStateService, ClinicSettingsService, Router
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template file: `src/app/auth/privacy-consent/privacy-consent.page.html`
- Clickable/navigation elements detected:
  - Line 18: `<button class="btn-primary accept-btn" type="button" [disabled]="!acceptEnabled" (click)="onAccept()" >`; visible text/context: `Accept and continue`
- Event/raw template lines detected:
  - Template line 18: `<button`
  - Template line 22: `(click)="onAccept()"`
- Programmatic navigation detected:
  - TS line 56: `router.navigate(['/auth/login'])`
  - TS line 65: `router.navigate(['/patient'])`
- Child components/selectors rendered by template: `app-auth-layout`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- [UNCLEAR] No obvious loading/empty/error/success keywords detected in component/template.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

## Admin Routes

### `/admin/dashboard`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/dashboard|
|Page/component file|src/app/portals/admin/dashboard/dashboard.page.ts|
|Component class|DashboardPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, ClinicDashboardRealtimeService, Router
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- [UNCLEAR] No button/link/routerLink/click handler detected in this page template.
- Programmatic navigation detected:
  - TS line 221: `router.navigate(['/admin/bookings', id])`
- Child components/selectors rendered by template: `app-stat-card`, `app-today-appointments-table`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Error, Loading.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/admin/bookings`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/bookings|
|Page/component file|src/app/portals/admin/bookings/bookings.page.ts|
|Component class|BookingsPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, ClinicDashboardRealtimeService, DestroyRef, DoctorStateService, PatientStateService, Router
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 8: `<button type="button" class="btn-primary" routerLink="/admin/walk-in">`; visible text/context: `New Walk-In All Doctors {{ doctor.fullName }}`
  - Line 22: `<button type="button" class="btn-ghost" (click)="clearFilters()">`; visible text/context: `Clear Filters 0">`
  - Line 41: `<tr *ngFor="let booking of filteredBookings" tabindex="0" role="button" [attr.aria-label]="'Open booking for ' + displayPatientName(booking)" (click)="openBooking(booking.id)" (keydown.enter)="openBoo`; visible text/context: `<input type="checkbox" [checked]="selectedIds.has(booking.id)" (change)="toggleSelect(booking.id, $e`
  - Line 74: `<button type="button" class="btn-ghost btn-sm" (click)="openBooking(booking.id)">`; visible text/context: `View 1"> Showing page {{ currentPag`
  - Line 88: `<button type="button" class="btn-ghost btn-sm" [disabled]="currentPage <= 1" (click)="goToPage(currentPage - 1)">`; visible text/context: `Previous {{ p }} <bu`
  - Line 90: `<button *ngFor="let p of paginationPages" type="button" class="btn-sm" [class.btn-primary]="p === currentPage" [class.btn-ghost]="p !== currentPage" (click)="goToPage(p)">`; visible text/context: `{{ p }} = totalPages" (click)="goToPage(currentPage + 1)">Next <article *ngFor="let book`
  - Line 97: `<article *ngFor="let booking of filteredBookings" class="mobile-card" tabindex="0" role="button" [attr.aria-label]="'Open booking for ' + displayPatientName(booking)" (click)="openBooking(booking.id)"`; visible text/context: `{{ displayPatientName(booking) }} {{ booking.patient?.patientCode || 'Queue #' + (booking.queueNumbe`
  - Line 130: `<div class="mobile-card__actions" (click)="$event.stopPropagation()">`; visible text/context: `View Details 1"> Page`
  - Line 131: `<button type="button" class="btn-ghost btn-sm" (click)="openBooking(booking.id)">`; visible text/context: `View Details 1"> Page {{ currentPage }} of {{ totalPages }}`
  - Line 139: `<button type="button" class="btn-ghost btn-sm" [disabled]="currentPage <= 1" (click)="goToPage(currentPage - 1)">`; visible text/context: `Prev = totalPages" (click)="goToPage(currentPage + 1)">Next </app-s`
- Form/input controls detected:
  - Line 12: `doctorFilter` from `<select class="filter-input" [(ngModel)]="doctorFilter">`
  - Line 16: `statusFilter` from `<select class="filter-input" [(ngModel)]="statusFilter">`
  - Line 20: `dateFilter` from `<input class="filter-input" type="date" [(ngModel)]="dateFilter" />`
  - Line 21: `searchQuery` from `<input class="filter-input" type="search" placeholder="Search patient or booking ID" [(ngModel)]="searchQuery" />`
- Event/raw template lines detected:
  - Template line 8: `<button type="button" class="btn-primary" routerLink="/admin/walk-in">New Walk-In</button>`
  - Template line 12: `<select class="filter-input" [(ngModel)]="doctorFilter">`
  - Template line 16: `<select class="filter-input" [(ngModel)]="statusFilter">`
  - Template line 20: `<input class="filter-input" type="date" [(ngModel)]="dateFilter" />`
  - Template line 21: `<input class="filter-input" type="search" placeholder="Search patient or booking ID" [(ngModel)]="searchQuery" />`
  - Template line 22: `<button type="button" class="btn-ghost" (click)="clearFilters()">Clear Filters</button>`
  - Template line 31: `<th class="col-check"><input type="checkbox" [checked]="selectAll" (change)="toggleSelectAll($event)" /></th>`
  - Template line 46: `(click)="openBooking(booking.id)"`
  - Template line 49: `<td class="col-check" (click)="$event.stopPropagation()">`
  - Template line 53: `(change)="toggleSelect(booking.id, $event)"`
  - Template line 73: `<td class="col-actions" (click)="$event.stopPropagation()">`
  - Template line 74: `<button type="button" class="btn-ghost btn-sm" (click)="openBooking(booking.id)">View</button>`
  - Template line 88: `<button type="button" class="btn-ghost btn-sm" [disabled]="currentPage <= 1" (click)="goToPage(currentPage - 1)">Previous</button>`
  - Template line 90: `<button *ngFor="let p of paginationPages" type="button" class="btn-sm" [class.btn-primary]="p === currentPage" [class.btn-ghost]="p !== currentPage" (click)="goToPage(p)">{{ p }}</button>`
  - Template line 92: `<button type="button" class="btn-ghost btn-sm" [disabled]="currentPage >= totalPages" (click)="goToPage(currentPage + 1)">Next</button>`
  - Template line 103: `(click)="openBooking(booking.id)"`
  - Template line 130: `<div class="mobile-card__actions" (click)="$event.stopPropagation()">`
  - Template line 131: `<button type="button" class="btn-ghost btn-sm" (click)="openBooking(booking.id)">View Details</button>`
  - Template line 139: `<button type="button" class="btn-ghost btn-sm" [disabled]="currentPage <= 1" (click)="goToPage(currentPage - 1)">Prev</button>`
  - Template line 140: `<button type="button" class="btn-ghost btn-sm" [disabled]="currentPage >= totalPages" (click)="goToPage(currentPage + 1)">Next</button>`
- Programmatic navigation detected:
  - TS line 358: `router.navigate(['/admin/bookings', id])`
- Child components/selectors rendered by template: `app-empty-state`, `app-skeleton`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/admin/bookings/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/bookings/:id|
|Page/component file|src/app/portals/admin/booking-detail/booking-detail.page.ts|
|Component class|BookingDetailPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Route parameter required: id
- Injected dependencies: ActivatedRoute, ApiService, AuthStateService, ClinicSettingsService, Router, ToastController
- API calls detected in component: get('bookings/' + id))) line 266, get('patients/' + patientId))) line 300, patch('bookings/' + bookingId + '/confirm', {}))) line 397, patch('bookings/' + bookingId + '/cancel', { reason: reason || 'Rejected by admin' }))) line 401, patch('bookings/' + bookingId + '/confirm', {}))) line 405, patch('bookings/' + bookingId + '/complete', {}))) line 409, patch('bookings/' + bookingId + '/no-show', {}))) line 413, patch('bookings/' + bookingId + '/cancel', { reason: reason || 'Cancelled by admin' }))) line 417; ...

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 10: `<button type="button" class="btn-ghost" (click)="goBack()">`; visible text/context: `Back to Bookings Booking Details {{ booking.id }} <div clas`
  - Line 88: `<button class="btn-primary" type="button" (click)="openConfirm('confirm')">`; visible text/context: `Confirm Booking Reject Booking <button class="btn-primary" type="button" (c`
  - Line 89: `<button class="btn-danger" type="button" (click)="openConfirm('reject', true)">`; visible text/context: `Reject Booking Confirm Payment <button class="btn-danger" type="button"`
  - Line 93: `<button class="btn-primary" type="button" (click)="openConfirm('confirm-payment')">`; visible text/context: `Confirm Payment Reject Proof <button class="btn-primary" type="button" (click)="`
  - Line 94: `<button class="btn-danger" type="button" (click)="openConfirm('reject', true)">`; visible text/context: `Reject Proof Mark Complete <button class="btn-ghost" type="button" (click)="op`
  - Line 98: `<button class="btn-primary" type="button" (click)="openConfirm('mark-complete')">`; visible text/context: `Mark Complete Mark No Show Reschedule <button class="btn-danger" type="button" (cl`
  - Line 99: `<button class="btn-ghost" type="button" (click)="openConfirm('mark-no-show')">`; visible text/context: `Mark No Show Reschedule Cancel Booking <div *ngSwitchCase="'C`
  - Line 100: `<button class="btn-outline" type="button" (click)="reschedule()">`; visible text/context: `Reschedule Cancel Booking <button class="btn-primary" type="button" (click)="ope`
  - Line 101: `<button class="btn-danger" type="button" (click)="openConfirm('cancel', true)">`; visible text/context: `Cancel Booking Print Receipt <button class="btn-outline" type="button" disabled (click`
  - Line 105: `<button class="btn-primary" type="button" (click)="openReceipt(booking)">`; visible text/context: `Print Receipt Download Visit Summary N`
  - Line 106: `<button class="btn-outline" type="button" disabled (click)="soon('Visit Summary')">`; visible text/context: `Download Visit Summary No actions available <div class="action-stack paymen`
  - Line 115: `<button *ngIf="canWaive" class="btn-ghost" type="button" (click)="waiveModalOpen = true">`; visible text/context: `Waive Payment Refund Payment`
  - Line 118: `<button *ngIf="canRefund" class="btn-ghost" type="button" (click)="refundModalOpen = true">`; visible text/context: `Refund Payment <app-empty-state icon="calendar-outline" title="Booking not found" description="We co`
- Event/raw template lines detected:
  - Template line 10: `<button type="button" class="btn-ghost" (click)="goBack()">Back to Bookings</button>`
  - Template line 88: `<button class="btn-primary" type="button" (click)="openConfirm('confirm')">Confirm Booking</button>`
  - Template line 89: `<button class="btn-danger" type="button" (click)="openConfirm('reject', true)">Reject Booking</button>`
  - Template line 93: `<button class="btn-primary" type="button" (click)="openConfirm('confirm-payment')">Confirm Payment</button>`
  - Template line 94: `<button class="btn-danger" type="button" (click)="openConfirm('reject', true)">Reject Proof</button>`
  - Template line 98: `<button class="btn-primary" type="button" (click)="openConfirm('mark-complete')">Mark Complete</button>`
  - Template line 99: `<button class="btn-ghost" type="button" (click)="openConfirm('mark-no-show')">Mark No Show</button>`
  - Template line 100: `<button class="btn-outline" type="button" (click)="reschedule()">Reschedule</button>`
  - Template line 101: `<button class="btn-danger" type="button" (click)="openConfirm('cancel', true)">Cancel Booking</button>`
  - Template line 105: `<button class="btn-primary" type="button" (click)="openReceipt(booking)">Print Receipt</button>`
  - Template line 106: `<button class="btn-outline" type="button" disabled (click)="soon('Visit Summary')">Download Visit Summary</button>`
  - Template line 110: `<button class="btn-ghost" type="button" disabled>No actions available</button>`
  - Template line 115: `<button *ngIf="canWaive" class="btn-ghost" type="button" (click)="waiveModalOpen = true">`
  - Template line 118: `<button *ngIf="canRefund" class="btn-ghost" type="button" (click)="refundModalOpen = true">`
- Programmatic navigation detected:
  - TS line 341: `router.navigate(['/admin/bookings'])`
  - TS line 493: `router.navigate(['/admin/bookings', this.booking?.id, 'reschedule'])`
- Child components/selectors rendered by template: `app-avatar`, `app-confirm-modal`, `app-empty-state`, `app-receipt-modal`, `app-refund-payment-modal`, `app-skeleton`, `app-status-badge`, `app-waive-payment-modal`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'bookings/' + id))|src/app/portals/admin/booking-detail/booking-detail.page.ts:266|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'patients/' + patientId))|src/app/portals/admin/booking-detail/booking-detail.page.ts:300|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'bookings/' + bookingId + '/confirm', {}))|src/app/portals/admin/booking-detail/booking-detail.page.ts:397|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'bookings/' + bookingId + '/cancel', { reason: reason \|\| 'Rejected by admin' }))|src/app/portals/admin/booking-detail/booking-detail.page.ts:401|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'bookings/' + bookingId + '/confirm', {}))|src/app/portals/admin/booking-detail/booking-detail.page.ts:405|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'bookings/' + bookingId + '/complete', {}))|src/app/portals/admin/booking-detail/booking-detail.page.ts:409|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'bookings/' + bookingId + '/no-show', {}))|src/app/portals/admin/booking-detail/booking-detail.page.ts:413|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'bookings/' + bookingId + '/cancel', { reason: reason \|\| 'Cancelled by admin' }))|src/app/portals/admin/booking-detail/booking-detail.page.ts:417|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|post|'audit-logs', { entityType: 'Booking', entityId, action, performedBy, details }))|src/app/portals/admin/booking-detail/booking-detail.page.ts:439|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|put|'bookings/' + bookingId + '/waive', { reason }))|src/app/portals/admin/booking-detail/booking-detail.page.ts:454|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|put|'bookings/' + bookingId + '/refund', { reason }))|src/app/portals/admin/booking-detail/booking-detail.page.ts:475|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Loading, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/admin/walk-in`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/walk-in|
|Page/component file|src/app/portals/admin/walk-in/walk-in.page.ts|
|Component class|WalkInPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ActivatedRoute, ApiService, BookingAvailabilityService, DestroyRef, FormBuilder, Router, ToastController
- API calls detected in component: post('patients', dto))) line 827, post('bookings', {}))) line 879, get('bookings/' + bookingId))) line 887, get('doctors').pipe() line 902, get(endpoint).pipe() line 934, get('doctors/' + doctorId + '/services').pipe() line 1005, get('services').pipe() line 1008, get('doctors/' + doctorId + '/available-slots?date=' + date).pipe() line 1044

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 13: `<button type="button" class="stepper__step" [class.is-active]="currentWalkInStep === 1" [class.is-complete]="isStepComplete(1)" [disabled]="!canAccessStep(1)" (click)="goToStep(1)" >`; visible text/context: `1 Patient Search or register <button`
  - Line 28: `<button type="button" class="stepper__step" [class.is-active]="currentWalkInStep === 2" [class.is-complete]="isStepComplete(2)" [disabled]="!canAccessStep(2)" (click)="goToStep(2)" >`; visible text/context: `2 Slot Doctor and schedule <button`
  - Line 43: `<button type="button" class="stepper__step" [class.is-active]="currentWalkInStep === 3" [class.is-complete]="isStepComplete(3)" [disabled]="!canAccessStep(3)" (click)="goToStep(3)" >`; visible text/context: `3 Payment Review and confirm`
  - Line 89: `<button type="button" class="mobile-card patient-result" *ngFor="let patient of searchResults; trackBy: trackById" [attr.aria-label]="'Select patient ' + patientDisplayName(patient)" (click)="selectPa`; visible text/context: `{{ patientDisplayName(patient) }} {{ patient.patientCode }}`
  - Line 211: `<button type="button" class="btn-ghost" (click)="cancelQuickRegister()">`; visible text/context: `Cancel {{ isSavingPatient ? 'Creating...' : 'Create Patient' }} <ap`
  - Line 250: `<button type="button" class="btn-outline" (click)="clearSelectedPatient()">`; visible text/context: `Change Patient Doctor * <ion-item class="clinic-input" lines="n`
  - Line 326: `<button type="button" class="btn-ghost" (click)="goToStep(1)">`; visible text/context: `Back Payment <p class="panel-hi`
  - Line 351: `<button type="button" class="btn-outline" (click)="clearSelectedPatient()">`; visible text/context: `Change Patient Patient {{ patientDisplayName(selectedPatie`
  - Line 411: `<button type="button" class="btn-ghost" (click)="goToStep(2)">`; visible text/context: `Back {{ isSavingBooking ? 'Creating...' : 'Create Booking' }}`
  - Line 412: `<button type="button" class="btn-primary" [disabled]="!canSubmitBooking || isSavingBooking" (click)="createBooking()">`; visible text/context: `{{ isSavingBooking ? 'Creating...' : 'Create Booking' }} Booking`
- Form/input controls detected:
  - Line 133: `firstName` from `<ion-input formControlName="firstName" autocomplete="given-name" placeholder="First name">`
  - Line 141: `middleName` from `<ion-input formControlName="middleName" autocomplete="additional-name" placeholder="Middle name">`
  - Line 148: `lastName` from `<ion-input formControlName="lastName" autocomplete="family-name" placeholder="Last name">`
  - Line 156: `dateOfBirth` from `<ion-input type="date" formControlName="dateOfBirth">`
  - Line 164: `sex` from `<ion-select formControlName="sex" interface="popover" placeholder="Select sex">`
  - Line 175: `contactNumber` from `<ion-input formControlName="contactNumber" autocomplete="tel" placeholder="Contact number">`
  - Line 182: `email` from `<ion-input type="email" formControlName="email" autocomplete="email" placeholder="Email">`
  - Line 191: `address` from `<ion-input formControlName="address" autocomplete="street-address" placeholder="Address">`
  - Line 199: `preparePortalAccount` from `<ion-checkbox formControlName="preparePortalAccount">`
  - Line 259: `doctorId` from `<ion-select formControlName="doctorId" interface="popover" placeholder="Select doctor">`
  - Line 274: `serviceId` from `<ion-select formControlName="serviceId" interface="popover" placeholder="Select service" [disabled]="isLoadingServices || !bookingForm.controls.doctorId.value || services.length === 0" >`
  - Line 298: `appointmentDate` from `<ion-input type="date" formControlName="appointmentDate" [min]="todayIso" [max]="todayIso">`
- Reactive forms declared in component:
  - `quickRegisterForm` line 568; controls: `firstName, middleName, lastName, dateOfBirth, sex, contactNumber, email, address, preparePortalAccount`
  - `bookingForm` line 579; controls: `doctorId, serviceId, appointmentDate`
- Validators detected in TS: `Validators.required, Validators.email`. Exact field-to-validator mapping should be verified against component source. [TEAM TO VERIFY]
- Event/raw template lines detected:
  - Template line 13: `<button`
  - Template line 19: `(click)="goToStep(1)"`
  - Template line 28: `<button`
  - Template line 34: `(click)="goToStep(2)"`
  - Template line 43: `<button`
  - Template line 49: `(click)="goToStep(3)"`
  - Template line 89: `<button type="button" class="mobile-card patient-result" *ngFor="let patient of searchResults; trackBy: trackById" [attr.aria-label]="'Select patient ' + patientDisplayName(patient)" (click)="selectPatient(patient)">`
  - Template line 127: `<form class="quick-register" *ngIf="showQuickRegister" [formGroup]="quickRegisterForm" novalidate (ngSubmit)="createPatient()">`
  - Template line 133: `<ion-input formControlName="firstName" autocomplete="given-name" placeholder="First name"></ion-input>`
  - Template line 141: `<ion-input formControlName="middleName" autocomplete="additional-name" placeholder="Middle name"></ion-input>`
  - Template line 148: `<ion-input formControlName="lastName" autocomplete="family-name" placeholder="Last name"></ion-input>`
  - Template line 156: `<ion-input type="date" formControlName="dateOfBirth"></ion-input>`
  - Template line 164: `<ion-select formControlName="sex" interface="popover" placeholder="Select sex">`
  - Template line 175: `<ion-input formControlName="contactNumber" autocomplete="tel" placeholder="Contact number"></ion-input>`
  - Template line 182: `<ion-input type="email" formControlName="email" autocomplete="email" placeholder="Email"></ion-input>`
  - Template line 191: `<ion-input formControlName="address" autocomplete="street-address" placeholder="Address"></ion-input>`
  - Template line 199: `<ion-checkbox formControlName="preparePortalAccount"></ion-checkbox>`
  - Template line 211: `<button type="button" class="btn-ghost" (click)="cancelQuickRegister()">Cancel</button>`
  - Template line 212: `<button type="submit" class="btn-primary" [disabled]="isSavingPatient">`
  - Template line 250: `<button type="button" class="btn-outline" (click)="clearSelectedPatient()">Change Patient</button>`
  - Template line 259: `<ion-select formControlName="doctorId" interface="popover" placeholder="Select doctor">`
  - Template line 274: `formControlName="serviceId"`
  - Template line 298: `<ion-input type="date" formControlName="appointmentDate" [min]="todayIso" [max]="todayIso"></ion-input>`
  - Template line 326: `<button type="button" class="btn-ghost" (click)="goToStep(1)">Back</button>`
  - Template line 351: `<button type="button" class="btn-outline" (click)="clearSelectedPatient()">Change Patient</button>`
  - Template line 411: `<button type="button" class="btn-ghost" (click)="goToStep(2)">Back</button>`
  - Template line 412: `<button type="button" class="btn-primary" [disabled]="!canSubmitBooking || isSavingBooking" (click)="createBooking()">`
- Programmatic navigation detected:
  - TS line 866: `router.navigate(['/admin/bookings', booking.id])`
  - TS line 868: `router.navigate(['/admin/bookings'])`
- Child components/selectors rendered by template: `app-empty-state`, `app-slot-grid`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|post|'patients', dto))|src/app/portals/admin/walk-in/walk-in.page.ts:827|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|post|'bookings', {}))|src/app/portals/admin/walk-in/walk-in.page.ts:879|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/' + bookingId))|src/app/portals/admin/walk-in/walk-in.page.ts:887|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'doctors').pipe(|src/app/portals/admin/walk-in/walk-in.page.ts:902|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|endpoint).pipe(|src/app/portals/admin/walk-in/walk-in.page.ts:934|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'doctors/' + doctorId + '/services').pipe(|src/app/portals/admin/walk-in/walk-in.page.ts:1005|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'services').pipe(|src/app/portals/admin/walk-in/walk-in.page.ts:1008|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'doctors/' + doctorId + '/available-slots?date=' + date).pipe(|src/app/portals/admin/walk-in/walk-in.page.ts:1044|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/admin/calendar`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/calendar|
|Page/component file|src/app/portals/admin/calendar/calendar.page.ts|
|Component class|CalendarPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, DoctorStateService
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 9: `<button type="button" class="btn-ghost" (click)="shiftWeek(-1)">`; visible text/context: `&lt; Prev Week {{ weekLabel }} Next Week &gt; <app-empty-state`
  - Line 11: `<button type="button" class="btn-ghost" (click)="shiftWeek(1)">`; visible text/context: `Next Week &gt; <app-empty-state *ngIf="!isLoading && weekBookings.length === 0" icon="calendar-outli`
- Event/raw template lines detected:
  - Template line 9: `<button type="button" class="btn-ghost" (click)="shiftWeek(-1)">&lt; Prev Week</button>`
  - Template line 11: `<button type="button" class="btn-ghost" (click)="shiftWeek(1)">Next Week &gt;</button>`
- Child components/selectors rendered by template: `app-empty-state`, `app-skeleton`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/admin/doctors`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/doctors|
|Page/component file|src/app/portals/admin/doctors/doctors.page.ts|
|Component class|DoctorsPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, DestroyRef, Router, ToastController
- API calls detected in component: get('doctors/' + doctor.id + '/schedule').pipe() line 289

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 8: `<button type="button" class="btn-primary" (click)="addDoctor()">`; visible text/context: `Add Doctor 0; else emptyState"> <div class="table-des`
  - Line 31: `<tr *ngFor="let doctor of doctors" tabindex="0" role="button" [attr.aria-label]="'Edit doctor ' + doctor.fullName" (click)="!isBusy(doctor.id) && editDoctor(doctor.id)" (keydown.enter)="!isBusy(doctor`; visible text/context: `{{ doctor.fullName }} {{ doctor.specialization }} PHP {{ doctor.consultationFee }} {{ workingDays(do`
  - Line 49: `<button type="button" class="btn-icon" [disabled]="isBusy(doctor.id)" [attr.aria-label]="'Edit doctor ' + doctor.fullName" (click)="editDoctor(doctor.id); $event.stopPropagation()" >`; visible text/context: `<button type="button" class="btn-icon" [disabled]="isBusy(doctor.id)" [attr.aria-la`
  - Line 58: `<button type="button" class="btn-icon" [disabled]="isBusy(doctor.id)" [attr.aria-label]="'Deactivate doctor ' + doctor.fullName" (click)="askDeactivate(doctor.id, $event)" >`; visible text/context: `<article`
  - Line 75: `<article *ngFor="let doctor of doctors" class="mobile-card" tabindex="0" role="button" [attr.aria-label]="'Edit doctor ' + doctor.fullName" (click)="!isBusy(doctor.id) && editDoctor(doctor.id)" (keydo`; visible text/context: `{{ doctor.fullName }} Doctor ID {{ doctor.id }} <app-status-badge [status]="doct`
  - Line 110: `<button type="button" class="btn-icon" [disabled]="isBusy(doctor.id)" [attr.aria-label]="'Edit doctor ' + doctor.fullName" (click)="editDoctor(doctor.id); $event.stopPropagation()" >`; visible text/context: `<button type="button" class="btn-icon" [disabled]="isBusy(doctor.id)" [attr.aria-label]="'Deactivate`
  - Line 119: `<button type="button" class="btn-icon" [disabled]="isBusy(doctor.id)" [attr.aria-label]="'Deactivate doctor ' + doctor.fullName" (click)="askDeactivate(doctor.id, $event)" >`; visible text/context: `<app-empty-state icon="medical-outline"`
- Event/raw template lines detected:
  - Template line 8: `<button type="button" class="btn-primary" (click)="addDoctor()">Add Doctor</button>`
  - Template line 36: `(click)="!isBusy(doctor.id) && editDoctor(doctor.id)"`
  - Template line 49: `<button`
  - Template line 54: `(click)="editDoctor(doctor.id); $event.stopPropagation()"`
  - Template line 58: `<button`
  - Template line 63: `(click)="askDeactivate(doctor.id, $event)"`
  - Template line 81: `(click)="!isBusy(doctor.id) && editDoctor(doctor.id)"`
  - Template line 110: `<button`
  - Template line 115: `(click)="editDoctor(doctor.id); $event.stopPropagation()"`
  - Template line 119: `<button`
  - Template line 124: `(click)="askDeactivate(doctor.id, $event)"`
- Programmatic navigation detected:
  - TS line 208: `router.navigate(['/admin/doctors/new'])`
  - TS line 212: `router.navigate(['/admin/doctors', id, 'edit'])`
- Child components/selectors rendered by template: `app-avatar`, `app-confirm-modal`, `app-empty-state`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'doctors/' + doctor.id + '/schedule').pipe(|src/app/portals/admin/doctors/doctors.page.ts:289|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/admin/doctors/new`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/doctors/new|
|Page/component file|src/app/portals/admin/doctor-form/doctor-form.page.ts|
|Component class|DoctorFormPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ActivatedRoute, AdminDoctorsService, ApiService, DestroyRef, FormBuilder, Router, ToastController
- API calls detected in component: get('doctors/admin').pipe() line 230, get('doctors/' + this.doctorId + '/schedule').pipe() line 237, put(`doctors/${this.doctorId}`, updatePayload).pipe() line 312, put('doctors/' + savedDoctor.id + '/schedule', {) line 315

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 5: `<button type="button" class="btn-ghost" (click)="cancel()">`; visible text/context: `Back to Doctors {{ isEditMode ? 'Edit Doctor' : 'Add Doctor' }} Update profile, schedule, and consul`
  - Line 127: `<button type="button" class="btn-ghost" (click)="cancel()">`; visible text/context: `Cancel {{ isSaving ? 'Saving...' : 'Save Doctor' }} <ng-template #`
- Form/input controls detected:
  - Line 32: `fullName` from `<input class="filter-input" formControlName="fullName" placeholder="Full Name" />`
  - Line 39: `doctorEmail` from `<input class="filter-input" type="email" formControlName="doctorEmail" placeholder="Doctor email for social login invite" autocomplete="email" />`
  - Line 54: `specialization` from `<input class="filter-input" formControlName="specialization" placeholder="Specialization" />`
  - Line 58: `licenseNumber` from `<input class="filter-input" formControlName="licenseNumber" placeholder="License Number" />`
  - Line 62: `ptrNumber` from `<input class="filter-input" formControlName="ptrNumber" placeholder="PTR Number" />`
  - Line 66: `s2Number` from `<input class="filter-input" formControlName="s2Number" placeholder="S2 Number" />`
  - Line 70: `consultationFee` from `<input class="filter-input" type="number" formControlName="consultationFee" placeholder="Consultation Fee" />`
  - Line 74: `status` from `<select class="filter-input" formControlName="status">`
  - Line 82: `slotDurationMinutes` from `<input class="filter-input" type="number" formControlName="slotDurationMinutes" placeholder="Slot Duration" />`
  - Line 86: `slotCapacity` from `<input class="filter-input" type="number" formControlName="slotCapacity" placeholder="Slot Capacity" />`
  - Line 90: `dailyPatientLimit` from `<input class="filter-input" type="number" formControlName="dailyPatientLimit" placeholder="Daily Patient Limit" />`
  - Line 94: `bio` from `<textarea class="textarea" formControlName="bio" placeholder="Doctor bio">`
- Reactive forms declared in component:
  - `form` line 196; controls: `fullName, doctorEmail, specialization, bio, licenseNumber, ptrNumber, s2Number, consultationFee, status, slotDurationMinutes, slotCapacity, dailyPatientLimit`
- Validators detected in TS: `Validators.required, Validators.email, Validators.minLength, Validators.min`. Exact field-to-validator mapping should be verified against component source. [TEAM TO VERIFY]
- Event/raw template lines detected:
  - Template line 5: `<button type="button" class="btn-ghost" (click)="cancel()">Back to Doctors</button>`
  - Template line 17: `<form class="doctor-form clinic-card" [formGroup]="form" (ngSubmit)="submit()">`
  - Template line 22: `<input type="file" accept="image/*" />`
  - Template line 32: `<input class="filter-input" formControlName="fullName" placeholder="Full Name" />`
  - Template line 39: `formControlName="doctorEmail"`
  - Template line 54: `<input class="filter-input" formControlName="specialization" placeholder="Specialization" />`
  - Template line 58: `<input class="filter-input" formControlName="licenseNumber" placeholder="License Number" />`
  - Template line 62: `<input class="filter-input" formControlName="ptrNumber" placeholder="PTR Number" />`
  - Template line 66: `<input class="filter-input" formControlName="s2Number" placeholder="S2 Number" />`
  - Template line 70: `<input class="filter-input" type="number" formControlName="consultationFee" placeholder="Consultation Fee" />`
  - Template line 74: `<select class="filter-input" formControlName="status">`
  - Template line 82: `<input class="filter-input" type="number" formControlName="slotDurationMinutes" placeholder="Slot Duration" />`
  - Template line 86: `<input class="filter-input" type="number" formControlName="slotCapacity" placeholder="Slot Capacity" />`
  - Template line 90: `<input class="filter-input" type="number" formControlName="dailyPatientLimit" placeholder="Daily Patient Limit" />`
  - Template line 94: `<textarea class="textarea" formControlName="bio" placeholder="Doctor bio"></textarea>`
  - Template line 110: `(change)="toggleService(service.id)"`
  - Template line 127: `<button type="button" class="btn-ghost" (click)="cancel()">Cancel</button>`
  - Template line 128: `<button type="submit" class="btn-primary" [disabled]="form.invalid || isSaving">`
- Programmatic navigation detected:
  - TS line 331: `router.navigate(['/admin/doctors'])`
  - TS line 377: `router.navigate(['/admin/doctors'])`
  - TS line 395: `router.navigate(['/admin/doctors'])`
- Child components/selectors rendered by template: `app-avatar`, `app-doctor-schedule-form`, `app-empty-state`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'doctors/admin').pipe(|src/app/portals/admin/doctor-form/doctor-form.page.ts:230|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'doctors/' + this.doctorId + '/schedule').pipe(|src/app/portals/admin/doctor-form/doctor-form.page.ts:237|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|put|`doctors/${this.doctorId}`, updatePayload).pipe(|src/app/portals/admin/doctor-form/doctor-form.page.ts:312|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|put|'doctors/' + savedDoctor.id + '/schedule', {|src/app/portals/admin/doctor-form/doctor-form.page.ts:315|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/admin/doctors/:id/edit`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/doctors/:id/edit|
|Page/component file|src/app/portals/admin/doctor-form/doctor-form.page.ts|
|Component class|DoctorFormPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Route parameter required: id
- Injected dependencies: ActivatedRoute, AdminDoctorsService, ApiService, DestroyRef, FormBuilder, Router, ToastController
- API calls detected in component: get('doctors/admin').pipe() line 230, get('doctors/' + this.doctorId + '/schedule').pipe() line 237, put(`doctors/${this.doctorId}`, updatePayload).pipe() line 312, put('doctors/' + savedDoctor.id + '/schedule', {) line 315

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 5: `<button type="button" class="btn-ghost" (click)="cancel()">`; visible text/context: `Back to Doctors {{ isEditMode ? 'Edit Doctor' : 'Add Doctor' }} Update profile, schedule, and consul`
  - Line 127: `<button type="button" class="btn-ghost" (click)="cancel()">`; visible text/context: `Cancel {{ isSaving ? 'Saving...' : 'Save Doctor' }} <ng-template #`
- Form/input controls detected:
  - Line 32: `fullName` from `<input class="filter-input" formControlName="fullName" placeholder="Full Name" />`
  - Line 39: `doctorEmail` from `<input class="filter-input" type="email" formControlName="doctorEmail" placeholder="Doctor email for social login invite" autocomplete="email" />`
  - Line 54: `specialization` from `<input class="filter-input" formControlName="specialization" placeholder="Specialization" />`
  - Line 58: `licenseNumber` from `<input class="filter-input" formControlName="licenseNumber" placeholder="License Number" />`
  - Line 62: `ptrNumber` from `<input class="filter-input" formControlName="ptrNumber" placeholder="PTR Number" />`
  - Line 66: `s2Number` from `<input class="filter-input" formControlName="s2Number" placeholder="S2 Number" />`
  - Line 70: `consultationFee` from `<input class="filter-input" type="number" formControlName="consultationFee" placeholder="Consultation Fee" />`
  - Line 74: `status` from `<select class="filter-input" formControlName="status">`
  - Line 82: `slotDurationMinutes` from `<input class="filter-input" type="number" formControlName="slotDurationMinutes" placeholder="Slot Duration" />`
  - Line 86: `slotCapacity` from `<input class="filter-input" type="number" formControlName="slotCapacity" placeholder="Slot Capacity" />`
  - Line 90: `dailyPatientLimit` from `<input class="filter-input" type="number" formControlName="dailyPatientLimit" placeholder="Daily Patient Limit" />`
  - Line 94: `bio` from `<textarea class="textarea" formControlName="bio" placeholder="Doctor bio">`
- Reactive forms declared in component:
  - `form` line 196; controls: `fullName, doctorEmail, specialization, bio, licenseNumber, ptrNumber, s2Number, consultationFee, status, slotDurationMinutes, slotCapacity, dailyPatientLimit`
- Validators detected in TS: `Validators.required, Validators.email, Validators.minLength, Validators.min`. Exact field-to-validator mapping should be verified against component source. [TEAM TO VERIFY]
- Event/raw template lines detected:
  - Template line 5: `<button type="button" class="btn-ghost" (click)="cancel()">Back to Doctors</button>`
  - Template line 17: `<form class="doctor-form clinic-card" [formGroup]="form" (ngSubmit)="submit()">`
  - Template line 22: `<input type="file" accept="image/*" />`
  - Template line 32: `<input class="filter-input" formControlName="fullName" placeholder="Full Name" />`
  - Template line 39: `formControlName="doctorEmail"`
  - Template line 54: `<input class="filter-input" formControlName="specialization" placeholder="Specialization" />`
  - Template line 58: `<input class="filter-input" formControlName="licenseNumber" placeholder="License Number" />`
  - Template line 62: `<input class="filter-input" formControlName="ptrNumber" placeholder="PTR Number" />`
  - Template line 66: `<input class="filter-input" formControlName="s2Number" placeholder="S2 Number" />`
  - Template line 70: `<input class="filter-input" type="number" formControlName="consultationFee" placeholder="Consultation Fee" />`
  - Template line 74: `<select class="filter-input" formControlName="status">`
  - Template line 82: `<input class="filter-input" type="number" formControlName="slotDurationMinutes" placeholder="Slot Duration" />`
  - Template line 86: `<input class="filter-input" type="number" formControlName="slotCapacity" placeholder="Slot Capacity" />`
  - Template line 90: `<input class="filter-input" type="number" formControlName="dailyPatientLimit" placeholder="Daily Patient Limit" />`
  - Template line 94: `<textarea class="textarea" formControlName="bio" placeholder="Doctor bio"></textarea>`
  - Template line 110: `(change)="toggleService(service.id)"`
  - Template line 127: `<button type="button" class="btn-ghost" (click)="cancel()">Cancel</button>`
  - Template line 128: `<button type="submit" class="btn-primary" [disabled]="form.invalid || isSaving">`
- Programmatic navigation detected:
  - TS line 331: `router.navigate(['/admin/doctors'])`
  - TS line 377: `router.navigate(['/admin/doctors'])`
  - TS line 395: `router.navigate(['/admin/doctors'])`
- Child components/selectors rendered by template: `app-avatar`, `app-doctor-schedule-form`, `app-empty-state`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'doctors/admin').pipe(|src/app/portals/admin/doctor-form/doctor-form.page.ts:230|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'doctors/' + this.doctorId + '/schedule').pipe(|src/app/portals/admin/doctor-form/doctor-form.page.ts:237|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|put|`doctors/${this.doctorId}`, updatePayload).pipe(|src/app/portals/admin/doctor-form/doctor-form.page.ts:312|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|put|'doctors/' + savedDoctor.id + '/schedule', {|src/app/portals/admin/doctor-form/doctor-form.page.ts:315|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/admin/services`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/services|
|Page/component file|src/app/portals/admin/services/services.page.ts|
|Component class|ServicesPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, DestroyRef, ToastController
- API calls detected in component: put('services/' + this.editingId, payload).pipe() line 275, post('services', payload).pipe() line 278, get('services').pipe() line 308, get('doctors/admin').pipe() line 315

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 8: `<button class="btn-primary" type="button" (click)="openModal()">`; visible text/context: `Add Service 0; else emptyState"> <div class="clinic-card" *ngFo`
  - Line 42: `<button class="btn-ghost" type="button" [disabled]="isBusy(service.id) || isSaving" (click)="toggle(service)" >`; visible text/context: `{{ service.isActive ? 'Deactivate' : 'Activate' }} <button class="btn-ghost" type="button" [disabled`
  - Line 50: `<button class="btn-ghost" type="button" [disabled]="isBusy(service.id) || isSaving" (click)="edit(service)" >`; visible text/context: `Edit <button class="btn-ghost" type="button" [disabled]="isBusy(service.id) || isSaving" (click)="re`
  - Line 58: `<button class="btn-ghost" type="button" [disabled]="isBusy(service.id) || isSaving" (click)="remove(service.id)" >`; visible text/context: `Delete`
  - Line 132: `<button type="button" class="btn-ghost" (click)="closeModal()">`; visible text/context: `Cancel {{ isSaving ? 'Saving...' : 'Save' }}`
- Form/input controls detected:
  - Line 95: `draft.name` from `<input class="filter-input" name="name" [(ngModel)]="draft.name" placeholder="Service name" required />`
  - Line 103: `draft.description` from `<textarea class="textarea" name="description" [(ngModel)]="draft.description" placeholder="Description" >`
  - Line 107: `draft.category` from `<select class="filter-input" name="category" [(ngModel)]="draft.category" required>`
  - Line 116: `draft.price` from `<input class="filter-input" type="number" name="price" [(ngModel)]="draft.price" placeholder="Price" min="0" required />`
  - Line 125: `draft.estimatedDurationMinutes` from `<input class="filter-input" type="number" name="estimatedDurationMinutes" [(ngModel)]="draft.estimatedDurationMinutes" placeholder="Duration" min="1" required />`
- Event/raw template lines detected:
  - Template line 8: `<button class="btn-primary" type="button" (click)="openModal()">Add Service</button>`
  - Template line 42: `<button`
  - Template line 46: `(click)="toggle(service)"`
  - Template line 50: `<button`
  - Template line 54: `(click)="edit(service)"`
  - Template line 58: `<button`
  - Template line 62: `(click)="remove(service.id)"`
  - Template line 91: `<form #serviceForm="ngForm" class="modal-form" novalidate (ngSubmit)="save(serviceForm)">`
  - Template line 95: `[(ngModel)]="draft.name"`
  - Template line 103: `[(ngModel)]="draft.description"`
  - Template line 107: `<select class="filter-input" name="category" [(ngModel)]="draft.category" required>`
  - Template line 116: `[(ngModel)]="draft.price"`
  - Template line 125: `[(ngModel)]="draft.estimatedDurationMinutes"`
  - Template line 132: `<button type="button" class="btn-ghost" (click)="closeModal()">Cancel</button>`
  - Template line 133: `<button type="submit" class="btn-primary" [disabled]="isSaving || serviceForm.invalid">`
- Child components/selectors rendered by template: `app-empty-state`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|put|'services/' + this.editingId, payload).pipe(|src/app/portals/admin/services/services.page.ts:275|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|post|'services', payload).pipe(|src/app/portals/admin/services/services.page.ts:278|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'services').pipe(|src/app/portals/admin/services/services.page.ts:308|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'doctors/admin').pipe(|src/app/portals/admin/services/services.page.ts:315|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/admin/patients`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/patients|
|Page/component file|src/app/portals/admin/patients/patients.page.ts|
|Component class|PatientsPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, DestroyRef, ModalController, Router, ToastController
- API calls detected in component: get(endpoint).pipe() line 231

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 20: `<button class="btn-primary patients-toolbar__add" type="button" (click)="openAddPatientModal()">`; visible text/context: `Add Patient {{ countLabel }} 1">`
  - Line 29: `<button class="btn-ghost patients-pagination__button" type="button" (click)="previousPage()" [disabled]="!canPreviousPage" >`; visible text/context: `Previous Page {{ currentPage }} of {{ totalPages }} <button class="btn-ghost patients-pagination__bu`
  - Line 40: `<button class="btn-ghost patients-pagination__button" type="button" (click)="nextPage()" [disabled]="!canNextPage" >`; visible text/context: `Next 0"> Code</`
  - Line 64: `<tr *ngFor="let patient of patients" tabindex="0" role="button" [attr.aria-label]="'Open patient record for ' + patientDisplayName(patient)" (click)="openDetail(patient.id)" (keydown.enter)="openDetai`; visible text/context: `{{ patient.patientCode }} {{ patientDisplayName(patient) }} {{ patient.contactNumber || 'No phone pr`
- Event/raw template lines detected:
  - Template line 20: `<button class="btn-primary patients-toolbar__add" type="button" (click)="openAddPatientModal()">`
  - Template line 29: `<button`
  - Template line 32: `(click)="previousPage()"`
  - Template line 40: `<button`
  - Template line 43: `(click)="nextPage()"`
  - Template line 69: `(click)="openDetail(patient.id)"`
- Programmatic navigation detected:
  - TS line 195: `router.navigate(['/admin/patients', id])`
- Child components/selectors rendered by template: `app-empty-state`, `app-skeleton`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|endpoint).pipe(|src/app/portals/admin/patients/patients.page.ts:231|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/admin/patients/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/patients/:id|
|Page/component file|src/app/portals/admin/patient-detail/patient-detail.page.ts|
|Component class|PatientDetailPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Route parameter required: id
- Injected dependencies: ActivatedRoute, ApiService, MedicalRecordsService, ModalController, Router
- API calls detected in component: get('patients/' + id).pipe() line 192, get('medical-records/consultations?patientId=' + id).pipe() line 213, get('medical-records/prescriptions?patientId=' + id).pipe() line 217, get('medical-records/allergies?patientId=' + id).pipe() line 221, get('medical-records/lab-results?patientId=' + id).pipe() line 225, get('medical-records/vaccinations?patientId=' + id).pipe() line 229, get('medical-records/follow-ups?patientId=' + id).pipe() line 233

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 5: `<button type="button" class="btn-ghost" (click)="back()">`; visible text/context: `Back to Patients {{ patient.firstName }} {{ patient.lastName }} {{ patient.patientCode }} Edit Profi`
  - Line 9: `<button class="btn-primary" type="button" (click)="openEdit()">`; visible text/context: `Edit Profile Overview Bookings </ion-segment-`
- Event/raw template lines detected:
  - Template line 5: `<button type="button" class="btn-ghost" (click)="back()">Back to Patients</button>`
  - Template line 9: `<button class="btn-primary" type="button" (click)="openEdit()">Edit Profile</button>`
  - Template line 12: `<ion-segment [value]="selectedTab" (ionChange)="onTabChange($event)">`
- Programmatic navigation detected:
  - TS line 160: `router.navigate(['/admin/patients'])`
- Child components/selectors rendered by template: `app-avatar`, `app-empty-state`, `app-medical-records-tab`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'patients/' + id).pipe(|src/app/portals/admin/patient-detail/patient-detail.page.ts:192|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/consultations?patientId=' + id).pipe(|src/app/portals/admin/patient-detail/patient-detail.page.ts:213|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/prescriptions?patientId=' + id).pipe(|src/app/portals/admin/patient-detail/patient-detail.page.ts:217|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/allergies?patientId=' + id).pipe(|src/app/portals/admin/patient-detail/patient-detail.page.ts:221|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/lab-results?patientId=' + id).pipe(|src/app/portals/admin/patient-detail/patient-detail.page.ts:225|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/vaccinations?patientId=' + id).pipe(|src/app/portals/admin/patient-detail/patient-detail.page.ts:229|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/follow-ups?patientId=' + id).pipe(|src/app/portals/admin/patient-detail/patient-detail.page.ts:233|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/admin/staff`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/staff|
|Page/component file|src/app/portals/admin/staff/staff.page.ts|
|Component class|StaffPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, ToastController
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 8: `<button class="btn-primary" type="button" (click)="openAddStaffForm()">`; visible text/context: `Invite Staff {{ error }} <button class="btn-ghost" t`
  - Line 17: `<button class="btn-ghost" type="button" (click)="ngOnInit()">`; visible text/context: `Try again 0"> Name Email Role Status Acti`
  - Line 33: `<button class="btn-ghost" type="button" (click)="toggle(member.id)" [disabled]="toggleBusy.has(member.id)">`; visible text/context: `{{ toggleBusy.has(member.id) ? '\u2026' : (member.status === 'Active' ? 'Deactivate' : 'Reactivate')`
  - Line 38: `<button class="btn-ghost" type="button" (click)="revokeInvite(member.id)" [disabled]="busyRevoke">`; visible text/context: `{{ busyRevoke ? '\u2026' : 'Revoke' }} <app-empty-state *ngIf="!loading && !error &`
  - Line 62: `<button type="button" class="btn-ghost" (click)="closeAddStaffForm()">`; visible text/context: `Cancel {{ addSubmitting ? 'Sending invite\u2026' : 'Send Invite' }}`
- Form/input controls detected:
  - Line 57: `draft.fullName` from `<input class="filter-input" name="fullName" [(ngModel)]="draft.fullName" placeholder="Full Name" required />`
  - Line 58: `draft.email` from `<input class="filter-input" name="email" type="email" [(ngModel)]="draft.email" placeholder="Email" required />`
  - Line 59: `draft.phone` from `<input class="filter-input" name="phone" [(ngModel)]="draft.phone" placeholder="Phone (optional)" />`
- Event/raw template lines detected:
  - Template line 8: `<button class="btn-primary" type="button" (click)="openAddStaffForm()">Invite Staff</button>`
  - Template line 17: `<button class="btn-ghost" type="button" (click)="ngOnInit()">Try again</button>`
  - Template line 33: `<button class="btn-ghost" type="button" (click)="toggle(member.id)" [disabled]="toggleBusy.has(member.id)">`
  - Template line 38: `<button class="btn-ghost" type="button" (click)="revokeInvite(member.id)" [disabled]="busyRevoke">`
  - Template line 56: `<form class="add-staff-form" (ngSubmit)="save()">`
  - Template line 57: `<input class="filter-input" name="fullName" [(ngModel)]="draft.fullName" placeholder="Full Name" required />`
  - Template line 58: `<input class="filter-input" name="email" type="email" [(ngModel)]="draft.email" placeholder="Email" required />`
  - Template line 59: `<input class="filter-input" name="phone" [(ngModel)]="draft.phone" placeholder="Phone (optional)" />`
  - Template line 62: `<button type="button" class="btn-ghost" (click)="closeAddStaffForm()">Cancel</button>`
  - Template line 63: `<button type="submit" class="btn-primary" [disabled]="addSubmitting">`
- Child components/selectors rendered by template: `app-empty-state`, `app-skeleton`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/admin/announcements`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/announcements|
|Page/component file|src/app/portals/admin/announcements/announcements.page.ts|
|Component class|AnnouncementsPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 7: `<button class="btn-primary" type="button" (click)="openModal()">`; visible text/context: `Add Announcement 0"> Title Status Created Date Actions`
  - Line 20: `<button class="btn-ghost" type="button" (click)="edit(ann)">`; visible text/context: `Edit {{ ann.isActive ? 'Deactivate' : 'Activate' }} Delete <`
  - Line 21: `<button class="btn-ghost" type="button" (click)="toggle(ann.id)">`; visible text/context: `{{ ann.isActive ? 'Deactivate' : 'Activate' }} Delete <app-empty-state *ngIf="announcemen`
  - Line 22: `<button class="btn-ghost" type="button" (click)="askDelete(ann.id)">`; visible text/context: `Delete <app-empty-state *ngIf="announcements.length === 0 && !isLoading && !loadError" icon="megapho`
  - Line 42: `<button class="btn-ghost" type="button" (click)="closeModal()">`; visible text/context: `Cancel Title`
  - Line 58: `<button class="btn-primary" type="button" (click)="save()">`; visible text/context: `{{ editingId ? 'Update' : 'Create' }} <app-confirm-modal title="Delete Announcement" message="Are`
- Form/input controls detected:
  - Line 47: `draft.title` from `<input id="ann-title" class="form-input" [(ngModel)]="draft.title" placeholder="Announcement title" />`
  - Line 51: `draft.body` from `<textarea id="ann-body" class="form-input form-textarea" [(ngModel)]="draft.body" placeholder="Announcement content">`
  - Line 54: `draft.isActive` from `<input type="checkbox" [(ngModel)]="draft.isActive" />`
- Event/raw template lines detected:
  - Template line 7: `<button class="btn-primary" type="button" (click)="openModal()">Add Announcement</button>`
  - Template line 20: `<button class="btn-ghost" type="button" (click)="edit(ann)">Edit</button>`
  - Template line 21: `<button class="btn-ghost" type="button" (click)="toggle(ann.id)">{{ ann.isActive ? 'Deactivate' : 'Activate' }}</button>`
  - Template line 22: `<button class="btn-ghost" type="button" (click)="askDelete(ann.id)">Delete</button>`
  - Template line 42: `<button class="btn-ghost" type="button" (click)="closeModal()">Cancel</button>`
  - Template line 47: `<input id="ann-title" class="form-input" [(ngModel)]="draft.title" placeholder="Announcement title" />`
  - Template line 51: `<textarea id="ann-body" class="form-input form-textarea" [(ngModel)]="draft.body" placeholder="Announcement content"></textarea>`
  - Template line 54: `<input type="checkbox" [(ngModel)]="draft.isActive" /> Active`
  - Template line 58: `<button class="btn-primary" type="button" (click)="save()">{{ editingId ? 'Update' : 'Create' }}</button>`
- Child components/selectors rendered by template: `app-confirm-modal`, `app-empty-state`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/admin/settings`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/settings|
|Page/component file|src/app/portals/admin/settings/settings.page.ts|
|Component class|SettingsPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, ClinicSettingsService, DestroyRef, ToastController
- API calls detected in component: put('settings', this.cloneSettings(this.draft)).pipe() line 324

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 8: `<button class="btn-primary" type="button" (click)="saveSettings()" [disabled]="isLoading || !draft">`; visible text/context: `Save Settings <button type="button" *ngFor="let tab of tabs" class="settings-tabs__tab" [class.is-ac`
  - Line 14: `<button type="button" *ngFor="let tab of tabs" class="settings-tabs__tab" [class.is-active]="selectedTab === tab.id" (click)="selectedTab = tab.id" >`; visible text/context: `{{ tab.label }} <ng-container *`
  - Line 141: `<button type="button" class="btn-outline" (click)="openConsentModal()">`; visible text/context: `Bump Consent Version Branding <app-color-picker label="Primary Color"`
  - Line 170: `<button class="btn-primary" type="button" (click)="saveSettings()" [disabled]="isLoading">`; visible text/context: `Save Settings <app-confirm-modal [isOpen]="bumpConsentOpen" title="Bump Consent Version" message="Th`
- Form/input controls detected:
  - Line 34: `settings.clinicName` from `<input class="filter-input" [(ngModel)]="settings.clinicName" (ngModelChange)="markDirty()" />`
  - Line 43: `settings.address` from `<textarea class="filter-input" rows="3" [(ngModel)]="settings.address" (ngModelChange)="markDirty()">`
  - Line 47: `settings.phone` from `<input class="filter-input" [(ngModel)]="settings.phone" (ngModelChange)="markDirty()" />`
  - Line 51: `settings.email` from `<input class="filter-input" type="email" [(ngModel)]="settings.email" (ngModelChange)="markDirty()" />`
  - Line 55: `settings.facebookUrl` from `<input class="filter-input" [(ngModel)]="settings.facebookUrl" (ngModelChange)="markDirty()" />`
  - Line 59: `settings.instagramUrl` from `<input class="filter-input" [(ngModel)]="settings.instagramUrl" (ngModelChange)="markDirty()" />`
  - Line 78: `settings.isPayAtClinicMode` from `<input type="checkbox" [(ngModel)]="settings.isPayAtClinicMode" (ngModelChange)="markDirty()" />`
  - Line 83: `settings.cancellationDeadlineHours` from `<input class="filter-input" type="number" [(ngModel)]="settings.cancellationDeadlineHours" (ngModelChange)="markDirty()" />`
  - Line 87: `settings.payAtClinicNoShowWindowMinutes` from `<input class="filter-input" type="number" [(ngModel)]="settings.payAtClinicNoShowWindowMinutes" (ngModelChange)="markDirty()" />`
  - Line 91: `settings.paymentSettings.gcashAccountName` from `<input class="filter-input" [(ngModel)]="settings.paymentSettings.gcashAccountName" (ngModelChange)="markDirty()" />`
  - Line 95: `settings.paymentSettings.gcashNumber` from `<input class="filter-input" [(ngModel)]="settings.paymentSettings.gcashNumber" (ngModelChange)="markDirty()" />`
  - Line 99: `settings.paymentSettings.mayaAccountName` from `<input class="filter-input" [(ngModel)]="settings.paymentSettings.mayaAccountName" (ngModelChange)="markDirty()" />`
  - Line 103: `settings.paymentSettings.mayaNumber` from `<input class="filter-input" [(ngModel)]="settings.paymentSettings.mayaNumber" (ngModelChange)="markDirty()" />`
  - Line 107: `settings.paymentSettings.bankName` from `<input class="filter-input" [(ngModel)]="settings.paymentSettings.bankName" (ngModelChange)="markDirty()" />`
  - Line 111: `settings.paymentSettings.bankAccountName` from `<input class="filter-input" [(ngModel)]="settings.paymentSettings.bankAccountName" (ngModelChange)="markDirty()" />`
  - Line 115: `settings.paymentSettings.bankAccountNumber` from `<input class="filter-input" [(ngModel)]="settings.paymentSettings.bankAccountNumber" (ngModelChange)="markDirty()" />`
  - Line 128: `settings.privacyPolicyText` from `<textarea class="filter-input" rows="8" [(ngModel)]="settings.privacyPolicyText" (ngModelChange)="markDirty()" >`
- Event/raw template lines detected:
  - Template line 8: `<button class="btn-primary" type="button" (click)="saveSettings()" [disabled]="isLoading || !draft">`
  - Template line 14: `<button`
  - Template line 19: `(click)="selectedTab = tab.id"`
  - Template line 34: `<input class="filter-input" [(ngModel)]="settings.clinicName" (ngModelChange)="markDirty()" />`
  - Template line 38: `<input type="file" class="filter-input" (change)="onLogoSelected($event)" />`
  - Template line 43: `<textarea class="filter-input" rows="3" [(ngModel)]="settings.address" (ngModelChange)="markDirty()"></textarea>`
  - Template line 47: `<input class="filter-input" [(ngModel)]="settings.phone" (ngModelChange)="markDirty()" />`
  - Template line 51: `<input class="filter-input" type="email" [(ngModel)]="settings.email" (ngModelChange)="markDirty()" />`
  - Template line 55: `<input class="filter-input" [(ngModel)]="settings.facebookUrl" (ngModelChange)="markDirty()" />`
  - Template line 59: `<input class="filter-input" [(ngModel)]="settings.instagramUrl" (ngModelChange)="markDirty()" />`
  - Template line 78: `<input type="checkbox" [(ngModel)]="settings.isPayAtClinicMode" (ngModelChange)="markDirty()" />`
  - Template line 83: `<input class="filter-input" type="number" [(ngModel)]="settings.cancellationDeadlineHours" (ngModelChange)="markDirty()" />`
  - Template line 87: `<input class="filter-input" type="number" [(ngModel)]="settings.payAtClinicNoShowWindowMinutes" (ngModelChange)="markDirty()" />`
  - Template line 91: `<input class="filter-input" [(ngModel)]="settings.paymentSettings.gcashAccountName" (ngModelChange)="markDirty()" />`
  - Template line 95: `<input class="filter-input" [(ngModel)]="settings.paymentSettings.gcashNumber" (ngModelChange)="markDirty()" />`
  - Template line 99: `<input class="filter-input" [(ngModel)]="settings.paymentSettings.mayaAccountName" (ngModelChange)="markDirty()" />`
  - Template line 103: `<input class="filter-input" [(ngModel)]="settings.paymentSettings.mayaNumber" (ngModelChange)="markDirty()" />`
  - Template line 107: `<input class="filter-input" [(ngModel)]="settings.paymentSettings.bankName" (ngModelChange)="markDirty()" />`
  - Template line 111: `<input class="filter-input" [(ngModel)]="settings.paymentSettings.bankAccountName" (ngModelChange)="markDirty()" />`
  - Template line 115: `<input class="filter-input" [(ngModel)]="settings.paymentSettings.bankAccountNumber" (ngModelChange)="markDirty()" />`
  - Template line 128: `[(ngModel)]="settings.privacyPolicyText"`
  - Template line 141: `<button type="button" class="btn-outline" (click)="openConsentModal()">Bump Consent Version</button>`
  - Template line 170: `<button class="btn-primary" type="button" (click)="saveSettings()" [disabled]="isLoading">`
- Child components/selectors rendered by template: `app-color-picker`, `app-confirm-modal`, `app-operating-hours-editor`, `app-skeleton`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|put|'settings', this.cloneSettings(this.draft)).pipe(|src/app/portals/admin/settings/settings.page.ts:324|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/admin/audit-logs`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/audit-logs|
|Page/component file|src/app/portals/admin/audit-logs/audit-logs.page.ts|
|Component class|AuditLogsPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService
- API calls detected in component: get('audit-logs').subscribe((logs) => {) line 106

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- [UNCLEAR] No button/link/routerLink/click handler detected in this page template.
- Form/input controls detected:
  - Line 13: `entityFilter` from `<select class="filter-input" [(ngModel)]="entityFilter" (ngModelChange)="applyFilters()">`
  - Line 22: `searchTerm` from `<input class="filter-input" [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()" placeholder="Search action, user, or entity ID" />`
  - Line 29: `dateFrom` from `<input type="date" class="filter-input" [(ngModel)]="dateFrom" (ngModelChange)="applyFilters()" />`
  - Line 33: `dateTo` from `<input type="date" class="filter-input" [(ngModel)]="dateTo" (ngModelChange)="applyFilters()" />`
- Event/raw template lines detected:
  - Template line 13: `<select class="filter-input" [(ngModel)]="entityFilter" (ngModelChange)="applyFilters()">`
  - Template line 22: `[(ngModel)]="searchTerm"`
  - Template line 29: `<input type="date" class="filter-input" [(ngModel)]="dateFrom" (ngModelChange)="applyFilters()" />`
  - Template line 33: `<input type="date" class="filter-input" [(ngModel)]="dateTo" (ngModelChange)="applyFilters()" />`
- Child components/selectors rendered by template: `app-empty-state`, `app-skeleton`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'audit-logs').subscribe((logs) => {|src/app/portals/admin/audit-logs/audit-logs.page.ts:106|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Loading.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/admin/reports`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/reports|
|Page/component file|src/app/portals/admin/reports/reports.page.ts|
|Component class|ReportsPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /admin has authGuard, roleGuard, firstLoginGuard with data.roles=[Admin]; child layout also repeats those guards|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|ADMIN_NAV_ITEMS sidebar where listed; detail/form routes via buttons/row actions/programmatic router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, Router, ToastController
- API calls detected in component: get('reports/unpaid-completed-visits').subscribe((rows) => {) line 171, get('reports/pending-follow-ups').subscribe((rows) => {) line 176, get('reports/daily-booking-summary').subscribe((rows) => {) line 181

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 8: `<button class="btn-outline" type="button" (click)="exportCsv()">`; visible text/context: `Export CSV Date From`
  - Line 50: `<button class="btn-ghost" type="button" (click)="viewBooking(row.bookingId)">`; visible text/context: `View booking <app-empty-state icon="cash-outline" title="No unpaid completed visits" description="Al`
  - Line 85: `<button class="btn-ghost" type="button" (click)="sendReminder(row)">`; visible text/context: `Send reminder <app-empty-state icon="refresh-outline" title="No pending follow-ups" description="The`
- Form/input controls detected:
  - Line 14: `dateFrom` from `<input type="date" class="filter-input" [(ngModel)]="dateFrom" (ngModelChange)="applyFilters()" />`
  - Line 18: `dateTo` from `<input type="date" class="filter-input" [(ngModel)]="dateTo" (ngModelChange)="applyFilters()" />`
- Event/raw template lines detected:
  - Template line 8: `<button class="btn-outline" type="button" (click)="exportCsv()">Export CSV</button>`
  - Template line 14: `<input type="date" class="filter-input" [(ngModel)]="dateFrom" (ngModelChange)="applyFilters()" />`
  - Template line 18: `<input type="date" class="filter-input" [(ngModel)]="dateTo" (ngModelChange)="applyFilters()" />`
  - Template line 50: `<button class="btn-ghost" type="button" (click)="viewBooking(row.bookingId)">View booking</button>`
  - Template line 85: `<button class="btn-ghost" type="button" (click)="sendReminder(row)">Send reminder</button>`
- Programmatic navigation detected:
  - TS line 195: `router.navigate(['/admin/bookings', bookingId])`
- Child components/selectors rendered by template: `app-empty-state`, `app-skeleton`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'reports/unpaid-completed-visits').subscribe((rows) => {|src/app/portals/admin/reports/reports.page.ts:171|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'reports/pending-follow-ups').subscribe((rows) => {|src/app/portals/admin/reports/reports.page.ts:176|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'reports/daily-booking-summary').subscribe((rows) => {|src/app/portals/admin/reports/reports.page.ts:181|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Loading, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

## Staff Routes

### `/staff/dashboard`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/dashboard|
|Page/component file|src/app/portals/staff/dashboard/staff-dashboard.page.ts|
|Component class|StaffDashboardPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /staff has authGuard, roleGuard, firstLoginGuard with data.roles=[Staff]; staff child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|STAFF_NAV_ITEMS sidebar where listed; detail routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, BookingService, ClinicDashboardRealtimeService, DestroyRef, DoctorStateService, PatientStateService, Router
- API calls detected in component: patch('bookings/' + event.bookingId + '/check-in', {}).subscribe()) line 201, patch('bookings/' + event.bookingId + '/undo-check-in', {}).subscribe()) line 204

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- [UNCLEAR] No button/link/routerLink/click handler detected in this page template.
- Event/raw template lines detected:
  - Template line 52: `(click)="goToPaymentQueue()"`
- Programmatic navigation detected:
  - TS line 191: `router.navigate(['/staff/payments'])`
  - TS line 195: `router.navigate(['/staff/bookings', bookingId])`
- Child components/selectors rendered by template: `app-queue-table`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|patch|'bookings/' + event.bookingId + '/check-in', {}).subscribe()|src/app/portals/staff/dashboard/staff-dashboard.page.ts:201|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'bookings/' + event.bookingId + '/undo-check-in', {}).subscribe()|src/app/portals/staff/dashboard/staff-dashboard.page.ts:204|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Error, Loading.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/staff/bookings`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/bookings|
|Page/component file|src/app/portals/staff/bookings/staff-bookings.page.ts|
|Component class|StaffBookingsPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /staff has authGuard, roleGuard, firstLoginGuard with data.roles=[Staff]; staff child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|STAFF_NAV_ITEMS sidebar where listed; detail routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ActivatedRoute, ApiService, ClinicDashboardRealtimeService, DestroyRef, Router, ToastController
- API calls detected in component: get('doctors').subscribe({) line 264, patch('bookings/' + booking.id + '/check-in', {}).subscribe({) line 333, patch('bookings/' + booking.id + '/undo-check-in', {}).subscribe({) line 349, get('bookings/staff/all?page=' + this.currentPage + '&pageSize=' + this.pageSize).subscribe({) line 401

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 24: `<button type="button" class="btn-icon" (click)="refresh()" [disabled]="isLoading">`; visible text/context: `⟳ Refresh Loading bookings… 0; else emptyState"> <div class="ta`
  - Line 48: `<tr *ngFor="let booking of bookings" class="booking-row" tabindex="0" role="button" [attr.aria-label]="'Open booking for ' + (booking.patientName || 'patient')" (click)="openBooking(booking.id)" (keyd`; visible text/context: `{{ booking.patientName || 'Patient' }} {`
  - Line 58: `<button type="button" class="booking-link" (click)="openBooking(booking.id, $event)">`; visible text/context: `{{ booking.patientName || 'Patient' }} {{ booking.doctorName || 'Doctor' }} {{ servicesLabel(booking`
  - Line 81: `<button *ngIf="booking.status === 'Confirmed'" type="button" class="btn-primary" (click)="checkIn(booking, $event)" [disabled]="actionBookingId === booking.id" >`; visible text/context: `Check In <button *ngIf="booking.status === 'CheckedIn'" type="button" class="btn-outline" (click)="u`
  - Line 90: `<button *ngIf="booking.status === 'CheckedIn'" type="button" class="btn-outline" (click)="undoCheckIn(booking, $event)" [disabled]="actionBookingId === booking.id" >`; visible text/context: `Undo Check-In 1"> <button class="btn-ghost pagination__button"`
  - Line 107: `<button class="btn-ghost pagination__button" type="button" (click)="previousPage()" [disabled]="currentPage <= 1 || isLoading">`; visible text/context: `Previous Page {{ currentPage }} of {{ totalPages }} = totalPages || isLoading"> Next`
  - Line 111: `<button class="btn-ghost pagination__button" type="button" (click)="nextPage()" [disabled]="currentPage >`; visible text/context: `= totalPages || isLoading"> Next 0"> <div class="mobile-card" *ngFor="let booking of bookings" tabin`
  - Line 119: `<div class="mobile-card" *ngFor="let booking of bookings" tabindex="0" role="button" [attr.aria-label]="'Open booking for ' + (booking.patientName || 'patient')" (click)="openBooking(booking.id)" (key`; visible text/context: `{{ booking.patientName || 'Patient' }} {{ booking.doctorName || 'Doctor' }} <span class="mobile-card`
  - Line 161: `<button *ngIf="booking.status === 'Confirmed'" type="button" class="btn-primary btn-full" (click)="checkIn(booking, $event)" [disabled]="actionBookingId === booking.id" >`; visible text/context: `Check In <button *ngIf="booking.status === 'CheckedIn'" type="button" class="btn-outline btn-full" (`
  - Line 170: `<button *ngIf="booking.status === 'CheckedIn'" type="button" class="btn-outline btn-full" (click)="undoCheckIn(booking, $event)" [disabled]="actionBookingId === booking.id" >`; visible text/context: `Undo Check-In 1"> Previous`
  - Line 183: `<button class="btn-ghost pagination__button" type="button" (click)="previousPage()" [disabled]="currentPage <= 1 || isLoading">`; visible text/context: `Previous Page {{ currentPage }} of {{ totalPages }} = totalPages || isLoading"> Next`
  - Line 187: `<button class="btn-ghost pagination__button" type="button" (click)="nextPage()" [disabled]="currentPage >`; visible text/context: `= totalPages || isLoading"> Next <app-empty-state icon="calendar-outline" title="No bookings found" `
- Form/input controls detected:
  - Line 8: `doctorFilter` from `<select class="filter-input" [(ngModel)]="doctorFilter" (ngModelChange)="onFiltersChanged()">`
  - Line 13: `statusFilter` from `<select class="filter-input" [(ngModel)]="statusFilter" (ngModelChange)="onFiltersChanged()">`
  - Line 20: `dateValue` from `<input type="date" class="filter-input filter-date" [(ngModel)]="dateValue" (ngModelChange)="onDateChanged()" />`
- Event/raw template lines detected:
  - Template line 8: `<select class="filter-input" [(ngModel)]="doctorFilter" (ngModelChange)="onFiltersChanged()">`
  - Template line 13: `<select class="filter-input" [(ngModel)]="statusFilter" (ngModelChange)="onFiltersChanged()">`
  - Template line 20: `[(ngModel)]="dateValue"`
  - Template line 24: `<button type="button" class="btn-icon" (click)="refresh()" [disabled]="isLoading">`
  - Template line 54: `(click)="openBooking(booking.id)"`
  - Template line 58: `<button type="button" class="booking-link" (click)="openBooking(booking.id, $event)">`
  - Template line 81: `<button`
  - Template line 85: `(click)="checkIn(booking, $event)"`
  - Template line 90: `<button`
  - Template line 94: `(click)="undoCheckIn(booking, $event)"`
  - Template line 107: `<button class="btn-ghost pagination__button" type="button" (click)="previousPage()" [disabled]="currentPage <= 1 || isLoading">`
  - Template line 111: `<button class="btn-ghost pagination__button" type="button" (click)="nextPage()" [disabled]="currentPage >= totalPages || isLoading">`
  - Template line 125: `(click)="openBooking(booking.id)"`
  - Template line 161: `<button`
  - Template line 165: `(click)="checkIn(booking, $event)"`
  - Template line 170: `<button`
  - Template line 174: `(click)="undoCheckIn(booking, $event)"`
  - Template line 183: `<button class="btn-ghost pagination__button" type="button" (click)="previousPage()" [disabled]="currentPage <= 1 || isLoading">`
  - Template line 187: `<button class="btn-ghost pagination__button" type="button" (click)="nextPage()" [disabled]="currentPage >= totalPages || isLoading">`
- Programmatic navigation detected:
  - TS line 327: `router.navigate(['/staff/bookings', bookingId])`
- Child components/selectors rendered by template: `app-empty-state`, `app-page-header`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'doctors').subscribe({|src/app/portals/staff/bookings/staff-bookings.page.ts:264|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'bookings/' + booking.id + '/check-in', {}).subscribe({|src/app/portals/staff/bookings/staff-bookings.page.ts:333|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'bookings/' + booking.id + '/undo-check-in', {}).subscribe({|src/app/portals/staff/bookings/staff-bookings.page.ts:349|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/staff/all?page=' + this.currentPage + '&pageSize=' + this.pageSize).subscribe({|src/app/portals/staff/bookings/staff-bookings.page.ts:401|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/staff/payments`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/payments|
|Page/component file|src/app/portals/staff/payments/staff-payments.page.ts|
|Component class|StaffPaymentsPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /staff has authGuard, roleGuard, firstLoginGuard with data.roles=[Staff]; staff child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|STAFF_NAV_ITEMS sidebar where listed; detail routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, ClinicDashboardRealtimeService, DestroyRef, ToastController
- API calls detected in component: patch('payments/' + bookingId + '/confirm', {) line 371, patch('payments/' + this.waiveTarget.bookingId + '/waive', { reason: waiveReason }).subscribe({) line 422, get('bookings/staff/for-payment?page=' + this.currentPage + '&pageSize=' + safePageSize).pipe() line 478

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 86: `<button type="button" class="btn-primary" (click)="openPaymentModal(item)">`; visible text/context: `Confirm Payment Waive PF &mdash;`
  - Line 87: `<button type="button" class="btn-outline" (click)="openWaiveModal(item)">`; visible text/context: `Waive PF &mdash; <div class="mc" *n`
  - Line 117: `<button type="button" class="btn-primary" (click)="openPaymentModal(item)">`; visible text/context: `Confirm Payment Waive PF &mdash; <div class="p`
  - Line 118: `<button type="button" class="btn-outline" (click)="openWaiveModal(item)">`; visible text/context: `Waive PF &mdash; 1"> <button type="button" class="btn-ghost" (click)="previousPage()" [disabled]="`
  - Line 126: `<button type="button" class="btn-ghost" (click)="previousPage()" [disabled]="currentPage <= 1 || isLoading">`; visible text/context: `Previous Page {{ currentPage }} of {{ totalPages }} = totalPages || isLoading">Next <ng-template #em`
  - Line 128: `<button type="button" class="btn-ghost" (click)="nextPage()" [disabled]="currentPage >`; visible text/context: `= totalPages || isLoading">Next <app-empty-state icon="cash-outline" title="No queue items for now."`
  - Line 141: `<div *ngIf="paymentModalOpen" class="pb" (click)="closePaymentModal()">`; visible text/context: `Collect Payment <button type`
  - Line 145: `<button type="button" class="btn-ghost" (click)="closePaymentModal()">`; visible text/context: `&times; Patient {{ item.patientName || 'Unknown Patient' }} Doctor {{ item.doctorName || 'Doctor' }}`
  - Line 161: `<button type="button" class="btn-outline" (click)="closePaymentModal()">`; visible text/context: `Cancel {{ isSubmitting ? 'Confirming...' : 'Confirm Payment' }} <app-confirm-modal *ngIf="waiveModal`
  - Line 162: `<button type="button" class="btn-primary" [disabled]="isSubmitting" (click)="confirmPayment()">`; visible text/context: `{{ isSubmitting ? 'Confirming...' : 'Confirm Payment' }} <app-confirm-modal *ngIf="waiveModalOpen" [`
- Form/input controls detected:
  - Line 155: `paymentMethod` from `<select class="filter-input" name="paymentMethod" [(ngModel)]="paymentMethod" [ngModelOptions]="{ standalone: true }">`
  - Line 156: `amountReceived` from `<input class="filter-input" type="number" min="0" name="amountReceived" [(ngModel)]="amountReceived" [ngModelOptions]="{ standalone: true }" />`
  - Line 157: `referenceNumber` from `<input class="filter-input" type="text" name="referenceNumber" [(ngModel)]="referenceNumber" [ngModelOptions]="{ standalone: true }" />`
  - Line 158: `notes` from `<textarea class="filter-input" rows="3" name="paymentNotes" [(ngModel)]="notes" [ngModelOptions]="{ standalone: true }">`
- Event/raw template lines detected:
  - Template line 86: `<button type="button" class="btn-primary" (click)="openPaymentModal(item)">Confirm Payment</button>`
  - Template line 87: `<button type="button" class="btn-outline" (click)="openWaiveModal(item)">Waive PF</button>`
  - Template line 117: `<button type="button" class="btn-primary" (click)="openPaymentModal(item)">Confirm Payment</button>`
  - Template line 118: `<button type="button" class="btn-outline" (click)="openWaiveModal(item)">Waive PF</button>`
  - Template line 126: `<button type="button" class="btn-ghost" (click)="previousPage()" [disabled]="currentPage <= 1 || isLoading">Previous</button>`
  - Template line 128: `<button type="button" class="btn-ghost" (click)="nextPage()" [disabled]="currentPage >= totalPages || isLoading">Next</button>`
  - Template line 141: `<div *ngIf="paymentModalOpen" class="pb" (click)="closePaymentModal()">`
  - Template line 142: `<section class="pw" role="dialog" aria-modal="true" aria-labelledby="collect-payment-title" (click)="$event.stopPropagation()">`
  - Template line 145: `<button type="button" class="btn-ghost" (click)="closePaymentModal()">&times;</button>`
  - Template line 155: `<div class="pd"><label>Payment Method</label><select class="filter-input" name="paymentMethod" [(ngModel)]="paymentMethod" [ngModelOptions]="{ standalone: true }"><option *ngFor="let method of paymentMethods" [value]="method.value">{{ metho`
  - Template line 156: `<div class="pd"><label>Amount Received</label><input class="filter-input" type="number" min="0" name="amountReceived" [(ngModel)]="amountReceived" [ngModelOptions]="{ standalone: true }" /></div>`
  - Template line 157: `<div class="pd"><label>Reference Number <span style="color:#94a3b8;font-weight:400">(optional)</span></label><input class="filter-input" type="text" name="referenceNumber" [(ngModel)]="referenceNumber" [ngModelOptions]="{ standalone: true }`
  - Template line 158: `<div class="pd" style="grid-column:1/-1"><label>Notes <span style="color:#94a3b8;font-weight:400">(optional)</span></label><textarea class="filter-input" rows="3" name="paymentNotes" [(ngModel)]="notes" [ngModelOptions]="{ standalone: true `
  - Template line 161: `<button type="button" class="btn-outline" (click)="closePaymentModal()">Cancel</button>`
  - Template line 162: `<button type="button" class="btn-primary" [disabled]="isSubmitting" (click)="confirmPayment()">{{ isSubmitting ? 'Confirming...' : 'Confirm Payment' }}</button>`
- Child components/selectors rendered by template: `app-confirm-modal`, `app-empty-state`, `app-page-header`, `app-receipt-modal`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|patch|'payments/' + bookingId + '/confirm', {|src/app/portals/staff/payments/staff-payments.page.ts:371|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'payments/' + this.waiveTarget.bookingId + '/waive', { reason: waiveReason }).subscribe({|src/app/portals/staff/payments/staff-payments.page.ts:422|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/staff/for-payment?page=' + this.currentPage + '&pageSize=' + safePageSize).pipe(|src/app/portals/staff/payments/staff-payments.page.ts:478|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/staff/bookings/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/bookings/:id|
|Page/component file|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts|
|Component class|StaffBookingDetailPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /staff has authGuard, roleGuard, firstLoginGuard with data.roles=[Staff]; staff child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|STAFF_NAV_ITEMS sidebar where listed; detail routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Route parameter required: id
- Injected dependencies: ActivatedRoute, ApiService, ClinicSettingsService, DestroyRef, Router, ToastController
- API calls detected in component: patch('bookings/' + this.booking.id + '/check-in', {}).subscribe({) line 518, patch('bookings/' + this.booking.id + '/undo-check-in', {}).subscribe({) line 537, patch('payments/' + bookingId + '/confirm', {) line 595, get('bookings/' + bookingId).pipe() line 603, patch('payments/' + this.booking.id + '/waive', { reason: waiveReason }).subscribe({) line 666, get('payments/' + paymentId).pipe() line 687, get('bookings/' + bookingId) : of(undefined)).pipe() line 695

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 8: `<button type="button" class="btn-ghost" (click)="goBack()">`; visible text/context: `Back to Bookings Booking Details {{ booking.id }} <app-status-badge [status]="booking.status" [label`
  - Line 98: `<button *ngIf="canCheckIn" class="btn-primary" type="button" [disabled]="isActing" (click)="checkIn()" >`; visible text/context: `Check In`
  - Line 108: `<button *ngIf="canUndoCheckIn" class="btn-outline" type="button" [disabled]="isActing" (click)="undoCheckIn()" >`; visible text/context: `Undo Check-In <button *ngIf="canConfirmPayment" class="btn-primary" type="button" [disabled]="isActi`
  - Line 118: `<button *ngIf="canConfirmPayment" class="btn-primary" type="button" [disabled]="isActing" (click)="openPaymentModal()" >`; visible text/context: `Confirm Payment`
  - Line 128: `<button *ngIf="canWaivePf" class="btn-outline" type="button" [disabled]="isActing" (click)="openWaiveModal()" >`; visible text/context: `Waive PF`
  - Line 138: `<button *ngIf="canPrintDocument" class="btn-ghost" type="button" [disabled]="isActing" (click)="printBookingDocument()" >`; visible text/context: `{{ printActionLabel }} No actions available`
  - Line 174: `<ion-button fill="clear" (click)="closePaymentModal()">`; visible text/context: `Close {{ patientDisplayName }} {{ doctorDisplayName }}</p`
  - Line 233: `<button type="button" class="btn-outline" (click)="closePaymentModal()">`; visible text/context: `Cancel {{ isActing ? 'Confirming...' : 'Confirm Payment' }} <app-con`
  - Line 234: `<button type="button" class="btn-primary" [disabled]="isActing" (click)="confirmPayment()">`; visible text/context: `{{ isActing ? 'Confirming...' : 'Confirm Payment' }} <app-confirm-modal class="no-print" [isOpen]="w`
- Form/input controls detected:
  - Line 191: `paymentMethod` from `<select class="filter-input" name="paymentMethod" [(ngModel)]="paymentMethod" [ngModelOptions]="{ standalone: true }" >`
  - Line 205: `amountReceived` from `<input class="filter-input" type="number" min="0" name="amountReceived" [(ngModel)]="amountReceived" [ngModelOptions]="{ standalone: true }" />`
  - Line 216: `referenceNumber` from `<input class="filter-input" type="text" name="referenceNumber" [(ngModel)]="referenceNumber" [ngModelOptions]="{ standalone: true }" />`
  - Line 227: `notes` from `<textarea class="filter-input" rows="3" name="paymentNotes" [(ngModel)]="notes" [ngModelOptions]="{ standalone: true }" >`
- Event/raw template lines detected:
  - Template line 8: `<button type="button" class="btn-ghost" (click)="goBack()">Back to Bookings</button>`
  - Template line 98: `<button`
  - Template line 103: `(click)="checkIn()"`
  - Template line 108: `<button`
  - Template line 113: `(click)="undoCheckIn()"`
  - Template line 118: `<button`
  - Template line 123: `(click)="openPaymentModal()"`
  - Template line 128: `<button`
  - Template line 133: `(click)="openWaiveModal()"`
  - Template line 138: `<button`
  - Template line 143: `(click)="printBookingDocument()"`
  - Template line 151: `<button class="btn-ghost" type="button" disabled>No actions available</button>`
  - Template line 173: `<ion-buttons slot="end">`
  - Template line 174: `<ion-button fill="clear" (click)="closePaymentModal()">Close</ion-button>`
  - Template line 175: `</ion-buttons>`
  - Template line 191: `[(ngModel)]="paymentMethod"`
  - Template line 205: `[(ngModel)]="amountReceived"`
  - Template line 216: `[(ngModel)]="referenceNumber"`
  - Template line 227: `[(ngModel)]="notes"`
  - Template line 233: `<button type="button" class="btn-outline" (click)="closePaymentModal()">Cancel</button>`
  - Template line 234: `<button type="button" class="btn-primary" [disabled]="isActing" (click)="confirmPayment()">`
- Programmatic navigation detected:
  - TS line 480: `router.navigate(['/staff/bookings'])`
- Child components/selectors rendered by template: `app-avatar`, `app-booking-print-document`, `app-confirm-modal`, `app-receipt-modal`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|patch|'bookings/' + this.booking.id + '/check-in', {}).subscribe({|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:518|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'bookings/' + this.booking.id + '/undo-check-in', {}).subscribe({|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:537|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'payments/' + bookingId + '/confirm', {|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:595|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/' + bookingId).pipe(|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:603|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'payments/' + this.booking.id + '/waive', { reason: waiveReason }).subscribe({|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:666|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'payments/' + paymentId).pipe(|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:687|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/' + bookingId) : of(undefined)).pipe(|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:695|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/staff/walk-in`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/walk-in|
|Page/component file|src/app/portals/staff/walk-in/staff-walk-in.page.ts|
|Component class|StaffWalkInPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /staff has authGuard, roleGuard, firstLoginGuard with data.roles=[Staff]; staff child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|STAFF_NAV_ITEMS sidebar where listed; detail routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ActivatedRoute, ApiService, BookingAvailabilityService, DestroyRef, FormBuilder, Router, ToastController
- API calls detected in component: post('patients', dto))) line 891, post('bookings', {}))) line 939, get('bookings/' + bookingId))) line 947, get(endpoint).pipe() line 1002, get('services').pipe() line 1092

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 13: `<button type="button" class="stepper__step" [class.is-active]="currentWalkInStep === 1" [class.is-complete]="isStepComplete(1)" [disabled]="!canAccessStep(1)" (click)="goToStep(1)" >`; visible text/context: `1 Patient Search or register <button`
  - Line 28: `<button type="button" class="stepper__step" [class.is-active]="currentWalkInStep === 2" [class.is-complete]="isStepComplete(2)" [disabled]="!canAccessStep(2)" (click)="goToStep(2)" >`; visible text/context: `2 Slot Doctor and schedule <button`
  - Line 43: `<button type="button" class="stepper__step" [class.is-active]="currentWalkInStep === 3" [class.is-complete]="isStepComplete(3)" [disabled]="!canAccessStep(3)" (click)="goToStep(3)" >`; visible text/context: `3 Payment Review and confirm`
  - Line 89: `<button type="button" class="mobile-card patient-result" *ngFor="let patient of searchResults; trackBy: trackById" [attr.aria-label]="'Select patient ' + patientDisplayName(patient)" (click)="selectPa`; visible text/context: `{{ patientDisplayName(patient) }} {{ patient.patientCode }}`
  - Line 221: `<button type="button" class="btn-ghost" (click)="cancelQuickRegister()">`; visible text/context: `Cancel {{ isSavingPatient ? 'Creating...' : 'Create Patient' }} <ap`
  - Line 261: `<button type="button" class="btn-outline" (click)="clearSelectedPatient()">`; visible text/context: `Change Patient Doctor * <ion-item class="clinic-input" lines="n`
  - Line 338: `<button type="button" class="btn-ghost" (click)="goToStep(1)">`; visible text/context: `Back Payment <p class="panel-hi`
  - Line 364: `<button type="button" class="btn-outline" (click)="clearSelectedPatient()">`; visible text/context: `Change Patient Patient {{ patientDisplayName(selectedPatie`
  - Line 429: `<button type="button" class="btn-ghost" (click)="goToStep(2)">`; visible text/context: `Back {{ isSavingBooking ? 'Creating...' : 'Create Booking' }}`
  - Line 430: `<button type="button" class="btn-primary" [disabled]="!canSubmitBooking || isSavingBooking" (click)="createBooking()">`; visible text/context: `{{ isSavingBooking ? 'Creating...' : 'Create Booking' }} Booking`
- Form/input controls detected:
  - Line 136: `firstName` from `<ion-input formControlName="firstName" autocomplete="given-name" placeholder="First name">`
  - Line 145: `middleName` from `<ion-input formControlName="middleName" autocomplete="additional-name" placeholder="Middle name">`
  - Line 153: `lastName` from `<ion-input formControlName="lastName" autocomplete="family-name" placeholder="Last name">`
  - Line 162: `dateOfBirth` from `<ion-input type="date" formControlName="dateOfBirth">`
  - Line 171: `sex` from `<ion-select formControlName="sex" interface="popover" placeholder="Select sex">`
  - Line 183: `contactNumber` from `<ion-input formControlName="contactNumber" autocomplete="tel" placeholder="Contact number">`
  - Line 191: `email` from `<ion-input type="email" formControlName="email" autocomplete="email" placeholder="Email">`
  - Line 201: `address` from `<ion-input formControlName="address" autocomplete="street-address" placeholder="Address">`
  - Line 209: `preparePortalAccount` from `<ion-checkbox formControlName="preparePortalAccount">`
  - Line 270: `doctorId` from `<ion-select formControlName="doctorId" interface="popover" placeholder="Select doctor">`
  - Line 285: `serviceId` from `<ion-select formControlName="serviceId" interface="popover" placeholder="Select service" [disabled]="isLoadingServices || !bookingForm.controls.doctorId.value || services.length === 0" >`
  - Line 309: `appointmentDate` from `<ion-input type="date" formControlName="appointmentDate" [min]="todayIso">`
- Reactive forms declared in component:
  - `quickRegisterForm` line 589; controls: `firstName, middleName, lastName, dateOfBirth, sex, contactNumber, email, address, preparePortalAccount`
  - `bookingForm` line 600; controls: `doctorId, serviceId, appointmentDate`
- Validators detected in TS: `Validators.required, Validators.email`. Exact field-to-validator mapping should be verified against component source. [TEAM TO VERIFY]
- Event/raw template lines detected:
  - Template line 13: `<button`
  - Template line 19: `(click)="goToStep(1)"`
  - Template line 28: `<button`
  - Template line 34: `(click)="goToStep(2)"`
  - Template line 43: `<button`
  - Template line 49: `(click)="goToStep(3)"`
  - Template line 89: `<button type="button" class="mobile-card patient-result" *ngFor="let patient of searchResults; trackBy: trackById" [attr.aria-label]="'Select patient ' + patientDisplayName(patient)" (click)="selectPatient(patient)">`
  - Template line 130: `<form class="quick-register" *ngIf="showQuickRegister" [formGroup]="quickRegisterForm" novalidate (ngSubmit)="createPatient()">`
  - Template line 136: `<ion-input formControlName="firstName" autocomplete="given-name" placeholder="First name"></ion-input>`
  - Template line 145: `<ion-input formControlName="middleName" autocomplete="additional-name" placeholder="Middle name"></ion-input>`
  - Template line 153: `<ion-input formControlName="lastName" autocomplete="family-name" placeholder="Last name"></ion-input>`
  - Template line 162: `<ion-input type="date" formControlName="dateOfBirth"></ion-input>`
  - Template line 171: `<ion-select formControlName="sex" interface="popover" placeholder="Select sex">`
  - Template line 183: `<ion-input formControlName="contactNumber" autocomplete="tel" placeholder="Contact number"></ion-input>`
  - Template line 191: `<ion-input type="email" formControlName="email" autocomplete="email" placeholder="Email"></ion-input>`
  - Template line 201: `<ion-input formControlName="address" autocomplete="street-address" placeholder="Address"></ion-input>`
  - Template line 209: `<ion-checkbox formControlName="preparePortalAccount"></ion-checkbox>`
  - Template line 221: `<button type="button" class="btn-ghost" (click)="cancelQuickRegister()">Cancel</button>`
  - Template line 222: `<button type="submit" class="btn-primary" [disabled]="isSavingPatient">`
  - Template line 261: `<button type="button" class="btn-outline" (click)="clearSelectedPatient()">Change Patient</button>`
  - Template line 270: `<ion-select formControlName="doctorId" interface="popover" placeholder="Select doctor">`
  - Template line 285: `formControlName="serviceId"`
  - Template line 309: `<ion-input type="date" formControlName="appointmentDate" [min]="todayIso"></ion-input>`
  - Template line 338: `<button type="button" class="btn-ghost" (click)="goToStep(1)">Back</button>`
  - Template line 364: `<button type="button" class="btn-outline" (click)="clearSelectedPatient()">Change Patient</button>`
  - Template line 429: `<button type="button" class="btn-ghost" (click)="goToStep(2)">Back</button>`
  - Template line 430: `<button type="button" class="btn-primary" [disabled]="!canSubmitBooking || isSavingBooking" (click)="createBooking()">`
- Programmatic navigation detected:
  - TS line 929: `router.navigate(['/staff/bookings'])`
- Child components/selectors rendered by template: `app-empty-state`, `app-slot-grid`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|post|'patients', dto))|src/app/portals/staff/walk-in/staff-walk-in.page.ts:891|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|post|'bookings', {}))|src/app/portals/staff/walk-in/staff-walk-in.page.ts:939|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/' + bookingId))|src/app/portals/staff/walk-in/staff-walk-in.page.ts:947|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|endpoint).pipe(|src/app/portals/staff/walk-in/staff-walk-in.page.ts:1002|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'services').pipe(|src/app/portals/staff/walk-in/staff-walk-in.page.ts:1092|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/staff/patients`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/patients|
|Page/component file|src/app/portals/staff/patients/staff-patients.page.ts|
|Component class|StaffPatientsPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /staff has authGuard, roleGuard, firstLoginGuard with data.roles=[Staff]; staff child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|STAFF_NAV_ITEMS sidebar where listed; detail routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, DestroyRef, Router
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 12: `<button *ngIf="searchControl.value" type="button" class="btn-ghost" (click)="searchControl.setValue(''); $event.stopPropagation()">`; visible text/context: `Clear {{ countLabel }} 0"> <th`
  - Line 34: `<tr *ngFor="let patient of patients" tabindex="0" role="button" [attr.aria-label]="'Open patient record for ' + patientDisplayName(patient)" (click)="openDetail(patient.id)" (keydown.enter)="openDetai`; visible text/context: `{{ patient.patientCode }} {{ patientDisplayName(patient) }} {{ patient.sex }} {{ patient.dateOfBirth`
  - Line 48: `<div class="mc" *ngFor="let patient of patients" tabindex="0" role="button" [attr.aria-label]="'Open patient record for ' + patientDisplayName(patient)" (click)="openDetail(patient.id)" (keydown.enter`; visible text/context: `{{ patientDisplayName(patient) }} {{ patient.patientCode }} <app-status-badge [status]="patientAccou`
- Event/raw template lines detected:
  - Template line 12: `<button *ngIf="searchControl.value" type="button" class="btn-ghost" (click)="searchControl.setValue(''); $event.stopPropagation()">Clear</button>`
  - Template line 34: `<tr *ngFor="let patient of patients" tabindex="0" role="button" [attr.aria-label]="'Open patient record for ' + patientDisplayName(patient)" (click)="openDetail(patient.id)" (keydown.enter)="openDetail(patient.id)">`
  - Template line 48: `<div class="mc" *ngFor="let patient of patients" tabindex="0" role="button" [attr.aria-label]="'Open patient record for ' + patientDisplayName(patient)" (click)="openDetail(patient.id)" (keydown.enter)="openDetail(patient.id)">`
- Programmatic navigation detected:
  - TS line 147: `router.navigate(['/staff/patients', id])`
- Child components/selectors rendered by template: `app-empty-state`, `app-skeleton`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/staff/patients/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/patients/:id|
|Page/component file|src/app/portals/staff/patient-detail/staff-patient-detail.page.ts|
|Component class|StaffPatientDetailPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /staff has authGuard, roleGuard, firstLoginGuard with data.roles=[Staff]; staff child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|STAFF_NAV_ITEMS sidebar where listed; detail routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Route parameter required: id
- Injected dependencies: ActivatedRoute, ApiService, BookingService, DestroyRef, FormBuilder, Router, ToastController
- API calls detected in component: post('patients/' + this.patient.id + '/portal-account', {) line 192

#### 3. Full Interaction Audit
- Template file: `src/app/portals/staff/patient-detail/staff-patient-detail.page.html`
- Clickable/navigation elements detected:
  - Line 4: `<button type="button" class="btn-ghost" (click)="back()">`; visible text/context: `Back to Patients Staff patient record {{ patientDisplayName() }} Patient Detail <div class="`
  - Line 36: `<button type="button" class="btn-primary" (click)="retry()">`; visible text/context: `Retry Back to Patients`
  - Line 37: `<button type="button" class="btn-ghost" (click)="back()">`; visible text/context: `Back to Patients Overview</ion-`
- Form/input controls detected:
  - Line 122: `email` from `<input class="portal-account-input" type="email" formControlName="email" autocomplete="email" placeholder="Patient email" />`
  - Line 131: `temporaryPassword` from `<input class="portal-account-input" type="password" formControlName="temporaryPassword" autocomplete="new-password" placeholder="Temporary password" />`
  - Line 143: `confirmTemporaryPassword` from `<input class="portal-account-input" type="password" formControlName="confirmTemporaryPassword" autocomplete="new-password" placeholder="Confirm temporary password" />`
- Reactive forms declared in component:
  - `portalAccountForm` line 52; controls: `email, temporaryPassword, confirmTemporaryPassword`
- Validators detected in TS: `Validators.required, Validators.email`. Exact field-to-validator mapping should be verified against component source. [TEAM TO VERIFY]
- Event/raw template lines detected:
  - Template line 4: `<button type="button" class="btn-ghost" (click)="back()">Back to Patients</button>`
  - Template line 36: `<button type="button" class="btn-primary" (click)="retry()">Retry</button>`
  - Template line 37: `<button type="button" class="btn-ghost" (click)="back()">Back to Patients</button>`
  - Template line 43: `<ion-segment [value]="selectedTab" (ionChange)="setSelectedTab($event.detail.value)">`
  - Template line 118: `<form class="portal-account-form" [formGroup]="portalAccountForm" novalidate (ngSubmit)="createPortalAccount()">`
  - Template line 122: `<input class="portal-account-input" type="email" formControlName="email" autocomplete="email" placeholder="Patient email" />`
  - Template line 131: `formControlName="temporaryPassword"`
  - Template line 143: `formControlName="confirmTemporaryPassword"`
  - Template line 155: `<button`
- Programmatic navigation detected:
  - TS line 74: `router.navigate(['/staff/patients'])`
- Child components/selectors rendered by template: `app-avatar`, `app-empty-state`, `app-patient-media-panel`, `app-skeleton`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|post|'patients/' + this.patient.id + '/portal-account', {|src/app/portals/staff/patient-detail/staff-patient-detail.page.ts:192|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/staff/doctor-status`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/doctor-status|
|Page/component file|src/app/portals/staff/doctor-status/doctor-status.page.ts|
|Component class|DoctorStatusPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /staff has authGuard, roleGuard, firstLoginGuard with data.roles=[Staff]; staff child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|STAFF_NAV_ITEMS sidebar where listed; detail routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, DestroyRef, DoctorStateService, ToastController
- API calls detected in component: post('doctor-day-status/' + event.doctorId + '/status', {) line 176

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 36: `<button type="button" class="btn-primary" (click)="loadDoctors()">`; visible text/context: `Retry`
- Event/raw template lines detected:
  - Template line 36: `<button type="button" class="btn-primary" (click)="loadDoctors()">Retry</button>`
- Child components/selectors rendered by template: `app-doctor-status-card`, `app-empty-state`, `app-page-header`, `app-skeleton`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|post|'doctor-day-status/' + event.doctorId + '/status', {|src/app/portals/staff/doctor-status/doctor-status.page.ts:176|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/staff/profile`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/profile|
|Page/component file|src/app/portals/staff/profile/staff-profile.page.ts|
|Component class|StaffProfilePage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /staff has authGuard, roleGuard, firstLoginGuard with data.roles=[Staff]; staff child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|STAFF_NAV_ITEMS sidebar where listed; detail routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, AuthStateService, FormBuilder, ToastController
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- [UNCLEAR] No button/link/routerLink/click handler detected in this page template.
- Form/input controls detected:
  - Line 10: `fullName` from `<input class="filter-input" formControlName="fullName" />`
  - Line 13: `contactNumber` from `<input class="filter-input" formControlName="contactNumber" />`
  - Line 26: `currentPassword` from `<input class="filter-input" type="password" formControlName="currentPassword" />`
  - Line 29: `newPassword` from `<input class="filter-input" type="password" formControlName="newPassword" />`
  - Line 47: `confirmPassword` from `<input class="filter-input" type="password" formControlName="confirmPassword" />`
- Reactive forms declared in component:
  - `personalForm` line 95; controls: `fullName, contactNumber`
  - `passwordForm` line 100; controls: `currentPassword, newPassword, confirmPassword`
- Validators detected in TS: `Validators.required`. Exact field-to-validator mapping should be verified against component source. [TEAM TO VERIFY]
- Event/raw template lines detected:
  - Template line 8: `<form class="profile-form" [formGroup]="personalForm" (ngSubmit)="saveProfile()">`
  - Template line 10: `<input class="filter-input" formControlName="fullName" />`
  - Template line 13: `<input class="filter-input" formControlName="contactNumber" />`
  - Template line 18: `<button class="btn-primary" type="submit">Save Changes</button>`
  - Template line 24: `<form class="profile-form" [formGroup]="passwordForm" (ngSubmit)="changePassword()">`
  - Template line 26: `<input class="filter-input" type="password" formControlName="currentPassword" />`
  - Template line 29: `<input class="filter-input" type="password" formControlName="newPassword" />`
  - Template line 47: `<input class="filter-input" type="password" formControlName="confirmPassword" />`
  - Template line 53: `<button class="btn-primary" type="submit" [disabled]="changingPassword">Change Password</button>`
- Child components/selectors rendered by template: `app-page-header`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Error, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

## Doctor Routes

### `/doctor/dashboard`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/dashboard|
|Page/component file|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts|
|Component class|DoctorDashboardPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /doctor has authGuard, roleGuard, firstLoginGuard with data.roles=[Doctor]; doctor child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|DOCTOR_NAV_ITEMS sidebar where listed; appointment/patient/consultation routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, AuthStateService, ClinicDashboardRealtimeService, DestroyRef, Router, ToastController
- API calls detected in component: get('doctors/me').pipe() line 253, get('bookings/doctor/today').pipe() line 264, get('bookings/doctor/today-summary').pipe() line 269, get('doctors/' + doc.id + '/schedule').pipe() line 286, get('doctors/' + doc.id + '/day-status').pipe() line 290, post('doctors/' + this.doctor.id + '/day-status', {) line 317

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 31: `<button type="button" class="np-banner__btn np-banner__btn--primary" (click)="startConsult(next.id)">`; visible text/context: `Start Consult View Chart <span`
  - Line 32: `<button type="button" class="np-banner__btn np-banner__btn--ghost" (click)="viewChart(next.patientId)">`; visible text/context: `View Chart Booked Today {{ summary?.bookedToday ?? 0 }} All appointments </div`
  - Line 52: `<div class="qi" *ngFor="let b of queueItems" [ngClass]="queueItemClass(b)" (click)="openAppointment(b.id)">`; visible text/context: `{{ b.patientName || 'Patient' }} <sp`
  - Line 77: `<button class="ab ab--available" [class.active]="todayStatus === 'Available'" (click)="updateStatus('Available')">`; visible text/context: `Mark Available <button class="ab ab--late" [class.active]="todayStatus === 'RunningLate'" [disabled]`
  - Line 80: `<button class="ab ab--late" [class.active]="todayStatus === 'RunningLate'" [disabled]="runningLateMinutes < 5" (click)="updateStatus('RunningLate')">`; visible text/context: `Running Late Unavailable Today <div class="clinic-`
  - Line 82: `<button class="ab ab--unavailable" [class.active]="todayStatus === 'UnavailableToday'" (click)="updateStatus('UnavailableToday')">`; visible text/context: `Unavailable Today Working Schedule 0; else noSchedule"> <div class="sr2 sr2--today"`
  - Line 111: `<a class="cl" routerLink="/doctor/schedule">`; visible text/context: `Manage Schedule &rarr; Profile Specialization {{ doctor.specialization || '--' }} </`
  - Line 121: `<a class="cl" routerLink="/doctor/profile">`; visible text/context: `Edit Profile &rarr; <app-empty-state icon="medical-outline" title="Unable to load dashboard" descrip`
- Form/input controls detected:
  - Line 79: `runningLateMinutes` from `<input class="fi2" type="number" min="5" [(ngModel)]="runningLateMinutes" />`
- Event/raw template lines detected:
  - Template line 31: `<button type="button" class="np-banner__btn np-banner__btn--primary" (click)="startConsult(next.id)">Start Consult</button>`
  - Template line 32: `<button type="button" class="np-banner__btn np-banner__btn--ghost" (click)="viewChart(next.patientId)">View Chart</button>`
  - Template line 52: `<div class="qi" *ngFor="let b of queueItems" [ngClass]="queueItemClass(b)" (click)="openAppointment(b.id)">`
  - Template line 77: `<button class="ab ab--available" [class.active]="todayStatus === 'Available'" (click)="updateStatus('Available')">Mark Available</button>`
  - Template line 79: `<input class="fi2" type="number" min="5" [(ngModel)]="runningLateMinutes" />`
  - Template line 80: `<button class="ab ab--late" [class.active]="todayStatus === 'RunningLate'" [disabled]="runningLateMinutes < 5" (click)="updateStatus('RunningLate')">Running Late</button>`
  - Template line 82: `<button class="ab ab--unavailable" [class.active]="todayStatus === 'UnavailableToday'" (click)="updateStatus('UnavailableToday')">Unavailable Today</button>`
  - Template line 111: `<a class="cl" routerLink="/doctor/schedule">Manage Schedule &rarr;</a>`
  - Template line 121: `<a class="cl" routerLink="/doctor/profile">Edit Profile &rarr;</a>`
- Programmatic navigation detected:
  - TS line 333: `router.navigate(['/doctor/appointments', id])`
  - TS line 337: `router.navigate(['/doctor/appointments', bookingId])`
  - TS line 341: `router.navigate(['/doctor/patients', patientId])`
- Child components/selectors rendered by template: `app-avatar`, `app-empty-state`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'doctors/me').pipe(|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:253|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/doctor/today').pipe(|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:264|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/doctor/today-summary').pipe(|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:269|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'doctors/' + doc.id + '/schedule').pipe(|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:286|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'doctors/' + doc.id + '/day-status').pipe(|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:290|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|post|'doctors/' + this.doctor.id + '/day-status', {|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:317|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/doctor/appointments`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/appointments|
|Page/component file|src/app/portals/doctor/appointments/doctor-appointments.page.ts|
|Component class|DoctorAppointmentsPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /doctor has authGuard, roleGuard, firstLoginGuard with data.roles=[Doctor]; doctor child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|DOCTOR_NAV_ITEMS sidebar where listed; appointment/patient/consultation routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, BookingService, ClinicDashboardRealtimeService, DestroyRef, Router, ToastController
- API calls detected in component: get('bookings/doctor/today').pipe() line 368, get('bookings/doctor/today-summary').pipe() line 374, patch('bookings/' + bookingId + '/doctor-complete', payload).pipe() line 480, patch('payments/' + bookingId + '/waive', {) line 483

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 48: `<button type="button" class="btn-ghost filters-grid__refresh" (click)="loadSummary()" [disabled]="isLoading">`; visible text/context: `↻ Refresh Loading today's queue... <ng-container *ngIf="!`
  - Line 95: `<button *ngIf="booking.status === 'Confirmed'" type="button" class="btn-primary" (click)="consult(booking.id)" >`; visible text/context: `Start Consultation <button *ngIf="booking.status === 'CheckedIn' || booking.status === 'InProgress'"`
  - Line 103: `<button *ngIf="booking.status === 'CheckedIn' || booking.status === 'InProgress'" type="button" class="btn-outline" (click)="openCompleteModal(booking)" >`; visible text/context: `Complete View <s`
  - Line 111: `<button type="button" class="btn-ghost" (click)="view(booking.id)">`; visible text/context: `View 0"> <article class="mobile-card appointment-card" *ngFor="let booking o`
  - Line 128: `<button type="button" class="btn-ghost" (click)="view(booking.id)">`; visible text/context: `View Status`
  - Line 152: `<button *ngIf="booking.status === 'Confirmed'" type="button" class="btn-primary" (click)="consult(booking.id)" >`; visible text/context: `Start Consultation <button *ngIf="booking.status === 'CheckedIn' || booking.status === 'InProgress'"`
  - Line 160: `<button *ngIf="booking.status === 'CheckedIn' || booking.status === 'InProgress'" type="button" class="btn-outline" (click)="openCompleteModal(booking)" >`; visible text/context: `Complete`
  - Line 180: `<ion-button fill="clear" (click)="closeCompleteModal()">`; visible text/context: `Close {{ selectedBooking.patientName || 'Patient' }}`
  - Line 191: `<button type="button" [class.active]="!isProfessionalFeeWaived" (click)="setWaived(false)">`; visible text/context: `Charge PF Waive PF Final Amount <inp`
  - Line 192: `<button type="button" [class.active]="isProfessionalFeeWaived" (click)="setWaived(true)">`; visible text/context: `Waive PF Final Amount <div class="clini`
  - Line 221: `<button type="button" class="btn-outline" (click)="closeCompleteModal()">`; visible text/context: `Cancel {{ isSubmittingComplete ? 'Saving...' : 'Complete Booking' }} </i`
  - Line 222: `<button type="button" class="btn-primary" [disabled]="isSubmittingComplete" (click)="submitCompletion()">`; visible text/context: `{{ isSubmittingComplete ? 'Saving...' : 'Complete Booking' }}`
- Form/input controls detected:
  - Line 39: `selectedFilter` from `<select [(ngModel)]="selectedFilter">`
  - Line 45: `searchQuery` from `<input type="search" [(ngModel)]="searchQuery" placeholder="Search queue" />`
  - Line 197: `finalAmount` from `<input class="filter-input" type="number" min="0" [(ngModel)]="finalAmount" />`
  - Line 202: `professionalFeeWaivedReason` from `<textarea class="filter-input" rows="3" [(ngModel)]="professionalFeeWaivedReason">`
  - Line 207: `soapNotes` from `<textarea class="filter-input" rows="3" [(ngModel)]="soapNotes">`
  - Line 212: `doctorFeeNotes` from `<textarea class="filter-input" rows="3" [(ngModel)]="doctorFeeNotes">`
  - Line 217: `notes` from `<textarea class="filter-input" rows="3" [(ngModel)]="notes">`
- Event/raw template lines detected:
  - Template line 39: `<select [(ngModel)]="selectedFilter">`
  - Template line 45: `<input type="search" [(ngModel)]="searchQuery" placeholder="Search queue" />`
  - Template line 48: `<button type="button" class="btn-ghost filters-grid__refresh" (click)="loadSummary()" [disabled]="isLoading">`
  - Template line 95: `<button`
  - Template line 99: `(click)="consult(booking.id)"`
  - Template line 103: `<button`
  - Template line 107: `(click)="openCompleteModal(booking)"`
  - Template line 111: `<button type="button" class="btn-ghost" (click)="view(booking.id)">View</button>`
  - Template line 128: `<button type="button" class="btn-ghost" (click)="view(booking.id)">View</button>`
  - Template line 152: `<button`
  - Template line 156: `(click)="consult(booking.id)"`
  - Template line 160: `<button`
  - Template line 164: `(click)="openCompleteModal(booking)"`
  - Template line 179: `<ion-buttons slot="end">`
  - Template line 180: `<ion-button fill="clear" (click)="closeCompleteModal()">Close</ion-button>`
  - Template line 181: `</ion-buttons>`
  - Template line 191: `<button type="button" [class.active]="!isProfessionalFeeWaived" (click)="setWaived(false)">Charge PF</button>`
  - Template line 192: `<button type="button" [class.active]="isProfessionalFeeWaived" (click)="setWaived(true)">Waive PF</button>`
  - Template line 197: `<input class="filter-input" type="number" min="0" [(ngModel)]="finalAmount" />`
  - Template line 202: `<textarea class="filter-input" rows="3" [(ngModel)]="professionalFeeWaivedReason"></textarea>`
  - Template line 207: `<textarea class="filter-input" rows="3" [(ngModel)]="soapNotes"></textarea>`
  - Template line 212: `<textarea class="filter-input" rows="3" [(ngModel)]="doctorFeeNotes"></textarea>`
  - Template line 217: `<textarea class="filter-input" rows="3" [(ngModel)]="notes"></textarea>`
  - Template line 221: `<button type="button" class="btn-outline" (click)="closeCompleteModal()">Cancel</button>`
  - Template line 222: `<button type="button" class="btn-primary" [disabled]="isSubmittingComplete" (click)="submitCompletion()">`
- Programmatic navigation detected:
  - TS line 407: `router.navigate(['/doctor/appointments', bookingId])`
  - TS line 411: `router.navigate(['/doctor/consultation', bookingId])`
- Child components/selectors rendered by template: `app-empty-state`, `app-page-header`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'bookings/doctor/today').pipe(|src/app/portals/doctor/appointments/doctor-appointments.page.ts:368|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/doctor/today-summary').pipe(|src/app/portals/doctor/appointments/doctor-appointments.page.ts:374|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'bookings/' + bookingId + '/doctor-complete', payload).pipe(|src/app/portals/doctor/appointments/doctor-appointments.page.ts:480|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'payments/' + bookingId + '/waive', {|src/app/portals/doctor/appointments/doctor-appointments.page.ts:483|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/doctor/appointments/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/appointments/:id|
|Page/component file|src/app/portals/doctor/appointment-detail/doctor-appointment-detail.page.ts|
|Component class|DoctorAppointmentDetailPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /doctor has authGuard, roleGuard, firstLoginGuard with data.roles=[Doctor]; doctor child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|DOCTOR_NAV_ITEMS sidebar where listed; appointment/patient/consultation routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Route parameter required: id
- Injected dependencies: ActivatedRoute, ApiService, AuthStateService, Router
- API calls detected in component: get('bookings/' + bookingId).pipe() line 203

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 121: `<button type="button" class="btn-primary" (click)="openConsultation(detail.booking.id)">`; visible text/context: `{{ consultationActionLabel(detail.booking) }} <button *ngIf="detail.booking.status === 'Completed'" `
  - Line 124: `<button *ngIf="detail.booking.status === 'Completed'" type="button" class="btn-ghost" (click)="openConsultation(detail.booking.id, true)" >`; visible text/context: `Edit / Amend Consultation Back to appointments Payment Summary`
  - Line 132: `<button type="button" class="btn-ghost" (click)="back()">`; visible text/context: `Back to appointments Payment Summary Total Fee {{ detail.booking.totalFee | currency:'PHP':'symbol-n`
- Event/raw template lines detected:
  - Template line 121: `<button type="button" class="btn-primary" (click)="openConsultation(detail.booking.id)">`
  - Template line 124: `<button`
  - Template line 128: `(click)="openConsultation(detail.booking.id, true)"`
  - Template line 132: `<button type="button" class="btn-ghost" (click)="back()">Back to appointments</button>`
- Programmatic navigation detected:
  - TS line 224: `router.navigate(['/doctor/consultation', bookingId], amend ? { queryParams: { amend: '1' } } : undefined)`
  - TS line 228: `router.navigate(['/doctor/appointments'])`
- Child components/selectors rendered by template: `app-empty-state`, `app-page-header`, `app-patient-media-panel`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'bookings/' + bookingId).pipe(|src/app/portals/doctor/appointment-detail/doctor-appointment-detail.page.ts:203|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/doctor/patients`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/patients|
|Page/component file|src/app/portals/doctor/patients/doctor-patients.page.ts|
|Component class|DoctorPatientsPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /doctor has authGuard, roleGuard, firstLoginGuard with data.roles=[Doctor]; doctor child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|DOCTOR_NAV_ITEMS sidebar where listed; appointment/patient/consultation routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, Router
- API calls detected in component: get('bookings/doctor/patients').pipe() line 121

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 18: `<div class="pi" *ngFor="let p of filteredPatients" tabindex="0" role="button" (click)="openClinicalHistory(p.patientId)" (keydown.enter)="openClinicalHistory(p.patientId)" [attr.aria-label]="'View pat`; visible text/context: `{{ p.patientName }} {{ p.services }} </app-s`
  - Line 26: `<button class="vb" (click)="openAppointment($event, p.latestBookingId)">`; visible text/context: `View Appointment Clinical History {{ formatLatestVisitDate(p.latestDate) }}`
  - Line 27: `<button class="vb" (click)="openClinicalHistoryFromButton($event, p.patientId)">`; visible text/context: `Clinical History {{ formatLatestVisitDate(p.latestDate) }} {{ latestTime }}`
- Form/input controls detected:
  - Line 11: `searchQuery` from `<input class="si" [(ngModel)]="searchQuery" placeholder="Search by patient name..." />`
- Event/raw template lines detected:
  - Template line 11: `<input class="si" [(ngModel)]="searchQuery" placeholder="Search by patient name..." />`
  - Template line 18: `<div class="pi" *ngFor="let p of filteredPatients" tabindex="0" role="button" (click)="openClinicalHistory(p.patientId)" (keydown.enter)="openClinicalHistory(p.patientId)" [attr.aria-label]="'View patient ' + p.patientName">`
  - Template line 26: `<button class="vb" (click)="openAppointment($event, p.latestBookingId)">View Appointment</button>`
  - Template line 27: `<button class="vb" (click)="openClinicalHistoryFromButton($event, p.patientId)">Clinical History</button>`
- Programmatic navigation detected:
  - TS line 84: `router.navigate(['/doctor/patients', patientId])`
  - TS line 95: `router.navigate(['/doctor/appointments', bookingId])`
- Child components/selectors rendered by template: `app-empty-state`, `app-skeleton`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'bookings/doctor/patients').pipe(|src/app/portals/doctor/patients/doctor-patients.page.ts:121|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/doctor/patients/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/patients/:id|
|Page/component file|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts|
|Component class|DoctorPatientDetailPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /doctor has authGuard, roleGuard, firstLoginGuard with data.roles=[Doctor]; doctor child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|DOCTOR_NAV_ITEMS sidebar where listed; appointment/patient/consultation routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Route parameter required: id
- Injected dependencies: ActivatedRoute, ApiService, MedicalRecordsService, ModalController
- API calls detected in component: get('patients/' + patientId))) line 320, get('bookings?patientId=' + patientId + '&pageSize=50')),) line 333, get('medical-records/consultations?patientId=' + patientId).pipe() line 336, get('medical-records/prescriptions?patientId=' + patientId).pipe() line 339, get('medical-records/lab-results?patientId=' + patientId).pipe() line 342, get('medical-records/vaccinations?patientId=' + patientId).pipe() line 345, get('medical-records/follow-ups?patientId=' + patientId).pipe() line 348, get('bookings/' + bookingId + '/consultation-record').pipe() line 494

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 66: `<a *ngIf="item.bookingId" class="timeline-link" [routerLink]="['/doctor/appointments', item.bookingId]">`; visible text/context: `View Appointment &rarr; 0; else emptyAppointments"> <div class="apt-car`
  - Line 82: `<a class="btn-sm" [routerLink]="['/doctor/appointments', a.bookingId]">`; visible text/context: `View {{ a.doctorName }} Queue: #{{ a.queueNumber }} {{ a.paymentStatus }}`
  - Line 102: `<a *ngIf="c.bookingId" class="btn-sm" [routerLink]="['/doctor/appointments', c.bookingId]">`; visible text/context: `View Diagnosis {{ c.diagnosesSummary }} Notes {{ c.generalNotes }} <div class`
  - Line 138: `<button *ngIf="lr.fileUrl" class="btn-sm" (click)="viewFile(lr.fileUrl, lr.resultTitle || lr.fileName || 'lab-result')">`; visible text/context: `View 0; else emptyDocuments"> <div class="doc-card clinic-card" *ngFor="let d of history.do`
  - Line 149: `<button *ngIf="d.fileUrl" class="btn-sm" (click)="viewFile(d.fileUrl, d.fileName || d.title || 'file')">`; visible text/context: `View 0; else emptyVaccinations"> <div class="vac-card clinic-card" *ngFor="let v of h`
  - Line 181: `<button class="btn-sm" (click)="retry()">`; visible text/context: `Retry <app-em`
- Event/raw template lines detected:
  - Template line 37: `<ion-segment [value]="activeTab" (ionChange)="onTabChange($event)">`
  - Template line 66: `<a *ngIf="item.bookingId" class="timeline-link" [routerLink]="['/doctor/appointments', item.bookingId]">View Appointment &rarr;</a>`
  - Template line 82: `<a class="btn-sm" [routerLink]="['/doctor/appointments', a.bookingId]">View</a>`
  - Template line 102: `<a *ngIf="c.bookingId" class="btn-sm" [routerLink]="['/doctor/appointments', c.bookingId]">View</a>`
  - Template line 138: `<button *ngIf="lr.fileUrl" class="btn-sm" (click)="viewFile(lr.fileUrl, lr.resultTitle || lr.fileName || 'lab-result')">View</button>`
  - Template line 149: `<button *ngIf="d.fileUrl" class="btn-sm" (click)="viewFile(d.fileUrl, d.fileName || d.title || 'file')">View</button>`
  - Template line 181: `<button class="btn-sm" (click)="retry()">Retry</button>`
- Child components/selectors rendered by template: `app-empty-state`, `app-page-header`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'patients/' + patientId))|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:320|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings?patientId=' + patientId + '&pageSize=50')),|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:333|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/consultations?patientId=' + patientId).pipe(|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:336|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/prescriptions?patientId=' + patientId).pipe(|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:339|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/lab-results?patientId=' + patientId).pipe(|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:342|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/vaccinations?patientId=' + patientId).pipe(|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:345|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/follow-ups?patientId=' + patientId).pipe(|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:348|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/' + bookingId + '/consultation-record').pipe(|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:494|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/doctor/schedule`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/schedule|
|Page/component file|src/app/portals/doctor/schedule/doctor-schedule.page.ts|
|Component class|DoctorSchedulePage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /doctor has authGuard, roleGuard, firstLoginGuard with data.roles=[Doctor]; doctor child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|DOCTOR_NAV_ITEMS sidebar where listed; appointment/patient/consultation routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, DestroyRef, ToastController
- API calls detected in component: get('doctors/me').pipe() line 98, get('doctors/' + doctor.id + '/schedule').pipe() line 125, get('doctors/' + doctor.id + '/blocked-dates').pipe() line 128, put('doctors/' + this.doctorId + '/schedule', {) line 166, put('doctors/' + this.doctorId, {) line 174, post('doctors/' + this.doctorId + '/blocked-dates', {) line 200, delete('doctors/' + this.doctorId + '/blocked-dates/' + id).pipe() line 223

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 23: `<button type="button" class="btn-primary" (click)="loadData()">`; visible text/context: `Retry <app-doctor-schedule-editor [schedules]="draftSchedules" [blockedDates]="blockedDates" [previe`
- Event/raw template lines detected:
  - Template line 23: `<button type="button" class="btn-primary" (click)="loadData()">Retry</button>`
- Child components/selectors rendered by template: `app-doctor-schedule-editor`, `app-skeleton`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'doctors/me').pipe(|src/app/portals/doctor/schedule/doctor-schedule.page.ts:98|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'doctors/' + doctor.id + '/schedule').pipe(|src/app/portals/doctor/schedule/doctor-schedule.page.ts:125|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'doctors/' + doctor.id + '/blocked-dates').pipe(|src/app/portals/doctor/schedule/doctor-schedule.page.ts:128|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|put|'doctors/' + this.doctorId + '/schedule', {|src/app/portals/doctor/schedule/doctor-schedule.page.ts:166|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|put|'doctors/' + this.doctorId, {|src/app/portals/doctor/schedule/doctor-schedule.page.ts:174|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|post|'doctors/' + this.doctorId + '/blocked-dates', {|src/app/portals/doctor/schedule/doctor-schedule.page.ts:200|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|delete|'doctors/' + this.doctorId + '/blocked-dates/' + id).pipe(|src/app/portals/doctor/schedule/doctor-schedule.page.ts:223|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/doctor/consultation/:bookingId`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/consultation/:bookingId|
|Page/component file|src/app/portals/doctor/consultation/doctor-consultation.page.ts|
|Component class|DoctorConsultationPage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /doctor has authGuard, roleGuard, firstLoginGuard with data.roles=[Doctor]; doctor child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|DOCTOR_NAV_ITEMS sidebar where listed; appointment/patient/consultation routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Route parameter required: bookingId
- Injected dependencies: ActivatedRoute, ApiService, AuthStateService, MedicalRecordsService, ModalController, OfflineConsultationQueueService, PatientClinicalHistoryService, PatientStateService, PatientVaccinationsService, Router, ToastController
- API calls detected in component: get('doctors/me').pipe() line 727, get('audit-logs').pipe() line 754, post('/consultation-requests/request-attending-physician', {) line 958, post('audit-logs',) line 1883, get('bookings/' + booking.id + '/consultation-record').pipe() line 2748, get('medical-records/consultations?patientId=' + patientId).pipe() line 2775, get('medical-records/prescriptions?patientId=' + patientId).pipe() line 2779, get('medical-records/allergies?patientId=' + patientId).pipe() line 2783; ...

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 8: `<a class="cvh__back" routerLink="/doctor/appointments">`; visible text/context: `&larr; Back to Appointments History COMPLETED`
  - Line 10: `<button class="cr-btn cr-btn--secondary" type="button" (click)="openHistoryDrawer(vm)">`; visible text/context: `History COMPLETED {{ getCompletionStatusText(vm) }} <button class="cr-btn cr-btn--second`
  - Line 15: `<button class="cr-btn cr-btn--secondary cvh__modify" type="button" (click)="enterAmendMode(vm)">`; visible text/context: `Edit Consultation <div class="cvh__avatar" [ngStyle]="getPatientAvatarStyl`
  - Line 94: `<button class="cr-btn cr-btn--secondary" type="button" (click)="openHistoryDrawer(vm)">`; visible text/context: `History <span class="cr-save-state__icon"`
  - Line 107: `<button *ngIf="!isAmendMode" class="cr-btn cr-btn--secondary cvh__modify" type="button" (click)="enterAmendMode(vm)">`; visible text/context: `Edit Consultation {{ isSavingAmendment ? 'Sav`
  - Line 111: `<button *ngIf="isAmendMode" class="cr-btn cr-btn--primary" (click)="saveAmendment(vm)" [disabled]="isSavingAmendment">`; visible text/context: `{{ isSavingAmendment ? 'Saving...' : 'Save Changes' }} Cancel <di`
  - Line 114: `<button *ngIf="isAmendMode" class="cr-btn cr-btn--outline" type="button" (click)="cancelAmendMode()">`; visible text/context: `Cancel Discard unsaved changes? <button type="button" clas`
  - Line 120: `<button type="button" class="cr-btn cr-btn--secondary" (click)="keepEditing()">`; visible text/context: `Keep Editing Discard Changes`
  - Line 121: `<button type="button" class="cr-btn cr-btn--outline" (click)="discardEditChanges(vm)">`; visible text/context: `Discard Changes <a class="cr-btn" routerLink="/doctor/appoi`
  - Line 127: `<a class="cr-btn" routerLink="/doctor/appointments">`; visible text/context: `Back to Appointments {{ getDraftButtonLabel() }}`
  - Line 128: `<button class="cr-btn cr-btn--primary" (click)="saveDraft(vm)" [disabled]="isWorkspaceLocked(vm) || isSavingDraft || isAutosaving">`; visible text/context: `{{ getDraftButtonLabel() }} <button *ngIf="currentClinicalRole === 'physician'" class="cr-btn cr-btn`
  - Line 130: `<button *ngIf="currentClinicalRole === 'physician'" class="cr-btn cr-btn--complete" [class.cr-btn--complete--ready]="!isCompleteActionDisabled(vm)" (click)="requestCompletion(vm)" [disabled]="isComple`; visible text/context: `Complete Consultation Consultation can only be completed by the attending physician.`
  - Line 150: `<button type="button" class="cr-network-banner__retry" *ngIf="networkSyncFailed" (click)="retrySync()">`; visible text/context: `Retry sync {{ (vm.patient.firstName?.charAt(0) || '?') }}{{ (vm.patient.lastName?.charAt(0) || '') }`
  - Line 179: `<a *ngFor="let sectionId of mobileSectionIds" [href]="'#' + sectionId" class="cr-mobile-tabs__item" [class.active]="isStepActive(sectionId)" [class.done]="getProgressStepState(sectionId, vm) === 'comp`; visible text/context: `{{ getMobileTabLabel(sectionId) }} You are editing`
  - Line 199: `<button type="button" (click)="saveAmendment(vm)" [disabled]="isSavingAmendment">`; visible text/context: `{{ isSavingAmendment ? 'Saving...' : 'Retry' }} <app-consultation-overview [patient]="vm.patient" [c`
  - Line 245: `<button type="button" class="cr-progress-toggle" (click)="toggleProgressSidebar()" [attr.aria-expanded]="progressSidebarOpen" aria-label="Toggle consultation progress" >`; visible text/context: `[icon-only/UNCLEAR]`
  - Line 271: `<a href="#section-soap" (click)="scrollToSection('section-soap', $event)">`; visible text/context: `{{ getProgressStepIcon('section-soap', vm) }} Notes &amp; SOAP <li class="cr-progress__item"`
  - Line 280: `<a href="#section-vitals" (click)="scrollToSection('section-vitals', $event)">`; visible text/context: `{{ getProgressStepIcon('section-vitals', vm) }} Vitals <li class="cr-progress__item" [c`
  - Line 289: `<a href="#section-diagnosis" (click)="scrollToSection('section-diagnosis', $event)">`; visible text/context: `{{ getProgressStepIcon('section-diagnosis', vm) }} Diagnosis <li class="cr-progress__item"`
  - Line 298: `<a href="#section-prescription" (click)="scrollToSection('section-prescription', $event)">`; visible text/context: `{{ getProgressStepIcon('section-prescription', vm) }} Prescription <li class="cr-progress__item"`
  - Line 307: `<a href="#section-lab-orders" (click)="scrollToSection('section-lab-orders', $event)">`; visible text/context: `{{ getProgressStepIcon('section-lab-orders', vm) }} Lab Orders <li class="cr-progress__item"`
  - Line 316: `<a href="#section-followup" (click)="scrollToSection('section-followup', $event)">`; visible text/context: `{{ getProgressStepIcon('section-followup', vm) }} Follow-up <li *ngIf="currentClinicalRole !== 'nurs`
  - Line 325: `<a href="#section-pf-decision" (click)="scrollToSection('section-pf-decision', $event)">`; visible text/context: `{{ getProgressStepIcon('section-pf-decision', vm) }} PF Decision <div`
  - Line 339: `<div class="cr-side-backdrop" [class.is-visible]="progressSidebarOpen" (click)="closeProgressSidebar()">`; visible text/context: `<button type="button" class="cr-mobile-actions__btn cr-mobile-actions__btn--outline cr-mobile-action`
  - Line 344: `<button type="button" class="cr-mobile-actions__btn cr-mobile-actions__btn--outline cr-mobile-actions__btn--full" (click)="enterAmendMode(vm)">`; visible text/context: `Edit Consultation <button type="button" class="cr`
  - Line 351: `<button type="button" class="cr-mobile-actions__btn cr-mobile-actions__btn--outline cr-mobile-actions__btn--cancel" (click)="cancelAmendMode()">`; visible text/context: `Cancel {{ isSavingAmendment ? 'Saving...' : 'Sa`
  - Line 354: `<button type="button" class="cr-mobile-actions__btn cr-mobile-actions__btn--primary cr-mobile-actions__btn--save" (click)="saveAmendment(vm)" [disabled]="isSavingAmendment">`; visible text/context: `{{ isSavingAmendment ? 'Saving...' : 'Save Changes' }} Discard unsaved changes? <div class="cr-cance`
  - Line 360: `<button type="button" class="cr-btn cr-btn--secondary" (click)="keepEditing()">`; visible text/context: `Keep Editing Discard Changes <ng-template #mobileActiveActi`
  - Line 361: `<button type="button" class="cr-btn cr-btn--outline" (click)="discardEditChanges(vm)">`; visible text/context: `Discard Changes`
  - Line 367: `<button type="button" class="cr-mobile-actions__btn cr-mobile-actions__btn--outline" (click)="saveDraft(vm)">`; visible text/context: `Save Draft Complete ▶`
  - Line 370: `<button *ngIf="currentClinicalRole === 'physician'" type="button" class="cr-mobile-actions__btn cr-mobile-actions__btn--primary" (click)="requestCompletion(vm)" [disabled]="isCompleteActionDisabled(vm`; visible text/context: `Complete ▶ Physician Only </d`
  - Line 387: `<div class="shortcut-backdrop" *ngIf="shortcutsHelpOpen" (click)="shortcutsHelpOpen = false">`; visible text/context: `[icon-only/UNCLEAR]`
  - Line 398: `<button type="button" class="shortcut-modal__close" (click)="shortcutsHelpOpen = false" aria-label="Close shortcuts help">`; visible text/context: `× Shortcut Action Ctrl/Cmd + S Save Draft Ctrl/Cmd + Enter Open Complete Consultation flow`
  - Line 418: `<div class="history-drawer-backdrop" *ngIf="historyDrawerOpen" (click)="closeHistoryDrawer()">`; visible text/context: `Consultation Edit History Chronological edit events for`
  - Line 425: `<button type="button" class="history-drawer__close" (click)="closeHistoryDrawer()">`; visible text/context: `&times; 0; else emptyHistory"> <li class="history-item" [class.history-item--amendment]="entry.tone `
- Event/raw template lines detected:
  - Template line 8: `<a class="cvh__back" routerLink="/doctor/appointments">&larr; Back to Appointments</a>`
  - Template line 10: `<button class="cr-btn cr-btn--secondary" type="button" (click)="openHistoryDrawer(vm)">History</button>`
  - Template line 15: `<button class="cr-btn cr-btn--secondary cvh__modify" type="button" (click)="enterAmendMode(vm)">`
  - Template line 94: `<button class="cr-btn cr-btn--secondary" type="button" (click)="openHistoryDrawer(vm)">History</button>`
  - Template line 107: `<button *ngIf="!isAmendMode" class="cr-btn cr-btn--secondary cvh__modify" type="button" (click)="enterAmendMode(vm)">`
  - Template line 111: `<button *ngIf="isAmendMode" class="cr-btn cr-btn--primary" (click)="saveAmendment(vm)" [disabled]="isSavingAmendment">`
  - Template line 114: `<button *ngIf="isAmendMode" class="cr-btn cr-btn--outline" type="button" (click)="cancelAmendMode()">`
  - Template line 120: `<button type="button" class="cr-btn cr-btn--secondary" (click)="keepEditing()">Keep Editing</button>`
  - Template line 121: `<button type="button" class="cr-btn cr-btn--outline" (click)="discardEditChanges(vm)">Discard Changes</button>`
  - Template line 127: `<a class="cr-btn" routerLink="/doctor/appointments">Back to Appointments</a>`
  - Template line 128: `<button class="cr-btn cr-btn--primary" (click)="saveDraft(vm)" [disabled]="isWorkspaceLocked(vm) || isSavingDraft || isAutosaving">{{ getDraftButtonLabel() }}</button>`
  - Template line 130: `<button`
  - Template line 134: `(click)="requestCompletion(vm)"`
  - Template line 150: `<button type="button" class="cr-network-banner__retry" *ngIf="networkSyncFailed" (click)="retrySync()">Retry sync</button>`
  - Template line 186: `(click)="scrollToSection(sectionId, $event)"`
  - Template line 199: `<button type="button" (click)="saveAmendment(vm)" [disabled]="isSavingAmendment">{{ isSavingAmendment ? 'Saving...' : 'Retry' }}</button>`
  - Template line 245: `<button`
  - Template line 248: `(click)="toggleProgressSidebar()"`
  - Template line 271: `<a href="#section-soap" (click)="scrollToSection('section-soap', $event)">`
  - Template line 280: `<a href="#section-vitals" (click)="scrollToSection('section-vitals', $event)">`
  - Template line 289: `<a href="#section-diagnosis" (click)="scrollToSection('section-diagnosis', $event)">`
  - Template line 298: `<a href="#section-prescription" (click)="scrollToSection('section-prescription', $event)">`
  - Template line 307: `<a href="#section-lab-orders" (click)="scrollToSection('section-lab-orders', $event)">`
  - Template line 316: `<a href="#section-followup" (click)="scrollToSection('section-followup', $event)">`
  - Template line 325: `<a href="#section-pf-decision" (click)="scrollToSection('section-pf-decision', $event)">`
  - Template line 339: `<div class="cr-side-backdrop" [class.is-visible]="progressSidebarOpen" (click)="closeProgressSidebar()"></div>`
  - Template line 344: `<button type="button" class="cr-mobile-actions__btn cr-mobile-actions__btn--outline cr-mobile-actions__btn--full" (click)="enterAmendMode(vm)">`
  - Template line 351: `<button type="button" class="cr-mobile-actions__btn cr-mobile-actions__btn--outline cr-mobile-actions__btn--cancel" (click)="cancelAmendMode()">`
  - Template line 354: `<button type="button" class="cr-mobile-actions__btn cr-mobile-actions__btn--primary cr-mobile-actions__btn--save" (click)="saveAmendment(vm)" [disabled]="isSavingAmendment">`
  - Template line 360: `<button type="button" class="cr-btn cr-btn--secondary" (click)="keepEditing()">Keep Editing</button>`
  - Template line 361: `<button type="button" class="cr-btn cr-btn--outline" (click)="discardEditChanges(vm)">Discard Changes</button>`
  - Template line 367: `<button type="button" class="cr-mobile-actions__btn cr-mobile-actions__btn--outline" (click)="saveDraft(vm)">`
  - Template line 370: `<button *ngIf="currentClinicalRole === 'physician'" type="button" class="cr-mobile-actions__btn cr-mobile-actions__btn--primary" (click)="requestCompletion(vm)" [disabled]="isCompleteActionDisabled(vm)">`
  - Template line 373: `<button *ngIf="currentClinicalRole !== 'physician'" type="button" class="cr-mobile-actions__btn cr-mobile-actions__btn--primary" disabled>`
  - Template line 387: `<div class="shortcut-backdrop" *ngIf="shortcutsHelpOpen" (click)="shortcutsHelpOpen = false"></div>`
- Programmatic navigation detected:
  - TS line 1695: `router.navigate(['/doctor/appointments', bookingId])`
- Child components/selectors rendered by template: `app-consultation-overview`, `app-consultation-summary`, `app-consultation-workspace`, `app-empty-state`, `app-patient-clinical-history-drawer`, `app-patient-identity-strip`, `app-patient-media-panel`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'doctors/me').pipe(|src/app/portals/doctor/consultation/doctor-consultation.page.ts:727|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'audit-logs').pipe(|src/app/portals/doctor/consultation/doctor-consultation.page.ts:754|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|post|'/consultation-requests/request-attending-physician', {|src/app/portals/doctor/consultation/doctor-consultation.page.ts:958|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|post|'audit-logs',|src/app/portals/doctor/consultation/doctor-consultation.page.ts:1883|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/' + booking.id + '/consultation-record').pipe(|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2748|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/consultations?patientId=' + patientId).pipe(|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2775|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/prescriptions?patientId=' + patientId).pipe(|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2779|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/allergies?patientId=' + patientId).pipe(|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2783|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/lab-orders?patientId=' + patientId).pipe(|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2787|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/lab-results?patientId=' + patientId).pipe(|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2791|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/vaccinations?patientId=' + patientId).pipe(|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2795|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/follow-ups?patientId=' + patientId).pipe(|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2799|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'patients/' + patientId).pipe(catchError(() => of(null))),|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2820|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings?patientId=' + patientId + '&pageSize=50').pipe(catchError(() => of([] as Record<string, unknown>[]))),|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2821|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/' + bookingId + '/consultation-record').pipe(|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2858|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/' + bookingId).pipe(|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2902|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|post|'bookings/' + bookingId + '/consultation-record', dto).pipe(|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2909|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/' + bookingId + '/consultation-record')),|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2910|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'bookings/' + bookingId + '/doctor-complete', dto).pipe(|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2931|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'payments/' + bookingId + '/waive', {|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2933|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'bookings/' + bookingId + '/doctor-complete', dto)|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2938|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/' + bookingId)),|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2941|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/doctor/my-profile`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/my-profile|
|Page/component file|src/app/portals/doctor/profile/doctor-profile.page.ts|
|Component class|DoctorProfilePage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /doctor has authGuard, roleGuard, firstLoginGuard with data.roles=[Doctor]; doctor child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|DOCTOR_NAV_ITEMS sidebar where listed; appointment/patient/consultation routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, DestroyRef, FormBuilder, ToastController
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 22: `<button type="button" class="photo-preview" (click)="photoInput.click()" [attr.aria-label]="'Upload profile photo'">`; visible text/context: `<ng-template #initialsFal`
  - Line 147: `<a class="edit-link" routerLink="/doctor/schedule">`; visible text/context: `Edit in Schedule → {{ item.label }} {{ item.value }}`
- Form/input controls detected:
  - Line 39: `fullName` from `<input class="profile-input" type="text" formControlName="fullName" />`
  - Line 44: `specialization` from `<input class="profile-input" type="text" formControlName="specialization" />`
  - Line 52: `bio` from `<textarea class="profile-textarea" rows="3" formControlName="bio" placeholder="Describe your practice, experience, and approach to care. This appears on your public booking page." >`
  - Line 63: `consultationFee` from `<input class="profile-input currency-input" type="number" min="0" formControlName="consultationFee" />`
  - Line 73: `licenseNumber` from `<input class="profile-input" [class.warning-input]="!profileForm.get('licenseNumber')?.value" type="text" formControlName="licenseNumber" />`
  - Line 83: `ptrNumber` from `<input class="profile-input" type="text" formControlName="ptrNumber" />`
  - Line 100: `s2Number` from `<input class="profile-input" type="text" formControlName="s2Number" />`
  - Line 166: `currentPassword` from `<input class="profile-input" type="password" formControlName="currentPassword" />`
  - Line 171: `newPassword` from `<input class="profile-input" type="password" formControlName="newPassword" />`
  - Line 191: `confirmPassword` from `<input class="profile-input" type="password" formControlName="confirmPassword" />`
- Reactive forms declared in component:
  - `profileForm` line 271; controls: `fullName, specialization, bio, consultationFee, licenseNumber, ptrNumber, s2Number`
  - `passwordForm` line 281; controls: `currentPassword, newPassword, confirmPassword`
- Validators detected in TS: `Validators.required, Validators.min`. Exact field-to-validator mapping should be verified against component source. [TEAM TO VERIFY]
- Event/raw template lines detected:
  - Template line 12: `<form class="clinic-card profile-form" [formGroup]="profileForm" (ngSubmit)="save()">`
  - Template line 22: `<button type="button" class="photo-preview" (click)="photoInput.click()" [attr.aria-label]="'Upload profile photo'">`
  - Template line 33: `<input #photoInput type="file" accept="image/*" hidden (change)="onPhotoUpload($event)" />`
  - Template line 39: `<input class="profile-input" type="text" formControlName="fullName" />`
  - Template line 44: `<input class="profile-input" type="text" formControlName="specialization" />`
  - Template line 52: `formControlName="bio"`
  - Template line 63: `<input class="profile-input currency-input" type="number" min="0" formControlName="consultationFee" />`
  - Template line 73: `formControlName="licenseNumber"`
  - Template line 83: `<input class="profile-input" type="text" formControlName="ptrNumber" />`
  - Template line 100: `<input class="profile-input" type="text" formControlName="s2Number" />`
  - Template line 109: `<button type="submit" class="btn-primary" [disabled]="profileForm.invalid || isSaving">`
  - Template line 147: `<a class="edit-link" routerLink="/doctor/schedule">Edit in Schedule →</a>`
  - Template line 163: `<form class="profile-form" [formGroup]="passwordForm" (ngSubmit)="changePassword()">`
  - Template line 166: `<input class="profile-input" type="password" formControlName="currentPassword" />`
  - Template line 171: `<input class="profile-input" type="password" formControlName="newPassword" />`
  - Template line 191: `<input class="profile-input" type="password" formControlName="confirmPassword" />`
  - Template line 199: `<button type="submit" class="btn-primary" [disabled]="changingPassword">`
- Child components/selectors rendered by template: `app-empty-state`, `app-page-header`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/doctor/profile`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/profile|
|Page/component file|src/app/portals/doctor/profile/doctor-profile.page.ts|
|Component class|DoctorProfilePage|
|Layout/shell|src/app/shared/components/portal-layout/portal-layout.component.ts|
|Access control|Top-level /doctor has authGuard, roleGuard, firstLoginGuard with data.roles=[Doctor]; doctor child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|DOCTOR_NAV_ITEMS sidebar where listed; appointment/patient/consultation routes via row/cards/buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, DestroyRef, FormBuilder, ToastController
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 22: `<button type="button" class="photo-preview" (click)="photoInput.click()" [attr.aria-label]="'Upload profile photo'">`; visible text/context: `<ng-template #initialsFal`
  - Line 147: `<a class="edit-link" routerLink="/doctor/schedule">`; visible text/context: `Edit in Schedule → {{ item.label }} {{ item.value }}`
- Form/input controls detected:
  - Line 39: `fullName` from `<input class="profile-input" type="text" formControlName="fullName" />`
  - Line 44: `specialization` from `<input class="profile-input" type="text" formControlName="specialization" />`
  - Line 52: `bio` from `<textarea class="profile-textarea" rows="3" formControlName="bio" placeholder="Describe your practice, experience, and approach to care. This appears on your public booking page." >`
  - Line 63: `consultationFee` from `<input class="profile-input currency-input" type="number" min="0" formControlName="consultationFee" />`
  - Line 73: `licenseNumber` from `<input class="profile-input" [class.warning-input]="!profileForm.get('licenseNumber')?.value" type="text" formControlName="licenseNumber" />`
  - Line 83: `ptrNumber` from `<input class="profile-input" type="text" formControlName="ptrNumber" />`
  - Line 100: `s2Number` from `<input class="profile-input" type="text" formControlName="s2Number" />`
  - Line 166: `currentPassword` from `<input class="profile-input" type="password" formControlName="currentPassword" />`
  - Line 171: `newPassword` from `<input class="profile-input" type="password" formControlName="newPassword" />`
  - Line 191: `confirmPassword` from `<input class="profile-input" type="password" formControlName="confirmPassword" />`
- Reactive forms declared in component:
  - `profileForm` line 271; controls: `fullName, specialization, bio, consultationFee, licenseNumber, ptrNumber, s2Number`
  - `passwordForm` line 281; controls: `currentPassword, newPassword, confirmPassword`
- Validators detected in TS: `Validators.required, Validators.min`. Exact field-to-validator mapping should be verified against component source. [TEAM TO VERIFY]
- Event/raw template lines detected:
  - Template line 12: `<form class="clinic-card profile-form" [formGroup]="profileForm" (ngSubmit)="save()">`
  - Template line 22: `<button type="button" class="photo-preview" (click)="photoInput.click()" [attr.aria-label]="'Upload profile photo'">`
  - Template line 33: `<input #photoInput type="file" accept="image/*" hidden (change)="onPhotoUpload($event)" />`
  - Template line 39: `<input class="profile-input" type="text" formControlName="fullName" />`
  - Template line 44: `<input class="profile-input" type="text" formControlName="specialization" />`
  - Template line 52: `formControlName="bio"`
  - Template line 63: `<input class="profile-input currency-input" type="number" min="0" formControlName="consultationFee" />`
  - Template line 73: `formControlName="licenseNumber"`
  - Template line 83: `<input class="profile-input" type="text" formControlName="ptrNumber" />`
  - Template line 100: `<input class="profile-input" type="text" formControlName="s2Number" />`
  - Template line 109: `<button type="submit" class="btn-primary" [disabled]="profileForm.invalid || isSaving">`
  - Template line 147: `<a class="edit-link" routerLink="/doctor/schedule">Edit in Schedule →</a>`
  - Template line 163: `<form class="profile-form" [formGroup]="passwordForm" (ngSubmit)="changePassword()">`
  - Template line 166: `<input class="profile-input" type="password" formControlName="currentPassword" />`
  - Template line 171: `<input class="profile-input" type="password" formControlName="newPassword" />`
  - Template line 191: `<input class="profile-input" type="password" formControlName="confirmPassword" />`
  - Template line 199: `<button type="submit" class="btn-primary" [disabled]="changingPassword">`
- Child components/selectors rendered by template: `app-empty-state`, `app-page-header`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

## Patient Routes

### `/patient/dashboard`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/dashboard|
|Page/component file|src/app/portals/patient/dashboard/patient-dashboard.page.ts|
|Component class|PatientDashboardPage|
|Layout/shell|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|
|Access control|Top-level /patient has authGuard, roleGuard, firstLoginGuard with data.roles=[Patient]; patient child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|PATIENT_NAV_ITEMS sidebar where listed; detail/review routes via buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, AuthStateService, ClinicSettingsService, DoctorStateService, MedicalRecordsService, Router
- API calls detected in component: get('patients/me').pipe(catchError(() => of(undefined))) : of(undefined)) line 228, get('bookings?page=1&pageSize=100').pipe() line 235, get('medical-records/consultations?patientId=' + patient.id).pipe() line 305, get('medical-records/prescriptions?patientId=' + patient.id).pipe() line 309

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 8: `<button type="button" class="btn-primary" routerLink="/patient/doctors">`; visible text/context: `Book Appointment View My Bookings <app-banner`
  - Line 11: `<button type="button" class="btn-outline" routerLink="/patient/bookings">`; visible text/context: `View My Bookings <app-banner *ngIf="vm.showEmailWarning" variant="warning" message="Your email is no`
  - Line 30: `<button type="button" class="btn-outline" routerLink="/patient/privacy-consent" aria-label="Review and accept privacy consent">`; visible text/context: `Review Consent {{ vm.upcomingCoun`
  - Line 62: `<a class="section-action-link" routerLink="/patient/doctors">`; visible text/context: `View all doctors &rarr; 0; else noDoctorsTpl"> <app-empt`
- Event/raw template lines detected:
  - Template line 8: `<button type="button" class="btn-primary" routerLink="/patient/doctors">`
  - Template line 11: `<button type="button" class="btn-outline" routerLink="/patient/bookings">`
  - Template line 30: `<button type="button" class="btn-outline" routerLink="/patient/privacy-consent" aria-label="Review and accept privacy consent">`
  - Template line 62: `<a class="section-action-link" routerLink="/patient/doctors">View all doctors &rarr;</a>`
  - Template line 125: `(download)="showPhaseTenToast()"`
- Programmatic navigation detected:
  - TS line 389: `router.navigate(['/patient/bookings', bookingId])`
  - TS line 393: `router.navigate(['/patient/medical-records'])`
  - TS line 397: `router.navigate(['/patient/prescriptions'])`
- Child components/selectors rendered by template: `app-banner`, `app-doctor-card`, `app-empty-state`, `app-medical-record-card`, `app-prescription-card`, `app-upcoming-appointment-card`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'patients/me').pipe(catchError(() => of(undefined))) : of(undefined)|src/app/portals/patient/dashboard/patient-dashboard.page.ts:228|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings?page=1&pageSize=100').pipe(|src/app/portals/patient/dashboard/patient-dashboard.page.ts:235|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/consultations?patientId=' + patient.id).pipe(|src/app/portals/patient/dashboard/patient-dashboard.page.ts:305|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'medical-records/prescriptions?patientId=' + patient.id).pipe(|src/app/portals/patient/dashboard/patient-dashboard.page.ts:309|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/patient/doctors`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/doctors|
|Page/component file|src/app/portals/patient/doctors/patient-doctors.page.ts|
|Component class|PatientDoctorsPage|
|Layout/shell|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|
|Access control|Top-level /patient has authGuard, roleGuard, firstLoginGuard with data.roles=[Patient]; patient child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|PATIENT_NAV_ITEMS sidebar where listed; detail/review routes via buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, DestroyRef
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- [UNCLEAR] No button/link/routerLink/click handler detected in this page template.
- Child components/selectors rendered by template: `app-doctor-card`, `app-empty-state`, `app-skeleton`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/patient/bookings`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/bookings|
|Page/component file|src/app/portals/patient/bookings/patient-bookings.page.ts|
|Component class|PatientBookingsPage|
|Layout/shell|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|
|Access control|Top-level /patient has authGuard, roleGuard, firstLoginGuard with data.roles=[Patient]; patient child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|PATIENT_NAV_ITEMS sidebar where listed; detail/review routes via buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, ClinicDashboardRealtimeService, DestroyRef, Router
- API calls detected in component: patch('bookings/' + this.bookingToCancel.id + '/cancel', { reason: 'Cancelled by patient.' }))) line 299

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 11: `<button *ngFor="let filter of filters" type="button" class="booking-filter" [class.active]="selectedFilter === filter.value" (click)="setFilter(filter.value)" >`; visible text/context: `{{ filter.label }} {{ countLabel }} 1"> <button class="btn-ghost bookings-pagination__button" type`
  - Line 25: `<button class="btn-ghost bookings-pagination__button" type="button" (click)="previousPage()" [disabled]="!canPreviousPage">`; visible text/context: `Previous Page {{ currentPage }} of {{ totalPages }} Next </but`
  - Line 29: `<button class="btn-ghost bookings-pagination__button" type="button" (click)="nextPage()" [disabled]="!canNextPage">`; visible text/context: `Next <div class="clinic-card bookings-table-card des`
  - Line 66: `<button type="button" class="btn-outline" (click)="openBooking(booking.id)">`; visible text/context: `View Details Cancel`
  - Line 69: `<button *ngIf="canCancelBooking(booking)" type="button" class="btn-ghost" (click)="promptCancel(booking)">`; visible text/context: `Cancel 0"> <app-patient-booking-card`
- Event/raw template lines detected:
  - Template line 11: `<button`
  - Template line 16: `(click)="setFilter(filter.value)"`
  - Template line 25: `<button class="btn-ghost bookings-pagination__button" type="button" (click)="previousPage()" [disabled]="!canPreviousPage">`
  - Template line 29: `<button class="btn-ghost bookings-pagination__button" type="button" (click)="nextPage()" [disabled]="!canNextPage">`
  - Template line 66: `<button type="button" class="btn-outline" (click)="openBooking(booking.id)">`
  - Template line 69: `<button *ngIf="canCancelBooking(booking)" type="button" class="btn-ghost" (click)="promptCancel(booking)">`
- Programmatic navigation detected:
  - TS line 273: `router.navigate(['/patient/bookings', id])`
- Child components/selectors rendered by template: `app-confirm-modal`, `app-empty-state`, `app-patient-booking-card`, `app-skeleton`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|patch|'bookings/' + this.bookingToCancel.id + '/cancel', { reason: 'Cancelled by patient.' }))|src/app/portals/patient/bookings/patient-bookings.page.ts:299|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/patient/documents`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/documents|
|Page/component file|src/app/portals/patient/documents/patient-documents.page.ts|
|Component class|PatientDocumentsPage|
|Layout/shell|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|
|Access control|Top-level /patient has authGuard, roleGuard, firstLoginGuard with data.roles=[Patient]; patient child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|PATIENT_NAV_ITEMS sidebar where listed; detail/review routes via buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- [UNCLEAR] No button/link/routerLink/click handler detected in this page template.
- Event/raw template lines detected:
  - Template line 6: `subheading="Choose a file, link it to a booking, then preview uploaded images or download files when needed."`
- Child components/selectors rendered by template: `app-patient-media-panel`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- [UNCLEAR] No obvious loading/empty/error/success keywords detected in component/template.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/patient/lab-results`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/lab-results|
|Page/component file|src/app/portals/patient/lab-results/patient-lab-results.page.ts|
|Component class|PatientLabResultsPage|
|Layout/shell|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|
|Access control|Top-level /patient has authGuard, roleGuard, firstLoginGuard with data.roles=[Patient]; patient child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|PATIENT_NAV_ITEMS sidebar where listed; detail/review routes via buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- [UNCLEAR] No button/link/routerLink/click handler detected in this page template.
- Child components/selectors rendered by template: `app-patient-media-panel`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- [UNCLEAR] No obvious loading/empty/error/success keywords detected in component/template.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/patient/labs`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/labs|
|Page/component file|src/app/portals/patient/labs-redirect/patient-labs-redirect.page.ts|
|Component class|PatientLabsRedirectPage|
|Layout/shell|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|
|Access control|Top-level /patient has authGuard, roleGuard, firstLoginGuard with data.roles=[Patient]; patient child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|PATIENT_NAV_ITEMS sidebar where listed; detail/review routes via buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ActivatedRoute, Router
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- [UNCLEAR] No button/link/routerLink/click handler detected in this page template.
- Programmatic navigation detected:
  - TS line 14: `router.navigate(['/patient/lab-results'], {`

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- [UNCLEAR] No obvious loading/empty/error/success keywords detected in component/template.

#### 6. Dead or Incomplete Route Notes
- [TEAM TO VERIFY] `/patient/labs` is a redirect component based on route name; verify user-facing redirect behavior.

### `/patient/bookings/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/bookings/:id|
|Page/component file|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts|
|Component class|PatientBookingDetailPage|
|Layout/shell|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|
|Access control|Top-level /patient has authGuard, roleGuard, firstLoginGuard with data.roles=[Patient]; patient child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|PATIENT_NAV_ITEMS sidebar where listed; detail/review routes via buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Route parameter required: id
- Injected dependencies: ActivatedRoute, ApiService, DestroyRef, Router, ToastController
- API calls detected in component: get('patients/me').pipe(catchError(() => of(undefined))),) line 275, get('bookings/' + bookingId).pipe(map((row) => normalizeBookingRow(row)))) line 276, patch('bookings/' + this.booking.id + '/cancel', { reason: 'Cancelled by patient.' }))) line 304, get('payments/' + this.booking.payment.id).pipe() line 334, get('bookings/' + bookingId) : of(undefined)).pipe() line 342

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 5: `<button type="button" class="btn-ghost" (click)="back()">`; visible text/context: `Back to Bookings Booking Detail {{ booking.id }} <div class="clinic-card booking-su`
  - Line 59: `<button type="button" class="btn-primary" (click)="openReceipt()">`; visible text/context: `View Receipt Cancellation This booking can still be cancelled online. <button type="button" cl`
  - Line 65: `<button type="button" class="btn-danger" (click)="openCancelModal()">`; visible text/context: `Cancel Booking This booking can no longer be cancelled online. Please contact the clinic if you need`
  - Line 93: `<button type="button" class="btn-ghost" style="width: 100%; text-align: left; padding-left: 0;" (click)="navigateToDocuments()">`; visible text/context: `My Documents`
  - Line 96: `<button type="button" class="btn-ghost" style="width: 100%; text-align: left; padding-left: 0;" (click)="navigateToLabResults()">`; visible text/context: `My Labs <app-confirm-modal [isOpen]="cancelModalOpen" title="Cancel Booking"`
- Event/raw template lines detected:
  - Template line 5: `<button type="button" class="btn-ghost" (click)="back()">Back to Bookings</button>`
  - Template line 59: `<button type="button" class="btn-primary" (click)="openReceipt()">View Receipt</button>`
  - Template line 65: `<button type="button" class="btn-danger" (click)="openCancelModal()">Cancel Booking</button>`
  - Template line 93: `<button type="button" class="btn-ghost" style="width: 100%; text-align: left; padding-left: 0;" (click)="navigateToDocuments()">`
  - Template line 96: `<button type="button" class="btn-ghost" style="width: 100%; text-align: left; padding-left: 0;" (click)="navigateToLabResults()">`
- Programmatic navigation detected:
  - TS line 315: `router.navigate(['/patient/bookings'])`
  - TS line 319: `router.navigate(['/patient/documents'], { queryParams: { bookingId: this.booking?.id } })`
  - TS line 323: `router.navigate(['/patient/lab-results'], { queryParams: { bookingId: this.booking?.id } })`
- Child components/selectors rendered by template: `app-booking-timeline`, `app-confirm-modal`, `app-empty-state`, `app-receipt-modal`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'patients/me').pipe(catchError(() => of(undefined))),|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:275|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/' + bookingId).pipe(map((row) => normalizeBookingRow(row)))|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:276|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|patch|'bookings/' + this.booking.id + '/cancel', { reason: 'Cancelled by patient.' }))|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:304|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'payments/' + this.booking.payment.id).pipe(|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:334|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|get|'bookings/' + bookingId) : of(undefined)).pipe(|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:342|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/patient/medical-records`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/medical-records|
|Page/component file|src/app/portals/patient/medical-records/patient-medical-records.page.ts|
|Component class|PatientMedicalRecordsPage|
|Layout/shell|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|
|Access control|Top-level /patient has authGuard, roleGuard, firstLoginGuard with data.roles=[Patient]; patient child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|PATIENT_NAV_ITEMS sidebar where listed; detail/review routes via buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, ToastController
- API calls detected in component: get('medical-records/me').subscribe({) line 155, getBlob(`patient-documents/me/medical-records/${record.id}/pdf`).subscribe({) line 182, getBlob(`patient-documents/me/bookings/${record.bookingId}/pdf`).subscribe({) line 200, getBlob('patient-documents/me/all.pdf').subscribe({) line 213

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 38: `<button type="button" class="btn-primary" (click)="loadRecords()">`; visible text/context: `Retry 0; else emptyTpl">`
  - Line 87: `<button type="button" class="btn-outline" [disabled]="isDownloading(record.id)" (click)="downloadMedicalRecord(record)" >`; visible text/context: `{{ isDownloading(record.id) ? 'Downloading...' : 'Download Medical Record PDF' }} <button type="butt`
  - Line 95: `<button type="button" class="btn-primary" [disabled]="isDownloadingSummary(record.bookingId)" (click)="downloadConsultationSummary(record)" >`; visible text/context: `{{ isDownloadingSummary(record.bookingId) ? 'Downloading...' : 'Download Summary PDF' }} <app-empty-`
- Event/raw template lines detected:
  - Template line 9: `<button`
  - Template line 13: `(click)="downloadAllRecords()"`
  - Template line 38: `<button type="button" class="btn-primary" (click)="loadRecords()">Retry</button>`
  - Template line 87: `<button`
  - Template line 91: `(click)="downloadMedicalRecord(record)"`
  - Template line 95: `<button`
  - Template line 99: `(click)="downloadConsultationSummary(record)"`
- Child components/selectors rendered by template: `app-empty-state`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'medical-records/me').subscribe({|src/app/portals/patient/medical-records/patient-medical-records.page.ts:155|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|getBlob|`patient-documents/me/medical-records/${record.id}/pdf`).subscribe({|src/app/portals/patient/medical-records/patient-medical-records.page.ts:182|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|getBlob|`patient-documents/me/bookings/${record.bookingId}/pdf`).subscribe({|src/app/portals/patient/medical-records/patient-medical-records.page.ts:200|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|getBlob|'patient-documents/me/all.pdf').subscribe({|src/app/portals/patient/medical-records/patient-medical-records.page.ts:213|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/patient/prescriptions`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/prescriptions|
|Page/component file|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts|
|Component class|PatientPrescriptionsPage|
|Layout/shell|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|
|Access control|Top-level /patient has authGuard, roleGuard, firstLoginGuard with data.roles=[Patient]; patient child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|PATIENT_NAV_ITEMS sidebar where listed; detail/review routes via buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, ToastController
- API calls detected in component: get('prescriptions/me').subscribe({) line 144, getBlob(`patient-documents/me/prescriptions/${prescription.id}/pdf`).subscribe({) line 171, getBlob(`patient-documents/me/bookings/${prescription.bookingId}/pdf`).subscribe({) line 189, getBlob('patient-documents/me/all.pdf').subscribe({) line 202

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 38: `<button type="button" class="btn-primary" (click)="loadPrescriptions()">`; visible text/context: `Retry 0; else emptyTpl"> <div class="prescriptio`
  - Line 80: `<button type="button" class="btn-outline" [disabled]="isDownloading(prescription.id)" (click)="downloadPrescription(prescription)" >`; visible text/context: `{{ isDownloading(prescription.id) ? 'Downloading...' : 'Download Prescription PDF' }} <button type="`
  - Line 88: `<button type="button" class="btn-primary" [disabled]="isDownloadingSummary(prescription.bookingId)" (click)="downloadConsultationSummary(prescription)" >`; visible text/context: `{{ isDownloadingSummary(prescription.bookingId) ? 'Downloading...' : 'Download Summary PDF' }} <app-`
- Event/raw template lines detected:
  - Template line 9: `<button`
  - Template line 13: `(click)="downloadAllRecords()"`
  - Template line 38: `<button type="button" class="btn-primary" (click)="loadPrescriptions()">Retry</button>`
  - Template line 80: `<button`
  - Template line 84: `(click)="downloadPrescription(prescription)"`
  - Template line 88: `<button`
  - Template line 92: `(click)="downloadConsultationSummary(prescription)"`
- Child components/selectors rendered by template: `app-empty-state`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
|Client method|Endpoint/payload expression|Source|Notes|
|---|---|---|---|
|get|'prescriptions/me').subscribe({|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts:144|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|getBlob|`patient-documents/me/prescriptions/${prescription.id}/pdf`).subscribe({|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts:171|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|getBlob|`patient-documents/me/bookings/${prescription.bookingId}/pdf`).subscribe({|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts:189|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|
|getBlob|'patient-documents/me/all.pdf').subscribe({|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts:202|[UNCLEAR] Derived from frontend call expression; full backend response/error shape not defined in this component.|

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/patient/vaccinations`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/vaccinations|
|Page/component file|src/app/portals/patient/vaccinations/patient-vaccinations.page.ts|
|Component class|PatientVaccinationsPage|
|Layout/shell|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|
|Access control|Top-level /patient has authGuard, roleGuard, firstLoginGuard with data.roles=[Patient]; patient child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|PATIENT_NAV_ITEMS sidebar where listed; detail/review routes via buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: PatientVaccinationsService, ToastController
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 29: `<button type="button" class="btn-primary" (click)="loadVaccinations()">`; visible text/context: `Retry 0; else emptyTpl">`
- Event/raw template lines detected:
  - Template line 29: `<button type="button" class="btn-primary" (click)="loadVaccinations()">Retry</button>`
- Child components/selectors rendered by template: `app-empty-state`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Loading, Spinner, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/patient/profile`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/profile|
|Page/component file|src/app/portals/patient/profile/patient-profile.page.ts|
|Component class|PatientProfilePage|
|Layout/shell|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|
|Access control|Top-level /patient has authGuard, roleGuard, firstLoginGuard with data.roles=[Patient]; patient child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|PATIENT_NAV_ITEMS sidebar where listed; detail/review routes via buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, AuthStateService, DestroyRef, FormBuilder, ToastController
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 213: `<ion-button type="button" expand="block" color="primary" [disabled]="!consentAcknowledged || consentSubmitting" (click)="submitConsent()" >`; visible text/context: `{{ consentSubmitting ? 'Submitting...' : 'Submit Consent' }}`
- Form/input controls detected:
  - Line 24: `firstName` from `<ion-input formControlName="firstName" name="firstName" autocomplete="given-name">`
  - Line 29: `middleName` from `<ion-input formControlName="middleName" name="middleName" autocomplete="additional-name" >`
  - Line 36: `lastName` from `<ion-input formControlName="lastName" name="lastName" autocomplete="family-name">`
  - Line 42: `dateOfBirth` from `<ion-input type="date" formControlName="dateOfBirth" name="dateOfBirth" autocomplete="bday" >`
  - Line 49: `sex` from `<ion-select formControlName="sex" name="sex">`
  - Line 57: `civilStatus` from `<ion-select formControlName="civilStatus" name="civilStatus">`
  - Line 68: `bloodType` from `<ion-select formControlName="bloodType" name="bloodType">`
  - Line 83: `contactNumber` from `<ion-input formControlName="contactNumber" name="contactNumber" autocomplete="tel" >`
  - Line 91: `email` from `<ion-input formControlName="email" name="email" autocomplete="email" [readonly]="true" >`
  - Line 104: `address` from `<ion-input formControlName="address" name="address" autocomplete="street-address" >`
  - Line 112: `city` from `<ion-input formControlName="city" name="city" autocomplete="address-level2" >`
  - Line 120: `zipCode` from `<ion-input formControlName="zipCode" name="zipCode" autocomplete="postal-code" >`
  - Line 131: `emergencyContactName` from `<ion-input formControlName="emergencyContactName" name="emergencyContactName">`
  - Line 136: `emergencyContactRelationship` from `<ion-input formControlName="emergencyContactRelationship" name="emergencyContactRelationship" >`
  - Line 143: `emergencyContactNumber` from `<ion-input formControlName="emergencyContactNumber" name="emergencyContactNumber" autocomplete="tel" >`
  - Line 154: `hmoProvider` from `<ion-input formControlName="hmoProvider" name="hmoProvider">`
  - Line 158: `hmoCardNumber` from `<ion-input formControlName="hmoCardNumber" name="hmoCardNumber">`
  - Line 162: `philHealthNumber` from `<ion-input formControlName="philHealthNumber" name="philHealthNumber">`
  - Line 233: `currentPassword` from `<ion-input type="password" formControlName="currentPassword" name="currentPassword" autocomplete="current-password" >`
  - Line 242: `newPassword` from `<ion-input type="password" formControlName="newPassword" name="newPassword" autocomplete="new-password" >`
  - Line 265: `confirmPassword` from `<ion-input type="password" formControlName="confirmPassword" name="confirmPassword" autocomplete="new-password" >`
- Reactive forms declared in component:
  - `profileForm` line 366; controls: `firstName, middleName, lastName, dateOfBirth, sex, civilStatus, bloodType, contactNumber, email, value, disabled, address, city, zipCode, emergencyContactName, emergencyContactRelationship, emergencyContactNumber, hmoProvider, hmoCardNumber, philHealthNumber`
  - `passwordForm` line 387; controls: `currentPassword, newPassword, confirmPassword`
- Validators detected in TS: `Validators.required`. Exact field-to-validator mapping should be verified against component source. [TEAM TO VERIFY]
- Event/raw template lines detected:
  - Template line 19: `<form class="clinic-card profile-card" [formGroup]="profileForm" (ngSubmit)="saveProfile()" novalidate>`
  - Template line 24: `<ion-input formControlName="firstName" name="firstName" autocomplete="given-name"></ion-input>`
  - Template line 29: `formControlName="middleName"`
  - Template line 36: `<ion-input formControlName="lastName" name="lastName" autocomplete="family-name"></ion-input>`
  - Template line 42: `formControlName="dateOfBirth"`
  - Template line 49: `<ion-select formControlName="sex" name="sex">`
  - Template line 57: `<ion-select formControlName="civilStatus" name="civilStatus">`
  - Template line 68: `<ion-select formControlName="bloodType" name="bloodType">`
  - Template line 83: `formControlName="contactNumber"`
  - Template line 91: `formControlName="email"`
  - Template line 104: `formControlName="address"`
  - Template line 112: `formControlName="city"`
  - Template line 120: `formControlName="zipCode"`
  - Template line 131: `<ion-input formControlName="emergencyContactName" name="emergencyContactName"></ion-input>`
  - Template line 136: `formControlName="emergencyContactRelationship"`
  - Template line 143: `formControlName="emergencyContactNumber"`
  - Template line 154: `<ion-input formControlName="hmoProvider" name="hmoProvider"></ion-input>`
  - Template line 158: `<ion-input formControlName="hmoCardNumber" name="hmoCardNumber"></ion-input>`
  - Template line 162: `<ion-input formControlName="philHealthNumber" name="philHealthNumber"></ion-input>`
  - Template line 167: `<ion-button`
  - Template line 174: `</ion-button>`
  - Template line 208: `(change)="onConsentToggle($event)"`
  - Template line 213: `<ion-button`
  - Template line 218: `(click)="submitConsent()"`
  - Template line 221: `</ion-button>`
  - Template line 226: `<form class="clinic-card profile-card" [formGroup]="passwordForm" (ngSubmit)="changePassword()" novalidate>`
  - Template line 233: `formControlName="currentPassword"`
  - Template line 242: `formControlName="newPassword"`
  - Template line 265: `formControlName="confirmPassword"`
  - Template line 277: `<ion-button type="submit" expand="block" color="primary" [disabled]="changingPassword">`
  - Template line 279: `</ion-button>`

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Error, Loading, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/patient/reviews/:bookingId`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/reviews/:bookingId|
|Page/component file|src/app/portals/patient/reviews/patient-reviews.page.ts|
|Component class|PatientReviewsPage|
|Layout/shell|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|
|Access control|Top-level /patient has authGuard, roleGuard, firstLoginGuard with data.roles=[Patient]; patient child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|PATIENT_NAV_ITEMS sidebar where listed; detail/review routes via buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Route parameter required: bookingId
- Injected dependencies: ActivatedRoute, ApiService, DestroyRef, Router, ToastController
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 5: `<button type="button" class="btn-ghost" (click)="back()">`; visible text/context: `Back to Booking Leave a Review {{ booking.id }} How was you`
- Event/raw template lines detected:
  - Template line 5: `<button type="button" class="btn-ghost" (click)="back()">Back to Booking</button>`
- Programmatic navigation detected:
  - TS line 138: `router.navigate(['/patient/bookings', this.booking.id])`
  - TS line 143: `router.navigate(['/patient/bookings'])`
  - TS line 146: `router.navigate(['/patient/bookings', this.booking.id])`
- Child components/selectors rendered by template: `app-empty-state`, `app-review-form`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Empty, Error, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

### `/patient/privacy-consent`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/privacy-consent|
|Page/component file|src/app/portals/patient/privacy-consent/patient-privacy-consent.page.ts|
|Component class|PatientPrivacyConsentPage|
|Layout/shell|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|
|Access control|Top-level /patient has authGuard, roleGuard, firstLoginGuard with data.roles=[Patient]; patient child layout has authGuard + roleGuard|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|PATIENT_NAV_ITEMS sidebar where listed; detail/review routes via buttons/router.navigate/deep link|

#### 2. Data Dependencies
- AuthStateService current user and tokens initialized by APP_INITIALIZER.
- Injected dependencies: ApiService, AuthStateService, ClinicSettingsService, DestroyRef, Router, ToastController
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template source: inline template or no external templateUrl.
- Clickable/navigation elements detected:
  - Line 24: `<ion-button type="button" expand="block" color="primary" [disabled]="!accepted" (click)="acceptConsent()">`; visible text/context: `Accept Consent`
- Form/input controls detected:
  - Line 20: `accepted` from `<ion-checkbox slot="start" [(ngModel)]="accepted">`
- Event/raw template lines detected:
  - Template line 20: `<ion-checkbox slot="start" [(ngModel)]="accepted"></ion-checkbox>`
  - Template line 24: `<ion-button type="button" expand="block" color="primary" [disabled]="!accepted" (click)="acceptConsent()">`
  - Template line 26: `</ion-button>`
- Programmatic navigation detected:
  - TS line 107: `router.navigate(['/patient/dashboard'])`

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Error, Success, Toast.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- No route-level dead/incomplete issue detected from route definitions. [TEAM TO VERIFY]

## Dev/Public Routes

### `/dev/gallery`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/dev/gallery|
|Page/component file|src/app/dev/design-system-gallery/design-system-gallery.page.ts|
|Component class|DesignSystemGalleryPage|
|Layout/shell|None|
|Access control|Unguarded dev route|
|Redirect behavior|Defined by guards above when guards are present; unguarded routes do not redirect in route definitions.|
|Navigation entry points|/dev redirects to /dev/gallery; deep link only found in route file|

#### 2. Data Dependencies
- [UNCLEAR] No direct apiService call detected in page component. It may use child components/services or static data.

#### 3. Full Interaction Audit
- Template file: `src/app/dev/design-system-gallery/design-system-gallery.page.html`
- Clickable/navigation elements detected:
  - Line 13: `<ion-button fill="clear" (click)="confirmOpen = true">`; visible text/context: `Open confirm modal Color palette <div class="swatch" *ngFor="let token of colorToken`
- Event/raw template lines detected:
  - Template line 13: `<ion-button fill="clear" (click)="confirmOpen = true">Open confirm modal</ion-button>`
  - Template line 51: `<button class="btn-primary" type="button">Primary</button>`
  - Template line 52: `<button class="btn-outline" type="button">Outline</button>`
  - Template line 53: `<button class="btn-ghost" type="button">Ghost</button>`
  - Template line 54: `<button class="btn-danger" type="button">Danger</button>`
  - Template line 55: `<button class="btn-icon" type="button" aria-label="Icon">`
- Child components/selectors rendered by template: `app-avatar`, `app-banner`, `app-confirm-modal`, `app-empty-state`, `app-page-header`, `app-skeleton`, `app-status-badge`. See reusable component appendix in MASTER_PROJECT_OVERVIEW for their props/events where detected.

#### 4. API Calls
- No direct API call detected in route component. Check imported child components/services for nested calls. [UNCLEAR]

#### 5. Page States
- State indicators/keywords detected: Empty, Success.
- [TEAM TO VERIFY] Exact visual state and retry behavior require runtime/browser verification against actual API results.

#### 6. Dead or Incomplete Route Notes
- [TEAM TO VERIFY] Unguarded dev route exists in production route table unless excluded by deployment/build config.

## Consolidated API Calls Found in Frontend
|ApiService method|Arguments / endpoint expression|Source|Expected TS type|
|---|---|---|---|
|get|'settings'|src/app/app.component.ts:25|any|
|get|'auth/me'|src/app/app.config.ts:29|AuthUserDto|
|get|'auth/me'|src/app/auth/callback/auth-callback.page.ts:86|AuthUserDto|
|post|'auth/refresh-token', { refreshToken }|src/app/core/interceptors/auth.interceptor.ts:59|RefreshTokenDto|
|get|'bookings/staff/today?page=' + page + '&pageSize=' + pageSize|src/app/core/services/booking.service.ts:363|any|
|get|'bookings/staff/all?page=' + page + '&pageSize=' + pageSize|src/app/core/services/booking.service.ts:385|any|
|get|'bookings/staff/for-payment?page=' + currentPage + '&pageSize=' + safePageSize|src/app/core/services/booking.service.ts:407|any|
|get|'bookings'|src/app/core/services/booking.service.ts:465|any|
|post|'bookings', {}|src/app/core/services/booking.service.ts:526|any|
|get|'bookings/' + id|src/app/core/services/booking.service.ts:571|any|
|post|'auth/logout', { refreshToken }|src/app/layouts/admin-layout/admin-layout.component.ts:134|[UNCLEAR]|
|post|'auth/logout', { refreshToken }|src/app/layouts/doctor-layout/doctor-layout.component.ts:102|[UNCLEAR]|
|post|'auth/logout', { refreshToken }|src/app/layouts/staff-layout/staff-layout.component.ts:107|[UNCLEAR]|
|get|'audit-logs'|src/app/portals/admin/audit-logs/audit-logs.page.ts:106|AuditLog[]|
|get|'bookings/' + id|src/app/portals/admin/booking-detail/booking-detail.page.ts:266|[UNCLEAR]|
|get|'patients/' + patientId|src/app/portals/admin/booking-detail/booking-detail.page.ts:300|[UNCLEAR]|
|patch|'bookings/' + bookingId + '/confirm', {}|src/app/portals/admin/booking-detail/booking-detail.page.ts:397|[UNCLEAR]|
|patch|'bookings/' + bookingId + '/cancel', { reason: reason \|\| 'Rejected by admin' }|src/app/portals/admin/booking-detail/booking-detail.page.ts:401|[UNCLEAR]|
|patch|'bookings/' + bookingId + '/confirm', {}|src/app/portals/admin/booking-detail/booking-detail.page.ts:405|[UNCLEAR]|
|patch|'bookings/' + bookingId + '/complete', {}|src/app/portals/admin/booking-detail/booking-detail.page.ts:409|[UNCLEAR]|
|patch|'bookings/' + bookingId + '/no-show', {}|src/app/portals/admin/booking-detail/booking-detail.page.ts:413|[UNCLEAR]|
|patch|'bookings/' + bookingId + '/cancel', { reason: reason \|\| 'Cancelled by admin' }|src/app/portals/admin/booking-detail/booking-detail.page.ts:417|[UNCLEAR]|
|post|'audit-logs', { entityType: 'Booking', entityId, action, performedBy, details }|src/app/portals/admin/booking-detail/booking-detail.page.ts:439|[UNCLEAR]|
|put|'bookings/' + bookingId + '/waive', { reason }|src/app/portals/admin/booking-detail/booking-detail.page.ts:454|[UNCLEAR]|
|put|'bookings/' + bookingId + '/refund', { reason }|src/app/portals/admin/booking-detail/booking-detail.page.ts:475|[UNCLEAR]|
|get|'doctors/admin'|src/app/portals/admin/doctor-form/doctor-form.page.ts:230|any[]|
|get|'doctors/' + this.doctorId + '/schedule'|src/app/portals/admin/doctor-form/doctor-form.page.ts:237|any[]|
|put|`doctors/${this.doctorId}`, updatePayload|src/app/portals/admin/doctor-form/doctor-form.page.ts:312|[UNCLEAR]|
|put|'doctors/' + savedDoctor.id + '/schedule', { schedules: schedulesPayload.schedules.map((s) => ({ dayOfWeek: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime })) }|src/app/portals/admin/doctor-form/doctor-form.page.ts:315|any[]|
|get|'doctors/' + doctor.id + '/schedule'|src/app/portals/admin/doctors/doctors.page.ts:289|any[]|
|put|'patients/' + this.patient.id, dto|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:407|any|
|post|'patients', { email: this.requiredValue(values.email), temporaryPassword: values.accountPassword }|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:525|any|
|get|'patients/' + id|src/app/portals/admin/patient-detail/patient-detail.page.ts:192|any|
|get|'medical-records/consultations?patientId=' + id|src/app/portals/admin/patient-detail/patient-detail.page.ts:213|any[]|
|get|'medical-records/prescriptions?patientId=' + id|src/app/portals/admin/patient-detail/patient-detail.page.ts:217|any[]|
|get|'medical-records/allergies?patientId=' + id|src/app/portals/admin/patient-detail/patient-detail.page.ts:221|any[]|
|get|'medical-records/lab-results?patientId=' + id|src/app/portals/admin/patient-detail/patient-detail.page.ts:225|any[]|
|get|'medical-records/vaccinations?patientId=' + id|src/app/portals/admin/patient-detail/patient-detail.page.ts:229|any[]|
|get|'medical-records/follow-ups?patientId=' + id|src/app/portals/admin/patient-detail/patient-detail.page.ts:233|any[]|
|post|'patients', dto|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:372|any|
|post|'patients', accountPayload|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:443|any|
|get|endpoint|src/app/portals/admin/patients/patients.page.ts:231|any|
|get|'reports/unpaid-completed-visits'|src/app/portals/admin/reports/reports.page.ts:171|UnpaidCompletedVisitReportRow[]|
|get|'reports/pending-follow-ups'|src/app/portals/admin/reports/reports.page.ts:176|PendingFollowUpReportRow[]|
|get|'reports/daily-booking-summary'|src/app/portals/admin/reports/reports.page.ts:181|DailyBookingSummaryRow[]|
|put|'services/' + this.editingId, payload|src/app/portals/admin/services/services.page.ts:275|any|
|post|'services', payload|src/app/portals/admin/services/services.page.ts:278|any|
|get|'services'|src/app/portals/admin/services/services.page.ts:308|any[]|
|get|'doctors/admin'|src/app/portals/admin/services/services.page.ts:315|any[]|
|put|'settings', this.cloneSettings(this.draft)|src/app/portals/admin/settings/settings.page.ts:324|any|
|post|'patients', dto|src/app/portals/admin/walk-in/walk-in.page.ts:827|any|
|post|'bookings', {}|src/app/portals/admin/walk-in/walk-in.page.ts:879|any|
|get|'bookings/' + bookingId|src/app/portals/admin/walk-in/walk-in.page.ts:887|any|
|get|'doctors'|src/app/portals/admin/walk-in/walk-in.page.ts:902|any[]|
|get|endpoint|src/app/portals/admin/walk-in/walk-in.page.ts:934|any|
|get|'doctors/' + doctorId + '/services'|src/app/portals/admin/walk-in/walk-in.page.ts:1005|any[]|
|get|'services'|src/app/portals/admin/walk-in/walk-in.page.ts:1008|any[]|
|get|'doctors/' + doctorId + '/available-slots?date=' + date|src/app/portals/admin/walk-in/walk-in.page.ts:1044|any[]|
|get|'bookings/' + bookingId|src/app/portals/doctor/appointment-detail/doctor-appointment-detail.page.ts:203|any|
|get|'bookings/doctor/today'|src/app/portals/doctor/appointments/doctor-appointments.page.ts:368|any[]|
|get|'bookings/doctor/today-summary'|src/app/portals/doctor/appointments/doctor-appointments.page.ts:374|any|
|patch|'bookings/' + bookingId + '/doctor-complete', payload|src/app/portals/doctor/appointments/doctor-appointments.page.ts:480|[UNCLEAR]|
|patch|'payments/' + bookingId + '/waive', { reason: payload.professionalFeeWaivedReason ?? 'Professional fee waived.' }|src/app/portals/doctor/appointments/doctor-appointments.page.ts:483|[UNCLEAR]|
|post|'/drug-interactions/allergy-check', { drugName: name, allergies: this.allergies }|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:437|UnknownAllergyCheckResponse|
|post|'/drug-interactions/check', { drugs: nextItems.map((item) => ({ medicineName: item.medicineName, genericName: item.genericName ?? null, strength: item.strength ?? null, route: item.route ?? null, frequency: item.frequency ?? null })) }|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:480|UnknownInteractionCheckResponse|
|post|'/drug-interactions/check', { drugs: this.medicines.map((item) => ({ medicineName: item.medicineName, genericName: item.genericName ?? null, strength: item.strength ?? null, route: item.route ?? null, frequency: item.frequency ?? null })) }|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:647|UnknownInteractionCheckResponse|
|get|'bookings/' + bookingId|src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts:88|any|
|get|'doctors/me'|src/app/portals/doctor/consultation/doctor-consultation.page.ts:727|any|
|get|'audit-logs'|src/app/portals/doctor/consultation/doctor-consultation.page.ts:754|AuditLog[]|
|post|'/consultation-requests/request-attending-physician', { bookingId: vm.booking.id, patientId: vm.patient.id, kind, requestedByRole: this.currentClinicalRole }|src/app/portals/doctor/consultation/doctor-consultation.page.ts:958|{ ok: boolean }|
|post|'audit-logs', sections.map((section) => ({ entity_type: 'Consultation', entity_id: vm.consultation?.id \|\| vm.booking.id, action: `Amended ${this.getSectionDisplayName(section)}`, performed_by: performedBy, performed_at: performedAt, details: `${details}; section=${section}` }))|src/app/portals/doctor/consultation/doctor-consultation.page.ts:1883|[UNCLEAR]|
|get|'bookings/' + booking.id + '/consultation-record'|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2748|any|
|get|'medical-records/consultations?patientId=' + patientId|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2775|any[]|
|get|'medical-records/prescriptions?patientId=' + patientId|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2779|any[]|
|get|'medical-records/allergies?patientId=' + patientId|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2783|any[]|
|get|'medical-records/lab-orders?patientId=' + patientId|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2787|any[]|
|get|'medical-records/lab-results?patientId=' + patientId|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2791|any[]|
|get|'medical-records/vaccinations?patientId=' + patientId|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2795|any[]|
|get|'medical-records/follow-ups?patientId=' + patientId|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2799|any[]|
|get|'patients/' + patientId|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2820|any|
|get|'bookings?patientId=' + patientId + '&pageSize=50'|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2821|any[]|
|get|'bookings/' + bookingId + '/consultation-record'|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2858|any|
|get|'bookings/' + bookingId|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2902|any|
|post|'bookings/' + bookingId + '/consultation-record', dto|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2909|any|
|get|'bookings/' + bookingId + '/consultation-record'|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2910|any|
|patch|'bookings/' + bookingId + '/doctor-complete', dto|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2931|[UNCLEAR]|
|patch|'payments/' + bookingId + '/waive', { reason: dto.professionalFeeWaivedReason ?? 'Professional fee waived.' }|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2933|[UNCLEAR]|
|patch|'bookings/' + bookingId + '/doctor-complete', dto|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2938|[UNCLEAR]|
|get|'bookings/' + bookingId|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2941|any|
|get|'doctors/me'|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:253|any|
|get|'bookings/doctor/today'|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:264|any[]|
|get|'bookings/doctor/today-summary'|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:269|any|
|get|'doctors/' + doc.id + '/schedule'|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:286|any[]|
|get|'doctors/' + doc.id + '/day-status'|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:290|any[]|
|post|'doctors/' + this.doctor.id + '/day-status', { date: this.todayStr(), status, runningLateMinutes: status === 'RunningLate' ? this.runningLateMinutes : null }|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:317|any|
|get|'patients/' + patientId|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:320|[UNCLEAR]|
|get|'bookings?patientId=' + patientId + '&pageSize=50'|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:333|any[]|
|get|'medical-records/consultations?patientId=' + patientId|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:336|any[]|
|get|'medical-records/prescriptions?patientId=' + patientId|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:339|any[]|
|get|'medical-records/lab-results?patientId=' + patientId|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:342|any[]|
|get|'medical-records/vaccinations?patientId=' + patientId|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:345|any[]|
|get|'medical-records/follow-ups?patientId=' + patientId|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:348|any[]|
|get|'bookings/' + bookingId + '/consultation-record'|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:494|any|
|get|'bookings/doctor/patients'|src/app/portals/doctor/patients/doctor-patients.page.ts:121|any[]|
|get|'doctors/me'|src/app/portals/doctor/schedule/doctor-schedule.page.ts:98|any|
|get|'doctors/' + doctor.id + '/schedule'|src/app/portals/doctor/schedule/doctor-schedule.page.ts:125|any[]|
|get|'doctors/' + doctor.id + '/blocked-dates'|src/app/portals/doctor/schedule/doctor-schedule.page.ts:128|any[]|
|put|'doctors/' + this.doctorId + '/schedule', { schedules: activeSchedules.map((s) => ({ dayOfWeek: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime })) }|src/app/portals/doctor/schedule/doctor-schedule.page.ts:166|any[]|
|put|'doctors/' + this.doctorId, { slotDurationMinutes: scheduleSettings.slotDurationMinutes, slotCapacity: scheduleSettings.slotCapacity, dailyPatientLimit: this.dailyPatientLimit }|src/app/portals/doctor/schedule/doctor-schedule.page.ts:174|any|
|post|'doctors/' + this.doctorId + '/blocked-dates', { date: blockedDate, reason: reason \|\| null }|src/app/portals/doctor/schedule/doctor-schedule.page.ts:200|any|
|delete|'doctors/' + this.doctorId + '/blocked-dates/' + id|src/app/portals/doctor/schedule/doctor-schedule.page.ts:223|[UNCLEAR]|
|get|'patients/me'|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:275|any|
|get|'bookings/' + bookingId|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:276|any|
|patch|'bookings/' + this.booking.id + '/cancel', { reason: 'Cancelled by patient.' }|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:304|[UNCLEAR]|
|get|'payments/' + this.booking.payment.id|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:334|any|
|get|'bookings/' + bookingId|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:342|any|
|patch|'bookings/' + this.bookingToCancel.id + '/cancel', { reason: 'Cancelled by patient.' }|src/app/portals/patient/bookings/patient-bookings.page.ts:299|[UNCLEAR]|
|post|'auth/logout', { refreshToken }|src/app/portals/patient/components/patient-layout/patient-layout.component.ts:149|[UNCLEAR]|
|getBlob|'patient-documents/me/all.pdf'|src/app/portals/patient/components/patient-layout/patient-layout.component.ts:166|[UNCLEAR]|
|get|'patients/me'|src/app/portals/patient/dashboard/patient-dashboard.page.ts:228|any|
|get|'bookings?page=1&pageSize=100'|src/app/portals/patient/dashboard/patient-dashboard.page.ts:235|any|
|get|'medical-records/consultations?patientId=' + patient.id|src/app/portals/patient/dashboard/patient-dashboard.page.ts:305|any[]|
|get|'medical-records/prescriptions?patientId=' + patient.id|src/app/portals/patient/dashboard/patient-dashboard.page.ts:309|any[]|
|get|'medical-records/me'|src/app/portals/patient/medical-records/patient-medical-records.page.ts:155|any[]|
|getBlob|`patient-documents/me/medical-records/${record.id}/pdf`|src/app/portals/patient/medical-records/patient-medical-records.page.ts:182|[UNCLEAR]|
|getBlob|`patient-documents/me/bookings/${record.bookingId}/pdf`|src/app/portals/patient/medical-records/patient-medical-records.page.ts:200|[UNCLEAR]|
|getBlob|'patient-documents/me/all.pdf'|src/app/portals/patient/medical-records/patient-medical-records.page.ts:213|[UNCLEAR]|
|get|'prescriptions/me'|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts:144|any[]|
|getBlob|`patient-documents/me/prescriptions/${prescription.id}/pdf`|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts:171|[UNCLEAR]|
|getBlob|`patient-documents/me/bookings/${prescription.bookingId}/pdf`|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts:189|[UNCLEAR]|
|getBlob|'patient-documents/me/all.pdf'|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts:202|[UNCLEAR]|
|get|'announcements'|src/app/portals/public/announcements/announcements.page.ts:44|Announcement[]|
|get|'services'|src/app/portals/public/booking/booking.page.ts:45|any[]|
|get|'doctors'|src/app/portals/public/booking-confirmation/booking-confirmation.page.ts:105|any[]|
|get|'services'|src/app/portals/public/booking-confirmation/booking-confirmation.page.ts:110|any[]|
|get|'doctors'|src/app/portals/public/components/booking-summary-bar/booking-summary-bar.component.ts:54|any[]|
|get|'doctors/' + wizard.selectedDoctorId + '/services'|src/app/portals/public/components/booking-summary-bar/booking-summary-bar.component.ts:56|any[]|
|get|'doctors'|src/app/portals/public/components/public-footer/public-footer.component.ts:93|any[]|
|get|'doctors/' + doctorId + '/services'|src/app/portals/public/components/step-doctor-service/step-doctor-service.component.ts:297|any[]|
|get|'doctors'|src/app/portals/public/components/step-payment/step-payment.component.ts:94|any[]|
|get|'doctors/' + wizard.selectedDoctorId + '/services'|src/app/portals/public/components/step-payment/step-payment.component.ts:96|any[]|
|post|'bookings', {}|src/app/portals/public/components/step-payment/step-payment.component.ts:171|any|
|get|'bookings/' + bookingId|src/app/portals/public/components/step-payment/step-payment.component.ts:179|any|
|post|'bookings', {}|src/app/portals/public/components/step-proof/step-proof.component.ts:214|any|
|get|'bookings/' + bookingId|src/app/portals/public/components/step-proof/step-proof.component.ts:222|any|
|get|'patients/me'|src/app/portals/public/components/step-proof/step-proof.component.ts:271|any|
|get|'doctors'|src/app/portals/public/components/step-review/step-review.component.ts:77|any[]|
|get|'doctors/' + wizard.selectedDoctorId + '/services'|src/app/portals/public/components/step-review/step-review.component.ts:79|any[]|
|get|'doctors/' + doctorId + '/available-slots?date=' + date|src/app/portals/public/components/step-slot-select/step-slot-select.component.ts:242|any[]|
|get|'doctor-day-status/' + id|src/app/portals/public/doctor-profile/doctor-profile.page.ts:172|DoctorDayStatus \| null|
|get|'doctors/' + id|src/app/portals/public/doctor-profile/doctor-profile.page.ts:179|DoctorDetail|
|get|'reviews?doctorId=' + id|src/app/portals/public/doctor-profile/doctor-profile.page.ts:180|Review[]|
|get|'doctors/' + id + '/schedule'|src/app/portals/public/doctor-profile/doctor-profile.page.ts:181|any[]|
|get|'doctors'|src/app/portals/public/home/home.page.ts:81|any[]|
|get|'services'|src/app/portals/public/home/home.page.ts:82|any[]|
|get|'announcements'|src/app/portals/public/home/home.page.ts:83|any[]|
|get|'settings'|src/app/portals/public/home/home.page.ts:84|any|
|patch|'bookings/' + this.booking.id + '/check-in', {}|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:518|[UNCLEAR]|
|patch|'bookings/' + this.booking.id + '/undo-check-in', {}|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:537|[UNCLEAR]|
|patch|'payments/' + bookingId + '/confirm', { p_booking_id: bookingId, p_amount: payload.amountReceived, p_payment_method: payload.paymentMethod, p_reference_number: payload.referenceNumber ?? null, p_or_number: null }|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:595|any|
|get|'bookings/' + bookingId|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:603|any|
|patch|'payments/' + this.booking.id + '/waive', { reason: waiveReason }|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:666|[UNCLEAR]|
|get|'payments/' + paymentId|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:687|any|
|get|'bookings/' + bookingId|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:695|any|
|get|'doctors'|src/app/portals/staff/bookings/staff-bookings.page.ts:264|any[]|
|patch|'bookings/' + booking.id + '/check-in', {}|src/app/portals/staff/bookings/staff-bookings.page.ts:333|[UNCLEAR]|
|patch|'bookings/' + booking.id + '/undo-check-in', {}|src/app/portals/staff/bookings/staff-bookings.page.ts:349|[UNCLEAR]|
|get|'bookings/staff/all?page=' + this.currentPage + '&pageSize=' + this.pageSize|src/app/portals/staff/bookings/staff-bookings.page.ts:401|any|
|patch|'bookings/' + event.bookingId + '/check-in', {}|src/app/portals/staff/dashboard/staff-dashboard.page.ts:201|[UNCLEAR]|
|patch|'bookings/' + event.bookingId + '/undo-check-in', {}|src/app/portals/staff/dashboard/staff-dashboard.page.ts:204|[UNCLEAR]|
|post|'doctor-day-status/' + event.doctorId + '/status', { status: event.status, runningLateMinutes: event.runningLateMinutes ?? null }|src/app/portals/staff/doctor-status/doctor-status.page.ts:176|DoctorDayStatus|
|post|'patients/' + this.patient.id + '/portal-account', { email: values.email, temporaryPassword: values.temporaryPassword }|src/app/portals/staff/patient-detail/staff-patient-detail.page.ts:192|[UNCLEAR]|
|patch|'payments/' + bookingId + '/confirm', { p_booking_id: bookingId, p_amount: payload.amountReceived, p_payment_method: payload.paymentMethod, p_reference_number: payload.referenceNumber ?? null, p_or_number: null }|src/app/portals/staff/payments/staff-payments.page.ts:371|any|
|patch|'payments/' + this.waiveTarget.bookingId + '/waive', { reason: waiveReason }|src/app/portals/staff/payments/staff-payments.page.ts:422|[UNCLEAR]|
|get|'bookings/staff/for-payment?page=' + this.currentPage + '&pageSize=' + safePageSize|src/app/portals/staff/payments/staff-payments.page.ts:478|any|
|post|'patients', dto|src/app/portals/staff/walk-in/staff-walk-in.page.ts:891|any|
|post|'bookings', {}|src/app/portals/staff/walk-in/staff-walk-in.page.ts:939|any|
|get|'bookings/' + bookingId|src/app/portals/staff/walk-in/staff-walk-in.page.ts:947|any|
|get|endpoint|src/app/portals/staff/walk-in/staff-walk-in.page.ts:1002|any|
|get|'services'|src/app/portals/staff/walk-in/staff-walk-in.page.ts:1092|any[]|
|put|'notifications/read-all', {}|src/app/shared/components/notification-panel/notification-panel.component.ts:106|[UNCLEAR]|
|put|`notifications/${notification.id}/read`, {}|src/app/shared/components/notification-panel/notification-panel.component.ts:119|[UNCLEAR]|
|postFormData|endpoint, formData|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:499|PatientDocument|
|postFormData|endpoint, formData|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:520|PatientLabResult|
|getBlob|`patients/${pid}/documents/${item.id}/file`|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:536|[UNCLEAR]|
|getBlob|`patients/${pid}/lab-results/${item.id}/file`|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:537|[UNCLEAR]|
|get|bookingFilter ? `${endpoint}?bookingId=${bookingFilter}` : endpoint|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:613|PatientDocument[]|
|get|bookingFilter ? `${endpoint}?bookingId=${bookingFilter}` : endpoint|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:642|PatientLabResult[]|
|get|'bookings'|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:682|any|
|get|'bookings?page=1&pageSize=100'|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:691|any|
|getBlob|endpoint|src/app/shared/components/patient-media-panel/patient-media-preview.modal.ts:405|[UNCLEAR]|
|post|'auth/logout', { refreshToken }|src/app/shared/components/portal-layout/portal-layout.component.ts:201|[UNCLEAR]|
|getBlob|this.mediaKind === 'document' ? `patients/${this.patientId \|\| 'me'}/documents/${this.mediaId}/file` : `patients/${this.patientId \|\| 'me'}/lab-results/${this.mediaId}/file`|src/app/shared/components/secure-image/secure-image.component.ts:144|[UNCLEAR]|
|getBlob|this.src|src/app/shared/components/secure-image/secure-image.component.ts:150|[UNCLEAR]|

## Direct HTTP Calls
No direct `http.get/post/put/patch/delete` or `fetch()` calls were found outside `ApiService` by regex scan. `ApiService` is the only direct Angular `HttpClient` wrapper detected.

## Known Gaps / Mock / Placeholder Flags
|Flag|File line|Evidence|
|---|---|---|
|[UNCLEAR]|src/app/core/services/auth-state.service.ts:65|return; // .NET handles patient record creation server-side|
|[UNCLEAR]|src/app/core/services/auth.service.ts:202|console.warn('[AuthService] GIS did not initialize after 5s, continuing anyway');|
|[UNCLEAR]|src/app/core/services/booking.service.ts:430|console.warn('rescheduleBooking() is deprecated (no API call yet).', bookingId, dtoOrDate);|
|[NOT IMPLEMENTED]|src/app/core/services/clinic-dashboard-realtime.service.ts:91|subscribeToDoctorStatusUpdates(callback: (payload: any) => void): void {|
|[UNCLEAR]|src/app/core/services/clinic-dashboard-realtime.service.ts:122|console.warn('[ClinicDashboardRealtime] No access token available. Will retry on next auth change.');|
|[UNCLEAR]|src/app/core/services/clinic-dashboard-realtime.service.ts:147|console.warn('[ClinicDashboardRealtime] Reconnecting...', error);|
|[UNCLEAR]|src/app/core/services/clinic-dashboard-realtime.service.ts:157|console.warn('[ClinicDashboardRealtime] Disconnected.', error);|
|[UNCLEAR]|src/app/core/services/push-notification.service.ts:115|console.warn('[PushNotification] Push not supported in this browser.');|
|[UNCLEAR]|src/app/core/services/push-notification.service.ts:121|console.warn('[PushNotification] Firebase config incomplete - browser push disabled.');|
|[UNCLEAR]|src/app/core/services/push-notification.service.ts:127|console.warn('[PushNotification] Permission denied.');|
|[UNCLEAR]|src/app/core/services/push-notification.service.ts:133|console.warn('[PushNotification] Service worker unavailable.');|
|[UNCLEAR]|src/app/core/services/push-notification.service.ts:139|console.warn('[PushNotification] Firebase Messaging unavailable.');|
|[UNCLEAR]|src/app/core/services/push-notification.service.ts:206|console.warn('[PushNotification] Firebase Messaging support check failed:', msg);|
|[UNCLEAR]|src/app/dev/design-system-gallery/design-system-gallery.page.html:199|<ion-input placeholder="Jane Doe"></ion-input>|
|[UNCLEAR]|src/app/dev/design-system-gallery/design-system-gallery.page.html:203|<ion-input type="email" placeholder="you@clinic.ph"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/announcements/announcements.page.ts:64|<input id="ann-title" class="form-input" [(ngModel)]="draft.title" placeholder="Announcement title" />|
|[UNCLEAR]|src/app/portals/admin/announcements/announcements.page.ts:68|<textarea id="ann-body" class="form-input form-textarea" [(ngModel)]="draft.body" placeholder="Announcement content"></textarea>|
|[UNCLEAR]|src/app/portals/admin/audit-logs/audit-logs.page.ts:38|placeholder="Search action, user, or entity ID"|
|[UNCLEAR]|src/app/portals/admin/booking-detail/booking-detail.page.ts:287|console.warn('Could not load booking details:', err?.message);|
|[UNCLEAR]|src/app/portals/admin/booking-detail/booking-detail.page.ts:314|console.warn('Could not load patient details:', err?.message);|
|[UNCLEAR]|src/app/portals/admin/booking-detail/booking-detail.page.ts:441|console.warn('Failed to record audit log:', err?.message);|
|[UNCLEAR]|src/app/portals/admin/bookings/bookings.page.ts:65|<input class="filter-input" type="search" placeholder="Search patient or booking ID" [(ngModel)]="searchQuery" />|
|[UNCLEAR]|src/app/portals/admin/bookings/bookings.page.ts:271|console.warn('Failed to load doctors:', error);|
|[UNCLEAR]|src/app/portals/admin/bookings/bookings.page.ts:435|console.warn('Failed to load bookings:', error);|
|[UNCLEAR]|src/app/portals/admin/calendar/calendar.page.ts:115|console.warn('Failed to load bookings:', error);|
|[UNCLEAR]|src/app/portals/admin/calendar/calendar.page.ts:134|console.warn('Failed to load doctors:', error);|
|[UNCLEAR]|src/app/portals/admin/components/color-picker/color-picker.component.ts:18|placeholder="#1A6B4A"|
|[MOCK DATA]|src/app/portals/admin/components/medical-records-tab/medical-records-tab.component.ts:54|<p>Current allergy list. New entries are saved to the mock store.</p>|
|[UNCLEAR]|src/app/portals/admin/components/refund-payment-modal/refund-payment-modal.component.ts:54|placeholder="Why is this payment being refunded?"|
|[UNCLEAR]|src/app/portals/admin/components/waive-payment-modal/waive-payment-modal.component.ts:54|placeholder="Why is this payment being waived?"|
|[MOCK DATA]|src/app/portals/admin/doctor-form/doctor-form.page.ts:55|<p class="page-subtitle">Photo upload is mock only for this phase.</p>|
|[UNCLEAR]|src/app/portals/admin/doctor-form/doctor-form.page.ts:62|<input class="filter-input" formControlName="fullName" placeholder="Full Name" />|
|[UNCLEAR]|src/app/portals/admin/doctor-form/doctor-form.page.ts:70|placeholder="Doctor email for social login invite"|
|[UNCLEAR]|src/app/portals/admin/doctor-form/doctor-form.page.ts:84|<input class="filter-input" formControlName="specialization" placeholder="Specialization" />|
|[UNCLEAR]|src/app/portals/admin/doctor-form/doctor-form.page.ts:88|<input class="filter-input" formControlName="licenseNumber" placeholder="License Number" />|
|[UNCLEAR]|src/app/portals/admin/doctor-form/doctor-form.page.ts:92|<input class="filter-input" formControlName="ptrNumber" placeholder="PTR Number" />|
|[UNCLEAR]|src/app/portals/admin/doctor-form/doctor-form.page.ts:96|<input class="filter-input" formControlName="s2Number" placeholder="S2 Number" />|
|[UNCLEAR]|src/app/portals/admin/doctor-form/doctor-form.page.ts:100|<input class="filter-input" type="number" formControlName="consultationFee" placeholder="Consultation Fee" />|
|[UNCLEAR]|src/app/portals/admin/doctor-form/doctor-form.page.ts:112|<input class="filter-input" type="number" formControlName="slotDurationMinutes" placeholder="Slot Duration" />|
|[UNCLEAR]|src/app/portals/admin/doctor-form/doctor-form.page.ts:116|<input class="filter-input" type="number" formControlName="slotCapacity" placeholder="Slot Capacity" />|
|[UNCLEAR]|src/app/portals/admin/doctor-form/doctor-form.page.ts:120|<input class="filter-input" type="number" formControlName="dailyPatientLimit" placeholder="Daily Patient Limit" />|
|[UNCLEAR]|src/app/portals/admin/doctor-form/doctor-form.page.ts:124|<textarea class="textarea" formControlName="bio" placeholder="Doctor bio"></textarea>|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:88|<ion-input formControlName="firstName" autocomplete="given-name" placeholder="First name"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:96|<ion-input formControlName="middleName" autocomplete="additional-name" placeholder="Middle name"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:103|<ion-input formControlName="lastName" autocomplete="family-name" placeholder="Last name"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:119|<ion-select formControlName="sex" interface="popover" placeholder="Select sex">|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:130|<ion-select formControlName="civilStatus" interface="popover" placeholder="Not specified">|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:145|<ion-input formControlName="contactNumber" autocomplete="tel" placeholder="Contact number"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:152|<ion-input type="email" formControlName="email" autocomplete="email" placeholder="Email"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:160|<ion-input formControlName="zipCode" autocomplete="postal-code" placeholder="Zip code"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:167|<ion-input formControlName="address" autocomplete="street-address" placeholder="Address"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:174|<ion-input formControlName="city" autocomplete="address-level2" placeholder="City"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:217|placeholder="Create a strong password"|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:226|<ion-input formControlName="accountAvatarUrl" placeholder="Optional avatar URL"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:240|<ion-input formControlName="emergencyContactName" placeholder="Name"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:247|<ion-input formControlName="emergencyContactNumber" placeholder="Contact number"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:254|<ion-input formControlName="emergencyContactRelationship" placeholder="Relationship"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:266|<ion-select formControlName="bloodType" interface="popover" placeholder="Not specified">|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:276|<ion-input formControlName="philHealthNumber" placeholder="PhilHealth number"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:283|<ion-input formControlName="hmoProvider" placeholder="HMO provider"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:290|<ion-input formControlName="hmoCardNumber" placeholder="HMO card number"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:86|<ion-input formControlName="firstName" autocomplete="given-name" placeholder="First name"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:94|<ion-input formControlName="middleName" autocomplete="additional-name" placeholder="Middle name"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:101|<ion-input formControlName="lastName" autocomplete="family-name" placeholder="Last name"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:117|<ion-select formControlName="sex" interface="popover" placeholder="Select sex">|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:128|<ion-select formControlName="civilStatus" interface="popover" placeholder="Not specified">|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:143|<ion-input formControlName="contactNumber" autocomplete="tel" placeholder="Contact number"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:150|<ion-input type="email" formControlName="email" autocomplete="email" placeholder="Email"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:160|<ion-input formControlName="zipCode" autocomplete="postal-code" placeholder="Zip code"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:167|<ion-input formControlName="address" autocomplete="street-address" placeholder="Address"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:174|<ion-input formControlName="city" autocomplete="address-level2" placeholder="City"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:209|placeholder="Create a strong password"|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:218|<ion-input formControlName="accountAvatarUrl" placeholder="Optional avatar URL"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:230|<ion-input formControlName="emergencyContactName" placeholder="Name"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:237|<ion-input formControlName="emergencyContactNumber" placeholder="Contact number"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:244|<ion-input formControlName="emergencyContactRelationship" placeholder="Relationship"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:256|<ion-select formControlName="bloodType" interface="popover" placeholder="Not specified">|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:266|<ion-input formControlName="philHealthNumber" placeholder="PhilHealth number"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:273|<ion-input formControlName="hmoProvider" placeholder="HMO provider"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/admin-patient-create-modal.component.ts:280|<ion-input formControlName="hmoCardNumber" placeholder="HMO card number"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/patients/patients.page.ts:37|placeholder="Search by name, code, contact, or email"|
|[UNCLEAR]|src/app/portals/admin/services/services.page.ts:113|placeholder="Service name"|
|[UNCLEAR]|src/app/portals/admin/services/services.page.ts:121|placeholder="Description"|
|[UNCLEAR]|src/app/portals/admin/services/services.page.ts:134|placeholder="Price"|
|[UNCLEAR]|src/app/portals/admin/services/services.page.ts:143|placeholder="Duration"|
|[UNCLEAR]|src/app/portals/admin/staff/staff.page.ts:86|<input class="filter-input" name="fullName" [(ngModel)]="draft.fullName" placeholder="Full Name" required />|
|[UNCLEAR]|src/app/portals/admin/staff/staff.page.ts:87|<input class="filter-input" name="email" type="email" [(ngModel)]="draft.email" placeholder="Email" required />|
|[UNCLEAR]|src/app/portals/admin/staff/staff.page.ts:88|<input class="filter-input" name="phone" [(ngModel)]="draft.phone" placeholder="Phone (optional)" />|
|[UNCLEAR]|src/app/portals/admin/walk-in/walk-in.page.ts:149|placeholder="Search by patient name, code, phone, or email"|
|[UNCLEAR]|src/app/portals/admin/walk-in/walk-in.page.ts:208|<ion-input formControlName="firstName" autocomplete="given-name" placeholder="First name"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/walk-in/walk-in.page.ts:216|<ion-input formControlName="middleName" autocomplete="additional-name" placeholder="Middle name"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/walk-in/walk-in.page.ts:223|<ion-input formControlName="lastName" autocomplete="family-name" placeholder="Last name"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/walk-in/walk-in.page.ts:239|<ion-select formControlName="sex" interface="popover" placeholder="Select sex">|
|[UNCLEAR]|src/app/portals/admin/walk-in/walk-in.page.ts:250|<ion-input formControlName="contactNumber" autocomplete="tel" placeholder="Contact number"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/walk-in/walk-in.page.ts:257|<ion-input type="email" formControlName="email" autocomplete="email" placeholder="Email"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/walk-in/walk-in.page.ts:266|<ion-input formControlName="address" autocomplete="street-address" placeholder="Address"></ion-input>|
|[UNCLEAR]|src/app/portals/admin/walk-in/walk-in.page.ts:334|<ion-select formControlName="doctorId" interface="popover" placeholder="Select doctor">|
|[UNCLEAR]|src/app/portals/admin/walk-in/walk-in.page.ts:351|placeholder="Select service"|
|[UNCLEAR]|src/app/portals/doctor/appointments/doctor-appointments.page.ts:94|<input type="search" [(ngModel)]="searchQuery" placeholder="Search queue" />|
|[UNCLEAR]|src/app/portals/doctor/components/diagnosis-picker/diagnosis-picker.component.ts:84|placeholder="Search by code or description"|
|[UNCLEAR]|src/app/portals/doctor/components/doctor-schedule-editor/doctor-schedule-editor.component.ts:67|placeholder="No limit"|
|[UNCLEAR]|src/app/portals/doctor/components/doctor-schedule-editor/doctor-schedule-editor.component.ts:149|<ion-input type="date" [(ngModel)]="blockedDateValue" placeholder="Choose date"></ion-input>|
|[UNCLEAR]|src/app/portals/doctor/components/doctor-schedule-editor/doctor-schedule-editor.component.ts:150|<ion-input type="text" [(ngModel)]="blockedReason" placeholder="Reason"></ion-input>|
|[UNCLEAR]|src/app/portals/doctor/components/prescription-builder/medication-picker-modal.component.ts:36|placeholder="Search options"|
|[UNCLEAR]|src/app/portals/doctor/components/prescription-builder/prescription-builder.component.ts:71|placeholder="Start typing"|
|[UNCLEAR]|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:52|<textarea id="overrideReason" [(ngModel)]="overrideReason" [ngModelOptions]="{ standalone: true }" rows="2" placeholder="Clinical justification required"></textarea>|
|[UNCLEAR]|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:68|placeholder="Start typing drug name..."|
|[UNCLEAR]|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:85|<input id="rx-strength" formControlName="strength" placeholder="e.g. 500mg" [readonly]="isReadOnlyFields" />|
|[UNCLEAR]|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:93|placeholder="e.g. Tablet"|
|[UNCLEAR]|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:110|placeholder="e.g. Oral"|
|[UNCLEAR]|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:127|placeholder="e.g. TID"|
|[UNCLEAR]|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:141|<input id="rx-duration" formControlName="duration" placeholder="e.g. 7 days" [readonly]="isReadOnlyFields" />|
|[UNCLEAR]|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:154|placeholder="e.g. Take after meals"|
|[UNCLEAR]|src/app/portals/doctor/components/soap-form/soap-form.component.ts:59|<ion-textarea #chiefComplaintInput formControlName="chiefComplaint" autoGrow="true" placeholder="Required"></ion-textarea>|
|[UNCLEAR]|src/app/portals/doctor/components/vaccination-form/vaccination-form.component.ts:78|<input [(ngModel)]="draft.vaccineName" name="vaccineName" placeholder="e.g. Influenza, Hepatitis B" required [disabled]="locked \|\| !canEdit" />|
|[UNCLEAR]|src/app/portals/doctor/components/vaccination-form/vaccination-form.component.ts:100|<input [(ngModel)]="draft.manufacturer" name="manufacturer" placeholder="e.g. Sanofi" [disabled]="locked \|\| !canEdit" />|
|[UNCLEAR]|src/app/portals/doctor/components/vaccination-form/vaccination-form.component.ts:104|<input [(ngModel)]="draft.lotNumber" name="lotNumber" placeholder="e.g. L12345" [disabled]="locked \|\| !canEdit" />|
|[UNCLEAR]|src/app/portals/doctor/components/vaccination-form/vaccination-form.component.ts:108|<input type="number" min="0" step="0.01" [(ngModel)]="draft.doseAmount" name="doseAmount" placeholder="e.g. 0.5" [disabled]="locked \|\| !canEdit" />|
|[UNCLEAR]|src/app/portals/doctor/components/vaccination-form/vaccination-form.component.ts:145|<textarea [(ngModel)]="draft.notes" name="notes" rows="2" placeholder="Any additional notes about this vaccination..." [disabled]="locked \|\| !canEdit"></textarea>|
|[UNCLEAR]|src/app/portals/doctor/components/vaccination-form/vaccination-form.component.ts:149|<textarea [(ngModel)]="draft.reactionNotes" name="reactionNotes" rows="2" placeholder="Any adverse reactions or observations..." [disabled]="locked \|\| !canEdit"></textarea>|
|[UNCLEAR]|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts:82|<ion-input type="number" formControlName="bloodPressureSystolic" placeholder="e.g. 120" (ionBlur)="markTouched('bloodPressureSystolic')"></ion-input>|
|[UNCLEAR]|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts:94|<ion-input type="number" formControlName="bloodPressureDiastolic" placeholder="e.g. 80" (ionBlur)="markTouched('bloodPressureDiastolic')"></ion-input>|
|[UNCLEAR]|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts:106|<ion-input type="number" formControlName="heartRate" placeholder="bpm" (ionBlur)="markTouched('heartRate')"></ion-input>|
|[UNCLEAR]|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts:118|<ion-input type="number" formControlName="respiratoryRate" placeholder="breaths/min" (ionBlur)="markTouched('respiratoryRate')"></ion-input>|
|[UNCLEAR]|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts:129|<ion-input type="number" formControlName="painScore" placeholder="0 - 10" (ionBlur)="markTouched('painScore')"></ion-input>|
|[UNCLEAR]|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts:140|<ion-input type="number" formControlName="temperatureCelsius" placeholder="e.g. 36.8" (ionBlur)="markTouched('temperatureCelsius')"></ion-input>|
|[UNCLEAR]|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts:151|<ion-input type="number" formControlName="oxygenSaturation" placeholder="0 - 100" (ionBlur)="markTouched('oxygenSaturation')"></ion-input>|
|[UNCLEAR]|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts:162|<ion-input type="number" formControlName="weightKg" placeholder="kg" (ionBlur)="markTouched('weightKg')"></ion-input>|
|[UNCLEAR]|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts:173|<ion-input type="number" formControlName="heightCm" placeholder="cm" (ionBlur)="markTouched('heightCm')"></ion-input>|
|[UNCLEAR]|src/app/portals/doctor/consultation/components/professional-fee-decision-form.component.ts:55|placeholder="Fee adjustment reason, if any"|
|[UNCLEAR]|src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts:29|subtitle="Phase 9 placeholder"|
|[UNCLEAR]|src/app/portals/doctor/consultation/doctor-consultation.page.ts:1579|console.warn('[DoctorConsultation] Failed to queue draft change', error);|
|[UNCLEAR]|src/app/portals/doctor/consultation/doctor-consultation.page.ts:1605|console.warn('[DoctorConsultation] Failed to sync offline changes', error);|
|[UNCLEAR]|src/app/portals/doctor/consultation/doctor-consultation.page.ts:1894|console.warn('[DoctorConsultation] Failed to record amendment audit log', error);|
|[UNCLEAR]|src/app/portals/doctor/patients/doctor-patients.page.ts:27|<input class="si" [(ngModel)]="searchQuery" placeholder="Search by patient name..." />|
|[UNCLEAR]|src/app/portals/doctor/patients/doctor-patients.page.ts:143|console.warn('Failed to load doctor patients from API:', err);|
|[UNCLEAR]|src/app/portals/doctor/profile/doctor-profile.page.ts:88|placeholder="Describe your practice, experience, and approach to care. This appears on your public booking page."|
|[NOT IMPLEMENTED]|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:121|<button type="button" class="btn-ghost" style="width: 100%; text-align: left; padding-left: 0;" (click)="navigateToDocuments()">|
|[NOT IMPLEMENTED]|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:318|navigateToDocuments(): void {|
|[UNCLEAR]|src/app/portals/patient/components/proof-submission-form/proof-submission-form.component.ts:37|Choose a proof type and provide a reference number or placeholder screenshot filename.|
|[UNCLEAR]|src/app/portals/patient/components/proof-submission-form/proof-submission-form.component.ts:42|<ion-select formControlName="proofType" placeholder="Select proof type">|
|[UNCLEAR]|src/app/portals/patient/components/proof-submission-form/proof-submission-form.component.ts:53|<ion-input formControlName="referenceNumber" placeholder="e.g. GCash reference"></ion-input>|
|[UNCLEAR]|src/app/portals/patient/components/proof-submission-form/proof-submission-form.component.ts:66|placeholder="screenshot-proof.png"|
|[UNCLEAR]|src/app/portals/patient/components/review-form/review-form.component.ts:30|placeholder="Share your experience (optional)"|
|[UNCLEAR]|src/app/portals/patient/dashboard/patient-dashboard.page.ts:372|console.warn('Failed to load doctors:', error);|
|[UNCLEAR]|src/app/portals/patient/medical-records/patient-medical-records.page.ts:32|placeholder="Search by doctor, diagnosis, soap notes, or follow-up"|
|[UNCLEAR]|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts:32|placeholder="Search by doctor, medicine, route, or instructions"|
|[UNCLEAR]|src/app/portals/patient/reviews/patient-reviews.page.ts:95|console.warn('[PatientReviewsPage] reviews endpoint not available — assuming no existing review.');|
|[UNCLEAR]|src/app/portals/patient/reviews/patient-reviews.page.ts:126|console.warn('[PatientReviewsPage] Could not save review:', err?.message ?? err);|
|[UNCLEAR]|src/app/portals/patient/vaccinations/patient-vaccinations.page.ts:23|placeholder="Search by vaccine name, manufacturer, or notes"|
|[UNCLEAR]|src/app/portals/public/announcements/announcements.page.ts:21|<app-skeleton *ngFor="let _ of skeletonPlaceholders" variant="card" />|
|[UNCLEAR]|src/app/portals/public/announcements/announcements.page.ts:41|readonly skeletonPlaceholders = [0, 1, 2];|
|[UNCLEAR]|src/app/portals/public/components/announcement-card/announcement-card.component.scss:29|.announcement-card__img-placeholder {|
|[UNCLEAR]|src/app/portals/public/components/announcement-card/announcement-card.component.ts:14|<span *ngIf="!announcement.imageUrl" class="announcement-card__img-placeholder" aria-hidden="true"|
|[UNCLEAR]|src/app/portals/public/components/step-date-picker/step-date-picker.component.ts:158|console.warn('[StepDatePicker] Doctor has no working days defined.');|
|[UNCLEAR]|src/app/portals/public/components/step-payment/step-payment.component.ts:65|placeholder="Add any visit notes or special instructions."|
|[UNCLEAR]|src/app/portals/public/components/step-proof/step-proof.component.ts:64|placeholder="e.g. GC1234567890"|
|[UNCLEAR]|src/app/portals/public/components/step-proof/step-proof.component.ts:274|console.warn('Unable to resolve the signed-in patient profile for booking submission.', error);|
|[UNCLEAR]|src/app/portals/staff/dashboard/staff-dashboard.page.ts:243|console.warn('Failed to load doctors:', error);|
|[UNCLEAR]|src/app/portals/staff/doctor-status/doctor-status.page.ts:127|console.warn('Failed to load doctors:', err);|
|[UNCLEAR]|src/app/portals/staff/patient-detail/staff-patient-detail.page.html:122|<input class="portal-account-input" type="email" formControlName="email" autocomplete="email" placeholder="Patient email" />|
|[UNCLEAR]|src/app/portals/staff/patient-detail/staff-patient-detail.page.html:133|placeholder="Temporary password"|
|[UNCLEAR]|src/app/portals/staff/patient-detail/staff-patient-detail.page.html:145|placeholder="Confirm temporary password"|
|[UNCLEAR]|src/app/portals/staff/patients/staff-patients.page.scss:8|.sc .fi::placeholder{color:#94a3b8}|
|[UNCLEAR]|src/app/portals/staff/patients/staff-patients.page.ts:28|<input class="fi" [formControl]="searchControl" placeholder="Search by name, code, contact, or email" aria-label="Search patients" />|
|[UNCLEAR]|src/app/portals/staff/walk-in/staff-walk-in.page.scss:200|--placeholder-color: var(--clinic-text-muted);|
|[UNCLEAR]|src/app/portals/staff/walk-in/staff-walk-in.page.ts:149|placeholder="Search by patient name, code, phone, or email"|
|[UNCLEAR]|src/app/portals/staff/walk-in/staff-walk-in.page.ts:211|<ion-input formControlName="firstName" autocomplete="given-name" placeholder="First name"></ion-input>|
|[UNCLEAR]|src/app/portals/staff/walk-in/staff-walk-in.page.ts:220|<ion-input formControlName="middleName" autocomplete="additional-name" placeholder="Middle name"></ion-input>|
|[UNCLEAR]|src/app/portals/staff/walk-in/staff-walk-in.page.ts:228|<ion-input formControlName="lastName" autocomplete="family-name" placeholder="Last name"></ion-input>|
|[UNCLEAR]|src/app/portals/staff/walk-in/staff-walk-in.page.ts:246|<ion-select formControlName="sex" interface="popover" placeholder="Select sex">|
|[UNCLEAR]|src/app/portals/staff/walk-in/staff-walk-in.page.ts:258|<ion-input formControlName="contactNumber" autocomplete="tel" placeholder="Contact number"></ion-input>|
|[UNCLEAR]|src/app/portals/staff/walk-in/staff-walk-in.page.ts:266|<ion-input type="email" formControlName="email" autocomplete="email" placeholder="Email"></ion-input>|
|[UNCLEAR]|src/app/portals/staff/walk-in/staff-walk-in.page.ts:276|<ion-input formControlName="address" autocomplete="street-address" placeholder="Address"></ion-input>|
|[UNCLEAR]|src/app/portals/staff/walk-in/staff-walk-in.page.ts:345|<ion-select formControlName="doctorId" interface="popover" placeholder="Select doctor">|
|[UNCLEAR]|src/app/portals/staff/walk-in/staff-walk-in.page.ts:362|placeholder="Select service"|
|[UNCLEAR]|src/app/shared/components/booking-print-document/booking-print-document.component.ts:54|<div class="booking-print-document__logo" *ngIf="data.logoUrl; else logoPlaceholder">|
|[UNCLEAR]|src/app/shared/components/booking-print-document/booking-print-document.component.ts:57|<ng-template #logoPlaceholder>|
|[UNCLEAR]|src/app/shared/components/booking-print-document/booking-print-document.component.ts:58|<div class="booking-print-document__logo booking-print-document__logo--placeholder">LOGO</div>|
|[UNCLEAR]|src/app/shared/components/confirm-modal/confirm-modal.component.ts:25|[placeholder]="reasonLabel"|
|[UNCLEAR]|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:81|<input class="filter-input" [formControl]="form.controls.title" [placeholder]="titlePlaceholder" />|
|[UNCLEAR]|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:81|<input class="filter-input" [formControl]="form.controls.title" [placeholder]="titlePlaceholder" />|
|[UNCLEAR]|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:120|placeholder="Search by file name, title, notes, or linked IDs"|
|[UNCLEAR]|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:296|get titlePlaceholder(): string {|
# UPDATED ROUTE FEATURE INVENTORY

Generated from the current uploaded Ionic/Angular frontend zip. This is a static code audit; runtime-only backend behavior, exact backend authorization, and live data correctness remain marked `[TEAM TO VERIFY]` or `[UNCLEAR]`.

## Audit Legend
- `[MOCK DATA]` — mock-data file/import/reference or dev-only/static placeholder found in frontend source.
- `[UNCLEAR]` — cannot be proven from frontend static code alone.
- `[NOT IMPLEMENTED]` — route/component exists but appears stubbed, placeholder, redirect-only, or behavior is incomplete from source inspection.
- `[TEAM TO VERIFY]` — must be verified with backend/API contract, seeded accounts, browser runtime, or user flow testing.
- `[QA BLOCKER]` — do not mark a QA item PASS unless the tester provides evidence.

## Source Snapshot
|Metric|Value|
|---|---|
|Source folder|.|
|Angular TS files scanned|237|
|HTML templates scanned|10|
|SCSS files detected|139|
|Mock data files detected|11|
|Route entries inventoried|63|
|Dev API base URL|'http://localhost:5000/api'|
|Dev SignalR URL|'http://localhost:5000/hubs/clinic-dashboard'|
|Prod API base URL|'https://api.yourclinicdomain.com/api'|
|useMockData flag|dev=false; prod=false|

## Global Route Guards and Redirect Rules
|Mechanism|File|Behavior / QA meaning|
|---|---|---|
|Root redirect|src/app/app.routes.ts|`/` redirects to `/public`.|
|Public routes|src/app/portals/public/public.routes.ts|Public layout child routes; no auth guard in route definitions.|
|Auth routes|src/app/auth/auth.routes.ts|Login/register/callback/forgot/reset public; set-password requires auth; privacy-consent requires Patient role.|
|Admin app route|src/app/app.routes.ts + src/app/portals/admin/admin.routes.ts|Top-level and child route both apply `authGuard + roleGuard + firstLoginGuard`; data role Admin.|
|Staff app route|src/app/app.routes.ts + src/app/portals/staff/staff.routes.ts|Top-level uses `authGuard + roleGuard + firstLoginGuard`; child layout uses `authGuard + roleGuard`; data role Staff.|
|Doctor app route|src/app/app.routes.ts + src/app/portals/doctor/doctor.routes.ts|Top-level uses `authGuard + roleGuard + firstLoginGuard`; child layout uses `authGuard + roleGuard`; data role Doctor.|
|Patient app route|src/app/app.routes.ts + src/app/portals/patient/patient.routes.ts|Top-level uses `authGuard + roleGuard + firstLoginGuard`; child layout uses `authGuard + roleGuard`; data role Patient.|
|Wildcard|src/app/app.routes.ts and child route files|Unknown root/child routes render shared NotFound page.|

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

## Route Map Summary
|Role|Route URL|Page/component file|Class|Layout/shell|Access control|
|---|---|---|---|---|---|
|Public/Guest|/public|src/app/portals/public/home/home.page.ts|HomePage|PublicLayoutComponent|None|
|Public/Guest|/public/doctors|src/app/portals/admin/doctors/doctors.page.ts|DoctorsPage|PublicLayoutComponent|None|
|Public/Guest|/public/doctors/:id|src/app/portals/doctor/profile/doctor-profile.page.ts|DoctorProfilePage|PublicLayoutComponent|None|
|Public/Guest|/public/services|src/app/portals/admin/services/services.page.ts|ServicesPage|PublicLayoutComponent|None|
|Public/Guest|/public/announcements|src/app/portals/admin/announcements/announcements.page.ts|AnnouncementsPage|PublicLayoutComponent|None|
|Public/Guest|/public/booking|src/app/portals/public/booking/booking.page.ts|BookingPage|PublicLayoutComponent|None|
|Public/Guest|/public/booking-confirmation/:bookingId|src/app/portals/public/booking-confirmation/booking-confirmation.page.ts|BookingConfirmationPage|PublicLayoutComponent|None|
|Public/Guest|/public/privacy-policy|src/app/portals/public/privacy-policy/privacy-policy.page.ts|PrivacyPolicyPage|PublicLayoutComponent|None|
|Auth/Public|/auth/login|src/app/auth/login/login.page.ts|LoginPage|Auth layout/page-owned|authGuard|
|Auth/Public|/auth/register|src/app/auth/register/register.page.ts|RegisterPage|Auth layout/page-owned|authGuard|
|Auth/Public|/auth/callback|src/app/auth/callback/auth-callback.page.ts|AuthCallbackPage|Auth layout/page-owned|authGuard|
|Auth/Public|/auth/forgot-password|src/app/auth/forgot-password/forgot-password.page.ts|ForgotPasswordPage|Auth layout/page-owned|authGuard|
|Auth/Public|/auth/reset-password|src/app/auth/reset-password/reset-password.page.ts|ResetPasswordPage|Auth layout/page-owned|authGuard|
|Auth/Public|/auth/set-password|src/app/auth/set-password/set-password.page.ts|SetPasswordPage|Auth layout/page-owned|authGuard|
|Auth/Public|/auth/privacy-consent|src/app/auth/privacy-consent/privacy-consent.page.ts|PrivacyConsentPage|Auth layout/page-owned|authGuard + roleGuard|
|Admin|/admin/dashboard|src/app/portals/admin/dashboard/dashboard.ts|DashboardPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/bookings|src/app/portals/admin/bookings/bookings.ts|BookingsPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/bookings/:id|src/app/portals/admin/booking-detail/booking-detail.ts|BookingDetailPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/walk-in|src/app/portals/admin/walk-in/walk-in.ts|WalkInPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/calendar|src/app/portals/admin/calendar/calendar.ts|CalendarPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/doctors|src/app/portals/admin/doctors/doctors.ts|DoctorsPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/doctors/new|src/app/portals/admin/doctor-form/doctor-form.ts|DoctorFormPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/doctors/:id/edit|src/app/portals/admin/doctor-form/doctor-form.ts|DoctorFormPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/services|src/app/portals/admin/services/services.ts|ServicesPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/patients|src/app/portals/admin/patients/patients.ts|PatientsPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/patients/:id|src/app/portals/admin/patient-detail/patient-detail.ts|PatientDetailPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/staff|src/app/portals/admin/staff/staff.ts|StaffPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/announcements|src/app/portals/admin/announcements/announcements.ts|AnnouncementsPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/settings|src/app/portals/admin/settings/settings.ts|SettingsPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/audit-logs|src/app/portals/admin/audit-logs/audit-logs.ts|AuditLogsPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Admin|/admin/reports|src/app/portals/admin/reports/reports.ts|ReportsPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard|
|Staff|/staff/dashboard|src/app/portals/staff/dashboard/staff-dashboard.ts|StaffDashboardPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Staff|/staff/bookings|src/app/portals/staff/bookings/staff-bookings.ts|StaffBookingsPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Staff|/staff/payments|src/app/portals/staff/payments/staff-payments.ts|StaffPaymentsPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Staff|/staff/bookings/:id|src/app/portals/staff/booking-detail/staff-booking-detail.ts|StaffBookingDetailPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Staff|/staff/walk-in|src/app/portals/staff/walk-in/staff-walk-in.ts|StaffWalkInPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Staff|/staff/patients|src/app/portals/staff/patients/staff-patients.ts|StaffPatientsPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Staff|/staff/patients/:id|src/app/portals/staff/patient-detail/staff-patient-detail.ts|StaffPatientDetailPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Staff|/staff/doctor-status|src/app/portals/staff/doctor-status/doctor-status.ts|DoctorStatusPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Staff|/staff/profile|src/app/portals/staff/profile/staff-profile.ts|StaffProfilePage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Doctor|/doctor/dashboard|src/app/portals/doctor/dashboard/doctor-dashboard.ts|DoctorDashboardPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Doctor|/doctor/appointments|src/app/portals/doctor/appointments/doctor-appointments.ts|DoctorAppointmentsPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Doctor|/doctor/appointments/:id|src/app/portals/doctor/appointment-detail/doctor-appointment-detail.ts|DoctorAppointmentDetailPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Doctor|/doctor/patients|src/app/portals/doctor/patients/doctor-patients.ts|DoctorPatientsPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Doctor|/doctor/patients/:id|src/app/portals/doctor/patient-detail/doctor-patient-detail.ts|DoctorPatientDetailPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Doctor|/doctor/schedule|src/app/portals/doctor/schedule/doctor-schedule.ts|DoctorSchedulePage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Doctor|/doctor/consultation/:bookingId|src/app/portals/doctor/consultation/doctor-consultation.ts|DoctorConsultationPage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Doctor|/doctor/my-profile|src/app/portals/doctor/profile/doctor-profile.ts|DoctorProfilePage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Doctor|/doctor/profile|src/app/portals/doctor/profile/doctor-profile.ts|DoctorProfilePage|PortalLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Patient|/patient/dashboard|src/app/portals/patient/dashboard/patient-dashboard.ts|PatientDashboardPage|PatientLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Patient|/patient/doctors|src/app/portals/patient/doctors/patient-doctors.ts|PatientDoctorsPage|PatientLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Patient|/patient/bookings|src/app/portals/patient/bookings/patient-bookings.ts|PatientBookingsPage|PatientLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Patient|/patient/documents|src/app/portals/patient/documents/patient-documents.ts|PatientDocumentsPage|PatientLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Patient|/patient/lab-results|src/app/portals/patient/lab-results/patient-lab-results.ts|PatientLabResultsPage|PatientLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Patient|/patient/labs|src/app/portals/patient/labs-redirect/patient-labs-redirect.ts|PatientLabsRedirectPage|PatientLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Patient|/patient/bookings/:id|src/app/portals/patient/booking-detail/patient-booking-detail.ts|PatientBookingDetailPage|PatientLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Patient|/patient/medical-records|src/app/portals/patient/medical-records/patient-medical-records.ts|PatientMedicalRecordsPage|PatientLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Patient|/patient/prescriptions|src/app/portals/patient/prescriptions/patient-prescriptions.ts|PatientPrescriptionsPage|PatientLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Patient|/patient/vaccinations|src/app/portals/patient/vaccinations/patient-vaccinations.ts|PatientVaccinationsPage|PatientLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Patient|/patient/profile|src/app/portals/patient/profile/patient-profile.ts|PatientProfilePage|PatientLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Patient|/patient/reviews/:bookingId|src/app/portals/patient/reviews/patient-reviews.ts|PatientReviewsPage|PatientLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Patient|/patient/privacy-consent|src/app/portals/patient/privacy-consent/patient-privacy-consent.ts|PatientPrivacyConsentPage|PatientLayoutComponent|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Dev/Public|/dev/gallery|src/app/dev/design-system-gallery/design-system-gallery.ts|DesignSystemGalleryPage|None|None|

## Public/Guest Routes

### `/public`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/portals/public/home/home.page.ts|
|Component class|HomePage|
|Layout/shell|PublicLayoutComponent|
|Access control|None|
|Route params from URL|None from URL pattern|
|Role data|None|

#### 2. Data Dependencies
- Injected dependencies detected: ApiService, Router
- Direct `ApiService` / API-wrapper calls detected in the route component:
|Method|Line|Expression|
|---|---|---|
|get|81|`readonly doctors$ = this.apiService.get<any[]>('doctors');`|
|get|82|`readonly services$ = this.apiService.get<any[]>('services');`|
|get|83|`readonly announcements$ = this.apiService.get<any[]>('announcements');`|
|get|84|`readonly settings$ = this.apiService.get<any>('settings');`|

#### 3. Full Interaction Audit
- Template source: `inline`
- Clickable/navigation/event elements detected:
|Template line|Element/event|
|---|---|
|16|`<a routerLink="/public/doctors" class="btn-outline">View All Doctors →</a>`|
- Programmatic navigation detected:
|TS line|Expression|
|---|---|
|110|`this.router.navigate(['/public/services'], { queryParams: { category } });`|
- Child `app-*` components rendered: `app-hero-section`, `app-operating-hours-bar`, `app-doctor-card`, `app-service-category-card`, `app-announcement-card`
- Standalone imports/components/modules detected: `AsyncPipe`, `HeroSectionComponent`, `OperatingHoursBarComponent`, `DoctorCardComponent`, `ServiceCategoryCardComponent`, `AnnouncementCardComponent`
- Main lifecycle/action methods detected: `onCategorySelect()`

#### 4. Page States and Runtime Conditions
- State indicators/keywords detected: Offline.
- `[QA BLOCKER]` A tester must prove: page loaded, loading ended, no console error, API calls returned expected status, empty/error states are not accidentally hiding data, and refresh does not lose successful changes.

#### 5. Flags / Dead or Incomplete Notes
- No obvious mock/TODO/placeholder/console flag found in this route component. `[TEAM TO VERIFY]`

### `/public/doctors`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public/doctors|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/portals/admin/doctors/doctors.page.ts|
|Component class|DoctorsPage|
|Layout/shell|PublicLayoutComponent|
|Access control|None|
|Route params from URL|None from URL pattern|
|Role data|None|

#### 2. Data Dependencies
- Injected dependencies detected: ApiService, Router, ToastController, DestroyRef
- Direct `ApiService` / API-wrapper calls detected in the route component:
|Method|Line|Expression|
|---|---|---|
|get|289|`this.apiService.get<any[]>('doctors/' + doctor.id + '/schedule').pipe(`|

#### 3. Full Interaction Audit
- Template source: `inline`
- Clickable/navigation/event elements detected:
|Template line|Element/event|
|---|---|
|8|`<button type="button" class="btn-primary" (click)="addDoctor()">Add Doctor</button>`|
|36|`(click)="!isBusy(doctor.id) && editDoctor(doctor.id)"`|
|49|`<button`|
|54|`(click)="editDoctor(doctor.id); $event.stopPropagation()"`|
|58|`<button`|
|63|`(click)="askDeactivate(doctor.id, $event)"`|
|81|`(click)="!isBusy(doctor.id) && editDoctor(doctor.id)"`|
|110|`<button`|
|115|`(click)="editDoctor(doctor.id); $event.stopPropagation()"`|
|119|`<button`|
|124|`(click)="askDeactivate(doctor.id, $event)"`|
- Programmatic navigation detected:
|TS line|Expression|
|---|---|
|208|`void this.router.navigate(['/admin/doctors/new']);`|
|212|`void this.router.navigate(['/admin/doctors', id, 'edit']);`|
- Child `app-*` components rendered: `app-avatar`, `app-status-badge`, `app-empty-state`, `app-confirm-modal`
- Standalone imports/components/modules detected: `AvatarComponent`, `ConfirmModalComponent`, `EmptyStateComponent`, `StatusBadgeComponent`
- Main lifecycle/action methods detected: `constructor()`, `ngOnInit()`, `cancelDeactivate()`

#### 4. Page States and Runtime Conditions
- State indicators/keywords detected: Loading, Error, Empty, Success, Disabled, Offline.
- `[QA BLOCKER]` A tester must prove: page loaded, loading ended, no console error, API calls returned expected status, empty/error states are not accidentally hiding data, and refresh does not lose successful changes.

#### 5. Flags / Dead or Incomplete Notes
- No obvious mock/TODO/placeholder/console flag found in this route component. `[TEAM TO VERIFY]`

### `/public/doctors/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public/doctors/:id|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/portals/doctor/profile/doctor-profile.page.ts|
|Component class|DoctorProfilePage|
|Layout/shell|PublicLayoutComponent|
|Access control|None|
|Route params from URL|id|
|Role data|None|

#### 2. Data Dependencies
- Injected dependencies detected: FormBuilder, ApiService, ToastController, DestroyRef
- No direct API-wrapper call detected in this route component. Check feature-service calls and child components. `[UNCLEAR]`

#### 3. Full Interaction Audit
- Template source: `inline`
- Clickable/navigation/event elements detected:
|Template line|Element/event|
|---|---|
|12|`<form class="clinic-card profile-form" [formGroup]="profileForm" (ngSubmit)="save()">`|
|22|`<button type="button" class="photo-preview" (click)="photoInput.click()" [attr.aria-label]="'Upload profile photo'">`|
|33|`<input #photoInput type="file" accept="image/*" hidden (change)="onPhotoUpload($event)" />`|
|109|`<button type="submit" class="btn-primary" [disabled]="profileForm.invalid \|\| isSaving">`|
|147|`<a class="edit-link" routerLink="/doctor/schedule">Edit in Schedule →</a>`|
|163|`<form class="profile-form" [formGroup]="passwordForm" (ngSubmit)="changePassword()">`|
|199|`<button type="submit" class="btn-primary" [disabled]="changingPassword">`|
- Form controls / form logic detected:
  - Template controls: fullName, specialization, bio, consultationFee, licenseNumber, ptrNumber, s2Number, currentPassword, newPassword, confirmPassword
|TS line|Form/validator expression|
|---|---|
|4|`import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';`|
|256|`private readonly fb = inject(FormBuilder);`|
|272|`fullName: ['', Validators.required],`|
|273|`specialization: ['', Validators.required],`|
|275|`consultationFee: [0, [Validators.required, Validators.min(0)]],`|
|283|`currentPassword: ['', Validators.required],`|
|284|`newPassword: ['', [Validators.required, passwordStrengthValidator]],`|
|285|`confirmPassword: ['', Validators.required]`|
- Child `app-*` components rendered: `app-page-header`, `app-status-badge`, `app-empty-state`
- Standalone imports/components/modules detected: `ReactiveFormsModule`, `PageHeaderComponent`, `EmptyStateComponent`, `StatusBadgeComponent`
- Main lifecycle/action methods detected: `ngOnInit()`, `onPhotoUpload()`, `save()`

#### 4. Page States and Runtime Conditions
- State indicators/keywords detected: Loading, Error, Empty, Success, Disabled, Offline.
- `[QA BLOCKER]` A tester must prove: page loaded, loading ended, no console error, API calls returned expected status, empty/error states are not accidentally hiding data, and refresh does not lose successful changes.

#### 5. Flags / Dead or Incomplete Notes
- `[PLACEHOLDER]` detected:
  - `L88: placeholder="Describe your practice, experience, and approach to care. This appears on your public booking page."`

### `/public/services`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public/services|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/portals/admin/services/services.page.ts|
|Component class|ServicesPage|
|Layout/shell|PublicLayoutComponent|
|Access control|None|
|Route params from URL|None from URL pattern|
|Role data|None|

#### 2. Data Dependencies
- Injected dependencies detected: ApiService, ToastController, DestroyRef
- Direct `ApiService` / API-wrapper calls detected in the route component:
|Method|Line|Expression|
|---|---|---|
|put|275|`? this.apiService.put<any>('services/' + this.editingId, payload).pipe(`|
|post|278|`: this.apiService.post<any>('services', payload).pipe(`|
|get|308|`services: this.apiService.get<any[]>('services').pipe(`|
|get|315|`doctors: this.apiService.get<any[]>('doctors/admin').pipe(`|
- Feature/service calls detected from the route component:
|Service/object|Method|Line|Expression|
|---|---|---|---|
|busyServiceIds|add|218|`this.busyServiceIds.add(service.id);`|
|busyServiceIds|delete|224|`this.busyServiceIds.delete(service.id);`|
|busyServiceIds|add|243|`this.busyServiceIds.add(id);`|
|busyServiceIds|delete|248|`this.busyServiceIds.delete(id);`|
|busyServiceIds|has|301|`return this.busyServiceIds.has(id);`|

#### 3. Full Interaction Audit
- Template source: `inline`
- Clickable/navigation/event elements detected:
|Template line|Element/event|
|---|---|
|8|`<button class="btn-primary" type="button" (click)="openModal()">Add Service</button>`|
|42|`<button`|
|46|`(click)="toggle(service)"`|
|50|`<button`|
|54|`(click)="edit(service)"`|
|58|`<button`|
|62|`(click)="remove(service.id)"`|
|91|`<form #serviceForm="ngForm" class="modal-form" novalidate (ngSubmit)="save(serviceForm)">`|
|132|`<button type="button" class="btn-ghost" (click)="closeModal()">Cancel</button>`|
|133|`<button type="submit" class="btn-primary" [disabled]="isSaving \|\| serviceForm.invalid">`|
- Child `app-*` components rendered: `app-status-badge`, `app-empty-state`
- Standalone imports/components/modules detected: `FormsModule`, `EmptyStateComponent`, `StatusBadgeComponent`
- Main lifecycle/action methods detected: `ngOnInit()`, `openModal()`, `closeModal()`, `toggle()`, `save()`, `onModalDismiss()`

#### 4. Page States and Runtime Conditions
- State indicators/keywords detected: Loading, Error, Empty, Success, Disabled, Offline.
- `[QA BLOCKER]` A tester must prove: page loaded, loading ended, no console error, API calls returned expected status, empty/error states are not accidentally hiding data, and refresh does not lose successful changes.

#### 5. Flags / Dead or Incomplete Notes
- `[PLACEHOLDER]` detected:
  - `L113: placeholder="Service name"`
  - `L121: placeholder="Description"`
  - `L134: placeholder="Price"`
  - `L143: placeholder="Duration"`

### `/public/announcements`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public/announcements|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/portals/admin/announcements/announcements.page.ts|
|Component class|AnnouncementsPage|
|Layout/shell|PublicLayoutComponent|
|Access control|None|
|Route params from URL|None from URL pattern|
|Role data|None|

#### 2. Data Dependencies
- Injected dependencies detected: ApiService
- Direct `ApiService` / API-wrapper calls detected in the route component:
|Method|Line|Expression|
|---|---|---|
|get|114|`this.api.get<any[]>('announcements').pipe(takeUntil(this.ngUnsubscribe)).subscribe({`|
|put|149|`? this.api.put('announcements/' + this.editingId, { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive }) : this.api.post('announcements', { title: this.draft.title, body: this.draft.body, isA…`|
|post|150|`: this.api.post('announcements', { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive });`|
|put|165|`this.api.put('announcements/' + id, { isActive: newActive }).pipe(takeUntil(this.ngUnsubscribe)).subscribe({`|
|delete|181|`this.api.delete('announcements/' + this.deletingId).pipe(takeUntil(this.ngUnsubscribe)).subscribe({`|

#### 3. Full Interaction Audit
- Template source: `inline`
- Clickable/navigation/event elements detected:
|Template line|Element/event|
|---|---|
|7|`<button class="btn-primary" type="button" (click)="openModal()">Add Announcement</button>`|
|20|`<button class="btn-ghost" type="button" (click)="edit(ann)">Edit</button>`|
|21|`<button class="btn-ghost" type="button" (click)="toggle(ann.id)">{{ ann.isActive ? 'Deactivate' : 'Activate' }}</button>`|
|22|`<button class="btn-ghost" type="button" (click)="askDelete(ann.id)">Delete</button>`|
|42|`<button class="btn-ghost" type="button" (click)="closeModal()">Cancel</button>`|
|58|`<button class="btn-primary" type="button" (click)="save()">{{ editingId ? 'Update' : 'Create' }}</button>`|
- Child `app-*` components rendered: `app-status-badge`, `app-empty-state`, `app-confirm-modal`
- Standalone imports/components/modules detected: `DatePipe`, `FormsModule`, `ConfirmModalComponent`, `EmptyStateComponent`, `StatusBadgeComponent`
- Main lifecycle/action methods detected: `ngOnInit()`, `openModal()`, `closeModal()`, `save()`, `toggle()`, `closeDeleteModal()`

#### 4. Page States and Runtime Conditions
- State indicators/keywords detected: Loading, Error, Empty, Success, Offline.
- `[QA BLOCKER]` A tester must prove: page loaded, loading ended, no console error, API calls returned expected status, empty/error states are not accidentally hiding data, and refresh does not lose successful changes.

#### 5. Flags / Dead or Incomplete Notes
- `[PLACEHOLDER]` detected:
  - `L64: <input id="ann-title" class="form-input" [(ngModel)]="draft.title" placeholder="Announcement title" />`
  - `L68: <textarea id="ann-body" class="form-input form-textarea" [(ngModel)]="draft.body" placeholder="Announcement content"></textarea>`
- `[CONSOLE]` detected:
  - `L122: console.error('[AnnouncementsPage] Error loading announcements:', err?.message ?? err);`
  - `L157: error: (err) => console.error('Failed to save announcement.', err)`
  - `L167: error: (err) => console.error('Failed to toggle announcement.', err)`
  - `L186: error: (err) => console.error('Failed to delete announcement.', err)`

### `/public/booking`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public/booking|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/portals/public/booking/booking.page.ts|
|Component class|BookingPage|
|Layout/shell|PublicLayoutComponent|
|Access control|None|
|Route params from URL|None from URL pattern|
|Role data|None|

#### 2. Data Dependencies
- Injected dependencies detected: BookingWizardService, ActivatedRoute, ApiService, DestroyRef
- Direct `ApiService` / API-wrapper calls detected in the route component:
|Method|Line|Expression|
|---|---|---|
|get|45|`return this.apiService.get<any[]>('services').pipe(`|
- Feature/service calls detected from the route component:
|Service/object|Method|Line|Expression|
|---|---|---|---|
|wizardService|reset|56|`this.wizardService.reset();`|
|wizardService|selectDoctor|59|`this.wizardService.selectDoctor(doctorId);`|
|wizardService|selectService|63|`this.wizardService.selectService(serviceId);`|

#### 3. Full Interaction Audit
- Template source: `inline`
- `[UNCLEAR]` No obvious button/link/routerLink/click/form-submit line detected in the template.
- Child `app-*` components rendered: `app-booking-wizard`
- Standalone imports/components/modules detected: `BookingWizardComponent`
- Main lifecycle/action methods detected: `ngOnInit()`

#### 4. Page States and Runtime Conditions
- State indicators/keywords detected: Error.
- `[QA BLOCKER]` A tester must prove: page loaded, loading ended, no console error, API calls returned expected status, empty/error states are not accidentally hiding data, and refresh does not lose successful changes.

#### 5. Flags / Dead or Incomplete Notes
- No obvious mock/TODO/placeholder/console flag found in this route component. `[TEAM TO VERIFY]`

### `/public/booking-confirmation/:bookingId`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public/booking-confirmation/:bookingId|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/portals/public/booking-confirmation/booking-confirmation.page.ts|
|Component class|BookingConfirmationPage|
|Layout/shell|PublicLayoutComponent|
|Access control|None|
|Route params from URL|bookingId|
|Role data|None|

#### 2. Data Dependencies
- Injected dependencies detected: ActivatedRoute, AuthStateService, BookingWizardService, ApiService
- Direct `ApiService` / API-wrapper calls detected in the route component:
|Method|Line|Expression|
|---|---|---|
|get|156|`? this.apiService.get<any[]>('doctors').pipe(`|
|get|161|`? this.apiService.get<any[]>('services').pipe(`|
|get|185|`return this.apiService.get<any>(\`bookings/${bookingId}/public-summary\`).pipe(`|

#### 3. Full Interaction Audit
- Template source: `inline`
- Clickable/navigation/event elements detected:
|Template line|Element/event|
|---|---|
|61|`<button class="btn-primary" routerLink="/patient/bookings" type="button">`|
|69|`<button class="btn-primary" routerLink="/auth/register" type="button">`|
|73|`<button class="btn-outline" routerLink="/public" type="button">Back to Home</button>`|
|83|`<button class="btn-primary" routerLink="/public" type="button">Back to Home</button>`|
- Child `app-*` components rendered: `app-status-badge`
- Standalone imports/components/modules detected: `AsyncPipe`, `DatePipe`, `PesoPipe`, `TimeSlotPipe`, `StatusBadgeComponent`

#### 4. Page States and Runtime Conditions
- State indicators/keywords detected: Loading, Error, Empty, Offline.
- `[QA BLOCKER]` A tester must prove: page loaded, loading ended, no console error, API calls returned expected status, empty/error states are not accidentally hiding data, and refresh does not lose successful changes.

#### 5. Flags / Dead or Incomplete Notes
- No obvious mock/TODO/placeholder/console flag found in this route component. `[TEAM TO VERIFY]`

### `/public/privacy-policy`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/public/privacy-policy|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/portals/public/privacy-policy/privacy-policy.page.ts|
|Component class|PrivacyPolicyPage|
|Layout/shell|PublicLayoutComponent|
|Access control|None|
|Route params from URL|None from URL pattern|
|Role data|None|

#### 2. Data Dependencies
- Injected dependencies detected: [UNCLEAR] No injected dependencies detected.
- No direct API-wrapper call detected in this route component. Check feature-service calls and child components. `[UNCLEAR]`

#### 3. Full Interaction Audit
- Template source: `inline`
- Clickable/navigation/event elements detected:
|Template line|Element/event|
|---|---|
|5|`<a routerLink="/public" class="back-link">&larr; Back to Home</a>`|
|25|`<a href="mailto:support@yourclinicdomain.com">support&#64;yourclinicdomain.com</a>.`|
|31|`<a routerLink="/public" class="back-link">&larr; Return to Home</a>`|

#### 4. Page States and Runtime Conditions
- State indicators/keywords detected: Empty, Success.
- `[QA BLOCKER]` A tester must prove: page loaded, loading ended, no console error, API calls returned expected status, empty/error states are not accidentally hiding data, and refresh does not lose successful changes.

#### 5. Flags / Dead or Incomplete Notes
- `[PLACEHOLDER]` detected:
  - `L40: <a href="mailto:support@yourclinicdomain.com">support&#64;yourclinicdomain.com</a>.`

## Auth/Public Routes

### `/auth/login`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/auth/login|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/auth/login/login.page.ts|
|Component class|LoginPage|
|Layout/shell|Auth layout/page-owned|
|Access control|authGuard|
|Route params from URL|None from URL pattern|
|Role data|None|

#### 2. Data Dependencies
- Injected dependencies detected: FormBuilder, AuthStateService, ApiService, AuthService, ToastController
- No direct API-wrapper call detected in this route component. Check feature-service calls and child components. `[UNCLEAR]`
- Feature/service calls detected from the route component:
|Service/object|Method|Line|Expression|
|---|---|---|---|
|authState|clearError|88|`this.authState.clearError();`|
|authState|setLoading|89|`this.authState.setLoading(true);`|
|authService|storeTokens|96|`tap((res) => this.authService.storeTokens(res.accessToken, res.refreshToken)),`|
|authService|toAuthUser|97|`map((res) => this.authService.toAuthUser(res.user, res.accessToken)),`|
|authState|setUser|99|`this.authState.setUser(user);`|
|authService|navigateByRole|100|`this.authService.navigateByRole(user);`|
|authState|setError|104|`this.authState.setError(message);`|
|authState|setLoading|107|`finalize(() => this.authState.setLoading(false))`|
|authState|clearError|113|`this.authState.clearError();`|
|authState|setLoading|114|`this.authState.setLoading(true);`|
|authService|getGoogleTokenViaPopup|116|`const tokens = await this.authService.getGoogleTokenViaPopup();`|
|authService|storeTokens|124|`tap((res) => this.authService.storeTokens(res.accessToken, res.refreshToken)),`|

#### 3. Full Interaction Audit
- Template file: `src/app/auth/login/login.page.html`
- Clickable/navigation/event elements detected:
|Template line|Element/event|
|---|---|
|13|`<form [formGroup]="loginForm" (ngSubmit)="onLogin()" novalidate>`|
|34|`<ion-button`|
|39|`(click)="showPassword = !showPassword"`|
|53|`<a routerLink="/auth/forgot-password" class="link-forgot">Forgot password?</a>`|
|56|`<button class="btn-primary login-submit" type="submit" [disabled]="(isLoading$ \| async) === true">`|
|73|`<button`|
|76|`(click)="onGoogleLogin()"`|
|82|`<button`|
|85|`(click)="onFacebookLogin()"`|
|95|`<a routerLink="/auth/register">Create one</a>`|
|99|`<a routerLink="/public/privacy-policy">Privacy Policy</a>`|
|105|`<button type="button" class="dev-credentials__toggle" (click)="devExpanded = !devExpanded">`|
|109|`<button type="button" class="dev-chip" (click)="fillCreds('patient@gavino.clinic', 'Patient@123456')">`|
|112|`<button type="button" class="dev-chip" (click)="fillCreds('admin@gavino.clinic', 'Admin@123456')">`|
|115|`<button type="button" class="dev-chip" (click)="fillCreds('staff@gavino.clinic', 'Staff@123456')">`|
|118|`<button type="button" class="dev-chip" (click)="fillCreds('dr.santos@gavino.clinic', 'Doctor@123456')">`|
|121|`<button type="button" class="dev-chip" (click)="fillCreds('dr.reyes@gavino.clinic', 'Doctor@123456')">`|
- Programmatic navigation detected:
|TS line|Expression|
|---|---|
|100|`this.authService.navigateByRole(user);`|
|128|`this.authService.navigateByRole(user);`|
|160|`this.authService.navigateByRole(user);`|
- Form controls / form logic detected:
  - Template controls: email, password
|TS line|Form/validator expression|
|---|---|
|11|`import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';`|
|56|`private readonly fb = inject(FormBuilder);`|
|70|`email: ['', [Validators.required, Validators.email]],`|
|71|`password: ['', Validators.required]`|
- Child `app-*` components rendered: `app-auth-layout`, `app-banner`
- Standalone imports/components/modules detected: `AsyncPipe`, `ReactiveFormsModule`, `AuthLayoutComponent`, `BannerComponent`
- Main lifecycle/action methods detected: `constructor()`, `onLogin()`, `onGoogleLogin()`, `onFacebookLogin()`

#### 4. Page States and Runtime Conditions
- State indicators/keywords detected: Loading, Error, Disabled, Offline.
- `[QA BLOCKER]` A tester must prove: page loaded, loading ended, no console error, API calls returned expected status, empty/error states are not accidentally hiding data, and refresh does not lose successful changes.

#### 5. Flags / Dead or Incomplete Notes
- No obvious mock/TODO/placeholder/console flag found in this route component. `[TEAM TO VERIFY]`

### `/auth/register`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/auth/register|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/auth/register/register.page.ts|
|Component class|RegisterPage|
|Layout/shell|Auth layout/page-owned|
|Access control|authGuard|
|Route params from URL|None from URL pattern|
|Role data|None|

#### 2. Data Dependencies
- Injected dependencies detected: FormBuilder, AuthStateService, ApiService, AuthService
- No direct API-wrapper call detected in this route component. Check feature-service calls and child components. `[UNCLEAR]`
- Feature/service calls detected from the route component:
|Service/object|Method|Line|Expression|
|---|---|---|---|
|authState|clearError|80|`this.authState.clearError();`|
|authState|setLoading|81|`this.authState.setLoading(true);`|
|authService|storeTokens|91|`tap((res) => this.authService.storeTokens(res.accessToken, res.refreshToken)),`|
|authService|toAuthUser|92|`map((res) => this.authService.toAuthUser(res.user, res.accessToken)),`|
|authState|setUser|94|`this.authState.setUser(user);`|
|authService|navigateByRole|95|`this.authService.navigateByRole(user);`|
|authState|setError|99|`this.authState.setError(message);`|
|authState|setLoading|102|`finalize(() => this.authState.setLoading(false))`|
|authState|clearError|108|`this.authState.clearError();`|
|authState|setLoading|109|`this.authState.setLoading(true);`|
|authService|getGoogleTokenViaPopup|111|`const tokens = await this.authService.getGoogleTokenViaPopup();`|
|authService|storeTokens|119|`tap((res) => this.authService.storeTokens(res.accessToken, res.refreshToken)),`|

#### 3. Full Interaction Audit
- Template file: `src/app/auth/register/register.page.html`
- Clickable/navigation/event elements detected:
|Template line|Element/event|
|---|---|
|13|`<form [formGroup]="registerForm" (ngSubmit)="onSubmit()" novalidate>`|
|91|`<a href="#" (click)="$event.preventDefault()">Privacy Policy</a>`|
|93|`<a href="#" (click)="$event.preventDefault()">Terms of Service</a>`|
|103|`<button class="btn-primary login-submit" type="submit" [disabled]="(isLoading$ \| async) === true">`|
|120|`<button`|
|123|`(click)="onGoogleLogin()"`|
|129|`<button`|
|132|`(click)="onFacebookLogin()"`|
|142|`<a routerLink="/auth/login">Sign in</a>`|
|146|`<a routerLink="/public/privacy-policy">Privacy Policy</a>`|
- Programmatic navigation detected:
|TS line|Expression|
|---|---|
|95|`this.authService.navigateByRole(user);`|
|123|`this.authService.navigateByRole(user);`|
|155|`this.authService.navigateByRole(user);`|
- Form controls / form logic detected:
  - Template controls: firstName, middleName, lastName, email, password, confirmPassword, consentAccepted
|TS line|Form/validator expression|
|---|---|
|4|`import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';`|
|42|`private readonly fb = inject(FormBuilder);`|
|57|`firstName: ['', [Validators.required, Validators.maxLength(100)]],`|
|58|`middleName: ['', [Validators.maxLength(100)]],`|
|59|`lastName: ['', [Validators.required, Validators.maxLength(100)]],`|
|60|`email: ['', [Validators.required, Validators.email]],`|
|61|`password: ['', [Validators.required, passwordStrengthValidator]],`|
|62|`confirmPassword: ['', Validators.required],`|
|63|`consentAccepted: [false, Validators.requiredTrue]`|
- Child `app-*` components rendered: `app-auth-layout`, `app-banner`
- Standalone imports/components/modules detected: `AsyncPipe`, `ReactiveFormsModule`, `AuthLayoutComponent`, `BannerComponent`
- Main lifecycle/action methods detected: `ngOnInit()`, `onSubmit()`, `onGoogleLogin()`, `onFacebookLogin()`

#### 4. Page States and Runtime Conditions
- State indicators/keywords detected: Loading, Error, Disabled, Offline.
- `[QA BLOCKER]` A tester must prove: page loaded, loading ended, no console error, API calls returned expected status, empty/error states are not accidentally hiding data, and refresh does not lose successful changes.

#### 5. Flags / Dead or Incomplete Notes
- No obvious mock/TODO/placeholder/console flag found in this route component. `[TEAM TO VERIFY]`

### `/auth/callback`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/auth/callback|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/auth/callback/auth-callback.page.ts|
|Component class|AuthCallbackPage|
|Layout/shell|Auth layout/page-owned|
|Access control|authGuard|
|Route params from URL|None from URL pattern|
|Role data|None|

#### 2. Data Dependencies
- Injected dependencies detected: ApiService, AuthService, AuthStateService, TokenService, Router
- Direct `ApiService` / API-wrapper calls detected in the route component:
|Method|Line|Expression|
|---|---|---|
|get|86|`const user = await firstValueFrom(this.apiService.get<AuthUserDto>('auth/me'));`|
- Feature/service calls detected from the route component:
|Service/object|Method|Line|Expression|
|---|---|---|---|
|tokenService|setTokens|49|`this.tokenService.setTokens(tokenFromHash, refreshToken);`|
|authState|setUser|54|`this.authState.setUser(user);`|
|authService|navigateByRole|55|`this.authService.navigateByRole(user);`|
|authState|setUser|62|`this.authState.setUser(user2);`|
|authService|navigateByRole|63|`this.authService.navigateByRole(user2);`|
|tokenService|hasAccessToken|79|`const hasTokens = this.tokenService.hasAccessToken() \|\| this.tokenService.hasRefreshToken();`|
|tokenService|hasRefreshToken|79|`const hasTokens = this.tokenService.hasAccessToken() \|\| this.tokenService.hasRefreshToken();`|
|authService|clearSession|81|`this.authService.clearSession();`|
|authService|toAuthUser|87|`return this.authService.toAuthUser(user, this.tokenService.getAccessToken() ?? undefined);`|
|tokenService|getAccessToken|87|`return this.authService.toAuthUser(user, this.tokenService.getAccessToken() ?? undefined);`|
|authService|clearSession|89|`this.authService.clearSession();`|

#### 3. Full Interaction Audit
- Template source: `inline`
- `[UNCLEAR]` No obvious button/link/routerLink/click/form-submit line detected in the template.
- Programmatic navigation detected:
|TS line|Expression|
|---|---|
|43|`void this.router.navigate(['/auth/login']);`|
|55|`this.authService.navigateByRole(user);`|
|63|`this.authService.navigateByRole(user2);`|
|69|`void this.router.navigate(['/auth/login']);`|
|74|`void this.router.navigate(['/auth/login']);`|
- Main lifecycle/action methods detected: `ngOnInit()`

#### 4. Page States and Runtime Conditions
- State indicators/keywords detected: Loading, Error, Empty, Offline.
- `[QA BLOCKER]` A tester must prove: page loaded, loading ended, no console error, API calls returned expected status, empty/error states are not accidentally hiding data, and refresh does not lose successful changes.

#### 5. Flags / Dead or Incomplete Notes
- `[CONSOLE]` detected:
  - `L71: console.error('[AuthCallback] Error:', err);`

### `/auth/forgot-password`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/auth/forgot-password|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/auth/forgot-password/forgot-password.page.ts|
|Component class|ForgotPasswordPage|
|Layout/shell|Auth layout/page-owned|
|Access control|authGuard|
|Route params from URL|None from URL pattern|
|Role data|Patient|

#### 2. Data Dependencies
- Injected dependencies detected: FormBuilder, ApiService
- Direct `ApiService` / API-wrapper calls detected in the route component:
|Method|Line|Expression|
|---|---|---|
|post|54|`this.api.post<any>('auth/forgot-password', { email: this.submittedEmail }).pipe(`|

#### 3. Full Interaction Audit
- Template file: `src/app/auth/forgot-password/forgot-password.page.html`
- Clickable/navigation/event elements detected:
|Template line|Element/event|
|---|---|
|5|`<form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>`|
|13|`<button class="btn-primary wide" type="submit" [disabled]="submitting">Send reset link</button>`|
|15|`<p class="hint"><a routerLink="/auth/login">Back to login</a></p>`|
|24|`<a routerLink="/auth/login" class="btn-primary wide link-btn">Back to login</a>`|
- Form controls / form logic detected:
  - Template controls: email
|TS line|Form/validator expression|
|---|---|
|3|`import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';`|
|29|`private readonly fb = inject(FormBuilder);`|
|38|`email: ['', [Validators.required, Validators.email]]`|
- Child `app-*` components rendered: `app-auth-layout`
- Standalone imports/components/modules detected: `ReactiveFormsModule`, `AuthLayoutComponent`
- Main lifecycle/action methods detected: `constructor()`, `onSubmit()`

#### 4. Page States and Runtime Conditions
- State indicators/keywords detected: Error, Success, Disabled.
- `[QA BLOCKER]` A tester must prove: page loaded, loading ended, no console error, API calls returned expected status, empty/error states are not accidentally hiding data, and refresh does not lose successful changes.

#### 5. Flags / Dead or Incomplete Notes
- No obvious mock/TODO/placeholder/console flag found in this route component. `[TEAM TO VERIFY]`

### `/auth/reset-password`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/auth/reset-password|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/auth/reset-password/reset-password.page.ts|
|Component class|ResetPasswordPage|
|Layout/shell|Auth layout/page-owned|
|Access control|authGuard|
|Route params from URL|None from URL pattern|
|Role data|Patient|

#### 2. Data Dependencies
- Injected dependencies detected: FormBuilder, ActivatedRoute, Router, ToastController, ApiService
- Direct `ApiService` / API-wrapper calls detected in the route component:
|Method|Line|Expression|
|---|---|---|
|post|57|`this.api.post<any>('auth/reset-password', { email: this.email, token: this.token, newPassword }).pipe(`|

#### 3. Full Interaction Audit
- Template file: `src/app/auth/reset-password/reset-password.page.html`
- Clickable/navigation/event elements detected:
|Template line|Element/event|
|---|---|
|5|`<form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>`|
|23|`<button class="btn-primary wide" type="submit" [disabled]="saving">Save password</button>`|
|25|`<p class="hint"><a routerLink="/auth/login">Back to login</a></p>`|
- Programmatic navigation detected:
|TS line|Expression|
|---|---|
|86|`void this.router.navigate(['/auth/login']);`|
- Form controls / form logic detected:
  - Template controls: newPassword, confirmPassword
|TS line|Form/validator expression|
|---|---|
|3|`import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';`|
|25|`private readonly fb = inject(FormBuilder);`|
|37|`newPassword: ['', [Validators.required, passwordStrengthValidator]],`|
|38|`confirmPassword: ['', Validators.required]`|
- Child `app-*` components rendered: `app-auth-layout`
- Standalone imports/components/modules detected: `ReactiveFormsModule`, `AuthLayoutComponent`
- Main lifecycle/action methods detected: `ngOnInit()`, `onSubmit()`

#### 4. Page States and Runtime Conditions
- State indicators/keywords detected: Error, Success, Disabled, Offline.
- `[QA BLOCKER]` A tester must prove: page loaded, loading ended, no console error, API calls returned expected status, empty/error states are not accidentally hiding data, and refresh does not lose successful changes.

#### 5. Flags / Dead or Incomplete Notes
- No obvious mock/TODO/placeholder/console flag found in this route component. `[TEAM TO VERIFY]`

### `/auth/set-password`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/auth/set-password|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/auth/set-password/set-password.page.ts|
|Component class|SetPasswordPage|
|Layout/shell|Auth layout/page-owned|
|Access control|authGuard|
|Route params from URL|None from URL pattern|
|Role data|Patient|

#### 2. Data Dependencies
- Injected dependencies detected: FormBuilder, AuthStateService, ApiService, AuthService, TokenService, ClinicSettingsService, ToastController
- No direct API-wrapper call detected in this route component. Check feature-service calls and child components. `[UNCLEAR]`
- Feature/service calls detected from the route component:
|Service/object|Method|Line|Expression|
|---|---|---|---|
|authService|toAuthUser|62|`map((user) => this.authService.toAuthUser(user, this.tokenService.getAccessToken() ?? undefined)),`|
|tokenService|getAccessToken|62|`map((user) => this.authService.toAuthUser(user, this.tokenService.getAccessToken() ?? undefined)),`|
|authState|setUser|73|`this.authState.setUser(user);`|
|authService|navigateByRole|80|`this.authService.navigateByRole(user);`|

#### 3. Full Interaction Audit
- Template file: `src/app/auth/set-password/set-password.page.html`
- Clickable/navigation/event elements detected:
|Template line|Element/event|
|---|---|
|6|`<form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>`|
|24|`<button class="btn-primary wide" type="submit" [disabled]="saving">Save and continue</button>`|
- Programmatic navigation detected:
|TS line|Expression|
|---|---|
|80|`this.authService.navigateByRole(user);`|
- Form controls / form logic detected:
  - Template controls: newPassword, confirmPassword
|TS line|Form/validator expression|
|---|---|
|3|`import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';`|
|28|`private readonly fb = inject(FormBuilder);`|
|42|`newPassword: ['', [Validators.required, passwordStrengthValidator]],`|
|43|`confirmPassword: ['', Validators.required]`|
- Child `app-*` components rendered: `app-auth-layout`
- Standalone imports/components/modules detected: `ReactiveFormsModule`, `AuthLayoutComponent`
- Main lifecycle/action methods detected: `onSubmit()`

#### 4. Page States and Runtime Conditions
- State indicators/keywords detected: Error, Success, Disabled, Offline.
- `[QA BLOCKER]` A tester must prove: page loaded, loading ended, no console error, API calls returned expected status, empty/error states are not accidentally hiding data, and refresh does not lose successful changes.

#### 5. Flags / Dead or Incomplete Notes
- No obvious mock/TODO/placeholder/console flag found in this route component. `[TEAM TO VERIFY]`

### `/auth/privacy-consent`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/auth/privacy-consent|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/auth/privacy-consent/privacy-consent.page.ts|
|Component class|PrivacyConsentPage|
|Layout/shell|Auth layout/page-owned|
|Access control|authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Patient|

#### 2. Data Dependencies
- Injected dependencies detected: AuthStateService, Router, ClinicSettingsService
- No direct API-wrapper call detected in this route component. Check feature-service calls and child components. `[UNCLEAR]`
- Feature/service calls detected from the route component:
|Service/object|Method|Line|Expression|
|---|---|---|---|
|authState|setUser|64|`this.authState.setUser(updated);`|

#### 3. Full Interaction Audit
- Template file: `src/app/auth/privacy-consent/privacy-consent.page.html`
- Clickable/navigation/event elements detected:
|Template line|Element/event|
|---|---|
|18|`<button`|
|22|`(click)="onAccept()"`|
- Programmatic navigation detected:
|TS line|Expression|
|---|---|
|56|`void this.router.navigate(['/auth/login']);`|
|65|`void this.router.navigate(['/patient']);`|
- Child `app-*` components rendered: `app-auth-layout`
- Standalone imports/components/modules detected: `AuthLayoutComponent`
- Main lifecycle/action methods detected: `onScroll()`, `onAccept()`

#### 4. Page States and Runtime Conditions
- State indicators/keywords detected: Empty, Success, Disabled.
- `[QA BLOCKER]` A tester must prove: page loaded, loading ended, no console error, API calls returned expected status, empty/error states are not accidentally hiding data, and refresh does not lose successful changes.

#### 5. Flags / Dead or Incomplete Notes
- No obvious mock/TODO/placeholder/console flag found in this route component. `[TEAM TO VERIFY]`

## Admin Routes

### `/admin/dashboard`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/dashboard|
|Route title|Dashboard|
|Page/component file|src/app/portals/admin/dashboard/dashboard.ts|
|Component class|DashboardPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/admin/bookings`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/bookings|
|Route title|Bookings|
|Page/component file|src/app/portals/admin/bookings/bookings.ts|
|Component class|BookingsPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/admin/bookings/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/bookings/:id|
|Route title|Booking Detail|
|Page/component file|src/app/portals/admin/booking-detail/booking-detail.ts|
|Component class|BookingDetailPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|id|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/admin/walk-in`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/walk-in|
|Route title|Walk-In|
|Page/component file|src/app/portals/admin/walk-in/walk-in.ts|
|Component class|WalkInPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/admin/calendar`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/calendar|
|Route title|Calendar|
|Page/component file|src/app/portals/admin/calendar/calendar.ts|
|Component class|CalendarPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/admin/doctors`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/doctors|
|Route title|Doctors|
|Page/component file|src/app/portals/admin/doctors/doctors.ts|
|Component class|DoctorsPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/admin/doctors/new`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/doctors/new|
|Route title|Add Doctor|
|Page/component file|src/app/portals/admin/doctor-form/doctor-form.ts|
|Component class|DoctorFormPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/admin/doctors/:id/edit`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/doctors/:id/edit|
|Route title|Edit Doctor|
|Page/component file|src/app/portals/admin/doctor-form/doctor-form.ts|
|Component class|DoctorFormPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|id|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/admin/services`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/services|
|Route title|Services|
|Page/component file|src/app/portals/admin/services/services.ts|
|Component class|ServicesPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/admin/patients`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/patients|
|Route title|Patients|
|Page/component file|src/app/portals/admin/patients/patients.ts|
|Component class|PatientsPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/admin/patients/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/patients/:id|
|Route title|Patient Detail|
|Page/component file|src/app/portals/admin/patient-detail/patient-detail.ts|
|Component class|PatientDetailPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|id|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/admin/staff`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/staff|
|Route title|Staff Accounts|
|Page/component file|src/app/portals/admin/staff/staff.ts|
|Component class|StaffPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/admin/announcements`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/announcements|
|Route title|Announcements|
|Page/component file|src/app/portals/admin/announcements/announcements.ts|
|Component class|AnnouncementsPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/admin/settings`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/settings|
|Route title|Settings|
|Page/component file|src/app/portals/admin/settings/settings.ts|
|Component class|SettingsPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/admin/audit-logs`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/audit-logs|
|Route title|Audit Logs|
|Page/component file|src/app/portals/admin/audit-logs/audit-logs.ts|
|Component class|AuditLogsPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/admin/reports`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/admin/reports|
|Route title|Reports|
|Page/component file|src/app/portals/admin/reports/reports.ts|
|Component class|ReportsPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

## Staff Routes

### `/staff/dashboard`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/dashboard|
|Route title|Dashboard|
|Page/component file|src/app/portals/staff/dashboard/staff-dashboard.ts|
|Component class|StaffDashboardPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/staff/bookings`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/bookings|
|Route title|Bookings|
|Page/component file|src/app/portals/staff/bookings/staff-bookings.ts|
|Component class|StaffBookingsPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/staff/payments`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/payments|
|Route title|Payments|
|Page/component file|src/app/portals/staff/payments/staff-payments.ts|
|Component class|StaffPaymentsPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/staff/bookings/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/bookings/:id|
|Route title|Booking Detail|
|Page/component file|src/app/portals/staff/booking-detail/staff-booking-detail.ts|
|Component class|StaffBookingDetailPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|id|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/staff/walk-in`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/walk-in|
|Route title|Walk-In|
|Page/component file|src/app/portals/staff/walk-in/staff-walk-in.ts|
|Component class|StaffWalkInPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/staff/patients`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/patients|
|Route title|Patients|
|Page/component file|src/app/portals/staff/patients/staff-patients.ts|
|Component class|StaffPatientsPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/staff/patients/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/patients/:id|
|Route title|Patient Detail|
|Page/component file|src/app/portals/staff/patient-detail/staff-patient-detail.ts|
|Component class|StaffPatientDetailPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|id|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/staff/doctor-status`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/doctor-status|
|Route title|Doctor Availability|
|Page/component file|src/app/portals/staff/doctor-status/doctor-status.ts|
|Component class|DoctorStatusPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/staff/profile`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/staff/profile|
|Route title|My Profile|
|Page/component file|src/app/portals/staff/profile/staff-profile.ts|
|Component class|StaffProfilePage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

## Doctor Routes

### `/doctor/dashboard`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/dashboard|
|Route title|Dashboard|
|Page/component file|src/app/portals/doctor/dashboard/doctor-dashboard.ts|
|Component class|DoctorDashboardPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/doctor/appointments`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/appointments|
|Route title|Appointments|
|Page/component file|src/app/portals/doctor/appointments/doctor-appointments.ts|
|Component class|DoctorAppointmentsPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/doctor/appointments/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/appointments/:id|
|Route title|Appointment Detail|
|Page/component file|src/app/portals/doctor/appointment-detail/doctor-appointment-detail.ts|
|Component class|DoctorAppointmentDetailPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|id|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/doctor/patients`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/patients|
|Route title|Patients|
|Page/component file|src/app/portals/doctor/patients/doctor-patients.ts|
|Component class|DoctorPatientsPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/doctor/patients/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/patients/:id|
|Route title|Patient Detail|
|Page/component file|src/app/portals/doctor/patient-detail/doctor-patient-detail.ts|
|Component class|DoctorPatientDetailPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|id|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/doctor/schedule`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/schedule|
|Route title|Schedule|
|Page/component file|src/app/portals/doctor/schedule/doctor-schedule.ts|
|Component class|DoctorSchedulePage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/doctor/consultation/:bookingId`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/consultation/:bookingId|
|Route title|Consultation Form|
|Page/component file|src/app/portals/doctor/consultation/doctor-consultation.ts|
|Component class|DoctorConsultationPage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|bookingId|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/doctor/my-profile`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/my-profile|
|Route title|My Profile|
|Page/component file|src/app/portals/doctor/profile/doctor-profile.ts|
|Component class|DoctorProfilePage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/doctor/profile`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/doctor/profile|
|Route title|My Profile|
|Page/component file|src/app/portals/doctor/profile/doctor-profile.ts|
|Component class|DoctorProfilePage|
|Layout/shell|PortalLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

## Patient Routes

### `/patient/dashboard`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/dashboard|
|Route title|Dashboard|
|Page/component file|src/app/portals/patient/dashboard/patient-dashboard.ts|
|Component class|PatientDashboardPage|
|Layout/shell|PatientLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/patient/doctors`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/doctors|
|Route title|Doctors|
|Page/component file|src/app/portals/patient/doctors/patient-doctors.ts|
|Component class|PatientDoctorsPage|
|Layout/shell|PatientLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/patient/bookings`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/bookings|
|Route title|Bookings|
|Page/component file|src/app/portals/patient/bookings/patient-bookings.ts|
|Component class|PatientBookingsPage|
|Layout/shell|PatientLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/patient/documents`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/documents|
|Route title|My Documents|
|Page/component file|src/app/portals/patient/documents/patient-documents.ts|
|Component class|PatientDocumentsPage|
|Layout/shell|PatientLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/patient/lab-results`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/lab-results|
|Route title|My Lab Results|
|Page/component file|src/app/portals/patient/lab-results/patient-lab-results.ts|
|Component class|PatientLabResultsPage|
|Layout/shell|PatientLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/patient/labs`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/labs|
|Route title|Booking Detail|
|Page/component file|src/app/portals/patient/labs-redirect/patient-labs-redirect.ts|
|Component class|PatientLabsRedirectPage|
|Layout/shell|PatientLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/patient/bookings/:id`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/bookings/:id|
|Route title|Booking Detail|
|Page/component file|src/app/portals/patient/booking-detail/patient-booking-detail.ts|
|Component class|PatientBookingDetailPage|
|Layout/shell|PatientLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|id|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/patient/medical-records`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/medical-records|
|Route title|Medical Records|
|Page/component file|src/app/portals/patient/medical-records/patient-medical-records.ts|
|Component class|PatientMedicalRecordsPage|
|Layout/shell|PatientLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/patient/prescriptions`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/prescriptions|
|Route title|Prescriptions|
|Page/component file|src/app/portals/patient/prescriptions/patient-prescriptions.ts|
|Component class|PatientPrescriptionsPage|
|Layout/shell|PatientLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/patient/vaccinations`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/vaccinations|
|Route title|My Vaccinations|
|Page/component file|src/app/portals/patient/vaccinations/patient-vaccinations.ts|
|Component class|PatientVaccinationsPage|
|Layout/shell|PatientLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/patient/profile`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/profile|
|Route title|Profile|
|Page/component file|src/app/portals/patient/profile/patient-profile.ts|
|Component class|PatientProfilePage|
|Layout/shell|PatientLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/patient/reviews/:bookingId`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/reviews/:bookingId|
|Route title|Leave Review|
|Page/component file|src/app/portals/patient/reviews/patient-reviews.ts|
|Component class|PatientReviewsPage|
|Layout/shell|PatientLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|bookingId|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

### `/patient/privacy-consent`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/patient/privacy-consent|
|Route title|Privacy Consent|
|Page/component file|src/app/portals/patient/privacy-consent/patient-privacy-consent.ts|
|Component class|PatientPrivacyConsentPage|
|Layout/shell|PatientLayoutComponent|
|Access control|authGuard + roleGuard + firstLoginGuard at app route; child route also authGuard + roleGuard|
|Route params from URL|None from URL pattern|
|Role data|Inherited from parent route|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

## Dev/Public Routes

### `/dev/gallery`

#### 1. Route Metadata
|Field|Value|
|---|---|
|Route URL|/dev/gallery|
|Route title|[UNCLEAR / not explicitly set]|
|Page/component file|src/app/dev/design-system-gallery/design-system-gallery.ts|
|Component class|DesignSystemGalleryPage|
|Layout/shell|None|
|Access control|None|
|Route params from URL|None from URL pattern|
|Role data|None|

- `[UNCLEAR]` Component source file was not resolved by the static scanner.

## Appendix A — API Call Registry Detected Across Source
This registry is static and line-based. It helps QA know which endpoints/methods to watch in DevTools Network. Dynamic string concatenation must still be verified at runtime.

|File|Line|Expression|
|---|---|---|
|src/app/app.component.ts|25|`this.apiService.get<any>('settings').pipe(`|
|src/app/app.config.ts|29|`const user = await firstValueFrom(apiService.get<AuthUserDto>('auth/me'));`|
|src/app/shared/components/notification-panel/notification-panel.component.ts|106|`this.apiService.put('notifications/read-all', {}).subscribe({`|
|src/app/shared/components/notification-panel/notification-panel.component.ts|119|`this.apiService.put(\`notifications/${notification.id}/read\`, {}).subscribe({`|
|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts|499|`const upload$ = this.apiService.postFormData<PatientDocument>(endpoint, formData);`|
|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts|520|`const upload$ = this.apiService.postFormData<PatientLabResult>(endpoint, formData);`|
|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts|536|`? this.apiService.getBlob(\`patients/${pid}/documents/${item.id}/file\`)`|
|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts|537|`: this.apiService.getBlob(\`patients/${pid}/lab-results/${item.id}/file\`);`|
|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts|613|`const request$ = this.apiService.get<PatientDocument[]>(bookingFilter ? \`${endpoint}?bookingId=${bookingFilter}\` : endpoint);`|
|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts|642|`const request$ = this.apiService.get<PatientLabResult[]>(bookingFilter ? \`${endpoint}?bookingId=${bookingFilter}\` : endpoint);`|
|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts|682|`? this.apiService.get<any>('bookings').pipe(`|
|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts|691|`: this.apiService.get<any>('bookings?page=1&pageSize=100').pipe(`|
|src/app/shared/components/patient-media-panel/patient-media-preview.modal.ts|405|`this.apiService.getBlob(endpoint).subscribe({`|
|src/app/shared/components/portal-layout/portal-layout.component.ts|201|`? this.apiService.post('auth/logout', { refreshToken }).pipe(catchError(() => of(void 0)))`|
|src/app/shared/components/secure-image/secure-image.component.ts|144|`? this.apiService.getBlob(`|
|src/app/shared/components/secure-image/secure-image.component.ts|150|`? this.apiService.getBlob(this.src)`|
|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts|518|`this.apiService.patch('bookings/' + this.booking.id + '/check-in', {}).subscribe({`|
|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts|537|`this.apiService.patch('bookings/' + this.booking.id + '/undo-check-in', {}).subscribe({`|
|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts|595|`this.apiService.patch<any>('payments/' + bookingId + '/confirm', {`|
|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts|602|`this.apiService.get<any>('bookings/' + bookingId).pipe(`|
|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts|665|`this.apiService.patch('payments/' + this.booking.id + '/waive', { reason: waiveReason }).subscribe({`|
|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts|686|`this.apiService.get<any>('payments/' + paymentId).pipe(`|
|src/app/portals/staff/booking-detail/staff-booking-detail.page.ts|694|`return (bookingId ? this.apiService.get<any>('bookings/' + bookingId) : of(undefined)).pipe(`|
|src/app/portals/staff/bookings/staff-bookings.page.ts|264|`this.apiService.get<any[]>('doctors').subscribe({`|
|src/app/portals/staff/bookings/staff-bookings.page.ts|333|`this.apiService.patch('bookings/' + booking.id + '/check-in', {}).subscribe({`|
|src/app/portals/staff/bookings/staff-bookings.page.ts|349|`this.apiService.patch('bookings/' + booking.id + '/undo-check-in', {}).subscribe({`|
|src/app/portals/staff/bookings/staff-bookings.page.ts|401|`this.apiService.get<any>('bookings/staff/all?page=' + this.currentPage + '&pageSize=' + this.pageSize).subscribe({`|
|src/app/portals/staff/dashboard/staff-dashboard.page.ts|201|`this.apiService.patch('bookings/' + event.bookingId + '/check-in', {}).subscribe();`|
|src/app/portals/staff/dashboard/staff-dashboard.page.ts|204|`this.apiService.patch('bookings/' + event.bookingId + '/undo-check-in', {}).subscribe();`|
|src/app/portals/staff/doctor-status/doctor-status.page.ts|176|`this.apiService.post<DoctorDayStatus>('doctor-day-status/' + event.doctorId + '/status', {`|
|src/app/portals/staff/patient-detail/staff-patient-detail.page.ts|192|`await firstValueFrom(this.apiService.post('patients/' + this.patient.id + '/portal-account', {`|
|src/app/portals/staff/payments/staff-payments.page.ts|371|`this.apiService.patch<any>('payments/' + bookingId + '/confirm', {`|
|src/app/portals/staff/payments/staff-payments.page.ts|421|`this.apiService.patch('payments/' + this.waiveTarget.bookingId + '/waive', { reason: waiveReason }).subscribe({`|
|src/app/portals/staff/payments/staff-payments.page.ts|477|`this.apiService.get<any>('bookings/staff/for-payment?page=' + this.currentPage + '&pageSize=' + safePageSize).pipe(`|
|src/app/portals/staff/walk-in/staff-walk-in.page.ts|891|`const patient = await firstValueFrom(this.apiService.post<any>('patients', dto));`|
|src/app/portals/staff/walk-in/staff-walk-in.page.ts|938|`const booking = await firstValueFrom(this.apiService.post<any>('bookings/walk-in', {`|
|src/app/portals/staff/walk-in/staff-walk-in.page.ts|999|`this.apiService.get<any>(endpoint).pipe(`|
|src/app/portals/staff/walk-in/staff-walk-in.page.ts|1089|`return this.apiService.get<any[]>('services').pipe(`|
|src/app/portals/public/announcements/announcements.page.ts|44|`this.apiService.get<Announcement[]>('announcements').subscribe((list) => {`|
|src/app/portals/public/booking/booking.page.ts|45|`return this.apiService.get<any[]>('services').pipe(`|
|src/app/portals/public/booking-confirmation/booking-confirmation.page.ts|156|`? this.apiService.get<any[]>('doctors').pipe(`|
|src/app/portals/public/booking-confirmation/booking-confirmation.page.ts|161|`? this.apiService.get<any[]>('services').pipe(`|
|src/app/portals/public/booking-confirmation/booking-confirmation.page.ts|185|`return this.apiService.get<any>(\`bookings/${bookingId}/public-summary\`).pipe(`|
|src/app/portals/public/doctor-profile/doctor-profile.page.ts|172|`this.apiService.get<DoctorDayStatus \| null>('doctor-day-status/' + id).pipe(`|
|src/app/portals/public/doctor-profile/doctor-profile.page.ts|179|`doctor: this.apiService.get<DoctorDetail>('doctors/' + id),`|
|src/app/portals/public/doctor-profile/doctor-profile.page.ts|180|`reviews: this.apiService.get<Review[]>('reviews?doctorId=' + id),`|
|src/app/portals/public/doctor-profile/doctor-profile.page.ts|181|`schedules: this.apiService.get<any[]>('doctors/' + id + '/schedule')`|
|src/app/portals/public/home/home.page.ts|81|`readonly doctors$ = this.apiService.get<any[]>('doctors');`|
|src/app/portals/public/home/home.page.ts|82|`readonly services$ = this.apiService.get<any[]>('services');`|
|src/app/portals/public/home/home.page.ts|83|`readonly announcements$ = this.apiService.get<any[]>('announcements');`|
|src/app/portals/public/home/home.page.ts|84|`readonly settings$ = this.apiService.get<any>('settings');`|
|src/app/portals/public/components/booking-summary-bar/booking-summary-bar.component.ts|54|`this.apiService.get<any[]>('doctors').pipe(catchError(() => of([]))),`|
|src/app/portals/public/components/booking-summary-bar/booking-summary-bar.component.ts|56|`? this.apiService.get<any[]>('doctors/' + wizard.selectedDoctorId + '/services').pipe(catchError(() => of([])))`|
|src/app/portals/public/components/public-footer/public-footer.component.ts|93|`doctors$ = this.apiService.get<any[]>('doctors');`|
|src/app/portals/public/components/step-doctor-service/step-doctor-service.component.ts|297|`return this.apiService.get<any[]>('doctors/' + doctorId + '/services').pipe(`|
|src/app/portals/public/components/step-payment/step-payment.component.ts|94|`this.apiService.get<any[]>('doctors').pipe(catchError(() => of([]))),`|
|src/app/portals/public/components/step-payment/step-payment.component.ts|96|`? this.apiService.get<any[]>('doctors/' + wizard.selectedDoctorId + '/services').pipe(catchError(() => of([])))`|
|src/app/portals/public/components/step-payment/step-payment.component.ts|182|`const booking = await firstValueFrom(this.apiService.post<any>('bookings', body));`|
|src/app/portals/public/components/step-proof/step-proof.component.ts|225|`const booking = await firstValueFrom(this.apiService.post<any>('bookings', body));`|
|src/app/portals/public/components/step-proof/step-proof.component.ts|280|`const patient = await firstValueFrom(this.apiService.get<any>('patients/me'));`|
|src/app/portals/public/components/step-review/step-review.component.ts|77|`this.apiService.get<any[]>('doctors').pipe(catchError(() => of([]))),`|
|src/app/portals/public/components/step-review/step-review.component.ts|79|`? this.apiService.get<any[]>('doctors/' + wizard.selectedDoctorId + '/services').pipe(catchError(() => of([])))`|
|src/app/portals/public/components/step-slot-select/step-slot-select.component.ts|242|`return this.apiService.get<any[]>('doctors/' + doctorId + '/available-slots?date=' + date).pipe(`|
|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts|275|`this.apiService.get<any>('patients/me').pipe(catchError(() => of(undefined))),`|
|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts|276|`this.apiService.get<any>('bookings/' + bookingId).pipe(map((row) => normalizeBookingRow(row)))`|
|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts|304|`void firstValueFrom(this.apiService.patch('bookings/' + this.booking.id + '/cancel', { reason: 'Cancelled by patient.' }));`|
|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts|334|`this.apiService.get<any>('payments/' + this.booking.payment.id).pipe(`|
|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts|342|`return (bookingId ? this.apiService.get<any>('bookings/' + bookingId) : of(undefined)).pipe(`|
|src/app/portals/patient/bookings/patient-bookings.page.ts|299|`void firstValueFrom(this.apiService.patch('bookings/' + this.bookingToCancel.id + '/cancel', { reason: 'Cancelled by patient.' }));`|
|src/app/portals/patient/dashboard/patient-dashboard.page.ts|228|`user ? this.apiService.get<any>('patients/me').pipe(catchError(() => of(undefined))) : of(undefined)`|
|src/app/portals/patient/dashboard/patient-dashboard.page.ts|235|`? this.apiService.get<any>('bookings?page=1&pageSize=100').pipe(`|
|src/app/portals/patient/dashboard/patient-dashboard.page.ts|305|`this.apiService.get<any[]>('medical-records/consultations?patientId=' + patient.id).pipe(`|
|src/app/portals/patient/dashboard/patient-dashboard.page.ts|309|`this.apiService.get<any[]>('medical-records/prescriptions?patientId=' + patient.id).pipe(`|
|src/app/portals/patient/medical-records/patient-medical-records.page.ts|155|`this.apiService.get<any[]>('medical-records/me').subscribe({`|
|src/app/portals/patient/medical-records/patient-medical-records.page.ts|182|`this.apiService.getBlob(\`patient-documents/me/medical-records/${record.id}/pdf\`).subscribe({`|
|src/app/portals/patient/medical-records/patient-medical-records.page.ts|200|`this.apiService.getBlob(\`patient-documents/me/bookings/${record.bookingId}/pdf\`).subscribe({`|
|src/app/portals/patient/medical-records/patient-medical-records.page.ts|213|`this.apiService.getBlob('patient-documents/me/all.pdf').subscribe({`|
|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts|144|`this.apiService.get<any[]>('prescriptions/me').subscribe({`|
|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts|171|`this.apiService.getBlob(\`patient-documents/me/prescriptions/${prescription.id}/pdf\`).subscribe({`|
|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts|189|`this.apiService.getBlob(\`patient-documents/me/bookings/${prescription.bookingId}/pdf\`).subscribe({`|
|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts|202|`this.apiService.getBlob('patient-documents/me/all.pdf').subscribe({`|
|src/app/portals/patient/reviews/patient-reviews.page.ts|71|`this.api.get<any>('patients/me').pipe(catchError(() => of(undefined))),`|
|src/app/portals/patient/reviews/patient-reviews.page.ts|72|`this.api.get<any>('bookings/' + bookingId).pipe(`|
|src/app/portals/patient/reviews/patient-reviews.page.ts|92|`const data = await firstValueFrom(this.api.get('reviews?bookingId=' + bookingId));`|
|src/app/portals/patient/reviews/patient-reviews.page.ts|115|`await firstValueFrom(this.api.post('reviews', {`|
|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|149|`? this.apiService.post('auth/logout', { refreshToken }).pipe(catchError(() => of(void 0)))`|
|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|166|`this.apiService.getBlob('patient-documents/me/all.pdf').subscribe({`|
|src/app/portals/doctor/appointment-detail/doctor-appointment-detail.page.ts|203|`return this.apiService.get<any>('bookings/' + bookingId).pipe(`|
|src/app/portals/doctor/appointments/doctor-appointments.page.ts|368|`this.apiService.get<any[]>('bookings/doctor/today').pipe(`|
|src/app/portals/doctor/appointments/doctor-appointments.page.ts|374|`return this.apiService.get<any>('bookings/doctor/today-summary').pipe(`|
|src/app/portals/doctor/appointments/doctor-appointments.page.ts|480|`this.apiService.patch('bookings/' + bookingId + '/doctor-complete', payload).pipe(`|
|src/app/portals/doctor/appointments/doctor-appointments.page.ts|483|`? this.apiService.patch('payments/' + bookingId + '/waive', {`|
|src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts|88|`this.apiService.get<any>('bookings/' + bookingId).pipe(`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|727|`this.apiService.get<any>('doctors/me').pipe(`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|754|`this.apiService.get<AuditLog[]>('audit-logs').pipe(`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|958|`this.apiService.post<{ ok: boolean }>('/consultation-requests/request-attending-physician', {`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|1883|`await this.apiService.post('audit-logs',`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2748|`return this.apiService.get<any>('bookings/' + booking.id + '/consultation-record').pipe(`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2775|`consultations: this.apiService.get<any[]>('medical-records/consultations?patientId=' + patientId).pipe(`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2779|`prescriptions: this.apiService.get<any[]>('medical-records/prescriptions?patientId=' + patientId).pipe(`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2783|`allergies: this.apiService.get<any[]>('medical-records/allergies?patientId=' + patientId).pipe(`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2787|`labRequests: this.apiService.get<any[]>('medical-records/lab-orders?patientId=' + patientId).pipe(`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2791|`labResults: this.apiService.get<any[]>('medical-records/lab-results?patientId=' + patientId).pipe(`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2795|`vaccinations: this.apiService.get<any[]>('medical-records/vaccinations?patientId=' + patientId).pipe(`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2799|`followUps: this.apiService.get<any[]>('medical-records/follow-ups?patientId=' + patientId).pipe(`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2820|`patientRow: this.apiService.get<any>('patients/' + patientId).pipe(catchError(() => of(null))),`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2821|`bookingRows: this.apiService.get<any[]>('bookings?patientId=' + patientId + '&pageSize=50').pipe(catchError(() => of([] as Record<string, unknown>[]))),`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2858|`this.apiService.get<any>('bookings/' + bookingId + '/consultation-record').pipe(`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2902|`return this.apiService.get<any>('bookings/' + bookingId).pipe(`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2909|`return this.apiService.post<any>('bookings/' + bookingId + '/consultation-record', dto).pipe(`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2910|`switchMap(() => this.apiService.get<any>('bookings/' + bookingId + '/consultation-record')),`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2931|`? this.apiService.patch('bookings/' + bookingId + '/doctor-complete', dto).pipe(`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2933|`this.apiService.patch('payments/' + bookingId + '/waive', {`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2938|`: this.apiService.patch('bookings/' + bookingId + '/doctor-complete', dto);`|
|src/app/portals/doctor/consultation/doctor-consultation.page.ts|2941|`switchMap(() => this.apiService.get<any>('bookings/' + bookingId)),`|
|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts|253|`this.apiService.get<any>('doctors/me').pipe(`|
|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts|264|`summary: this.apiService.get<any[]>('bookings/doctor/today').pipe(`|
|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts|269|`return this.apiService.get<any>('bookings/doctor/today-summary').pipe(`|
|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts|286|`schedule: this.apiService.get<any[]>('doctors/' + doc.id + '/schedule').pipe(`|
|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts|290|`dayStatus: this.apiService.get<any[]>('doctors/' + doc.id + '/day-status').pipe(`|
|src/app/portals/doctor/dashboard/doctor-dashboard.page.ts|317|`this.apiService.post<any>('doctors/' + this.doctor.id + '/day-status', {`|
|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts|320|`const patientRow: any = await firstValueFrom(this.apiService.get('patients/' + patientId));`|
|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts|333|`firstValueFrom(this.apiService.get<any[]>('bookings?patientId=' + patientId + '&pageSize=50')),`|
|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts|336|`consultations: this.apiService.get<any[]>('medical-records/consultations?patientId=' + patientId).pipe(`|
|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts|339|`prescriptions: this.apiService.get<any[]>('medical-records/prescriptions?patientId=' + patientId).pipe(`|
|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts|342|`labResults: this.apiService.get<any[]>('medical-records/lab-results?patientId=' + patientId).pipe(`|
|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts|345|`vaccinations: this.apiService.get<any[]>('medical-records/vaccinations?patientId=' + patientId).pipe(`|
|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts|348|`followUps: this.apiService.get<any[]>('medical-records/follow-ups?patientId=' + patientId).pipe(`|
|src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts|494|`this.apiService.get<any>('bookings/' + bookingId + '/consultation-record').pipe(`|
|src/app/portals/doctor/patients/doctor-patients.page.ts|121|`this.apiService.get<any[]>('bookings/doctor/patients').pipe(`|
|src/app/portals/doctor/schedule/doctor-schedule.page.ts|98|`this.apiService.get<any>('doctors/me').pipe(`|
|src/app/portals/doctor/schedule/doctor-schedule.page.ts|125|`this.apiService.get<any[]>('doctors/' + doctor.id + '/schedule').pipe(`|
|src/app/portals/doctor/schedule/doctor-schedule.page.ts|128|`this.apiService.get<any[]>('doctors/' + doctor.id + '/blocked-dates').pipe(`|
|src/app/portals/doctor/schedule/doctor-schedule.page.ts|166|`this.apiService.put<any[]>('doctors/' + this.doctorId + '/schedule', {`|
|src/app/portals/doctor/schedule/doctor-schedule.page.ts|174|`this.apiService.put<any>('doctors/' + this.doctorId, {`|
|src/app/portals/doctor/schedule/doctor-schedule.page.ts|200|`this.apiService.post<any>('doctors/' + this.doctorId + '/blocked-dates', {`|
|src/app/portals/doctor/schedule/doctor-schedule.page.ts|223|`this.apiService.delete('doctors/' + this.doctorId + '/blocked-dates/' + id).pipe(`|
|src/app/portals/doctor/components/prescription-builder/prescription-drug-list.ts|3|`* Replace with \`api.get('medication_master').select('*')\` when the table exists. */`|
|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts|437|`this.apiService.post<UnknownAllergyCheckResponse>('/drug-interactions/allergy-check', {`|
|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts|480|`this.apiService.post<UnknownInteractionCheckResponse>('/drug-interactions/check', {`|
|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts|647|`this.apiService.post<UnknownInteractionCheckResponse>('/drug-interactions/check', {`|
|src/app/portals/admin/announcements/announcements.page.ts|114|`this.api.get<any[]>('announcements').pipe(takeUntil(this.ngUnsubscribe)).subscribe({`|
|src/app/portals/admin/announcements/announcements.page.ts|149|`? this.api.put('announcements/' + this.editingId, { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive })`|
|src/app/portals/admin/announcements/announcements.page.ts|150|`: this.api.post('announcements', { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive });`|
|src/app/portals/admin/announcements/announcements.page.ts|165|`this.api.put('announcements/' + id, { isActive: newActive }).pipe(takeUntil(this.ngUnsubscribe)).subscribe({`|
|src/app/portals/admin/announcements/announcements.page.ts|181|`this.api.delete('announcements/' + this.deletingId).pipe(takeUntil(this.ngUnsubscribe)).subscribe({`|
|src/app/portals/admin/audit-logs/audit-logs.page.ts|106|`this.apiService.get<AuditLog[]>('audit-logs').subscribe((logs) => {`|
|src/app/portals/admin/booking-detail/booking-detail.page.ts|266|`const data: unknown = await firstValueFrom(this.apiService.get('bookings/' + id));`|
|src/app/portals/admin/booking-detail/booking-detail.page.ts|300|`const data: any = await firstValueFrom(this.apiService.get('patients/' + patientId));`|
|src/app/portals/admin/booking-detail/booking-detail.page.ts|397|`await firstValueFrom(this.apiService.patch('bookings/' + bookingId + '/confirm', {}));`|
|src/app/portals/admin/booking-detail/booking-detail.page.ts|401|`await firstValueFrom(this.apiService.patch('bookings/' + bookingId + '/cancel', { reason: reason \|\| 'Rejected by admin' }));`|
|src/app/portals/admin/booking-detail/booking-detail.page.ts|405|`await firstValueFrom(this.apiService.patch('bookings/' + bookingId + '/confirm', {}));`|
|src/app/portals/admin/booking-detail/booking-detail.page.ts|409|`await firstValueFrom(this.apiService.patch('bookings/' + bookingId + '/complete', {}));`|
|src/app/portals/admin/booking-detail/booking-detail.page.ts|413|`await firstValueFrom(this.apiService.patch('bookings/' + bookingId + '/no-show', {}));`|
|src/app/portals/admin/booking-detail/booking-detail.page.ts|417|`await firstValueFrom(this.apiService.patch('bookings/' + bookingId + '/cancel', { reason: reason \|\| 'Cancelled by admin' }));`|
|src/app/portals/admin/booking-detail/booking-detail.page.ts|439|`await firstValueFrom(this.apiService.post('audit-logs', { entityType: 'Booking', entityId, action, performedBy, details }));`|
|src/app/portals/admin/booking-detail/booking-detail.page.ts|454|`await firstValueFrom(this.apiService.put('bookings/' + bookingId + '/waive', { reason }));`|
|src/app/portals/admin/booking-detail/booking-detail.page.ts|475|`await firstValueFrom(this.apiService.put('bookings/' + bookingId + '/refund', { reason }));`|
|src/app/portals/admin/dashboard/dashboard.page.ts|143|`this.api.get<any[]>('bookings?status=CheckedIn&pageSize=1'),`|
|src/app/portals/admin/dashboard/dashboard.page.ts|144|`this.api.get<any[]>('bookings?fromDate=' + encodeURIComponent(monthStart) + '&toDate=' + encodeURIComponent(today) + '&pageSize=1000'),`|
|src/app/portals/admin/dashboard/dashboard.page.ts|145|`this.api.get<any[]>('doctors'),`|
|src/app/portals/admin/dashboard/dashboard.page.ts|146|`this.api.get<any[]>('patients?pageSize=1000'),`|
|src/app/portals/admin/dashboard/dashboard.page.ts|147|`this.api.get<any[]>('services'),`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|240|`doctors: this.apiService.get<any[]>('doctors/admin').pipe(`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|247|`schedules: this.apiService.get<any[]>('doctors/' + this.doctorId + '/schedule').pipe(`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|322|`this.apiService.put(\`doctors/${this.doctorId}\`, updatePayload).pipe(`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|325|`this.apiService.put<any[]>('doctors/' + savedDoctor.id + '/schedule', {`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|364|`this.apiService.post<any>('doctors', createPayload)`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|416|`this.apiService.postFormData<{ profilePhotoUrl: string }>(\`doctors/${this.doctorId}/photo\`, formData)`|
|src/app/portals/admin/doctors/doctors.page.ts|289|`this.apiService.get<any[]>('doctors/' + doctor.id + '/schedule').pipe(`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|407|`this.apiService.put<any>('patients/' + this.patient.id, dto).pipe(`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|525|`this.apiService.post<any>('patients', {`|
|src/app/portals/admin/patient-detail/patient-detail.page.ts|192|`this.apiService.get<any>('patients/' + id).pipe(`|
|src/app/portals/admin/patient-detail/patient-detail.page.ts|213|`this.apiService.get<any[]>('medical-records/consultations?patientId=' + id).pipe(`|
|src/app/portals/admin/patient-detail/patient-detail.page.ts|217|`this.apiService.get<any[]>('medical-records/prescriptions?patientId=' + id).pipe(`|
|src/app/portals/admin/patient-detail/patient-detail.page.ts|221|`this.apiService.get<any[]>('medical-records/allergies?patientId=' + id).pipe(`|
|src/app/portals/admin/patient-detail/patient-detail.page.ts|225|`this.apiService.get<any[]>('medical-records/lab-results?patientId=' + id).pipe(`|
|src/app/portals/admin/patient-detail/patient-detail.page.ts|229|`this.apiService.get<any[]>('medical-records/vaccinations?patientId=' + id).pipe(`|
|src/app/portals/admin/patient-detail/patient-detail.page.ts|233|`this.apiService.get<any[]>('medical-records/follow-ups?patientId=' + id).pipe(`|
|src/app/portals/admin/patients/admin-patient-create-modal.component.ts|372|`await firstValueFrom(this.apiService.post<any>('patients', dto));`|
|src/app/portals/admin/patients/admin-patient-create-modal.component.ts|443|`const userId = await firstValueFrom(this.apiService.post<any>('patients', accountPayload));`|
|src/app/portals/admin/patients/patients.page.ts|231|`this.apiService.get<any>(endpoint).pipe(`|
|src/app/portals/admin/reports/reports.page.ts|171|`this.apiService.get<UnpaidCompletedVisitReportRow[]>('reports/unpaid-completed-visits').subscribe((rows) => {`|
|src/app/portals/admin/reports/reports.page.ts|176|`this.apiService.get<PendingFollowUpReportRow[]>('reports/pending-follow-ups').subscribe((rows) => {`|
|src/app/portals/admin/reports/reports.page.ts|181|`this.apiService.get<DailyBookingSummaryRow[]>('reports/daily-booking-summary').subscribe((rows) => {`|
|src/app/portals/admin/services/doctor-state.service.ts|167|`return this.api.get<any[]>('doctors/admin').pipe(`|
|src/app/portals/admin/services/doctor-state.service.ts|174|`return this.api.get<any[]>('doctors/' + doctorId + '/day-status').pipe(`|
|src/app/portals/admin/services/doctor-state.service.ts|191|`return this.api.post('doctors/' + doctorId + '/day-status', {`|
|src/app/portals/admin/services/services.page.ts|275|`? this.apiService.put<any>('services/' + this.editingId, payload).pipe(`|
|src/app/portals/admin/services/services.page.ts|278|`: this.apiService.post<any>('services', payload).pipe(`|
|src/app/portals/admin/services/services.page.ts|308|`services: this.apiService.get<any[]>('services').pipe(`|
|src/app/portals/admin/services/services.page.ts|315|`doctors: this.apiService.get<any[]>('doctors/admin').pipe(`|
|src/app/portals/admin/settings/settings.page.ts|324|`this.apiService.put<any>('settings', this.cloneSettings(this.draft)).pipe(`|
|src/app/portals/admin/staff/staff.page.ts|129|`const data: any[] = (await firstValueFrom(this.api.get<any[]>('admin/staff'))) ?? [];`|
|src/app/portals/admin/staff/staff.page.ts|199|`const data = await firstValueFrom(this.api.post('admin/staff/invite', payload));`|
|src/app/portals/admin/staff/staff.page.ts|237|`await firstValueFrom(this.api.put('admin/staff/invite/' + inviteId + '/revoke', {}));`|
|src/app/portals/admin/staff/staff.page.ts|271|`const data: any = await firstValueFrom(this.api.put('admin/staff/' + id + '/update-status', { action }));`|
|src/app/portals/admin/walk-in/walk-in.page.ts|827|`const patient = await firstValueFrom(this.apiService.post<any>('patients', dto));`|
|src/app/portals/admin/walk-in/walk-in.page.ts|878|`const booking = await firstValueFrom(this.apiService.post<any>('bookings/walk-in', {`|
|src/app/portals/admin/walk-in/walk-in.page.ts|899|`this.apiService.get<any[]>('doctors').pipe(`|
|src/app/portals/admin/walk-in/walk-in.page.ts|931|`this.apiService.get<any>(endpoint).pipe(`|
|src/app/portals/admin/walk-in/walk-in.page.ts|1002|`this.apiService.get<any[]>('doctors/' + doctorId + '/services').pipe(`|
|src/app/portals/admin/walk-in/walk-in.page.ts|1005|`return this.apiService.get<any[]>('services').pipe(`|
|src/app/portals/admin/walk-in/walk-in.page.ts|1041|`this.apiService.get<any[]>('doctors/' + doctorId + '/available-slots?date=' + date).pipe(`|
|src/app/portals/admin/components/medical-records-tab/medical-records-tab.component.ts|211|`this.api.post<any>('medical-records/allergies', {`|
|src/app/portals/admin/components/medical-records-tab/medical-records-tab.component.ts|235|`this.api.post<any>('medical-records/lab-results', {`|
|src/app/portals/admin/components/medical-records-tab/medical-records-tab.component.ts|259|`this.api.post<any>('medical-records/vaccinations', {`|
|src/app/layouts/admin-layout/admin-layout.component.ts|134|`? this.apiService.post('auth/logout', { refreshToken }).pipe(catchError(() => of(void 0)))`|
|src/app/layouts/doctor-layout/doctor-layout.component.ts|102|`? this.apiService.post('auth/logout', { refreshToken }).pipe(catchError(() => of(void 0)))`|
|src/app/layouts/staff-layout/staff-layout.component.ts|107|`? this.apiService.post('auth/logout', { refreshToken }).pipe(catchError(() => of(void 0)))`|
|src/app/core/interceptors/auth.interceptor.ts|59|`return apiService.post<RefreshTokenDto>('auth/refresh-token', { refreshToken }).pipe(`|
|src/app/core/services/api.service.ts|35|`return this.http.get<T>(this.url(endpoint), { params: this.toParams(params) }).pipe(`|
|src/app/core/services/api.service.ts|41|`return this.http.post<T>(this.url(endpoint), payload).pipe(`|
|src/app/core/services/api.service.ts|47|`return this.http.put<T>(this.url(endpoint), payload).pipe(`|
|src/app/core/services/api.service.ts|53|`return this.http.patch<T>(this.url(endpoint), payload).pipe(`|
|src/app/core/services/api.service.ts|59|`return this.http.delete<T>(this.url(endpoint)).pipe(`|
|src/app/core/services/api.service.ts|67|`return this.http.get(this.url(endpoint), {`|
|src/app/core/services/api.service.ts|76|`return this.http.post(this.url(endpoint), payload, {`|
|src/app/core/services/api.service.ts|84|`return this.http.get(this.url(endpoint), {`|
|src/app/core/services/api.service.ts|94|`return this.http.post(this.url(endpoint), payload, {`|
|src/app/core/services/api.service.ts|105|`return this.http.post<T>(this.url(endpoint), formData).pipe(`|
|src/app/core/services/api.service.ts|111|`return this.http.put<T>(this.url(endpoint), formData).pipe(`|
|src/app/core/services/booking.service.ts|363|`return this.apiService.get<any>('bookings/staff/today?page=' + page + '&pageSize=' + pageSize).pipe(`|
|src/app/core/services/booking.service.ts|385|`return this.apiService.get<any>('bookings/staff/all?page=' + page + '&pageSize=' + pageSize).pipe(`|
|src/app/core/services/booking.service.ts|407|`return this.apiService.get<any>('bookings/staff/for-payment?page=' + currentPage + '&pageSize=' + safePageSize).pipe(`|
|src/app/core/services/booking.service.ts|465|`return this.apiService.get<any>('bookings').pipe(`|
|src/app/core/services/booking.service.ts|526|`return this.apiService.post<any>('bookings', {}).pipe(`|
|src/app/core/services/booking.service.ts|571|`return this.apiService.get<any>('bookings/' + id).pipe(`|
|src/app/core/services/patient-state.service.ts|113|`this.api.get<any>('patients').subscribe({`|
|src/app/core/services/patient-state.service.ts|132|`return this.api.get<any>('patients/' + id).pipe(`|
|src/app/core/services/patient-state.service.ts|138|`return this.api.get<any[]>('patients?userId=' + userId).pipe(`|
|src/app/core/services/patient-state.service.ts|148|`return this.api.get<any[]>('patients?search=' + encodeURIComponent(query)).pipe(`|
|src/app/core/services/patient-state.service.ts|168|`this.api.put(\`patients/${patient.id}\`, patient).subscribe({`|
|src/app/core/services/patient-state.service.ts|174|`this.api.post(\`patients/${patientId}/portal-account\`, { consentVersion }).subscribe({`|
|src/app/auth/callback/auth-callback.page.ts|86|`const user = await firstValueFrom(this.apiService.get<AuthUserDto>('auth/me'));`|
|src/app/auth/forgot-password/forgot-password.page.ts|54|`this.api.post<any>('auth/forgot-password', { email: this.submittedEmail }).pipe(`|
|src/app/auth/reset-password/reset-password.page.ts|57|`this.api.post<any>('auth/reset-password', {`|

## Appendix B — Mock Data and Placeholder Risk
- Mock-data files still exist even though `useMockData` is `false` in both environment files. QA should verify runtime paths do not still use mock files.
|Mock file|
|---|
|src/app/core/mock-data/mock-announcements.data.ts|
|src/app/core/mock-data/mock-bookings.data.ts|
|src/app/core/mock-data/mock-clinic-settings.data.ts|
|src/app/core/mock-data/mock-doctors.data.ts|
|src/app/core/mock-data/mock-medical-records.data.ts|
|src/app/core/mock-data/mock-notifications.data.ts|
|src/app/core/mock-data/mock-patients.data.ts|
|src/app/core/mock-data/mock-reports.data.ts|
|src/app/core/mock-data/mock-reviews.data.ts|
|src/app/core/mock-data/mock-services.data.ts|
|src/app/core/mock-data/mock-users.data.ts|

### Placeholder / Dev-only / TODO hits
|File|Line|Hit|
|---|---|---|
|src/app/shared/components/booking-print-document/booking-print-document.component.ts|54|`<div class="booking-print-document__logo" *ngIf="data.logoUrl; else logoPlaceholder">`|
|src/app/shared/components/booking-print-document/booking-print-document.component.ts|57|`<ng-template #logoPlaceholder>`|
|src/app/shared/components/booking-print-document/booking-print-document.component.ts|58|`<div class="booking-print-document__logo booking-print-document__logo--placeholder">LOGO</div>`|
|src/app/shared/components/confirm-modal/confirm-modal.component.ts|25|`[placeholder]="reasonLabel"`|
|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts|81|`<input class="filter-input" [formControl]="form.controls.title" [placeholder]="titlePlaceholder" />`|
|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts|120|`placeholder="Search by file name, title, notes, or linked IDs"`|
|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts|296|`get titlePlaceholder(): string {`|
|src/app/portals/staff/patients/staff-patients.page.ts|28|`<input class="fi" [formControl]="searchControl" placeholder="Search by name, code, contact, or email" aria-label="Search patients" />`|
|src/app/portals/staff/walk-in/staff-walk-in.page.ts|149|`placeholder="Search by patient name, code, phone, or email"`|
|src/app/portals/staff/walk-in/staff-walk-in.page.ts|211|`<ion-input formControlName="firstName" autocomplete="given-name" placeholder="First name"></ion-input>`|
|src/app/portals/staff/walk-in/staff-walk-in.page.ts|220|`<ion-input formControlName="middleName" autocomplete="additional-name" placeholder="Middle name"></ion-input>`|
|src/app/portals/staff/walk-in/staff-walk-in.page.ts|228|`<ion-input formControlName="lastName" autocomplete="family-name" placeholder="Last name"></ion-input>`|
|src/app/portals/staff/walk-in/staff-walk-in.page.ts|246|`<ion-select formControlName="sex" interface="popover" placeholder="Select sex">`|
|src/app/portals/staff/walk-in/staff-walk-in.page.ts|258|`<ion-input formControlName="contactNumber" autocomplete="tel" placeholder="Contact number"></ion-input>`|
|src/app/portals/staff/walk-in/staff-walk-in.page.ts|266|`<ion-input type="email" formControlName="email" autocomplete="email" placeholder="Email"></ion-input>`|
|src/app/portals/staff/walk-in/staff-walk-in.page.ts|276|`<ion-input formControlName="address" autocomplete="street-address" placeholder="Address"></ion-input>`|
|src/app/portals/staff/walk-in/staff-walk-in.page.ts|345|`<ion-select formControlName="doctorId" interface="popover" placeholder="Select doctor">`|
|src/app/portals/staff/walk-in/staff-walk-in.page.ts|362|`placeholder="Select service"`|
|src/app/portals/public/announcements/announcements.page.ts|21|`<app-skeleton *ngFor="let _ of skeletonPlaceholders" variant="card" />`|
|src/app/portals/public/announcements/announcements.page.ts|41|`readonly skeletonPlaceholders = [0, 1, 2];`|
|src/app/portals/public/privacy-policy/privacy-policy.page.ts|40|`<a href="mailto:support@yourclinicdomain.com">support&#64;yourclinicdomain.com</a>.`|
|src/app/portals/public/components/announcement-card/announcement-card.component.ts|14|`<span *ngIf="!announcement.imageUrl" class="announcement-card__img-placeholder" aria-hidden="true"`|
|src/app/portals/public/components/step-payment/step-payment.component.ts|65|`placeholder="Add any visit notes or special instructions."`|
|src/app/portals/public/components/step-proof/step-proof.component.ts|64|`placeholder="e.g. GC1234567890"`|
|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts|121|`<button type="button" class="btn-ghost" style="width: 100%; text-align: left; padding-left: 0;" (click)="navigateToDocuments()">`|
|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts|318|`navigateToDocuments(): void {`|
|src/app/portals/patient/medical-records/patient-medical-records.page.ts|32|`placeholder="Search by doctor, diagnosis, soap notes, or follow-up"`|
|src/app/portals/patient/prescriptions/patient-prescriptions.page.ts|32|`placeholder="Search by doctor, medicine, route, or instructions"`|
|src/app/portals/patient/vaccinations/patient-vaccinations.page.ts|23|`placeholder="Search by vaccine name, manufacturer, or notes"`|
|src/app/portals/patient/components/proof-submission-form/proof-submission-form.component.ts|37|`Choose a proof type and provide a reference number or placeholder screenshot filename.`|
|src/app/portals/patient/components/proof-submission-form/proof-submission-form.component.ts|42|`<ion-select formControlName="proofType" placeholder="Select proof type">`|
|src/app/portals/patient/components/proof-submission-form/proof-submission-form.component.ts|53|`<ion-input formControlName="referenceNumber" placeholder="e.g. GCash reference"></ion-input>`|
|src/app/portals/patient/components/proof-submission-form/proof-submission-form.component.ts|66|`placeholder="screenshot-proof.png"`|
|src/app/portals/patient/components/review-form/review-form.component.ts|30|`placeholder="Share your experience (optional)"`|
|src/app/portals/doctor/appointments/doctor-appointments.page.ts|94|`<input type="search" [(ngModel)]="searchQuery" placeholder="Search queue" />`|
|src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts|23|`selector: 'app-doctor-consultation-stub-page',`|
|src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts|29|`subtitle="Phase 9 placeholder"`|
|src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts|64|`description="This consultation stub is only available for your own appointments."`|
|src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts|70|`styleUrl: './doctor-consultation-stub.page.scss'`|
|src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts|72|`export class DoctorConsultationStubPage implements OnInit {`|
|src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts|111|`// Stub only. The detail view is read-only until Phase 9.`|
|src/app/portals/doctor/patients/doctor-patients.page.ts|27|`<input class="si" [(ngModel)]="searchQuery" placeholder="Search by patient name..." />`|
|src/app/portals/doctor/profile/doctor-profile.page.ts|88|`placeholder="Describe your practice, experience, and approach to care. This appears on your public booking page."`|
|src/app/portals/doctor/consultation/components/professional-fee-decision-form.component.ts|55|`placeholder="Fee adjustment reason, if any"`|
|src/app/portals/doctor/components/diagnosis-picker/diagnosis-picker.component.ts|84|`placeholder="Search by code or description"`|
|src/app/portals/doctor/components/doctor-schedule-editor/doctor-schedule-editor.component.ts|67|`placeholder="No limit"`|
|src/app/portals/doctor/components/doctor-schedule-editor/doctor-schedule-editor.component.ts|149|`<ion-input type="date" [(ngModel)]="blockedDateValue" placeholder="Choose date"></ion-input>`|
|src/app/portals/doctor/components/doctor-schedule-editor/doctor-schedule-editor.component.ts|150|`<ion-input type="text" [(ngModel)]="blockedReason" placeholder="Reason"></ion-input>`|
|src/app/portals/doctor/components/prescription-builder/medication-picker-modal.component.ts|36|`placeholder="Search options"`|
|src/app/portals/doctor/components/prescription-builder/prescription-builder.component.ts|71|`placeholder="Start typing"`|
|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts|52|`<textarea id="overrideReason" [(ngModel)]="overrideReason" [ngModelOptions]="{ standalone: true }" rows="2" placeholder="Clinical justification required"></textarea>`|
|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts|68|`placeholder="Start typing drug name..."`|
|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts|85|`<input id="rx-strength" formControlName="strength" placeholder="e.g. 500mg" [readonly]="isReadOnlyFields" />`|
|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts|93|`placeholder="e.g. Tablet"`|
|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts|110|`placeholder="e.g. Oral"`|
|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts|127|`placeholder="e.g. TID"`|
|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts|141|`<input id="rx-duration" formControlName="duration" placeholder="e.g. 7 days" [readonly]="isReadOnlyFields" />`|
|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts|154|`placeholder="e.g. Take after meals"`|
|src/app/portals/doctor/components/soap-form/soap-form.component.ts|59|`<ion-textarea #chiefComplaintInput formControlName="chiefComplaint" autoGrow="true" placeholder="Required"></ion-textarea>`|
|src/app/portals/doctor/components/vaccination-form/vaccination-form.component.ts|78|`<input [(ngModel)]="draft.vaccineName" name="vaccineName" placeholder="e.g. Influenza, Hepatitis B" required [disabled]="locked \|\| !canEdit" />`|
|src/app/portals/doctor/components/vaccination-form/vaccination-form.component.ts|100|`<input [(ngModel)]="draft.manufacturer" name="manufacturer" placeholder="e.g. Sanofi" [disabled]="locked \|\| !canEdit" />`|
|src/app/portals/doctor/components/vaccination-form/vaccination-form.component.ts|104|`<input [(ngModel)]="draft.lotNumber" name="lotNumber" placeholder="e.g. L12345" [disabled]="locked \|\| !canEdit" />`|
|src/app/portals/doctor/components/vaccination-form/vaccination-form.component.ts|108|`<input type="number" min="0" step="0.01" [(ngModel)]="draft.doseAmount" name="doseAmount" placeholder="e.g. 0.5" [disabled]="locked \|\| !canEdit" />`|
|src/app/portals/doctor/components/vaccination-form/vaccination-form.component.ts|145|`<textarea [(ngModel)]="draft.notes" name="notes" rows="2" placeholder="Any additional notes about this vaccination..." [disabled]="locked \|\| !canEdit"></textarea>`|
|src/app/portals/doctor/components/vaccination-form/vaccination-form.component.ts|149|`<textarea [(ngModel)]="draft.reactionNotes" name="reactionNotes" rows="2" placeholder="Any adverse reactions or observations..." [disabled]="locked \|\| !canEdit"></textarea>`|
|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts|82|`<ion-input type="number" formControlName="bloodPressureSystolic" placeholder="e.g. 120" (ionBlur)="markTouched('bloodPressureSystolic')"></ion-input>`|
|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts|94|`<ion-input type="number" formControlName="bloodPressureDiastolic" placeholder="e.g. 80" (ionBlur)="markTouched('bloodPressureDiastolic')"></ion-input>`|
|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts|106|`<ion-input type="number" formControlName="heartRate" placeholder="bpm" (ionBlur)="markTouched('heartRate')"></ion-input>`|
|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts|118|`<ion-input type="number" formControlName="respiratoryRate" placeholder="breaths/min" (ionBlur)="markTouched('respiratoryRate')"></ion-input>`|
|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts|129|`<ion-input type="number" formControlName="painScore" placeholder="0 - 10" (ionBlur)="markTouched('painScore')"></ion-input>`|
|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts|140|`<ion-input type="number" formControlName="temperatureCelsius" placeholder="e.g. 36.8" (ionBlur)="markTouched('temperatureCelsius')"></ion-input>`|
|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts|151|`<ion-input type="number" formControlName="oxygenSaturation" placeholder="0 - 100" (ionBlur)="markTouched('oxygenSaturation')"></ion-input>`|
|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts|162|`<ion-input type="number" formControlName="weightKg" placeholder="kg" (ionBlur)="markTouched('weightKg')"></ion-input>`|
|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts|173|`<ion-input type="number" formControlName="heightCm" placeholder="cm" (ionBlur)="markTouched('heightCm')"></ion-input>`|
|src/app/portals/admin/announcements/announcements.page.ts|64|`<input id="ann-title" class="form-input" [(ngModel)]="draft.title" placeholder="Announcement title" />`|
|src/app/portals/admin/announcements/announcements.page.ts|68|`<textarea id="ann-body" class="form-input form-textarea" [(ngModel)]="draft.body" placeholder="Announcement content"></textarea>`|
|src/app/portals/admin/audit-logs/audit-logs.page.ts|38|`placeholder="Search action, user, or entity ID"`|
|src/app/portals/admin/bookings/bookings.page.ts|65|`<input class="filter-input" type="search" placeholder="Search patient or booking ID" [(ngModel)]="searchQuery" />`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|59|`<input class="filter-input" formControlName="fullName" placeholder="Full Name" />`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|67|`placeholder="e.g. dr.jones@clinic.com"`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|81|`placeholder="e.g. Temp@123456"`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|94|`<input class="filter-input" formControlName="specialization" placeholder="Specialization" />`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|98|`<input class="filter-input" formControlName="licenseNumber" placeholder="License Number" />`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|102|`<input class="filter-input" formControlName="ptrNumber" placeholder="PTR Number" />`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|106|`<input class="filter-input" formControlName="s2Number" placeholder="S2 Number" />`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|110|`<input class="filter-input" type="number" formControlName="consultationFee" placeholder="Consultation Fee" />`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|122|`<input class="filter-input" type="number" formControlName="slotDurationMinutes" placeholder="Slot Duration" />`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|126|`<input class="filter-input" type="number" formControlName="slotCapacity" placeholder="Slot Capacity" />`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|130|`<input class="filter-input" type="number" formControlName="dailyPatientLimit" placeholder="Daily Patient Limit" />`|
|src/app/portals/admin/doctor-form/doctor-form.page.ts|134|`<textarea class="textarea" formControlName="bio" placeholder="Doctor bio"></textarea>`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|88|`<ion-input formControlName="firstName" autocomplete="given-name" placeholder="First name"></ion-input>`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|96|`<ion-input formControlName="middleName" autocomplete="additional-name" placeholder="Middle name"></ion-input>`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|103|`<ion-input formControlName="lastName" autocomplete="family-name" placeholder="Last name"></ion-input>`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|119|`<ion-select formControlName="sex" interface="popover" placeholder="Select sex">`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|130|`<ion-select formControlName="civilStatus" interface="popover" placeholder="Not specified">`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|145|`<ion-input formControlName="contactNumber" autocomplete="tel" placeholder="Contact number"></ion-input>`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|152|`<ion-input type="email" formControlName="email" autocomplete="email" placeholder="Email"></ion-input>`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|160|`<ion-input formControlName="zipCode" autocomplete="postal-code" placeholder="Zip code"></ion-input>`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|167|`<ion-input formControlName="address" autocomplete="street-address" placeholder="Address"></ion-input>`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|174|`<ion-input formControlName="city" autocomplete="address-level2" placeholder="City"></ion-input>`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|217|`placeholder="Create a strong password"`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|226|`<ion-input formControlName="accountAvatarUrl" placeholder="Optional avatar URL"></ion-input>`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|240|`<ion-input formControlName="emergencyContactName" placeholder="Name"></ion-input>`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|247|`<ion-input formControlName="emergencyContactNumber" placeholder="Contact number"></ion-input>`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|254|`<ion-input formControlName="emergencyContactRelationship" placeholder="Relationship"></ion-input>`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|266|`<ion-select formControlName="bloodType" interface="popover" placeholder="Not specified">`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|276|`<ion-input formControlName="philHealthNumber" placeholder="PhilHealth number"></ion-input>`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|283|`<ion-input formControlName="hmoProvider" placeholder="HMO provider"></ion-input>`|
|src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts|290|`<ion-input formControlName="hmoCardNumber" placeholder="HMO card number"></ion-input>`|
|src/app/portals/admin/patients/admin-patient-create-modal.component.ts|86|`<ion-input formControlName="firstName" autocomplete="given-name" placeholder="First name"></ion-input>`|
|src/app/portals/admin/patients/admin-patient-create-modal.component.ts|94|`<ion-input formControlName="middleName" autocomplete="additional-name" placeholder="Middle name"></ion-input>`|
|src/app/portals/admin/patients/admin-patient-create-modal.component.ts|101|`<ion-input formControlName="lastName" autocomplete="family-name" placeholder="Last name"></ion-input>`|
|src/app/portals/admin/patients/admin-patient-create-modal.component.ts|117|`<ion-select formControlName="sex" interface="popover" placeholder="Select sex">`|
|src/app/portals/admin/patients/admin-patient-create-modal.component.ts|128|`<ion-select formControlName="civilStatus" interface="popover" placeholder="Not specified">`|
|src/app/portals/admin/patients/admin-patient-create-modal.component.ts|143|`<ion-input formControlName="contactNumber" autocomplete="tel" placeholder="Contact number"></ion-input>`|
|src/app/portals/admin/patients/admin-patient-create-modal.component.ts|150|`<ion-input type="email" formControlName="email" autocomplete="email" placeholder="Email"></ion-input>`|
|src/app/portals/admin/patients/admin-patient-create-modal.component.ts|160|`<ion-input formControlName="zipCode" autocomplete="postal-code" placeholder="Zip code"></ion-input>`|
|src/app/portals/admin/patients/admin-patient-create-modal.component.ts|167|`<ion-input formControlName="address" autocomplete="street-address" placeholder="Address"></ion-input>`|
|src/app/portals/admin/patients/admin-patient-create-modal.component.ts|174|`<ion-input formControlName="city" autocomplete="address-level2" placeholder="City"></ion-input>`|
|src/app/portals/admin/patients/admin-patient-create-modal.component.ts|209|`placeholder="Create a strong password"`|

## Appendix C — Strict QA Evidence Rules for This Inventory
A QA agent must not mark any route PASS unless it records evidence in this format:

```text
ROUTE: /role/path
LOGIN ROLE USED: Admin/Staff/Doctor/Patient/Public
EXPECTED ACCESS: allowed or blocked
ACTUAL ACCESS: page loaded / redirected / error
NETWORK: list each API call, HTTP status, response shape summary
CONSOLE: clean / warnings / errors with exact message
UI STATE: loading ended, empty/error/success state confirmed
ACTIONS TESTED: buttons/forms/navigation tested with result
PERSISTENCE: after refresh/re-fetch, data still correct
WRONG-ROLE TEST: direct URL tested using another role where applicable
RESULT: PASS / FAIL / BLOCKED
PROOF: screenshot filename or copied DevTools/API evidence
```

### Minimum per-role route coverage
- **Public/Guest:** 8 route(s) inventoried: `/public`, `/public/doctors`, `/public/doctors/:id`, `/public/services`, `/public/announcements`, `/public/booking`, `/public/booking-confirmation/:bookingId`, `/public/privacy-policy`
- **Auth/Public:** 7 route(s) inventoried: `/auth/login`, `/auth/register`, `/auth/callback`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/set-password`, `/auth/privacy-consent`
- **Admin:** 16 route(s) inventoried: `/admin/dashboard`, `/admin/bookings`, `/admin/bookings/:id`, `/admin/walk-in`, `/admin/calendar`, `/admin/doctors`, `/admin/doctors/new`, `/admin/doctors/:id/edit`, `/admin/services`, `/admin/patients`, `/admin/patients/:id`, `/admin/staff`, `/admin/announcements`, `/admin/settings`, `/admin/audit-logs`, `/admin/reports`
- **Staff:** 9 route(s) inventoried: `/staff/dashboard`, `/staff/bookings`, `/staff/payments`, `/staff/bookings/:id`, `/staff/walk-in`, `/staff/patients`, `/staff/patients/:id`, `/staff/doctor-status`, `/staff/profile`
- **Doctor:** 9 route(s) inventoried: `/doctor/dashboard`, `/doctor/appointments`, `/doctor/appointments/:id`, `/doctor/patients`, `/doctor/patients/:id`, `/doctor/schedule`, `/doctor/consultation/:bookingId`, `/doctor/my-profile`, `/doctor/profile`
- **Patient:** 13 route(s) inventoried: `/patient/dashboard`, `/patient/doctors`, `/patient/bookings`, `/patient/documents`, `/patient/lab-results`, `/patient/labs`, `/patient/bookings/:id`, `/patient/medical-records`, `/patient/prescriptions`, `/patient/vaccinations`, `/patient/profile`, `/patient/reviews/:bookingId`, `/patient/privacy-consent`

### QA must fail, not pass, when evidence is missing
- Missing screenshot/API evidence = `BLOCKED`, not PASS.
- Loading spinner never ends = FAIL.
- API returns 200 but UI does not update = FAIL.
- UI updates but refresh loses data = FAIL.
- Console error appears during route load/action = FAIL unless proven unrelated.
- Wrong role can access another role route = FAIL.
- Mock/static placeholder data appears where live data is expected = FAIL.

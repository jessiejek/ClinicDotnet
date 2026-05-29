# UPDATED MASTER_PROJECT_OVERVIEW

Generated from uploaded zip: `vercel (2).zip` on `2026-05-29`. This is a static frontend repository scan of the Ionic Angular project. Backend runtime behavior, database behavior, and server-side authorization remain `[TEAM TO VERIFY]` unless directly proven by frontend code.

## 0. Executive Summary

- Project type: Ionic Angular clinic booking / clinic operations frontend.

- Roles detected from routes: `Admin`, `Staff`, `Doctor`, `Patient`, plus public/auth/dev routes.

- Central backend wrapper: `src/app/core/services/api.service.ts`; it builds URLs from `environment.apiUrl || environment.apiBaseUrl`.

- Current local backend in this zip: `http://localhost:5000/api`; current SignalR hub: `http://localhost:5000/hubs/clinic-dashboard`.

- `useMockData` is `false` in both environment files, but mock data files still exist and must be checked for accidental runtime usage.

- Main QA requirement: AI QA must not mark PASS from static inspection alone. PASS must include browser route evidence, network/API evidence, console evidence, UI state evidence, and persistence/re-fetch evidence for writes.


## 1. Scan Scope and Counts

|Item|Count|
|---|---:|
|Total files|411|
|TypeScript files|240|
|HTML templates|11|
|SCSS files|141|
|Route files|8|
|Component/page TS files|156|
|Service files|31|
|Model files|12|
|Mock-data files|12|
|Detected frontend API call lines|222|

## 2. Tech Stack and Scripts

|Area|Value|
|---|---|
|@angular/core|`^17.3.0`|
|@ionic/angular|`^7.8.6`|
|typescript|`~5.4.2`|
|rxjs|`~7.8.0`|
|@microsoft/signalr|`^10.0.0`|
|firebase|`^10.14.1`|
|zone.js|`~0.14.3`|

### npm scripts
|Script|Command|
|---|---|
|`ng`|`ng`|
|`start`|`ng serve`|
|`build`|`ng build`|
|`watch`|`ng build --watch --configuration development`|
|`test`|`ng test`|
|`prebuild`|`node scripts/update-version.js`|

## 3. Environment Configuration


### Development: `src/environments/environment.ts`
|Variable|Value|
|---|---|
|`production`|`false`|
|`apiUrl`|`'http://localhost:5000/api'`|
|`signalrHubUrl`|`'http://localhost:5000/hubs/clinic-dashboard'`|
|`apiBaseUrl`|`'http://localhost:5000/api'`|
|`googleClientId`|`configured in source; redacted in overview`|
|`facebookAppId`|`configured in source; redacted in overview`|
|`facebookSdkVersion`|`'v25.0'`|
|`useMockData`|`false`|
|`siteUrl`|`''`|
|`firebaseApiKey`|`configured in source; redacted in overview`|
|`firebaseAuthDomain`|`'clinic-sup.firebaseapp.com'`|
|`firebaseProjectId`|`'clinic-sup'`|
|`firebaseStorageBucket`|`'clinic-sup.firebasestorage.app'`|
|`firebaseMessagingSenderId`|`'506032600761'`|
|`firebaseAppId`|`configured in source; redacted in overview`|
|`firebaseMeasurementId`|`''`|
|`firebaseVapidKey`|`configured in source; redacted in overview`|
|`vapidKey`|`configured in source; redacted in overview`|

### Production: `src/environments/environment.prod.ts`
|Variable|Value|
|---|---|
|`production`|`true`|
|`apiUrl`|`'https://api.yourclinicdomain.com/api'`|
|`signalrHubUrl`|`'https://api.yourclinicdomain.com/hubs/clinic-dashboard'`|
|`apiBaseUrl`|`'https://api.yourclinicdomain.com/api'`|
|`googleClientId`|`''`|
|`facebookAppId`|`''`|
|`facebookSdkVersion`|`'v25.0'`|
|`useMockData`|`false`|
|`siteUrl`|`'https://clinic-sup.vercel.app'`|
|`firebaseApiKey`|`configured in source; redacted in overview`|
|`firebaseAuthDomain`|`'clinic-sup.firebaseapp.com'`|
|`firebaseProjectId`|`'clinic-sup'`|
|`firebaseStorageBucket`|`'clinic-sup.firebasestorage.app'`|
|`firebaseMessagingSenderId`|`'506032600761'`|
|`firebaseAppId`|`configured in source; redacted in overview`|
|`firebaseMeasurementId`|`''`|
|`firebaseVapidKey`|`configured in source; redacted in overview`|
|`vapidKey`|`configured in source; redacted in overview`|

**Important delta from older overview:** development `apiUrl`, `apiBaseUrl`, and `signalrHubUrl` now point to `http://localhost:5000`, not `https://localhost:44384`. Any QA prompt or backend startup instruction must use the current values unless the team intentionally changes environments.

## 4. Project Structure Map

|Folder|Purpose / QA meaning|
|---|---|
|`src/app/auth`|Authentication pages, guards-adjacent flows, login/register/password/consent UI.|
|`src/app/auth/callback`|Authentication pages, guards-adjacent flows, login/register/password/consent UI.|
|`src/app/auth/components`|Authentication pages, guards-adjacent flows, login/register/password/consent UI.|
|`src/app/auth/components/auth-layout`|Authentication pages, guards-adjacent flows, login/register/password/consent UI.|
|`src/app/auth/forgot-password`|Authentication pages, guards-adjacent flows, login/register/password/consent UI.|
|`src/app/auth/login`|Authentication pages, guards-adjacent flows, login/register/password/consent UI.|
|`src/app/auth/privacy-consent`|Authentication pages, guards-adjacent flows, login/register/password/consent UI.|
|`src/app/auth/register`|Authentication pages, guards-adjacent flows, login/register/password/consent UI.|
|`src/app/auth/reset-password`|Authentication pages, guards-adjacent flows, login/register/password/consent UI.|
|`src/app/auth/set-password`|Authentication pages, guards-adjacent flows, login/register/password/consent UI.|
|`src/app/core`|[TEAM TO VERIFY] Folder purpose inferred from path.|
|`src/app/core/base`|[TEAM TO VERIFY] Folder purpose inferred from path.|
|`src/app/core/guards`|Route access control guards.|
|`src/app/core/interceptors`|HTTP auth token attachment and refresh handling.|
|`src/app/core/mock-data`|Mock data files; verify not used in production paths.|
|`src/app/core/models`|Shared DTO/model typings.|
|`src/app/core/services`|Singleton API/state/domain services.|
|`src/app/core/utils`|[TEAM TO VERIFY] Folder purpose inferred from path.|
|`src/app/dev`|Development-only design system gallery route.|
|`src/app/dev/design-system-gallery`|Development-only design system gallery route.|
|`src/app/layouts`|Legacy/alternate layout components; verify actual runtime use vs shared portal layout.|
|`src/app/layouts/admin-layout`|Legacy/alternate layout components; verify actual runtime use vs shared portal layout.|
|`src/app/layouts/doctor-layout`|Legacy/alternate layout components; verify actual runtime use vs shared portal layout.|
|`src/app/layouts/public-layout`|Legacy/alternate layout components; verify actual runtime use vs shared portal layout.|
|`src/app/layouts/staff-layout`|Legacy/alternate layout components; verify actual runtime use vs shared portal layout.|
|`src/app/portals`|[TEAM TO VERIFY] Folder purpose inferred from path.|
|`src/app/portals/admin`|Admin portal pages/components.|
|`src/app/portals/admin/announcements`|Admin portal pages/components.|
|`src/app/portals/admin/audit-logs`|Admin portal pages/components.|
|`src/app/portals/admin/booking-detail`|Admin portal pages/components.|
|`src/app/portals/admin/bookings`|Admin portal pages/components.|
|`src/app/portals/admin/calendar`|Admin portal pages/components.|
|`src/app/portals/admin/components`|Admin portal pages/components.|
|`src/app/portals/admin/dashboard`|Admin portal pages/components.|
|`src/app/portals/admin/doctor-form`|Admin portal pages/components.|
|`src/app/portals/admin/doctors`|Admin portal pages/components.|
|`src/app/portals/admin/patient-detail`|Admin portal pages/components.|
|`src/app/portals/admin/patients`|Admin portal pages/components.|
|`src/app/portals/admin/reports`|Admin portal pages/components.|
|`src/app/portals/admin/services`|Admin portal pages/components.|
|`src/app/portals/admin/settings`|Admin portal pages/components.|
|`src/app/portals/admin/staff`|Admin portal pages/components.|
|`src/app/portals/admin/walk-in`|Admin portal pages/components.|
|`src/app/portals/doctor`|Doctor portal pages/components and clinical workflow.|
|`src/app/portals/doctor/appointment-detail`|Doctor portal pages/components and clinical workflow.|
|`src/app/portals/doctor/appointments`|Doctor portal pages/components and clinical workflow.|
|`src/app/portals/doctor/components`|Doctor portal pages/components and clinical workflow.|
|`src/app/portals/doctor/consultation`|Doctor portal pages/components and clinical workflow.|
|`src/app/portals/doctor/dashboard`|Doctor portal pages/components and clinical workflow.|
|`src/app/portals/doctor/patient-detail`|Doctor portal pages/components and clinical workflow.|
|`src/app/portals/doctor/patients`|Doctor portal pages/components and clinical workflow.|
|`src/app/portals/doctor/profile`|Doctor portal pages/components and clinical workflow.|
|`src/app/portals/doctor/schedule`|Doctor portal pages/components and clinical workflow.|
|`src/app/portals/doctor/services`|Doctor portal pages/components and clinical workflow.|
|`src/app/portals/patient`|Patient portal pages/components.|
|`src/app/portals/patient/booking-detail`|Patient portal pages/components.|
|`src/app/portals/patient/bookings`|Patient portal pages/components.|
|`src/app/portals/patient/components`|Patient portal pages/components.|
|`src/app/portals/patient/dashboard`|Patient portal pages/components.|
|`src/app/portals/patient/doctors`|Patient portal pages/components.|
|`src/app/portals/patient/documents`|Patient portal pages/components.|
|`src/app/portals/patient/lab-results`|Patient portal pages/components.|
|`src/app/portals/patient/labs-redirect`|Patient portal pages/components.|
|`src/app/portals/patient/medical-records`|Patient portal pages/components.|
|`src/app/portals/patient/prescriptions`|Patient portal pages/components.|
|`src/app/portals/patient/privacy-consent`|Patient portal pages/components.|
|`src/app/portals/patient/profile`|Patient portal pages/components.|
|`src/app/portals/patient/reviews`|Patient portal pages/components.|
|`src/app/portals/patient/services`|Patient portal pages/components.|
|`src/app/portals/patient/vaccinations`|Patient portal pages/components.|
|`src/app/portals/public`|Public discovery/booking pages and public booking wizard.|
|`src/app/portals/public/announcements`|Public discovery/booking pages and public booking wizard.|
|`src/app/portals/public/booking`|Public discovery/booking pages and public booking wizard.|
|`src/app/portals/public/booking-confirmation`|Public discovery/booking pages and public booking wizard.|
|`src/app/portals/public/components`|Public discovery/booking pages and public booking wizard.|
|`src/app/portals/public/doctor-profile`|Public discovery/booking pages and public booking wizard.|
|`src/app/portals/public/doctors`|Public discovery/booking pages and public booking wizard.|
|`src/app/portals/public/home`|Public discovery/booking pages and public booking wizard.|
|`src/app/portals/public/privacy-policy`|Public discovery/booking pages and public booking wizard.|
|`src/app/portals/public/services`|Public discovery/booking pages and public booking wizard.|
|`src/app/portals/public/utils`|Public discovery/booking pages and public booking wizard.|
|`src/app/portals/staff`|Staff portal pages/components.|
|`src/app/portals/staff/booking-detail`|Staff portal pages/components.|
|`src/app/portals/staff/bookings`|Staff portal pages/components.|
|`src/app/portals/staff/components`|Staff portal pages/components.|
|`src/app/portals/staff/dashboard`|Staff portal pages/components.|
|`src/app/portals/staff/doctor-status`|Staff portal pages/components.|
|`src/app/portals/staff/patient-detail`|Staff portal pages/components.|
|`src/app/portals/staff/patients`|Staff portal pages/components.|
|`src/app/portals/staff/payments`|Staff portal pages/components.|
|`src/app/portals/staff/profile`|Staff portal pages/components.|
|`src/app/portals/staff/services`|Staff portal pages/components.|
|`src/app/portals/staff/walk-in`|Staff portal pages/components.|
|`src/app/shared`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/avatar`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/banner`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/booking-print-document`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/booking-timer`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/confirm-modal`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/empty-state`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/notification-panel`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/page-header`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/patient-media-panel`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/portal-layout`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/receipt-modal`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/receipt-view`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/secure-image`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/skeleton`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/slot-grid`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/components/status-badge`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/pages`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/pages/not-found`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/pipes`|Shared UI components/layouts/pages/pipes/validators.|
|`src/app/shared/validators`|Shared UI components/layouts/pages/pipes/validators.|

## 5. Routing and Role Access Map

Top-level route file: `src/app/app.routes.ts`. `/admin`, `/staff`, `/doctor`, and `/patient` are guarded by `authGuard`, `roleGuard`, and `firstLoginGuard` at the top level. Public/auth/dev routes are not role-gated at the top level.

|Role bucket|Route URL|Component class|Component/source file|Layout|Guard summary|
|---|---|---|---|---|---|
|Public/Guest|`/public`|`HomePage`|`src/app/portals/public/home/home.page.ts`|`PublicLayoutComponent`|None|
|Public/Guest|`/public/doctors`|`DoctorsPage`|`src/app/portals/public/doctors/doctors.page.ts`|`PublicLayoutComponent`|None|
|Public/Guest|`/public/doctors/:id`|`DoctorProfilePage`|`src/app/portals/public/doctor-profile/doctor-profile.page.ts`|`PublicLayoutComponent`|None|
|Public/Guest|`/public/services`|`NotFoundPage`|`src/app/shared/pages/not-found/not-found.page.ts`|`PublicLayoutComponent`|None|
|Public/Guest|`/public/announcements`|`NotFoundPage`|`src/app/shared/pages/not-found/not-found.page.ts`|`PublicLayoutComponent`|None|
|Public/Guest|`/public/booking`|`NotFoundPage`|`src/app/shared/pages/not-found/not-found.page.ts`|`PublicLayoutComponent`|None|
|Public/Guest|`/public/booking-confirmation/:bookingId`|`NotFoundPage`|`src/app/shared/pages/not-found/not-found.page.ts`|`PublicLayoutComponent`|None|
|Public/Guest|`/public/privacy-policy`|`NotFoundPage`|`src/app/shared/pages/not-found/not-found.page.ts`|`PublicLayoutComponent`|None|
|Auth/Public|`/auth/login`|`LoginPage`|`src/app/auth/login/login.page.ts`|`AuthLayout where used by page`|None/authGuard when specified|
|Auth/Public|`/auth/register`|`RegisterPage`|`src/app/auth/register/register.page.ts`|`AuthLayout where used by page`|None/authGuard when specified|
|Auth/Public|`/auth/callback`|`AuthCallbackPage`|`src/app/auth/callback/auth-callback.page.ts`|`AuthLayout where used by page`|None/authGuard when specified|
|Auth/Public|`/auth/forgot-password`|`ForgotPasswordPage`|`src/app/auth/forgot-password/forgot-password.page.ts`|`AuthLayout where used by page`|None/authGuard when specified|
|Auth/Public|`/auth/reset-password`|`ResetPasswordPage`|`src/app/auth/reset-password/reset-password.page.ts`|`AuthLayout where used by page`|None/authGuard when specified|
|Auth/Public|`/auth/set-password`|`SetPasswordPage`|`src/app/auth/set-password/set-password.page.ts`|`AuthLayout where used by page`|None/authGuard when specified|
|Auth/Public|`/auth/privacy-consent`|`PrivacyConsentPage`|`src/app/auth/privacy-consent/privacy-consent.page.ts`|`AuthLayout where used by page`|None/authGuard when specified|
|Admin|`/admin/dashboard`|`DashboardPage`|`src/app/portals/admin/dashboard/dashboard.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Admin|`/admin/bookings`|`BookingsPage`|`src/app/portals/admin/bookings/bookings.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Admin|`/admin/bookings/:id`|`BookingDetailPage`|`src/app/portals/admin/booking-detail/booking-detail.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Admin|`/admin/walk-in`|`WalkInPage`|`src/app/portals/admin/walk-in/walk-in.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Admin|`/admin/calendar`|`CalendarPage`|`src/app/portals/admin/calendar/calendar.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Admin|`/admin/doctors`|`DoctorsPage`|`src/app/portals/admin/doctors/doctors.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Admin|`/admin/doctors/new`|`DoctorFormPage`|`src/app/portals/admin/doctor-form/doctor-form.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Admin|`/admin/doctors/:id/edit`|`DoctorFormPage`|`src/app/portals/admin/doctor-form/doctor-form.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Admin|`/admin/services`|`ServicesPage`|`src/app/portals/admin/services/services.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Admin|`/admin/patients`|`PatientsPage`|`src/app/portals/admin/patients/patients.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Admin|`/admin/patients/:id`|`PatientDetailPage`|`src/app/portals/admin/patient-detail/patient-detail.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Admin|`/admin/staff`|`StaffPage`|`src/app/portals/admin/staff/staff.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Admin|`/admin/announcements`|`AnnouncementsPage`|`src/app/portals/admin/announcements/announcements.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Admin|`/admin/settings`|`SettingsPage`|`src/app/portals/admin/settings/settings.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Admin|`/admin/audit-logs`|`AuditLogsPage`|`src/app/portals/admin/audit-logs/audit-logs.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Admin|`/admin/reports`|`ReportsPage`|`src/app/portals/admin/reports/reports.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard|
|Staff|`/staff/dashboard`|`StaffDashboardPage`|`src/app/portals/staff/dashboard/staff-dashboard.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Staff|`/staff/bookings`|`StaffBookingsPage`|`src/app/portals/staff/bookings/staff-bookings.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Staff|`/staff/payments`|`StaffPaymentsPage`|`src/app/portals/staff/payments/staff-payments.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Staff|`/staff/bookings/:id`|`StaffBookingDetailPage`|`src/app/portals/staff/booking-detail/staff-booking-detail.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Staff|`/staff/walk-in`|`StaffWalkInPage`|`src/app/portals/staff/walk-in/staff-walk-in.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Staff|`/staff/patients`|`StaffPatientsPage`|`src/app/portals/staff/patients/staff-patients.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Staff|`/staff/patients/:id`|`StaffPatientDetailPage`|`src/app/portals/staff/patient-detail/staff-patient-detail.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Staff|`/staff/doctor-status`|`DoctorStatusPage`|`src/app/portals/staff/doctor-status/doctor-status.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Staff|`/staff/profile`|`StaffProfilePage`|`src/app/portals/staff/profile/staff-profile.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Doctor|`/doctor/dashboard`|`DoctorDashboardPage`|`src/app/portals/doctor/dashboard/doctor-dashboard.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Doctor|`/doctor/appointments`|`DoctorAppointmentsPage`|`src/app/portals/doctor/appointments/doctor-appointments.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Doctor|`/doctor/appointments/:id`|`DoctorAppointmentDetailPage`|`src/app/portals/doctor/appointment-detail/doctor-appointment-detail.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Doctor|`/doctor/patients`|`DoctorPatientsPage`|`src/app/portals/doctor/patients/doctor-patients.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Doctor|`/doctor/patients/:id`|`DoctorPatientDetailPage`|`src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Doctor|`/doctor/schedule`|`DoctorSchedulePage`|`src/app/portals/doctor/schedule/doctor-schedule.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Doctor|`/doctor/consultation/:bookingId`|`DoctorConsultationPage`|`src/app/portals/doctor/consultation/doctor-consultation.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Doctor|`/doctor/my-profile`|`DoctorProfilePage`|`src/app/portals/doctor/profile/doctor-profile.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Doctor|`/doctor/profile`|`DoctorProfilePage`|`src/app/portals/doctor/profile/doctor-profile.page.ts`|`PortalLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Patient|`/patient/dashboard`|`PatientDashboardPage`|`src/app/portals/patient/dashboard/patient-dashboard.page.ts`|`PatientLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Patient|`/patient/doctors`|`PatientDoctorsPage`|`src/app/portals/patient/doctors/patient-doctors.page.ts`|`PatientLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Patient|`/patient/bookings`|`PatientBookingsPage`|`src/app/portals/patient/bookings/patient-bookings.page.ts`|`PatientLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Patient|`/patient/documents`|`PatientDocumentsPage`|`src/app/portals/patient/documents/patient-documents.page.ts`|`PatientLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Patient|`/patient/lab-results`|`PatientLabResultsPage`|`src/app/portals/patient/lab-results/patient-lab-results.page.ts`|`PatientLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Patient|`/patient/labs`|`PatientLabsRedirectPage`|`src/app/portals/patient/labs-redirect/patient-labs-redirect.page.ts`|`PatientLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Patient|`/patient/bookings/:id`|`PatientBookingDetailPage`|`src/app/portals/patient/booking-detail/patient-booking-detail.page.ts`|`PatientLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Patient|`/patient/medical-records`|`PatientMedicalRecordsPage`|`src/app/portals/patient/medical-records/patient-medical-records.page.ts`|`PatientLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Patient|`/patient/prescriptions`|`PatientPrescriptionsPage`|`src/app/portals/patient/prescriptions/patient-prescriptions.page.ts`|`PatientLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Patient|`/patient/vaccinations`|`PatientVaccinationsPage`|`src/app/portals/patient/vaccinations/patient-vaccinations.page.ts`|`PatientLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Patient|`/patient/profile`|`PatientProfilePage`|`src/app/portals/patient/profile/patient-profile.page.ts`|`PatientLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Patient|`/patient/reviews/:bookingId`|`PatientReviewsPage`|`src/app/portals/patient/reviews/patient-reviews.page.ts`|`PatientLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Patient|`/patient/privacy-consent`|`PatientPrivacyConsentPage`|`src/app/portals/patient/privacy-consent/patient-privacy-consent.page.ts`|`PatientLayoutComponent`|authGuard + roleGuard + firstLoginGuard top-level|
|Dev/Public|`/dev/gallery`|`DesignSystemGalleryPage`|`src/app/dev/design-system-gallery/design-system-gallery.page.ts`|`None`|None|

### Navigation Items by Role


#### Admin
|Label|Route|Icon|Section|
|---|---|---|---|
|Dashboard|`/admin/dashboard`|`grid-outline`|Main|
|Bookings|`/admin/bookings`|`calendar-outline`||
|Walk-In|`/admin/walk-in`|`walk-outline`||
|Calendar|`/admin/calendar`|`calendar-number-outline`||
|Patients|`/admin/patients`|`people-outline`|Records|
|Doctors|`/admin/doctors`|`medical-outline`||
|Services|`/admin/services`|`list-outline`||
|Staff Accounts|`/admin/staff`|`person-add-outline`|Management|
|Announcements|`/admin/announcements`|`megaphone-outline`||
|Reports|`/admin/reports`|`stats-chart-outline`|System|
|Audit Logs|`/admin/audit-logs`|`shield-checkmark-outline`||
|Settings|`/admin/settings`|`settings-outline`||

#### Staff
|Label|Route|Icon|Section|
|---|---|---|---|
|Dashboard|`/staff/dashboard`|`grid-outline`|Main|
|Today Bookings|`/staff/bookings`|`calendar-outline`||
|Payments|`/staff/payments`|`cash-outline`||
|Walk-In|`/staff/walk-in`|`walk-outline`||
|Patients|`/staff/patients`|`people-outline`|Records|
|Doctor Status|`/staff/doctor-status`|`medical-outline`|Tools|
|My Profile|`/staff/profile`|`person-outline`|Account|

#### Doctor
|Label|Route|Icon|Section|
|---|---|---|---|
|Dashboard|`/doctor/dashboard`|`grid-outline`|Main|
|Appointments|`/doctor/appointments`|`calendar-outline`||
|Patients|`/doctor/patients`|`people-outline`|Records|
|Schedule|`/doctor/schedule`|`time-outline`|Tools|
|My Profile|`/doctor/profile`|`person-outline`|Account|

#### Patient
|Label|Route|Icon|Section|
|---|---|---|---|
|Dashboard|`/patient/dashboard`|`grid-outline`||
|Doctors|`/patient/doctors`|`medical-outline`||
|Bookings|`/patient/bookings`|`calendar-outline`||
|My Documents|`/patient/documents`|`document-text-outline`|Records|
|My Lab Results|`/patient/lab-results`|`medkit-outline`||
|Medical Records|`/patient/medical-records`|`medical-outline`||
|Prescriptions|`/patient/prescriptions`|`document-text-outline`||
|Vaccinations|`/patient/vaccinations`|`shield-checkmark-outline`||
|Profile|`/patient/profile`|`person-outline`||

## 6. Auth, Session, Role Redirect, and Guard Flow

- Login page posts credentials to `auth/login`, stores tokens, maps returned user, updates auth state, then redirects by role.

- Social login paths exist for Google and Facebook through backend endpoints `auth/google` and `auth/facebook`.

- `APP_INITIALIZER` calls `auth/me` when stored tokens exist, then sets current user or logs out.

- `authInterceptor` attaches Bearer token, refreshes with `auth/refresh-token` on 401, retries once, and logs out on refresh failure.

- Token storage uses localStorage keys from `TokenService`; QA must verify logout clears local session and guarded routes redirect.

- First login flow exists through `firstLoginGuard` and `/auth/set-password`; QA must test first-login accounts separately from normal role accounts.


## 7. Central API Layer

File: `src/app/core/services/api.service.ts`. Detected methods include `get`, `post`, `put`, `patch`, `delete`, `postForm`, `download`, and centralized error handling. URL composition strips trailing slashes from base URL and leading slashes from endpoint paths.


### Endpoint Surface Detected From Frontend

|Endpoint expression / literal prefix|Methods detected|Representative files|
|---|---|---|
|`${endpoint}?bookingId=${bookingFilter}`|GET|`src/app/shared/components/patient-media-panel/patient-media-panel.component.ts`|
|`/consultation-requests/request-attending-physician`|POST|`src/app/portals/doctor/consultation/doctor-consultation.page.ts`|
|`/drug-interactions/allergy-check`|POST|`src/app/portals/doctor/components/prescription-form/prescription-form.component.ts`|
|`/drug-interactions/check`|POST|`src/app/portals/doctor/components/prescription-form/prescription-form.component.ts`|
|`admin/staff`|GET|`src/app/portals/admin/staff/staff.page.ts`|
|`admin/staff/`|PUT|`src/app/portals/admin/staff/staff.page.ts`|
|`admin/staff/invite`|POST|`src/app/portals/admin/staff/staff.page.ts`|
|`admin/staff/invite/`|PUT|`src/app/portals/admin/staff/staff.page.ts`|
|`announcements`|GET, POST|`src/app/portals/admin/announcements/announcements.page.ts, src/app/portals/public/announcements/announcements.page.ts, src/app/portals/public/home/home.page.ts`|
|`announcements/`|DELETE, PUT|`src/app/portals/admin/announcements/announcements.page.ts`|
|`audit-logs`|GET, POST|`src/app/portals/admin/audit-logs/audit-logs.page.ts, src/app/portals/admin/booking-detail/booking-detail.page.ts, src/app/portals/doctor/consultation/doctor-consultation.page.ts`|
|`auth/forgot-password`|POST|`src/app/auth/forgot-password/forgot-password.page.ts`|
|`auth/logout`|POST|`src/app/layouts/admin-layout/admin-layout.component.ts, src/app/layouts/doctor-layout/doctor-layout.component.ts, src/app/layouts/staff-layout/staff-layout.component.ts`|
|`auth/me`|GET|`src/app/app.config.ts, src/app/auth/callback/auth-callback.page.ts`|
|`auth/refresh-token`|POST|`src/app/core/interceptors/auth.interceptor.ts`|
|`auth/reset-password`|POST|`src/app/auth/reset-password/reset-password.page.ts`|
|`bookings`|GET, POST|`src/app/core/services/booking.service.ts, src/app/portals/public/components/step-payment/step-payment.component.ts, src/app/portals/public/components/step-proof/step-proof.component.ts`|
|`bookings/`|GET, PATCH, POST, PUT|`src/app/core/services/booking.service.ts, src/app/portals/admin/booking-detail/booking-detail.page.ts, src/app/portals/doctor/appointment-detail/doctor-appointment-detail.page.ts`|
|`bookings/${bookingId}/public-summary`|GET|`src/app/portals/public/booking-confirmation/booking-confirmation.page.ts`|
|`bookings/doctor/patients`|GET|`src/app/portals/doctor/patients/doctor-patients.page.ts`|
|`bookings/doctor/today`|GET|`src/app/portals/doctor/appointments/doctor-appointments.page.ts, src/app/portals/doctor/dashboard/doctor-dashboard.page.ts`|
|`bookings/doctor/today-summary`|GET|`src/app/portals/doctor/appointments/doctor-appointments.page.ts, src/app/portals/doctor/dashboard/doctor-dashboard.page.ts`|
|`bookings/staff/all?page=`|GET|`src/app/core/services/booking.service.ts, src/app/portals/staff/bookings/staff-bookings.page.ts`|
|`bookings/staff/for-payment?page=`|GET|`src/app/core/services/booking.service.ts, src/app/portals/staff/payments/staff-payments.page.ts`|
|`bookings/staff/today?page=`|GET|`src/app/core/services/booking.service.ts`|
|`bookings/walk-in`|POST|`src/app/portals/admin/walk-in/walk-in.page.ts, src/app/portals/staff/walk-in/staff-walk-in.page.ts`|
|`bookings?fromDate=`|GET|`src/app/portals/admin/dashboard/dashboard.page.ts`|
|`bookings?page=1&pageSize=100`|GET|`src/app/portals/patient/dashboard/patient-dashboard.page.ts, src/app/shared/components/patient-media-panel/patient-media-panel.component.ts`|
|`bookings?patientId=`|GET|`src/app/portals/doctor/consultation/doctor-consultation.page.ts, src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`|
|`bookings?status=CheckedIn&pageSize=1`|GET|`src/app/portals/admin/dashboard/dashboard.page.ts`|
|`doctor-day-status/`|GET, POST|`src/app/portals/public/doctor-profile/doctor-profile.page.ts, src/app/portals/staff/doctor-status/doctor-status.page.ts`|
|`doctors`|GET, POST|`src/app/portals/admin/dashboard/dashboard.page.ts, src/app/portals/admin/doctor-form/doctor-form.page.ts, src/app/portals/admin/walk-in/walk-in.page.ts`|
|`doctors/`|DELETE, GET, POST, PUT|`src/app/portals/admin/doctor-form/doctor-form.page.ts, src/app/portals/admin/doctors/doctors.page.ts, src/app/portals/admin/services/doctor-state.service.ts`|
|`doctors/${this.doctorId}`|PUT|`src/app/portals/admin/doctor-form/doctor-form.page.ts`|
|`doctors/admin`|GET|`src/app/portals/admin/doctor-form/doctor-form.page.ts, src/app/portals/admin/services/doctor-state.service.ts, src/app/portals/admin/services/services.page.ts`|
|`doctors/me`|GET|`src/app/portals/doctor/consultation/doctor-consultation.page.ts, src/app/portals/doctor/dashboard/doctor-dashboard.page.ts, src/app/portals/doctor/schedule/doctor-schedule.page.ts`|
|`endpoint).pipe(`|GET|`src/app/portals/admin/patients/patients.page.ts, src/app/portals/admin/walk-in/walk-in.page.ts, src/app/portals/staff/walk-in/staff-walk-in.page.ts`|
|`medical-records/allergies`|POST|`src/app/portals/admin/components/medical-records-tab/medical-records-tab.component.ts`|
|`medical-records/allergies?patientId=`|GET|`src/app/portals/admin/patient-detail/patient-detail.page.ts, src/app/portals/doctor/consultation/doctor-consultation.page.ts`|
|`medical-records/consultations?patientId=`|GET|`src/app/portals/admin/patient-detail/patient-detail.page.ts, src/app/portals/doctor/consultation/doctor-consultation.page.ts, src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`|
|`medical-records/follow-ups?patientId=`|GET|`src/app/portals/admin/patient-detail/patient-detail.page.ts, src/app/portals/doctor/consultation/doctor-consultation.page.ts, src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`|
|`medical-records/lab-orders?patientId=`|GET|`src/app/portals/doctor/consultation/doctor-consultation.page.ts`|
|`medical-records/lab-results`|POST|`src/app/portals/admin/components/medical-records-tab/medical-records-tab.component.ts`|
|`medical-records/lab-results?patientId=`|GET|`src/app/portals/admin/patient-detail/patient-detail.page.ts, src/app/portals/doctor/consultation/doctor-consultation.page.ts, src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`|
|`medical-records/me`|GET|`src/app/portals/patient/medical-records/patient-medical-records.page.ts`|
|`medical-records/prescriptions?patientId=`|GET|`src/app/portals/admin/patient-detail/patient-detail.page.ts, src/app/portals/doctor/consultation/doctor-consultation.page.ts, src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`|
|`medical-records/vaccinations`|POST|`src/app/portals/admin/components/medical-records-tab/medical-records-tab.component.ts`|
|`medical-records/vaccinations?patientId=`|GET|`src/app/portals/admin/patient-detail/patient-detail.page.ts, src/app/portals/doctor/consultation/doctor-consultation.page.ts, src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`|
|`medication_master`|GET|`src/app/portals/doctor/components/prescription-builder/prescription-drug-list.ts`|
|`notifications/${notification.id}/read`|PUT|`src/app/shared/components/notification-panel/notification-panel.component.ts`|
|`notifications/read-all`|PUT|`src/app/shared/components/notification-panel/notification-panel.component.ts`|
|`patients`|GET, POST|`src/app/core/services/patient-state.service.ts, src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts, src/app/portals/admin/patients/admin-patient-create-modal.component.ts`|
|`patients/`|GET, POST, PUT|`src/app/core/services/patient-state.service.ts, src/app/portals/admin/booking-detail/booking-detail.page.ts, src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts`|
|`patients/${patient.id}`|PUT|`src/app/core/services/patient-state.service.ts`|
|`patients/${patientId}/portal-account`|POST|`src/app/core/services/patient-state.service.ts`|
|`patients/me`|GET|`src/app/portals/patient/booking-detail/patient-booking-detail.page.ts, src/app/portals/patient/dashboard/patient-dashboard.page.ts, src/app/portals/patient/reviews/patient-reviews.page.ts`|
|`patients?pageSize=1000`|GET|`src/app/portals/admin/dashboard/dashboard.page.ts`|
|`patients?search=`|GET|`src/app/core/services/patient-state.service.ts`|
|`patients?userId=`|GET|`src/app/core/services/patient-state.service.ts`|
|`payments/`|GET, PATCH|`src/app/portals/doctor/appointments/doctor-appointments.page.ts, src/app/portals/doctor/consultation/doctor-consultation.page.ts, src/app/portals/patient/booking-detail/patient-booking-detail.page.ts`|
|`prescriptions/me`|GET|`src/app/portals/patient/prescriptions/patient-prescriptions.page.ts`|
|`reports/daily-booking-summary`|GET|`src/app/portals/admin/reports/reports.page.ts`|
|`reports/pending-follow-ups`|GET|`src/app/portals/admin/reports/reports.page.ts`|
|`reports/unpaid-completed-visits`|GET|`src/app/portals/admin/reports/reports.page.ts`|
|`reviews`|POST|`src/app/portals/patient/reviews/patient-reviews.page.ts`|
|`reviews?bookingId=`|GET|`src/app/portals/patient/reviews/patient-reviews.page.ts`|
|`reviews?doctorId=`|GET|`src/app/portals/public/doctor-profile/doctor-profile.page.ts`|
|`services`|GET, POST|`src/app/portals/admin/dashboard/dashboard.page.ts, src/app/portals/admin/services/services.page.ts, src/app/portals/admin/walk-in/walk-in.page.ts`|
|`services/`|PUT|`src/app/portals/admin/services/services.page.ts`|
|`settings`|GET, PUT|`src/app/app.component.ts, src/app/portals/admin/settings/settings.page.ts, src/app/portals/public/home/home.page.ts`|

### Non-ApiService URL/HTTP environment usage
|File:line|Usage|
|---|---|
|`src/app/app.config.ts:3`|`import { provideHttpClient, withInterceptors } from '@angular/common/http';`|
|`src/app/app.config.ts:52`|`provideHttpClient(withInterceptors([authInterceptor])),`|
|`src/app/core/services/api.service.ts:1`|`import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';`|
|`src/app/core/services/api.service.ts:9`|`private readonly http = inject(HttpClient);`|
|`src/app/core/services/api.service.ts:10`|`private readonly baseUrl = (environment.apiUrl \|\| environment.apiBaseUrl \|\| '').replace(/\/+$/, '');`|
|`src/app/core/services/patient-documents.service.ts:7`|`const baseUrl = (environment.apiUrl \|\| environment.apiBaseUrl \|\| '').replace(/\/+$/, '');`|

## 8. Services Inventory

|Service file|Class|Detected API call lines|Detected public/domain methods|
|---|---|---:|---|
|`src/app/core/services/api.service.ts`|`ApiService`|11|if, getBlob, postBlob, getBlobResponse, postBlobResponse|
|`src/app/core/services/auth-state.service.ts`|`AuthStateService`|0|setLoading, setError, clearError, setUser, if, patchUser, if, logout, ensurePatientRecord, clearState, clearUser, hasRole|
|`src/app/core/services/auth.service.ts`|`AuthService`|0|persistUser, clearSession, storeTokens, toAuthUser, navigateByRole, if, switch, getGoogleTokenViaPopup, if, if, if, getFacebookTokenViaPopup, if, if, if|
|`src/app/core/services/booking-wizard.service.ts`|`BookingWizardService`|0|patchState, selectDoctor, selectService, toggleService, setSelectedServices, selectDate, selectSlot, selectPaymentMode, nextStep, prevStep, setStep, reset|
|`src/app/core/services/booking.service.ts`|`BookingService`|6|refresh, getBookings, getBookingById, if, getBookingsByStatus, getBookingsByDoctorId, getBookingsByPatientId, getTodaysBookings, getTodaysBookingsByDoctorId, getUpcomingBookingsByDoctorId, getDoctorUpcoming, getStaffTodayBookings, getStaffBookings, getStaffForPayment, rescheduleBooking|
|`src/app/core/services/clinic-dashboard-realtime.service.ts`|`ClinicDashboardRealtimeService`|0|constructor, ngOnDestroy, emit, if, unsubscribeAll, if, for, if|
|`src/app/core/services/clinic-settings.service.ts`|`ClinicSettingsService`|0|load, setSettings, bumpConsentVersion|
|`src/app/core/services/doctor-state.service.ts`|`DoctorStateService`|0|getDoctors, getDoctorByUserId, getDoctorDayStatus, setDoctors, setLoading, setTodayStatus, setDayStatuses, mergeDayStatus, if, normalizeDoctorRows, normalizeDoctorRow, normalizeDoctorDayStatusRow|
|`src/app/core/services/drug-interaction.service.ts`|`DrugInteractionService`|0|buildAllergyCacheKey, buildInteractionCacheKey, getCachedAllergyConflict, setAllergyConflict, getCachedInteractionResult, setInteractionResult, evaluateAllergyConflict, if, evaluateDrugInteractions, if, for, if, if, for, if|
|`src/app/core/services/medical-records.service.ts`|`MedicalRecordsService`|0|mapConsultationRows, mapPrescriptionRows, mapAllergyRows, mapLabRequestRows, mapLabResultRows, mapVaccinationRows, mapFollowUpRows, mapConsultationRecordRow, if, if, if, if, if, if, if|
|`src/app/core/services/mock-data.service.ts`|`MockDataService`|0|generateOrNumber, constructor, for, getClinicSettings, getPaymentSettings, getDoctors, getDoctorById, getDoctorSchedules, getDoctorSchedulesByDoctorId, getDoctorBlockedDates, if, getServices, getServiceById, getPatients, getPatientById|
|`src/app/core/services/notification.service.ts`|`NotificationService`|0|constructor, setNotifications, replaceNotifications, markRead, markAllRead, markReadLocal, markAllReadLocal, refresh|
|`src/app/core/services/offline-consultation-queue.service.ts`|`OfflineConsultationQueueService`|0|enqueue, getLatest, resolve, listPending, if, clear, if, if, if, if|
|`src/app/core/services/patient-clinical-history.service.ts`|`PatientClinicalHistoryService`|0|buildPatientClinicalHistory, for, if|
|`src/app/core/services/patient-documents.service.ts`|`PatientDocumentsService`|0|getDownloadUrl|
|`src/app/core/services/patient-state.service.ts`|`PatientStateService`|6|refresh, getPatients, getPatientById, getPatientByUserId, getFilteredPatients, addPatient, savePatient, updatePatientConsent|
|`src/app/core/services/patient-vaccinations.service.ts`|`PatientVaccinationsService`|0|getPatientVaccinations, createPatientVaccination, updatePatientVaccination, deletePatientVaccination, getMyVaccinations|
|`src/app/core/services/push-notification.service.ts`|`PushNotificationService`|0|constructor, if, registerDevice, if, if, if, if, if, if, if, markRead, markAllRead, if, if, if|
|`src/app/core/services/realtime-init.service.ts`|`RealtimeInitService`|0|[UNCLEAR]|
|`src/app/core/services/token.service.ts`|`TokenService`|0|constructor, setTokens, setAccessToken, setRefreshToken, getAccessToken, getRefreshToken, clearTokens, hasAccessToken, hasRefreshToken, setToken, getToken, clearToken, hasToken|
|`src/app/portals/admin/services/admin-doctors.service.ts`|`AdminDoctorsService`|0|createDoctorInvite|
|`src/app/portals/admin/services/admin-patients.service.ts`|``|0|[UNCLEAR]|
|`src/app/portals/admin/services/admin-reports.service.ts`|``|0|[UNCLEAR]|
|`src/app/portals/admin/services/admin-services.service.ts`|``|0|[UNCLEAR]|
|`src/app/portals/admin/services/admin-settings.service.ts`|`AdminSettingsService`|0|getSettings, updateSettings, bumpConsentVersion|
|`src/app/portals/admin/services/doctor-state.service.ts`|`DoctorStateService`|3|refresh, getDoctors, getDoctorById, getDoctorByUserId, getDoctorSchedules, getDoctorDayStatus, getDoctorDayStatusSignal, loadDoctorsFromApi, if, loadSingleDayStatus, if, updateDayStatusViaApi, addDoctor, updateDoctor, setDoctorStatus|
|`src/app/portals/doctor/services/doctor.service.ts`|``|0|[UNCLEAR]|
|`src/app/portals/patient/services/patient.service.ts`|`PatientService`|0|[UNCLEAR]|
|`src/app/portals/public/services/booking-availability.service.ts`|`BookingAvailabilityService`|0|getManilaTodayIso, getManilaDayOfWeek, isManilaToday, isManilaPast, getManilaDateOffset|
|`src/app/portals/public/services/public.service.ts`|``|0|[UNCLEAR]|
|`src/app/portals/staff/services/staff.service.ts`|``|0|[UNCLEAR]|

## 9. Component/Page Inventory for QA

|File|Class|API call lines|State keywords detected|Action/method hints|
|---|---|---:|---|---|
|`src/app/app.component.ts`|`AppComponent`|1|error, loading, spinner|if, if, if|
|`src/app/auth/callback/auth-callback.page.ts`|`AuthCallbackPage`|1|error, loading, spinner|if, if, if, if, if|
|`src/app/auth/components/auth-layout/auth-layout.component.ts`|`AuthLayoutComponent`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/auth/forgot-password/forgot-password.page.ts`|`ForgotPasswordPage`|1|error, submitting, success|constructor, onSubmit, if|
|`src/app/auth/login/login.page.ts`|`LoginPage`|0|error, isLoading, loading, spinner, toast|constructor, fillCreds, onLogin, if, onGoogleLogin, onFacebookLogin, presentToast, if, if, if|
|`src/app/auth/privacy-consent/privacy-consent.page.ts`|`PrivacyConsentPage`|0|[UNCLEAR]|onScroll, if, onAccept, if, if|
|`src/app/auth/register/register.page.ts`|`RegisterPage`|0|error, isLoading, loading, spinner|onSubmit, if, onGoogleLogin, onFacebookLogin, switch, if, if, if, if|
|`src/app/auth/reset-password/reset-password.page.ts`|`ResetPasswordPage`|1|error, saving, success, toast|onSubmit, if, if|
|`src/app/auth/set-password/set-password.page.ts`|`SetPasswordPage`|0|error, saving, success, toast|onSubmit, if, if, if|
|`src/app/core/base/base.component.ts`|`BaseComponent`|0|success, toast|[UNCLEAR]|
|`src/app/dev/design-system-gallery/design-system-gallery.page.ts`|`DesignSystemGalleryPage`|0|empty, success|constructor, onConfirmDismiss|
|`src/app/layouts/admin-layout/admin-layout.component.ts`|`AdminLayoutComponent`|1|error|filter, logout, closeSidebar, while|
|`src/app/layouts/doctor-layout/doctor-layout.component.ts`|`DoctorLayoutComponent`|1|error|filter, logout, closeSidebar, while|
|`src/app/layouts/public-layout/public-layout.component.ts`|`LegacyPublicLayoutComponent`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/layouts/staff-layout/staff-layout.component.ts`|`StaffLayoutComponent`|1|error|filter, closeSidebar, logout, while|
|`src/app/portals/admin/announcements/announcements.page.ts`|`AnnouncementsPage`|5|empty, error, isLoading, loading, toast|openModal, edit, closeModal, save, toggle, askDelete, closeDeleteModal, confirmDelete, if|
|`src/app/portals/admin/audit-logs/audit-logs.page.ts`|`AuditLogsPage`|1|empty, isLoading, loading|applyFilters|
|`src/app/portals/admin/booking-detail/booking-detail.page.ts`|`BookingDetailPage`|11|empty, isLoading, loading, success, toast|if, if, if, if, if, if, if, goBack, isStepActive, isStepComplete|
|`src/app/portals/admin/bookings/bookings.page.ts`|`BookingsPage`|0|empty, error, isLoading, loading|if, goToPage, if, for, clearFilters, toggleSelectAll, toggleSelect, if, openBooking, statusLabel|
|`src/app/portals/admin/calendar/calendar.page.ts`|`CalendarPage`|0|empty, error, isLoading, loading|shiftWeek, bookingsForCell, if, if, if|
|`src/app/portals/admin/components/booking-actions-menu/booking-actions-menu.component.ts`|`BookingActionsMenuComponent`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/portals/admin/components/color-picker/color-picker.component.ts`|`ColorPickerComponent`|0|error|if, onTextChange, onColorChange, isValidHex, if|
|`src/app/portals/admin/components/consultation-timeline/consultation-timeline.component.ts`|`ConsultationTimelineComponent`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/portals/admin/components/doctor-schedule-form/doctor-schedule-form.component.ts`|`DoctorScheduleFormComponent`|0|[UNCLEAR]|toggle, updateTime|
|`src/app/portals/admin/components/medical-records-tab/medical-records-tab.component.ts`|`MedicalRecordsTabComponent`|3|error, saving|if, addAllergyEntry, if, addLabResultEntry, if, addVaccinationEntry, if|
|`src/app/portals/admin/components/notification-bell/notification-bell.component.ts`|`NotificationBellComponent`|0|[UNCLEAR]|constructor, togglePanel, closePanel|
|`src/app/portals/admin/components/operating-hours-editor/operating-hours-editor.component.ts`|`OperatingHoursEditorComponent`|0|empty, error|if, setOpen, setTime, isRangeValid, if|
|`src/app/portals/admin/components/refund-payment-modal/refund-payment-modal.component.ts`|`RefundPaymentModalComponent`|0|[UNCLEAR]|confirm, if|
|`src/app/portals/admin/components/sidebar/sidebar.component.ts`|`SidebarComponent`|0|[UNCLEAR]|constructor, if, goToProfile, if, onLogoutClick|
|`src/app/portals/admin/components/stat-card/stat-card.component.ts`|`StatCardComponent`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/portals/admin/components/today-appointments-table/today-appointments-table.component.ts`|`TodayAppointmentsTableComponent`|0|empty, isLoading, loading|patientName, doctorName, serviceName|
|`src/app/portals/admin/components/topbar/topbar.component.ts`|`TopbarComponent`|0|[UNCLEAR]|constructor, if, if, goToProfile, if|
|`src/app/portals/admin/components/waive-payment-modal/waive-payment-modal.component.ts`|`WaivePaymentModalComponent`|0|[UNCLEAR]|confirm, if|
|`src/app/portals/admin/dashboard/dashboard.page.ts`|`DashboardPage`|5|error, isLoading, loading|if, for, handleTableAction, if, openBooking|
|`src/app/portals/admin/doctor-form/doctor-form.page.ts`|`DoctorFormPage`|5|empty, error, isLoading, loading, saving, spinner, success, toast|if, if, if, submit, if, if, toggleService, onPhotoSelected, if, if|
|`src/app/portals/admin/doctors/doctors.page.ts`|`DoctorsPage`|1|empty, error, isLoading, loading, spinner, success, toast|constructor, addDoctor, editDoctor, askDeactivate, cancelDeactivate, confirmDeactivate, workingDays, isBusy, if, if|
|`src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts`|`AdminPatientEditModalComponent`|2|error, saving, success, toast|if, showError, showEmailError, cancel, if, onLinkAccountToggle, submit, if, if, if|
|`src/app/portals/admin/patient-detail/patient-detail.page.ts`|`PatientDetailPage`|7|empty, error|back, openEdit, if, if, onTabChange, if, patientAccountStatus, if, patientAccountLabel, if|
|`src/app/portals/admin/patients/admin-patient-create-modal.component.ts`|`AdminPatientCreateModalComponent`|2|error, saving, success, toast|showError, cancel, if, onCreateAccountToggle, submit, if, if, if, if, if|
|`src/app/portals/admin/patients/patients.page.ts`|`PatientsPage`|1|empty, error, isLoading, loading, success, toast|constructor, if, if, if, openDetail, openAddPatientModal, if, previousPage, if, nextPage|
|`src/app/portals/admin/reports/reports.page.ts`|`ReportsPage`|3|empty, isLoading, loading, success, toast|applyFilters, viewBooking, sendReminder, exportCsv, if|
|`src/app/portals/admin/services/services.page.ts`|`ServicesPage`|4|empty, error, isLoading, loading, saving, spinner, success, toast|assignedDoctors, openModal, closeModal, if, edit, toggle, remove, save, if, if|
|`src/app/portals/admin/settings/settings.page.ts`|`SettingsPage`|1|empty, error, isLoading, loading, success, toast|markDirty, updateHours, if, setPrimaryColor, if, setSecondaryColor, if, onLogoSelected, if, saveSettings|
|`src/app/portals/admin/staff/staff.page.ts`|`StaffPage`|4|empty, error, loading, submitting, success, toast|for, openAddStaffForm, closeAddStaffForm, save, if, if, revokeInvite, toggle|
|`src/app/portals/admin/walk-in/walk-in.page.ts`|`WalkInPage`|7|empty, error, isLoading, loading, saving, spinner, success, toast|if, canAccessStep, switch, isStepComplete, switch, goToStep, trackById, patientDisplayName, patientAccountStatus, patientAccountLabel|
|`src/app/portals/doctor/appointment-detail/doctor-appointment-detail.page.ts`|`DoctorAppointmentDetailPage`|1|empty, error|if, openConsultation, back, patientName, timeline, consultationActionLabel, if, if, if, if|
|`src/app/portals/doctor/appointments/doctor-appointments.page.ts`|`DoctorAppointmentsPage`|4|empty, error, isLoading, loading, saving, submitting, success, toast|if, if, loadSummary, view, consult, canStartConsultation, canComplete, timeRangeLabel, servicesLabel, openCompleteModal|
|`src/app/portals/doctor/components/allergy-warning-banner/allergy-warning-banner.component.ts`|`AllergyWarningBannerComponent`|0|[UNCLEAR]|if, if, dismiss, if, if, if|
|`src/app/portals/doctor/components/diagnosis-picker/diagnosis-picker.component.ts`|`DiagnosisPickerComponent`|0|empty, error, loading, spinner|constructor, if, if, if, onDocumentClick, onEscape, if, if, if, handleSearchBlur|
|`src/app/portals/doctor/components/doctor-appointment-card/doctor-appointment-card.component.ts`|`DoctorAppointmentCardComponent`|0|[UNCLEAR]|if, if, canStartConsultation|
|`src/app/portals/doctor/components/doctor-patient-card/doctor-patient-card.component.ts`|`DoctorPatientCardComponent`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/portals/doctor/components/doctor-queue-table/doctor-queue-table.component.ts`|`DoctorQueueTableComponent`|0|empty|if, patientName, patientCode, serviceName, canStartConsultation, canMarkComplete, canMarkNoShow|
|`src/app/portals/doctor/components/doctor-schedule-editor/doctor-schedule-editor.component.ts`|`DoctorScheduleEditorComponent`|0|empty, isLoading, loading, saving, success|if, if, save, addBlockedDate, if, removeBlockedDate, onPreviewDateInput, if, markDirty|
|`src/app/portals/doctor/components/doctor-status-panel/doctor-status-panel.component.ts`|`DoctorStatusPanelComponent`|0|[UNCLEAR]|setAvailable, setRunningLate, if, markUnavailableToday, onMinutesChange|
|`src/app/portals/doctor/components/follow-up-form/follow-up-form.component.ts`|`FollowUpFormComponent`|0|[UNCLEAR]|constructor, if, if, if, if|
|`src/app/portals/doctor/components/lab-request-form/lab-request-form.component.ts`|`LabRequestFormComponent`|0|[UNCLEAR]|constructor, if, if, if, toggleQuickTest, if, isQuickSelected, removeSelectedLabOrder, onFileChange, if|
|`src/app/portals/doctor/components/prescription-builder/medication-picker-modal.component.ts`|`MedicationPickerModalComponent`|0|empty|updateQuery, if, if, select, close|
|`src/app/portals/doctor/components/prescription-builder/prescription-builder.component.ts`|`PrescriptionBuilderComponent`|0|[UNCLEAR]|constructor, if, if, if, addItem, if, removeItem, if, setActiveSuggestion, updateSuggestions|
|`src/app/portals/doctor/components/prescription-form/prescription-form.component.ts`|`PrescriptionFormComponent`|3|empty, error|constructor, if, if, hideDrugSuggestions, hideDosage, hideRoute, hideFreq, hideInst, filterDrugs, selectDrug|
|`src/app/portals/doctor/components/soap-form/soap-form.component.ts`|`SoapFormComponent`|0|error|constructor, if, if, if, onDocumentClick, onEscape, toggleTemplate, insertTemplatePhrase, if, charCount|
|`src/app/portals/doctor/components/vaccination-form/vaccination-form.component.ts`|`VaccinationFormComponent`|0|[UNCLEAR]|toggleExpanded, expandAndStart, addVaccination, if, if, editVaccination, removeVaccination|
|`src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts`|`VitalSignsFormComponent`|0|error|if, if, constructor, if, if, if, markTouched, hasValue, acknowledgeCriticalAlerts, getDisplayStatus|
|`src/app/portals/doctor/components/vitals-trend-chart/vitals-trend-chart.component.ts`|`VitalsTrendChartComponent`|0|empty|if, isMobileViewport, latestValue, linePoints, if, if, linePath, if, areaPath, if|
|`src/app/portals/doctor/consultation/components/allergy-badge.component.ts`|`AllergyBadgeComponent`|0|empty|if, if, switch, switch|
|`src/app/portals/doctor/consultation/components/consultation-complete-modal.component.ts`|`ConsultationCompleteModalComponent`|0|submitting|hasMissingChecklistItems, goToSummary, goBack, if, finalize, if, if, close, if, isArrayValue|
|`src/app/portals/doctor/consultation/components/consultation-header.component.ts`|`ConsultationHeaderComponent`|0|saving|[UNCLEAR]|
|`src/app/portals/doctor/consultation/components/consultation-overview.component.ts`|`ConsultationOverviewComponent`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/portals/doctor/consultation/components/consultation-summary.component.ts`|`ConsultationSummaryComponent`|0|empty|isBloodPressureOutOfRange, isHeartRateOutOfRange, isRespiratoryRateOutOfRange, isTemperatureOutOfRange, isOxygenOutOfRange, isBmiOutOfRange|
|`src/app/portals/doctor/consultation/components/consultation-workspace.component.ts`|`ConsultationWorkspaceComponent`|0|empty|getLastVisitSoap, if, getSectionAuditText, if|
|`src/app/portals/doctor/consultation/components/patient-clinical-history-drawer.component.ts`|`PatientClinicalHistoryDrawerComponent`|0|empty, loading|toggle, isOpenEntry, getSoapSummary, getSoapField, getPrescriptionItems, getLabOrderName, getFollowUpDate|
|`src/app/portals/doctor/consultation/components/patient-identity-strip.component.ts`|`PatientIdentityStripComponent`|0|[UNCLEAR]|if, if, if, if, toggleExpanded, emitHistoryClick, if|
|`src/app/portals/doctor/consultation/components/professional-fee-decision-form.component.ts`|`ProfessionalFeeDecisionFormComponent`|0|[UNCLEAR]|constructor, if, if, if, if|
|`src/app/portals/doctor/consultation/components/soap-last-visit-modal.component.ts`|`SoapLastVisitModalComponent`|0|[UNCLEAR]|if, dismiss, accept|
|`src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts`|`DoctorConsultationStubPage`|1|empty, error|if, if, backToAppointment, if, if, if, if|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts`|`DoctorConsultationPage`|22|empty, error, isLoading, loading, saving, spinner, submitting, success, toast|if, if, if, if, if, if, handleKeyboardShortcuts, if, if, if|
|`src/app/portals/doctor/dashboard/doctor-dashboard.page.ts`|`DoctorDashboardPage`|6|empty, error, isLoading, loading, spinner, success, toast|if, if, filter, ionViewWillEnter, loadDashboard, if, updateStatus, openAppointment, startConsult, viewChart|
|`src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`|`DoctorPatientDetailPage`|8|empty, error, loading, spinner|calcAge, retry, onTabChange, if, switch, switch, viewFile, if, for, if|
|`src/app/portals/doctor/patients/doctor-patients.page.ts`|`DoctorPatientsPage`|1|empty, error, loading|openClinicalHistory, openClinicalHistoryFromButton, openAppointment, formatLatestVisitDate, if, formatLatestVisitTime, for, if, if, if|
|`src/app/portals/doctor/profile/doctor-profile.page.ts`|`DoctorProfilePage`|0|empty, error, isLoading, loading, saving, spinner, success, toast|switch, if, if, reload, onPhotoUpload, if, save, if, if, if|
|`src/app/portals/doctor/schedule/doctor-schedule.page.ts`|`DoctorSchedulePage`|7|empty, error, isLoading, loading, saving, success, toast|loadData, if, if, saveSchedules, addBlockedDate, if, removeBlockedDate, if, updatePreviewDate, markDirty|
|`src/app/portals/patient/booking-detail/patient-booking-detail.page.ts`|`PatientBookingDetailPage`|5|empty, error, success, toast|if, if, if, if, if, if, if, if, if, if|
|`src/app/portals/patient/bookings/patient-bookings.page.ts`|`PatientBookingsPage`|1|empty, error, isLoading, loading|if, ionViewWillEnter, if, if, if, if, if, setFilter, previousPage, if|
|`src/app/portals/patient/components/booking-timeline/booking-timeline.component.ts`|`BookingTimelineComponent`|0|[UNCLEAR]|if, if, if, if, if, stateClass, if, if, if, if|
|`src/app/portals/patient/components/medical-record-card/medical-record-card.component.ts`|`MedicalRecordCardComponent`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/portals/patient/components/patient-booking-card/patient-booking-card.component.ts`|`PatientBookingCardComponent`|0|[UNCLEAR]|if, if, if, if, if, if, if, if, if, if|
|`src/app/portals/patient/components/patient-layout/patient-layout.component.ts`|`PatientLayoutComponent`|1|error, loading, toast|constructor, filter, openSidebar, closeSidebar, logout, downloadAllClinicalRecords, if, while|
|`src/app/portals/patient/components/patient-topbar/patient-topbar.component.ts`|`PatientTopbarComponent`|0|[UNCLEAR]|constructor, toggleMenu, closeMenu|
|`src/app/portals/patient/components/prescription-card/prescription-card.component.ts`|`PrescriptionCardComponent`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/portals/patient/components/proof-submission-form/proof-submission-form.component.ts`|`ProofSubmissionFormComponent`|0|error, submitting|constructor, if, submit, if, if|
|`src/app/portals/patient/components/review-form/review-form.component.ts`|`ReviewFormComponent`|0|error|setRating, submit, if|
|`src/app/portals/patient/components/upcoming-appointment-card/upcoming-appointment-card.component.ts`|`UpcomingAppointmentCardComponent`|0|toast|constructor, if, if, if, if|
|`src/app/portals/patient/dashboard/patient-dashboard.page.ts`|`PatientDashboardPage`|4|empty, error, loading, toast|constructor, if, canSubmitProof, openBooking, showPhaseNineToast, showPhaseTenToast, getWelcomeName, if, if, if|
|`src/app/portals/patient/doctors/patient-doctors.page.ts`|`PatientDoctorsPage`|0|empty, error, isLoading, loading|ionViewWillEnter, if, retry, doctorScheduleSummary, if, if, if, if, if|
|`src/app/portals/patient/documents/patient-documents.page.ts`|`PatientDocumentsPage`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/portals/patient/lab-results/patient-lab-results.page.ts`|`PatientLabResultsPage`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/portals/patient/labs-redirect/patient-labs-redirect.page.ts`|`PatientLabsRedirectPage`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/portals/patient/medical-records/patient-medical-records.page.ts`|`PatientMedicalRecordsPage`|1|empty, error, loading, spinner, toast|loadRecords, onSearchChange, downloadMedicalRecord, downloadConsultationSummary, downloadAllRecords, isDownloading, isDownloadingSummary, if, if|
|`src/app/portals/patient/prescriptions/patient-prescriptions.page.ts`|`PatientPrescriptionsPage`|1|empty, error, loading, spinner, toast|loadPrescriptions, onSearchChange, downloadPrescription, downloadConsultationSummary, downloadAllRecords, isDownloading, isDownloadingSummary, if, if|
|`src/app/portals/patient/privacy-consent/patient-privacy-consent.page.ts`|`PatientPrivacyConsentPage`|0|error, success, toast|if, acceptConsent, if, if|
|`src/app/portals/patient/profile/patient-profile.page.ts`|`PatientProfilePage`|0|error, isLoading, loading, saving, submitting, success, toast|constructor, if, switch, saveProfile, if, if, if, if, changePassword, if|
|`src/app/portals/patient/reviews/patient-reviews.page.ts`|`PatientReviewsPage`|4|empty, error, submitting, success, toast|if, submitReview, if, back, if, if, if, if, if|
|`src/app/portals/patient/vaccinations/patient-vaccinations.page.ts`|`PatientVaccinationsPage`|0|empty, error, loading, spinner, toast|loadVaccinations, onSearchChange, formatSource, switch, if, if|
|`src/app/portals/public/announcements/announcements.page.ts`|`AnnouncementsPage`|1|empty, isLoading, loading|[UNCLEAR]|
|`src/app/portals/public/booking-confirmation/booking-confirmation.page.ts`|`BookingConfirmationPage`|3|error, loading|if, if|
|`src/app/portals/public/booking/booking.page.ts`|`BookingPage`|1|error|if, if, if|
|`src/app/portals/public/components/announcement-card/announcement-card.component.ts`|`AnnouncementCardComponent`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/portals/public/components/booking-summary-bar/booking-summary-bar.component.ts`|`BookingSummaryBarComponent`|2|error|[UNCLEAR]|
|`src/app/portals/public/components/booking-wizard/booking-wizard.component.ts`|`BookingWizardComponent`|0|[UNCLEAR]|constructor|
|`src/app/portals/public/components/doctor-card/doctor-card.component.ts`|`DoctorCardComponent`|0|[UNCLEAR]|constructor|
|`src/app/portals/public/components/hero-section/hero-section.component.ts`|`HeroSectionComponent`|0|[UNCLEAR]|constructor|
|`src/app/portals/public/components/operating-hours-bar/operating-hours-bar.component.ts`|`OperatingHoursBarComponent`|0|[UNCLEAR]|if|
|`src/app/portals/public/components/public-footer/public-footer.component.ts`|`PublicFooterComponent`|1|[UNCLEAR]|constructor|
|`src/app/portals/public/components/public-layout/public-layout.component.ts`|`PublicLayoutComponent`|0|[UNCLEAR]|onMainScroll|
|`src/app/portals/public/components/public-navbar/public-navbar.component.ts`|`PublicNavbarComponent`|0|[UNCLEAR]|constructor, portalDashboardRoute, switch, closeMobile|
|`src/app/portals/public/components/review-card/review-card.component.ts`|`ReviewCardComponent`|0|[UNCLEAR]|constructor|
|`src/app/portals/public/components/service-category-card/service-category-card.component.ts`|`ServiceCategoryCardComponent`|0|[UNCLEAR]|constructor|
|`src/app/portals/public/components/step-auth-check/step-auth-check.component.ts`|`StepAuthCheckComponent`|0|empty|constructor, continue, goBack|
|`src/app/portals/public/components/step-date-picker/step-date-picker.component.ts`|`StepDatePickerComponent`|0|empty, error, isLoading, loading, spinner, toast|constructor, if, if, for, for, prevMonth, if, nextMonth, onDayClick, goBack|
|`src/app/portals/public/components/step-doctor-service/step-doctor-service.component.ts`|`StepDoctorServiceComponent`|1|empty, error, isLoading, loading, spinner, toast|constructor, if, if, selectDoctor, toggleService, changeDoctor, isServiceSelected, goNext, if, if|
|`src/app/portals/public/components/step-payment/step-payment.component.ts`|`StepPaymentComponent`|3|error, submitting, success, toast|submitBooking, if, if, if, if, if, goBack, if, if, if|
|`src/app/portals/public/components/step-proof/step-proof.component.ts`|`StepProofComponent`|2|error, submitting, success, toast|constructor, onFileSelected, if, if, onSubmit, if, submitPayAtClinic, if, goBack, if|
|`src/app/portals/public/components/step-review/step-review.component.ts`|`StepReviewComponent`|2|error|onConfirmAndProceed, goBack|
|`src/app/portals/public/components/step-slot-select/step-slot-select.component.ts`|`StepSlotSelectComponent`|1|empty, error, isLoading, loading, spinner, toast|constructor, if, selectSlot, goBack, goNext, isSlotUnavailable, getUnavailableLabel, if, if, if|
|`src/app/portals/public/doctor-profile/doctor-profile.page.ts`|`DoctorProfilePage`|4|empty, error, isLoading, loading|constructor, badgeClass, if|
|`src/app/portals/public/doctors/doctors.page.ts`|`DoctorsPage`|0|empty, error, isLoading, loading, spinner, toast|if, if, if|
|`src/app/portals/public/home/home.page.ts`|`HomePage`|4|[UNCLEAR]|countFor, onCategorySelect|
|`src/app/portals/public/privacy-policy/privacy-policy.page.ts`|`PrivacyPolicyPage`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/portals/public/services/services.page.ts`|`ServicesPage`|0|empty, error, isLoading, loading, spinner, toast|if, if, categoryDescription, badgeClass, if, if|
|`src/app/portals/staff/booking-detail/staff-booking-detail.page.ts`|`StaffBookingDetailPage`|7|empty, error, isLoading, loading, success, toast|if, if, if, if, if, if, if, if, if, if|
|`src/app/portals/staff/bookings/staff-bookings.page.ts`|`StaffBookingsPage`|4|empty, error, isLoading, loading, success, toast|if, onDateChanged, onFiltersChanged, refresh, previousPage, if, nextPage, if, openBooking, checkIn|
|`src/app/portals/staff/components/doctor-status-card/doctor-status-card.component.ts`|`DoctorStatusCardComponent`|0|[UNCLEAR]|constructor, setAvailable, setUnavailable, confirmRunningLate, confirmUnavailable|
|`src/app/portals/staff/components/queue-table/queue-table.component.ts`|`QueueTableComponent`|0|empty, isLoading, loading|if, patientLabel, doctorLabel, serviceLabel, if, if, if, if, if, timeLabel|
|`src/app/portals/staff/dashboard/staff-dashboard.page.ts`|`StaffDashboardPage`|2|error, isLoading, loading|constructor, ionViewWillEnter, goToPaymentQueue, openBooking, onQueueAction, switch|
|`src/app/portals/staff/doctor-status/doctor-status.page.ts`|`DoctorStatusPage`|1|empty, error, isLoading, loading, success, toast|loadDoctors, if, if, getDayStatus, onStatusChanged, switch|
|`src/app/portals/staff/patient-detail/staff-patient-detail.page.ts`|`StaffPatientDetailPage`|1|empty, error, isLoading, loading, success, toast|if, back, retry, if, setSelectedTab, if, patientDisplayName, if, if, switch|
|`src/app/portals/staff/patients/staff-patients.page.ts`|`StaffPatientsPage`|0|empty, error, isLoading, loading|if, if, if, openDetail, patientDisplayName, patientAccountStatus, if, patientAccountLabel, if, if|
|`src/app/portals/staff/payments/staff-payments.page.ts`|`StaffPaymentsPage`|3|empty, error, isLoading, loading, submitting, success, toast|if, previousPage, if, nextPage, if, openPaymentModal, closePaymentModal, openWaiveModal, closeWaiveModal, confirmPayment|
|`src/app/portals/staff/profile/staff-profile.page.ts`|`StaffProfilePage`|0|error, success, toast|if, currentUser, switch, saveProfile, if, changePassword, if|
|`src/app/portals/staff/walk-in/staff-walk-in.page.ts`|`StaffWalkInPage`|4|empty, error, isLoading, loading, saving, spinner, success, toast|if, if, canAccessStep, switch, isStepComplete, switch, goToStep, trackById, patientDisplayName, if|
|`src/app/shared/components/avatar/avatar.component.ts`|`AvatarComponent`|0|[UNCLEAR]|if, if|
|`src/app/shared/components/banner/banner.component.ts`|`BannerComponent`|0|success|if, switch, onDismiss|
|`src/app/shared/components/booking-print-document/booking-print-document.component.ts`|`BookingPrintDocumentComponent`|0|[UNCLEAR]|if, if, if|
|`src/app/shared/components/booking-timer/booking-timer.component.ts`|`BookingTimerComponent`|0|[UNCLEAR]|constructor, if|
|`src/app/shared/components/confirm-modal/confirm-modal.component.ts`|`ConfirmModalComponent`|0|[UNCLEAR]|cancel, onConfirm|
|`src/app/shared/components/empty-state/empty-state.component.ts`|`EmptyStateComponent`|0|empty|constructor|
|`src/app/shared/components/notification-panel/notification-panel.component.ts`|`NotificationPanelComponent`|2|empty, error|constructor, latestNotifications, markAllRead, if, openNotification, if, iconFor, timeAgo, if, if|
|`src/app/shared/components/page-header/page-header.component.ts`|`PageHeaderComponent`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/shared/components/patient-media-panel/patient-media-panel.component.ts`|`PatientMediaPanelComponent`|4|empty, error, loading, spinner, success, toast|constructor, if, if, if, if, if, if, if, if, if|
|`src/app/shared/components/portal-layout/portal-layout.component.ts`|`PortalLayoutComponent`|1|error|constructor, filter, closeSidebar, toggleSidebar, logout, while|
|`src/app/shared/components/receipt-modal/receipt-modal.component.ts`|`ReceiptModalComponent`|0|[UNCLEAR]|constructor, print, if, if, if|
|`src/app/shared/components/receipt-view/receipt-view.component.ts`|`ReceiptViewComponent`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/shared/components/secure-image/secure-image.component.ts`|`SecureImageComponent`|0|error, loading, spinner|constructor, if, onLoad, onImageRenderError, if, if, if|
|`src/app/shared/components/skeleton/skeleton.component.ts`|`SkeletonComponent`|0|[UNCLEAR]|[UNCLEAR]|
|`src/app/shared/components/slot-grid/slot-grid.component.ts`|`SlotGridComponent`|0|empty, isLoading, loading, toast|onSlotClick, if|
|`src/app/shared/components/status-badge/status-badge.component.ts`|`StatusBadgeComponent`|0|[UNCLEAR]|if, if, if, if, if, if|
|`src/app/shared/pages/not-found/not-found.page.ts`|`NotFoundPage`|0|[UNCLEAR]|[UNCLEAR]|

## 10. Realtime and Push Notifications

- SignalR dependency is present: `@microsoft/signalr`. Environment hub URL points to `http://localhost:5000/hubs/clinic-dashboard` locally.

- Realtime-related files detected: `clinic-dashboard-realtime.service.ts`, `realtime-init.service.ts`, and dashboard/layout consumers. QA must verify connection start, reconnection behavior, and role-specific event updates.

- Firebase dependency and service worker are present: `firebase`, `src/firebase-messaging-sw.js`, `push-notification.service.ts`. QA must verify permission prompt, token registration endpoint, foreground handling, background notification handling, and failure behavior when Firebase keys or browser permission are unavailable.


## 11. Mock Data / Placeholder Risk Register

`useMockData` is false in both environment files, but these mock data files exist and should remain QA watch items:

- `src/app/core/mock-data/mock-announcements.data.ts`
- `src/app/core/mock-data/mock-bookings.data.ts`
- `src/app/core/mock-data/mock-clinic-settings.data.ts`
- `src/app/core/mock-data/mock-doctors.data.ts`
- `src/app/core/mock-data/mock-medical-records.data.ts`
- `src/app/core/mock-data/mock-notifications.data.ts`
- `src/app/core/mock-data/mock-patients.data.ts`
- `src/app/core/mock-data/mock-reports.data.ts`
- `src/app/core/mock-data/mock-reviews.data.ts`
- `src/app/core/mock-data/mock-services.data.ts`
- `src/app/core/mock-data/mock-users.data.ts`
- `src/app/core/services/mock-data.service.ts`

QA rule: any role/page QA that sees data while backend is stopped must inspect whether mock data or fallback data is being used. Do not mark PASS if the feature silently falls back to mock data unless the acceptance criteria explicitly allows it.


## 12. Static Risk Counters

|Risk signal|Count|Samples|
|---|---:|---|
|TODO/FIXME|3|src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:121, src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:318, src/app/core/services/clinic-dashboard-realtime.service.ts:91|
|console usage|66|src/main.ts:26, src/environments/environment.prod.ts:24, src/environments/environment.ts:25, src/environments/environment.ts:35, src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:805, src/app/portals/staff/dashboard/staff-dashboard.page.ts:243, src/app/portals/staff/doctor-status/doctor-status.page.ts:127, src/app/portals/public/components/step-date-picker/step-date-picker.component.ts:158|
|localStorage direct|13|src/app/portals/doctor/consultation/doctor-consultation.page.ts:2633, src/app/portals/doctor/consultation/doctor-consultation.page.ts:2663, src/app/portals/doctor/consultation/doctor-consultation.page.ts:2667, src/app/portals/doctor/consultation/doctor-consultation.page.ts:2671, src/app/portals/doctor/consultation/doctor-consultation.page.ts:2732, src/app/portals/doctor/consultation/doctor-consultation.page.ts:2736, src/app/core/services/auth.service.ts:35, src/app/core/services/auth.service.ts:40|
|Mock data references|78|src/environments/environment.prod.ts:18, src/environments/environment.ts:19, src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts:10, src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts:79, src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts:102, src/app/portals/admin/services/admin-settings.service.ts:4, src/app/portals/admin/services/admin-settings.service.ts:8, src/app/portals/admin/services/admin-settings.service.ts:11|
|any type|322|src/app/app.component.ts:22, src/app/app.component.ts:25, src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:334, src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:682, src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:683, src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:691, src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:692, src/app/shared/components/portal-layout/portal-layout.component.ts:228|
|catchError fallback|138|src/app/shared/components/notification-panel/notification-panel.component.ts:171, src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:700, src/app/shared/components/portal-layout/portal-layout.component.ts:201, src/app/shared/components/portal-layout/portal-layout.component.ts:229, src/app/shared/components/secure-image/secure-image.component.ts:162, src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:610, src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:701, src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:804|
|hardcoded dev credentials|12|src/app/core/mock-data/mock-users.data.ts:17, src/app/core/mock-data/mock-users.data.ts:25, src/app/core/mock-data/mock-users.data.ts:33, src/app/core/mock-data/mock-users.data.ts:41, src/app/core/mock-data/mock-users.data.ts:49, src/app/core/mock-data/mock-users.data.ts:57, src/app/core/mock-data/mock-users.data.ts:65, src/app/auth/login/login.page.html:109|

## 13. Role-Based QA Readiness Requirements

These requirements are included here because the next AI QA agent must test the app like a user, not like a static-code summarizer.


### Admin QA Minimum Evidence

- Login as a real `Admin` account and capture the redirected landing route.

- Visit every `Admin` nav route and every important detail route listed in the route map.

- For every page: record route URL, visible page title, loading behavior ended, empty/error/success state behavior, console errors, failed network calls, and main API response status.

- For every write action: prove request payload, response status/body, visible UI update, and persistence after refresh or re-fetch.

- Test wrong-role access from at least one other role and prove redirect/denial behavior.

- Any item without proof is `UNVERIFIED`, not `PASS`.


### Staff QA Minimum Evidence

- Login as a real `Staff` account and capture the redirected landing route.

- Visit every `Staff` nav route and every important detail route listed in the route map.

- For every page: record route URL, visible page title, loading behavior ended, empty/error/success state behavior, console errors, failed network calls, and main API response status.

- For every write action: prove request payload, response status/body, visible UI update, and persistence after refresh or re-fetch.

- Test wrong-role access from at least one other role and prove redirect/denial behavior.

- Any item without proof is `UNVERIFIED`, not `PASS`.


### Doctor QA Minimum Evidence

- Login as a real `Doctor` account and capture the redirected landing route.

- Visit every `Doctor` nav route and every important detail route listed in the route map.

- For every page: record route URL, visible page title, loading behavior ended, empty/error/success state behavior, console errors, failed network calls, and main API response status.

- For every write action: prove request payload, response status/body, visible UI update, and persistence after refresh or re-fetch.

- Test wrong-role access from at least one other role and prove redirect/denial behavior.

- Any item without proof is `UNVERIFIED`, not `PASS`.


### Patient QA Minimum Evidence

- Login as a real `Patient` account and capture the redirected landing route.

- Visit every `Patient` nav route and every important detail route listed in the route map.

- For every page: record route URL, visible page title, loading behavior ended, empty/error/success state behavior, console errors, failed network calls, and main API response status.

- For every write action: prove request payload, response status/body, visible UI update, and persistence after refresh or re-fetch.

- Test wrong-role access from at least one other role and prove redirect/denial behavior.

- Any item without proof is `UNVERIFIED`, not `PASS`.


## 14. Suggested QA Output Contract for AI Agents

Every QA result file should use this format:

```text
ROLE: <Admin/Staff/Doctor/Patient>
DATE/TIME:
FRONTEND URL:
BACKEND URL:
ACCOUNT USED:

SUMMARY:
PASS: <count>
FAIL: <count>
BLOCKED: <count>
UNVERIFIED: <count>

FOR EACH ROUTE/ACTION:
- Route/action:
- Expected result:
- Actual result:
- Evidence: URL + network request/status + console status + UI observation + refresh/re-fetch proof for writes
- Status: PASS/FAIL/BLOCKED/UNVERIFIED
- Fix recommendation if failed:
```


## 15. Full API Call Line Inventory

|File:line|Method|Endpoint/payload expression|
|---|---|---|
|`src/app/app.component.ts:25`|`GET`|`'settings').pipe(`|
|`src/app/app.config.ts:29`|`GET`|`'auth/me'))`|
|`src/app/shared/components/notification-panel/notification-panel.component.ts:106`|`PUT`|`'notifications/read-all', {}).subscribe({`|
|`src/app/shared/components/notification-panel/notification-panel.component.ts:119`|`PUT`|`\`notifications/${notification.id}/read\`, {}).subscribe({`|
|`src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:613`|`GET`|`bookingFilter ? \`${endpoint}?bookingId=${bookingFilter}\` : endpoint)`|
|`src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:642`|`GET`|`bookingFilter ? \`${endpoint}?bookingId=${bookingFilter}\` : endpoint)`|
|`src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:682`|`GET`|`'bookings').pipe(`|
|`src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:691`|`GET`|`'bookings?page=1&pageSize=100').pipe(`|
|`src/app/shared/components/portal-layout/portal-layout.component.ts:201`|`POST`|`'auth/logout', { refreshToken }).pipe(catchError(() => of(void 0)))`|
|`src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:518`|`PATCH`|`'bookings/' + this.booking.id + '/check-in', {}).subscribe({`|
|`src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:537`|`PATCH`|`'bookings/' + this.booking.id + '/undo-check-in', {}).subscribe({`|
|`src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:595`|`PATCH`|`'payments/' + bookingId + '/confirm', {`|
|`src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:602`|`GET`|`'bookings/' + bookingId).pipe(`|
|`src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:665`|`PATCH`|`'payments/' + this.booking.id + '/waive', { reason: waiveReason }).subscribe({`|
|`src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:686`|`GET`|`'payments/' + paymentId).pipe(`|
|`src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:694`|`GET`|`'bookings/' + bookingId) : of(undefined)).pipe(`|
|`src/app/portals/staff/bookings/staff-bookings.page.ts:264`|`GET`|`'doctors').subscribe({`|
|`src/app/portals/staff/bookings/staff-bookings.page.ts:333`|`PATCH`|`'bookings/' + booking.id + '/check-in', {}).subscribe({`|
|`src/app/portals/staff/bookings/staff-bookings.page.ts:349`|`PATCH`|`'bookings/' + booking.id + '/undo-check-in', {}).subscribe({`|
|`src/app/portals/staff/bookings/staff-bookings.page.ts:401`|`GET`|`'bookings/staff/all?page=' + this.currentPage + '&pageSize=' + this.pageSize).subscribe({`|
|`src/app/portals/staff/dashboard/staff-dashboard.page.ts:201`|`PATCH`|`'bookings/' + event.bookingId + '/check-in', {}).subscribe()`|
|`src/app/portals/staff/dashboard/staff-dashboard.page.ts:204`|`PATCH`|`'bookings/' + event.bookingId + '/undo-check-in', {}).subscribe()`|
|`src/app/portals/staff/doctor-status/doctor-status.page.ts:176`|`POST`|`'doctor-day-status/' + event.doctorId + '/status', {`|
|`src/app/portals/staff/patient-detail/staff-patient-detail.page.ts:192`|`POST`|`'patients/' + this.patient.id + '/portal-account', {`|
|`src/app/portals/staff/payments/staff-payments.page.ts:371`|`PATCH`|`'payments/' + bookingId + '/confirm', {`|
|`src/app/portals/staff/payments/staff-payments.page.ts:421`|`PATCH`|`'payments/' + this.waiveTarget.bookingId + '/waive', { reason: waiveReason }).subscribe({`|
|`src/app/portals/staff/payments/staff-payments.page.ts:477`|`GET`|`'bookings/staff/for-payment?page=' + this.currentPage + '&pageSize=' + safePageSize).pipe(`|
|`src/app/portals/staff/walk-in/staff-walk-in.page.ts:891`|`POST`|`'patients', dto))`|
|`src/app/portals/staff/walk-in/staff-walk-in.page.ts:938`|`POST`|`'bookings/walk-in', {`|
|`src/app/portals/staff/walk-in/staff-walk-in.page.ts:999`|`GET`|`endpoint).pipe(`|
|`src/app/portals/staff/walk-in/staff-walk-in.page.ts:1089`|`GET`|`'services').pipe(`|
|`src/app/portals/public/announcements/announcements.page.ts:44`|`GET`|`'announcements').subscribe((list) => {`|
|`src/app/portals/public/booking/booking.page.ts:45`|`GET`|`'services').pipe(`|
|`src/app/portals/public/booking-confirmation/booking-confirmation.page.ts:156`|`GET`|`'doctors').pipe(`|
|`src/app/portals/public/booking-confirmation/booking-confirmation.page.ts:161`|`GET`|`'services').pipe(`|
|`src/app/portals/public/booking-confirmation/booking-confirmation.page.ts:185`|`GET`|`\`bookings/${bookingId}/public-summary\`).pipe(`|
|`src/app/portals/public/doctor-profile/doctor-profile.page.ts:172`|`GET`|`'doctor-day-status/' + id).pipe(`|
|`src/app/portals/public/doctor-profile/doctor-profile.page.ts:179`|`GET`|`'doctors/' + id),`|
|`src/app/portals/public/doctor-profile/doctor-profile.page.ts:180`|`GET`|`'reviews?doctorId=' + id),`|
|`src/app/portals/public/doctor-profile/doctor-profile.page.ts:181`|`GET`|`'doctors/' + id + '/schedule')`|
|`src/app/portals/public/home/home.page.ts:81`|`GET`|`'doctors')`|
|`src/app/portals/public/home/home.page.ts:82`|`GET`|`'services')`|
|`src/app/portals/public/home/home.page.ts:83`|`GET`|`'announcements')`|
|`src/app/portals/public/home/home.page.ts:84`|`GET`|`'settings')`|
|`src/app/portals/public/components/booking-summary-bar/booking-summary-bar.component.ts:54`|`GET`|`'doctors').pipe(catchError(() => of([]))),`|
|`src/app/portals/public/components/booking-summary-bar/booking-summary-bar.component.ts:56`|`GET`|`'doctors/' + wizard.selectedDoctorId + '/services').pipe(catchError(() => of([])))`|
|`src/app/portals/public/components/public-footer/public-footer.component.ts:93`|`GET`|`'doctors')`|
|`src/app/portals/public/components/step-doctor-service/step-doctor-service.component.ts:297`|`GET`|`'doctors/' + doctorId + '/services').pipe(`|
|`src/app/portals/public/components/step-payment/step-payment.component.ts:94`|`GET`|`'doctors').pipe(catchError(() => of([]))),`|
|`src/app/portals/public/components/step-payment/step-payment.component.ts:96`|`GET`|`'doctors/' + wizard.selectedDoctorId + '/services').pipe(catchError(() => of([])))`|
|`src/app/portals/public/components/step-payment/step-payment.component.ts:182`|`POST`|`'bookings', body))`|
|`src/app/portals/public/components/step-proof/step-proof.component.ts:225`|`POST`|`'bookings', body))`|
|`src/app/portals/public/components/step-proof/step-proof.component.ts:280`|`GET`|`'patients/me'))`|
|`src/app/portals/public/components/step-review/step-review.component.ts:77`|`GET`|`'doctors').pipe(catchError(() => of([]))),`|
|`src/app/portals/public/components/step-review/step-review.component.ts:79`|`GET`|`'doctors/' + wizard.selectedDoctorId + '/services').pipe(catchError(() => of([])))`|
|`src/app/portals/public/components/step-slot-select/step-slot-select.component.ts:242`|`GET`|`'doctors/' + doctorId + '/available-slots?date=' + date).pipe(`|
|`src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:275`|`GET`|`'patients/me').pipe(catchError(() => of(undefined))),`|
|`src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:276`|`GET`|`'bookings/' + bookingId).pipe(map((row) => normalizeBookingRow(row)))`|
|`src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:304`|`PATCH`|`'bookings/' + this.booking.id + '/cancel', { reason: 'Cancelled by patient.' }))`|
|`src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:334`|`GET`|`'payments/' + this.booking.payment.id).pipe(`|
|`src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:342`|`GET`|`'bookings/' + bookingId) : of(undefined)).pipe(`|
|`src/app/portals/patient/bookings/patient-bookings.page.ts:299`|`PATCH`|`'bookings/' + this.bookingToCancel.id + '/cancel', { reason: 'Cancelled by patient.' }))`|
|`src/app/portals/patient/dashboard/patient-dashboard.page.ts:228`|`GET`|`'patients/me').pipe(catchError(() => of(undefined))) : of(undefined)`|
|`src/app/portals/patient/dashboard/patient-dashboard.page.ts:235`|`GET`|`'bookings?page=1&pageSize=100').pipe(`|
|`src/app/portals/patient/dashboard/patient-dashboard.page.ts:305`|`GET`|`'medical-records/consultations?patientId=' + patient.id).pipe(`|
|`src/app/portals/patient/dashboard/patient-dashboard.page.ts:309`|`GET`|`'medical-records/prescriptions?patientId=' + patient.id).pipe(`|
|`src/app/portals/patient/medical-records/patient-medical-records.page.ts:155`|`GET`|`'medical-records/me').subscribe({`|
|`src/app/portals/patient/prescriptions/patient-prescriptions.page.ts:144`|`GET`|`'prescriptions/me').subscribe({`|
|`src/app/portals/patient/reviews/patient-reviews.page.ts:71`|`GET`|`'patients/me').pipe(catchError(() => of(undefined))),`|
|`src/app/portals/patient/reviews/patient-reviews.page.ts:72`|`GET`|`'bookings/' + bookingId).pipe(`|
|`src/app/portals/patient/reviews/patient-reviews.page.ts:92`|`GET`|`'reviews?bookingId=' + bookingId))`|
|`src/app/portals/patient/reviews/patient-reviews.page.ts:115`|`POST`|`'reviews', {`|
|`src/app/portals/patient/components/patient-layout/patient-layout.component.ts:149`|`POST`|`'auth/logout', { refreshToken }).pipe(catchError(() => of(void 0)))`|
|`src/app/portals/doctor/appointment-detail/doctor-appointment-detail.page.ts:203`|`GET`|`'bookings/' + bookingId).pipe(`|
|`src/app/portals/doctor/appointments/doctor-appointments.page.ts:368`|`GET`|`'bookings/doctor/today').pipe(`|
|`src/app/portals/doctor/appointments/doctor-appointments.page.ts:374`|`GET`|`'bookings/doctor/today-summary').pipe(`|
|`src/app/portals/doctor/appointments/doctor-appointments.page.ts:480`|`PATCH`|`'bookings/' + bookingId + '/doctor-complete', payload).pipe(`|
|`src/app/portals/doctor/appointments/doctor-appointments.page.ts:483`|`PATCH`|`'payments/' + bookingId + '/waive', {`|
|`src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts:88`|`GET`|`'bookings/' + bookingId).pipe(`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:727`|`GET`|`'doctors/me').pipe(`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:754`|`GET`|`'audit-logs').pipe(`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:958`|`POST`|`'/consultation-requests/request-attending-physician', {`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:1883`|`POST`|`'audit-logs',`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2748`|`GET`|`'bookings/' + booking.id + '/consultation-record').pipe(`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2775`|`GET`|`'medical-records/consultations?patientId=' + patientId).pipe(`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2779`|`GET`|`'medical-records/prescriptions?patientId=' + patientId).pipe(`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2783`|`GET`|`'medical-records/allergies?patientId=' + patientId).pipe(`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2787`|`GET`|`'medical-records/lab-orders?patientId=' + patientId).pipe(`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2791`|`GET`|`'medical-records/lab-results?patientId=' + patientId).pipe(`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2795`|`GET`|`'medical-records/vaccinations?patientId=' + patientId).pipe(`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2799`|`GET`|`'medical-records/follow-ups?patientId=' + patientId).pipe(`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2820`|`GET`|`'patients/' + patientId).pipe(catchError(() => of(null))),`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2821`|`GET`|`'bookings?patientId=' + patientId + '&pageSize=50').pipe(catchError(() => of([] as Record<string, unknown>[]))),`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2858`|`GET`|`'bookings/' + bookingId + '/consultation-record').pipe(`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2902`|`GET`|`'bookings/' + bookingId).pipe(`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2909`|`POST`|`'bookings/' + bookingId + '/consultation-record', dto).pipe(`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2910`|`GET`|`'bookings/' + bookingId + '/consultation-record')),`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2931`|`PATCH`|`'bookings/' + bookingId + '/doctor-complete', dto).pipe(`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2933`|`PATCH`|`'payments/' + bookingId + '/waive', {`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2938`|`PATCH`|`'bookings/' + bookingId + '/doctor-complete', dto)`|
|`src/app/portals/doctor/consultation/doctor-consultation.page.ts:2941`|`GET`|`'bookings/' + bookingId)),`|
|`src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:253`|`GET`|`'doctors/me').pipe(`|
|`src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:264`|`GET`|`'bookings/doctor/today').pipe(`|
|`src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:269`|`GET`|`'bookings/doctor/today-summary').pipe(`|
|`src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:286`|`GET`|`'doctors/' + doc.id + '/schedule').pipe(`|
|`src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:290`|`GET`|`'doctors/' + doc.id + '/day-status').pipe(`|
|`src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:317`|`POST`|`'doctors/' + this.doctor.id + '/day-status', {`|
|`src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:320`|`GET`|`'patients/' + patientId))`|
|`src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:333`|`GET`|`'bookings?patientId=' + patientId + '&pageSize=50')),`|
|`src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:336`|`GET`|`'medical-records/consultations?patientId=' + patientId).pipe(`|
|`src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:339`|`GET`|`'medical-records/prescriptions?patientId=' + patientId).pipe(`|
|`src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:342`|`GET`|`'medical-records/lab-results?patientId=' + patientId).pipe(`|
|`src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:345`|`GET`|`'medical-records/vaccinations?patientId=' + patientId).pipe(`|
|`src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:348`|`GET`|`'medical-records/follow-ups?patientId=' + patientId).pipe(`|
|`src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:494`|`GET`|`'bookings/' + bookingId + '/consultation-record').pipe(`|
|`src/app/portals/doctor/patients/doctor-patients.page.ts:121`|`GET`|`'bookings/doctor/patients').pipe(`|
|`src/app/portals/doctor/schedule/doctor-schedule.page.ts:98`|`GET`|`'doctors/me').pipe(`|
|`src/app/portals/doctor/schedule/doctor-schedule.page.ts:125`|`GET`|`'doctors/' + doctor.id + '/schedule').pipe(`|
|`src/app/portals/doctor/schedule/doctor-schedule.page.ts:128`|`GET`|`'doctors/' + doctor.id + '/blocked-dates').pipe(`|
|`src/app/portals/doctor/schedule/doctor-schedule.page.ts:166`|`PUT`|`'doctors/' + this.doctorId + '/schedule', {`|
|`src/app/portals/doctor/schedule/doctor-schedule.page.ts:174`|`PUT`|`'doctors/' + this.doctorId, {`|
|`src/app/portals/doctor/schedule/doctor-schedule.page.ts:200`|`POST`|`'doctors/' + this.doctorId + '/blocked-dates', {`|
|`src/app/portals/doctor/schedule/doctor-schedule.page.ts:223`|`DELETE`|`'doctors/' + this.doctorId + '/blocked-dates/' + id).pipe(`|
|`src/app/portals/doctor/components/prescription-builder/prescription-drug-list.ts:3`|`GET`|`'medication_master').select('*')\` when the table exists. */`|
|`src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:437`|`POST`|`'/drug-interactions/allergy-check', {`|
|`src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:480`|`POST`|`'/drug-interactions/check', {`|
|`src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:647`|`POST`|`'/drug-interactions/check', {`|
|`src/app/portals/admin/announcements/announcements.page.ts:114`|`GET`|`'announcements').pipe(takeUntil(this.ngUnsubscribe)).subscribe({`|
|`src/app/portals/admin/announcements/announcements.page.ts:149`|`PUT`|`'announcements/' + this.editingId, { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive })`|
|`src/app/portals/admin/announcements/announcements.page.ts:150`|`POST`|`'announcements', { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive })`|
|`src/app/portals/admin/announcements/announcements.page.ts:165`|`PUT`|`'announcements/' + id, { isActive: newActive }).pipe(takeUntil(this.ngUnsubscribe)).subscribe({`|
|`src/app/portals/admin/announcements/announcements.page.ts:181`|`DELETE`|`'announcements/' + this.deletingId).pipe(takeUntil(this.ngUnsubscribe)).subscribe({`|
|`src/app/portals/admin/audit-logs/audit-logs.page.ts:106`|`GET`|`'audit-logs').subscribe((logs) => {`|
|`src/app/portals/admin/booking-detail/booking-detail.page.ts:266`|`GET`|`'bookings/' + id))`|
|`src/app/portals/admin/booking-detail/booking-detail.page.ts:300`|`GET`|`'patients/' + patientId))`|
|`src/app/portals/admin/booking-detail/booking-detail.page.ts:397`|`PATCH`|`'bookings/' + bookingId + '/confirm', {}))`|
|`src/app/portals/admin/booking-detail/booking-detail.page.ts:401`|`PATCH`|`'bookings/' + bookingId + '/cancel', { reason: reason \|\| 'Rejected by admin' }))`|
|`src/app/portals/admin/booking-detail/booking-detail.page.ts:405`|`PATCH`|`'bookings/' + bookingId + '/confirm', {}))`|
|`src/app/portals/admin/booking-detail/booking-detail.page.ts:409`|`PATCH`|`'bookings/' + bookingId + '/complete', {}))`|
|`src/app/portals/admin/booking-detail/booking-detail.page.ts:413`|`PATCH`|`'bookings/' + bookingId + '/no-show', {}))`|
|`src/app/portals/admin/booking-detail/booking-detail.page.ts:417`|`PATCH`|`'bookings/' + bookingId + '/cancel', { reason: reason \|\| 'Cancelled by admin' }))`|
|`src/app/portals/admin/booking-detail/booking-detail.page.ts:439`|`POST`|`'audit-logs', { entityType: 'Booking', entityId, action, performedBy, details }))`|
|`src/app/portals/admin/booking-detail/booking-detail.page.ts:454`|`PUT`|`'bookings/' + bookingId + '/waive', { reason }))`|
|`src/app/portals/admin/booking-detail/booking-detail.page.ts:475`|`PUT`|`'bookings/' + bookingId + '/refund', { reason }))`|
|`src/app/portals/admin/dashboard/dashboard.page.ts:143`|`GET`|`'bookings?status=CheckedIn&pageSize=1'),`|
|`src/app/portals/admin/dashboard/dashboard.page.ts:144`|`GET`|`'bookings?fromDate=' + encodeURIComponent(monthStart) + '&toDate=' + encodeURIComponent(today) + '&pageSize=1000'),`|
|`src/app/portals/admin/dashboard/dashboard.page.ts:145`|`GET`|`'doctors'),`|
|`src/app/portals/admin/dashboard/dashboard.page.ts:146`|`GET`|`'patients?pageSize=1000'),`|
|`src/app/portals/admin/dashboard/dashboard.page.ts:147`|`GET`|`'services'),`|
|`src/app/portals/admin/doctor-form/doctor-form.page.ts:240`|`GET`|`'doctors/admin').pipe(`|
|`src/app/portals/admin/doctor-form/doctor-form.page.ts:247`|`GET`|`'doctors/' + this.doctorId + '/schedule').pipe(`|
|`src/app/portals/admin/doctor-form/doctor-form.page.ts:322`|`PUT`|`\`doctors/${this.doctorId}\`, updatePayload).pipe(`|
|`src/app/portals/admin/doctor-form/doctor-form.page.ts:325`|`PUT`|`'doctors/' + savedDoctor.id + '/schedule', {`|
|`src/app/portals/admin/doctor-form/doctor-form.page.ts:364`|`POST`|`'doctors', createPayload)`|
|`src/app/portals/admin/doctors/doctors.page.ts:289`|`GET`|`'doctors/' + doctor.id + '/schedule').pipe(`|
|`src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:407`|`PUT`|`'patients/' + this.patient.id, dto).pipe(`|
|`src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:525`|`POST`|`'patients', {`|
|`src/app/portals/admin/patient-detail/patient-detail.page.ts:192`|`GET`|`'patients/' + id).pipe(`|
|`src/app/portals/admin/patient-detail/patient-detail.page.ts:213`|`GET`|`'medical-records/consultations?patientId=' + id).pipe(`|
|`src/app/portals/admin/patient-detail/patient-detail.page.ts:217`|`GET`|`'medical-records/prescriptions?patientId=' + id).pipe(`|
|`src/app/portals/admin/patient-detail/patient-detail.page.ts:221`|`GET`|`'medical-records/allergies?patientId=' + id).pipe(`|
|`src/app/portals/admin/patient-detail/patient-detail.page.ts:225`|`GET`|`'medical-records/lab-results?patientId=' + id).pipe(`|
|`src/app/portals/admin/patient-detail/patient-detail.page.ts:229`|`GET`|`'medical-records/vaccinations?patientId=' + id).pipe(`|
|`src/app/portals/admin/patient-detail/patient-detail.page.ts:233`|`GET`|`'medical-records/follow-ups?patientId=' + id).pipe(`|
|`src/app/portals/admin/patients/admin-patient-create-modal.component.ts:372`|`POST`|`'patients', dto))`|
|`src/app/portals/admin/patients/admin-patient-create-modal.component.ts:443`|`POST`|`'patients', accountPayload))`|
|`src/app/portals/admin/patients/patients.page.ts:231`|`GET`|`endpoint).pipe(`|
|`src/app/portals/admin/reports/reports.page.ts:171`|`GET`|`'reports/unpaid-completed-visits').subscribe((rows) => {`|
|`src/app/portals/admin/reports/reports.page.ts:176`|`GET`|`'reports/pending-follow-ups').subscribe((rows) => {`|
|`src/app/portals/admin/reports/reports.page.ts:181`|`GET`|`'reports/daily-booking-summary').subscribe((rows) => {`|
|`src/app/portals/admin/services/doctor-state.service.ts:167`|`GET`|`'doctors/admin').pipe(`|
|`src/app/portals/admin/services/doctor-state.service.ts:174`|`GET`|`'doctors/' + doctorId + '/day-status').pipe(`|
|`src/app/portals/admin/services/doctor-state.service.ts:191`|`POST`|`'doctors/' + doctorId + '/day-status', {`|
|`src/app/portals/admin/services/services.page.ts:275`|`PUT`|`'services/' + this.editingId, payload).pipe(`|
|`src/app/portals/admin/services/services.page.ts:278`|`POST`|`'services', payload).pipe(`|
|`src/app/portals/admin/services/services.page.ts:308`|`GET`|`'services').pipe(`|
|`src/app/portals/admin/services/services.page.ts:315`|`GET`|`'doctors/admin').pipe(`|
|`src/app/portals/admin/settings/settings.page.ts:324`|`PUT`|`'settings', this.cloneSettings(this.draft)).pipe(`|
|`src/app/portals/admin/staff/staff.page.ts:129`|`GET`|`'admin/staff'))) ?? []`|
|`src/app/portals/admin/staff/staff.page.ts:199`|`POST`|`'admin/staff/invite', payload))`|
|`src/app/portals/admin/staff/staff.page.ts:237`|`PUT`|`'admin/staff/invite/' + inviteId + '/revoke', {}))`|
|`src/app/portals/admin/staff/staff.page.ts:271`|`PUT`|`'admin/staff/' + id + '/update-status', { action }))`|
|`src/app/portals/admin/walk-in/walk-in.page.ts:827`|`POST`|`'patients', dto))`|
|`src/app/portals/admin/walk-in/walk-in.page.ts:878`|`POST`|`'bookings/walk-in', {`|
|`src/app/portals/admin/walk-in/walk-in.page.ts:899`|`GET`|`'doctors').pipe(`|
|`src/app/portals/admin/walk-in/walk-in.page.ts:931`|`GET`|`endpoint).pipe(`|
|`src/app/portals/admin/walk-in/walk-in.page.ts:1002`|`GET`|`'doctors/' + doctorId + '/services').pipe(`|
|`src/app/portals/admin/walk-in/walk-in.page.ts:1005`|`GET`|`'services').pipe(`|
|`src/app/portals/admin/walk-in/walk-in.page.ts:1041`|`GET`|`'doctors/' + doctorId + '/available-slots?date=' + date).pipe(`|
|`src/app/portals/admin/components/medical-records-tab/medical-records-tab.component.ts:211`|`POST`|`'medical-records/allergies', {`|
|`src/app/portals/admin/components/medical-records-tab/medical-records-tab.component.ts:235`|`POST`|`'medical-records/lab-results', {`|
|`src/app/portals/admin/components/medical-records-tab/medical-records-tab.component.ts:259`|`POST`|`'medical-records/vaccinations', {`|
|`src/app/layouts/admin-layout/admin-layout.component.ts:134`|`POST`|`'auth/logout', { refreshToken }).pipe(catchError(() => of(void 0)))`|
|`src/app/layouts/doctor-layout/doctor-layout.component.ts:102`|`POST`|`'auth/logout', { refreshToken }).pipe(catchError(() => of(void 0)))`|
|`src/app/layouts/staff-layout/staff-layout.component.ts:107`|`POST`|`'auth/logout', { refreshToken }).pipe(catchError(() => of(void 0)))`|
|`src/app/core/interceptors/auth.interceptor.ts:59`|`POST`|`'auth/refresh-token', { refreshToken }).pipe(`|
|`src/app/core/services/booking.service.ts:363`|`GET`|`'bookings/staff/today?page=' + page + '&pageSize=' + pageSize).pipe(`|
|`src/app/core/services/booking.service.ts:385`|`GET`|`'bookings/staff/all?page=' + page + '&pageSize=' + pageSize).pipe(`|
|`src/app/core/services/booking.service.ts:407`|`GET`|`'bookings/staff/for-payment?page=' + currentPage + '&pageSize=' + safePageSize).pipe(`|
|`src/app/core/services/booking.service.ts:465`|`GET`|`'bookings').pipe(`|
|`src/app/core/services/booking.service.ts:526`|`POST`|`'bookings', {}).pipe(`|
|`src/app/core/services/booking.service.ts:571`|`GET`|`'bookings/' + id).pipe(`|
|`src/app/core/services/patient-state.service.ts:113`|`GET`|`'patients').subscribe({`|
|`src/app/core/services/patient-state.service.ts:132`|`GET`|`'patients/' + id).pipe(`|
|`src/app/core/services/patient-state.service.ts:138`|`GET`|`'patients?userId=' + userId).pipe(`|
|`src/app/core/services/patient-state.service.ts:148`|`GET`|`'patients?search=' + encodeURIComponent(query)).pipe(`|
|`src/app/core/services/patient-state.service.ts:168`|`PUT`|`\`patients/${patient.id}\`, patient).subscribe({`|
|`src/app/core/services/patient-state.service.ts:174`|`POST`|`\`patients/${patientId}/portal-account\`, { consentVersion }).subscribe({`|
|`src/app/auth/callback/auth-callback.page.ts:86`|`GET`|`'auth/me'))`|
|`src/app/auth/forgot-password/forgot-password.page.ts:54`|`POST`|`'auth/forgot-password', { email: this.submittedEmail }).pipe(`|
|`src/app/auth/reset-password/reset-password.page.ts:57`|`POST`|`'auth/reset-password', {`|

## 16. Route File Sources

- `src/app/app.routes.ts`
- `src/app/auth/auth.routes.ts`
- `src/app/dev/dev.routes.ts`
- `src/app/portals/admin/admin.routes.ts`
- `src/app/portals/doctor/doctor.routes.ts`
- `src/app/portals/patient/patient.routes.ts`
- `src/app/portals/public/public.routes.ts`
- `src/app/portals/staff/staff.routes.ts`

## 17. Model Files

- `src/app/core/models/auth.models.ts`
- `src/app/core/models/booking.models.ts`
- `src/app/core/models/clinic.models.ts`
- `src/app/core/models/doctor-patient-summary.models.ts`
- `src/app/core/models/doctor.models.ts`
- `src/app/core/models/index.ts`
- `src/app/core/models/medical-record.models.ts`
- `src/app/core/models/notification.models.ts`
- `src/app/core/models/patient-clinical-history.models.ts`
- `src/app/core/models/patient-documents.models.ts`
- `src/app/core/models/patient.models.ts`
- `src/app/core/models/vaccination.models.ts`

## 18. Final Notes for Future AI Work

- Use this document for orientation, but use `ROUTE_FEATURE_INVENTORY` for page-by-page route details.

- Use the per-role QA readiness files for actual QA execution.

- Never let an AI agent mark all items PASS without explicit evidence. If it did not open the route, inspect network, inspect console, and verify persistence, the status must be `UNVERIFIED`.

- This scan is frontend-only. Backend contract mismatches require backend repo/API inspection or runtime API calls.

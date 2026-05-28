# MASTER_PROJECT_OVERVIEW

Generated from the uploaded Angular/Ionic frontend source. All statements are derived from files in the zip. Anything not fully defined in frontend code is marked [UNCLEAR] or [TEAM TO VERIFY].

## 1. Project Summary
This project is an Ionic Angular clinic booking and clinic operations frontend. It supports public booking/discovery pages and authenticated Admin, Staff, Doctor, and Patient portals. The app talks to a .NET backend API through a centralized `ApiService`, uses JWT-style access/refresh tokens, and includes Firebase web-push plus SignalR-related configuration/services.

### Tech Stack
|Area|Value|
|---|---|
|Framework|Angular ^17.3.0|
|Mobile/UI framework|@ionic/angular ^7.8.6|
|Language|TypeScript ~5.4.2|
|RxJS|~7.8.0|
|Realtime libs|@microsoft/signalr ^10.0.0; firebase ^10.14.1|
|Package manager|package-lock.json present; npm scripts in package.json. [TEAM TO VERIFY] if npm is canonical over yarn.|
|Build scripts|ng: ng, start: ng serve, build: ng build, watch: ng build --watch --configuration development, test: ng test, prebuild: node scripts/update-version.js|

### Environment Config
#### `src/environments/environment.ts`
|Variable|Value/expression|
|---|---|
|production|false|
|apiUrl|'https://localhost:44384/api'|
|signalrHubUrl|'https://localhost:44384/hubs/clinic-dashboard'|
|apiBaseUrl|'https://localhost:44384/api'|
|googleClientId|'506648259313-uk5965cr6lkfhesivnvej5quu6g6hr1o.apps.googleusercontent.com'|
|facebookAppId|'904138729352506'|
|facebookSdkVersion|'v25.0'|
|useMockData|false|
|siteUrl|''|
|firebaseApiKey|'AIzaSyCVm5aOHRMHAdtMmz832xc0z0hhI-Liwzk'|
|firebaseAuthDomain|'clinic-sup.firebaseapp.com'|
|firebaseProjectId|'clinic-sup'|
|firebaseStorageBucket|'clinic-sup.firebasestorage.app'|
|firebaseMessagingSenderId|'506032600761'|
|firebaseAppId|'1:506032600761:web:98c9a57fe34b4b48f14d68'|
|firebaseMeasurementId|''|
|firebaseVapidKey|'BExXCzlTCn-xp4NBupxcCIpWUroylfgE_Yb3os2MkeZEl2phVDo8HDyx4xQ9pgkxOgGwAsnzVU2c70YiBwkPcqM'|
|vapidKey|'BMJf90oxjKHvMY9J7pRHfpprVCaqoL0few-R-7nWaB6MvUKSFcfqN2e-27U9DHU5LBCeF-EtOMpjZtBT6eEdlwo'|

#### `src/environments/environment.prod.ts`
|Variable|Value/expression|
|---|---|
|production|true|
|apiUrl|'https://api.yourclinicdomain.com/api'|
|signalrHubUrl|'https://api.yourclinicdomain.com/hubs/clinic-dashboard'|
|apiBaseUrl|'https://api.yourclinicdomain.com/api'|
|googleClientId|''|
|facebookAppId|''|
|facebookSdkVersion|'v25.0'|
|useMockData|false|
|siteUrl|'https://clinic-sup.vercel.app'|
|firebaseApiKey|'AIzaSyCVm5aOHRMHAdtMmz832xc0z0hhI-Liwzk'|
|firebaseAuthDomain|'clinic-sup.firebaseapp.com'|
|firebaseProjectId|'clinic-sup'|
|firebaseStorageBucket|'clinic-sup.firebasestorage.app'|
|firebaseMessagingSenderId|'506032600761'|
|firebaseAppId|'1:506032600761:web:98c9a57fe34b4b48f14d68'|
|firebaseMeasurementId|''|
|firebaseVapidKey|'BExXCzlTCn-xp4NBupxcCIpWUroylfgE_Yb3os2MkeZEl2phVDo8HDyx4xQ9pgkxOgGwAsnzVU2c70YiBwkPcqM'|
|vapidKey|'BMJf90oxjKHvMY9J7pRHfpprVCaqoL0few-R-7nWaB6MvUKSFcfqN2e-27U9DHU5LBCeF-EtOMpjZtBT6eEdlwo'|

Feature flag detected: `useMockData: false` in both environment files. Mock services/files still exist in source. [TEAM TO VERIFY] whether any runtime path still uses them.

## 2. Project Structure
|Folder|Purpose|
|---|---|
|src/app/auth|Authentication pages/routes/components.|
|src/app/auth/callback|Authentication pages/routes/components.|
|src/app/auth/components|Authentication pages/routes/components.|
|src/app/auth/components/auth-layout|Authentication pages/routes/components.|
|src/app/auth/forgot-password|Authentication pages/routes/components.|
|src/app/auth/login|Authentication pages/routes/components.|
|src/app/auth/privacy-consent|Authentication pages/routes/components.|
|src/app/auth/register|Authentication pages/routes/components.|
|src/app/auth/reset-password|Authentication pages/routes/components.|
|src/app/auth/set-password|Authentication pages/routes/components.|
|src/app/core|[TEAM TO VERIFY] Folder purpose inferred from name.|
|src/app/core/base|[TEAM TO VERIFY] Folder purpose inferred from name.|
|src/app/core/guards|Angular route guards.|
|src/app/core/interceptors|[TEAM TO VERIFY] Folder purpose inferred from name.|
|src/app/core/mock-data|[TEAM TO VERIFY] Folder purpose inferred from name.|
|src/app/core/models|Shared TypeScript DTO/model definitions.|
|src/app/core/services|Core singleton services, API wrappers, auth state, domain data services.|
|src/app/core/utils|[TEAM TO VERIFY] Folder purpose inferred from name.|
|src/app/dev|Development design-system gallery route.|
|src/app/dev/design-system-gallery|Development design-system gallery route.|
|src/app/layouts|Legacy/alternate portal layout components.|
|src/app/layouts/admin-layout|Legacy/alternate portal layout components.|
|src/app/layouts/doctor-layout|Legacy/alternate portal layout components.|
|src/app/layouts/public-layout|Legacy/alternate portal layout components.|
|src/app/layouts/staff-layout|Legacy/alternate portal layout components.|
|src/app/portals|[TEAM TO VERIFY] Folder purpose inferred from name.|
|src/app/portals/admin|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/announcements|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/audit-logs|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/booking-detail|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/bookings|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/calendar|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/components|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/components/booking-actions-menu|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/components/color-picker|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/components/consultation-timeline|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/components/doctor-schedule-form|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/components/medical-records-tab|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/components/notification-bell|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/components/operating-hours-editor|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/components/refund-payment-modal|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/components/sidebar|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/components/stat-card|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/components/today-appointments-table|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/components/topbar|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/components/waive-payment-modal|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/dashboard|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/doctor-form|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/doctors|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/patient-detail|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/patients|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/reports|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/services|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/settings|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/staff|Admin portal routes, pages, services, and components.|
|src/app/portals/admin/walk-in|Admin portal routes, pages, services, and components.|
|src/app/portals/doctor|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/appointment-detail|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/appointments|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components/allergy-warning-banner|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components/diagnosis-picker|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components/doctor-appointment-card|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components/doctor-patient-card|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components/doctor-queue-table|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components/doctor-schedule-editor|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components/doctor-status-panel|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components/follow-up-form|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components/lab-request-form|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components/prescription-builder|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components/prescription-form|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components/soap-form|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components/vaccination-form|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components/vital-signs-form|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/components/vitals-trend-chart|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/consultation|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/consultation/components|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/dashboard|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/patient-detail|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/patients|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/profile|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/schedule|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/doctor/services|Doctor portal routes, pages, consultation components, and clinical UI.|
|src/app/portals/patient|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/booking-detail|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/bookings|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/components|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/components/booking-timeline|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/components/medical-record-card|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/components/patient-booking-card|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/components/patient-layout|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/components/patient-topbar|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/components/prescription-card|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/components/proof-submission-form|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/components/review-form|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/components/upcoming-appointment-card|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/dashboard|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/doctors|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/documents|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/lab-results|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/labs-redirect|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/medical-records|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/prescriptions|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/privacy-consent|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/profile|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/reviews|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/services|Patient portal routes, pages, and layout/components.|
|src/app/portals/patient/vaccinations|Patient portal routes, pages, and layout/components.|
|src/app/portals/public|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/announcements|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/booking|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/booking-confirmation|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/announcement-card|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/booking-summary-bar|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/booking-wizard|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/doctor-card|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/hero-section|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/operating-hours-bar|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/public-footer|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/public-layout|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/public-navbar|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/review-card|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/service-category-card|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/step-auth-check|Authentication pages/routes/components.|
|src/app/portals/public/components/step-date-picker|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/step-doctor-service|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/step-payment|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/step-proof|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/step-review|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/components/step-slot-select|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/doctor-profile|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/doctors|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/home|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/privacy-policy|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/services|Public marketing, discovery, and booking pages/components.|
|src/app/portals/public/utils|Public marketing, discovery, and booking pages/components.|
|src/app/portals/staff|Staff portal routes, pages, and components.|
|src/app/portals/staff/booking-detail|Staff portal routes, pages, and components.|
|src/app/portals/staff/bookings|Staff portal routes, pages, and components.|
|src/app/portals/staff/components|Staff portal routes, pages, and components.|
|src/app/portals/staff/components/doctor-status-card|Staff portal routes, pages, and components.|
|src/app/portals/staff/components/queue-table|Staff portal routes, pages, and components.|
|src/app/portals/staff/dashboard|Staff portal routes, pages, and components.|
|src/app/portals/staff/doctor-status|Staff portal routes, pages, and components.|
|src/app/portals/staff/patient-detail|Staff portal routes, pages, and components.|
|src/app/portals/staff/patients|Staff portal routes, pages, and components.|
|src/app/portals/staff/payments|Staff portal routes, pages, and components.|
|src/app/portals/staff/profile|Staff portal routes, pages, and components.|
|src/app/portals/staff/services|Staff portal routes, pages, and components.|
|src/app/portals/staff/walk-in|Staff portal routes, pages, and components.|
|src/app/shared|Shared UI components/pages used across portals.|
|src/app/shared/components|Shared UI components/pages used across portals.|
|src/app/shared/components/avatar|Shared UI components/pages used across portals.|
|src/app/shared/components/banner|Shared UI components/pages used across portals.|
|src/app/shared/components/booking-print-document|Shared UI components/pages used across portals.|
|src/app/shared/components/booking-timer|Shared UI components/pages used across portals.|
|src/app/shared/components/confirm-modal|Shared UI components/pages used across portals.|
|src/app/shared/components/empty-state|Shared UI components/pages used across portals.|
|src/app/shared/components/notification-panel|Shared UI components/pages used across portals.|
|src/app/shared/components/page-header|Shared UI components/pages used across portals.|
|src/app/shared/components/patient-media-panel|Shared UI components/pages used across portals.|
|src/app/shared/components/portal-layout|Shared UI components/pages used across portals.|
|src/app/shared/components/receipt-modal|Shared UI components/pages used across portals.|
|src/app/shared/components/receipt-view|Shared UI components/pages used across portals.|
|src/app/shared/components/secure-image|Shared UI components/pages used across portals.|
|src/app/shared/components/skeleton|Shared UI components/pages used across portals.|
|src/app/shared/components/slot-grid|Shared UI components/pages used across portals.|
|src/app/shared/components/status-badge|Shared UI components/pages used across portals.|
|src/app/shared/pages|Shared UI components/pages used across portals.|
|src/app/shared/pages/not-found|Shared UI components/pages used across portals.|
|src/app/shared/pipes|Shared UI components/pages used across portals.|
|src/app/shared/validators|Shared UI components/pages used across portals.|

- Routes are defined in `src/app/app.routes.ts`, `src/app/auth/auth.routes.ts`, `src/app/portals/*/*.routes.ts`, and `src/app/dev/dev.routes.ts`.
- Central API wrapper is `src/app/core/services/api.service.ts`; many route components still inject/use `ApiService` directly.
- Auth state lives in `src/app/core/services/auth-state.service.ts` using `BehaviorSubject` and Angular signals via `toSignal`.
- Constants/enums/models live primarily under `src/app/core/models/` plus route nav constants in each portal route file.

## 3. Auth Flow

### Login
- Page: `src/app/auth/login/login.page.ts` + `login.page.html`.
- Form: `loginForm` with controls `email` and `password`; validators detected: `Validators.required`, `Validators.email`.
- Submit: `onLogin()` calls `POST auth/login` with `{ email: email.trim(), password }`.
- Success: stores tokens through `AuthService.storeTokens`, maps DTO to `AuthUser`, updates `AuthStateService`, then calls `AuthService.navigateByRole`.
- Error: maps HTTP/message/validation errors via `extractApiErrorMessage`, sets AuthStateService error, and stops loading.

### Social Login
- Google: `onGoogleLogin()` loads Google Identity script, obtains Google token, calls `POST auth/google` with `{ provider: "Google", idToken, accessToken }`.
- Facebook: `onFacebookLogin()` loads Facebook SDK, calls `POST auth/facebook` with `{ accessToken, userId }`.

### Token Storage
- `TokenService` stores access token under `clinic.auth.access-token` and refresh token under `clinic.auth.refresh-token` in `localStorage`.
- `AuthService.persistUser` stores the mapped user as JSON under `clinic.auth.user`.
- `AuthStateService.logout` clears BehaviorSubjects and delegates token/user clearing to `AuthService.clearSession`.

### Role Resolution and Redirects
|Resolved user state|Navigation target|
|---|---|
|Admin|/admin/dashboard|
|Staff|/staff/dashboard|
|Doctor|/doctor/dashboard|
|Patient|/patient/dashboard|
|isFirstLogin true|/auth/set-password|
|Unknown role|/auth/login|

### Session Initialization and Expiry
- `APP_INITIALIZER` in `src/app/app.config.ts` checks stored tokens on app boot. If any token exists, it calls `GET auth/me`; on success sets current user; on failure logs out.
- `authInterceptor` attaches `Authorization: Bearer <accessToken>` to non-public auth endpoints. On 401 it calls `POST auth/refresh-token` with `{ refreshToken }`, stores the new tokens, retries once, or clears session and navigates `/auth/login`.
- No explicit auto-logout warning UI was found. [UNCLEAR]

## 4. Role Definitions
- Role values detected in `AuthService.normalizeRole`: `Admin`, `Staff`, `Doctor`, `Patient`.
- Route enforcement uses `data.roles` in route definitions and `roleGuard`.
- API-level authorization cannot be determined from frontend code. [TEAM TO VERIFY]

### Permission Matrix From Route Definitions
|Role bucket|Accessible frontend routes|
|---|---|
|Public/Guest|/public<br>/public/doctors<br>/public/doctors/:id<br>/public/services<br>/public/announcements<br>/public/booking<br>/public/booking-confirmation/:bookingId<br>/public/privacy-policy|
|Auth/Public|/auth/login<br>/auth/register<br>/auth/callback<br>/auth/forgot-password<br>/auth/reset-password|
|Patient/Auth|/auth/set-password<br>/auth/privacy-consent|
|Admin|/admin/dashboard<br>/admin/bookings<br>/admin/bookings/:id<br>/admin/walk-in<br>/admin/calendar<br>/admin/doctors<br>/admin/doctors/new<br>/admin/doctors/:id/edit<br>/admin/services<br>/admin/patients<br>/admin/patients/:id<br>/admin/staff<br>/admin/announcements<br>/admin/settings<br>/admin/audit-logs<br>/admin/reports|
|Staff|/staff/dashboard<br>/staff/bookings<br>/staff/payments<br>/staff/bookings/:id<br>/staff/walk-in<br>/staff/patients<br>/staff/patients/:id<br>/staff/doctor-status<br>/staff/profile|
|Doctor|/doctor/dashboard<br>/doctor/appointments<br>/doctor/appointments/:id<br>/doctor/patients<br>/doctor/patients/:id<br>/doctor/schedule<br>/doctor/consultation/:bookingId<br>/doctor/my-profile<br>/doctor/profile|
|Patient|/patient/dashboard<br>/patient/doctors<br>/patient/bookings<br>/patient/documents<br>/patient/lab-results<br>/patient/labs<br>/patient/bookings/:id<br>/patient/medical-records<br>/patient/prescriptions<br>/patient/vaccinations<br>/patient/profile<br>/patient/reviews/:bookingId<br>/patient/privacy-consent|
|Dev/Public|/dev/gallery|

## 5. Full Route Map
|Role|URL|Component file|Class|Parent layout|Guard|
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

## 6. Cross-Role User Flows
### Registration
Step 1 — Public/Auth on `/auth/register` — `src/app/auth/register/register.page.ts`: fills registration form → calls backend registration endpoint detected in component/API scan → on success stores auth/session or navigates based on code. [TEAM TO VERIFY exact success path from runtime].

### Login
Step 1 — Public/Auth on `/auth/login` — `login.page.ts`: submits email/password → `POST auth/login` with `{ email, password }` → stores access/refresh tokens → resolves role → navigates to role dashboard.

### App resume
Step 1 — App initializer — `app.config.ts`: stored token exists → `GET auth/me` → maps user → guards allow portal routes; failure clears session.

### Public booking
Step 1 — Guest on `/public/booking` — booking wizard loads services/doctors/slots through public booking components → calls endpoints such as `GET services`, `GET doctors/{id}/services`, `GET doctors/{id}/available-slots?date=...`, `POST bookings`, `GET bookings/{id}` → on success navigates/backs to confirmation flow.

### Staff booking handling
Step 1 — Staff on `/staff/bookings` or `/staff/bookings/:id`: loads bookings → can check in/undo check-in through `PATCH bookings/{id}/check-in` or `PATCH bookings/{id}/undo-check-in` → booking state updates.

### Doctor completion/payment
Step 1 — Doctor on `/doctor/appointments` or `/doctor/consultation/:bookingId`: loads today appointments and booking detail → completes consultation via doctor completion/consultation endpoints → optionally waives or posts payment-related calls.

### Payment collection
Step 1 — Staff on `/staff/payments`: loads for-payment bookings via `GET bookings/staff/for-payment?page=...&pageSize=...` → confirms payment via `PATCH payments/{bookingId}/confirm` or waives via `PATCH payments/{bookingId}/waive`.

### Patient records
Step 1 — Patient on medical-record/document routes: loads patient-specific documents/records/prescriptions/labs via `patient-documents/me/...` and medical endpoints → downloads PDFs/files through `getBlob` calls.

## 7. All API Endpoints Called by Frontend
Base URL: `ApiService` reads `(environment.apiUrl || environment.apiBaseUrl || "").replace(/\/+$/, "")`, then appends endpoint path.

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

### Direct HTTP Call Compliance
No direct `HttpClient` or `fetch()` use was detected outside `ApiService` by regex scan. `ApiService` itself wraps Angular `HttpClient`.

## 8. State Management
|Service/store|File|Key methods detected|Mock use|
|---|---|---|---|
|AuthStateService|src/app/core/services/auth-state.service.ts|setLoading, setError, clearError, setUser, patchUser, logout, ensurePatientRecord, clearState, clearUser, hasRole|No mock use detected by scan|
|BookingWizardService|src/app/core/services/booking-wizard.service.ts|patchState, selectDoctor, selectService, toggleService, setSelectedServices, selectDate, selectSlot, selectPaymentMode, nextStep, prevStep, setStep, reset|No mock use detected by scan|
|ClinicSettingsService|src/app/core/services/clinic-settings.service.ts|load, setSettings, bumpConsentVersion, defaultSettings|No mock use detected by scan|
|DoctorStateService|src/app/core/services/doctor-state.service.ts|getDoctors, getDoctorByUserId, getDoctorDayStatus, setDoctors, setLoading, setTodayStatus, setDayStatuses, mergeDayStatus, normalizeDoctorRows, normalizeDoctorRow, normalizeDoctorDayStatusRow, readValue, readNumber|No mock use detected by scan|
|NotificationService|src/app/core/services/notification.service.ts|setNotifications, replaceNotifications, markRead, markAllRead, markReadLocal, markAllReadLocal, refresh, sortNotifications|No mock use detected by scan|
|OfflineConsultationQueueService|src/app/core/services/offline-consultation-queue.service.ts|enqueue, getLatest, listPending, clear, openDb|No mock use detected by scan|
|PatientStateService|src/app/core/services/patient-state.service.ts|refresh, getPatients, getPatientById, getPatientByUserId, getFilteredPatients, addPatient, savePatient, updatePatientConsent, upsert|No mock use detected by scan|
|PushNotificationService|src/app/core/services/push-notification.service.ts|subscribeToNotifications, registerDevice, markRead, markAllRead, cleanup, recalculateUnreadCount, registerForegroundMessageHandler, ensureFirebaseApp, buildFirebaseServiceWorkerUrl, getFirebaseConfig|No mock use detected by scan|
|AdminSettingsService|src/app/portals/admin/services/admin-settings.service.ts|getSettings, updateSettings, bumpConsentVersion|Uses MockDataService|
|DoctorStateService|src/app/portals/admin/services/doctor-state.service.ts|refresh, getDoctors, getDoctorById, getDoctorByUserId, getDoctorSchedules, getDoctorDayStatus, loadDoctorsFromApi, loadSingleDayStatus, updateDayStatusViaApi, addDoctor, updateDoctor, setDoctorStatus, setDoctorDayStatus, addBlockedDate, removeBlockedDate, fetchAllDoctorsObservable, fetchDayStatusObservable, upsertDayStatus$|No mock use detected by scan|

- Primary auth state pattern: `BehaviorSubject` fields in `AuthStateService`, exposed as Observables and signals.
- Persisted keys: `clinic.auth.access-token`, `clinic.auth.refresh-token`, `clinic.auth.user`.
- Booking wizard state is in `BookingWizardService`; details should be read directly from `src/app/core/services/booking-wizard.service.ts` when modifying booking flow.

## 9. Key Reusable Components
|Component|Selector|File|@Input detected|@Output detected|Injected deps|
|---|---|---|---|---|---|
|AuthLayoutComponent|app-auth-layout|src/app/auth/components/auth-layout/auth-layout.component.ts|-|-|-|
|AdminLayoutComponent|app-admin-layout|src/app/layouts/admin-layout/admin-layout.component.ts|-|-|ActivatedRoute, ApiService, AuthStateService, BookingService, ClinicSettingsService, DestroyRef, NotificationService, RealtimeInitService, Router, TokenService|
|DoctorLayoutComponent|app-doctor-layout|src/app/layouts/doctor-layout/doctor-layout.component.ts|-|-|ActivatedRoute, ApiService, AuthStateService, ClinicSettingsService, DestroyRef, NotificationService, RealtimeInitService, Router, TokenService|
|LegacyPublicLayoutComponent|app-legacy-public-layout|src/app/layouts/public-layout/public-layout.component.ts|-|-|-|
|StaffLayoutComponent|app-staff-layout|src/app/layouts/staff-layout/staff-layout.component.ts|-|-|ActivatedRoute, ApiService, AuthStateService, ClinicSettingsService, DestroyRef, NotificationService, RealtimeInitService, Router, TokenService|
|BookingActionsMenuComponent|app-booking-actions-menu|src/app/portals/admin/components/booking-actions-menu/booking-actions-menu.component.ts|actions|actionSelected|-|
|ColorPickerComponent|app-color-picker|src/app/portals/admin/components/color-picker/color-picker.component.ts|label, value|valueChange|-|
|ConsultationTimelineComponent|app-consultation-timeline|src/app/portals/admin/components/consultation-timeline/consultation-timeline.component.ts|consultations|-|-|
|DoctorScheduleFormComponent|app-doctor-schedule-form|src/app/portals/admin/components/doctor-schedule-form/doctor-schedule-form.component.ts|value|valueChange|-|
|MedicalRecordsTabComponent|app-medical-records-tab|src/app/portals/admin/components/medical-records-tab/medical-records-tab.component.ts|patientId, consultations, prescriptions, allergies, labResults, vaccinations, followUps|-|FormBuilder|
|NotificationBellComponent|app-notification-bell|src/app/portals/admin/components/notification-bell/notification-bell.component.ts|unreadCount|-|-|
|OperatingHoursEditorComponent|app-operating-hours-editor|src/app/portals/admin/components/operating-hours-editor/operating-hours-editor.component.ts|d|hoursChange|-|
|RefundPaymentModalComponent|app-refund-payment-modal|src/app/portals/admin/components/refund-payment-modal/refund-payment-modal.component.ts|paymentId, isOpen|confirmed, cancelled|-|
|SidebarComponent|app-admin-sidebar|src/app/portals/admin/components/sidebar/sidebar.component.ts|navItems, portalLabel, clinicName, currentUser, isOpen|logout, navClick, menuToggle|Router|
|StatCardComponent|app-stat-card|src/app/portals/admin/components/stat-card/stat-card.component.ts|label, value, icon, color, badgeLabel|-|-|
|TodayAppointmentsTableComponent|app-today-appointments-table|src/app/portals/admin/components/today-appointments-table/today-appointments-table.component.ts|bookings, doctors, patients, services, isLoading, actions|rowClicked, action|-|
|TopbarComponent|app-admin-topbar|src/app/portals/admin/components/topbar/topbar.component.ts|title, portalLabel, currentUser, unreadCount|logout, menuToggle|Router|
|WaivePaymentModalComponent|app-waive-payment-modal|src/app/portals/admin/components/waive-payment-modal/waive-payment-modal.component.ts|paymentId, isOpen|confirmed, cancelled|-|
|AllergyWarningBannerComponent|app-allergy-warning-banner|src/app/portals/doctor/components/allergy-warning-banner/allergy-warning-banner.component.ts|allergies, prescriptionItems|-|-|
|DiagnosisPickerComponent|app-diagnosis-picker|src/app/portals/doctor/components/diagnosis-picker/diagnosis-picker.component.ts|value, auditText, locked, validationRequested|diagnosesChange, validityChange|DestroyRef, FormBuilder|
|DoctorAppointmentCardComponent|app-doctor-appointment-card|src/app/portals/doctor/components/doctor-appointment-card/doctor-appointment-card.component.ts|d, patientName, patientCode, serviceName|openBooking, startConsultation|-|
|DoctorPatientCardComponent|app-doctor-patient-card|src/app/portals/doctor/components/doctor-patient-card/doctor-patient-card.component.ts|d, lastVisit, upcomingAppointmentsCount|viewPatient|-|
|DoctorQueueTableComponent|app-doctor-queue-table|src/app/portals/doctor/components/doctor-queue-table/doctor-queue-table.component.ts|bookings, patients, services|openBooking, startConsultation, markComplete, markNoShow|-|
|DoctorScheduleEditorComponent|app-doctor-schedule-editor|src/app/portals/doctor/components/doctor-schedule-editor/doctor-schedule-editor.component.ts|schedules, blockedDates, previewSlots, previewDate, isSaving, dailyPatientLimit, previewDayIsActive, previewDayHasSlots, previewDayIsBlocked|schedulesSaved, blockedDateAdded, blockedDateRemoved, previewDateChanged, dirtyChanged|-|
|DoctorStatusPanelComponent|app-doctor-status-panel|src/app/portals/doctor/components/doctor-status-panel/doctor-status-panel.component.ts|d, status|statusChanged|-|
|FollowUpFormComponent|app-follow-up-form|src/app/portals/doctor/components/follow-up-form/follow-up-form.component.ts|value, locked|followUpChange|DestroyRef, FormBuilder|
|LabRequestFormComponent|app-lab-request-form|src/app/portals/doctor/components/lab-request-form/lab-request-form.component.ts|value, auditText, locked, actionMode|requestsChange, requestAttendingPhysician|DestroyRef, FormBuilder|
|MedicationPickerModalComponent|app-medication-picker-modal|src/app/portals/doctor/components/prescription-builder/medication-picker-modal.component.ts|title|-|ChangeDetectorRef, ModalController|
|PrescriptionBuilderComponent|app-prescription-builder|src/app/portals/doctor/components/prescription-builder/prescription-builder.component.ts|items, locked|itemsChange|DestroyRef, FormBuilder, ModalController|
|PrescriptionFormComponent|app-prescription-form|src/app/portals/doctor/components/prescription-form/prescription-form.component.ts|items, allergies, auditText, locked, actionMode|itemsChange, requestAttendingPhysician|ApiService, DrugInteractionService, FormBuilder|
|SoapFormComponent|app-soap-form|src/app/portals/doctor/components/soap-form/soap-form.component.ts|value, lastVisitSoap, auditText, locked, validationRequested|soapChange, validityChange, loadFromLastVisit|DestroyRef, FormBuilder|
|VaccinationFormComponent|app-vaccination-form|src/app/portals/doctor/components/vaccination-form/vaccination-form.component.ts|locked, canEdit, auditText, existingVaccinations, draftVaccinations|vaccinationsAdded|-|
|VitalSignsFormComponent|app-vital-signs-form|src/app/portals/doctor/components/vital-signs-form/vital-signs-form.component.ts|value, locked, validationRequested|vitalSignsChange, validityChange|DestroyRef, FormBuilder|
|VitalsTrendChartComponent|app-vitals-trend-chart|src/app/portals/doctor/components/vitals-trend-chart/vitals-trend-chart.component.ts|consultations|-|-|
|AllergyBadgeComponent|app-allergy-badge|src/app/portals/doctor/consultation/components/allergy-badge.component.ts|allergies, confirmationState|-|-|
|ConsultationCompleteModalComponent|app-consultation-complete-modal|src/app/portals/doctor/consultation/components/consultation-complete-modal.component.ts|patientName, patientDob, patientMrn, visitDateTime, checklistItems, summaryLines, submitHandler|-|ModalController|
|ConsultationHeaderComponent|app-consultation-header|src/app/portals/doctor/consultation/components/consultation-header.component.ts|d, d, locked, mode, saveDisabled, completeDisabled, amendDisabled, isSavingDraft, isCompleting, isSavingAmendment|saveDraft, completeTransaction, enterAmendMode, cancelAmendMode, saveAmendment|-|
|ConsultationOverviewComponent|app-consultation-overview|src/app/portals/doctor/consultation/components/consultation-overview.component.ts|d, consultation, existingPrescription, allergies, followUps, recentConsultations|-|-|
|ConsultationSummaryComponent|app-consultation-summary|src/app/portals/doctor/consultation/components/consultation-summary.component.ts|d|-|-|
|ConsultationWorkspaceComponent|app-consultation-workspace|src/app/portals/doctor/consultation/components/consultation-workspace.component.ts|d, locked, prescriptionItems, professionalFee, professionalFeePaymentMode, professionalFeeNotes, pendingVaccinations, clinicalRole, validationRequested|vitalSignsChange, vitalsValidityChange, soapChange, soapValidityChange, diagnosesChange, diagnosisValidityChange, prescriptionItemsChange, labRequestsChange, followUpChange, professionalFeeChange, professionalFeePaymentModeChange, professionalFeeNotesChange, professionalFeeValidityChange, vaccinationsAdded, loadFromLastVisit, requestPrescription, requestLabOrder|-|
|PatientClinicalHistoryDrawerComponent|app-patient-clinical-history-drawer|src/app/portals/doctor/consultation/components/patient-clinical-history-drawer.component.ts|isOpen, patientName, history|close|-|
|PatientIdentityStripComponent|app-patient-identity-strip|src/app/portals/doctor/consultation/components/patient-identity-strip.component.ts|d, d, allergies, allergyConfirmationState, expanded|historyClick|-|
|ProfessionalFeeDecisionFormComponent|app-professional-fee-decision-form|src/app/portals/doctor/consultation/components/professional-fee-decision-form.component.ts|currentConsultationFee, professionalFee, paymentMode, notes, locked, visible|professionalFeeChange, paymentModeChange, notesChange, validityChange|DestroyRef, FormBuilder|
|SoapLastVisitModalComponent|app-soap-last-visit-modal|src/app/portals/doctor/consultation/components/soap-last-visit-modal.component.ts|soap|-|FormBuilder, ModalController|
|BookingTimelineComponent|app-booking-timeline|src/app/portals/patient/components/booking-timeline/booking-timeline.component.ts|d|-|-|
|MedicalRecordCardComponent|app-medical-record-card|src/app/portals/patient/components/medical-record-card/medical-record-card.component.ts|d, doctor|viewDetails|-|
|PatientBookingCardComponent|app-patient-booking-card|src/app/portals/patient/components/patient-booking-card/patient-booking-card.component.ts|d, doctor, service, canSubmitProof, canCancel|viewDetails, submitProof, cancelBooking|-|
|PatientLayoutComponent|app-patient-layout|src/app/portals/patient/components/patient-layout/patient-layout.component.ts|-|-|ActivatedRoute, ApiService, AuthStateService, ClinicSettingsService, DestroyRef, NotificationService, Router, ToastController, TokenService|
|PatientTopbarComponent|app-patient-topbar|src/app/portals/patient/components/patient-topbar/patient-topbar.component.ts|navItems, currentUser, clinicName, portalLabel|logout|-|
|PrescriptionCardComponent|app-prescription-card|src/app/portals/patient/components/prescription-card/prescription-card.component.ts|d, doctor|download|-|
|ProofSubmissionFormComponent|app-proof-submission-form|src/app/portals/patient/components/proof-submission-form/proof-submission-form.component.ts|d, isSubmitting|proofSubmitted|-|
|ReviewFormComponent|app-review-form|src/app/portals/patient/components/review-form/review-form.component.ts|disabled|submitted|-|
|UpcomingAppointmentCardComponent|app-upcoming-appointment-card|src/app/portals/patient/components/upcoming-appointment-card/upcoming-appointment-card.component.ts|d, doctor, service, canSubmitProof, canCancel|viewDetails, submitProof, cancelBooking|-|
|AnnouncementCardComponent|app-announcement-card|src/app/portals/public/components/announcement-card/announcement-card.component.ts|d|-|-|
|BookingSummaryBarComponent|app-booking-summary-bar|src/app/portals/public/components/booking-summary-bar/booking-summary-bar.component.ts|-|-|ApiService, BookingWizardService|
|BookingWizardComponent|app-booking-wizard|src/app/portals/public/components/booking-wizard/booking-wizard.component.ts|-|-|BookingWizardService|
|DoctorCardComponent|app-doctor-card|src/app/portals/public/components/doctor-card/doctor-card.component.ts|d|-|-|
|HeroSectionComponent|app-hero-section|src/app/portals/public/components/hero-section/hero-section.component.ts|-|-|-|
|OperatingHoursBarComponent|app-operating-hours-bar|src/app/portals/public/components/operating-hours-bar/operating-hours-bar.component.ts|settings|-|-|
|PublicFooterComponent|app-public-footer|src/app/portals/public/components/public-footer/public-footer.component.ts|-|-|ApiService, ClinicSettingsService|
|PublicLayoutComponent|app-public-layout|src/app/portals/public/components/public-layout/public-layout.component.ts|-|-|-|
|PublicNavbarComponent|app-public-navbar|src/app/portals/public/components/public-navbar/public-navbar.component.ts|mainScrollTop|-|ClinicSettingsService|
|ReviewCardComponent|app-review-card|src/app/portals/public/components/review-card/review-card.component.ts|d|-|-|
|ServiceCategoryCardComponent|app-service-category-card|src/app/portals/public/components/service-category-card/service-category-card.component.ts|d, d, d|selected|-|
|StepAuthCheckComponent|app-step-auth-check|src/app/portals/public/components/step-auth-check/step-auth-check.component.ts|-|-|AuthStateService, BookingWizardService|
|StepDatePickerComponent|app-step-date-picker|src/app/portals/public/components/step-date-picker/step-date-picker.component.ts|-|-|ApiService, BookingAvailabilityService, BookingWizardService, DestroyRef, ToastController|
|StepDoctorServiceComponent|app-step-doctor-service|src/app/portals/public/components/step-doctor-service/step-doctor-service.component.ts|-|-|ApiService, BookingWizardService, DestroyRef, ToastController|
|StepPaymentComponent|app-step-payment|src/app/portals/public/components/step-payment/step-payment.component.ts|-|-|ApiService, AuthStateService, BookingWizardService, Router, ToastController|
|StepProofComponent|app-step-proof|src/app/portals/public/components/step-proof/step-proof.component.ts|-|-|ApiService, AuthStateService, BookingWizardService, Router, ToastController|
|StepReviewComponent|app-step-review|src/app/portals/public/components/step-review/step-review.component.ts|-|-|ApiService, BookingWizardService|
|StepSlotSelectComponent|app-step-slot-select|src/app/portals/public/components/step-slot-select/step-slot-select.component.ts|-|-|ApiService, BookingWizardService, DestroyRef, ToastController|
|DoctorStatusCardComponent|app-doctor-status-card|src/app/portals/staff/components/doctor-status-card/doctor-status-card.component.ts|d, dayStatus|statusChanged|-|
|QueueTableComponent|app-queue-table|src/app/portals/staff/components/queue-table/queue-table.component.ts|bookings, doctors, patients, services, isLoading|actionTaken, rowClicked|-|
|AvatarComponent|app-avatar|src/app/shared/components/avatar/avatar.component.ts|name, imageUrl, size|-|-|
|BannerComponent|app-banner|src/app/shared/components/banner/banner.component.ts|variant, message, dismissible, icon|dismissed|-|
|BookingPrintDocumentComponent|app-booking-print-document|src/app/shared/components/booking-print-document/booking-print-document.component.ts|data|-|-|
|BookingTimerComponent|app-booking-timer|src/app/shared/components/booking-timer/booking-timer.component.ts|durationSeconds|timerExpired|-|
|ConfirmModalComponent|app-confirm-modal|src/app/shared/components/confirm-modal/confirm-modal.component.ts|isOpen, title, message, confirmLabel, cancelLabel, isDanger, requireReason, reasonLabel, reasonMinLength|confirmed, cancelled|-|
|EmptyStateComponent|app-empty-state|src/app/shared/components/empty-state/empty-state.component.ts|icon, title, description, ctaLabel, ctaRoute|ctaClick|-|
|NotificationPanelComponent|app-notification-panel|src/app/shared/components/notification-panel/notification-panel.component.ts|-|-|ApiService, AuthStateService, NotificationService, Router|
|PageHeaderComponent|app-page-header|src/app/shared/components/page-header/page-header.component.ts|title, subtitle, showBackButton, defaultBackHref|-|-|
|PatientMediaPanelComponent|app-patient-media-panel|src/app/shared/components/patient-media-panel/patient-media-panel.component.ts|kind, patientId, allowUpload, heading, subheading, headingIcon, errorTitle, bookingIdFilter, filterByBooking|-|ActivatedRoute, ApiService, DestroyRef, FormBuilder, ModalController, ToastController|
|PatientMediaPreviewModalComponent|app-patient-media-preview-modal|src/app/shared/components/patient-media-panel/patient-media-preview.modal.ts|items, startIndex, kind, bookings, patientId|-|ApiService, ModalController|
|PortalLayoutComponent|app-portal-layout|src/app/shared/components/portal-layout/portal-layout.component.ts|navItems, portalTitle, portalLabel, portalColor|-|ActivatedRoute, ApiService, AuthStateService, ClinicSettingsService, DestroyRef, NotificationService, RealtimeInitService, Router, TokenService|
|ReceiptModalComponent|app-receipt-modal|src/app/shared/components/receipt-modal/receipt-modal.component.ts|isOpen, data|closed|-|
|ReceiptViewComponent|app-receipt-view|src/app/shared/components/receipt-view/receipt-view.component.ts|d|-|-|
|SecureImageComponent|app-secure-image|src/app/shared/components/secure-image/secure-image.component.ts|src, mediaId, mediaKind, patientId, fit, alt|-|ApiService, ChangeDetectorRef|
|SkeletonComponent|app-skeleton|src/app/shared/components/skeleton/skeleton.component.ts|variant, width, count|-|-|
|SlotGridComponent|app-slot-grid|src/app/shared/components/slot-grid/slot-grid.component.ts|slots, selectedSlot, runningLate, runningLateMinutes, unavailableToday, isLoading|slotSelected|ToastController|
|StatusBadgeComponent|app-status-badge|src/app/shared/components/status-badge/status-badge.component.ts|d, labelOverride, portal, paymentStatus|-|-|
|NotFoundPage|app-not-found-page|src/app/shared/pages/not-found/not-found.page.ts|-|-|-|

## 10. API Service Layer
- `src/app/core/services/api.service.ts` methods: `get`, `post`, `put`, `patch`, `delete`, `getBlob`, `postBlob`, `getBlobResponse`, `postBlobResponse`, `postFormData`, `putFormData`.
- Error handling: each method pipes to `handleError`, which logs `[ApiService] Request failed:` and rethrows the original error.
- Auth header and refresh behavior are outside `ApiService` in `src/app/core/interceptors/auth.interceptor.ts`.
- Blob/file upload paths are supported without manually forcing `Content-Type: application/json`; FormData is sent through `postFormData`/`putFormData`.

### Domain Services
|Service class|File|Methods detected|Uses ApiService|Uses mock data|
|---|---|---|---|---|
|ApiService|src/app/core/services/api.service.ts|url, toParams, getBlob, postBlob, getBlobResponse, postBlobResponse, handleError|No|No|
|AuthStateService|src/app/core/services/auth-state.service.ts|setLoading, setError, clearError, setUser, patchUser, logout, ensurePatientRecord, clearState, clearUser, hasRole|No|No|
|AuthService|src/app/core/services/auth.service.ts|persistUser, clearSession, storeTokens, toAuthUser, navigateByRole, getGoogleTokenViaPopup, getFacebookTokenViaPopup, resolveRole, resolveRoleFromToken, injectScript|No|No|
|BookingWizardService|src/app/core/services/booking-wizard.service.ts|patchState, selectDoctor, selectService, toggleService, setSelectedServices, selectDate, selectSlot, selectPaymentMode, nextStep, prevStep, setStep, reset|No|No|
|BookingService|src/app/core/services/booking.service.ts|refresh, getBookings, getBookingById, getBookingById$, getBookingsByStatus, getBookingsByDoctorId, getBookingsByPatientId, getTodaysBookings, getTodaysBookingsByDoctorId, getUpcomingBookingsByDoctorId, getDoctorUpcoming, getStaffTodayBookings|Yes|No|
|ClinicDashboardRealtimeService|src/app/core/services/clinic-dashboard-realtime.service.ts|ngOnDestroy, emit, unsubscribeAll, connect, disconnect|No|No|
|ClinicSettingsService|src/app/core/services/clinic-settings.service.ts|load, setSettings, bumpConsentVersion, defaultSettings|No|No|
|DoctorStateService|src/app/core/services/doctor-state.service.ts|getDoctors, getDoctorByUserId, getDoctorDayStatus, setDoctors, setLoading, setTodayStatus, setDayStatuses, mergeDayStatus, normalizeDoctorRows, normalizeDoctorRow, normalizeDoctorDayStatusRow, readValue|No|No|
|DrugInteractionService|src/app/core/services/drug-interaction.service.ts|buildAllergyCacheKey, buildInteractionCacheKey, getCachedAllergyConflict, setAllergyConflict, getCachedInteractionResult, setInteractionResult, evaluateAllergyConflict, evaluateDrugInteractions|No|No|
|MedicalRecordsService|src/app/core/services/medical-records.service.ts|mapConsultationRows, mapPrescriptionRows, mapAllergyRows, mapLabRequestRows, mapLabResultRows, mapVaccinationRows, mapFollowUpRows, mapConsultationRecordRow|No|No|
|MockDataService|src/app/core/services/mock-data.service.ts|generateOrNumber, getClinicSettings, getPaymentSettings, getDoctors, getDoctorById, getDoctorSchedules, getDoctorSchedulesByDoctorId, getDoctorBlockedDates, getServices, getServiceById, getPatients, getPatientById|No|Yes|
|NotificationService|src/app/core/services/notification.service.ts|setNotifications, replaceNotifications, markRead, markAllRead, markReadLocal, markAllReadLocal, refresh, sortNotifications|No|No|
|OfflineConsultationQueueService|src/app/core/services/offline-consultation-queue.service.ts|enqueue, getLatest, listPending, clear, openDb|No|No|
|PatientClinicalHistoryService|src/app/core/services/patient-clinical-history.service.ts|buildPatientClinicalHistory|No|No|
|PatientDocumentsService|src/app/core/services/patient-documents.service.ts|getDownloadUrl|No|No|
|PatientStateService|src/app/core/services/patient-state.service.ts|refresh, getPatients, getPatientById, getPatientByUserId, getFilteredPatients, addPatient, savePatient, updatePatientConsent, upsert|No|No|
|PatientVaccinationsService|src/app/core/services/patient-vaccinations.service.ts|getPatientVaccinations, createPatientVaccination, updatePatientVaccination, deletePatientVaccination, getMyVaccinations|No|No|
|PushNotificationService|src/app/core/services/push-notification.service.ts|subscribeToNotifications, registerDevice, markRead, markAllRead, cleanup, recalculateUnreadCount, registerForegroundMessageHandler, ensureFirebaseApp, buildFirebaseServiceWorkerUrl, getFirebaseConfig|No|No|
|RealtimeInitService|src/app/core/services/realtime-init.service.ts|-|No|No|
|TokenService|src/app/core/services/token.service.ts|setTokens, setAccessToken, setRefreshToken, getAccessToken, getRefreshToken, clearTokens, hasAccessToken, hasRefreshToken, setToken, getToken, clearToken, hasToken|No|No|
|AdminDoctorsService|src/app/portals/admin/services/admin-doctors.service.ts|createDoctorInvite|No|No|
|[UNCLEAR]|src/app/portals/admin/services/admin-patients.service.ts|-|No|No|
|[UNCLEAR]|src/app/portals/admin/services/admin-reports.service.ts|-|No|No|
|[UNCLEAR]|src/app/portals/admin/services/admin-services.service.ts|-|No|No|
|AdminSettingsService|src/app/portals/admin/services/admin-settings.service.ts|getSettings, updateSettings, bumpConsentVersion|No|Yes|
|DoctorStateService|src/app/portals/admin/services/doctor-state.service.ts|refresh, getDoctors, getDoctorById, getDoctorByUserId, getDoctorSchedules, getDoctorDayStatus, loadDoctorsFromApi, loadSingleDayStatus, updateDayStatusViaApi, addDoctor, updateDoctor, setDoctorStatus|No|No|
|[UNCLEAR]|src/app/portals/doctor/services/doctor.service.ts|-|No|No|
|PatientService|src/app/portals/patient/services/patient.service.ts|-|No|No|
|BookingAvailabilityService|src/app/portals/public/services/booking-availability.service.ts|getManilaTodayIso, getManilaDayOfWeek, isManilaToday, isManilaPast, getManilaDateOffset|No|No|
|[UNCLEAR]|src/app/portals/public/services/public.service.ts|-|No|No|
|[UNCLEAR]|src/app/portals/staff/services/staff.service.ts|-|No|No|

## 11. Error Handling Patterns
- Login/register/auth pages parse `HttpErrorResponse.error.message` and `error.errors` where implemented.
- `ApiService` rethrows errors; most page components own their own UI loading/error/toast handling.
- `authInterceptor` handles 401 token refresh globally.
- Toast usage detected through Ionic `ToastController` in multiple pages/components. [TEAM TO VERIFY] consistency across portals.
- No Angular global error boundary equivalent was found by scan. [UNCLEAR]

## 12. Coding Standards
- Angular standalone components are used widely (`standalone: true`).
- Naming pattern: route pages generally use `*.page.ts`; reusable UI uses `*.component.ts`; services use `*.service.ts`; route files use `*.routes.ts`.
- Styling: SCSS files per page/component plus `src/global.scss` and `src/styles.scss`; Ionic components are used extensively.
- Import aliases: no custom TypeScript path aliases were detected from quick config scan; imports are primarily relative. [TEAM TO VERIFY]
- Lint/format config was not found in the zip root beyond Angular defaults; package scripts do not include lint. [UNCLEAR]

## 13. Third-Party Dependencies
|Package|Version|Type|
|---|---|---|
|@angular/animations|^17.3.0|dependency|
|@angular/common|^17.3.0|dependency|
|@angular/compiler|^17.3.0|dependency|
|@angular/core|^17.3.0|dependency|
|@angular/forms|^17.3.0|dependency|
|@angular/platform-browser|^17.3.0|dependency|
|@angular/platform-browser-dynamic|^17.3.0|dependency|
|@angular/router|^17.3.0|dependency|
|@ionic/angular|^7.8.6|dependency|
|@ionic/angular-toolkit|^12.3.0|dependency|
|@ionic/core|^7.8.6|dependency|
|@microsoft/signalr|^10.0.0|dependency|
|firebase|^10.14.1|dependency|
|ionicons|^7.4.0|dependency|
|rxjs|~7.8.0|dependency|
|tslib|^2.3.0|dependency|
|zone.js|~0.14.3|dependency|
|@angular-devkit/build-angular|^17.3.17|devDependency|
|@angular/cli|17.3.17|devDependency|
|@angular/compiler-cli|^17.3.0|devDependency|
|@types/jasmine|~5.1.0|devDependency|
|jasmine-core|~5.1.0|devDependency|
|karma|~6.4.0|devDependency|
|karma-chrome-launcher|~3.2.0|devDependency|
|karma-coverage|~2.2.0|devDependency|
|karma-jasmine|~5.1.0|devDependency|
|karma-jasmine-html-reporter|~2.1.0|devDependency|
|typescript|~5.4.2|devDependency|

## 14. Shared Utilities and Helpers
|File|Exports detected|
|---|---|
|src/app/core/base/base.component.ts|BaseComponent|
|src/app/core/mock-data/mock-announcements.data.ts|MOCK_ANNOUNCEMENTS|
|src/app/core/mock-data/mock-bookings.data.ts|MockBookingDates, buildMockBookings|
|src/app/core/mock-data/mock-clinic-settings.data.ts|MOCK_CLINIC_SETTINGS, MOCK_PAYMENT_SETTINGS|
|src/app/core/mock-data/mock-doctors.data.ts|MOCK_DOCTORS, MOCK_DOCTOR_SCHEDULES|
|src/app/core/mock-data/mock-medical-records.data.ts|MOCK_CONSULTATIONS, MOCK_PRESCRIPTIONS, MOCK_ALLERGIES, MOCK_LAB_REQUESTS, MOCK_LAB_RESULTS, MOCK_VACCINATIONS, MOCK_FOLLOW_UPS, MOCK_DRUG_LIST|
|src/app/core/mock-data/mock-notifications.data.ts|MOCK_NOTIFICATIONS|
|src/app/core/mock-data/mock-patients.data.ts|MOCK_PATIENTS|
|src/app/core/mock-data/mock-reports.data.ts|MOCK_UNPAID_COMPLETED_VISIT_REPORT_ROWS, MOCK_PENDING_FOLLOW_UP_REPORT_ROWS, MOCK_DAILY_BOOKING_SUMMARY_ROWS|
|src/app/core/mock-data/mock-reviews.data.ts|MOCK_REVIEWS|
|src/app/core/mock-data/mock-services.data.ts|MOCK_SERVICES|
|src/app/core/mock-data/mock-users.data.ts|SeedUser, MOCK_SEED_USERS|
|src/app/core/utils/clinical-role.util.ts|ClinicalRoleBadge, resolveClinicalRole, getClinicalRoleBadge, canEditPrescriptions, canEditLabOrders, canEditVaccinations, canViewPfDecision|
|src/app/core/utils/clinical-role.util.ts|ClinicalRoleBadge, resolveClinicalRole, getClinicalRoleBadge, canEditPrescriptions, canEditLabOrders, canEditVaccinations, canViewPfDecision|
|src/app/core/version.ts|APP_VERSION|
|src/app/portals/doctor/consultation/components/patient-avatar.util.ts|PatientAvatarStyle, buildPatientAvatarStyle|

### Core Models
|File|Line|Kind|Name|
|---|---|---|---|
|src/app/core/models/auth.models.ts|1|type|Role|
|src/app/core/models/auth.models.ts|2|type|ClinicalRole|
|src/app/core/models/auth.models.ts|4|interface|AuthUser|
|src/app/core/models/auth.models.ts|15|interface|AuthUserDto|
|src/app/core/models/auth.models.ts|25|interface|AuthSessionDto|
|src/app/core/models/auth.models.ts|32|interface|RefreshTokenDto|
|src/app/core/models/auth.models.ts|37|interface|GoogleAuthRequest|
|src/app/core/models/auth.models.ts|43|interface|FacebookAuthRequest|
|src/app/core/models/booking.models.ts|1|type|BookingStatus|
|src/app/core/models/booking.models.ts|14|type|PaymentStatus|
|src/app/core/models/booking.models.ts|16|type|PaymentMode|
|src/app/core/models/booking.models.ts|18|type|PaymentMethod|
|src/app/core/models/booking.models.ts|20|type|ServiceCategory|
|src/app/core/models/booking.models.ts|22|type|ProofType|
|src/app/core/models/booking.models.ts|24|interface|Service|
|src/app/core/models/booking.models.ts|34|interface|BookingServiceItem|
|src/app/core/models/booking.models.ts|42|interface|BookingPatientInfo|
|src/app/core/models/booking.models.ts|56|interface|BookingDoctorInfo|
|src/app/core/models/booking.models.ts|66|interface|BookingCatalogService|
|src/app/core/models/booking.models.ts|76|interface|Payment|
|src/app/core/models/booking.models.ts|99|interface|Booking|
|src/app/core/models/booking.models.ts|142|interface|TimeSlot|
|src/app/core/models/booking.models.ts|148|interface|ReceiptData|
|src/app/core/models/clinic.models.ts|1|interface|ClinicSettings|
|src/app/core/models/clinic.models.ts|24|interface|OperatingHours|
|src/app/core/models/clinic.models.ts|34|interface|DaySchedule|
|src/app/core/models/clinic.models.ts|40|interface|PaymentSettings|
|src/app/core/models/clinic.models.ts|52|interface|NavItem|
|src/app/core/models/clinic.models.ts|60|interface|AuditLog|
|src/app/core/models/clinic.models.ts|70|interface|AdminDashboardStats|
|src/app/core/models/doctor-patient-summary.models.ts|1|interface|DoctorPatientSummaryDto|
|src/app/core/models/doctor.models.ts|1|type|DoctorStatus|
|src/app/core/models/doctor.models.ts|3|type|DayOfWeek|
|src/app/core/models/doctor.models.ts|12|type|AvailabilityStatus|
|src/app/core/models/doctor.models.ts|16|interface|Doctor|
|src/app/core/models/doctor.models.ts|38|interface|DoctorSchedule|
|src/app/core/models/doctor.models.ts|46|interface|DoctorBlockedDate|
|src/app/core/models/doctor.models.ts|53|interface|DoctorScheduleInput|
|src/app/core/models/doctor.models.ts|59|interface|UpsertSchedulesRequest|
|src/app/core/models/doctor.models.ts|63|interface|BlockDateRequest|
|src/app/core/models/doctor.models.ts|68|interface|DoctorDayStatus|
|src/app/core/models/medical-record.models.ts|1|type|PrescriptionStatus|
|src/app/core/models/medical-record.models.ts|3|type|DiagnosisType|
|src/app/core/models/medical-record.models.ts|5|type|AllergenType|
|src/app/core/models/medical-record.models.ts|7|type|AllergySeverity|
|src/app/core/models/medical-record.models.ts|9|type|AttachmentType|
|src/app/core/models/medical-record.models.ts|21|interface|Consultation|
|src/app/core/models/medical-record.models.ts|50|interface|VitalSigns|
|src/app/core/models/medical-record.models.ts|71|interface|Diagnosis|
|src/app/core/models/medical-record.models.ts|82|interface|Prescription|
|src/app/core/models/medical-record.models.ts|94|interface|PrescriptionItem|
|src/app/core/models/medical-record.models.ts|115|interface|Allergy|
|src/app/core/models/medical-record.models.ts|126|interface|PatientAttachment|
|src/app/core/models/medical-record.models.ts|138|interface|VaccinationRecord|
|src/app/core/models/medical-record.models.ts|153|interface|LabRequest|
|src/app/core/models/medical-record.models.ts|164|interface|LabResult|
|src/app/core/models/medical-record.models.ts|174|interface|FollowUp|
|src/app/core/models/medical-record.models.ts|185|interface|MockDrug|
|src/app/core/models/notification.models.ts|1|interface|Announcement|
|src/app/core/models/notification.models.ts|10|interface|Review|
|src/app/core/models/notification.models.ts|21|interface|Notification|
|src/app/core/models/patient-clinical-history.models.ts|1|interface|PatientClinicalHistoryDto|
|src/app/core/models/patient-clinical-history.models.ts|14|interface|PatientClinicalHistoryPatientDto|
|src/app/core/models/patient-clinical-history.models.ts|26|interface|PatientClinicalHistorySummaryDto|
|src/app/core/models/patient-clinical-history.models.ts|37|interface|PatientClinicalHistoryTimelineItemDto|
|src/app/core/models/patient-clinical-history.models.ts|47|interface|PatientClinicalHistoryAppointmentDto|
|src/app/core/models/patient-clinical-history.models.ts|61|interface|PatientClinicalHistoryConsultationDto|
|src/app/core/models/patient-clinical-history.models.ts|77|interface|PatientClinicalHistoryDiagnosisItemDto|
|src/app/core/models/patient-clinical-history.models.ts|85|interface|PatientClinicalHistoryLabOrderItemDto|
|src/app/core/models/patient-clinical-history.models.ts|91|interface|PatientClinicalHistoryLabOrderTestItemDto|
|src/app/core/models/patient-clinical-history.models.ts|98|interface|PatientClinicalHistoryDocumentDto|
|src/app/core/models/patient-clinical-history.models.ts|111|interface|PatientClinicalHistoryLabResultDto|
|src/app/core/models/patient-clinical-history.models.ts|123|interface|PatientClinicalHistoryVaccinationDto|
|src/app/core/models/patient-clinical-history.models.ts|137|interface|PatientClinicalHistoryFollowUpDto|
|src/app/core/models/patient-clinical-history.models.ts|143|interface|PatientClinicalHistoryPrescriptionDto|
|src/app/core/models/patient-clinical-history.models.ts|149|interface|PatientClinicalHistoryPrescriptionItemDto|
|src/app/core/models/patient-documents.models.ts|1|interface|PatientMedicalRecord|
|src/app/core/models/patient-documents.models.ts|18|interface|PatientPrescriptionItem|
|src/app/core/models/patient-documents.models.ts|38|interface|PatientPrescription|
|src/app/core/models/patient-documents.models.ts|57|interface|PatientFollowUp|
|src/app/core/models/patient-documents.models.ts|70|interface|PatientDocument|
|src/app/core/models/patient-documents.models.ts|88|interface|PatientLabResult|
|src/app/core/models/patient-documents.models.ts|105|interface|PatientDocumentUploadRequest|
|src/app/core/models/patient-documents.models.ts|114|interface|PatientLabResultUploadRequest|
|src/app/core/models/patient.models.ts|1|interface|PatientSummary|
|src/app/core/models/patient.models.ts|17|interface|PatientDetail|
|src/app/core/models/patient.models.ts|46|interface|CreatePatientRequest|
|src/app/core/models/patient.models.ts|68|type|UpdatePatientRequest|
|src/app/core/models/patient.models.ts|70|interface|CreatePatientPortalAccountRequest|
|src/app/core/models/patient.models.ts|75|interface|PagedResult|
|src/app/core/models/patient.models.ts|84|type|Patient|
|src/app/core/models/vaccination.models.ts|1|interface|PatientVaccinationDto|
|src/app/core/models/vaccination.models.ts|30|interface|CreatePatientVaccinationRequest|
|src/app/core/models/vaccination.models.ts|54|type|UpdatePatientVaccinationRequest|
|src/app/core/models/vaccination.models.ts|56|type|VaccinationStatus|
|src/app/core/models/vaccination.models.ts|57|type|VaccinationSource|

## 15. Known Gaps and Flags
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

## Appendices
### Route Component Interaction Index
#### `/public` — `src/app/portals/public/home/home.page.ts`
- Class: `HomePage`; selector: `app-home-page`; template lines: `49`.
- API calls: get('doctors')) line 81; get('services')) line 82; get('announcements')) line 83; get('settings')) line 84
- Methods: countFor@103, onCategorySelect@107

#### `/public/doctors` — `src/app/portals/public/doctors/doctors.page.ts`
- Class: `DoctorsPage`; selector: `app-doctors-page`; template lines: `40`.
- Methods: ngOnInit@76

#### `/public/doctors/:id` — `src/app/portals/public/doctor-profile/doctor-profile.page.ts`
- Class: `DoctorProfilePage`; selector: `app-doctor-profile-page`; template lines: `109`.
- API calls: get('doctor-day-status/' + id).pipe() line 172; get('doctors/' + id),) line 179; get('reviews?doctorId=' + id),) line 180; get('doctors/' + id + '/schedule')) line 181
- Methods: badgeClass@159, ngOnInit@164

#### `/public/services` — `src/app/portals/public/services/services.page.ts`
- Class: `ServicesPage`; selector: `app-services-page`; template lines: `65`.
- Methods: categoryDescription@116, badgeClass@126, ngOnInit@131

#### `/public/announcements` — `src/app/portals/public/announcements/announcements.page.ts`
- Class: `AnnouncementsPage`; selector: `app-announcements-page`; template lines: `22`.
- API calls: get('announcements').subscribe((list) => {) line 44
- Methods: ngOnInit@41

#### `/public/booking` — `src/app/portals/public/booking/booking.page.ts`
- Class: `BookingPage`; selector: `app-booking-page`; template lines: `7`.
- API calls: get('services').pipe() line 45
- Methods: ngOnInit@30

#### `/public/booking-confirmation/:bookingId` — `src/app/portals/public/booking-confirmation/booking-confirmation.page.ts`
- Class: `BookingConfirmationPage`; selector: `app-booking-confirmation-page`; template lines: `72`.
- API calls: get('doctors').pipe() line 105; get('services').pipe() line 110

#### `/public/privacy-policy` — `src/app/portals/public/privacy-policy/privacy-policy.page.ts`
- Class: `PrivacyPolicyPage`; selector: `app-privacy-policy-page`; template lines: `35`.

#### `/auth/login` — `src/app/auth/login/login.page.ts`
- Class: `LoginPage`; selector: `app-login-page`; template lines: `127`.
- Forms: loginForm line 69 controls(email, password)
- Methods: fillCreds@76, onLogin@80, onGoogleLogin@110, onFacebookLogin@143, presentToast@175

#### `/auth/register` — `src/app/auth/register/register.page.ts`
- Class: `RegisterPage`; selector: `app-register-page`; template lines: `149`.
- Forms: registerForm line 55 controls(firstName, middleName, lastName, email, password, confirmPassword, consentAccepted)
- Methods: ngOnInit@66, onSubmit@72, onGoogleLogin@105, onFacebookLogin@138

#### `/auth/callback` — `src/app/auth/callback/auth-callback.page.ts`
- Class: `AuthCallbackPage`; selector: `app-auth-callback`; template lines: `6`.
- API calls: get('auth/me'))) line 86
- Methods: ngOnInit@32

#### `/auth/forgot-password` — `src/app/auth/forgot-password/forgot-password.page.ts`
- Class: `ForgotPasswordPage`; selector: `app-forgot-password-page`; template lines: `26`.
- Forms: form line 34 controls(email)
- Methods: onSubmit@40

#### `/auth/reset-password` — `src/app/auth/reset-password/reset-password.page.ts`
- Class: `ResetPasswordPage`; selector: `app-reset-password-page`; template lines: `27`.
- Forms: form line 32 controls(newPassword, confirmPassword)
- Methods: ngOnInit@38, onSubmit@42

#### `/auth/set-password` — `src/app/auth/set-password/set-password.page.ts`
- Class: `SetPasswordPage`; selector: `app-set-password-page`; template lines: `27`.
- Forms: form line 40 controls(newPassword, confirmPassword)
- Methods: onSubmit@46

#### `/auth/privacy-consent` — `src/app/auth/privacy-consent/privacy-consent.page.ts`
- Class: `PrivacyConsentPage`; selector: `app-privacy-consent-page`; template lines: `28`.
- Methods: ngAfterViewInit@29, onScroll@33, updateScrollState@37, onAccept@48, splitPolicy@66

#### `/admin/dashboard` — `src/app/portals/admin/dashboard/dashboard.page.ts`
- Class: `DashboardPage`; selector: `app-admin-dashboard-page`; template lines: `68`.
- Methods: ngOnInit@115, loadDashboard@135, handleTableAction@211, openBooking@217, buildChartPaths@222

#### `/admin/bookings` — `src/app/portals/admin/bookings/bookings.page.ts`
- Class: `BookingsPage`; selector: `app-admin-bookings-page`; template lines: `155`.
- Methods: ngOnInit@226, fetchBookings@258, loadDoctors@262, goToPage@283, clearFilters@329, toggleSelectAll@339, toggleSelect@345, openBooking@355, statusLabel@359, formatDateTime@365, displayPatientName@392, displayDoctorName@402, displayServiceNames@409, loadBookings@420

#### `/admin/bookings/:id` — `src/app/portals/admin/booking-detail/booking-detail.page.ts`
- Class: `BookingDetailPage`; selector: `app-admin-booking-detail-page`; template lines: `166`.
- API calls: get('bookings/' + id))) line 266; get('patients/' + patientId))) line 300; patch('bookings/' + bookingId + '/confirm', {}))) line 397; patch('bookings/' + bookingId + '/cancel', { reason: reason || 'Rejected by admin' }))) line 401; patch('bookings/' + bookingId + '/confirm', {}))) line 405; patch('bookings/' + bookingId + '/complete', {}))) line 409; patch('bookings/' + bookingId + '/no-show', {}))) line 413; patch('bookings/' + bookingId + '/cancel', { reason: reason || 'Cancelled by admin' }))) line 417; post('audit-logs', { entityType: 'Booking', entityId, action, performedBy, details }))) line 439; put('bookings/' + bookingId + '/waive', { reason }))) line 454; put('bookings/' + bookingId + '/refund', { reason }))) line 475
- Methods: ngOnInit@246, goBack@338, isStepActive@342, isStepComplete@352, openConfirm@358, closeConfirmModal@377, runAction@382, waivePayment@448, refundPaymentAction@469, reschedule@490, openReceipt@494, buildReceiptData@499, closeReceiptModal@520, soon@524

#### `/admin/walk-in` — `src/app/portals/admin/walk-in/walk-in.page.ts`
- Class: `WalkInPage`; selector: `app-admin-walk-in-page`; template lines: `474`.
- Forms: quickRegisterForm line 568 controls(firstName, middleName, lastName, dateOfBirth, sex, contactNumber, email, address, preparePortalAccount); bookingForm line 579 controls(doctorId, serviceId, appointmentDate)
- API calls: post('patients', dto))) line 827; post('bookings', {}))) line 879; get('bookings/' + bookingId))) line 887; get('doctors').pipe() line 902; get(endpoint).pipe() line 934; get('doctors/' + doctorId + '/services').pipe() line 1005; get('services').pipe() line 1008; get('doctors/' + doctorId + '/available-slots?date=' + date).pipe() line 1044
- Methods: ngOnInit@608, canAccessStep@699, isStepComplete@708, goToStep@717, trackById@721, patientDisplayName@725, patientAccountStatus@735, patientAccountLabel@742, patientContactLabel@750, patientEmailLabel@754, showQuickRegisterError@758, showBookingError@763, openQuickRegister@768, cancelQuickRegister@770, retrySearch@778, selectPatient@780, clearSelectedPatient@789, onSlotSelected@799, createPatient@804, createBooking@841, loadDoctors@898, searchPatients@917, loadPatients@919, onDoctorChanged@969, onDateChanged@986, loadServicesForDoctor@999, refreshAvailableSlots@1029, refreshCurrentStep@1058

#### `/admin/calendar` — `src/app/portals/admin/calendar/calendar.page.ts`
- Class: `CalendarPage`; selector: `app-admin-calendar-page`; template lines: `40`.
- Methods: ngOnInit@63, shiftWeek@91, bookingsForCell@97, loadBookings@101, loadDoctors@125, startOfWeek@143, isoDate@151, normalizeBookingRow@156, normalizeStringArray@198, normalizeDateOnly@206, normalizeTimeOnly@211, normalizeNumber@216, normalizeNullableNumber@229, normalizeBoolean@246, normalizeBooleanOrUndefined@250, asOptionalString@258

#### `/admin/doctors` — `src/app/portals/admin/doctors/doctors.page.ts`
- Class: `DoctorsPage`; selector: `app-admin-doctors-page`; template lines: `155`.
- API calls: get('doctors/' + doctor.id + '/schedule').pipe() line 289
- Methods: ngOnInit@201, addDoctor@205, editDoctor@209, askDeactivate@213, cancelDeactivate@222, confirmDeactivate@227, workingDays@256, isBusy@263, loadDoctors@267

#### `/admin/doctors/new` — `src/app/portals/admin/doctor-form/doctor-form.page.ts`
- Class: `DoctorFormPage`; selector: `app-admin-doctor-form-page`; template lines: `144`.
- Forms: form line 196 controls(fullName, doctorEmail, specialization, bio, licenseNumber, ptrNumber, s2Number, consultationFee, status, slotDurationMinutes, slotCapacity, dailyPatientLimit)
- API calls: get('doctors/admin').pipe() line 230; get('doctors/' + this.doctorId + '/schedule').pipe() line 237; put(`doctors/${this.doctorId}`, updatePayload).pipe() line 312; put('doctors/' + savedDoctor.id + '/schedule', {) line 315
- Methods: ngOnInit@209, submit@275, toggleService@384, cancel@392, buildScheduleDrafts@396, defaultScheduleDraft@408

#### `/admin/doctors/:id/edit` — `src/app/portals/admin/doctor-form/doctor-form.page.ts`
- Class: `DoctorFormPage`; selector: `app-admin-doctor-form-page`; template lines: `144`.
- Forms: form line 196 controls(fullName, doctorEmail, specialization, bio, licenseNumber, ptrNumber, s2Number, consultationFee, status, slotDurationMinutes, slotCapacity, dailyPatientLimit)
- API calls: get('doctors/admin').pipe() line 230; get('doctors/' + this.doctorId + '/schedule').pipe() line 237; put(`doctors/${this.doctorId}`, updatePayload).pipe() line 312; put('doctors/' + savedDoctor.id + '/schedule', {) line 315
- Methods: ngOnInit@209, submit@275, toggleService@384, cancel@392, buildScheduleDrafts@396, defaultScheduleDraft@408

#### `/admin/services` — `src/app/portals/admin/services/services.page.ts`
- Class: `ServicesPage`; selector: `app-admin-services-page`; template lines: `141`.
- API calls: put('services/' + this.editingId, payload).pipe() line 275; post('services', payload).pipe() line 278; get('services').pipe() line 308; get('doctors/admin').pipe() line 315
- Methods: ngOnInit@174, assignedDoctors@185, openModal@191, closeModal@197, edit@205, toggle@211, remove@236, save@260, isBusy@298, loadData@302, buildWritePayload@333, emptyDraft@344, onModalDismiss@357, getModalElement@380

#### `/admin/patients` — `src/app/portals/admin/patients/patients.page.ts`
- Class: `PatientsPage`; selector: `app-admin-patients-page`; template lines: `106`.
- API calls: get(endpoint).pipe() line 231
- Methods: ngOnInit@149, openDetail@192, openAddPatientModal@196, previousPage@210, nextPage@216, loadPatients@222, patientDisplayName@282, patientAccountStatus@286, patientAccountLabel@298

#### `/admin/patients/:id` — `src/app/portals/admin/patient-detail/patient-detail.page.ts`
- Class: `PatientDetailPage`; selector: `app-admin-patient-detail-page`; template lines: `103`.
- API calls: get('patients/' + id).pipe() line 192; get('medical-records/consultations?patientId=' + id).pipe() line 213; get('medical-records/prescriptions?patientId=' + id).pipe() line 217; get('medical-records/allergies?patientId=' + id).pipe() line 221; get('medical-records/lab-results?patientId=' + id).pipe() line 225; get('medical-records/vaccinations?patientId=' + id).pipe() line 229; get('medical-records/follow-ups?patientId=' + id).pipe() line 233
- Methods: ngOnInit@150, back@157, openEdit@161, onTabChange@181, loadPatient@189, loadSupportingData@197, patientAccountStatus@237, patientAccountLabel@249

#### `/admin/staff` — `src/app/portals/admin/staff/staff.page.ts`
- Class: `StaffPage`; selector: `app-admin-staff-page`; template lines: `70`.
- Methods: ngOnInit@117, openAddStaffForm@153, closeAddStaffForm@160, save@167, revokeInvite@232, toggle@259

#### `/admin/announcements` — `src/app/portals/admin/announcements/announcements.page.ts`
- Class: `AnnouncementsPage`; selector: `app-admin-announcements-page`; template lines: `74`.
- Methods: ngOnInit@105, loadAnnouncements@109, openModal@127, edit@133, closeModal@139, save@145, toggle@159, askDelete@169, closeDeleteModal@173, confirmDelete@177, emptyDraft@189

#### `/admin/settings` — `src/app/portals/admin/settings/settings.page.ts`
- Class: `SettingsPage`; selector: `app-admin-settings-page`; template lines: `187`.
- API calls: put('settings', this.cloneSettings(this.draft)).pipe() line 324
- Methods: ngOnInit@244, markDirty@262, updateHours@266, setPrimaryColor@277, setSecondaryColor@289, onLogoSelected@300, saveSettings@314, openConsentModal@340, bumpConsent@344, validateDraft@350, cloneSettings@354, applyPrimaryColor@358

#### `/admin/audit-logs` — `src/app/portals/admin/audit-logs/audit-logs.page.ts`
- Class: `AuditLogsPage`; selector: `app-admin-audit-logs-page`; template lines: `76`.
- API calls: get('audit-logs').subscribe((logs) => {) line 106
- Methods: ngOnInit@103, applyFilters@111, todayIso@123, daysAgoIso@129

#### `/admin/reports` — `src/app/portals/admin/reports/reports.page.ts`
- Class: `ReportsPage`; selector: `app-admin-reports-page`; template lines: `133`.
- API calls: get('reports/unpaid-completed-visits').subscribe((rows) => {) line 171; get('reports/pending-follow-ups').subscribe((rows) => {) line 176; get('reports/daily-booking-summary').subscribe((rows) => {) line 181
- Methods: ngOnInit@168, applyFilters@186, viewBooking@192, sendReminder@196, exportCsv@201, isWithinRange@205, markSectionLoaded@209, todayIso@216, daysAgoIso@222, daysAheadIso@229

#### `/staff/dashboard` — `src/app/portals/staff/dashboard/staff-dashboard.page.ts`
- Class: `StaffDashboardPage`; selector: `app-staff-dashboard-page`; template lines: `82`.
- API calls: patch('bookings/' + event.bookingId + '/check-in', {}).subscribe()) line 201; patch('bookings/' + event.bookingId + '/undo-check-in', {}).subscribe()) line 204
- Methods: ngOnInit@145, ionViewWillEnter@184, goToPaymentQueue@188, openBooking@192, onQueueAction@196, refreshDashboardBookings@210, refreshDashboardData@214, loadTodaysBookings@220, loadDoctors@234

#### `/staff/bookings` — `src/app/portals/staff/bookings/staff-bookings.page.ts`
- Class: `StaffBookingsPage`; selector: `app-staff-bookings-page`; template lines: `201`.
- API calls: get('doctors').subscribe({) line 264; patch('bookings/' + booking.id + '/check-in', {}).subscribe({) line 333; patch('bookings/' + booking.id + '/undo-check-in', {}).subscribe({) line 349; get('bookings/staff/all?page=' + this.currentPage + '&pageSize=' + this.pageSize).subscribe({) line 401
- Methods: ngOnInit@256, onDateChanged@291, onFiltersChanged@296, refresh@301, previousPage@305, nextPage@314, openBooking@323, checkIn@328, undoCheckIn@344, servicesLabel@360, bookingStatusLabel@364, timeRangeLabel@393, loadBookings@397, toLocalIsoDate@431

#### `/staff/payments` — `src/app/portals/staff/payments/staff-payments.page.ts`
- Class: `StaffPaymentsPage`; selector: `app-staff-payments-page`; template lines: `183`.
- API calls: patch('payments/' + bookingId + '/confirm', {) line 371; patch('payments/' + this.waiveTarget.bookingId + '/waive', { reason: waiveReason }).subscribe({) line 422; get('bookings/staff/for-payment?page=' + this.currentPage + '&pageSize=' + safePageSize).pipe() line 478
- Methods: ngOnInit@255, previousPage@271, nextPage@280, openPaymentModal@297, closePaymentModal@312, openWaiveModal@318, closeWaiveModal@330, confirmPayment@336, confirmWaive@400, canTakePaymentAction@433, patientLabel@437, doctorLabel@441, servicesLabel@445, queueLabel@469, loadQueue@473

#### `/staff/bookings/:id` — `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts`
- Class: `StaffBookingDetailPage`; selector: `app-staff-booking-detail-page`; template lines: `264`.
- API calls: patch('bookings/' + this.booking.id + '/check-in', {}).subscribe({) line 518; patch('bookings/' + this.booking.id + '/undo-check-in', {}).subscribe({) line 537; patch('payments/' + bookingId + '/confirm', {) line 595; get('bookings/' + bookingId).pipe() line 603; patch('payments/' + this.booking.id + '/waive', { reason: waiveReason }).subscribe({) line 666; get('payments/' + paymentId).pipe() line 687; get('bookings/' + bookingId) : of(undefined)).pipe() line 695
- Methods: ngOnInit@471, goBack@477, staffStatusLabel@481, checkIn@510, undoCheckIn@529, openPaymentModal@548, closePaymentModal@561, confirmPayment@566, openWaiveModal@630, closeWaiveModal@639, confirmWaive@644, printBookingDocument@677, return@694, buildPrintDocument@722, refreshBooking@781, loadBooking@789

#### `/staff/walk-in` — `src/app/portals/staff/walk-in/staff-walk-in.page.ts`
- Class: `StaffWalkInPage`; selector: `app-staff-walk-in-page`; template lines: `495`.
- Forms: quickRegisterForm line 589 controls(firstName, middleName, lastName, dateOfBirth, sex, contactNumber, email, address, preparePortalAccount); bookingForm line 600 controls(doctorId, serviceId, appointmentDate)
- API calls: post('patients', dto))) line 891; post('bookings', {}))) line 939; get('bookings/' + bookingId))) line 947; get(endpoint).pipe() line 1002; get('services').pipe() line 1092
- Methods: ngOnInit@629, canAccessStep@723, isStepComplete@736, goToStep@749, trackById@755, patientDisplayName@759, patientAccountStatus@776, patientAccountLabel@792, patientContactLabel@803, patientEmailLabel@807, showQuickRegisterError@811, showBookingError@816, openQuickRegister@821, cancelQuickRegister@825, retrySearch@840, selectPatient@844, clearSelectedPatient@853, onSlotSelected@863, createPatient@868, createBooking@905, loadDoctors@958, searchPatients@983, loadPatients@987, onDoctorChanged@1047, onDateChanged@1064, loadServicesForDoctor@1078, refreshAvailableSlots@1124, refreshCurrentStep@1167

#### `/staff/patients` — `src/app/portals/staff/patients/staff-patients.page.ts`
- Class: `StaffPatientsPage`; selector: `app-staff-patients-page`; template lines: `75`.
- Methods: ngOnInit@109, openDetail@144, patientDisplayName@148, patientAccountStatus@152, patientAccountLabel@164, loadPatients@175

#### `/staff/patients/:id` — `src/app/portals/staff/patient-detail/staff-patient-detail.page.ts`
- Class: `StaffPatientDetailPage`; selector: `app-staff-patient-detail-page`; template lines: `285`.
- Forms: portalAccountForm line 52 controls(email, temporaryPassword, confirmTemporaryPassword)
- API calls: post('patients/' + this.patient.id + '/portal-account', {) line 192
- Methods: ngOnInit@59, back@71, retry@75, setSelectedTab@83, patientDisplayName@89, loadPatient@124, createPortalAccount@180, showPortalAccountError@204, loadBookings@213

#### `/staff/doctor-status` — `src/app/portals/staff/doctor-status/doctor-status.page.ts`
- Class: `DoctorStatusPage`; selector: `app-staff-doctor-status-page`; template lines: `46`.
- API calls: post('doctor-day-status/' + event.doctorId + '/status', {) line 176
- Methods: ngOnInit@82, loadDoctors@86, getDayStatus@165, onStatusChanged@169, countByStatus@203, labelForStatus@209

#### `/staff/profile` — `src/app/portals/staff/profile/staff-profile.page.ts`
- Class: `StaffProfilePage`; selector: `app-staff-profile-page`; template lines: `58`.
- Forms: personalForm line 95 controls(fullName, contactNumber); passwordForm line 100 controls(currentPassword, newPassword, confirmPassword)
- Methods: ngOnInit@107, currentUser@121, saveProfile@140, changePassword@172

#### `/doctor/dashboard` — `src/app/portals/doctor/dashboard/doctor-dashboard.page.ts`
- Class: `DoctorDashboardPage`; selector: `app-doctor-dashboard-page`; template lines: `132`.
- API calls: get('doctors/me').pipe() line 253; get('bookings/doctor/today').pipe() line 264; get('bookings/doctor/today-summary').pipe() line 269; get('doctors/' + doc.id + '/schedule').pipe() line 286; get('doctors/' + doc.id + '/day-status').pipe() line 290; post('doctors/' + this.doctor.id + '/day-status', {) line 317
- Methods: ngOnInit@208, ionViewWillEnter@245, loadDashboard@249, updateStatus@313, openAppointment@330, startConsult@334, viewChart@338, queueItemClass@342, displayQueueService@351, formatTimeLabel@361, getScheduleForDate@375, getShiftProgress@384, getShiftRemaining@403, getTomorrowScheduleLabel@422, setGreeting@432, normalizeStatus@437, queueState@446, getShiftTimes@460, label@471, todayStr@475

#### `/doctor/appointments` — `src/app/portals/doctor/appointments/doctor-appointments.page.ts`
- Class: `DoctorAppointmentsPage`; selector: `app-doctor-appointments-page`; template lines: `229`.
- API calls: get('bookings/doctor/today').pipe() line 368; get('bookings/doctor/today-summary').pipe() line 374; patch('bookings/' + bookingId + '/doctor-complete', payload).pipe() line 480; patch('payments/' + bookingId + '/waive', {) line 483
- Methods: ngOnInit@343, loadSummary@364, view@404, consult@408, canStartConsultation@412, canComplete@416, timeRangeLabel@420, servicesLabel@424, openCompleteModal@428, closeCompleteModal@439, setWaived@445, submitCompletion@452

#### `/doctor/appointments/:id` — `src/app/portals/doctor/appointment-detail/doctor-appointment-detail.page.ts`
- Class: `DoctorAppointmentDetailPage`; selector: `app-doctor-appointment-detail-page`; template lines: `158`.
- API calls: get('bookings/' + bookingId).pipe() line 203
- Methods: ngOnInit@217, openConsultation@221, back@225, patientName@229, timeline@233, consultationActionLabel@247

#### `/doctor/patients` — `src/app/portals/doctor/patients/doctor-patients.page.ts`
- Class: `DoctorPatientsPage`; selector: `app-doctor-patients-page`; template lines: `45`.
- API calls: get('bookings/doctor/patients').pipe() line 121
- Methods: ngOnInit@76, openClinicalHistory@80, openClinicalHistoryFromButton@85, openAppointment@90, formatLatestVisitDate@96, formatLatestVisitTime@113, loadPatients@117

#### `/doctor/patients/:id` — `src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`
- Class: `DoctorPatientDetailPage`; selector: `app-doctor-patient-detail-page`; template lines: `192`.
- API calls: get('patients/' + patientId))) line 320; get('bookings?patientId=' + patientId + '&pageSize=50')),) line 333; get('medical-records/consultations?patientId=' + patientId).pipe() line 336; get('medical-records/prescriptions?patientId=' + patientId).pipe() line 339; get('medical-records/lab-results?patientId=' + patientId).pipe() line 342; get('medical-records/vaccinations?patientId=' + patientId).pipe() line 345; get('medical-records/follow-ups?patientId=' + patientId).pipe() line 348; get('bookings/' + bookingId + '/consultation-record').pipe() line 494
- Methods: calcAge@242, retry@250, onTabChange@254, viewFile@309

#### `/doctor/schedule` — `src/app/portals/doctor/schedule/doctor-schedule.page.ts`
- Class: `DoctorSchedulePage`; selector: `app-doctor-schedule-page`; template lines: `44`.
- API calls: get('doctors/me').pipe() line 98; get('doctors/' + doctor.id + '/schedule').pipe() line 125; get('doctors/' + doctor.id + '/blocked-dates').pipe() line 128; put('doctors/' + this.doctorId + '/schedule', {) line 166; put('doctors/' + this.doctorId, {) line 174; post('doctors/' + this.doctorId + '/blocked-dates', {) line 200; delete('doctors/' + this.doctorId + '/blocked-dates/' + id).pipe() line 223
- Methods: ngOnInit@89, loadData@93, saveSchedules@145, addBlockedDate@193, removeBlockedDate@216, updatePreviewDate@236, markDirty@241, buildDraftSchedules@259, toDisplayTime@279, toBackendTime@284, refreshPreview@296, onSaveSuccess@300, generatePreviewSlots@308, getPreviewScheduleDay@351, minutesFromTime@365, timeFromMinutes@370

#### `/doctor/consultation/:bookingId` — `src/app/portals/doctor/consultation/doctor-consultation.page.ts`
- Class: `DoctorConsultationPage`; selector: `app-doctor-consultation-page`; template lines: `452`.
- API calls: get('doctors/me').pipe() line 727; get('audit-logs').pipe() line 754; post('/consultation-requests/request-attending-physician', {) line 958; post('audit-logs',) line 1883; get('bookings/' + booking.id + '/consultation-record').pipe() line 2748; get('medical-records/consultations?patientId=' + patientId).pipe() line 2775; get('medical-records/prescriptions?patientId=' + patientId).pipe() line 2779; get('medical-records/allergies?patientId=' + patientId).pipe() line 2783; get('medical-records/lab-orders?patientId=' + patientId).pipe() line 2787; get('medical-records/lab-results?patientId=' + patientId).pipe() line 2791; get('medical-records/vaccinations?patientId=' + patientId).pipe() line 2795; get('medical-records/follow-ups?patientId=' + patientId).pipe() line 2799
- Methods: ngOnInit@778, ngAfterViewChecked@788, ngOnDestroy@792, handleKeyboardShortcuts@810, isEditableTarget@879, onVitalsChange@888, onSoapChange@893, onDiagnosesChange@898, onPrescriptionItemsChange@903, onLabRequestsChange@908, onFollowUpChange@913, onVaccinationsAdded@918, toggleProgressSidebar@923, closeProgressSidebar@927, openLastVisitSoap@931, openPatientClinicalHistory@940, closeClinicalHistoryDrawer@949, requestAttendingPhysician@953, handleDraftMutation@974, scheduleAutosave@1003, retrySync@1083, getSaveStateLabel@1089, getDraftButtonLabel@1106, initializeObservers@1117, scrollToSection@1169, getCompleteTooltip@1176, getProgressStepState@1193, getProgressStepIcon@1237, getProgressStepLabel@1250, getMobileTabLabel@1269

#### `/doctor/my-profile` — `src/app/portals/doctor/profile/doctor-profile.page.ts`
- Class: `DoctorProfilePage`; selector: `app-doctor-profile-page`; template lines: `217`.
- Forms: profileForm line 271 controls(fullName, specialization, bio, consultationFee, licenseNumber, ptrNumber, s2Number); passwordForm line 281 controls(currentPassword, newPassword, confirmPassword)
- Methods: ngOnInit@288, reload@375, onPhotoUpload@379, save@391, changePassword@447, loadProfile@482, patchForm@516

#### `/doctor/profile` — `src/app/portals/doctor/profile/doctor-profile.page.ts`
- Class: `DoctorProfilePage`; selector: `app-doctor-profile-page`; template lines: `217`.
- Forms: profileForm line 271 controls(fullName, specialization, bio, consultationFee, licenseNumber, ptrNumber, s2Number); passwordForm line 281 controls(currentPassword, newPassword, confirmPassword)
- Methods: ngOnInit@288, reload@375, onPhotoUpload@379, save@391, changePassword@447, loadProfile@482, patchForm@516

#### `/patient/dashboard` — `src/app/portals/patient/dashboard/patient-dashboard.page.ts`
- Class: `PatientDashboardPage`; selector: `app-patient-dashboard-page`; template lines: `153`.
- API calls: get('patients/me').pipe(catchError(() => of(undefined))) : of(undefined)) line 228; get('bookings?page=1&pageSize=100').pipe() line 235; get('medical-records/consultations?patientId=' + patient.id).pipe() line 305; get('medical-records/prescriptions?patientId=' + patient.id).pipe() line 309
- Methods: ngOnInit@359, loadDoctors@363, canSubmitProof@378, openBooking@386, showPhaseNineToast@390, showPhaseTenToast@394, getWelcomeName@398

#### `/patient/doctors` — `src/app/portals/patient/doctors/patient-doctors.page.ts`
- Class: `PatientDoctorsPage`; selector: `app-patient-doctors-page`; template lines: `39`.
- Methods: ngOnInit@64, ionViewWillEnter@68, retry@85, doctorScheduleSummary@89, loadDoctors@101

#### `/patient/bookings` — `src/app/portals/patient/bookings/patient-bookings.page.ts`
- Class: `PatientBookingsPage`; selector: `app-patient-bookings-page`; template lines: `120`.
- API calls: patch('bookings/' + this.bookingToCancel.id + '/cancel', { reason: 'Cancelled by patient.' }))) line 299
- Methods: ngOnInit@177, ionViewWillEnter@196, setFilter@249, previousPage@254, nextPage@260, retry@266, openBooking@270, promptCancelById@274, promptCancel@283, confirmCancel@292, closeCancelModal@308, canCancelBooking@313, doctorName@321, servicesLabel@325, displayStatus@338, displayPaymentStatus@362, formatTimeRange@370, loadBookings@385, refreshFilteredBookings@439, isWaived@458

#### `/patient/documents` — `src/app/portals/patient/documents/patient-documents.page.ts`
- Class: `PatientDocumentsPage`; selector: `app-patient-documents-page`; template lines: `9`.

#### `/patient/lab-results` — `src/app/portals/patient/lab-results/patient-lab-results.page.ts`
- Class: `PatientLabResultsPage`; selector: `app-patient-lab-results-page`; template lines: `9`.

#### `/patient/labs` — `src/app/portals/patient/labs-redirect/patient-labs-redirect.page.ts`
- Class: `PatientLabsRedirectPage`; selector: `app-patient-labs-redirect-page`; template lines: `0`.
- Methods: ngOnInit@11

#### `/patient/bookings/:id` — `src/app/portals/patient/booking-detail/patient-booking-detail.page.ts`
- Class: `PatientBookingDetailPage`; selector: `app-patient-booking-detail-page`; template lines: `127`.
- API calls: get('patients/me').pipe(catchError(() => of(undefined))),) line 275; get('bookings/' + bookingId).pipe(map((row) => normalizeBookingRow(row)))) line 276; patch('bookings/' + this.booking.id + '/cancel', { reason: 'Cancelled by patient.' }))) line 304; get('payments/' + this.booking.payment.id).pipe() line 334; get('bookings/' + bookingId) : of(undefined)).pipe() line 342
- Methods: ngOnInit@267, openCancelModal@289, confirmCancel@297, back@312, navigateToDocuments@316, navigateToLabResults@320, openReceipt@324, return@341, timeRangeLabelFor@371

#### `/patient/medical-records` — `src/app/portals/patient/medical-records/patient-medical-records.page.ts`
- Class: `PatientMedicalRecordsPage`; selector: `app-patient-medical-records-page`; template lines: `120`.
- API calls: get('medical-records/me').subscribe({) line 155; getBlob(`patient-documents/me/medical-records/${record.id}/pdf`).subscribe({) line 182; getBlob(`patient-documents/me/bookings/${record.bookingId}/pdf`).subscribe({) line 200; getBlob('patient-documents/me/all.pdf').subscribe({) line 213
- Methods: ngOnInit@145, loadRecords@149, onSearchChange@169, downloadMedicalRecord@174, downloadConsultationSummary@192, downloadAllRecords@210, isDownloading@217, isDownloadingSummary@221, applyFilter@225, saveBlob@249

#### `/patient/prescriptions` — `src/app/portals/patient/prescriptions/patient-prescriptions.page.ts`
- Class: `PatientPrescriptionsPage`; selector: `app-patient-prescriptions-page`; template lines: `109`.
- API calls: get('prescriptions/me').subscribe({) line 144; getBlob(`patient-documents/me/prescriptions/${prescription.id}/pdf`).subscribe({) line 171; getBlob(`patient-documents/me/bookings/${prescription.bookingId}/pdf`).subscribe({) line 189; getBlob('patient-documents/me/all.pdf').subscribe({) line 202
- Methods: ngOnInit@134, loadPrescriptions@138, onSearchChange@158, downloadPrescription@163, downloadConsultationSummary@181, downloadAllRecords@199, isDownloading@206, isDownloadingSummary@210, applyFilter@214, saveBlob@250

#### `/patient/vaccinations` — `src/app/portals/patient/vaccinations/patient-vaccinations.page.ts`
- Class: `PatientVaccinationsPage`; selector: `app-patient-vaccinations-page`; template lines: `104`.
- Methods: ngOnInit@141, loadVaccinations@145, onSearchChange@165, formatSource@170, applyFilter@179

#### `/patient/profile` — `src/app/portals/patient/profile/patient-profile.page.ts`
- Class: `PatientProfilePage`; selector: `app-patient-profile-page`; template lines: `285`.
- Forms: profileForm line 366 controls(firstName, middleName, lastName, dateOfBirth, sex, civilStatus, bloodType, contactNumber, email, value, disabled, address, city, zipCode, emergencyContactName, emergencyContactRelationship, emergencyContactNumber, hmoProvider, hmoCardNumber, philHealthNumber); passwordForm line 387 controls(currentPassword, newPassword, confirmPassword)
- Methods: ngOnInit@403, saveProfile@435, changePassword@499, submitConsent@534, loadProfile@564, patchFromUser@592, patchFromPatient@601, onConsentToggle@625

#### `/patient/reviews/:bookingId` — `src/app/portals/patient/reviews/patient-reviews.page.ts`
- Class: `PatientReviewsPage`; selector: `app-patient-reviews-page`; template lines: `37`.
- Methods: ngOnInit@66, submitReview@102, back@139

#### `/patient/privacy-consent` — `src/app/portals/patient/privacy-consent/patient-privacy-consent.page.ts`
- Class: `PatientPrivacyConsentPage`; selector: `app-patient-privacy-consent-page`; template lines: `29`.
- Methods: ngOnInit@59, acceptConsent@77

#### `/dev/gallery` — `src/app/dev/design-system-gallery/design-system-gallery.page.ts`
- Class: `DesignSystemGalleryPage`; selector: `app-design-system-gallery`; template lines: `269`.
- Methods: onConfirmDismiss@150

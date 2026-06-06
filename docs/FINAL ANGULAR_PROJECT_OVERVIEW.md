# MASTER PROJECT OVERVIEW — Clinic Hospital Web Portal (Angular 17 + Ionic 7)

> **Document purpose:** Authoritative AI context file for feature development, Playwright E2E testing, and onboarding.
> **Source:** Full static analysis of `/src` as committed + blueprint cross-check.
> **App version token:** `54e9c87`
> **Last scanned:** June 2026

---

## Table of Contents

1. [App Overview & Tech Stack](#1-app-overview--tech-stack)
2. [Folder Structure](#2-folder-structure)
3. [Route Map — All Portals](#3-route-map--all-portals)
4. [Auth Flow & Guards](#4-auth-flow--guards)
5. [Core Services](#5-core-services)
6. [State Management](#6-state-management)
7. [Data Models / Entities](#7-data-models--entities)
8. [API Surface — Complete Endpoint Reference](#8-api-surface--complete-endpoint-reference)
9. [Portal: Public](#9-portal-public)
10. [Portal: Auth](#10-portal-auth)
11. [Portal: Doctor](#11-portal-doctor)
12. [Portal: Patient](#12-portal-patient)
13. [Portal: Staff](#13-portal-staff)
14. [Portal: Admin](#14-portal-admin)
15. [Shared Components](#15-shared-components)
16. [Pipes, Validators, Utils](#16-pipes-validators-utils)
17. [Realtime — SignalR & FCM](#17-realtime--signalr--fcm)
18. [Environment & Configuration](#18-environment--configuration)
19. [Third-Party Dependencies](#19-third-party-dependencies)
20. [Coding Standards & Conventions](#20-coding-standards--conventions)
21. [Design & UI Conventions](#21-design--ui-conventions)
22. [New Page Checklist](#22-new-page-checklist)
23. [Blueprint Cross-Check & Gap Report](#23-blueprint-cross-check--gap-report)
24. [Known Gaps, Bugs & Incomplete Features](#24-known-gaps-bugs--incomplete-features)

---

## 1. App Overview & Tech Stack

### Purpose

Multi-role hospital/clinic web portal (Angular 17 PWA). Patients browse doctors, book appointments, and manage health records. Staff manage the daily queue, walk-ins, and payments. Doctors view schedules, conduct consultations, and maintain clinical records. Admins configure the clinic, manage all users, run reports, and view audit logs.

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 17 (standalone components throughout — no NgModule) |
| UI Library | Ionic Angular 7 (`@ionic/angular/standalone`) |
| Language | TypeScript ~5.4 |
| State | RxJS BehaviorSubjects + Angular Signals (`toSignal`) |
| HTTP | Angular `HttpClient` wrapped by `ApiService` (never direct injection) |
| Realtime | Microsoft SignalR (`@microsoft/signalr` v10) |
| Push Notifications | Firebase Messaging v10 (FCM) |
| Auth | JWT Bearer — access + refresh pair, stored in `localStorage` |
| Social Auth | Google Identity Services (GIS) popup; Facebook JS SDK popup |
| Routing | Angular Router with lazy-loaded standalone components (`loadComponent`) |
| Build | Angular CLI 17 / `@angular-devkit/build-angular` |
| E2E Testing | Playwright (`@playwright/test` v1.60) |
| Unit Testing | Karma + Jasmine |
| Hosting | Vercel (`vercel.json` present) |
| Backend | .NET Web API — dev: `https://localhost:44384/api`, prod: `https://api.yourclinicdomain.com/api` |
| Currency | Philippine Peso (PHP) — `PesoPipe` uses `en-PH` locale |
| Timezone | Asia/Manila for all date calculations |
| Service Worker | `src/firebase-messaging-sw.js` — Firebase Messaging background push |

### Roles

| Role | Entry Point | Guard Combo |
|---|---|---|
| `Admin` | `/admin/dashboard` | `authGuard` + `roleGuard` + `firstLoginGuard` |
| `Staff` | `/staff/dashboard` | `authGuard` + `roleGuard` |
| `Doctor` | `/doctor/dashboard` | `authGuard` + `roleGuard` |
| `Patient` | `/patient/dashboard` | `authGuard` + `roleGuard` |
| Public | `/public` | None |

---

## 2. Folder Structure

```
src/
  app/
    app.component.ts/html/scss     ← Root component (IonApp + IonRouterOutlet)
    app.component.spec.ts          ← Root component spec
    app.config.ts                  ← ApplicationConfig: providers, APP_INITIALIZER, interceptors
    app.routes.ts                  ← Top-level lazy routes by role
    auth/                          ← Login, Register, Forgot/Reset/Set Password, Callback, Privacy Consent
      auth.routes.ts
      callback/                    ← OAuth redirect handler
      components/auth-layout/      ← Auth shell layout
      forgot-password/
      login/
      privacy-consent/
      register/
      reset-password/
      set-password/
    core/
      base/
        base.component.ts          ← BaseComponent: ngUnsubscribe, showToast()
      guards/
        auth.guard.ts              ← authGuard: checks isAuthenticated$
        first-login.guard.ts       ← firstLoginGuard: redirects to /auth/set-password if isFirstLogin
        role.guard.ts              ← roleGuard: checks userRole$ against route.data.roles
      interceptors/
        auth.interceptor.ts        ← Attaches Bearer token; handles 401 → refresh → retry
        auth-http.tokens.ts        ← SKIP_AUTH_INTERCEPTOR, AUTH_RETRY_ATTEMPTED context tokens
      mock-data/                   ← 11 mock data files (unused — useMockData: false)
      models/
        index.ts                   ← Re-exports all models
        auth.models.ts             ← AuthUser, Role, ClinicalRole, AuthSessionDto, etc.
        booking.models.ts          ← Booking, BookingStatus, Payment, TimeSlot, ReceiptData, etc.
        clinic.models.ts           ← ClinicSettings, OperatingHours, AuditLog, AdminDashboardStats
        doctor.models.ts           ← Doctor, DoctorSchedule, DoctorBlockedDate, DoctorDayStatus
        doctor-patient-summary.models.ts ← DoctorPatientSummaryDto
        medical-record.models.ts   ← Consultation, VitalSigns, Diagnosis, Prescription, Allergy, LabRequest, LabResult, FollowUp, VaccinationRecord
        notification.models.ts     ← Announcement, Review, Notification
        patient.models.ts          ← PatientSummary, PatientDetail, CreatePatientRequest, PagedResult
        patient-clinical-history.models.ts ← PatientClinicalHistoryDto (full aggregate)
        patient-documents.models.ts ← PatientDocument, PatientLabResult, PatientMedicalRecord, PatientPrescription
        vaccination.models.ts      ← PatientVaccinationDto, VaccinationStatus, VaccinationSource + option constants
      services/                    ← All singleton services (see Section 5)
      utils/
        clinical-role.util.ts      ← resolveClinicalRole(), getClinicalRoleBadge(), canEdit*() helpers
      version.ts                   ← APP_VERSION = '54e9c87' (auto-generated git hash)
    dev/
      design-system-gallery/       ← DesignSystemGalleryPage (no auth guard — see Known Issues)
      dev.routes.ts
    layouts/                       ← Legacy layout shells (admin, doctor, staff, public); actual layouts live in shared/ and patient/
    portals/
      admin/                       ← Admin portal (pages + components + services)
      doctor/                      ← Doctor portal (pages + components + service)
      patient/                     ← Patient portal (pages + components + service)
      public/                      ← Public portal (pages + components + services + utils)
      staff/                       ← Staff portal (pages + components + service)
    shared/
      components/                  ← 18 reusable UI components (see Section 15)
      pages/not-found/             ← NotFoundPage (404)
      pipes/                       ← PesoPipe, TimeSlotPipe, PatientCodePipe
      validators/                  ← passwordStrengthValidator, getPasswordStrength()
  assets/                          ← Static assets
  environments/
    environment.ts                 ← Dev config
    environment.prod.ts            ← Prod config
  firebase-messaging-sw.js         ← FCM service worker
  global.scss                      ← Global Ionic overrides
  index.html                       ← SPA shell
  main.ts                          ← bootstrapApplication()
  manifest.webmanifest             ← PWA manifest
  styles.scss                      ← CSS custom properties (design tokens)
```

---

## 3. Route Map — All Portals

### Root Routes (`app.routes.ts`)

| Path | Lazy Children | Guards |
|---|---|---|
| `` | → `/public` | None |
| `public` | `PUBLIC_ROUTES` | None |
| `auth` | `AUTH_ROUTES` | None |
| `admin` | `ADMIN_ROUTES` | `authGuard`, `roleGuard` (Admin), `firstLoginGuard` |
| `staff` | `STAFF_ROUTES` | `authGuard`, `roleGuard` (Staff) |
| `doctor` | `DOCTOR_ROUTES` | `authGuard`, `roleGuard` (Doctor) |
| `patient` | `PATIENT_ROUTES` | `authGuard`, `roleGuard` (Patient) |
| `dev` | `DEV_ROUTES` | None |
| `**` | `NotFoundPage` | None |

### Auth Routes (`/auth/*`)

| Path | Component | Guards |
|---|---|---|
| `login` | `LoginPage` | None |
| `register` | `RegisterPage` | None |
| `callback` | `AuthCallbackPage` | None |
| `forgot-password` | `ForgotPasswordPage` | None |
| `reset-password` | `ResetPasswordPage` | None |
| `set-password` | `SetPasswordPage` | `authGuard` |
| `privacy-consent` | `PrivacyConsentPage` | `authGuard`, `roleGuard` (Patient) |

### Public Routes (`/public/*`)

| Path | Component |
|---|---|
| `` | `HomePage` |
| `doctors` | `DoctorsPage` |
| `doctors/:id` | `DoctorProfilePage` |
| `services` | `ServicesPage` |
| `announcements` | `AnnouncementsPage` |
| `booking` | `BookingPage` (multi-step wizard) |
| `booking-confirmation/:bookingId` | `BookingConfirmationPage` |
| `privacy-policy` | `PrivacyPolicyPage` |

### Admin Routes (`/admin/*`) — all under `PortalLayoutComponent`

| Path | Component | Title |
|---|---|---|
| `dashboard` | `DashboardPage` | Dashboard |
| `bookings` | `BookingsPage` | Bookings |
| `bookings/:id` | `BookingDetailPage` | Booking Detail |
| `walk-in` | `WalkInPage` | Walk-In |
| `calendar` | `CalendarPage` | Calendar |
| `doctors` | `DoctorsPage` | Doctors |
| `doctors/new` | `DoctorFormPage` | Add Doctor |
| `doctors/:id/edit` | `DoctorFormPage` | Edit Doctor |
| `services` | `ServicesPage` | Services |
| `patients` | `PatientsPage` | Patients |
| `patients/:id` | `PatientDetailPage` | Patient Detail |
| `staff` | `StaffPage` | Staff Accounts |
| `announcements` | `AnnouncementsPage` | Announcements |
| `settings` | `SettingsPage` | Settings |
| `audit-logs` | `AuditLogsPage` | Audit Logs |
| `reports` | `ReportsPage` | Reports |

**Admin nav items (sidebar):** Dashboard, Bookings, Walk-In, Calendar, Patients, Doctors, Services, Staff Accounts, Announcements, Reports, Audit Logs, Settings

### Doctor Routes (`/doctor/*`) — all under `PortalLayoutComponent`

| Path | Component |
|---|---|
| `dashboard` | `DoctorDashboardPage` |
| `appointments` | `DoctorAppointmentsPage` |
| `appointments/:id` | `DoctorAppointmentDetailPage` |
| `patients` | `DoctorPatientsPage` |
| `patients/:id` | `DoctorPatientDetailPage` |
| `schedule` | `DoctorSchedulePage` |
| `consultation/:bookingId` | `DoctorConsultationPage` |
| `profile` (also `my-profile`) | `DoctorProfilePage` |

**Doctor nav items:** Dashboard, Appointments, Patients, Schedule, My Profile

### Patient Routes (`/patient/*`) — all under `PatientLayoutComponent`

| Path | Component |
|---|---|
| `dashboard` | `PatientDashboardPage` |
| `doctors` | `PatientDoctorsPage` |
| `bookings` | `PatientBookingsPage` |
| `bookings/:id` | `PatientBookingDetailPage` |
| `documents` | `PatientDocumentsPage` |
| `lab-results` | `PatientLabResultsPage` |
| `labs` | `PatientLabsRedirectPage` (redirect alias) |
| `medical-records` | `PatientMedicalRecordsPage` |
| `prescriptions` | `PatientPrescriptionsPage` |
| `vaccinations` | `PatientVaccinationsPage` (currently empty — stub) |
| `profile` | `PatientProfilePage` |
| `reviews/:bookingId` | `PatientReviewsPage` |
| `privacy-consent` | `PatientPrivacyConsentPage` |

**Patient nav items:** Dashboard, Doctors, Bookings, My Documents, My Lab Results, Medical Records, Prescriptions, Vaccinations, Profile

### Staff Routes (`/staff/*`) — all under `PortalLayoutComponent`

| Path | Component |
|---|---|
| `dashboard` | `StaffDashboardPage` |
| `bookings` | `StaffBookingsPage` |
| `bookings/:id` | `StaffBookingDetailPage` |
| `payments` | `StaffPaymentsPage` |
| `walk-in` | `StaffWalkInPage` |
| `patients` | `StaffPatientsPage` |
| `patients/:id` | `StaffPatientDetailPage` |
| `doctor-status` | `DoctorStatusPage` |
| `profile` | `StaffProfilePage` |

**Staff nav items:** Dashboard, Today Bookings, Payments, Walk-In, Patients, Doctor Status, My Profile

### Dev Routes (`/dev/*`)

| Path | Component | Guards |
|---|---|---|
| `gallery` | `DesignSystemGalleryPage` | **None** — exposed in production |

---

## 4. Auth Flow & Guards

### Login Flow (email/password)

1. `POST /auth/login` with `{ email, password }` → `AuthSessionDto`
2. `TokenService.setTokens(accessToken, refreshToken)` → persists to `localStorage` (`clinic.auth.access-token`, `clinic.auth.refresh-token`)
3. `AuthStateService.setUser(authUser)` → stores in BehaviorSubject + calls `AuthService.persistUser()` → `localStorage` key `clinic.auth.user`
4. `AuthService.navigateByRole()` → redirects to role home

### App Initialisation (reload)

`APP_INITIALIZER` (`initializeAuthSession` in `app.config.ts`):
1. Reads tokens from `localStorage`
2. If tokens exist → `GET /auth/me` → hydrates `AuthStateService`
3. On failure → `authState.logout()`

### Social Login (Google / Facebook)

- Google: loads GIS script lazily → `requestAccessToken()` → `POST /auth/google` with `{ provider, idToken, accessToken }`
- Facebook: loads FB SDK lazily → `FB.login()` → `POST /auth/facebook` with `{ accessToken, userId }`
- Both → same store-tokens → set-user → navigate-by-role sequence

### Token Refresh (`authInterceptor`)

- Attaches `Authorization: Bearer <accessToken>` to all non-public requests
- On 401: calls `POST /auth/refresh-token` with `{ refreshToken }`, updates tokens, retries original request once (guarded by `AUTH_RETRY_ATTEMPTED` context token)
- On refresh failure: `authService.clearSession()` + navigate to `/auth/login`

**Public endpoints (no auth header):** `/auth/login`, `/auth/register`, `/auth/register-patient`, `/auth/google`, `/auth/refresh`, `/auth/logout`

### Role Detection (`AuthService.resolveRole()`)

1. `normalizeRole()` on `AuthUserDto.role` string
2. Falls back to JWT decode — checks `role`, `Role`, `roles`, or Microsoft claim URI
3. Throws `Unable to determine authenticated user role.` if neither succeeds

Valid roles: `'Admin' | 'Staff' | 'Doctor' | 'Patient'` (case-insensitive, normalised to title-case)

### Logout

`AuthStateService.logout()`:
1. Clears user BehaviorSubject → `null`
2. Clears error and loading BehaviorSubjects
3. `AuthService.clearSession()` → removes all 3 localStorage keys
4. **No `POST /auth/logout` is called** — server-side refresh token revocation is NOT guaranteed

### Token Storage

| Token | Key | Storage |
|---|---|---|
| Access token | `clinic.auth.access-token` | `localStorage` + in-memory |
| Refresh token | `clinic.auth.refresh-token` | `localStorage` + in-memory |
| User object | `clinic.auth.user` | `localStorage` |

### Guards

| Guard | File | Logic |
|---|---|---|
| `authGuard` | `core/guards/auth.guard.ts` | `isAuthenticated$` → false → `/auth/login` |
| `roleGuard` | `core/guards/role.guard.ts` | `userRole$` vs `route.data.roles` → no match → `/auth/login` |
| `firstLoginGuard` | `core/guards/first-login.guard.ts` | `user.isFirstLogin === true` → `/auth/set-password` |

**Guard combinations:**

| Route prefix | Guards |
|---|---|
| `/admin/*` | `authGuard` + `roleGuard` (Admin) + `firstLoginGuard` (applied at both app and child route level) |
| `/staff/*` | `authGuard` + `roleGuard` (Staff) + `firstLoginGuard` (applied at app route level) |
| `/doctor/*` | `authGuard` + `roleGuard` (Doctor) + `firstLoginGuard` (applied at app route level) |
| `/patient/*` | `authGuard` + `roleGuard` (Patient) + `firstLoginGuard` (applied at app route level) |
| `/auth/set-password` | `authGuard` only |
| `/auth/privacy-consent` | `authGuard` + `roleGuard` (Patient) |
| `/public/*` | None |
| `/dev/*` | None |

---

## 5. Core Services

All services are `@Injectable({ providedIn: 'root' })`. All use `inject()` (not constructor injection).

### `ApiService` (`core/services/api.service.ts`)

The single HTTP gateway. All API calls go through this — never direct `HttpClient`.

**Methods:**

| Method | Signature | Purpose |
|---|---|---|
| `get<T>` | `(endpoint, params?)` | Standard GET |
| `post<T>` | `(endpoint, payload?)` | Standard POST |
| `put<T>` | `(endpoint, payload?)` | Standard PUT |
| `patch<T>` | `(endpoint, payload?)` | Standard PATCH |
| `delete<T>` | `(endpoint)` | Standard DELETE |
| `getBlob` | `(endpoint, params?)` | File download → `Blob` |
| `postBlob` | `(endpoint, payload?)` | POST → `Blob` |
| `getBlobResponse` | `(endpoint, params?)` | GET → `HttpResponse<Blob>` (with headers) |
| `postBlobResponse` | `(endpoint, payload?)` | POST → `HttpResponse<Blob>` |
| `postFormData<T>` | `(endpoint, formData)` | File upload (no Content-Type override) |
| `putFormData<T>` | `(endpoint, formData)` | PUT file upload |

**Base URL:** `environment.apiUrl || environment.apiBaseUrl` (trailing slash stripped). Double-slash prevention built in.

### `AuthStateService` (`core/services/auth-state.service.ts`)

Central auth state. BehaviorSubjects + Angular Signals.

| Observable | Signal | Type | Purpose |
|---|---|---|---|
| `currentUser$` | `currentUser` | `AuthUser \| null` | Current logged-in user |
| `isAuthenticated$` | `isAuthenticated` | `boolean` | Derived from user |
| `userRole$` | `userRole` | `Role \| null` | Derived from user.role |
| `isLoading$` | — | `boolean` | Loading state |
| `error$` | — | `string \| null` | Error state |

**Key methods:** `setUser()`, `patchUser()`, `logout()`, `hasRole()`, `clearState()`, `snapshot` (sync getter)

### `TokenService` (`core/services/token.service.ts`)

Manages JWT storage. In-memory cache + `localStorage`.

**localStorage keys:** `clinic.auth.access-token`, `clinic.auth.refresh-token`

**Methods:** `setTokens()`, `setAccessToken()`, `setRefreshToken()`, `getAccessToken()`, `getRefreshToken()`, `clearTokens()`, `hasAccessToken()`, `hasRefreshToken()`. Backwards-compatible aliases: `setToken()`, `getToken()`, `clearToken()`, `hasToken()`.

### `AuthService` (`core/services/auth.service.ts`)

Handles social auth popup helpers, role resolution, token/ session persistence, and role-based navigation. Login/register API calls are made directly via `ApiService` from pages (e.g. `LoginPage`, `RegisterPage`), not through `AuthService`.

**Key methods:**
- `storeTokens(accessToken, refreshToken)` → persists token pair via `TokenService`
- `toAuthUser(user, accessToken?)` → maps `AuthUserDto` → `AuthUser`, resolving the role
- `navigateByRole(user)` → redirects to role home (`/admin/dashboard`, `/staff/dashboard`, etc.)
- `persistUser(user)` → `localStorage.setItem('clinic.auth.user', ...)`
- `clearSession()` → clears all 3 localStorage keys
- `getGoogleTokenViaPopup()` → loads Google Identity Services script, returns `{ idToken?, accessToken }` via popup
- `getFacebookTokenViaPopup()` → loads Facebook JS SDK, returns `{ accessToken, userId }` via popup
- `resolveRole(roleValue, accessToken?)` → determines `Role` from backend string or JWT claim

### `BookingService` (`core/services/booking.service.ts`)

Booking list cache + all booking CRUD + consultation record.

**State:** `BehaviorSubject<Booking[]>` (local cache), `BehaviorSubject<boolean>` (loading)

**Key request/response types:**
- `BookingFilters` — `doctorId?, patientId?, status?, paymentStatus?, appointmentDate?, fromDate?, toDate?, search?, page?, pageSize?`
- `CreateBookingRequest` — `doctorId, serviceIds?, appointmentDate, slotStartTime, slotEndTime, paymentMode?, notes?`
- `DoctorCompleteBookingRequest` — `finalAmount?, isProfessionalFeeWaived, professionalFeeWaivedReason?, vitalSigns?, soap?, diagnoses?, prescriptions?, labRequests?, vaccinations?, followUp?`
- `ConsultationRecordUpdateRequest` — full consultation data structure for auto-save
- `ConsultationRecordResponse` — full consultation data returned from GET

**Key methods:**
- `getBookings(filters?)` — fetches booking list and updates local cache
- `getBookingById(id)` — synchronous lookup from local cache
- `getBookingById$(id)` — fetches from API and returns observable
- `getBookingsByStatus(status)`, `getBookingsByDoctorId(doctorId)`, `getBookingsByPatientId(patientId)` — filtered cache lookups
- `getTodaysBookings()`, `getTodaysBookingsByDoctorId(doctorId)`, `getUpcomingBookingsByDoctorId(doctorId)` — date-filtered lookups
- `getStaffTodayBookings(filters)` — paginated API call for staff dashboard
- `getStaffBookings(filters)` — paginated API call for staff bookings list
- `getStaffForPayment(page, pageSize)` — paginated API call for staff payment queue
- `refresh(filters?)` — reloads from API and replaces local cache

**Booking mutations are NOT handled by `BookingService`.** All create, update, cancel, check-in, confirm, complete, no-show, and waive actions are called directly via `ApiService` from portal pages:
- `POST /bookings` — from `BookingPage`, `WalkInPage` (in-page ApiService calls)
- `PATCH /bookings/{id}/check-in` — from `StaffDashboardPage`, `StaffBookingDetailPage`
- `PATCH /bookings/{id}/undo-check-in` — from staff pages
- `PATCH /bookings/{id}/confirm` — from `AdminBookingDetailPage`
- `PATCH /bookings/{id}/cancel` — from `AdminBookingDetailPage`, `PatientBookingDetailPage`
- `PATCH /bookings/{id}/complete` — from `AdminBookingDetailPage`
- `PATCH /bookings/{id}/no-show` — from `AdminBookingDetailPage`
- `PATCH /bookings/{id}/doctor-complete` — from `DoctorConsultationPage`, `DoctorAppointmentsPage`
- `POST /bookings/{id}/consultation-record` (auto-save) — from `DoctorConsultationPage`
- `PATCH /payments/{bookingId}/waive` — from staff/doctor pages

### `BookingWizardService` (`core/services/booking-wizard.service.ts`)

Multi-step public booking wizard state.

**State:** `BehaviorSubject<BookingWizardState>` — holds selected doctor, service(s), date, slot, payment mode, proof.

**Methods:** `setDoctor()`, `setServices()`, `setDate()`, `setSlot()`, `setPaymentMode()`, `setProof()`, `reset()`, `getSnapshot()`

### `ClinicSettingsService` (`core/services/clinic-settings.service.ts`)

Clinic settings cache. **No API fetch on startup** — initialises with hardcoded defaults.

**State:** `BehaviorSubject<ClinicSettings>` seeded with hardcoded defaults (`primaryColor: '#5D3E8E'`, `secondaryColor: '#2563eb'`).

**Methods:** `load()` → synchronous getter (returns `this.settingsSubject.value`), `setSettings(settings)` → updates the subject, `bumpConsentVersion()` → increments minor version.

**Known issue:** Settings are never fetched from the API on app startup. See Section 24 item 3.

### `NotificationService` (`core/services/notification.service.ts`)

In-app notification list (distinct from FCM push). Notifications are received from `PushNotificationService.notifications$` stream — no polling or API fetching from this service.

**State:** `BehaviorSubject<Notification[]>`

**Methods:** `setNotifications(notifications)`, `replaceNotifications(notifications)`, `markRead(id)` (local only), `markAllRead(userId?)` (local only), `refresh()` (state-only sort).

Clears array reactively when `currentUser$` emits `null` (on logout). Merges with live notifications from `PushNotificationService`.

### `PushNotificationService` (`core/services/push-notification.service.ts`)

Firebase FCM + foreground notification handler. Notifications merged into `NotificationService` via stream.

**State:** `BehaviorSubject<InAppNotification[]>`, `BehaviorSubject<number>` (unread count), `BehaviorSubject<boolean>` (device registered)

**Methods:** `registerDevice()` → async, registers browser for FCM push; `markRead(notificationId)` (local); `markAllRead()` (local); `get notificationSnapshot`.

### `ClinicDashboardRealtimeService` (`core/services/clinic-dashboard-realtime.service.ts`)

Persistent SignalR hub connection to `environment.signalrHubUrl`.

**Events stream:** `events$: Observable<ClinicDashboardEvent>`

**Events:** `BookingCreated`, `BookingCancelled`, `PatientCheckedIn`, `PatientCheckInUndone`, `DoctorCompletedConsultation`, `PaymentCompleted`, `PaymentWaived`, `DoctorScheduleUpdated`, `DoctorServicesUpdated`, `PatientProfileUpdated`

Consumed by all portal dashboards to refresh data live without page reload.

### `RealtimeInitService` (`core/services/realtime-init.service.ts`)

Activated by `PortalLayoutComponent` on login. Connects both `ClinicDashboardRealtimeService` and `PushNotificationService`.

### `MedicalRecordsService` (`core/services/medical-records.service.ts`)

All medical record API calls (consultations, prescriptions, allergies, lab orders, lab results, vaccinations, follow-ups).

**Key methods:** `getConsultations(patientId)`, `getPrescriptions(patientId)`, `getAllergies(patientId)`, `getLabOrders(patientId)`, `getLabResults(patientId)`, `getVaccinations(patientId)`, `getFollowUps(patientId)`, `getPatientMedicalRecords()` → `/medical-records/me`, `getPatientPrescriptions()` → `/prescriptions/me`

### `PatientDocumentsService` (`core/services/patient-documents.service.ts`)

Patient documents and lab results upload/download.

**Methods:** `getDocuments(bookingId?)`, `uploadDocument(request)`, `getDocumentFile(patientId, documentId)` → blob, `getLabResults(bookingId?)`, `uploadLabResult(request)`, `getLabResultFile(patientId, labResultId)` → blob, `getDownloadUrl()` (helper — currently unused in UI)

### `PatientVaccinationsService` (`core/services/patient-vaccinations.service.ts`)

**All methods are stubs.** Returns `of([])` for all reads. Create/update/delete throw `Error('not available yet — patient_vaccinations table not deployed')`.

### `PatientClinicalHistoryService` (`core/services/patient-clinical-history.service.ts`)

Local pure-function service. Builds the `PatientClinicalHistoryDto` aggregate from raw data fetched by pages. No API calls. Deduplicates prescriptions. Used by consultation page and patient detail pages.

**Key method:** `buildPatientClinicalHistory(args: { patientId, patientRow, bookingRows, records, extraPrescriptions? })` → `PatientClinicalHistoryDto`

### `DrugInteractionService` (`core/services/drug-interaction.service.ts`)

Local drug-allergy and drug-drug interaction checker. **No API calls** — uses local heuristic logic only with in-memory cache.

**Methods:**
- `evaluateAllergyConflict(drugName, allergies)` → checks drug name/class against patient allergies
- `evaluateDrugInteractions(items)` → checks prescription item list for known class interactions
- `getCachedAllergyConflict(key)` / `setAllergyConflict(key, conflict)` — in-memory cache
- `getCachedInteractionResult(key)` / `setInteractionResult(key, result)` — in-memory cache

Drug classes detected: `penicillin`, `cephalosporin`, `macrolide`, `fluoroquinolone`, `nsaid`, `opioid`, `steroid`

### `OfflineConsultationQueueService` (`core/services/offline-consultation-queue.service.ts`)

IndexedDB-backed queue for consultation auto-save when offline.

**Store:** `clinic-consultation-queue` database, `draft-events` object store, indexed by `bookingId` and `createdAt`.

**Methods:** `enqueue(event)`, `getLatest(bookingId)`, `listPending(bookingId?)`, `clear(bookingId?)`, `flush(bookingId, syncFn)` — dequeues and syncs latest draft to server.

**Integrates with:** `BookingService.ConsultationRecordUpdateRequest` — the `payload` field.

### `DoctorStateService` (two versions — see note)

- `core/services/doctor-state.service.ts` — global doctor list cache (used by walk-in, booking wizard, calendar, admin)
- `portals/admin/services/doctor-state.service.ts` — admin-specific doctor state; uses `GET /doctors/admin`

New code should inject from `core/services/`. The admin portal has its own local version.

### `PatientStateService` (`core/services/patient-state.service.ts`)

Patient list cache for staff/admin pages. Methods not fully documented — provides searchable patient list.

### `BookingAvailabilityService` (`portals/public/services/booking-availability.service.ts`)

Available slot fetching for the booking wizard.

**Methods:** `getAvailableSlots(doctorId, date)` → `GET /doctors/{id}/available-slots?date={date}`

### `PublicService` (`portals/public/services/public.service.ts`)

Public portal data: doctors, services, announcements, reviews, clinic settings.

### Admin Portal Services (`portals/admin/services/`)

| Service | Purpose |
|---|---|
| `AdminDoctorsService` | Doctor CRUD for admin: `GET /doctors/admin`, `POST /doctors`, `PUT /doctors/{id}`, schedule, photo |
| `AdminPatientsService` | Patient CRUD: `GET /patients`, `POST /patients`, portal account creation |
| `AdminReportsService` | `GET /reports/*` endpoints |
| `AdminServicesService` | Service CRUD: `GET /services`, `POST /services`, `PUT /services/{id}` |
| `AdminSettingsService` | `GET /settings`, `PUT /settings` |
| `DoctorStateService` (admin) | Admin doctor list cache |

### Portal Services

| Service | File | Purpose |
|---|---|---|
| `DoctorService` | `portals/doctor/services/doctor.service.ts` | Doctor self-service: profile, schedule, blocked dates, day status |
| `PatientService` | `portals/patient/services/patient.service.ts` | Patient self-service: profile, consent, bookings |
| `StaffService` | `portals/staff/services/staff.service.ts` | Staff bookings, payments, walk-in, doctor status management |

---

## 6. State Management

### Global BehaviorSubjects (singletons)

| Service | Subject | Type |
|---|---|---|
| `AuthStateService` | `userSubject` | `BehaviorSubject<AuthUser \| null>` |
| `AuthStateService` | `loadingSubject` | `BehaviorSubject<boolean>` |
| `AuthStateService` | `errorSubject` | `BehaviorSubject<string \| null>` |
| `TokenService` | in-memory fields | `string \| null` |
| `BookingService` | bookings cache | `BehaviorSubject<Booking[]>` |
| `BookingWizardService` | wizard state | `BehaviorSubject<BookingWizardState>` |
| `ClinicSettingsService` | settings | `BehaviorSubject<ClinicSettings>` |
| `NotificationService` | notifications | `BehaviorSubject<Notification[]>` |
| `PushNotificationService` | push notifications, unread count | `BehaviorSubject<InAppNotification[]>`, `BehaviorSubject<number>` |
| `ClinicDashboardRealtimeService` | events stream | `Subject<ClinicDashboardEvent>` |
| `DrugInteractionService` | allergy/interaction cache | `Map<string, ...>` (in-memory) |

### Angular Signals (from `AuthStateService`)

| Signal | Type |
|---|---|
| `currentUser` | `Signal<AuthUser \| null>` |
| `isAuthenticated` | `Signal<boolean>` |
| `userRole` | `Signal<Role \| null>` |

### Per-Page State

Most pages are fully standalone — they inject services and maintain their own local properties (`isLoading: boolean`, `error: string | null`, data arrays) rather than subscribing to global streams. Exception: booking wizard uses `BookingWizardService` shared state.

### Subscription Cleanup

Two patterns coexist:
- **Preferred (Angular 17):** `takeUntilDestroyed(this.destroyRef)` — in most new pages
- **Legacy:** `takeUntil(this.ngUnsubscribe)` via `BaseComponent` — in some admin pages

Do not mix in the same component. New code should use `takeUntilDestroyed`.

### State Cleared on Logout

`AuthStateService.logout()` clears user, error, loading subjects, and tokens from localStorage. `NotificationService` clears its array reactively when `currentUser$` emits `null`. `BookingWizardService.reset()` is called at the start of each new booking session.

---

## 7. Data Models / Entities

### `AuthUser` (`auth.models.ts`)

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Backend userId |
| `fullName` | `string` | |
| `email` | `string` | |
| `role` | `Role` | `'Admin' \| 'Staff' \| 'Doctor' \| 'Patient'` |
| `clinicalRole` | `ClinicalRole?` | `'physician' \| 'nurse' \| 'medical_assistant' \| 'admin' \| 'receptionist'` — not populated from API |
| `avatarUrl` | `string?` | |
| `isFirstLogin` | `boolean` | Drives `firstLoginGuard` |
| `phoneNumber` | `string?` | |

### `Booking` (`booking.models.ts`)

Key fields: `id`, `patientId`, `doctorId`, `serviceId`, `serviceIds[]`, `services: BookingServiceItem[]`, `appointmentDate` (ISO `YYYY-MM-DD`), `slotStartTime/slotEndTime` (`HH:MM`), `status: BookingStatus`, `paymentStatus: PaymentStatus`, `paymentMode: PaymentMode`, `queueNumber: number | null`, `totalFee`, `finalAmount`, `amountDue`, `consultationFeeSnapshot`, `serviceFeeSnapshot`, `isWalkIn`, `proofType`, `proofValue`, `cancellationReason`, `orNumber`, `checkedInAt`, `doctorCompletedAt`, `isProfessionalFeeWaived`, `patient?: BookingPatientInfo`, `doctor?: BookingDoctorInfo`, `payment?: Payment`

**`BookingStatus` values:** `Pending`, `ProofSubmitted`, `Confirmed`, `CheckedIn`, `InProgress`, `OnHold`, `Cancelled`, `Completed`, `Expired`, `NoShow`, `Rescheduled`

**`PaymentStatus` values:** `Unpaid`, `Paid`, `Waived`, `Refunded`

**`PaymentMode` values:** `Online`, `PayAtClinic`

**`PaymentMethod` values:** `Cash`, `GCash`, `Maya`, `BankTransfer`, `PayAtClinic`

### `Doctor` (`doctor.models.ts`)

Key fields: `id`, `userId`, `fullName`, `specialization`, `bio?`, `profilePhotoUrl?`, `licenseNumber?`, `ptrNumber?`, `s2Number?`, `consultationFee`, `slotDurationMinutes`, `slotCapacity`, `dailyPatientLimit: number | null`, `status: DoctorStatus` (`Active | Inactive | OnLeave`), `workingDays?`, `schedule?`, `averageRating?`, `reviewCount?`

**`AvailabilityStatus` values:** `Available`, `RunningLate`, `UnavailableToday`

### `PatientDetail` / `Patient` (`patient.models.ts`)

Key fields: `id`, `patientCode`, `firstName`, `middleName?`, `lastName`, `dateOfBirth`, `sex`, `civilStatus?`, `address?`, `city?`, `zipCode?`, `contactNumber?`, `email?`, `emergencyContactName/Number/Relationship?`, `bloodType?`, `philHealthNumber?`, `hmoProvider?`, `hmoCardNumber?`, `userId?`, `hasAccount?`, `isEmailVerified?`, `isGuest`, `consentedAt?`, `consentVersion?`

### `Consultation` (`medical-record.models.ts`)

Key fields: `id`, `bookingId`, `patientId`, `doctorId`, `consultationDate`, `chiefComplaint`, `subjective`, `objective`, `assessment`, `plan`, `vitalSigns?: VitalSigns`, `diagnoses: Diagnosis[]`, `prescriptionIds[]`, `labRequestIds[]`, `followUpDate?`, `status: 'Draft' | 'Completed' | 'Locked' | 'Amended'`, `isLocked`, `prescriptions?: Prescription[]`, `labRequests?: LabRequest[]`

### `VitalSigns` (`medical-record.models.ts`)

Fields: `bloodPressureSystolic?`, `bloodPressureDiastolic?`, `heartRate?`, `respiratoryRate?`, `temperatureCelsius?`, `oxygenSaturation?`, `weightKg?`, `heightCm?`, `bmi?`, `painScore?`, `takenAt?`

### `Prescription` / `PrescriptionItem` (`medical-record.models.ts`)

`PrescriptionItem` key fields: `medicineName`, `genericName?`, `dosageForm`, `strength`, `quantity`, `sig`, `frequency?`, `frequencyCode?`, `duration?`, `route?`, `routeDescription?`, `instructions?`, `isControlledSubstance?`, `brandName?`

### `Diagnosis` (`medical-record.models.ts`)

Fields: `id`, `code`, `description`, `type: DiagnosisType` (`Primary | Secondary | Differential | Comorbidity`), `icd10Code?`, `icd10Description?`

### `Allergy` (`medical-record.models.ts`)

Fields: `id`, `patientId`, `allergen`, `reaction`, `severity: AllergySeverity` (`Mild | Moderate | Severe`), `allergenType?: AllergenType` (`Drug | Food | Environmental | Other`), `allergenName?`, `notes?`

### `PatientVaccinationDto` (`vaccination.models.ts`)

Key fields: `id`, `patientId`, `vaccineName`, `manufacturer?`, `lotNumber?`, `administeredDate`, `doseNumber?`, `doseAmount?`, `doseUnit?`, `route?`, `site?`, `status: VaccinationStatus` (`Completed | NotDone | EnteredInError`), `source: VaccinationSource` (`AdministeredInClinic | Historical | PatientReported | ExternalRecord`), `nextDueDate?`, `notes?`, `reactionNotes?`

**Constants exported:** `VACCINATION_STATUS_OPTIONS`, `VACCINATION_SOURCE_OPTIONS`, `VACCINATION_ROUTE_OPTIONS`, `VACCINATION_SITE_OPTIONS`, `VACCINATION_DOSE_UNIT_OPTIONS`, `defaultCreateVaccinationPayload()`

### `ClinicSettings` (`clinic.models.ts`)

Key fields: `clinicName`, `logoUrl?`, `primaryColor` (default `#5D3E8E`), `secondaryColor` (default `#2563eb`), `address?`, `phone?`, `email?`, `facebookUrl?`, `instagramUrl?`, `operatingHours: OperatingHours` (per-day `{ isOpen, openTime, closeTime }`), `cancellationDeadlineHours`, `patientPortalEnabled`, `vaccinationReminderEnabled`, `followUpReminderEnabled`, `isPayAtClinicMode`, `payAtClinicNoShowWindowMinutes`, `privacyPolicyText?`, `consentVersion`, `paymentSettings: PaymentSettings` (GCash/Maya/Bank QR and account details)

### `AuditLog` (`clinic.models.ts`)

Fields: `id`, `entityType` (`Booking | Patient | Doctor | Payment | Settings | Consultation`), `entityId`, `action`, `performedBy`, `performedAt`, `details?`

### `PatientClinicalHistoryDto` (`patient-clinical-history.models.ts`)

Full aggregate type with: `patient`, `summary`, `timeline[]`, `appointments[]`, `consultations[]`, `documents[]`, `labResults[]`, `vaccinations[]`, `followUps[]`, `prescriptions[]`

Built locally by `PatientClinicalHistoryService.buildPatientClinicalHistory()` — not fetched directly from a single API endpoint.

### `ReceiptData` (`booking.models.ts`)

Print data for receipts: `orNumber`, `patientName`, `doctorName`, `services[]`, `appointmentDate`, `amountPaid`, `paymentMethod`, `referenceNumber`, `cashierName`, `clinicName`, `clinicAddress`, `isWaived`, `waivedReason`, `queueNumber`, `consultationFee`, `serviceFee`, `totalFee`, `paymentStatus`

---

## 8. API Surface — Complete Endpoint Reference

Base URL: `environment.apiUrl` (dev: `https://localhost:44384/api`, prod: `https://api.yourclinicdomain.com/api`). Bearer token attached by `authInterceptor`.

### Auth

| Method | Endpoint | Triggered By | Returns |
|---|---|---|---|
| POST | `/auth/login` | Login form | `AuthSessionDto` |
| POST | `/auth/register` or `/auth/register-patient` | Register form | `AuthSessionDto` |
| POST | `/auth/google` | Google popup | `AuthSessionDto` |
| POST | `/auth/facebook` | Facebook popup | `AuthSessionDto` |
| GET | `/auth/me` | App init, set-password | `AuthUserDto` |
| POST | `/auth/refresh-token` | 401 interceptor | `RefreshTokenDto` |
| POST | `/auth/forgot-password` | Forgot password form | void |
| POST | `/auth/reset-password` | Reset password form | void |
| POST | `/auth/set-password` | First-login form | void |
| POST | `/auth/change-password` | Profile pages | void |
| POST | `/auth/avatar` | Staff/Patient avatar upload | `{ avatarUrl }` |

### Bookings

| Method | Endpoint | Triggered By | Returns |
|---|---|---|---|
| GET | `/bookings` | Admin, various (with optional filters) | `Booking[]` or paged |
| GET | `/bookings/{id}` | Detail pages | `Booking` |
| POST | `/bookings` | Patient booking wizard | Created `Booking` |
| POST | `/bookings/walk-in` | Staff/Admin walk-in | Created `Booking` |
| GET | `/bookings/doctor/today` | Doctor dashboard/appointments | `Booking[]` |
| GET | `/bookings/doctor/today-summary` | Doctor dashboard/appointments | `DoctorTodaySummary` |
| GET | `/bookings/doctor/patients` | Doctor patients page | `DoctorPatientSummaryDto[]` |
| GET | `/bookings/staff/today` | Staff dashboard | Paged `Booking[]` |
| GET | `/bookings/staff/all` | Staff bookings page | Paged `Booking[]` |
| GET | `/bookings/staff/for-payment` | Staff payments page | Paged `StaffForPaymentItem[]` |
| GET | `/bookings/{id}/public-summary` | Public booking confirmation | Public summary |
| GET | `/bookings/{id}/consultation-record` | Doctor consultation, patient detail | `ConsultationRecordResponse` |
| PUT | `/bookings/{id}/consultation-record` | Doctor consultation auto-save | `ConsultationRecordResponse` |
| PATCH | `/bookings/{id}/confirm` | Admin booking detail | Updated `Booking` |
| PATCH | `/bookings/{id}/cancel` | Admin, Staff, Patient | Updated `Booking` |
| PATCH | `/bookings/{id}/check-in` | Staff | Updated `Booking` |
| PATCH | `/bookings/{id}/undo-check-in` | Staff | Updated `Booking` |
| PATCH | `/bookings/{id}/doctor-complete` | Doctor | Updated `Booking` |
| PATCH | `/bookings/{id}/complete` | Admin | Updated `Booking` |
| PATCH | `/bookings/{id}/no-show` | Admin | Updated `Booking` |
| PUT | `/bookings/{id}/waive` | Admin | Updated `Booking` |
| PUT | `/bookings/{id}/refund` | Admin | Updated `Booking` |

### Payments

| Method | Endpoint | Triggered By | Returns |
|---|---|---|---|
| GET | `/payments/{id}` | Staff/Patient booking detail | `Payment` |
| PATCH | `/payments/{bookingId}/confirm` | Staff booking detail, Staff payments | `Payment` |
| PATCH | `/payments/{bookingId}/waive` | Staff, Doctor | Updated payment |

### Patients

| Method | Endpoint | Triggered By | Returns |
|---|---|---|---|
| GET | `/patients` | Admin/Staff patient list | Paged `PatientSummary[]` |
| GET | `/patients/{id}` | Admin, Staff, Doctor | `PatientDetail` |
| GET | `/patients/me` | Patient portal | `PatientDetail` |
| POST | `/patients` | Walk-in, Admin create | Created `PatientDetail` |
| PUT | `/patients/{id}` | Admin edit | Updated `PatientDetail` |
| PUT | `/patients/me` | Patient profile save | Updated `PatientDetail` |
| POST | `/patients/me/consent` | Patient profile | Consent record |
| POST | `/patients/{id}/portal-account` | Staff patient detail | Portal account result |
| GET | `/patients/me/documents` | Patient documents page | `PatientDocument[]` |
| POST | `/patients/me/documents` | Patient documents upload | Created `PatientDocument` |
| GET | `/patients/{id}/documents/{docId}/file` | Preview/download | Blob |
| GET | `/patients/me/lab-results` | Patient lab results page | `PatientLabResult[]` |
| POST | `/patients/me/lab-results` | Lab result upload | Created `PatientLabResult` |
| GET | `/patients/{id}/lab-results/{id}/file` | Preview/download | Blob |

### Doctors

| Method | Endpoint | Triggered By | Returns |
|---|---|---|---|
| GET | `/doctors` | Home, Walk-in, Booking wizard, Calendar | `Doctor[]` |
| GET | `/doctors/admin` | Admin doctors, services, doctor form | `Doctor[]` (admin-enriched) |
| GET | `/doctors/me` | Doctor dashboard, schedule, profile | Own `Doctor` |
| GET | `/doctors/{id}` | Public doctor profile | `Doctor` detail |
| POST | `/doctors` | Admin doctor form (create) | Created `Doctor` |
| PUT | `/doctors/{id}` | Admin form, Doctor schedule/profile | Updated `Doctor` |
| PUT | `/doctors/me` | Doctor profile save | Updated `Doctor` |
| POST | `/doctors/{id}/photo` | Admin doctor form, Doctor profile | `{ profilePhotoUrl }` |
| GET | `/doctors/{id}/schedule` | Admin form, Doctor schedule, Public profile | `DoctorSchedule[]` |
| PUT | `/doctors/{id}/schedule` | Admin form, Doctor schedule | Updated `DoctorSchedule[]` |
| GET | `/doctors/{id}/services` | Booking wizard, Walk-in | `Service[]` |
| GET | `/doctors/{id}/available-slots?date={date}` | Booking wizard, Walk-in | `AvailableSlot[]` |
| GET | `/doctors/{id}/blocked-dates` | Doctor schedule | `DoctorBlockedDate[]` |
| POST | `/doctors/{id}/blocked-dates` | Doctor schedule | Created `DoctorBlockedDate` |
| DELETE | `/doctors/{id}/blocked-dates/{id}` | Doctor schedule | void |
| GET | `/doctors/{id}/day-status` | Doctor dashboard | `DoctorDayStatus` |
| POST | `/doctors/{id}/day-status` | Doctor dashboard | Created/updated `DoctorDayStatus` |

### Services

| Method | Endpoint | Triggered By | Returns |
|---|---|---|---|
| GET | `/services` | Home, Admin services, Walk-in fallback, Public | `Service[]` |
| POST | `/services` | Admin services | Created `Service` |
| PUT | `/services/{id}` | Admin services | Updated `Service` |

### Medical Records

| Method | Endpoint | Triggered By | Returns |
|---|---|---|---|
| GET | `/medical-records/me` | Patient medical records | Patient's records |
| GET | `/medical-records/consultations?patientId={id}` | Doctor consultation, patient details, patient dashboard | `Consultation[]` |
| GET | `/medical-records/prescriptions?patientId={id}` | Multiple portals | `Prescription[]` |
| GET | `/medical-records/allergies?patientId={id}` | Doctor consultation, admin patient | `Allergy[]` |
| GET | `/medical-records/lab-orders?patientId={id}` | Doctor consultation | `LabRequest[]` |
| GET | `/medical-records/lab-results?patientId={id}` | Doctor consultation, patient detail, admin | `LabResult[]` |
| GET | `/medical-records/vaccinations?patientId={id}` | Doctor consultation, patient detail, admin | `VaccinationRecord[]` |
| GET | `/medical-records/follow-ups?patientId={id}` | Doctor consultation, patient detail, admin | `FollowUp[]` |
| GET | `/prescriptions/me` | Patient prescriptions page | `PatientPrescription[]` |

### Patient Documents (PDF)

| Method | Endpoint | Triggered By | Returns |
|---|---|---|---|
| GET | `/patient-documents/me/medical-records/{id}/pdf` | Patient medical records | Blob (PDF) |
| GET | `/patient-documents/me/prescriptions/{id}/pdf` | Patient prescriptions | Blob (PDF) |
| GET | `/patient-documents/me/bookings/{bookingId}/pdf` | Patient records/prescriptions | Blob (PDF) |
| GET | `/patient-documents/me/all.pdf` | Patient records/prescriptions | Blob (PDF) |

### Settings, Announcements, Reviews, Reports, Audit Logs, Notifications

| Method | Endpoint | Triggered By | Returns |
|---|---|---|---|
| GET | `/settings` | Portal layout init, settings page | `ClinicSettings` |
| PUT | `/settings` | Admin settings save | Updated `ClinicSettings` |
| GET | `/announcements` | Public announcements, Admin | `Announcement[]` |
| POST | `/announcements` | Admin | Created `Announcement` |
| PUT | `/announcements/{id}` | Admin edit/toggle | Updated `Announcement` |
| DELETE | `/announcements/{id}` | Admin | void |
| GET | `/reviews?doctorId={id}` | Public doctor profile | `Review[]` |
| GET | `/reviews?bookingId={id}` | Patient reviews | `Review[]` |
| POST | `/reviews` | Patient reviews | Created `Review` |
| GET | `/audit-logs` | Admin audit logs, Doctor consultation | `AuditLog[]` |
| POST | `/audit-logs` | Admin booking detail, Doctor consultation | Created `AuditLog` |
| GET | `/reports/unpaid-completed-visits` | Admin reports | Report rows |
| GET | `/reports/pending-follow-ups` | Admin reports | Report rows |
| GET | `/reports/daily-booking-summary` | Admin reports | Report rows |
| GET | `/notifications` | Notification panel on load | `Notification[]` |
| PUT | `/notifications/{id}/read` | Notification panel | void |
| PUT | `/notifications/read-all` | Notification panel | void |
| GET | `/doctor-day-status/{id}` | Public doctor profile | `DoctorDayStatus` |
| POST | `/doctor-day-status/{doctorId}/status` | Staff doctor-status page | Updated `DoctorDayStatus` |

### Admin — Staff Management

| Method | Endpoint | Triggered By | Returns |
|---|---|---|---|
| GET | `/admin/staff` | Admin staff page | `StaffRow[]` |
| POST | `/admin/staff/invite` | Admin staff invite form | Invite record |
| PUT | `/admin/staff/invite/{inviteId}/revoke` | Admin staff | void |
| PUT | `/admin/staff/{id}/update-status` | Admin staff activate/deactivate | `UpdateStatusResponse` |

### Consultation Requests (Beta)

| Method | Endpoint | Triggered By | Returns |
|---|---|---|---|
| POST | `/consultation-requests/request-attending-physician` | Doctor consultation (beta) | `{ ok: boolean }` |

---

## 9. Portal: Public

Layout: `PublicLayoutComponent` (navbar + footer). No auth required.

### Pages

**`/public` — `HomePage`**
- Hero section, operating hours bar, doctors grid (from `GET /doctors`), service categories (from `GET /services`), announcements, reviews
- Actions: click doctor card → `/public/doctors/{id}`, click "Book Now" → `/public/booking`

**`/public/doctors` — `DoctorsPage`**
- Full doctors list with specialty filter
- API: `GET /doctors`

**`/public/doctors/:id` — `DoctorProfilePage`**
- Doctor bio, specialization, schedule, reviews, availability status badge, "Book Now" button
- API: `GET /doctors/{id}`, `GET /doctors/{id}/schedule`, `GET /reviews?doctorId={id}`, `GET /doctor-day-status/{id}`

**`/public/services` — `ServicesPage`**
- All services grouped by category (`Consultation | Procedure | Laboratory | Diagnostic`)
- API: `GET /services`

**`/public/announcements` — `AnnouncementsPage`**
- Active announcements list
- API: `GET /announcements`

**`/public/booking` — `BookingPage` (6-step wizard)**

Steps and components:
1. `StepDoctorServiceComponent` — Select doctor (`GET /doctors`) + service(s) (`GET /doctors/{id}/services`)
2. `StepDatePickerComponent` — Pick date (filtered against schedule)
3. `StepSlotSelectComponent` — Select time slot (`GET /doctors/{id}/available-slots?date={date}`)
4. `StepAuthCheckComponent` — Login gate or continue as guest
5. `StepProofComponent` or `StepPaymentComponent` — Submit proof (online) or confirm (pay-at-clinic)
6. `StepReviewComponent` — Summary before submit

Submit: `POST /bookings`
- Logged-in → redirect to `/patient/bookings/{bookingId}`
- Guest → redirect to `/public/booking-confirmation/{bookingId}`

**`/public/booking-confirmation/:bookingId` — `BookingConfirmationPage`**
- Post-booking confirmation for guests
- API: `GET /bookings/{id}/public-summary`

**`/public/privacy-policy` — `PrivacyPolicyPage`**
- Static privacy policy display

### Public-Specific Components

| Component | Purpose |
|---|---|
| `PublicNavbarComponent` | Top nav with clinic name, logo, login button |
| `PublicFooterComponent` | Footer with contact info |
| `HeroSectionComponent` | Landing hero banner |
| `OperatingHoursBarComponent` | Clinic hours strip |
| `DoctorCardComponent` | Doctor card (photo, name, specialization, fee, rating) |
| `ServiceCategoryCardComponent` | Service category card |
| `AnnouncementCardComponent` | Announcement card |
| `ReviewCardComponent` | Doctor review card |
| `BookingWizardComponent` | Full wizard host |
| `BookingSummaryBarComponent` | Persistent step summary bar |
| `StepDoctorServiceComponent` | Wizard step 1 |
| `StepDatePickerComponent` | Wizard step 2 |
| `StepSlotSelectComponent` | Wizard step 3 |
| `StepAuthCheckComponent` | Wizard step 4 |
| `StepProofComponent` | Wizard step 5 (online proof upload) |
| `StepPaymentComponent` | Wizard step 5 (pay-at-clinic) |
| `StepReviewComponent` | Wizard step 6 |

### Utilities

`portals/public/utils/time-format.ts` — Time formatting helpers used by booking wizard.

---

## 10. Portal: Auth

Layout: `AuthLayoutComponent` (centered card shell).

### Pages

| Page | Route | Purpose |
|---|---|---|
| `LoginPage` | `/auth/login` | Email/password + Google/Facebook social login |
| `RegisterPage` | `/auth/register` | Patient self-registration |
| `AuthCallbackPage` | `/auth/callback` | OAuth redirect handler (reads hash fragment) |
| `ForgotPasswordPage` | `/auth/forgot-password` | Password recovery request |
| `ResetPasswordPage` | `/auth/reset-password` | Password reset with token from email |
| `SetPasswordPage` | `/auth/set-password` | First-login password change (guarded by `authGuard`) |
| `PrivacyConsentPage` | `/auth/privacy-consent` | Privacy policy acceptance (Patient role only) |

### Auth-Specific Notes

- `LoginPage` shows developer credential quick-fill buttons **only when `!environment.production`**
- `AuthCallbackPage` handles OAuth redirect flow (distinct from popup flow in `LoginPage`)
- All auth forms use Reactive Forms with `passwordStrengthValidator`

---

## 11. Portal: Doctor

Layout: `PortalLayoutComponent` with `DOCTOR_NAV_ITEMS`. `RealtimeInitService` activated.

### Pages

**`/doctor/dashboard` — `DoctorDashboardPage`**

Data: doctor profile, availability status badge, KPI cards (Booked, Waiting, Checked In, Completed), "Up Next" patient banner (queue number, time, service), today's queue list, weekly schedule summary.

API: `GET /doctors/me`, `GET /bookings/doctor/today`, `GET /bookings/doctor/today-summary`, `GET /doctors/{id}/schedule`, `GET /doctors/{id}/day-status`

Actions: click queue item → `/doctor/appointments/{id}`, "Start Consult" → `/doctor/consultation/{bookingId}`, "View Chart" → `/doctor/patients/{patientId}`, change availability status → `POST /doctors/{id}/day-status`

**`/doctor/appointments` — `DoctorAppointmentsPage`**

Data: stat bar (Booked, In Clinic, Waiting, Completed, No Show, Cancelled), filterable list of today's appointments.

API: `GET /bookings/doctor/today`, `GET /bookings/doctor/today-summary`

Actions: filter tabs, click row → detail, mark complete → `PATCH /bookings/{id}/doctor-complete`, waive PF → `PATCH /payments/{bookingId}/waive`

**`/doctor/appointments/:id` — `DoctorAppointmentDetailPage`**

API: `GET /bookings/{bookingId}`

**`/doctor/consultation/:bookingId` — `DoctorConsultationPage`**

The most complex page (~2900 lines). Full clinical encounter form. A separate `DoctorConsultationStubPage` (`doctor-consultation-stub.page.ts`) exists in the same directory as a lightweight placeholder.

Data: patient demographics, allergies, previous history (consultations, prescriptions, lab results, vaccinations, follow-ups), current booking, SOAP notes, vitals, diagnoses (ICD-10), prescription builder, lab request form, vaccination form, follow-up form, allergy warning banner, attending physician request (beta).

API (parallel forkJoin on load):
- `GET /doctors/me`, `GET /bookings/{id}`, `GET /bookings/{id}/consultation-record`
- `GET /medical-records/consultations?patientId=`, `GET /medical-records/prescriptions?patientId=`, `GET /medical-records/allergies?patientId=`, `GET /medical-records/lab-orders?patientId=`, `GET /medical-records/lab-results?patientId=`, `GET /medical-records/vaccinations?patientId=`, `GET /medical-records/follow-ups?patientId=`
- `GET /patients/{id}`, `GET /bookings?patientId={id}&pageSize=50`

Mutations: `PUT /bookings/{id}/consultation-record` (auto-save), `PATCH /bookings/{id}/doctor-complete` (complete), `PATCH /payments/{bookingId}/waive` (waive PF), `POST /audit-logs`, `POST /consultation-requests/request-attending-physician` (beta)

Offline: `OfflineConsultationQueueService` queues drafts to IndexedDB when offline; flushes on reconnect.

**`/doctor/patients` — `DoctorPatientsPage`**

API: `GET /bookings/doctor/patients` → `DoctorPatientSummaryDto[]`

**`/doctor/patients/:id` — `DoctorPatientDetailPage`**

Data: demographics, booking history (last 50), consultation/prescription/lab/vaccination/follow-up history, consultation record on booking selection.

API: `GET /patients/{id}`, `GET /bookings?patientId={id}&pageSize=50`, all `/medical-records/*?patientId=` endpoints, `GET /bookings/{id}/consultation-record`

**`/doctor/schedule` — `DoctorSchedulePage`**

Data: weekly schedule editor, blocked dates, slot preview, daily patient limit, unsaved indicator.

API (load): `GET /doctors/me`, `GET /doctors/{id}/schedule`, `GET /doctors/{id}/blocked-dates`

Mutations: `PUT /doctors/{id}/schedule`, `PUT /doctors/{id}` (patient limit/slot duration), `POST /doctors/{id}/blocked-dates`, `DELETE /doctors/{id}/blocked-dates/{id}`

**`/doctor/profile` (`/doctor/my-profile`) — `DoctorProfilePage`**

Data: professional profile, photo, completeness %, password change form.

API: `GET /doctors/me`, `PUT /doctors/me`, `POST /doctors/{id}/photo` (FormData), `POST /auth/change-password`

### Doctor-Specific Components (`portals/doctor/components/`)

| Component | Purpose |
|---|---|
| `DoctorScheduleEditorComponent` | Weekly schedule grid editor |
| `SoapFormComponent` | SOAP note text areas (S/O/A/P) |
| `VitalSignsFormComponent` | BP, HR, RR, Temp, SpO2, Weight, Height, BMI, Pain |
| `DiagnosisPickerComponent` | ICD-10 search and add |
| `PrescriptionBuilderComponent` | Add medication items; integrates `DrugInteractionService` |
| `PrescriptionFormComponent` | Prescription item display |
| `MedicationPickerModalComponent` | Modal for drug search in prescription builder |
| `LabRequestFormComponent` | Lab order entry |
| `VaccinationFormComponent` | Vaccination entry |
| `FollowUpFormComponent` | Follow-up date and reason |
| `AllergyWarningBannerComponent` | Patient allergy alert |
| `VitalsTrendChartComponent` | Vitals over time chart |
| `DoctorAppointmentCardComponent` | Appointment card in list |
| `DoctorPatientCardComponent` | Patient summary card |
| `DoctorQueueTableComponent` | Queue list in appointments |
| `DoctorStatusPanelComponent` | Availability toggle panel |

### Consultation Sub-Components (`portals/doctor/consultation/components/`)

| Component | Purpose |
|---|---|
| `ConsultationWorkspaceComponent` | Main consultation layout/workspace |
| `ConsultationHeaderComponent` | Header with patient name, booking info |
| `ConsultationOverviewComponent` | Summary view of consultation |
| `ConsultationSummaryComponent` | Summary after completion |
| `ConsultationCompleteModalComponent` | Complete consultation confirm modal |
| `SoapLastVisitModalComponent` | Modal showing last visit SOAP notes |
| `PatientClinicalHistoryDrawerComponent` | Side drawer with full patient history |
| `PatientIdentityStripComponent` | Patient name/demographics strip |
| `PatientAvatarUtil` (`patient-avatar.util.ts`) | Avatar generation utility |
| `AllergyBadgeComponent` | Allergy indicator badge |
| `ProfessionalFeeDecisionFormComponent` | PF waiver form |

### Doctor-Specific Type

`portals/doctor/consultation/doctor-consultation.types.ts` — consultation form state types

### Static Data Files (`portals/doctor/components/prescription-builder/`)

| File | Purpose |
|---|---|
| `prescription-drug-list.ts` | Local drug name/generic list for autocomplete |
| `prescription-masters.ts` | Route, frequency, dosage form master data |

---

## 12. Portal: Patient

Layout: `PatientLayoutComponent` (uses same `SidebarComponent`/`TopbarComponent` from admin). `PatientTopbarComponent` for mobile.

### Pages

**`/patient/dashboard` — `PatientDashboardPage`**

Data: welcome hero, stats (upcoming, pending proof, completed visits, active prescriptions), banners (missing email verification, pending consent), upcoming appointments, pending proof bookings, recent consultations, recent prescriptions, recommended doctors.

API: `GET /patients/me`, `GET /bookings?page=1&pageSize=100`, `GET /medical-records/consultations?patientId=`, `GET /medical-records/prescriptions?patientId=`

**`/patient/doctors` — `PatientDoctorsPage`**

API: via `DoctorStateService` → `GET /doctors`

Actions: click doctor card → `/public/doctors/{id}` (public profile with booking)

**`/patient/bookings` — `PatientBookingsPage`**

Paginated, filterable list. Filter tabs: All, Upcoming, For Payment, Completed, Cancelled.

API: `GET /bookings?page={page}&pageSize={size}` with optional status filter

Actions: click → detail, cancel (Confirmed only) → `PATCH /bookings/{id}/cancel`

**`/patient/bookings/:id` — `PatientBookingDetailPage`**

API: `GET /patients/me`, `GET /bookings/{id}`, `GET /payments/{paymentId}`

Actions: cancel booking, view receipt

**`/patient/medical-records` — `PatientMedicalRecordsPage`**

API: `GET /medical-records/me`

Downloads: `GET /patient-documents/me/medical-records/{id}/pdf`, `/bookings/{id}/pdf`, `/all.pdf`

**`/patient/prescriptions` — `PatientPrescriptionsPage`**

API: `GET /prescriptions/me`

Downloads: `GET /patient-documents/me/prescriptions/{id}/pdf`, `/bookings/{id}/pdf`, `/all.pdf`

**`/patient/documents` — `PatientDocumentsPage`**

Uses `PatientMediaPanelComponent` (kind: `document`).

API: `GET /patients/me/documents`, `POST /patients/me/documents`, `GET /patients/{id}/documents/{id}/file`

**`/patient/lab-results` — `PatientLabResultsPage`**

Uses `PatientMediaPanelComponent` (kind: `lab-result`).

API: `GET /patients/me/lab-results`, `POST /patients/me/lab-results`, `GET /patients/{id}/lab-results/{id}/file`

**`/patient/vaccinations` — `PatientVaccinationsPage`**

**Currently non-functional.** `PatientVaccinationsService` returns `of([])` — backend table not deployed. Page renders but always shows empty.

**`/patient/profile` — `PatientProfilePage`**

API: `GET /patients/me`, `PUT /patients/me`, `POST /auth/change-password`, `POST /patients/me/consent`

**`/patient/reviews/:bookingId` — `PatientReviewsPage`**

API: `GET /patients/me`, `GET /bookings/{id}`, `GET /reviews?bookingId=`, `POST /reviews`

**`/patient/privacy-consent` — `PatientPrivacyConsentPage`**

Displays privacy policy and consent button.

**`/patient/labs` — `PatientLabsRedirectPage`**

Redirect alias for `/patient/lab-results`.

### Patient-Specific Components

| Component | Purpose |
|---|---|
| `PatientLayoutComponent` | Patient portal shell (sidebar + topbar) |
| `PatientTopbarComponent` | Mobile top navigation |
| `PatientBookingCardComponent` | Booking card in "My Bookings" |
| `UpcomingAppointmentCardComponent` | Dashboard upcoming booking |
| `MedicalRecordCardComponent` | Consultation record card |
| `PrescriptionCardComponent` | Prescription card |
| `BookingTimelineComponent` | Booking status progression |
| `ProofSubmissionFormComponent` | Payment proof form (reference or screenshot) |
| `ReviewFormComponent` | Star rating + comment form |

---

## 13. Portal: Staff

Layout: `PortalLayoutComponent` with `STAFF_NAV_ITEMS`. `RealtimeInitService` activated.

### Pages

**`/staff/dashboard` — `StaffDashboardPage`**

Data: stat cards (Today's Appointments, Ready for Payment, Walk-Ins Today, +1), live queue table.

API: `GET /bookings/staff/today?page=1&pageSize=20` (via `BookingService.getStaffTodayBookings()`)

Actions: check-in → `PATCH /bookings/{id}/check-in`, undo → `PATCH /bookings/{id}/undo-check-in`, click row → detail. Realtime updates via `ClinicDashboardRealtimeService`.

**`/staff/bookings` — `StaffBookingsPage`**

Data: filtered, paginated list. Filter: doctor dropdown, status, date.

API: `GET /doctors` (filter dropdown), `GET /bookings/staff/all?page={page}&pageSize={size}`

**`/staff/bookings/:id` — `StaffBookingDetailPage`**

Data: full booking, payment section, status action buttons.

API: `GET /bookings/{id}`, `GET /payments/{paymentId}`

Actions: check-in/undo, confirm payment → `PATCH /payments/{bookingId}/confirm` with `{ paymentMethod, amountReceived, referenceNumber?, notes? }`, waive → `PATCH /payments/{id}/waive`, print receipt (`ReceiptModalComponent`), print booking (`BookingPrintDocumentComponent`)

**`/staff/payments` — `StaffPaymentsPage`**

Data: stat cards (Ready to Collect count, Total Due on Page), paginated payment queue.

API: `GET /bookings/staff/for-payment?page={page}&pageSize={size}`

Actions: collect payment (method selector) → `PATCH /payments/{bookingId}/confirm`, waive → `PATCH /payments/{bookingId}/waive`, view receipt. Realtime: `PaymentCompleted` / `PaymentWaived` events.

**`/staff/walk-in` — `StaffWalkInPage`** (3-step wizard)

Step 1: patient search (`GET /patients?search=`) → select or quick-register new patient
Step 2: doctor (`GET /doctors`), service (`GET /doctors/{id}/services` or `GET /services`), date, slot (`GET /doctors/{id}/available-slots?date=`)
Step 3: summary + confirm

Mutations: `POST /patients` (if new), `POST /bookings/walk-in`

**`/staff/patients` — `StaffPatientsPage`**

API: `GET /patients?search=&page=&pageSize=`

**`/staff/patients/:id` — `StaffPatientDetailPage`**

Data: demographics, portal account status.

Actions: create portal account → `POST /patients/{id}/portal-account` with `{ email, temporaryPassword }`

**`/staff/doctor-status` — `DoctorStatusPage`**

Data: stat cards (Available, Running Late, Unavailable), doctor status cards.

API: `GET /doctors` (via `DoctorStateService`), `GET /doctors/{id}/day-status` per doctor

Actions: update availability → `POST /doctor-day-status/{doctorId}/status` with `{ status, runningLateMinutes? }`

**`/staff/profile` — `StaffProfilePage`**

Actions: upload avatar → `POST /auth/avatar` (FormData) → `{ avatarUrl }`

### Staff-Specific Components

| Component | Purpose |
|---|---|
| `QueueTableComponent` | Today's queue list with check-in actions |
| `DoctorStatusCardComponent` | Per-doctor availability card |

---

## 14. Portal: Admin

Layout: `PortalLayoutComponent` with `ADMIN_NAV_ITEMS`. `RealtimeInitService` activated.

### Pages

**`/admin/dashboard` — `DashboardPage`**

Data: 8 stat cards (`AdminDashboardStats`), "Most Booked Doctors" SVG bar chart, "Revenue This Month" SVG area chart, today's appointments table.

API: `GET /bookings` (various filters for charts), `GET /doctors`, `GET /patients?pageSize=1000`, `GET /services`

**`/admin/bookings` — `BookingsPage`**

Data: filterable, paginated table. Bulk-select checkbox column (UI only — backend action not confirmed).

API: `GET /doctors` (filter), `GET /bookings` (all, filters client-side from cache)

**`/admin/bookings/:id` — `BookingDetailPage`**

Data: status timeline, booking info, patient detail, payment section, context-sensitive action buttons.

API: `GET /bookings/{id}`, `GET /patients/{patientId}`

Actions: confirm, reject/cancel, confirm payment, mark complete, mark no show, cancel, waive payment, refund, print receipt. All actions: `POST /audit-logs`.

**`/admin/walk-in` — `WalkInPage`**

Same 3-step wizard as Staff walk-in.

**`/admin/calendar` — `CalendarPage`**

Weekly grid: rows = doctors, columns = days. Cells show bookings.

API: `GET /bookings`, `GET /doctors`

**`/admin/doctors` — `DoctorsPage`**

API: `GET /doctors/admin`, `GET /doctors/{id}/schedule` per doctor

**`/admin/doctors/new` and `/admin/doctors/:id/edit` — `DoctorFormPage`**

Full form: name, specialization, bio, license numbers, consultation fee, slot config, services assignment, weekly schedule, photo.

API: `GET /doctors/admin`, `GET /doctors/{id}/schedule`, then `POST /doctors` or `PUT /doctors/{id}`, `PUT /doctors/{id}/schedule`, `POST /doctors/{id}/photo`

**`/admin/services` — `ServicesPage`**

API: `GET /services`, `GET /doctors/admin`. CRUD: `POST /services`, `PUT /services/{id}`

**`/admin/patients` — `PatientsPage`**

API: `GET /patients?search=&page=&pageSize=`

Actions: search, paginate, click → `/admin/patients/{id}`, create modal (`AdminPatientCreateModalComponent`) → `POST /patients`

**`/admin/patients/:id` — `PatientDetailPage`**

Data: full demographics, all medical records.

API: `GET /patients/{id}`, all `/medical-records/*?patientId=` endpoints

**`/admin/staff` — `StaffPage`**

Data: staff accounts table with Active/Inactive/Invited statuses.

API: `GET /admin/staff`

Actions: invite → `POST /admin/staff/invite`, revoke → `PUT /admin/staff/invite/{id}/revoke`, activate/deactivate → `PUT /admin/staff/{id}/update-status`

**`/admin/announcements` — `AnnouncementsPage`**

API: `GET /announcements`. CRUD: `POST /announcements`, `PUT /announcements/{id}`, `DELETE /announcements/{id}`

**`/admin/reports` — `ReportsPage`**

Three sections: Unpaid Completed Visits, Pending Follow-Ups, Daily Booking Summary.

API: `GET /reports/unpaid-completed-visits`, `GET /reports/pending-follow-ups`, `GET /reports/daily-booking-summary`

Actions: filter by date range (client-side), export CSV (client-side generation)

**`/admin/audit-logs` — `AuditLogsPage`**

Read-only. API: `GET /audit-logs`

**`/admin/settings` — `SettingsPage`**

Five tabs: General, Hours, Payments, Privacy, Branding.

API: `PUT /settings` on save

**General tab:** clinic name, address, phone, email, social URLs, cancellation deadline, portal/reminder toggles, pay-at-clinic mode, no-show window

**Hours tab:** `OperatingHoursEditorComponent` per-day open/close + enabled toggle

**Payments tab:** GCash QR, Maya QR, bank details (`PaymentSettings`)

**Privacy tab:** privacy policy text, consent version, bump version button

**Branding tab:** logo URL, primary/secondary color pickers (`ColorPickerComponent`)

### Admin-Specific Components (`portals/admin/components/`)

| Component | Purpose |
|---|---|
| `SidebarComponent` | Left nav drawer (shared with other portals via `PortalLayoutComponent`) |
| `TopbarComponent` | Top bar with hamburger, page title, notification bell |
| `NotificationBellComponent` | Topbar notification icon with count badge |
| `StatCardComponent` | Dashboard KPI card |
| `TodayAppointmentsTableComponent` | Inline appointments table |
| `ConsultationTimelineComponent` | Booking status progression timeline |
| `MedicalRecordsTabComponent` | Patient clinical history tab |
| `OperatingHoursEditorComponent` | Clinic hours config per day |
| `ColorPickerComponent` | HSL/HEX color picker for branding |
| `WaivePaymentModalComponent` | Waive payment confirmation |
| `RefundPaymentModalComponent` | Refund payment confirmation |
| `BookingActionsMenuComponent` | Context menu for booking status actions |
| `DoctorScheduleFormComponent` | Doctor schedule entry form |

### Admin Inline Modals

| Component | File | Purpose |
|---|---|---|
| `AdminPatientCreateModalComponent` | `portals/admin/patients/` | Create new patient modal |
| `AdminPatientEditModalComponent` | `portals/admin/patient-detail/` | Edit patient modal |

---

## 15. Shared Components

Located in `src/app/shared/components/`. All standalone.

| Selector | Component | Key Props | Purpose |
|---|---|---|---|
| `app-portal-layout` | `PortalLayoutComponent` | `navItems` via route data | Shell for Admin, Doctor, Staff (sidebar + topbar + `router-outlet`) |
| `app-avatar` | `AvatarComponent` | `name`, `imageUrl`, `size` (xs/sm/md/lg/xl/2xl) | Image or initials fallback avatar |
| `app-banner` | `BannerComponent` | `variant` (warning/danger/info/success), `dismissible?` | Contextual banner |
| `app-skeleton` | `SkeletonComponent` | `variant` (text/title/card/avatar/stat/row), `count`, `width` | Shimmer loading placeholder |
| `app-empty-state` | `EmptyStateComponent` | `title`, `description`, `icon?`, `ctaLabel?`, `ctaRoute?` | Zero-data illustration with optional CTA |
| `app-status-badge` | `StatusBadgeComponent` | `status`, `portal?`, `labelOverride?`, `paymentStatus?` | Coloured pill for `BookingStatus`/`PaymentStatus`/`DoctorStatus` |
| `app-slot-grid` | `SlotGridComponent` | `slots: TimeSlot[]` | Booking slot grid (available/full/pending/selected/disabled) |
| `app-confirm-modal` | `ConfirmModalComponent` | `isOpen`, `title`, `message`, `requireReason?`, `reasonLabel?` | Inline confirmation modal with optional reason textarea |
| `app-receipt-modal` | `ReceiptModalComponent` | `receiptData: ReceiptData`, `isOpen` | IonModal wrapping ReceiptView |
| `app-receipt-view` | `ReceiptViewComponent` | `data: ReceiptData` | Printable receipt layout |
| `app-booking-print-document` | `BookingPrintDocumentComponent` | `booking`, `payment`, `clinicSettings` | Printable booking summary/waived document |
| `app-booking-timer` | `BookingTimerComponent` | `expiresAt: Date` | Countdown timer for slot hold |
| `app-page-header` | `PageHeaderComponent` | `title`, `subtitle?`, `showBack?` | Page title + subtitle + back button + projected actions |
| `app-patient-media-panel` | `PatientMediaPanelComponent` | `kind` (document/lab-result), `heading`, `subheading` | Upload/preview/download panel for patient files |
| `app-patient-media-preview` | `PatientMediaPreviewModal` | `files[]`, `currentIndex` | IonModal file preview with prev/next navigation |
| `app-secure-image` | `SecureImageComponent` | `endpoint: string` | Fetches and renders a blob from a secured endpoint |
| `app-notification-panel` | `NotificationPanelComponent` | — | Dropdown notification list with unread count |

### Shared Page

| Component | Route | Purpose |
|---|---|---|
| `NotFoundPage` | `**` (all portals) | 404 page |

---

## 16. Pipes, Validators, Utils

### Pipes (`src/app/shared/pipes/`)

| Pipe | Name | Usage |
|---|---|---|
| `PesoPipe` | `peso` | `number | peso` → `₱1,234.56` (en-PH locale) — null/undefined → `—` |
| `TimeSlotPipe` | `timeSlot` | `'14:30' | timeSlot` → `'2:30 PM'` — null/undefined → `—` |
| `PatientCodePipe` | `patientCode` | Trims and displays patient code — null/empty → `—` |

### Validators (`src/app/shared/validators/`)

**`passwordStrengthValidator(control)`** — returns `ValidationErrors` if:
- `minLength: true` — less than 8 characters
- `requiresUppercase: true` — no uppercase letter
- `requiresNumber: true` — no digit
- `requiresSpecialChar: true` — no `!@#$%^&*`

**`getPasswordStrength(password)`** — returns `0 | 1 | 2 | 3 | 4` strength score (used for strength meter UI).

### Utilities (`src/app/core/utils/`)

**`clinical-role.util.ts`**

| Function | Signature | Purpose |
|---|---|---|
| `resolveClinicalRole(user)` | `(AuthUser \| null) → ClinicalRole` | Maps Role → ClinicalRole; defaults to `'receptionist'` |
| `getClinicalRoleBadge(role)` | `ClinicalRole → { label, className }` | Returns badge label (`MD`, `RN`, `MA`, `Admin`, `Front Desk`) + CSS class |
| `canEditPrescriptions(role)` | `ClinicalRole → boolean` | Only `physician` |
| `canEditLabOrders(role)` | `ClinicalRole → boolean` | Only `physician` |
| `canEditVaccinations(role)` | `ClinicalRole → boolean` | `physician`, `nurse`, `medical_assistant` |
| `canViewPfDecision(role)` | `ClinicalRole → boolean` | `physician`, `admin`, `receptionist` |

**`portals/public/utils/time-format.ts`** — Time slot formatting helpers for the booking wizard.

---

## 17. Realtime — SignalR & FCM

### SignalR (`ClinicDashboardRealtimeService`)

- Hub URL: `environment.signalrHubUrl` (`https://localhost:44384/hubs/clinic-dashboard` dev, `https://api.yourclinicdomain.com/hubs/clinic-dashboard` prod)
- Auth: Bearer token from `TokenService`
- Events stream: `events$: Observable<ClinicDashboardEvent>`

| Event | Triggered When |
|---|---|
| `BookingCreated` | New booking placed |
| `BookingCancelled` | Booking cancelled |
| `PatientCheckedIn` | Staff checks in a patient |
| `PatientCheckInUndone` | Staff reverts check-in |
| `DoctorCompletedConsultation` | Doctor marks complete |
| `PaymentCompleted` | Staff confirms payment |
| `PaymentWaived` | Staff/Admin waives payment |
| `DoctorScheduleUpdated` | Admin/Doctor updates schedule |
| `DoctorServicesUpdated` | Services linked to doctor changed |
| `PatientProfileUpdated` | Patient profile changed |

Consumed by: Doctor dashboard/appointments, Staff dashboard, Admin dashboard.

### Firebase FCM (`PushNotificationService`)

- Config: `environment.firebase*` values (project: `clinic-sup`)
- VAPID key: `environment.firebaseVapidKey` (two keys present in env — see Known Issues)
- Background push: `src/firebase-messaging-sw.js` service worker
- Foreground push: handled via FCM `onMessage()` callback — dispatches browser notifications and adds to in-app list
- In-app notifications use polling-based `NotificationService` (not SignalR). `subscribeToNotifications()` is currently a no-op.
- Activated by `RealtimeInitService` on portal load

### Notification Display (`NotificationPanelComponent`)

Located in topbar. Shows unread count badge and dropdown. `PUT /notifications/{id}/read` / `PUT /notifications/read-all` on interaction.

---

## 18. Environment & Configuration

### Files

| File | Purpose |
|---|---|
| `src/environments/environment.ts` | Development config |
| `src/environments/environment.prod.ts` | Production config |

### Key Config Values

| Key | Dev | Prod |
|---|---|---|
| `production` | `false` | `true` |
| `apiUrl` | `https://localhost:44384/api` | `https://api.yourclinicdomain.com/api` |
| `apiBaseUrl` | Same (legacy alias) | Same |
| `signalrHubUrl` | `https://localhost:44384/hubs/clinic-dashboard` | `https://api.yourclinicdomain.com/hubs/clinic-dashboard` |
| `googleClientId` | `506648259313-...` | `''` (blank — production social login not configured) |
| `facebookAppId` | `904138729352506` | `''` |
| `facebookSdkVersion` | `v25.0` | `v25.0` |
| `useMockData` | `false` | `false` |
| `siteUrl` | `''` (unused — dead config; not read by any source file) | `https://clinic-sup.vercel.app` (unused — dead config) |
| Firebase project | `clinic-sup` | `clinic-sup` (same project) |
| `firebaseVapidKey` | `BExXCzlT...` | Same |
| `vapidKey` | `BMJf90ox...` | Same — **different value from `firebaseVapidKey`** |

### Feature Flags

- `useMockData: false` — Mock data path exists in `MockDataService` but not active. Mock data files in `core/mock-data/` are unused.
- `environment.production` — controls developer quick-fill buttons in `LoginPage`.

### Vercel Deployment

`vercel.json` present. All routes rewrite to `index.html` for SPA routing.

### Service Worker

`src/firebase-messaging-sw.js` — reads Firebase config from URL search params at install. Handles background push notifications. Uses Firebase v10.13.0 compat scripts from `gstatic.com`.

---

## 19. Third-Party Dependencies

### Runtime

| Package | Version | Usage |
|---|---|---|
| `@angular/core` et al. | `^17.3.0` | Core Angular framework |
| `@ionic/angular` | `^7.8.6` | Ionic UI components (standalone mode) |
| `@ionic/angular-toolkit` | `^12.3.0` | Ionic Angular CLI toolkit |
| `@ionic/core` | `^7.8.6` | Ionic Web Components core |
| `@microsoft/signalr` | `^10.0.0` | SignalR hub client (`ClinicDashboardRealtimeService`) |
| `firebase` | `^10.14.1` | Firebase App + Messaging (FCM) |
| `ionicons` | `^7.4.0` | Icon set — icons imported individually via `addIcons()` |
| `rxjs` | `~7.8.0` | Observables, BehaviorSubjects, operators |
| `zone.js` | `~0.14.3` | Angular change detection |
| `tslib` | `^2.3.0` | TypeScript helpers |

### External Scripts (dynamically loaded)

| Script | URL | Purpose |
|---|---|---|
| Google Identity Services | `https://accounts.google.com/gsi/client` | Google OAuth popup |
| Facebook JS SDK | `https://connect.facebook.net/en_US/sdk.js` | Facebook OAuth popup |
| Firebase App Compat | `https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js` | Service Worker only |
| Firebase Messaging Compat | `https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js` | Service Worker only |

### Dev Dependencies

| Package | Usage |
|---|---|
| `@playwright/test ^1.60.0` | E2E tests |
| `@angular/cli 17.3.17` | Build tooling |
| `@angular-devkit/build-angular ^17.3.17` | Webpack/esbuild |
| `karma` + `jasmine` | Unit testing |
| `typescript ~5.4.2` | TypeScript compiler |

**No Capacitor / Cordova.** Pure PWA only.

---

## 20. Coding Standards & Conventions

### File Naming

| Pattern | Examples |
|---|---|
| Pages | `{name}.page.ts`, `{name}.page.html`, `{name}.page.scss` |
| Components | `{name}.component.ts`, `{name}.component.html`, `{name}.component.scss` |
| Services | `{name}.service.ts` |
| Guards | `{name}.guard.ts` |
| Models | `{name}.models.ts` |
| Routes | `{name}.routes.ts` |
| Pipes | `{name}.pipe.ts` |

### Component Architecture

- **All components are standalone** (`standalone: true`). No `NgModule` files exist.
- **External templates everywhere.** Every `.page.ts` and `.component.ts` has a `templateUrl` pointing to an external `.html` file. `template: ...` inline is never used.
- Components declare their own `imports` array.
- Lazy loading: `loadComponent: () => import(...).then(m => m.ComponentClass)`

### Service Injection

- `inject()` function throughout — **not** constructor injection.
- All singleton services: `@Injectable({ providedIn: 'root' })`.
- Never inject `HttpClient` directly in pages or portal services — use `ApiService`.

### Routing

- Top-level `app.routes.ts` uses `loadChildren` for portal lazy loading.
- Each portal's routes are exported constants (`ADMIN_ROUTES`, etc.) with nav items (`ADMIN_NAV_ITEMS`, etc.) passed as route `data`.
- Route params: always `:id` for resource IDs; `:bookingId` where disambiguation needed.

### Observable / Async Patterns

- **RxJS Observables** primary for HTTP + state streams.
- `async/await` + `firstValueFrom()` for imperative form submissions and multi-step sequences.
- `takeUntilDestroyed(this.destroyRef)` — preferred cleanup in Angular 17 pages.
- `takeUntil(this.ngUnsubscribe)` via `BaseComponent` — legacy pattern in some admin pages.
- `forkJoin()` for parallel data loads (dashboard pages, consultation page).
- `combineLatest()` for dependent stream merges.
- `switchMap()` for sequential dependent requests.

### Forms

**Reactive Forms only.** No template-driven forms. All forms use `FormBuilder.nonNullable.group()` or `FormBuilder.group()`. Custom `passwordStrengthValidator` + `Validators` from `@angular/forms`. Cross-field validation via form group validators.

### Error Handling

- `authInterceptor` handles 401 only.
- Per-call `catchError()` in services/pages.
- `extractApiErrorMessage()` — extracts message from `HttpErrorResponse`.
- Toast via `BaseComponent.showToast()` (color: `success` or `danger`, 1800ms, position: top).
- No global `ErrorHandler` override.

### No Linting Config

No `.eslintrc` or `.prettierrc` found in the repository.

---

## 21. Design & UI Conventions

### CSS Design Tokens (`src/styles.scss`)

| Token | Value | Meaning |
|---|---|---|
| `--ion-color-primary` | `#5d3e8e` | Brand purple |
| `--ion-color-secondary` | `#2563eb` | Medical blue |
| `--ion-color-success` | `#16a34a` | Green |
| `--ion-color-warning` | `#d97706` | Amber |
| `--ion-color-danger` | `#dc2626` | Red |
| `--clinic-bg` | `#f8fafc` | Page background |
| `--clinic-bg-elevated` | `#ffffff` | Card background |
| `--clinic-border` | `#e2e8f0` | Standard border |
| `--clinic-text-primary` | `#0f172a` | Main text |
| `--clinic-text-secondary` | `#475569` | Subtitle/meta text |
| `--gradient-hero` | Purple gradient | Hero sections |

Typography: `Inter` (body) + `JetBrains Mono` (code/data IDs) from Google Fonts.

### Navigation

| Role | Layout | Navigation |
|---|---|---|
| Admin | `PortalLayoutComponent` | Left sidebar (collapsible) + topbar |
| Doctor | `PortalLayoutComponent` | Left sidebar + topbar |
| Staff | `PortalLayoutComponent` | Left sidebar + topbar |
| Patient | `PatientLayoutComponent` | Left sidebar + topbar |
| Public | `PublicLayoutComponent` | Top navbar + footer |

Sidebar toggled by hamburger in topbar. Mobile: overlay with backdrop. Desktop: persistent.

### Modals

- `IonModal` — receipt viewing (`ReceiptModalComponent`), media preview (`PatientMediaPreviewModal`)
- Custom inline `app-confirm-modal` — all destructive confirmations (cancel, delete, waive, refund). **Not** `IonModal` — it's a CSS backdrop div.
- No `IonPopover` usage confirmed.

### Loading and Skeletons

- `app-skeleton` with `variant` prop — used on all list pages while loading.
- `IonSpinner` (name: `crescent`) — inline/dashboard loading states.
- `isLoading: boolean` controlled by `finalize()` operator.

### Toasts

- Success: `color: 'success'`, 1800ms, position: top
- Error: `color: 'danger'`, 1800ms, position: top
- Some pages use 3000ms for important errors.
- No `AlertController` usage confirmed.

### Tables

All data tables use custom `clinic-table` CSS class on `<table>`. No `ion-list` for tabular admin data.

---

## 22. New Page Checklist

When adding a new page to any portal:

```
1. Create files:
   - src/app/portals/{portal}/{feature}/{name}.page.ts
   - src/app/portals/{portal}/{feature}/{name}.page.html
   - src/app/portals/{portal}/{feature}/{name}.page.scss  (if needed)

2. Register route in the portal's *.routes.ts:
   {
     path: 'your-path',
     loadComponent: () => import('./your-feature/your-name.page').then(m => m.YourPage),
     data: { title: 'Page Title' }
   }

3. Add nav item (if sidebar link needed):
   - Add to {PORTAL}_NAV_ITEMS array in the portal's *.routes.ts

4. Guards:
   - /admin/*: authGuard + roleGuard + firstLoginGuard (already on parent)
   - /staff/*: authGuard + roleGuard (already on parent)
   - /doctor/*: authGuard + roleGuard (already on parent)
   - /patient/*: authGuard + roleGuard (already on parent)
   - New public pages: no guards needed

5. Page class:
   - Either extend BaseComponent (legacy) or inject DestroyRef for takeUntilDestroyed
   - Use inject() for all dependencies
   - Use ApiService only via a service — never inject ApiService directly in pages

6. Standalone imports in @Component decorator:
   - Add all used Ionic/Angular/shared components to imports[]
   - Common: IonContent, IonHeader, IonToolbar, IonTitle, CommonModule, FormsModule,
             RouterModule, SharedComponents (avatar, skeleton, empty-state, etc.)

7. API calls:
   - Create or extend a service in the portal's services/ folder
   - Use ApiService methods (get, post, put, patch, delete, getBlob, postFormData)
   - Handle loading with finalize(), errors with catchError(), cleanup with takeUntilDestroyed

8. Update this document:
   - Add route to Section 3
   - Add API calls to Section 8
   - Add any new components to Section 14/15
```

---

## 23. Blueprint Cross-Check & Gap Report

The blueprint (`__PROJECT_BLUEPRINT___Clinic_Hospit.txt`) was cross-checked against the actual source zip. Summary:

### ✅ Blueprint is Accurate — Confirmed by Source

All routes, guards, API endpoints, models, services, components, realtime events, environment config, and tech stack entries in the blueprint match the actual source code.

### 🆕 Items in Source NOT in Blueprint (added to this MD)

**Services clarified:**

- `PatientClinicalHistoryService` — local pure-function aggregate builder (not an API caller). Blueprint listed it as `[NEEDS CLARIFICATION]` — now fully documented in Section 5.
- `DrugInteractionService` — fully documented. Local heuristic only (no API calls). Integrates with prescription builder. Blueprint listed as `[NEEDS CLARIFICATION]` — resolved.
- `OfflineConsultationQueueService` — fully documented. IndexedDB queue for consultation draft sync. Blueprint listed as `[NEEDS CLARIFICATION]` — resolved.

**Models fully documented:**

- `PatientClinicalHistoryDto` (all sub-types) — `patient-clinical-history.models.ts`
- `PatientDocument`, `PatientLabResult`, `PatientMedicalRecord`, `PatientPrescription` — `patient-documents.models.ts`
- `PatientVaccinationDto` + all vaccination constants and helpers — `vaccination.models.ts`
- `DoctorPatientSummaryDto` — `doctor-patient-summary.models.ts`
- `DrugAllergyConflict`, `DrugInteractionWarning`, `DrugInteractionResult` — from `DrugInteractionService`

**Static data files documented:**

- `prescription-drug-list.ts` — local drug name list for prescription autocomplete
- `prescription-masters.ts` — route, frequency, dosage form master data

**Two `DoctorStateService` files** — one in `core/`, one in `portals/admin/services/` — both documented in Section 5 with a note to prefer `core/`.

**`ConsultationQueueEvent` interface** — documented in `OfflineConsultationQueueService`.

**Patient vaccination constants** — `VACCINATION_ROUTE_OPTIONS`, `VACCINATION_SITE_OPTIONS`, `VACCINATION_DOSE_UNIT_OPTIONS`, `defaultCreateVaccinationPayload()` fully listed in Section 7.

**`ApiService` blob and FormData methods** — `getBlob`, `postBlob`, `getBlobResponse`, `postBlobResponse`, `postFormData`, `putFormData` — not in blueprint, fully documented in Section 5.

### ⚠️ Blueprint Items Confirmed as Gaps (carried forward to Section 24)

All `[NEEDS CLARIFICATION]` items from the blueprint were investigated. Results are in Section 24.

---

## 24. Known Gaps, Bugs & Incomplete Features

### 1. Patient Vaccinations — Non-functional

`PatientVaccinationsService` stubs all methods. Returns `of([])`. `getPatientVaccinations()` always returns empty. Create/update/delete throw `Error('not available yet — patient_vaccinations table not deployed')`. The `/patient/vaccinations` page renders but always shows empty with no user-visible error. **Do not add vaccination UI features until the backend table is deployed.**

### 2. Rescheduling — Not Implemented

`BookingService.rescheduleBooking()` is marked `@deprecated`. Logs warning and does nothing. No reschedule UI in any portal.

### 3. Admin Settings — No API Fetch on Startup

`ClinicSettingsService` initialises with hardcoded defaults. `ClinicSettingsService.load()` is a synchronous getter (returns `this.settingsSubject.value`) — it does not call `GET /settings`. There is no confirmed code path that hydrates settings from the API on app startup. Admin `SettingsPage` calls `ClinicSettingsService.load()` synchronously, which may return defaults rather than live data.

### 4. Bulk Booking Actions — UI Without Backend

Admin Bookings page has a bulk-select checkbox column. No `POST /bookings/bulk-*` or equivalent endpoint is confirmed in the source.

### 5. Attending Physician Request — Beta/Partial

`POST /consultation-requests/request-attending-physician` is called from `DoctorConsultationPage`. Feature is not documented and may be partial. Backend support unclear.

### 6. Doctor Profile Photo Upload Inconsistency

Admin `DoctorFormPage` clearly uses `POST /doctors/{id}/photo` via `postFormData`. Doctor self-edit (`DoctorProfilePage`) uses `PUT /doctors/me` but photo upload path for self-edit is not confirmed — may use a separate endpoint or the same `/photo` endpoint.

### 7. Two Firebase VAPID Keys

`environment.ts` contains both `firebaseVapidKey` (`BExXCzlT...`) and `vapidKey` (`BMJf90ox...`) with different values. `PushNotificationService` should use one to register the service worker token. Which one is active is unclear.

### 8. Auth Callback Page — Legacy/Redirect OAuth

`/auth/callback` reads tokens from URL hash fragment (redirect-based OAuth). Login page uses popup flows only. When `/auth/callback` is actually used is unclear — possibly for future mobile/native OAuth redirect or a legacy flow.

### 9. `POST /auth/logout` Not Called from Frontend

`isPublicAuthEndpoint()` whitelist includes `/auth/logout`, but no component or service calls it on logout. Server-side refresh token revocation on logout is NOT guaranteed.

### 10. `PatientDocumentsService.getDownloadUrl()` Unused

The service exposes a `getDownloadUrl()` helper but `PatientMediaPanelComponent` uses `ApiService.getBlob()` directly. The method appears unused.

### 11. `ClinicalRole` Not Populated from API

`AuthUser.clinicalRole` exists in the model but `toAuthUser()` does not map it from `AuthUserDto`. The field is never set from any confirmed API response. `clinical-role.util.ts` functions exist but `clinicalRole` is always `null`/`undefined` in practice.

### 12. Mixed Subscription Cleanup Patterns

`takeUntilDestroyed(this.destroyRef)` (Angular 17, preferred) and `takeUntil(this.ngUnsubscribe)` (via `BaseComponent`, legacy) coexist. New code should use `takeUntilDestroyed`. Do not mix patterns in the same component.

### 13. Public Booking — Screenshot Proof Not Wired to Upload

`StepProofComponent` shows a screenshot upload zone and tracks `screenshotFileName` but `POST /bookings` submission does not include a FormData upload. Screenshot proof may not actually be uploaded to the server (reference number mode works correctly).

### 14. `/dev/gallery` Exposed in Production

`/dev/gallery` (`DesignSystemGalleryPage`) has no guards. It is accessible without authentication in production builds. Should be removed or guarded before public launch.

### 15. `DrugInteractionService` — Local Heuristics Only

The service checks drug-allergy and drug-drug interactions using local string matching and a hardcoded class map. There is no external drug interaction API wired up. The service architecture supports adding an API check (`source: 'api'`) but it is not currently used — the prescription builder only uses local evaluation.

### 16. `OfflineConsultationQueueService` — Browser Dependency

Requires `indexedDB`. Will throw `Error('IndexedDB is not available in this browser.')` in SSR or environments without IndexedDB. Currently there is no graceful UI fallback if IndexedDB is unavailable.

### 17. Google/Facebook Social Login Not Configured in Production

`environment.prod.ts` has `googleClientId: ''` and `facebookAppId: ''`. Social login buttons will not work in production until these are set.

### 18. `PatientClinicalHistoryDto.timeline` Always Empty

`PatientClinicalHistoryService.buildPatientClinicalHistory()` sets `timeline: []` unconditionally. Timeline items are never built. Any UI consuming this field will always show an empty timeline.

# API Direct Conversion Audit Report

## Overall Result
FAIL

## Summary Counts
- Total ApiService calls found: 161
- Page/component ApiService calls: 132
- Service/helper ApiService calls: 29
- HttpClient usages outside ApiService: 0 violations (1 allowed provider-config reference in `src/app/app.config.ts`)
- Old feature-service wrapper usages found: 50
- Blob calls: 7
- FormData calls: 4
- Build result: PASS (`npm run build` PASS, `ionic build` PASS after escalated retry)

## Critical Misses
- File: `src/app/portals/admin/doctor-form/doctor-form.page.ts`
- Line/function: `loadData`, `save`, `createInvite`
- Current call path: Page -> `AdminDoctorsService` -> `ApiService`
- Why this is wrong: the page still hides backend endpoints behind a feature service, so the endpoint/method/payload are not traceable from the page itself.
- Expected call path: Page -> `ApiService`
- Suggested fix: move `doctors/admin`, `doctors/{id}/schedule`, `doctors/{id}`, and invite-related work directly into the page.

- File: `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts`
- Line/function: upload/list/filter flows around `uploadPatientDocument`, `uploadMyDocument`, `uploadPatientLabResult`, `uploadMyLabResult`, `getPatientDocuments`, `getMyDocuments`, `getPatientLabResults`, `getMyLabResults`
- Current call path: Component -> `PatientDocumentsService` -> `ApiService`
- Why this is wrong: blob/FormData and media list calls are still hidden in a service, so the page/component cannot see the endpoint, method, payload, or response handling directly.
- Expected call path: Component -> `ApiService`
- Suggested fix: move the upload/list/download calls into the component and keep any shared row mappers helper-only.

- File: `src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`
- Line/function: `loadPrescriptionsFromConsultationRecords`
- Current call path: Page -> `MedicalRecordsService` -> `ApiService`
- Why this is wrong: the page still relies on a feature service for medical-record lookups, which hides the actual backend call path.
- Expected call path: Page -> `ApiService`
- Suggested fix: copy the needed medical-record queries into the page or move only pure mappers into a helper without HTTP.

- File: `src/app/portals/admin/patient-detail/patient-detail.page.ts`
- Line/function: `ngOnInit` / patient history loading
- Current call path: Page -> `MedicalRecordsService` -> `ApiService`
- Why this is wrong: multiple patient-history calls are still hidden behind a service, so traceability is lost.
- Expected call path: Page -> `ApiService`
- Suggested fix: inline the consultation/prescription/allergy/lab/vaccination/follow-up calls in the page one flow at a time.

- File: `src/app/shared/components/notification-panel/notification-panel.component.ts`
- Line/function: `markAllRead`, `markRead`
- Current call path: Component -> `NotificationService` -> `ApiService`
- Why this is wrong: notification read/write actions are still hidden in a service instead of the component owning the UI action.
- Expected call path: Component -> `ApiService`
- Suggested fix: move the two notification mutations into the component and keep the unread-count state helper-only.

## Service/Helper Backend Violations
- File: `src/app/core/services/booking.service.ts`
- Method: `getStaffTodayBookings`, `getStaffBookings`, `getStaffForPayment`, `requestBookings`, `requestBookingById`, `createBooking$`
- Endpoint: `bookings/staff/today`, `bookings/staff/all`, `bookings/staff/for-payment`, `bookings`, `bookings/{id}`
- Current usage: backend calls still exist in the service, but the current page/component call search no longer shows live callers for these flows.
- Should be moved to: direct page/component calls or removed if fully dead
- Risk level: LOW

- File: `src/app/core/services/notification.service.ts`
- Method: `fetchNotifications`, `markRead`, `markAllRead`
- Endpoint: `notifications`, `notifications/{id}/read`, `notifications/read-all`
- Current usage: notification panel and layout components still call the service methods
- Should be moved to: `src/app/shared/components/notification-panel/notification-panel.component.ts` and any other owning UI component
- Risk level: HIGH

- File: `src/app/core/services/push-notification.service.ts`
- Method: `registerDevice`, `markRead`, `markAllRead`
- Endpoint: `device-tokens`, `notifications/{id}/read`, `notifications/read-all`
- Current usage: runtime push/notification infrastructure still persists through this service
- Should be moved to: helper-only push state plus direct page/component `ApiService` calls where relevant
- Risk level: MEDIUM

- File: `src/app/core/services/patient-documents.service.ts`
- Method: `getPatientDocuments`, `getPatientLabResults`, `getMyDocuments`, `getMyLabResults`, `getMyMedicalRecords`, `getMyPrescriptions`, `uploadPatientDocument`, `uploadPatientLabResult`, `uploadMyDocument`, `uploadMyLabResult`, `downloadAllClinicalRecordsPdf`, `downloadPrescriptionPdf`, `downloadMedicalRecordPdf`, `downloadConsultationSummaryPdf`, `downloadFile`, `downloadMediaFile`
- Endpoint: `patients/{patientId}/documents`, `patients/{patientId}/lab-results`, `patients/me/documents`, `patients/me/lab-results`, `medical-records/me`, `prescriptions/me`, `patient-documents/me/*`, `patients/{pid}/documents/{id}/file`, `patients/{pid}/lab-results/{id}/file`
- Current usage: patient media, secure image, patient prescriptions, and patient medical-record pages/components
- Should be moved to: direct page/component `ApiService` calls
- Risk level: HIGH

- File: `src/app/core/services/medical-records.service.ts`
- Method: `getConsultationsByPatientId`, `getPrescriptionsByPatientId`, `getAllergiesByPatientId`, `getLabRequestsByPatientId`, `getLabResultsByPatientId`, `getVaccinationsByPatientId`, `getFollowUpsByPatientId`, `createAllergy`, `updateAllergy`, `deleteAllergy`, `createLabResult`, `deleteLabResult`, `createVaccination`, `updateVaccination`, `deleteVaccination`, `createFollowUp`, `updateFollowUp`, `deleteFollowUp`
- Endpoint: `medical-records/*`
- Current usage: doctor patient detail, admin patient detail, patient dashboard, and admin medical-records tab
- Should be moved to: direct page/component `ApiService` calls
- Risk level: HIGH

- File: `src/app/core/services/patient-state.service.ts`
- Method: `refresh`, `getPatientById`, `getPatientByUserId`, `getFilteredPatients`, `savePatient`, `updatePatientConsent`
- Endpoint: `patients`, `patients/{id}`, `patients?userId=...`, `patients?search=...`, `patients/{id}/portal-account`
- Current usage: doctor consultation stub, doctor consultation, staff dashboard, and other patient-facing flows
- Should be moved to: direct page/component `ApiService` calls or converted to helper-only state without HTTP
- Risk level: HIGH

- File: `src/app/core/services/patient-clinical-history.service.ts`
- Method: `getPatientClinicalHistory`
- Endpoint: `patients/{patientId}`, `bookings?patientId={patientId}&pageSize=50`, plus delegated `MedicalRecordsService` calls
- Current usage: doctor consultation page
- Should be moved to: direct page/component `ApiService` calls or helper-only mappers with no HTTP
- Risk level: HIGH

- File: `src/app/portals/admin/services/admin-doctors.service.ts`
- Method: `getAllDoctors`, `createDoctor`, `updateDoctor`, `deactivateDoctor`, `getSchedule`, `updateSchedule`, `getBlockedDates`, `addBlockedDate`, `deleteBlockedDate`
- Endpoint: `doctors/admin`, `doctors`, `doctors/{id}`, `doctors/{id}/schedule`, `doctors/{id}/blocked-dates`
- Current usage: admin doctor-form, admin doctors, and admin services pages
- Should be moved to: direct page/component `ApiService` calls
- Risk level: HIGH

- File: `src/app/portals/admin/services/doctor-state.service.ts`
- Method: `loadDoctorsFromApi`, `loadSingleDayStatus`, `updateDayStatusViaApi`, `fetchAllDoctorsObservable`, `fetchDayStatusObservable`, `upsertDayStatus$`
- Endpoint: `doctors/admin`, `doctors/{doctorId}/day-status`
- Current usage: appears unused by pages/components in this audit pass, but it still contains backend calls
- Should be moved to: helper-only state or deleted if truly dead
- Risk level: MEDIUM

## Pages Still Calling Feature API Wrappers
- Page/component: `src/app/portals/admin/doctor-form/doctor-form.page.ts`
- Feature service method: `adminDoctorsService.getAllDoctors`, `getSchedule`, `updateDoctor`, `updateSchedule`, `createDoctorInvite`
- Hidden endpoint if traceable: `doctors/admin`, `doctors/{id}/schedule`, `doctors/{id}`
- Expected direct ApiService call: `this.apiService.get/put/post(...)` in the page

- Page/component: `src/app/portals/admin/doctors/doctors.page.ts`
- Feature service method: `adminDoctorsService.getSchedule`
- Hidden endpoint if traceable: `doctors/{id}/schedule`
- Expected direct ApiService call: `this.apiService.get('doctors/' + id + '/schedule')`

- Page/component: `src/app/portals/admin/services/services.page.ts`
- Feature service method: `adminDoctorsService.getAllDoctors`
- Hidden endpoint if traceable: `doctors/admin`
- Expected direct ApiService call: `this.apiService.get('doctors/admin')`

- Page/component: `src/app/portals/doctor/consultation/doctor-consultation.page.ts`
- Feature service method: `patientClinicalHistoryService.getPatientClinicalHistory`, `medicalRecords.fetchPatientMedicalRecords`, `patientState.getPatientById`
- Hidden endpoint if traceable: `patients/{patientId}`, `bookings?patientId={patientId}&pageSize=50`, `medical-records/*`
- Expected direct ApiService call: `this.apiService.get(...)` in the page, with pure mappers only in helpers

- Page/component: `src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts`
- Feature service method: `patientState.getPatients`
- Hidden endpoint if traceable: `patients`
- Expected direct ApiService call: `this.apiService.get('patients')` or a helper-only state source

- Page/component: `src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`
- Feature service method: `medicalRecords.getConsultationsByPatientId`, `getPrescriptionsByPatientId`, `getLabResultsByPatientId`, `getVaccinationsByPatientId`, `getFollowUpsByPatientId`
- Hidden endpoint if traceable: `medical-records/consultations?patientId=...`, `medical-records/prescriptions?patientId=...`, `medical-records/lab-results?patientId=...`, `medical-records/vaccinations?patientId=...`, `medical-records/follow-ups?patientId=...`
- Expected direct ApiService call: `this.apiService.get(...)` in the page

- Page/component: `src/app/portals/admin/patient-detail/patient-detail.page.ts`
- Feature service method: `medicalRecords.getConsultationsByPatientId`, `getPrescriptionsByPatientId`, `getAllergiesByPatientId`, `getLabResultsByPatientId`, `getVaccinationsByPatientId`, `getFollowUpsByPatientId`
- Hidden endpoint if traceable: `medical-records/*`
- Expected direct ApiService call: `this.apiService.get(...)` in the page

- Page/component: `src/app/portals/patient/dashboard/patient-dashboard.page.ts`
- Feature service method: `medicalRecords.getConsultationsByPatientId`, `getPrescriptionsByPatientId`, plus patient-state refresh usage
- Hidden endpoint if traceable: `medical-records/*`, `patients/*`
- Expected direct ApiService call: `this.apiService.get(...)` in the page

- Page/component: `src/app/portals/patient/medical-records/patient-medical-records.page.ts`
- Feature service method: `patientDocumentsService.getMyMedicalRecords`, `downloadMedicalRecordPdf`, `downloadConsultationSummaryPdf`, `downloadAllClinicalRecordsPdf`
- Hidden endpoint if traceable: `medical-records/me`, `patient-documents/me/*`
- Expected direct ApiService call: `this.apiService.get/getBlob(...)` in the page

- Page/component: `src/app/portals/patient/prescriptions/patient-prescriptions.page.ts`
- Feature service method: `patientDocumentsService.getMyPrescriptions`, `downloadPrescriptionPdf`, `downloadConsultationSummaryPdf`, `downloadAllClinicalRecordsPdf`
- Hidden endpoint if traceable: `prescriptions/me`, `patient-documents/me/*`
- Expected direct ApiService call: `this.apiService.get/getBlob(...)` in the page

- Page/component: `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts`
- Feature service method: `uploadPatientDocument`, `uploadMyDocument`, `uploadPatientLabResult`, `uploadMyLabResult`, `getPatientDocuments`, `getMyDocuments`, `getPatientLabResults`, `getMyLabResults`
- Hidden endpoint if traceable: `patients/{patientId}/documents`, `patients/{patientId}/lab-results`, `patients/me/documents`, `patients/me/lab-results`
- Expected direct ApiService call: `this.apiService.postFormData/get(...)` in the component

- Page/component: `src/app/shared/components/secure-image/secure-image.component.ts`
- Feature service method: `downloadMediaFile`, `downloadFile`
- Hidden endpoint if traceable: `patients/{pid}/documents/{id}/file`, `patients/{pid}/lab-results/{id}/file`, arbitrary file source URL
- Expected direct ApiService call: `this.apiService.getBlob(...)` in the component

- Page/component: `src/app/shared/components/patient-media-panel/patient-media-preview.modal.ts`
- Feature service method: `downloadMediaFile`
- Hidden endpoint if traceable: `patients/{pid}/documents/{id}/file`, `patients/{pid}/lab-results/{id}/file`
- Expected direct ApiService call: `this.apiService.getBlob(...)` in the modal/component

- Page/component: `src/app/shared/components/notification-panel/notification-panel.component.ts`
- Feature service method: `markAllRead`, `markRead`
- Hidden endpoint if traceable: `notifications/read-all`, `notifications/{id}/read`
- Expected direct ApiService call: `this.apiService.put(...)` in the component

- Page/component: `src/app/portals/staff/dashboard/staff-dashboard.page.ts`
- Feature service method: `patientState.refresh`
- Hidden endpoint if traceable: `patients`
- Expected direct ApiService call: `this.apiService.get('patients')` in the page or helper-only state

## Page Traceability Map
### `src/app/auth/login/login.page.ts`
- POST `auth/login`
- Payload source: login form values and popup token results
- Response handling: stores tokens, maps auth user, navigates by role
- Loading handling: local loading flags in page
- Error handling: page-level error messages/toasts
- Status: OK

### `src/app/auth/register/register.page.ts`
- POST `auth/register`
- Payload source: registration form values and popup token results
- Response handling: stores tokens, maps auth user, navigates by role
- Loading handling: local loading flags in page
- Error handling: page-level error messages/toasts
- Status: OK

### `src/app/auth/callback/auth-callback.page.ts`
- GET `auth/me`
- Payload source: none
- Response handling: maps auth user, persists session, navigates
- Loading handling: local flags + route handling
- Error handling: clears session and falls back as needed
- Status: OK

### `src/app/auth/set-password/set-password.page.ts`
- POST `auth/set-password`
- Payload source: form fields
- Response handling: maps auth user, stores tokens, navigates
- Loading handling: page local state
- Error handling: page local messaging
- Status: OK

### `src/app/portals/public/home/home.page.ts`
- GET `doctors`, `services`, `announcements`, `settings`
- Payload source: none
- Response handling: binds observables directly to UI
- Loading handling: stream-based
- Error handling: stream defaults where used
- Status: OK

### `src/app/portals/public/doctor-profile/doctor-profile.page.ts`
- GET `doctor-day-status/{id}`, `doctors/{id}`, `reviews?doctorId={id}`, `doctors/{id}/schedule`
- Payload source: route param id
- Response handling: local combineLatest mapping into profile view model
- Loading handling: local loading state
- Error handling: local catch/fallbacks
- Status: OK

### `src/app/portals/public/booking/booking.page.ts`
- GET `services`
- Payload source: none
- Response handling: binds service list to booking wizard
- Loading handling: stream-based
- Error handling: local catch/fallbacks
- Status: OK

### `src/app/portals/public/booking-confirmation/booking-confirmation.page.ts`
- GET `doctors`, `services`
- Payload source: selected wizard state
- Response handling: loads confirmation data for wizard summary
- Loading handling: stream-based
- Error handling: local catch/fallbacks
- Status: OK

### `src/app/portals/public/components/step-payment/step-payment.component.ts`
- GET `doctors`, `doctors/{doctorId}/services`, POST `bookings`, GET `bookings/{id}`
- Payload source: wizard state and booking creation response
- Response handling: local booking state update and navigation
- Loading handling: component local
- Error handling: local catch/fallbacks
- Status: OK

### `src/app/portals/public/components/step-proof/step-proof.component.ts`
- POST `bookings`, GET `bookings/{id}`, GET `patients/me`
- Payload source: wizard state and current user
- Response handling: local booking state update and proof workflow
- Loading handling: component local
- Error handling: local catch/fallbacks
- Status: OK

### `src/app/portals/public/components/step-slot-select/step-slot-select.component.ts`
- GET `doctors/{doctorId}/available-slots?date={date}`
- Payload source: selected doctor/date
- Response handling: local slot list mapping
- Loading handling: component local
- Error handling: local catch/fallbacks
- Status: OK

### `src/app/portals/public/components/step-doctor-service/step-doctor-service.component.ts`
- GET `doctors/{doctorId}/services`
- Payload source: selected doctor
- Response handling: local service list mapping
- Loading handling: component local
- Error handling: local catch/fallbacks
- Status: OK

### `src/app/portals/public/components/step-review/step-review.component.ts`
- GET `doctors`, `doctors/{doctorId}/services`
- Payload source: wizard state
- Response handling: local review summary
- Loading handling: component local
- Error handling: local catch/fallbacks
- Status: OK

### `src/app/portals/admin/bookings/bookings.page.ts`
- GET `bookings`
- Payload source: none
- Response handling: local booking row mapping and filtering
- Loading handling: local loading flags
- Error handling: local catch/fallbacks
- Status: OK

### `src/app/portals/admin/booking-detail/booking-detail.page.ts`
- GET `bookings/{id}`, GET `patients/{patientId}`, PATCH `bookings/{bookingId}/confirm|cancel|complete|no-show`, PUT `bookings/{bookingId}/waive|refund`, POST `audit-logs`
- Payload source: route params and UI action state
- Response handling: local receipt and booking detail mapping
- Loading handling: local page flags
- Error handling: local warnings/toasts
- Status: OK

### `src/app/portals/staff/bookings/staff-bookings.page.ts`
- GET `bookings/staff/all?page=...&pageSize=...`, PATCH `bookings/{bookingId}/check-in|undo-check-in`
- Payload source: page filters and selected row
- Response handling: local row mapping and queue updates
- Loading handling: local page state
- Error handling: local catch/fallbacks
- Status: OK

### `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts`
- GET `bookings/{bookingId}`, GET `payments/{paymentId}`, PATCH `payments/{bookingId}/confirm|waive`, PATCH `bookings/{bookingId}/check-in|undo-check-in`
- Payload source: route param and action inputs
- Response handling: local receipt/reload mapping
- Loading handling: local page flags
- Error handling: local toast/error messaging
- Status: OK

### `src/app/portals/staff/payments/staff-payments.page.ts`
- GET `bookings/staff/for-payment?page=...&pageSize=...`, PATCH `payments/{bookingId}/confirm|waive`
- Payload source: queue item and confirm/waive form state
- Response handling: local receipt modal state
- Loading handling: local page flags
- Error handling: local toast/error messaging
- Status: OK

### `src/app/portals/doctor/appointments/doctor-appointments.page.ts`
- GET `bookings/doctor/today`, `bookings/doctor/today-summary`, PATCH `bookings/{bookingId}/doctor-complete`, PATCH `payments/{bookingId}/waive`
- Payload source: dashboard filters and completion dialog state
- Response handling: local summary/queue updates
- Loading handling: local page flags
- Error handling: local catch/fallbacks
- Status: OK

### `src/app/portals/doctor/consultation/doctor-consultation.page.ts`
- GET `doctors/me`, `audit-logs`, `bookings/{bookingId}/consultation-record`, `bookings/{bookingId}`, POST `bookings/{bookingId}/consultation-record`, PATCH `bookings/{bookingId}/doctor-complete`, PATCH `payments/{bookingId}/waive`
- Payload source: route params, patient state, consultation forms
- Response handling: local consultation workspace and save/complete state
- Loading handling: local page flags
- Error handling: local toasts/warnings
- Status: NEEDS REVIEW (direct ApiService is present, but patientClinicalHistory/medicalRecords/patientState still hide backend in the page)

### `src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`
- GET `patients/{patientId}`, `bookings?patientId={patientId}&pageSize=50`, plus `MedicalRecordsService` flows
- Payload source: route param patient id
- Response handling: local detail and history tabs
- Loading handling: page local flags
- Error handling: local catch/fallbacks
- Status: FAIL

### `src/app/portals/admin/patient-detail/patient-detail.page.ts`
- GET `patients/{id}`, plus `MedicalRecordsService` flows
- Payload source: route param patient id
- Response handling: local detail and clinical-history tabs
- Loading handling: page local flags
- Error handling: local catch/fallbacks
- Status: FAIL

### `src/app/portals/patient/dashboard/patient-dashboard.page.ts`
- GET `patients/me`, `bookings?page=1&pageSize=100`, plus `MedicalRecordsService` flows
- Payload source: current user and booking filters
- Response handling: local dashboard cards and history views
- Loading handling: page local flags
- Error handling: local catch/fallbacks
- Status: FAIL

### `src/app/portals/patient/medical-records/patient-medical-records.page.ts`
- Uses `PatientDocumentsService` for medical-record PDF/download flows
- Payload source: current patient and selected record ids
- Response handling: local list rendering and PDF download actions
- Loading handling: page local flags
- Error handling: local catch/fallbacks
- Status: FAIL

### `src/app/portals/patient/prescriptions/patient-prescriptions.page.ts`
- Uses `PatientDocumentsService` for prescription PDF/download flows
- Payload source: current patient and selected prescription ids
- Response handling: local list rendering and PDF download actions
- Loading handling: page local flags
- Error handling: local catch/fallbacks
- Status: FAIL

### `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts`
- Uses `PatientDocumentsService` for document/lab uploads, lists, and downloads
- Payload source: selected patient, booking filter, file inputs
- Response handling: local media panel table and upload status
- Loading handling: component local flags
- Error handling: local catch/fallbacks
- Status: FAIL

### `src/app/shared/components/secure-image/secure-image.component.ts`
- Uses `PatientDocumentsService` for secure file downloads
- Payload source: input `src`, patient context, media kind
- Response handling: local image/preview fetch
- Loading handling: component local state
- Error handling: local catch/fallbacks
- Status: FAIL

### `src/app/shared/components/patient-media-panel/patient-media-preview.modal.ts`
- Uses `PatientDocumentsService` for media-file download
- Payload source: selected preview item
- Response handling: local modal preview
- Loading handling: modal local state
- Error handling: local catch/fallbacks
- Status: FAIL

### `src/app/shared/components/notification-panel/notification-panel.component.ts`
- Uses `NotificationService.markAllRead`, `markRead`
- Payload source: current notification/user selection
- Response handling: local unread badge state
- Loading handling: component local state
- Error handling: local warnings
- Status: FAIL

### `src/app/portals/admin/doctor-form/doctor-form.page.ts`
- Uses `AdminDoctorsService` for doctor CRUD/schedule flows
- Payload source: form fields and route id
- Response handling: local wizard/form state
- Loading handling: page local flags
- Error handling: local catch/toasts
- Status: FAIL

### `src/app/portals/admin/doctors/doctors.page.ts`
- Uses `AdminDoctorsService.getSchedule`
- Payload source: selected doctor row
- Response handling: local schedule display
- Loading handling: page local flags
- Error handling: local catch/fallbacks
- Status: FAIL

### `src/app/portals/admin/services/services.page.ts`
- Uses `AdminDoctorsService.getAllDoctors`
- Payload source: none
- Response handling: local service form selectors
- Loading handling: page local flags
- Error handling: local catch/fallbacks
- Status: FAIL

### `src/app/portals/doctor/consultation/doctor-consultation-stub.page.ts`
- Uses `PatientStateService.getPatients`
- Payload source: none / current user state
- Response handling: local stub selection
- Loading handling: helper state loading
- Error handling: local fallback
- Status: FAIL

### `src/app/portals/staff/dashboard/staff-dashboard.page.ts`
- Uses `PatientStateService.refresh`
- Payload source: none
- Response handling: local dashboard patient counts
- Loading handling: helper state loading
- Error handling: local fallback
- Status: FAIL

## Auth Flow Audit
- login: PASS
  - Current call path: login page -> ApiService
  - Missing work: none

- register: PASS
  - Current call path: register page -> ApiService
  - Missing work: none

- restore session: PASS
  - Current call path: auth callback / app initializer -> ApiService
  - Missing work: none

- set password: PASS
  - Current call path: set-password page -> ApiService
  - Missing work: none

- change password: PASS
  - Current call path: profile pages -> ApiService
  - Missing work: none

- logout: PASS
  - Current call path: layout components -> ApiService
  - Missing work: none

- Google login: PASS
  - Current call path: login/register pages -> ApiService
  - Missing work: none

- Facebook login: PASS
  - Current call path: login/register pages -> ApiService
  - Missing work: none

## High-Risk Flow Audit
- booking flow:
  - Status: PARTIAL
  - Issues: pages/components now call ApiService directly, but `src/app/core/services/booking.service.ts` still contains backend-calling methods, most of which are dead or only used internally.
  - Suggested next fix: remove or split the remaining dead booking-service methods one section at a time.

- doctor queue:
  - Status: FAIL
  - Issues: `doctor-consultation-stub.page.ts` and `staff-dashboard.page.ts` still go through `PatientStateService`; that service still performs backend access.
  - Suggested next fix: move patient queue/state fetches directly into the pages or make the state service helper-only.

- doctor consultation:
  - Status: FAIL
  - Issues: `doctor-consultation.page.ts` still uses `PatientClinicalHistoryService`, `MedicalRecordsService`, and `PatientStateService`, all of which hide backend calls.
  - Suggested next fix: flatten the consultation history fetch/save flow into the page.

- staff payment:
  - Status: PASS
  - Issues: direct page calls are in place for confirm/waive/receipt behavior.
  - Suggested next fix: none for the page flow; only shared-service cleanup remains.

- receipts:
  - Status: PASS
  - Issues: receipt pages now rebuild data locally after direct booking/payment calls.
  - Suggested next fix: none for the page flow.

- uploads/downloads:
  - Status: FAIL
  - Issues: all blob/FormData operations still go through `PatientDocumentsService`.
  - Suggested next fix: move one upload/download flow into `patient-media-panel.component.ts` first.

## Behavior Preservation Risks
- `src/app/core/services/patient-documents.service.ts`: blob/FormData upload/download behavior is preserved in service wrappers, but the page/component traceability goal is not met.
- `src/app/core/services/medical-records.service.ts`: response mapping is heavy and centralized, so any direct migration will need careful parity checks.
- `src/app/core/services/patient-state.service.ts`: state hydration uses backend calls on-demand, which can change timing if moved directly.
- `src/app/core/services/notification.service.ts`: read-state updates are optimistic; moving them can affect badge timing.
- `src/app/portals/admin/services/admin-doctors.service.ts`: doctor schedule and blocked-date mapping are pure but still hidden behind wrapper calls.
- Migrated pages that already call ApiService directly appear to preserve endpoint strings, payloads, DTOs, loading, errors, RxJS chains, and UI assignments as checked in the build pass.

## Unused/Dead API Methods
- `src/app/core/services/booking.service.ts`: `getStaffTodayBookings`, `getStaffBookings`, `getStaffForPayment`, `requestBookings`, `requestBookingById`, `createBooking$`, plus the remaining helper chain appear unused by pages/components after the migration.
- `src/app/portals/admin/services/admin-doctors.service.ts`: `createDoctorInvite` throws and appears dead/unimplemented.
- `src/app/portals/admin/services/doctor-state.service.ts`: backend methods exist but no page/component call site was found in this audit pass.
- `src/app/core/services/push-notification.service.ts`: direct backend methods exist, but the service is infrastructure-oriented and not directly page-owned.

## Build Result
Command: `npm run build`
Result: PASS
Errors/warnings: build succeeded; Angular template warnings remain in `src/app/portals/doctor/consultation/components/consultation-workspace.component.ts`, `src/app/portals/doctor/consultation/doctor-consultation.page.ts`, and `src/app/portals/public/components/step-doctor-service/step-doctor-service.component.ts`
Likely related files: the three warning files above; they are non-fatal

Command: `ionic build`
Result: PASS
Errors/warnings: initial sandboxed run failed with EPERM writing `C:\Users\0013969\.ionic\config.json.*`; escalated retry passed successfully
Likely related files: none in repo; the first failure was a user-profile permission issue

## Final Recommendation
1. Fix `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts` and `src/app/core/services/patient-documents.service.ts` next, because blob/FormData flows are still fully hidden.
2. Then flatten `src/app/portals/admin/doctor-form/doctor-form.page.ts` and `src/app/portals/admin/services/admin-doctors.service.ts`.
3. Then flatten `src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`, `src/app/portals/admin/patient-detail/patient-detail.page.ts`, and `src/app/core/services/medical-records.service.ts`.
4. Then remove or split the remaining backend calls in `src/app/core/services/notification.service.ts`, `src/app/core/services/patient-state.service.ts`, and `src/app/core/services/patient-clinical-history.service.ts`.
5. Leave `src/app/core/services/booking.service.ts` for last, because the remaining methods are mostly dead/shared cleanup rather than active page flows.

# Phase 1 Static Analysis — Staff Account / Staff Portal

Scope used: authenticated `Staff` portal routes under `/staff/*`, plus a bonus Admin Staff Accounts route `/admin/staff` because the requested wording was “staff account”. Source-confirmed routes come from `src/app/portals/staff/staff.routes.ts` and `src/app/portals/admin/staff/staff.page.ts`.

## 1A. Route Inventory

| Route | Component file | Page title/header text found in source |
|---|---|---|
| `/staff/dashboard` | `src/app/portals/staff/dashboard/staff-dashboard.page.ts` | `Dashboard`, `Today's Queue` |
| `/staff/bookings` | `src/app/portals/staff/bookings/staff-bookings.page.ts` | `Bookings`, `View and manage patient bookings across all dates`, `No bookings found` |
| `/staff/payments` | `src/app/portals/staff/payments/staff-payments.page.ts` | `Payment Queue`, `Outstanding professional fees`, `Collect Payment`, `Waive PF` |
| `/staff/bookings/:id` | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` | `Booking Details`, `Patient Info`, `Doctor Info`, `Appointment Details`, `Payment Info`, `Actions` |
| `/staff/walk-in` | `src/app/portals/staff/walk-in/staff-walk-in.page.ts` | `Walk-In Booking`, `Patient Search`, `Slot Selection`, `Payment`, `Booking Summary` |
| `/staff/patients` | `src/app/portals/staff/patients/staff-patients.page.ts` | `Patients`, `No patients found` |
| `/staff/patients/:id` | `src/app/portals/staff/patient-detail/staff-patient-detail.page.ts/html` | `Patient Detail`, `Identity`, `Create Portal Account`, `Contact & Address`, `Emergency Contact`, `Insurance`, `No bookings` |
| `/staff/doctor-status` | `src/app/portals/staff/doctor-status/doctor-status.page.ts` | `Doctor Availability`, `Available`, `Running Late`, `Unavailable`, `No doctors found` |
| `/staff/profile` | `src/app/portals/staff/profile/staff-profile.page.ts` | `My Profile`, `Personal Info`, `Change Password` |
| `/admin/staff` | `src/app/portals/admin/staff/staff.page.ts` | `Staff Accounts`, `Invite Staff`, `No staff accounts` |

## 1B. Selector Inventory

| Page | Element type | Label/text | Selector type | Selector value | Confirmed in source? |
|---|---|---|---|---|---|
| Staff Dashboard | Heading | `Dashboard` | role/text | `getByRole('heading', { name: 'Dashboard' })` | Yes |
| Staff Dashboard | Data cards | `Today's Appointments`, `Ready for Payment`, `Walk-Ins Today`, `Confirmed Today` | text/class | `.stat-card`, `.stat-card__value` | Yes |
| Staff Dashboard | Banner/action | `Go to Payment Queue →` | text/click | `.banner.banner--danger` | Yes |
| Staff Dashboard | Data table component | `app-queue-table` | component | `app-queue-table`, `.queue-table` | Yes |
| Staff Dashboard | Loading | `app-skeleton` from queue table | component | `app-skeleton` | Yes |
| Staff Dashboard | Empty state | `No queue items for now.` | text/component | `app-empty-state` | Yes |
| Staff Bookings | Filters | doctor/status/date | CSS | `select.filter-input`, `input[type=date]` | Yes |
| Staff Bookings | Refresh | icon button | CSS | `button.btn-icon` | Yes |
| Staff Bookings | Rows | patient/doctor/service/status/payment | CSS/table | `.booking-row`, `table.clinic-table`, `.mobile-card` | Yes |
| Staff Bookings | Actions | `Check In`, `Undo Check-In` | role/text | `button:has-text('Check In')` | Yes |
| Staff Bookings | Pagination | `Previous`, `Next` | role/text | `.pagination__button` | Yes |
| Staff Bookings | Empty | `No bookings found` | text/component | `app-empty-state` | Yes |
| Booking Detail | Back | `Back to Bookings` | role/text | `button.btn-ghost` | Yes |
| Booking Detail | Actions | `Check In`, `Undo Check-In`, `Confirm Payment`, `Waive PF`, `Print Summary/Receipt` | role/text | `button` labels | Yes |
| Booking Detail | Payment modal | `Collect Payment` | modal/role | `ion-modal`, `select`, `input`, `textarea` | Yes |
| Payments | Loading | `Loading payment queue...` | text/CSS | `.payment-loading` | Yes |
| Payments | Actions | `Confirm Payment`, `Waive PF`, `Previous`, `Next` | role/text | `button` labels | Yes |
| Payments | Payment modal | `Collect Payment`, `Payment Method`, `Amount Received`, `Reference Number`, `Notes` | name/CSS | `select[name=paymentMethod]`, `input[name=amountReceived]`, `input[name=referenceNumber]`, `textarea[name=paymentNotes]` | Yes |
| Walk-In | Step buttons | `Patient`, `Slot`, `Payment` | role/text | `.stepper__step` | Yes |
| Walk-In | Search | `Search by patient name, code, phone, or email` | aria/placeholder | `ion-searchbar[aria-label='Search patients']` | Yes |
| Walk-In | Quick register inputs | first/middle/last/date/sex/contact/email/address | formControlName/placeholder | `ion-input[formControlName]`, `ion-select[formControlName=sex]` | Yes |
| Walk-In | Booking selects | doctor/service/date | formControlName | `ion-select[formControlName=doctorId]`, `ion-select[formControlName=serviceId]`, `ion-input[formControlName=appointmentDate]` | Yes |
| Patients | Search | `Search by name, code, contact, or email` | aria/placeholder | `input[aria-label='Search patients']` | Yes |
| Patients | Clear | `Clear` | role/text | `button.btn-ghost` | Yes |
| Patient Detail | Tabs | `Overview`, `Bookings`, `Records` | Ionic segment | `ion-segment`, `ion-segment-button[value]` | Yes |
| Patient Detail | Portal account fields | email/temp password/confirm | formControlName | `input[formControlName=email]`, `temporaryPassword`, `confirmTemporaryPassword` | Yes |
| Doctor Status | Retry | `Retry` | role/text | `button.btn-primary` | Yes |
| Doctor Status | Actions | `Mark Available`, `Set Running Late`, `Mark Unavailable Today`, `Confirm`, `Cancel` | role/text | child `app-doctor-status-card` buttons | Yes |
| Profile | Personal fields | fullName/contact/email | formControlName/readonly | `input[formControlName=fullName]`, `contactNumber`, `input[readonly]` | Yes |
| Profile | Password fields | current/new/confirm | formControlName | `currentPassword`, `newPassword`, `confirmPassword` | Yes |
| Admin Staff Accounts | Invite | `Invite Staff` | role/text | `button.btn-primary` | Yes |
| Admin Staff Accounts | Invite form | Full Name/Email/Phone | placeholder/name | `input[name=fullName]`, `input[name=email]`, `input[name=phone]` | Yes |
| Admin Staff Accounts | Actions | `Deactivate`, `Reactivate`, `Revoke` | role/text | `button.btn-ghost` | Yes |

## 1C. API Call Inventory

| Page | Method | Endpoint | Trigger | Response used for | Error handler exists? | Error handler type |
|---|---|---|---|---|---|---|
| Dashboard | GET | `bookings/staff/today?page=1&pageSize=500` | init/realtime/enter | queue and stats | Yes | SILENT — list cleared |
| Dashboard | GET | `doctors` | init/enter | doctor labels/state | Yes | CONSOLE/SILENT via `console.warn` + empty list |
| Dashboard | GET | `patients...` via `patientState.refresh()` | init/enter | patient labels | Yes | service-level only, verify |
| Dashboard | PATCH | `bookings/:id/check-in` | queue action | check-in | No | SILENT — `subscribe()` no handlers |
| Dashboard | PATCH | `bookings/:id/undo-check-in` | queue action | undo check-in | No | SILENT — `subscribe()` no handlers |
| Bookings | GET | `doctors` | init | doctor filter | Yes | SILENT — doctors cleared |
| Bookings | GET | `bookings/staff/all?page=&pageSize=` | init/filters/pagination | list/table | Yes | TOAST |
| Bookings | PATCH | `bookings/:id/check-in` | button | update list | Yes | TOAST |
| Bookings | PATCH | `bookings/:id/undo-check-in` | button | update list | Yes | TOAST |
| Booking Detail | GET | `bookings/:id` | init/refresh | detail cards/actions | Partial | CONSOLE + null; no toast |
| Booking Detail | PATCH | `bookings/:id/check-in` | button | refresh detail | Yes | TOAST |
| Booking Detail | PATCH | `bookings/:id/undo-check-in` | button | refresh detail | Yes | TOAST |
| Booking Detail | PATCH | `payments/:bookingId/confirm` | modal submit | receipt + refresh | Yes | TOAST |
| Booking Detail | GET | `bookings/:id` | after payment | receipt context | Yes | TOAST on outer chain |
| Booking Detail | PATCH | `payments/:bookingId/waive` | waive modal | refresh | Yes | TOAST |
| Booking Detail | GET | `payments/:paymentId` | print receipt | receipt print data | Yes | TOAST |
| Payments | GET | `bookings/staff/for-payment?page=&pageSize=` | init/pagination/reload | payment queue | Yes | TOAST |
| Payments | PATCH | `payments/:bookingId/confirm` | modal submit | receipt | Yes | TOAST |
| Payments | PATCH | `payments/:bookingId/waive` | waive modal | reload | Yes | TOAST |
| Walk-In | GET | `doctors` | init | doctor select | Yes | TOAST |
| Walk-In | GET | `patients?page=1&pageSize=&search=` | init/search | patient search | Yes | TOAST + error state |
| Walk-In | POST | `patients` | quick register submit | selected patient | Yes | TOAST |
| Walk-In | GET | `doctors/:id/services` fallback `services` | doctor select | service select | Yes | TOAST |
| Walk-In | GET | `doctors/:id/available-slots?date=` | doctor/date select | slot grid | Yes | TOAST |
| Walk-In | POST | `bookings/walk-in` | create booking | redirect to bookings | Yes | TOAST |
| Patients | GET | `patients?page=&pageSize=&search=` | init/search/pagination | patient list | Partial | SILENT — no user-facing error |
| Patient Detail | GET | `patients/:id` | init/retry | detail view | Yes | inline error card |
| Patient Detail | GET | bookings by patient via `BookingService.getBookingsByPatientId()` | after patient load | bookings tab | Yes | SILENT — bookings cleared |
| Patient Detail | POST | `patients/:id/portal-account` | create account | reload detail | Yes | TOAST |
| Doctor Status | GET | `doctors` | init/retry | doctor cards | Yes | inline error + console warn |
| Doctor Status | GET | `doctor-day-status/:userIdOrId` | after doctors | card status | Yes | SILENT per doctor fallback null |
| Doctor Status | POST | `doctor-day-status/:doctorId/status` | card action | update status | Yes | TOAST, but color argument is ignored in source |
| Profile | PUT | `auth/me` | save profile | update auth state | Yes | TOAST |
| Profile | POST | `auth/change-password` | change password | reset form | Yes | TOAST |
| Admin Staff Accounts | GET | `admin/staff` | init/retry | staff table | Yes | inline notice |
| Admin Staff Accounts | POST | `admin/staff/invite` | invite form submit | reload table | Blocked by source bug | FAIL risk |
| Admin Staff Accounts | PUT | `admin/staff/invite/:id/revoke` | revoke invite | reload table | Yes | TOAST |
| Admin Staff Accounts | PUT | `admin/staff/:id/update-status` | deactivate/reactivate | reload table | Yes | TOAST |

## 1D. Data Shape Inventory

| Endpoint | Expected response shape | Null-risk fields | Zero-risk fields | Empty array-risk fields |
|---|---|---|---|---|
| `bookings/staff/today` | `{ items: Booking[], totalCount, page, pageSize }` | `patientName`, `doctorName`, `serviceNames`, `slotStartTime`, `queueNumber`, `paymentStatus`, `status` | `queueNumber`, stats counts | `items` |
| `bookings/staff/all` | `{ items: Booking[], totalCount, page, pageSize }` | same as above | `queueNumber` | `items` |
| `bookings/:id` | `Booking` with nested `patient`, `doctor`, `payment`, `services` | `patient`, `doctor`, `payment`, `finalAmount`, `queueNumber`, `serviceNames` | `finalAmount`, `queueNumber` | `services` |
| `bookings/staff/for-payment` | `{ items: StaffForPaymentItem[], totalCount, page, pageSize }` | `payment_id`, `booking_id`, `patient_name`, `doctor_name`, `amount_due`, `queue_number` | `amount_due`, `queue_number` | `items` |
| `patients?page...` | `{ items: PatientSummary[], totalCount, page, pageSize, totalPages }` or array | `fullName`, `patientCode`, `contactNumber`, `email`, `hasAccount` | `totalCount` | `items` |
| `patients/:id` | `PatientDetail` | `firstName`, `lastName`, `email`, `contactNumber`, `hasAccount`, `userId`, address/insurance fields | n/a | bookings child list |
| `doctors` | `Doctor[]` | `id`, `userId`, `fullName`, `specialization`, `status` | status counts | array |
| `doctor-day-status/:id` | `DoctorDayStatus | null` | `status`, `runningLateMinutes` | `runningLateMinutes` | n/a |
| `doctors/:id/services` / `services` | `Service[]` | `id`, `name`, `doctorIds` | `price`, duration | array |
| `doctors/:id/available-slots` | `AvailableSlot[]` | `slot`, `slotEnd`, `available` | `bookedCount`, `capacity` | array |
| `auth/me` PUT | `AuthUserDto` | `fullName`, `phoneNumber`, `avatarUrl` | n/a | n/a |
| `admin/staff` | `StaffRow[]` | `id`, `fullName`, `email`, `role`, `status`, `isInvite` | n/a | array |

## 1E. Risk Flags

| Page | Risk type | Description | Suspected file | Severity |
|---|---|---|---|---|
| Dashboard | SWALLOWED_ERROR | Today bookings failure clears queue silently; no toast/error banner. | `staff-dashboard.page.ts` | High |
| Dashboard | SWALLOWED_ERROR | Queue actions call PATCH with `.subscribe()` and no success/error handler. | `staff-dashboard.page.ts` | High |
| Dashboard | CONSOLE/SILENT | Doctors load failure only warns and shows empty doctor state. | `staff-dashboard.page.ts` | Medium |
| Bookings | SWALLOWED_ERROR | Doctor filter API failure clears doctors with no toast. | `staff-bookings.page.ts` | Low/Medium |
| Booking Detail | SWALLOWED_ERROR | Booking load failure `console.error`s and returns null; no explicit toast. | `staff-booking-detail.page.ts` | High |
| Patients | SWALLOWED_ERROR | Patient list API error clears patients; no inline error/toast. | `staff-patients.page.ts` | High |
| Patient Detail | SWALLOWED_ERROR | Bookings-by-patient load error clears bookings silently. | `staff-patient-detail.page.ts` | Medium |
| Doctor Status | UI_BUG | `presentToast(message, color)` ignores passed color and always uses `success`. | `doctor-status.page.ts` | Medium |
| Admin Staff Accounts | FUNCTIONAL_BUG | `save()` sets `const accessToken = ''`, so invite submit always shows session expired and never calls `POST admin/staff/invite`. | `admin/staff/staff.page.ts` | Critical |
| Admin Staff Accounts | MISSING_AUTH_SOURCE | Invite logic does not read actual token service/localStorage before blocking. | `admin/staff/staff.page.ts` | Critical |

## Phase 1 Completion

Phase 1 static tables are complete for Staff portal routes and the included Admin Staff Accounts page. Selectors in generated tests use only source-confirmed text, class, name, placeholder, `formControlName`, or ARIA attributes. Ionic overlay selectors are flagged in comments where runtime verification may be needed.

# SELECTOR_CONFIDENCE_REPORT.md — STAFF Playwright Phase 2

Generated from STAFF Phase 1 static analysis and used by the Phase 2 Playwright suite.

## Global/Auth

| Selector | Used in | Confirmed in source? | Confidence | Notes |
|---|---|---:|---|---|
| `ion-input[formcontrolname="email"] input` | `tests/staff/setup.ts` | Yes | High | Login page uses `ion-input formControlName="email"`. |
| `ion-input[formcontrolname="password"] input` | `tests/staff/setup.ts` | Yes | High | Login page uses `ion-input formControlName="password"`. |
| `button.login-submit[type="submit"]` | `tests/staff/setup.ts` | Yes | High | Login submit button has `.login-submit`. |

## Staff Dashboard

| Selector | Used in | Confirmed in source? | Confidence | Notes |
|---|---|---:|---|---|
| `h2.page-title` | `dashboard.spec.ts` | Yes | High | Dashboard heading text is `Dashboard`. |
| `app-queue-table` | `dashboard.spec.ts` | Yes | High | Child queue table. |
| `app-queue-table tbody tr[role="button"]` | `dashboard.spec.ts` | Yes | High | Queue table row is clickable. |
| `app-queue-table .queue-mobile-card[role="button"]` | `dashboard.spec.ts` | Yes | High | Mobile queue card is clickable. |
| `button.queue-action-button` | `dashboard.spec.ts` | Yes | High | Queue action button text changes by status. |
| `app-empty-state` with `No queue items for now.` | `dashboard.spec.ts` | Yes | High | Queue empty state. |

## Staff Bookings

| Selector | Used in | Confirmed in source? | Confidence | Notes |
|---|---|---:|---|---|
| `app-page-header` | `bookings.spec.ts` | Yes | High | Page title uses `app-page-header`. |
| `select.filter-input` | `bookings.spec.ts` | Yes | Medium | Doctor/status selects share same class; tests use index. |
| `input[type="date"].filter-date` | `bookings.spec.ts` | Yes | High | Date filter. |
| `button.btn-icon` | `bookings.spec.ts` | Yes | High | Refresh button. |
| `.loading-card` | Phase 1 only | Yes | High | Loading text: `Loading bookings…`. |
| `tr.booking-row` | `bookings.spec.ts` | Yes | High | Main booking row. |
| `.mobile-card[role="button"]` | `bookings.spec.ts` | Yes | Medium | Generic mobile card selector. |
| `button.btn-primary:has-text("Check In")` | `bookings.spec.ts` | Yes | High | Check-in action. |
| `button.btn-outline:has-text("Undo Check-In")` | `bookings.spec.ts` | Yes | High | Undo check-in action. |
| `app-empty-state` with `No bookings found` | `bookings.spec.ts` | Yes | High | Empty state. |

## Staff Booking Detail

| Selector | Used in | Confirmed in source? | Confidence | Notes |
|---|---|---:|---|---|
| `button.btn-ghost:has-text("Back to Bookings")` | `booking-detail.spec.ts` | Yes | High | Back button. |
| `button.btn-primary:has-text("Check In")` | `booking-detail.spec.ts` | Yes | High | Detail check-in action. |
| `button.btn-outline:has-text("Undo Check-In")` | `booking-detail.spec.ts` | Yes | High | Detail undo action. |
| `button.btn-primary:has-text("Confirm Payment")` | `booking-detail.spec.ts` | Yes | Medium | Appears in action area and modal; tests use first/last based on context. |
| `ion-modal` | `booking-detail.spec.ts` | Yes | High | Payment modal. |

## Staff Payments

| Selector | Used in | Confirmed in source? | Confidence | Notes |
|---|---|---:|---|---|
| `app-page-header` | `payments.spec.ts` | Yes | High | Title `Payment Queue`. |
| `table.pt tbody tr` | `payments.spec.ts` | Yes | Medium | Payment rows have no dedicated class. |
| `.mobile-card` | `payments.spec.ts` | Yes | Medium | Generic card fallback. |
| `button.btn-primary:has-text("Confirm Payment")` | `payments.spec.ts` | Yes | High | Opens modal and confirms payment. |
| `button.btn-outline:has-text("Waive PF")` | `payments.spec.ts` | Yes | High | Opens waive modal. |
| `section.pw[role="dialog"]` | `payments.spec.ts` | Yes | High | Payment modal dialog. |
| `select[name="paymentMethod"]` | `payments.spec.ts` | Yes | High | Payment method. |
| `input[name="amountReceived"]` | `payments.spec.ts` | Yes | High | Amount received. |
| `input[name="referenceNumber"]` | `payments.spec.ts` | Yes | High | Reference number. |
| `textarea[name="paymentNotes"]` | `payments.spec.ts` | Yes | High | Payment notes. |
| `app-empty-state` with `No queue items for now.` | `payments.spec.ts` | Yes | High | Empty state. |

## Staff Walk-In

| Selector | Used in | Confirmed in source? | Confidence | Notes |
|---|---|---:|---|---|
| `h2.page-title` | `walk-in.spec.ts` | Yes | High | Page heading. |
| `button.stepper__step` | `walk-in.spec.ts` | Yes | High | Patient/Slot/Payment stepper. |
| `ion-searchbar.walk-in-searchbar` | `walk-in.spec.ts` | Yes | High | Patient search. |
| `button.patient-result` | `walk-in.spec.ts` | Yes | High | Patient result. |
| `form.quick-register` | `walk-in.spec.ts` | Yes | High | Quick register form. |
| `ion-input[formcontrolname="firstName"] input` | `walk-in.spec.ts` | Yes | High | Quick register field. |
| `ion-input[formcontrolname="middleName"] input` | `walk-in.spec.ts` | Yes | High | Quick register field. |
| `ion-input[formcontrolname="lastName"] input` | `walk-in.spec.ts` | Yes | High | Quick register field. |
| `ion-input[formcontrolname="dateOfBirth"] input` | `walk-in.spec.ts` | Yes | High | Quick register field. |
| `ion-select[formcontrolname="sex"]` | `walk-in.spec.ts` | Yes | High | Sex select. |
| `ion-input[formcontrolname="contactNumber"] input` | `walk-in.spec.ts` | Yes | High | Quick register field. |
| `ion-input[formcontrolname="email"] input` | `walk-in.spec.ts` | Yes | Medium | Also exists on login page, scoped by active route. |
| `ion-input[formcontrolname="address"] input` | `walk-in.spec.ts` | Yes | High | Quick register field. |
| `ion-select[formcontrolname="doctorId"]` | `walk-in.spec.ts` | Yes | High | Doctor select. |
| `ion-select[formcontrolname="serviceId"]` | `walk-in.spec.ts` | Yes | High | Service select. |
| `.slot-cell--available, .slot-cell` | `walk-in.spec.ts` | Yes | High | Slot grid cell. |
| `button.btn-primary:has-text("Create Booking")` | `walk-in.spec.ts` | Yes | High | Final submit button. |

## Staff Patients

| Selector | Used in | Confirmed in source? | Confidence | Notes |
|---|---|---:|---|---|
| `h2.pt` | `patients.spec.ts` | Yes | High | Page title. |
| `input.fi[placeholder="Search by name, code, contact, or email"]` | `patients.spec.ts` | Yes | High | Search input. |
| `button.btn-ghost:has-text("Clear")` | `patients.spec.ts` | Yes | High | Clear search. |
| `table.pt tbody tr[role="button"]` | `patients.spec.ts` | Yes | High | Patient row. |
| `.mc[role="button"]` | `patients.spec.ts` | Yes | High | Mobile patient card. |
| `app-empty-state` with `No patients found` | `patients.spec.ts` | Yes | High | Empty state. |

## Staff Patient Detail

| Selector | Used in | Confirmed in source? | Confidence | Notes |
|---|---|---:|---|---|
| `button.btn-ghost:has-text("Back to Patients")` | `patient-detail.spec.ts` | Yes | High | Back button. |
| `ion-segment-button[value="overview"]` | `patient-detail.spec.ts` | Yes | High | Overview tab. |
| `ion-segment-button[value="bookings"]` | `patient-detail.spec.ts` | Yes | High | Bookings tab. |
| `ion-segment-button[value="records"]` | `patient-detail.spec.ts` | Yes | High | Records tab. |
| `form.portal-account-form` | `patient-detail.spec.ts` | Yes | High | Conditional portal account form. |
| `input[formcontrolname="email"]` | `patient-detail.spec.ts` | Yes | Medium | Scoped by route; conditional form. |
| `input[formcontrolname="temporaryPassword"]` | `patient-detail.spec.ts` | Yes | High | Portal temp password. |
| `input[formcontrolname="confirmTemporaryPassword"]` | `patient-detail.spec.ts` | Yes | High | Confirm temp password. |
| `button.portal-account-submit` | `patient-detail.spec.ts` | Yes | High | Create portal account. |
| `.error-card` | `patient-detail.spec.ts` | Yes | High | Error state. |

## Staff Doctor Status

| Selector | Used in | Confirmed in source? | Confidence | Notes |
|---|---|---:|---|---|
| `app-page-header` | `doctor-status.spec.ts` | Yes | High | Title `Doctor Availability`. |
| `app-doctor-status-card` | `doctor-status.spec.ts` | Yes | High | Doctor card. |
| `button.btn-outline:has-text("Set Running Late")` | `doctor-status.spec.ts` | Yes | High | Opens running-late input. |
| `input[id^="running-late-input-"]` | `doctor-status.spec.ts` | Yes | High | Running late minutes input. |
| `button.btn-primary:has-text("Confirm")` | `doctor-status.spec.ts` | Yes | High | Confirms running late. |
| `button.btn-danger:has-text("Mark Unavailable Today")` | `doctor-status.spec.ts` | Yes | High | Opens confirm modal. |
| `.er` | `doctor-status.spec.ts` | Yes | High | Error panel. |
| `app-empty-state` with `No doctors found` | `doctor-status.spec.ts` | Yes | High | Empty state. |

## Staff Profile

| Selector | Used in | Confirmed in source? | Confidence | Notes |
|---|---|---:|---|---|
| `app-page-header` | `profile.spec.ts` | Yes | High | Title `My Profile`. |
| `form.profile-form` | `profile.spec.ts` | Yes | High | Two forms: personal and password. |
| `input[formcontrolname="fullName"]` | `profile.spec.ts` | Yes | High | Editable field. |
| `input[formcontrolname="contactNumber"]` | `profile.spec.ts` | Yes | High | Editable field. |
| `input.filter-input--readonly[readonly]` | `profile.spec.ts` | Yes | High | Email readonly field. |
| `button.btn-primary:has-text("Save Changes")` | `profile.spec.ts` | Yes | High | Save profile. |
| `input[formcontrolname="currentPassword"]` | `profile.spec.ts` | Yes | High | Password form. |
| `input[formcontrolname="newPassword"]` | `profile.spec.ts` | Yes | High | Password form. |
| `input[formcontrolname="confirmPassword"]` | `profile.spec.ts` | Yes | High | Password form. |
| `button.btn-primary:has-text("Change Password")` | `profile.spec.ts` | Yes | High | Password submit. |
| `.form-error-message` with `Passwords do not match` | `profile.spec.ts` | Yes | High | Validation message. |

## High-priority `data-testid` recommendations

These tests intentionally use confirmed source selectors, but the app should add stable `data-testid` attributes to reduce brittleness:

1. `staff-booking-row`
2. `staff-check-in-btn`
3. `staff-undo-check-in-btn`
4. `staff-payment-row`
5. `staff-confirm-payment-btn`
6. `staff-waive-pf-btn`
7. `staff-walkin-create-patient-btn`
8. `staff-walkin-create-booking-btn`
9. `staff-patient-row`
10. `staff-doctor-status-card`
11. `staff-running-late-btn`
12. `staff-profile-save-btn`

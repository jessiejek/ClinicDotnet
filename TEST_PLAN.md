# TEST_PLAN.md

## 1. Test Plan Overview

### Scope of Testing

This test plan covers the confirmed hospital web portal flows documented in `PROJECT_BLUEPRINT.md` for the four authenticated roles:

- Doctor
- Patient
- Staff
- Admin

The plan is intended for Playwright E2E test generation. It focuses on user-visible behavior, role-specific workflows, shared authentication/session behavior, permission boundaries, error handling, empty states, and UI consistency.

### Roles Covered

| Role | Portal Root | Default Route | Main Layout | Guarded? |
|---|---|---|---|---|
| Doctor | `/doctor` | `/doctor/dashboard` | `PortalLayoutComponent` | Yes, `authGuard` + `roleGuard` |
| Patient | `/patient` | `/patient/dashboard` | `PatientLayoutComponent` | Yes, `authGuard` + `roleGuard` |
| Staff | `/staff` | `/staff/dashboard` | `PortalLayoutComponent` | Yes, `authGuard` + `roleGuard` |
| Admin | `/admin` | `/admin/dashboard` | `PortalLayoutComponent` | Yes, `authGuard` + `roleGuard` + `firstLoginGuard` |

### Test Environment and Base URL

[NEEDS CLARIFICATION: `PROJECT_BLUEPRINT.md` does not confirm the frontend test base URL in Section 8. Use the project Playwright config or environment configuration before implementation. Previously observed local FE convention may be `http://localhost:4200`, but this test plan does not treat that as confirmed by the blueprint.]

Confirmed API-related environment behavior from the blueprint:

- API calls are centralized mainly through `ApiService`.
- Auth/session API calls include `auth/login`, `auth/me`, `auth/logout`, and `auth/refresh-token`.
- Protected routes depend on auth and role guards.

### Testing Approach

A test is considered valid only when it verifies both:

1. The expected user action triggers the correct flow.
2. The expected result is visibly rendered on screen as text or UI elements.

API response status alone is not enough. DOM attachment alone is not enough. Tests must assert rendered, visible content.

### Passing Test Rules

- A test only passes if expected data is visibly rendered on screen as text or UI elements.
- Asserting API response status alone, such as `HTTP 200`, is not a passing condition.
- Asserting DOM attachment or element existence alone is not a passing condition.
- All data assertions must confirm the element is visible in the viewport with the correct content.
- Use `toBeVisible()` and `toHaveText()` or `toContainText()` for data display assertions.
- For Ionic components, assert the rendered output inside the component, not only the web component tag. Example: assert the text inside an `ion-card`, not merely that `ion-card` exists.
- Prefer stable `data-testid` selectors when available.
- If a selector is missing or behavior is unclear, mark the test case as `[NEEDS CLARIFICATION: ...]`.

### Out of Scope for This Test Plan

- Unit tests.
- Component tests.
- Backend-only API contract tests.
- Database migration tests.
- Performance/load testing.
- Visual regression testing beyond layout/navigation visibility checks.
- Features explicitly marked as `[NOT IMPLEMENTED]`, `[UI ONLY]`, or `[MOCK DATA]`, except to verify that they are clearly disabled or marked as unavailable.

### Known Test Blockers from Blueprint Section 19

| Area | Blocker | Test Impact |
|---|---|---|
| Patient vaccinations | `[NOT IMPLEMENTED]` service returns empty arrays/table not deployed | Do not create full vaccination E2E tests yet. Test only empty/coming-soon behavior if visible. |
| Admin reports CSV | `[UI ONLY]` CSV export shows `CSV export coming soon.` | Do not assert file download. Assert toast/message only. |
| Admin booking detail Visit Summary | `[UI ONLY]` disabled visit summary button | Assert disabled state only if visible. |
| Admin doctor invite | `[NOT IMPLEMENTED]` missing doctor invite endpoint | Do not test doctor invite as working. |
| Dashboards | `[MISSING ERROR HANDLING]` some API failures fallback to empty arrays | Error-state tests may need code fixes first. |
| Staff patient search / portal account | `[NEEDS CLARIFICATION]` exact endpoints unclear | Treat endpoint assertions as tentative until verified. |
| Doctor profile photo upload | `[NEEDS CLARIFICATION]` endpoint unclear | Do not automate photo upload until endpoint is verified. |
| Patient reviews | `[NEEDS CLARIFICATION]` failed review lookup assumes no existing review | Verify backend behavior before strong review assertions. |

---

## 2. Role: Doctor

### Doctor Login Flow Test

**Test name:** Doctor can log in and land on Doctor Dashboard

**Purpose:** Verify a Doctor user can authenticate and is redirected to the correct role portal.

**Preconditions:**

- A valid Doctor test account exists.
- Doctor account is not blocked by first-login password setup unless the test is specifically for first login.

**Steps:**

1. Navigate to the login page.
2. Enter Doctor email.
3. Enter Doctor password.
4. Submit the login form.
5. Wait for redirect.

**Expected API calls:**

- `POST auth/login`
- Possible `GET auth/me` depending app initialization/session restore behavior.

**Expected data fields:**

- User role: `Doctor`
- User full name/email from auth user model.

**UI assertions:**

- Doctor portal layout is visible.
- URL includes `/doctor/dashboard`.
- Doctor dashboard content is visible, such as doctor name, status panel, queue area, or dashboard heading.

**Pass/fail criteria:**

- PASS only if the Doctor dashboard visibly renders Doctor-specific content after login.
- FAIL if redirect lands in another role portal or only API success is asserted.

---

### Doctor Flow: Reviews Today Queue

**Test name:** Doctor can review today queue and open appointment detail

**Purpose:** Verify the Doctor dashboard loads operational queue data and allows opening an appointment.

**Preconditions:**

- Doctor is logged in.
- Doctor has at least one booking in today’s queue.

**Steps:**

1. Navigate to `/doctor/dashboard`.
2. Wait for dashboard load.
3. Locate a visible queue item.
4. Assert patient/booking information is visible.
5. Open the queue item.
6. Verify appointment detail page loads.

**Expected API calls:**

- `GET doctors/me`
- `GET bookings/doctor/today`
- `GET bookings/doctor/today-summary`
- `GET doctors/{doctorId}/schedule`
- `GET doctors/{doctorId}/day-status`
- `GET bookings/{bookingId}` when opening appointment detail.

**Expected data fields:**

- Doctor name
- Doctor specialization/status
- Booking ID
- Patient name
- Appointment date/time
- Booking status/payment status where visible

**UI assertions:**

- Queue item is visible.
- Patient name or booking identifier is visible.
- Appointment detail page displays booking detail content.

**Selectors:**

[NEEDS CLARIFICATION: Doctor dashboard queue item stable selectors were not confirmed in the selector map. Use visible content or add `data-testid` before automation.]

**Pass/fail criteria:**

- PASS only if visible queue data appears and appointment detail visibly renders the opened booking.

---

### Doctor Flow: Completes Consultation from Appointment List

**Test name:** Doctor can complete consultation from appointments page

**Purpose:** Verify the Doctor can complete a booking consultation and submit professional fee/SOAP data.

**Preconditions:**

- Doctor is logged in.
- A booking exists for the doctor that is eligible for consultation completion.
- The booking has patient and appointment data visible in the appointment list.

**Steps:**

1. Navigate to `/doctor/appointments`.
2. Wait for appointments and today summary to load.
3. Find an eligible appointment.
4. Open the complete consultation action.
5. Choose whether to charge or waive PF.
6. If waiving PF, enter a waiver reason.
7. Enter final amount if charging PF.
8. Enter SOAP notes and optional fee notes.
9. Submit completion.
10. Verify success state or updated booking status is visible.

**Expected API calls:**

- `GET bookings/doctor/today`
- `GET bookings/doctor/today-summary`
- `PATCH bookings/{bookingId}/doctor-complete`
- Optional: `PATCH payments/{bookingId}/waive` when PF is waived.

**Expected data fields:**

- Booking ID
- Patient name
- Booking status
- Payment/professional fee status
- Final amount or waived reason
- SOAP/notes fields submitted from UI

**UI assertions:**

- Appointments list is visible.
- Completion modal is visible.
- Required form fields are visibly rendered.
- Submit action produces visible success feedback or visibly updated appointment status.

**Selectors:**

[NEEDS CLARIFICATION: Appointment-list completion selectors were not part of the confirmed selector patch. Prefer full consultation workspace test below or add selectors to appointment list completion modal.]

**Pass/fail criteria:**

- PASS only if the visible appointment status/payment state changes or success toast is visible after submission.

---

### Doctor Flow: Uses Full Consultation Workspace

**Test name:** Doctor can complete consultation from full consultation workspace

**Purpose:** Verify the full clinical workspace supports the consultation completion flow.

**Preconditions:**

- Doctor is logged in.
- A booking exists and is assigned to the logged-in doctor.
- Booking is eligible for consultation.

**Steps:**

1. Navigate to `/doctor/consultation/{bookingId}`.
2. Wait for booking, doctor, patient, and consultation context to load.
3. Verify patient and booking summary are visible.
4. Enter or verify clinical sections as needed:
   - Vitals
   - SOAP notes
   - Diagnoses
   - Prescriptions
   - Lab requests
   - Follow-up
   - Professional fee decision
5. Click complete consultation.
6. Review completion checklist/summary.
7. Finalize consultation.
8. Verify completion success or updated booking status is visible.

**Expected API calls:**

- `GET bookings/{bookingId}`
- `GET doctors/me`
- `GET patients/{patientId}`
- `GET bookings/{bookingId}/consultation-record`
- `PUT bookings/{bookingId}/consultation-record` if saving draft/amendment
- `PATCH bookings/{bookingId}/doctor-complete`
- Optional: `PATCH payments/{bookingId}/waive`
- Optional audit APIs for amendment mode.

**Expected data fields:**

- Patient first name/last name
- Booking ID
- Doctor ID/name
- Consultation fee snapshot or total fee
- Clinical sections and professional fee decision

**UI assertions:**

- Patient identity is visible.
- Booking/fee information is visible.
- Clinical workspace controls are visible.
- Complete consultation modal is visible after clicking complete.
- Finalization button is visible and enabled when required conditions are met.
- Success toast or completed status is visible after finalization.

**Selectors:**

- `doctor-consultation-save-draft-button`
- `doctor-consultation-complete-button`
- `doctor-consultation-header-complete-transaction-button`
- `doctor-consultation-complete-modal-review-summary-button`
- `doctor-consultation-complete-modal-finalize-button`
- `doctor-consultation-complete-modal-cancel-button`

**Pass/fail criteria:**

- PASS only if visible consultation data renders before completion and visible success/completed state renders after finalization.

---

### Doctor Flow: Updates Schedule

**Test name:** Doctor can update own schedule and blocked dates

**Purpose:** Verify doctor schedule management works from the Doctor portal.

**Preconditions:**

- Doctor is logged in.
- Doctor profile exists.

**Steps:**

1. Navigate to `/doctor/schedule`.
2. Wait for schedule and blocked-date data to load.
3. Toggle or edit a weekday schedule.
4. Edit daily patient limit, slot duration, or capacity.
5. Save schedule.
6. Add a blocked date with reason.
7. Remove the blocked date.

**Expected API calls:**

- `GET doctors/me`
- `GET doctors/{doctorId}/schedule`
- `GET doctors/{doctorId}/blocked-dates`
- `PUT doctors/{doctorId}/schedule`
- `PUT doctors/{doctorId}`
- `POST doctors/{doctorId}/blocked-dates`
- `DELETE doctors/{doctorId}/blocked-dates/{id}`

**Expected data fields:**

- Schedule day rows
- Start time/end time
- Slot duration
- Slot capacity
- Daily patient limit
- Blocked date and reason

**UI assertions:**

- Schedule controls are visible.
- Save success toast `Schedule saved successfully.` appears.
- Blocked date appears after adding.
- Blocked date disappears after removing.

**Selectors:**

[NEEDS CLARIFICATION: Schedule selectors were not included in the P0 selector patch. Add stable selectors before high-reliability Playwright automation.]

**Pass/fail criteria:**

- PASS only if the changed schedule/blocked-date state is visible after the action.

---

### Doctor Flow: Updates Profile and Password

**Test name:** Doctor can update profile and change password

**Purpose:** Verify doctor profile form and password form behavior.

**Preconditions:**

- Doctor is logged in.
- Doctor account has a known current password.

**Steps:**

1. Navigate to `/doctor/profile` or `/doctor/my-profile`.
2. Wait for profile data to load.
3. Edit non-destructive fields, such as bio or specialization.
4. Save profile.
5. Verify success toast and visible updated data.
6. For password flow, enter current password, new password, and confirm password.
7. Submit password change.

**Expected API calls:**

- `GET doctors/me`
- `PUT doctors/me`
- `POST auth/change-password`

**Expected data fields:**

- Full name
- Specialization
- Bio
- Consultation fee
- License/PTR/S2 numbers

**UI assertions:**

- Profile fields are visible and populated.
- Save success toast `Profile updated successfully.` is visible.
- Password update success toast is visible.

**Selectors:**

[NEEDS CLARIFICATION: Doctor profile selectors were not part of the P0 selector patch.]

**Pass/fail criteria:**

- PASS only if updated profile value is visibly rendered or success message appears and reload still shows the changed data.

---

## 3. Role: Patient

### Patient Login Flow Test

**Test name:** Patient can log in and land on Patient Dashboard

**Purpose:** Verify Patient role authentication and redirect.

**Preconditions:**

- A valid Patient test account exists.
- Patient has linked patient record unless testing unmatched account behavior.

**Steps:**

1. Navigate to login page.
2. Enter Patient credentials.
3. Submit login form.
4. Wait for redirect.

**Expected API calls:**

- `POST auth/login`
- Possible `GET auth/me`

**Expected data fields:**

- User role: `Patient`
- Patient full name/email

**UI assertions:**

- URL includes `/patient/dashboard`.
- Patient dashboard is visible.
- Patient greeting/profile context is visible.

**Pass/fail criteria:**

- PASS only if Patient-specific dashboard content is visibly rendered.

---

### Patient Flow: Views and Cancels Booking

**Test name:** Patient can view booking detail and cancel eligible booking

**Purpose:** Verify Patient booking list/detail/cancel behavior.

**Preconditions:**

- Patient is logged in.
- Patient has at least one cancellable booking.

**Steps:**

1. Navigate to `/patient/bookings`.
2. Wait for bookings list to load.
3. Filter if needed using the available booking filters.
4. Assert booking row/card is visible with doctor/services/date/status.
5. Click View Details.
6. Verify booking detail page displays booking summary and timeline/payment details.
7. Click Cancel Booking.
8. Confirm cancellation in the modal.
9. Verify cancelled status or success feedback is visible.

**Expected API calls:**

- `GET bookings/me?page={page}&pageSize={pageSize}`
- `GET patients/me` on detail page
- `GET bookings/{bookingId}` on detail page
- `PATCH bookings/{bookingId}/cancel`

**Expected data fields:**

- Booking ID
- Doctor name
- Services/service names
- Appointment date/time
- Queue number
- Booking status
- Payment status
- Amount due or final amount when visible

**UI assertions:**

- Booking list is visible.
- Booking row/card displays doctor, service, date/time, status.
- Booking detail page displays booking ID/summary.
- Cancel modal is visible.
- After confirm, cancelled status or cancellation feedback is visible.

**Selectors:**

- `patient-bookings-filter-{filter}`
- `patient-bookings-row-{bookingId}`
- `patient-bookings-view-details-button-{bookingId}`
- `patient-bookings-cancel-open-button-{bookingId}`
- `patient-bookings-cancel-modal-confirm-button`
- `patient-booking-detail-back-button`
- `patient-booking-detail-cancel-open-button`
- `patient-booking-detail-cancel-modal-confirm-button`

**Pass/fail criteria:**

- PASS only if the booking data is visible before action and visible cancelled/success state appears after action.

---

### Patient Flow: Uploads Document or Lab Result

**Test name:** Patient can upload and view document/lab result

**Purpose:** Verify shared patient media upload and preview flow.

**Preconditions:**

- Patient is logged in.
- Patient has at least one booking available for linking uploads.
- Test file exists locally for upload.

**Steps:**

1. Navigate to `/patient/documents` or `/patient/lab-results`.
2. Wait for current media records to load.
3. Choose a file.
4. Enter title/notes.
5. Select a related booking.
6. Submit upload.
7. Verify success toast appears.
8. Verify uploaded item is visible in the gallery/list.
9. Open preview/download.

**Expected API calls:**

- Documents:
  - `GET patients/me/documents`
  - `POST FormData patients/me/documents`
  - `GET patients/me/documents/{documentId}/file`
- Lab results:
  - `GET patients/me/lab-results`
  - `POST FormData patients/me/lab-results`
  - `GET patients/me/lab-results/{labResultId}/file`
- Booking list:
  - `GET bookings?page=1&pageSize=100`

**Expected data fields:**

- Document or lab title
- File name
- Notes/result text
- Linked booking ID
- Upload date/status where visible

**UI assertions:**

- Upload form is visible.
- Uploaded item title/file name is visible after upload.
- Preview modal or download behavior starts after opening the item.

**Selectors:**

[NEEDS CLARIFICATION: Patient media panel selectors were not included in the P0 selector patch. Add stable selectors before automation.]

**Pass/fail criteria:**

- PASS only if uploaded record is visibly shown after upload.

---

### Patient Flow: Downloads Medical PDFs

**Test name:** Patient can download medical record and prescription PDFs

**Purpose:** Verify patient PDF download entry points are visible and functional.

**Preconditions:**

- Patient is logged in.
- Patient has completed booking/medical records/prescriptions with generated PDFs.

**Steps:**

1. Navigate to `/patient/medical-records`.
2. Wait for records list.
3. Search if needed.
4. Click medical record PDF download.
5. Verify download event occurs and record data is visible.
6. Navigate to `/patient/prescriptions`.
7. Wait for prescriptions.
8. Click Download Prescription PDF or Download Summary PDF.

**Expected API calls:**

- `GET medical-records/me`
- `GET blob patient-documents/me/medical-records/{recordId}/pdf`
- `GET blob patient-documents/me/bookings/{bookingId}/pdf`
- `GET blob patient-documents/me/all.pdf`
- `GET prescriptions/me`
- `GET blob patient-documents/me/prescriptions/{prescriptionId}/pdf`

**Expected data fields:**

- Record title/date/doctor where visible
- Prescription medicine details
- Booking ID if visible

**UI assertions:**

- Record or prescription data is visible before download.
- Download button is visible and enabled.
- If document unavailable, visible toast `Document not available yet.` appears.

**Selectors:**

[NEEDS CLARIFICATION: PDF download controls need stable selectors before high-reliability E2E automation.]

**Pass/fail criteria:**

- PASS only if data is visible and download event or documented unavailable toast occurs.

---

### Patient Flow: Updates Profile and Password

**Test name:** Patient can update profile, submit consent, and change password

**Purpose:** Verify Patient profile edit, consent, and password flows.

**Preconditions:**

- Patient is logged in.
- Patient has linked patient record.

**Steps:**

1. Navigate to `/patient/profile`.
2. Wait for patient profile fields to render.
3. Edit a safe field such as contact number, city, or emergency contact.
4. Save changes.
5. Verify success toast and visible updated value.
6. If consent is not accepted, check consent box and submit consent.
7. Enter password fields and submit password change when test-safe.

**Expected API calls:**

- `GET patients/me`
- `PUT patients/me`
- `POST patients/me/consent`
- `POST auth/change-password`

**Expected data fields:**

- First name
- Last name
- Date of birth
- Sex
- Contact number
- Email
- Address/city/zip
- Emergency contact
- HMO/PhilHealth fields
- Consent version/status

**UI assertions:**

- Patient form fields are visible.
- Save button is visible.
- Success toast `Profile updated successfully.` is visible.
- Updated value remains visible after save/reload.

**Selectors:**

[NEEDS CLARIFICATION: Patient profile selectors were not included in the P0 selector patch.]

**Pass/fail criteria:**

- PASS only if the updated data or confirmed success state is visibly rendered.

---

### Patient Flow: Submits Privacy Consent

**Test name:** Patient can accept privacy consent

**Purpose:** Verify privacy consent route and consent submission.

**Preconditions:**

- Patient is logged in.
- Patient has not accepted current consent version or consent route is accessible.

**Steps:**

1. Navigate to `/patient/privacy-consent`.
2. Wait for consent content.
3. Assert consent checkbox label is visible.
4. Check consent checkbox.
5. Submit consent.
6. Verify success state or redirect.

**Expected API calls:**

- `GET patients/me`
- `POST patients/me/consent`

**Expected data fields:**

- Consent version
- Patient consent status

**UI assertions:**

- Consent text/checkbox label is visible.
- Submit button becomes enabled after checking.
- Success feedback or redirect is visible.

**Selectors:**

[NEEDS CLARIFICATION: Consent checkbox and submit button need stable selectors.]

**Pass/fail criteria:**

- PASS only if consent result is visibly confirmed.

---

### Patient Flow: Leaves Review

**Test name:** Patient can review completed booking

**Purpose:** Verify patient review page and submit behavior.

**Preconditions:**

- Patient is logged in.
- Booking is completed.
- Booking does not already have a review.

**Steps:**

1. Navigate to `/patient/reviews/{bookingId}`.
2. Wait for review eligibility check.
3. Verify review form is visible.
4. Select rating.
5. Enter comment.
6. Submit review.
7. Verify success feedback or return to booking context.

**Expected API calls:**

- `GET patients/me`
- `GET bookings/{bookingId}`
- `GET reviews?bookingId={bookingId}`
- `POST reviews`

**Expected data fields:**

- Booking ID
- Doctor ID/name
- Patient ID
- Rating
- Comment

**UI assertions:**

- Review form is visible only for eligible completed booking.
- If ineligible, `Review unavailable` is visible.
- Success feedback is visible after submission.

**Selectors:**

[NEEDS CLARIFICATION: Review form internals and review endpoint behavior require verification before full automation.]

**Pass/fail criteria:**

- PASS only if submitted review success is visible or the correct ineligible state is visible.

---

## 4. Role: Staff

### Staff Login Flow Test

**Test name:** Staff can log in and land on Staff Dashboard

**Purpose:** Verify Staff role authentication and redirect.

**Preconditions:**

- Valid Staff test account exists.

**Steps:**

1. Navigate to login page.
2. Enter Staff credentials.
3. Submit login form.
4. Wait for redirect.

**Expected API calls:**

- `POST auth/login`
- Possible `GET auth/me`

**Expected data fields:**

- User role: `Staff`
- User full name/email

**UI assertions:**

- URL includes `/staff/dashboard`.
- Staff portal navigation is visible.
- Staff dashboard queue/stat content is visible.

**Pass/fail criteria:**

- PASS only if Staff-specific dashboard content is visibly rendered.

---

### Staff Flow: Checks In a Patient

**Test name:** Staff can check in and undo check-in for a booking

**Purpose:** Verify front-desk booking check-in and undo flow.

**Preconditions:**

- Staff is logged in.
- A confirmed booking exists and is eligible for check-in.
- For undo path, booking becomes checked in.

**Steps:**

1. Navigate to `/staff/bookings`.
2. Wait for bookings list.
3. Filter by date/status/doctor if needed.
4. Assert target booking row/card is visible with patient, doctor, date/time, and status.
5. Click Check In.
6. Verify success toast `Patient checked in.` or visible checked-in status.
7. Click Undo Check-In.
8. Verify success toast `Check-in undone.` or visible reverted status.

**Expected API calls:**

- `GET doctors`
- `GET bookings/staff/all?page={page}&pageSize={pageSize}`
- Booking check-in endpoint via `BookingService`
- Booking undo check-in endpoint via `BookingService`

**Expected data fields:**

- Booking ID
- Patient name
- Doctor name
- Appointment date/time
- Booking status
- Payment status
- Queue number

**UI assertions:**

- Target booking row/card is visible.
- Patient and doctor data are visible.
- Check In button is visible before check-in.
- Undo Check-In button/status is visible after check-in.

**Selectors:**

- `staff-bookings-doctor-filter`
- `staff-bookings-status-filter`
- `staff-bookings-date-filter`
- `staff-bookings-row-{bookingId}`
- `staff-bookings-checkin-button-{bookingId}`
- `staff-bookings-undo-checkin-button-{bookingId}`
- `staff-bookings-mobile-checkin-button-{bookingId}`
- `staff-bookings-mobile-undo-checkin-button-{bookingId}`

**Pass/fail criteria:**

- PASS only if visible booking status/action changes after check-in and undo.

---

### Staff Flow: Collects Payment

**Test name:** Staff can confirm payment for completed booking

**Purpose:** Verify payment queue collection flow.

**Preconditions:**

- Staff is logged in.
- A completed booking exists with unpaid professional fee.
- Amount due is known and visible.

**Steps:**

1. Navigate to `/staff/payments`.
2. Wait for payment queue to load.
3. Assert target payment row/card is visible.
4. Click Confirm Payment.
5. Verify Collect Payment modal is visible.
6. Select payment method.
7. Enter amount received equal to or greater than amount due.
8. Enter reference number and notes if applicable.
9. Submit Confirm Payment.
10. Verify success toast `Payment confirmed.` and receipt modal or paid status is visible.

**Expected API calls:**

- `GET bookings/staff/for-payment?page={page}&pageSize={pageSize}`
- `PATCH payments/{bookingId}/confirm`

**Expected data fields:**

- Booking ID
- Patient name
- Doctor name
- Services
- Amount due
- Payment status
- Receipt number/payment ID where visible

**UI assertions:**

- Payment row/card is visible.
- Amount due is visible.
- Collect Payment modal is visible.
- Payment success toast or receipt modal is visible.

**Selectors:**

- `staff-payments-row-{bookingId}`
- `staff-payments-confirm-open-button-{bookingId}`
- `staff-payments-payment-modal`
- `staff-payments-payment-method-select`
- `staff-payments-amount-received-input`
- `staff-payments-reference-number-input`
- `staff-payments-notes-textarea`
- `staff-payments-payment-modal-confirm-button`
- `staff-payments-receipt-*`

**Pass/fail criteria:**

- PASS only if visible payment state changes to paid/confirmed or receipt is visibly rendered.

---

### Staff Flow: Waives Professional Fee

**Test name:** Staff can waive professional fee with reason

**Purpose:** Verify PF waive flow from payment queue or booking detail.

**Preconditions:**

- Staff is logged in.
- A booking/payment exists that is eligible for PF waiver.

**Steps:**

1. Navigate to `/staff/payments` or `/staff/bookings/{bookingId}`.
2. Locate the eligible booking/payment.
3. Click Waive PF.
4. Verify waive modal is visible.
5. Enter waiver reason.
6. Confirm waive.
7. Verify success toast `PF waived.` and visible waived state.

**Expected API calls:**

- Payment waive endpoint documented by Staff payment/detail pages.

**Expected data fields:**

- Booking ID
- Payment status
- Professional fee waived flag/reason where visible

**UI assertions:**

- Waive modal is visible.
- Reason field is visible.
- Success toast or waived state is visible.

**Selectors:**

- `staff-payments-waive-open-button-{bookingId}`
- `staff-payments-waive-modal-reason-textarea`
- `staff-payments-waive-modal-confirm-button`
- `staff-booking-detail-waive-pf-open-button`
- `staff-booking-detail-waive-modal-reason-textarea`
- `staff-booking-detail-waive-modal-confirm-button`

**Pass/fail criteria:**

- PASS only if the waived state or success toast is visible.

---

### Staff Flow: Creates Walk-In Booking

**Test name:** Staff can create a walk-in booking

**Purpose:** Verify Staff walk-in registration and booking creation.

**Preconditions:**

- Staff is logged in.
- At least one active doctor exists.
- At least one service and available slot exist for the selected doctor/date.

**Steps:**

1. Navigate to `/staff/walk-in`.
2. Search existing patient or quick-register a new guest patient.
3. Select patient.
4. Select doctor.
5. Select service.
6. Select appointment date.
7. Select available slot.
8. Submit booking.
9. Verify success toast `Walk-in booking created successfully.` and booking confirmation/summary is visible.

**Expected API calls:**

- `GET doctors`
- Patient search endpoint [NEEDS CLARIFICATION: exact endpoint generated dynamically]
- `POST patients` if quick-registering
- `GET doctors/{doctorId}/services`
- Fallback `GET services`
- `GET doctors/{doctorId}/available-slots?date={date}`
- `POST bookings/walk-in`

**Expected data fields:**

- Patient ID/name
- Doctor ID/name
- Service ID/name
- Appointment date/time
- Slot start/end
- Booking ID/status

**UI assertions:**

- Selected patient strip is visible.
- Doctor/service/date/slot values are visible.
- Success toast is visible after creation.

**Selectors:**

[NEEDS CLARIFICATION: Walk-in wizard selectors were not part of the P0 selector patch. Add stable selectors before automation.]

**Pass/fail criteria:**

- PASS only if created booking information or success message is visibly rendered.

---

### Staff Flow: Creates Patient Portal Account

**Test name:** Staff can create portal account for patient

**Purpose:** Verify Staff can create a patient portal account when allowed.

**Preconditions:**

- Staff is logged in.
- Target patient exists and does not already have a portal account.

**Steps:**

1. Navigate to `/staff/patients`.
2. Search patient.
3. Open patient detail.
4. Enter email.
5. Enter temporary password and confirmation.
6. Submit Create Portal Account.
7. Verify success toast and updated portal account state.

**Expected API calls:**

- Dynamic patient search endpoint [NEEDS CLARIFICATION]
- `GET patients/{patientId}`
- Portal account creation endpoint [NEEDS CLARIFICATION]

**Expected data fields:**

- Patient ID
- Patient name
- Patient email
- Portal account status

**UI assertions:**

- Patient detail is visible.
- Portal account form is visible.
- Success toast `Portal account created successfully.` is visible.

**Selectors:**

[NEEDS CLARIFICATION: Portal account selectors should be confirmed before automation.]

**Pass/fail criteria:**

- PASS only if portal account state visibly updates or success toast appears.

---

### Staff Flow: Updates Doctor Availability

**Test name:** Staff can update doctor day status

**Purpose:** Verify staff can manage doctor availability/running late/unavailable state.

**Preconditions:**

- Staff is logged in.
- At least one doctor exists.

**Steps:**

1. Navigate to `/staff/doctor-status`.
2. Wait for doctor cards/statuses.
3. Set doctor Available.
4. Verify status visibly updates.
5. Set doctor Running Late and enter valid minutes.
6. Confirm.
7. Verify running-late status/minutes visibly update.
8. Set doctor Unavailable and confirm.

**Expected API calls:**

- `GET doctors`
- `GET doctor-day-status/{doctorId}`
- `POST doctor-day-status/{doctorId}/status`

**Expected data fields:**

- Doctor ID/name
- Doctor status
- Running-late minutes

**UI assertions:**

- Doctor card is visible.
- Status label is visible.
- Running-late input is visible when selected.
- Success/failure toast appears after update.

**Selectors:**

[NEEDS CLARIFICATION: Doctor status card selectors were not included in P0 selector patch.]

**Pass/fail criteria:**

- PASS only if visible doctor status changes after action.

---

## 5. Role: Admin

### Admin Login Flow Test

**Test name:** Admin can log in and land on Admin Dashboard

**Purpose:** Verify Admin role authentication, redirect, and admin portal layout.

**Preconditions:**

- Valid Admin test account exists.
- Admin is not blocked by first-login setup unless specifically testing first-login behavior.

**Steps:**

1. Navigate to login page.
2. Enter Admin credentials.
3. Submit login form.
4. Wait for redirect.

**Expected API calls:**

- `POST auth/login`
- Possible `GET auth/me`

**Expected data fields:**

- User role: `Admin`
- User full name/email

**UI assertions:**

- URL includes `/admin/dashboard`.
- Admin navigation is visible.
- Dashboard metrics/cards are visible.

**Pass/fail criteria:**

- PASS only if Admin-specific dashboard content is visibly rendered.

---

### Admin Flow: Manages Booking

**Test name:** Admin can manage booking status/actions

**Purpose:** Verify Admin booking list/detail and action controls.

**Preconditions:**

- Admin is logged in.
- Target bookings exist in states eligible for actions, such as pending, confirmed, completed, no-show, cancelled, or payment-related states.

**Steps:**

1. Navigate to `/admin/bookings`.
2. Wait for bookings list.
3. Filter/search booking if needed.
4. Open booking detail.
5. Verify booking, patient, doctor, status, and payment details are visible.
6. Perform one eligible action:
   - Confirm Booking
   - Reject Booking
   - Confirm Payment
   - Reject Proof
   - Mark Complete
   - Mark No Show
   - Cancel Booking
   - Waive
   - Refund
7. If modal requires reason, enter reason.
8. Confirm action.
9. Verify visible status/payment state or success toast updates.

**Expected API calls:**

- `GET doctors`
- `GET bookings`
- `GET bookings/{id}`
- Optional `GET patients/{patientId}`
- `PATCH bookings/{bookingId}/confirm`
- `PATCH bookings/{bookingId}/cancel`
- `PATCH bookings/{bookingId}/complete`
- `PATCH bookings/{bookingId}/no-show`
- `POST audit-logs`
- `PUT bookings/{bookingId}/waive`
- `PUT bookings/{bookingId}/refund`

**Expected data fields:**

- Booking ID
- Patient ID/name
- Doctor name
- Services
- Appointment date/time
- Booking status
- Payment status
- Reason where applicable

**UI assertions:**

- Booking list row/card is visible.
- Booking detail page visibly renders booking and patient information.
- Action button is visible only when eligible.
- Confirm/reason modal is visible when required.
- Updated status or success toast is visible after action.

**Selectors:**

- `admin-booking-detail-confirm-booking-button`
- `admin-booking-detail-reject-booking-button`
- `admin-booking-detail-confirm-payment-button`
- `admin-booking-detail-reject-proof-button`
- `admin-booking-detail-mark-complete-button`
- `admin-booking-detail-mark-no-show-button`
- `admin-booking-detail-cancel-booking-button`
- `admin-booking-detail-waive-payment-open-button`
- `admin-booking-detail-refund-payment-open-button`
- `admin-booking-detail-action-modal-confirm-button`
- `admin-booking-detail-action-modal-reason-textarea`
- `admin-booking-detail-waive-modal-*`
- `admin-booking-detail-refund-modal-*`

**Pass/fail criteria:**

- PASS only if visible status/payment state updates or confirmed success toast appears after action.

---

### Admin Flow: Creates or Edits Doctor

**Test name:** Admin can create and edit doctor

**Purpose:** Verify Admin doctor management form behavior.

**Preconditions:**

- Admin is logged in.
- For create: unique doctor email is available.
- For edit: an existing doctor exists.

**Steps:**

1. Navigate to `/admin/doctors`.
2. Verify doctor list is visible.
3. Click Add Doctor.
4. Fill required fields.
5. Submit Save Doctor.
6. Verify success toast `Doctor created successfully.` and doctor appears in list.
7. Open edit for existing doctor.
8. Modify safe field such as bio/specialization/status.
9. Save.
10. Verify success toast `Doctor updated successfully.` and updated value visible.

**Expected API calls:**

- `GET doctors/admin`
- `GET doctors/{doctorId}/schedule`
- `POST doctors`
- `PUT doctors/{doctorId}`
- `PUT doctors/{doctorId}/schedule`
- Optional `POST FormData doctors/{doctorId}/photo`

**Expected data fields:**

- Doctor full name
- Doctor email
- Specialization
- License/PTR/S2
- Consultation fee
- Status
- Schedule rows

**UI assertions:**

- Doctor list is visible.
- Doctor form fields are visible.
- Success toast is visible.
- Created/updated doctor appears visibly in list or form.

**Selectors:**

[NEEDS CLARIFICATION: Doctor form selectors were not included in the P0 selector patch.]

**Pass/fail criteria:**

- PASS only if created/updated doctor data is visibly rendered.

---

### Admin Flow: Creates Walk-In Booking

**Test name:** Admin can create walk-in booking

**Purpose:** Verify Admin walk-in booking flow.

**Preconditions:**

- Admin is logged in.
- Doctor, service, and available slot data exist.

**Steps:**

1. Navigate to `/admin/walk-in`.
2. Search/select existing patient or quick-register patient.
3. Select doctor.
4. Select service.
5. Select appointment date.
6. Select available slot.
7. Create booking.
8. Verify success toast `Walk-in booking created successfully.` or visible booking summary.

**Expected API calls:**

- `GET doctors`
- `GET patients?page=1&pageSize={pageSize}&search={term}`
- `POST patients` if quick-registering
- `GET doctors/{doctorId}/services`
- Fallback `GET services`
- `GET doctors/{doctorId}/available-slots?date={date}`
- `POST bookings/walk-in`

**Expected data fields:**

- Patient name/ID
- Doctor name/ID
- Service name/ID
- Appointment date/time
- Booking status

**UI assertions:**

- Selected patient is visible.
- Doctor/service/date/slot selection is visible.
- Success toast or created booking summary is visible.

**Selectors:**

[NEEDS CLARIFICATION: Admin walk-in wizard selectors were not part of P0 selector patch.]

**Pass/fail criteria:**

- PASS only if booking creation result is visibly confirmed.

---

### Admin Flow: Manages Staff

**Test name:** Admin can invite staff and manage staff status

**Purpose:** Verify Admin staff account/invite management.

**Preconditions:**

- Admin is logged in.
- Unique staff email is available for invite.
- Existing staff or invite exists for status/revoke actions.

**Steps:**

1. Navigate to `/admin/staff`.
2. Wait for staff/invites list.
3. Click Invite Staff.
4. Enter full name, email, and optional phone.
5. Submit invite.
6. Verify invite appears or success toast is visible.
7. Revoke invite or update staff active status if available.
8. Verify updated status is visible.

**Expected API calls:**

- `GET admin/staff`
- `POST admin/staff/invite`
- `PUT admin/staff/invite/{inviteId}/revoke`
- `PUT admin/staff/{id}/update-status`

**Expected data fields:**

- Staff full name
- Staff email
- Staff phone
- Invite/status state

**UI assertions:**

- Staff list/invite list is visible.
- Invite form fields are visible.
- New invite/status change is visible after action.

**Selectors:**

[NEEDS CLARIFICATION: Admin staff selectors were not included in P0 selector patch.]

**Pass/fail criteria:**

- PASS only if invite/status state visibly updates.

---

### Admin Flow: Manages Services

**Test name:** Admin can create/update/delete service

**Purpose:** Verify service catalog management.

**Preconditions:**

- Admin is logged in.
- Unique service name is available for create test.

**Steps:**

1. Navigate to `/admin/services`.
2. Wait for services list.
3. Click Add Service.
4. Enter service fields.
5. Save.
6. Verify service appears in list.
7. Edit service.
8. Verify updated value appears.
9. Delete or deactivate service when safe.

**Expected API calls:**

- `GET services`
- `GET doctors/admin`
- `POST services`
- `PUT services/{serviceId}`
- `DELETE services/{serviceId}`

**Expected data fields:**

- Service name
- Description
- Category
- Price
- Estimated duration
- Active/inactive state

**UI assertions:**

- Service list is visible.
- Modal/form fields are visible.
- Created/updated service is visibly rendered.

**Selectors:**

[NEEDS CLARIFICATION: Service modal selectors were not included in P0 selector patch.]

**Pass/fail criteria:**

- PASS only if service data is visible after create/update.

---

### Admin Flow: Updates Settings

**Test name:** Admin can update settings and bump consent version

**Purpose:** Verify settings page save behavior.

**Preconditions:**

- Admin is logged in.
- Test should use safe values that can be reverted.

**Steps:**

1. Navigate to `/admin/settings`.
2. Wait for settings data to render.
3. Edit a safe field.
4. Save settings.
5. Verify toast `Settings saved.` and visible updated value.
6. Click Bump Consent Version if safe.
7. Verify toast `Consent version bumped.` and visible version change.

**Expected API calls:**

- `GET settings`
- `PUT settings`

**Expected data fields:**

- Clinic name
- Address
- Phone
- Email
- Payment settings
- Privacy policy text
- Consent version

**UI assertions:**

- Settings tabs/fields are visible.
- Save success toast is visible.
- Updated value is visibly rendered.

**Selectors:**

[NEEDS CLARIFICATION: Settings selectors were not included in P0 selector patch.]

**Pass/fail criteria:**

- PASS only if updated setting is visible after save/reload.

---

## 6. Shared / Common Flow Tests

### Shared Flow: Login

**Test name:** User can log in with valid credentials

**Roles affected:** Doctor, Patient, Staff, Admin

**Preconditions:** Valid account exists for target role.

**Steps:**

1. Navigate to login page.
2. Enter valid email/password.
3. Submit form.
4. Wait for role-specific redirect.

**Expected API calls:**

- `POST auth/login`
- Possible `GET auth/me`

**UI assertions:**

- Role-specific dashboard is visible.
- Role-specific navigation is visible.

**Pass/fail criteria:** PASS only if role dashboard is visibly rendered.

---

### Shared Flow: Logout

**Test name:** Authenticated user can log out and protected routes become inaccessible

**Roles affected:** Doctor, Patient, Staff, Admin

**Preconditions:** User is logged in.

**Steps:**

1. Open role portal.
2. Trigger logout from portal layout.
3. Verify redirect to login/public auth state.
4. Attempt to navigate back to protected route.

**Expected API calls:**

- `POST auth/logout` when refresh token exists.

**UI assertions:**

- Login page or logged-out public state is visible.
- Protected dashboard is not visible after logout.

**Pass/fail criteria:** PASS only if protected role content is no longer visible after logout.

---

### Shared Flow: Session Restore

**Test name:** Existing authenticated session restores on reload

**Roles affected:** Doctor, Patient, Staff, Admin

**Preconditions:** User is logged in and token exists.

**Steps:**

1. Log in as role.
2. Reload the page.
3. Wait for app initialization.

**Expected API calls:**

- `GET auth/me`

**UI assertions:**

- Same role dashboard/layout remains visible after reload.

**Pass/fail criteria:** PASS only if role content remains visibly rendered after reload.

---

### Shared Flow: Token Refresh

**Test name:** Expired access token refreshes or logs user out

**Roles affected:** All authenticated roles

**Preconditions:** User has expired/invalid access token and valid or invalid refresh token.

**Steps:**

1. Simulate API `401` on protected request.
2. Verify refresh behavior.
3. If refresh succeeds, original request should retry.
4. If refresh fails, session should clear and user should redirect to login.

**Expected API calls:**

- `POST auth/refresh-token`

**UI assertions:**

- Success path: protected role content remains visible.
- Failure path: login page is visible and protected content disappears.

**Pass/fail criteria:** PASS only if visible UI matches refresh outcome.

---

### Shared Flow: Notifications

**Test name:** User can mark notifications as read

**Roles affected:** Shared authenticated users where notification panel is available

**Preconditions:** User has unread notifications.

**Steps:**

1. Open notification panel.
2. Verify unread notification text is visible.
3. Mark one notification read or mark all read.
4. Verify read/unread indicator updates.

**Expected API calls:**

- `PUT notifications/:id/read`
- `PUT notifications/read-all`

**UI assertions:**

- Notification text is visible before action.
- Unread badge/indicator changes visibly after action.

**Pass/fail criteria:** PASS only if notification state visibly updates.

[NEEDS CLARIFICATION: exact notification panel selectors and visibility conditions require component-level confirmation.]

---

### Shared Flow: Receipt Modal

**Test name:** Receipt modal displays receipt details

**Roles affected:** Patient, Staff, Admin

**Preconditions:** Booking/payment has receipt data.

**Steps:**

1. Open booking/payment detail page.
2. Click View Receipt / Print Receipt / receipt action.
3. Verify receipt modal opens.
4. Verify receipt details are visible.
5. Close modal.

**Expected API calls:**

- `GET payments/{paymentId}` or booking fallback depending page.

**UI assertions:**

- Receipt modal is visible.
- Receipt number/payment amount/date or equivalent receipt data is visible.

**Selectors:**

- `{prefix}-modal`
- `{prefix}-close-button`
- `{prefix}-print-button`

**Pass/fail criteria:** PASS only if receipt data is visibly rendered.

---

## 7. Security & Permission Tests

### Security Test: Unauthenticated User Cannot Access Protected Routes

**Preconditions:** User is logged out.

**Steps:**

1. Navigate directly to `/doctor/dashboard`.
2. Repeat for `/patient/dashboard`, `/staff/dashboard`, and `/admin/dashboard`.

**Expected result:** User redirects to `/auth/login`.

**UI assertions:**

- Login page is visible.
- Protected role dashboard content is not visible.

**Pass/fail criteria:** PASS only if login UI visibly renders and protected content is absent.

---

### Security Test: Role Cannot Access Another Role’s Routes

**Preconditions:** User is logged in as one role.

**Steps:**

1. Log in as Patient.
2. Attempt to open `/doctor/dashboard`, `/staff/dashboard`, and `/admin/dashboard`.
3. Repeat using Doctor, Staff, and Admin accounts against other role routes.

**Expected result:** Access is blocked or redirected according to guard behavior.

**UI assertions:**

- The wrong role dashboard is not visible.
- User is redirected to login or allowed role area according to app guard behavior.

**Pass/fail criteria:** PASS only if cross-role protected content is not visibly rendered.

---

### Security Test: First-Login User Redirects to Set Password

**Preconditions:** Test user has `isFirstLogin = true`.

**Steps:**

1. Log in as first-login user.
2. Wait for redirect.

**Expected result:** User is redirected to `/auth/set-password`.

**UI assertions:**

- Set password form is visible.
- Role dashboard is not visible until password is set.

**Pass/fail criteria:** PASS only if set-password UI visibly renders.

[NEEDS CLARIFICATION: availability of first-login test account is not confirmed.]

---

### Security Test: Logout Clears Session

**Preconditions:** User is logged in.

**Steps:**

1. Log in as any role.
2. Verify role dashboard is visible.
3. Logout.
4. Navigate directly to previous role dashboard URL.

**Expected result:** Protected route is blocked.

**UI assertions:**

- Login page is visible after logout/direct protected navigation.
- Role dashboard content is not visible.

**Pass/fail criteria:** PASS only if protected UI is not accessible after logout.

---

### Security Test: Dev Gallery Route Is Guarded or Explicitly Allowed

**Preconditions:** User is logged out.

**Steps:**

1. Navigate to `/dev/gallery`.

**Expected result:**

[NEEDS CLARIFICATION: Blueprint marks `/dev/gallery` as `[MISSING GUARD]`. Expected behavior should be decided.]

**UI assertions:**

- If route should be protected, login or not-found page should be visible.
- If route remains public, visible gallery should be accepted only after explicit approval.

**Pass/fail criteria:** Do not mark this test passing until desired security behavior is confirmed.

---

## 8. Error & Edge Case Tests

### Invalid Login Attempts Per Role

**Trigger:** Submit invalid credentials.

**Expected UI:** Login error message visible.

**Pass/fail criteria:** PASS only if login remains blocked and visible error message appears.

---

### API Error Responses

**Trigger:** Mock or force API failure on role pages.

**Expected UI:** Confirmed user-facing error message, retry button, or toast appears.

**Pages to cover:**

- Doctor dashboard/appointments/schedule/consultation
- Patient bookings/documents/profile
- Staff bookings/payments/walk-in
- Admin bookings/settings/staff/services

**Known gap:** Dashboards may fallback to empty arrays instead of clear error.

**Pass/fail criteria:** PASS only if failure is visibly communicated. Do not accept silent empty state for API failure.

---

### Empty States

**Trigger:** API returns valid empty data.

**Expected UI:** Empty state text appears.

**Examples:**

- Patient bookings: `No bookings found`
- Staff payments: `No queue items for now.`
- Patient vaccinations: `No vaccination records yet`
- Doctor patient detail: no records/prescriptions/documents/labs messages

**Pass/fail criteria:** PASS only if empty-state message is visible and distinct from API error behavior.

---

### Form Validation Failures

**Trigger:** Submit forms with missing or invalid fields.

**Examples:**

- Staff payment amount less than amount due.
- Staff/Admin waive PF without valid reason.
- Patient profile invalid required fields.
- Doctor schedule invalid slot duration/capacity.
- Admin doctor form missing required fields.

**Expected UI:** Validation message, disabled submit, or warning toast visible.

**Pass/fail criteria:** PASS only if invalid form cannot submit and visible validation/error feedback appears.

---

### Network Failure Behavior

**Trigger:** Simulate network failure for key API calls.

**Expected UI:** Clear failure toast/error panel/retry control.

**Known gap:** Some pages may currently show misleading empty states.

**Pass/fail criteria:** PASS only if a user-visible failure state is shown.

---

### Not Implemented / UI-Only Features

| Feature | Expected Test Behavior |
|---|---|
| Patient vaccinations | Assert empty/not implemented behavior only. Do not require real data creation. |
| Admin CSV export | Assert `CSV export coming soon.` message, not file download. |
| Admin Download Visit Summary | Assert disabled state if visible. |
| Admin doctor invite | Do not test as working until endpoint exists. |

---

## 9. UI & Design Consistency Tests

### Role Navigation Pattern

**Doctor:** `PortalLayoutComponent` with Doctor nav items.

**Patient:** `PatientLayoutComponent` with Patient nav items.

**Staff:** `PortalLayoutComponent` with Staff nav items.

**Admin:** `PortalLayoutComponent` with Admin nav items.

**Assertions:**

- Correct role-specific navigation labels are visible.
- Wrong role-specific navigation labels are not visible.
- Default route redirects to correct dashboard.

---

### Loading States During API Calls

**Pages to cover:**

- Doctor dashboard/schedule/consultation
- Patient bookings/documents/lab results/medical records/profile
- Staff bookings/payments/walk-in
- Admin bookings/settings/staff/services

**Assertions:**

- Loading spinner/skeleton/loading text is visible while request is pending.
- Loading state disappears after data or error renders.

---

### Toast / Alert Notifications

**Actions to cover:**

- Staff check-in success/error
- Staff payment confirmed/error
- Staff PF waived/error
- Doctor consultation complete/save errors
- Patient document/lab upload success/error
- Patient booking cancellation
- Admin booking action success/error
- Admin settings save success/error

**Assertions:**

- Toast text is visible.
- Toast corresponds to the action performed.

---

### Empty State UI

**Assertions:**

- Empty state is visible when API returns empty list.
- Empty state text matches the page context.
- Empty state should not appear when API failed unless the blueprint marks that as a known gap.

---

### Responsive Behavior

**Confirmed pattern:** Several pages use desktop tables and mobile cards.

**Pages to cover:**

- Patient bookings
- Staff bookings
- Staff payments
- Admin bookings where confirmed

**Assertions:**

- Desktop viewport shows table/row layout with visible booking/payment data.
- Mobile viewport shows card layout with the same critical data visible.
- Actions remain visible and clickable in mobile layout.

---

## 10. Playwright Implementation Notes

### Recommended Test Files

```text
tests/auth/login.spec.ts
tests/security/guards.spec.ts
tests/shared/session.spec.ts
tests/shared/receipt-modal.spec.ts
tests/doctor/consultation.spec.ts
tests/doctor/schedule.spec.ts
tests/patient/bookings.spec.ts
tests/patient/documents.spec.ts
tests/patient/profile.spec.ts
tests/staff/bookings.spec.ts
tests/staff/payments.spec.ts
tests/staff/walk-in.spec.ts
tests/admin/bookings.spec.ts
tests/admin/doctors.spec.ts
tests/admin/staff.spec.ts
tests/admin/settings.spec.ts
```

### Priority Order

| Priority | Test Area | Reason |
|---|---|---|
| P0 | Auth login/logout/role redirects | Required for all protected tests |
| P0 | Staff check-in / undo check-in | Core queue operation |
| P0 | Staff confirm payment / waive PF | Core revenue workflow |
| P0 | Doctor complete consultation | Core clinical workflow |
| P0 | Patient booking view / cancel | Core patient self-service workflow |
| P0 | Admin booking detail actions | Core admin control workflow |
| P1 | Walk-in booking | Important front-desk workflow |
| P1 | Patient documents/labs | Patient records workflow |
| P1 | Doctor schedule | Booking availability workflow |
| P1 | Admin doctor/staff/settings | Admin setup and maintenance |
| P2 | Reports/vaccinations/reviews | Some gaps/uncertainties exist |

### Stable Selectors Available

Stable selectors are available for these P0 flows after the selector patch:

- Staff bookings check-in / undo check-in
- Staff booking detail payment/waive actions
- Staff payment queue confirm / waive PF
- Doctor consultation completion actions
- Patient bookings view/cancel
- Patient booking detail receipt/cancel/doc/lab links
- Admin booking detail action buttons/modals
- Shared confirm modal and receipt modal prefixes

### Selectors Still Missing or Not Confirmed

- Login form selectors
- Doctor dashboard queue rows
- Doctor appointment list completion modal
- Doctor schedule editor
- Patient media upload panel
- Patient profile/consent/review forms
- Staff walk-in wizard
- Staff doctor status cards
- Admin doctor form
- Admin services modal
- Admin patients modal
- Admin staff invite form
- Admin settings fields

### Test Data Required

| Flow | Required Data |
|---|---|
| Login | Admin, Staff, Doctor, Patient test accounts |
| Patient booking cancel | Patient with cancellable booking |
| Staff check-in | Confirmed booking eligible for check-in |
| Staff undo check-in | Checked-in booking |
| Staff payment | Completed booking with unpaid PF |
| Staff waive PF | Booking/payment eligible for PF waive |
| Doctor consultation | Booking assigned to doctor and eligible for consultation |
| Admin booking actions | Bookings in pending/confirmed/completed/payment-related states |
| Walk-in | Doctor, service, available slot, patient or quick-register data |
| Documents/labs | Patient with booking and test upload file |
| Receipts | Paid booking/payment with receipt data |

### Flows Not Ready for Automation

- Patient vaccinations real data workflow: `[NOT IMPLEMENTED]`.
- Admin CSV export real file download: `[UI ONLY]`.
- Admin doctor invite: `[NOT IMPLEMENTED]` endpoint issue.
- Patient review: `[NEEDS CLARIFICATION]` around review lookup behavior.
- Staff patient portal account: `[NEEDS CLARIFICATION]` exact endpoint.

### API Calls That May Need Mocking or Interception

Use interception only when seed data is not available or when testing controlled error states:

- `GET bookings/staff/all`
- `GET bookings/staff/for-payment`
- `GET bookings/doctor/today`
- `GET bookings/{bookingId}`
- `PATCH bookings/{bookingId}/doctor-complete`
- `PATCH payments/{bookingId}/confirm`
- `PATCH bookings/{bookingId}/cancel`
- `GET patients/me`
- `GET doctors`
- `GET settings`

### Implementation Rules for Playwright

- Prefer `page.getByTestId()` for patched selectors.
- Use `toBeVisible()` for visible page/content assertions.
- Use `toHaveText()` or `toContainText()` for displayed data.
- Avoid `.nth()` and fragile CSS class selectors unless there is no alternative.
- For dynamic row selectors, derive selector from known booking ID when available.
- When using API setup, still assert visible UI after action.
- For mobile tests, explicitly set viewport and assert mobile card selectors.
- For file downloads, assert both visible source data and download event.
- For toasts, assert toast text is visible, not just that a toast element exists.

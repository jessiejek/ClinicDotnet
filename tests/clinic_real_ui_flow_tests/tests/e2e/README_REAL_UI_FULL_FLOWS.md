# Real UI + API Full Flow Playwright Tests

These tests are stricter than page-load smoke tests. They perform the business flow through the UI and verify both:

1. The expected API response succeeds.
2. The returned or selected data is visible on screen.

## Files added

- `tests/e2e/clinic-flow.helpers.ts`
- `tests/e2e/patient-consultation-real-ui-flow.spec.ts`
- `tests/e2e/staff-walkin-real-ui-flow.spec.ts`

## Flow 1 covered

Patient booking flow:

1. Login as patient
2. Book consultation through booking wizard UI
3. Capture booking ID from `POST /api/bookings` response and confirmation URL
4. Login as staff
5. Confirm booking through API only if current status still requires confirmation
6. Check in patient through staff booking detail UI and wait for `PATCH /api/bookings/{id}/check-in`
7. Login as doctor
8. Open `/doctor/consultation/{bookingId}`
9. Fill required SOAP/vitals fields
10. Add ICD-10 diagnosis through UI
11. Add prescription if UI exists
12. Add follow-up if UI exists
13. Add lab request if UI exists
14. Complete consultation through modal UI and wait for `PATCH /api/bookings/{id}/doctor-complete`
15. Login as staff
16. Open booking detail/payment UI
17. Collect payment and wait for `PATCH /api/payments/{bookingId}/confirm`
18. Print receipt if print UI exists
19. Assert final booking/payment status on API and screen

## Flow 2 covered

Walk-in flow:

1. Login as staff
2. Open walk-in page
3. Search a unique patient name
4. Quick-register patient when not found
5. Select doctor
6. Select service
7. Select available slot
8. Confirm walk-in booking
9. Capture booking ID from `POST /api/bookings/walk-in`
10. Check in patient
11. Login as doctor
12. Complete consultation
13. Login as staff
14. Collect payment
15. Print receipt/PDF if implemented
16. Assert final status on API and screen

## Run

```bash
npx playwright test tests/e2e/patient-consultation-real-ui-flow.spec.ts --headed
npx playwright test tests/e2e/staff-walkin-real-ui-flow.spec.ts --headed
```

Or run both:

```bash
npx playwright test tests/e2e/patient-consultation-real-ui-flow.spec.ts tests/e2e/staff-walkin-real-ui-flow.spec.ts --headed
```

## Environment overrides

```powershell
$env:PLAYWRIGHT_API_BASE_URL="http://localhost:5000/api"
$env:PLAYWRIGHT_PATIENT_EMAIL="patient@gavino.clinic"
$env:PLAYWRIGHT_PATIENT_PASSWORD="Patient@123456"
$env:PLAYWRIGHT_STAFF_EMAIL="staff@gavino.clinic"
$env:PLAYWRIGHT_STAFF_PASSWORD="Staff@123456"
$env:PLAYWRIGHT_DOCTOR_EMAIL="dr.reyes@gavino.clinic"
$env:PLAYWRIGHT_DOCTOR_PASSWORD="Doctor@123456"
```

## Notes

- These are real E2E tests. Frontend and backend must be running.
- The staff frontend does not expose a visible booking-confirmation action in staff booking detail. The helper confirms through `PATCH /api/bookings/{id}/confirm` only when the booking is still `Pending` or proof-related.
- Optional prescription, follow-up, lab, and print steps are attempted only when their UI exists.

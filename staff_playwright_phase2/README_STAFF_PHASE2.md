# STAFF Playwright Phase 2

## Install

```bash
npm install -D @playwright/test
npx playwright install chromium
```

## Copy files

Copy these generated files into the project root:

```text
playwright.config.ts
tests/staff/setup.ts
tests/staff/dashboard.spec.ts
tests/staff/bookings.spec.ts
tests/staff/booking-detail.spec.ts
tests/staff/payments.spec.ts
tests/staff/walk-in.spec.ts
tests/staff/patients.spec.ts
tests/staff/patient-detail.spec.ts
tests/staff/doctor-status.spec.ts
tests/staff/profile.spec.ts
tests/staff/cross-role-workflow.spec.ts
SELECTOR_CONFIDENCE_REPORT.md
```

## Add scripts to package.json

```json
{
  "test:e2e": "playwright test",
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:staff": "playwright test tests/staff",
  "test:e2e:staff:headed": "playwright test tests/staff --headed"
}
```

## Environment variables

Defaults are based on the uploaded repo and dev quick-login credentials:

```bash
E2E_BASE_URL=http://localhost:4200
E2E_API_URL=http://localhost:5000/api
E2E_STAFF_EMAIL=staff@gavino.clinic
E2E_STAFF_PASSWORD=Staff@123456
E2E_ADMIN_EMAIL=admin@gavino.clinic
E2E_ADMIN_PASSWORD=Admin@123456
E2E_DOCTOR_EMAIL=dr.santos@gavino.clinic
E2E_DOCTOR_PASSWORD=Doctor@123456
E2E_PATIENT_EMAIL=patient@gavino.clinic
E2E_PATIENT_PASSWORD=Patient@123456
```

Use `http://localhost:8100` for `E2E_BASE_URL` if Ionic is served through `ionic serve`.

## Run

```bash
npm run test:e2e:staff
```

For visual debugging:

```bash
npm run test:e2e:staff:headed
```

## Important runtime notes

- Populated-state tests require actual data in the dev database.
- Payment tests require at least one completed unpaid booking.
- Portal-account tests require a patient without an existing portal account; otherwise they skip with an explicit message.
- Some tests intentionally expose known risks, especially the walk-in booking request payload not including appointment date and slot times.

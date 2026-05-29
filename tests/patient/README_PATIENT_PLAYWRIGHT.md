# Patient Playwright Suite

## Installation

```bash
npm install -D @playwright/test
npx playwright install chromium
```

## Environment variables

```bash
$env:PLAYWRIGHT_FRONTEND_URL="http://localhost:4200"
$env:PLAYWRIGHT_API_BASE_URL="https://localhost:44384/api"
$env:PLAYWRIGHT_PATIENT_EMAIL="patient@example.test"
$env:PLAYWRIGHT_PATIENT_PASSWORD="ChangeMe123!"
```

For Git Bash/macOS/Linux:

```bash
export PLAYWRIGHT_FRONTEND_URL="http://localhost:4200"
export PLAYWRIGHT_API_BASE_URL="https://localhost:44384/api"
export PLAYWRIGHT_PATIENT_EMAIL="patient@example.test"
export PLAYWRIGHT_PATIENT_PASSWORD="ChangeMe123!"
```

## Running tests

Run all Patient specs:

```bash
npx playwright test tests/patient
```

Run one spec only:

```bash
npx playwright test tests/patient/bookings.spec.ts
```

Run headed browser:

```bash
npx playwright test tests/patient --headed
```

Run Playwright UI mode:

```bash
npx playwright test tests/patient --ui
```

Show HTML report:

```bash
npx playwright show-report
```

## What to do when a test fails

1. Open the HTML report: `npx playwright show-report`.
2. Open the failed test and inspect the screenshot/video/trace.
3. Read `tests/patient/PHASE1_STATIC_ANALYSIS.md` to find the suspected source file and risk flag.
4. Check whether the failure is a true bug or an intentional `test.fail()` for known source risk.
5. Fix the component/API behavior, then remove `test.fail()` only after the expected UI behavior exists.

## Known expected failures encoded

- Dashboard API failures are swallowed into fallback states.
- Bookings cancel action does not await/catch the PATCH request.
- Booking detail lacks strong page-level error handling for failed booking load.
- Vaccinations page uses a stubbed service returning `of([])` because the table/API is not deployed.
- Reviews endpoint failure is treated as “no existing review.”
- Privacy consent can render blank when `patients/me` fails or returns null.

## Final output checklist

- [x] Phase 1 tables complete for Patient routes
- [x] Every selector in tests confirmed or flagged
- [x] Null/zero/empty array handling tested for data-driven pages
- [x] API failure tested or marked expected-fail for deficient source behavior
- [x] Loading state assertion in navigation/data tests
- [x] No hardcoded test data inline; fixtures centralized in `patient.fixtures.ts`
- [x] `playwright.config.ts` generated
- [x] `global.setup.ts` generated
- [x] `SELECTOR_CONFIDENCE_REPORT.md` generated
- [x] Setup and run instructions included

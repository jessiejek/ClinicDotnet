# Staff Account Playwright Suite

Generated for the authenticated Staff portal, with one bonus Admin Staff Accounts spec.

## Installation

```bash
npm install -D @playwright/test
npx playwright install chromium
```

## Environment variables

```bash
set PLAYWRIGHT_FRONTEND_URL=http://localhost:8100
set PLAYWRIGHT_API_BASE_URL=https://localhost:44384/api
set PLAYWRIGHT_STAFF_EMAIL=staff@example.com
set PLAYWRIGHT_STAFF_PASSWORD=YourPasswordHere
set PLAYWRIGHT_ADMIN_EMAIL=admin@example.com
set PLAYWRIGHT_ADMIN_PASSWORD=YourPasswordHere
```

PowerShell version:

```powershell
$env:PLAYWRIGHT_FRONTEND_URL="http://localhost:8100"
$env:PLAYWRIGHT_API_BASE_URL="https://localhost:44384/api"
```

## Running tests

```bash
# Run all staff-account tests
npx playwright test tests/staff-account

# Run one spec only
npx playwright test tests/staff-account/bookings.spec.ts

# Run headed browser
npx playwright test tests/staff-account --headed

# Run Playwright UI mode
npx playwright test tests/staff-account --ui

# Open HTML report
npx playwright show-report
```

## What to do when a test fails

1. Open the HTML report: `npx playwright show-report`.
2. Click the failed test.
3. Check the screenshot/video/trace under that test.
4. Match the failed selector to `SELECTOR_CONFIDENCE_REPORT.md`.
5. Open the suspected source file listed in `PHASE1_STATIC_ANALYSIS.md`.
6. If it is a real product issue, fix the page/API handling first, then rerun only the failed spec.
7. If the UI changed intentionally, update the selector report and the spec together.

## Known source risks encoded as expected failures

- Staff Dashboard: queue action PATCH calls have no success/error handlers.
- Staff Dashboard: today bookings API failure clears queue silently.
- Staff Patients: patient list API failure clears the list silently.
- Staff Booking Detail: booking load failure is logged and converted to null; no explicit toast.
- Admin Staff Accounts: invite form cannot submit because `save()` hardcodes `const accessToken = ''`.

## Final Output Checklist

- [x] Phase 1 tables complete for Staff portal routes and Admin Staff Accounts bonus page
- [x] Every selector in tests confirmed or flagged
- [x] Null/zero/empty array handling tested for data-driven pages
- [x] API failure tested for every page
- [x] Loading state assertion included where loading state exists in source
- [x] No hardcoded test data inline; test data centralized in `staff.fixtures.ts`
- [x] `playwright.config.ts` generated
- [x] `global.setup.ts` generated
- [x] `SELECTOR_CONFIDENCE_REPORT.md` generated
- [x] Setup and run instructions included

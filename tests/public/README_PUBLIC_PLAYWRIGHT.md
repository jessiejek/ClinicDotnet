# PUBLIC Playwright Suite — Setup and Run

## Installation

Run from the Angular/Ionic project root:

```bash
npm install -D @playwright/test
npx playwright install chromium
```

## Environment

Defaults used by the generated config:

```bash
# Frontend dev server
PLAYWRIGHT_BASE_URL=http://localhost:8100

# Backend API base used by the app environment during local dev
PLAYWRIGHT_API_BASE_URL=http://localhost:5000/api
```

The PUBLIC suite mocks backend `/api/**` responses with `page.route()`, so the backend does not need to be running for these generated tests. The frontend still needs to be running unless you set `PLAYWRIGHT_START_SERVER=1`.

## Running tests

```bash
# Run all PUBLIC tests
npx playwright test tests/public

# Run one spec file only
npx playwright test tests/public/doctors.spec.ts

# Run headed browser
npx playwright test tests/public --headed

# Run Playwright UI mode
npx playwright test tests/public --ui

# Show HTML report
npx playwright show-report
```

Optional auto-start frontend server:

```bash
PLAYWRIGHT_START_SERVER=1 npx playwright test tests/public
```

On Windows PowerShell:

```powershell
$env:PLAYWRIGHT_START_SERVER="1"
npx playwright test tests/public
```

## What to do when a test fails

1. Open the terminal failure and note the failing spec/test name.
2. Open `playwright-report/index.html` with `npx playwright show-report`.
3. Review the screenshot/video/trace for the failed test.
4. Check `tests/public/PHASE1_STATIC_ANALYSIS.md` for the suspected source file and risk flag.
5. Check `tests/public/SELECTOR_CONFIDENCE_REPORT.md` to verify whether the selector was HIGH/MEDIUM/LOW confidence.
6. Fix the frontend source file first when the failure is a UI state/error-handling issue.
7. Fix test data in `tests/public/public.fixtures.ts` only when the frontend behavior is correct but the mocked API contract is wrong.
8. Re-run the single failing spec before running the full public suite.

## Expected known failures encoded with `test.fail()`

These are intentional red flags from static analysis:

- `/public` home endpoint failures: no catchError/error UI on async-pipe API calls.
- `/public/announcements` failure: subscription has no error handler/finalize.
- `/public/doctors/:id` failure: forkJoin has no catchError/finalize for core profile data.
- `/public/booking-confirmation/:bookingId` failure: public-summary stream has no catchError.

When the app is fixed, these `test.fail()` annotations should be removed or converted into normal passing assertions.

## Final checklist

- [x] Phase 1 tables complete for PUBLIC routes.
- [x] Every selector in tests confirmed or flagged.
- [x] Null/zero/empty array handling tested for data-driven public pages.
- [x] API failure tested for every public page.
- [x] Loading state assertion included where source has loading UI; missing-loading routes are flagged.
- [x] No hardcoded data inline in test bodies; shared `publicTestData` object is used.
- [x] `playwright.config.ts` generated.
- [x] `global.setup.ts` generated.
- [x] `SELECTOR_CONFIDENCE_REPORT.md` generated.
- [x] Setup and run instructions included.

import { expect, test } from '@playwright/test';
import {
  assertExpectedApiCall,
  assertNoBlankWhiteScreen,
  collectApiResponses,
  collectConsoleErrors,
  expectNoConsoleErrors,
  mockPublicApi,
  publicTestData,
  waitForPublicLoadingToSettle
} from './public.fixtures';

const testData = publicTestData;

test.describe('/public/doctors/:id — Doctor Profile', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders profile controls, fires profile APIs, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockPublicApi(page);

      await page.goto(testData.routes.doctorProfile);
      await expect(page.locator('.profile-loading')).toBeVisible();
      await assertExpectedApiCall(responses, '/api/doctors/doc-001');
      await assertExpectedApiCall(responses, '/api/reviews');
      await assertExpectedApiCall(responses, '/api/doctors/doc-001/schedule');
      await assertExpectedApiCall(responses, '/api/doctor-day-status/doc-001');
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByRole('heading', { name: testData.doctors[0].fullName })).toBeVisible();
      await expect(page.getByRole('link', { name: `Book Appointment with ${testData.doctors[0].fullName}` })).toBeVisible();
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual doctor, services, schedules, and reviews from API response bodies', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockPublicApi(page, { delayMs: 0 });
      await page.goto(testData.routes.doctorProfile);
      await waitForPublicLoadingToSettle(page);

      const doctorResponse = await assertExpectedApiCall(responses, '/api/doctors/doc-001');
      const doctor = doctorResponse.body as (typeof testData.doctors)[number] & { services: typeof testData.services };
      await expect(page.getByText(doctor.fullName).first()).toBeVisible();
      await expect(page.getByText(doctor.bio)).toBeVisible();
      await expect(page.getByText(`License: ${doctor.licenseNumber}`)).toBeVisible();
      await expect(page.getByText(`PTR: ${doctor.ptrNumber}`)).toBeVisible();
      await expect(page.getByText(testData.services[0].name)).toBeVisible();
      await expect(page.getByText(testData.reviews[0].comment)).toBeVisible();
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('shows service/review fallbacks when nested arrays are empty and rating is zero', async ({ page }) => {
      await mockPublicApi(page, {
        doctorDetail: { ...testData.doctors[0], averageRating: 0, services: [] },
        services: [],
        reviews: [],
        delayMs: 0
      });
      await page.goto(testData.routes.doctorProfile);
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByText('No services listed.')).toBeVisible();
      await expect(page.getByText('Total: 0 reviews')).toBeVisible();
      await expect(page.getByText('0').first()).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
    });
  });

  test.describe('Empty State', () => {
    test('shows doctor-not-found empty state when doctor response is null', async ({ page }) => {
      await mockPublicApi(page, { doctorDetail: null, reviews: [], schedules: [], delayMs: 0 });
      await page.goto(testData.routes.doctorProfile);
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByText('Doctor not found')).toBeVisible();
      await expect(page.getByText('We could not find this clinician. Try the doctors directory.')).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('API Failure Handling', () => {
    test('FAIL risk is exposed when core doctor profile endpoint returns 500', async ({ page }) => {
      test.fail(true, 'Source risk: forkJoin in doctor-profile.page.ts has no catchError/finalize for doctor/reviews/schedules.');
      await mockPublicApi(page, { failEndpoints: ['doctors/doc-001'] });
      await page.goto(testData.routes.doctorProfile);
      await expect(page.getByText('Forced failure', { exact: false })).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Main Action (skip if read-only page)', () => {
    test.skip('Doctor profile is read-only; booking is a navigation link to /public/booking.', async () => {});
  });

  test.describe('Authorization (skip for fully public pages)', () => {
    test.skip('Doctor profile is intentionally public and has no role guard.', async () => {});
  });
});

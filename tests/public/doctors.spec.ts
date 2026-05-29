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

test.describe('/public/doctors — Doctors', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders confirmed selectors, fires doctors API, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockPublicApi(page);

      await page.goto(testData.routes.doctors);
      await expect(page.getByRole('heading', { name: 'Our Doctors' })).toBeVisible();
      await expect(page.locator('.page-loading ion-spinner')).toBeVisible();
      await assertExpectedApiCall(responses, '/api/doctors');
      await waitForPublicLoadingToSettle(page);
      await expect(page.locator('.filter-pill').first()).toBeVisible();
      await expect(page.locator('.doctors-grid app-doctor-card').first()).toBeVisible();
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual doctor API values and supports specialization filtering', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockPublicApi(page, { delayMs: 0 });
      await page.goto(testData.routes.doctors);
      await waitForPublicLoadingToSettle(page);

      const doctorsResponse = await assertExpectedApiCall(responses, '/api/doctors');
      const firstDoctor = (doctorsResponse.body as typeof testData.doctors)[0];
      await expect(page.getByText(firstDoctor.fullName)).toBeVisible();
      await expect(page.getByText(firstDoctor.specialization).first()).toBeVisible();
      await expect(page.getByText('₱650.00')).toBeVisible();
      await page.getByRole('button', { name: firstDoctor.specialization }).click();
      await expect(page.getByText(firstDoctor.fullName)).toBeVisible();
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('renders rating fallback and zero review count without leaving spinner visible', async ({ page }) => {
      await mockPublicApi(page, {
        doctors: [{ ...testData.doctors[0], averageRating: null, reviewCount: 0 }],
        delayMs: 0
      });
      await page.goto(testData.routes.doctors);
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByText('—')).toBeVisible();
      await expect(page.getByText('(0 reviews)')).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
    });
  });

  test.describe('Empty State', () => {
    test('shows confirmed empty state for empty doctors array', async ({ page }) => {
      await mockPublicApi(page, { doctors: [], delayMs: 0 });
      await page.goto(testData.routes.doctors);
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByText('No data found')).toBeVisible();
      await expect(page.getByText('There are no doctors available for the selected filter.')).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('API Failure Handling', () => {
    test('shows toast, stops spinner, and renders empty state when doctors API fails', async ({ page }) => {
      await mockPublicApi(page, { failEndpoints: ['doctors'] });
      await page.goto(testData.routes.doctors);
      await expect(page.locator(testData.selectors.toast)).toContainText('Forced failure for doctors');
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByText('No data found')).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Main Action (skip if read-only page)', () => {
    test.skip('Doctors page is read-only; Book Now/Profile links are navigation actions.', async () => {});
  });

  test.describe('Authorization (skip for fully public pages)', () => {
    test.skip('Doctors page is intentionally public and has no role guard.', async () => {});
  });
});

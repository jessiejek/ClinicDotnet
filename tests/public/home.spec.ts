import { expect, test } from '@playwright/test';
import {
  assertExpectedApiCall,
  assertNoBlankWhiteScreen,
  collectApiResponses,
  collectConsoleErrors,
  expectAnyTextVisible,
  expectNoConsoleErrors,
  mockPublicApi,
  publicTestData,
  waitForPublicLoadingToSettle
} from './public.fixtures';

const testData = publicTestData;

test.describe('/public — Home', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders hero/header controls, fires public APIs, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockPublicApi(page);

      await page.goto(testData.routes.home);
      await expect(page.getByRole('heading', { name: 'Your Health, Our Priority' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Book an Appointment' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Meet Our Doctors' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'View All Doctors →' })).toBeVisible();
      await assertExpectedApiCall(responses, '/api/doctors');
      await assertExpectedApiCall(responses, '/api/services');
      await assertExpectedApiCall(responses, '/api/announcements');
      await assertExpectedApiCall(responses, '/api/settings');
      await waitForPublicLoadingToSettle(page);
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual doctor, service, announcement, and settings values from response bodies', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockPublicApi(page, { delayMs: 0 });
      await page.goto(testData.routes.home);
      await waitForPublicLoadingToSettle(page);

      const doctorsResponse = await assertExpectedApiCall(responses, '/api/doctors');
      const servicesResponse = await assertExpectedApiCall(responses, '/api/services');
      const announcementsResponse = await assertExpectedApiCall(responses, '/api/announcements');

      const firstDoctor = (doctorsResponse.body as typeof testData.doctors)[0];
      const firstService = (servicesResponse.body as typeof testData.services)[0];
      const firstAnnouncement = (announcementsResponse.body as typeof testData.announcements)[0];
      await expectAnyTextVisible(page, [firstDoctor.fullName, firstDoctor.specialization, firstService.category, firstAnnouncement.title]);
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('renders fallback for nullable doctor rating and zero service price without spinner', async ({ page }) => {
      await mockPublicApi(page, {
        doctors: [{ ...testData.doctors[0], averageRating: null, reviewCount: 0 }],
        services: [{ ...testData.services[0], price: 0 }],
        delayMs: 0
      });
      await page.goto(testData.routes.home);
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByText('—')).toBeVisible();
      await expect(page.getByText('(0 reviews)')).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
    });
  });

  test.describe('Empty State', () => {
    test('does not crash when public list endpoints return empty arrays', async ({ page }) => {
      await mockPublicApi(page, { doctors: [], services: [], announcements: [], delayMs: 0 });
      await page.goto(testData.routes.home);
      await waitForPublicLoadingToSettle(page);
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('API Failure Handling', () => {
    test('FAIL risk is exposed when a home endpoint returns 500', async ({ page }) => {
      test.fail(true, 'Source risk: home.page.ts uses async pipes without catchError/error UI for doctors/services/announcements/settings.');
      await mockPublicApi(page, { failEndpoints: ['doctors'] });
      await page.goto(testData.routes.home);
      await expect(page.getByText('Forced failure', { exact: false })).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Main Action (skip if read-only page)', () => {
    test.skip('Home is read-only; primary actions are navigation links only.', async () => {});
  });

  test.describe('Authorization (skip for fully public pages)', () => {
    test.skip('Home is intentionally public and has no role guard.', async () => {});
  });
});

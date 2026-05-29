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

test.describe('/public/announcements — Announcements', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders header/skeleton, fires announcements API, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockPublicApi(page);

      await page.goto(testData.routes.announcements);
      await expect(page.getByRole('heading', { name: 'Announcements' })).toBeVisible();
      await expect(page.locator('.skeleton-grid app-skeleton').first()).toBeVisible();
      await assertExpectedApiCall(responses, '/api/announcements');
      await waitForPublicLoadingToSettle(page);
      await expect(page.locator('.announcements-grid app-announcement-card').first()).toBeVisible();
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual announcement title and body from API response', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockPublicApi(page, { delayMs: 0 });
      await page.goto(testData.routes.announcements);
      await waitForPublicLoadingToSettle(page);

      const announcementsResponse = await assertExpectedApiCall(responses, '/api/announcements');
      const firstAnnouncement = (announcementsResponse.body as typeof testData.announcements)[0];
      await expect(page.getByText(firstAnnouncement.title)).toBeVisible();
      await expect(page.getByText(firstAnnouncement.body)).toBeVisible();
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('renders image placeholder when imageUrl is empty and does not leave skeleton visible', async ({ page }) => {
      await mockPublicApi(page, { announcements: [{ ...testData.announcements[0], imageUrl: '' }], delayMs: 0 });
      await page.goto(testData.routes.announcements);
      await waitForPublicLoadingToSettle(page);
      await expect(page.locator('.announcement-card__img-placeholder').first()).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
    });
  });

  test.describe('Empty State', () => {
    test('shows exact empty hint for empty announcements array', async ({ page }) => {
      await mockPublicApi(page, { announcements: [], delayMs: 0 });
      await page.goto(testData.routes.announcements);
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByText('No active announcements right now. Check back soon.')).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('API Failure Handling', () => {
    test('FAIL risk is exposed when announcements API returns 500', async ({ page }) => {
      test.fail(true, 'Source risk: announcements.page.ts subscribes without error handler/finalize; skeleton may stay forever on 500.');
      await mockPublicApi(page, { failEndpoints: ['announcements'] });
      await page.goto(testData.routes.announcements);
      await expect(page.getByText('Forced failure', { exact: false })).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Main Action (skip if read-only page)', () => {
    test.skip('Announcements page is read-only.', async () => {});
  });

  test.describe('Authorization (skip for fully public pages)', () => {
    test.skip('Announcements page is intentionally public and has no role guard.', async () => {});
  });
});

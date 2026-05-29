import { expect, test } from '@playwright/test';
import {
  assertNoBlankWhiteScreen,
  collectConsoleErrors,
  expectNoConsoleErrors,
  mockPublicApi,
  publicTestData,
  waitForPublicLoadingToSettle
} from './public.fixtures';

const testData = publicTestData;

test.describe('/public/privacy-policy — Privacy Policy', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders confirmed links/content, and has no console errors', async ({ page }) => {
      const consoleErrors = collectConsoleErrors(page);
      await mockPublicApi(page, { delayMs: 0 });

      await page.goto(testData.routes.privacyPolicy);
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
      await expect(page.getByRole('link', { name: '← Back to Home' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'support@yourclinicdomain.com' })).toBeVisible();
      await expect(page.getByRole('link', { name: '← Return to Home' })).toBeVisible();
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders static policy sections from source', async ({ page }) => {
      await mockPublicApi(page, { delayMs: 0 });
      await page.goto(testData.routes.privacyPolicy);
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByRole('heading', { name: 'Information We Collect' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'How We Use Information' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Data Storage and Security' })).toBeVisible();
      await expect(page.getByText('Last updated: May 23, 2026')).toBeVisible();
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('has no API-driven null/zero-risk fields and does not show spinner', async ({ page }) => {
      await mockPublicApi(page, { delayMs: 0 });
      await page.goto(testData.routes.privacyPolicy);
      await waitForPublicLoadingToSettle(page);
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Empty State', () => {
    test('has no API list empty state and still renders the static legal content', async ({ page }) => {
      await mockPublicApi(page, { doctors: [], services: [], announcements: [], delayMs: 0 });
      await page.goto(testData.routes.privacyPolicy);
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('API Failure Handling', () => {
    test('is unaffected by public API failures because the route has no direct ApiService call', async ({ page }) => {
      await mockPublicApi(page, { failEndpoints: ['doctors', 'services', 'announcements', 'settings'] });
      await page.goto(testData.routes.privacyPolicy);
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Main Action (skip if read-only page)', () => {
    test.skip('Privacy policy is read-only; links are navigation/contact only.', async () => {});
  });

  test.describe('Authorization (skip for fully public pages)', () => {
    test.skip('Privacy policy is intentionally public and has no role guard.', async () => {});
  });
});

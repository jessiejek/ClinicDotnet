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

test.describe('/public/services — Services', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders filters, fires services API, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockPublicApi(page);

      await page.goto(testData.routes.services);
      await expect(page.getByRole('heading', { name: 'Our Services' })).toBeVisible();
      await expect(page.locator('.page-loading ion-spinner')).toBeVisible();
      await assertExpectedApiCall(responses, '/api/services');
      await waitForPublicLoadingToSettle(page);
      await expect(page.locator('.filter-pill').first()).toBeVisible();
      await expect(page.locator('.service-item').first()).toBeVisible();
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual service API values and supports category filtering', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockPublicApi(page, { delayMs: 0 });
      await page.goto(testData.routes.services);
      await waitForPublicLoadingToSettle(page);

      const servicesResponse = await assertExpectedApiCall(responses, '/api/services');
      const firstService = (servicesResponse.body as typeof testData.services)[0];
      await expect(page.getByText(firstService.name)).toBeVisible();
      await expect(page.getByText(firstService.description)).toBeVisible();
      await expect(page.getByText(`Time: ${firstService.estimatedDurationMinutes} min`)).toBeVisible();
      await expect(page.getByText('Included in consultation')).toBeVisible();
      await page.getByRole('button', { name: firstService.category }).first().click();
      await expect(page.getByText(firstService.name)).toBeVisible();
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('renders description fallback and zero price label without spinner', async ({ page }) => {
      await mockPublicApi(page, {
        services: [{ ...testData.services[0], description: '', price: 0 }],
        delayMs: 0
      });
      await page.goto(testData.routes.services);
      await waitForPublicLoadingToSettle(page);
      await expect(page.locator('.service-item__desc').first()).toHaveText('-');
      await expect(page.getByText('Included in consultation')).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
    });
  });

  test.describe('Empty State', () => {
    test('shows confirmed empty state for empty services array', async ({ page }) => {
      await mockPublicApi(page, { services: [], delayMs: 0 });
      await page.goto(testData.routes.services);
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByText('No data found')).toBeVisible();
      await expect(page.getByText('There are no services available for the selected filter.')).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('API Failure Handling', () => {
    test('shows toast, stops spinner, and renders empty state when services API fails', async ({ page }) => {
      await mockPublicApi(page, { failEndpoints: ['services'] });
      await page.goto(testData.routes.services);
      await expect(page.locator(testData.selectors.toast)).toContainText('Forced failure for services');
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByText('No data found')).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Main Action (skip if read-only page)', () => {
    test.skip('Services page is read-only; service category cards only filter/navigate.', async () => {});
  });

  test.describe('Authorization (skip for fully public pages)', () => {
    test.skip('Services page is intentionally public and has no role guard.', async () => {});
  });
});

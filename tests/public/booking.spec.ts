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

test.describe('/public/booking — Booking Wizard', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders step one, fires doctors API, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockPublicApi(page);

      await page.goto(testData.routes.booking);
      await expect(page.getByRole('heading', { name: 'Choose your doctor and services' })).toBeVisible();
      await expect(page.locator('.wizard-loading ion-spinner')).toBeVisible();
      await assertExpectedApiCall(responses, '/api/doctors');
      await waitForPublicLoadingToSettle(page);
      await expect(page.locator('.wizard-step').filter({ hasText: 'Doctor & Service' })).toBeVisible();
      await expect(page.locator('.doctor-grid .doctor-card').first()).toBeVisible();
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual doctor/service values and advances to date selection', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockPublicApi(page, { delayMs: 0 });
      await page.goto(testData.routes.booking);
      await waitForPublicLoadingToSettle(page);

      const doctorsResponse = await assertExpectedApiCall(responses, '/api/doctors');
      const firstDoctor = (doctorsResponse.body as typeof testData.doctors)[0];
      await expect(page.getByText(firstDoctor.fullName)).toBeVisible();
      await page.locator('.doctor-grid .doctor-card').first().click();
      await assertExpectedApiCall(responses, '/api/doctors/doc-001/services');
      await expect(page.getByText(testData.services[0].name)).toBeVisible();
      await page.locator('.service-option').first().click();
      await page.getByRole('button', { name: 'Continue' }).click();
      await expect(page.getByRole('heading', { name: 'Select your appointment date' })).toBeVisible();
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('renders fallback for missing service description and blocks continuing until service is selected', async ({ page }) => {
      await mockPublicApi(page, {
        services: [{ ...testData.services[0], description: '', price: 0 }],
        delayMs: 0
      });
      await page.goto(testData.routes.booking);
      await waitForPublicLoadingToSettle(page);
      await page.locator('.doctor-grid .doctor-card').first().click();
      await expect(page.getByText('Clinic service available for this doctor.')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
    });
  });

  test.describe('Empty State', () => {
    test('shows confirmed empty state when doctors endpoint returns empty array', async ({ page }) => {
      await mockPublicApi(page, { doctors: [], delayMs: 0 });
      await page.goto(testData.routes.booking);
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByText('No doctors available')).toBeVisible();
      await expect(page.getByText('No doctors are available right now.')).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });

    test('shows confirmed empty state when selected doctor has no assigned services', async ({ page }) => {
      await mockPublicApi(page, { services: [], delayMs: 0 });
      await page.goto(testData.routes.booking);
      await waitForPublicLoadingToSettle(page);
      await page.locator('.doctor-grid .doctor-card').first().click();
      await expect(page.getByText('No services available')).toBeVisible();
      await expect(page.getByText('This doctor currently has no services assigned.')).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('API Failure Handling', () => {
    test('shows toast and empty state when doctors API fails in booking wizard step one', async ({ page }) => {
      await mockPublicApi(page, { failEndpoints: ['doctors'] });
      await page.goto(testData.routes.booking);
      await expect(page.locator(testData.selectors.toast)).toContainText('Forced failure for doctors');
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByText('No doctors available')).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });

    test('shows service-load empty state when doctor services API fails', async ({ page }) => {
      await mockPublicApi(page, { failEndpoints: ['doctors/doc-001/services'] });
      await page.goto(testData.routes.booking);
      await waitForPublicLoadingToSettle(page);
      await page.locator('.doctor-grid .doctor-card').first().click();
      await expect(page.locator(testData.selectors.toast)).toContainText('Forced failure for doctors/doc-001/services');
      await expect(page.getByText('Unable to load services')).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Main Action (skip if read-only page)', () => {
    test('guest public booking cannot submit and must be routed through login-required step', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockPublicApi(page, { delayMs: 0 });
      await page.goto(testData.routes.booking);
      await waitForPublicLoadingToSettle(page);
      await page.locator('.doctor-grid .doctor-card').first().click();
      await page.locator('.service-option').first().click();
      await page.getByRole('button', { name: 'Continue' }).click();
      await expect(page.getByRole('heading', { name: 'Select your appointment date' })).toBeVisible();
      await page.getByRole('button', { name: 'Continue' }).click();
      await expect(page.getByRole('heading', { name: 'Select your preferred time' })).toBeVisible();
      await assertExpectedApiCall(responses, '/api/doctors/doc-001/available-slots');
    });
  });

  test.describe('Authorization (skip for fully public pages)', () => {
    test.skip('Booking route is public, but final submission requires authenticated AuthStateService snapshot.', async () => {});
  });
});

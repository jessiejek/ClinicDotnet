import { expect, test } from '@playwright/test';
import {
  assertExpectedApiCall,
  assertNoBlankWhiteScreen,
  collectApiResponses,
  collectConsoleErrors,
  expectAnyTextVisible,
  expectNoConsoleErrors,
  mockStaffApi,
  staffTestData,
  waitForStaffLoadingToSettle
} from './staff.fixtures';

const testData = staffTestData;


test.describe('/staff/bookings — Today Bookings', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders filters/table, fires bookings and doctors APIs, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockStaffApi(page);
      await page.goto(testData.routes.bookings);
      await expect(page.getByText('View and manage patient bookings across all dates')).toBeVisible();
      await expect(page.locator('select.filter-input').first()).toBeVisible();
      await expect(page.locator('input[type="date"]')).toBeVisible();
      await assertExpectedApiCall(responses, 'bookings/staff/all');
      await assertExpectedApiCall(responses, '/api/doctors');
      await waitForStaffLoadingToSettle(page);
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual booking API values and opens detail page by patient link', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.bookings);
      await waitForStaffLoadingToSettle(page);
      const response = await assertExpectedApiCall(responses, 'bookings/staff/all');
      const first = ((response.body as any).items ?? [])[0];
      await expect(page.getByText(first.patientName).first()).toBeVisible();
      await expect(page.getByText(first.doctorName).first()).toBeVisible();
      await expect(page.getByText('General Consultation').first()).toBeVisible();
      await page.getByRole('button', { name: /Juan Dela Cruz|Open booking/i }).first().click();
      await expect(page).toHaveURL(/\/staff\/bookings\/bk-001/);
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('renders dash for null queue and no spinner for zero-result page', async ({ page }) => {
      await mockStaffApi(page, { bookings: [{ ...testData.bookings[0], queueNumber: null }], delayMs: 0 });
      await page.goto(testData.routes.bookings);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('-').first()).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
    });
  });

  test.describe('Empty State', () => {
    test('shows confirmed empty state for empty bookings response', async ({ page }) => {
      await mockStaffApi(page, { emptyEndpoints: ['bookings/staff/all'], delayMs: 0 });
      await page.goto(testData.routes.bookings);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('No bookings found')).toBeVisible();
      await expect(page.getByText('There are no bookings for the selected date and filters.')).toBeVisible();
    });
  });

  test.describe('API Failure Handling', () => {
    test('shows toast and stops loading when bookings API fails', async ({ page }) => {
      await mockStaffApi(page, { failEndpoints: ['bookings/staff/all'] });
      await page.goto(testData.routes.bookings);
      await expect(page.locator(testData.selectors.toast)).toContainText('Forced failure');
      await waitForStaffLoadingToSettle(page);
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Main Action', () => {
    test('check-in sends patch and shows success feedback', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.bookings);
      await waitForStaffLoadingToSettle(page);
      await page.getByRole('button', { name: 'Check In' }).first().click();
      await assertExpectedApiCall(responses, 'bookings/bk-001/check-in', 'PATCH');
      await expect(page.locator(testData.selectors.toast)).toContainText('Patient checked in.');
    });
  });

  test.describe('Authorization', () => {
    test('guest should not render bookings table', async ({ page }) => {
      await mockStaffApi(page, { role: 'Guest', delayMs: 0 });
      await page.goto(testData.routes.bookings);
      await expect(page.getByText('Juan Dela Cruz')).toHaveCount(0);
    });
  });
});

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


test.describe('/staff/bookings/:id — Booking Detail', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders booking detail sections, fires booking API, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockStaffApi(page);
      await page.goto(testData.routes.bookingDetail);
      await expect(page.getByRole('heading', { name: 'Booking Details' })).toBeVisible();
      await expect(page.getByText('Patient Info')).toBeVisible();
      await expect(page.getByText('Doctor Info')).toBeVisible();
      await assertExpectedApiCall(responses, 'bookings/bk-001');
      await waitForStaffLoadingToSettle(page);
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual booking API values', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.bookingDetail);
      await waitForStaffLoadingToSettle(page);
      const response = await assertExpectedApiCall(responses, 'bookings/bk-001');
      const booking = response.body as any;
      await expect(page.getByText(booking.patientName).first()).toBeVisible();
      await expect(page.getByText(booking.doctorName).first()).toBeVisible();
      await expect(page.getByText('General Consultation')).toBeVisible();
      await expect(page.getByText('PHP 650')).toBeVisible();
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('does not crash when queue and final amount are null', async ({ page }) => {
      await mockStaffApi(page, { bookings: [{ ...testData.bookings[0], queueNumber: null, finalAmount: null as any }], delayMs: 0 });
      await page.goto(testData.routes.bookingDetail);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('Queue #:')).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Empty State', () => {
    test('FAIL risk: missing booking renders generic missing template instead of specific error', async ({ page }) => {
      test.fail(true, 'Source risk: loadBooking catchError returns null and missingTpl must be verified; no explicit user-facing API error toast.');
      await mockStaffApi(page, { failEndpoints: ['bookings/bk-001'], delayMs: 0 });
      await page.goto(testData.routes.bookingDetail);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('Unable', { exact: false })).toBeVisible();
    });
  });

  test.describe('API Failure Handling', () => {
    test('exposes swallowed load error risk on booking detail 500', async ({ page }) => {
      test.fail(true, 'Source risk: catchError only console.error and returns null; user may not see API failure reason.');
      await mockStaffApi(page, { failEndpoints: ['bookings/bk-001'] });
      await page.goto(testData.routes.bookingDetail);
      await expect(page.locator(testData.selectors.toast)).toContainText('Failed');
    });
  });

  test.describe('Main Action', () => {
    test('check-in sends patch and shows success toast', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.bookingDetail);
      await waitForStaffLoadingToSettle(page);
      await page.getByRole('button', { name: 'Check In' }).first().click();
      await assertExpectedApiCall(responses, 'bookings/bk-001/check-in', 'PATCH');
      await expect(page.locator(testData.selectors.toast)).toContainText('Patient checked in.');
    });
  });

  test.describe('Authorization', () => {
    test('guest should not render booking details', async ({ page }) => {
      await mockStaffApi(page, { role: 'Guest', delayMs: 0 });
      await page.goto(testData.routes.bookingDetail);
      await expect(page.getByText('Juan Dela Cruz')).toHaveCount(0);
    });
  });
});

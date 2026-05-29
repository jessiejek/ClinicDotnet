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


test.describe('/staff/dashboard — Staff Dashboard', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders dashboard stats/queue, fires expected APIs, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockStaffApi(page);
      await page.goto(testData.routes.dashboard);
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
      await expect(page.getByText("Today's Appointments")).toBeVisible();
      await expect(page.getByText('Ready for Payment')).toBeVisible();
      await assertExpectedApiCall(responses, 'bookings/staff/today');
      await assertExpectedApiCall(responses, '/api/doctors');
      await waitForStaffLoadingToSettle(page);
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual booking, doctor, patient, queue, and payment values', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.dashboard);
      await waitForStaffLoadingToSettle(page);
      const bookingsResponse = await assertExpectedApiCall(responses, 'bookings/staff/today');
      const firstBooking = ((bookingsResponse.body as any).items ?? [])[0];
      await expectAnyTextVisible(page, [firstBooking.patientName, testData.patients[0].fullName]);
      await expect(page.getByText(firstBooking.doctorName).first()).toBeVisible();
      await expect(page.getByText('#1').first()).toBeVisible();
      await expect(page.getByText('Collect Now')).toBeVisible();
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('renders zero stat counts and queue fallback when there are no bookings', async ({ page }) => {
      await mockStaffApi(page, { emptyEndpoints: ['bookings/staff/today'], delayMs: 0 });
      await page.goto(testData.routes.dashboard);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('No queue items for now.')).toBeVisible();
      await expect(page.getByText('0').first()).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Empty State', () => {
    test('shows queue empty state for empty today bookings response', async ({ page }) => {
      await mockStaffApi(page, { emptyEndpoints: ['bookings/staff/today'], delayMs: 0 });
      await page.goto(testData.routes.dashboard);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('Booked and confirmed bookings will appear here during the day.')).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
    });
  });

  test.describe('API Failure Handling', () => {
    test('FAIL risk: dashboard booking action errors are swallowed and today-bookings error has no toast', async ({ page }) => {
      test.fail(true, 'Source risk: loadTodaysBookings error clears list silently; onQueueAction patch calls subscribe() without next/error UI handling.');
      await mockStaffApi(page, { failEndpoints: ['bookings/staff/today'] });
      await page.goto(testData.routes.dashboard);
      await expect(page.locator(testData.selectors.toast)).toContainText('Failed');
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Main Action', () => {
    test('opens payment queue when payment banner/action is clicked', async ({ page }) => {
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.dashboard);
      await waitForStaffLoadingToSettle(page);
      await page.getByText('Go to Payment Queue', { exact: false }).click();
      await expect(page).toHaveURL(/\/staff\/payments/);
    });
  });

  test.describe('Authorization', () => {
    test('non-staff user should not see staff dashboard protected data', async ({ page }) => {
      await mockStaffApi(page, { role: 'Patient', delayMs: 0 });
      await page.goto(testData.routes.dashboard);
      await expect(page.getByText('Staff Portal')).toHaveCount(0);
      await expect(page.getByText('Juan Dela Cruz')).toHaveCount(0);
    });
  });
});

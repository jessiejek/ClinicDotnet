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


test.describe('/staff/payments — Payment Queue', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders payment queue, fires for-payment API, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockStaffApi(page);
      await page.goto(testData.routes.payments);
      await expect(page.getByText('Collect payment for completed consultations with an amount due')).toBeVisible();
      await expect(page.getByText('Loading payment queue...')).toBeVisible();
      await assertExpectedApiCall(responses, 'bookings/staff/for-payment');
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('Outstanding professional fees')).toBeVisible();
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual payment queue API values', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.payments);
      await waitForStaffLoadingToSettle(page);
      const response = await assertExpectedApiCall(responses, 'bookings/staff/for-payment');
      const item = ((response.body as any).items ?? [])[0];
      await expect(page.getByText(item.patient_name).first()).toBeVisible();
      await expect(page.getByText(item.doctor_name).first()).toBeVisible();
      await expect(page.getByText('500').first()).toBeVisible();
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('renders dash for null queue number and zero amount without spinner', async ({ page }) => {
      const zeroBooking = { ...testData.bookings[1], queueNumber: null, finalAmount: 0 };
      await mockStaffApi(page, { bookings: [zeroBooking], delayMs: 0 });
      await page.goto(testData.routes.payments);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('-').first()).toBeVisible();
      await expect(page.getByText('0').first()).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
    });
  });

  test.describe('Empty State', () => {
    test('shows confirmed empty state for empty payment queue response', async ({ page }) => {
      await mockStaffApi(page, { emptyEndpoints: ['bookings/staff/for-payment'], delayMs: 0 });
      await page.goto(testData.routes.payments);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('No queue items for now.')).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
    });
  });

  test.describe('API Failure Handling', () => {
    test('shows toast and stops loading when payment queue API fails', async ({ page }) => {
      await mockStaffApi(page, { failEndpoints: ['bookings/staff/for-payment'] });
      await page.goto(testData.routes.payments);
      await expect(page.locator(testData.selectors.toast)).toContainText('Forced failure');
      await waitForStaffLoadingToSettle(page);
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Main Action', () => {
    test('confirm payment opens modal, submits patch, reloads, and shows receipt feedback', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.payments);
      await waitForStaffLoadingToSettle(page);
      await page.getByRole('button', { name: 'Confirm Payment' }).first().click();
      await expect(page.getByRole('heading', { name: 'Collect Payment' })).toBeVisible();
      await page.locator('input[name="amountReceived"]').fill(String(testData.payment.amountReceived));
      await page.locator('input[name="referenceNumber"]').fill(testData.payment.referenceNumber);
      await page.locator('textarea[name="paymentNotes"]').fill(testData.payment.notes);
      await page.getByRole('button', { name: 'Confirm Payment' }).last().click();
      await assertExpectedApiCall(responses, 'payments/pay-002/confirm', 'PATCH');
      await expect(page.locator(testData.selectors.toast)).toContainText('Payment confirmed.');
    });
  });

  test.describe('Authorization', () => {
    test('guest should not render payment queue values', async ({ page }) => {
      await mockStaffApi(page, { role: 'Guest', delayMs: 0 });
      await page.goto(testData.routes.payments);
      await expect(page.getByText('Maria Reyes')).toHaveCount(0);
    });
  });
});

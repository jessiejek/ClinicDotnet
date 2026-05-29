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

test.describe('/public/booking-confirmation/:bookingId — Booking Confirmation', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders confirmation actions, loads public summary, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockPublicApi(page);

      await page.goto(testData.routes.bookingConfirmation);
      await expect(page.getByText('Loading booking details...')).toBeVisible();
      await assertExpectedApiCall(responses, '/api/bookings/book-001/public-summary');
      await waitForPublicLoadingToSettle(page);
      await expect(page.getByRole('heading', { name: 'Booking Confirmed!' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Back to Home' })).toBeVisible();
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual public-summary API values', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockPublicApi(page, { delayMs: 0 });
      await page.goto(testData.routes.bookingConfirmation);
      await waitForPublicLoadingToSettle(page);

      const summaryResponse = await assertExpectedApiCall(responses, '/api/bookings/book-001/public-summary');
      const summary = summaryResponse.body as typeof testData.bookingSummary;
      await expect(page.getByText(`Booking ID: ${summary.id}`)).toBeVisible();
      await expect(page.getByText(`#${summary.queueNumber}`)).toBeVisible();
      await expect(page.getByText(summary.doctorName)).toBeVisible();
      await expect(page.getByText(summary.serviceName)).toBeVisible();
      await expect(page.getByText('₱650.00')).toBeVisible();
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('renders fallback values for null queue/date/time and zero total fee', async ({ page }) => {
      await mockPublicApi(page, {
        bookingSummary: {
          ...testData.bookingSummary,
          queueNumber: null,
          appointmentDate: null,
          slotStartTime: null,
          slotEndTime: null,
          doctorName: null,
          serviceName: null,
          totalFee: 0
        },
        delayMs: 0
      });
      await page.goto(testData.routes.bookingConfirmation);
      await waitForPublicLoadingToSettle(page);
      await expect(page.locator('.queue-card')).toHaveCount(0);
      await expect(page.getByText('₱0.00')).toBeVisible();
      await expect(page.getByText('-').first()).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
    });
  });

  test.describe('Empty State', () => {
    test.skip('No routable empty-state URL exists for this route because :bookingId is required by public.routes.ts.', async () => {});
  });

  test.describe('API Failure Handling', () => {
    test('FAIL risk is exposed when public-summary endpoint returns 500', async ({ page }) => {
      test.fail(true, 'Source risk: booking-confirmation.page.ts has no catchError around public-summary endpoint.');
      await mockPublicApi(page, { failEndpoints: ['bookings/book-001/public-summary'] });
      await page.goto(testData.routes.bookingConfirmation);
      await expect(page.getByText('Booking Not Found')).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Main Action (skip if read-only page)', () => {
    test.skip('Confirmation page is read-only; buttons navigate only.', async () => {});
  });

  test.describe('Authorization (skip for fully public pages)', () => {
    test.skip('Booking confirmation is intentionally public and has no role guard.', async () => {});
  });
});

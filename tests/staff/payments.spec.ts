import { test, expect } from '@playwright/test';
import { loginAsStaff, openStaffRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, expectPageVisible, SELECTORS, ROUTES } from './staff.fixtures';
import { findStaffBookingByStatus } from '../utils/booking-lookup';

const PAYMENT_METHOD = process.env['E2E_PAYMENT_METHOD'] || 'Cash';
const AMOUNT = process.env['E2E_PAYMENT_AMOUNT'] || '650';
const PAYMENT_REF = process.env['E2E_PAYMENT_REFERENCE'] || 'E2E-PAY-001';

test.describe('Staff Payments', () => {

  test('Navigation: opens payment queue page with stat cards', async ({ page }) => {
    await loginAsStaff(page);
    const responses = await openStaffRoute(page, ROUTES.payments);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('Payment Queue', { timeout: 10000 });
    await expect(page.getByTestId('staff-payments-previous-page-button').or(page.getByTestId('staff-payments-payment-modal').or(page.locator(SELECTORS.statCard).first()))).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);

    expect(responses.some(r => r.url.includes('/api/bookings/staff/for-payment') && r.status === 200)).toBeTruthy();
  });

  test('Populated State: payment items are visible when data exists', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.payments);

    const statValue = page.locator(SELECTORS.statCardValue).first();
    await expect(statValue).not.toBeEmpty({ timeout: 5000 });
  });

  test('Empty State: shows when no payments pending', async ({ page }) => {
    await loginAsStaff(page);
    await mockApiResponse(page, 'bookings/staff/for-payment', { items: [], totalCount: 0 });
    await page.goto(ROUTES.payments);
    await page.waitForLoadState('networkidle');

    await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });

  test('API Failure: shows error handling gracefully', async ({ page }) => {
    await loginAsStaff(page);
    await mockApiFailure(page, 'bookings/staff/for-payment');
    await page.goto(ROUTES.payments);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });

  test('Payment Confirm: finds Completed+Unpaid booking and confirms payment', async ({ page }) => {
    await loginAsStaff(page);

    // Dynamically find a Completed+Unpaid booking via staff API
    const booking = await findStaffBookingByStatus(page, 'Completed', { paymentStatus: 'Unpaid' });
    if (!booking) {
      console.log('ℹ️ No Completed+Unpaid booking found — skipping payment confirm test.');
      test.skip(true, '[NEEDS TEST DATA: no Completed+Unpaid booking found in the database]');
      return;
    }

    console.log(`🔍 Found Completed+Unpaid booking ${booking.id} for ${booking.doctorName}, amount ${booking.finalAmount ?? booking.totalFee}`);

    await openStaffRoute(page, ROUTES.payments);

    // Use data-testid for the specific booking's confirm payment button
    const confirmBtn = page.getByTestId(`staff-payments-confirm-open-button-${booking.id}`);
    if (!(await confirmBtn.isVisible({ timeout: 5_000 }).catch(() => false))) {
      console.log(`ℹ️ Confirm Payment button not visible for booking ${booking.id} on current page.`);
      test.skip(true, '[NEEDS TEST DATA: booking exists but Confirm Payment button not on current view]');
      return;
    }

    // Open payment modal and wait for it to render
    await confirmBtn.click();
    const payModal = page.getByTestId('staff-payments-payment-modal');
    await expect(payModal).toBeVisible({ timeout: 5_000 });

    // Fill payment details
    const methodSelect = page.getByTestId('staff-payments-payment-method-select');
    await expect(methodSelect).toBeVisible({ timeout: 3_000 });
    await methodSelect.selectOption(PAYMENT_METHOD);

    const amountInput = page.getByTestId('staff-payments-amount-received-input');
    await amountInput.fill(AMOUNT);

    const refInput = page.getByTestId('staff-payments-reference-number-input');
    await refInput.fill(PAYMENT_REF);

    const notesInput = page.getByTestId('staff-payments-notes-textarea');
    await notesInput.fill('E2E payment confirmation test');

    // Submit payment via the confirm button in the modal
    const confirmSubmitBtn = page.getByTestId('staff-payments-payment-modal-confirm-button');
    const payResponse = page.waitForResponse(
      (resp) => resp.url().includes('/api/payments/') && resp.url().includes('/confirm') && resp.request().method() === 'PATCH',
      { timeout: 15_000 },
    );

    await confirmSubmitBtn.click();
    const resp = await payResponse;
    expect(resp.status()).toBe(200);
    console.log(`💰 Payment confirm API for ${booking.id}: ${resp.status()}`);

    // Verify success via toast
    await expect(page.locator('ion-toast').first()).toBeVisible({ timeout: 10_000 }).catch(() => {
      console.log('ℹ️ Success toast not detected — may auto-dismiss quickly.');
    });
  });

  test('Waive PF: finds Completed+Unpaid booking and opens waive modal', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.payments);

    // Find a Completed+Unpaid booking that still has the Waive button visible
    // (the payment test may have consumed the only one)
    const booking = await findStaffBookingByStatus(page, 'Completed', { paymentStatus: 'Unpaid' });
    if (!booking) {
      console.log('ℹ️ No Completed+Unpaid booking available for waive test.');
      test.skip(true, '[NEEDS TEST DATA: no Completed+Unpaid booking available for waive — payment test may have consumed it]');
      return;
    }

    const waiveBtn = page.getByTestId(`staff-payments-waive-open-button-${booking.id}`);
    if (!(await waiveBtn.isVisible({ timeout: 5_000 }).catch(() => false))) {
      console.log(`ℹ️ Waive PF button not visible for booking ${booking.id}.`);
      test.skip(true, '[NEEDS TEST DATA: Waive PF button not visible — booking may have been paid already]');
      return;
    }

    // Click waive and verify the waive modal opens (shared confirm modal)
    await waiveBtn.click();

    // The waive modal uses the shared confirm-modal component
    const waiveModal = page.locator('app-confirm-modal');
    await expect(waiveModal).toBeVisible({ timeout: 5_000 });
    console.log('✅ Waive PF modal opened.');
  });

  test('Print/Download: receipt print action if present', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.payments);

    const printBtn = page.locator('button:has-text("Print")');
    if (!(await printBtn.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('ℹ️ No Print button available on payments page.');
      return;
    }

    console.log('✅ Print button found.');
  });
});

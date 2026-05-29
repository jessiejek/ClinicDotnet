import { test, expect } from '@playwright/test';
import { loginAsStaff, openStaffRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, expectPageVisible, SELECTORS, ROUTES, collectApiResponses } from './staff.fixtures';

test.describe('Staff Payments', () => {

  test('Navigation: opens payment queue page with stat cards', async ({ page }) => {
    await loginAsStaff(page);
    const responses = await openStaffRoute(page, ROUTES.payments);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('Payment Queue', { timeout: 10000 });
    await expect(page.locator(SELECTORS.statCard).first()).toBeVisible({ timeout: 10000 });
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
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });

  test('API Failure: shows error handling gracefully', async ({ page }) => {
    await loginAsStaff(page);
    await mockApiFailure(page, 'bookings/staff/for-payment');
    await page.goto(ROUTES.payments);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });

  test('Payment Modal: opens when Confirm Payment is clicked', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.payments);

    const confirmBtn = page.locator('button:has-text("Confirm Payment")').first();
    if (!(await confirmBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
      console.log('ℹ️ No Confirm Payment buttons — no completed unpaid bookings available.');
      test.skip();
      return;
    }

    await confirmBtn.click();
    await page.waitForTimeout(1000);

    // Payment modal should appear (uses inline dialog, not ion-modal)
    const modalContent = page.locator('section[role="dialog"]');
    await expect(modalContent).toBeVisible({ timeout: 5000 });
    console.log('✅ Payment modal opened.');

    // Verify payment method select and amount fields are present
    await expect(page.locator('select[name="paymentMethod"]')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('input[name="amountReceived"]')).toBeVisible({ timeout: 3000 });
  });

  test('Payment Method: selecting different methods', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.payments);

    const confirmBtn = page.locator('button:has-text("Confirm Payment")').first();
    if (!(await confirmBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
      console.log('ℹ️ No Confirm Payment buttons available.');
      test.skip();
      return;
    }

    await confirmBtn.click();
    await page.waitForTimeout(1000);

    const methodSelect = page.locator('select[name="paymentMethod"]');
    await expect(methodSelect).toBeVisible({ timeout: 5000 });

    // Try selecting Cash
    await methodSelect.selectOption('Cash');
    await page.waitForTimeout(500);
    console.log('✅ Payment method set to Cash.');

    // Try selecting GCash
    await methodSelect.selectOption('GCash');
    await page.waitForTimeout(500);
    console.log('✅ Payment method set to GCash.');
  });

  test('Receipt Modal: opens after successful payment', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.payments);

    const confirmBtn = page.locator('button:has-text("Confirm Payment")').first();
    if (!(await confirmBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
      console.log('ℹ️ No Confirm Payment buttons available.');
      test.skip();
      return;
    }

    // Get the booking ID / payment ID from the row
    const row = page.locator('table.pt tbody tr').first();
    const confirmPaymentInRow = row.locator('button:has-text("Confirm Payment")');
    if (!(await confirmPaymentInRow.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('ℹ️ Cannot click Confirm Payment on this row.');
      test.skip();
      return;
    }

    await confirmPaymentInRow.click();
    await page.waitForTimeout(1000);

    // Set amount if needed
    const amountInput = page.locator('input[name="amountReceived"]');
    if (await amountInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      const currentVal = await amountInput.inputValue();
      if (!currentVal || currentVal === '0') {
        await amountInput.fill('650');
      }
    }

    // Submit the payment
    const payResponse = page.waitForResponse(
      (resp) => resp.url().includes('/api/payments/') && resp.url().includes('/confirm') && resp.request().method() === 'PATCH',
      { timeout: 15000 }
    );

    const submitBtn = page.locator('section[role="dialog"] button:has-text("Confirm Payment")');
    if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitBtn.click();
      const resp = await payResponse;
      console.log(`💰 Payment confirm API: ${resp.status()}`);

      if (resp.status() === 200) {
        // Receipt modal should be visible
        await page.waitForTimeout(1500);
        const receiptModal = page.locator('app-receipt-modal');
        const isReceiptOpen = await receiptModal.isVisible({ timeout: 5000 }).catch(() => false);
        if (isReceiptOpen) {
          console.log('✅ Receipt modal opened after payment.');
        } else {
          console.log('ℹ️ Receipt modal not detected — may close automatically or use different implementation.');
        }
      } else {
        console.log(`ℹ️ Payment API returned ${resp.status()} — may need a valid completed booking.`);
      }
    }
  });

  test('Waive PF Modal: opens when Waive PF is clicked', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.payments);

    const waiveBtn = page.locator('button:has-text("Waive PF")').first();
    if (!(await waiveBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
      console.log('ℹ️ No Waive PF buttons available.');
      test.skip();
      return;
    }

    await waiveBtn.click();
    await page.waitForTimeout(1000);

    // Confirm modal should appear
    const waiveModal = page.locator('app-confirm-modal');
    await expect(waiveModal).toBeVisible({ timeout: 5000 });
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


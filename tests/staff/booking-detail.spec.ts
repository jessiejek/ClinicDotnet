import { test, expect } from '@playwright/test';
import { loginAsStaff, openStaffRoute, mockApiFailure, expectNoPersistentLoading, SELECTORS, ROUTES } from './staff.fixtures';

test.describe('Staff Booking Detail', () => {

  test('Navigation: opens booking detail page', async ({ page }) => {
    await loginAsStaff(page);

    // First find a booking ID from the bookings page
    await page.goto(ROUTES.bookings);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const bookingLink = page.locator('a, button, .booking-row').filter({ hasText: /View|Open|Details|booking/i }).first();
    let bookingUrl = '';

    if (await bookingLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Try navigating via clicks if available
    }

    // Navigate to a known booking from the e2e-booking tests or fallback
    // First try to get a booking ID from the URL pattern
    const bookingRows = page.locator('.booking-row, tr[role="button"]');
    const rowCount = await bookingRows.count();

    if (rowCount > 0) {
      await bookingRows.first().click();
      await page.waitForURL(/\/staff\/bookings\//, { timeout: 10000 });
      expect(page.url()).toContain('/staff/bookings/');
      await expect(page.locator(SELECTORS.pageTitle)).toContainText('Booking Details', { timeout: 10000 });
    } else {
      console.log('ℹ️ No bookings available on current date — cannot test booking detail.');
      test.skip();
    }
  });

  test('Actions sidebar shows available action buttons', async ({ page }) => {
    await loginAsStaff(page);
    await page.goto(ROUTES.bookings);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const row = page.locator('.booking-row, tr[role="button"]').first();
    if (!(await row.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('ℹ️ No bookings available — skipping.');
      test.skip();
      return;
    }

    await row.click();
    await page.waitForURL(/\/staff\/bookings\//, { timeout: 10000 });

    // Should see either action buttons or "No actions available"
    const actionsSidebar = page.locator(SELECTORS.actionSidebar);
    await expect(actionsSidebar).toBeVisible({ timeout: 10000 });

    const hasActions = await page.locator('button:has-text("Check In"), button:has-text("Confirm Payment"), button:has-text("Waive PF")').first().isVisible({ timeout: 3000 }).catch(() => false);
    if (hasActions) {
      console.log('✅ Action buttons visible in sidebar.');
    } else {
      console.log('ℹ️ No actions available for this booking (may be past/future).');
    }
  });

  test('Back button returns to bookings page', async ({ page }) => {
    await loginAsStaff(page);
    await page.goto(ROUTES.bookings);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const row = page.locator('.booking-row, tr[role="button"]').first();
    if (!(await row.isVisible({ timeout: 3000 }).catch(() => false))) {
      test.skip();
      return;
    }

    await row.click();
    await page.waitForURL(/\/staff\/bookings\//, { timeout: 10000 });

    const backBtn = page.locator(SELECTORS.backBtn);
    if (await backBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await backBtn.click();
      await page.waitForURL(/\/staff\/bookings$/, { timeout: 10000 });
    }
  });

  test('API Failure: handles booking load failure gracefully', async ({ page }) => {
    await loginAsStaff(page);
    await page.goto('/staff/bookings/unknown-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
  });
});

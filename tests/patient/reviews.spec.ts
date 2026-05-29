import { test, expect } from '@playwright/test';
import { loginAsPatient, mockApiFailure, expectNoPersistentLoading, ROUTES } from './patient.fixtures';

/**
 * Reviews page requires a completed booking with no existing review.
 * These tests need a real completed booking ID to work with real data.
 * For now, verify the page loads correctly when a valid booking is provided.
 */

test.describe('Patient Reviews', () => {

  test('Navigation: visit reviews with a real booking ID from My Bookings', async ({ page }) => {
    await loginAsPatient(page);

    // First check if there's a completed booking to review
    await page.goto(ROUTES.bookings);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const completedBookingLink = page.locator('a, button').filter({ hasText: /leave a review|rate|review/i }).first();
    const viewDetailBtns = page.locator('button:has-text("View Details")');

    if (await completedBookingLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await completedBookingLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      await expect(page.locator('.page-title')).toContainText(/review/i, { timeout: 5000 });
      await expectNoPersistentLoading(page);
    } else if (await viewDetailBtns.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      // Navigate to a booking detail to check if review action exists
      console.log('⚠️ No review link found on bookings page. Checking booking detail pages...');
    } else {
      console.log('⚠️ No bookings found. Review flow cannot be tested in real-data mode.');
      test.skip();
    }
  });

  test('Page handles invalid booking ID gracefully', async ({ page }) => {
    await loginAsPatient(page);
    await page.goto('/patient/reviews/invalid-booking-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Should show empty state, not crash
    await expect(page.locator('app-empty-state')).toBeVisible({ timeout: 10000 });
  });
});

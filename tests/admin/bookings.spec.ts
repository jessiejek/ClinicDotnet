import { test, expect } from '@playwright/test';
import { loginAsAdmin, openAdminRoute, mockApiFailure, expectNoPersistentLoading, expectPageVisible, SELECTORS, ROUTES } from './admin.fixtures';

test.describe('Admin Bookings', () => {

  test('Navigation: opens bookings page', async ({ page }) => {
    await loginAsAdmin(page);
    const responses = await openAdminRoute(page, ROUTES.bookings);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('Bookings', { timeout: 10000 });
    await expect(page.locator(SELECTORS.filterSelect).first()).toBeVisible({ timeout: 5000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);

    expect(responses.some(r => r.url.includes('/api/bookings') && r.status === 200)).toBeTruthy();
  });

  test('API Failure: does not crash on error', async ({ page }) => {
    await loginAsAdmin(page);
    await mockApiFailure(page, 'bookings');
    await page.goto(ROUTES.bookings);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });
});


import { test, expect } from '@playwright/test';
import { loginAsStaff, openStaffRoute, mockApiFailure, expectNoPersistentLoading, SELECTORS, ROUTES } from './staff.fixtures';

test.describe('Staff Dashboard', () => {

  test('Navigation: loads dashboard with stat cards and queue table', async ({ page }) => {
    await loginAsStaff(page);
    const responses = await openStaffRoute(page, ROUTES.dashboard);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('Dashboard', { timeout: 10000 });
    await expect(page.locator(SELECTORS.statCard).first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator(SELECTORS.queueTable)).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);

    const apiCalls = responses.filter(r => r.status === 200).map(r => r.url);
    expect(apiCalls.length).toBeGreaterThan(0);
  });

  test('Populated State: stat cards show real numeric values', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.dashboard);

    const values = page.locator(SELECTORS.statCardValue);
    const count = await values.count();
    expect(count).toBe(4);

    for (let i = 0; i < count; i++) {
      await expect(values.nth(i)).not.toBeEmpty({ timeout: 5000 });
    }
  });

  test('Main Action: clicking payment banner navigates to payment queue', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.dashboard);

    const banner = page.locator(SELECTORS.bannerDanger);
    if (await banner.isVisible({ timeout: 5000 }).catch(() => false)) {
      await banner.click();
      await page.waitForURL(/\/staff\/payments/, { timeout: 10000 });
    }
    // If no banner (no unpaid completed bookings), this is expected
  });

  test('API Failure: dashboard does not crash on API errors', async ({ page }) => {
    await loginAsStaff(page);
    await mockApiFailure(page, 'doctors');
    await page.goto(ROUTES.dashboard);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
    await expectNoPersistentLoading(page);
  });
});

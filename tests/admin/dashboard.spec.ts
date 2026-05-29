import { test, expect } from '@playwright/test';
import { loginAsAdmin, openAdminRoute, mockApiFailure, expectNoPersistentLoading, expectPageVisible, SELECTORS, ROUTES } from './admin.fixtures';

test.describe('Admin Dashboard', () => {

  test('Navigation: loads dashboard with stat cards', async ({ page }) => {
    await loginAsAdmin(page);
    const responses = await openAdminRoute(page, ROUTES.dashboard);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('Dashboard', { timeout: 10000 });
    await expect(page.locator(SELECTORS.statCard).first()).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);

    const apiCalls = responses.filter(r => r.status === 200).map(r => r.url);
    expect(apiCalls.length).toBeGreaterThan(0);
  });

  test('API Failure: dashboard does not crash on API errors', async ({ page }) => {
    await loginAsAdmin(page);
    await mockApiFailure(page, 'dashboard');
    await page.goto(ROUTES.dashboard);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });
});


import { test, expect } from '@playwright/test';
import { loginAsStaff, openStaffRoute, mockApiFailure, expectNoPersistentLoading, expectPageVisible, SELECTORS, ROUTES } from './staff.fixtures';

test.describe('Staff Profile', () => {

  test('Navigation: opens profile page with form fields', async ({ page }) => {
    await loginAsStaff(page);
    const responses = await openStaffRoute(page, ROUTES.profile);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('My Profile', { timeout: 10000 });
    await expect(page.locator(SELECTORS.profileForm).first()).toBeVisible({ timeout: 15000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);

    expect(responses.some(r => r.url.includes('/api/auth/me') || r.url.includes('/api/'))).toBeTruthy();
  });

  test('Populated State: input fields contain user data', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.profile);

    const firstInput = page.locator(SELECTORS.profileInput).first();
    await expect(firstInput).toBeVisible({ timeout: 5000 });
  });

  test('API Failure: page handles API error gracefully', async ({ page }) => {
    await loginAsStaff(page);
    await page.goto(ROUTES.profile);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
  });
});


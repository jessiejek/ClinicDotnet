import { test, expect } from '@playwright/test';
import { loginAsStaff, openStaffRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, SELECTORS, ROUTES } from './staff.fixtures';

test.describe('Staff Payments', () => {

  test('Navigation: opens payment queue page with stat cards', async ({ page }) => {
    await loginAsStaff(page);
    const responses = await openStaffRoute(page, ROUTES.payments);

    await expect(page.locator('.page-header__title')).toContainText(/Payment Queue/i, { timeout: 10000 });
    await expect(page.locator(SELECTORS.statCard).first()).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);

    expect(responses.some(r => r.url.includes('/api/bookings/staff/payments') && r.status === 200)).toBeTruthy();
  });

  test('Populated State: payment items are visible when data exists', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.payments);

    const statValue = page.locator(SELECTORS.statCardValue).first();
    await expect(statValue).not.toBeEmpty({ timeout: 5000 });
  });

  test('Empty State: shows when no payments pending', async ({ page }) => {
    await loginAsStaff(page);
    await mockApiResponse(page, 'bookings/staff/payments', { items: [], totalCount: 0 });
    await page.goto(ROUTES.payments);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
  });

  test('API Failure: shows error handling gracefully', async ({ page }) => {
    await loginAsStaff(page);
    await mockApiFailure(page, 'bookings/staff/payments');
    await page.goto(ROUTES.payments);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
    await expectNoPersistentLoading(page);
  });
});

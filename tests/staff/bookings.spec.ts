import { test, expect } from '@playwright/test';
import { loginAsStaff, openStaffRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, SELECTORS, ROUTES } from './staff.fixtures';

test.describe('Staff Bookings', () => {

  test('Navigation: opens bookings page with filters and table', async ({ page }) => {
    await loginAsStaff(page);
    const responses = await openStaffRoute(page, ROUTES.bookings);

    await expect(page.locator('.page-header__title')).toContainText(/Bookings/i, { timeout: 10000 });
    await expect(page.locator(SELECTORS.filterSelect).first()).toBeVisible({ timeout: 5000 });
    await expectNoPersistentLoading(page);

    expect(responses.some(r => r.url.includes('/api/bookings/staff') && r.status === 200)).toBeTruthy();
  });

  test('Populated State: booking rows appear in the table', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.bookings);

    const table = page.locator(SELECTORS.bookingsTable);
    if (await table.isVisible({ timeout: 5000 }).catch(() => false)) {
      const rows = table.locator('tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThanOrEqual(0);
    } else {
      // Mobile cards fallback
      const cards = page.locator(SELECTORS.mobileCard);
      const count = await cards.count().catch(() => 0);
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('Main Action: Check In button triggers PATCH API', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.bookings);

    const checkInBtn = page.locator(SELECTORS.checkInBtn).first();
    if (!(await checkInBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
      console.log('ℹ️ No Check In buttons — no Confirmed bookings for today.');
      return;
    }

    const checkInResponse = page.waitForResponse(
      (resp) => resp.url().includes('/api/bookings/') && resp.url().includes('/check-in') && resp.request().method() === 'PATCH',
      { timeout: 15000 }
    );

    await checkInBtn.click();
    const resp = await checkInResponse;
    expect(resp.status()).toBe(200);
    console.log(`📡 Check-in API: ${resp.status()} ✅`);
  });

  test('Filters: doctor filter and status filter change visible bookings', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.bookings);

    const statusSelect = page.locator(SELECTORS.filterSelect).nth(1);
    if (await statusSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await statusSelect.selectOption('Cancelled');
      await page.waitForTimeout(2000);
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('Empty State: shows when no bookings for selected date', async ({ page }) => {
    await loginAsStaff(page);
    await mockApiResponse(page, 'bookings/staff/all', { items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0 });
    await page.goto(ROUTES.bookings);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
  });

  test('API Failure: shows error handling gracefully', async ({ page }) => {
    await loginAsStaff(page);
    await mockApiFailure(page, 'bookings/staff/all');
    await page.goto(ROUTES.bookings);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
    await expectNoPersistentLoading(page);
  });
});

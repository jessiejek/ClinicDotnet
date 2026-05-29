import { test, expect } from '@playwright/test';
import { loginAsStaff, openStaffRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, SELECTORS, ROUTES } from './staff.fixtures';

test.describe('Staff Doctor Status', () => {

  test('Navigation: opens doctor status page with stat cards', async ({ page }) => {
    await loginAsStaff(page);
    const responses = await openStaffRoute(page, ROUTES.doctorStatus);

    await expect(page.locator('.page-header__title')).toContainText(/Doctor Availability/i, { timeout: 10000 });
    await expect(page.locator(SELECTORS.doctorStatusCard).first()).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);

    expect(responses.some(r => r.url.includes('/api/doctors') && r.status === 200)).toBeTruthy();
  });

  test('Populated State: doctor cards display real doctor data', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.doctorStatus);

    const cards = page.locator(SELECTORS.doctorStatusCard);
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Empty State: shows message when no doctors', async ({ page }) => {
    await loginAsStaff(page);
    await mockApiResponse(page, 'doctors', []);
    await page.goto(ROUTES.doctorStatus);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
  });

  test('API Failure: shows error block with Retry', async ({ page }) => {
    await loginAsStaff(page);
    await mockApiFailure(page, 'doctors');
    await page.goto(ROUTES.doctorStatus);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.errorBlock)).toBeVisible({ timeout: 10000 });
    await expect(page.locator(SELECTORS.retryBtn)).toBeVisible({ timeout: 3000 });
    await expectNoPersistentLoading(page);
  });
});

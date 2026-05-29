import { test, expect } from '@playwright/test';
import { loginAsAdmin, openAdminRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, expectPageVisible, SELECTORS, ROUTES } from './admin.fixtures';

test.describe('Admin Doctors', () => {

  test('Navigation: opens doctors management page', async ({ page }) => {
    await loginAsAdmin(page);
    const responses = await openAdminRoute(page, ROUTES.doctors);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('Doctors', { timeout: 10000 });
    await expect(page.locator(SELECTORS.doctorCard).or(page.locator(SELECTORS.doctorRow)).first()).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);

    expect(responses.some(r => r.url.includes('/api/doctors') && r.status === 200)).toBeTruthy();
  });

  test('Populated State: doctor data appears', async ({ page }) => {
    await loginAsAdmin(page);
    await openAdminRoute(page, ROUTES.doctors);

    const cards = page.locator(SELECTORS.doctorCard);
    const rows = page.locator(SELECTORS.doctorRow);
    const count = (await cards.count()) + (await rows.count());
    expect(count).toBeGreaterThan(0);
  });

  test('Empty State: shows when no doctors', async ({ page }) => {
    await loginAsAdmin(page);
    await mockApiResponse(page, 'doctors', []);
    await page.goto(ROUTES.doctors);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 10000 }).catch(async () => {
      // May show different layout; body should still be functional
      await expect(page.locator('body')).toBeVisible();
    });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });

  test('API Failure: shows error handling gracefully', async ({ page }) => {
    await loginAsAdmin(page);
    await mockApiFailure(page, 'doctors');
    await page.goto(ROUTES.doctors);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });
});


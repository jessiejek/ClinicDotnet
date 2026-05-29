import { test, expect } from '@playwright/test';
import { loginAsAdmin, openAdminRoute, mockApiFailure, expectNoPersistentLoading, expectPageVisible, SELECTORS, ROUTES } from './admin.fixtures';

test.describe('Admin Patients', () => {

  test('Navigation: opens patients page', async ({ page }) => {
    await loginAsAdmin(page);
    const responses = await openAdminRoute(page, ROUTES.patients);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('Patients', { timeout: 10000 });
    await expect(page.locator(SELECTORS.patientsTable).or(page.locator(SELECTORS.searchInput)).first()).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);

    const apiHit = responses.some(r => r.url.includes('/api/patients') && r.status === 200);
    if (!apiHit) {
      console.log('Patients API call not detected.');
    }
  });

  test('API Failure: does not crash on error', async ({ page }) => {
    await loginAsAdmin(page);
    await mockApiFailure(page, 'patients');
    await page.goto(ROUTES.patients);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });
});


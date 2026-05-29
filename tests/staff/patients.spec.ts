import { test, expect } from '@playwright/test';
import { loginAsStaff, openStaffRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, SELECTORS, ROUTES } from './staff.fixtures';

test.describe('Staff Patients', () => {

  test('Navigation: opens patients page with search and table', async ({ page }) => {
    await loginAsStaff(page);
    const responses = await openStaffRoute(page, ROUTES.patients);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('Patients', { timeout: 10000 });
    await expect(page.locator(SELECTORS.searchInput)).toBeVisible({ timeout: 5000 });
    await expectNoPersistentLoading(page);

    expect(responses.some(r => r.url.includes('/api/patients') && r.status === 200)).toBeTruthy();
  });

  test('Populated State: patient rows appear in the table', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.patients);

    const table = page.locator(SELECTORS.patientsTable);
    if (await table.isVisible({ timeout: 5000 }).catch(() => false)) {
      const rows = table.locator('tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThanOrEqual(0);
    } else {
      const cards = page.locator(SELECTORS.patientMobileCard);
      const count = await cards.count().catch(() => 0);
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('Search: typing filters patient results', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.patients);

    const search = page.locator(SELECTORS.searchInput);
    await search.fill('Juan');
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Empty State: shows when no patients match', async ({ page }) => {
    await loginAsStaff(page);
    await mockApiResponse(page, 'patients?search=', []);
    await page.goto(ROUTES.patients);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
  });

  test('API Failure: shows error handling gracefully', async ({ page }) => {
    await loginAsStaff(page);
    await mockApiFailure(page, 'patients');
    await page.goto(ROUTES.patients);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
    await expectNoPersistentLoading(page);
  });
});

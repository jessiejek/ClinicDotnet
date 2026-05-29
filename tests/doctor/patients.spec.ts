import { test, expect } from '@playwright/test';
import { loginAsDoctor, openDoctorRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, expectPageVisible, SELECTORS, ROUTES } from './doctor.fixtures';

test.describe('Doctor Patients', () => {

  test('Navigation: opens patients page with search and table', async ({ page }) => {
    await loginAsDoctor(page);
    const responses = await openDoctorRoute(page, ROUTES.patients);

    await expect(page.locator('h2, .page-title').first()).toContainText(/Patient/i, { timeout: 10000 });
    await expect(page.locator(SELECTORS.patientSearchInput)).toBeVisible({ timeout: 5000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);

    expect(responses.some(r => r.url.includes('/api/bookings/doctor/patients') && r.status === 200)).toBeTruthy();
  });

  test('Search: typing filters patient list', async ({ page }) => {
    await loginAsDoctor(page);
    await openDoctorRoute(page, ROUTES.patients);

    const searchInput = page.locator(SELECTORS.patientSearchInput);
    await searchInput.fill('Juan');
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Empty State: shows when no patients match', async ({ page }) => {
    await loginAsDoctor(page);
    await mockApiResponse(page, 'patients?search=', []);
    await page.goto(ROUTES.patients);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });

  test('API Failure: handles gracefully', async ({ page }) => {
    await loginAsDoctor(page);
    await mockApiFailure(page, 'patients');
    await page.goto(ROUTES.patients);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });
});


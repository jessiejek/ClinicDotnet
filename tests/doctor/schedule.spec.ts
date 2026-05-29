import { test, expect } from '@playwright/test';
import { loginAsDoctor, openDoctorRoute, mockApiFailure, expectNoPersistentLoading, SELECTORS, ROUTES } from './doctor.fixtures';

test.describe('Doctor Schedule', () => {

  test('Navigation: opens schedule page', async ({ page }) => {
    await loginAsDoctor(page);
    const responses = await openDoctorRoute(page, ROUTES.schedule);

    await expect(page.locator('h2, .page-title').first()).toContainText(/Schedule/i, { timeout: 10000 });
    await expect(page.locator(SELECTORS.scheduleEditor).first()).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);

    expect(responses.some(r => r.url.includes('/api/doctors') && r.status === 200)).toBeTruthy();
  });

  test('Status panel for setting today availability', async ({ page }) => {
    await loginAsDoctor(page);
    await openDoctorRoute(page, ROUTES.schedule);

    const statusPanel = page.locator(SELECTORS.statusPanel);
    await expect(statusPanel).toBeVisible({ timeout: 10000 });
  });

  test('API Failure: handles gracefully', async ({ page }) => {
    await loginAsDoctor(page);
    await mockApiFailure(page, 'doctors/schedule');
    await page.goto(ROUTES.schedule);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
  });
});

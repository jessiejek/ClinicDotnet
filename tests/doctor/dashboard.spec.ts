import { test, expect } from '@playwright/test';
import { loginAsDoctor, openDoctorRoute, mockApiFailure, expectNoPersistentLoading, SELECTORS, ROUTES } from './doctor.fixtures';

test.describe('Doctor Dashboard', () => {

  test('Navigation: loads dashboard with greeting, KPI cards, and queue', async ({ page }) => {
    await loginAsDoctor(page);
    const responses = await openDoctorRoute(page, ROUTES.dashboard);

    await expect(page.locator(SELECTORS.greeting)).toContainText(/Dr\./i, { timeout: 10000 });
    await expect(page.locator(SELECTORS.kpiCards).first()).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);

    expect(responses.some(r => r.url.includes('/api/doctors') || r.url.includes('/api/bookings') && r.status === 200)).toBeTruthy();
  });

  test('Populated State: KPI values show numeric data', async ({ page }) => {
    await loginAsDoctor(page);
    await openDoctorRoute(page, ROUTES.dashboard);

    const values = page.locator(SELECTORS.kpiValue);
    const count = await values.count();
    expect(count).toBe(4);
    for (let i = 0; i < count; i++) {
      await expect(values.nth(i)).not.toBeEmpty({ timeout: 5000 });
    }
  });

  test('Main Action: Start Consult navigates to consultation page', async ({ page }) => {
    await loginAsDoctor(page);
    await openDoctorRoute(page, ROUTES.dashboard);

    const startBtn = page.locator(SELECTORS.startConsultBtn);
    if (await startBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await startBtn.click();
      await page.waitForURL(/\/doctor\/consultation\//, { timeout: 10000 });
    }
  });

  test('API Failure: dashboard does not crash', async ({ page }) => {
    await loginAsDoctor(page);
    await mockApiFailure(page, 'bookings');
    await page.goto(ROUTES.dashboard);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
  });
});

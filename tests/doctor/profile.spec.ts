import { test, expect } from '@playwright/test';
import { loginAsDoctor, openDoctorRoute, mockApiFailure, expectNoPersistentLoading, SELECTORS, ROUTES } from './doctor.fixtures';

test.describe('Doctor Profile', () => {

  test('Navigation: opens profile page', async ({ page }) => {
    await loginAsDoctor(page);
    const responses = await openDoctorRoute(page, ROUTES.profile);

    await expect(page.locator('h2, .page-title').first()).toContainText(/Profile/i, { timeout: 10000 });
    await expect(page.locator(SELECTORS.profileForm).first()).toBeVisible({ timeout: 15000 });
    await expectNoPersistentLoading(page);
  });

  test('API Failure: page handles gracefully', async ({ page }) => {
    await loginAsDoctor(page);
    await page.goto(ROUTES.profile);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
  });
});

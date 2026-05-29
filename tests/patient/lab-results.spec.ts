import { test, expect } from '@playwright/test';
import { loginAsPatient, openPatientRoute, expectNoPersistentLoading, ROUTES } from './patient.fixtures';

test.describe('Patient Lab Results', () => {

  test('Navigation: opens lab results page', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.labResults);

    // PatientMediaPanel uses .patient-media-panel__title as heading
    await expect(page.locator('.patient-media-panel__title').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.patient-media-panel__title')).toContainText(/My Lab Results/i, { timeout: 5000 });
    await expectNoPersistentLoading(page);
  });

  test('Page renders without crash', async ({ page }) => {
    await loginAsPatient(page);
    await page.goto(ROUTES.labResults);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(0);
  });
});

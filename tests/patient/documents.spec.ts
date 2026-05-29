import { test, expect } from '@playwright/test';
import { loginAsPatient, openPatientRoute, expectNoPersistentLoading, SELECTORS, ROUTES } from './patient.fixtures';

test.describe('Patient Documents', () => {

  test('Navigation: opens documents page', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.documents);

    // PatientMediaPanel uses .patient-media-panel__title as heading
    await expect(page.locator('.patient-media-panel__title').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.patient-media-panel__title')).toContainText(/Uploaded Documents/i, { timeout: 5000 });
    await expectNoPersistentLoading(page);
  });

  test('Page renders without crashing', async ({ page }) => {
    await loginAsPatient(page);
    await page.goto(ROUTES.documents);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(0);
  });
});

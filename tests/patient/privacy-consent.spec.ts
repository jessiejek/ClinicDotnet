import { test, expect } from '@playwright/test';
import { loginAsPatient, openPatientRoute, mockApiFailure, expectNoPersistentLoading, SELECTORS, ROUTES } from './patient.fixtures';

test.describe('Patient Privacy Consent', () => {

  test('Navigation: opens privacy consent page', async ({ page }) => {
    await loginAsPatient(page);
    const responses = await openPatientRoute(page, ROUTES.privacyConsent);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('Privacy Consent', { timeout: 10000 });
    await expect(page.locator(SELECTORS.consentCheckbox)).toBeVisible({ timeout: 5000 });
    await expectNoPersistentLoading(page);

    expect(responses.some(r => r.url.includes('/api/patients/me') && r.status === 200)).toBeTruthy();
  });

  test('Consent flow: checkbox enables Accept button', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.privacyConsent);

    const checkbox = page.locator(SELECTORS.consentCheckbox);
    await expect(checkbox).toBeVisible({ timeout: 5000 });

    // Check the box
    await checkbox.click();
    await page.waitForTimeout(500);

    // Accept button should not be disabled
    const acceptBtn = page.getByRole('button', { name: /accept consent/i });
    await expect(acceptBtn).toBeEnabled({ timeout: 3000 });
  });
});

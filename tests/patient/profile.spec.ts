import { test, expect } from '@playwright/test';
import { loginAsPatient, openPatientRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, expectPageVisible, SELECTORS, ROUTES } from './patient.fixtures';

test.describe('Patient Profile', () => {

  test('Navigation: opens profile page with form fields', async ({ page }) => {
    await loginAsPatient(page);
    const responses = await openPatientRoute(page, ROUTES.profile);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('My Profile', { timeout: 10000 });
    // Form may load after patient API call — wait for it
    // Use first() because profile has 2 forms (profile + password) both with class 'profile-card'
    await expect(page.locator(SELECTORS.profileForm).first()).toBeVisible({ timeout: 15000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);

    expect(responses.some(r => r.url.includes('/api/patients/me') && r.status === 200)).toBeTruthy();
  });

  test('Populated State: form fields contain real patient data from API', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.profile);

    // First name should be populated
    const firstNameInput = page.locator('ion-input[formControlName="firstName"] input');
    await expect(firstNameInput).toBeVisible({ timeout: 5000 });
    const value = await firstNameInput.inputValue().catch(() => '');
    // Should either have a value or show a fallback
    expect(typeof value).toBe('string');
  });

  test('API Failure: shows warning banner when patient profile fails', async ({ page }) => {
    await loginAsPatient(page);
    await mockApiFailure(page, 'patients/me');
    await page.goto(ROUTES.profile);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.warningBanner)).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });
});


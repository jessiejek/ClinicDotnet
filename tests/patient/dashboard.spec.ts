import { test, expect } from '@playwright/test';
import { loginAsPatient, openPatientRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, SELECTORS, ROUTES } from './patient.fixtures';

test.describe('Patient Dashboard', () => {

  test('Navigation: loads dashboard with stats, doctors, and greeting', async ({ page }) => {
    await loginAsPatient(page);
    const responses = await openPatientRoute(page, ROUTES.dashboard);

    // Title
    await expect(page.locator(SELECTORS.pageTitle)).toContainText(/Welcome/i, { timeout: 10000 });
    // Stats cards present
    await expect(page.locator(SELECTORS.statCard).first()).toBeVisible({ timeout: 10000 });
    // Doctors section
    await expect(page.locator(SELECTORS.nearbyDoctors).first()).toBeVisible({ timeout: 10000 }).catch(async () => {
      // Might show empty state instead if no doctors
      await expect(page.locator(SELECTORS.emptyState).first()).toBeVisible({ timeout: 5000 });
    });
    // Loading not stuck
    await expectNoPersistentLoading(page);
    // API evidence
    const apiCalls = responses.filter(r => r.status === 200).map(r => r.url);
    expect(apiCalls.some(url => url.includes('/api/patients/me'))).toBeTruthy();
    expect(apiCalls.length).toBeGreaterThan(0);
  });

  test('Populated State: stats show real values from API', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.dashboard);

    // Stats cards should show numeric values (not blank/spinners)
    const statValues = page.locator(SELECTORS.statCardValue);
    const count = await statValues.count();
    expect(count).toBe(4);

    for (let i = 0; i < count; i++) {
      await expect(statValues.nth(i)).not.toBeEmpty({ timeout: 5000 });
    }
  });

  test('Main Action: Book Appointment button redirects to patient/doctors', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.dashboard);

    const bookBtn = page.getByRole('button', { name: /book appointment/i });
    await expect(bookBtn).toBeVisible({ timeout: 5000 });
    await bookBtn.click();
    await page.waitForURL(/\/patient\/doctors/, { timeout: 10000 });
  });

  test('API Failure: dashboard does not crash on API errors', async ({ page }) => {
    await loginAsPatient(page);
    // Break a non-critical API endpoint
    await mockApiFailure(page, 'doctors');
    await page.goto(ROUTES.dashboard);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Page should not crash — should show whatever loaded
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
    await expectNoPersistentLoading(page);
  });
});

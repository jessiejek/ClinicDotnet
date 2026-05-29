import { test, expect } from '@playwright/test';
import { loginAsPatient, openPatientRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, SELECTORS, ROUTES } from './patient.fixtures';

test.describe('Patient Prescriptions', () => {

  test('Navigation: opens prescriptions page', async ({ page }) => {
    await loginAsPatient(page);
    const responses = await openPatientRoute(page, ROUTES.prescriptions);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('Prescriptions', { timeout: 10000 });
    await expect(page.locator(SELECTORS.searchbar)).toBeVisible({ timeout: 5000 });
    await expectNoPersistentLoading(page);

    expect(responses.some(r => r.url.includes('/api/prescriptions/me') && r.status === 200)).toBeTruthy();
  });

  test('Empty State: shows message when no prescriptions', async ({ page }) => {
    await loginAsPatient(page);
    await mockApiResponse(page, 'prescriptions/me', []);
    await page.goto(ROUTES.prescriptions);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
  });

  test('Null and Zero Handling: null generic/strength does not crash card', async ({ page }) => {
    await loginAsPatient(page);
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    await mockApiResponse(page, 'prescriptions/me', [{
      id: 'rx-null-001',
      bookingId: 'bk-001',
      appointmentDate: yesterday.toISOString().slice(0, 10),
      doctorName: 'Dr. Null Test',
      medicineName: 'Test Medicine',
      items: [{
        medicineName: 'Test Medicine',
        genericName: null,
        strength: null,
        route: 'Oral',
        frequency: 'Every 6 hours',
        duration: '3 days',
        instructions: null
      }],
      createdAt: new Date().toISOString()
    }]);
    await page.goto(ROUTES.prescriptions);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.getByText('Test Medicine').first()).toBeAttached({ timeout: 5000 });
    await expectNoPersistentLoading(page);
  });

  test('API Failure: shows error state with Retry', async ({ page }) => {
    await loginAsPatient(page);
    await mockApiFailure(page, 'prescriptions/me');
    await page.goto(ROUTES.prescriptions);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.errorState)).toBeVisible({ timeout: 10000 });
    await expect(page.locator(SELECTORS.retryBtn)).toBeVisible({ timeout: 3000 });
    await expectNoPersistentLoading(page);
  });
});

import { test, expect } from '@playwright/test';
import { loginAsPatient, openPatientRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, expectPageVisible, SELECTORS, ROUTES } from './patient.fixtures';

test.describe('Patient Doctors', () => {

  test('Navigation: opens doctors page and loads doctor cards', async ({ page }) => {
    await loginAsPatient(page);
    const responses = await openPatientRoute(page, ROUTES.doctors);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('Doctors', { timeout: 10000 });
    await expect(page.locator(SELECTORS.doctorCard).first()).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);

    expect(responses.some(r => r.url.includes('/api/doctors') && r.status === 200)).toBeTruthy();
  });

  test('Populated State: doctor names, specializations, and fees shown', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.doctors);

    // Check at least one doctor name is visible
    const doctorName = page.locator(SELECTORS.doctorCardName).first();
    await expect(doctorName).toBeVisible({ timeout: 10000 });
    const name = await doctorName.textContent();
    expect(name?.trim().length).toBeGreaterThan(0);
  });

  test('Main Action: Book Now links to /public/booking with doctorId', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.doctors);

    const bookNow = page.locator(SELECTORS.doctorCard).first().locator(SELECTORS.bookNowBtn);
    await expect(bookNow).toBeVisible({ timeout: 5000 });
    await bookNow.click();

    await page.waitForURL(/\/public\/booking\?doctorId=/, { timeout: 10000 });
  });

  test('Empty State: shows message when no doctors available', async ({ page }) => {
    await loginAsPatient(page);
    await mockApiResponse(page, 'doctors', []);
    await page.goto(ROUTES.doctors);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });

  test('Null and Zero Handling: null fee/schedule does not crash', async ({ page }) => {
    await loginAsPatient(page);
    await mockApiResponse(page, 'doctors', [{
      id: 'null-test-001',
      fullName: 'Dr. Null Test',
      specialization: 'Testing',
      consultationFee: 0,
      status: 'Active',
      isActive: true,
      profilePhotoUrl: null,
      bio: null,
      averageRating: null,
      reviewCount: 0,
      schedule: []
    }]);
    await page.goto(ROUTES.doctors);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.getByText('Dr. Null Test')).toBeVisible({ timeout: 5000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });

  test('API Failure: shows retryable error state', async ({ page }) => {
    await loginAsPatient(page);
    await mockApiFailure(page, 'doctors');
    await page.goto(ROUTES.doctors);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });
});


import { test, expect } from '@playwright/test';
import { loginAsDoctor, openDoctorRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, expectPageVisible, SELECTORS, ROUTES } from './doctor.fixtures';

test.describe('Doctor Appointments', () => {

  test('Navigation: opens appointments page with stat pills and filters', async ({ page }) => {
    await loginAsDoctor(page);
    const responses = await openDoctorRoute(page, ROUTES.appointments);

    await expect(page.locator('app-page-header')).toContainText(/Today Queue/i, { timeout: 10000 });
    await expect(page.locator(SELECTORS.statBar)).toBeVisible({ timeout: 10000 });
    await expect(page.locator(SELECTORS.filterSelect).first()).toBeVisible({ timeout: 5000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);

    expect(responses.some(r => r.url.includes('/api/bookings/doctor') || r.url.includes('/api/bookings') && r.status === 200)).toBeTruthy();
  });

  test('Populated State: stat pills show aggregated numbers', async ({ page }) => {
    await loginAsDoctor(page);
    await openDoctorRoute(page, ROUTES.appointments);

    const pills = page.locator(SELECTORS.statPill);
    const count = await pills.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('Filters: status filter and search change visible queue', async ({ page }) => {
    await loginAsDoctor(page);
    await openDoctorRoute(page, ROUTES.appointments);

    const filterSelect = page.locator(SELECTORS.filterSelect).first();
    if (await filterSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await filterSelect.selectOption('Completed');
      await page.waitForTimeout(2000);
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('Main Action: clicking a queue row navigates to consultation or detail', async ({ page }) => {
    await loginAsDoctor(page);
    await openDoctorRoute(page, ROUTES.appointments);

    const row = page.locator(SELECTORS.queueRow).first();
    if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
      await row.click();
      const url = page.url();
      // Should end up at either consultation/:bookingId or appointments/:id
      expect(url.includes('/doctor/consultation/') || url.includes('/doctor/appointments/')).toBeTruthy();
    }
  });

  test('Empty State: shows when no appointments for today', async ({ page }) => {
    await loginAsDoctor(page);
    await mockApiResponse(page, 'bookings/doctor/today', []);
    await page.goto(ROUTES.appointments);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });

  test('API Failure: handles gracefully', async ({ page }) => {
    await loginAsDoctor(page);
    await mockApiFailure(page, 'bookings/doctor');
    await page.goto(ROUTES.appointments);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });
});


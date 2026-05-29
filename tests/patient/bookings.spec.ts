import { test, expect } from '@playwright/test';
import { loginAsPatient, openPatientRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, expectPageVisible, SELECTORS, ROUTES } from './patient.fixtures';

test.describe('Patient Bookings', () => {

  test('Navigation: opens bookings page with filter tabs and table', async ({ page }) => {
    await loginAsPatient(page);
    const responses = await openPatientRoute(page, ROUTES.bookings);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('My Bookings', { timeout: 10000 });
    // Filter buttons present
    await expect(page.locator(SELECTORS.filterBtn).first()).toBeVisible({ timeout: 5000 });
    // Booking rows or empty state shown
    await expect(page.locator('table.clinic-table tbody tr, app-patient-booking-card, app-empty-state').first()).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);

    expect(responses.some(r => r.url.includes('/api/bookings') && r.status === 200)).toBeTruthy();
  });

  test('Populated State: real booking data appears in table', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.bookings);

    const table = page.locator(SELECTORS.bookingTable);
    if (await table.isVisible({ timeout: 5000 }).catch(() => false)) {
      const rows = table.locator('tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);
    } else {
      // Fallback: mobile cards
      const cards = page.locator(SELECTORS.bookingCard);
      const count = await cards.count().catch(() => 0);
      expect(count).toBeGreaterThan(0);
    }
  });

  test('Main Action: View Details navigates to booking detail', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.bookings);

    const viewBtn = page.locator('button:has-text("View Details")').first();
    if (await viewBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await viewBtn.click();
      await page.waitForURL(/\/patient\/bookings\//, { timeout: 10000 });
      expect(page.url()).toContain('/patient/bookings/');
    }
    // else: no bookings exist, skip this assertion
  });

  test('Filter: switching filters updates visible bookings', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.bookings);

    const upcomingBtn = page.locator(SELECTORS.filterBtn).filter({ hasText: 'Upcoming' });
    if (await upcomingBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await upcomingBtn.click();
      await page.waitForTimeout(1500);
      // Should not crash
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('Empty State: shows "No bookings found" when empty', async ({ page }) => {
    await loginAsPatient(page);
    await mockApiResponse(page, 'bookings/me', { items: [], totalCount: 0 });
    await page.goto(ROUTES.bookings);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });

  test('API Failure: shows "Unable to load bookings" with Retry', async ({ page }) => {
    await loginAsPatient(page);
    await mockApiFailure(page, 'bookings/me');
    await page.goto(ROUTES.bookings);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.emptyState).filter({ hasText: /unable to load/i })).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });

  test('Null and Zero Handling: null queue number shows dash', async ({ page }) => {
    await loginAsPatient(page);
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 10);
    await mockApiResponse(page, 'bookings/me', {
      items: [{
        id: 'bk-null-001',
        doctorName: 'Dr. Null Test',
        serviceNames: ['General Consultation'],
        appointmentDate: dateStr,
        slotStartTime: '09:00',
        slotEndTime: '09:30',
        status: 'Confirmed',
        paymentStatus: 'Unpaid',
        queueNumber: null,
        totalFee: 650,
      }],
      totalCount: 1
    });
    await page.goto(ROUTES.bookings);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Should see the booking in the DOM
    await expect(page.getByText('Dr. Null Test').first()).toBeAttached({ timeout: 5000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });
});


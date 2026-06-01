/**
 * E2E Patient booking flow test.
 *
 * Verifies the full Patient booking wizard works: produces a booking that
 * appears in My Bookings after creation.
 *
 * If no doctor/date has an available slot the test skips gracefully —
 * this is a test-data availability issue, not a code defect.
 *
 * No waitForTimeout.
 */

import { test, expect } from '@playwright/test';
import { createPatientBooking } from '../utils/booking-creator';
import { findPatientBookingByStatus } from '../utils/booking-lookup';

test.describe('Patient E2E: Real Booking Flow', () => {

  test('full wizard booking from login to booking confirmation', async ({ page }) => {
    // Try to find a doctor+date with available slots (up to 7 days ahead)
    let bookingId: string;
    let doctorName: string;
    let serviceName: string;

    try {
      const result = await createPatientBooking(page, { maxDays: 7 });
      bookingId = result.bookingId;
      doctorName = result.doctorName;
      serviceName = result.serviceName;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('NEEDS TEST DATA')) {
        test.skip(true, msg);
        return;
      }
      throw e;
    }

    console.log(`✅ Booking created: ${bookingId}`);
    console.log(`✅ Doctor: ${doctorName}, Service: ${serviceName}`);

    // Verify via My Bookings page
    await page.goto('/patient/bookings');
    await page.waitForLoadState('networkidle');

    const visibleRows = page.locator('table.clinic-table tbody tr, app-patient-booking-card');
    const rowCount = await visibleRows.count();
    expect(rowCount).toBeGreaterThanOrEqual(1);

    // Also verify via API lookup
    const apiBooking = await findPatientBookingByStatus(page, 'Confirmed');
    expect(apiBooking?.id).toBe(bookingId);

    console.log('✅ Booking found in My Bookings and confirmed via API.');
  });
});

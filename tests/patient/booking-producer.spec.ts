/**
 * Booking producer — creates bookings through the Patient UI wizard.
 *
 * Each booking advances through the wizard and, for later tests, through
 * check-in and doctor-complete API steps.
 *
 * When no doctor/date has available slots the test skips gracefully.
 */

import { test } from '@playwright/test';
import { createPatientBooking } from '../utils/booking-creator';
import { checkInBooking, doctorCompleteBooking } from '../utils/admin-helpers';

const produced: Record<string, string> = {};

async function safeCreate(page: any): Promise<{ bookingId: string; doctorName: string; serviceName: string } | null> {
  try {
    return await createPatientBooking(page, { maxDays: 7 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('NEEDS TEST DATA')) {
      console.log(`⚠️ Skipping — no available slots: ${msg}`);
      return null;
    }
    throw e;
  }
}

test.describe('E2E Booking Producer', () => {

  test('Booking A: self-book → Confirmed', async ({ page }) => {
    const r = await safeCreate(page);
    if (!r) { test.skip(true, 'no available slots'); return; }
    produced['E2E_BOOKING_A_CHECKIN'] = r.bookingId;
    console.log(`📌 E2E_BOOKING_A_CHECKIN = ${r.bookingId}`);
  });

  test('Booking B: self-book → Confirmed', async ({ page }) => {
    const r = await safeCreate(page);
    if (!r) { test.skip(true, 'no available slots'); return; }
    produced['E2E_BOOKING_B_CANCEL'] = r.bookingId;
    console.log(`📌 E2E_BOOKING_B_CANCEL = ${r.bookingId}`);
  });

  test('Booking C: +check-in → CheckedIn', async ({ page }) => {
    const r = await safeCreate(page);
    if (!r) { test.skip(true, 'no available slots'); return; }
    await checkInBooking(page, r.bookingId);
    produced['E2E_BOOKING_C_CONSULT'] = r.bookingId;
    console.log(`📌 E2E_BOOKING_C_CONSULT = ${r.bookingId}`);
  });

  test('Booking D: +check-in+complete → Completed', async ({ page }) => {
    const r = await safeCreate(page);
    if (!r) { test.skip(true, 'no available slots'); return; }
    await checkInBooking(page, r.bookingId);
    await doctorCompleteBooking(page, r.bookingId, 650);
    produced['E2E_BOOKING_D_PAYMENT'] = r.bookingId;
    console.log(`📌 E2E_BOOKING_D_PAYMENT = ${r.bookingId}`);
  });

  test('Booking E: +check-in+complete → Completed', async ({ page }) => {
    const r = await safeCreate(page);
    if (!r) { test.skip(true, 'no available slots'); return; }
    await checkInBooking(page, r.bookingId);
    await doctorCompleteBooking(page, r.bookingId, 650);
    produced['E2E_BOOKING_E_RECEIPT'] = r.bookingId;
    console.log(`📌 E2E_BOOKING_E_RECEIPT = ${r.bookingId}`);
  });
});

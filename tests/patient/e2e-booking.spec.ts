import { test, expect } from '@playwright/test';
import { loginAsPatient, SELECTORS } from './patient.fixtures';

/**
 * REAL-WORLD E2E: Patient books a consultation end-to-end.
 * Hits the LIVE backend with seeded patient@gavino.clinic account.
 */

test.describe('Patient E2E: Real Booking Flow', () => {

  test('full 6-step wizard booking from login to booking confirmation', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', (err) => consoleErrors.push(err.message));

    // ── STEP 1: LOGIN ──────────────────────────────────────────────
    await test.step('Login as patient@gavino.clinic', async () => {
      await loginAsPatient(page);
      console.log(`✅ Logged in. URL: ${page.url()}`);
      expect(page.url()).toContain('/patient/');
    });

    // ── STEP 2: DOCTORS → BOOK NOW ────────────────────────────────
    await test.step('Navigate to doctors and click Book Now', async () => {
      await page.goto('/patient/doctors');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      await page.waitForSelector(SELECTORS.doctorCard, { timeout: 15000 });
      const bookNowBtn = page.locator(SELECTORS.doctorCard).first().locator(SELECTORS.bookNowBtn);
      await expect(bookNowBtn).toBeVisible({ timeout: 5000 });
      await bookNowBtn.click();

      await page.waitForURL(/\/public\/booking\?doctorId=/, { timeout: 15000 });
      console.log(`✅ At booking wizard. URL: ${page.url()}`);
    });

    // ── STEP 3: WIZARD - SELECT SERVICE ────────────────────────────
    await test.step('Wizard Step 1: Select service → Continue', async () => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      const serviceBtn = page.locator('.service-option').first();
      await expect(serviceBtn).toBeVisible({ timeout: 15000 });
      await serviceBtn.click();
      console.log('✅ Service selected.');

      await page.getByRole('button', { name: /^continue$/i }).click();
      await page.waitForTimeout(1500);
    });

    // ── STEP 4: WIZARD - SELECT DATE ───────────────────────────────
    await test.step('Wizard Step 2: Date auto-selected → Continue', async () => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      const continueBtn = page.getByRole('button', { name: /^continue$/i });
      await expect(continueBtn).toBeEnabled({ timeout: 15000 });
      await continueBtn.click();
      await page.waitForTimeout(1500);
    });

    // ── STEP 5: WIZARD - SELECT TIME SLOT ──────────────────────────
    await test.step('Wizard Step 3: Select time slot → Continue', async () => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      const slotBtn = page.locator('.slot-chip:not([disabled])').filter({ hasNotText: /Full|Past/ }).first();
      await expect(slotBtn).toBeVisible({ timeout: 10000 });
      await slotBtn.click();
      console.log('✅ Time slot selected.');

      await page.getByRole('button', { name: /^continue$/i }).click();
      await page.waitForTimeout(1500);
    });

    // ── STEP 6: WIZARD - REVIEW ────────────────────────────────────
    await test.step('Wizard Step 4: Review → Continue', async () => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      await page.getByRole('button', { name: /^continue$/i }).click();
      await page.waitForTimeout(1500);
    });

    // ── STEP 7: WIZARD - AUTH CHECK ────────────────────────────────
    await test.step('Wizard Step 5: Account ready → Continue', async () => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);

      await page.getByRole('button', { name: /continue/i }).click();
      await page.waitForTimeout(1500);
    });

    // ── STEP 8: WIZARD - CONFIRM BOOKING ───────────────────────────
    await test.step('Wizard Step 6: Confirm Booking', async () => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const confirmBtn = page.getByRole('button', { name: /confirm booking/i });
      await expect(confirmBtn).toBeVisible({ timeout: 10000 });

      const bookingResponse = page.waitForResponse(
        (resp) => resp.url().includes('/api/bookings') && resp.request().method() === 'POST',
        { timeout: 30000 }
      );

      await confirmBtn.click();
      const resp = await bookingResponse;
      expect([200, 201]).toContain(resp.status());
      console.log(`📡 Booking API: ${resp.status()}`);

      // Should redirect to confirmation page
      await page.waitForURL(/\/public\/booking-confirmation\//, { timeout: 15000 });
      console.log(`✅ Booking confirmed. URL: ${page.url()}`);
    });

    // ── STEP 9: VERIFY IN MY BOOKINGS ──────────────────────────────
    await test.step('Verify booking in My Bookings', async () => {
      await page.goto('/patient/bookings');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      const bookingRow = page.locator('table.clinic-table tbody tr, app-patient-booking-card').first();
      await expect(bookingRow).toBeVisible({ timeout: 15000 });
      console.log('✅ Booking found in My Bookings.');
    });

    // ── REPORT ──────────────────────────────────────────────────────
    if (consoleErrors.length > 0) {
      console.log('\n⚠️ Console errors:', consoleErrors.join('\n  '));
    } else {
      console.log('\n✅ No console errors.');
    }
  });
});

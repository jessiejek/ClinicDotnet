/**
 * Booking creation helpers.
 *
 * Creates bookings through the real Patient booking UI wizard.
 * Pre-checks the available-slots API to pick a doctor+date with open slots,
 * so the test doesn't time out when today's schedule is full.
 *
 * Prerequisites:
 *   - Backend running at E2E_API_BASE (default http://localhost:5000/api)
 *   - Frontend running at E2E_BASE_URL (default http://localhost:4200)
 *   - Patient credentials (defaults: patient@gavino.clinic)
 *   - At least one doctor with schedule + slots configured
 *
 * Usage:
 *   import { createPatientBooking } from '../utils/booking-creator';
 *   const result = await createPatientBooking(page);
 *   // result.bookingId, result.doctorName, result.serviceName
 */

import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

const API_BASE = process.env['E2E_API_BASE'] || 'http://localhost:5000/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreatedBooking {
  bookingId: string;
  doctorName: string;
  serviceName: string;
}

interface DoctorSlotInfo {
  doctorId: string;
  doctorName: string;
  date: string;
  slot: AvailableSlot;
}

interface AvailableSlot {
  slotStartTime?: string;
  slotEndTime?: string;
  isAvailable?: boolean;
  IsAvailable?: boolean;
}

interface DoctorDto {
  id: string;
  fullName: string;
  specialization: string;
  status: string;
}

// ---------------------------------------------------------------------------
// Step selectors
// ---------------------------------------------------------------------------

const SELECTORS = {
  serviceOption: '.service-option, ion-item:has(.service-name)',
  continueBtn: 'button:has-text("Continue")',
  slotChip: '.slot-chip:not([disabled])',
  confirmBookingBtn: 'button:has-text("Confirm Booking")',
  bookingIdSpan: '.booking-id .data-mono',
};

// ---------------------------------------------------------------------------
// Available-slot scanner (API calls)
// ---------------------------------------------------------------------------

/**
 * Obtain a fresh access token for the patient role.
 */
async function patientToken(page: Page): Promise<string> {
  const resp = await page.request.post(`${API_BASE}/auth/login`, {
    headers: { 'Content-Type': 'application/json' },
    data: {
      email: process.env['E2E_PATIENT_EMAIL'] || 'patient@gavino.clinic',
      password: process.env['E2E_PATIENT_PASSWORD'] || 'Patient@123456',
    },
  });
  if (!resp.ok()) throw new Error(`[booking-creator] Login failed: ${resp.status()}`);
  return (await resp.json()).accessToken as string;
}

/**
 * Format a Date object as YYYY-MM-DD.
 */
function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Check whether a slot is available.
 */
function isSlotAvailable(slot: AvailableSlot): boolean {
  if (slot.isAvailable === false) return false;
  if (slot.IsAvailable === false) return false;
  return true;
}

/**
 * Scan all active doctors and up to {@code maxDays} future dates to find
 * a doctor with at least one open slot. Returns the first match or null.
 */
async function findAnyAvailableSlot(page: Page, maxDays = 7): Promise<DoctorSlotInfo | null> {
  const token = await patientToken(page);

  // Fetch all active doctors
  const docResp = await page.request.get(`${API_BASE}/doctors`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!docResp.ok()) return null;
  const docBody = (await docResp.json()) as { value?: DoctorDto[] };
  const doctors = (docBody.value ?? []) as DoctorDto[];

  for (let offset = 0; offset < maxDays; offset++) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const dateStr = fmtDate(date);

    for (const doc of doctors) {
      const slotResp = await page.request.get(
        `${API_BASE}/doctors/${doc.id}/available-slots?date=${dateStr}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!slotResp.ok()) continue;

      const slots = (await slotResp.json()) as AvailableSlot[];
      const open = slots.find((s) => isSlotAvailable(s));
      if (open) {
        return { doctorId: doc.id, doctorName: doc.fullName, date: dateStr, slot: open };
      }
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Booking creator
// ---------------------------------------------------------------------------

/**
 * Create a booking through the Patient UI wizard.
 *
 * Before launching the wizard, this function uses the available-slots API
 * to find a doctor+date with open capacity.  If no slot is found across
 * all active doctors and the next {@code maxDays} days, the function
 * throws an error that callers can catch and skip with:
 *
 *   test.skip(true, '[NEEDS TEST DATA: no available doctor slots found]');
 */
export async function createPatientBooking(
  page: Page,
  options?: { maxDays?: number },
): Promise<CreatedBooking> {
  // ── 0. FIND AVAILABLE SLOT FIRST ─────────────────────────────────
  const maxDays = options?.maxDays ?? 7;
  const slotInfo = await findAnyAvailableSlot(page, maxDays);

  if (!slotInfo) {
    throw new Error(
      `[NEEDS TEST DATA: no available doctor slots found within ${maxDays} day(s). ` +
      'Run with a fresh database or wait for new schedule availability.]',
    );
  }

  const { doctorId, doctorName, date: bookingDate } = slotInfo;

  // ── 1. LOGIN ─────────────────────────────────────────────────────
  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');
  await page.getByTestId('auth-login-email-input').locator('input').fill(
    process.env['E2E_PATIENT_EMAIL'] || 'patient@gavino.clinic',
  );
  await page.getByTestId('auth-login-password-input').locator('input').fill(
    process.env['E2E_PATIENT_PASSWORD'] || 'Patient@123456',
  );
  await Promise.all([
    page.waitForURL(/\/patient\//, { timeout: 30_000 }),
    page.getByTestId('auth-login-submit-button').click(),
  ]);

  // ── 2. BOOK WITH THE DOCTOR THAT HAS SLOTS ───────────────────────
  await page.goto(`/patient/doctors`);
  await page.waitForLoadState('networkidle');

  // Find the specific doctor card by name to click Book Now
  const doctorCard = page.locator('app-doctor-card').filter({ hasText: doctorName }).first();
  await expect(doctorCard).toBeVisible({ timeout: 15_000 });

  const bookNow = doctorCard.locator('a.btn-book, button:has-text("Book Now")');
  await expect(bookNow).toBeVisible({ timeout: 5_000 });
  await bookNow.click();
  await page.waitForURL(/\/public\/booking\?doctorId=/, { timeout: 15_000 });

  // ── 3. STEP: SELECT SERVICE ──────────────────────────────────────
  await page.waitForLoadState('networkidle');

  const serviceOption = page.locator(SELECTORS.serviceOption).first();
  await expect(serviceOption).toBeVisible({ timeout: 15_000 });
  const serviceName = (await serviceOption.textContent())?.trim() ?? 'Unknown Service';
  await serviceOption.click();
  await clickContinue(page);

  // ── 4. STEP: SELECT DATE ─────────────────────────────────────────
  await page.waitForLoadState('networkidle');
  // The date is pre-selected; we just Continue
  await clickContinue(page);

  // ── 5. STEP: SELECT TIME SLOT ────────────────────────────────────
  await page.waitForLoadState('networkidle');

  const slotBtn = page.locator(SELECTORS.slotChip).first();
  await expect(slotBtn).toBeVisible({ timeout: 10_000 });
  await slotBtn.click();
  await clickContinue(page);

  // ── 6. STEP: REVIEW ──────────────────────────────────────────────
  await page.waitForLoadState('networkidle');
  await clickContinue(page);

  // ── 7. STEP: AUTH CHECK ──────────────────────────────────────────
  await page.waitForLoadState('networkidle');
  const authContinue = page.getByRole('button', { name: /continue/i });
  await expect(authContinue).toBeVisible({ timeout: 10_000 });
  await authContinue.click();

  // ── 8. STEP: CONFIRM BOOKING ─────────────────────────────────────
  await page.waitForLoadState('networkidle');

  const confirmBtn = page.locator(SELECTORS.confirmBookingBtn);
  await expect(confirmBtn).toBeVisible({ timeout: 10_000 });

  const bookingResponse = page.waitForResponse(
    (resp) => resp.url().includes('/api/bookings') && resp.request().method() === 'POST',
    { timeout: 30_000 },
  );

  await confirmBtn.click();
  const resp = await bookingResponse;
  expect([200, 201, 409]).toContain(resp.status());

  // ── 9. EXTRACT BOOKING ID ────────────────────────────────────────
  await page.waitForURL(/\/public\/booking-confirmation\//, { timeout: 15_000 });

  let bookingId = '';
  try {
    const idEl = page.locator(SELECTORS.bookingIdSpan);
    bookingId = (await idEl.textContent({ timeout: 5_000 }))?.trim() ?? '';
  } catch {
    const url = page.url();
    const match = url.match(/\/booking-confirmation\/([a-f0-9-]+)/i);
    bookingId = match?.[1] ?? '';
  }

  if (!bookingId) {
    const body = await resp.json();
    bookingId = (body as { id?: string; bookingId?: string }).id ?? '';
  }

  if (!bookingId) {
    throw new Error('[booking-creator] Could not extract booking ID after creation');
  }

  return { bookingId, doctorName, serviceName };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function clickContinue(page: Page): Promise<void> {
  const btn = page.locator(SELECTORS.continueBtn);
  await expect(btn).toBeVisible({ timeout: 10_000 });
  await expect(btn).toBeEnabled({ timeout: 10_000 });
  await btn.click();
}

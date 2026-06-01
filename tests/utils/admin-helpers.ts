/**
 * Admin API helpers for confirming/advancing booking states.
 *
 * These use page.request (authenticated API calls) to transition bookings
 * through states that require admin or staff privileges.
 *
 * Prerequisites:
 *   - Backend running at E2E_API_BASE (default http://localhost:5000/api)
 *   - Admin credentials (defaults: admin@gavino.clinic)
 *
 * Usage:
 *   import { confirmBooking, checkInBooking, completeBooking } from '../utils/admin-helpers';
 *   await confirmBooking(page, bookingId);
 */

import type { Page } from '@playwright/test';

const API_BASE = process.env['E2E_API_BASE'] || 'http://localhost:5000/api';

// ---------------------------------------------------------------------------
// Auth — login as admin / staff
// ---------------------------------------------------------------------------

async function adminToken(page: Page): Promise<string> {
  const resp = await page.request.post(`${API_BASE}/auth/login`, {
    headers: { 'Content-Type': 'application/json' },
    data: {
      email: process.env['E2E_ADMIN_EMAIL'] || 'admin@gavino.clinic',
      password: process.env['E2E_ADMIN_PASSWORD'] || 'Admin@123456',
    },
  });
  if (!resp.ok()) throw new Error(`[admin-helpers] Admin login: ${resp.status()}`);
  return (await resp.json()).accessToken as string;
}

async function staffToken(page: Page): Promise<string> {
  const resp = await page.request.post(`${API_BASE}/auth/login`, {
    headers: { 'Content-Type': 'application/json' },
    data: {
      email: process.env['E2E_STAFF_EMAIL'] || 'staff@gavino.clinic',
      password: process.env['E2E_STAFF_PASSWORD'] || 'Staff@123456',
    },
  });
  if (!resp.ok()) throw new Error(`[admin-helpers] Staff login: ${resp.status()}`);
  return (await resp.json()).accessToken as string;
}

// ---------------------------------------------------------------------------
// Booking state transitions
// ---------------------------------------------------------------------------

/**
 * Confirm a booking as admin (Pending → Confirmed).
 * The PATCH /api/bookings/{id}/confirm endpoint takes no request body.
 */
export async function confirmBooking(page: Page, bookingId: string): Promise<void> {
  const token = await adminToken(page);
  const resp = await page.request.patch(`${API_BASE}/bookings/${bookingId}/confirm`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: {},
  });
  if (!resp.ok()) {
    const text = await resp.text();
    throw new Error(`[admin-helpers] confirmBooking(${bookingId}) failed: ${resp.status()} ${text}`);
  }
}

/**
 * Check in a booking as staff (Confirmed → CheckedIn).
 * The PATCH /api/bookings/{id}/check-in endpoint takes no request body.
 */
export async function checkInBooking(page: Page, bookingId: string): Promise<void> {
  const token = await staffToken(page);
  const resp = await page.request.patch(`${API_BASE}/bookings/${bookingId}/check-in`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: {},
  });
  if (!resp.ok()) {
    const text = await resp.text();
    throw new Error(`[admin-helpers] checkInBooking(${bookingId}) failed: ${resp.status()} ${text}`);
  }
}

/**
 * Complete a booking as doctor (CheckedIn → Completed).
 * The PATCH /api/bookings/{id}/doctor-complete endpoint.
 */
export async function doctorCompleteBooking(page: Page, bookingId: string, finalAmount?: number): Promise<void> {
  const doctorEmail = process.env['E2E_DOCTOR_EMAIL'] || 'dr.santos@gavino.clinic';
  const doctorPassword = process.env['E2E_DOCTOR_PASSWORD'] || 'Doctor@123456';

  const resp = await page.request.post(`${API_BASE}/auth/login`, {
    headers: { 'Content-Type': 'application/json' },
    data: { email: doctorEmail, password: doctorPassword },
  });
  if (!resp.ok()) throw new Error(`[admin-helpers] Doctor login: ${resp.status()}`);

  const token = (await resp.json()).accessToken as string;
  const body: Record<string, unknown> = {};
  if (finalAmount !== undefined) body.finalAmount = finalAmount;

  const completeResp = await page.request.patch(`${API_BASE}/bookings/${bookingId}/doctor-complete`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: body,
  });
  if (!completeResp.ok()) {
    const text = await completeResp.text();
    throw new Error(`[admin-helpers] doctorCompleteBooking(${bookingId}) failed: ${completeResp.status()} ${text}`);
  }
}

/**
 * Waive a payment as Admin (Completed+Unpaid → Completed+Waived).
 * The PATCH /api/payments/{paymentId}/waive endpoint.
 * ⚠️ PERMISSION: Requires **Admin** credentials. Staff receives 403.
 * Correct body: { waivedReason: "..." } (NOT "reason", no DTO wrapper).
 */
export async function waivePayment(page: Page, paymentId: string, reason?: string): Promise<void> {
  const token = await adminToken(page);
  const resp = await page.request.patch(`${API_BASE}/payments/${paymentId}/waive`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: { waivedReason: reason ?? 'E2E test waiver' },
  });
  if (!resp.ok()) {
    const text = await resp.text();
    throw new Error(`[admin-helpers] waivePayment(${paymentId}) failed: ${resp.status()} ${text}`);
  }
}

/**
 * Cancel a booking (any cancellable status → Cancelled).
 * The PATCH /api/bookings/{id}/cancel endpoint.
 */
export async function cancelBooking(page: Page, bookingId: string, reason?: string): Promise<void> {
  const token = await adminToken(page);
  const resp = await page.request.patch(`${API_BASE}/bookings/${bookingId}/cancel`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: { reason: reason ?? 'E2E test cancellation' },
  });
  if (!resp.ok()) {
    const text = await resp.text();
    throw new Error(`[admin-helpers] cancelBooking(${bookingId}) failed: ${resp.status()} ${text}`);
  }
}

/**
 * API-driven booking lookup helpers.
 *
 * These functions query the running backend API for bookings matching specific
 * status/role criteria.  They let tests find valid test data dynamically
 * instead of depending on hardcoded booking IDs.
 *
 * Prerequisite:
 *   The backend must be running at the API_BASE URL (default
 *   http://localhost:5000/api).
 *
 * Usage:
 *   import { findBookingByStatus } from '../utils/booking-lookup';
 *   const booking = await findBookingByStatus(page, 'Completed');
 *   if (!booking) test.skip('no completed booking found');
 */

import type { Page } from '@playwright/test';

const API_BASE = process.env['E2E_API_BASE'] || 'http://localhost:5000/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BookingDto {
  id: string;
  status: string;
  patientName?: string;
  patientId?: string;
  doctorName?: string;
  doctorId?: string;
  totalFee?: number;
  finalAmount?: number | null;
  paymentStatus?: string;
  bookingDate?: string;
  slotStartTime?: string;
  slotEndTime?: string;
  queueNumber?: number | null;
  paymentMode?: string;
}

export interface PaymentDto {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  orNumber?: string | null;
  referenceNumber?: string | null;
}

// ---------------------------------------------------------------------------
// Auth helpers (login + store token in page)
// ---------------------------------------------------------------------------

type RoleEmail = 'patient' | 'staff' | 'doctor' | 'admin';

const CREDENTIALS: Record<RoleEmail, { email: string; password: string }> = {
  patient: {
    email: process.env['E2E_PATIENT_EMAIL'] || 'patient@gavino.clinic',
    password: process.env['E2E_PATIENT_PASSWORD'] || 'Patient@123456',
  },
  staff: {
    email: process.env['E2E_STAFF_EMAIL'] || 'staff@gavino.clinic',
    password: process.env['E2E_STAFF_PASSWORD'] || 'Staff@123456',
  },
  doctor: {
    email: process.env['E2E_DOCTOR_EMAIL'] || 'dr.santos@gavino.clinic',
    password: process.env['E2E_DOCTOR_PASSWORD'] || 'Doctor@123456',
  },
  admin: {
    email: process.env['E2E_ADMIN_EMAIL'] || 'admin@gavino.clinic',
    password: process.env['E2E_ADMIN_PASSWORD'] || 'Admin@123456',
  },
};

/** Obtain an access token for a given role. */
export async function getAccessToken(_page: Page, role: RoleEmail): Promise<string> {
  const creds = CREDENTIALS[role];
  const response = await _page.request.post(`${API_BASE}/auth/login`, {
    headers: { 'Content-Type': 'application/json' },
    data: { email: creds.email, password: creds.password },
  });
  if (!response.ok()) {
    throw new Error(`[booking-lookup] Login as ${role} failed: ${response.status()} ${await response.text()}`);
  }
  const body = await response.json();
  return body.accessToken as string;
}

// ---------------------------------------------------------------------------
// Lookup helpers using page.request (authenticated)
// ---------------------------------------------------------------------------

/**
 * Fetch patient bookings and return the first one whose status matches.
 * Returns `null` when no match is found.
 */
export async function findPatientBookingByStatus(
  page: Page,
  status: string,
): Promise<BookingDto | null> {
  const token = await getAccessToken(page, 'patient');
  const response = await page.request.get(`${API_BASE}/bookings/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) return null;
  const body = await response.json();
  const items: BookingDto[] = body.items ?? body ?? [];
  return items.find((b) => b.status === status) ?? null;
}

/**
 * Fetch all staff bookings and return the first one whose status matches.
 * Optionally filters by additional criteria (paymentStatus).
 */
export async function findStaffBookingByStatus(
  page: Page,
  status: string,
  options?: { paymentStatus?: string },
): Promise<BookingDto | null> {
  const token = await getAccessToken(page, 'staff');
  const response = await page.request.get(`${API_BASE}/bookings/staff/all?page=1&pageSize=50`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) return null;
  const body = await response.json();
  const items: BookingDto[] = body.items ?? [];
  return items.find((b) => {
    if (b.status !== status) return false;
    if (options?.paymentStatus && b.paymentStatus !== options.paymentStatus) return false;
    return true;
  }) ?? null;
}

/**
 * Fetch doctor today bookings and return the first one whose status matches.
 */
/**
 * Normalize a raw booking from any API endpoint to a BookingDto with
 * flat doctorId/doctorName fields.
 */
function normalizeBooking(raw: Record<string, unknown>): BookingDto {
  const doctor = raw.doctor as Record<string, unknown> | undefined;
  return {
    id: raw.id as string,
    status: raw.status as string,
    patientName: (raw.patientName as string) ?? (raw.patient_name as string),
    patientId: (raw.patientId as string) ?? (raw.patient_id as string),
    doctorName: (raw.doctorName as string) ?? doctor?.fullName as string ?? (raw.doctor_name as string),
    doctorId: (raw.doctorId as string) ?? doctor?.id as string,
    totalFee: (raw.totalFee as number) ?? (raw.total_fee as number),
    finalAmount: (raw.finalAmount as number | null) ?? (raw.final_amount as number | null),
    paymentStatus: (raw.paymentStatus as string) ?? (raw.payment_status as string),
    bookingDate: (raw.bookingDate as string) ?? (raw.appointmentDate as string) ?? (raw.booking_date as string),
    slotStartTime: (raw.slotStartTime as string) ?? (raw.slot_start_time as string),
    slotEndTime: (raw.slotEndTime as string) ?? (raw.slot_end_time as string),
    queueNumber: (raw.queueNumber as number | null) ?? (raw.queue_number as number | null),
    paymentMode: (raw.paymentMode as string) ?? (raw.payment_mode as string),
  };
}

/**
 * Fetch doctor's today bookings and return the first one whose status matches.
 */
export async function findDoctorBookingByStatus(
  page: Page,
  status: string,
  doctorEmail?: RoleEmail,
): Promise<BookingDto | null> {
  const role = doctorEmail ?? 'doctor';
  const token = await getAccessToken(page, role);
  const response = await page.request.get(`${API_BASE}/bookings/doctor/today`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) return null;
  const body = (await response.json()) as unknown;
  // doctor/today returns a flat array: [{...}, ...]
  // But may also return { value: [...], Count: N } with different credentials
  const rawItems: Record<string, unknown>[] = Array.isArray(body)
    ? (body as Record<string, unknown>[])
    : ((body as Record<string, unknown>).value as Record<string, unknown>[])
      ?? ((body as Record<string, unknown>).items as Record<string, unknown>[])
      ?? [];
  const items = rawItems.map(normalizeBooking);
  return items.find((b) => b.status === status) ?? null;
}

/**
 * Fetch the payment record for a given booking.
 */
export async function findPaymentByBooking(
  page: Page,
  bookingId: string,
): Promise<PaymentDto | null> {
  const token = await getAccessToken(page, 'patient');
  const response = await page.request.get(`${API_BASE}/payments/booking/${bookingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) return null;
  return (await response.json()) as PaymentDto;
}

/**
 * Find any booking that has a payment with status "Paid" for the patient.
 * This is the most reliable way to find a receipt-testable booking.
 */
export async function findPaidPatientBooking(page: Page): Promise<{ booking: BookingDto; payment: PaymentDto } | null> {
  const token = await getAccessToken(page, 'patient');
  const response = await page.request.get(`${API_BASE}/bookings/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) return null;
  const body = await response.json();
  const items: BookingDto[] = body.items ?? body ?? [];
  const completed = items.filter((b) => b.status === 'Completed');
  for (const booking of completed) {
    try {
      const payResp = await page.request.get(`${API_BASE}/payments/booking/${booking.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (payResp.ok()) {
        const payment = (await payResp.json()) as PaymentDto;
        if (payment.status === 'Paid' || payment.status === 'Confirmed') {
          return { booking, payment };
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}

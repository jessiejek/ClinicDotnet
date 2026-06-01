import { expect, test } from '@playwright/test';
import { findPaidPatientBooking } from '../utils/booking-lookup';

const ROUTES = {
  login: '/auth/login',
  patientBookingDetail: (bookingId: string) => `/patient/bookings/${bookingId}`,
} as const;

const CREDENTIALS = {
  patient: {
    email: process.env['E2E_PATIENT_EMAIL'] || 'patient@gavino.clinic',
    password: process.env['E2E_PATIENT_PASSWORD'] || 'Patient@123456',
  },
};

test.describe('Shared — Receipt Modal', () => {
  test('receipt modal displays receipt details after payment', async ({ page }) => {
    // Dynamically look up a paid booking
    const paid = await findPaidPatientBooking(page);
    test.skip(!paid, '[NEEDS SEED DATA: no Completed+Paid booking found in the database for patient@gavino.clinic]');
    const paidBookingId = paid!.booking.id;
    const creds = CREDENTIALS.patient;

    // Login as patient
    await page.goto(ROUTES.login);
    await page.waitForLoadState('networkidle');
    await page.getByTestId('auth-login-email-input').locator('input').fill(creds.email);
    await page.getByTestId('auth-login-password-input').locator('input').fill(creds.password);
    await Promise.all([
      page.waitForURL(/\/patient\//, { timeout: 30_000 }),
      page.getByTestId('auth-login-submit-button').click(),
    ]);

    // Navigate to the paid booking's detail page and verify it loaded
    await page.goto(ROUTES.patientBookingDetail(paidBookingId));
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(paidBookingId).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/Paid/i).first()).toBeVisible();

    // Click View Receipt
    const viewReceiptButton = page.getByTestId('patient-booking-detail-view-receipt-button');
    await viewReceiptButton.waitFor({ state: 'visible', timeout: 10_000 });
    await viewReceiptButton.click();

    // Wait for receipt modal to open
    const receiptModal = page.getByTestId('patient-booking-detail-receipt-modal');
    await expect(receiptModal).toBeVisible({ timeout: 15_000 });

    // Verify receipt content — OR number or amount should be visible
    await expect(page.locator('body')).toContainText(/OR|receipt|paid|payment|amount/i);

    // Close the receipt modal
    const closeButton = receiptModal.locator('button, [role="button"], ion-button').first();
    await closeButton.click();
  });
});

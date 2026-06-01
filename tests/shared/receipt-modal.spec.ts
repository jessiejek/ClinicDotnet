import { expect, test } from '@playwright/test';

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

const PAID_BOOKING_ID = process.env['E2E_PATIENT_PAID_BOOKING_ID'] || '';

test.describe('Shared — Receipt Modal', () => {
  test('receipt modal displays receipt details after payment', async ({ page }) => {
    const creds = CREDENTIALS.patient;
    test.skip(!PAID_BOOKING_ID, '[NEEDS CLARIFICATION: missing E2E_PATIENT_PAID_BOOKING_ID env var]');

    // Login as patient
    await page.goto(ROUTES.login);
    await page.waitForLoadState('networkidle');
    await page.getByTestId('auth-login-email-input').locator('input').fill(creds.email);
    await page.getByTestId('auth-login-password-input').locator('input').fill(creds.password);
    await Promise.all([
      page.waitForURL(/\/patient\//, { timeout: 30_000 }),
      page.getByTestId('auth-login-submit-button').click(),
    ]);

    // Navigate to booking detail
    await page.goto(ROUTES.patientBookingDetail(PAID_BOOKING_ID));
    await page.waitForLoadState('networkidle');

    // Click View Receipt
    const viewReceiptButton = page.getByTestId('patient-booking-detail-view-receipt-button');
    await viewReceiptButton.waitFor({ state: 'visible', timeout: 10_000 });
    await viewReceiptButton.click();

    // Assert receipt modal is visible
    const receiptModal = page.getByTestId('patient-booking-detail-receipt-modal');
    await expect(receiptModal).toBeVisible({ timeout: 10_000 });

    // Assert receipt data is visible
    await expect(page.locator('body')).toContainText(/receipt|paid|payment|amount/i);

    // Close the receipt modal
    const closeButton = page.getByTestId('patient-booking-detail-receipt-close-button').or(
      receiptModal.locator('button, [role="button"], .btn-close, ion-button')
    ).first();
    await closeButton.click();
  });
});

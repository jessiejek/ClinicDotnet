import { test } from '@playwright/test';
import {
  assertFinalBookingState,
  checkInFromStaffBookingDetail,
  collectPaymentFromStaffDetail,
  completePatientBookingWizard,
  confirmBookingIfNeeded,
  fillAndCompleteDoctorConsultation,
  loginAs,
  printReceiptIfPresent,
} from './clinic-flow.helpers';

test.describe.serial('REAL E2E: patient booking → consultation → payment', () => {
  test('patient books, staff checks in, doctor completes, staff collects payment, receipt/status visible', async ({ page }) => {
    let bookingId = '';

    await test.step('1-3. Login as patient, book consultation, capture booking ID from POST /api/bookings or URL', async () => {
      const result = await completePatientBookingWizard(page);
      bookingId = result.bookingId;
    });

    await test.step('4-6. Login as staff, confirm if needed, check in patient through staff booking detail UI', async () => {
      await loginAs(page, 'staff');
      await confirmBookingIfNeeded(page, bookingId);
      await checkInFromStaffBookingDetail(page, bookingId);
    });

    await test.step('7-15. Login as doctor, open consultation, fill fields, diagnosis, optional RX/follow-up/labs, complete', async () => {
      await loginAs(page, 'doctor');
      await fillAndCompleteDoctorConsultation(page, bookingId);
    });

    await test.step('16-20. Login as staff, open booking detail/payment, collect payment, confirm API, print receipt if UI exists', async () => {
      await loginAs(page, 'staff');
      await collectPaymentFromStaffDetail(page, bookingId);
      await printReceiptIfPresent(page);
    });

    await test.step('21. Assert final booking/payment/document status on API and screen', async () => {
      await assertFinalBookingState(page, bookingId);
    });
  });
});

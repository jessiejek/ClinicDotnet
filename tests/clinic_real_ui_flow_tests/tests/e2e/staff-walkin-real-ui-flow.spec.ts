import { test } from '@playwright/test';
import {
  assertFinalBookingState,
  checkInFromStaffBookingDetail,
  collectPaymentFromStaffDetail,
  createWalkInBookingViaStaffUi,
  fillAndCompleteDoctorConsultation,
  loginAs,
  printReceiptIfPresent,
} from './clinic-flow.helpers';

test.describe.serial('REAL E2E: staff walk-in → consultation → payment', () => {
  test('staff quick-registers walk-in, checks in, doctor completes, staff collects payment, final status visible', async ({ page }) => {
    let bookingId = '';

    await test.step('1-9. Login as staff, open walk-in, search patient, quick-register, select doctor/service/slot, create booking', async () => {
      await loginAs(page, 'staff');
      const result = await createWalkInBookingViaStaffUi(page);
      bookingId = result.bookingId;
    });

    await test.step('10. Check in patient through staff booking detail UI', async () => {
      await loginAs(page, 'staff');
      await checkInFromStaffBookingDetail(page, bookingId);
    });

    await test.step('11-12. Login as doctor and complete consultation using consultation UI', async () => {
      await loginAs(page, 'doctor');
      await fillAndCompleteDoctorConsultation(page, bookingId);
    });

    await test.step('13-15. Login as staff, collect payment, print/download PDFs if implemented', async () => {
      await loginAs(page, 'staff');
      await collectPaymentFromStaffDetail(page, bookingId);
      await printReceiptIfPresent(page);
    });

    await test.step('16. Assert final booking/payment/document status on API and screen', async () => {
      await assertFinalBookingState(page, bookingId);
    });
  });
});

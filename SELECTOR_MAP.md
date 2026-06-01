# SELECTOR_MAP.md

Purpose: stable Playwright selectors added for the P0 flows identified in `PROJECT_BLUEPRINT.md` Section 19.

Scope constraints followed:

- Business logic unchanged.
- Routes unchanged.
- API contracts unchanged.
- UI layout/design unchanged.
- Selectors only document stable handles for tests and future AI tasks.

## Auth / Login Page

| Selector | Page / Component | Purpose | Source File |
|---|---|---|---|
| `auth-login-email-input` | Login Page | Email input field | `src/app/auth/login/login.page.html` |
| `auth-login-password-input` | Login Page | Password input field | `src/app/auth/login/login.page.html` |
| `auth-login-submit-button` | Login Page | Sign In submit button | `src/app/auth/login/login.page.html` |
| `auth-login-error-message` | Login Page | Banner error message display | `src/app/auth/login/login.page.html` |
| `auth-login-google-button` | Login Page | Continue with Google button | `src/app/auth/login/login.page.html` |
| `auth-login-facebook-button` | Login Page | Continue with Facebook button | `src/app/auth/login/login.page.html` |

## Shared Components

| Selector | Page / Component | Purpose | Source File |
|---|---|---|---|
| `{prefix}-backdrop` | Confirm modal | Modal backdrop | `src/app/shared/components/confirm-modal/confirm-modal.component.ts` |
| `{prefix}-dialog` | Confirm modal | Confirm modal dialog | `src/app/shared/components/confirm-modal/confirm-modal.component.ts` |
| `{prefix}-close-button` | Confirm modal | Header close button | `src/app/shared/components/confirm-modal/confirm-modal.component.ts` |
| `{prefix}-reason-textarea` | Confirm modal | Required reason input | `src/app/shared/components/confirm-modal/confirm-modal.component.ts` |
| `{prefix}-cancel-button` | Confirm modal | Cancel action | `src/app/shared/components/confirm-modal/confirm-modal.component.ts` |
| `{prefix}-confirm-button` | Confirm modal | Confirm action | `src/app/shared/components/confirm-modal/confirm-modal.component.ts` |
| `{prefix}-modal` | Receipt modal | Receipt modal host | `src/app/shared/components/receipt-modal/receipt-modal.component.ts` |
| `{prefix}-toolbar-close-button` | Receipt modal | Toolbar close button | `src/app/shared/components/receipt-modal/receipt-modal.component.ts` |
| `{prefix}-close-button` | Receipt modal | Footer close button | `src/app/shared/components/receipt-modal/receipt-modal.component.ts` |
| `{prefix}-print-button` | Receipt modal | Print receipt action | `src/app/shared/components/receipt-modal/receipt-modal.component.ts` |

## Staff — Bookings Check-In / Undo Check-In

| Selector | Page / Component | Purpose | Source File |
|---|---|---|---|
| `staff-bookings-doctor-filter` | Staff Bookings | Filter by doctor | `src/app/portals/staff/bookings/staff-bookings.page.ts` |
| `staff-bookings-status-filter` | Staff Bookings | Filter by status | `src/app/portals/staff/bookings/staff-bookings.page.ts` |
| `staff-bookings-date-filter` | Staff Bookings | Filter by date | `src/app/portals/staff/bookings/staff-bookings.page.ts` |
| `staff-bookings-refresh-button` | Staff Bookings | Reload bookings | `src/app/portals/staff/bookings/staff-bookings.page.ts` |
| `staff-bookings-row-{bookingId}` | Staff Bookings | Desktop booking row | `src/app/portals/staff/bookings/staff-bookings.page.ts` |
| `staff-bookings-open-button-{bookingId}` | Staff Bookings | Open booking detail | `src/app/portals/staff/bookings/staff-bookings.page.ts` |
| `staff-bookings-checkin-button-{bookingId}` | Staff Bookings | Check in confirmed booking | `src/app/portals/staff/bookings/staff-bookings.page.ts` |
| `staff-bookings-undo-checkin-button-{bookingId}` | Staff Bookings | Undo check-in | `src/app/portals/staff/bookings/staff-bookings.page.ts` |
| `staff-bookings-previous-page-button` | Staff Bookings | Previous page | `src/app/portals/staff/bookings/staff-bookings.page.ts` |
| `staff-bookings-next-page-button` | Staff Bookings | Next page | `src/app/portals/staff/bookings/staff-bookings.page.ts` |
| `staff-bookings-mobile-card-{bookingId}` | Staff Bookings | Mobile booking card | `src/app/portals/staff/bookings/staff-bookings.page.ts` |
| `staff-bookings-mobile-checkin-button-{bookingId}` | Staff Bookings | Mobile check-in action | `src/app/portals/staff/bookings/staff-bookings.page.ts` |
| `staff-bookings-mobile-undo-checkin-button-{bookingId}` | Staff Bookings | Mobile undo check-in action | `src/app/portals/staff/bookings/staff-bookings.page.ts` |
| `staff-bookings-mobile-previous-page-button` | Staff Bookings | Mobile previous page | `src/app/portals/staff/bookings/staff-bookings.page.ts` |
| `staff-bookings-mobile-next-page-button` | Staff Bookings | Mobile next page | `src/app/portals/staff/bookings/staff-bookings.page.ts` |

## Staff — Booking Detail Actions

| Selector | Page / Component | Purpose | Source File |
|---|---|---|---|
| `staff-booking-detail-checkin-button` | Staff Booking Detail | Check in booking | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` |
| `staff-booking-detail-undo-checkin-button` | Staff Booking Detail | Undo check-in | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` |
| `staff-booking-detail-confirm-payment-open-button` | Staff Booking Detail | Open payment modal | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` |
| `staff-booking-detail-waive-pf-open-button` | Staff Booking Detail | Open PF waive modal | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` |
| `staff-booking-detail-print-document-button` | Staff Booking Detail | Print receipt/summary document | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` |
| `staff-booking-detail-payment-modal` | Staff Booking Detail | Payment modal host | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` |
| `staff-booking-detail-payment-modal-close-button` | Staff Booking Detail | Close payment modal | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` |
| `staff-booking-detail-payment-method-select` | Staff Booking Detail | Select payment method | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` |
| `staff-booking-detail-amount-received-input` | Staff Booking Detail | Amount received field | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` |
| `staff-booking-detail-reference-number-input` | Staff Booking Detail | Reference number field | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` |
| `staff-booking-detail-payment-notes-textarea` | Staff Booking Detail | Payment notes field | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` |
| `staff-booking-detail-payment-modal-cancel-button` | Staff Booking Detail | Cancel payment modal | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` |
| `staff-booking-detail-payment-modal-confirm-button` | Staff Booking Detail | Submit payment confirmation | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` |
| `staff-booking-detail-waive-modal-*` | Staff Booking Detail | PF waive modal controls through shared confirm modal | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` |
| `staff-booking-detail-receipt-*` | Staff Booking Detail | Receipt modal controls | `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts` |

## Staff — Payment Queue Confirm / Waive PF

| Selector | Page / Component | Purpose | Source File |
|---|---|---|---|
| `staff-payments-row-{bookingId}` | Staff Payments | Desktop payment queue row | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-confirm-open-button-{bookingId}` | Staff Payments | Open collect-payment modal | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-waive-open-button-{bookingId}` | Staff Payments | Open PF waive modal | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-mobile-card-{bookingId}` | Staff Payments | Mobile payment card | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-mobile-confirm-open-button-{bookingId}` | Staff Payments | Mobile open collect-payment modal | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-mobile-waive-open-button-{bookingId}` | Staff Payments | Mobile open PF waive modal | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-previous-page-button` | Staff Payments | Previous payment page | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-next-page-button` | Staff Payments | Next payment page | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-payment-modal-backdrop` | Staff Payments | Modal backdrop | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-payment-modal` | Staff Payments | Collect-payment modal | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-payment-modal-close-button` | Staff Payments | Close collect-payment modal | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-payment-method-select` | Staff Payments | Select payment method | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-amount-received-input` | Staff Payments | Amount received input | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-reference-number-input` | Staff Payments | Reference number input | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-notes-textarea` | Staff Payments | Payment notes input | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-payment-modal-cancel-button` | Staff Payments | Cancel payment modal | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-payment-modal-confirm-button` | Staff Payments | Submit payment confirmation | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-waive-modal-*` | Staff Payments | PF waive modal controls through shared confirm modal | `src/app/portals/staff/payments/staff-payments.page.ts` |
| `staff-payments-receipt-*` | Staff Payments | Receipt modal controls | `src/app/portals/staff/payments/staff-payments.page.ts` |

## Doctor — Complete Consultation

| Selector | Page / Component | Purpose | Source File |
|---|---|---|---|
| `doctor-consultation-back-to-appointments-link` | Doctor Consultation | Return to appointments | `src/app/portals/doctor/consultation/doctor-consultation.page.ts` |
| `doctor-consultation-save-draft-button` | Doctor Consultation | Save draft from main consultation workspace | `src/app/portals/doctor/consultation/doctor-consultation.page.ts` |
| `doctor-consultation-complete-button` | Doctor Consultation | Open complete consultation flow | `src/app/portals/doctor/consultation/doctor-consultation.page.ts` |
| `doctor-consultation-cancel-amend-button` | Doctor Consultation | Cancel amendment mode | `src/app/portals/doctor/consultation/doctor-consultation.page.ts` |
| `doctor-consultation-keep-editing-button` | Doctor Consultation | Keep editing after discard prompt | `src/app/portals/doctor/consultation/doctor-consultation.page.ts` |
| `doctor-consultation-discard-changes-button` | Doctor Consultation | Discard unsaved amendment changes | `src/app/portals/doctor/consultation/doctor-consultation.page.ts` |
| `doctor-consultation-header-save-draft-button` | Consultation Header | Save draft header action | `src/app/portals/doctor/consultation/components/consultation-header.component.ts` |
| `doctor-consultation-header-complete-transaction-button` | Consultation Header | Complete transaction header action | `src/app/portals/doctor/consultation/components/consultation-header.component.ts` |
| `doctor-consultation-header-enter-amend-button` | Consultation Header | Enter amendment mode | `src/app/portals/doctor/consultation/components/consultation-header.component.ts` |
| `doctor-consultation-header-cancel-amend-button` | Consultation Header | Cancel amendment mode | `src/app/portals/doctor/consultation/components/consultation-header.component.ts` |
| `doctor-consultation-header-save-amendment-button` | Consultation Header | Save amendment | `src/app/portals/doctor/consultation/components/consultation-header.component.ts` |
| `doctor-consultation-complete-modal-cancel-button` | Complete Consultation Modal | Cancel completion wizard | `src/app/portals/doctor/consultation/components/consultation-complete-modal.component.ts` |
| `doctor-consultation-complete-modal-review-summary-button` | Complete Consultation Modal | Move to completion summary | `src/app/portals/doctor/consultation/components/consultation-complete-modal.component.ts` |
| `doctor-consultation-complete-modal-go-back-button` | Complete Consultation Modal | Go back to checklist | `src/app/portals/doctor/consultation/components/consultation-complete-modal.component.ts` |
| `doctor-consultation-complete-modal-finalize-button` | Complete Consultation Modal | Finalize consultation | `src/app/portals/doctor/consultation/components/consultation-complete-modal.component.ts` |

## Patient — Bookings View / Cancel

| Selector | Page / Component | Purpose | Source File |
|---|---|---|---|
| `patient-bookings-filter-{filter}` | Patient Bookings | Filter bookings by status group | `src/app/portals/patient/bookings/patient-bookings.page.ts` |
| `patient-bookings-previous-page-button` | Patient Bookings | Previous page | `src/app/portals/patient/bookings/patient-bookings.page.ts` |
| `patient-bookings-next-page-button` | Patient Bookings | Next page | `src/app/portals/patient/bookings/patient-bookings.page.ts` |
| `patient-bookings-row-{bookingId}` | Patient Bookings | Desktop booking row | `src/app/portals/patient/bookings/patient-bookings.page.ts` |
| `patient-bookings-view-details-button-{bookingId}` | Patient Bookings | Open booking detail | `src/app/portals/patient/bookings/patient-bookings.page.ts` |
| `patient-bookings-cancel-open-button-{bookingId}` | Patient Bookings | Open cancel modal | `src/app/portals/patient/bookings/patient-bookings.page.ts` |
| `patient-bookings-cancel-modal-*` | Patient Bookings | Cancel modal controls through shared confirm modal | `src/app/portals/patient/bookings/patient-bookings.page.ts` |
| `patient-bookings-mobile-card-{bookingId}` | Patient Booking Card | Mobile booking card | `src/app/portals/patient/components/patient-booking-card/patient-booking-card.component.ts` |
| `patient-bookings-mobile-view-details-button-{bookingId}` | Patient Booking Card | Mobile open booking detail | `src/app/portals/patient/components/patient-booking-card/patient-booking-card.component.ts` |
| `patient-bookings-mobile-cancel-open-button-{bookingId}` | Patient Booking Card | Mobile open cancel modal | `src/app/portals/patient/components/patient-booking-card/patient-booking-card.component.ts` |

## Patient — Booking Detail

| Selector | Page / Component | Purpose | Source File |
|---|---|---|---|
| `patient-booking-detail-back-button` | Patient Booking Detail | Return to bookings | `src/app/portals/patient/booking-detail/patient-booking-detail.page.ts` |
| `patient-booking-detail-view-receipt-button` | Patient Booking Detail | Open receipt | `src/app/portals/patient/booking-detail/patient-booking-detail.page.ts` |
| `patient-booking-detail-cancel-open-button` | Patient Booking Detail | Open cancel modal | `src/app/portals/patient/booking-detail/patient-booking-detail.page.ts` |
| `patient-booking-detail-documents-button` | Patient Booking Detail | Open linked documents | `src/app/portals/patient/booking-detail/patient-booking-detail.page.ts` |
| `patient-booking-detail-labs-button` | Patient Booking Detail | Open linked lab results | `src/app/portals/patient/booking-detail/patient-booking-detail.page.ts` |
| `patient-booking-detail-cancel-modal-*` | Patient Booking Detail | Cancel modal controls through shared confirm modal | `src/app/portals/patient/booking-detail/patient-booking-detail.page.ts` |
| `patient-booking-detail-receipt-*` | Patient Booking Detail | Receipt modal controls | `src/app/portals/patient/booking-detail/patient-booking-detail.page.ts` |

## Admin — Booking Detail Actions

| Selector | Page / Component | Purpose | Source File |
|---|---|---|---|
| `admin-booking-detail-confirm-booking-button` | Admin Booking Detail | Confirm pending booking | `src/app/portals/admin/booking-detail/booking-detail.page.ts` |
| `admin-booking-detail-reject-booking-button` | Admin Booking Detail | Reject pending booking | `src/app/portals/admin/booking-detail/booking-detail.page.ts` |
| `admin-booking-detail-confirm-payment-button` | Admin Booking Detail | Confirm payment/proof | `src/app/portals/admin/booking-detail/booking-detail.page.ts` |
| `admin-booking-detail-reject-proof-button` | Admin Booking Detail | Reject proof | `src/app/portals/admin/booking-detail/booking-detail.page.ts` |
| `admin-booking-detail-mark-complete-button` | Admin Booking Detail | Mark visit complete | `src/app/portals/admin/booking-detail/booking-detail.page.ts` |
| `admin-booking-detail-mark-no-show-button` | Admin Booking Detail | Mark no-show | `src/app/portals/admin/booking-detail/booking-detail.page.ts` |
| `admin-booking-detail-reschedule-button` | Admin Booking Detail | Open reschedule action | `src/app/portals/admin/booking-detail/booking-detail.page.ts` |
| `admin-booking-detail-cancel-booking-button` | Admin Booking Detail | Cancel booking | `src/app/portals/admin/booking-detail/booking-detail.page.ts` |
| `admin-booking-detail-print-receipt-button` | Admin Booking Detail | Open receipt | `src/app/portals/admin/booking-detail/booking-detail.page.ts` |
| `admin-booking-detail-download-visit-summary-button` | Admin Booking Detail | Disabled visit summary action | `src/app/portals/admin/booking-detail/booking-detail.page.ts` |
| `admin-booking-detail-waive-payment-open-button` | Admin Booking Detail | Open waive payment modal | `src/app/portals/admin/booking-detail/booking-detail.page.ts` |
| `admin-booking-detail-refund-payment-open-button` | Admin Booking Detail | Open refund payment modal | `src/app/portals/admin/booking-detail/booking-detail.page.ts` |
| `admin-booking-detail-action-modal-*` | Admin Booking Detail | Generic action confirm modal controls | `src/app/portals/admin/booking-detail/booking-detail.page.ts` |
| `admin-booking-detail-waive-modal-*` | Admin Waive Modal | Waive modal controls | `src/app/portals/admin/components/waive-payment-modal/waive-payment-modal.component.ts` |
| `admin-booking-detail-refund-modal-*` | Admin Refund Modal | Refund modal controls | `src/app/portals/admin/components/refund-payment-modal/refund-payment-modal.component.ts` |
| `admin-booking-detail-receipt-*` | Admin Booking Detail | Receipt modal controls | `src/app/portals/admin/booking-detail/booking-detail.page.ts` |

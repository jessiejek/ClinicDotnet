# E2E Test Data Requirements

Generated: 2026-05-31 22:03 PDT
Source: API probing + Playwright test output against running backend

---

## Booking Creator Helpers

| File | Purpose |
|---|---|
| `tests/utils/booking-creator.ts` | UI wizard booking creation (no waitForTimeout) |
| `tests/utils/admin-helpers.ts` | API helpers: checkInBooking, doctorCompleteBooking, confirmBooking, cancelBooking |
| `tests/utils/booking-lookup.ts` | API lookup helpers: findPatientBookingByStatus, findStaffBookingByStatus, findPaidPatientBooking |

---

## Booking States Now Available in Database

Retrieved from `GET /api/bookings/me` (patient@gavino.clinic).

| Booking ID | Status | Payment | Doctor | Suitable For |
|---|---|---|---|---|
| `a460ac09-c795-4e44-b0d4-09e51f4837dd` | ✅ **Confirmed** | Unpaid | Dr. Jose Reyes | **Staff check-in test** (Booking A) |
| `a5980402-ce0e-4ca0-87a6-f1d557b88f2a` | ✅ **Confirmed** | Unpaid | Dr. Jose Reyes | **Patient cancel test** (Booking B) |
| `b8fec564-bcbd-413e-861d-66c6835a172c` | ✅ **Confirmed** | Unpaid | Dr. Jose Reyes | Alternative cancellable booking |
| `85948875-b2cc-464a-bfec-da0799f7a2c8` | ✅ **Confirmed** | Unpaid | Dr. Jose Reyes | Alternative cancellable booking |
| `dc1de3a3-2ac2-4c36-ad00-dae97cb5e869` | ✅ **CheckedIn** | Unpaid | Dr. Jose Reyes | **Doctor consultation** (Booking C) |
| `1919d769-4952-4b95-8bf9-2a2fbcac54a9` | ✅ **CheckedIn** | Unpaid | Dr. Jose Reyes | Alternative consultation booking |
| `11111111-1111-1111-1111-111111111101` | ✅ **CheckedIn** | Unpaid | Dr. Miguel Santos | Alternative consultation booking |
| `11111111-1111-1111-1111-111111111103` | ✅ **Completed** | **Paid** | Dr. Miguel Santos | **Receipt modal test** (blocked by app guard) |
| *(none)* | ❌ **Completed+Unpaid** | *needed* | — | **Staff payment confirm / waive test** |
| `11111111-1111-1111-1111-111111111102` | ProofSubmitted | Unpaid | Dr. Miguel Santos | Admin proof verification test |

---

## Flow-by-Flow Assessment

### Staff Check-In
- Requirement: Confirmed booking
- ✅ **UNBLOCKED** — 4 Confirmed bookings exist
- Test uses `findStaffBookingByStatus()` API lookup + `staff-bookings-checkin-button-{id}` data-testid selector
- ✅ **Verified**: found `85948875-b2cc-464a-bfec-da0799f7a2c8` → PATCH 200

### Staff Undo Check-In
- Requirement: CheckedIn booking
- ✅ **UNBLOCKED** — 4 CheckedIn bookings exist
- Test uses `findStaffBookingByStatus('CheckedIn')` + `staff-bookings-undo-checkin-button-{id}` data-testid
- ✅ **Verified**: found `3b883c89-9a6b-4506-a192-2ed5b76af97a` → PATCH 200

### Patient Cancel
- Requirement: Confirmed booking (non-checked-in)
- ✅ **UNBLOCKED** — `a5980402-ce0e-4ca0-87a6-f1d557b88f2a` and others exist

### Doctor Consultation
- Requirement: CheckedIn booking assigned to doctor
- ✅ **UNBLOCKED** — `dc1de3a3-2ac2-4c36-ad00-dae97cb5e869` (Dr. Jose Reyes)
- Booking C was successfully checked-in via admin API

### Staff Payment Confirm / Waive PF
- Requirement: Completed + Unpaid booking
- ❌ **BLOCKED** — No Completed+Unpaid booking exists
- For-payment endpoint returns empty array
- Tests gracefully skip with `ℹ️ No Confirm Payment buttons`

### Receipt Modal
- Requirement: Completed + Paid booking with receipt
- ✅ **UNBLOCKED** — Paid booking exists (`11111...111101` and `11111...111103`)
- **Fix applied**: `openReceipt()` used to call `GET /api/payments/{paymentId}` (404 — endpoint missing).
  Changed to `GET /api/payments/booking/{bookingId}` which exists and returns payment data.
- Test passes and opens the receipt modal successfully.
- See `src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:335` for the fix.

### Admin Booking Detail
- Requirement: Multiple booking statuses
- 🟡 **PARTIALLY UNBLOCKED** — ProofSubmitted and Completed exist; Pending status missing

---

## Producer Test (Booking A–E) Result

| Booking | Goal | Result |
|---|---|---|
| A: Confirmed | Staff check-in | ✅ **Created and used** — PATCH check-in 200 ✅ |
| B: Confirmed | Patient cancel | ✅ **Created** — available for cancel test |
| C: CheckedIn | Doctor consultation | ✅ **Created** — undo check-in PATCH 200 ✅ |
| D: Completed | Staff payment | ❌ **Slot exhaustion** |
| E: Completed | Receipt | ❌ **Slot exhaustion** |

**Staff phase updated check-in/undo flow:**
Both tests now use `findStaffBookingByStatus()` API lookup + data-testid
selectors. When a matching booking exists, the test clicks the specific
button and verifies the PATCH API response. When no booking exists in the
required state, the test skips gracefully with `[NEEDS TEST DATA]`.

---

## Remaining Blockers

| Blocker | Priority | Affects | Action Needed |
|---|---|---|---|
| No Completed+Unpaid booking | P0 | Staff payment/waive | Run producer with fresh DB or seed a booking through the full clinic workflow |
| ~~Receipt modal app guard~~ | P1 | Fixed: `payments/{paymentId}` → `payments/booking/{bookingId}` | ✅ **FIXED** |
| Slot exhaustion | P2 | Booking creation | Test at start of day or with reset DB |
| e2e-booking test fails when slots full | P2 | CI stability | Test should skip gracefully when no slots available |

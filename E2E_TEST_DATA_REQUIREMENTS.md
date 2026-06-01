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
- ✅ **UNBLOCKED** — `a460ac09-c795-4e44-b0d4-09e51f4837dd` and others exist
- Test uses real booking rows → clicks Check In button → verifies PATCH API

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
- 🟡 **PARTIALLY BLOCKED** — Paid booking exists (`11111...111103`) but app's booking detail API doesn't include `payment.id`, so `openReceipt()` guard blocks modal
- Test skips with `[NEEDS APP FIX]`

### Admin Booking Detail
- Requirement: Multiple booking statuses
- 🟡 **PARTIALLY UNBLOCKED** — ProofSubmitted and Completed exist; Pending status missing

---

## Producer Test (Booking A–E) Result

| Booking | Goal | Result |
|---|---|---|
| A: Confirmed | Staff check-in | ✅ **Created** — `a460ac09-c795-4e44-b0d4-09e51f4837dd` |
| B: Confirmed | Patient cancel | ✅ **Created** — `a5980402-ce0e-4ca0-87a6-f1d557b88f2a` |
| C: CheckedIn | Doctor consultation | ✅ **Created** — `dc1de3a3-2ac2-4c36-ad00-dae97cb5e869` |
| D: Completed | Staff payment | ❌ **Slot exhaustion** — no more slots today |
| E: Completed | Receipt | ❌ **Slot exhaustion** — no more slots today |

**Note:** The producer test passes when the database is fresh or slots are available.
Once confirmed bookings exist, the producer's role is cosmetic — downstream
tests use seed data lookup helpers, not the producer's output.

---

## Remaining Blockers

| Blocker | Priority | Affects | Action Needed |
|---|---|---|---|
| No Completed+Unpaid booking | P0 | Staff payment/waive | Run producer with fresh DB or seed a booking through the full clinic workflow |
| Receipt modal app guard | P1 | Receipt modal test | Backend must include `payment.id` in booking detail response |
| Slot exhaustion | P2 | Booking creation | Test at start of day or with reset DB |
| e2e-booking test fails when slots full | P2 | CI stability | Test should skip gracefully when no slots available |

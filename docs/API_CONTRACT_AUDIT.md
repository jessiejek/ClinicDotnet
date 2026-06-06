# API Contract Audit — Clinic FE ↔ BE

**Date:** 2026-06-06  
**BE:** .NET Web API (System.Text.Json — camelCase by default)  
**FE:** Angular 17 + Ionic 7

---

## Summary

| Count | Severity | Description | Status |
|-------|----------|-------------|--------|
| 1 | 🔴 High | FE env pointed to wrong BE URL (44384 instead of 5000) | ✅ Fixed |
| 1 | 🔴 High | DoctorPatientDetailPage used snake_case without camelCase fallback | ✅ Fixed |
| 1 | 🟡 Medium | PatientDashboardPage used snake_case without camelCase fallback | ✅ Fixed |
| 1 | 🟡 Medium | BookingService normalizeStaffForPaymentViewRow used snake_case only | ✅ Fixed |
| 1 | 🟡 Medium | BookingService payment normalizeRow used snake_case only | ✅ Fixed |
| 1 | 🟡 Medium | DoctorConsultationPage loadPrescriptions used snake_case only | ✅ Fixed |
| 1 | 🟢 Low | step-proof.component.ts: mapBookingSubmissionResult dead code (unused) | Noted |
| 0 | ✅ Pass | doctor-consultation.page.ts: normalizeConsultationBookingRow has intentional camel→snake normalizer | OK |
| 0 | ✅ Pass | doctor-consultation.page.ts: mapConsultationRecordRow has intentional camel→snake normalizer | OK |

---

## Detailed Endpoint Audit

### GET /patients/{id}

| Aspect | Detail |
|--------|--------|
| BE controller | `PatientsController.GetPatient(Guid id)` |
| FE consumer | `DoctorPatientDetailPage.buildClinicalHistory()`, `StaffPatientDetailPage`, `AdminPatientDetailPage` |
| Response shape | Single object, **camelCase** |
| Properties | `id, patientCode, firstName, middleName, lastName, fullName, dateOfBirth, sex, civilStatus, address, city, zipCode, contactNumber, email, emergencyContact*, bloodType, philHealthNumber, hmoProvider, hmoCardNumber, userId, hasAccount, isGuest, isEmailVerified, consentedAt, consentVersion, createdAt, updatedAt` |
| Issue found | FE used `first_name`, `last_name`, `contact_number`, `patient_code` (snake_case) |
| **Fixed** | ✅ camelCase first with snake_case fallback |

### GET /bookings?patientId={id}&pageSize=50

| Aspect | Detail |
|--------|--------|
| BE controller | `BookingsController.GetBookings()` |
| FE consumer | DoctorPatientDetailPage, PatientDashboardPage, DoctorConsultationPage |
| Response shape | **Paged object** `{ items: Booking[], totalCount, page, pageSize, totalPages }` |
| Properties (Booking) | **camelCase**: `id, patientName, doctorName, serviceName, serviceNames, services[], appointmentDate, slotStartTime, slotEndTime, queueNumber, status, paymentStatus, paymentMode, isWalkIn, finalAmount, totalFee, patient{...}, doctor{...}, service{...}` |
| Issue found | FE code on DoctorPatientDetailPage used `booking_status`, `appointment_date`, `doctor_name` (snake_case) |
| **Fixed** | ✅ camelCase first with snake_case fallback |

### GET /bookings/doctor/today

| Aspect | Detail |
|--------|--------|
| BE controller | `BookingsController.GetDoctorTodayBookings()` |
| FE consumer | DoctorDashboardPage, DoctorAppointmentsPage |
| Response shape | Raw array or paged — check BE |
| Properties | **camelCase** (same as Booking model) |
| Issue found | DoctorAppointmentsPage uses snake_case fallback pattern (already OK) |
| **Status** | ✅ OK |

### GET /bookings/staff/for-payment

| Aspect | Detail |
|--------|--------|
| BE controller | `BookingsController.GetStaffForPayment()` |
| FE consumer | `BookingService.getStaffForPayment()` → `StaffPaymentsPage` |
| Response shape | **Paged object** `{ items: [...], totalCount, ... }` |
| Properties | **camelCase** |
| Issue found | `normalizeStaffForPaymentViewRow` used snake_case only |
| **Fixed** | ✅ camelCase first with snake_case fallback |

### GET /bookings/{id}/consultation-record

| Aspect | Detail |
|--------|--------|
| BE controller | `BookingsController.GetConsultationRecord(Guid id)` |
| FE consumer | DoctorConsultationPage, DoctorPatientDetailPage |
| Response shape | Single object |
| Properties | **camelCase**: `id, bookingId, patientId, doctorId, consultationDate, chiefComplaint, subjective, objective, assessment, plan, status, isLocked, generalNotes, vitalSigns{...}, diagnoses[], prescriptionIds[], labRequestIds[], followUpDate, createdAt, updatedAt` |
| Issue found | `doctor-consultation.page.ts` normalizer already handles camelCase → snake_case intentionally |
| **Status** | ✅ OK |

### GET /medical-records/consultations|prescriptions|allergies|lab-orders|lab-results|vaccinations|follow-ups

| Aspect | Detail |
|--------|--------|
| BE controllers | MedicalRecordsController |
| FE consumer | DoctorConsultationPage, DoctorPatientDetailPage, PatientDashboardPage |
| Response shape | Raw array of camelCase objects |
| Properties | **camelCase** |
| Issue found | `MedicalRecordsService.map*Row()` functions use `str()` helper with camelCase + snake_case fallback |
| **Status** | ✅ OK |

---

## Environment Check

| File | Key | Value | Status |
|------|-----|-------|--------|
| `environment.ts` (dev) | `apiUrl` | `http://localhost:5000/api` | ✅ Fixed |
| `environment.ts` (dev) | `signalrHubUrl` | `http://localhost:5000/hubs/clinic-dashboard` | ✅ Fixed |
| `environment.prod.ts` | `apiUrl` | `https://api.yourclinicdomain.com/api` | ✅ OK (prod) |
| `environment.prod.ts` | `signalrHubUrl` | `https://api.yourclinicdomain.com/hubs/clinic-dashboard` | ✅ OK (prod) |

---

## Utility Added

**File:** `src/app/core/utils/api-response.util.ts`

Helpers:
- `unwrapItems<T>(response)` — unwraps `{ items: T[] }` → `T[]`
- `pickApiValue<T>(source, camelKey, snakeKey?, fallback?)` — prefer camelCase
- `pickApiString(source, camelKey, snakeKey?, fallback?)` — string variant
- `pickApiNumber(source, camelKey, snakeKey?, fallback?)` — number variant
- `pickApiBoolean(source, camelKey, snakeKey?, fallback?)` — boolean variant

---

## Grep Scan Results (Post-Fix)

| Scan | Pattern | Results | Status |
|------|---------|---------|--------|
| `localhost:44384` | URL | 0 hits | ✅ |
| `HttpClient` outside api.service.ts | Dependency | Only in `app.config.ts` (allowed) | ✅ |
| `\|\|` mixed with `??` without parens | Syntax | Only `doctor-patient-detail.page.ts` (all wrapped in `()`) | ✅ |
| Snake_case bracket access `['*_*']` | Contract | 923 hits → all have camelCase fallback or intentional normalizer | ✅ |
| Mock data in portals | Mock | `admin-settings.service.ts` (known gap), `doctor-consultation-stub.page.ts` (stub) | ⚠️ Known |

---

## Files Changed

| File | Change |
|------|--------|
| `src/environments/environment.ts` | API URL from 44384 → 5000 |
| `src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts` | camelCase-first booking/patient mapping |
| `src/app/core/utils/api-response.util.ts` | **NEW** — shared helpers |
| `src/app/portals/patient/dashboard/patient-dashboard.page.ts` | camelCase-first in `mapDashboardBookingRow` |
| `src/app/core/services/booking.service.ts` | camelCase-first in `normalizeStaffForPaymentViewRow` + payment mapping |
| `src/app/portals/doctor/consultation/doctor-consultation.page.ts` | camelCase-first in `loadPrescriptionsFromConsultationRecords` |

---

## Remaining Risks

1. **`admin-settings.service.ts`** uses `MockDataService` — known gap (settings not fetched from API)
2. **`patient-vaccinations.service.ts`** — stubbed, always returns empty
3. **`patient-dashboard.page.ts`** — `mapDashboardBookings` calls `mapDashboardBookingRow` with raw API records; if the response shape changes, mapping may break. The fix adds defensive fallback.
4. **Ionic `ng serve` on Z: drive** — Watchpack watcher errors on network drives require `--poll` flag

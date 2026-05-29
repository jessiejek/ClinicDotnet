# Selector Confidence Report — Patient Role

| Spec file | Selector used | Source file confirmed | Confidence | Notes |
|---|---|---|---|---|
| all | `.page-title` | All page components ✅ | HIGH | Standard class used across all patient pages |
| all | `.page-subtitle` | All page components ✅ | HIGH | Same pattern |
| all | `app-empty-state` | Shared component ✅ | HIGH | Angular component selector |
| all | `app-skeleton` | Shared component ✅ | HIGH | Loading state |
| all | `ion-spinner[name="crescent"]` | medical-records, prescriptions, vaccinations ✅ | HIGH | |
| all | `ion-toast` | Standard Ionic component ✅ | HIGH | |
| all | `app-confirm-modal` | booking-detail, bookings ✅ | HIGH | |
| dashboard | `.stat-card` | patient-dashboard.page.ts ✅ | HIGH | `template: <div class="stat-card">` |
| dashboard | `.stat-card__value` | patient-dashboard.page.ts ✅ | HIGH | `template: <div class="stat-card__value">` |
| dashboard | `.dashboard-doctors` | patient-dashboard.page.ts ✅ | HIGH | `template: <div class="dashboard-doctors">` |
| dashboard | `app-upcoming-appointment-card` | patient-dashboard.page.ts ✅ | HIGH | |
| dashboard | `app-banner` | patient-dashboard.page.ts ✅ | HIGH | |
| doctors | `app-doctor-card` | patient-doctors.page.ts ✅ | HIGH | `imports: [DoctorCardComponent]` |
| doctors | `.doctor-card__name` | doctor-card.component.ts ✅ | HIGH | `template: <div class="doctor-card__name">` |
| doctors | `a.btn-book` | doctor-card.component.ts ✅ | HIGH | `template: <a class="btn-book">` |
| doctors | `.page-loading` | patient-doctors.page.ts ✅ | HIGH | `template: <div class="page-loading">` |
| bookings | `table.clinic-table` | patient-bookings.page.ts ✅ | HIGH | `template: <table class="clinic-table">` |
| bookings | `app-patient-booking-card` | patient-bookings.page.ts ✅ | HIGH | |
| bookings | `.booking-filter` | patient-bookings.page.ts ✅ | HIGH | `template: <button class="booking-filter">` |
| bookings | `button:has-text("View Details")` | patient-bookings.page.ts ✅ | HIGH | `template: <button>View Details</button>` |
| bookings | `.bookings-loading` | patient-bookings.page.ts ✅ | HIGH | |
| medical-records | `.record-card.clinic-card` | patient-medical-records.page.ts ✅ | HIGH | `template: <article class="record-card clinic-card">` |
| medical-records | `.page-error` | patient-medical-records.page.ts ✅ | HIGH | `template: <div class="page-error">` |
| medical-records | `.page-error__title` | patient-medical-records.page.ts ✅ | HIGH | |
| medical-records | `ion-searchbar` | patient-medical-records.page.ts ✅ | HIGH | |
| prescriptions | `.prescription-card.clinic-card` | patient-prescriptions.page.ts ✅ | HIGH | |
| vaccinations | `.vac-card.clinic-card` | patient-vaccinations.page.ts ✅ | HIGH | |
| vaccinations | `ion-searchbar` | patient-vaccinations.page.ts ✅ | HIGH | |
| profile | `form[formGroup]` | patient-profile.page.ts ✅ | HIGH | `template: <form class="profile-card" [formGroup]="profileForm">` |
| profile | `ion-input[formControlName]` | patient-profile.page.ts ✅ | HIGH | All 18 fields use formControlName |
| profile | `.banner--warning` | patient-profile.page.ts ✅ | HIGH | |
| privacy-consent | `ion-checkbox` | patient-privacy-consent.page.ts ✅ | HIGH | `template: <ion-checkbox>` |
| privacy-consent | `.consent-text` | patient-privacy-consent.page.ts ✅ | HIGH | |
| reviews | `app-review-form` | patient-reviews.page.ts ✅ | HIGH | |
| reviews | `.error-message` | patient-reviews.page.ts ✅ | HIGH | |
| e2e-booking | `.service-option` | step-doctor-service.component.ts ✅ | HIGH | `template: <button class="service-option">` |
| e2e-booking | `.slot-chip` | step-slot-select.component.ts ✅ | HIGH | `template: <button class="slot-chip">` |
| e2e-booking | `.btn-primary` (Continue) | All step components ✅ | HIGH | |
| e2e-booking | `[name=/continue/i]` role button | All step components ✅ | HIGH | |
| e2e-booking | `[name=/confirm booking/i]` | step-payment.component.ts ✅ | HIGH | `template: <button>Confirm Booking</button>` |

## Confidence Key
- **HIGH** — Exact attribute/selector confirmed in template source code
- **MEDIUM** — Inferred from similar pattern, not directly confirmed
- **LOW** — Guessed, requires manual verification before running

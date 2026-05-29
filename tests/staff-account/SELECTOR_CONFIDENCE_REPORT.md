# Selector Confidence Report — Staff Account

| Spec file | Selector used | Source file confirmed | Confidence | Notes |
|---|---|---|---|---|
| `dashboard.spec.ts` | `getByRole('heading', { name: 'Dashboard' })` | `staff-dashboard.page.ts` | HIGH | Exact heading. |
| `dashboard.spec.ts` | `getByText('Go to Payment Queue')` | `staff-dashboard.page.ts` | HIGH | Exact banner text. |
| `dashboard.spec.ts` | `app-queue-table`, queue row text | `queue-table.component.ts` | HIGH | Child component rendered by dashboard. |
| `bookings.spec.ts` | `select.filter-input`, `input[type=date]` | `staff-bookings.page.ts` | HIGH | Exact CSS/input type. |
| `bookings.spec.ts` | `getByRole('button', { name: 'Check In' })` | `staff-bookings.page.ts` / queue labels | HIGH | Exact button text. |
| `booking-detail.spec.ts` | `getByRole('heading', { name: 'Booking Details' })` | `staff-booking-detail.page.ts` | HIGH | Exact heading. |
| `booking-detail.spec.ts` | `getByRole('button', { name: 'Check In' })` | `staff-booking-detail.page.ts` | HIGH | Exact action. |
| `payments.spec.ts` | `input[name=amountReceived]`, `input[name=referenceNumber]`, `textarea[name=paymentNotes]` | `staff-payments.page.ts` | HIGH | Exact `name` attributes. |
| `payments.spec.ts` | `getByRole('heading', { name: 'Collect Payment' })` | `staff-payments.page.ts` | HIGH | Modal heading has `id=collect-payment-title`. |
| `walk-in.spec.ts` | `getByLabel('Search patients')` | `staff-walk-in.page.ts` | HIGH | `ion-searchbar aria-label`. |
| `walk-in.spec.ts` | `ion-input[formcontrolname=dateOfBirth] input` | `staff-walk-in.page.ts` | MEDIUM | Ionic renders inner native input at runtime. |
| `walk-in.spec.ts` | `getByRole('radio', { name: 'Male' })` | `staff-walk-in.page.ts` | LOW | Ionic overlay runtime role may vary. Comment included. |
| `patients.spec.ts` | `getByLabel('Search patients')` | `staff-patients.page.ts` | HIGH | Exact aria-label. |
| `patient-detail.spec.ts` | `input[formcontrolname=email]`, `temporaryPassword`, `confirmTemporaryPassword` | `staff-patient-detail.page.html` | HIGH | Exact reactive form controls. |
| `doctor-status.spec.ts` | `input[id^=running-late-input-]` | `doctor-status-card.component.ts` | HIGH | Exact id prefix. |
| `doctor-status.spec.ts` | `getByRole('button', { name: /Set Running Late/ })` | `doctor-status-card.component.ts` | HIGH | Exact button text. |
| `profile.spec.ts` | `input[formcontrolname=fullName]`, `contactNumber`, `currentPassword`, `newPassword`, `confirmPassword` | `staff-profile.page.ts` | HIGH | Exact reactive form controls. |
| `admin-staff-accounts.spec.ts` | `getByRole('heading', { name: 'Staff Accounts' })` | `admin/staff/staff.page.ts` | HIGH | Exact heading. |
| `admin-staff-accounts.spec.ts` | `getByPlaceholder('Full Name')`, `Email`, `Phone (optional)` | `admin/staff/staff.page.ts` | HIGH | Exact placeholders. |
| all specs | `ion-toast` | Ionic ToastController usage in page files | HIGH | ToastController creates `ion-toast` at runtime. |
| all specs | `app-skeleton`, `.loading-card`, `.payment-loading`, `.loading-panel`, `ion-spinner` | Staff pages/components | HIGH | Source-confirmed loading selectors. |

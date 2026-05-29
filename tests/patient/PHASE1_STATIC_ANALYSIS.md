# PHASE 1 — STATIC ANALYSIS FOR PATIENT ROLE

Source: uploaded Angular/Ionic zip and route/project inventories.
Role/view: authenticated Patient portal.

## 1A. Route Inventory

| Route | Component file | Page title/header text found in source |
|---|---|---|
| `/patient/dashboard` | `src/app/portals/patient/dashboard/patient-dashboard.page.ts` | `Welcome back, ...`; stats: `Upcoming Appointments`, `Pending Payment Proof`, `Completed Visits`, `Active Prescriptions` |
| `/patient/doctors` | `src/app/portals/patient/doctors/patient-doctors.page.ts` | `Doctors` |
| `/patient/bookings` | `src/app/portals/patient/bookings/patient-bookings.page.ts` | `My Bookings` |
| `/patient/bookings/:id` | `src/app/portals/patient/booking-detail/patient-booking-detail.page.ts` | booking detail header + `Back to Bookings` |
| `/patient/documents` | `src/app/portals/patient/documents/patient-documents.page.ts` + `PatientMediaPanelComponent` | `Uploaded Documents`; `Upload a document` |
| `/patient/lab-results` | `src/app/portals/patient/lab-results/patient-lab-results.page.ts` + `PatientMediaPanelComponent` | `My Lab Results`; `Upload a lab result` |
| `/patient/labs` | `src/app/portals/patient/labs-redirect/patient-labs-redirect.page.ts` | blank redirect to `/patient/lab-results` |
| `/patient/medical-records` | `src/app/portals/patient/medical-records/patient-medical-records.page.ts` | `Medical Records` |
| `/patient/prescriptions` | `src/app/portals/patient/prescriptions/patient-prescriptions.page.ts` | `Prescriptions` |
| `/patient/vaccinations` | `src/app/portals/patient/vaccinations/patient-vaccinations.page.ts` | `My Vaccinations` |
| `/patient/profile` | `src/app/portals/patient/profile/patient-profile.page.ts` | `Profile` |
| `/patient/reviews/:bookingId` | `src/app/portals/patient/reviews/patient-reviews.page.ts` | review page with `Back to Booking` |
| `/patient/privacy-consent` | `src/app/portals/patient/privacy-consent/patient-privacy-consent.page.ts` | `Privacy Consent`; `Clinic Privacy Policy` |

All Patient child routes are under `PatientLayoutComponent` and guarded by `authGuard + roleGuard` for `Patient` role.

## 1B. Selector Inventory

| Page | Element type | Label/text | Selector type | Selector value | Confirmed in source? |
|---|---|---|---|---|---|
| Dashboard | Button | Book Appointment | role/text | `button:has-text("Book Appointment")` | Yes |
| Dashboard | Button | View My Bookings | role/text | `button:has-text("View My Bookings")` | Yes |
| Dashboard | Link | View all doctors → | text | `text=View all doctors` | Yes |
| Dashboard | Loading | skeleton dashboard | CSS | `.dashboard-loading`, `.skel-hero`, `.skel-stat`, `.skel-panel` | Yes |
| Dashboard | Empty | No doctors available | text/component | `app-empty-state`, `text=No doctors available` | Yes |
| Dashboard | Empty | No upcoming appointment | text/component | `app-empty-state`, `text=No upcoming appointment` | Yes |
| Doctors | Loading | Loading doctors | CSS | `.page-loading` | Yes |
| Doctors | Empty/Error | Unable to load doctors / No active doctors available | text/component | `app-empty-state` | Yes |
| Bookings | Button filters | All, Upcoming, For Payment, Completed, Cancelled | role/text | `button.booking-filter` | Yes |
| Bookings | Buttons | Previous, Next | role/text | `.bookings-pagination__button` | Yes |
| Bookings | Buttons | View Details, Cancel | role/text | `button:has-text("View Details")`, `button:has-text("Cancel")` | Yes |
| Bookings | Loading | row skeleton | component/CSS | `.bookings-loading`, `app-skeleton` | Yes |
| Bookings | Empty/Error | No bookings found / Unable to load bookings | component/text | `app-empty-state` | Yes |
| Booking Detail | Buttons | Back to Bookings, View Receipt, Cancel Booking | role/text | role button text | Yes |
| Booking Detail | Buttons | Navigate to documents/lab results | role/text | buttons with `navigateToDocuments()` / `navigateToLabResults()` | Yes |
| Documents/Lab Results | File input | Choose a file | CSS | `input[type="file"].visually-hidden`; `.file-picker` | Yes |
| Documents/Lab Results | Inputs | Optional document title / Optional result title | placeholder | `[placeholder="Optional document title"]`, `[placeholder="Optional result title"]` | Yes |
| Documents/Lab Results | Textarea | Description / Result Notes | CSS/form control | `textarea.filter-input` | Yes |
| Documents/Lab Results | Select | Related Booking | component | `ion-select.filter-input` | Yes |
| Documents/Lab Results | Button | Upload Document / Upload Result / Reset / Retry | role/text | role button text | Yes |
| Documents/Lab Results | Search | Search by file name, title, notes, or linked IDs | placeholder | `ion-searchbar[placeholder=...]` | Yes |
| Medical Records | Search | Search by doctor, diagnosis, soap notes, or follow-up | placeholder | `ion-searchbar` | Yes |
| Medical Records | Button | Download All PDF / Download Medical Record PDF / Download Summary PDF / Retry | role/text | role button text | Yes |
| Prescriptions | Search | Search by doctor, medicine, route, or instructions | placeholder | `ion-searchbar` | Yes |
| Prescriptions | Button | Download Prescription PDF / Download Summary PDF / Retry | role/text | role button text | Yes |
| Vaccinations | Search | Search by vaccine name, manufacturer, or notes | placeholder | `ion-searchbar` | Yes |
| Vaccinations | Button | Retry | role/text | `button:has-text("Retry")` | Yes |
| Profile | Inputs | firstName, middleName, lastName, dateOfBirth, contactNumber, email, address, city, zipCode, emergency contacts, HMO, PhilHealth | formControlName | `[formControlName="..."]` | Yes |
| Profile | Selects | sex, civilStatus, bloodType | formControlName | `ion-select[formControlName="..."]` | Yes |
| Profile | Password Inputs | currentPassword, newPassword, confirmPassword | formControlName | `[formControlName="currentPassword"]` etc. | Yes |
| Profile | Buttons | Save Profile, Submit Consent, Change Password | role/text | role button text | Yes |
| Reviews | Button | Back to Booking | role/text | `button:has-text("Back to Booking")` | Yes |
| Reviews | Form | Review form | component | `app-review-form` | Yes |
| Privacy Consent | Checkbox | I have read and accept... | component | `ion-checkbox` | Yes |
| Privacy Consent | Button | Accept Consent | role/text | `button:has-text("Accept Consent")` | Yes |

## 1C. API Call Inventory

| Page | Method | Endpoint | Trigger | Response used for | Error handler exists? | Error handler type |
|---|---|---|---|---|---|---|
| Dashboard | GET | `patients/me` | init | welcome/patient id | Yes | SILENT fallback to undefined |
| Dashboard | GET | `bookings?page=1&pageSize=100` | after patient load | counts/upcoming | Yes | SILENT fallback to [] |
| Dashboard | GET | `medical-records/consultations?patientId=...` | after patient load | recent records | Yes | SILENT fallback to [] |
| Dashboard | GET | `medical-records/prescriptions?patientId=...` | after patient load | recent prescriptions | Yes | SILENT fallback to [] |
| Doctors | GET | `doctors` | init/view enter/retry | doctor cards | Yes | UI error via `loadError` |
| Bookings | GET | `bookings/me?page=...&pageSize=20` | init/view enter/retry | booking table/cards | Yes | UI error via `loadError` |
| Bookings | PATCH | `bookings/{id}/cancel` | confirm cancel | optimistic status update | Partial | SWALLOWED/UNCATCHED promise |
| Booking Detail | GET | `patients/me` | init | ownership/context | Yes | SILENT fallback |
| Booking Detail | GET | `bookings/{id}` | init | detail | No explicit catch | NONE risk |
| Booking Detail | PATCH | `bookings/{id}/cancel` | cancel button | cancel action | Partial | unawaited firstValueFrom |
| Booking Detail | GET | `payments/{paymentId}` | view receipt | receipt modal | Yes | TOAST on error |
| Documents | GET | `patients/me/documents` | media panel init/retry | document gallery | Yes | UI error |
| Documents | GET | `bookings?page=1&pageSize=100` | media panel init | booking select | Yes | SILENT fallback to [] |
| Documents | POST FormData | `patients/me/documents` | upload form submit | uploaded item | Yes | TOAST |
| Lab Results | GET | `patients/me/lab-results` | media panel init/retry | lab gallery | Yes | UI error |
| Lab Results | POST FormData | `patients/me/lab-results` | upload form submit | uploaded item | Yes | TOAST |
| Medical Records | GET | `medical-records/me` | init/retry | medical records | Yes | UI error |
| Medical Records | GET Blob | `patient-documents/me/medical-records/{id}/pdf` | download | PDF | Yes | TOAST |
| Prescriptions | GET | `prescriptions/me` | init/retry | prescription cards | Yes | UI error |
| Prescriptions | GET Blob | `patient-documents/me/prescriptions/{id}/pdf` | download | PDF | Yes | TOAST |
| Vaccinations | n/a | none | service returns `of([])` | empty state only | n/a | STUB service |
| Profile | GET | `patients/me` | init | profile form | Yes | TOAST + banner/loadError |
| Profile | PUT | `patients/me` | save profile | updated profile | Yes | TOAST |
| Profile | POST | `patients/me/consent` | submit consent | updated consent | Yes | TOAST |
| Reviews | GET | `patients/me` | init | patient context | Yes | SILENT fallback |
| Reviews | GET | `bookings/{bookingId}` | init | booking snapshot | Yes | SILENT fallback |
| Reviews | GET | `reviews?bookingId=...` | init | existing review check | Partial | CONSOLE/SILENT assumes none |
| Reviews | POST | `reviews` | submit review | created review | Yes | inline error + console warning |
| Privacy Consent | GET | `patients/me` | init | patient/current consent | Yes | SILENT fallback to null; blank risk |
| Privacy Consent | POST | `patients/me/consent` | accept consent | updated consent | Yes | TOAST |

## 1D. Data Shape Inventory

| Endpoint | Expected response shape | Null-risk fields | Zero-risk fields | Empty array-risk fields |
|---|---|---|---|---|
| `patients/me` | patient object with id/name/contact/profile fields | `id`, `firstName`, `lastName`, `email`, `consentedAt` | n/a | n/a |
| `doctors` | `Doctor[]` | `id`, `fullName`, `specialization` | `consultationFee=0` | empty doctors array |
| `bookings/me?...` | `{ items, totalCount }` or `Booking[]` | `id`, `doctorName`, `serviceName`, `appointmentDate`, `slotStartTime`, `status`, `paymentStatus` | `queueNumber=0`, `amountDue=0`, `finalAmount=0` | empty bookings array |
| `bookings/{id}` | booking object | `id`, `doctorName`, `serviceName`, `appointmentDate`, `payment` | `amountDue=0`, `queueNumber=0` | n/a |
| `patients/me/documents` | `PatientDocument[]` | `id`, `fileName`, `title`, `fileUrl`, `uploadedAt` | n/a | empty docs array |
| `patients/me/lab-results` | `PatientLabResult[]` | `id`, `fileName`, `resultTitle`, `fileUrl`, `uploadedAt` | n/a | empty lab result array |
| `medical-records/me` | `PatientMedicalRecord[]` | `id`, `doctorName`, `appointmentDate`, `diagnosis`, `soapNotes`, `bookingId` | n/a | empty records array |
| `prescriptions/me` | `PatientPrescription[]` | `id`, `doctorName`, `appointmentDate`, `items`, `bookingId` | `items.length=0` | empty prescriptions array |
| vaccination service | hardcoded `Observable<[]>` | all populated fields unreachable | zero count always | always empty |
| `reviews?bookingId=...` | review object/array | `id`, `rating`, `comment` | `rating=0` | empty reviews array means form allowed |

## 1E. Risk Flags

| Page | Risk type | Description | Suspected file | Severity |
|---|---|---|---|---|
| Dashboard | SWALLOWED_ERROR | key data streams catch errors and silently render fallback/empty states | `patient-dashboard.page.ts` | Medium |
| Bookings | SWALLOWED_ERROR | cancel uses `void firstValueFrom(...)` and immediately updates UI without awaiting/catching API failure | `patient-bookings.page.ts` | High |
| Booking Detail | NO_ERROR_BOUNDARY | `bookings/{id}` load has no explicit page-level catch in combined stream | `patient-booking-detail.page.ts` | High |
| Booking Detail | SWALLOWED_ERROR | cancel action uses unawaited request | `patient-booking-detail.page.ts` | High |
| Documents/Lab Results | MISSING_TEST_ID | upload/select controls have classes/placeholders but no stable test ids | `patient-media-panel.component.ts` | Medium |
| Vaccinations | STUB_COMPONENT | `PatientVaccinationsService` says table not deployed and returns `of([])` | `patient-vaccinations.service.ts` | High |
| Reviews | SWALLOWED_ERROR | reviews endpoint failure is logged and treated as no existing review | `patient-reviews.page.ts` | Medium |
| Privacy Consent | NO_ERROR_BOUNDARY | `patients/me` failure becomes null and template `*ngIf="currentPatient && settings"` can render blank | `patient-privacy-consent.page.ts` | High |

## Phase 1 completion status

- Route inventory: complete for Patient routes.
- Selector inventory: only source-confirmed selectors included; uncertain component-internal selectors are flagged in spec comments.
- API inventory: complete from route page source and patient media panel child source.
- Data shape inventory: inferred from frontend mapping/rendering logic.
- Risks: encoded in tests as expected failures where source behavior is currently deficient or stubbed.

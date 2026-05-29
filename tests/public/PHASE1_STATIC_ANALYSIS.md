# PUBLIC Role/View — Phase 1 Static Analysis

Generated from the uploaded Angular/Ionic source zip. Selectors below are taken from actual source files only. Backend response contracts are inferred from frontend DTO/model usage; backend runtime behavior remains TEAM TO VERIFY.

## 1A. Route Inventory

| Route | Component file | Page title/header text found in source |
|---|---|---|
| `/public` | `src/app/portals/public/home/home.page.ts` | `Your Health, Our Priority`, `Meet Our Doctors`, `Our Services`, `Clinic Announcements` |
| `/public/doctors` | `src/app/portals/public/doctors/doctors.page.ts` | `Our Doctors` |
| `/public/doctors/:id` | `src/app/portals/public/doctor-profile/doctor-profile.page.ts` | dynamic `{{ d.fullName }}`, `About {{ d.fullName }}`, `Services Offered`, `Clinic Schedule`, `Patient Reviews` |
| `/public/services` | `src/app/portals/public/services/services.page.ts` | `Our Services` |
| `/public/announcements` | `src/app/portals/public/announcements/announcements.page.ts` | `Announcements` |
| `/public/booking` | `src/app/portals/public/booking/booking.page.ts` + `app-booking-wizard` children | `Choose your doctor and services`, `Select your appointment date`, `Select your preferred time`, `Review your booking`, `Login required`, `Confirm your booking` |
| `/public/booking-confirmation/:bookingId` | `src/app/portals/public/booking-confirmation/booking-confirmation.page.ts` | `Booking Confirmed!`, `Booking Not Found` |
| `/public/privacy-policy` | `src/app/portals/public/privacy-policy/privacy-policy.page.ts` | `Privacy Policy` |

## 1B. Selector Inventory

| Page | Element type | Label/text | Selector type | Selector value | Confirmed in source? |
|---|---|---|---|---|---|
| Global public shell | Link | Home | CSS/text | `.navbar__links a[routerLink="/public"]`, `.mobile-menu a[routerLink="/public"]`, `.footer-link` | Yes |
| Global public shell | Link | Doctors | CSS/text | `a[routerLink="/public/doctors"]` | Yes |
| Global public shell | Link | Services | CSS/text | `a[routerLink="/public/services"]` | Yes |
| Global public shell | Link | Announcements | CSS/text | `a[routerLink="/public/announcements"]` | Yes |
| Global public shell | Link | Login | CSS/text | `a[routerLink="/auth/login"]` | Yes |
| Global public shell | Link | Book Appointment | CSS/text | `.navbar-book-btn`, `a[routerLink="/public/booking"]` | Yes |
| Global public shell | Button | Toggle menu | CSS/ARIA | `.navbar__hamburger[aria-label="Toggle menu"]` | Yes |
| `/public` | Link | Book an Appointment | CSS/text | `.hero__cta-primary.hero-link` | Yes |
| `/public` | Link | Meet Our Doctors | CSS/text | `.hero__cta-secondary.hero-link` | Yes |
| `/public` | Link | View All Doctors → | CSS/text | `.btn-outline[routerLink="/public/doctors"]` | Yes |
| `/public` | Data display | Doctor cards | CSS | `.doctors-grid app-doctor-card`, `.doctor-card` | Yes |
| `/public` | Data display | Service category cards | CSS | `.services-grid app-service-category-card` | Yes |
| `/public` | Data display | Announcement cards | CSS | `.announcements-grid app-announcement-card` | Yes |
| `/public/doctors` | Button | specialization filters, dynamic `{{ spec }}` | CSS/text | `.filter-pill`, `button[type="button"]` | Yes |
| `/public/doctors` | Loading indicator | spinner | CSS | `.page-loading ion-spinner` | Yes |
| `/public/doctors` | Empty state | `No data found` | Text/component | `app-empty-state[title="No data found"]` | Yes |
| `/public/doctors` | Data display | doctor card grid | CSS | `.doctors-grid app-doctor-card`, `.doctor-card` | Yes |
| `/public/doctors` | Link | Book Now | CSS/text | `.doctor-card .btn-book` | Yes |
| `/public/doctors` | Link | View profile | CSS/ARIA | `.doctor-card .btn-profile[aria-label="View profile"]` | Yes |
| `/public/doctors/:id` | Loading indicator | `Loading…` | CSS/text | `.profile-loading` | Yes |
| `/public/doctors/:id` | Empty state | `Doctor not found` | Text/component | `app-empty-state[title="Doctor not found"]` | Yes |
| `/public/doctors/:id` | Link | `Book Appointment with {{ d.fullName }}` | CSS/text | `.profile-book-btn` | Yes |
| `/public/doctors/:id` | Data display | profile name | CSS | `.profile-name` | Yes |
| `/public/doctors/:id` | Data display | services | CSS | `.service-list .service-row` | Yes |
| `/public/doctors/:id` | Data display | schedule lines | CSS | `.schedule-list li` | Yes |
| `/public/doctors/:id` | Data display | reviews | CSS/component | `.reviews-list app-review-card` | Yes |
| `/public/services` | Button | category filters | CSS/text | `.filter-pill`, `button[type="button"]` | Yes |
| `/public/services` | Loading indicator | spinner | CSS | `.page-loading ion-spinner` | Yes |
| `/public/services` | Empty state | `No data found` | Text/component | `app-empty-state[title="No data found"]` | Yes |
| `/public/services` | Data display | service cards | CSS | `.service-item` | Yes |
| `/public/services` | Data display | service name | CSS | `.service-item__name` | Yes |
| `/public/services` | Data display | service description | CSS | `.service-item__desc` | Yes |
| `/public/services` | Data display | fee | CSS | `.service-item__fee` | Yes |
| `/public/announcements` | Loading indicator | skeleton cards | CSS/component | `.skeleton-grid app-skeleton` | Yes |
| `/public/announcements` | Empty state | `No active announcements right now. Check back soon.` | Text/CSS | `.empty-hint` | Yes |
| `/public/announcements` | Data display | announcement card | CSS/component | `.announcements-grid app-announcement-card`, `.announcement-card` | Yes |
| `/public/booking` | Loading indicator | booking wizard spinner | CSS | `.wizard-loading ion-spinner` | Yes |
| `/public/booking` | Button | Select Doctor | CSS/text | `.doctor-grid .doctor-card`, `.doctor-card__cta` | Yes |
| `/public/booking` | Button | Change Doctor | CSS/text | `.btn-ghost` | Yes |
| `/public/booking` | Button | service option | CSS | `.service-option` | Yes |
| `/public/booking` | Button | Back | CSS/text | `.wizard-actions .btn-outline` | Yes |
| `/public/booking` | Button | Continue | CSS/text | `.wizard-actions .btn-primary` | Yes |
| `/public/booking` | Button | previous/next month | CSS | `.calendar-header .btn-icon` | Yes |
| `/public/booking` | Button | calendar day | CSS | `.calendar-cell` | Yes |
| `/public/booking` | Button | time slot | CSS | `.slot-chip` | Yes |
| `/public/booking` | Link | Log In | CSS/text | `a.btn-primary[routerLink="/auth/login"]` | Yes |
| `/public/booking` | Link | Create Account | CSS/text | `a.btn-outline[routerLink="/auth/register"]` | Yes |
| `/public/booking` | Textarea | Notes for clinic | CSS/id | `#booking-notes`, `.filter-input` | Yes |
| `/public/booking` | Button | Confirm Booking | CSS/text | `.btn-primary` in `step-payment` | Yes |
| `/public/booking` | Empty state | `No doctors available` | Text/component | `app-empty-state[title="No doctors available"]` | Yes |
| `/public/booking` | Empty state | `No services available` | Text/component | `app-empty-state[title="No services available"]` | Yes |
| `/public/booking` | Empty state | `No available slots for this date.` | Text/CSS | `.slot-empty` | Yes |
| `/public/booking-confirmation/:bookingId` | Loading indicator | `Loading booking details...` | Text/CSS | `.page-loading` | Yes |
| `/public/booking-confirmation/:bookingId` | Button | View My Appointments | CSS/text | `.btn-primary[routerLink="/patient/bookings"]` | Yes |
| `/public/booking-confirmation/:bookingId` | Button | Create Account | CSS/text | `.btn-primary[routerLink="/auth/register"]` | Yes |
| `/public/booking-confirmation/:bookingId` | Button | Back to Home | CSS/text | `.btn-outline[routerLink="/public"]`, `.btn-primary[routerLink="/public"]` | Yes |
| `/public/booking-confirmation/:bookingId` | Error state | `Booking Not Found` | Text/CSS | `.confirmation-title` | Yes |
| `/public/privacy-policy` | Link | Back to Home | CSS/text | `.back-link[routerLink="/public"]` | Yes |
| `/public/privacy-policy` | Link | support email | CSS/href | `a[href="mailto:support@yourclinicdomain.com"]` | Yes |
| `/public/privacy-policy` | Data display | policy sections | CSS | `.policy-section`, `.policy-section__title` | Yes |

## 1C. API Call Inventory

| Page | Method | Endpoint | Trigger | Response used for | Error handler exists? | Error handler type |
|---|---|---|---|---|---|---|
| `/public` | GET | `doctors` | page render | doctor cards | No | NONE / async pipe |
| `/public` | GET | `services` | page render | service category counts | No | NONE / async pipe |
| `/public` | GET | `announcements` | page render | latest announcement cards | No | NONE / async pipe |
| `/public` | GET | `settings` | page render | operating-hours bar | No | NONE / async pipe |
| Public footer | GET | `doctors` | shell render | footer doctor links | No | NONE / async pipe |
| `/public/doctors` | GET | `doctors` | `ngOnInit` | list/filter grid | Yes | TOAST + fallback empty array + finalize |
| `/public/doctors/:id` | GET | `doctor-day-status/:id` | `ngOnInit` | running late/unavailable banner | Yes | SILENT fallback `null` |
| `/public/doctors/:id` | GET | `doctors/:id` | `ngOnInit` forkJoin | profile detail | No | NONE / forkJoin subscription no error handler |
| `/public/doctors/:id` | GET | `reviews?doctorId=:id` | `ngOnInit` forkJoin | review cards/count | No | NONE / forkJoin subscription no error handler |
| `/public/doctors/:id` | GET | `doctors/:id/schedule` | `ngOnInit` forkJoin | schedule lines | No | NONE / forkJoin subscription no error handler |
| `/public/services` | GET | `services` | `ngOnInit` | service list/category blocks | Yes | TOAST + fallback empty array + finalize |
| `/public/announcements` | GET | `announcements` | `ngOnInit` | announcement cards | No | NONE / subscription no error handler |
| `/public/booking` | GET | `services` | route query param when `serviceId` exists without doctorId | preselect doctor/service | Yes | SILENT fallback null |
| Booking step 1 | GET | `doctors` | wizard render | doctor choices | Yes | TOAST + empty list |
| Booking step 1 | GET | `doctors/:doctorId/services` | doctor selected | service options | Yes | TOAST + inline empty/error state |
| Booking step 2 | GET | `doctors/:doctorId/schedule` | step render after doctor selected | calendar working days | Yes | TOAST + empty schedule |
| Booking step 3 | GET | `doctors/:doctorId/available-slots?date=:date` | date selected | slot chips | Yes | TOAST + empty slots |
| Booking step 4 | GET | `doctors` | review step render | doctor name | Yes | SILENT fallback empty array |
| Booking step 4 | GET | `doctors/:doctorId/services` | review step render | service summary | Yes | SILENT fallback empty array |
| Booking step 6 | GET | `doctors` | payment step render | final check doctor | Yes | SILENT fallback empty array |
| Booking step 6 | GET | `doctors/:doctorId/services` | payment step render | final check services | Yes | SILENT fallback empty array |
| Booking step 6 | POST | `bookings` | Confirm Booking | create booking | Yes | TOAST success/error |
| `/public/booking-confirmation/:bookingId` | GET | `bookings/:bookingId/public-summary` | direct/bookmarked confirmation | booking summary | No | NONE / stream no catchError |
| `/public/privacy-policy` | None | None | Static page | Static policy content | N/A | N/A |

## 1D. Data Shape Inventory

| Endpoint | Expected response shape | Null-risk fields | Zero-risk fields | Empty array-risk fields |
|---|---|---|---|---|
| `doctors` | `Doctor[]` with `id`, `fullName`, `specialization`, `status`, `consultationFee`, `averageRating?`, `reviewCount?` | `fullName`, `specialization`, `status`, `consultationFee` | `consultationFee`, `reviewCount`, `averageRating` | doctors list |
| `doctors/:id` | `DoctorDetail` with `id`, `fullName`, `specialization`, `bio?`, `consultationFee?`, `licenseNumber?`, `ptrNumber?`, `averageRating?`, `services?` | `fullName`, `specialization`, `consultationFee`, `bio` | `consultationFee`, `averageRating`, `reviewCount` | `services` |
| `services` | `Service[]` with `id`, `name`, `description?`, `category`, `estimatedDurationMinutes`, `price`, `doctorIds` | `name`, `category`, `estimatedDurationMinutes`, `price`, `doctorIds` | `price`, `estimatedDurationMinutes` | services list |
| `doctors/:id/services` | `Service[]` same as above | `name`, `category`, `estimatedDurationMinutes`, `price` | `price`, `estimatedDurationMinutes` | selected doctor services |
| `announcements` | `Announcement[]` with `id`, `title`, `body`, `imageUrl?`, `createdAt` | `title`, `body`, `createdAt` | N/A | announcements list |
| `reviews?doctorId=:id` | `Review[]` with rating/comment/name/date fields used by `app-review-card` | review display fields [TEAM TO VERIFY from model] | rating | reviews list |
| `doctors/:id/schedule` | schedule row array with `dayOfWeek`, `startTime`, `endTime` | `dayOfWeek`, `startTime`, `endTime` | N/A | schedule lines |
| `doctors/:id/available-slots?date=:date` | slot array with `slotStartTime`, `slotEndTime`, `isAvailable`, `capacity`, `bookedCount` | `slotStartTime`, `slotEndTime`, `isAvailable` | `bookedCount`, `capacity` | slot list |
| `doctor-day-status/:id` | `{ status: 'Available'|'RunningLate'|'UnavailableToday', runningLateMinutes? }` or null | `status` | `runningLateMinutes` | N/A |
| `bookings` POST | `{ id: string, queueNumber: number|null }` | `id` | `queueNumber` | N/A |
| `bookings/:id/public-summary` | `{ id, queueNumber?, doctorName?, appointmentDate?, slotStartTime?, slotEndTime?, serviceName?, totalFee?, paymentStatus? }` | `id`, `doctorName`, `appointmentDate`, `slotStartTime`, `slotEndTime`, `serviceName` | `queueNumber`, `totalFee` | N/A |
| `settings` | `ClinicSettings` with `clinicName`, `operatingHours`, contact/social fields | `clinicName`, `operatingHours` | N/A | N/A |

## 1E. Risk Flags

| Page | Risk type | Description | Suspected file | Severity |
|---|---|---|---|---|
| `/public` | MISSING_LOADING_STATE | Home uses direct async pipe calls but no loading UI/empty state for doctors/services/announcements/settings. | `src/app/portals/public/home/home.page.ts` | Medium |
| `/public` | NO_ERROR_BOUNDARY | API errors in async pipe can surface as console errors without user-facing recovery. | `src/app/portals/public/home/home.page.ts` | High |
| Public footer | NO_ERROR_BOUNDARY | Footer calls `doctors` through async pipe with no catchError. | `src/app/portals/public/components/public-footer/public-footer.component.ts` | Medium |
| `/public/doctors` | MISSING_NULL_GUARD | `specializations` maps `d.specialization`; null/undefined specialization can render odd filter values. | `src/app/portals/public/doctors/doctors.page.ts` | Medium |
| `/public/doctors/:id` | NO_ERROR_BOUNDARY | Main forkJoin subscription has no error callback/catchError; doctor/review/schedule failure can keep `isLoading=true`. | `src/app/portals/public/doctor-profile/doctor-profile.page.ts` | High |
| `/public/doctors/:id` | MISSING_NULL_GUARD | `d.fullName`, `d.specialization`, `d.consultationFee`, `d.bio` render directly. | `src/app/portals/public/doctor-profile/doctor-profile.page.ts` | Medium |
| `/public/services` | MISSING_NULL_GUARD | `service.estimatedDurationMinutes` renders directly; null becomes blank/`null min`. | `src/app/portals/public/services/services.page.ts` | Medium |
| `/public/announcements` | NO_ERROR_BOUNDARY | `announcements` subscription has no error handler or finalize; skeleton can remain forever on API failure. | `src/app/portals/public/announcements/announcements.page.ts` | High |
| `/public/booking` | MISSING_EMPTY_STATE | Date picker has no explicit empty state when doctor schedule returns empty; only console warning is present. | `src/app/portals/public/components/step-date-picker/step-date-picker.component.ts` | Medium |
| `/public/booking` | SWALLOWED_ERROR | Review/payment summary calls catchError to `of([])` without user-facing feedback. | `step-review.component.ts`, `step-payment.component.ts`, `booking-summary-bar.component.ts` | Medium |
| `/public/booking-confirmation/:bookingId` | NO_ERROR_BOUNDARY | Public-summary request has no catchError; API failure can break VM stream and leave blank/loading UI. | `src/app/portals/public/booking-confirmation/booking-confirmation.page.ts` | High |
| `/public/privacy-policy` | STATIC_LEGAL_TEMPLATE | Page says legal review is strongly recommended before production use. | `src/app/portals/public/privacy-policy/privacy-policy.page.ts` | Medium |

## Phase 1 Completion Notes

- All public route/page files and booking child step components were inspected.
- Every selector used in generated tests is present in the source or flagged in `SELECTOR_CONFIDENCE_REPORT.md`.
- API response shapes are frontend-inferred and should be verified against backend OpenAPI/Swagger before locking the test suite as contractual.

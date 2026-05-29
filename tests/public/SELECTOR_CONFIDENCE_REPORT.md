# PUBLIC Selector Confidence Report

| Spec file | Selector used | Source file confirmed | Confidence | Notes |
|---|---|---|---|---|
| `home.spec.ts` | `getByRole('heading', { name: 'Your Health, Our Priority' })` | `src/app/portals/public/components/hero-section/hero-section.component.ts` | HIGH | Static hero `<h1>`. |
| `home.spec.ts` | `getByRole('link', { name: 'Book an Appointment' })` | `hero-section.component.ts`, `public-navbar.component.ts` | HIGH | Multiple matching links; test uses `.first()`. |
| `home.spec.ts` | `getByRole('link', { name: 'Meet Our Doctors' })` | `hero-section.component.ts` | HIGH | Static hero CTA. |
| `home.spec.ts` | `getByRole('link', { name: 'View All Doctors →' })` | `src/app/portals/public/home/home.page.ts` | HIGH | Static link. |
| `home.spec.ts` | `.doctors-grid app-doctor-card` | `home.page.ts` | HIGH | Data-driven doctor card list. |
| `home.spec.ts` | `.services-grid app-service-category-card` | `home.page.ts` | HIGH | Data-driven service category list. |
| `home.spec.ts` | `.announcements-grid app-announcement-card` | `home.page.ts` | HIGH | Data-driven announcement cards. |
| `doctors.spec.ts` | `getByRole('heading', { name: 'Our Doctors' })` | `src/app/portals/public/doctors/doctors.page.ts` | HIGH | Static `<h1>`. |
| `doctors.spec.ts` | `.page-loading ion-spinner` | `doctors.page.ts` | HIGH | Loading spinner. |
| `doctors.spec.ts` | `.filter-pill` | `doctors.page.ts` | HIGH | Specialization filter buttons. |
| `doctors.spec.ts` | `.doctors-grid app-doctor-card` | `doctors.page.ts` | HIGH | Data-driven doctor cards. |
| `doctors.spec.ts` | `.doctor-card .btn-book` | `doctor-card.component.ts` | HIGH | Book Now link. |
| `doctors.spec.ts` | `.doctor-card .btn-profile[aria-label="View profile"]` | `doctor-card.component.ts` | HIGH | Profile link. |
| `doctor-profile.spec.ts` | `.profile-loading` | `src/app/portals/public/doctor-profile/doctor-profile.page.ts` | HIGH | Loading state. |
| `doctor-profile.spec.ts` | `getByRole('heading', { name: doctor.fullName })` | `doctor-profile.page.ts` | HIGH | Dynamic profile `<h1>`. |
| `doctor-profile.spec.ts` | `.profile-book-btn` / link text | `doctor-profile.page.ts` | HIGH | Booking CTA. |
| `doctor-profile.spec.ts` | `.service-list .service-row` | `doctor-profile.page.ts` | HIGH | Services Offered rows. |
| `doctor-profile.spec.ts` | `.schedule-list li` | `doctor-profile.page.ts` | HIGH | Schedule lines. |
| `doctor-profile.spec.ts` | `.reviews-list app-review-card` | `doctor-profile.page.ts` | HIGH | Review cards. |
| `services.spec.ts` | `getByRole('heading', { name: 'Our Services' })` | `src/app/portals/public/services/services.page.ts` | HIGH | Static `<h1>`. |
| `services.spec.ts` | `.page-loading ion-spinner` | `services.page.ts` | HIGH | Loading spinner. |
| `services.spec.ts` | `.filter-pill` | `services.page.ts` | HIGH | Category filter buttons. |
| `services.spec.ts` | `.service-item` | `services.page.ts` | HIGH | Service display cards. |
| `services.spec.ts` | `.service-item__desc` | `services.page.ts` | HIGH | Service description fallback. |
| `services.spec.ts` | `.service-item__fee` | `services.page.ts` | HIGH | Price/included label. |
| `announcements.spec.ts` | `getByRole('heading', { name: 'Announcements' })` | `src/app/portals/public/announcements/announcements.page.ts` | HIGH | Static `<h1>`. |
| `announcements.spec.ts` | `.skeleton-grid app-skeleton` | `announcements.page.ts` | HIGH | Loading skeleton. |
| `announcements.spec.ts` | `.announcements-grid app-announcement-card` | `announcements.page.ts` | HIGH | Data-driven announcement cards. |
| `announcements.spec.ts` | `.announcement-card__img-placeholder` | `announcement-card.component.ts` | HIGH | Placeholder when image missing. |
| `booking.spec.ts` | `getByRole('heading', { name: 'Choose your doctor and services' })` | `step-doctor-service.component.ts` | HIGH | Step 1 title. |
| `booking.spec.ts` | `.wizard-loading ion-spinner` | `step-doctor-service.component.ts` | HIGH | Step 1 loading spinner. |
| `booking.spec.ts` | `.wizard-step` | `booking-wizard.component.ts` | HIGH | Wizard progress labels. |
| `booking.spec.ts` | `.doctor-grid .doctor-card` | `step-doctor-service.component.ts` | HIGH | Doctor selection button cards. |
| `booking.spec.ts` | `.service-option` | `step-doctor-service.component.ts` | HIGH | Service selection buttons. |
| `booking.spec.ts` | `.btn-ghost` | `step-doctor-service.component.ts` | HIGH | Change Doctor button. |
| `booking.spec.ts` | `.calendar-cell` | `step-date-picker.component.ts` | HIGH | Date buttons. |
| `booking.spec.ts` | `.slot-chip` | `step-slot-select.component.ts` | HIGH | Slot buttons. |
| `booking.spec.ts` | `#booking-notes` | `step-payment.component.ts` | HIGH | Optional notes textarea. |
| `booking.spec.ts` | `getByText('No doctors available')` | `step-doctor-service.component.ts` | HIGH | Empty doctor state. |
| `booking.spec.ts` | `getByText('No services available')` | `step-doctor-service.component.ts` | HIGH | Empty service state. |
| `booking-confirmation.spec.ts` | `getByText('Loading booking details...')` | `src/app/portals/public/booking-confirmation/booking-confirmation.page.ts` | HIGH | Loading state. |
| `booking-confirmation.spec.ts` | `getByRole('heading', { name: 'Booking Confirmed!' })` | `booking-confirmation.page.ts` | HIGH | Success title. |
| `booking-confirmation.spec.ts` | `getByRole('button', { name: 'Create Account' })` | `booking-confirmation.page.ts` | HIGH | Guest CTA. |
| `booking-confirmation.spec.ts` | `getByRole('button', { name: 'Back to Home' })` | `booking-confirmation.page.ts` | HIGH | Navigation button. |
| `booking-confirmation.spec.ts` | `.queue-card` | `booking-confirmation.page.ts` | HIGH | Queue number card. |
| `booking-confirmation.spec.ts` | `.confirmation-title` / `Booking Not Found` | `booking-confirmation.page.ts` | HIGH | Error state title. |
| `privacy-policy.spec.ts` | `getByRole('heading', { name: 'Privacy Policy' })` | `src/app/portals/public/privacy-policy/privacy-policy.page.ts` | HIGH | Static `<h1>`. |
| `privacy-policy.spec.ts` | `getByRole('link', { name: '← Back to Home' })` | `privacy-policy.page.ts` | HIGH | Static back link. |
| `privacy-policy.spec.ts` | `a[href="mailto:support@yourclinicdomain.com"]` / link text | `privacy-policy.page.ts` | HIGH | Static email link. |
| `privacy-policy.spec.ts` | `.policy-section`, `.policy-section__title` | `privacy-policy.page.ts` | HIGH | Policy section display. |
| All specs | `.public-layout`, `.public-navbar`, `.public-footer` | `public-layout.component.ts`, `public-navbar.component.ts`, `public-footer.component.ts` | HIGH | Shared public shell. |
| All specs | `ion-toast` | Ionic `ToastController` usage in source pages/components | MEDIUM | Generated DOM is Ionic runtime output, not literal template markup. |

<!-- BLUEPRINT FINAL: Complete Merged Document -->

# PROJECT_BLUEPRINT.md

## Important Note

This generated file contains the final merged blueprint summary and Pass 6 analysis based on the completed Pass 1–5 outputs from this conversation.

For the most complete internal version, paste the detailed Pass 1–5 sections above this final section in this order:

1. `<!-- BLUEPRINT PART 1: Foundation -->`
2. `<!-- BLUEPRINT PART 2: Role — Doctor -->`
3. `<!-- BLUEPRINT PART 3: Role — Patient -->`
4. `<!-- BLUEPRINT PART 4: Role — Staff -->`
5. `<!-- BLUEPRINT PART 5: Role — Admin -->`

Then keep the final analysis sections below.

---

## 8. Shared / Common Flows

| Flow | Roles Affected | Trigger | Pages/Components | API Calls | UI Result | Source Files |
|---|---|---|---|---|---|---|
| Login | All | User submits login form | Auth login page | `POST auth/login` | Stores session, redirects by role | `src/app/auth/login/login.page.ts`, `src/app/core/services/auth.service.ts` |
| Social login | All | Google/Facebook login | Auth login page | `POST auth/google`, `POST auth/facebook` | Stores session, redirects by role | `src/app/auth/login/login.page.ts`, `src/app/core/services/auth.service.ts` |
| Restore session | All | App startup | App initializer | `GET auth/me` | Restores auth state if token exists | `src/app/app.config.ts`, `src/app/core/services/auth-state.service.ts` |
| Logout | All authenticated | Portal layout logout | Portal layout | `POST auth/logout` when refresh token exists | Clears local session, redirects to login | `src/app/shared/components/portal-layout/portal-layout.component.ts`, `src/app/core/services/auth.service.ts` |
| Token refresh | All authenticated | API returns `401` | Auth interceptor | `POST auth/refresh-token` | Retries failed request or logs out | `src/app/core/interceptors/auth.interceptor.ts` |
| Unauthorized redirect | All protected roles | Guard blocks user | Route guards | None | Redirects to `/auth/login` | `src/app/core/guards/auth.guard.ts`, `src/app/core/guards/role.guard.ts` |
| First-login redirect | Admin/Staff/Doctor/Patient | First login detected | First-login guard | None | Redirects to `/auth/set-password` | `src/app/core/guards/first-login.guard.ts` |
| Shared portal navigation | Admin/Staff/Doctor | Portal shell | `PortalLayoutComponent` | None | Sidebar/header layout with role nav | `src/app/shared/components/portal-layout/portal-layout.component.ts`, role route files |
| Patient portal navigation | Patient | Patient shell | `PatientLayoutComponent` | None | Patient-specific navigation | `src/app/portals/patient/patient.routes.ts` |
| Notifications | Shared | Notification panel opened/read | Notification panel | `PUT notifications/read-all`, `PUT notifications/:id/read` | Marks notifications read | `src/app/shared/components/notification-panel/notification-panel.component.ts` |
| Patient media upload | Patient | Upload document/lab result | Shared patient media panel | `POST FormData patients/me/documents`, `POST FormData patients/me/lab-results` | File appears in gallery after reload | `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts` |
| Patient media preview/download | Patient | Open media item | Shared media preview/modal | `GET patients/me/documents/{id}/file`, `GET patients/me/lab-results/{id}/file` | Opens preview/download | `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts` |
| Receipt display | Patient/Staff/Admin | Payment/booking receipt action | Receipt modal | `GET payments/{paymentId}` or booking fallback | Opens receipt modal | Patient/staff/admin booking detail/payment pages |
| Confirm modal | Staff/Admin/Patient | Destructive or reasoned action | Confirm modal | Depends on action | Confirms cancel/waive/delete/revoke/etc. | `src/app/shared/components/confirm-modal/*` and role pages |

---

## 12. State Management

- **Primary state approach:** service-based state using Angular services, RxJS streams, signals, and local component state. Source files include `src/app/core/services/auth-state.service.ts`, `src/app/core/services/auth.service.ts`, and role page components.
- **Auth/session state:** `AuthStateService` holds the current user/auth state and delegates persistence to `AuthService` and `TokenService`.
- **Storage-backed state:** access token, refresh token, and user data are stored in `localStorage`. Source: `src/app/core/services/token.service.ts`, `src/app/core/services/auth.service.ts`.
- **Role state:** role comes from authenticated user data or JWT claims and is normalized to `Admin`, `Staff`, `Doctor`, or `Patient`. Source: `src/app/core/services/auth.service.ts`.
- **Global state vs page-local state:**
  - Global: auth/session, token, current user.
  - Page-local: bookings, filters, modal state, selected rows, loading flags, error messages.
- **Loading/error state pattern:** most pages use local `isLoading`, `isSaving`, `error`, `loadError`, or observable fallback state. This is inconsistent across roles.
- **Caching behavior:** no global cache layer confirmed. Most pages reload directly from API.
- **Subscription cleanup:** mixed usage. Some pages use Angular/RxJS patterns; final code-level audit should verify `takeUntil`, `DestroyRef`, async pipe, or manual unsubscribe per long-lived subscription.
- **Logout cleanup:** token and user data are cleared. Source: `src/app/core/services/auth.service.ts`, `src/app/core/services/token.service.ts`.

`[SECURITY RISK: auth tokens are stored in localStorage, increasing XSS impact.]`

---

## 16. Error Handling Strategy

| Area | Error Source | Handling Method | User-Facing Message | Source File |
|---|---|---|---|---|
| Auth login | Login API failure | Form/page error state | Login failure message | `src/app/auth/login/login.page.ts` |
| Token refresh | Refresh token failure | Clears session and redirects | Redirects to login | `src/app/core/interceptors/auth.interceptor.ts` |
| Dashboard loads | API failure | Often fallback empty arrays | `[MISSING ERROR HANDLING: some dashboard failures are not strongly user-facing]` | Admin/Staff/Patient/Doctor dashboard pages |
| Booking actions | Patch/API failure | Toast | Failed action-specific message | Role booking pages |
| Staff payment | Confirm payment failure | Toast | `Failed to confirm payment.` | `src/app/portals/staff/payments/staff-payments.page.ts` |
| Staff PF waive | Waive failure | Toast | `Failed to waive PF.` | Staff payment/detail pages |
| Patient upload | Upload failure | Toast | `Failed to upload document/lab result.` | `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts` |
| Patient PDF download | Blob missing/error | Toast | `Document not available yet.` | Patient document/medical/prescription pages |
| Doctor consultation save | API failure | Toast | Save/complete/amendment failure message | `src/app/portals/doctor/consultation/doctor-consultation.page.ts` |
| Doctor schedule | Save/load failure | Toast/error panel | `Failed to save schedule.` / retry state | `src/app/portals/doctor/schedule/doctor-schedule.page.ts` |
| Admin settings | Save failure | Toast | `Failed to save settings.` | `src/app/portals/admin/settings/settings.page.ts` |
| Admin reports CSV | Export click | Toast only | `CSV export coming soon.` | `src/app/portals/admin/reports/reports.page.ts` |

---

## 17. Coding Standards & Conventions

- **Folder structure:** role-based portal folders under `src/app/portals/{admin,staff,doctor,patient,public}`.
- **Routing pattern:** lazy-loaded role route files from root `app.routes.ts`.
- **Component pattern:** many pages use standalone Angular components with inline templates.
- **API pattern:** mixed but mostly centralized through `ApiService`; some domain services wrap endpoints.
- **Forms:** mixed reactive forms and `ngModel`.
  - Reactive forms appear in profile, doctor form, consultation forms, walk-in registration.
  - `ngModel` appears heavily in filters, settings, admin services, modals.
- **RxJS usage:** API calls use observables; some pages use `combineLatest`, `catchError`, or local subscriptions.
- **Validation:** mostly page-level form validation and disabled submit buttons.
- **Naming:** role pages generally use `[role]-[feature].page.ts` or feature folder naming.
- **Testing:** Playwright exists, but many UI elements lack `data-testid`.
- **TypeScript strictness:** should be verified from `tsconfig*.json` before final enforcement decisions.
- **Path aliases:** no final conclusion; verify `tsconfig.json` paths if using this blueprint for refactor planning.

---

## 18. Design & UI Conventions

- **Primary UI framework:** Ionic Angular.
- **Layouts:**
  - Admin/Staff/Doctor use shared `PortalLayoutComponent`.
  - Patient uses `PatientLayoutComponent`.
  - Public uses public layout.
- **Navigation:** role-specific nav arrays in route files.
- **Common UI patterns:**
  - Cards for dashboards.
  - Tables on desktop and cards on mobile.
  - Modals for payment, confirmation, receipt, upload preview, and edit forms.
  - Toasts for success/failure feedback.
  - Empty states via shared `EmptyStateComponent` in many pages.
  - Skeleton/loading indicators in some list pages.
- **Responsive pattern:** several pages explicitly support desktop table + mobile cards, especially bookings/payment/list pages.
- **Brand/theme:** theme files exist, but final visual convention should be confirmed from `variables.scss`, `global.scss`, `styles.scss`, and component SCSS.
- **Accessibility:** some controls use `aria-label` and `role="button"`, but coverage is inconsistent.
- **Main design gap:** `[MISSING TEST SELECTOR]` appears across almost every role. Stable E2E selectors should be added before serious Playwright coverage.

---

## 19. Known Gaps, Bugs & Incomplete Features

| Tag | Area | Description | Impact | Source File |
|---|---|---|---|---|
| `[SECURITY RISK]` | Auth | Tokens stored in `localStorage` | XSS can expose auth tokens | `src/app/core/services/token.service.ts` |
| `[SECURITY RISK]` | Env config | Firebase/OAuth frontend config exposed | Usually public, but backend/rules/domain restrictions must be verified | `src/environments/environment.ts` |
| `[NEEDS CLARIFICATION]` | Production config | Production API URL appears placeholder-like | Deployment risk | `src/environments/environment.prod.ts` |
| `[MISSING GUARD]` | Dev route | `/dev/gallery` appears public | Internal gallery may be exposed | `src/app/app.routes.ts`, `src/app/dev/dev.routes.ts` |
| `[MISSING TEST SELECTOR]` | All roles | Most interactive buttons/rows/forms lack stable selectors | Fragile Playwright tests | Role page files |
| `[NOT IMPLEMENTED]` | Patient vaccinations | Vaccination service returns empty arrays; table not deployed | Feature cannot be meaningfully tested | `src/app/core/services/patient-vaccinations.service.ts` |
| `[MOCK DATA]` | Patient vaccinations | Empty observable fallback used | Hides missing backend | `src/app/core/services/patient-vaccinations.service.ts` |
| `[BROKEN OR SUSPICIOUS ROUTE]` | Patient labs | `/patient/labs` only redirects to `/patient/lab-results` | Compatibility route; keep only if needed | `src/app/portals/patient/labs-redirect/patient-labs-redirect.page.ts` |
| `[UI ONLY]` | Admin reports | CSV export only shows “coming soon” | Export not implemented | `src/app/portals/admin/reports/reports.page.ts` |
| `[UI ONLY]` | Admin booking detail | Download Visit Summary disabled | Document flow incomplete | `src/app/portals/admin/booking-detail/booking-detail.page.ts` |
| `[NOT IMPLEMENTED]` | Admin doctor invite | Service references missing doctor invite endpoint | Invite flow incomplete | `src/app/portals/admin/services/admin-doctors.service.ts` |
| `[MISSING ERROR HANDLING]` | Dashboards | Some failures fallback to empty arrays/console warnings | Users may see misleading empty states | Dashboard pages |
| `[NEEDS CLARIFICATION]` | Staff patients | Exact generated patient search endpoint should be verified | API contract risk | `src/app/portals/staff/patients/staff-patients.page.ts` |
| `[NEEDS CLARIFICATION]` | Staff patient detail | Exact portal account endpoint needs confirmation | API contract risk | `src/app/portals/staff/patient-detail/staff-patient-detail.page.ts` |
| `[NEEDS CLARIFICATION]` | Doctor profile | Photo upload endpoint should be confirmed | E2E/API contract risk | `src/app/portals/doctor/profile/doctor-profile.page.ts` |
| `[NEEDS CLARIFICATION]` | Patient review | Failed `GET reviews?bookingId=` assumes no existing review | Duplicate review risk | `src/app/portals/patient/reviews/patient-reviews.page.ts` |
| `[INCOMPLETE SCAN]` | Admin modals | Some modal internals summarized only | Exact selectors/payloads need follow-up | Admin modal/component files |
| `[INCOMPLETE SCAN]` | Consultation | Full child component behavior summarized | Exact E2E selector mapping needs follow-up | Doctor consultation child components |

---

## 20. Playwright E2E Planning Notes

| Priority | Role | Flow/Page | Why It Matters | Test Readiness | Needed Selector/Data | Notes |
|---|---|---|---|---|---|---|
| P0 | Auth | Login/logout/role redirect | Entry to all protected flows | Medium | test users for Admin/Staff/Doctor/Patient | Add selectors to login form |
| P0 | Patient | Bookings list/detail/cancel | Core patient operation | Medium | patient with cancellable booking | Add booking row/action selectors |
| P0 | Staff | Check-in flow | Core clinic queue operation | Medium | confirmed booking | Add selectors to queue rows/actions |
| P0 | Staff | Collect payment | Core revenue workflow | Medium | completed booking with unpaid PF | Add selectors to payment modal |
| P0 | Doctor | Consultation completion | Core clinical workflow | Low-Medium | checked-in/active booking | Needs many consultation selectors |
| P0 | Admin | Booking management | Admin operational control | Medium | booking in multiple statuses | Add selectors to action buttons/modals |
| P1 | Staff/Admin | Walk-in booking | Important front-desk flow | Medium | patient/doctor/service/slot seed data | Add stepper/slot selectors |
| P1 | Doctor | Schedule update | Affects availability/booking | Medium | doctor account | Add schedule editor selectors |
| P1 | Patient | Upload document/lab result | Patient document flow | Medium | booking ID + test file | Add media panel selectors |
| P1 | Patient | Download records/prescriptions | Patient document access | Medium | completed booking with records | Blob/download assertions needed |
| P1 | Admin | Doctor create/edit | Admin setup flow | Medium | unique email/temp password | Add form/service/schedule selectors |
| P1 | Admin | Staff invite/status | Admin user management | Medium | unique staff email | Add row/action selectors |
| P2 | Admin | Reports | Admin visibility | Low-Medium | report seed data | CSV is UI-only placeholder |
| P2 | Patient | Vaccinations | Currently not implemented | Not ready | backend/table missing | Do not write real E2E yet |
| P2 | Patient | Reviews | Useful but API behavior unclear | Low-Medium | completed unreviewed booking | Verify review endpoint first |

Recommended test files:

```text
tests/auth/login.spec.ts
tests/patient/bookings.spec.ts
tests/patient/documents.spec.ts
tests/patient/profile.spec.ts
tests/staff/bookings.spec.ts
tests/staff/payments.spec.ts
tests/staff/walk-in.spec.ts
tests/doctor/dashboard.spec.ts
tests/doctor/consultation.spec.ts
tests/doctor/schedule.spec.ts
tests/admin/bookings.spec.ts
tests/admin/doctors.spec.ts
tests/admin/staff.spec.ts
tests/admin/settings.spec.ts
```

Main selector recommendation:

```html
data-testid="role-feature-action"
```

Examples:

```html
data-testid="staff-payment-confirm-button"
data-testid="staff-payment-amount-input"
data-testid="doctor-consultation-complete-button"
data-testid="patient-booking-cancel-button"
data-testid="admin-doctor-save-button"
```

---

## 21. Future AI Usage Instructions

- Use this blueprint as the primary context.
- Do not rescan the full repo unless the blueprint is missing, outdated, incomplete, or contradicted by code.
- Before modifying code, inspect only the files related to the requested task.
- If a change affects routes, APIs, models, role flows, auth, state, UI behavior, selectors, or testing strategy, update the relevant blueprint section in the same task.
- If the blueprint and code disagree, trust the code and update the blueprint.
- If any section is marked `[INCOMPLETE SCAN]`, re-run the relevant pass or component-level scan before relying on it.
- For Playwright work, first add stable `data-testid` selectors to the target flow.
- For backend contract tests, verify exact endpoint, payload, and response shape from code before generating tests.
- For UI redesign work, inspect the target page SCSS/template only; do not rescan unrelated roles.
- For feature extension, paste only the relevant role section and related shared sections, not the full document.

---

## 22. Scan Completeness — Final

| Pass | Area | Fully Scanned? | Files Opened | Notes / Skipped |
|---|---|---|---|---|
| Pass 1 | Routing / Auth / Models / Config | Mostly | Root routes, auth routes, guards, interceptors, API service, env/config/package files | Model inventory should be expanded if backend contract docs are required |
| Pass 2 | Doctor | Mostly | Doctor routes/pages/components | Consultation child components need deeper selector audit before E2E |
| Pass 3 | Patient | Mostly | Patient routes/pages/shared media panel/vaccination service | Review form internals need follow-up before E2E |
| Pass 4 | Staff | Mostly | Staff routes/pages/queue/status components | Exact patient search and portal account endpoints need confirmation |
| Pass 5 | Admin | Mostly | Admin routes/pages/services/modals surfaced by pages | Modal internals and some service wrappers need deeper audit |
| Pass 6 | Shared / State / Error / Conventions | Partially | Shared patterns summarized from prior scans and shared components surfaced by role pages | Theme/style deep audit and full shared component scan should be follow-up if design system work is planned |

---

## Final Quality Check

- [x] All major roles covered: Admin, Staff, Doctor, Patient.
- [x] Public/auth/foundation covered in Pass 1.
- [x] Main role routes listed.
- [x] Major API calls found in frontend role pages listed.
- [x] Auth/guard behavior documented.
- [x] Major UI actions captured.
- [x] Unclear behavior tagged inline.
- [x] Major known gaps consolidated in Section 19.
- [x] Scan completeness filled honestly.
- [x] Source file paths included for major claims.
- [x] No unsupported completeness claim made.

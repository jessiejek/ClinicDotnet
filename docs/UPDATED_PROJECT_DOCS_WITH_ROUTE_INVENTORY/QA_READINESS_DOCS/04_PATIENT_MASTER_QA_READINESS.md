# PATIENT MASTER QA READINESS

Generated from uploaded frontend repo scan on 2026-05-29.

## Scope

This document is the strict QA checklist for the **Patient** role only. It is designed for DeepSeek v4 Flash or another AI agent to run focused QA without pretending that shallow source review equals runtime testing.


## Mandatory QA Discipline Rules

This QA must be adversarial. The agent must try to prove the app is broken before marking anything as passed.

A test is **PASS** only when all required proof exists:

1. The route/page was actually opened in the browser, not only inspected in code.
2. The expected API calls were observed in Network logs, terminal logs, or captured debug output.
3. There are no unhandled browser console errors after the page finishes loading.
4. Loading state ends. The page must not be stuck on spinner/skeleton/disabled button.
5. Empty state is verified when data is empty; populated state is verified when data exists.
6. Main action works and shows expected UI feedback/toast/modal/navigation.
7. If the action writes data, verify persistence by refresh or re-fetching API data.
8. If the route is protected, wrong-role access must be tested.
9. If there is an error path, one negative case must be tested.
10. The result includes evidence: route, account used, API request/status, console status, screenshot path or textual DOM proof, and reproduction notes.

Forbidden behavior:

- Do not mark PASS because TypeScript compiles only.
- Do not mark PASS from source inspection only.
- Do not mark PASS if API returned 401/403/404/500 unless that exact error is the expected negative test.
- Do not hide failures under “minor issue.” Use FAIL or BLOCKED.
- Do not say “looks good” without evidence.
- Do not skip a route because it seems similar to another route.
- Do not change code during QA unless the task explicitly says “fix.”

Status labels:

| Status | Meaning |
|---|---|
| PASS | Fully tested with proof. |
| FAIL | Tested and broken. Include reproduction and suspected file. |
| BLOCKED | Could not test because prerequisite is missing, such as credentials, backend, seed data, or API contract. |
| NOT RUN | Not executed yet. This should not appear in a final report unless scope was explicitly reduced. |
| RISK | Works partly, but has a reliability, security, or UX risk that needs product/team decision. |


## Patient Route Map

| Route | Component/Page | QA Focus |
|---|---|---|
| `/patient/dashboard` | `PatientDashboardPage` | patient summary, next booking, consultation/prescription preview |
| `/patient/doctors` | `PatientDoctorsPage` | doctor discovery inside patient portal |
| `/patient/bookings` | `PatientBookingsPage` | booking list, cancel booking |
| `/patient/bookings/:id` | `PatientBookingDetailPage` | booking detail, payment info, cancel booking |
| `/patient/documents` | `PatientDocumentsPage` | document list/download |
| `/patient/lab-results` | `PatientLabResultsPage` | lab results list/download |
| `/patient/labs` | `PatientLabsRedirectPage` | redirect route to lab results |
| `/patient/medical-records` | `PatientMedicalRecordsPage` | consultation history and PDF downloads |
| `/patient/prescriptions` | `PatientPrescriptionsPage` | prescription list and PDF downloads |
| `/patient/vaccinations` | `PatientVaccinationsPage` | vaccination records |
| `/patient/profile` | `PatientProfilePage` | profile update, change password, privacy consent |
| `/patient/reviews/:bookingId` | `PatientReviewsPage` | review submission for completed booking |
| `/patient/privacy-consent` | `PatientPrivacyConsentPage` | standalone consent capture |

## Patient API Surface Detected From Frontend

These are the main endpoints/actions the QA agent must watch in Network logs or API traces while testing this role.

| Endpoint / action detected from frontend |
|---|
| `GET patients/me` |
| `PUT patients/me` |
| `POST patients/me/consent` |
| `GET bookings/me?page={page}&pageSize={size}` |
| `GET bookings/{id}` |
| `PATCH bookings/{id}/cancel` |
| `GET payments/{paymentId}` |
| `GET doctors` |
| `GET medical-records/consultations?patientId={id}` |
| `GET medical-records/me` |
| `GET prescriptions/me` |
| `GET patient-documents/me/all.pdf` |
| `GET patient-documents/me/medical-records/{id}/pdf` |
| `GET patient-documents/me/bookings/{bookingId}/pdf` |
| `GET patient-documents/me/prescriptions/{id}/pdf` |
| `GET reviews?bookingId={bookingId}` |
| `POST reviews` |
| `GET notifications` |
| `POST auth/logout` |
| `POST auth/change-password` |


## Patient-Specific High-Risk Areas

Patient-facing QA must prove the patient can safely see their own data only.

High-risk checks:
- Patient must not see another patient’s booking, records, prescriptions, documents, or payments.
- Booking cancellation must persist and propagate to Staff/Admin/Doctor lists.
- Medical records, prescription PDFs, booking PDFs, and all-document PDF download actions must return valid Blob/PDF responses, not HTML/JSON error pages.
- Privacy consent must persist and not loop/redirect incorrectly.
- Profile update and password change must show clear success/error feedback.
- Review submission must prevent duplicate review when one already exists.


## Required Patient QA Passes

### Pass 1 - Static Source Sanity

Check the files for this role and report:

- Route definitions are present and map to the expected components.
- Sidebar/nav items match available routes.
- No route component is a placeholder/stub unless clearly intended.
- No direct mock-data path is used for runtime when backend data is expected.
- API calls match the expected route behavior.
- Loading, empty, error, and success states exist or are missing.
- Any swallowed errors are listed as RISK.

### Pass 2 - Runtime Navigation

For every route in the table:

1. Login as a Patient account.
2. Navigate through the sidebar/nav where possible.
3. Directly open the URL as well.
4. Confirm page title/header and key controls are visible.
5. Confirm protected route does not render for wrong roles.
6. Capture console errors after page load.
7. Capture API calls and status codes.

### Pass 3 - Functional Actions

Test the main action of each route. If the action mutates data, verify by refreshing and/or re-fetching the relevant list/detail route.

### Pass 4 - Failure/Edge Cases

At minimum, test:

- Invalid required fields.
- Empty API result where possible.
- Backend error / network failure if agent can mock or reproduce safely.
- Unauthorized access by another role.
- Refresh while on detail route.
- Browser back/forward behavior after action.


## Per-Route Evidence Template

For every route above, fill this:

```md
### Route: <route>
- Status: PASS / FAIL / BLOCKED / RISK
- Account used:
- How route was reached: sidebar / direct URL / redirected from another flow
- Expected title/header:
- API calls observed with status codes:
- Console errors after load: none / list errors
- Loading ended: yes/no
- Empty/populated state verified: yes/no
- Main action tested:
- Persistence after refresh/re-fetch:
- Authorization check result:
- Screenshot/evidence:
- Notes:
```

## Wrong-Role Authorization Tests

Use the other three role accounts and try at least three protected routes from this role, including one list route, one detail route, and one write/action route. Expected result: redirect to login or denial; no protected data rendered.

## Required Output

Use the final QA report format from `00_MASTER_QA_READINESS_DEEPSEEK_STRICT.md`.


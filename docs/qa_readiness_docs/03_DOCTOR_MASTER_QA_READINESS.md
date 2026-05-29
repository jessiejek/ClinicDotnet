# DOCTOR MASTER QA READINESS

Generated from uploaded frontend repo scan on 2026-05-29.

## Scope

This document is the strict QA checklist for the **Doctor** role only. It is designed for DeepSeek v4 Flash or another AI agent to run focused QA without pretending that shallow source review equals runtime testing.


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


## Doctor Route Map

| Route | Component/Page | QA Focus |
|---|---|---|
| `/doctor/dashboard` | `DoctorDashboardPage` | doctor profile, today queue, summary, status panel |
| `/doctor/appointments` | `DoctorAppointmentsPage` | today appointments, complete consultation shortcut, waive PF |
| `/doctor/appointments/:id` | `DoctorAppointmentDetailPage` | appointment detail |
| `/doctor/patients` | `DoctorPatientsPage` | patients assigned to/current doctor |
| `/doctor/patients/:id` | `DoctorPatientDetailPage` | patient detail, history, prescriptions, vaccinations |
| `/doctor/schedule` | `DoctorSchedulePage` | schedule and blocked dates |
| `/doctor/consultation/:bookingId` | `DoctorConsultationPage` | full clinical consultation workspace and PF decision |
| `/doctor/profile` | `DoctorProfilePage` | profile, license/PTR/S2 warnings, change password |
| `/doctor/my-profile` | `DoctorProfilePage` | alias route for profile |

## Doctor API Surface Detected From Frontend

These are the main endpoints/actions the QA agent must watch in Network logs or API traces while testing this role.

| Endpoint / action detected from frontend |
|---|
| `GET doctors/me` |
| `PUT doctors/me` |
| `GET doctors/{doctorId}/schedule` |
| `PUT doctors/{doctorId}/schedule` |
| `POST doctors/{doctorId}/blocked-dates` |
| `DELETE doctors/{doctorId}/blocked-dates/{id}` |
| `POST doctors/{doctorId}/day-status` |
| `GET bookings/doctor/today` |
| `GET bookings/doctor/today-summary` |
| `GET bookings/doctor/patients` |
| `GET bookings/{id}` |
| `GET bookings?patientId={patientId}` |
| `POST bookings/{bookingId}/consultation-draft or save endpoint from source` |
| `PATCH bookings/{bookingId}/doctor-complete` |
| `PATCH payments/{bookingId}/waive` |
| `GET patients/{id}` |
| `GET medical-records/consultations?patientId={id}` |
| `GET medical-records/allergies?patientId={id}` |
| `GET medical-records/lab-results?patientId={id}` |
| `GET medical-records/follow-ups?patientId={id}` |
| `GET medical-records/prescriptions?patientId={id}` |
| `GET medical-records/vaccinations?patientId={id}` |
| `POST /drug-interactions/allergy-check` |
| `POST /drug-interactions/check` |
| `POST /consultation-requests/request-attending-physician` |
| `GET audit-logs` |
| `POST audit-logs` |
| `POST auth/change-password` |


## Doctor-Specific High-Risk Areas

Doctor workflow is clinically sensitive. Do not mark PASS unless consultation actions save correctly and downstream screens update.

High-risk checks:
- Dashboard queue must match today appointments and checked-in/in-clinic state.
- Consultation page must load patient identity, booking info, allergies, medical history, vitals, SOAP, diagnosis, prescription, lab/follow-up/vaccination forms where applicable.
- Doctor-complete must require required clinical fields and professional fee decision.
- PF charged vs PF waived must flow correctly into Staff payment queue.
- Prescriptions must trigger allergy/drug interaction checks when applicable.
- Schedule updates and blocked dates must affect available slots.
- Doctor profile license/PTR/S2 warning fields must behave correctly.


## Required Doctor QA Passes

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

1. Login as a Doctor account.
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


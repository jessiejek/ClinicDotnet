# MASTER QA READINESS - DeepSeek v4 Flash Strict QA Mode

Generated from the uploaded `vercel (2).zip` frontend repo scan on 2026-05-29.

## Project Snapshot From Current Zip

| Item | Value |
|---|---|
| Framework | Angular 17.3 / Ionic 7.8 |
| Package manager | npm/package-lock detected |
| Local API base URL | `http://localhost:5000/api` |
| Local SignalR URL | `http://localhost:5000/hubs/clinic-dashboard` |
| Production API base URL | `https://api.yourclinicdomain.com/api placeholder` |
| Public/auth/role portals | Public, Auth, Admin, Staff, Doctor, Patient |
| E2E test script | Not present in `package.json`; browser QA must be done through available agent/browser tooling or add Playwright/Cypress only if allowed. |

## Why The Previous AI QA Failed

The previous QA likely failed because it treated source review or happy-path navigation as enough. This document prevents fake PASS by requiring evidence for route load, API status, console health, UI behavior, persistence, and authorization boundaries.


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


## Required Inputs Before Running QA

The QA agent must ask for or locate these before starting:

| Required input | Example / Notes |
|---|---|
| Frontend URL | `http://localhost:4200` or Vercel preview URL |
| Backend URL | Current zip points local env to `http://localhost:5000/api` |
| Admin credential | Email + password |
| Staff credential | Email + password |
| Doctor credential | Email + password |
| Patient credential | Email + password |
| Test booking IDs | Needed for detail routes and consultation routes |
| Test patient IDs | Needed for patient detail routes |
| Test doctor IDs | Needed for doctor edit/schedule/status routes |
| Permission to create/update/cancel test records | Required for full write QA |

## Required Execution Order

1. Preflight environment check.
2. Auth/login check for all four roles.
3. Role-specific QA in this order: Admin → Staff → Doctor → Patient.
4. Cross-role workflow QA.
5. Authorization boundary QA.
6. Final defect report.

## Preflight Commands

Run these first from repo root:

```bash
npm ci
npm run build
```

Then start frontend and backend using the project’s normal commands. If backend is not running, mark runtime route tests as BLOCKED, not PASS.

## Cross-Role Workflow QA

These workflows must be tested after role-specific route checks:

| Flow | Expected full chain |
|---|---|
| Public/Patient booking | Patient/public creates booking → Staff sees booking → Staff checks in → Doctor sees in queue → Doctor completes consultation → Staff collects/waives payment → Patient sees updated booking/records. |
| Doctor running late | Staff/Admin/Doctor updates day status/running late → Public doctor profile and booking flow reflect status. |
| Payment workflow | Doctor charges or waives PF → Staff payment queue updates → receipt/payment status visible in booking detail. |
| Clinical records | Doctor completes consultation with diagnosis/prescription/lab/follow-up/vitals → Patient records/prescriptions/documents reflect generated data. |
| Notifications/realtime | Create/update booking/status/payment → notification bell/queue/dashboard updates without full reload where realtime is expected. |

## Role QA Documents

Use the role files in this package:

1. `01_ADMIN_MASTER_QA_READINESS.md`
2. `02_STAFF_MASTER_QA_READINESS.md`
3. `03_DOCTOR_MASTER_QA_READINESS.md`
4. `04_PATIENT_MASTER_QA_READINESS.md`

## DeepSeek v4 Flash Paste Prompt

```text
You are performing strict QA for this Angular/Ionic clinic app. Do not be lazy. Do not give fake PASS results.

Use the attached MASTER QA READINESS and the role-specific QA document. You must actually open each route, observe network calls, inspect console errors, test role authorization, perform the main action where safe, and verify data persistence after refresh/re-fetch.

Rules:
- PASS requires evidence: route, account, API/status, console status, UI proof, screenshot path or DOM proof, and persistence proof where applicable.
- If you cannot test something, mark BLOCKED with the missing prerequisite.
- If a route loads but the main action fails, mark FAIL.
- If a page uses mock/static fallback unexpectedly, mark FAIL or RISK.
- Do not modify source code. QA report only.
- Output `QA_RESULTS_<ROLE>_<YYYYMMDD_HHMM>.md`.
- Include exact reproduction steps and suspected source files for every issue.

Start with preflight build, then login, then execute the role QA checklist exactly. At the end, give a blunt verdict: demo-safe YES or NO.
```


## Required Final QA Report Format

Create a file named `QA_RESULTS_<ROLE>_<YYYYMMDD_HHMM>.md` with this exact structure:

```md
# QA Results - <Role>

## Executive Summary
- Overall status: PASS / FAIL / BLOCKED
- Routes tested: X/Y
- Critical failures: N
- Major failures: N
- Minor issues: N
- Blockers: N

## Environment
- Frontend URL:
- Backend API URL:
- Browser:
- Date/time:
- Account used:
- Git branch/commit:

## Evidence Summary
| Area | Route | Status | Main API evidence | Console clean? | Screenshot/evidence file | Notes |
|---|---|---|---|---|---|---|

## Defects Found
| Severity | Route | Repro steps | Expected | Actual | Suspected file(s) | API/console evidence |
|---|---|---|---|---|---|---|

## Route-by-Route Results
### <Route>
- Status:
- User/account:
- Steps executed:
- APIs observed:
- UI state verified:
- Persistence verified:
- Console/network errors:
- Screenshot/evidence:
- Notes:

## Authorization Matrix
| Attempted route | Account role | Expected | Actual | Status |
|---|---|---|---|---|

## Final Verdict
- Can this role be demoed safely? YES/NO
- If NO, list the exact blockers that must be fixed first.
```


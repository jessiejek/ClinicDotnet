# SCAN NOTES AND DOCUMENT DELTA

Generated from current uploaded `vercel (2).zip` scan on 2026-05-29.

## Important Differences / QA-Relevant Findings

| Area | Current zip finding | Why it matters for QA |
|---|---|---|
| Local API URL | `src/environments/environment.ts` uses `http://localhost:5000/api` | QA must point DeepSeek/browser tests to the correct backend. Older docs may still mention `https://localhost:44384/api`. |
| Local SignalR URL | `http://localhost:5000/hubs/clinic-dashboard` | Realtime QA must check the correct hub URL. |
| Package manager | `package-lock.json` and npm scripts detected | Use `npm ci` and `npm run build` unless the team says otherwise. |
| E2E tooling | No `e2e` script or Playwright/Cypress dependency detected in `package.json` | Browser QA needs the agent’s browser tool, manual browser DevTools, or an approved new E2E setup. Do not pretend automated E2E exists. |
| Mock data | `src/app/core/mock-data/*` and `mock-data.service.ts` still exist, but `useMockData: false` in environments | QA must flag any runtime mock fallback as RISK/FAIL if backend data is expected. |
| Role portals | Admin, Staff, Doctor, Patient route groups exist with protected guards | QA must test role boundaries, not just happy-path login. |
| Public booking | Public booking components still call doctors/services/slots/bookings endpoints | Patient/public booking flow must be included in cross-role workflow QA. |

## Files Created In This QA Package

1. `00_MASTER_QA_READINESS_DEEPSEEK_STRICT.md`
2. `01_ADMIN_MASTER_QA_READINESS.md`
3. `02_STAFF_MASTER_QA_READINESS.md`
4. `03_DOCTOR_MASTER_QA_READINESS.md`
5. `04_PATIENT_MASTER_QA_READINESS.md`
6. `05_COPY_PASTE_STRICT_ROLE_QA_PROMPT.md`
7. `06_SCAN_NOTES_AND_DOCUMENT_DELTA.md`

## Recommended Usage

Give DeepSeek only:

- the master QA file,
- the one role QA file it is testing,
- the existing route inventory/master overview if needed,
- credentials and URLs.

Do not give all role files at once unless it is doing the final cross-role workflow QA. Smaller context reduces slop.

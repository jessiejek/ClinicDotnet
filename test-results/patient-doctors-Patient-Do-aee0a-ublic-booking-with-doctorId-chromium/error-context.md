# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: patient\doctors.spec.ts >> Patient Doctors >> Main Action: Book Now links to /public/booking with doctorId
- Location: tests\patient\doctors.spec.ts:28:7

# Error details

```
TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e7]:
  - complementary [ref=e8]:
    - generic [ref=e9]: G
    - heading "Dr. Grace E. Gavino" [level=1] [ref=e10]
    - paragraph [ref=e11]: Modern Healthcare. Simplified.
    - generic [ref=e12]:
      - generic [ref=e13]: 🏥 Licensed Clinic
      - generic [ref=e14]: 🔒 HIPAA Compliant
      - generic [ref=e15]: ⭐ 4.8 Patient Rating
  - generic [ref=e17]:
    - link "← Back" [ref=e18] [cursor=pointer]:
      - /url: /public
    - generic [ref=e19]:
      - heading "Welcome Back" [level=2] [ref=e20]
      - paragraph [ref=e21]: Sign in to your account
      - generic [ref=e23]:
        - img [ref=e24]:
          - img [ref=e26]
        - generic [ref=e30]: An unexpected error occurred.
      - generic [ref=e31]:
        - generic [ref=e35]:
          - generic:
            - generic: Email Address
            - textbox "Email Address" [ref=e37]:
              - /placeholder: ""
              - text: patient@gavino.clinic
        - generic [ref=e40]:
          - generic [ref=e41]:
            - generic:
              - generic: Password
              - textbox "Password" [ref=e43]:
                - /placeholder: ""
                - text: Patient@123456
          - button "Toggle password visibility" [ref=e45] [cursor=pointer]:
            - generic [ref=e46]:
              - generic:
                - img:
                  - generic:
                    - img
        - link "Forgot password?" [ref=e48] [cursor=pointer]:
          - /url: /auth/forgot-password
        - button "Sign In" [ref=e49] [cursor=pointer]
      - generic [ref=e50]:
        - separator [ref=e51]
        - generic [ref=e52]: OR
        - separator [ref=e53]
      - generic [ref=e54]:
        - button "Continue with Google" [ref=e55] [cursor=pointer]
        - button "Continue with Facebook" [ref=e56] [cursor=pointer]:
          - generic [ref=e57]: f
          - text: Continue with Facebook
      - paragraph [ref=e58]:
        - text: Don't have an account?
        - link "Create one" [ref=e59] [cursor=pointer]:
          - /url: /auth/register
      - paragraph [ref=e60]:
        - link "Privacy Policy" [ref=e61] [cursor=pointer]:
          - /url: /public/privacy-policy
      - paragraph [ref=e62]: v54e9c87
      - button "Quick Login (Dev Only) ▼" [ref=e64] [cursor=pointer]
```

# Test source

```ts
  1   | import { test as base, expect, type Page } from '@playwright/test';
  2   | 
  3   | /** Patiennt test credentials (seeded from IdentitySeeder) */
  4   | export const PATIENT_EMAIL = process.env.PLAYWRIGHT_PATIENT_EMAIL || 'patient@gavino.clinic';
  5   | export const PATIENT_PASSWORD = process.env.PLAYWRIGHT_PATIENT_PASSWORD || 'Patient@123456';
  6   | export const API_BASE = 'http://localhost:5000/api';
  7   | 
  8   | /** Route map for patient portal */
  9   | export const ROUTES = {
  10  |   dashboard: '/patient/dashboard',
  11  |   doctors: '/patient/doctors',
  12  |   bookings: '/patient/bookings',
  13  |   documents: '/patient/documents',
  14  |   labResults: '/patient/lab-results',
  15  |   medicalRecords: '/patient/medical-records',
  16  |   prescriptions: '/patient/prescriptions',
  17  |   vaccinations: '/patient/vaccinations',
  18  |   profile: '/patient/profile',
  19  |   privacyConsent: '/patient/privacy-consent',
  20  | } as const;
  21  | 
  22  | /** Confirmed selectors from source code analysis (Phase 1) */
  23  | export const SELECTORS = {
  24  |   pageTitle: '.page-title',
  25  |   pageSubtitle: '.page-subtitle',
  26  |   loading: '.page-loading, .bookings-loading, .dashboard-loading, .slot-loading, ion-spinner',
  27  |   skeleton: 'app-skeleton',
  28  |   spinner: 'ion-spinner[name="crescent"]',
  29  |   emptyState: 'app-empty-state',
  30  |   errorState: '.page-error',
  31  |   errorTitle: '.page-error__title',
  32  |   toast: 'ion-toast',
  33  |   confirmModal: 'app-confirm-modal',
  34  |   doctorCard: 'app-doctor-card',
  35  |   doctorCardName: '.doctor-card__name',
  36  |   bookNowBtn: 'a.btn-book',
  37  |   bookingCard: 'app-patient-booking-card',
  38  |   bookingTable: 'table.clinic-table',
  39  |   statusBadge: 'app-status-badge',
  40  |   searchbar: 'ion-searchbar',
  41  |   recordCard: '.record-card.clinic-card',
  42  |   prescriptionCard: '.prescription-card.clinic-card',
  43  |   vacCard: '.vac-card.clinic-card',
  44  |   statCard: '.stat-card',
  45  |   statCardValue: '.stat-card__value',
  46  |   nearbyDoctors: '.dashboard-doctors',
  47  |   upcomingApptCard: 'app-upcoming-appointment-card',
  48  |   filterBtn: '.booking-filter',
  49  |   profileForm: 'form[formGroup]',
  50  |   warningBanner: '.banner--warning',
  51  |   consentCheckbox: 'ion-checkbox',
  52  |   pdfDownloadBtn: 'button:has-text("Download")',
  53  |   retryBtn: 'button:has-text("Retry")',
  54  | } as const;
  55  | 
  56  | /** Real-time login using live credentials */
  57  | export async function loginAsPatient(page: Page) {
  58  |   await page.goto('/auth/login');
  59  |   await page.waitForLoadState('networkidle');
  60  |   await page.waitForTimeout(1500);
  61  | 
  62  |   await page.waitForSelector('input[type="email"], ion-input[formControlName="email"] input', { timeout: 10000 });
  63  | 
  64  |   const emailInput = page.locator('input[type="email"]').or(page.locator('ion-input[formControlName="email"] input')).first();
  65  |   const passwordInput = page.locator('input[type="password"]').or(page.locator('ion-input[formControlName="password"] input')).first();
  66  |   const signInBtn = page.getByRole('button', { name: /sign ?in/i });
  67  | 
  68  |   await emailInput.fill(PATIENT_EMAIL);
  69  |   await passwordInput.fill(PATIENT_PASSWORD);
  70  |   await signInBtn.click();
  71  | 
> 72  |   await page.waitForURL(/\/patient\//, { timeout: 20000 });
      |              ^ TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
  73  | }
  74  | 
  75  | /** Mock API to return specific payload */
  76  | export async function mockApiResponse(page: Page, endpointPart: string, payload: unknown, status = 200) {
  77  |   await page.route(`**/api/**${endpointPart}**`, async (route) => {
  78  |     await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(payload) });
  79  |   });
  80  | }
  81  | 
  82  | /** Force API failure for a specific endpoint */
  83  | export async function mockApiFailure(page: Page, endpointPart: string, message = 'Forced failure from Playwright') {
  84  |   await mockApiResponse(page, endpointPart, { message, title: 'Error' }, 500);
  85  | }
  86  | 
  87  | /** Collect API responses for evidence */
  88  | export function collectApiResponses(page: Page) {
  89  |   const responses: Array<{ url: string; method: string; status: number; body: unknown }> = [];
  90  |   page.on('response', async (response) => {
  91  |     const req = response.request();
  92  |     if (!req.url().includes('/api/')) return;
  93  |     try {
  94  |       const ct = response.headers()['content-type'] ?? '';
  95  |       const body = ct.includes('application/json') ? await response.json() : await response.text();
  96  |       responses.push({ url: req.url(), method: req.method(), status: response.status(), body });
  97  |     } catch { /* ignore */ }
  98  |   });
  99  |   return responses;
  100 | }
  101 | 
  102 | /** Assert no persistent loading state after timeout */
  103 | export async function expectNoPersistentLoading(page: Page) {
  104 |   await expect(page.locator(SELECTORS.loading)).toHaveCount(0, { timeout: 8000 }).catch(async () => {
  105 |     await expect(page.locator(SELECTORS.loading).first()).toBeHidden({ timeout: 5000 });
  106 |   });
  107 | }
  108 | 
  109 | /** Navigate to patient route after login, return API responses */
  110 | export async function openPatientRoute(page: Page, route: string) {
  111 |   const responses = collectApiResponses(page);
  112 |   await page.goto(route);
  113 |   await page.waitForLoadState('networkidle');
  114 |   await page.waitForTimeout(2500);
  115 |   return responses;
  116 | }
  117 | 
```
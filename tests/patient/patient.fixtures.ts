import { test as base, expect, type Page } from '@playwright/test';

/** Patiennt test credentials (seeded from IdentitySeeder) */
export const PATIENT_EMAIL = process.env.PLAYWRIGHT_PATIENT_EMAIL || 'patient@gavino.clinic';
export const PATIENT_PASSWORD = process.env.PLAYWRIGHT_PATIENT_PASSWORD || 'Patient@123456';
export const API_BASE = 'http://localhost:5000/api';

/** Route map for patient portal */
export const ROUTES = {
  dashboard: '/patient/dashboard',
  doctors: '/patient/doctors',
  bookings: '/patient/bookings',
  documents: '/patient/documents',
  labResults: '/patient/lab-results',
  medicalRecords: '/patient/medical-records',
  prescriptions: '/patient/prescriptions',
  vaccinations: '/patient/vaccinations',
  profile: '/patient/profile',
  privacyConsent: '/patient/privacy-consent',
} as const;

/** Confirmed selectors from source code analysis (Phase 1) */
export const SELECTORS = {
  pageTitle: '.page-title',
  pageSubtitle: '.page-subtitle',
  loading: '.page-loading, .bookings-loading, .dashboard-loading, .slot-loading, ion-spinner',
  skeleton: 'app-skeleton',
  spinner: 'ion-spinner[name="crescent"]',
  emptyState: 'app-empty-state',
  errorState: '.page-error',
  errorTitle: '.page-error__title',
  toast: 'ion-toast',
  confirmModal: 'app-confirm-modal',
  doctorCard: 'app-doctor-card',
  doctorCardName: '.doctor-card__name',
  bookNowBtn: 'a.btn-book',
  bookingCard: 'app-patient-booking-card',
  bookingTable: 'table.clinic-table',
  statusBadge: 'app-status-badge',
  searchbar: 'ion-searchbar',
  recordCard: '.record-card.clinic-card',
  prescriptionCard: '.prescription-card.clinic-card',
  vacCard: '.vac-card.clinic-card',
  statCard: '.stat-card',
  statCardValue: '.stat-card__value',
  nearbyDoctors: '.dashboard-doctors',
  upcomingApptCard: 'app-upcoming-appointment-card',
  filterBtn: '.booking-filter',
  profileForm: 'form.profile-card',
  warningBanner: '.banner--warning',
  consentCheckbox: 'ion-checkbox',
  pdfDownloadBtn: 'button:has-text("Download")',
  retryBtn: 'button:has-text("Retry")',
} as const;

/** Real-time login using live credentials */
export async function loginAsPatient(page: Page) {
  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  await page.locator('ion-input[formControlName="email"]').waitFor({ state: 'attached', timeout: 10000 });

  const emailInput = page.locator('ion-input[formControlName="email"]').locator('input');
  const passwordInput = page.locator('ion-input[formControlName="password"]').locator('input');
  const signInBtn = page.getByRole('button', { name: /sign ?in/i });

  await emailInput.waitFor({ state: 'visible', timeout: 5000 });
  await emailInput.fill(PATIENT_EMAIL);
  await passwordInput.waitFor({ state: 'visible', timeout: 5000 });
  await passwordInput.fill(PATIENT_PASSWORD);
  await signInBtn.click();

  await page.waitForURL(/\/patient\//, { timeout: 20000 });
}

/** Mock API to return specific payload */
export async function mockApiResponse(page: Page, endpointPart: string, payload: unknown, status = 200) {
  await page.route(`**/api/**${endpointPart}**`, async (route) => {
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(payload) });
  });
}

/** Force API failure for a specific endpoint */
export async function mockApiFailure(page: Page, endpointPart: string, message = 'Forced failure from Playwright') {
  await mockApiResponse(page, endpointPart, { message, title: 'Error' }, 500);
}

/** Collect API responses for evidence */
export function collectApiResponses(page: Page) {
  const responses: Array<{ url: string; method: string; status: number; body: unknown }> = [];
  page.on('response', async (response) => {
    const req = response.request();
    if (!req.url().includes('/api/')) return;
    try {
      const ct = response.headers()['content-type'] ?? '';
      const body = ct.includes('application/json') ? await response.json() : await response.text();
      responses.push({ url: req.url(), method: req.method(), status: response.status(), body });
    } catch { /* ignore */ }
  });
  return responses;
}

/** Assert no persistent loading state after timeout */
export async function expectNoPersistentLoading(page: Page) {
  await expect(page.locator(SELECTORS.loading)).toHaveCount(0, { timeout: 8000 }).catch(async () => {
    await expect(page.locator(SELECTORS.loading).first()).toBeHidden({ timeout: 5000 });
  });
}

/** Assert page content is actually visible to the user (not hidden by CSS) */
export async function expectPageVisible(page: Page, selector = '.page-shell, .page-shell__header, .page-title, main') {
  const el = page.locator(selector).first();
  await expect(el).toBeAttached({ timeout: 10000 });
  // Verify computed display is not 'none' — catches CSS visibility bugs
  const display = await el.evaluate((node) => getComputedStyle(node).display);
  expect(display).not.toBe('none');
}

/** Navigate to patient route after login, return API responses */
export async function openPatientRoute(page: Page, route: string) {
  const responses = collectApiResponses(page);
  await page.goto(route);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2500);
  return responses;
}

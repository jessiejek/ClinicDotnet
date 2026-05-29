import { expect, type Page } from '@playwright/test';

/** Doctor test credentials (IdentitySeeder) */
export const DOCTOR_EMAIL = process.env.PLAYWRIGHT_DOCTOR_EMAIL || 'dr.reyes@gavino.clinic';
export const DOCTOR_PASSWORD = process.env.PLAYWRIGHT_DOCTOR_PASSWORD || 'Doctor@123456';
export const API_BASE = 'http://localhost:5000/api';

/** Route map */
export const ROUTES = {
  dashboard: '/doctor/dashboard',
  appointments: '/doctor/appointments',
  appointmentDetail: '/doctor/appointments/',
  patients: '/doctor/patients',
  patientDetail: '/doctor/patients/',
  schedule: '/doctor/schedule',
  consultation: '/doctor/consultation/',
  profile: '/doctor/profile',
} as const;

/** Confirmed selectors from doctor portal source */
export const SELECTORS = {
  pageTitle: '.dt, h1, .page-title',
  pageSubtitle: '.ds, .page-subtitle',
  loading: 'ion-spinner[name="crescent"], .page-loading',
  emptyState: 'app-empty-state',
  toast: 'ion-toast',
  statusBadge: 'app-status-badge',

  // Dashboard
  greeting: '.dh h1',
  nextPatientBanner: '.np-banner',
  startConsultBtn: 'button:has-text("Start Consult")',
  viewChartBtn: 'button:has-text("View Chart")',
  kpiCards: '.kc',
  kpiValue: '.kv',
  queueItems: '.qi',
  queueItem: '.qi',
  noQueueMsg: '.qe',
  availabilityPanel: '.ss',

  // Appointments
  statBar: '.stat-bar',
  statPill: '.stat-pill',
  filterSelect: 'select',
  searchInput: 'input[type="search"]',
  refreshBtn: '.filters-grid__refresh',
  queueTable: 'table.clinic-table',
  queueRow: 'tr[role="button"]',
  checkInBadge: '.status-badge',

  // Consultation workspace
  patientIdentityStrip: 'app-patient-identity-strip',
  consultationWorkspace: 'app-consultation-workspace',
  soapForm: 'app-soap-form',
  vitalSignsForm: 'app-vital-signs-form',
  prescriptionBuilder: 'app-prescription-builder',
  diagnosisPicker: 'app-diagnosis-picker',
  followUpForm: 'app-follow-up-form',
  labRequestForm: 'app-lab-request-form',
  vaccinationForm: 'app-vaccination-form',
  consultationCompleteModal: 'app-consultation-complete-modal',
  completeConsultBtn: 'button:has-text("Complete Consultation")',
  submitBtn: 'button[type="submit"]',

  // Schedule
  scheduleEditor: 'app-doctor-schedule-editor',
  statusPanel: 'app-doctor-status-panel',

  // Patients
  patientsTable: 'table.clinic-table',
  patientSearchInput: 'input[placeholder*="Search"]',

  // Profile
  profileForm: 'form',
} as const;

/** Login as doctor */
export async function loginAsDoctor(page: Page) {
  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  await page.locator('ion-input[formControlName="email"]').waitFor({ state: 'attached', timeout: 10000 });

  const emailInput = page.locator('ion-input[formControlName="email"]').locator('input');
  const passwordInput = page.locator('ion-input[formControlName="password"]').locator('input');
  const signInBtn = page.getByRole('button', { name: /sign ?in/i });

  await emailInput.waitFor({ state: 'visible', timeout: 5000 });
  await emailInput.fill(DOCTOR_EMAIL);
  await passwordInput.waitFor({ state: 'visible', timeout: 5000 });
  await passwordInput.fill(DOCTOR_PASSWORD);
  await signInBtn.click();
  await page.waitForURL(/\/doctor\//, { timeout: 20000 });
}

/** Mock API response */
export async function mockApiResponse(page: Page, endpointPart: string, payload: unknown, status = 200) {
  await page.route(`**/api/**${endpointPart}**`, async (route) => {
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(payload) });
  });
}

/** Force API failure */
export async function mockApiFailure(page: Page, endpointPart: string, message = 'Forced failure from Playwright') {
  await mockApiResponse(page, endpointPart, { message }, 500);
}

/** Collect API responses */
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

/** Assert loading resolves */
export async function expectNoPersistentLoading(page: Page) {
  await expect(page.locator(SELECTORS.loading)).toHaveCount(0, { timeout: 10000 }).catch(async () => {
    await expect(page.locator(SELECTORS.loading).first()).toBeHidden({ timeout: 5000 });
  });
}

/** Assert page content is actually visible to the user (not hidden by CSS) */
export async function expectPageVisible(page: Page, selector = '.page-shell, .page-shell__header, .page-title, main') {
  const el = page.locator(selector).first();
  await expect(el).toBeAttached({ timeout: 10000 });
  const display = await el.evaluate((el) => getComputedStyle(el).display);
  expect(display).not.toBe('none');
}

/** Open doctor route after login */
export async function openDoctorRoute(page: Page, route: string) {
  const responses = collectApiResponses(page);
  await page.goto(route);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2500);
  return responses;
}

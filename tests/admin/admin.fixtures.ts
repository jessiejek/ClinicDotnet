import { expect, type Page } from '@playwright/test';

/** Admin test credentials (seeded from IdentitySeeder) */
export const ADMIN_EMAIL = process.env.PLAYWRIGHT_ADMIN_EMAIL || 'admin@gavino.clinic';
export const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD || 'Admin@123456';
export const API_BASE = 'http://localhost:5000/api';

/** Route map from admin.routes.ts */
export const ROUTES = {
  dashboard: '/admin/dashboard',
  bookings: '/admin/bookings',
  bookingDetail: '/admin/bookings/',
  walkIn: '/admin/walk-in',
  calendar: '/admin/calendar',
  doctors: '/admin/doctors',
  doctorNew: '/admin/doctors/new',
  services: '/admin/services',
  patients: '/admin/patients',
  patientDetail: '/admin/patients/',
  staff: '/admin/staff',
  announcements: '/admin/announcements',
  settings: '/admin/settings',
  auditLogs: '/admin/audit-logs',
  reports: '/admin/reports',
} as const;

/** Selectors verified from admin portal source */
export const SELECTORS = {
  pageTitle: '.page-title',
  pageSubtitle: '.page-subtitle',
  loading: '.page-loading, ion-spinner[name="crescent"]',
  spinner: 'ion-spinner[name="crescent"]',
  skeleton: 'app-skeleton',
  emptyState: 'app-empty-state',
  errorState: '.page-error',
  toast: 'ion-toast',

  // Dashboard
  statCard: '.stat-card',
  statCardValue: '.stat-card__value',
  statCardLabel: '.stat-card__label',

  // Bookings
  filterSelect: 'select.filter-input',
  bookingsTable: 'table.clinic-table',
  bookingRow: '.booking-row',
  pagination: '.pagination',

  // Doctors
  doctorCard: 'app-doctor-card',
  doctorRow: 'tr[role="button"]',
  addDoctorBtn: 'a[routerLink="/admin/doctors/new"], button:has-text("Add Doctor")',

  // Services
  serviceCard: '.service-card',
  serviceRow: 'tr[role="button"]',
  addServiceBtn: 'button:has-text("Add Service")',

  // Patients
  searchInput: 'input.filter-input[type="search"], ion-searchbar',
  patientsTable: 'table.clinic-table',
  patientRow: 'tr[role="button"]',

  // Staff Accounts
  staffTable: 'table.clinic-table',
  staffRow: 'tr[role="button"]',

  // Calendar
  calendarGrid: '.calendar-grid, app-calendar',

  // Reports / Audit / Settings
  reportsContent: 'app-reports-page',
  auditLogsContent: 'app-audit-logs-page',
  settingsContent: 'app-settings-page',
  announcementsContent: 'app-announcements-page',

  // Common
  retryBtn: 'button:has-text("Retry")',
  refreshBtn: 'button:has-text("Refresh")',
} as const;

/** Login as admin */
export async function loginAsAdmin(page: Page) {
  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  await page.locator('ion-input[formControlName="email"]').waitFor({ state: 'attached', timeout: 10000 });

  const emailInput = page.locator('ion-input[formControlName="email"]').locator('input');
  const passwordInput = page.locator('ion-input[formControlName="password"]').locator('input');
  const signInBtn = page.getByRole('button', { name: /sign ?in/i });

  await emailInput.waitFor({ state: 'visible', timeout: 5000 });
  await emailInput.fill(ADMIN_EMAIL);
  await passwordInput.waitFor({ state: 'visible', timeout: 5000 });
  await passwordInput.fill(ADMIN_PASSWORD);
  await signInBtn.click();
  await page.waitForURL(/\/admin\//, { timeout: 20000 });
}

/** Mock API response for a specific endpoint */
export async function mockApiResponse(page: Page, endpointPart: string, payload: unknown, status = 200) {
  await page.route(`**/api/**${endpointPart}**`, async (route) => {
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(payload) });
  });
}

/** Force API failure for a specific endpoint */
export async function mockApiFailure(page: Page, endpointPart: string, message = 'Forced failure from Playwright') {
  await mockApiResponse(page, endpointPart, { message, title: 'Error' }, 500);
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
  const loadingSelectors = [SELECTORS.loading, SELECTORS.skeleton, SELECTORS.spinner].filter(Boolean).join(', ');
  await expect(page.locator(loadingSelectors)).toHaveCount(0, { timeout: 10000 }).catch(async () => {
    await expect(page.locator(SELECTORS.spinner).first()).toBeHidden({ timeout: 5000 });
  });
}

/** Assert page content is actually visible to the user (not hidden by CSS) */
export async function expectPageVisible(page: Page, selector = '.page-shell, .page-title, main') {
  const el = page.locator(selector).first();
  await expect(el).toBeAttached({ timeout: 10000 });
  const display = await el.evaluate((el) => getComputedStyle(el).display);
  expect(display).not.toBe('none');
}

/** Navigate to admin route after login */
export async function openAdminRoute(page: Page, route: string) {
  const responses = collectApiResponses(page);
  await page.goto(route);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2500);
  return responses;
}

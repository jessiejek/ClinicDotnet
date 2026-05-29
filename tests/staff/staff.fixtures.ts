import { expect, type Page } from '@playwright/test';

/** Staff test credentials */
export const STAFF_EMAIL = process.env.PLAYWRIGHT_STAFF_EMAIL || 'staff@gavino.clinic';
export const STAFF_PASSWORD = process.env.PLAYWRIGHT_STAFF_PASSWORD || 'Staff@123456';
export const API_BASE = 'http://localhost:5000/api';

/** Route map */
export const ROUTES = {
  dashboard: '/staff/dashboard',
  bookings: '/staff/bookings',
  bookingDetail: '/staff/bookings/',
  payments: '/staff/payments',
  walkIn: '/staff/walk-in',
  patients: '/staff/patients',
  patientDetail: '/staff/patients/',
  doctorStatus: '/staff/doctor-status',
  profile: '/staff/profile',
} as const;

/** Confirmed selectors from Phase 1 analysis */
export const SELECTORS = {
  pageTitle: '.page-title',
  pageSubtitle: '.page-subtitle',
  loadingCard: '.loading-card',
  skeleton: 'app-skeleton',
  spinner: 'ion-spinner',
  emptyState: 'app-empty-state',
  toast: 'ion-toast',
  confirmModal: 'app-confirm-modal',

  // Dashboard
  statCard: '.stat-card',
  statCardValue: '.stat-card__value',
  statCardLabel: '.stat-card__label',
  bannerDanger: '.banner--danger',
  queueTable: 'app-queue-table',

  // Bookings
  filterSelect: 'select.filter-input',
  bookingsTable: 'table.bookings-table',
  bookingRow: '.booking-row',
  mobileCard: '.mobile-card',
  checkInBtn: 'button:has-text("Check In")',
  undoCheckInBtn: 'button:has-text("Undo Check-In")',
  pagination: '.pagination',
  paginationPage: '.pagination__page',
  refreshBtn: 'button:has-text("Refresh")',

  // Booking Detail
  detailGrid: '.detail-grid',
  actionSidebar: '.action-sidebar',
  backBtn: 'button:has-text("Back to Bookings")',
  confirmPaymentBtn: 'button:has-text("Confirm Payment")',
  waivePfBtn: 'button:has-text("Waive PF")',
  printBtn: 'button:has-text("Print")',
  paymentModal: 'ion-modal',
  paymentMethodSelect: 'select[name="paymentMethod"]',
  amountReceivedInput: 'input[name="amountReceived"]',
  referenceNumberInput: 'input[name="referenceNumber"]',

  // Doctor Status
  doctorStatusCard: 'app-doctor-status-card',
  doctorStatusSkeleton: 'app-skeleton',
  errorBlock: '.er',
  retryBtn: 'button:has-text("Retry")',

  // Patients
  searchInput: 'input.fi[aria-label="Search patients"]',
  patientsTable: 'table.pt',
  patientRow: 'tr[role="button"]',
  patientMobileCard: '.mc',
  patientMeta: '.pm',

  // Walk-In
  stepper: '.stepper',
  stepperStep: '.stepper__step',
  walkInSearchbar: 'ion-searchbar.walk-in-searchbar',
  quickRegisterForm: '.quick-register',
  slotGrid: 'app-slot-grid',
  walkInSubmitBtn: 'button:has-text("Confirm Walk-In")',

  // Profile
  profileForm: 'form.profile-card',
  profileInput: 'ion-input',
} as const;

/** Real-time login as staff */
export async function loginAsStaff(page: Page) {
  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  await page.waitForSelector('input[type="email"], ion-input[formControlName="email"] input', { timeout: 10000 });

  const emailInput = page.locator('input[type="email"]').or(page.locator('ion-input[formControlName="email"] input')).first();
  const passwordInput = page.locator('input[type="password"]').or(page.locator('ion-input[formControlName="password"] input')).first();
  const signInBtn = page.getByRole('button', { name: /sign ?in/i });

  await emailInput.fill(STAFF_EMAIL);
  await passwordInput.fill(STAFF_PASSWORD);
  await signInBtn.click();

  await page.waitForURL(/\/staff\//, { timeout: 20000 });
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
  await expect(page.locator(SELECTORS.loadingCard, SELECTORS.skeleton, SELECTORS.spinner)).toHaveCount(0, { timeout: 8000 }).catch(async () => {
    await expect(page.locator(SELECTORS.loadingCard).first()).toBeHidden({ timeout: 5000 });
  });
}

/** Navigate to staff route after login */
export async function openStaffRoute(page: Page, route: string) {
  const responses = collectApiResponses(page);
  await page.goto(route);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2500);
  return responses;
}

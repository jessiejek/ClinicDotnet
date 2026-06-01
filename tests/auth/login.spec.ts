import { expect, test } from '@playwright/test';

// Routes shared across roles
const BASE_URL = process.env['E2E_BASE_URL'] || 'http://localhost:4200';
const ROUTES = {
  login: '/auth/login',
  adminDashboard: '/admin/dashboard',
  staffDashboard: '/staff/dashboard',
  doctorDashboard: '/doctor/dashboard',
  patientDashboard: '/patient/dashboard',
} as const;

const CREDENTIALS: Record<string, { email: string; password: string; expectedPath: string }> = {
  admin: {
    email: process.env['E2E_ADMIN_EMAIL'] || 'admin@gavino.clinic',
    password: process.env['E2E_ADMIN_PASSWORD'] || 'Admin@123456',
    expectedPath: ROUTES.adminDashboard,
  },
  staff: {
    email: process.env['E2E_STAFF_EMAIL'] || 'staff@gavino.clinic',
    password: process.env['E2E_STAFF_PASSWORD'] || 'Staff@123456',
    expectedPath: ROUTES.staffDashboard,
  },
  doctor: {
    email: process.env['E2E_DOCTOR_EMAIL'] || 'dr.santos@gavino.clinic',
    password: process.env['E2E_DOCTOR_PASSWORD'] || 'Doctor@123456',
    expectedPath: ROUTES.doctorDashboard,
  },
  patient: {
    email: process.env['E2E_PATIENT_EMAIL'] || 'patient@gavino.clinic',
    password: process.env['E2E_PATIENT_PASSWORD'] || 'Patient@123456',
    expectedPath: ROUTES.patientDashboard,
  },
};

test.describe('Auth Login and Role Redirects', () => {
  for (const [role, creds] of Object.entries(CREDENTIALS)) {
    test(`logs in as ${role} and redirects to ${role} dashboard`, async ({ page }) => {
      // test.skip removed — using known defaults from login_body.json

      await page.goto(ROUTES.login);
      await page.waitForLoadState('networkidle');

      // Use stable data-testid selectors; ion-input requires shadow DOM penetration
      const emailInput = page.getByTestId('auth-login-email-input').locator('input');
      const passwordInput = page.getByTestId('auth-login-password-input').locator('input');
      const submitButton = page.getByTestId('auth-login-submit-button');

      await emailInput.waitFor({ state: 'visible', timeout: 10_000 });
      await emailInput.fill(creds.email);
      await passwordInput.waitFor({ state: 'visible', timeout: 10_000 });
      await passwordInput.fill(creds.password);

      // Click submit and wait for redirect
      await Promise.all([
        page.waitForURL((url) => url.pathname.startsWith(creds.expectedPath), { timeout: 30_000 }),
        submitButton.click(),
      ]);

      // Assert role-specific dashboard is visible
      await expect(page).toHaveURL(new RegExp(creds.expectedPath.replace('/', '\\/')));
      await expect(page.locator('body')).toBeVisible();
    });
  }

  test('shows visible validation message for invalid login input', async ({ page }) => {
    await page.goto(ROUTES.login);
    await page.waitForLoadState('networkidle');

    // Click submit with empty form
    const submitButton = page.getByTestId('auth-login-submit-button');
    await submitButton.click();

    // Assert validation errors are visible
    await expect(page.getByText(/Email is required/i).first()).toBeVisible();
    await expect(page.getByText(/Password is required/i).first()).toBeVisible();
  });

  test('shows visible error banner for invalid credentials', async ({ page }) => {
    await page.goto(ROUTES.login);
    await page.waitForLoadState('networkidle');

    const emailInput = page.getByTestId('auth-login-email-input').locator('input');
    const passwordInput = page.getByTestId('auth-login-password-input').locator('input');
    const submitButton = page.getByTestId('auth-login-submit-button');

    await emailInput.fill('nonexistent@test.clinic');
    await passwordInput.fill('wrongpassword');
    await submitButton.click();

    // Wait for error banner to appear after API failure
    const errorBanner = page.getByTestId('auth-login-error-message');
    await expect(errorBanner).toBeVisible({ timeout: 15_000 });
  });
});

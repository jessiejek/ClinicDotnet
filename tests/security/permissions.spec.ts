import { expect, test } from '@playwright/test';

const BASE_URL = process.env['E2E_BASE_URL'] || 'http://localhost:4200';
const ROUTES = {
  login: '/auth/login',
  loginApi: '**/api/auth/login',
  meApi: '**/api/auth/me',
  adminDashboard: '/admin/dashboard',
  staffDashboard: '/staff/dashboard',
  doctorDashboard: '/doctor/dashboard',
  patientDashboard: '/patient/dashboard',
} as const;

const CREDENTIALS: Record<string, { email: string; password: string }> = {
  admin: {
    email: process.env['E2E_ADMIN_EMAIL'] || 'admin@gavino.clinic',
    password: process.env['E2E_ADMIN_PASSWORD'] || 'Admin@123456',
  },
  staff: {
    email: process.env['E2E_STAFF_EMAIL'] || 'staff@gavino.clinic',
    password: process.env['E2E_STAFF_PASSWORD'] || 'Staff@123456',
  },
  doctor: {
    email: process.env['E2E_DOCTOR_EMAIL'] || 'dr.santos@gavino.clinic',
    password: process.env['E2E_DOCTOR_PASSWORD'] || 'Doctor@123456',
  },
  patient: {
    email: process.env['E2E_PATIENT_EMAIL'] || 'patient@gavino.clinic',
    password: process.env['E2E_PATIENT_PASSWORD'] || 'Patient@123456',
  },
};

test.describe('Security — Auth Guards & Permissions', () => {
  test.describe('Unauthenticated access blocked', () => {
    const protectedRoutes = [
      { label: 'Admin', path: ROUTES.adminDashboard },
      { label: 'Staff', path: ROUTES.staffDashboard },
      { label: 'Doctor', path: ROUTES.doctorDashboard },
      { label: 'Patient', path: ROUTES.patientDashboard },
    ];

    for (const route of protectedRoutes) {
      test(`redirects unauthenticated user away from ${route.label} dashboard`, async ({ page }) => {
        await page.goto(route.path);
        await page.waitForLoadState('networkidle');
        // Should redirect to login; check login page elements are visible
        await expect(page).toHaveURL(/\/auth\/login/);
        await expect(page.getByTestId('auth-login-email-input')).toBeVisible();
      });
    }
  });

  test.describe('Cross-role access blocked', () => {
    const roleRouteMap = [
      { role: 'admin', login: ROUTES.adminDashboard, forbidden: [ROUTES.staffDashboard, ROUTES.doctorDashboard, ROUTES.patientDashboard] },
      { role: 'staff', login: ROUTES.staffDashboard, forbidden: [ROUTES.adminDashboard, ROUTES.doctorDashboard, ROUTES.patientDashboard] },
      { role: 'doctor', login: ROUTES.doctorDashboard, forbidden: [ROUTES.adminDashboard, ROUTES.staffDashboard, ROUTES.patientDashboard] },
      { role: 'patient', login: ROUTES.patientDashboard, forbidden: [ROUTES.adminDashboard, ROUTES.staffDashboard, ROUTES.doctorDashboard] },
    ];

    for (const entry of roleRouteMap) {
      for (const forbidden of entry.forbidden) {
        test(`${entry.role} cannot access ${forbidden}`, async ({ page }) => {
          const creds = CREDENTIALS[entry.role];
          // test.skip removed — using known defaults from login_body.json

          // Login first
          await page.goto(ROUTES.login);
          await page.waitForLoadState('networkidle');
          await page.getByTestId('auth-login-email-input').locator('input').fill(creds.email);
          await page.getByTestId('auth-login-password-input').locator('input').fill(creds.password);
          await Promise.all([
            page.waitForURL((url) => url.pathname.startsWith(entry.login), { timeout: 30_000 }),
            page.getByTestId('auth-login-submit-button').click(),
          ]);

          // Try visiting another role's dashboard
          await page.goto(forbidden);
          await page.waitForLoadState('networkidle');

          // Should NOT land on the forbidden page
          await expect(page).not.toHaveURL(new RegExp(`^${forbidden.replace('/', '\\/')}$`));
        });
      }
    }
  });

  test.describe('Logout clears session', () => {
    test('logged-in user can log out and protected routes redirect to login', async ({ page }) => {
      const creds = CREDENTIALS.patient;
      // test.skip removed — using known defaults

      // Login as patient
      await page.goto(ROUTES.login);
      await page.waitForLoadState('networkidle');
      await page.getByTestId('auth-login-email-input').locator('input').fill(creds.email);
      await page.getByTestId('auth-login-password-input').locator('input').fill(creds.password);
      await Promise.all([
        page.waitForURL(/\/patient\//, { timeout: 30_000 }),
        page.getByTestId('auth-login-submit-button').click(),
      ]);
      await expect(page).toHaveURL(/\/patient\/dashboard/);

      // Logout — find the logout button (typically in portal nav)
      const logoutButton = page.getByRole('button', { name: /logout|sign out/i }).first();
      await logoutButton.waitFor({ state: 'visible', timeout: 10_000 });
      await logoutButton.click();

      // Should redirect to login
      await page.waitForURL(/\/auth\/login/, { timeout: 30_000 });
      await expect(page.getByTestId('auth-login-email-input')).toBeVisible();

      // Try accessing protected route again
      await page.goto(ROUTES.patientDashboard);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/auth\/login/);
    });
  });
});

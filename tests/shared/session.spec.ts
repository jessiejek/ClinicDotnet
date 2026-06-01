import { expect, test } from '@playwright/test';

const ROUTES = {
  login: '/auth/login',
  patientDashboard: '/patient/dashboard',
} as const;

const CREDENTIALS = {
  patient: {
    email: process.env['E2E_PATIENT_EMAIL'] || 'patient@gavino.clinic',
    password: process.env['E2E_PATIENT_PASSWORD'] || 'Patient@123456',
  },
};

test.describe('Shared — Session restore and token behavior', () => {
  test('existing authenticated session restores on page reload', async ({ page }) => {
    const creds = CREDENTIALS.patient;

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

    // Reload and wait for auth/me call
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Assert same dashboard remains visible
    await expect(page).toHaveURL(/\/patient\/dashboard/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('expired session redirects to login on protected route access', async ({ page }) => {
    const creds = CREDENTIALS.patient;

    // Login as patient
    await page.goto(ROUTES.login);
    await page.waitForLoadState('networkidle');
    await page.getByTestId('auth-login-email-input').locator('input').fill(creds.email);
    await page.getByTestId('auth-login-password-input').locator('input').fill(creds.password);
    await Promise.all([
      page.waitForURL(/\/patient\//, { timeout: 30_000 }),
      page.getByTestId('auth-login-submit-button').click(),
    ]);

    // Simulate expired session by clearing auth tokens from storage
    // Token keys from TokenService: clinic.auth.access-token, clinic.auth.refresh-token
    await page.evaluate(() => {
      localStorage.removeItem('clinic.auth.access-token');
      localStorage.removeItem('clinic.auth.refresh-token');
      localStorage.removeItem('clinic.auth.user');
    });
    await page.goto(ROUTES.patientDashboard);
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByTestId('auth-login-email-input')).toBeVisible();
  });
});

import { chromium, type FullConfig } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

export const FRONTEND_URL = process.env.PLAYWRIGHT_FRONTEND_URL ?? 'http://127.0.0.1:4200';
export const API_URL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://localhost:5000/api';

export const CREDENTIALS = {
  patient: {
    email: process.env.PLAYWRIGHT_PATIENT_EMAIL ?? 'patient@gavino.clinic',
    password: process.env.PLAYWRIGHT_PATIENT_PASSWORD ?? 'Patient@123456',
  },
};

export const STORAGE = {
  patient: 'tests/.auth/patient.json',
};

async function globalSetup(_config: FullConfig): Promise<void> {
  const authDir = path.resolve('tests/.auth');
  await fs.mkdir(authDir, { recursive: true });

  // Skip if credentials not set (allow per-test login as fallback)
  const creds = CREDENTIALS.patient;
  if (!creds.email || !creds.password) {
    console.log('⚠️ Patient credentials not set — skipping global setup. Tests will login individually.');
    await fs.writeFile(path.join(authDir, 'patient.json'), JSON.stringify({ cookies: [], origins: [] }), 'utf-8');
    return;
  }

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ baseURL: FRONTEND_URL });

  try {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Fill email
    const emailInput = page.locator('input[type="email"]').or(
      page.locator('ion-input[formControlName="email"] input')
    ).first();
    await emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await emailInput.fill(creds.email);

    // Fill password
    const passwordInput = page.locator('input[type="password"]').or(
      page.locator('ion-input[formControlName="password"] input')
    ).first();
    await passwordInput.fill(creds.password);

    // Click sign in
    const signInBtn = page.getByRole('button', { name: /sign ?in/i });
    await signInBtn.click();

    // Wait for navigation to patient portal
    await page.waitForURL(/\/patient\//, { timeout: 30000 });
    console.log(`✅ Patient logged in: ${page.url()}`);

    await page.context().storageState({ path: STORAGE.patient });
    console.log(`✅ Patient auth state saved to ${STORAGE.patient}`);
  } catch (err) {
    console.error('❌ Global setup failed:', err instanceof Error ? err.message : err);
    throw err;
  } finally {
    await browser.close();
  }
}

export default globalSetup;

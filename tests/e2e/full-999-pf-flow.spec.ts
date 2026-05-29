import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:5000/api';

async function loginAs(page: Page, email: string, password: string, expectedRole: string) {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
  await page.locator('input[type="email"]').first().fill(email);
  await page.locator('input[type="password"]').first().fill(password);
  await page.getByRole('button', { name: /sign ?in/i }).click();
  await page.waitForURL(new RegExp(`/${expectedRole}/`), { timeout: 20000 });
  const visible = await page.evaluate(() => {
    const shell = document.querySelector('.page-shell, .page-title, main');
    if (!shell) return 'no-shell';
    return getComputedStyle(shell).display;
  });
  if (visible === 'none') throw new Error(`Page content hidden (display:none) after login as ${email}`);
  console.log(`✅ Logged in as ${email}`);
}

async function apiCall(page: Page, method: string, endpoint: string, body?: unknown): Promise<{ status: number; body: any }> {
  const token = await page.evaluate(() => localStorage.getItem('clinic.auth.access-token'));
  return page.evaluate(async ({ method, endpoint, body, token, API_BASE }) => {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
      body: body ? JSON.stringify(body) : undefined
    });
    const ct = res.headers.get('content-type') || '';
    const data = ct.includes('application/json') ? await res.json() : await res.text();
    return { status: res.status, body: data };
  }, { method, endpoint, body, token, API_BASE });
}

test.describe('E2E: 999 PF Full Flow', () => {

  test('Patient books → Staff confirms → Doctor completes (PF 999) → Staff collects 999', async ({ page }) => {
    let bookingId = '';

    // ============================================================
    // 1. PATIENT BOOKS
    // ============================================================
    await test.step('Patient: book consultation', async () => {
      await loginAs(page, 'patient@gavino.clinic', 'Patient@123456', 'patient');

      await page.goto('/patient/doctors');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      await page.waitForSelector('app-doctor-card', { timeout: 15000 });

      await page.locator('app-doctor-card').first().locator('a.btn-book').click();
      await page.waitForURL(/\/public\/booking\?doctorId=/, { timeout: 15000 });

      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(2000);
        if (i === 0) {
          await page.locator('.service-option').first().click();
        }
        if (i === 2) {
          const slot = page.locator('.slot-chip:not([disabled])').filter({ hasNotText: /Full|Past/ }).first();
          await expect(slot).toBeVisible({ timeout: 10000 });
          await slot.click();
        }
        await page.getByRole('button', { name: /continue/i }).click();
      }

      await page.waitForTimeout(2000);
      await page.getByRole('button', { name: /confirm booking/i }).click();

      const resp = await page.waitForResponse(
        r => r.url().includes('/api/bookings') && r.request().method() === 'POST',
        { timeout: 30000 }
      );
      expect(resp.status()).toBe(200);
      bookingId = (await resp.json()).id || '';
      console.log(`📋 Booking: ${resp.status()} — ID: ${bookingId}`);
      expect(bookingId).toBeTruthy();
    });

    if (!bookingId) { test.fixme(true, 'No booking'); return; }

    // ============================================================
    // 2. STAFF CONFIRMS THE BOOKING
    // ============================================================
    await test.step('Staff: confirm booking', async () => {
      await loginAs(page, 'staff@gavino.clinic', 'Staff@123456', 'staff');

      const result = await apiCall(page, 'PATCH', `bookings/${bookingId}/confirm`);
      console.log(`✅ Staff confirm: ${result.status}`);
      expect(result.status).toBe(200);
    });

    // ============================================================
    // 3. STAFF CHECKS IN
    // ============================================================
    await test.step('Staff: check in', async () => {
      const result = await apiCall(page, 'PATCH', `bookings/${bookingId}/check-in`);
      console.log(`✅ Staff check-in: ${result.status}`);
      expect(result.status).toBe(200);
    });

    // ============================================================
    // 4. DOCTOR COMPLETES CONSULTATION WITH PF = 999
    // ============================================================
    await test.step('Doctor: complete with finalAmount=999', async () => {
      await loginAs(page, 'dr.reyes@gavino.clinic', 'Doctor@123456', 'doctor');

      const result = await page.evaluate(async ({ bookingId, API_BASE }) => {
        const token = localStorage.getItem('clinic.auth.access-token');
        if (!token) return 'no-token';

        const res = await fetch(`${API_BASE}/bookings/${bookingId}/doctor-complete`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            isProfessionalFeeWaived: false,
            finalAmount: 999,
            soap: {
              subjective: 'Patient reports persistent cough',
              objective: 'BP 120/80, HR 72, Temp 36.5',
              assessment: 'Upper respiratory tract infection',
              plan: 'Prescribe antibiotics and rest for 5 days'
            },
            vitalSigns: { systolicBp: 120, diastolicBp: 80, heartRate: 72, temperature: 36.5 },
            diagnoses: [{ diagnosisText: 'Acute nasopharyngitis', diagnosisCode: 'J00', isPrimary: true }]
          })
        });

        if (res.ok) return `success: ${res.status}`;
        return `failed: ${res.status} - ${await res.text()}`;
      }, { bookingId, API_BASE });

      console.log(`👨‍⚕️ Doctor complete: ${result}`);
      expect(result).toContain('success');
    });

    // ============================================================
    // 5. STAFF COLLECTS 999 PAYMENT
    // ============================================================
    await test.step('Staff: collect 999 payment via UI', async () => {
      // Login fresh as staff
      await loginAs(page, 'staff@gavino.clinic', 'Staff@123456', 'staff');

      // Navigate to payments page via UI
      await page.goto('/staff/payments');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      // Verify the amount due shows 999
      const amountCell = page.locator('table.pt tbody tr td.am').first();
      await expect(amountCell).toBeVisible({ timeout: 5000 });
      const amountText = await amountCell.textContent();
      console.log(`💰 Amount due in table: "${amountText?.trim()}"`);
      expect(amountText).toContain('999');

      // Open the payment modal
      const confirmBtn = page.locator('button:has-text("Confirm Payment")').first();
      await expect(confirmBtn).toBeVisible({ timeout: 5000 });
      await confirmBtn.click();
      await page.waitForTimeout(1500);

      // Verify amountReceived is pre-filled with 999
      const amountInput = page.locator('input[name="amountReceived"]');
      await expect(amountInput).toBeVisible({ timeout: 5000 });
      const preFilled = await amountInput.inputValue();
      console.log(`💰 Amount received pre-filled: "${preFilled}"`);
      expect(Number(preFilled)).toBe(999);

      // Submit payment WITHOUT manual entry
      const apiResponse = page.waitForResponse(
        r => r.url().includes('/api/payments/') && r.url().includes('/confirm') && r.request().method() === 'PATCH',
        { timeout: 15000 }
      );

      await page.locator('section[role="dialog"] button.btn-primary').click();
      const resp = await apiResponse;

      console.log(`💳 Payment confirm: ${resp.status()} ${resp.status() === 200 ? '✅' : '💥'}`);
      expect(resp.status()).toBe(200);
    });

    // ============================================================
    // 6. VERIFY FINAL STATE
    // ============================================================
    await test.step('Verify: final booking = Completed / Paid / PF 999', async () => {
      await loginAs(page, 'staff@gavino.clinic', 'Staff@123456', 'staff');
      const result = await apiCall(page, 'GET', `bookings/${bookingId}`);
      expect(result.status).toBe(200);

      console.log(`📊 Final booking:`);
      console.log(`   Status: ${result.body?.status}`);
      console.log(`   Payment: ${result.body?.paymentStatus}`);
      console.log(`   Final Amount: ${result.body?.finalAmount}`);

      expect(result.body?.status).toBe('Completed');
      expect(result.body?.paymentStatus).toMatch(/Paid/i);
      expect(Number(result.body?.finalAmount)).toBe(999);
      console.log('✅✅ 999 PF FLOW COMPLETE!');
    });
  });
});

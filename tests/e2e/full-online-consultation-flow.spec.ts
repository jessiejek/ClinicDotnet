import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:5000/api';

const PATIENT_EMAIL = 'patient@gavino.clinic';
const PATIENT_PASSWORD = 'Patient@123456';
const STAFF_EMAIL = 'staff@gavino.clinic';
const STAFF_PASSWORD = 'Staff@123456';
const DOCTOR_EMAIL = 'dr.reyes@gavino.clinic';
const DOCTOR_PASSWORD = 'Doctor@123456';

async function loginAs(page: Page, email: string, password: string, expectedRole: string) {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  const emailInput = page.locator('input[type="email"]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  await emailInput.waitFor({ state: 'visible', timeout: 10000 });
  await emailInput.fill(email);
  await passwordInput.fill(password);
  await page.getByRole('button', { name: /sign ?in/i }).click();
  await page.waitForURL(new RegExp(`/${expectedRole}/`), { timeout: 20000 });
  // Verify page content is actually visible (not hidden by CSS like display:none)
  const visible = await page.evaluate(() => {
    const shell = document.querySelector('.page-shell, .page-title, main');
    if (!shell) return 'no-shell';
    return getComputedStyle(shell).display;
  });
  if (visible === 'none') throw new Error(`Page content hidden (display:none) after login as ${email}`);
  console.log(`✅ Logged in as ${email} → ${page.url()}`);
}

async function getAuthToken(page: Page): Promise<string | null> {
  return page.evaluate(() => localStorage.getItem('clinic.auth.access-token'));
}

async function apiCall(page: Page, method: string, endpoint: string, body?: unknown): Promise<{ status: number; body: any }> {
  const token = await getAuthToken(page);
  const response = await page.evaluate(async ({ method, endpoint, body, token, API_BASE }) => {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : await res.text();
    return { status: res.status, body: data };
  }, { method, endpoint, body, token, API_BASE });

  return response;
}

test.describe('E2E: Full Online Consultation Flow', () => {

  test('Patient books → staff checks in → doctor completes → staff collects payment', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(e.message));

    // ============================================================
    // STEP 1: PATIENT BOOKS CONSULTATION
    // ============================================================
    let bookingId = '';
    let bookingResponse: any = null;

    await test.step('Patient: book consultation via booking wizard', async () => {
      await loginAs(page, PATIENT_EMAIL, PATIENT_PASSWORD, 'patient');

      // Go to doctors page
      await page.goto('/patient/doctors');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      await page.waitForSelector('app-doctor-card', { timeout: 15000 });

      // Click Book Now on first doctor
      await page.locator('app-doctor-card').first().locator('a.btn-book').click();
      await page.waitForURL(/\/public\/booking\?doctorId=/, { timeout: 15000 });

      // Wizard steps 1-5: Continue through each
      const CONTINUE_STEPS = [
        async () => { // Step 1: Select service
          await page.waitForTimeout(2000);
          await page.locator('.service-option').first().click();
        },
        async () => { }, // Step 2: Date auto-selected
        async () => {   // Step 3: Select time slot
          await page.waitForTimeout(2000);
          const slot = page.locator('.slot-chip:not([disabled])').filter({ hasNotText: /Full|Past/ }).first();
          await expect(slot).toBeVisible({ timeout: 10000 });
          await slot.click();
        },
        async () => { }, // Step 4: Review
        async () => { }, // Step 5: Auth check
      ];

      for (let i = 0; i < CONTINUE_STEPS.length; i++) {
        await page.waitForTimeout(2000);
        await CONTINUE_STEPS[i]();
        await page.getByRole('button', { name: /continue/i }).click();
      }

      // Final step: Confirm Booking
      await page.waitForTimeout(2000);
      await page.getByRole('button', { name: /confirm booking/i }).click();

      const resp = await page.waitForResponse(
        (r) => r.url().includes('/api/bookings') && r.request().method() === 'POST',
        { timeout: 30000 }
      );
      expect(resp.status()).toBe(200);

      const body = await resp.json();
      bookingId = body.id || '';
      bookingResponse = body;
      console.log(`💰 Booking: ${resp.status()} — ID: ${bookingId}`);
      expect(bookingId).toBeTruthy();
    });

    if (!bookingId) {
      test.fixme(true, 'No booking ID was returned — cannot proceed with E2E flow.');
      return;
    }

    // ============================================================
    // STEP 2: STAFF CHECKS IN PATIENT
    // ============================================================
    await test.step('Staff: check in the booking', async () => {
      await loginAs(page, STAFF_EMAIL, STAFF_PASSWORD, 'staff');
      await page.goto('/staff/bookings');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      const result = await apiCall(page, 'PATCH', `bookings/${bookingId}/check-in`);
      expect(result.status).toBe(200);
      console.log(`✅ Staff check-in API: ${result.status}`);
    });

    // ============================================================
    // STEP 3: DOCTOR COMPLETES CONSULTATION
    // ============================================================
    await test.step('Doctor: complete consultation', async () => {
      await loginAs(page, DOCTOR_EMAIL, DOCTOR_PASSWORD, 'doctor');

      // Navigate to consultation workspace
      await page.goto(`/doctor/consultation/${bookingId}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      expect(page.url()).toContain('/doctor/consultation/');
      console.log('✅ Consultation workspace loaded.');

      // Complete consultation via direct API call with auth token
      const completeResult = await page.evaluate(async ({ bookingId, API_BASE }) => {
        try {
          const token = localStorage.getItem('clinic.auth.access-token');
          if (!token) return 'no-token';

          const response = await fetch(`${API_BASE}/bookings/${bookingId}/doctor-complete`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              isProfessionalFeeWaived: false,
              finalAmount: 650,
              soap: {
                chiefComplaint: 'E2E: Mild cough and fever for 3 days',
                subjective: 'Patient reports cough and fever for 3 days',
                objective: 'Temp 36.5C, BP 120/80',
                assessment: 'Upper respiratory tract infection',
                plan: 'Rest and hydration'
              },
              vitalSigns: {
                systolicBp: 120,
                diastolicBp: 80,
                heartRate: 72,
                temperature: 36.5
              },
              diagnoses: [{
                diagnosisText: 'Acute nasopharyngitis',
                diagnosisCode: 'J00',
                isPrimary: true
              }],
              prescription: null,
              labOrders: []
            })
          });

          if (response.ok) {
            const data = await response.json();
            return `success: ${response.status}`;
          } else {
            const text = await response.text();
            return `failed: ${response.status} - ${text}`;
          }
        } catch (e) {
          return 'error: ' + String(e);
        }
      }, { bookingId, API_BASE });

      console.log(`👨‍⚕️ Doctor complete API: ${completeResult}`);
      expect(completeResult).toContain('success');
      console.log('✅✅ CONSULTATION COMPLETED!');
    });

    // ============================================================
    // STEP 4: STAFF COLLECTS PAYMENT
    // ============================================================
    await test.step('Staff: collect payment', async () => {
      await loginAs(page, STAFF_EMAIL, STAFF_PASSWORD, 'staff');
      await page.goto('/staff/payments');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      // Step 4a: Get payment ID from booking
      const paymentResult = await apiCall(page, 'GET', `payments/booking/${bookingId}`);
      expect(paymentResult.status).toBe(200);
      const paymentId = paymentResult.body?.id || paymentResult.body?.paymentId || '';
      console.log(`💰 Payment ID: ${paymentId}`);

      // Step 4b: Confirm payment using payment ID
      const payResult = await apiCall(page, 'PATCH', `payments/${paymentId}/confirm`, {
        paymentMethod: 'Cash',
        amountReceived: 650,
        referenceNumber: 'E2E-TEST-001'
      });

      console.log(`💰 Payment confirm API: ${payResult.status}`);
      expect(payResult.status).toBe(200);

      // Verify payment status via API
      const verifyResult = await apiCall(page, 'GET', `bookings/${bookingId}`);
      if (verifyResult.status === 200) {
        console.log(`✅ Payment confirmed. Booking status: ${verifyResult.body?.status}, Payment: ${verifyResult.body?.paymentStatus}`);
      }
    });

    // ============================================================
    // STEP 5: FINAL VERIFICATION
    // ============================================================
    await test.step('Verify final booking status', async () => {
      const result = await apiCall(page, 'GET', `bookings/${bookingId}`);
      expect(result.status).toBe(200);
      console.log(`✅ Final booking status: ${JSON.stringify({
        id: bookingId,
        status: result.body?.status,
        paymentStatus: result.body?.paymentStatus
      })}`);
    });

    if (errors.length > 0) {
      console.log(`\n⚠️ ${errors.length} console errors:\n${errors.join('\n')}`);
    } else {
      console.log('\n🎉 No console errors.');
    }
  });
});

declare global {
  interface Window {
    ng: any;
  }
}

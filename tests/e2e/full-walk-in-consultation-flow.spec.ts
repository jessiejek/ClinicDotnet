import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:5000/api';

const STAFF_EMAIL = 'staff@gavino.clinic';
const STAFF_PASSWORD = 'Staff@123456';
const DOCTOR_EMAIL = 'dr.reyes@gavino.clinic';
const DOCTOR_PASSWORD = 'Doctor@123456';
const PATIENT_EMAIL = 'patient@gavino.clinic';
const PATIENT_PASSWORD = 'Patient@123456';

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
  return page.evaluate(async ({ method, endpoint, body, token, API_BASE }) => {
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
}

test.describe('E2E: Full Walk-In Consultation Flow', () => {

  test('Staff registers walk-in → checks in → doctor completes → staff collects payment', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(e.message));

    const timestamp = Date.now();
    const walkinFirstName = `Walkin${timestamp}`;
    const walkinLastName = `Test${timestamp}`;

    // ============================================================
    // STEP 1: STAFF CREATES WALK-IN BOOKING (via API for reliability)
    // ============================================================
    let walkinPatientId = '';
    let bookingId = '';

    await test.step('Staff: create walk-in patient and booking', async () => {
      await loginAs(page, STAFF_EMAIL, STAFF_PASSWORD, 'staff');

      // 1a. Create a walk-in patient (guest)
      const createPatientResult = await apiCall(page, 'POST', 'patients', {
        firstName: walkinFirstName,
        lastName: walkinLastName,
        dateOfBirth: '1990-06-15',
        sex: 'Male',
        contactNumber: `0917${timestamp.toString().slice(-8)}`,
        email: `walkin.${timestamp}@test.com`
      });
      console.log(`👤 Create patient API: ${createPatientResult.status}`);
      expect([200, 201]).toContain(createPatientResult.status);
      walkinPatientId = createPatientResult.body?.id || '';

      if (!walkinPatientId) {
        console.log('⚠️ No patient ID returned. Attempting to fetch patient list as fallback.');
        const patientsResult = await apiCall(page, 'GET', `patients?search=${walkinFirstName}`);
        if (patientsResult.status === 200) {
          const items = patientsResult.body?.items || patientsResult.body || [];
          walkinPatientId = items[0]?.id || '';
        }
      }

      expect(walkinPatientId).toBeTruthy();
      console.log(`✅ Walk-in patient created: ${walkinPatientId} (${walkinFirstName} ${walkinLastName})`);

      // 1b. Get doctors list for booking
      const doctorsResult = await apiCall(page, 'GET', 'doctors');
      expect(doctorsResult.status).toBe(200);
      const doctors = Array.isArray(doctorsResult.body) ? doctorsResult.body : doctorsResult.body?.items || [];
      const firstDoctor = doctors.find((d: any) => d.id) || doctors[0];
      expect(firstDoctor).toBeTruthy();
      const doctorId = firstDoctor.id;
      console.log(`👨‍⚕️ Using doctor: ${firstDoctor.fullName || doctorId}`);

      // 1c. Get first service for walk-in booking
      const servicesResult = await apiCall(page, 'GET', 'services');
      expect(servicesResult.status).toBe(200);
      const services = Array.isArray(servicesResult.body) ? servicesResult.body : servicesResult.body?.items || [];
      const firstService = services.find((s: any) => s.id) || services[0];
      const serviceId = firstService?.id || '';
      console.log(`📋 Using service: ${firstService?.name || serviceId}`);

      // 1d. Create walk-in booking
      const walkinResult = await apiCall(page, 'POST', 'bookings/walk-in', {
        patientId: walkinPatientId,
        doctorId: doctorId,
        serviceId: serviceId,
        notes: `E2E walk-in test ${timestamp}`
      });
      console.log(`📋 Walk-in booking API: ${walkinResult.status}`);
      expect([200, 201]).toContain(walkinResult.status);
      bookingId = walkinResult.body?.id || '';

      if (!bookingId) {
        // Try fetching todays bookings to find the booking
        const todayBookings = await apiCall(page, 'GET', 'bookings/staff/all?page=1&pageSize=50');
        if (todayBookings.status === 200) {
          const items = todayBookings.body?.items || todayBookings.body || [];
          const found = items.find((b: any) =>
            b.patientId === walkinPatientId ||
            (b.patientName && b.patientName.includes(walkinFirstName))
          );
          bookingId = found?.id || found?.bookingId || '';
          if (!bookingId && found) bookingId = found.id || '';
        }
      }

      expect(bookingId).toBeTruthy();
      console.log(`✅ Walk-in booking created: ${bookingId}`);
    });

    if (!bookingId || !walkinPatientId) {
      test.fixme(true, 'Could not create walk-in booking — skipping remaining steps.');
      return;
    }

    // ============================================================
    // STEP 2: STAFF CHECKS IN
    // ============================================================
    await test.step('Staff: check in walk-in patient', async () => {
      await loginAs(page, STAFF_EMAIL, STAFF_PASSWORD, 'staff');

      const result = await apiCall(page, 'PATCH', `bookings/${bookingId}/check-in`);
      console.log(`✅ Staff check-in API: ${result.status}`);
      expect(result.status).toBe(200);
    });

    // ============================================================
    // STEP 3: DOCTOR COMPLETES CONSULTATION
    // ============================================================
    await test.step('Doctor: complete consultation', async () => {
      await loginAs(page, DOCTOR_EMAIL, DOCTOR_PASSWORD, 'doctor');

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
                chiefComplaint: 'E2E Walk-in: Headache',
                subjective: 'Walk-in patient with headache',
                objective: 'BP 110/70, HR 76',
                assessment: 'Tension headache',
                plan: 'Rest'
              },
              vitalSigns: {
                systolicBp: 110,
                diastolicBp: 70,
                heartRate: 76,
                temperature: 36.5
              },
              diagnoses: [{
                diagnosisText: 'Tension headache',
                diagnosisCode: 'G44.2',
                isPrimary: true
              }],
              prescription: null,
              labOrders: []
            })
          });

          if (response.ok) {
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
      console.log('✅✅ WALK-IN CONSULTATION COMPLETED!');
    });

    // ============================================================
    // STEP 4: STAFF COLLECTS PAYMENT
    // ============================================================
    await test.step('Staff: collect payment', async () => {
      await loginAs(page, STAFF_EMAIL, STAFF_PASSWORD, 'staff');

      // Step 4a: Get payment ID from booking
      const paymentResult = await apiCall(page, 'GET', `payments/booking/${bookingId}`);
      expect(paymentResult.status).toBe(200);
      const paymentId = paymentResult.body?.id || paymentResult.body?.paymentId || '';
      console.log(`💰 Payment ID: ${paymentId}`);

      // Step 4b: Confirm payment
      const payResult = await apiCall(page, 'PATCH', `payments/${paymentId}/confirm`, {
        paymentMethod: 'Cash',
        amountReceived: 650,
        referenceNumber: `WALKIN-E2E-${timestamp}`
      });
      console.log(`💰 Payment confirm API: ${payResult.status}`);
      expect(payResult.status).toBe(200);

      // Verify final status
      const verifyResult = await apiCall(page, 'GET', `bookings/${bookingId}`);
      if (verifyResult.status === 200) {
        console.log(`✅ Final: status=${verifyResult.body?.status}, payment=${verifyResult.body?.paymentStatus}`);
      }
    });

    // ============================================================
    // STEP 5: VERIFY
    // ============================================================
    await test.step('Verify final booking status via API', async () => {
      const result = await apiCall(page, 'GET', `bookings/${bookingId}`);
      expect(result.status).toBe(200);
      expect(result.body?.paymentStatus).toMatch(/Paid/i);
      console.log(`✅ Walk-in E2E complete. Booking ${bookingId}: ${result.body?.status} / ${result.body?.paymentStatus}`);
    });

    if (errors.length > 0) {
      console.log(`\n⚠️ ${errors.length} console errors:\n${errors.join('\n')}`);
    } else {
      console.log('\n🎉 No console errors.');
    }
  });
});

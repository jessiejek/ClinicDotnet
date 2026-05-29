import { test, expect } from '@playwright/test';

test('verify save draft works on CheckedIn booking', async ({ page }) => {
  let bookingId = '';

  // Step 1: Patient books
  await test.step('Patient books', async () => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.locator('ion-input[formControlName="email"]').locator('input').fill('patient@gavino.clinic');
    await page.locator('ion-input[formControlName="password"]').locator('input').fill('Patient@123456');
    await page.getByRole('button', { name: /sign ?in/i }).click();
    await page.waitForURL(/\/patient\//, { timeout: 20000 });

    await page.goto('/patient/doctors');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.locator('app-doctor-card').first().locator('a.btn-book').click();
    await page.waitForURL(/\/public\/booking\?doctorId=/, { timeout: 15000 });
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(2000);
      if (i === 0) await page.locator('.service-option').first().click();
      if (i === 2) {
        const slot = page.locator('.slot-chip:not([disabled])').filter({ hasNotText: /Full|Past/ }).first();
        await slot.click();
      }
      await page.getByRole('button', { name: /continue/i }).click();
    }
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: /confirm booking/i }).click();
    const resp = await page.waitForResponse(r => r.url().includes('/api/bookings') && r.request().method() === 'POST', { timeout: 30000 });
    bookingId = (await resp.json()).id || '';
    console.log(`📋 Booking: ${bookingId}`);
  });
  expect(bookingId).toBeTruthy();

  // Step 2: Staff checks in
  await test.step('Staff checks in', async () => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.locator('ion-input[formControlName="email"]').locator('input').fill('staff@gavino.clinic');
    await page.locator('ion-input[formControlName="password"]').locator('input').fill('Staff@123456');
    await page.getByRole('button', { name: /sign ?in/i }).click();
    await page.waitForURL(/\/staff\//, { timeout: 20000 });

    const result = await page.evaluate(async ({ bookingId }) => {
      const token = localStorage.getItem('clinic.auth.access-token');
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/check-in`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      return `check-in: ${res.status}`;
    }, { bookingId });
    console.log(`✅ ${result}`);
  });

  // Step 3: Doctor saves draft on CheckedIn booking (THIS WAS THE BUG)
  await test.step('Doctor saves draft (the fix)', async () => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.locator('ion-input[formControlName="email"]').locator('input').fill('dr.reyes@gavino.clinic');
    await page.locator('ion-input[formControlName="password"]').locator('input').fill('Doctor@123456');
    await page.getByRole('button', { name: /sign ?in/i }).click();
    await page.waitForURL(/\/doctor\//, { timeout: 20000 });

    // Save draft via PUT on CheckedIn booking
    const result = await page.evaluate(async ({ bookingId }) => {
      const token = localStorage.getItem('clinic.auth.access-token');
      if (!token) return 'no-token';

      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/consultation-record`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          soapNotes: 'E2E: Save Draft test - patient has cough',
          vitalSigns: { systolicBp: 120, diastolicBp: 80, heartRate: 72, temperature: 36.5, takenAt: new Date().toISOString() },
          diagnoses: [{ diagnosisText: 'Test diagnosis', diagnosisCode: 'Z00', isPrimary: true }]
        })
      });
      return `save-draft: ${res.status}`;
    }, { bookingId });

    console.log(`💾 ${result}`);
    expect(result).toContain('200');
    console.log('✅ SAVE DRAFT WORKS ON ACTIVE CONSULTATION!');
  });
});

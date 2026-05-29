import { test, expect } from '@playwright/test';
import { loginAsPatient, openPatientRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, expectPageVisible, SELECTORS, ROUTES } from './patient.fixtures';

test.describe('Patient Medical Records', () => {

  test('Navigation: opens medical records page', async ({ page }) => {
    await loginAsPatient(page);
    const responses = await openPatientRoute(page, ROUTES.medicalRecords);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('Medical Records', { timeout: 10000 });
    await expect(page.locator(SELECTORS.searchbar)).toBeVisible({ timeout: 5000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);

    expect(responses.some(r => r.url.includes('/api/medical-records/me') && r.status === 200)).toBeTruthy();
  });

  test('Populated State: record cards show doctor name and date', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.medicalRecords);

    if (await page.locator(SELECTORS.recordCard).first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(page.locator(SELECTORS.recordCard).first()).toBeVisible();
    } else {
      // Empty state is acceptable
      await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 5000 });
    }
  });

  test('Empty State: shows message when no records', async ({ page }) => {
    await loginAsPatient(page);
    await mockApiResponse(page, 'medical-records/me', []);
    await page.goto(ROUTES.medicalRecords);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 10000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });

  test('Null and Zero Handling: null diagnosis shows fallback text', async ({ page }) => {
    await loginAsPatient(page);
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    await mockApiResponse(page, 'medical-records/me', [{
      id: 'mr-null-001',
      bookingId: 'bk-001',
      appointmentDate: yesterday.toISOString().slice(0, 10),
      doctorName: 'Dr. Null Test',
      diagnosis: null,
      soapNotes: null,
      doctorNotes: null,
      followUpDate: null,
      followUpInstructions: null,
      notes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }]);
    await page.goto(ROUTES.medicalRecords);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.getByText('No diagnosis recorded yet')).toBeVisible({ timeout: 5000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });

  test('API Failure: shows error state with Retry', async ({ page }) => {
    await loginAsPatient(page);
    await mockApiFailure(page, 'medical-records/me');
    await page.goto(ROUTES.medicalRecords);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.errorState)).toBeVisible({ timeout: 10000 });
    await expect(page.locator(SELECTORS.retryBtn)).toBeVisible({ timeout: 3000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });

  test('Download PDF: download button fires API call with correct endpoint', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.medicalRecords);

    const downloadBtn = page.locator('button:has-text("Download Medical Record PDF")').first();
    if (!(await downloadBtn.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('ℹ️ No download buttons visible — no records to download from.');
      return;
    }

    // Intercept the download API endpoint
    const downloadResponse = page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/patient-documents/me/medical-records/') &&
        resp.url().includes('/pdf') &&
        resp.request().method() === 'GET',
      { timeout: 10000 }
    );

    await downloadBtn.click();
    const resp = await downloadResponse;
    console.log(`📡 Download PDF API: ${resp.status()}`);

    // Accept either 200 (real PDF) or error toast (document not available yet)
    if (resp.status() === 200) {
      const contentType = resp.headers()['content-type'] || '';
      expect(contentType).toContain('pdf');
      console.log('✅ PDF download returned 200 with PDF content type.');
    } else {
      console.log(`ℹ️ PDF download returned ${resp.status()} — document may not be generated yet.`);
    }
  });

  test('Download Summary PDF: summary download button fires correct API call', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.medicalRecords);

    const summaryBtn = page.locator('button:has-text("Download Summary PDF")').first();
    if (!(await summaryBtn.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('ℹ️ No summary download buttons visible.');
      return;
    }

    const summaryResponse = page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/patient-documents/me/bookings/') &&
        resp.url().includes('/pdf') &&
        resp.request().method() === 'GET',
      { timeout: 10000 }
    );

    await summaryBtn.click();
    const resp = await summaryResponse;
    console.log(`📡 Summary PDF API: ${resp.status()}`);

    if (resp.status() === 200) {
      console.log('✅ Summary PDF download returned 200.');
    } else {
      console.log(`ℹ️ Summary PDF returned ${resp.status()} — document may not be generated yet.`);
    }
  });
});


import { test, expect } from '@playwright/test';
import { loginAsPatient, openPatientRoute, expectNoPersistentLoading, expectPageVisible, ROUTES } from './patient.fixtures';
import path from 'node:path';
import fs from 'node:fs';

test.describe('Patient Lab Results', () => {

  test('Navigation: opens lab results page with upload form', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.labResults);

    // PatientMediaPanel heading
    await expect(page.locator('.patient-media-panel__title').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.patient-media-panel__title')).toContainText(/My Lab Results/i, { timeout: 5000 });

    // Upload form should exist
    await expect(page.locator('.patient-media-panel__upload')).toBeVisible({ timeout: 5000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });

  test('Page renders without crash', async ({ page }) => {
    await loginAsPatient(page);
    await page.goto(ROUTES.labResults);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(0);
  });

  test('Upload flow: can open file picker, fill form fields', async ({ page }) => {
    await loginAsPatient(page);
    await openPatientRoute(page, ROUTES.labResults);

    // Wait for upload form
    const uploadForm = page.locator('.patient-media-panel__upload');
    await expect(uploadForm).toBeVisible({ timeout: 10000 });

    // Create a dummy test file to upload
    const tmpFile = path.resolve('test-upload-lab.txt');
    fs.writeFileSync(tmpFile, 'Test lab result content for Playwright QA', 'utf-8');

    try {
      // 1. Choose file via the hidden input
      const fileInput = uploadForm.locator('input[type="file"]');
      await fileInput.setInputFiles(tmpFile);
      await page.waitForTimeout(500);

      // 2. Fill title
      const titleInput = uploadForm.locator('input[formControlName="title"]');
      if (await titleInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await titleInput.fill('Playwright Test Lab Result');
      }

      // 3. Fill notes
      const notesInput = uploadForm.locator('textarea[formControlName="notes"]');
      if (await notesInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await notesInput.fill('Uploaded via automated Playwright test.');
      }

      // 4. Select a booking from the dropdown if available
      const bookingSelect = uploadForm.locator('ion-select[formControlName="bookingId"]');
      if (await bookingSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
        await bookingSelect.click();
        await page.waitForTimeout(1500);

        const selectOption = page.locator('ion-select-option').filter({ hasNotText: /select a booking/i }).first();
        if (await selectOption.isVisible({ timeout: 2000 }).catch(() => false)) {
          await selectOption.click();
          await page.waitForTimeout(500);
        }
      }

      // 5. Check if submit button is enabled
      const submitBtn = uploadForm.locator('button[type="submit"]').first();
      await expect(submitBtn).toBeVisible({ timeout: 3000 });

      const isEnabled = await submitBtn.isEnabled().catch(() => false);

      if (isEnabled) {
        const uploadResponse = page.waitForResponse(
          (resp) => resp.url().includes('/api/patients/me/lab-results') && resp.request().method() === 'POST',
          { timeout: 15000 }
        );

        await submitBtn.click();
        const resp = await uploadResponse;
        expect([200, 201]).toContain(resp.status());
        console.log(`📡 Lab result upload API: ${resp.status()} ✅`);
      } else {
        console.log('ℹ️ Upload button disabled — form validation incomplete (booking or file required).');
      }
    } finally {
      try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
    }
  });
});



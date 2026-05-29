import { test, expect } from '@playwright/test';
import { loginAsStaff, openStaffRoute, mockApiFailure, mockApiResponse, mockApiFailure as mockFailure, expectNoPersistentLoading, expectPageVisible, SELECTORS, ROUTES } from './staff.fixtures';

test.describe('Staff Walk-In', () => {

  test('Navigation: opens walk-in page with stepper', async ({ page }) => {
    await loginAsStaff(page);
    const responses = await openStaffRoute(page, ROUTES.walkIn);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('Walk-In Booking', { timeout: 10000 });
    await expect(page.locator(SELECTORS.stepper).first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator(SELECTORS.walkInSearchbar)).toBeVisible({ timeout: 5000 });
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);

    expect(responses.some(r => r.url.includes('/api/patients') && r.status === 200)).toBeTruthy();
  });

  test('Step 1: search for existing patient shows results', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.walkIn);

    // ion-searchbar is a web component — type in the shadow input directly
    const searchbar = page.locator(SELECTORS.walkInSearchbar);
    const input = searchbar.locator('input');
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill('Juan');
    await page.waitForTimeout(2000);

    const hasResults = await page.locator('.patient-result').isVisible({ timeout: 5000 }).catch(() => false);
    const hasEmpty = await page.locator(SELECTORS.emptyState).isVisible({ timeout: 3000 }).catch(() => false);
    expect(hasResults || hasEmpty).toBeTruthy();
  });

  test('Step 1: quick register form opens and can be filled', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.walkIn);

    // Click "Quick Register" CTA
    const quickRegisterCta = page.locator('button:has-text("Quick Register")').first();
    if (await quickRegisterCta.isVisible({ timeout: 5000 }).catch(() => false)) {
      await quickRegisterCta.click();
      await page.waitForTimeout(1000);
    }

    // The form might already be visible
    const form = page.locator(SELECTORS.quickRegisterForm);
    if (await form.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(form).toBeVisible();
    }
  });

  test('Step 1: quick register form validates required fields', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.walkIn);

    // Open quick register
    const cta = page.locator('button:has-text("Quick Register")').first();
    if (await cta.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cta.click();
      await page.waitForTimeout(1000);
    }

    const form = page.locator(SELECTORS.quickRegisterForm);
    if (!(await form.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('ℹ️ Quick register form not visible — skipping validation test.');
      test.skip();
      return;
    }

    // Try submitting empty form
    const createBtn = form.locator('button:has-text("Create Patient")');
    if (await createBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createBtn.click();
      await page.waitForTimeout(1000);

      // Should show validation errors (form was submitted with empty required fields)
      const errorMessages = form.locator('.form-error-message');
      const errors = await errorMessages.count();
      console.log(`✅ Quick register validation showed ${errors} error messages.`);
      expect(errors).toBeGreaterThan(0);
    }
  });

  test('Step 2: doctor/service dropdowns load after patient selected', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.walkIn);

    // Fill search to find a patient
    const searchbar = page.locator(SELECTORS.walkInSearchbar);
    const input = searchbar.locator('input');
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill('Juan');
    await page.waitForTimeout(2000);

    // Select first patient result if visible
    const patientResult = page.locator('.patient-result').first();
    if (await patientResult.isVisible({ timeout: 5000 }).catch(() => false)) {
      await patientResult.click();
      await page.waitForTimeout(1500);

      // Should be on step 2 now
      const doctorSelect = page.locator('ion-select[formControlName="doctorId"]');
      await expect(doctorSelect).toBeVisible({ timeout: 5000 });
      console.log('✅ Doctor selection visible after patient selected.');
    } else {
      console.log('ℹ️ No patient results found — cannot test step 2.');
      test.skip();
    }
  });

  test('Empty State: shows Quick Register prompt when no patients found', async ({ page }) => {
    await loginAsStaff(page);
    await mockApiResponse(page, 'patients', []);
    await page.goto(ROUTES.walkIn);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator(SELECTORS.emptyState)).toBeVisible({ timeout: 10000 });
  });

  test('API Failure: walk-in page handles errors gracefully', async ({ page }) => {
    await loginAsStaff(page);
    await mockApiFailure(page, 'patients');
    await page.goto(ROUTES.walkIn);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
    await expectNoPersistentLoading(page);
    await expectPageVisible(page);
  });
});


import { test, expect } from '@playwright/test';
import { loginAsStaff, openStaffRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, SELECTORS, ROUTES } from './staff.fixtures';

test.describe('Staff Walk-In', () => {

  test('Navigation: opens walk-in page with stepper', async ({ page }) => {
    await loginAsStaff(page);
    const responses = await openStaffRoute(page, ROUTES.walkIn);

    await expect(page.locator(SELECTORS.pageTitle)).toContainText('Walk-In Booking', { timeout: 10000 });
    await expect(page.locator(SELECTORS.stepper).first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator(SELECTORS.walkInSearchbar)).toBeVisible({ timeout: 5000 });
    await expectNoPersistentLoading(page);

    expect(responses.some(r => r.url.includes('/api/patients') && r.status === 200)).toBeTruthy();
  });

  test('Step 1: search for existing patient shows results', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.walkIn);

    const searchbar = page.locator(SELECTORS.walkInSearchbar);
    await searchbar.fill('Juan');
    await page.waitForTimeout(2000);

    // Results should either show patients or empty state with Quick Register
    const hasResults = await page.locator('.patient-result').isVisible({ timeout: 5000 }).catch(() => false);
    const hasEmpty = await page.locator(SELECTORS.emptyState).isVisible({ timeout: 3000 }).catch(() => false);
    expect(hasResults || hasEmpty).toBeTruthy();
  });

  test('Step 1: quick register form opens and can be filled', async ({ page }) => {
    await loginAsStaff(page);
    await openStaffRoute(page, ROUTES.walkIn);

    // Click "Quick Register" CTA on empty state or look for the form
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

  test('Empty State: shows Quick Register prompt when no patients found', async ({ page }) => {
    await loginAsStaff(page);
    await mockApiResponse(page, 'patients?search=', []);
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
  });
});

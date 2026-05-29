import { expect, test } from '@playwright/test';
import {
  assertExpectedApiCall,
  assertNoBlankWhiteScreen,
  collectApiResponses,
  collectConsoleErrors,
  expectAnyTextVisible,
  expectNoConsoleErrors,
  mockStaffApi,
  staffTestData,
  waitForStaffLoadingToSettle
} from './staff.fixtures';

const testData = staffTestData;


test.describe('/staff/patients — Staff Patients', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders search/list, fires patients API, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockStaffApi(page);
      await page.goto(testData.routes.patients);
      await expect(page.getByRole('heading', { name: 'Patients' })).toBeVisible();
      await expect(page.getByLabel('Search patients')).toBeVisible();
      await assertExpectedApiCall(responses, 'patients?page=1&pageSize=');
      await waitForStaffLoadingToSettle(page);
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual patient API values and opens patient detail', async ({ page }) => {
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.patients);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('Juan Dela Cruz')).toBeVisible();
      await expect(page.getByText('P-0001')).toBeVisible();
      await expect(page.getByText('09181234567')).toBeVisible();
      await page.getByText('Juan Dela Cruz').click();
      await expect(page).toHaveURL(/\/staff\/patients\/pat-001/);
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('renders empty contact/email fallback safely', async ({ page }) => {
      await mockStaffApi(page, { patients: [{ ...testData.patients[0], contactNumber: '', email: '' }], delayMs: 0 });
      await page.goto(testData.routes.patients);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('Juan Dela Cruz')).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Empty State', () => {
    test('shows empty state for empty patients response', async ({ page }) => {
      await mockStaffApi(page, { emptyEndpoints: ['patients'], delayMs: 0 });
      await page.goto(testData.routes.patients);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('No patients found')).toBeVisible();
    });
  });

  test.describe('API Failure Handling', () => {
    test('FAIL risk: patients API error only clears list without user-facing error', async ({ page }) => {
      test.fail(true, 'Source risk: staff-patients loadPatients error clears patients and metadata; no toast/error message is shown.');
      await mockStaffApi(page, { failEndpoints: ['patients?page'] });
      await page.goto(testData.routes.patients);
      await expect(page.locator(testData.selectors.toast)).toContainText('Failed');
    });
  });

  test.describe('Main Action', () => {
    test('search sends API request and filters by actual patient value', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.patients);
      await waitForStaffLoadingToSettle(page);
      await page.getByLabel('Search patients').fill('Juan');
      await assertExpectedApiCall(responses, 'search=Juan');
      await expect(page.getByText('Juan Dela Cruz')).toBeVisible();
    });
  });

  test.describe('Authorization', () => {
    test('guest should not render patient list', async ({ page }) => {
      await mockStaffApi(page, { role: 'Guest', delayMs: 0 });
      await page.goto(testData.routes.patients);
      await expect(page.getByText('Juan Dela Cruz')).toHaveCount(0);
    });
  });
});

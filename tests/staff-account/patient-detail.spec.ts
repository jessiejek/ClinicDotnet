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


test.describe('/staff/patients/:id — Patient Detail', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders patient sections/tabs, fires patient API, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockStaffApi(page);
      await page.goto(testData.routes.patientDetail);
      await expect(page.getByRole('button', { name: 'Back to Patients' })).toBeVisible();
      await assertExpectedApiCall(responses, 'patients/pat-001');
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('Identity')).toBeVisible();
      await expect(page.getByText('Contact & Address')).toBeVisible();
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual patient values from API response', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.patientDetail);
      await waitForStaffLoadingToSettle(page);
      const response = await assertExpectedApiCall(responses, 'patients/pat-001');
      const patient = response.body as any;
      await expect(page.getByText('Juan Dela Cruz')).toBeVisible();
      await expect(page.getByText(patient.patientCode)).toBeVisible();
      await expect(page.getByText(patient.email)).toBeVisible();
      await expect(page.getByText(patient.contactNumber)).toBeVisible();
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('shows account fallback when patient has no linked portal account', async ({ page }) => {
      await mockStaffApi(page, { patients: [{ ...testData.patients[0], userId: '', hasAccount: false }], delayMs: 0 });
      await page.goto(testData.routes.patientDetail);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('No Account')).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
    });
  });

  test.describe('Empty State', () => {
    test('shows loading issue card when patient detail returns no data', async ({ page }) => {
      await mockStaffApi(page, { failEndpoints: ['patients/pat-001'], delayMs: 0 });
      await page.goto(testData.routes.patientDetail);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('We hit a loading issue')).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('API Failure Handling', () => {
    test('renders specific error card and stops skeleton when patient API fails', async ({ page }) => {
      await mockStaffApi(page, { failEndpoints: ['patients/pat-001'] });
      await page.goto(testData.routes.patientDetail);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('We could not load this patient record.')).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
    });
  });

  test.describe('Main Action', () => {
    test('creates portal account and reloads patient detail', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockStaffApi(page, { patients: [{ ...testData.patients[0], userId: '', hasAccount: false }], delayMs: 0 });
      await page.goto(testData.routes.patientDetail);
      await waitForStaffLoadingToSettle(page);
      await page.locator('input[formcontrolname="email"]').fill(testData.newPortalAccount.email);
      await page.locator('input[formcontrolname="temporaryPassword"]').fill(testData.newPortalAccount.temporaryPassword);
      await page.locator('input[formcontrolname="confirmTemporaryPassword"]').fill(testData.newPortalAccount.confirmTemporaryPassword);
      await page.getByRole('button', { name: /Create Portal Account/ }).click();
      await assertExpectedApiCall(responses, 'patients/pat-001/portal-account', 'POST');
      await expect(page.locator(testData.selectors.toast)).toContainText('Portal account created successfully.');
    });
  });

  test.describe('Authorization', () => {
    test('guest should not render patient details', async ({ page }) => {
      await mockStaffApi(page, { role: 'Guest', delayMs: 0 });
      await page.goto(testData.routes.patientDetail);
      await expect(page.getByText('Juan Dela Cruz')).toHaveCount(0);
    });
  });
});

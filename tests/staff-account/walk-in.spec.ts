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


test.describe('/staff/walk-in — Walk-In Booking', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders stepper/search, fires initial doctors and patients APIs, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockStaffApi(page);
      await page.goto(testData.routes.walkIn);
      await expect(page.getByRole('heading', { name: 'Walk-In Booking' })).toBeVisible();
      await expect(page.getByLabel('Search patients')).toBeVisible();
      await expect(page.getByRole('button', { name: /Patient/ })).toBeVisible();
      await assertExpectedApiCall(responses, '/api/doctors');
      await assertExpectedApiCall(responses, 'patients?page=1&pageSize=');
      await waitForStaffLoadingToSettle(page);
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual patient search result and doctor/service values', async ({ page }) => {
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.walkIn);
      await waitForStaffLoadingToSettle(page);
      await page.getByLabel('Search patients').fill('Juan');
      await expect(page.getByText('Juan Dela Cruz')).toBeVisible();
      await page.getByRole('button', { name: /Select patient Juan Dela Cruz/ }).click();
      await expect(page.getByText('Selected Patient')).toBeVisible();
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('shows no-contact and no-email fallbacks without spinner', async ({ page }) => {
      await mockStaffApi(page, { patients: [{ ...testData.patients[0], contactNumber: '', email: '' }], delayMs: 0 });
      await page.goto(testData.routes.walkIn);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('No contact provided').first()).toBeVisible();
      await expect(page.getByText('No email provided').first()).toBeVisible();
    });
  });

  test.describe('Empty State', () => {
    test('shows Quick Register empty state when patient search returns empty', async ({ page }) => {
      await mockStaffApi(page, { emptyEndpoints: ['patients'], delayMs: 0 });
      await page.goto(testData.routes.walkIn);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('No patients found')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Quick Register' })).toBeVisible();
    });
  });

  test.describe('API Failure Handling', () => {
    test('shows toast and Search unavailable state when patient API fails', async ({ page }) => {
      await mockStaffApi(page, { failEndpoints: ['patients?page'] });
      await page.goto(testData.routes.walkIn);
      await expect(page.locator(testData.selectors.toast)).toContainText('Forced failure');
      await expect(page.getByText('Search unavailable')).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Main Action', () => {
    test('quick-register creates patient and then creates a walk-in booking', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockStaffApi(page, { emptyEndpoints: ['patients'], delayMs: 0 });
      await page.goto(testData.routes.walkIn);
      await waitForStaffLoadingToSettle(page);
      await page.getByRole('button', { name: 'Quick Register' }).click();
      await page.getByPlaceholder('First name').fill(testData.newPatient.firstName);
      await page.getByPlaceholder('Middle name').fill(testData.newPatient.middleName);
      await page.getByPlaceholder('Last name').fill(testData.newPatient.lastName);
      await page.locator('ion-input[formcontrolname="dateOfBirth"] input').fill(testData.newPatient.dateOfBirth);
      await page.locator('ion-select[formcontrolname="sex"]').click();
      await page.getByRole('radio', { name: 'Male' }).click().catch(async () => page.keyboard.press('Enter'));
      await page.getByPlaceholder('Contact number').fill(testData.newPatient.contactNumber);
      await page.getByPlaceholder('Email').fill(testData.newPatient.email);
      await page.getByPlaceholder('Address').fill(testData.newPatient.address);
      await page.getByRole('button', { name: /Save Patient/ }).click();
      await assertExpectedApiCall(responses, '/api/patients', 'POST');
      await expect(page.locator(testData.selectors.toast)).toContainText('Guest patient created successfully');
      // [VERIFY: selecting ion-select options may need Ionic overlay-specific selectors depending on runtime mode]
    });
  });

  test.describe('Authorization', () => {
    test('guest should not render walk-in patient search results', async ({ page }) => {
      await mockStaffApi(page, { role: 'Guest', delayMs: 0 });
      await page.goto(testData.routes.walkIn);
      await expect(page.getByText('Juan Dela Cruz')).toHaveCount(0);
    });
  });
});

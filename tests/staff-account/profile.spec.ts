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


test.describe('/staff/profile — Staff Profile', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders personal/password forms, fires auth/me, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockStaffApi(page);
      await page.goto(testData.routes.profile);
      await expect(page.getByText('Update your name and change your password')).toBeVisible();
      await expect(page.locator('input[formcontrolname="fullName"]')).toBeVisible();
      await expect(page.locator('input[formcontrolname="currentPassword"]')).toBeVisible();
      await assertExpectedApiCall(responses, 'auth/me');
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders current user email and name values', async ({ page }) => {
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.profile);
      await expect(page.locator('input[formcontrolname="fullName"]')).toHaveValue(testData.staffUser.fullName);
      await expect(page.locator('input[readonly]')).toHaveValue(testData.staffUser.email);
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('renders empty contact number safely', async ({ page }) => {
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.profile);
      await page.locator('input[formcontrolname="contactNumber"]').fill('');
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Empty State', () => {
    test('page remains usable when optional phone number is blank', async ({ page }) => {
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.profile);
      await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
    });
  });

  test.describe('API Failure Handling', () => {
    test('shows toast when profile update API fails', async ({ page }) => {
      await mockStaffApi(page, { failEndpoints: ['auth/me'] });
      await page.goto(testData.routes.profile);
      await page.locator('input[formcontrolname="fullName"]').fill(testData.profileUpdate.fullName);
      await page.getByRole('button', { name: 'Save Changes' }).click();
      await expect(page.locator(testData.selectors.toast)).toContainText('Forced failure');
    });
  });

  test.describe('Main Action', () => {
    test('saves profile changes and changes password', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.profile);
      await page.locator('input[formcontrolname="fullName"]').fill(testData.profileUpdate.fullName);
      await page.locator('input[formcontrolname="contactNumber"]').fill(testData.profileUpdate.contactNumber);
      await page.getByRole('button', { name: 'Save Changes' }).click();
      await assertExpectedApiCall(responses, 'auth/me', 'PUT');
      await expect(page.locator(testData.selectors.toast)).toContainText('Profile updated');
      await page.locator('input[formcontrolname="currentPassword"]').fill(testData.passwordChange.currentPassword);
      await page.locator('input[formcontrolname="newPassword"]').fill(testData.passwordChange.newPassword);
      await page.locator('input[formcontrolname="confirmPassword"]').fill(testData.passwordChange.confirmPassword);
      await page.getByRole('button', { name: 'Change Password' }).click();
      await assertExpectedApiCall(responses, 'auth/change-password', 'POST');
      await expect(page.locator(testData.selectors.toast)).toContainText('Password updated successfully');
    });
  });

  test.describe('Authorization', () => {
    test('guest should not render profile form', async ({ page }) => {
      await mockStaffApi(page, { role: 'Guest', delayMs: 0 });
      await page.goto(testData.routes.profile);
      await expect(page.locator('input[formcontrolname="fullName"]')).toHaveCount(0);
    });
  });
});

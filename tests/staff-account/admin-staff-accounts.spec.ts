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


test.describe('/admin/staff — Admin Staff Accounts bonus spec', () => {
  test.describe('Navigation', () => {
    test('opens direct URL as admin, renders staff accounts table, fires admin staff API, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockStaffApi(page, { role: 'Admin' });
      await page.goto(testData.routes.adminStaffAccounts);
      await expect(page.getByRole('heading', { name: 'Staff Accounts' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Invite Staff' })).toBeVisible();
      await assertExpectedApiCall(responses, 'admin/staff');
      await waitForStaffLoadingToSettle(page);
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual admin/staff API values', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockStaffApi(page, { role: 'Admin', delayMs: 0 });
      await page.goto(testData.routes.adminStaffAccounts);
      await waitForStaffLoadingToSettle(page);
      const response = await assertExpectedApiCall(responses, 'admin/staff');
      const first = (response.body as any[])[0];
      await expect(page.getByText(first.fullName)).toBeVisible();
      await expect(page.getByText(first.email)).toBeVisible();
      await expect(page.getByText(first.role)).toBeVisible();
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('renders empty fullName/email values without crashing', async ({ page }) => {
      await mockStaffApi(page, { role: 'Admin', adminStaff: [{ ...testData.adminStaff[0], fullName: '', email: '' }], delayMs: 0 });
      await page.goto(testData.routes.adminStaffAccounts);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('Staff')).toBeVisible();
      await assertNoBlankWhiteScreen(page);
    });
  });

  test.describe('Empty State', () => {
    test('shows confirmed empty state for empty staff list', async ({ page }) => {
      await mockStaffApi(page, { role: 'Admin', emptyEndpoints: ['admin/staff'], delayMs: 0 });
      await page.goto(testData.routes.adminStaffAccounts);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('No staff accounts')).toBeVisible();
      await expect(page.getByText('Invite the first front desk staff member.')).toBeVisible();
    });
  });

  test.describe('API Failure Handling', () => {
    test('shows notice and retry button when admin staff API fails', async ({ page }) => {
      await mockStaffApi(page, { role: 'Admin', failEndpoints: ['admin/staff'] });
      await page.goto(testData.routes.adminStaffAccounts);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('Could not load staff accounts. Please try again.')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
    });
  });

  test.describe('Main Action', () => {
    test('FAIL risk: invite form cannot submit because source hardcodes accessToken as empty string', async ({ page }) => {
      test.fail(true, 'Source bug: StaffPage.save() has const accessToken = ""; invitation always shows session expired before POST admin/staff/invite.');
      const responses = collectApiResponses(page);
      await mockStaffApi(page, { role: 'Admin', delayMs: 0 });
      await page.goto(testData.routes.adminStaffAccounts);
      await waitForStaffLoadingToSettle(page);
      await page.getByRole('button', { name: 'Invite Staff' }).click();
      await page.getByPlaceholder('Full Name').fill('New Staff');
      await page.getByPlaceholder('Email').fill('new.staff@example.test');
      await page.getByRole('button', { name: 'Send Invite' }).click();
      await assertExpectedApiCall(responses, 'admin/staff/invite', 'POST');
      await expect(page.locator(testData.selectors.toast)).toContainText('Invite sent');
    });
  });

  test.describe('Authorization', () => {
    test('staff role should not access admin staff accounts protected data', async ({ page }) => {
      await mockStaffApi(page, { role: 'Staff', delayMs: 0 });
      await page.goto(testData.routes.adminStaffAccounts);
      await expect(page.getByText('Sally Staff')).toHaveCount(0);
    });
  });
});

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


test.describe('/staff/doctor-status — Doctor Availability', () => {
  test.describe('Navigation', () => {
    test('opens direct URL, renders status cards, fires doctors/day-status APIs, and has no console errors', async ({ page }) => {
      const responses = collectApiResponses(page);
      const consoleErrors = collectConsoleErrors(page);
      await mockStaffApi(page);
      await page.goto(testData.routes.doctorStatus);
      await expect(page.getByText('Set running late or unavailable status for today')).toBeVisible();
      await assertExpectedApiCall(responses, '/api/doctors');
      await assertExpectedApiCall(responses, 'doctor-day-status/doc-user-001');
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('Dr. Grace E. Gavino')).toBeVisible();
      await expectNoConsoleErrors(consoleErrors);
    });
  });

  test.describe('Populated State', () => {
    test('renders actual doctor names, specialties, and status counts', async ({ page }) => {
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.doctorStatus);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('Dr. Grace E. Gavino')).toBeVisible();
      await expect(page.getByText('Family Medicine')).toBeVisible();
      await expect(page.getByText('Available')).toBeVisible();
    });
  });

  test.describe('Null and Zero Handling', () => {
    test('shows no doctors empty state when doctors array is empty', async ({ page }) => {
      await mockStaffApi(page, { emptyEndpoints: ['doctors'], delayMs: 0 });
      await page.goto(testData.routes.doctorStatus);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('No doctors found')).toBeVisible();
      await expect(page.locator(testData.selectors.loading)).toHaveCount(0);
    });
  });

  test.describe('Empty State', () => {
    test('shows confirmed no doctors empty state', async ({ page }) => {
      await mockStaffApi(page, { doctors: [], delayMs: 0 });
      await page.goto(testData.routes.doctorStatus);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('Load doctor records to manage availability.')).toBeVisible();
    });
  });

  test.describe('API Failure Handling', () => {
    test('shows retry error area and stops skeleton when doctors API fails', async ({ page }) => {
      await mockStaffApi(page, { failEndpoints: ['doctors'] });
      await page.goto(testData.routes.doctorStatus);
      await waitForStaffLoadingToSettle(page);
      await expect(page.getByText('Unable to load doctors. Please try again.')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
    });
  });

  test.describe('Main Action', () => {
    test('sets doctor running late and posts status update', async ({ page }) => {
      const responses = collectApiResponses(page);
      await mockStaffApi(page, { delayMs: 0 });
      await page.goto(testData.routes.doctorStatus);
      await waitForStaffLoadingToSettle(page);
      await page.getByRole('button', { name: /Set Running Late/ }).first().click();
      await page.locator('input[id^="running-late-input-"]').first().fill('15');
      await page.getByRole('button', { name: 'Confirm' }).click();
      await assertExpectedApiCall(responses, 'doctor-day-status/doc-001/status', 'POST');
      await expect(page.locator(testData.selectors.toast)).toContainText('status updated');
    });
  });

  test.describe('Authorization', () => {
    test('guest should not render doctor status cards', async ({ page }) => {
      await mockStaffApi(page, { role: 'Guest', delayMs: 0 });
      await page.goto(testData.routes.doctorStatus);
      await expect(page.getByText('Dr. Grace E. Gavino')).toHaveCount(0);
    });
  });
});

import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const baseURL = process.env['E2E_BASE_URL'] || 'http://localhost:4200';

export default defineConfig({
  testDir: './tests',
  timeout: 90_000,

  expect: {
    timeout: 10_000,
  },

  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  workers: 1,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL,
    browserName: 'chromium',
    headless: false,
    viewport: {
      width: 1440,
      height: 900,
    },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});

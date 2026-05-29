import fs from 'node:fs';
import path from 'node:path';
import type { FullConfig } from '@playwright/test';

const authDir = path.join(process.cwd(), 'tests', '.auth');
const storagePath = path.join(authDir, 'staff.json');

export const staffCredentials = {
  email: process.env.PLAYWRIGHT_STAFF_EMAIL ?? 'staff@example.test',
  password: process.env.PLAYWRIGHT_STAFF_PASSWORD ?? 'ChangeMe123!'
};

export const adminCredentials = {
  email: process.env.PLAYWRIGHT_ADMIN_EMAIL ?? 'admin@example.test',
  password: process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? 'ChangeMe123!'
};

export const testBaseUrls = {
  frontend: process.env.PLAYWRIGHT_FRONTEND_URL ?? 'http://localhost:8100',
  api: process.env.PLAYWRIGHT_API_BASE_URL ?? 'https://localhost:44384/api'
};

export async function loginAsStaff(): Promise<void> {
  // The generated specs mock auth/me and seed localStorage before navigation.
  // This placeholder keeps a standard global setup surface for later real backend login.
}

export async function loginAsAdmin(): Promise<void> {
  // The Admin Staff Accounts spec also mocks auth/me/admin responses.
}

async function globalSetup(_config: FullConfig): Promise<void> {
  fs.mkdirSync(authDir, { recursive: true });
  fs.writeFileSync(storagePath, JSON.stringify({ cookies: [], origins: [] }, null, 2));
}

export default globalSetup;

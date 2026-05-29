import { expect, type Locator, type Page, type Response } from '@playwright/test';

export const API_BASE_URL =
  process.env.PLAYWRIGHT_API_BASE_URL || process.env.E2E_API_BASE_URL || 'http://localhost:5000/api';

type Role = 'patient' | 'staff' | 'doctor' | 'admin';

type ApiResult<T = unknown> = {
  status: number;
  body: T;
};

const CREDENTIALS: Record<Role, { email: string; password: string; expectedUrl: RegExp }> = {
  patient: {
    email: process.env.PLAYWRIGHT_PATIENT_EMAIL || 'patient@gavino.clinic',
    password: process.env.PLAYWRIGHT_PATIENT_PASSWORD || 'Patient@123456',
    expectedUrl: /\/patient\//,
  },
  staff: {
    email: process.env.PLAYWRIGHT_STAFF_EMAIL || 'staff@gavino.clinic',
    password: process.env.PLAYWRIGHT_STAFF_PASSWORD || 'Staff@123456',
    expectedUrl: /\/staff\//,
  },
  doctor: {
    email: process.env.PLAYWRIGHT_DOCTOR_EMAIL || 'dr.reyes@gavino.clinic',
    password: process.env.PLAYWRIGHT_DOCTOR_PASSWORD || 'Doctor@123456',
    expectedUrl: /\/doctor\//,
  },
  admin: {
    email: process.env.PLAYWRIGHT_ADMIN_EMAIL || 'admin@gavino.clinic',
    password: process.env.PLAYWRIGHT_ADMIN_PASSWORD || 'Admin@123456',
    expectedUrl: /\/admin\//,
  },
};

export function uniqueText(prefix: string): string {
  return `${prefix}${Date.now()}`;
}

export function manilaDateOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export async function loginAs(page: Page, role: Role): Promise<void> {
  const creds = CREDENTIALS[role];

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle').catch(() => undefined);

  await fillAny(page, ['input[type="email"]', 'ion-input[formcontrolname="email"] input'], creds.email);
  await fillAny(page, ['input[type="password"]', 'ion-input[formcontrolname="password"] input'], creds.password);

  const loginResponsePromise = page
    .waitForResponse(
      (r) => r.url().includes('/api/auth/login') && r.request().method() === 'POST',
      { timeout: 20_000 }
    )
    .catch(() => null);

  await clickButtonOrLink(page, /sign ?in|login/i);
  const response = await loginResponsePromise;
  if (response) {
    expect(response.status(), `${role} login API should succeed`).toBeLessThan(300);
  }

  await page.waitForURL(creds.expectedUrl, { timeout: 30_000 });
  await expectPageHasVisibleShell(page);
}

export async function expectPageHasVisibleShell(page: Page): Promise<void> {
  const shell = page.locator('.page-shell, .booking-wizard, main, ion-router-outlet').first();
  await expect(shell).toBeAttached({ timeout: 15_000 });
  await expect(shell).toBeVisible({ timeout: 15_000 }).catch(async () => {
    const display = await shell.evaluate((el) => getComputedStyle(el).display).catch(() => 'unknown');
    expect(display).not.toBe('none');
  });
}

export async function expectNoPersistentLoading(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle').catch(() => undefined);
  const visibleLoading = page.locator(
    'ion-spinner:visible, app-skeleton:visible, .loading-card:visible, .wizard-loading:visible, .calendar-loading:visible, .slot-loading:visible'
  );
  await expect(visibleLoading).toHaveCount(0, { timeout: 12_000 });
}

export async function apiCall<T = unknown>(
  page: Page,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  body?: unknown
): Promise<ApiResult<T>> {
  const endpointPath = endpoint.replace(/^\/+/, '');
  return page.evaluate(
    async ({ apiBaseUrl, method, endpointPath, body }) => {
      const token = localStorage.getItem('clinic.auth.access-token');
      const res = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/${endpointPath}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const contentType = res.headers.get('content-type') || '';
      const payload = contentType.includes('application/json') ? await res.json() : await res.text();
      return { status: res.status, body: payload };
    },
    { apiBaseUrl: API_BASE_URL, method, endpointPath, body }
  );
}

export async function waitForApiResponse(
  page: Page,
  method: string,
  endpointPart: string,
  action: () => Promise<void>,
  acceptedStatuses = [200, 201, 204]
): Promise<Response> {
  const responsePromise = page.waitForResponse(
    (r) => r.url().includes(endpointPart) && r.request().method().toUpperCase() === method.toUpperCase(),
    { timeout: 30_000 }
  );
  await action();
  const response = await responsePromise;
  expect(acceptedStatuses, `${method} ${endpointPart} should return ${acceptedStatuses.join('/')}`).toContain(
    response.status()
  );
  return response;
}

export async function responseJson<T = unknown>(response: Response): Promise<T | null> {
  const contentType = response.headers()['content-type'] || '';
  if (!contentType.includes('application/json')) return null;
  return (await response.json()) as T;
}

export function extractId(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return '';
  const row = payload as Record<string, unknown>;
  const direct = row['id'] || row['bookingId'] || row['booking_id'] || row['paymentId'] || row['payment_id'];
  if (typeof direct === 'string' && direct.trim()) return direct.trim();
  if (typeof direct === 'number') return String(direct);

  for (const value of Object.values(row)) {
    if (value && typeof value === 'object') {
      const nested = extractId(value);
      if (nested) return nested;
    }
  }
  return '';
}

export function normalizeItems(payload: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(payload)) return payload.filter(isRecord);
  if (isRecord(payload)) {
    const possible = payload['items'] || payload['data'] || payload['results'];
    if (Array.isArray(possible)) return possible.filter(isRecord);
  }
  return [];
}

export function firstTextValue(payload: unknown, keys: string[]): string {
  if (!isRecord(payload)) return '';
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  return '';
}

export async function expectVisibleText(page: Page, text: unknown, label: string): Promise<void> {
  if (text === null || text === undefined) return;
  const expected = String(text).trim();
  if (expected.length < 2) return;
  const bodyText = normalizeVisibleText(await page.locator('body').innerText({ timeout: 15_000 }));
  expect(bodyText, `${label} should be displayed on screen`).toContain(normalizeVisibleText(expected));
}

export async function expectAnyVisibleText(page: Page, values: unknown[], label: string): Promise<void> {
  const bodyText = normalizeVisibleText(await page.locator('body').innerText({ timeout: 15_000 }));
  const normalized = values.map((v) => normalizeVisibleText(String(v ?? '').trim())).filter((v) => v.length >= 2);
  expect(normalized.length, `${label} has at least one candidate value`).toBeGreaterThan(0);
  expect(
    normalized.some((value) => bodyText.includes(value)),
    `${label} should display at least one of: ${normalized.join(' | ')}`
  ).toBeTruthy();
}

export async function fillControl(scope: Page | Locator, controlName: string, value: string): Promise<void> {
  const selectors = [
    `ion-input[formcontrolname="${controlName}"] input`,
    `ion-textarea[formcontrolname="${controlName}"] textarea`,
    `input[formcontrolname="${controlName}"]`,
    `textarea[formcontrolname="${controlName}"]`,
    `[formcontrolname="${controlName}"] input`,
    `[formcontrolname="${controlName}"] textarea`,
  ];
  await fillAny(scope, selectors, value);
}

export async function fillAny(scope: Page | Locator, selectors: string[], value: string): Promise<void> {
  for (const selector of selectors) {
    const locator = scope.locator(selector).first();
    if ((await locator.count()) === 0) continue;
    if (!(await locator.isVisible().catch(() => false))) continue;
    await locator.fill(value, { timeout: 10_000 });
    await locator.dispatchEvent('input').catch(() => undefined);
    await locator.dispatchEvent('change').catch(() => undefined);
    return;
  }
  throw new Error(`No visible input found for selectors: ${selectors.join(', ')}`);
}

export async function clickButtonOrLink(page: Page, name: RegExp | string): Promise<void> {
  const locators = [page.getByRole('button', { name }), page.getByRole('link', { name })];
  for (const locator of locators) {
    const first = locator.first();
    if ((await first.count()) > 0 && (await first.isVisible().catch(() => false))) {
      await first.click();
      return;
    }
  }
  throw new Error(`No visible button/link found for ${String(name)}`);
}

export async function clickIfVisible(locator: Locator): Promise<boolean> {
  const first = locator.first();
  if ((await first.count()) === 0) return false;
  if (!(await first.isVisible().catch(() => false))) return false;
  await first.click();
  return true;
}

export async function selectIonSelectOption(
  scope: Page | Locator,
  formControlName: string,
  preferredTextOrValue?: RegExp | string
): Promise<{ value: string; text: string }> {
  const select = scope.locator(`ion-select[formcontrolname="${formControlName}"]`).first();
  await expect(select, `ion-select ${formControlName}`).toBeAttached({ timeout: 15_000 });

  const selected = await select.evaluate((element, preferredRaw) => {
    const preferred = preferredRaw
      ? preferredRaw.startsWith('/') && preferredRaw.endsWith('/')
        ? new RegExp(preferredRaw.slice(1, -1), 'i')
        : preferredRaw.toLowerCase()
      : null;

    const options = Array.from(element.querySelectorAll('ion-select-option')) as Array<HTMLElement & { value?: string }>;
    if (options.length === 0) throw new Error('No ion-select-option entries found.');

    const match =
      options.find((option) => {
        const value = String(option.getAttribute('value') || option.value || '').trim();
        const text = String(option.textContent || '').trim();
        if (!preferred) return Boolean(value || text);
        if (preferred instanceof RegExp) return preferred.test(value) || preferred.test(text);
        return value.toLowerCase() === preferred || text.toLowerCase().includes(preferred);
      }) || options[0];

    const value = String(match.getAttribute('value') || match.value || '').trim();
    const text = String(match.textContent || value).trim();
    (element as any).value = value;
    element.dispatchEvent(new CustomEvent('ionChange', { bubbles: true, composed: true, detail: { value } }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    return { value, text };
  }, preferredTextOrValue instanceof RegExp ? preferredTextOrValue.toString() : preferredTextOrValue || '');

  await scope.locator(`ion-select[formcontrolname="${formControlName}"]`).first().evaluate((element) => {
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }).catch(() => undefined);
  await new Promise((resolve) => setTimeout(resolve, 700));
  return selected;
}

export async function selectFirstAvailableSlot(page: Page): Promise<string> {
  const slot = page
    .locator('.slot-chip:not([disabled]):not(.slot-chip--full), .slot-cell--available:not(.slot-cell--disabled)')
    .first();
  await expect(slot, 'first available slot').toBeVisible({ timeout: 20_000 });
  const text = (await slot.innerText()).trim();
  await slot.click();
  return text;
}

export async function completePatientBookingWizard(page: Page): Promise<{ bookingId: string; booking: Record<string, unknown> }> {
  await loginAs(page, 'patient');

  const doctorsResponsePromise = page.waitForResponse(
    (r) => r.url().includes('/api/doctors') && r.request().method() === 'GET',
    { timeout: 30_000 }
  );
  await page.goto('/patient/doctors');
  const doctorsResponse = await doctorsResponsePromise;
  expect(doctorsResponse.status()).toBe(200);
  const doctorsPayload = await responseJson<unknown>(doctorsResponse);
  const firstDoctor = normalizeItems(doctorsPayload)[0] || {};
  const doctorName = firstTextValue(firstDoctor, ['fullName', 'doctorName', 'name']);
  if (doctorName) await expectVisibleText(page, doctorName, 'doctor name from doctors API');

  const bookLink = page.locator('app-doctor-card a.btn-book, a.btn-book').first();
  await expect(bookLink, 'Book Now link').toBeVisible({ timeout: 15_000 });
  await bookLink.click();
  await page.waitForURL(/\/public\/booking\?doctorId=/, { timeout: 20_000 });

  const serviceOption = page.locator('.service-option').first();
  await expect(serviceOption, 'first service option').toBeVisible({ timeout: 20_000 });
  const serviceName = (await serviceOption.locator('.service-option__name').innerText().catch(() => '')).trim();
  await serviceOption.click();
  if (serviceName) await expectVisibleText(page, serviceName, 'selected service name');
  await clickButtonOrLink(page, /continue/i);

  const dateContinue = page.getByRole('button', { name: /^continue$/i }).first();
  await expect(dateContinue, 'date step Continue').toBeVisible({ timeout: 20_000 });
  if (!(await dateContinue.isEnabled())) {
    await clickIfVisible(page.locator('.calendar-cell:not([disabled]):not(.calendar-cell--disabled)').first());
  }
  await expect(dateContinue).toBeEnabled({ timeout: 10_000 });
  await dateContinue.click();

  const slotLabel = await selectFirstAvailableSlot(page);
  await expectVisibleText(page, slotLabel.split('\n')[0], 'selected slot');
  await clickButtonOrLink(page, /continue/i);

  await clickButtonOrLink(page, /continue/i);
  await clickButtonOrLink(page, /continue to confirmation/i);

  await expect(page.getByRole('button', { name: /confirm booking/i })).toBeVisible({ timeout: 20_000 });
  const bookingResponse = await waitForApiResponse(
    page,
    'POST',
    '/api/bookings',
    () => page.getByRole('button', { name: /confirm booking/i }).click(),
    [200, 201]
  );
  const booking = ((await responseJson<Record<string, unknown>>(bookingResponse)) || {}) as Record<string, unknown>;
  const bookingId = extractId(booking);
  expect(bookingId, 'booking ID from POST /api/bookings response').toBeTruthy();

  await page.waitForURL(new RegExp(`/public/booking-confirmation/${escapeRegExp(bookingId)}`), { timeout: 30_000 });
  await expectVisibleText(page, 'Booking Confirmed', 'confirmation title');
  await expectAnyVisibleText(page, [bookingId, doctorName, serviceName], 'confirmation details from booking flow');

  return { bookingId, booking };
}

export async function confirmBookingIfNeeded(page: Page, bookingId: string): Promise<void> {
  const current = await apiCall<Record<string, unknown>>(page, 'GET', `bookings/${bookingId}`);
  expect(current.status, `GET bookings/${bookingId}`).toBe(200);
  const status = firstTextValue(current.body, ['status', 'bookingStatus', 'booking_status']);
  if (!/pending|proof/i.test(status)) return;

  // Staff detail page has check-in/payment actions, but confirmation UI is not exposed there in this frontend.
  // The backend endpoint is still exercised so the flow can continue only when confirmation is required.
  const result = await apiCall(page, 'PATCH', `bookings/${bookingId}/confirm`, {});
  expect([200, 204], `PATCH bookings/${bookingId}/confirm`).toContain(result.status);
}

export async function checkInFromStaffBookingDetail(page: Page, bookingId: string): Promise<void> {
  await page.goto(`/staff/bookings/${bookingId}`);
  await expectVisibleText(page, bookingId, 'booking detail ID');
  await expectNoPersistentLoading(page);

  const checkInButton = page.getByRole('button', { name: /^check in$/i }).first();
  if (await checkInButton.isVisible().catch(() => false)) {
    const response = await waitForApiResponse(
      page,
      'PATCH',
      `/api/bookings/${bookingId}/check-in`,
      () => checkInButton.click(),
      [200, 204]
    );
    expect([200, 204]).toContain(response.status());
  } else {
    const booking = await apiCall<Record<string, unknown>>(page, 'GET', `bookings/${bookingId}`);
    const status = firstTextValue(booking.body, ['status', 'bookingStatus', 'booking_status']);
    expect(status, 'booking should already be checked in or in progress if Check In button is absent').toMatch(
      /checkedin|checked in|inprogress|completed/i
    );
  }

  await page.goto(`/staff/bookings/${bookingId}`);
  await expectAnyVisibleText(page, ['CONFIRMED', 'CheckedIn', 'Checked In', 'InProgress'], 'checked-in status');
}

export async function fillAndCompleteDoctorConsultation(page: Page, bookingId: string): Promise<void> {
  await page.goto(`/doctor/consultation/${bookingId}`);
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await expectPageHasVisibleShell(page);
  await expectAnyVisibleText(page, [bookingId, 'Consultation', 'SOAP', 'Diagnosis'], 'consultation workspace');

  await fillControl(page, 'chiefComplaint', 'E2E: cough and fever for three days');
  await fillControl(page, 'subjective', 'Patient reports cough, fever, and mild fatigue.');
  await fillControl(page, 'objective', 'Alert, coherent, not in respiratory distress.');
  await fillControl(page, 'assessment', 'Upper respiratory tract infection.');
  await fillControl(page, 'plan', 'Rest, hydration, medications as prescribed, and follow up if symptoms persist.');

  await fillControl(page, 'bloodPressureSystolic', '120');
  await fillControl(page, 'bloodPressureDiastolic', '80');
  await fillControl(page, 'heartRate', '72');
  await fillControl(page, 'respiratoryRate', '18').catch(() => undefined);
  await fillControl(page, 'temperatureCelsius', '36.8').catch(() => undefined);
  await fillControl(page, 'oxygenSaturation', '98').catch(() => undefined);

  await addDiagnosisViaUi(page);
  await addOptionalPrescriptionIfPresent(page);
  await addOptionalFollowUpIfPresent(page);
  await addOptionalLabRequestIfPresent(page);
  await fillControl(page, 'professionalFee', '650').catch(() => undefined);

  const completeButton = page.getByRole('button', { name: /^complete consultation$/i }).first();
  await expect(completeButton, 'Complete Consultation button after required fields').toBeEnabled({ timeout: 15_000 });
  await completeButton.click();

  await expect(page.getByText(/complete consultation/i).first()).toBeVisible({ timeout: 15_000 });
  await clickButtonOrLink(page, /review summary/i);

  const completeResponse = await waitForApiResponse(
    page,
    'PATCH',
    `/api/bookings/${bookingId}/doctor-complete`,
    () => clickButtonOrLink(page, /finalize consultation/i),
    [200, 204]
  );
  expect([200, 204]).toContain(completeResponse.status());

  await page.waitForURL(new RegExp(`/doctor/appointments/${escapeRegExp(bookingId)}`), { timeout: 30_000 }).catch(() => undefined);
  const booking = await apiCall<Record<string, unknown>>(page, 'GET', `bookings/${bookingId}`);
  expect(booking.status, `GET bookings/${bookingId} after doctor complete`).toBe(200);
  const status = firstTextValue(booking.body, ['status', 'bookingStatus', 'booking_status']);
  expect(status).toMatch(/completed/i);
}

export async function collectPaymentFromStaffDetail(page: Page, bookingId: string): Promise<void> {
  await page.goto(`/staff/bookings/${bookingId}`);
  await expectVisibleText(page, bookingId, 'booking detail ID before payment');
  await expectNoPersistentLoading(page);

  const paymentButton = page.getByRole('button', { name: /^confirm payment$/i }).first();
  await expect(paymentButton, 'Confirm Payment button').toBeVisible({ timeout: 20_000 });
  await paymentButton.click();

  const amountInput = page.locator('input[name="amountReceived"]').first();
  await expect(amountInput, 'amount received field').toBeVisible({ timeout: 10_000 });
  const amount = await amountInput.inputValue();
  if (!amount || Number(amount) <= 0) {
    await amountInput.fill('650');
  }
  await page.locator('input[name="referenceNumber"]').first().fill(`E2E-${Date.now()}`).catch(() => undefined);

  const paymentResponse = await waitForApiResponse(
    page,
    'PATCH',
    `/api/payments/${bookingId}/confirm`,
    () => page.locator('ion-modal button.btn-primary:has-text("Confirm Payment"), button.btn-primary:has-text("Confirm Payment")').last().click(),
    [200, 204]
  );
  expect([200, 204]).toContain(paymentResponse.status());

  await page.goto(`/staff/bookings/${bookingId}`);
  await expectAnyVisibleText(page, ['Paid', 'PAID', 'Print Receipt'], 'paid status or receipt action');
}

export async function printReceiptIfPresent(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as typeof window & { __e2ePrintCalled?: boolean }).__e2ePrintCalled = false;
    const originalPrint = window.print.bind(window);
    window.print = () => {
      (window as typeof window & { __e2ePrintCalled?: boolean }).__e2ePrintCalled = true;
      return originalPrint();
    };
  });

  const printButton = page.getByRole('button', { name: /print receipt|print summary|print/i }).first();
  if (!(await printButton.isVisible().catch(() => false))) return;
  await printButton.click();
  await page.waitForTimeout(500);
  const called = await page.evaluate(() => Boolean((window as typeof window & { __e2ePrintCalled?: boolean }).__e2ePrintCalled));
  expect(called, 'window.print should be called when print UI exists').toBeTruthy();
}

export async function assertFinalBookingState(page: Page, bookingId: string): Promise<void> {
  const booking = await apiCall<Record<string, unknown>>(page, 'GET', `bookings/${bookingId}`);
  expect(booking.status, `GET bookings/${bookingId} final state`).toBe(200);
  const status = firstTextValue(booking.body, ['status', 'bookingStatus', 'booking_status']);
  const paymentStatus = firstTextValue(booking.body, ['paymentStatus', 'payment_status']);
  expect(status, 'final booking status').toMatch(/completed/i);
  expect(paymentStatus, 'final payment status').toMatch(/paid/i);

  await page.goto(`/staff/bookings/${bookingId}`);
  await expectVisibleText(page, bookingId, 'final booking detail ID');
  await expectAnyVisibleText(page, ['Completed', 'COMPLETED'], 'final completed status displayed');
  await expectAnyVisibleText(page, ['Paid', 'PAID'], 'final paid status displayed');
}

export async function createWalkInBookingViaStaffUi(page: Page): Promise<{ bookingId: string; patientName: string }> {
  const firstName = uniqueText('Walkin');
  const lastName = uniqueText('Patient');
  const patientName = `${firstName} ${lastName}`;

  await page.goto('/staff/walk-in');
  await expectPageHasVisibleShell(page);
  await expectVisibleText(page, 'Patient Search', 'walk-in patient search heading');

  await fillAny(page, ['ion-searchbar.walk-in-searchbar input', 'input[aria-label="Search patients"]'], patientName);
  await page.waitForTimeout(800);

  const quickRegister = page.getByText(/quick register/i).first();
  await expect(quickRegister, 'Quick Register when patient is not found').toBeVisible({ timeout: 20_000 });
  await quickRegister.click();

  await fillControl(page, 'firstName', firstName);
  await fillControl(page, 'lastName', lastName);
  await fillControl(page, 'dateOfBirth', '1990-06-15');
  await selectIonSelectOption(page, 'sex', 'Male');
  await fillControl(page, 'contactNumber', `0917${String(Date.now()).slice(-7)}`);
  await fillControl(page, 'email', `walkin.${Date.now()}@example.test`);
  await fillControl(page, 'address', 'E2E Test Address');

  const patientResponse = await waitForApiResponse(
    page,
    'POST',
    '/api/patients',
    () => page.getByRole('button', { name: /create patient/i }).click(),
    [200, 201]
  );
  expect([200, 201]).toContain(patientResponse.status());
  await expectVisibleText(page, firstName, 'created walk-in patient first name');
  await expectVisibleText(page, lastName, 'created walk-in patient last name');

  const selectedDoctor = await selectIonSelectOption(page, 'doctorId');
  await expectVisibleText(page, selectedDoctor.text, 'selected walk-in doctor');
  await page.waitForTimeout(1_500);
  const selectedService = await selectIonSelectOption(page, 'serviceId');
  await expectVisibleText(page, selectedService.text, 'selected walk-in service');

  await fillControl(page, 'appointmentDate', manilaDateOffset(1)).catch(() => undefined);
  const slot = await selectFirstAvailableSlot(page);
  await expectVisibleText(page, slot.split('\n')[0], 'walk-in selected slot');

  await expectVisibleText(page, 'Payment', 'walk-in review step');
  await expectVisibleText(page, firstName, 'walk-in review patient first name');
  await expectVisibleText(page, selectedDoctor.text, 'walk-in review doctor');
  await expectVisibleText(page, selectedService.text, 'walk-in review service');

  const bookingResponse = await waitForApiResponse(
    page,
    'POST',
    '/api/bookings/walk-in',
    () => page.getByRole('button', { name: /create booking/i }).click(),
    [200, 201]
  );
  const booking = ((await responseJson<Record<string, unknown>>(bookingResponse)) || {}) as Record<string, unknown>;
  const bookingId = extractId(booking);
  expect(bookingId, 'booking ID from POST /api/bookings/walk-in response').toBeTruthy();

  await page.waitForURL(/\/staff\/bookings/, { timeout: 30_000 });
  return { bookingId, patientName };
}

async function addDiagnosisViaUi(page: Page): Promise<void> {
  const search = page.locator('#icd10-search-input input, ion-input[formcontrolname="search"] input').first();
  await expect(search, 'ICD-10 search field').toBeVisible({ timeout: 15_000 });
  await search.fill('J00');
  await page.waitForTimeout(700);
  const result = page.locator('.result-item').first();
  await expect(result, 'ICD-10 result').toBeVisible({ timeout: 10_000 });
  const text = (await result.innerText()).trim();
  await result.click();
  await expectAnyVisibleText(page, ['J00', text.split('\n')[0]], 'selected diagnosis');
}

async function addOptionalPrescriptionIfPresent(page: Page): Promise<void> {
  const root = page.locator('app-prescription-builder').first();
  if (!(await root.isVisible().catch(() => false))) return;
  await fillControl(root, 'medicineName', 'Paracetamol');
  await fillControl(root, 'genericName', 'Paracetamol').catch(() => undefined);
  await fillControl(root, 'strength', '500 mg');
  await fillControl(root, 'quantity', '10');
  await fillControl(root, 'duration', '3 days').catch(() => undefined);
  await fillControl(root, 'sig', 'Take one tablet every 6 hours as needed.');
  await fillControl(root, 'instructions', 'Take after meals.').catch(() => undefined);
  await expectVisibleText(page, 'Paracetamol', 'optional prescription');
}

async function addOptionalFollowUpIfPresent(page: Page): Promise<void> {
  const root = page.locator('app-follow-up-form').first();
  if (!(await root.isVisible().catch(() => false))) return;
  await fillControl(root, 'followUpDate', manilaDateOffset(7));
  await fillControl(root, 'reason', 'E2E follow-up after consultation.');
  await expectVisibleText(page, 'E2E follow-up', 'optional follow-up reason');
}

async function addOptionalLabRequestIfPresent(page: Page): Promise<void> {
  const root = page.locator('app-lab-request-form').first();
  if (!(await root.isVisible().catch(() => false))) return;
  const quickCbc = root.getByRole('button', { name: /CBC/i }).first();
  if (await quickCbc.isVisible().catch(() => false)) {
    await quickCbc.click();
  } else {
    await fillControl(root, 'testName', 'CBC');
  }
  await fillControl(root, 'reason', 'E2E lab request.').catch(() => undefined);
  await root.getByRole('button', { name: /add request/i }).click();
  await expectVisibleText(page, 'CBC', 'optional lab request');
}

function normalizeVisibleText(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

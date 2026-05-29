import { expect, type Page, type Route } from '@playwright/test';

export interface CapturedApiResponse {
  url: string;
  method: string;
  status: number;
  body: unknown;
}

const todayIso = (): string => new Date().toISOString().slice(0, 10);
const tomorrowIso = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

export const staffTestData = {
  apiBaseUrl: process.env.PLAYWRIGHT_API_BASE_URL ?? 'https://localhost:44384/api',
  routes: {
    dashboard: '/staff/dashboard',
    bookings: '/staff/bookings',
    bookingDetail: '/staff/bookings/bk-001',
    payments: '/staff/payments',
    walkIn: '/staff/walk-in',
    patients: '/staff/patients',
    patientDetail: '/staff/patients/pat-001',
    doctorStatus: '/staff/doctor-status',
    profile: '/staff/profile',
    adminStaffAccounts: '/admin/staff'
  },
  selectors: {
    loading: 'app-skeleton, .loading-card, .payment-loading, .loading-panel, ion-spinner',
    toast: 'ion-toast',
    portalShell: 'app-portal-layout, .portal-shell, ion-content',
    emptyState: 'app-empty-state',
    table: 'table.clinic-table',
    modal: '[role="dialog"], ion-modal, app-confirm-modal, .pb, .pw'
  },
  staffUser: {
    id: 'staff-user-001',
    fullName: 'Sally Staff',
    email: 'staff@example.test',
    role: 'Staff',
    avatarUrl: '',
    phoneNumber: '09171234567',
    isFirstLogin: false
  },
  adminUser: {
    id: 'admin-user-001',
    fullName: 'Anna Admin',
    email: 'admin@example.test',
    role: 'Admin',
    avatarUrl: '',
    phoneNumber: '09170000000',
    isFirstLogin: false
  },
  doctors: [
    {
      id: 'doc-001',
      userId: 'doc-user-001',
      fullName: 'Dr. Grace E. Gavino',
      specialization: 'Family Medicine',
      status: 'Active',
      isActive: true,
      profilePhotoUrl: '',
      consultationFee: 650,
      slotDurationMinutes: 30,
      slotCapacity: 2,
      dailyPatientLimit: 20
    },
    {
      id: 'doc-002',
      userId: 'doc-user-002',
      fullName: 'Dr. Juan Santos',
      specialization: 'Pediatrics',
      status: 'Active',
      isActive: true,
      profilePhotoUrl: '',
      consultationFee: 500,
      slotDurationMinutes: 30,
      slotCapacity: 1,
      dailyPatientLimit: 15
    }
  ],
  patients: [
    {
      id: 'pat-001',
      patientCode: 'P-0001',
      firstName: 'Juan',
      middleName: 'Dela',
      lastName: 'Cruz',
      fullName: 'Juan Dela Cruz',
      dateOfBirth: '1990-01-15',
      sex: 'Male',
      contactNumber: '09181234567',
      email: 'juan.cruz@example.test',
      address: 'Cebu City',
      emergencyContactName: 'Maria Cruz',
      emergencyContactNumber: '09189999999',
      insuranceProvider: 'Self-pay',
      userId: '',
      isGuest: true,
      hasAccount: false
    },
    {
      id: 'pat-002',
      patientCode: 'P-0002',
      firstName: 'Maria',
      middleName: '',
      lastName: 'Reyes',
      fullName: 'Maria Reyes',
      dateOfBirth: '1988-05-20',
      sex: 'Female',
      contactNumber: '09185550000',
      email: 'maria.reyes@example.test',
      address: 'Mandaue City',
      userId: 'patient-user-002',
      isGuest: false,
      hasAccount: true
    }
  ],
  services: [
    {
      id: 'svc-001',
      name: 'General Consultation',
      description: 'Primary care consultation and medical advice.',
      estimatedDurationMinutes: 30,
      price: 0,
      category: 'Consultation',
      doctorIds: ['doc-001']
    },
    {
      id: 'svc-002',
      name: 'Pediatric Checkup',
      description: 'Child wellness and consultation.',
      estimatedDurationMinutes: 30,
      price: 0,
      category: 'Pediatrics',
      doctorIds: ['doc-002']
    }
  ],
  bookings: [
    {
      id: 'bk-001',
      bookingCode: 'BK-001',
      patientId: 'pat-001',
      patientName: 'Juan Dela Cruz',
      doctorId: 'doc-001',
      doctorName: 'Dr. Grace E. Gavino',
      serviceId: 'svc-001',
      serviceIds: ['svc-001'],
      serviceName: 'General Consultation',
      serviceNames: ['General Consultation'],
      services: [{ id: 'svc-001', name: 'General Consultation' }],
      appointmentDate: todayIso(),
      slotStartTime: '09:00',
      slotEndTime: '09:30',
      queueNumber: 1,
      status: 'Confirmed',
      paymentStatus: 'Unpaid',
      paymentMode: 'PayAtClinic',
      isWalkIn: false,
      finalAmount: 650,
      doctorCompletedAt: null,
      patient: {
        id: 'pat-001',
        patientCode: 'P-0001',
        firstName: 'Juan',
        middleName: 'Dela',
        lastName: 'Cruz',
        fullName: 'Juan Dela Cruz',
        contactNumber: '09181234567',
        email: 'juan.cruz@example.test',
        sex: 'Male',
        dateOfBirth: '1990-01-15'
      },
      doctor: { id: 'doc-001', fullName: 'Dr. Grace E. Gavino', specialization: 'Family Medicine', status: 'Active' },
      payment: { id: 'pay-001', bookingId: 'bk-001', amount: 650, status: 'Unpaid', paymentMethod: 'PayAtClinic' }
    },
    {
      id: 'bk-002',
      bookingCode: 'BK-002',
      patientId: 'pat-002',
      patientName: 'Maria Reyes',
      doctorId: 'doc-002',
      doctorName: 'Dr. Juan Santos',
      serviceId: 'svc-002',
      serviceIds: ['svc-002'],
      serviceName: 'Pediatric Checkup',
      serviceNames: ['Pediatric Checkup'],
      services: [{ id: 'svc-002', name: 'Pediatric Checkup' }],
      appointmentDate: todayIso(),
      slotStartTime: '10:00',
      slotEndTime: '10:30',
      queueNumber: 2,
      status: 'Completed',
      paymentStatus: 'Unpaid',
      paymentMode: 'PayAtClinic',
      isWalkIn: true,
      finalAmount: 500,
      doctorCompletedAt: `${todayIso()}T10:45:00`,
      patient: { id: 'pat-002', fullName: 'Maria Reyes', patientCode: 'P-0002' },
      doctor: { id: 'doc-002', fullName: 'Dr. Juan Santos', specialization: 'Pediatrics', status: 'Active' },
      payment: { id: 'pay-002', bookingId: 'bk-002', amount: 500, status: 'Unpaid', paymentMethod: 'PayAtClinic' }
    }
  ],
  slots: [
    { slot: '09:00', slotEnd: '09:30', capacity: 2, bookedCount: 0, available: true },
    { slot: '10:00', slotEnd: '10:30', capacity: 2, bookedCount: 1, available: true }
  ],
  adminStaff: [
    { id: 'staff-001', fullName: 'Sally Staff', email: 'staff@example.test', role: 'Staff', status: 'Active', inactive: false, isInvite: false },
    { id: 'invite-001', fullName: 'Pending Staff', email: 'pending.staff@example.test', role: 'Staff', status: 'Invited', inactive: false, isInvite: true }
  ],
  newPatient: {
    firstName: 'Pedro',
    middleName: 'New',
    lastName: 'Patient',
    dateOfBirth: '1995-02-10',
    sex: 'Male',
    contactNumber: '09190000000',
    email: 'pedro.patient@example.test',
    address: 'Cebu City'
  },
  newPortalAccount: {
    email: 'juan.portal@example.test',
    temporaryPassword: 'TempPass123!',
    confirmTemporaryPassword: 'TempPass123!'
  },
  profileUpdate: {
    fullName: 'Sally Staff Updated',
    contactNumber: '09175551234'
  },
  passwordChange: {
    currentPassword: 'OldPass123!',
    newPassword: 'NewPass123!',
    confirmPassword: 'NewPass123!'
  },
  payment: {
    method: 'Cash',
    amountReceived: 650,
    referenceNumber: 'OR-TEST-001',
    notes: 'Playwright test payment'
  },
  dates: { today: todayIso(), tomorrow: tomorrowIso() }
};

export function collectApiResponses(page: Page): CapturedApiResponse[] {
  const responses: CapturedApiResponse[] = [];
  page.on('response', async (response) => {
    const request = response.request();
    const url = response.url();
    if (!url.includes('/api/')) return;
    let body: unknown = null;
    try {
      const text = await response.text();
      body = text ? JSON.parse(text) : null;
    } catch {
      body = null;
    }
    responses.push({ url, method: request.method(), status: response.status(), body });
  });
  return responses;
}

export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

export async function expectNoConsoleErrors(errors: string[]): Promise<void> {
  expect(errors, 'No unhandled console/page errors after load').toEqual([]);
}

export async function assertNoBlankWhiteScreen(page: Page): Promise<void> {
  await expect(page.locator('body')).not.toHaveText(/^\s*$/);
  await expect(page.locator('body')).toBeVisible();
}

export async function waitForStaffLoadingToSettle(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(100);
  await page.locator(staffTestData.selectors.loading).first().waitFor({ state: 'detached', timeout: 5000 }).catch(() => undefined);
}

export async function expectAnyTextVisible(page: Page, texts: Array<string | number | null | undefined>): Promise<void> {
  for (const value of texts) {
    if (value === null || value === undefined || value === '') continue;
    await expect(page.getByText(String(value), { exact: false }).first()).toBeVisible();
    return;
  }
  throw new Error('No non-empty candidate text was provided.');
}

export async function assertExpectedApiCall(
  responses: CapturedApiResponse[],
  endpointContains: string,
  method = 'GET'
): Promise<CapturedApiResponse> {
  await expect
    .poll(() => responses.find((response) => response.url.includes(endpointContains) && response.method === method)?.status, {
      message: `Expected ${method} ${endpointContains} to be called`,
      timeout: 5000
    })
    .toBeGreaterThanOrEqual(200);
  const response = responses.find((item) => item.url.includes(endpointContains) && item.method === method);
  if (!response) throw new Error(`Missing captured response for ${method} ${endpointContains}`);
  return response;
}

export interface MockStaffApiOptions {
  role?: 'Staff' | 'Admin' | 'Patient' | 'Doctor' | 'Guest';
  delayMs?: number;
  failEndpoints?: string[];
  emptyEndpoints?: string[];
  bookings?: typeof staffTestData.bookings;
  patients?: typeof staffTestData.patients;
  doctors?: typeof staffTestData.doctors;
  services?: typeof staffTestData.services;
  adminStaff?: typeof staffTestData.adminStaff;
}

const isFailure = (path: string, options: MockStaffApiOptions): boolean =>
  options.failEndpoints?.some((endpoint) => path.includes(endpoint)) ?? false;

const isEmpty = (path: string, options: MockStaffApiOptions): boolean =>
  options.emptyEndpoints?.some((endpoint) => path.includes(endpoint)) ?? false;

async function fulfillJson(route: Route, body: unknown, status = 200, delayMs = 0): Promise<void> {
  if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body)
  });
}

export async function mockStaffApi(page: Page, options: MockStaffApiOptions = {}): Promise<void> {
  const role = options.role ?? 'Staff';
  const user = role === 'Admin' ? staffTestData.adminUser : role === 'Guest' ? null : { ...staffTestData.staffUser, role };
  const doctors = options.doctors ?? staffTestData.doctors;
  const patients = options.patients ?? staffTestData.patients;
  const services = options.services ?? staffTestData.services;
  const bookings = options.bookings ?? staffTestData.bookings;
  const adminStaff = options.adminStaff ?? staffTestData.adminStaff;
  const delayMs = options.delayMs ?? 25;

  await page.addInitScript(({ seededUser }) => {
    if (!seededUser) {
      window.localStorage.clear();
      return;
    }
    window.localStorage.setItem('clinic.auth.access-token', 'playwright-access-token');
    window.localStorage.setItem('clinic.auth.refresh-token', 'playwright-refresh-token');
    window.localStorage.setItem('clinic.auth.user', JSON.stringify(seededUser));
  }, { seededUser: user });

  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^.*\/api\/?/, '');
    const method = request.method();

    if (isFailure(path, options)) {
      return fulfillJson(route, { message: `Forced failure for ${path}` }, 500, delayMs);
    }

    if (path === 'auth/me' && method === 'GET') {
      return user ? fulfillJson(route, user, 200, delayMs) : fulfillJson(route, { message: 'Unauthorized' }, 401, delayMs);
    }
    if (path === 'auth/me' && method === 'PUT') {
      const payload = request.postDataJSON?.() ?? {};
      return fulfillJson(route, { ...staffTestData.staffUser, ...payload }, 200, delayMs);
    }
    if (path === 'auth/change-password' && method === 'POST') {
      return fulfillJson(route, {}, 200, delayMs);
    }

    if (path === 'admin/staff' && method === 'GET') {
      return fulfillJson(route, isEmpty(path, options) ? [] : adminStaff, 200, delayMs);
    }
    if (path === 'admin/staff/invite' && method === 'POST') {
      const payload = request.postDataJSON?.() ?? {};
      return fulfillJson(route, { id: 'invite-new', ...payload, full_name: payload.full_name ?? payload.fullName }, 200, delayMs);
    }
    if (path.includes('admin/staff/invite/') && path.endsWith('/revoke') && method === 'PUT') {
      return fulfillJson(route, { status: 'Revoked' }, 200, delayMs);
    }
    if (path.includes('admin/staff/') && path.endsWith('/update-status') && method === 'PUT') {
      return fulfillJson(route, { userId: path.split('/')[2], status: 'Inactive', banned: true }, 200, delayMs);
    }

    if (path === 'doctors' && method === 'GET') {
      return fulfillJson(route, isEmpty(path, options) ? [] : doctors, 200, delayMs);
    }
    if (/^doctor-day-status\/[^/]+$/.test(path) && method === 'GET') {
      return fulfillJson(route, { doctorId: path.split('/')[1], status: 'Available', runningLateMinutes: null }, 200, delayMs);
    }
    if (/^doctor-day-status\/[^/]+\/status$/.test(path) && method === 'POST') {
      const payload = request.postDataJSON?.() ?? {};
      return fulfillJson(route, { doctorId: path.split('/')[1], ...payload }, 200, delayMs);
    }
    if (/^doctors\/[^/]+\/services$/.test(path) && method === 'GET') {
      return fulfillJson(route, isEmpty(path, options) ? [] : services.filter((service) => service.doctorIds.includes(path.split('/')[1])), 200, delayMs);
    }
    if (/^doctors\/[^/]+\/available-slots$/.test(path) && method === 'GET') {
      return fulfillJson(route, isEmpty(path, options) ? [] : staffTestData.slots, 200, delayMs);
    }

    if (path === 'services' && method === 'GET') {
      return fulfillJson(route, isEmpty(path, options) ? [] : services, 200, delayMs);
    }

    if (path.startsWith('patients?page=') || path === 'patients') {
      if (method === 'GET') {
        return fulfillJson(route, {
          items: isEmpty('patients', options) ? [] : patients,
          totalCount: isEmpty('patients', options) ? 0 : patients.length,
          page: Number(url.searchParams.get('page') ?? '1'),
          pageSize: Number(url.searchParams.get('pageSize') ?? '20'),
          totalPages: isEmpty('patients', options) ? 1 : 1
        }, 200, delayMs);
      }
      if (method === 'POST') {
        const payload = request.postDataJSON?.() ?? {};
        return fulfillJson(route, { id: 'pat-new', patientCode: 'P-NEW', ...payload, fullName: `${payload.firstName ?? ''} ${payload.lastName ?? ''}`.trim(), isGuest: true, hasAccount: false }, 200, delayMs);
      }
    }
    if (/^patients\/[^/]+$/.test(path) && method === 'GET') {
      const patient = patients.find((item) => item.id === path.split('/')[1]) ?? patients[0];
      return fulfillJson(route, patient ?? null, patient ? 200 : 404, delayMs);
    }
    if (/^patients\/[^/]+\/portal-account$/.test(path) && method === 'POST') {
      return fulfillJson(route, { success: true }, 200, delayMs);
    }

    if (path.startsWith('bookings/staff/today') && method === 'GET') {
      return fulfillJson(route, { items: isEmpty(path, options) ? [] : bookings, totalCount: isEmpty(path, options) ? 0 : bookings.length, page: 1, pageSize: 500 }, 200, delayMs);
    }
    if (path.startsWith('bookings/staff/all') && method === 'GET') {
      return fulfillJson(route, { items: isEmpty(path, options) ? [] : bookings, totalCount: isEmpty(path, options) ? 0 : bookings.length, page: 1, pageSize: 20 }, 200, delayMs);
    }
    if (path.startsWith('bookings/staff/for-payment') && method === 'GET') {
      const paymentRows = bookings.filter((booking) => booking.status === 'Completed' && booking.paymentStatus === 'Unpaid').map((booking) => ({
        booking_id: booking.id,
        payment_id: booking.payment.id,
        patient_name: booking.patientName,
        doctor_name: booking.doctorName,
        services: booking.serviceNames,
        appointment_date: booking.appointmentDate,
        slot_start_time: booking.slotStartTime,
        queue_number: booking.queueNumber,
        amount_due: booking.finalAmount,
        doctor_completed_at: booking.doctorCompletedAt,
        payment_status: booking.paymentStatus,
        status: booking.status
      }));
      return fulfillJson(route, { items: isEmpty(path, options) ? [] : paymentRows, totalCount: isEmpty(path, options) ? 0 : paymentRows.length, page: 1, pageSize: 20 }, 200, delayMs);
    }
    if (/^bookings\/[^/]+$/.test(path) && method === 'GET') {
      const booking = bookings.find((item) => item.id === path.split('/')[1]) ?? bookings[0];
      return fulfillJson(route, booking ?? null, booking ? 200 : 404, delayMs);
    }
    if (/^bookings\/[^/]+\/check-in$/.test(path) && method === 'PATCH') {
      return fulfillJson(route, { id: path.split('/')[1], status: 'CheckedIn' }, 200, delayMs);
    }
    if (/^bookings\/[^/]+\/undo-check-in$/.test(path) && method === 'PATCH') {
      return fulfillJson(route, { id: path.split('/')[1], status: 'Confirmed' }, 200, delayMs);
    }
    if (path === 'bookings/walk-in' && method === 'POST') {
      return fulfillJson(route, { id: 'bk-walk-in', queueNumber: 7 }, 200, delayMs);
    }

    if (/^payments\/[^/]+\/confirm$/.test(path) && method === 'PATCH') {
      const payload = request.postDataJSON?.() ?? {};
      return fulfillJson(route, { id: 'pay-confirmed', bookingId: path.split('/')[1], amount: payload.amountReceived ?? 650, paymentMethod: payload.paymentMethod ?? 'Cash', status: 'Paid', orNumber: 'OR-001', verifiedAt: `${todayIso()}T11:00:00` }, 200, delayMs);
    }
    if (/^payments\/[^/]+\/waive$/.test(path) && method === 'PATCH') {
      return fulfillJson(route, { id: 'pay-waived', bookingId: path.split('/')[1], status: 'Waived', waivedAt: `${todayIso()}T11:00:00` }, 200, delayMs);
    }
    if (/^payments\/[^/]+$/.test(path) && method === 'GET') {
      return fulfillJson(route, { id: path.split('/')[1], bookingId: 'bk-002', amount: 500, paymentMethod: 'Cash', status: 'Paid', orNumber: 'OR-001', verifiedAt: `${todayIso()}T11:00:00` }, 200, delayMs);
    }

    return fulfillJson(route, { message: `Unhandled test API route: ${method} ${path}` }, 404, delayMs);
  });
}

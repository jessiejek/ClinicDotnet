import { expect, type Page, type Request, type Route } from '@playwright/test';

export interface CapturedApiResponse {
  url: string;
  method: string;
  status: number;
  body: unknown;
}

const tomorrowIso = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

export const publicTestData = {
  apiBaseUrl: process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://localhost:5000/api',
  routes: {
    home: '/public',
    doctors: '/public/doctors',
    doctorProfile: '/public/doctors/doc-001',
    services: '/public/services',
    announcements: '/public/announcements',
    booking: '/public/booking',
    bookingConfirmation: '/public/booking-confirmation/book-001',
    privacyPolicy: '/public/privacy-policy'
  },
  selectors: {
    loading: '.page-loading, .profile-loading, .wizard-loading, .calendar-loading, .slot-loading, .skeleton-grid, ion-spinner, app-skeleton',
    toast: 'ion-toast',
    publicShell: '.public-layout',
    navbar: '.public-navbar',
    footer: '.public-footer'
  },
  doctors: [
    {
      id: 'doc-001',
      userId: 'user-doc-001',
      fullName: 'Dr. Grace E. Gavino',
      specialization: 'Family Medicine',
      bio: 'Comprehensive family medicine care for adults and children.',
      profilePhotoUrl: '',
      licenseNumber: 'LIC-001',
      ptrNumber: 'PTR-001',
      consultationFee: 650,
      slotDurationMinutes: 30,
      slotCapacity: 2,
      dailyPatientLimit: 20,
      status: 'Active',
      isActive: true,
      averageRating: 4.8,
      reviewCount: 12
    },
    {
      id: 'doc-002',
      userId: 'user-doc-002',
      fullName: 'Dr. Juan Santos',
      specialization: 'Pediatrics',
      bio: 'Pediatric care and wellness consultations.',
      profilePhotoUrl: '',
      licenseNumber: 'LIC-002',
      ptrNumber: 'PTR-002',
      consultationFee: 500,
      slotDurationMinutes: 30,
      slotCapacity: 1,
      dailyPatientLimit: 15,
      status: 'Active',
      isActive: true,
      averageRating: 4.5,
      reviewCount: 8
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
      doctorIds: ['doc-001', 'doc-002']
    },
    {
      id: 'svc-002',
      name: 'Minor Procedure',
      description: 'Minor in-clinic procedure.',
      estimatedDurationMinutes: 45,
      price: 1200,
      category: 'Procedure',
      doctorIds: ['doc-001']
    },
    {
      id: 'svc-003',
      name: 'CBC Laboratory',
      description: 'Complete blood count laboratory test.',
      estimatedDurationMinutes: 20,
      price: 350,
      category: 'Laboratory',
      doctorIds: ['doc-001']
    }
  ],
  announcements: [
    {
      id: 'ann-001',
      title: 'Clinic Schedule Advisory',
      body: 'The clinic will follow regular operating hours this week.',
      imageUrl: '',
      createdAt: '2026-05-20T08:00:00Z',
      isActive: true
    },
    {
      id: 'ann-002',
      title: 'New Laboratory Services',
      body: 'Additional laboratory services are now available.',
      imageUrl: '',
      createdAt: '2026-05-21T08:00:00Z',
      isActive: true
    }
  ],
  reviews: [
    {
      id: 'rev-001',
      doctorId: 'doc-001',
      patientName: 'Maria Cruz',
      rating: 5,
      comment: 'Very professional and caring.',
      createdAt: '2026-05-18T08:00:00Z'
    }
  ],
  schedules: [
    { id: 'sched-001', doctorId: 'doc-001', dayOfWeek: 'Monday', startTime: '08:00:00', endTime: '23:59:00' },
    { id: 'sched-002', doctorId: 'doc-001', dayOfWeek: 'Tuesday', startTime: '08:00:00', endTime: '23:59:00' },
    { id: 'sched-003', doctorId: 'doc-001', dayOfWeek: 'Wednesday', startTime: '08:00:00', endTime: '23:59:00' },
    { id: 'sched-004', doctorId: 'doc-001', dayOfWeek: 'Thursday', startTime: '08:00:00', endTime: '23:59:00' },
    { id: 'sched-005', doctorId: 'doc-001', dayOfWeek: 'Friday', startTime: '08:00:00', endTime: '23:59:00' },
    { id: 'sched-006', doctorId: 'doc-001', dayOfWeek: 'Saturday', startTime: '08:00:00', endTime: '23:59:00' },
    { id: 'sched-007', doctorId: 'doc-001', dayOfWeek: 'Sunday', startTime: '08:00:00', endTime: '23:59:00' }
  ],
  slots: [
    {
      date: tomorrowIso(),
      startTime: '23:00:00',
      endTime: '23:30:00',
      slotStartTime: '23:00:00',
      slotEndTime: '23:30:00',
      bookedCount: 0,
      capacity: 2,
      isAvailable: true
    },
    {
      date: tomorrowIso(),
      startTime: '23:30:00',
      endTime: '23:59:00',
      slotStartTime: '23:30:00',
      slotEndTime: '23:59:00',
      bookedCount: 2,
      capacity: 2,
      isAvailable: false
    }
  ],
  settings: {
    id: 'settings-001',
    clinicName: 'Dr. Grace E. Gavino Medical Clinic',
    logoUrl: '',
    primaryColor: '#275228',
    secondaryColor: '#E4C05B',
    address: 'Cebu City, Philippines',
    phone: '+63 32 000 0000',
    email: 'clinic@example.com',
    facebookUrl: '',
    instagramUrl: '',
    operatingHours: {
      monday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
      tuesday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
      wednesday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
      thursday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
      friday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '12:00' },
      sunday: { isOpen: false, openTime: '', closeTime: '' }
    },
    cancellationDeadlineHours: 24,
    patientPortalEnabled: true,
    vaccinationReminderEnabled: true,
    followUpReminderEnabled: true,
    isPayAtClinicMode: true,
    payAtClinicNoShowWindowMinutes: 10,
    consentVersion: '2026-05',
    paymentSettings: {}
  },
  bookingSummary: {
    id: 'book-001',
    queueNumber: 7,
    doctorName: 'Dr. Grace E. Gavino',
    appointmentDate: tomorrowIso(),
    slotStartTime: '23:00:00',
    slotEndTime: '23:30:00',
    serviceName: 'General Consultation',
    totalFee: 650,
    paymentStatus: 'Unpaid'
  },
  bookingCreateResponse: {
    id: 'book-001',
    queueNumber: 7
  }
} as const;

export function collectApiResponses(page: Page): CapturedApiResponse[] {
  const records: CapturedApiResponse[] = [];
  page.on('response', async (response) => {
    if (!response.url().includes('/api/')) {
      return;
    }

    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      try {
        body = await response.text();
      } catch {
        body = null;
      }
    }

    records.push({
      url: response.url(),
      method: response.request().method(),
      status: response.status(),
      body
    });
  });
  return records;
}

export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      const text = message.text();
      // Angular dev mode and blocked favicon noise should not hide real page errors.
      if (!text.includes('favicon') && !text.includes('Request failed:')) {
        errors.push(text);
      }
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

export async function expectNoConsoleErrors(errors: string[]): Promise<void> {
  expect(errors, `Unexpected console/page errors: ${errors.join('\n')}`).toEqual([]);
}

export async function waitForPublicLoadingToSettle(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator(publicTestData.selectors.loading)).toHaveCount(0, { timeout: 5_000 });
}

export async function expectAnyTextVisible(page: Page, values: string[]): Promise<void> {
  for (const value of values) {
    if (!value) continue;
    await expect(page.getByText(value, { exact: false }).first()).toBeVisible();
  }
}

export async function mockPublicApi(
  page: Page,
  options: {
    doctors?: unknown[];
    services?: unknown[];
    announcements?: unknown[];
    reviews?: unknown[];
    schedules?: unknown[];
    slots?: unknown[];
    settings?: unknown;
    doctorDetail?: unknown;
    dayStatus?: unknown;
    bookingSummary?: unknown;
    bookingCreateResponse?: unknown;
    failEndpoints?: string[];
    delayMs?: number;
  } = {}
): Promise<void> {
  const data = {
    doctors: options.doctors ?? [...publicTestData.doctors],
    services: options.services ?? [...publicTestData.services],
    announcements: options.announcements ?? [...publicTestData.announcements],
    reviews: options.reviews ?? [...publicTestData.reviews],
    schedules: options.schedules ?? [...publicTestData.schedules],
    slots: options.slots ?? [...publicTestData.slots],
    settings: options.settings ?? publicTestData.settings,
    doctorDetail: options.doctorDetail ?? { ...publicTestData.doctors[0], services: [...publicTestData.services] },
    dayStatus: options.dayStatus ?? { id: 'status-001', doctorId: 'doc-001', date: tomorrowIso(), status: 'Available', runningLateMinutes: 0 },
    bookingSummary: options.bookingSummary ?? publicTestData.bookingSummary,
    bookingCreateResponse: options.bookingCreateResponse ?? publicTestData.bookingCreateResponse
  };

  const failEndpoints = options.failEndpoints ?? [];
  const delayMs = options.delayMs ?? 150;

  await page.route('**/api/**', async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^.*\/api\/?/, '').replace(/^\/+/, '');
    const shouldFail = failEndpoints.some((endpoint) => path.includes(endpoint));

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    if (shouldFail) {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: `Forced failure for ${path}` })
      });
      return;
    }

    const body = resolvePublicApiBody(path, request, data);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body)
    });
  });
}

function resolvePublicApiBody(
  path: string,
  request: Request,
  data: {
    doctors: unknown[];
    services: unknown[];
    announcements: unknown[];
    reviews: unknown[];
    schedules: unknown[];
    slots: unknown[];
    settings: unknown;
    doctorDetail: unknown;
    dayStatus: unknown;
    bookingSummary: unknown;
    bookingCreateResponse: unknown;
  }
): unknown {
  if (request.method() === 'POST' && path === 'bookings') return data.bookingCreateResponse;
  if (path === 'doctors') return data.doctors;
  if (path === 'services') return data.services;
  if (path === 'announcements') return data.announcements;
  if (path === 'settings') return data.settings;
  if (/^doctor-day-status\//.test(path)) return data.dayStatus;
  if (/^reviews\?doctorId=/.test(path) || path.startsWith('reviews')) return data.reviews;
  if (/^doctors\/[^/]+\/schedule/.test(path)) return data.schedules;
  if (/^doctors\/[^/]+\/available-slots/.test(path)) return data.slots;
  if (/^doctors\/[^/]+\/services/.test(path)) return data.services;
  if (/^doctors\/[^/]+$/.test(path)) return data.doctorDetail;
  if (/^bookings\/[^/]+\/public-summary/.test(path)) return data.bookingSummary;
  if (path === 'auth/me') return null;
  return {};
}

export async function assertExpectedApiCall(
  responses: CapturedApiResponse[],
  endpointFragment: string,
  status = 200
): Promise<CapturedApiResponse> {
  await expect
    .poll(() => responses.find((response) => response.url.includes(endpointFragment) && response.status === status), {
      message: `Expected API response ${status} containing ${endpointFragment}`,
      timeout: 5_000
    })
    .toBeTruthy();

  return responses.find((response) => response.url.includes(endpointFragment) && response.status === status)!;
}

export async function assertNoBlankWhiteScreen(page: Page): Promise<void> {
  await expect(page.locator('body')).not.toBeEmpty();
  await expect(page.locator(publicTestData.selectors.publicShell)).toBeVisible();
}

const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/booking.service.ts';
let c = fs.readFileSync(f, 'utf8');

// Count before
const beforeFrom = (c.match(/\.from\(/g) || []).length;
const beforeRpc = (c.match(/\.rpc\(/g) || []).length;
const beforeSupabase = (c.match(/this\.supabase/g) || []).length;
const beforeSupabaseStr = (c.match(/Supabase/g) || []).length;
console.log(`Before: ${beforeFrom} .from(), ${beforeRpc} .rpc(), ${beforeSupabase} this.supabase, ${beforeSupabaseStr} 'Supabase' strings`);

// ============================================================
// STEP 1: Remove import + inject
// ============================================================
c = c.replace(/import \{ SupabaseService \} from '.\/supabase.service';\r?\n/, '');
c = c.replace(/private readonly supabase = inject\(SupabaseService\).client;\r?\n    /, '  ');

// ============================================================
// STEP 2: Replace all 9 this.supabase methods with API calls
// ============================================================

// 2a. fetchSupabaseStaffTodayBookings (line ~852)
c = c.replace(
  'private async fetchSupabaseStaffTodayBookings(\n' +
  '    filters: StaffTodayBookingsFilters = {}\n' +
  '  ): Promise<PagedResult<Booking>> {\n' +
  '    const page = Math.max(1, filters.page ?? 1);\n' +
  '    const pageSize = Math.max(1, filters.pageSize ?? 20);\n' +
  '    const fromIndex = (page - 1) * pageSize;\n' +
  '    const toIndex = fromIndex + pageSize - 1;\n' +
  '\n' +
  '    let query = this.supabase\n' +
  "      .from('staff_today_queue_view')\n" +
  "      .select('*', { count: 'exact' });\n" +
  '\n' +
  '    if (filters.doctorId?.trim()) {\n' +
  "      query = query.eq('doctor_id', filters.doctorId.trim());\n" +
  '    }\n' +
  '\n' +
  '    if (filters.status?.trim()) {\n' +
  "      query = query.eq('booking_status', filters.status.trim());\n" +
  '    }\n' +
  '\n' +
  '    const { data, error, count } = await query\n' +
  "      .order('queue_number', { ascending: true, nullsFirst: false })\n" +
  "      .order('slot_start_time', { ascending: true })\n" +
  '      .range(fromIndex, toIndex);\n' +
  '\n' +
  '    const items = ((data ?? []) as Record<string, unknown>[])\n' +
  '      .map((row) => this.normalizeBooking(mapSupabaseBookingViewRow(row)))\n' +
  '      .filter((booking): booking is Booking => Boolean(booking));\n' +
  '\n' +
  "    return { items, totalCount: count ?? items.length, page, pageSize };\n" +
  '  }',
  'private async fetchSupabaseStaffTodayBookings(\n' +
  '    filters: StaffTodayBookingsFilters = {}\n' +
  '  ): Promise<PagedResult<Booking>> {\n' +
  '    const page = Math.max(1, filters.page ?? 1);\n' +
  '    const pageSize = Math.max(1, filters.pageSize ?? 20);\n' +
  '    const data: any[] = await this.apiService.get<any[]>(\n' +
  "      'bookings/staff/today?page=' + page + '&pageSize=' + pageSize\n" +
  '    ).toPromise() ?? [];\n' +
  '    const items = data\n' +
  '      .map((row) => this.normalizeBooking(mapSupabaseBookingViewRow(row)))\n' +
  '      .filter((booking): booking is Booking => Boolean(booking));\n' +
  "    return { items, totalCount: items.length, page, pageSize };\n" +
  '  }'
);

// 2b. fetchSupabaseStaffBookings (line ~884)
c = c.replace(
  'private async fetchSupabaseStaffBookings(\n' +
  '    filters: StaffBookingsFilterParams = {}\n' +
  '  ): Promise<PagedResult<Booking>> {\n' +
  '    const page = Math.max(1, filters.page ?? 1);\n' +
  '    const pageSize = Math.max(1, filters.pageSize ?? 20);\n' +
  '    const fromIndex = (page - 1) * pageSize;\n' +
  '    const toIndex = fromIndex + pageSize - 1;\n' +
  '\n' +
  '    let query = this.supabase\n' +
  "      .from('patient_bookings_view')\n" +
  "      .select('*', { count: 'exact' });\n" +
  '\n' +
  '    if (filters.doctorId?.trim()) {\n' +
  "      query = query.eq('doctor_id', filters.doctorId.trim());\n" +
  '    }\n' +
  '\n' +
  '    if (filters.status?.trim()) {\n' +
  "      query = query.eq('booking_status', filters.status.trim());\n" +
  '    }\n' +
  '\n' +
  '    if (filters.appointmentDate?.trim()) {\n' +
  "      query = query.eq('appointment_date', filters.appointmentDate.trim());\n" +
  '    }\n' +
  '\n' +
  '    const { data, error, count } = await query\n' +
  "      .order('appointment_date', { ascending: false })\n" +
  "      .order('slot_start_time', { ascending: false })\n" +
  '      .range(fromIndex, toIndex);\n' +
  '\n' +
  '    const items = ((data ?? []) as Record<string, unknown>[])\n' +
  '      .map((row) => this.normalizeBooking(mapSupabaseBookingViewRow(row)))\n' +
  '      .filter((booking): booking is Booking => Boolean(booking));\n' +
  '\n' +
  "    return { items, totalCount: count ?? items.length, page, pageSize };\n" +
  '  }',
  'private async fetchSupabaseStaffBookings(\n' +
  '    filters: StaffBookingsFilterParams = {}\n' +
  '  ): Promise<PagedResult<Booking>> {\n' +
  '    const page = Math.max(1, filters.page ?? 1);\n' +
  '    const pageSize = Math.max(1, filters.pageSize ?? 20);\n' +
  '    const data: any[] = await this.apiService.get<any[]>(\n' +
  "      'bookings/staff/all?page=' + page + '&pageSize=' + pageSize\n" +
  '    ).toPromise() ?? [];\n' +
  '    const items = data\n' +
  '      .map((row) => this.normalizeBooking(mapSupabaseBookingViewRow(row)))\n' +
  '      .filter((booking): booking is Booking => Boolean(booking));\n' +
  "    return { items, totalCount: items.length, page, pageSize };\n" +
  '  }'
);

// 2c. fetchSupabaseStaffForPayment (line ~920)
c = c.replace(
  'private async fetchSupabaseStaffForPayment(page = 1, pageSize = 20): Promise<PagedResult<StaffForPaymentItem>> {\n' +
  '    const currentPage = Math.max(1, page);\n' +
  '    const safePageSize = Math.max(1, pageSize);\n' +
  '    const fromIndex = (currentPage - 1) * safePageSize;\n' +
  '    const toIndex = fromIndex + safePageSize - 1;\n' +
  '\n' +
  "    const { data, error, count } = await this.supabase\n" +
  "      .from('patient_bookings_view')\n" +
  "      .select('*', { count: 'exact' })\n" +
  "      .eq('booking_status', 'Completed')\n" +
  "      .eq('payment_status', 'Unpaid')\n" +
  "      .order('appointment_date', { ascending: false })\n" +
  '      .range(fromIndex, toIndex);\n' +
  '\n' +
  '    const items = ((data ?? []) as Record<string, unknown>[])\n' +
  '      .map((row) => mapPaymentQueueRow(row, this.normalizeBooking),\n' +
  '      );\n' +
  '\n' +
  "    return { items, totalCount: count ?? items.length, page: currentPage, pageSize: safePageSize } as PagedResult<StaffForPaymentItem>;\n" +
  '  }',
  'private async fetchSupabaseStaffForPayment(page = 1, pageSize = 20): Promise<PagedResult<StaffForPaymentItem>> {\n' +
  '    const currentPage = Math.max(1, page);\n' +
  '    const safePageSize = Math.max(1, pageSize);\n' +
  '    const data: any[] = await this.apiService.get<any[]>(\n' +
  "      'bookings/staff/for-payment?page=' + currentPage + '&pageSize=' + safePageSize\n" +
  '    ).toPromise() ?? [];\n' +
  '    const items = data.map((row) => mapPaymentQueueRow(row, this.normalizeBooking));\n' +
  "    return { items, totalCount: items.length, page: currentPage, pageSize: safePageSize } as PagedResult<StaffForPaymentItem>;\n" +
  '  }'
);

// 2d. saveSupabaseConsultationAndComplete (line ~995)
c = c.replace(
  'private async saveSupabaseConsultationAndComplete(\n' +
  '    bookingId: string,\n' +
  '    dto: DoctorCompleteBookingRequest\n' +
  '  ): Promise<Booking | undefined> {\n' +
  '    const finalAmount = dto.isProfessionalFeeWaived ? 0 : dto.finalAmount ?? null;\n' +
  '\n' +
  "    await this.supabase.rpc('save_consultation_record', {\n" +
  '      p_booking_id: bookingId,\n' +
  '      p_chief_complaint: trimOptionalString(dto.diagnosis) ?? null,\n' +
  '      p_general_notes: trimOptionalString(dto.generalNotes ?? dto.notes ?? dto.doctorFeeNotes) ?? null,\n' +
  '      p_vitals: mapVitalsForSupabase(dto.vitalSigns),\n' +
  '      p_soap: mapSoapForSupabase(dto.soap, dto.soapNotes),\n' +
  '      p_diagnoses: mapDiagnosesForSupabase(dto),\n' +
  '      p_prescription: mapPrescriptionForSupabase(dto.prescription),\n' +
  '      p_lab_order: mapLabOrderForSupabase(dto.labOrders),\n' +
  '      p_follow_up: mapFollowUpForSupabase(dto),\n' +
  '    });\n' +
  '\n' +
  '    const booking = await this.fetchSupabaseBookingById(bookingId);\n' +
  '    if (!booking) return undefined;\n' +
  '\n' +
  '    const updatedBooking: Booking = {\n' +
  '      ...booking,\n' +
  "      status: 'Completed',\n" +
  '      finalAmount: finalAmount ?? booking.finalAmount ?? 0,\n' +
  '      amountDue: dto.isProfessionalFeeWaived ? 0 : finalAmount ?? booking.finalAmount ?? 0\n' +
  '    };\n' +
  '\n' +
  '    this.upsertBooking(updatedBooking);\n' +
  '    return updatedBooking;\n' +
  '  }',
  'private async saveSupabaseConsultationAndComplete(\n' +
  '    bookingId: string,\n' +
  '    dto: DoctorCompleteBookingRequest\n' +
  '  ): Promise<Booking | undefined> {\n' +
  '    const finalAmount = dto.isProfessionalFeeWaived ? 0 : dto.finalAmount ?? null;\n' +
  '    await this.apiService.post(\'bookings/\' + bookingId + \'/complete\', dto).toPromise();\n' +
  '    const booking: any = await this.apiService.get(\'bookings/\' + bookingId).toPromise();\n' +
  '    if (!booking) return undefined;\n' +
  '    const updatedBooking: Booking = {\n' +
  '      ...booking,\n' +
  "      status: 'Completed',\n" +
  '      finalAmount: finalAmount ?? booking.finalAmount ?? 0,\n' +
  '      amountDue: dto.isProfessionalFeeWaived ? 0 : finalAmount ?? booking.finalAmount ?? 0\n' +
  '    } as Booking;\n' +
  '    this.upsertBooking(updatedBooking);\n' +
  '    return updatedBooking;\n' +
  '  }'
);

// 2e. saveSupabaseConsultationDraft (line ~1044)
c = c.replace(
  'private async saveSupabaseConsultationDraft(\n' +
  '    bookingId: string,\n' +
  '    dto: ConsultationRecordUpdateRequest\n' +
  '  ): Promise<ConsultationRecordResponse> {\n' +
  "    await this.supabase.rpc('save_consultation_record', {\n" +
  '      p_booking_id: bookingId,\n' +
  '      p_chief_complaint: trimOptionalString(dto.diagnosis) ?? null,\n' +
  '      p_general_notes: trimOptionalString(dto.generalNotes ?? dto.notes ?? dto.doctorFeeNotes) ?? null,\n' +
  '      p_vitals: mapVitalsForSupabase(dto.vitalSigns),\n' +
  '      p_soap: mapSoapForSupabase(dto.soap, dto.soapNotes),\n' +
  '      p_diagnoses: mapDiagnosesForSupabase(dto),\n' +
  '      p_prescription: mapPrescriptionForSupabase(dto.prescription),\n' +
  '      p_lab_order: mapLabOrderForSupabase(dto.labOrders),\n' +
  '      p_follow_up: mapFollowUpForSupabase(dto),\n' +
  '    });\n' +
  '\n' +
  '    return this.fetchSupabaseConsultationRecord(bookingId);\n' +
  '  }',
  'private async saveSupabaseConsultationDraft(\n' +
  '    bookingId: string,\n' +
  '    dto: ConsultationRecordUpdateRequest\n' +
  '  ): Promise<ConsultationRecordResponse> {\n' +
  '    await this.apiService.post(\'bookings/\' + bookingId + \'/consultation-record\', dto).toPromise();\n' +
  '    return this.fetchSupabaseConsultationRecord(bookingId);\n' +
  '  }'
);

// 2f. fetchSupabasePaymentByBookingId (line ~1103)
c = c.replace(
  'private async fetchSupabasePaymentByBookingId(bookingId: string): Promise<Payment | undefined> {\n' +
  "    const byPaymentId = await this.supabase\n" +
  "      .from('payments')\n" +
  "      .select('booking_id')\n" +
  "      .eq('id', id)\n" +
  "      .maybeSingle();",
  'private async fetchSupabasePaymentByBookingId(bookingId: string): Promise<Payment | undefined> {\n' +
  "    const data: any = await this.apiService.get('bookings/' + bookingId + '/payment').toPromise();"
);
// The rest of this method is on subsequent lines - need to also fix the error handling
c = c.replace(
  "    if (byPaymentId.error) {\n" +
  "      throw byPaymentId.error;\n" +
  "    }",
  ""
);

// 2g. fetchSupabaseMyBookingsPage (line ~1237)
c = c.replace(
  'private async fetchSupabaseMyBookingsPage(page = 1, pageSize = 20): Promise<MyBookingsPageResult> {\n' +
  '    const safePage = Math.max(1, page);\n' +
  '    const safePageSize = Math.max(1, pageSize);\n' +
  '    const fromIndex = (safePage - 1) * safePageSize;\n' +
  '    const toIndex = safePage * safePageSize - 1;\n' +
  '\n' +
  "    const { data, error, count } = await this.supabase\n" +
  "      .from('patient_bookings_view')\n" +
  "      .select('*', { count: 'exact' })\n" +
  "      .order('appointment_date', { ascending: false })\n" +
  "      .order('slot_start_time', { ascending: false })\n" +
  '      .range(fromIndex, toIndex);\n' +
  '\n' +
  '    if (error) throw error;\n' +
  '\n' +
  '    const items = ((data ?? []) as Record<string, unknown>[])\n' +
  '      .map((row) => this.normalizeBooking(mapSupabaseBookingViewRow(row)))\n' +
  '      .filter((booking): booking is Booking => Boolean(booking));\n' +
  '\n' +
  "    return { items, totalCount: count ?? items.length, page: safePage, pageSize: safePageSize };\n" +
  '  }',
  'private async fetchSupabaseMyBookingsPage(page = 1, pageSize = 20): Promise<MyBookingsPageResult> {\n' +
  '    const safePage = Math.max(1, page);\n' +
  '    const safePageSize = Math.max(1, pageSize);\n' +
  '    const data: any[] = await this.apiService.get<any[]>(\n' +
  "      'bookings?page=' + safePage + '&pageSize=' + safePageSize\n" +
  '    ).toPromise() ?? [];\n' +
  '    const items = data\n' +
  '      .map((row) => this.normalizeBooking(mapSupabaseBookingViewRow(row)))\n' +
  '      .filter((booking): booking is Booking => Boolean(booking));\n' +
  "    return { items, totalCount: items.length, page: safePage, pageSize: safePageSize };\n" +
  '  }'
);

// 2h. fetchSupabaseBookingById (line ~1262)
c = c.replace(
  'private async fetchSupabaseBookingById(id: string): Promise<Booking | undefined> {\n' +
  "    const data: any = await this.supabase\n" +
  "      .from('patient_bookings_view')\n" +
  "      .select('*')\n" +
  "      .eq('booking_id', id)\n" +
  "      .maybeSingle();\n" +
  '\n' +
  '    if (!data) return undefined;\n' +
  '    return data ? this.normalizeBooking(mapSupabaseBookingViewRow(data as Record<string, unknown>)) : undefined;\n' +
  '  }',
  'private async fetchSupabaseBookingById(id: string): Promise<Booking | undefined> {\n' +
  "    const data: any = await this.apiService.get('bookings/' + id).toPromise();\n" +
  '    if (!data) return undefined;\n' +
  '    return this.normalizeBooking(mapSupabaseBookingViewRow(data as Record<string, unknown>));\n' +
  '  }'
);

// 2i. fetchSupabaseBookings (line ~1292)
c = c.replace(
  'private async fetchSupabaseBookings(filters?: BookingFilters): Promise<Booking[]> {\n' +
  '    let query = this.supabase\n' +
  "      .from('patient_bookings_view')\n" +
  "      .select('*')\n" +
  "      .order('appointment_date', { ascending: false })\n" +
  "      .order('slot_start_time', { ascending: false })\n" +
  '\n' +
  '    if (filters?.doctorId) {\n' +
  "      query = query.eq('doctor_id', filters.doctorId);\n" +
  '    }\n' +
  '\n' +
  '    if (filters?.patientId) {\n' +
  "      query = query.eq('patient_id', filters.patientId);\n" +
  '    }\n' +
  '\n' +
  '    if (filters?.status) {\n' +
  "      query = query.eq('booking_status', filters.status);\n" +
  '    }\n' +
  '\n' +
  '    if (filters?.appointmentDate) {\n' +
  "      query = query.eq('appointment_date', filters.appointmentDate);\n" +
  '    }\n' +
  '\n' +
  '    if (filters?.fromDate) {\n' +
  "      query = query.gte('appointment_date', filters.fromDate);\n" +
  '    }\n' +
  '\n' +
  '    if (filters?.toDate) {\n' +
  "      query = query.lte('appointment_date', filters.toDate);\n" +
  '    }\n' +
  '\n' +
  '    const { data, error } = await query;\n' +
  '\n' +
  '    if (error) {\n' +
  '      throw error;\n' +
  '    }\n' +
  '\n' +
  '    return ((data ?? []) as Record<string, unknown>[]).map((row) =>\n' +
  '      this.normalizeBooking(mapSupabaseBookingViewRow(row))\n' +
  '    );\n' +
  '  }',
  'private async fetchSupabaseBookings(filters?: BookingFilters): Promise<Booking[]> {\n' +
  "    const data: any[] = await this.apiService.get<any[]>('bookings').toPromise() ?? [];\n" +
  '    return data\n' +
  '      .map((row) => this.normalizeBooking(mapSupabaseBookingViewRow(row)))\n' +
  '      .filter((b): b is Booking => Boolean(b));\n' +
  '  }'
);

// ============================================================
// STEP 3: Remove Supabase helper functions from end of file
// ============================================================

// Remove mapVitalsForSupabase
c = c.replace(
  /function mapVitalsForSupabase[\s\S]*?(?=\nfunction map)/,
  ''
);
// Remove mapSoapForSupabase - the functions are sequential, let me remove from 'function mapVitals' to 'function normalizeTimeForSupabase'
// Find the range and remove it
const startMarker = 'function mapVitalsForSupabase';
const endMarker = 'function normalizeTimeForSupabase';
const startIdx = c.indexOf(startMarker);
const endIdx = c.indexOf(endMarker);
if (startIdx !== -1 && endIdx !== -1) {
  // Find the end of normalizeTimeForSupabase function
  const afterEnd = c.indexOf('\n\n', endIdx + endMarker.length);
  const removeEnd = afterEnd !== -1 ? afterEnd + 2 : c.length;
  const removed = c.substring(startIdx, removeEnd);
  c = c.substring(0, startIdx) + c.substring(removeEnd);
  console.log(`Removed Supabase helper functions (${removed.split('\n').length} lines)`);
}

// ============================================================
// STEP 4: Remove remaining Supabase error messages in string literals
// ============================================================
c = c.replace(/from Supabase\./g, 'from API.');
c = c.replace(/to Supabase\./g, 'to API.');
c = c.replace(/in Supabase\./g, 'in API.');
c = c.replace(/via Supabase\./g, 'via API.');
c = c.replace(/via Supabase /g, 'via API ');
c = c.replace(/Supabase-first/g, 'API-first');
c = c.replace(/Supabase Storage/g, 'API');
c = c.replace(/Supabase RPC/g, 'API call');
c = c.replace(/no Supabase RPC/g, 'no API endpoint');
c = c.replace(/Supabase /g, 'API ');
c = c.replace(/Supabase/g, 'Supabase'); // safety: already handled

// Remove HttpParams import if no longer used
// (keeping it for now, safe to keep)

// ============================================================
// STEP 5: Remove unused Supabase-related imports from bottom functions
// The mapSupabase*Row functions at bottom are still used by normalizeBooking
// Keep those but rename from 'mapSupabaseBookingViewRow' to 'mapBookingViewRow'
// ============================================================
c = c.replace(/mapSupabaseBookingViewRow/g, 'mapBookingViewRow');
c = c.replace(/mapSupabasePaymentRow/g, 'mapPaymentRow');
c = c.replace(/mapSupabaseConsultationRecordRow/g, 'mapConsultationRecordRow');

// ============================================================
// STEP 6: Clean up fetchSupabasePaymentByBookingId remaining issues
// ============================================================
// Fix the supabase helper references still in fetchSupabaseReceipt
c = c.replace(/mapSupabasePaymentRow/g, 'mapPaymentRow');

// Count after
const afterFrom = (c.match(/\.from\(/g) || []).length;
const afterRpc = (c.match(/\.rpc\(/g) || []).length;
const afterSupabase = (c.match(/this\.supabase/g) || []).length;
const afterSupabaseStr = (c.match(/Supabase/g) || []).length;
console.log(`After: ${afterFrom} .from(), ${afterRpc} .rpc(), ${afterSupabase} this.supabase, ${afterSupabaseStr} 'Supabase' strings`);

fs.writeFileSync(f, c);
console.log('Done - comprehensive Supabase removal complete');

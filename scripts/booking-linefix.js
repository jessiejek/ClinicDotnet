const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/booking.service.ts';
let lines = fs.readFileSync(f, 'utf8').split('\n');

function findMethodStart(name, lines) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('private async ' + name)) return i;
  }
  return -1;
}

function findMethodEnd(start, lines) {
  let depth = 0;
  for (let i = start; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.endsWith('{') || trimmed.endsWith('{')) depth++;
    if (trimmed === '}') depth--;
    if (depth === 0 && i > start) return i;
  }
  return lines.length - 1;
}

function replaceMethod(name, newBody, lines) {
  const start = findMethodStart(name, lines);
  if (start === -1) { console.log('NOT FOUND: ' + name); return false; }
  const end = findMethodEnd(start, lines);
  const indent = lines[start].match(/^\s*/)[0];
  const body = newBody.split('\n').map((l, i) => i === 0 ? l : indent + l).join('\n');
  lines.splice(start, end - start + 1, body);
  console.log('REPLACED: ' + name + ' (lines ' + (start+1) + '-' + (end+1) + ')');
  return true;
}

// 1. fetchSupabaseStaffTodayBookings
replaceMethod('fetchSupabaseStaffTodayBookings',
  `private async fetchSupabaseStaffTodayBookings(
    filters: StaffTodayBookingsFilters = {}
  ): Promise<PagedResult<Booking>> {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.max(1, filters.pageSize ?? 20);
    const data: any[] = await this.apiService.get<any[]>('bookings/staff/today?page=' + page + '&pageSize=' + pageSize).toPromise() ?? [];
    const items = data
      .map((row: Record<string, unknown>) => this.normalizeBooking(mapSupabaseBookingViewRow(row)))
      .filter((booking): booking is Booking => Boolean(booking));
    return { items, totalCount: items.length, page, pageSize };
  }`,
  lines
);

// 2. fetchSupabaseStaffBookings
replaceMethod('fetchSupabaseStaffBookings',
  `private async fetchSupabaseStaffBookings(
    filters: StaffBookingsFilterParams = {}
  ): Promise<PagedResult<Booking>> {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.max(1, filters.pageSize ?? 20);
    const data: any[] = await this.apiService.get<any[]>('bookings/staff/all?page=' + page + '&pageSize=' + pageSize).toPromise() ?? [];
    const items = data
      .map((row: Record<string, unknown>) => this.normalizeBooking(mapSupabaseBookingViewRow(row)))
      .filter((booking): booking is Booking => Boolean(booking));
    return { items, totalCount: items.length, page, pageSize };
  }`,
  lines
);

// 3. fetchSupabaseStaffForPayment
replaceMethod('fetchSupabaseStaffForPayment',
  `private async fetchSupabaseStaffForPayment(page = 1, pageSize = 20): Promise<PagedResult<StaffForPaymentItem>> {
    const currentPage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);
    const data: any[] = await this.apiService.get<any[]>('bookings/staff/for-payment?page=' + currentPage + '&pageSize=' + safePageSize).toPromise() ?? [];
    const items = data.map((row: Record<string, unknown>) => mapPaymentQueueRow(row, this.normalizeBooking));
    return { items, totalCount: items.length, page: currentPage, pageSize: safePageSize } as PagedResult<StaffForPaymentItem>;
  }`,
  lines
);

// 4. saveSupabaseConsultationAndComplete
replaceMethod('saveSupabaseConsultationAndComplete',
  `private async saveSupabaseConsultationAndComplete(
    bookingId: string,
    dto: DoctorCompleteBookingRequest
  ): Promise<Booking | undefined> {
    const finalAmount = dto.isProfessionalFeeWaived ? 0 : dto.finalAmount ?? null;
    await this.apiService.post('bookings/' + bookingId + '/complete', dto).toPromise();
    const booking: any = await this.apiService.get('bookings/' + bookingId).toPromise();
    if (!booking) return undefined;
    const updatedBooking: Booking = {
      ...booking,
      status: 'Completed',
      finalAmount: finalAmount ?? booking.finalAmount ?? 0,
      amountDue: dto.isProfessionalFeeWaived ? 0 : finalAmount ?? booking.finalAmount ?? 0
    } as Booking;
    this.upsertBooking(updatedBooking);
    return updatedBooking;
  }`,
  lines
);

// 5. saveSupabaseConsultationDraft
replaceMethod('saveSupabaseConsultationDraft',
  `private async saveSupabaseConsultationDraft(
    bookingId: string,
    dto: ConsultationRecordUpdateRequest
  ): Promise<ConsultationRecordResponse> {
    await this.apiService.post('bookings/' + bookingId + '/consultation-record', dto).toPromise();
    return this.fetchSupabaseConsultationRecord(bookingId);
  }`,
  lines
);

// 6. fetchSupabasePaymentByBookingId
replaceMethod('resolveBookingIdForPayment',
  `private async resolveBookingIdForPayment(id: string): Promise<string> {
    const cached = this.snapshot.find((booking) => booking.id === id || booking.payment?.id === id);
    if (cached) return cached.id;
    const data: any = await this.apiService.get('bookings/' + id + '/payment').toPromise();
    if (data?.bookingId || data?.booking_id) return data.bookingId ?? data.booking_id;
    const fetched = await this.apiService.get('bookings/' + id).toPromise();
    if (fetched?.id) return fetched.id;
    throw new Error('Booking not found for payment: ' + id);
  }`,
  lines
);

// 7. fetchSupabaseMyBookingsPage
replaceMethod('fetchSupabaseMyBookingsPage',
  `private async fetchSupabaseMyBookingsPage(page = 1, pageSize = 20): Promise<MyBookingsPageResult> {
    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);
    const data: any[] = await this.apiService.get<any[]>('bookings?page=' + safePage + '&pageSize=' + safePageSize).toPromise() ?? [];
    const items = data
      .map((row: Record<string, unknown>) => this.normalizeBooking(mapSupabaseBookingViewRow(row)))
      .filter((booking): booking is Booking => Boolean(booking));
    return { items, totalCount: items.length, page: safePage, pageSize: safePageSize };
  }`,
  lines
);

// 8. fetchSupabaseBookingById
replaceMethod('fetchSupabaseBookingById',
  `private async fetchSupabaseBookingById(id: string): Promise<Booking | undefined> {
    const data: any = await this.apiService.get('bookings/' + id).toPromise();
    if (!data) return undefined;
    return this.normalizeBooking(mapSupabaseBookingViewRow(data as Record<string, unknown>));
  }`,
  lines
);

// 9. fetchSupabaseBookings
replaceMethod('fetchSupabaseBookings',
  `private async fetchSupabaseBookings(filters?: BookingFilters): Promise<Booking[]> {
    const data: any[] = await this.apiService.get<any[]>('bookings').toPromise() ?? [];
    return data
      .map((row: Record<string, unknown>) => this.normalizeBooking(mapSupabaseBookingViewRow(row)))
      .filter((b): b is Booking => Boolean(b));
  }`,
  lines
);

fs.writeFileSync(f, lines.join('\n'));
console.log('Done - all 9 methods replaced');

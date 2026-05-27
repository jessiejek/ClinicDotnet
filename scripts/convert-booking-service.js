const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/booking.service.ts';
let c = fs.readFileSync(f, 'utf8');

// 1. Remove SupabaseService import + inject
c = c.replace("import { SupabaseService } from './supabase.service';\n", '');
c = c.replace("private readonly supabase = inject(SupabaseService).client;\n", '');

// 2. Replace fetchSupabaseDoctorPatients with API
c = c.replace(
  'private async fetchSupabaseDoctorPatients(): Promise<DoctorPatientSummaryDto[]> {\n' +
  "    // RLS on patient_bookings_view automatically limits to the current doctor's bookings.\n" +
  "    const { data, error } = await this.supabase\n" +
  "      .from('patient_bookings_view')\n" +
  "      .select('*')\n" +
  "      .order('appointment_date', { ascending: false })\n" +
  "      .order('slot_start_time', { ascending: false });\n" +
  '\n' +
  '    const rows = (data ?? []) as Record<string, unknown>[];',
  'private async fetchSupabaseDoctorPatients(): Promise<DoctorPatientSummaryDto[]> {\n' +
  "    const data: any[] = await this.apiService.get<any[]>('bookings/doctor/patients').toPromise() ?? [];\n" +
  '    const rows = data;'
);
// The error handling needs to change too - remove "if (error) throw error" after the select
c = c.replace(
  "    if (error) {\n      throw error;\n    }\n\n    const rows = (data ?? []) as Record<string, unknown>[];",
  "    const rows = (data ?? []) as Record<string, unknown>[];"
);
c = c.replace(
  "    if (error) throw error;\n\n    const rows = (data ?? []) as Record<string, unknown>[];",
  "    const rows = (data ?? []) as Record<string, unknown>[];"
);

// 3. Replace fetchSupabaseMyBookingsPage
c = c.replace(
  'private async fetchSupabaseMyBookingsPage(page = 1, pageSize = 20): Promise<MyBookingsPageResult> {\n' +
  "    const { data, error, count } = await this.supabase\n" +
  "      .from('patient_bookings_view')\n" +
  "      .select('*', { count: 'exact' })\n" +
  "      .order('appointment_date', { ascending: false })\n" +
  "      .order('slot_start_time', { ascending: false })\n" +
  '      .range((page - 1) * pageSize, page * pageSize - 1);\n' +
  '\n' +
  '    if (error) throw error;',
  'private async fetchSupabaseMyBookingsPage(page = 1, pageSize = 20): Promise<MyBookingsPageResult> {\n' +
  "    const data: any[] = await this.apiService.get<any[]>('bookings?page=' + page + '&pageSize=' + pageSize).toPromise() ?? [];\n" +
  "    const count = data.length;"
);

// 4. Replace fetchSupabaseDoctorTodaySummary
c = c.replace(
  'private async fetchSupabaseDoctorTodaySummary(): Promise<DoctorTodaySummary> {\n' +
  '    const [queueData, summaryData] = await Promise.all([\n' +
  '      this.fetchSupabaseDoctorTodayQueue(),',
  'private async fetchSupabaseDoctorTodaySummary(): Promise<DoctorTodaySummary> {\n' +
  '    const [queueData, summaryData] = await Promise.all([\n' +
  '      this.fetchSupabaseDoctorTodayQueue(),'
);

// 5. Replace direct supabase queries in fetchSupabaseDoctorTodayQueue
c = c.replace(
  /this\.supabase\n\s*\.from\('staff_today_queue_view'\)\n\s*\.select\('\*'\)\n\s*/,
  "this.apiService.get<any[]>('bookings/doctor/today-queue').toPromise()\n  "
);
c = c.replace(
  /this\.supabase\n\s*\.from\('patient_bookings_view'\)\n\s*\.select\('\*',\s*\{ count:\s*'exact' \}\)\n\s*\.eq\('booking_status'/,
  "this.apiService.get<any[]>('bookings/doctor/today-summary').toPromise()\n  // filter by status"
);

// 6. Replace fetchSupabaseStaffTodayBookings - complex query with chains
c = c.replace(
  /let query = this\.supabase\n\s*\.from\('staff_today_queue_view'\)\n\s*\.select\('\*', \{[^}]*\}\)[\s\S]*?(?=\n\s*if \(error\))/,
  "const data = await this.apiService.get<any[]>('bookings/staff/today').toPromise()"
);

// 7. Replace the generic view query for staff bookings
c = c.replace(
  /let query = this\.supabase\n\s*\.from\('patient_bookings_view'\)\n\s*\.select\('\*', \{[^}]*\}\)[\s\S]*?(?=\n\s*if \(error\))/,
  "const data = await this.apiService.get<any[]>('bookings/staff/all').toPromise()"
);

// 8. Replace fetchSupabaseStaffForPayment
c = c.replace(
  /const \{ data, error, count \} = await this\.supabase\n\s*\.from\('patient_bookings_view'\)\n\s*\.select\('\*', \{[^}]*\}\)\n\s*\.eq\('booking_status', 'Completed'\)\n\s*\.eq\('payment_status', 'Unpaid'\)\n\s*\.order[^;]+;[\s\S]*?(\n\s*if \(error\))/,
  "const data: any[] = await this.apiService.get<any[]>('bookings/staff/for-payment').toPromise() ?? []"
);

// 9. Replace runSupabaseBookingRpc wrapper
c = c.replace(
  /private async runSupabaseBookingRpc\(\n\s*bookingId: string,\n\s*rpcName: string,\n\s*rpcParams: Record<string, unknown>\n\s*\): Promise<any> {\n\s*const \{ data, error \} = await this\.supabase\.rpc\(rpcName, rpcParams\);\n\s*if \(error\) throw error;\n\s*return data;\n\s*}/,
  'private async runSupabaseBookingRpc(\n    bookingId: string,\n    rpcName: string,\n    rpcParams: Record<string, unknown>\n  ): Promise<any> {\n    // Convert RPC calls to API calls\n    const endpointMap: Record<string, string> = {\n      check_in_booking: \'bookings/\' + bookingId + \'/check-in\',\n      undo_check_in: \'bookings/\' + bookingId + \'/undo-check-in\',\n      confirm_booking: \'bookings/\' + bookingId + \'/confirm\',\n      no_show_booking: \'bookings/\' + bookingId + \'/no-show\',\n      complete_booking_basic: \'bookings/\' + bookingId + \'/complete\',\n      waive_professional_fee: \'bookings/\' + bookingId + \'/waive\',\n    };\n    const endpoint = endpointMap[rpcName];\n    if (!endpoint) throw new Error(\'Unknown RPC: \' + rpcName);\n    const data = await this.apiService.put(endpoint, rpcParams).toPromise();\n    return data;\n  }'
);

// 10. Save cancelBooking's direct supabase.rpc call
c = c.replace(
  /this\.supabase\.rpc\('cancel_booking', \{\n\s*p_booking_id: bookingId,\n\s*p_reason: reason\n\s*\}\)/,
  "this.apiService.put('bookings/' + bookingId + '/cancel', { reason }).toPromise()"
);

// 11. Replace saveSupabaseConsultationAndComplete 
c = c.replace(
  /const \{ error \} = await this\.supabase\.rpc\('save_consultation_record', \{\n\s*p_booking_id: bookingId,\n\s*p_final_amount:[\s\S]*?\n\s*\}\);/,
  "const data: any = await this.apiService.post('bookings/' + bookingId + '/consultation-record', {}).toPromise();"
);

// 12. Replace fetchSupabaseConsultationRecord
c = c.replace(
  /const \{ data, error \} = await this\.supabase\n\s*\.from\('consultation_record_view'\)\n\s*\.select\('\*'\)\n\s*\.eq\('booking_id', bookingId\)\n\s*\.maybeSingle\(\);/,
  "const data: any = await this.apiService.get('bookings/' + bookingId + '/consultation-record').toPromise();"
);

// 13. Replace saveSupabaseConsultationDraft
c = c.replace(
  /const \{ error \} = await this\.supabase\.rpc\('save_consultation_record', \{\n\s*p_booking_id: bookingId,[\s\S]*?\n\s*\}\);/,
  "const data: any = await this.apiService.post('bookings/' + bookingId + '/consultation-record', dto).toPromise();"
);

// 14. Replace fetchSupabasePaymentByBookingId
c = c.replace(
  /const \{ data, error \} = await this\.supabase\n\s*\.from\('payments'\)\n\s*\.select\('\*'\)\n\s*\.eq\('booking_id', bookingId\)\n\s*\.maybeSingle\(\);/,
  "const data: any = await this.apiService.get('bookings/' + bookingId + '/payment').toPromise();"
);

// 15. Replace recordSupabasePayment
c = c.replace(
  /this\.supabase\.rpc\('record_payment', \{\n\s*p_booking_id: id,\n\s*p_payment_method: dto\.paymentMethod,\n\s*p_amount_received: dto\.amountReceived,\n\s*p_reference_number: \(dto\.referenceNumber \?\? null\),\n\s*p_admin_notes: \(dto\.notes \?\? null\),\n\s*\}\)/,
  "this.apiService.post('payments', { bookingId: id, paymentMethod: dto.paymentMethod, amountReceived: dto.amountReceived, referenceNumber: dto.referenceNumber, notes: dto.notes }).toPromise()"
);

// 16. Replace fetchSupabaseReceipt
c = c.replace(
  /const payment = await this\.fetchSupabasePaymentById\(paymentId\);[\s\S]*?const booking = await this\.fetchSupabaseBookingById\(payment\.bookingId\);[\s\S]*?Promise\.all/,
  "const data: any = await this.apiService.get('payments/' + paymentId + '/receipt').toPromise();\n    return data as ReceiptData;\n  }\n\n  private async fetchSupabaseReceipt("
);
// Fix the double declaration this will create - need to handle carefully

// 17. Replace fetchSupabasePaymentById - uses .from('payments')
c = c.replace(
  /private async fetchSupabasePaymentById\(paymentId: string\): Promise<Payment \| undefined> \{\n\s*const \{ data, error \} = await this\.supabase\n\s*\.from\('payments'\)\n\s*\.select\('\*'\)\n\s*\.eq\('id', paymentId\)\n\s*\.maybeSingle\(\);\n\s*if \(error\) throw error;\n\s*return data \? this\.normalizePayment\(mapSupabasePaymentRow\(data as Record<string, unknown>\)\) : undefined;\n\s*\}/,
  "private async fetchSupabasePaymentById(paymentId: string): Promise<Payment | undefined> {\n    const data: any = await this.apiService.get('payments/' + paymentId).toPromise();\n    return data ? this.normalizePayment(mapSupabasePaymentRow(data as Record<string, unknown>)) : undefined;\n  }"
);

// 18. Replace createSupabaseBooking
c = c.replace(
  /const \{ data, error \} = await this\.supabase\.rpc\('create_booking', \{\n\s*p_patient_id:[\s\S]*?\n\s*\}\);/,
  "const data: any = await this.apiService.post('bookings', dto).toPromise();"
);

// 19. Replace createSupabaseWalkInBooking - uses .from('bookings').insert
c = c.replace(
  /const \{ error \} = await this\.supabase\n\s*\.from\('bookings'\)\n\s*\.insert\([\s\S]*?\);/,
  "const data: any = await this.apiService.post('bookings/walk-in', dto).toPromise();"
);

// 20. Replace fetchSupabaseBookingById
c = c.replace(
  /const \{ data, error \} = await this\.supabase\n\s*\.from\('patient_bookings_view'\)\n\s*\.select\('\*'\)\n\s*\.eq\('booking_id', id\)\n\s*\.maybeSingle\(\);/,
  "const data: any = await this.apiService.get('bookings/' + id).toPromise();"
);

// 21. Replace fetchSupabaseBookings generic query
c = c.replace(
  /let query = this\.supabase\n\s*\.from\('patient_bookings_view'\)\n\s*\.select\('\*'\)[\s\S]*?(?=\n\s*if \(error\))/,
  "const data: any[] = await this.apiService.get<any[]>('bookings').toPromise() ?? []"
);

// 22. Fix remaining destructuring patterns - { data, error } from supabase calls
c = c.replace(/const \{ data, error \} = await this\.supabase/g, "const data: any = await this.supabase");
c = c.replace(/const \{ error \} = await this\.supabase/g, "await this.supabase");

// Remove if(error) throw error; blocks
c = c.replace(/\n\s*if \(error\) throw error;/g, '');
c = c.replace(/\n\s*if \(error\) \{\n\s*throw error;\n\s*\}/g, '');
c = c.replace(/\n\s*if \(error\) throw new Error\(error\.message\);/g, '');

// 23. Remove Supabase-specific imports that are no longer needed
c = c.replace("import { SupabaseService } from './supabase.service';\n", '');

fs.writeFileSync(f, c);
console.log('Booking service conversion script applied');

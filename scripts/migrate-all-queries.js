const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'src', 'app', 'core', 'services', 'booking.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');
let count = 0;

function replaceLines(fromLines, toLines) {
  const from = fromLines.join('\n');
  const to = toLines.join('\n');
  const idx = content.indexOf(from);
  if (idx !== -1) {
    content = content.replace(from, to);
    count++;
    console.log('✅ ' + toLines[0].substring(0, 70));
    return true;
  } else {
    console.log('⚠️  ' + fromLines[0].substring(0, 60));
    return false;
  }
}

// 1. fetchSupabaseDoctorPatients
replaceLines(
  [
    "    const { data, error } = await this.supabase",
    "      .from('patient_bookings_view')",
    "      .select('id, patient_id, full_name, patient_code, appointment_date, slot_start_time, status, queue_number, booking_id')",
    "      .eq('doctor_id', doctorId)",
    "      .order('appointment_date', { ascending: false });",
  ],
  [
    "    const data = await this.apiService.get<any[]>('bookings/doctor/patients').toPromise();",
  ]
);

// 2. fetchSupabaseDoctorTodayQueue
replaceLines(
  [
    "    const { data, error } = await this.supabase",
    "      .from('doctor_today_queue_view')",
    "      .select('*')",
    "      .order('queue_number', { ascending: true, nullsFirst: false })",
    "      .order('slot_start_time', { ascending: true });",
  ],
  [
    "    const data = await this.apiService.get<any[]>('bookings/doctor/today').toPromise();",
  ]
);

// 3. fetchSupabaseBookingById
replaceLines(
  [
    "    const { data, error } = await this.supabase",
    "      .from('patient_bookings_view')",
    "      .select('*')",
    "      .eq('id', id)",
    "      .maybeSingle();",
  ],
  [
    "    const data = await this.apiService.get<any>('bookings/' + id).toPromise();",
  ]
);

// 4. fetchSupabaseMyBookingsPage  
replaceLines(
  [
    "    const { data, error, count } = await this.supabase",
    "      .from('patient_bookings_view')",
    "      .select('*', { count: 'exact' })",
    "      .eq('patient_id', userId)",
    "      .order('created_at', { ascending: false })",
    "      .range((page - 1) * normalizedPageSize, page * normalizedPageSize - 1);",
  ],
  [
    "    const result = await this.apiService.get<any>('bookings/me?page=' + page + '&pageSize=' + pageSize).toPromise();",
    "    const data = result?.items ?? result ?? [];",
    "    const count = result?.totalCount ?? data.length;",
  ]
);

// 5. fetchSupabasePaymentByBookingId
replaceLines(
  [
    "    const { data, error } = await this.supabase",
    "      .from('payments')",
    "      .select('*')",
    "      .eq('booking_id', bookingId)",
    "      .maybeSingle();",
  ],
  [
    "    const data = await this.apiService.get<any>('payments/booking/' + bookingId).toPromise();",
  ]
);

// 6. fetchSupabasePaymentById
replaceLines(
  [
    "    const { data, error } = await this.supabase",
    "      .from('payments')",
    "      .select('*')",
    "      .eq('id', paymentId)",
    "      .maybeSingle();",
  ],
  [
    "    const data = await this.apiService.get<any>('payments/' + paymentId + '/receipt').toPromise();",
  ]
);

// 7. fetchSupabaseStaffForPayment
replaceLines(
  [
    "    const { data, error, count } = await this.supabase",
    "      .from('staff_for_payment_view')",
  ],
  [
    "    const apiResult = await this.apiService.get<any>('bookings/staff/for-payment?page=' + currentPage + '&pageSize=' + safePageSize).toPromise();",
    "    const data = apiResult?.items ?? [];",
    "    const count = apiResult?.totalCount ?? data.length;",
  ]
);

// 8. fetchSupabaseConsultationRecord
replaceLines(
  [
    "    const { data, error } = await this.supabase",
    "      .from('consultation_record_view')",
    "      .select('*')",
    "      .eq('booking_id', bookingId)",
    "      .maybeSingle();",
  ],
  [
    "    const data = await this.apiService.get<any>('bookings/' + bookingId + '/consultation-record').toPromise();",
  ]
);

// Remove leftover if (error) patterns that are now orphaned
content = content.replace(/\n\s+if \(error\) \{\n\s+throw error;\n\s+\}/g, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\nDone. ${count} replacements made.`);

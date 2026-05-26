const fs = require('fs');
const path = require('path');
const f = path.join(__dirname, '..', 'src', 'app', 'core', 'services', 'booking.service.ts');
let c = fs.readFileSync(f, 'utf8');

// Fix line 1203: params is not defined — replace with inline params from original
const oldRpc = `    const bookResult = await this.apiService.post<any>('bookings', params)

    const createdRow = Array.isArray(data) && data.length > 0 && isRecord(data[0]) ? data[0] : undefined;`;

const newApi = `    const bookResult = await this.apiService.post<any>('bookings', {
      p_doctor_id: trimRequiredString(dto.doctorId),
      p_service_ids: resolvedServiceIds,
      p_appointment_date: trimRequiredString(dto.appointmentDate),
      p_slot_start_time: normalizeTimeForSupabase(dto.slotStartTime),
      p_slot_end_time: normalizeTimeForSupabase(dto.slotEndTime),
      p_patient_id: trimOptionalString(dto.patientId) ?? null,
      p_payment_mode: null,
      p_notes: null
    }).toPromise();

    const createdRow = isRecord(bookResult) ? bookResult : Array.isArray(bookResult) && bookResult.length > 0 && isRecord(bookResult[0]) ? bookResult[0] : undefined;`;

if (c.includes('params)')) {
    c = c.replace(oldRpc, newApi);
    console.log('✅ Fixed createSupabaseBooking method');
}

// Fix fetchSupabaseBookingById — different column name 'booking_id' not 'id'
const oldFetch = `    const { data, error } = await this.supabase
      .from('patient_bookings_view')
      .select('*')
      .eq('booking_id', id)
      .maybeSingle();`;

const newFetch = `    const data = await this.apiService.get<any>('bookings/' + id).toPromise();`;

if (c.includes(oldFetch)) {
    c = c.replace(oldFetch, newFetch);
    console.log('✅ Fixed fetchSupabaseBookingById');
}

// Fix fetchSupabaseMyBookingsPage — still has old Supabase pattern
const oldMyBook = `    const { data, error, count } = await this.supabase
      .from('patient_bookings_view')
      .select('*', { count: 'exact' })
      .eq('patient_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * normalizedPageSize, page * normalizedPageSize - 1);`;

const newMyBook = `    const result = await this.apiService.get<any>('bookings/me?page=' + page + '&pageSize=' + pageSize).toPromise();
    const data = result?.items ?? result ?? [];
    const count = result?.totalCount ?? data.length;`;

if (c.includes(oldMyBook)) {
    c = c.replace(oldMyBook, newMyBook);
    console.log('✅ Fixed fetchSupabaseMyBookingsPage');
}

// Remove orphaned if (error) patterns
c = c.replace(/\n\s+if \(error\) \{\n\s+throw error;\n\s+\}/g, '');

// Fix any 'data' references that were from old Supabase destructuring but now need to reference the API result
// Only fix cases where 'data' is used as a variable but wasn't declared

// Check for 'const result = await this.supabase' - this was from bad previous replacements
c = c.replace(/const result = await this\.supabase[\s\S]{0,500}?\.maybeSingle\(\);/g, (match) => {
    console.log('⚠️ Found orphaned this.supabase reference');
    return match;
});

fs.writeFileSync(f, c);
console.log('Done');

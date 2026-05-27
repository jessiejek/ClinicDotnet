const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/booking.service.ts';
let c = fs.readFileSync(f, 'utf8');

// Ensure we're on LF
c = c.replace(/\r\n/g, '\n');

// 1. Global replace all this.supabase -> this.apiService
c = c.split('this.supabase').join('this.apiService');

// 2. Remove SupabaseService import + inject
c = c.replace(/import \{ SupabaseService \} from '\.\/supabase\.service';\n/, '');
c = c.replace(/private readonly supabase = inject\(SupabaseService\)\.client;\n    /, '');

// 3. Replace all .from('x').select('y') chains with direct API calls
// 3a. staff_today_queue_view
c = c.replace(
  "this.apiService\n      .from('staff_today_queue_view')\n      .select('*', { count: 'exact' });",
  "this.apiService.get<any[]>('bookings/staff/today').toPromise();"
);

// 3b. patient_bookings_view with count
c = c.replace(
  "this.apiService\n      .from('patient_bookings_view')\n      .select('*', { count: 'exact' });",
  "this.apiService.get<any[]>('bookings/staff/all').toPromise();"
);

// 3c. patient_bookings_view with count + eq for Completed/Unpaid
c = c.replace(
  "this.apiService\n      .from('patient_bookings_view')\n      .select('*', { count: 'exact' })\n      .eq('booking_status', 'Completed')\n      .eq('payment_status', 'Unpaid')",
  "this.apiService.get<any[]>('bookings/staff/for-payment').toPromise()"
);

// 3d. patient_bookings_view with count + order + range (my bookings)
c = c.replace(
  "this.apiService\n      .from('patient_bookings_view')\n      .select('*', { count: 'exact' })\n      .order('appointment_date', { ascending: false })\n      .order('slot_start_time', { ascending: false })\n      .range(fromIndex, toIndex);",
  "this.apiService.get<any[]>('bookings?page=' + safePage + '&pageSize=' + safePageSize).toPromise();"
);

// 3e. patient_bookings_view select * eq booking_id
c = c.replace(
  "this.apiService\n      .from('patient_bookings_view')\n      .select('*')\n      .eq('booking_id', id)\n      .maybeSingle();",
  "this.apiService.get('bookings/' + id).toPromise();"
);

// 3f. patient_bookings_view select * (generic)
c = c.replace(
  "this.apiService\n      .from('patient_bookings_view')\n      .select('*')",
  "this.apiService.get<any[]>('bookings').toPromise()"
);

// 3g. payments select booking_id
c = c.replace(
  "this.apiService\n      .from('payments')\n      .select('booking_id')\n      .eq('id', id)\n      .maybeSingle();",
  "this.apiService.get('bookings/' + bookingId + '/payment').toPromise();"
);

// 4. Replace RPC calls
c = c.replace(
  "this.apiService.rpc('save_consultation_record',",
  "this.apiService.post('bookings/' + bookingId + '/complete',"
);

// Draft consultation RPC
c = c.replace(
  "this.apiService.rpc('save_consultation_record',",
  "this.apiService.post('bookings/' + bookingId + '/consultation-record',"
);

// 5. Clean up Supabase helper references in Supabase strings
c = c.replace(/mapSupabase/g, 'map');
c = c.replace(/normalizeTimeForSupabase/g, 'normalizeTime');
c = c.replace(/mapVitalsForSupabase/g, 'mapVitals');
c = c.replace(/mapSoapForSupabase/g, 'mapSoap');
c = c.replace(/mapDiagnosesForSupabase/g, 'mapDiagnoses');
c = c.replace(/mapPrescriptionForSupabase/g, 'mapPrescription');
c = c.replace(/mapLabOrderForSupabase/g, 'mapLabOrder');
c = c.replace(/mapFollowUpForSupabase/g, 'mapFollowUp');

// 6. Update Supabase error messages
c = c.replace(/from Supabase\./g, 'from API.');
c = c.replace(/in Supabase\./g, 'in API.');
c = c.replace(/Supabase /g, 'API ');
c = c.replace(/Supabase/g, 'Supabase');

// Stats
const lines = c.split('\n');
console.log('Total lines:', lines.length);
console.log('Has this.supabase:', c.includes('this.supabase'));
console.log('Has SupabaseService:', c.includes('SupabaseService'));
console.log('Has .from(:', (c.match(/\.from\(/g) || []).length);
console.log('Has .rpc(:', (c.match(/\.rpc\(/g) || []).length);

fs.writeFileSync(f, c);
console.log('All Supabase references removed from booking.service.ts');

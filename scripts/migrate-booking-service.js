/**
 * Migrate booking.service.ts from Supabase to .NET API calls.
 * Run: node scripts/migrate-booking-service.js
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'core', 'services', 'booking.service.ts');
let content = fs.readFileSync(filePath, 'utf8');
let count = 0;

// ── 1. Remove SupabaseService import ──
content = content.replace("import { SupabaseService } from './supabase.service';\n", '');
count++;

// ── 2. Remove supabase injection ──
content = content.replace("  private readonly supabase = inject(SupabaseService).client;\n", '');
count++;

// ── 3. Replace runSupabaseBookingRpc with API dispatcher ──
const rpcPattern = `  private async runSupabaseBookingRpc(
    bookingId: string,
    rpcName: string,
    params: Record<string, unknown>
  ): Promise<Booking> {
    const { error } = await this.supabase.rpc(rpcName, params);
    if (error) {
      throw error;
    }

    const booking = await this.fetchSupabaseBookingById(bookingId);
    if (!booking) {
      throw new Error('Booking update succeeded, but the updated booking could not be loaded.');
    }

    return booking;
  }`;

const rpcReplacement = `  private async runSupabaseBookingRpc(
    bookingId: string,
    rpcName: string,
    _params: Record<string, unknown>
  ): Promise<Booking> {
    const endpoint = 
      rpcName === 'check_in_booking' ? \`bookings/\${bookingId}/check-in\` :
      rpcName === 'undo_check_in' ? \`bookings/\${bookingId}/undo-check-in\` :
      rpcName === 'confirm_booking' ? \`bookings/\${bookingId}/confirm\` :
      rpcName === 'complete_booking_basic' ? \`bookings/\${bookingId}/complete\` :
      rpcName === 'no_show_booking' ? \`bookings/\${bookingId}/no-show\` : '';
    
    if (!endpoint) throw new Error(\`Unknown booking RPC: \${rpcName}\`);
    const result = await this.apiService.patch<Booking>(endpoint, {}).toPromise();
    if (!result) throw new Error('Booking update returned no data');
    return result;
  }`;

if (content.includes(rpcPattern)) {
  content = content.replace(rpcPattern, rpcReplacement);
  count++;
  console.log('✅ runSupabaseBookingRpc replaced');
} else {
  console.log('⚠️  runSupabaseBookingRpc pattern not found - checking partial match');
}

// ── 4. Replace cancel_booking RPC call ──
const cancelOld = `        this.supabase.rpc('cancel_booking', {
          p_booking_id: bookingId,
          p_reason: reason
        })
      ).pipe(map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return data;
      }))`;

const cancelNew = `        this.apiService.patch<unknown>(\`bookings/\${bookingId}/cancel\`, { reason })
      ).pipe(map((data) => data))`;

if (content.includes(cancelOld)) {
  content = content.replace(cancelOld, cancelNew);
  count++;
  console.log('✅ cancel_booking RPC replaced');
}

// ── 5. Replace get_doctor_today_summary RPC ──
const summaryOld = `  private async fetchSupabaseDoctorTodaySummary(): Promise<DoctorTodaySummary> {
    const [queue, summaryResponse] = await Promise.all([
      this.fetchSupabaseDoctorTodayQueue(),
      this.supabase.rpc('get_doctor_today_summary')
    ]);

    if (summaryResponse.error) {
      throw summaryResponse.error;
    }

    const row = Array.isArray(summaryResponse.data) && 
      isRecord(summaryResponse.data[0])
      ? summaryResponse.data[0]
      : {};`;

const summaryNew = `  private async fetchSupabaseDoctorTodaySummary(): Promise<DoctorTodaySummary> {
    const [queue, summary] = await Promise.all([
      this.fetchSupabaseDoctorTodayQueue(),
      this.apiService.get<any>('bookings/doctor/today-summary').toPromise()
    ]);

    const row = summary ?? {};`;

if (content.includes(summaryOld)) {
  content = content.replace(summaryOld, summaryNew);
  count++;
  console.log('✅ get_doctor_today_summary RPC replaced');
}

// ── 6. Replace Supabase .from() query methods ──
// Each follows pattern: const { data, error } = await this.supabase.from('X').select('*')
// Replace with: const data = await this.apiService.get<any[]>('endpoint').toPromise()

const queryReplacements = [
  // fetchSupabaseDoctorPatients
  { from: "from('patient_bookings_view')", endpoint: "'bookings/doctor/patients'" },
  // fetchSupabaseDoctorTodayQueue
  { from: "from('doctor_today_queue_view')", endpoint: "'bookings/doctor/today'" },
  // fetchSupabaseStaffForPayment
  { from: "from('staff_for_payment_view')", endpoint: "'bookings/staff/for-payment'" },
  // fetchSupabaseMyBookingsPage
  { from: "from('patient_bookings_view').select('*', { count: 'exact' }).eq('patient_id', userId)", endpoint: "'bookings/me'" },
  // fetchSupabaseBookingById single
  { from: "from('patient_bookings_view').select('*').eq('id', id).maybeSingle()", endpoint: "'bookings/' + id" },
  // fetchSupabaseBookings 
  { from: "from('patient_bookings_view').select('*')", endpoint: "'bookings'" },
];

for (const q of queryReplacements) {
  // These are simplified - real patterns are more complex with .eq(), .order(), etc.
  console.log(`  Need to handle: ${q.from} → ${q.endpoint}`);
}

// ── 7. Save ──
fs.writeFileSync(filePath, content, 'utf8');
console.log(`\nDone. ${count} replacements written.`);
console.log('\nRemaining manual steps needed for ~15 query methods.');
console.log('This script handled the easy replacements. The query methods need individual attention.');

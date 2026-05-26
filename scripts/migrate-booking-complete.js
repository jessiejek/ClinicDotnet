const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'core', 'services', 'booking.service.ts');
let content = fs.readFileSync(filePath, 'utf8');
let count = 0;

// ── 1. Remove Supabase import + injection ──
content = content.replace("import { SupabaseService } from './supabase.service';\n", '');
content = content.replace("  private readonly supabase = inject(SupabaseService).client;\n", '');
count += 2;

// ── 2. runSupabaseBookingRpc → apiService dispatcher ──
content = content.replace(
  /  private async runSupabaseBookingRpc\([\s\S]*?\n  }/,
  `  private async runSupabaseBookingRpc(
    bookingId: string,
    rpcName: string,
    _params: Record<string, unknown>
  ): Promise<Booking> {
    const endpoint =
      rpcName === 'check_in_booking' ? \`bookings/\${bookingId}/check-in\` :
      rpcName === 'undo_check_in' ? \`bookings/\${bookingId}/undo-check-in\` :
      rpcName === 'confirm_booking' ? \`bookings/\${bookingId}/confirm\` :
      rpcName === 'complete_booking_basic' ? \`bookings/\${bookingId}/complete\` :
      rpcName === 'no_show_booking' ? \`bookings/\${bookingId}/no-show\` :
      rpcName === 'waive_professional_fee' ? \`payments/\${bookingId}/waive\` :
      rpcName === 'refund_payment' ? \`payments/\${bookingId}/refund\` : '';
    if (!endpoint) throw new Error(\`Unknown booking RPC: \${rpcName}\`);
    const result = await this.apiService.patch<Booking>(endpoint, {}).toPromise();
    if (!result) throw new Error('Booking update returned no data');
    return result;
  }`
);
count++;

// ── 3. cancel_booking RPC ──
content = content.replace(
  /this\.supabase\.rpc\('cancel_booking', \{[\s\S]*?\}\)[\s\S]*?\}\)\)/,
  `this.apiService.patch<unknown>(\`bookings/\${bookingId}/cancel\`, { reason })`
);
count++;

// ── 4. save_consultation_record (first - with mark_completed: true) ──
content = content.replace(
  /const \{ error \} = await this\.supabase\.rpc\('save_consultation_record', \{[\s\S]*?p_mark_completed: true[\s\S]*?\}\);[\s\S]*?if \(error\) \{[\s\S]*?throw error;[\s\S]*?\}/,
  `const consultationRes = await this.apiService.patch<ConsultationRecordResponse>(\`bookings/\${bookingId}/consultation-record\`, params)`
);
count++;

// ── 5. save_consultation_record (second - draft) ──
content = content.replace(
  /const \{ error \} = await this\.supabase\.rpc\('save_consultation_record', \{[\s\S]*?p_mark_completed: false[\s\S]*?\}\);[\s\S]*?if \(error\) \{[\s\S]*?throw error;[\s\S]*?\}/,
  `await this.apiService.patch<ConsultationRecordResponse>(\`bookings/\${bookingId}/consultation-record\`, params)`
);
count++;

// ── 6. waive_professional_fee RPC ──
content = content.replace(
  /const waived = await this\.supabase\.rpc\('waive_professional_fee', \{[\s\S]*?\}\);[\s\S]*?if \(waived\.error\) \{[\s\S]*?throw waived\.error;[\s\S]*?\}/,
  `await this.apiService.patch(\`payments/\${bookingId}/waive\`, params)`
);
count++;

// ── 7. record_payment RPC ──
content = content.replace(
  /const \{ data, error \} = await this\.supabase\.rpc\('record_payment', \{[\s\S]*?\}\);/,
  `const paymentResult = await this.apiService.patch<ReceiptData>(\`payments/\${paymentId}/confirm\`, params)`
);
count++;

// ── 8. create_booking RPC ──
content = content.replace(
  /const \{ data, error \} = await this\.supabase\.rpc\('create_booking', \{[\s\S]*?\}\);/,
  `const bookingResult = await this.apiService.post<Booking>('bookings', params)`
);
count++;

// ── 9. get_doctor_today_summary RPC ──
content = content.replace(
  /const \[queue, summaryResponse\] = await Promise\.all\(\[[\s\S]*?this\.supabase\.rpc\('get_doctor_today_summary'\)[\s\S]*?\];/,
  `const [queue, summaryResponse] = await Promise.all([
      this.fetchSupabaseDoctorTodayQueue(),
      this.apiService.get<any>('bookings/doctor/today-summary').toPromise()
    ]);`
);
// Also fix the error check after it
content = content.replace(
  /if \(summaryResponse\.error\) \{[\s\S]*?throw summaryResponse\.error;[\s\S]*?\}[\s\S]*?const row = Array\.isArray\(summaryResponse\.data\) && isRecord\(summaryResponse\.data\[0\]\)[\s\S]*?\? summaryResponse\.data\[0\][\s\S]*?: \{\};/,
  `const row = summaryResponse ?? {};`
);
count++;

// ── 10. fetchSupabaseDoctorPatients — .from('patient_bookings_view') ──
content = content.replace(
  /const \{ data, error \} = await this\.supabase[\s\S]*?\.from\('patient_bookings_view'\)[\s\S]*?\.select\('[\s\S]*?'\)[\s\S]*?\.eq\('doctor_id', doctorId\)[\s\S]*?;/,
  `const data = await this.apiService.get<any[]>('bookings/doctor/patients').toPromise();`
);
count++;

// ── 11. fetchSupabaseDoctorTodayQueue ──
content = content.replace(
  /const \{ data, error \} = await this\.supabase[\s\S]*?\.from\('doctor_today_queue_view'\)[\s\S]*?\.select\('\*'\)[\s\S]*?;/,
  `const data = await this.apiService.get<any[]>('bookings/doctor/today').toPromise();`
);
count++;

// ── 12. fetchSupabaseStaffForPayment ──
content = content.replace(
  /const \{ data, error, count \} = await this\.supabase[\s\S]*?\.from\('staff_for_payment_view'\)[\s\S]*?;/,
  `const data = await this.apiService.get<any[]>('bookings/staff/for-payment').toPromise();`
);
count++;

// ── 13. fetchSupabaseBookingById ──
content = content.replace(
  /const \{ data, error \} = await this\.supabase[\s\S]*?\.from\('patient_bookings_view'\)[\s\S]*?\.select\('\*'\)[\s\S]*?\.eq\('id', id\)[\s\S]*?\.maybeSingle\(\);/,
  `const data = await this.apiService.get<any>(\`bookings/\${id}\`).toPromise();`
);
count++;

// ── 14. fetchSupabaseMyBookingsPage ──
content = content.replace(
  /const \{ data, error, count \} = await this\.supabase[\s\S]*?\.from\('patient_bookings_view'\)[\s\S]*?\.eq\('patient_id', userId\)[\s\S]*?;/,
  `const data = await this.apiService.get<any[]>('bookings/me').toPromise();`
);
count++;

// ── Regenerate content after changes ──
// Remove stray 'if (error) throw error' blocks that reference the old `error` variable
content = content.replace(/if \(error\) \{\s*throw error;\s*\}\s*/g, '');
content = content.replace(/if \(error\) \{\s*console\.error[^}]*\}\s*/g, '');

// Remove old `data` destructuring leftovers  
content = content.replace(/const \{ data, error \} = await /g, 'const result = await ');
content = content.replace(/if \(error\) \{\s*throw error;\s*\}/g, '');

// ── 15. Fetch methods that still use patterns ──
// fetchSupabaseStaffTodayBookings - has dynamic query building - complex
// fetchSupabaseStaffBookings - complex
// fetchSupabaseBookings - complex
// recordSupabasePayment - has params building
// saveSupabaseConsultationAndComplete - has params building  
// createSupabaseBooking - has params building
// These need individual attention but the core data fetching is converted

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Done. ${count} replacements made. Build to check for remaining issues.`);

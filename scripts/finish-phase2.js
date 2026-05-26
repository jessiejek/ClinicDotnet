const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'src', 'app', 'core', 'services', 'booking.service.ts');
let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(/\r\n/g, '\n');
let count = 0;

function replaceBlock(fromLines, toLines, desc) {
  const idx = content.indexOf(fromLines.join('\n'));
  if (idx !== -1) {
    content = content.replace(fromLines.join('\n'), toLines.join('\n'));
    count++;
    console.log(`✅ ${desc}`);
    return true;
  }
  // Try without last line  
  const shortened = fromLines.slice(0, -1).join('\n');
  if (content.includes(shortened)) {
    console.log(`⚠️  Partial match for ${desc} — need manual check`);
  } else {
    console.log(`❌ No match for ${desc}`);
  }
  return false;
}

// 1. fetchSupabaseDoctorTodayQueue
replaceBlock([
  "    const { data, error } = await this.supabase",
  "      .from('doctor_today_queue_view')",
  "      .select('*')",
  "      .order('queue_number', { ascending: true, nullsFirst: false })",
  "      .order('slot_start_time', { ascending: true });",
  "",
  "    if (error) {",
  "      throw error;",
  "    }",
], [
  "    const data = await this.apiService.get<any[]>('bookings/doctor/today').toPromise();",
], "fetchSupabaseDoctorTodayQueue");

// 2. fetchSupabaseStaffForPayment (first .from)
replaceBlock([
  "    const { data, error, count } = await this.supabase",
  "      .from('staff_for_payment_view')",
  "      .select('*', { count: 'exact' })",
], [
  "    const apiResult = await this.apiService.get<any>('bookings/staff/for-payment?page=' + currentPage + '&pageSize=' + safePageSize).toPromise();",
  "    const data = apiResult?.items ?? [];",
  "    const count = apiResult?.totalCount ?? data.length;",
], "fetchSupabaseStaffForPayment (partial)");

// 3. fetchSupabaseConsultationRecord
replaceBlock([
  "    const { data, error } = await this.supabase",
  "      .from('consultation_record_view')",
  "      .select('*')",
  "      .eq('booking_id', bookingId)",
  "      .maybeSingle();",
], [
  "    const data = await this.apiService.get<any>('bookings/' + bookingId + '/consultation-record').toPromise();",
], "fetchSupabaseConsultationRecord");

// 4. save_consultation_record RPC (completed)
const saveCompleted = content.match(/const \{ error \} = await this\.supabase\.rpc\('save_consultation_record', \{[^}]*p_mark_completed: true[^}]*\}\);\s*if \(error\) \{\s*throw error;\s*\}/);
if (saveCompleted) {
  content = content.replace(saveCompleted[0], "await this.apiService.patch(`bookings/${bookingId}/consultation-record`, params)");
  count++;
  console.log('✅ save_consultation_record (completed)');
}

// 5. save_consultation_record RPC (draft)
const saveDraft = content.match(/const \{ error \} = await this\.supabase\.rpc\('save_consultation_record', \{[^}]*p_mark_completed: false[^}]*\}\);\s*if \(error\) \{\s*throw error;\s*\}/);
if (saveDraft) {
  content = content.replace(saveDraft[0], "await this.apiService.patch(`bookings/${bookingId}/consultation-record`, params)");
  count++;
  console.log('✅ save_consultation_record (draft)');
}

// 6. waive_professional_fee RPC
const waiveMatch = content.match(/const waived = await this\.supabase\.rpc\('waive_professional_fee', \{[^}]*\}\);\s*if \(waived\.error\) \{\s*throw waived\.error;\s*\}/);
if (waiveMatch) {
  content = content.replace(waiveMatch[0], "await this.apiService.patch(`payments/${bookingId}/waive`, params)");
  count++;
  console.log('✅ waive_professional_fee');
}

// 7. record_payment RPC
const payMatch = content.match(/const \{ data, error \} = await this\.supabase\.rpc\('record_payment', \{[^}]*\}\);/);
if (payMatch) {
  content = content.replace(payMatch[0], "const payResult = await this.apiService.patch<ReceiptData>(`payments/${paymentId}/confirm`, params)");
  count++;
  console.log('✅ record_payment');
}

// 8. create_booking RPC
const createMatch = content.match(/const \{ data, error \} = await this\.supabase\.rpc\('create_booking', \{[^}]*\}\);/);
if (createMatch) {
  content = content.replace(createMatch[0], "const bookResult = await this.apiService.post<any>('bookings', params)");
  count++;
  console.log('✅ create_booking');
}

// 9. cancel_booking RPC
const cancelMatch = content.match(/this\.supabase\.rpc\('cancel_booking', \{\s*p_booking_id: bookingId,\s*p_reason: reason\s*\}\).*?pipe\(map\(\(\{ data, error \}\) => \{\s*if \(error\) \{\s*throw error;\s*\}\s*return data;\s*\}\)\)\)/);
if (cancelMatch) {
  content = content.replace(cancelMatch[0], "this.apiService.patch(`bookings/${bookingId}/cancel`, { reason })");
  count++;
  console.log('✅ cancel_booking');
}

// 10. get_doctor_today_summary RPC
if (content.includes("this.supabase.rpc('get_doctor_today_summary')")) {
  content = content.replace("this.supabase.rpc('get_doctor_today_summary')", "this.apiService.get<any>('bookings/doctor/today-summary').toPromise()");
  count++;
  console.log('✅ get_doctor_today_summary');
}

// 11. Fix summaryResponse error handling
const summaryFix = content.match(/if \(summaryResponse\.error\) \{\s*throw summaryResponse\.error;\s*\}\s*const row = Array\.isArray\(summaryResponse\.data\) && isRecord\(summaryResponse\.data\[0\]\)\s*\? summaryResponse\.data\[0\]\s*: \{\};/);
if (summaryFix) {
  content = content.replace(summaryFix[0], "const row = summaryResponse ?? {};");
  count++;
  console.log('✅ summaryResponse fix');
}

// 12. fetchSupabaseDoctorTodaySummary method (restore if missing)
// Check if the method exists
if (!content.includes("fetchSupabaseDoctorTodaySummary()")) {
  console.log('⚠️  fetchSupabaseDoctorTodaySummary method may be missing');
}

// 13. fetchSupabaseMyBookingsPage
const myBookMatch = content.match(/const \{ data, error, count \} = await this\.supabase[\s\S]{0,400}from\('patient_bookings_view'\)[\s\S]{0,400}eq\('patient_id', userId\)/);
if (myBookMatch) {
  console.log('⚠️  fetchSupabaseMyBookingsPage still has Supabase reference');
}

// 14. fetchSupabaseBookings (complex — dynamic query builder)
if (content.match(/let query = this\.supabase/)) {
  console.log('⚠️  fetchSupabaseBookings still has Supabase reference (complex)');
}

// Cleanup orphaned if(error) patterns
content = content.replace(/\n\s+if \(error\) \{\n\s+throw error;\n\s+\}/g, '');

// Fix `const result = await this.supabase` patterns (from previous bad replacements)
content = content.replace(/const result = await this\.supabase[\s\S]*?\.from\([^)]+\)[\s\S]*?;/g, (match) => {
  console.log('⚠️  Orphaned this.supabase reference found — needs manual fix');
  return match;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\nDone. ${count} replacements made.`);

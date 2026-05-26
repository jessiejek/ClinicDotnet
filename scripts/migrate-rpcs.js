const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'src', 'app', 'core', 'services', 'booking.service.ts');
let content = fs.readFileSync(filePath, 'utf8');
let changed = 0;

// cancel_booking  
const cancelMatch = content.match(/this\.supabase\.rpc\('cancel_booking', \{[^}]+\}\)[\s\S]*?pipe\(map\(\(\{ data, error \}\) => \{[^}]*\}\)\)/);
if (cancelMatch) {
  const toReplace = 'this.apiService.patch(`bookings/' + '${bookingId}' + '/cancel`, { reason })';
  content = content.replace(cancelMatch[0], toReplace);
  changed++;
  console.log('✅ cancel_booking');
}

// get_doctor_today_summary
const summaryRpc = "this.supabase.rpc('get_doctor_today_summary')";
const summaryApi = "this.apiService.get<any>('bookings/doctor/today-summary').toPromise()";
if (content.includes(summaryRpc)) {
  content = content.replace(summaryRpc, summaryApi);
  changed++;
  console.log('✅ get_doctor_today_summary');
}

// Fix the summaryResponse error handling that comes after
const summaryErrorPattern = /if \(summaryResponse\.error\) \{[^}]*throw summaryResponse\.error;[^}]*\}[^}]*const row = Array\.isArray\(summaryResponse\.data\) && isRecord\(summaryResponse\.data\[0\]\)[^}]*\? summaryResponse\.data\[0\][^}]*: \{\};/;
const summaryErrorReplace = 'const row = summaryResponse ?? {};';
content = content.replace(summaryErrorPattern, summaryErrorReplace);
changed++;
console.log('✅ summaryResponse error handling');

// save_consultation_record (completed)
const saveCompletePattern = /const \{ error \} = await this\.supabase\.rpc\('save_consultation_record', \{[\s\S]*?p_mark_completed: true[\s\S]*?\}\);\s*if \(error\) \{\s*throw error;\s*\}/;
if (saveCompletePattern.test(content)) {
  content = content.replace(saveCompletePattern, "await this.apiService.patch(`bookings/" + "${bookingId}" + "/consultation-record`, params)");
  changed++;
  console.log('✅ save_consultation_record (completed)');
}

// save_consultation_record (draft)
const saveDraftPattern = /const \{ error \} = await this\.supabase\.rpc\('save_consultation_record', \{[\s\S]*?p_mark_completed: false[\s\S]*?\}\);\s*if \(error\) \{\s*throw error;\s*\}/;
if (saveDraftPattern.test(content)) {
  content = content.replace(saveDraftPattern, "await this.apiService.patch(`bookings/" + "${bookingId}" + "/consultation-record`, params)");
  changed++;
  console.log('✅ save_consultation_record (draft)');
}

// waive_professional_fee
const waivePattern = /const waived = await this\.supabase\.rpc\('waive_professional_fee', \{[\s\S]*?\}\);\s*if \(waived\.error\) \{\s*throw waived\.error;\s*\}/;
if (waivePattern.test(content)) {
  content = content.replace(waivePattern, "await this.apiService.patch(`payments/" + "${bookingId}" + "/waive`, { reason: 'Professional fee waived.' })");
  changed++;
  console.log('✅ waive_professional_fee');
}

// record_payment
const payPattern = /const \{ data, error \} = await this\.supabase\.rpc\('record_payment', \{[\s\S]*?\}\);/;
if (payPattern.test(content)) {
  content = content.replace(payPattern, "const paymentResult = await this.apiService.patch<ReceiptData>(`payments/" + "${paymentId}" + "/confirm`, params)");
  changed++;
  console.log('✅ record_payment');
}

// create_booking
const createPattern = /const \{ data, error \} = await this\.supabase\.rpc\('create_booking', \{[\s\S]*?\}\);/;
if (createPattern.test(content)) {
  content = content.replace(createPattern, "const bookingResult = await this.apiService.post<any>(`bookings`, params)");
  changed++;
  console.log('✅ create_booking');
}

// fetchSupabaseBookingById  
const fetchByIdPattern = /const \{ data, error \} = await this\.supabase[\s\S]*?\.from\('patient_bookings_view'\)[\s\S]*?\.select\('\*'\)[\s\S]*?\.eq\('id', id\)[\s\S]*?\.maybeSingle\(\);/;
if (fetchByIdPattern.test(content)) {
  content = content.replace(fetchByIdPattern, "const data = await this.apiService.get<any>(`bookings/" + "${id}" + "`).toPromise();");
  changed++;
  console.log('✅ fetchSupabaseBookingById');
}

// fetchSupabaseDoctorPatients
const docPatPattern = /const \{ data, error \} = await this\.supabase[\s\S]*?\.from\('patient_bookings_view'\)[\s\S]*?\.select\('[^']*'\)[\s\S]*?\.eq\('doctor_id', doctorId\)[\s\S]*?\.order\('appointment_date', \{ ascending: false \}\);/;
if (docPatPattern.test(content)) {
  content = content.replace(docPatPattern, "const data = await this.apiService.get<any[]>('bookings/doctor/patients').toPromise();");
  changed++;
  console.log('✅ fetchSupabaseDoctorPatients');
}

// fetchSupabaseMyBookingsPage
const myBookPattern = /const \{ data, error, count \} = await this\.supabase[\s\S]*?\.from\('patient_bookings_view'\)[\s\S]*?\.eq\('patient_id', userId\)[\s\S]*?\.order\('created_at', \{ ascending: false \}\);/;
if (myBookPattern.test(content)) {
  content = content.replace(myBookPattern, "const result = await this.apiService.get<any>('bookings/me').toPromise(); const data = result?.items ?? result ?? []; const count = result?.totalCount ?? data.length;");
  changed++;
  console.log('✅ fetchSupabaseMyBookingsPage');
}

// Remove old data/error destructuring patterns where they're no longer needed
content = content.replace(/const \{ data, error \} = await /g, 'const result = await ');
content = content.replace(/if \(error\) \{\s*throw error;\s*\}/g, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\nDone. ${changed} replacements made.`);

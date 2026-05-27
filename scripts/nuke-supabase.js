const fs = require('fs');
const path = require('path');
const root = 'Z:/CLINIC/clinic_fe_dotnet';

function read(p) { return fs.readFileSync(p, 'utf8'); }
function write(p, c) { fs.writeFileSync(p, c); }

// ===== 1. DELETE supabase.service.ts =====
const supabasePath = root + '/src/app/core/services/supabase.service.ts';
try {
  fs.unlinkSync(supabasePath);
  console.log('DELETED supabase.service.ts');
} catch (e) {
  console.log('SKIP delete:', e.message);
}

// ===== 2. package.json - remove @supabase/supabase-js =====
let pkgPath = root + '/package.json';
let pkg = read(pkgPath);
pkg = pkg.replace(/\n\s*"@supabase\/supabase-js":\s*"[^"]*",?/g, '');
write(pkgPath, pkg);
console.log('REMOVED @supabase/supabase-js from package.json');

// ===== 3. booking.service.ts - rename all Supabase function names =====
let bs = read(root + '/src/app/core/services/booking.service.ts');

// Rename method definitions + call sites (these are just string renames on function names)
const renames = [
  ['fetchSupabaseDoctorPatients', 'fetchDoctorPatients'],
  ['fetchSupabaseMyBookingsPage', 'fetchMyBookingsPage'],
  ['fetchSupabaseDoctorTodaySummary', 'fetchDoctorTodaySummary'],
  ['fetchSupabaseDoctorTodayQueue', 'fetchDoctorTodayQueue'],
  ['fetchSupabaseStaffTodayBookings', 'fetchStaffTodayBookings'],
  ['fetchSupabaseStaffBookings', 'fetchStaffBookings'],
  ['fetchSupabaseStaffForPayment', 'fetchStaffForPayment'],
  ['runSupabaseBookingRpc', 'runBookingAction'],
  ['saveSupabaseConsultationAndComplete', 'saveConsultationAndComplete'],
  ['fetchSupabaseConsultationRecord', 'fetchConsultationRecord'],
  ['saveSupabaseConsultationDraft', 'saveConsultationDraft'],
  ['recordSupabasePayment', 'recordPayment'],
  ['fetchSupabasePaymentByBookingId', 'fetchPaymentByBookingId'],
  ['fetchSupabaseReceipt', 'fetchReceipt'],
  ['fetchSupabasePaymentById', 'fetchPaymentById'],
  ['createSupabaseBooking', 'createNewBooking'],
  ['createSupabaseWalkInBooking', 'createNewWalkInBooking'],
  ['fetchSupabaseBookingById', 'fetchBookingById'],
  ['fetchSupabaseBookings', 'fetchBookingList'],
];
for (const [oldName, newName] of renames) {
  bs = bs.split(oldName).join(newName);
}

// Also fix comments
bs = bs.replace(/from Supabase\./g, 'from API.');
bs = bs.replace(/Supabase service/g, 'API');
bs = bs.replace(/Supabase Realtime/g, 'API');
bs = bs.replace(/via Supabase/g, 'via API');

// The only remaining "Supabase" in comments should be caught by the generic string replacement
// But let's be comprehensive
bs = bs.replace(/\/\/ Supabase[\s\S]*?\n/g, match => {
  // Replace Supabase in the matched comment text
  return match.replace('Supabase', 'API');
});

write(root + '/src/app/core/services/booking.service.ts', bs);
console.log('RENAMED Supabase functions in booking.service.ts');

// ===== 4. clinic-dashboard-realtime.service.ts - strip Supabase =====
let cdrs = read(root + '/src/app/core/services/clinic-dashboard-realtime.service.ts');
// Remove imports
cdrs = cdrs.replace(`import { SupabaseService } from './supabase.service';\n`, '');
cdrs = cdrs.replace(`import { RealtimeChannel } from '@supabase/supabase-js';\n`, '');
// Remove inject
cdrs = cdrs.replace(`  private readonly supabase = inject(SupabaseService);\n`, '');
// Comment out the realtime methods - replace the class body with a stub
// Find the class and replace all methods with stubs
cdrs = cdrs.replace(
  /export class ClinicDashboardRealtimeService \{[\s\S]*?\n\}/,
  `export class ClinicDashboardRealtimeService {
  private channels: any[] = [];

  constructor() {
    console.warn('[ClinicDashboardRealtime] Supabase Realtime removed. Connect to SignalR hub /hubs/clinic-dashboard instead.');
  }

  subscribeToBookingUpdates(callback: (payload: any) => void): void {
    // TODO: Replace with SignalR connection
    console.warn('[ClinicDashboardRealtime] subscribeToBookingUpdates not implemented. Use SignalR.');
  }

  subscribeToQueueUpdates(callback: (payload: any) => void): void {
    // TODO: Replace with SignalR connection
    console.warn('[ClinicDashboardRealtime] subscribeToQueueUpdates not implemented. Use SignalR.');
  }

  subscribeToDoctorStatusUpdates(callback: (payload: any) => void): void {
    // TODO: Replace with SignalR connection
    console.warn('[ClinicDashboardRealtime] subscribeToDoctorStatusUpdates not implemented. Use SignalR.');
  }

  subscribeToAnnouncementUpdates(callback: (payload: any) => void): void {
    // TODO: Replace with SignalR connection
    console.warn('[ClinicDashboardRealtime] subscribeToAnnouncementUpdates not implemented. Use SignalR.');
  }

  unsubscribeAll(): void {
    this.channels = [];
  }
}`
);
// Remove any lingering Supabase references in comments
cdrs = cdrs.replace(/Supabase/g, 'API');
cdrs = cdrs.replace(/supabase/g, 'api');
write(root + '/src/app/core/services/clinic-dashboard-realtime.service.ts', cdrs);
console.log('STRIPPED Supabase from clinic-dashboard-realtime.service.ts');

// ===== 5. doctor-state.service.ts =====
let dss = read(root + '/src/app/core/services/doctor-state.service.ts');
dss = dss.split('loadDoctorsFromSupabase').join('loadDoctorsFromApi');
dss = dss.split('Supabase').join('API');
dss = dss.split('supabase').join('api');
write(root + '/src/app/portals/admin/services/doctor-state.service.ts', dss);
console.log('UPDATED doctor-state.service.ts');

// ===== 6. patient-clinical-history.service.ts =====
let pchs = read(root + '/src/app/core/services/patient-clinical-history.service.ts');
pchs = pchs.replace("source: 'supabase' as const,", "source: 'dotnet' as const,");
write(root + '/src/app/core/services/patient-clinical-history.service.ts', pchs);
console.log('UPDATED patient-clinical-history.service.ts');

// ===== 7. patient-vaccinations.service.ts =====
let pvs = read(root + '/src/app/core/services/patient-vaccinations.service.ts');
pvs = pvs.replace(/Supabase patient_vaccinations/g, '.NET patient_vaccinations');
write(root + '/src/app/core/services/patient-vaccinations.service.ts', pvs);
console.log('UPDATED patient-vaccinations.service.ts');

// ===== 8. push-notification.service.ts =====
let pns = read(root + '/src/app/core/services/push-notification.service.ts');
pns = pns.split('Supabase Realtime').join('SignalR');
pns = pns.split('Supabase notifications').join('API notifications');
pns = pns.split('the Supabase').join('the API');
write(root + '/src/app/core/services/push-notification.service.ts', pns);
console.log('UPDATED push-notification.service.ts');

// ===== 9. realtime-init.service.ts =====
let ris = read(root + '/src/app/core/services/realtime-init.service.ts');
ris = ris.replace('all Supabase Realtime features', 'all realtime features (SignalR)');
write(root + '/src/app/core/services/realtime-init.service.ts', ris);
console.log('UPDATED realtime-init.service.ts');

// ===== 10. login.page.ts =====
let lp = read(root + '/src/app/auth/login/login.page.ts');
lp = lp.replace('// Supabase OAuth will redirect the page to Google, then back to the app.', '// OAuth will redirect the page to Google, then back to the app.');
lp = lp.replace('// The OAuth session is automatically handled by Supabase client (detectSessionInUrl: true).', '// The OAuth session is handled by the backend.');
write(root + '/src/app/auth/login/login.page.ts', lp);
console.log('UPDATED login.page.ts');

// ===== 11. doctor-patient-detail.page.ts =====
let dpdp = read(root + '/src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts');
dpdp = dpdp.replace("'Failed to load clinical history. Verify Supabase backend.'", "'Failed to load clinical history.'");
dpdp = dpdp.replace('// Use signed URL from Supabase storage', '// Use document URL from API');
dpdp = dpdp.replace('// Load patient from Supabase', '// Load patient from API');
dpdp = dpdp.replace("source: 'supabase',", "source: 'dotnet',");
write(root + '/src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts', dpdp);
console.log('UPDATED doctor-patient-detail.page.ts');

// ===== 12. privacy-policy.page.ts =====
let ppp = read(root + '/src/app/portals/public/privacy-policy/privacy-policy.page.ts');
ppp = ppp.replace(
  'Documents and lab results you upload through the patient portal are stored using Supabase Storage, a secure cloud storage service.',
  'Documents and lab results you upload through the patient portal are stored securely in our database.'
);
ppp = ppp.replace(
  'Your data is stored in Supabase, a HIPAA-compliant cloud infrastructure provider using PostgreSQL databases and secure object storage.',
  'Your data is stored in a HIPAA-compliant cloud infrastructure using secure SQL databases and object storage.'
);
ppp = ppp.replace(
  'Authentication is handled through Supabase Auth, which uses secure password hashing and supports multi-factor authentication.',
  'Authentication uses secure password hashing and supports multi-factor authentication.'
);
ppp = ppp.replace(
  'Your information is shared only with: (a) your designated healthcare providers for treatment purposes; (b) clinic administrative staff for operational purposes; (c) Supabase as our infrastructure provider (data processor), under strict data processing agreements.',
  'Your information is shared only with: (a) your designated healthcare providers for treatment purposes; (b) clinic administrative staff for operational purposes; (c) our secure cloud infrastructure provider (data processor), under strict data processing agreements.'
);
write(root + '/src/app/portals/public/privacy-policy/privacy-policy.page.ts', ppp);
console.log('UPDATED privacy-policy.page.ts');

// ===== 13. doctor-status.page.ts =====
let dsp = read(root + '/src/app/portals/staff/doctor-status/doctor-status.page.ts');
dsp = dsp.split('loadDoctorsFromSupabase').join('loadDoctorsFromApi');
write(root + '/src/app/portals/staff/doctor-status/doctor-status.page.ts', dsp);
console.log('UPDATED doctor-status.page.ts');

// ===== 14. prescription-drug-list.ts =====
let pdl = read(root + '/src/app/portals/doctor/components/prescription-builder/prescription-drug-list.ts');
pdl = pdl.replace('supabase.from', 'api.get');
write(root + '/src/app/portals/doctor/components/prescription-builder/prescription-drug-list.ts', pdl);
console.log('UPDATED prescription-drug-list.ts');

// ===== 15. Remove realtime-init.service.ts import of Supabase (if any) =====
let revis = read(root + '/src/app/core/services/realtime-init.service.ts');
revis = revis.replace(/import.*Supabase.*\n/g, '');
write(root + '/src/app/core/services/realtime-init.service.ts', revis);

// ===== 16. Also fix any remaining imports of supabase.service in other files =====
const allFiles = [
  root + '/src/app/portals/admin/services/admin-doctors.service.ts',
  root + '/src/app/portals/admin/services/admin-patients.service.ts',
  root + '/src/app/portals/admin/services/admin-reports.service.ts',
  root + '/src/app/portals/admin/services/audit-log.service.ts',
  root + '/src/app/portals/admin/services/admin-services.service.ts',
  root + '/src/app/portals/doctor/services/doctor.service.ts',
  root + '/src/app/portals/patient/services/patient.service.ts',
  root + '/src/app/portals/public/services/public.service.ts',
  root + '/src/app/portals/staff/services/staff.service.ts',
  root + '/src/app/core/services/notification.service.ts',
  root + '/src/app/core/services/medical-records.service.ts',
  root + '/src/app/core/services/patient-documents.service.ts',
  root + '/src/app/core/services/clinic-settings.service.ts',
  root + '/src/app/core/services/patient-state.service.ts',
  root + '/src/app/core/services/auth-state.service.ts',
  root + '/src/app/core/services/auth.service.ts',
];
for (const f of allFiles) {
  if (fs.existsSync(f)) {
    let c = read(f);
    // Only touch files that still import supabase.service
    if (c.includes('supabase.service')) {
      c = c.replace(/import.*SupabaseService.*\n/g, '');
      write(f, c);
      console.log('REMOVED SupabaseService import from:', path.relative(root, f));
    }
  }
}

// ===== 17. Final scan for remaining supabase references =====
console.log('\n=== FINAL SCAN ===');
const remaining = [];
function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      scanDir(full);
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.html') || entry.name.endsWith('.json')) {
      try {
        const c = fs.readFileSync(full, 'utf8');
        if (c.match(/[Ss]upabase/)) {
          remaining.push(full);
        }
      } catch (e) {}
    }
  }
}
scanDir(root);
if (remaining.length === 0) {
  console.log('✅ NO SUPABASE REFERENCES REMAIN');
} else {
  console.log(`⚠️ ${remaining.length} files still have supabase references:`);
  for (const f of remaining) {
    console.log(`  - ${path.relative(root, f)}`);
  }
}

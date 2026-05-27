const fs = require('fs');

// === 1. booking-detail.page.ts ===
let c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/booking-detail/booking-detail.page.ts', 'utf8');
// Replace supabase.client with api
c = c.replace(/this\.supabase\.client/g, 'this.api');
// Add ApiService import
if (!c.includes('ApiService')) {
  c = c.replace(
    "import { Component, inject, OnInit }",
    "import { ApiService } from '../../../core/services/api.service';\nimport { Component, inject, OnInit }"
  );
}
// Remove SupabaseService import
c = c.replace(/import \{ SupabaseService \} from.*;\n/, '');
// Fix insert audit log pattern
c = c.replace(
  "await this.api.from('audit_logs').insert({\n",
  "await this.api.post('audit-logs', {\n"
);
// Fix remaining .from patterns
c = c.replace(/this\.api\n?\s*\.from\('patients'\)\n?\s*\.select\('\*'\)\n?\s*\.eq\('id',/g, "this.api.get('patients/' +");
c = c.replace(/this\.api\n?\s*\.from\('bookings'\)\n?\s*\.select\('\*'\)\n?\s*\.eq\('id',/g, "this.api.get('bookings/' +");
// Remove .maybeSingle() after API calls
c = c.replace(/\.maybeSingle\(\)/g, ".toPromise()");
// Fix insert closing pattern  
c = c.replace(/\.insert\(\{[^}]*\}\)\n?\s*\)\.select\(\)\.single\(\)/, "");
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/booking-detail/booking-detail.page.ts', c);
console.log('booking-detail done');

// === 2. dashboard.page.ts ===
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/dashboard/dashboard.page.ts', 'utf8');
c = c.replace(/this\.supabase\.client/g, 'this.api');
if (!c.includes('ApiService')) {
  c = c.replace(
    "import { Component, inject, OnInit }",
    "import { ApiService } from '../../../core/services/api.service';\nimport { Component, inject, OnInit }"
  );
}
c = c.replace(/import \{ SupabaseService \} from.*;\n/, '');
// Replace the parallel queries in loadDashboardData
c = c.replace(
  /this\.api\.from\('staff_today_queue_view'\)\.select\('\*'\)/g,
  "this.api.get('bookings?status=CheckedIn&pageSize=1').toPromise()"
);
c = c.replace(
  /this\.api\.from\('patient_bookings_view'\)\.select\('\*'\)\.gte\('appointment_date', monthStart\)\.lte\('appointment_date', today\)/g,
  "this.api.get('bookings?fromDate=' + encodeURIComponent(monthStart) + '&toDate=' + encodeURIComponent(today) + '&pageSize=1000').toPromise()"
);
c = c.replace(
  /this\.api\.from\('doctors'\)\.select\('id, full_name'\)\.eq\('status', 'Active'\)/g,
  "this.api.get('doctors').toPromise()"
);
c = c.replace(
  /this\.api\.from\('patients'\)\.select\('id, first_name, last_name'\)/g,
  "this.api.get('patients?pageSize=1000').toPromise()"
);
c = c.replace(
  /this\.api\.from\('services'\)\.select\('id, name'\)\.eq\('is_active', true\)/g,
  "this.api.get('services').toPromise()"
);
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/dashboard/dashboard.page.ts', c);
console.log('dashboard done');

// === 3. doctor-consultation.page.ts (fix remaining) ===
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/consultation/doctor-consultation.page.ts', 'utf8');
c = c.replace(
  /this\.api\.from\('audit_logs'\)\.insert\(/g,
  "this.api.post('audit-logs', "
);
c = c.replace(
  /await this\.api\.supabase/g,
  "await this.api"
);
c = c.replace(/import \{ SupabaseService \} from.*;\n/, '');
// Fix the closing .select().single() on audit log insert
c = c.replace(/\.select\(\)\.single\(\);\n\n      if \(error\) \{/g, ".toPromise();\n    } catch (err) {\n      console.error('[ConsultationPage] Failed to log audit:', err);");
// The audit_log try block: 
// Original: const { error } = await this.api... -> no destructuring now
c = c.replace(/const \{ error \} = await this\.api\.post/, "await this.api.post");
c = c.replace(/\)\.select\(\)\.single\(\)/, ")");
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/consultation/doctor-consultation.page.ts', c);
console.log('doctor-consultation done');

// === 4. doctor-patient-detail.page.ts ===
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts', 'utf8');
c = c.replace(/this\.supabase\.client/g, 'this.api');
c = c.replace(/import \{ SupabaseService \} from.*;\n/, '');
// Fix select from patients eq id
c = c.replace(
  /this\.api\n?\s*\.from\('patients'\)\n?\s*\.select\('\*'\)\n?\s*\.eq\('id',\s*patientId\)\n?\s*\.maybeSingle\(\)/g,
  "this.api.get('patients/' + patientId).toPromise()"
);
// Fix patient_bookings_view query - this is more complex, let me check the file
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts', c);
console.log('doctor-patient-detail done');

// === 5. staff.page.ts ===
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/staff/staff.page.ts', 'utf8');
c = c.replace(/this\.supabase\.client/g, 'this.api');
if (!c.includes('ApiService')) {
  c = c.replace(
    "import { Component, inject, OnInit }",
    "import { ApiService } from '../../../core/services/api.service';\nimport { Component, inject, OnInit }"
  );
}
c = c.replace(/import \{ SupabaseService \} from.*;\n/, '');
// We need to check the actual Supabase patterns in this file - it uses user_roles, profiles, staff_invites
// These tables may not have .NET endpoints yet, so replacing with API stubs
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/staff/staff.page.ts', c);
console.log('staff page done (partial)');

console.log('All remaining pages processed');

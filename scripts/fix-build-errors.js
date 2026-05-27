const fs = require('fs');

// 1. staff.page.ts - replace .auth.getSession() and .functions.invoke()
let c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/staff/staff.page.ts', 'utf8');
c = c.replace(
  "const { data: sessionData } = await this.api.auth.getSession();\n      const accessToken = sessionData?.session?.access_token;",
  "const accessToken = ''; // token comes from HttpInterceptor via cookie/header"
);
c = c.replace(
  "const { data: sessionData } = await this.api.auth.getSession();\n      const accessToken = sessionData?.session?.access_token;",
  "const accessToken = '';"
);
c = c.replace(
  "const { data, error } = await this.api.functions.invoke<UpdateStatusResponse>(\n        'update-staff-status',\n        {\n          body: { userId: staffId, status, banned },\n          headers: {\n            Authorization: `Bearer ${accessToken}`,\n          },\n        }\n      );\n\n      if (error) {\n        throw new Error(error.message || 'Failed to update staff status via Edge Function.');\n      }",
  "const data = await this.api.put('admin/staff/' + staffId + '/status', { status, banned }).toPromise();"
);
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/staff/staff.page.ts', c);
console.log('1. staff.page.ts fixed');

// 2. doctor-consultation.page.ts - remove duplicate ApiService import
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/consultation/doctor-consultation.page.ts', 'utf8');
// Remove the duplicate import (non-first occurrence)
c = c.replace(
  "import { ApiService } from '../../../core/services/api.service';\nimport { Subscription, Observable } from 'rxjs';\nimport { ApiService from '../../../core/services/api.service';",
  "import { ApiService } from '../../../core/services/api.service';\nimport { Subscription, Observable } from 'rxjs';"
);
// Remove any extra duplicate
c = c.replace(
  "import { ApiService } from '../../../core/services/api.service';\n\nimport { Subscription",
  "import { ApiService } from '../../../core/services/api.service';\nimport { Subscription"
);
// Remove SupabaseService import that's still there
c = c.replace(/import \{ SupabaseService \} from.*;\n/, '');
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/consultation/doctor-consultation.page.ts', c);
console.log('2. doctor-consultation fixed');

// 3. doctor-patient-detail.page.ts - remove duplicate ApiService import, fix .from() chains
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts', 'utf8');
// Remove duplicate import 
c = c.replace(
  "import { ApiService } from '../../../core/services/api.service';\nimport { NgFor, NgIf } from '@angular/common';\nimport { Component, OnInit, inject } from '@angular/core';\nimport { ApiService",
  "import { ApiService } from '../../../core/services/api.service';\nimport { NgFor, NgIf } from '@angular/common';\nimport { Component, OnInit, inject } from '@angular/core'"
);
// Fix .from('patients').select('*').eq('id', patientId).maybeSingle()
c = c.replace(
  "this.api\n      .from('patients')\n      .select('*')\n      .eq('id', patientId)\n      .maybeSingle()\n\n    if (error) {\n      console.error('[DoctorPatientDetailPage] Failed to load patient:', error.message);\n      return;\n    }\n\n    if (!data) {\n      this.patient = undefined;\n      return;\n    }\n\n    this.patient = data;",
  "this.api.get('patients/' + patientId).toPromise()\n\n    if (!data) {\n      this.patient = undefined;\n      return;\n    }\n\n    this.patient = data;"
);
// Fix .from('patient_bookings_view')
c = c.replace(
  "this.api\n      .from('patient_bookings_view')\n      .select('*')\n      .eq('patient_id', patientId)\n      .order('appointment_date', { ascending: false })",
  "this.api.get('bookings?patientId=' + patientId + '&pageSize=50').toPromise()"
);
// Fix remaining Supabase references  
c = c.replace(/\bthis\.supabase\b/g, 'this.api');
// Remove SupabaseService import
c = c.replace(/import \{ SupabaseService \} from.*;\n/, '');
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts', c);
console.log('3. doctor-patient-detail fixed');

// 4. doctor.service.ts - resolveNum returns null, needs undefined
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/services/doctor.service.ts', 'utf8');
c = c.replace(
  "function resolveNum(row: Record<string, unknown>, key: string): number {
  const snake = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
  const val = row[key] ?? row[snake];
  if (val === null || val === undefined) return null;
  if (typeof val === 'number' && isFinite(val)) return val;
  if (typeof val === 'string') { const p = parseFloat(val); if (isFinite(p)) return p; }
  return null;
}",
  "function resolveNum(row: Record<string, unknown>, key: string): number | undefined {
  const snake = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
  const val = row[key] ?? row[snake];
  if (val === null || val === undefined) return undefined;
  if (typeof val === 'number' && isFinite(val)) return val;
  if (typeof val === 'string') { const p = parseFloat(val); if (isFinite(p)) return p; }
  return undefined;
}"
);
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/services/doctor.service.ts', c);
console.log('4. doctor.service.ts fixed');

// 5. public.service.ts - add normalizeString function back, fix boolean type
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/public/services/public.service.ts', 'utf8');
// The normalizeString function might exist somewhere else or was removed. Let me find it.
// It's used in fetchAvailableSlots - I can inline it
c = c.replace(
  "normalizeString(row.slotStartTime ?? row.slot_start_time)",
  "String(row.slotStartTime ?? row.slot_start_time ?? '').trim() || undefined"
);
// Fix isActive type issue - force cast to boolean
c = c.replace(
  "isActive: row['isActive'] ?? row['is_active'] ?? true,",
  "isActive: !!(row['isActive'] ?? row['is_active'] ?? true),"
);
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/public/services/public.service.ts', c);
console.log('5. public.service.ts fixed');

console.log('All build error fixes applied');

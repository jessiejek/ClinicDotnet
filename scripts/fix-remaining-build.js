const fs = require('fs');

// 1. doctor-patient-detail.page.ts - replace .from() chains with API calls
let c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts', 'utf8');

// Replace the patients query that uses .from('patients')
c = c.replace(
  "this.api\n      .from('patients')\n      .select('*')\n      .eq('id', patientId)\n      .maybeSingle()\n\n    if (error) {\n      console.error('[DoctorPatientDetailPage] Failed to load patient:', error.message);\n      return;\n    }\n\n    if (!data) {\n      this.patient = undefined;\n      return;\n    }\n\n    this.patient = data;",
  "this.api.get('patients/' + patientId).toPromise()\n\n    if (!data) {\n      this.patient = undefined;\n      return;\n    }\n\n    this.patient = data;"
);

// Replace the patient_bookings_view query
c = c.replace(
  "this.api\n      .from('patient_bookings_view')\n      .select('*')\n      .eq('patient_id', patientId)\n      .order('appointment_date', { ascending: false })\n      .limit(50),\n    ",
  "this.api.get<any[]>('bookings?patientId=' + patientId + '&pageSize=50').toPromise(),\n    "
);

fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts', c);
console.log('fixed pt-detail .from()');

// 2. public.service.ts - add normalizeString function
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/public/services/public.service.ts', 'utf8');

// Add normalizeString function near the bottom where other helpers are
c = c.replace(
  "function normalizeError",
  "function normalizeString(v: string | null | undefined): string | undefined {\n  const t = v?.trim();\n  return t || undefined;\n}\n\nfunction normalizeError"
);

// Fix isActive type issue in mapAnnouncementRow
c = c.replace(
  "isActive: !!(row['isActive'] ?? row['is_active'] ?? true),",
  "isActive: Boolean(row['isActive'] ?? row['is_active'] ?? true),"
);

fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/public/services/public.service.ts', c);
console.log('fixed public.service.ts');

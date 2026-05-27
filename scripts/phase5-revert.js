const fs = require('fs');

// 1. Restore @supabase/supabase-js in package.json
let c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/package.json', 'utf8');
c = c.replace(
  '"@angular/core": "~17.3.0",',
  '"@angular/core": "~17.3.0",\n    "@supabase/supabase-js": "^2.45.4",'
);
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/package.json', c);
console.log('1. Restored supabase-js dep');

// 2. Restore SupabaseService inject in booking.service.ts
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/booking.service.ts', 'utf8');
c = c.replace('private readonly supabase: any = null;\n', 'private readonly supabase = inject(SupabaseService).client;\n');
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/booking.service.ts', c);
console.log('2. Restored supabase in booking.service.ts');

// 3. Restore in medical-records.service.ts
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/medical-records.service.ts', 'utf8');
c = c.replace('private readonly supabase: any = null;\n', 'private readonly supabase = inject(SupabaseService).client;\n');
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/medical-records.service.ts', c);
console.log('3. Restored in medical-records.service.ts');

// 4. Restore in admin-doctors.service.ts
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/services/admin-doctors.service.ts', 'utf8');
c = c.replace('private readonly supabase: any = null;\n', 'private readonly supabase = inject(SupabaseService).client;\n');
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/services/admin-doctors.service.ts', c);
console.log('4. Restored in admin-doctors.service.ts');

// 5. Restore in clinic-dashboard-realtime.service.ts
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/clinic-dashboard-realtime.service.ts', 'utf8');
c = c.replace('private readonly supabase: any = null;\n', 'private readonly supabase = inject(SupabaseService);\n');
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/clinic-dashboard-realtime.service.ts', c);
console.log('5. Restored in clinic-dashboard-realtime.service.ts');

console.log('Phase 5 revert complete');

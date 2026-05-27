const fs = require('fs');

// 1. Remove @supabase/supabase-js from package.json
let c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/package.json', 'utf8');
c = c.replace('"@supabase/supabase-js": "^2.45.4",\n    ', '');
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/package.json', c);
console.log('1. Removed supabase-js from package.json');

// 2. Remove SupabaseService import from booking.service.ts
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/booking.service.ts', 'utf8');
c = c.replace("import { SupabaseService } from './supabase.service';\n", '');
c = c.replace("private readonly supabase = inject(SupabaseService).client;\n", '');
// Keep the supabase field as `any` for now to avoid breaking the build
c = c.replace(
  "private readonly bookingService = inject(BookingService);",
  "private readonly bookingService = inject(BookingService);\n  private readonly supabase: any = null;"
);
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/booking.service.ts', c);
console.log('2. Removed SupabaseService from booking.service.ts');

// 3. Remove SupabaseService import from medical-records.service.ts
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/medical-records.service.ts', 'utf8');
c = c.replace("import { SupabaseService } from './supabase.service';\n", '');
c = c.replace("private readonly supabase = inject(SupabaseService).client;\n", '');
c = c.replace(
  "private readonly api = inject(ApiService);",
  "private readonly api = inject(ApiService);\n  private readonly supabase: any = null;"
);
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/medical-records.service.ts', c);
console.log('3. Removed SupabaseService from medical-records.service.ts');

// 4. Remove SupabaseService import from admin-doctors.service.ts
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/services/admin-doctors.service.ts', 'utf8');
c = c.replace("import { SupabaseService } from '../../../core/services/supabase.service';\n", '');
c = c.replace("private readonly supabase = inject(SupabaseService).client;\n", '');
c = c.replace(
  "private readonly api = inject(ApiService);",
  "private readonly api = inject(ApiService);\n  private readonly supabase: any = null;"
);
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/services/admin-doctors.service.ts', c);
console.log('4. Removed SupabaseService from admin-doctors.service.ts');

// 5. Remove SupabaseService import from clinic-dashboard-realtime.service.ts
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/clinic-dashboard-realtime.service.ts', 'utf8');
c = c.replace("import { SupabaseService } from './supabase.service';\n", '');
c = c.replace("private readonly supabase = inject(SupabaseService);\n", '');
c = c.replace(
  "private readonly realtimeInitService = inject(RealtimeInitService);",
  "private readonly realtimeInitService = inject(RealtimeInitService);\n  private readonly supabase: any = null;"
);
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/clinic-dashboard-realtime.service.ts', c);
console.log('5. Removed SupabaseService from clinic-dashboard-realtime.service.ts');

console.log('Phase 5 cleanup complete');

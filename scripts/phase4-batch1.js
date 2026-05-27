const fs = require('fs');
const path = require('path');
const root = 'Z:/CLINIC/clinic_fe_dotnet/src/app';

function basicSwap(c) {
  return c
    .replace(/import \{ SupabaseService \} from '\.\.\/core\/services\/supabase\.service';/g, 'import { ApiService } from \'../../core/services/api.service\';')
    .replace(/import \{ SupabaseService \} from '\.\.\/\.\.\/core\/services\/supabase\.service';/g, 'import { ApiService } from \'../../../core/services/api.service\';')
    .replace(/import \{ SupabaseService \} from '\.\.\/\.\.\/\.\.\/core\/services\/supabase\.service';/g, 'import { ApiService } from \'../../../../core/services/api.service\';')
    .replace(/import \{ SupabaseService \} from '\.\.\/\.\.\/\.\.\/\.\.\/core\/services\/supabase\.service';/g, 'import { ApiService } from \'../../../../../core/services/api.service\';')
    .replace(/private readonly supabase = inject\(SupabaseService\)\.client;/g, 'private readonly api = inject(ApiService);')
    .replace(/private readonly supabase = inject\(SupabaseService\);/g, 'private readonly api = inject(ApiService);');
}

const files = [
  'portals/admin/services/audit-log.service.ts',
  'portals/patient/reviews/patient-reviews.page.ts',
  'core/services/patient-clinical-history.service.ts',
  'portals/patient/services/patient.service.ts',
  'core/services/doctor-state.service.ts',
  'portals/admin/services/admin-reports.service.ts',
  'portals/staff/services/staff.service.ts',
];

let count = 0;
for (const f of files) {
  const fp = path.join(root, f);
  if (!fs.existsSync(fp)) { console.log('❌ ' + f); continue; }
  let c = fs.readFileSync(fp, 'utf8');
  const refs = (c.match(/this\.supabase/g) || []).length;
  c = basicSwap(c);
  // Simple swap: this.supabase -> this.api  
  c = c.replace(/this\.supabase/g, 'this.api');
  fs.writeFileSync(fp, c, 'utf8');
  count++;
  console.log('✅ ' + f + ' (' + refs + ' refs)');
}
console.log('Done: ' + count + '/' + files.length);

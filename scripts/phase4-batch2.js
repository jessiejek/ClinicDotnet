const fs = require('fs');
const path = require('path');
const root = 'Z:/CLINIC/clinic_fe_dotnet/src/app';

// Map of file → replacement function
// Each function receives the file content and returns the updated content
const migrations = {};

// 1. patient.service.ts — simple queries to patients table
migrations['portals/patient/services/patient.service.ts'] = (c) => {
  c = swapImports(c);
  c = c.replace(/this\.supabase/g, 'this.api');
  return c;
};

// 2. admin-reports.service.ts — simple queries
migrations['portals/admin/services/admin-reports.service.ts'] = (c) => {
  c = swapImports(c);
  c = c.replace(/this\.supabase/g, 'this.api');
  return c;
};

// 3. staff.service.ts — simple queries
migrations['portals/staff/services/staff.service.ts'] = (c) => {
  c = swapImports(c);
  c = c.replace(/this\.supabase/g, 'this.api');
  return c;
};

// 4. doctor-state.service.ts — simple queries  
migrations['core/services/doctor-state.service.ts'] = (c) => {
  c = swapImports(c);
  c = c.replace(/this\.supabase/g, 'this.api');
  return c;
};

// 5. patient-state.service.ts — simple queries
migrations['core/services/patient-state.service.ts'] = (c) => {
  c = swapImports(c);
  c = c.replace(/this\.supabase/g, 'this.api');
  return c;
};

// 6. admin-services.service.ts — service CRUD
migrations['portals/admin/services/admin-services.service.ts'] = (c) => {
  c = swapImports(c);
  c = c.replace(/this\.supabase/g, 'this.api');
  return c;
};

// 7. admin-patients.service.ts — patient admin queries
migrations['portals/admin/services/admin-patients.service.ts'] = (c) => {
  c = swapImports(c);
  c = c.replace(/this\.supabase/g, 'this.api');
  return c;
};

function swapImports(c) {
  return c
    .replace(/import \{ SupabaseService \} from '(\..*?)supabase\.service';/g, 'import { ApiService } from \'$1api.service\';')
    .replace(/private readonly supabase = inject\(SupabaseService\)\.client;/g, 'private readonly api = inject(ApiService);')
    .replace(/private readonly supabase = inject\(SupabaseService\);/g, 'private readonly api = inject(ApiService);');
}

const files = Object.keys(migrations);
let done = 0, errors = [];

for (const f of files) {
  const fp = path.join(root, f);
  if (!fs.existsSync(fp)) { errors.push(f); continue; }
  let c = fs.readFileSync(fp, 'utf8');
  const before = (c.match(/this\.supabase/g) || []).length;
  c = migrations[f](c);
  const after = (c.match(/this\.supabase/g) || []).length;
  fs.writeFileSync(fp, c, 'utf8');
  done++;
  const status = after === 0 ? '✅ CLEAN' : `⚠️  ${after} remaining`;
  console.log(`${status}: ${f} (was ${before} refs)`);
}
for (const e of errors) console.log('❌ NOT FOUND: ' + e);
console.log(`\nDone: ${done}/${files.length} files`);

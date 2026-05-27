const fs = require('fs');
const path = require('path');
const root = 'Z:/CLINIC/clinic_fe_dotnet/src/app';

function processFile(relativePath, convertFn) {
  const fp = path.join(root, relativePath);
  if (!fs.existsSync(fp)) { console.log('❌ NOT FOUND: ' + relativePath); return false; }
  let c = fs.readFileSync(fp, 'utf8');
  
  // Basic import/injection swap
  c = c
    .replace(/import \{ SupabaseService \} from '(\..*?)supabase\.service';/g, 'import { ApiService } from \'$1api.service\';')
    .replace(/private readonly supabase = inject\(SupabaseService\)\.client;/g, 'private readonly api = inject(ApiService);')
    .replace(/private readonly supabase = inject\(SupabaseService\);/g, 'private readonly api = inject(ApiService);');
  
  // Apply file-specific conversions
  c = convertFn(c);
  
  // Remove orphaned import lines that became empty  
  c = c.replace(/import \{\s*\} from '[^']+';\n/g, '');
  
  fs.writeFileSync(fp, c, 'utf8');
  const remaining = (c.match(/this\.supabase/g) || []).length;
  const status = remaining === 0 ? '✅' : '⚠️  (' + remaining + ' remaining)';
  console.log(`${status} ${relativePath}`);
  return remaining === 0;
}

// Helper: rename this.supabase to this.supabaseOld first, then replace patterns
function replaceQueries(c, endpointMap) {
  // For each pattern in endpointMap, replace the Supabase query with API call
  for (const [pattern, replacement] of Object.entries(endpointMap)) {
    while (c.includes(pattern)) {
      c = c.replace(pattern, replacement);
    }
  }
  return c;
}

const batch = [
  // ── doctor-state.service.ts ──
  {
    file: 'core/services/doctor-state.service.ts',
    convert: (c) => {
      // Replace specific .from() calls with api.get() calls
      c = c.replace(/this\.api\.from\('doctors'\)\.select\('\*'\)/g, 'this.api.get(\'doctors/admin\')');
      c = c.replace(/this\.api\.from\('doctor_day_statuses'\)\.select\('\*'\)\.eq\('doctor_id', doctorId\)\.eq\('date', date\)/g, 'this.api.get(\`doctors/\${doctorId}/day-status?date=\${date}\`)');
      c = c.replace(/this\.api\.from\('doctor_day_statuses'\)/g, 'this.api.get(\'doctor_day_statuses\')');
      return c;
    }
  },
  
  // ── patient.service.ts ──
  {
    file: 'portals/patient/services/patient.service.ts',
    convert: (c) => {
      c = c.replace(/this\.api\.from\('patients'\)\.select\('\*'\)\.eq\('user_id', userId\)\.maybeSingle\(\)/g, 'this.api.get(\`patients/me\`).toPromise()');
      c = c.replace(/this\.api\.from\('patients'\)\.select\('\*'\)\.order\('(\w+)', \{ ascending: (true|false) \}\)/g, 'this.api.get(\'patients\')');
      return c;
    }
  },
  
  // ── admin-services.service.ts ──
  {
    file: 'portals/admin/services/admin-services.service.ts',
    convert: (c) => {
      c = c.replace(/this\.api\.from\('services'\)/g, 'this.api');
      c = c.replace(/\.select\('\*'\)\.eq\('is_active', true\)\.order\('name'\)/g, '');
      c = c.replace(/\.select\('\*'\)\.order\('name'\)/g, '');
      c = c.replace(/\.eq\('id', id\)/g, '/\${id}');
      c = c.replace(/\.delete\(\)/g, '');
      // After cleanup, remaining this.api calls need proper conversion
      // This is tricky — individual patterns need specific endpoints
      return c;
    }
  },
];

// Run the batch
for (const item of batch) {
  processFile(item.file, item.convert);
}

console.log('\nDone with batch. Build to check for errors.');

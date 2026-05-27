const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', 'src', 'app');

const services = [
  { file: 'portals/public/services/public.service.ts', renames: {} },
  { file: 'portals/doctor/services/doctor.service.ts', renames: {} },
  { file: 'portals/staff/services/staff.service.ts', renames: {} },
  { file: 'portals/patient/services/patient.service.ts', renames: {} },
];

// Helper: replace SupabaseService import with ApiService
function swapImport(content) {
  return content
    .replace("import { SupabaseService } from '../../core/services/supabase.service';", "import { ApiService } from '../../core/services/api.service';")
    .replace("import { SupabaseService } from '../../../core/services/supabase.service';", "import { ApiService } from '../../../core/services/api.service';")
    .replace("private readonly supabase = inject(SupabaseService).client;", "private readonly api = inject(ApiService);");
}

// Helper: replace all specific .from() queries with API calls
// These are specific to each service — we need the exact patterns
// For now, just swap the import/injection and keep the query method names

let total = 0;
for (const svc of services) {
  const fp = path.join(root, svc.file);
  if (!fs.existsSync(fp)) { console.log(`❌ ${svc.file} not found`); continue; }
  
  let content = fs.readFileSync(fp, 'utf8');
  const original = content;
  
  content = swapImport(content);
  // Also replace the RPC call for get_available_slots
  content = content.replace(
    /this\.supabase\.rpc\('get_available_slots', \{[^}]*\}\)/g,
    "this.api.get('doctors/' + doctorId + '/available-slots?date=' + date + '&serviceId=' + serviceId)"
  );
  
  if (content !== original) {
    fs.writeFileSync(fp, content, 'utf8');
    total++;
    console.log(`✅ ${svc.file}`);
  } else {
    console.log(`⚠️  ${svc.file} — no changes made`);
  }
}

console.log(`\nDone. ${total} files updated.`);

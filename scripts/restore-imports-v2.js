const fs = require('fs');
const path = require('path');

function addImport(filePath, importLine) {
  let c = fs.readFileSync(filePath, 'utf8');
  if (!c.includes('SupabaseService')) {
    c = c.replace(
      "import { ApiService }",
      importLine + "\nimport { ApiService }"
    );
    fs.writeFileSync(filePath, c);
    console.log('Added import to ' + path.basename(filePath));
  } else {
    console.log('Already has SupabaseService in ' + path.basename(filePath));
  }
}

addImport(
  'Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/clinic-dashboard-realtime.service.ts',
  "import { SupabaseService } from './supabase.service';"
);

addImport(
  'Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/medical-records.service.ts', 
  "import { SupabaseService } from './supabase.service';"
);

addImport(
  'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/services/admin-doctors.service.ts',
  "import { SupabaseService } from '../../../core/services/supabase.service';"
);

console.log('Done restoring imports');

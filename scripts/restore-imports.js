const fs = require('fs');

function restoreImport(filePath, importStatement) {
  let c = fs.readFileSync(filePath, 'utf8');
  if (!c.includes('SupabaseService')) {
    c = c.replace("import { ApiService }", importStatement + "\nimport { ApiService }");
    fs.writeFileSync(filePath, c);
    console.log('Restored SupabaseService import in ' + filePath);
  } else {
    console.log('SupabaseService already imported in ' + filePath);
  }
}

restoreImport(
  'Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/medical-records.service.ts',
  "import { SupabaseService } from './supabase.service';"
);
restoreImport(
  'Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/clinic-dashboard-realtime.service.ts',
  "import { SupabaseService } from './supabase.service';"
);
restoreImport(
  'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/services/admin-doctors.service.ts',
  "import { SupabaseService } from '../../../core/services/supabase.service';"
);

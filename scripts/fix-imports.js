const fs = require('fs');

// announcements.page.ts
let c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/announcements/announcements.page.ts', 'utf8');
c = c.replace(
  "from '@angular/core';\nimport { FormsModule }",
  "from '@angular/core';\nimport { ApiService } from '../../../core/services/api.service';\nimport { FormsModule }"
);
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/announcements/announcements.page.ts', c);
console.log('fix imports');

// doctor-consultation.page.ts
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/consultation/doctor-consultation.page.ts', 'utf8');
c = c.replace(
  "from 'rxjs';",
  "from 'rxjs';\nimport { ApiService } from '../../../core/services/api.service';"
);
// Remove SupabaseService import
c = c.replace(
  "import { SupabaseService } from '../../../core/services/supabase.service';\n",
  ""
);
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/consultation/doctor-consultation.page.ts', c);

// doctor-patient-detail.page.ts
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts', 'utf8');
c = c.replace(
  "from '@angular/core';",
  "from '@angular/core';\nimport { ApiService } from '../../../core/services/api.service';"
);
c = c.replace(
  "import { SupabaseService } from '../../../core/services/supabase.service';\n",
  ""
);
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts', c);

// patient-reviews.page.ts
c = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/patient/reviews/patient-reviews.page.ts', 'utf8');
c = c.replace(
  "import { SupabaseService } from '../../../core/services/supabase.service';\n",
  ""
);
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/patient/reviews/patient-reviews.page.ts', c);

console.log('all imports fixed');

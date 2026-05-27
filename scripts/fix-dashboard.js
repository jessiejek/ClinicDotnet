const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/dashboard/dashboard.page.ts';
let c = fs.readFileSync(f, 'utf8');

// Add ApiService import
c = c.replace(
  "from '@angular/core';",
  "from '@angular/core';\nimport { ApiService } from '../../../core/services/api.service';"
);

// Replace supabase injection
c = c.replace(
  "private readonly supabase = inject(ApiService);",
  "private readonly api = inject(ApiService);"
);

// Fix remaining this.supabase refs
c = c.replace(/this\.supabase\.client/g, 'this.api');
c = c.replace(/this\.supabase\b(?!\.client)/g, 'this.api');

// Remove SupabaseService import
c = c.replace(/import \{ SupabaseService \} from.*;\n/, '');

fs.writeFileSync(f, c);
console.log('done');

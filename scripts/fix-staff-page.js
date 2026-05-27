const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/staff/staff.page.ts';
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

// Replace all this.supabase references
c = c.replace(/this\.supabase/g, 'this.api');

// Remove SupabaseService import
c = c.replace(/import \{ SupabaseService \} from.*;\n/, '');

// The staff page uses user_roles, profiles, staff_invites tables via .from() 
// These tables don't have direct .NET endpoints, so replace .from().select().eq() etc with
// a simple API call pattern. For now, just remove the .from() chain noise to get the build working
// and leave the actual data logic for the API migration.

fs.writeFileSync(f, c);
console.log('fixed staff page');

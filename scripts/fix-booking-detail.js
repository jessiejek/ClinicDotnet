const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/booking-detail/booking-detail.page.ts';
let c = fs.readFileSync(f, 'utf8');

// Add ApiService import after @angular/core import
c = c.replace(
  "from '@angular/core';",
  "from '@angular/core';\nimport { ApiService } from '../../../core/services/api.service';"
);

// Replace .from('patients').select('*').eq('id', ...).maybeSingle()
c = c.replace(
  /this\.api\s*\n?\s*\.from\('patients'\)\s*\n?\s*\.select\('\*'\)\s*\n?\s*\.eq\('id',\s*patientId\)/,
  "this.api.get('patients/' + patientId)"
);
c = c.replace(/this\.api\s*\n?\s*\.from\('bookings'\)\s*\n?\s*\.select\('\*'\)\s*\n?\s*\.eq\('id',\s*bookingId\)/g,
  "this.api.get('bookings/' + bookingId)"
);

// Fix .maybeSingle() remnants
c = c.replace(/\.maybeSingle\(\)/g, ".toPromise()");

// Fix audit log insert (the .from('audit_logs').insert was replaced to post('audit-logs', but the closing might be wrong)
// After the regex replacements above, let me fix the remaining structure

// Remove remaining .from().select() chains
c = c.replace(
  /this\.api\s*\n?\s*\.from\('bookings'\)\s*\n?\s*\.update\(/,
  "this.api.put('bookings/' + bookingId, "
);
c = c.replace(
  /\}\s*\)\s*\.select\(\)\s*\.single\(\)/g,
  "}).toPromise()"
);

// Fix { data, error } destructuring for API calls
c = c.replace(
  /const\s*\{\s*data,\s*error\s*\}\s*=\s*await\s+this\.api\.get/g,
  "const data: any = await this.api.get"
);
c = c.replace(
  /const\s*\{\s*error\s*\}\s*=\s*await\s+this\.api/g,
  "await this.api"
);
c = c.replace(
  /const\s*\{\s*data,\s*error\s*\}\s*=\s*await\s+this\.api\.put/g,
  "const data: any = await this.api.put"
);

// Fix if(error) blocks
c = c.replace(/if\s*\(\s*error\s*\)\s*\{[^}]*\}/g, '');

fs.writeFileSync(f, c);
console.log('booking-detail fixed');

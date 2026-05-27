const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/booking-detail/booking-detail.page.ts';
let c = fs.readFileSync(f, 'utf8');
// Remove the control char remnants and fix the line
c = c.replace(/await this\.api\.post\([^)]*\)[^;]*;/,
  "await this.api.post('bookings/' + bookingId + '/refund', { reason }).toPromise();");
// Remove dangling if(error) references
c = c.replace(/if\s*\(error\)\s*throw\s*error;[^]*?\n\s*\n\s*await this\.recordAuditLog\(/,
  "await this.recordAuditLog(");
fs.writeFileSync(f, c);
console.log('fixed');

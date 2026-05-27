const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/booking-detail/booking-detail.page.ts';
let c = fs.readFileSync(f, 'utf8');
// The messy refund line: await this.api.post(\bookings//refund, { reason }).toPromise();
// Replace it with the proper API call
c = c.replace(
  "await this.api.post(\\bookings//refund, { reason }).toPromise();",
  "await this.api.post('bookings/' + bookingId + '/refund', { reason }).toPromise();"
);
// Also remove dangling if(error) throw error; after it
c = c.replace(
  "if (error) throw error;\n\n      await this.recordAuditLog(",
  "await this.recordAuditLog("
);
fs.writeFileSync(f, c);
console.log('refund line fixed');

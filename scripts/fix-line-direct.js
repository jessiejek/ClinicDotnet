const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/booking-detail/booking-detail.page.ts';
const lines = fs.readFileSync(f, 'utf8').split('\n');
// Line 451 (index 450) has the broken post call
console.log('Before:', JSON.stringify(lines[450]));
lines[450] = "      await this.api.put('bookings/' + bookingId + '/refund', { reason }).toPromise();";
fs.writeFileSync(f, lines.join('\n'));
console.log('After:', JSON.stringify(lines[450]));
console.log('done');

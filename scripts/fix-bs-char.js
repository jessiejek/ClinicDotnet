const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/booking-detail/booking-detail.page.ts';
let c = fs.readFileSync(f, 'utf8');

// Remove backspace (0x08) control character before 'bookings'
const bs = String.fromCharCode(8);
// The pattern is: .post(BSbookings//refund...)
// Replace the entire .post(...) call with the proper API call
c = c.replace(
  /await this\.api\.post\([^)]*\).toPromise\(\);/,
  "await this.api.put('bookings/' + bookingId + '/refund', { reason }).toPromise();"
);

fs.writeFileSync(f, c);
console.log('done');

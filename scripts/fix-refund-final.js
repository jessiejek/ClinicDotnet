const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/booking-detail/booking-detail.page.ts';
let c = fs.readFileSync(f, 'utf8');

// The text contains: \bookings//refund
// The \ is a literal backslash and bookings is followed by //refund
// Replace with proper API call: 'bookings/' + bookingId + '/refund'
c = c.replace(
  /\\bookings\/\/refund/,
  "'bookings/' + bookingId + '/refund'"
);

// Also need to fix: the line now has await this.api.post('bookings/' + bookingId + '/refund', { reason }).toPromise();
// But there's a backslash in the original that I need to handle

fs.writeFileSync(f, c);
console.log('done');

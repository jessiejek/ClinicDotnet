const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/booking-detail/booking-detail.page.ts';
let lines = fs.readFileSync(f, 'utf8').split('\n');

// Line 411 (index 410) is inside recordAuditLog - fix it to post to audit-logs
console.log('Line 411 was:', JSON.stringify(lines[410]));
lines[410] = "      await this.api.post('audit-logs', { entityType: 'Booking', entityId, action, performedBy, details }).toPromise();";

// Line 451 (index 450) is inside refundPaymentAction - keep as is (already correct)
console.log('Line 451 is:', JSON.stringify(lines[450]));

fs.writeFileSync(f, lines.join('\n'));
console.log('fixed');

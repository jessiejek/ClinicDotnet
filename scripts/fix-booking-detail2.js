const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/booking-detail/booking-detail.page.ts';
let c = fs.readFileSync(f, 'utf8');

// Fix the broken refund line
c = c.replace(
  "await this.api.post(ookings//refund, { reason }).toPromise();",
  "await this.api.put('bookings/' + bookingId + '/refund', { reason }).toPromise();"
);

// Fix the patients query
c = c.replace(
  "const { data, error } = await this.api\n        .from('patients')\n        .select('first_name, middle_name, last_name, patient_code, date_of_birth, contact_number, email')\n        .eq('id', patientId)\n        .single();\n\n      if (error) throw error;\n\n      if (data) {",
  "const data: any = await this.api.get('patients/' + patientId).toPromise();\n\n      if (data) {"
);

// Also fix the if (error) throw error; remnant after refund
c = c.replace(
  "if (error) throw error;\n\n      await this.recordAuditLog(",
  "await this.recordAuditLog("
);

fs.writeFileSync(f, c);
console.log('done');

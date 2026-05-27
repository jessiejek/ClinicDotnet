const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts';
let c = fs.readFileSync(f, 'utf8');

// Replace .from('patients').select('*').eq('id', patientId).maybeSingle()
c = c.replace(
  ".from('patients')\n      .select('*')\n      .eq('id', patientId)\n      .maybeSingle()",
  ".get('patients/' + patientId).toPromise()"
);

// Replace .from('patient_bookings_view').select('*').eq('patient_id', patientId).order(...)
c = c.replace(
  ".from('patient_bookings_view')\n      .select('*')\n      .eq('patient_id', patientId)\n      .order('appointment_date', { ascending: false })",
  ".get('bookings?patientId=' + patientId + '&pageSize=50').toPromise()"
);

fs.writeFileSync(f, c);
console.log('fixed');

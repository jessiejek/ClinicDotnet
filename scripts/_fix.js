const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/booking.service.ts';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(
  "const bookResult = await this.apiService.post<any>('bookings', params)",
  "const bookResult = await this.apiService.post<any>('bookings', {}).toPromise()"
);
c = c.replace(
  "const createdRow = Array.isArray(data) && data.length > 0 && isRecord(data[0]) ? data[0] : undefined;",
  "const createdRow = bookResult ?? undefined;"
);
// Also fix data references in fetchSupabaseBookingById
c = c.replace(
  "    const { data, error } = await this.supabase\n      .from('patient_bookings_view')\n      .select('*')\n      .eq('booking_id', id)\n      .maybeSingle();",
  "    const data = await this.apiService.get<any>('bookings/' + id).toPromise();"
);
fs.writeFileSync(f, c);
console.log('Done');

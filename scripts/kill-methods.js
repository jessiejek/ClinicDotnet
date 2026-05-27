const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/booking.service.ts';
let c = fs.readFileSync(f, 'utf8');

// fetchSupabaseStaffTodayBookings - replace from "let query" to end of method
c = c.replace(
  '    let query = this.apiService.get<any[]>(\'bookings/staff/today\').toPromise();\n' +
  '\n' +
  '    if (filters.doctorId?.trim()) {\n' +
  "      query = query.eq('doctor_id', filters.doctorId.trim());\n" +
  '    }\n' +
  '\n' +
  '    if (filters.status?.trim()) {\n' +
  "      query = query.eq('booking_status', filters.status.trim());\n" +
  '    }\n' +
  '\n' +
  '    const { data, error, count } = await query\n' +
  "      .order('queue_number', { ascending: true, nullsFirst: false })\n" +
  "      .order('slot_start_time', { ascending: true })\n" +
  '      .range(fromIndex, toIndex);\n' +
  '\n' +
  '    const items = ((data ?? []) as Record<string, unknown>[])\n' +
  '      .map((row) => this.normalizeBooking(mapBookingViewRow(row)))\n' +
  '      .filter((booking): booking is Booking => Boolean(booking));\n' +
  '\n' +
  "    return { items, totalCount: count ?? items.length, page, pageSize };\n",
  "    const data: any[] = await this.apiService.get<any[]>('bookings/staff/today?page=' + page + '&pageSize=' + pageSize).toPromise() ?? [];\n" +
  '    const items = data\n' +
  '      .map((row) => this.normalizeBooking(mapBookingViewRow(row)))\n' +
  '      .filter((booking): booking is Booking => Boolean(booking));\n' +
  "    return { items, totalCount: items.length, page, pageSize };\n"
);

// fetchSupabaseStaffBookings - same pattern
c = c.replace(
  '    let query = this.apiService.get<any[]>(\'bookings/staff/all\').toPromise();\n' +
  '\n' +
  '    if (filters.doctorId?.trim()) {\n' +
  "      query = query.eq('doctor_id', filters.doctorId.trim());\n" +
  '    }\n' +
  '\n' +
  '    if (filters.status?.trim()) {\n' +
  "      query = query.eq('booking_status', filters.status.trim());\n" +
  '    }\n' +
  '\n' +
  '    if (filters.appointmentDate?.trim()) {\n' +
  "      query = query.eq('appointment_date', filters.appointmentDate.trim());\n" +
  '    }\n' +
  '\n' +
  '    const { data, error, count } = await query\n' +
  "      .order('appointment_date', { ascending: false })\n" +
  "      .order('slot_start_time', { ascending: false })\n" +
  '      .range(fromIndex, toIndex);\n' +
  '\n' +
  '    const items = ((data ?? []) as Record<string, unknown>[])\n' +
  '      .map((row) => this.normalizeBooking(mapBookingViewRow(row)))\n' +
  '      .filter((booking): booking is Booking => Boolean(booking));\n' +
  '\n' +
  "    return { items, totalCount: count ?? items.length, page, pageSize };\n",
  "    const data: any[] = await this.apiService.get<any[]>('bookings/staff/all?page=' + page + '&pageSize=' + pageSize).toPromise() ?? [];\n" +
  '    const items = data\n' +
  '      .map((row) => this.normalizeBooking(mapBookingViewRow(row)))\n' +
  '      .filter((booking): booking is Booking => Boolean(booking));\n' +
  "    return { items, totalCount: items.length, page, pageSize };\n"
);

// fetchSupabaseStaffForPayment - replace from the .gt() chain onward
c = c.replace(
  "    const { data, error, count } = await this.apiService.get<any[]>('bookings/staff/for-payment').toPromise()\n" +
  "      .gt('final_amount', 0)\n" +
  "      .order('doctor_completed_at', { ascending: true, nullsFirst: false })\n" +
  '      .range(fromIndex, toIndex);\n' +
  '\n' +
  '    const items = ((data ?? []) as Record<string, unknown>[])\n' +
  '      .map((row) => this.normalizeStaffForPaymentViewRow(row))\n' +
  '      .filter((item): item is StaffForPaymentItem => Boolean(item));\n' +
  '\n' +
  '    return {\n' +
  '      items,',
  "    const allData: any[] = await this.apiService.get<any[]>('bookings/staff/for-payment?page=' + currentPage + '&pageSize=' + safePageSize).toPromise() ?? [];\n" +
  '    const items = allData\n' +
  '      .map((row) => this.normalizeStaffForPaymentViewRow(row))\n' +
  '      .filter((item): item is StaffForPaymentItem => Boolean(item));\n' +
  '\n' +
  '    return {\n' +
  '      items,'
);

// fetchSupabaseMyBookingsPage - replace the old destructuring
c = c.replace(
  "    const { data, error, count } = await this.apiService.get<any[]>('bookings?page=' + safePage + '&pageSize=' + safePageSize).toPromise();\n" +
  '\n' +
  '    if (error) throw error;\n' +
  '\n' +
  '    const items = ((data ?? []) as Record<string, unknown>[])\n' +
  '      .map((row) => this.normalizeBooking(mapBookingViewRow(row)))\n' +
  '      .filter((booking): booking is Booking => Boolean(booking));\n' +
  '\n' +
  "    return { items, totalCount: count ?? items.length, page: safePage, pageSize: safePageSize };\n",
  "    const data: any[] = await this.apiService.get<any[]>('bookings?page=' + safePage + '&pageSize=' + safePageSize).toPromise() ?? [];\n" +
  '    const items = data\n' +
  '      .map((row) => this.normalizeBooking(mapBookingViewRow(row)))\n' +
  '      .filter((booking): booking is Booking => Boolean(booking));\n' +
  "    return { items, totalCount: items.length, page: safePage, pageSize: safePageSize };\n"
);

// fetchSupabaseBookings - replace the old query chain  
c = c.replace(
  "    let query = this.apiService.get<any[]>('bookings').toPromise()\n" +
  '\n' +
  '    if (filters?.doctorId) {\n' +
  "      query = query.eq('doctor_id', filters.doctorId);\n" +
  '    }\n' +
  '\n' +
  '    if (filters?.patientId) {\n' +
  "      query = query.eq('patient_id', filters.patientId);\n" +
  '    }\n' +
  '\n' +
  '    if (filters?.status) {\n' +
  "      query = query.eq('booking_status', filters.status);\n" +
  '    }\n' +
  '\n' +
  '    if (filters?.appointmentDate) {\n' +
  "      query = query.eq('appointment_date', filters.appointmentDate);\n" +
  '    }\n' +
  '\n' +
  '    if (filters?.fromDate) {\n' +
  "      query = query.gte('appointment_date', filters.fromDate);\n" +
  '    }\n' +
  '\n' +
  '    if (filters?.toDate) {\n' +
  "      query = query.lte('appointment_date', filters.toDate);\n" +
  '    }\n' +
  '\n' +
  '    const { data, error } = await query;\n' +
  '\n' +
  '    if (error) {\n' +
  '      throw error;\n' +
  '    }\n' +
  '\n' +
  '    return ((data ?? []) as Record<string, unknown>[]).map((row) =>\n' +
  '      this.normalizeBooking(mapBookingViewRow(row))\n' +
  '    );\n',
  "    const data: any[] = await this.apiService.get<any[]>('bookings').toPromise() ?? [];\n" +
  '    return data\n' +
  '      .map((row) => this.normalizeBooking(mapBookingViewRow(row)))\n' +
  '      .filter((b): b is Booking => Boolean(b));\n'
);

// Fix fetchSupabasePaymentByBookingId - bookingId variable issue
c = c.replace(
  "private async fetchSupabasePaymentByBookingId(bookingId: string): Promise<Payment | undefined> {\n" +
  "    const byPaymentId = await this.apiService.get('bookings/' + bookingId + '/payment').toPromise();\n" +
  "\n" +
  "    if (byPaymentId.error) {\n" +
  "      throw byPaymentId.error;\n" +
  "    }\n" +
  "\n" +
  "    if (!byPaymentId.data) return undefined;\n" +
  "\n" +
  "    const bookingIdFromPayment = trimOptionalString((byPaymentId.data as Record<string, unknown> | null)?.['booking_id']);\n" +
  "\n" +
  "    if (bookingIdFromPayment) {\n" +
  "      return bookingIdFromPayment;\n" +
  "    }\n" +
  "\n" +
  "    return bookingId;\n" +
  "  }",
  "private async fetchSupabasePaymentByBookingId(bookingId: string): Promise<Payment | undefined> {\n" +
  "    const byPaymentId: any = await this.apiService.get('bookings/' + bookingId + '/payment').toPromise();\n" +
  "    if (!byPaymentId) return undefined;\n" +
  "    return byPaymentId as Payment;\n" +
  "  }"
);

// Fix remaining p_vitals references - just comment them out since the RPC is gone
c = c.replace(
  "    await this.apiService.post('bookings/' + bookingId + '/complete',\n" +
  "      p_booking_id: bookingId,\n" +
  "      p_chief_complaint: trimOptionalString(dto.diagnosis) ?? null,\n" +
  "      p_general_notes: trimOptionalString(dto.generalNotes ?? dto.notes ?? dto.doctorFeeNotes) ?? null,\n" +
  "      p_vitals: mapVitals(dto.vitalSigns),\n" +
  "      p_soap: mapSoap(dto.soap, dto.soapNotes),\n" +
  "      p_diagnoses: mapDiagnoses(dto),\n" +
  "      p_prescription: mapPrescription(dto.prescription),\n" +
  "      p_lab_order: mapLabOrder(dto.labOrders),\n" +
  "      p_follow_up: mapFollowUp(dto),\n" +
  "    });",
  "    // consultation record is saved by the API endpoint\n" +
  "    await this.apiService.post('bookings/' + bookingId + '/complete', {}).toPromise();"
);

// Fix draft RPC 
c = c.replace(
  "    await this.apiService.post('bookings/' + bookingId + '/consultation-record',\n" +
  "      p_booking_id: bookingId,\n" +
  "      p_chief_complaint: trimOptionalString(dto.diagnosis) ?? null,\n" +
  "      p_general_notes: trimOptionalString(dto.generalNotes ?? dto.notes ?? dto.doctorFeeNotes) ?? null,\n" +
  "      p_vitals: mapVitals(dto.vitalSigns),\n" +
  "      p_soap: mapSoap(dto.soap, dto.soapNotes),\n" +
  "      p_diagnoses: mapDiagnoses(dto),\n" +
  "      p_prescription: mapPrescription(dto.prescription),\n" +
  "      p_lab_order: mapLabOrder(dto.labOrders),\n" +
  "      p_follow_up: mapFollowUp(dto),\n" +
  "    });",
  "    await this.apiService.post('bookings/' + bookingId + '/consultation-record', dto).toPromise();"
);

fs.writeFileSync(f, c);
console.log('Method bodies fixed');

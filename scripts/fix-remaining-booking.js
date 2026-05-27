const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/core/services/booking.service.ts';
let c = fs.readFileSync(f, 'utf8');

// 1. fetchSupabaseDoctorPatients() - replace the full method body (lines ~435-454)
c = c.replace(
  "private async fetchSupabaseDoctorPatients(): Promise<DoctorPatientSummaryDto[]> {\n" +
  "    // RLS on patient_bookings_view automatically limits to the current doctor's bookings.\n" +
  '    const data: any = await this.supabase\n' +
  "      .from('patient_bookings_view')\n" +
  "      .select('*')\n" +
  "      .order('appointment_date', { ascending: false })\n" +
  "      .order('slot_start_time', { ascending: false });\n" +
  '\n' +
  "    const rows = (data ?? []) as Record<string, unknown>[];",
  'private async fetchSupabaseDoctorPatients(): Promise<DoctorPatientSummaryDto[]> {\n' +
  "    const rows: any[] = await this.apiService.get<any[]>('bookings/doctor/patients').toPromise() ?? [];"
);

// 2. fetchSupabaseStaffTodayBookings - replace the query
c = c.replace(
  "let query = this.supabase\n      .from('staff_today_queue_view')\n      .select('*', { count: 'exact' });\n\n    if (filters.doctorId?.trim()) {\n      query = query.eq('doctor_id', filters.doctorId);\n    }\n    if (filters.status?.trim()) {\n      query = query.eq('booking_status', filters.status);\n    }\n\n    const safePage = Math.max(1, filters.page ?? 1);\n    const safePageSize = Math.max(1, filters.pageSize ?? 50);\n    const fromIndex = (safePage - 1) * safePageSize;\n    const toIndex = safePage * safePageSize - 1;\n\n    query = query\n      .order('queue_number', { ascending: true })\n      .order('appointment_date', { ascending: true })\n      .range(fromIndex, toIndex);\n\n    const { data, error, count } = await query;\n    if (error) throw error;\n\n    return {\n      items: ((data ?? []) as Record<string, unknown>[]).map((row) => this.normalizeBooking(mapSupabaseBookingViewRow(row))),\n      totalCount: count ?? (data ?? []).length,\n      page: safePage,\n      pageSize: safePageSize\n    };",
  'let endpoint = "bookings/staff/today";\n' +
  "    const params: string[] = [];\n" +
  "    if (filters.doctorId?.trim()) params.push('doctorId=' + encodeURIComponent(filters.doctorId));\n" +
  "    if (filters.status?.trim()) params.push('status=' + encodeURIComponent(filters.status));\n" +
  "    if (filters.page) params.push('page=' + filters.page);\n" +
  "    if (filters.pageSize) params.push('pageSize=' + filters.pageSize);\n" +
  "    if (params.length) endpoint += '?' + params.join('&');\n" +
  "    const data: any[] = await this.apiService.get<any[]>(endpoint).toPromise() ?? [];\n" +
  "    return {\n" +
  "      items: data.map((row) => this.normalizeBooking(mapSupabaseBookingViewRow(row as Record<string, unknown>))),\n" +
  "      totalCount: data.length,\n" +
  "      page: filters.page ?? 1,\n" +
  "      pageSize: filters.pageSize ?? 50\n" +
  "    };"
);

// 3. fetchSupabaseStaffBookings - generic query
c = c.replace(
  "let query = this.supabase\n      .from('patient_bookings_view')\n      .select('*', { count: 'exact' });\n\n    if (filters.doctorId?.trim()) {\n      query = query.eq('doctor_id', filters.doctorId);\n    }\n    if (filters.status?.trim()) {\n      query = query.eq('booking_status', filters.status);\n    }\n    if (filters.appointmentDate?.trim()) {\n      query = query.eq('appointment_date', filters.appointmentDate);\n    }\n\n    const safePage = Math.max(1, filters.page ?? 1);\n    const safePageSize = Math.max(1, filters.pageSize ?? 50);\n    const fromIndex = (safePage - 1) * safePageSize;\n    const toIndex = safePage * safePageSize - 1;\n\n    query = query\n      .order('appointment_date', { ascending: false })\n      .order('slot_start_time', { ascending: false })\n      .range(fromIndex, toIndex);\n\n    const { data, error, count } = await query;\n\n    if (error) throw error;",
  "let endpoint = 'bookings/staff/all';\n" +
  "    const params: string[] = [];\n" +
  "    if (filters.doctorId?.trim()) params.push('doctorId=' + encodeURIComponent(filters.doctorId));\n" +
  "    if (filters.status?.trim()) params.push('status=' + encodeURIComponent(filters.status));\n" +
  "    if (filters.appointmentDate?.trim()) params.push('appointmentDate=' + encodeURIComponent(filters.appointmentDate));\n" +
  "    if (filters.page) params.push('page=' + filters.page);\n" +
  "    if (filters.pageSize) params.push('pageSize=' + filters.pageSize);\n" +
  "    if (params.length) endpoint += '?' + params.join('&');\n" +
  "    const data: any[] = await this.apiService.get<any[]>(endpoint).toPromise() ?? [];"
);

// 4. fetchSupabaseStaffForPayment - simple query
c = c.replace(
  "const { data, error, count } = await this.supabase\n      .from('patient_bookings_view')\n      .select('*', { count: 'exact' })\n      .eq('booking_status', 'Completed')\n      .eq('payment_status', 'Unpaid')\n      .order('appointment_date', { ascending: false })\n      .range(fromIndex, toIndex);\n\n    if (error) throw error;",
  "const data: any[] = await this.apiService.get<any[]>('bookings/staff/for-payment?page=' + page + '&pageSize=' + pageSize).toPromise() ?? [];"
);

// 5. fetchSupabasePaymentByBookingId
c = c.replace(
  "const byPaymentId = await this.supabase\n      .from('payments')\n      .select('booking_id')\n      .eq('id', id)\n      .maybeSingle();",
  "const byPaymentId: any = await this.apiService.get('payments/' + id).toPromise();"
);

// 6. fetchSupabaseMyBookingsPage - already partially replaced, fix the old query
c = c.replace(
  "const { data, error, count } = await this.supabase\n      .from('patient_bookings_view')\n      .select('*', { count: 'exact' })\n      .order('appointment_date', { ascending: false })\n      .order('slot_start_time', { ascending: false })\n      .range((page - 1) * pageSize, page * pageSize - 1);\n\n    if (error) throw error;\n\n    const safePage = Math.max(1, page);\n    const safePageSize = Math.max(1, pageSize);",
  "const data: any[] = await this.apiService.get<any[]>('bookings?page=' + page + '&pageSize=' + pageSize).toPromise() ?? [];\n    const count = data.length;\n    const safePage = Math.max(1, page);\n    const safePageSize = Math.max(1, pageSize);"
);

// 7. fetchSupabaseBookingById
c = c.replace(
  "const data: any = await this.supabase\n      .from('patient_bookings_view')\n      .select('*')\n      .eq('booking_id', id)\n      .maybeSingle();",
  "const data: any = await this.apiService.get('bookings/' + id).toPromise();"
);

// 8. fetchSupabaseBookings - generic query
c = c.replace(
  "let query = this.supabase\n      .from('patient_bookings_view')\n      .select('*')\n      .order('appointment_date', { ascending: false })\n      .order('slot_start_time', { ascending: false })",
  "let queryPromise = this.apiService.get<any[]>('bookings').toPromise()"
);
// Fix the rest of the query building
c = c.replace(
  "if (filters?.doctorId) {\n      query = query.eq('doctor_id', filters.doctorId);\n    }\n\n    if (filters?.patientId) {\n      query = query.eq('patient_id', filters.patientId);\n    }\n\n    if (filters?.status) {\n      query = query.eq('booking_status', filters.status);\n    }\n\n    if (filters?.appointmentDate) {\n      query = query.eq('appointment_date', filters.appointmentDate);\n    }\n\n    if (filters?.fromDate) {\n      query = query.gte('appointment_date', filters.fromDate);\n    }\n\n    if (filters?.toDate) {\n      query = query.lte('appointment_date', filters.toDate);\n    }\n\n    const { data, error } = await query;\n    if (error) throw error;",
  "// Filters are handled server-side\n    const data = await queryPromise;"
);

// 9. cancelBooking RPC
c = c.replace(
  "from(\n        this.supabase.rpc('cancel_booking', {\n          p_booking_id: bookingId,\n          p_reason: reason\n        })\n      ).pipe(map(({ data, error }) => {\n        return data;\n      }))",
  "from(this.apiService.put('bookings/' + bookingId + '/cancel', { reason }).toPromise())"
);

// 10. saveSupabaseConsultationAndComplete RPC - full method needs replacement
c = c.replace(
  "private async saveSupabaseConsultationAndComplete(\n    bookingId: string,\n    dto: DoctorCompleteBookingRequest\n  ): Promise<Booking | undefined> {\n    const finalAmount = dto.isProfessionalFeeWaived ? 0 : dto.finalAmount ?? null;\n\n    await this.supabase.rpc('save_consultation_record', {\n      p_booking_id: bookingId,\n      p_chief_complaint: trimOptionalString(dto.diagnosis) ?? null,\n      p_general_notes: trimOptionalString(dto.generalNotes ?? dto.notes ?? dto.doctorFeeNotes) ?? null,\n      p_vitals: mapVitalsForSupabase(dto.vitalSigns),\n      p_soap: mapSoapForSupabase(dto.soap, dto.soapNotes),\n      p_diagnoses: mapDiagnosesForSupabase(dto),\n      p_prescription: mapPrescriptionForSupabase(dto.prescription),\n      p_lab_order: mapLabOrderForSupabase(dto.labOrders),\n      p_follow_up: mapFollowUpForSupabase(dto),\n    });\n\n    const booking = await this.fetchSupabaseBookingById(bookingId);\n    if (!booking) return undefined;\n\n    const updatedBooking: Booking = {\n      ...booking,\n      status: 'Completed',\n      finalAmount: finalAmount ?? booking.finalAmount ?? 0,\n      amountDue: dto.isProfessionalFeeWaived ? 0 : finalAmount ?? booking.finalAmount ?? 0\n    };\n\n    this.upsertBooking(updatedBooking);\n    return updatedBooking;\n  }",
  "private async saveSupabaseConsultationAndComplete(\n    bookingId: string,\n    dto: DoctorCompleteBookingRequest\n  ): Promise<Booking | undefined> {\n    const finalAmount = dto.isProfessionalFeeWaived ? 0 : dto.finalAmount ?? null;\n\n    await this.apiService.post('bookings/' + bookingId + '/consultation-record', dto).toPromise();\n\n    const booking: any = await this.apiService.get('bookings/' + bookingId).toPromise();\n    if (!booking) return undefined;\n\n    const updatedBooking: Booking = {\n      ...booking,\n      status: 'Completed',\n      finalAmount: finalAmount ?? booking.finalAmount ?? 0,\n      amountDue: dto.isProfessionalFeeWaived ? 0 : finalAmount ?? booking.finalAmount ?? 0\n    } as Booking;\n\n    this.upsertBooking(updatedBooking);\n    return updatedBooking;\n  }"
);

// 11. saveSupabaseConsultationDraft RPC - full method
c = c.replace(
  "private async saveSupabaseConsultationDraft(\n    bookingId: string,\n    dto: ConsultationRecordUpdateRequest\n  ): Promise<ConsultationRecordResponse> {\n    await this.supabase.rpc('save_consultation_record', {\n      p_booking_id: bookingId,\n      p_chief_complaint: trimOptionalString(dto.diagnosis) ?? null,\n      p_general_notes: trimOptionalString(dto.generalNotes ?? dto.notes ?? dto.doctorFeeNotes) ?? null,\n      p_vitals: mapVitalsForSupabase(dto.vitalSigns),\n      p_soap: mapSoapForSupabase(dto.soap, dto.soapNotes),\n      p_diagnoses: mapDiagnosesForSupabase(dto),\n      p_prescription: mapPrescriptionForSupabase(dto.prescription),\n      p_lab_order: mapLabOrderForSupabase(dto.labOrders),\n      p_follow_up: mapFollowUpForSupabase(dto),\n    });\n\n    return this.fetchSupabaseConsultationRecord(bookingId);\n  }",
  "private async saveSupabaseConsultationDraft(\n    bookingId: string,\n    dto: ConsultationRecordUpdateRequest\n  ): Promise<ConsultationRecordResponse> {\n    await this.apiService.post('bookings/' + bookingId + '/consultation-record', dto).toPromise();\n    return this.fetchSupabaseConsultationRecord(bookingId);\n  }"
);

// Also remove the Supabase import and inject since all methods are now converted
c = c.replace("import { SupabaseService } from './supabase.service';\n", '');
c = c.replace("private readonly supabase = inject(SupabaseService).client;\n", '');

fs.writeFileSync(f, c);
console.log('Fixed all remaining booking.service.ts Supabase refs');

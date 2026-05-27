const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/public/services/booking-availability.service.ts';
let c = fs.readFileSync(f, 'utf8');

// Replace SupabaseService import + injection with ApiService
c = c.replace(
  "import { SupabaseService } from '../../../core/services/supabase.service';",
  ''
);

c = c.replace(
  "private readonly supabase = inject(SupabaseService).client;",
  "private readonly api = inject(ApiService);"
);

// Add ApiService import if needed
if (!c.includes("import { ApiService }")) {
  c = c.replace(
    "import { Injectable, inject }",
    "import { ApiService } from '../../../core/services/api.service';\nimport { Injectable, inject }"
  );
}

// Replace fetchDoctorSchedules
c = c.replace(
  "const { data, error } = await this.supabase\n      .from('doctor_schedules')\n      .select('id, doctor_id, day_of_week, start_time, end_time')\n      .eq('doctor_id', doctorId)\n      .order('day_of_week', { ascending: true })\n      .order('start_time', { ascending: true });\n\n    if (error) {\n      throw error;\n    }\n",
  "const data = await this.api.get('doctors/' + doctorId + '/schedule').toPromise();\n"
);

// The row mapper uses snake_case fields — update to handle camelCase too
// Map DoctorScheduleRow interface is fine, but mapping function needs updates
c = c.replace(
  "day_of_week: trimStr(row['day_of_week']) ?? '',\n      start_time: trimStr(row['start_time']) ?? '',\n      end_time: trimStr(row['end_time']) ?? '',",
  "dayOfWeek: trimStr(row['dayOfWeek'] ?? row['day_of_week']) ?? '',\n      startTime: trimStr(row['startTime'] ?? row['start_time']) ?? '',\n      endTime: trimStr(row['endTime'] ?? row['end_time']) ?? '',"
);

// Update the DoctorScheduleRow interface to match new field names
c = c.replace(
  "interface DoctorScheduleRow {\n  id: string;\n  doctor_id: string;\n  day_of_week: string;\n  start_time: string;\n  end_time: string;\n}",
  "interface DoctorScheduleRow {\n  id: string;\n  doctor_id: string;\n  dayOfWeek: string;\n  startTime: string;\n  endTime: string;\n}"
);

fs.writeFileSync(f, c);
console.log('fixed booking-availability.service.ts');

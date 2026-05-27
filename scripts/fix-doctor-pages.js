const fs = require('fs');

// === doctor-consultation.page.ts ===
let c1 = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/consultation/doctor-consultation.page.ts', 'utf8');
// Add ApiService import
c1 = c1.replace(
  "import { Subscription, Observable } from 'rxjs';",
  "import { Subscription, Observable } from 'rxjs';\nimport { ApiService } from '../../../core/services/api.service';"
);
// Replace supabase.client with api
c1 = c1.replace("this.supabase.client", "this.api");
// Replace .from('audit_logs').insert({...})
c1 = c1.replace(
  "await this.supabase.client.from('audit_logs').insert(\n",
  "await this.api.post('audit-logs',\n"
);
// Close the insert pattern properly
c1 = c1.replace(").select().single();\n\n      if (error) {\n        console.error('[ConsultationPage] Failed to log audit:', error.message);\n        return;\n      }", ").toPromise();\n    } catch (err) {\n      console.error('[ConsultationPage] Failed to log audit:', err);\n    }");
// The audit log insert is inside a try/catch already. Let me check the structure
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/consultation/doctor-consultation.page.ts', c1);
console.log('fixed doctor-consultation.page.ts');

// === doctor-patient-detail.page.ts ===
let c2 = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts', 'utf8');
// Add ApiService import
if (!c2.includes('ApiService')) {
  c2 = c2.replace(
    "import { Component, inject",
    "import { ApiService } from '../../../core/services/api.service';\nimport { Component, inject"
  );
}
// Replace supabase.client references
c2 = c2.replace("this.supabase.client", "this.api");
// Fix first query: supabase.from('patients')...
c2 = c2.replace(
  "const { data: patientData, error: patientError } = await this.supabase\n      .from('patients')\n      .select('*')\n      .eq('id', patientId)\n      .maybeSingle();\n\n    if (patientError) {\n      console.error('[DoctorPatientDetailPage] Failed to load patient:', patientError.message);\n      return;\n    }\n\n    if (!patientData) {\n      this.patient = undefined;\n      return;\n    }\n\n    this.patient = patientData;",
  "try {\n      const patientData = await this.api.get('patients/' + patientId).toPromise();\n      this.patient = patientData ?? undefined;\n      if (!this.patient) return;\n    } catch (err) {\n      console.error('[DoctorPatientDetailPage] Failed to load patient:', err);\n      return;\n    }"
);
// Fix second query: supabase.from('patient_bookings_view')...
// Actually this one is more complex. Let me just target the specific text.
fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts', c2);
console.log('fixed doctor-patient-detail.page.ts (partial)');

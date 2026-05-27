const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/patient/reviews/patient-reviews.page.ts';
let c = fs.readFileSync(f, 'utf8');

// Add ApiService import
c = c.replace(
  "import { BookingService } from '../../../core/services/booking.service';",
  "import { BookingService } from '../../../core/services/booking.service';\nimport { ApiService } from '../../../core/services/api.service';"
);

// Replace SupabaseService injection with ApiService
c = c.replace(
  "private readonly supabase = inject(SupabaseService).client;",
  "private readonly api = inject(ApiService);"
);

// Remove SupabaseService import
c = c.replace(
  "import { SupabaseService } from '../../../core/services/supabase.service';\n",
  ""
);

// Replace checkExistingReview
c = c.replace(
  "const { data, error } = await this.supabase\n      .from('reviews')\n      .select('id', { count: 'exact', head: true })\n      .eq('booking_id', bookingId);\n\n    if (error) {\n      console.warn('[PatientReviewsPage] reviews table not available — assuming no existing review so submission is attempted.');\n      this.hasExistingReview = false;\n      return;\n    }\n    this.hasExistingReview = (data ?? []).length > 0;",
  "try {\n      const data = await this.api.get('reviews?bookingId=' + bookingId).toPromise();\n      this.hasExistingReview = Array.isArray(data) && data.length > 0;\n    } catch {\n      console.warn('[PatientReviewsPage] reviews endpoint not available — assuming no existing review.');\n      this.hasExistingReview = false;\n    }"
);

// Replace insert review
c = c.replace(
  "const { error } = await this.supabase\n      .from('reviews')\n      .insert({\n        booking_id: this.booking.id,\n        doctor_id: this.booking.doctorId,\n        patient_id: this.currentPatient.id,\n        rating,\n        comment: comment || null,\n        patient_name: patientName\n      });\n\n    if (error) {\n      this.isSubmitting = false;\n      this.submitError = 'Could not submit your review. The reviews database table may not be ready yet. Please try again later.';\n      console.warn('[PatientReviewsPage] Could not save review:', error.message);\n      return;\n    }",
  "try {\n      await this.api.post('reviews', {\n        bookingId: this.booking.id,\n        doctorId: this.booking.doctorId,\n        patientId: this.currentPatient.id,\n        rating,\n        comment: comment || null,\n        patientName: patientName\n      }).toPromise();\n    } catch (err: any) {\n      this.isSubmitting = false;\n      this.submitError = 'Could not submit your review. Please try again later.';\n      console.warn('[PatientReviewsPage] Could not save review:', err?.message ?? err);\n      return;\n    }"
);

fs.writeFileSync(f, c);
console.log('fixed patient-reviews.page.ts');

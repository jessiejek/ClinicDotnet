import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, catchError, forkJoin, firstValueFrom, from, map, of, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { IonLabel, IonSegment, IonSegmentButton, ModalController } from '@ionic/angular/standalone';
import { MedicalRecordsService } from '../../../core/services/medical-records.service';
import { ConsultationRecordResponse } from '../../../core/services/booking.service';
import { PatientClinicalHistoryDto, PatientClinicalHistoryPatientDto, PatientClinicalHistorySummaryDto } from '../../../core/models/patient-clinical-history.models';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

type ClinicalTab = 'timeline' | 'consultations' | 'prescriptions' | 'labs' | 'documents' | 'vaccinations' | 'appointments';



@Component({
  standalone: true,
  selector: 'app-doctor-patient-detail-page',
  imports: [
    AsyncPipe, DatePipe, NgFor, NgIf, FormsModule, RouterLink,
    IonLabel, IonSegment, IonSegmentButton,
    PageHeaderComponent, EmptyStateComponent
  ],
  templateUrl: './doctor-patient-detail.page.html',
  styleUrl: './doctor-patient-detail.page.scss'
})
export class DoctorPatientDetailPage {
  private readonly apiService = inject(ApiService);
  private readonly medicalRecords = inject(MedicalRecordsService);
  private readonly route = inject(ActivatedRoute);
  private readonly modalCtrl = inject(ModalController);

  activeTab: ClinicalTab = 'timeline';
  errorMessage = '';

  readonly history$: Observable<PatientClinicalHistoryDto | null> = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get('id') ?? ''),
    switchMap((patientId) => {
      if (!patientId) return of(null);
      this.errorMessage = '';
      return from(this.buildClinicalHistory(patientId)).pipe(
        catchError((err: any) => {
          console.error('[DoctorPatientDetail] buildClinicalHistory failed:', err?.message ?? err);
          this.errorMessage = 'Failed to load clinical history.';
          return of(null);
        })
      );
    })
  );

  calcAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) return 0;
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  retry(): void {
    window.location.reload();
  }

  onTabChange(event: CustomEvent): void {
    const nextTab = event.detail?.value;
    if (
      nextTab === 'timeline' ||
      nextTab === 'appointments' ||
      nextTab === 'consultations' ||
      nextTab === 'prescriptions' ||
      nextTab === 'labs' ||
      nextTab === 'documents' ||
      nextTab === 'vaccinations'
    ) {
      this.activeTab = nextTab;
    }
  }

  get activeTabHeading(): string {
    switch (this.activeTab) {
      case 'appointments':
        return 'Appointments';
      case 'consultations':
        return 'Consultations';
      case 'prescriptions':
        return 'Prescription';
      case 'labs':
        return 'Lab Results';
      case 'documents':
        return 'Documents';
      case 'vaccinations':
        return 'Vaccinations';
      case 'timeline':
      default:
        return 'Timeline';
    }
  }

  get activeTabDescription(): string {
    switch (this.activeTab) {
      case 'appointments':
        return 'All booking dates and visit status for this patient.';
      case 'consultations':
        return 'Completed doctor notes, diagnoses, and consultation history.';
      case 'prescriptions':
        return 'Medication orders and instructions recorded during consultations.';
      case 'labs':
        return 'Lab requests and result attachments linked to this patient.';
      case 'documents':
        return 'Uploaded documents and supporting files.';
      case 'vaccinations':
        return 'Recorded immunizations and dose history.';
      case 'timeline':
      default:
        return "A chronological view of the patient's clinical activity.";
    }
  }

  viewFile(fileUrl: string, displayName: string): void {
    // Use document URL from API
    // If fileUrl looks like a storage path, create signed URL
    // Otherwise, open directly as a fallback
    window.open(fileUrl, '_blank');
  }

  private async buildClinicalHistory(patientId: string): Promise<PatientClinicalHistoryDto> {
    const patientRow: any = await firstValueFrom(
      this.apiService.get('patients/' + patientId).pipe(
        catchError((err) => {
          console.error('Failed to fetch patient:', err);
          return of(null);
        })
      )
    );

    const patient: PatientClinicalHistoryPatientDto = {
      id: patientId,
      patientCode: trimStr(patientRow?.patientCode) || trimStr(patientRow?.patient_code) || patientId,
      fullName: trimStr(patientRow?.fullName) || composeName(patientRow?.firstName, patientRow?.middleName, patientRow?.lastName) || 'Unknown Patient',
      dateOfBirth: trimStr(patientRow?.dateOfBirth) || trimStr(patientRow?.date_of_birth),
      sex: trimStr(patientRow?.sex),
      contactNumber: trimStr(patientRow?.contactNumber) || trimStr(patientRow?.contact_number),
      email: trimStr(patientRow?.email) || trimStr(patientRow?.contact_email) || trimStr(patientRow?.email),
    };

    const [bookingRowsResult, recordState] = await Promise.all([
      firstValueFrom(this.apiService.get<any[]>('bookings?patientId=' + patientId + '&pageSize=50').pipe(catchError(() => of([])))),
      firstValueFrom(
        forkJoin({
          consultations: this.apiService.get<any[]>('medical-records/consultations?patientId=' + patientId).pipe(
            map((rows) => this.medicalRecords.mapConsultationRows(rows ?? [])),
            catchError(() => of([]))
          ),
          prescriptions: this.apiService.get<any[]>('medical-records/prescriptions?patientId=' + patientId).pipe(
            map((rows) => this.medicalRecords.mapPrescriptionRows(rows ?? [])),
            catchError(() => of([]))
          ),
          labResults: this.apiService.get<any[]>('medical-records/lab-results?patientId=' + patientId).pipe(
            map((rows) => this.medicalRecords.mapLabResultRows(rows ?? [])),
            catchError(() => of([]))
          ),
          vaccinations: this.apiService.get<any[]>('medical-records/vaccinations?patientId=' + patientId).pipe(
            map((rows) => this.medicalRecords.mapVaccinationRows(rows ?? [])),
            catchError(() => of([]))
          ),
          followUps: this.apiService.get<any[]>('medical-records/follow-ups?patientId=' + patientId).pipe(
            map((rows) => this.medicalRecords.mapFollowUpRows(rows ?? [])),
            catchError(() => of([]))
          )
        })
      )
    ]);

    const bookingRows = bookingRowsResult ?? [];

    const bookings = (Array.isArray(bookingRows) ? bookingRows : (bookingRows as any)?.items ?? []) as Record<string, unknown>[];
    const consultations = recordState.consultations;
    const prescriptions = dedupePrescriptionEntries([
      ...recordState.prescriptions
        .map((item) => ({
          prescriptionDate: item.issuedAt,
          notes: item.notes,
          items: item.items.map((entry) => ({
            medicationName: entry.medicineName,
            strength: entry.strength,
            dosage: entry.sig,
            route: entry.route ?? entry.routeDescription,
            frequency: entry.frequency ?? entry.frequencyCode,
            duration: entry.duration,
            quantity: entry.quantity == null ? null : String(entry.quantity),
            instructions: entry.instructions
          }))
        }))
        .filter((item) => item.items.length > 0),
      ...await this.loadPrescriptionsFromConsultationRecords(bookings)
    ]);
    const labResults = recordState.labResults;
    const vaccinations = recordState.vaccinations;
    const followUps = recordState.followUps;

    const summary: PatientClinicalHistorySummaryDto = {
      totalAppointments: bookings.length,
      completedConsultations: consultations.length || bookings.filter((b) => (trimStr(b['status']) ?? trimStr(b['booking_status'])) === 'Completed').length,
      activePrescriptions: prescriptions.length,
      labResultsCount: labResults.length,
      documentsCount: 0,
      vaccinationsCount: vaccinations.length,
      lastVisitDate: bookings.length > 0 ? (trimStr(bookings[0]['appointmentDate']) ?? trimStr(bookings[0]['appointment_date'])) : undefined,
      nextAppointmentDate: bookings.find((b) => ['Confirmed', 'CheckedIn'].includes((trimStr(b['status']) ?? trimStr(b['booking_status'])) ?? ''))?.['appointmentDate'] as string | undefined,
    };

    // Build timeline and subsections from booking data (other sections deferred)
    const appointments = bookings.map((b) => ({
      bookingId: (trimStr(b['id']) ?? trimStr(b['booking_id'])) ?? '',
      appointmentDate: (trimStr(b['appointmentDate']) ?? trimStr(b['appointment_date'])) ?? '',
      slotStartTime: (trimStr(b['slotStartTime']) ?? trimStr(b['slot_start_time'])) ?? '',
      slotEndTime: (trimStr(b['slotEndTime']) ?? trimStr(b['slot_end_time'])) ?? '',
      doctorId: (trimStr(b['doctorId']) ?? trimStr(b['doctor_id'])) ?? '',
      doctorName: (trimStr(b['doctorName']) ?? trimStr((b['doctor'] as Record<string, unknown>)?.['fullName']) ?? trimStr(b['doctor_name'])) ?? 'Doctor',
      serviceName: (trimStr(b['serviceName']) ?? trimStr(b['service_name'])) ?? '',
      serviceNames: (b['serviceNames'] as string[]) ?? (b['service_names'] as string[]) ?? [],
      status: (trimStr(b['status']) ?? trimStr(b['booking_status'])) ?? '',
      paymentStatus: (trimStr(b['paymentStatus']) ?? trimStr(b['payment_status'])) ?? '',
      queueNumber: normalizeNum(b['queueNumber'] ?? b['queue_number']),
    }));

    const timeline = appointments.map((a) => ({
      id: a.bookingId,
      date: a.appointmentDate,
      type: 'Appointment' as const,
      title: `${a.doctorName} - ${a.status}`,
      description: `${a.slotStartTime} - ${a.slotEndTime}`,
      bookingId: a.bookingId,
    }));

    return {
      patient,
      summary,
      timeline,
      appointments,
      consultations: consultations.map((consultation) => ({
        bookingId: consultation.bookingId,
        consultationId: consultation.id,
        appointmentDate: consultation.consultationDate,
        appointmentTime: consultation.consultationTime ?? '',
        doctorName: (() => {
          const match = bookings.find((booking) => (trimStr(booking['id']) ?? trimStr(booking['booking_id'])) === consultation.bookingId);
          return (trimStr(match?.['doctorName']) || trimStr((match?.['doctor'] as Record<string, unknown>)?.['fullName']) || 'Doctor');
        })(),
        generalNotes: consultation.generalNotes,
        vitalSigns: consultation.vitalSigns ?? null,
        soap: consultation as unknown as Record<string, string | null> | null,
        diagnosesSummary: consultation.diagnoses.map((diagnosis) => diagnosis.description).join(', '),
        diagnoses: consultation.diagnoses.map((diagnosis) => ({
          id: diagnosis.id,
          diagnosisText: diagnosis.description,
          diagnosisCode: diagnosis.code || diagnosis.icd10Code,
          isPrimary: diagnosis.type === 'Primary',
          notes: undefined
        })),
        prescription: consultation.prescriptions?.[0] ?? null,
        labOrders: consultation.labRequests?.map((request) => ({
          id: request.id,
          notes: request.reason,
          items: []
        })) ?? [],
        followUp: consultation.followUpDate ? { followUpDate: consultation.followUpDate } : null,
      })),
      documents: [],
      labResults: labResults.map((item) => ({
        id: item.id,
        bookingId: item.consultationId ?? null,
        consultationId: item.consultationId ?? null,
        resultTitle: item.fileName,
        resultText: item.notes,
        fileUrl: null,
        fileName: item.fileName,
        fileContentType: null,
        createdAt: item.resultDate
      })),
      vaccinations: vaccinations.map((item) => ({
        id: item.id,
        vaccineName: item.vaccineName,
        administeredDate: item.dateGiven,
        doseNumber: item.doseNumber == null ? undefined : String(item.doseNumber),
        manufacturer: item.brandName,
        lotNumber: item.lotNumber,
        status: 'Recorded',
        source: 'dotnet',
        nextDueDate: item.nextDoseDate,
        notes: item.remarks
      })),
      followUps: followUps.map((item) => ({
        followUpDate: item.followUpDate,
        instructions: item.reason,
        reason: item.reason
      })),
      prescriptions,
    };
  }

  private async loadPrescriptionsFromConsultationRecords(
    bookings: Record<string, unknown>[]
  ): Promise<PatientClinicalHistoryDto['prescriptions']> {
    const bookingIds = bookings
      .map((booking) => (trimStr(booking['id']) ?? trimStr(booking['booking_id'])) ?? '')
      .filter((bookingId): bookingId is string => Boolean(bookingId));

    if (bookingIds.length === 0) {
      return [];
    }

    const consultationRecords = await firstValueFrom(
      forkJoin(
        bookingIds.map((bookingId) =>
          this.apiService.get<any>('bookings/' + bookingId + '/consultation-record').pipe(
            map((data) => (data ? mapConsultationRecordRow(data as Record<string, unknown>) : null)),
            catchError(() => of(null))
          )
        )
      )
    );

    return consultationRecords
      .filter((record): record is ConsultationRecordResponse => Boolean(record?.prescription))
      .map((record) => {
        const match = bookings.find((booking) => (trimStr(booking['id']) ?? trimStr(booking['booking_id'])) === record.bookingId);
        const bookingDate = trimStr(match?.['appointmentDate']) ?? trimStr(match?.['appointment_date']);

        return {
        prescriptionDate: bookingDate ?? record.followUp?.followUpDate ?? record.bookingId,
        notes: record.prescription?.notes ?? record.generalNotes ?? null,
        items: (record.prescription?.items ?? []).map((item) => ({
          medicationName: item.medicationName,
          strength: item.strength,
          dosage: item.dosage,
          route: item.route,
          frequency: item.frequency,
          duration: item.duration,
          quantity: item.quantity,
          instructions: item.instructions
        }))
        };
      })
      .filter((prescription) => prescription.items.length > 0);
  }
}

function dedupePrescriptionEntries(
  prescriptions: PatientClinicalHistoryDto['prescriptions']
): PatientClinicalHistoryDto['prescriptions'] {
  const seen = new Set<string>();
  const result: PatientClinicalHistoryDto['prescriptions'] = [];

  for (const prescription of prescriptions) {
    if (!prescription.items.length) {
      continue;
    }

    const key = [
      prescription.prescriptionDate ?? '',
      prescription.notes ?? '',
      ...prescription.items.map((item) => [
        item.medicationName,
        item.strength ?? '',
        item.dosage ?? '',
        item.frequency ?? '',
        item.duration ?? '',
        item.instructions ?? ''
      ].join('|'))
    ].join('||');

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(prescription);
  }

  return result;
}

function trimStr(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const t = value.trim();
  return t || undefined;
}

function composeName(first: unknown, middle: unknown, last: unknown): string {
  const parts = [first, middle, last]
    .map((v) => (typeof v === 'string' ? v.trim() : ''))
    .filter((v) => v.length > 0);
  return parts.length ? parts.join(' ') : 'Patient';
}

function mapConsultationRecordRow(row: Record<string, unknown>): ConsultationRecordResponse {
  const prescriptionRows = Array.isArray(row['prescriptions']) ? row['prescriptions'] : [];
  const firstPrescription = prescriptionRows.find((item) => typeof item === 'object' && item !== null) as
    | Record<string, unknown>
    | undefined;
  const firstFollowUpRow = Array.isArray(row['follow_ups'])
    ? (row['follow_ups'].find((item) => typeof item === 'object' && item !== null) as Record<string, unknown> | undefined)
    : undefined;

  const prescription = firstPrescription
    ? {
        id: trimStr(firstPrescription['id']),
        notes: trimStr(firstPrescription['notes']),
        items: Array.isArray(firstPrescription['items'])
          ? firstPrescription['items']
              .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
              .map((item) => ({
                id: trimStr(item['id']),
                medicationName: (trimStr(item['medicationName']) || trimStr(item['medication_name'])) ?? '',
                strength: trimStr(item['strength']),
                dosage: trimStr(item['dosage']),
                route: trimStr(item['route']),
                frequency: trimStr(item['frequency']),
                duration: trimStr(item['duration']),
                quantity: trimStr(item['quantity']),
                instructions: trimStr(item['instructions'])
              }))
              .filter((item) => item.medicationName.length > 0)
          : []
      }
    : null;

  return {
    bookingId: (trimStr(row['bookingId']) || trimStr(row['booking_id'])) ?? '',
    consultationId: trimStr(row['consultationId']) || trimStr(row['consultation_id']),
    patientId: (trimStr(row['patientId']) || trimStr(row['patient_id'])) ?? '',
    doctorId: (trimStr(row['doctorId']) || trimStr(row['doctor_id'])) ?? '',
    bookingStatus: ((trimStr(row['bookingStatus']) || trimStr(row['booking_status'])) ?? 'Completed') as ConsultationRecordResponse['bookingStatus'],
    generalNotes: trimStr(row['generalNotes']) || trimStr(row['general_notes']),
    vitalSigns: null,
    soap: null,
    diagnoses: [],
    prescription,
    labOrders: [],
    followUp: firstFollowUpRow
      ? {
          id: trimStr(firstFollowUpRow['id']),
          followUpDate: trimStr(firstFollowUpRow['followUpDate']) || trimStr(firstFollowUpRow['follow_up_date']),
          instructions: trimStr(firstFollowUpRow['instructions']),
          reason: trimStr(firstFollowUpRow['reason'])
        }
      : null
  };
}

function normalizeNum(value: unknown): number | null {
  if (typeof value !== 'number') return null;
  return Number.isFinite(value) ? value : null;
}

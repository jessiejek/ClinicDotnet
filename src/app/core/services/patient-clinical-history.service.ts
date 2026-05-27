import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import {
  Consultation,
  FollowUp,
  LabResult,
  PatientClinicalHistoryAppointmentDto,
  PatientClinicalHistoryConsultationDto,
  PatientClinicalHistoryDto,
  PatientClinicalHistoryPatientDto,
  PatientClinicalHistorySummaryDto,
  Prescription,
  VaccinationRecord
} from '../models';
import { ApiService } from './api.service';
import { MedicalRecordsService } from './medical-records.service';

@Injectable({ providedIn: 'root' })
export class PatientClinicalHistoryService {
  private readonly api = inject(ApiService);
  private readonly medicalRecords = inject(MedicalRecordsService);

  getPatientClinicalHistory(patientId: string): Observable<PatientClinicalHistoryDto | null> {
    return forkJoin({
      patientRow: this.api.get<any>('patients/' + patientId).pipe(catchError(() => of(null))),
      bookingRows: this.api.get<any[]>('bookings?patientId=' + patientId + '&pageSize=50').pipe(catchError(() => of([]))),
      records: forkJoin({
        consultations: this.medicalRecords.getConsultationsByPatientId(patientId).pipe(catchError(() => of([] as Consultation[]))),
        prescriptions: this.medicalRecords.getPrescriptionsByPatientId(patientId).pipe(catchError(() => of([] as Prescription[]))),
        labResults: this.medicalRecords.getLabResultsByPatientId(patientId).pipe(catchError(() => of([] as LabResult[]))),
        vaccinations: this.medicalRecords.getVaccinationsByPatientId(patientId).pipe(catchError(() => of([] as VaccinationRecord[]))),
        followUps: this.medicalRecords.getFollowUpsByPatientId(patientId).pipe(catchError(() => of([] as FollowUp[])))
      })
    }).pipe(
      map(({ patientRow, bookingRows, records }) => {
        const patient: PatientClinicalHistoryPatientDto = {
          id: patientId,
          patientCode: trimStr(patientRow?.patientCode) || patientId,
          fullName: composeName(patientRow?.firstName, patientRow?.middleName, patientRow?.lastName),
          dateOfBirth: trimStr(patientRow?.dateOfBirth),
          sex: trimStr(patientRow?.sex),
          contactNumber: trimStr(patientRow?.contactNumber),
          email: trimStr(patientRow?.email)
        };

        const bookingRowsArr = Array.isArray(bookingRows) ? (bookingRows as Record<string, unknown>[]) : [];
        const bookingMap = new Map(bookingRowsArr.map((row) => [trimStr(row['id'] ?? row['booking_id']) ?? '', row]));
        const consultations = records.consultations.slice(0, 10);

        const lastVisitDate = consultations[0]?.consultationDate ?? trimStr(bookingRowsArr[0]?.['appointmentDate']);
        const nextAppointment = bookingRowsArr.find((row) =>
          ['Confirmed', 'CheckedIn'].includes(trimStr(row['status']) ?? '')
        );
        const nextAppointmentDate = nextAppointment?.['appointmentDate'];

        const summary: PatientClinicalHistorySummaryDto = {
          totalAppointments: bookingRowsArr.length,
          completedConsultations: consultations.length,
          activePrescriptions: records.prescriptions.length,
          labResultsCount: records.labResults.length,
          documentsCount: 0,
          vaccinationsCount: records.vaccinations.length,
          lastVisitDate,
          nextAppointmentDate: trimStr(nextAppointmentDate)
        };

        const appointments: PatientClinicalHistoryAppointmentDto[] = bookingRowsArr.slice(0, 10).map((row) => ({
          bookingId: trimStr(row['id'] ?? row['booking_id']) ?? '',
          appointmentDate: trimStr(row['appointmentDate'] ?? row['appointment_date']) ?? '',
          slotStartTime: trimStr(row['slotStartTime'] ?? row['slot_start_time']) ?? '',
          slotEndTime: trimStr(row['slotEndTime'] ?? row['slot_end_time']) ?? '',
          doctorId: trimStr(row['doctorId'] ?? row['doctor_id']) ?? '',
          doctorName: trimStr(row['doctorName'] ?? row['doctor_name']) ?? 'Doctor',
          serviceName: trimStr(row['serviceName'] ?? row['service_name']) ?? '',
          serviceNames: (row['serviceNames'] ?? row['service_names'] ?? []) as string[],
          queueNumber: normalizeNum(row['queueNumber'] ?? row['queue_number']),
          status: trimStr(row['status'] ?? row['booking_status']) ?? '',
          paymentStatus: trimStr(row['paymentStatus'] ?? row['payment_status']) ?? ''
        }));

        const historyConsultations: PatientClinicalHistoryConsultationDto[] = consultations.map((c) =>
          this.mapConsultation(c, bookingMap)
        );

        return {
          patient,
          summary,
          timeline: [],
          appointments,
          consultations: historyConsultations,
          documents: [],
          labResults: records.labResults.map((item) => ({
            id: item.id,
            bookingId: (item as any).consultationId ?? null,
            consultationId: (item as any).consultationId ?? null,
            resultTitle: item.fileName,
            resultText: (item as any).notes,
            fileUrl: null,
            fileName: item.fileName,
            fileContentType: null,
            createdAt: (item as any).resultDate
          })),
          vaccinations: records.vaccinations.map((item) => ({
            id: item.id,
            vaccineName: item.vaccineName,
            administeredDate: item.dateGiven,
            doseNumber: item.doseNumber == null ? undefined : String(item.doseNumber),
            manufacturer: item.brandName,
            lotNumber: item.lotNumber,
            status: 'Recorded' as const,
            source: 'dotnet' as const,
            nextDueDate: item.nextDoseDate,
            notes: item.remarks
          })),
          followUps: records.followUps.map((item) => ({
            followUpDate: item.followUpDate,
            instructions: item.reason,
            reason: item.reason
          })),
          prescriptions: records.prescriptions.map((item) => ({
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
        } as PatientClinicalHistoryDto;
      }),
      catchError((error) => {
        console.error('[PatientClinicalHistoryService] failed to load history', error);
        return of(null);
      })
    );
  }

  private mapConsultation(
    consultation: Consultation,
    bookingMap: Map<string, Record<string, unknown>>
  ): PatientClinicalHistoryConsultationDto {
    const booking = bookingMap.get(consultation.bookingId);
    const doctorName = booking ? trimStr(booking['doctorName'] ?? booking['doctor_name']) || 'Doctor' : 'Doctor';
    return {
      bookingId: consultation.bookingId,
      consultationId: consultation.id,
      appointmentDate: consultation.consultationDate,
      appointmentTime: consultation.consultationTime ?? '',
      doctorName,
      generalNotes: consultation.generalNotes ?? null,
      vitalSigns: consultation.vitalSigns ?? null,
      soap: {
        chiefComplaint: (consultation as any).chiefComplaint ?? '',
        subjective: consultation.subjective ?? '',
        objective: consultation.objective ?? '',
        assessment: consultation.assessment ?? '',
        plan: consultation.plan ?? ''
      },
      diagnosesSummary: consultation.diagnoses.map((d) => `${d.code} - ${d.description}`).join(', '),
      diagnoses: consultation.diagnoses.map((d) => ({
        id: d.id,
        diagnosisText: d.description,
        diagnosisCode: d.code || d.icd10Code,
        isPrimary: d.type === 'Primary',
        notes: d.type === 'Primary' ? null : d.type
      })),
      prescription: consultation.prescriptions?.[0] ? {
        id: consultation.prescriptions[0].id,
        notes: consultation.prescriptions[0].notes ?? null,
        items: consultation.prescriptions[0].items.map((item) => ({
          id: item.id,
          medicationName: item.medicineName,
          strength: item.strength,
          dosage: item.sig,
          route: item.route ?? item.routeDescription,
          frequency: item.frequency ?? item.frequencyCode,
          duration: item.duration,
          quantity: item.quantity == null ? null : String(item.quantity),
          instructions: item.instructions
        }))
      } : null,
      labOrders: (consultation.labRequests ?? []).map((request) => ({
        id: request.id,
        notes: (request as any).reason ?? null,
        items: [{ id: request.id, testName: request.testName, testCode: request.testName, instructions: (request as any).reason ?? null }]
      })),
      followUp: (consultation as any).followUpDate ? {
        followUpDate: (consultation as any).followUpDate,
        instructions: consultation.generalNotes ?? null,
        reason: consultation.generalNotes ?? null
      } : null
    };
  }
}

function trimStr(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const t = value.trim();
  return t || undefined;
}

function composeName(first: unknown, middle: unknown, last: unknown): string {
  const parts = [first, middle, last].map((v) => (typeof v === 'string' ? v.trim() : '')).filter((v) => v.length > 0);
  return parts.length ? parts.join(' ') : 'Patient';
}

function normalizeNum(value: unknown): number | null {
  if (typeof value !== 'number') return null;
  return Number.isFinite(value) ? value : null;
}

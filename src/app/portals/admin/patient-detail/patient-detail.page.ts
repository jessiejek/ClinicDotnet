import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonLabel, IonSegment, IonSegmentButton, ModalController } from '@ionic/angular/standalone';
import { catchError, map, of } from 'rxjs';
import { Allergy, Booking, Consultation, FollowUp, LabResult, Patient, Prescription, VaccinationRecord } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { MedicalRecordsService } from '../../../core/services/medical-records.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { MedicalRecordsTabComponent } from '../components/medical-records-tab/medical-records-tab.component';
import { AdminPatientEditModalComponent } from './admin-patient-edit-modal.component';
import { rowToDetail } from '../services/admin-patients.service';

@Component({
  selector: 'app-admin-patient-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    EmptyStateComponent,
    MedicalRecordsTabComponent,
    StatusBadgeComponent,
    IonSegment,
    IonSegmentButton,
    IonLabel
  ],
  template: `
    <section class="page-shell" *ngIf="patient">
      <div class="page-shell__header">
        <div>
          <button type="button" class="btn-ghost" (click)="back()">Back to Patients</button>
          <h2 class="page-title">{{ patient.firstName }} {{ patient.lastName }}</h2>
          <div class="page-subtitle data-mono">{{ patient.patientCode }}</div>
        </div>
        <button class="btn-primary" type="button" (click)="openEdit()">Edit Profile</button>
      </div>

      <ion-segment [value]="selectedTab" (ionChange)="onTabChange($event)">
        <ion-segment-button value="overview"><ion-label>Overview</ion-label></ion-segment-button>
        <ion-segment-button value="bookings"><ion-label>Bookings</ion-label></ion-segment-button>
        <ion-segment-button value="records"><ion-label>Medical Records</ion-label></ion-segment-button>
      </ion-segment>

      <div *ngIf="selectedTab === 'overview'" class="overview-grid">
        <div class="clinic-card">
          <div class="section-heading">Personal Info</div>
          <div class="profile-card">
            <app-avatar [name]="patient.firstName + ' ' + patient.lastName" size="lg"></app-avatar>
            <div>
              <p>{{ patient.dateOfBirth }}</p>
              <p>{{ patient.sex }}</p>
              <p>{{ patient.civilStatus || 'N/A' }}</p>
              <p>{{ patient.bloodType || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <div class="clinic-card">
          <div class="section-heading">Contact Info</div>
          <p>{{ patient.address || 'No address provided' }}</p>
          <p>{{ patient.contactNumber || 'No phone provided' }}</p>
          <p>{{ patient.email || 'No email provided' }}</p>
          <div class="section-heading" style="margin-top: var(--space-4);">Login Account</div>
          <app-status-badge
            [status]="patientAccountStatus(patient)"
            [labelOverride]="patientAccountLabel(patient)"
          ></app-status-badge>
          <p *ngIf="patientAccountStatus(patient) === 'LinkedAccount' && patient.userId" class="data-mono" style="margin-top: var(--space-2);">User ID: {{ patient.userId }}</p>
          <p *ngIf="patientAccountStatus(patient) === 'NoAccount'" style="margin-top: var(--space-2);">No linked login account</p>
          <p *ngIf="patientAccountStatus(patient) === 'AccountUnknown'" style="margin-top: var(--space-2);">Account linkage unknown</p>
        </div>

        <div class="clinic-card">
          <div class="section-heading">Emergency Contact</div>
          <p>{{ patient.emergencyContactName || 'N/A' }}</p>
          <p>{{ patient.emergencyContactNumber || 'N/A' }}</p>
          <p>{{ patient.emergencyContactRelationship || 'N/A' }}</p>
        </div>

        <div class="clinic-card">
          <div class="section-heading">Insurance</div>
          <p>{{ patient.philHealthNumber || 'N/A' }}</p>
          <p>{{ patient.hmoProvider || 'N/A' }}</p>
          <p>{{ patient.hmoCardNumber || 'N/A' }}</p>
        </div>
      </div>

      <div *ngIf="selectedTab === 'bookings'" class="clinic-card">
        <table class="clinic-table" *ngIf="bookings.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let booking of bookings">
              <td class="data-mono">{{ booking.id }}</td>
              <td>{{ booking.appointmentDate }}</td>
              <td>{{ booking.slotStartTime }}</td>
              <td><app-status-badge [status]="booking.status"></app-status-badge></td>
              <td><app-status-badge [status]="booking.paymentStatus"></app-status-badge></td>
            </tr>
          </tbody>
        </table>
        <app-empty-state
          *ngIf="bookings.length === 0"
          icon="calendar-outline"
          title="No bookings"
          description="This patient has no bookings yet."
        ></app-empty-state>
      </div>

      <div *ngIf="selectedTab === 'records'" class="clinic-card">
        <app-medical-records-tab
          [patientId]="patient.id"
          [consultations]="consultations"
          [prescriptions]="prescriptions"
          [allergies]="allergies"
          [labResults]="labResults"
          [vaccinations]="vaccinations"
          [followUps]="followUps"
        ></app-medical-records-tab>
      </div>
    </section>
  `,
  styleUrl: './patient-detail.page.scss'
})
export class PatientDetailPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly medicalRecords = inject(MedicalRecordsService);
  private readonly modalCtrl = inject(ModalController);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  patientId = '';
  patient: Patient | null = null;
  bookings: Booking[] = [];
  consultations: Consultation[] = [];
  prescriptions: Prescription[] = [];
  allergies: Allergy[] = [];
  labResults: LabResult[] = [];
  vaccinations: VaccinationRecord[] = [];
  followUps: FollowUp[] = [];
  selectedTab: 'overview' | 'bookings' | 'records' = 'overview';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.patientId = id;
    this.loadPatient(id);
    this.loadSupportingData(id);
  }

  back(): void {
    void this.router.navigate(['/admin/patients']);
  }

  async openEdit(): Promise<void> {
    if (!this.patient) {
      return;
    }

    const modal = await this.modalCtrl.create({
      component: AdminPatientEditModalComponent,
      componentProps: { patient: this.patient },
      cssClass: 'admin-patient-edit-modal',
      backdropDismiss: false
    });

    await modal.present();

    const result = await modal.onDidDismiss<{ updated?: boolean }>();
    if (result.role === 'saved' || result.data?.updated) {
      this.loadPatient(this.patientId);
    }
  }

  onTabChange(event: Event): void {
    const detail = event as CustomEvent<{ value?: string | number }>;
    const value = detail.detail.value as 'overview' | 'bookings' | 'records' | undefined;
    if (value) {
      this.selectedTab = value;
    }
  }

  private loadPatient(id: string): void {
    this.apiService.get<any>('patients/' + id).pipe(
      map((data) => (data ? rowToDetail(data as Record<string, unknown>) : undefined))
    ).subscribe((patient) => {
      this.patient = patient ?? null;
    });
  }

  private loadSupportingData(id: string): void {
    this.apiService
      .get<any>('bookings')
      .pipe(
        map((data: any) => {
          const rows = (data?.items ?? data ?? []) as Record<string, unknown>[];
          return rows
            .map((row) => normalizeBookingRow(row))
            .filter((booking): booking is Booking => Boolean(booking))
            .filter((booking) => booking.patientId === id);
        }),
        catchError(() => of([] as Booking[]))
      )
      .subscribe((bookings) => (this.bookings = bookings));
    this.apiService.get<any[]>('medical-records/consultations?patientId=' + id).pipe(
      map((rows) => this.medicalRecords.mapConsultationRows(rows ?? [])),
      catchError(() => of([] as Consultation[]))
    ).subscribe((consultations) => (this.consultations = consultations));
    this.apiService.get<any[]>('medical-records/prescriptions?patientId=' + id).pipe(
      map((rows) => this.medicalRecords.mapPrescriptionRows(rows ?? [])),
      catchError(() => of([] as Prescription[]))
    ).subscribe((prescriptions) => (this.prescriptions = prescriptions));
    this.apiService.get<any[]>('medical-records/allergies?patientId=' + id).pipe(
      map((rows) => this.medicalRecords.mapAllergyRows(rows ?? [])),
      catchError(() => of([] as Allergy[]))
    ).subscribe((allergies) => (this.allergies = allergies));
    this.apiService.get<any[]>('medical-records/lab-results?patientId=' + id).pipe(
      map((rows) => this.medicalRecords.mapLabResultRows(rows ?? [])),
      catchError(() => of([] as LabResult[]))
    ).subscribe((labResults) => (this.labResults = labResults));
    this.apiService.get<any[]>('medical-records/vaccinations?patientId=' + id).pipe(
      map((rows) => this.medicalRecords.mapVaccinationRows(rows ?? [])),
      catchError(() => of([] as VaccinationRecord[]))
    ).subscribe((vaccinations) => (this.vaccinations = vaccinations));
    this.apiService.get<any[]>('medical-records/follow-ups?patientId=' + id).pipe(
      map((rows) => this.medicalRecords.mapFollowUpRows(rows ?? [])),
      catchError(() => of([] as FollowUp[]))
    ).subscribe((followUps) => (this.followUps = followUps));
  }

  patientAccountStatus(patient: Patient): 'LinkedAccount' | 'NoAccount' | 'AccountUnknown' {
    if (patient.hasAccount === true || Boolean(patient.userId?.trim())) {
      return 'LinkedAccount';
    }

    if (patient.hasAccount === false) {
      return 'NoAccount';
    }

    return 'AccountUnknown';
  }

  patientAccountLabel(patient: Patient): string {
    switch (this.patientAccountStatus(patient)) {
      case 'LinkedAccount':
        return 'Account Linked';
      case 'NoAccount':
        return 'No Account';
      default:
        return 'Account Unknown';
    }
  }
}

function normalizeBookingRow(row: Record<string, unknown>): Booking | null {
  const id = normalizeOptionalString(asString(row['id'] ?? row['bookingId'] ?? row['booking_id']));
  if (!id) {
    return null;
  }

  const serviceNames = normalizeStringArray(row['serviceNames'] ?? row['service_names']);
  const serviceName = normalizeOptionalString(asString(row['serviceName'] ?? row['primary_service_name'])) ?? serviceNames[0];

  return {
    id,
    patientId: normalizeOptionalString(asString(row['patientId'] ?? row['patient_id'])) ?? '',
    patientName: normalizeOptionalString(asString(row['patientName'] ?? row['patient_name'])) ?? 'Patient',
    doctorId: normalizeOptionalString(asString(row['doctorId'] ?? row['doctor_id'])) ?? '',
    doctorName: normalizeOptionalString(asString(row['doctorName'] ?? row['doctor_name'])) ?? 'Doctor',
    serviceId: normalizeOptionalString(asString(row['serviceId'] ?? row['primary_service_id'])) ?? '',
    serviceIds: normalizeStringArray(row['serviceIds'] ?? row['service_ids']),
    serviceName: serviceName ?? '',
    serviceNames,
    services: normalizeBookingServices(row['services']),
    appointmentDate: normalizeDateOnly(row['appointmentDate'] ?? row['appointment_date']),
    slotStartTime: normalizeTimeOnly(row['slotStartTime'] ?? row['slot_start_time']),
    slotEndTime: normalizeTimeOnly(row['slotEndTime'] ?? row['slot_end_time']),
    status: (normalizeOptionalString(asString(row['status'] ?? row['booking_status'])) as Booking['status']) ?? 'Pending',
    paymentStatus: (normalizeOptionalString(asString(row['paymentStatus'] ?? row['payment_status'])) as Booking['paymentStatus']) ?? 'Unpaid',
    paymentMode: (normalizeOptionalString(asString(row['paymentMode'] ?? row['payment_mode'])) as Booking['paymentMode']) ?? 'PayAtClinic',
    queueNumber: normalizeNullableNumber(row['queueNumber'] ?? row['queue_number']),
    totalFee: normalizeNumber(row['totalFee'] ?? row['total_fee']),
    finalAmount: normalizeNullableNumber(row['finalAmount'] ?? row['final_amount']),
    amountDue: normalizeNullableNumber(row['amountDue'] ?? row['amount_due']),
    consultationFeeSnapshot: normalizeNumber(row['consultationFeeSnapshot'] ?? row['consultation_fee_snapshot']),
    serviceFeeSnapshot: normalizeNumber(row['serviceFeeSnapshot'] ?? row['service_fee_snapshot']),
    isWalkIn: normalizeBoolean(row['isWalkIn'] ?? row['is_walk_in']),
    createdAt: normalizeOptionalString(asString(row['createdAt'] ?? row['created_at'])) ?? new Date().toISOString(),
    orNumber: normalizeOptionalString(asString(row['orNumber'] ?? row['or_number'])),
    checkedInAt: normalizeOptionalString(asString(row['checkedInAt'] ?? row['checked_in_at'])),
    doctorCompletedAt: normalizeOptionalString(asString(row['doctorCompletedAt'] ?? row['doctor_completed_at'])),
    isProfessionalFeeWaived: normalizeBooleanOrUndefined(row['isProfessionalFeeWaived'] ?? row['is_professional_fee_waived']),
    professionalFeeWaivedReason: normalizeOptionalString(asString(row['professionalFeeWaivedReason'] ?? row['professional_fee_waived_reason']))
  };
}

function normalizeBookingServices(value: unknown): Array<{ id: string; name: string }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        const name = item.trim();
        return name ? { id: '', name } : undefined;
      }

      if (!isRecord(item)) {
        return undefined;
      }

      const name = normalizeOptionalString(asString(item['name'] ?? item['serviceName'] ?? item['service_name']));
      return {
        id: normalizeOptionalString(asString(item['id'] ?? item['serviceId'])) ?? '',
        name: name ?? ''
      };
    })
    .filter((item): item is { id: string; name: string } => Boolean(item && (item.id || item.name)));
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => normalizeOptionalString(asString(item))).filter((item): item is string => Boolean(item));
}

function normalizeDateOnly(value: unknown): string {
  const raw = normalizeOptionalString(asString(value));
  return raw ? raw.slice(0, 10) : '';
}

function normalizeTimeOnly(value: unknown): string {
  const raw = normalizeOptionalString(asString(value));
  return raw ? raw.slice(0, 5) : '';
}

function normalizeNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function normalizeNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function normalizeBoolean(value: unknown): boolean {
  return value === true || value === 'true' || value === 1 || value === '1';
}

function normalizeBooleanOrUndefined(value: unknown): boolean | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  return normalizeBoolean(value);
}

function normalizeOptionalString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

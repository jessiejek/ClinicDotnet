import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { IonSpinner, ToastController } from '@ionic/angular/standalone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, filter, take } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { AvailabilityStatus, Booking, Doctor, DoctorDayStatus, DoctorSchedule } from '../../../core/models';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { DoctorTodaySummary } from '../../../core/services/booking.service';
import { ClinicDashboardRealtimeService } from '../../../core/services/clinic-dashboard-realtime.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { DoctorService } from '../services/doctor.service';

@Component({
  standalone: true,
  selector: 'app-doctor-dashboard-page',
  imports: [
    NgClass, NgFor, NgIf, FormsModule, RouterLink,
    AvatarComponent,
    IonSpinner, EmptyStateComponent, StatusBadgeComponent
  ],
  template: `
    <div class="page-loading" *ngIf="isLoading">
      <ion-spinner name="crescent"></ion-spinner>
    </div>

    <ng-container *ngIf="!isLoading">
      <ng-container *ngIf="doctor; else errorState">
        <div class="dash">
          <div class="dh">
            <div>
              <h1 class="dt">{{ greeting }}, Dr. {{ doctor.fullName.split(' ')[0] || 'Doctor' }}</h1>
              <p class="ds">{{ greetingSubtitle }}</p>
            </div>
            <span class="sp" [class.sa]="todayStatus === 'Available'" [class.sl]="todayStatus === 'RunningLate'" [class.su]="todayStatus === 'UnavailableToday'">
              {{ todayStatus === 'RunningLate' ? 'Running Late' : todayStatus === 'UnavailableToday' ? 'Unavailable Today' : 'Available' }}
            </span>
          </div>

          <div class="np-banner" *ngIf="nextPatient as next">
            <div class="np-banner__main">
              <app-avatar [name]="next.patientName || 'Patient'" size="lg"></app-avatar>
              <div class="np-banner__copy">
                <span class="np-banner__meta">
                  Up next | #{{ next.queueNumber ?? '--' }} | {{ next.slotStartTime ? formatTimeLabel(next.slotStartTime) : '--:--' }}
                </span>
                <strong class="np-banner__name">{{ next.patientName || 'Patient' }}</strong>
                <span class="np-banner__service">{{ displayQueueService(next) }}</span>
              </div>
            </div>
            <div class="np-banner__actions">
              <button type="button" class="np-banner__btn np-banner__btn--primary" (click)="startConsult(next.id)">Start Consult</button>
              <button type="button" class="np-banner__btn np-banner__btn--ghost" (click)="viewChart(next.patientId)">View Chart</button>
            </div>
          </div>

          <div class="kpi">
            <div class="kc k1"><div class="ka"></div><div class="kb"><span class="kl">Booked Today</span><strong class="kv">{{ summary?.bookedToday ?? 0 }}</strong><span class="ks">All appointments</span></div></div>
            <div class="kc k2"><div class="ka"></div><div class="kb"><span class="kl">Waiting</span><strong class="kv">{{ summary?.waiting ?? 0 }}</strong><span class="ks">In waiting area</span></div></div>
            <div class="kc k3"><div class="ka"></div><div class="kb"><span class="kl">Checked In</span><strong class="kv">{{ summary?.checkedIn ?? 0 }}</strong><span class="ks">Currently seeing</span></div></div>
            <div class="kc k4"><div class="ka"></div><div class="kb"><span class="kl">Completed</span><strong class="kv">{{ summary?.completed ?? 0 }}</strong><span class="ks">Done for today</span></div></div>
          </div>

          <div class="m">
            <div class="qs">
              <div class="sh">
                <h2>Today's Queue</h2>
                <span class="sc">{{ queueItems.length }} patient(s)</span>
              </div>

              <ng-container *ngIf="queueItems.length > 0; else noQueue">
                <div class="ql">
                  <div class="qi" *ngFor="let b of queueItems" [ngClass]="queueItemClass(b)" (click)="openAppointment(b.id)">
                    <div class="qih">
                      <app-avatar class="qi__avatar" [name]="b.patientName || 'Patient'" size="sm"></app-avatar>
                      <div class="qii">
                        <span class="qn">{{ b.patientName || 'Patient' }}</span>
                        <span class="qt">{{ b.slotStartTime ? (b.slotStartTime.substring(0,5)) : '--' }}</span>
                      </div>
                      <div class="qib">
                        <app-status-badge portal="doctor" [status]="b.status"></app-status-badge>
                        <span class="qp" *ngIf="b.queueNumber != null">#{{ b.queueNumber }}</span>
                      </div>
                    </div>
                    <div class="qs2">{{ displayQueueService(b) }}</div>
                  </div>
                </div>
              </ng-container>
              <ng-template #noQueue>
                <div class="qe">No appointments scheduled for today.</div>
              </ng-template>
            </div>

            <div class="ss">
              <div class="clinic-card">
                <div class="sh"><h2>Availability</h2></div>
                <div class="aa">
                  <button class="ab ab--available" [class.active]="todayStatus === 'Available'" (click)="updateStatus('Available')">Mark Available</button>
                  <div class="rr">
                    <input class="fi2" type="number" min="5" [(ngModel)]="runningLateMinutes" />
                    <button class="ab ab--late" [class.active]="todayStatus === 'RunningLate'" [disabled]="runningLateMinutes < 5" (click)="updateStatus('RunningLate')">Running Late</button>
                  </div>
                  <button class="ab ab--unavailable" [class.active]="todayStatus === 'UnavailableToday'" (click)="updateStatus('UnavailableToday')">Unavailable Today</button>
                </div>
              </div>

              <div class="clinic-card">
                <div class="sh"><h2>Working Schedule</h2></div>
                <div class="sl2" *ngIf="schedule.length > 0; else noSchedule">
                  <div class="sr2 sr2--today" *ngIf="todaySchedule as today">
                    <div class="sr2__meta">
                      <span class="sd">Today</span>
                      <span class="st2">{{ today.dayOfWeek }} - {{ formatTimeLabel(today.startTime) }} - {{ formatTimeLabel(today.endTime) }}</span>
                    </div>
                    <div class="shift-progress" aria-hidden="true">
                      <div class="shift-progress__bar">
                        <span class="shift-progress__fill" [style.width.%]="getShiftProgress(today)"></span>
                      </div>
                      <span class="shift-progress__remaining">{{ getShiftRemaining(today) }}</span>
                    </div>
                  </div>
                  <div class="sr2 sr2--tomorrow">
                    <div class="sr2__meta">
                      <span class="sd">Tomorrow</span>
                      <span class="st2">{{ getTomorrowScheduleLabel() }}</span>
                    </div>
                  </div>
                </div>
                <ng-template #noSchedule>
                  <div class="se2">No schedule configured.</div>
                </ng-template>
                <a class="cl" routerLink="/doctor/schedule">Manage Schedule &rarr;</a>
              </div>

              <div class="clinic-card">
                <div class="sh"><h2>Profile</h2></div>
                <div class="pi">
                  <div class="pr"><span class="pl2">Specialization</span><span>{{ doctor.specialization || '--' }}</span></div>
                  <div class="pr"><span class="pl2">Fee</span><span>PHP {{ doctor.consultationFee }}</span></div>
                  <div class="pr"><span class="pl2">Status</span><app-status-badge [status]="doctor.status"></app-status-badge></div>
                </div>
                <a class="cl" routerLink="/doctor/profile">Edit Profile &rarr;</a>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </ng-container>

    <ng-template #errorState>
      <app-empty-state icon="medical-outline" title="Unable to load dashboard" description="We could not load your doctor profile." ctaLabel="Retry" (ctaClick)="loadDashboard()"></app-empty-state>
    </ng-template>
  `,
  styleUrl: './doctor-dashboard.page.scss'
})
export class DoctorDashboardPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly authState = inject(AuthStateService);
  private readonly doctorService = inject(DoctorService);
  private readonly realtime = inject(ClinicDashboardRealtimeService);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);

  isLoading = true;
  doctor: Doctor | null = null;
  summary: { bookedToday: number; waiting: number; checkedIn: number; completed: number } | null = null;
  queueItems: Booking[] = [];
  schedule: DoctorSchedule[] = [];
  todayStatus: AvailabilityStatus = 'Available';
  greeting = '';
  runningLateMinutes = 15;
  private shiftTimerId: ReturnType<typeof setInterval> | null = null;

  get nextPatient(): Booking | null {
    const inClinic = this.queueItems.find((booking) => this.queueState(booking) === 'in_clinic');
    if (inClinic) {
      return inClinic;
    }

    const waiting = this.queueItems.find((booking) => this.queueState(booking) === 'waiting');
    return waiting ?? null;
  }

  get greetingSubtitle(): string {
    const now = new Date();
    const dayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
    const dateLabel = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(now);
    const todaySchedule = this.getScheduleForDate(now);
    const shiftLabel = todaySchedule
      ? `${this.formatTimeLabel(todaySchedule.startTime)}-${this.formatTimeLabel(todaySchedule.endTime)} shift`
      : 'No shift today';
    const specialization = this.doctor?.specialization || 'General Practice';
    return `${dayLabel}, ${dateLabel} - ${shiftLabel} - ${specialization}`;
  }

  get todaySchedule(): DoctorSchedule | null {
    return this.getScheduleForDate(new Date());
  }

  get tomorrowSchedule(): DoctorSchedule | null {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.getScheduleForDate(tomorrow);
  }

  ngOnInit(): void {
    this.setGreeting();
    this.shiftTimerId = setInterval(() => {
      this.greeting = this.greeting;
    }, 60000);
    this.destroyRef.onDestroy(() => {
      if (this.shiftTimerId) {
        clearInterval(this.shiftTimerId);
        this.shiftTimerId = null;
      }
    });
    this.authState.currentUser$
      .pipe(
        filter((user): user is NonNullable<typeof user> => Boolean(user)),
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.loadDashboard());

    // Realtime: auto-refresh dashboard on booking events
    this.realtime.events$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: any) => {
        if ([
          'BookingCreated',
          'BookingCancelled',
          'PatientCheckedIn',
          'PatientCheckInUndone',
          'DoctorCompletedConsultation',
          'PaymentCompleted',
          'PaymentWaived'
        ].includes(event.eventName)) {
          this.loadDashboard();
        }
      });
  }

  ionViewWillEnter(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.doctorService.getMyProfile().pipe(
      switchMap((doc) => {
        if (!doc) return of(null);
        this.doctor = doc;
        return forkJoin({
          summary: this.apiService.get<any[]>('bookings/doctor/today').pipe(
            switchMap((todayData) => {
              const queue = ((todayData ?? []) as Record<string, unknown>[])
                .map((row) => normalizeQueueBooking(row))
                .filter((booking): booking is Booking => Boolean(booking));
              return this.apiService.get<any>('bookings/doctor/today-summary').pipe(
                map((summaryResponse) => {
                  const row = (summaryResponse ?? {}) as Record<string, unknown>;
                  return {
                    bookedToday: normalizeNumber(row['today_total'], queue.length),
                    checkedIn: normalizeNumber(row['checked_in_count']),
                    waiting: normalizeNumber(row['checked_in_count']) + normalizeNumber(row['in_progress_count']),
                    completed: normalizeNumber(row['completed_count']),
                    noShow: normalizeNumber(row['no_show_count']),
                    cancelled: 0,
                    items: queue
                  } as DoctorTodaySummary;
                })
              );
            }),
            catchError(() => of(null))
          ),
          schedule: this.doctorService.getDoctorSchedules(doc.id).pipe(catchError(() => of([] as DoctorSchedule[]))),
          dayStatus: this.doctorService.getDayStatus(doc.id).pipe(catchError(() => of(null as DoctorDayStatus | null)))
        });
      }),
      catchError(() => of(null)),
      finalize(() => (this.isLoading = false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((result) => {
      if (!result || !this.doctor) return;
      this.summary = result.summary ? { bookedToday: result.summary.bookedToday, waiting: result.summary.waiting, checkedIn: result.summary.checkedIn, completed: result.summary.completed } : null;
      this.queueItems = (result.summary?.items ?? []).sort((a, b) => (a.queueNumber ?? 999) - (b.queueNumber ?? 999));
      this.schedule = result.schedule;
      this.todayStatus = result.dayStatus?.status ?? 'Available';
    });
  }

  updateStatus(status: AvailabilityStatus): void {
    if (!this.doctor) return;
    this.doctorService.setDayStatus(this.doctor.id, {
      date: this.todayStr(),
      status,
      runningLateMinutes: status === 'RunningLate' ? this.runningLateMinutes : null
    }).pipe(catchError(() => { this.showToast('Failed to update status.', 'danger'); return of(null); }))
      .subscribe((res) => {
        if (!res) return;
        this.todayStatus = res.status as AvailabilityStatus;
        this.showToast(`Status: ${this.label(status)}`, 'success');
      });
  }

  openAppointment(id: string): void {
    this.router.navigate(['/doctor/appointments', id]);
  }

  startConsult(bookingId: string): void {
    void this.router.navigate(['/doctor/appointments', bookingId]);
  }

  viewChart(patientId: string): void {
    void this.router.navigate(['/doctor/patients', patientId]);
  }

  queueItemClass(booking: Booking): Record<string, boolean> {
    const status = this.queueState(booking);
    return {
      'qi--completed': status === 'completed',
      'qi--in-clinic': status === 'in_clinic',
      'qi--waiting': status === 'waiting'
    };
  }

  displayQueueService(booking: Booking): string {
    return (
      booking.serviceNames?.join(', ')
      || booking.serviceName
      || booking.service?.name
      || booking.services?.map((service) => service.name).filter(Boolean).join(', ')
      || 'General Consultation'
    );
  }

  formatTimeLabel(value: string): string {
    const trimmed = value?.trim();
    if (!trimmed) {
      return '--:--';
    }

    const [hours = '0', minutes = '00'] = trimmed.split(':');
    const hour = Number(hours);
    const normalizedHour = Number.isFinite(hour) ? hour : 0;
    const suffix = normalizedHour >= 12 ? 'PM' : 'AM';
    const hour12 = ((normalizedHour + 11) % 12) + 1;
    return `${hour12}:${minutes.padStart(2, '0')} ${suffix}`;
  }

  getScheduleForDate(date: Date): DoctorSchedule | null {
    if (!this.schedule.length) {
      return null;
    }

    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    return this.schedule.find((schedule) => schedule.dayOfWeek.toLowerCase() === dayName.toLowerCase()) ?? null;
  }

  getShiftProgress(schedule: DoctorSchedule | null): number {
    if (!schedule) {
      return 0;
    }

    const { start, end, now } = this.getShiftTimes(schedule);
    if (!start || !end) {
      return 0;
    }

    const total = end.getTime() - start.getTime();
    if (total <= 0) {
      return 0;
    }

    const progress = ((now.getTime() - start.getTime()) / total) * 100;
    return Math.max(0, Math.min(100, progress));
  }

  getShiftRemaining(schedule: DoctorSchedule | null): string {
    if (!schedule) {
      return 'No shift scheduled';
    }

    const { end, now } = this.getShiftTimes(schedule);
    if (!end) {
      return 'No shift scheduled';
    }

    const remainingMinutes = Math.max(0, Math.round((end.getTime() - now.getTime()) / 60000));
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    if (hours >= 2) {
      return `${hours}h remaining`;
    }
    return `${hours}h ${minutes}m remaining`;
  }

  getTomorrowScheduleLabel(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(tomorrow);
    const schedule = this.tomorrowSchedule;
    return schedule
      ? `${dayLabel} - ${this.formatTimeLabel(schedule.startTime)} - ${this.formatTimeLabel(schedule.endTime)}`
      : `${dayLabel} - Day off`;
  }

  private setGreeting(): void {
    const h = new Date().getHours();
    this.greeting = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  }

  private normalizeStatus(status: string | null | undefined): string {
    return (status || '')
      .toString()
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }

  private queueState(booking: Booking): 'waiting' | 'in_clinic' | 'completed' | 'other' {
    const status = this.normalizeStatus(booking.status);
    if (['completed', 'done', 'done_for_today'].includes(status)) {
      return 'completed';
    }
    if (['checked_in', 'in_progress', 'in_clinic', 'consulting'].includes(status)) {
      return 'in_clinic';
    }
    if (['waiting', 'confirmed', 'pending', 'proof_submitted'].includes(status)) {
      return 'waiting';
    }
    return 'other';
  }

  private getShiftTimes(schedule: DoctorSchedule): { start: Date | null; end: Date | null; now: Date } {
    const now = new Date();
    const [startHour = '0', startMinute = '0'] = schedule.startTime.split(':');
    const [endHour = '0', endMinute = '0'] = schedule.endTime.split(':');
    const start = new Date(now);
    start.setHours(Number(startHour), Number(startMinute), 0, 0);
    const end = new Date(now);
    end.setHours(Number(endHour), Number(endMinute), 0, 0);
    return { start, end, now };
  }

  private label(s: AvailabilityStatus): string {
    return s === 'RunningLate' ? 'Running Late' : s === 'UnavailableToday' ? 'Unavailable Today' : 'Available';
  }

  private todayStr(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  private async showToast(msg: string, color: string = 'success'): Promise<void> {
    const t = await this.toastCtrl.create({ message: msg, duration: 1800, color, position: 'top' });
    await t.present();
  }
}

function normalizeQueueBooking(row: Record<string, unknown>): Booking | undefined {
  const id = trimOptionalString(row['id'] ?? row['booking_id'] ?? row['bookingId']);
  if (!id) {
    return undefined;
  }

  const appointmentDate = trimOptionalString(row['appointmentDate'] ?? row['appointment_date']) ?? '';
  const slotStartTime = trimOptionalString(row['slotStartTime'] ?? row['slot_start_time']) ?? '';
  const slotEndTime = trimOptionalString(row['slotEndTime'] ?? row['slot_end_time']) ?? slotStartTime;

  return {
    id,
    patientId: trimOptionalString(row['patientId'] ?? row['patient_id']) ?? '',
    patientName: trimOptionalString(row['patientName'] ?? row['patient_name']) ?? 'Patient',
    doctorId: trimOptionalString(row['doctorId'] ?? row['doctor_id']) ?? '',
    doctorName: trimOptionalString(row['doctorName'] ?? row['doctor_name']) ?? 'Doctor',
    serviceId: trimOptionalString(row['serviceId'] ?? row['service_id']) ?? '',
    serviceName: trimOptionalString(row['serviceName'] ?? row['service_name']),
    serviceNames: normalizeTextArray(row['serviceNames'] ?? row['service_names']),
    services: normalizeServices(row['services']),
    appointmentDate,
    slotStartTime,
    slotEndTime,
    status: (trimOptionalString(row['status']) as Booking['status']) ?? 'Pending',
    paymentStatus: (trimOptionalString(row['paymentStatus'] ?? row['payment_status']) as Booking['paymentStatus']) ?? 'Unpaid',
    paymentMode: (trimOptionalString(row['paymentMode'] ?? row['payment_mode']) as Booking['paymentMode']) ?? 'PayAtClinic',
    queueNumber: normalizeNullableNumber(row['queueNumber'] ?? row['queue_number']),
    totalFee: normalizeNumber(row['totalFee'] ?? row['total_fee']),
    consultationFeeSnapshot: normalizeNumber(row['consultationFeeSnapshot'] ?? row['consultation_fee_snapshot']),
    serviceFeeSnapshot: normalizeNumber(row['serviceFeeSnapshot'] ?? row['service_fee_snapshot']),
    isWalkIn: normalizeBoolean(row['isWalkIn'] ?? row['is_walk_in']),
    createdAt: trimOptionalString(row['createdAt'] ?? row['created_at']) ?? new Date().toISOString(),
    finalAmount: normalizeNullableNumber(row['finalAmount'] ?? row['final_amount']),
    amountDue: normalizeNullableNumber(row['amountDue'] ?? row['amount_due']),
    isProfessionalFeeWaived: normalizeBooleanOrUndefined(row['isProfessionalFeeWaived'] ?? row['is_professional_fee_waived']),
    professionalFeeWaivedReason: trimOptionalString(row['professionalFeeWaivedReason'] ?? row['professional_fee_waived_reason'])
  };
}

function trimOptionalString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (value == null) {
    return undefined;
  }

  const text = String(value).trim();
  return text.length > 0 ? text : undefined;
}

function normalizeTextArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value.map((entry) => trimOptionalString(entry)).filter((entry): entry is string => Boolean(entry));
  return items.length > 0 ? items : undefined;
}

function normalizeServices(value: unknown): Booking['services'] {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }
      const row = entry as Record<string, unknown>;
      const id = trimOptionalString(row['id'] ?? row['service_id']);
      const name = trimOptionalString(row['name'] ?? row['service_name']);
      return id && name ? { id, name } : null;
    })
    .filter((entry): entry is NonNullable<Booking['services']>[number] => Boolean(entry));
}

function normalizeNumber(value: unknown, fallback = 0): number {
  const text = trimOptionalString(value);
  if (!text) {
    return fallback;
  }

  const num = Number(text);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeNullableNumber(value: unknown): number | null {
  const text = trimOptionalString(value);
  if (!text) {
    return null;
  }

  const num = Number(text);
  return Number.isFinite(num) ? num : null;
}

function normalizeBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  const text = trimOptionalString(value);
  if (!text) {
    return false;
  }

  return text.toLowerCase() === 'true' || text === '1';
}

function normalizeBooleanOrUndefined(value: unknown): boolean | undefined {
  if (value == null) {
    return undefined;
  }

  return normalizeBoolean(value);
}

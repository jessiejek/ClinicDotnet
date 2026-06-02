import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonCheckbox,
  IonInput,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  firstValueFrom,
  map,
  of,
  switchMap,
} from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CreateWalkInRequest } from '../../../core/services/booking.service';
import { rowToSummary } from '../../admin/services/admin-patients.service';
import { AvailableSlot } from '../../public/services/public.service';
import { BookingAvailabilityService } from '../../public/services/booking-availability.service';
import { CreatePatientRequest, Doctor, PatientDetail, PatientSummary, Service, TimeSlot } from '../../../core/models';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SlotGridComponent } from '../../../shared/components/slot-grid/slot-grid.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

interface WalkInPatient {
  id: string;
  patientCode: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  sex: string;
  contactNumber?: string;
  email?: string;
  userId?: string;
  hasAccount?: boolean;
  isGuest: boolean;
}

type WalkInStep = 1 | 2 | 3;
type QuickRegisterControl = 'firstName' | 'middleName' | 'lastName' | 'dateOfBirth' | 'sex' | 'contactNumber' | 'email' | 'address';
type BookingControl = 'doctorId' | 'serviceId' | 'appointmentDate';

@Component({
  selector: 'app-staff-walk-in-page',
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    IonCheckbox,
    IonInput,
    IonItem,
    IonLabel,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    EmptyStateComponent,
    SlotGridComponent,
    StatusBadgeComponent
  ],
  templateUrl: './staff-walk-in.page.html',
  styleUrl: './staff-walk-in.page.scss'
})
export class StaffWalkInPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly availabilityService = inject(BookingAvailabilityService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastCtrl = inject(ToastController);
  private readonly destroyRef = inject(DestroyRef);

  get todayIso(): string {
    return this.availabilityService.getManilaTodayIso();
  }
  readonly paymentMode: 'PayAtClinic' = 'PayAtClinic';

  currentWalkInStep: WalkInStep = 1;
  searchControl = this.fb.nonNullable.control('');
  quickRegisterForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    sex: ['', Validators.required],
    contactNumber: [''],
    email: ['', [Validators.email]],
    address: [''],
    preparePortalAccount: [false]
  });
  bookingForm = this.fb.nonNullable.group({
    doctorId: ['', Validators.required],
    serviceId: ['', Validators.required],
    appointmentDate: [this.todayIso, Validators.required]
  });

  doctors: Doctor[] = [];
  services: Service[] = [];
  slots: TimeSlot[] = [];
  selectedSlot: TimeSlot | null = null;
  selectedPatient: WalkInPatient | null = null;

  isSearchingPatients = false;
  isLoadingDoctors = false;
  isLoadingServices = false;
  isLoadingSlots = false;
  isSavingPatient = false;
  isSavingBooking = false;
  showQuickRegister = false;
  searchResults: WalkInPatient[] = [];
  searchErrorMessage: string | null = null;
  patientTotalCount = 0;
  patientCurrentPage = 1;
  patientPageSize = 20;
  patientTotalPages = 0;
  hasLoadedPatients = false;

  private searchRequestToken = 0;
  private servicesRequestToken = 0;
  private slotsRequestToken = 0;

  ngOnInit(): void {
    this.loadDoctors();
    this.loadPatients('');

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => this.searchPatients(query));

    this.bookingForm.controls.doctorId.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((doctorId) => this.onDoctorChanged(doctorId));

    this.bookingForm.controls.serviceId.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshCurrentStep());

    this.bookingForm.controls.appointmentDate.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((date) => this.onDateChanged(date));

    const rescheduling = this.route.snapshot.queryParamMap.get('rescheduling');
    if (rescheduling) {
      this.searchControl.setValue('');
    }
  }

  get hasSearchQuery(): boolean {
    return this.searchControl.value.trim().length > 0;
  }

  get showSearchPrompt(): boolean {
    return !this.hasSearchQuery && !this.selectedPatient && !this.hasLoadedPatients && !this.isSearchingPatients && !this.searchErrorMessage;
  }

  get showSearchEmpty(): boolean {
    return this.hasSearchQuery && this.hasLoadedPatients && !this.isSearchingPatients && !this.searchErrorMessage && this.searchResults.length === 0;
  }

  get showInitialEmpty(): boolean {
    return !this.hasSearchQuery && this.hasLoadedPatients && !this.isSearchingPatients && !this.searchErrorMessage && this.searchResults.length === 0;
  }

  get selectedDoctor(): Doctor | null {
    const doctorId = this.bookingForm.controls.doctorId.value;
    return this.doctors.find((doctor) => doctor.id === doctorId) ?? null;
  }

  get selectedService(): Service | null {
    const serviceId = this.bookingForm.controls.serviceId.value;
    return this.services.find((service) => service.id === serviceId) ?? null;
  }

  get selectedDateLabel(): string {
    return formatLocalDateLabel(this.bookingForm.controls.appointmentDate.value);
  }

  get selectedDoctorLabel(): string {
    return this.selectedDoctor?.fullName?.trim() || 'No doctor selected';
  }

  get selectedServiceLabel(): string {
    return this.selectedService?.name?.trim() || 'No service selected';
  }

  get selectedSlotLabel(): string {
    if (!this.selectedSlot) {
      return 'No slot selected';
    }

    return `${this.selectedSlot.time} - ${this.selectedSlot.endTime}`;
  }

  get selectedFee(): number {
    return this.selectedService?.price ?? this.selectedDoctor?.consultationFee ?? 0;
  }

  get selectedFeeLabel(): string {
    return formatPhpAmount(this.selectedFee);
  }

  get doctorUnavailableToday(): boolean {
    return Boolean(this.selectedDoctor && this.selectedDoctor.status !== 'Active');
  }

  get canSubmitBooking(): boolean {
    return Boolean(
      this.selectedPatient &&
        this.selectedDoctor &&
        this.selectedService &&
        this.selectedSlot &&
        this.bookingForm.valid
    );
  }

  canAccessStep(step: WalkInStep): boolean {
    switch (step) {
      case 1:
        return true;
      case 2:
        return Boolean(this.selectedPatient);
      case 3:
        return this.canSubmitBooking;
      default:
        return false;
    }
  }

  isStepComplete(step: WalkInStep): boolean {
    switch (step) {
      case 1:
        return Boolean(this.selectedPatient);
      case 2:
        return Boolean(this.selectedPatient && this.selectedDoctor && this.selectedService && this.selectedSlot);
      case 3:
        return false;
      default:
        return false;
    }
  }

  goToStep(step: WalkInStep): void {
    if (this.canAccessStep(step)) {
      this.currentWalkInStep = step;
    }
  }

  trackById(_index: number, item: { id: string }): string {
    return item.id;
  }

  patientDisplayName(patient: WalkInPatient | null | undefined): string {
    if (!patient) {
      return 'Patient';
    }

    const explicit = trimText(patient.fullName);
    if (explicit) {
      return explicit;
    }

    const parts = [patient.firstName, patient.middleName, patient.lastName]
      .map((value) => trimText(value))
      .filter((value): value is string => Boolean(value));

    return parts.length ? parts.join(' ') : 'Patient';
  }

  patientAccountStatus(patient: WalkInPatient | null | undefined): 'LinkedAccount' | 'NoAccount' | 'AccountUnknown' {
    if (!patient) {
      return 'AccountUnknown';
    }

    if (patient.hasAccount === true || Boolean(patient.userId?.trim())) {
      return 'LinkedAccount';
    }

    if (patient.hasAccount === false) {
      return 'NoAccount';
    }

    return 'AccountUnknown';
  }

  patientAccountLabel(patient: WalkInPatient | null | undefined): string {
    switch (this.patientAccountStatus(patient)) {
      case 'LinkedAccount':
        return 'Account Linked';
      case 'NoAccount':
        return 'No Account';
      default:
        return 'Account Unknown';
    }
  }

  patientContactLabel(patient: WalkInPatient | null | undefined): string {
    return trimText(patient?.contactNumber) || 'No contact provided';
  }

  patientEmailLabel(patient: WalkInPatient | null | undefined): string {
    return trimText(patient?.email) || 'No email provided';
  }

  showQuickRegisterError(controlName: QuickRegisterControl): boolean {
    const control = this.quickRegisterForm.get(controlName);
    return Boolean(control && control.invalid && (control.touched || control.dirty));
  }

  showBookingError(controlName: BookingControl): boolean {
    const control = this.bookingForm.get(controlName);
    return Boolean(control && control.invalid && (control.touched || control.dirty));
  }

  openQuickRegister(): void {
    this.showQuickRegister = true;
  }

  cancelQuickRegister(): void {
    this.showQuickRegister = false;
    this.quickRegisterForm.reset({
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      contactNumber: '',
      email: '',
      address: '',
      preparePortalAccount: false
    });
  }

  retrySearch(): void {
    this.loadPatients(this.searchControl.value);
  }

  selectPatient(patient: WalkInPatient): void {
    this.selectedPatient = patient;
    this.searchResults = [];
    this.searchErrorMessage = null;
    this.showQuickRegister = false;
    this.searchControl.setValue('', { emitEvent: false });
    this.refreshCurrentStep();
  }

  clearSelectedPatient(): void {
    this.selectedPatient = null;
    this.searchResults = [];
    this.searchErrorMessage = null;
    this.showQuickRegister = false;
    this.searchControl.setValue('', { emitEvent: false });
    this.currentWalkInStep = 1;
    this.loadPatients('');
  }

  onSlotSelected(slot: { slot: string; slotEnd: string }): void {
    this.selectedSlot = { time: slot.slot, endTime: slot.slotEnd, status: 'selected' };
    this.refreshCurrentStep();
  }

  async createPatient(): Promise<void> {
    if (this.quickRegisterForm.invalid) {
      this.quickRegisterForm.markAllAsTouched();
      return;
    }

    const values = this.quickRegisterForm.getRawValue();
    const dto: CreatePatientRequest = {
      firstName: values.firstName.trim(),
      middleName: optionalText(values.middleName),
      lastName: values.lastName.trim(),
      dateOfBirth: values.dateOfBirth.trim(),
      sex: values.sex.trim(),
      contactNumber: optionalText(values.contactNumber),
      email: optionalText(values.email),
      address: optionalText(values.address)
    };

    this.isSavingPatient = true;

    try {
      const patient = await firstValueFrom(this.apiService.post<any>('patients', dto));
      this.selectedPatient = mapCreatedPatient(patient);
      this.searchResults = [];
      this.searchErrorMessage = null;
      this.showQuickRegister = false;
      this.searchControl.setValue('', { emitEvent: false });
      this.cancelQuickRegister();
      await this.presentToast('Guest patient created successfully. Patient may link an online account later.', 'success');
      this.refreshCurrentStep();
    } catch (error) {
      await this.presentToast(extractApiErrorMessage(error, 'Failed to create patient.'), 'danger');
    } finally {
      this.isSavingPatient = false;
    }
  }

  async createBooking(): Promise<void> {
    if (!this.canSubmitBooking || !this.selectedPatient || !this.selectedDoctor || !this.selectedService || !this.selectedSlot) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const payload: CreateWalkInRequest = {
      patientId: this.selectedPatient.id,
      doctorId: this.selectedDoctor.id,
      serviceId: this.selectedService.id,
      appointmentDate: this.bookingForm.controls.appointmentDate.value,
      slotStartTime: this.selectedSlot.time,
      slotEndTime: this.selectedSlot.endTime,
      paymentMode: this.paymentMode,
      notes: 'Walk-in booking created by staff.'
    };

    this.isSavingBooking = true;

    try {
      const booking = await this.submitWalkInBooking(payload);
      await this.presentToast('Walk-in booking created successfully.', 'success');
      await this.router.navigate(['/staff/bookings']);
    } catch (error) {
      await this.presentToast(extractApiErrorMessage(error, 'Failed to create walk-in booking.'), 'danger');
    } finally {
      this.isSavingBooking = false;
    }
  }

  private async submitWalkInBooking(payload: CreateWalkInRequest): Promise<{ id: string; queueNumber: number | null }> {
    const booking = await firstValueFrom(this.apiService.post<any>('bookings/walk-in', {
      patientId: payload.patientId,
      doctorId: payload.doctorId,
      serviceId: payload.serviceId,
      notes: payload.notes
    }));

    const bookingId = booking?.id;

    if (!bookingId) {
      throw new Error('Walk-in booking was created but no booking ID was returned.');
    }

    return {
      id: bookingId,
      queueNumber: normalizeNullableNumber(booking?.queueNumber ?? booking?.queue_number)
    };
  }

  private loadDoctors(): void {
    this.isLoadingDoctors = true;

    this.apiService
      .get<any[]>('doctors')
      .pipe(
        finalize(() => {
          this.isLoadingDoctors = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (doctors) => {
          this.doctors = doctors;
          if (!this.bookingForm.controls.doctorId.value && doctors.length === 1) {
            this.bookingForm.controls.doctorId.setValue(doctors[0].id);
          }
        },
        error: async (error) => {
          this.doctors = [];
          await this.presentToast(extractApiErrorMessage(error, 'Failed to load doctors.'), 'danger');
        }
      });
  }

  private searchPatients(query: string): void {
    this.loadPatients(query);
  }

  private loadPatients(query: string): void {
    const trimmed = query.trim();
    this.searchErrorMessage = null;
    this.showQuickRegister = false;
    const fallbackErrorMessage = trimmed ? 'Unable to search patients right now.' : 'Unable to load patients right now.';

    const token = ++this.searchRequestToken;
    this.isSearchingPatients = true;
    this.hasLoadedPatients = false;

    let endpoint = 'patients?page=1&pageSize=' + this.patientPageSize;
    if (trimmed) endpoint += '&search=' + encodeURIComponent(trimmed);

    this.apiService.get<any>(endpoint).pipe(
      map((data) => {
        const items = ((data?.items ?? data ?? []) as Record<string, unknown>[]).map((row) => rowToSummary(row));
        return {
          items,
          totalCount: data?.totalCount ?? items.length,
          page: data?.page ?? 1,
          pageSize: data?.pageSize ?? items.length,
          totalPages: data?.totalPages ?? 0,
          total: data?.total ?? items.length
        };
      }),
      finalize(() => {
        if (token === this.searchRequestToken) {
          this.isSearchingPatients = false;
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (result) => {
        if (token !== this.searchRequestToken) {
          return;
        }

        this.searchResults = result.items.map((patient) => mapSearchPatient(patient));
        this.patientTotalCount = result.totalCount ?? result.total ?? this.searchResults.length;
        this.patientCurrentPage = result.page || 1;
        this.patientPageSize = result.pageSize || this.patientPageSize;
        this.patientTotalPages = result.totalPages || 0;
        this.hasLoadedPatients = true;
      },
      error: async (error) => {
        if (token !== this.searchRequestToken) {
          return;
        }

        this.searchResults = [];
        this.searchErrorMessage = extractApiErrorMessage(error, fallbackErrorMessage);
        this.patientTotalCount = 0;
        this.patientCurrentPage = 1;
        this.patientTotalPages = 0;
        this.hasLoadedPatients = true;
        await this.presentToast(this.searchErrorMessage, 'danger');
      }
    });
  }

  private onDoctorChanged(doctorId: string): void {
    this.selectedSlot = null;
    this.services = [];
    this.bookingForm.controls.serviceId.setValue('', { emitEvent: false });

    if (!doctorId) {
      this.slots = [];
      this.isLoadingSlots = false;
      this.refreshCurrentStep();
      return;
    }

    this.loadServicesForDoctor(doctorId);
    this.refreshAvailableSlots();
    this.refreshCurrentStep();
  }

  private onDateChanged(date: string): void {
    if (!date) {
      this.selectedSlot = null;
      this.slots = [];
      this.isLoadingSlots = false;
      this.refreshCurrentStep();
      return;
    }

    this.selectedSlot = null;
    this.refreshAvailableSlots();
    this.refreshCurrentStep();
  }

  private loadServicesForDoctor(doctorId: string): void {
    const token = ++this.servicesRequestToken;
    this.isLoadingServices = true;

    this.apiService
      .get<any[]>('doctors/' + doctorId + '/services')
      .pipe(
        switchMap((services) => {
          if (services.length > 0) {
            return of(services);
          }

          return this.apiService.get<any[]>('services').pipe(
            map((allServices) => allServices.filter((service) => service.doctorIds.includes(doctorId)))
          );
        }),
        finalize(() => {
          if (token === this.servicesRequestToken) {
            this.isLoadingServices = false;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (services) => {
          if (token !== this.servicesRequestToken) {
            return;
          }

          this.services = services;
          const preferredService = services[0] ?? null;
          this.bookingForm.controls.serviceId.setValue(preferredService?.id ?? '', { emitEvent: false });
          this.refreshCurrentStep();
        },
        error: async (error) => {
          if (token !== this.servicesRequestToken) {
            return;
          }

          this.services = [];
          this.bookingForm.controls.serviceId.setValue('', { emitEvent: false });
          await this.presentToast(extractApiErrorMessage(error, 'Failed to load services.'), 'danger');
        }
      });
  }

  private refreshAvailableSlots(): void {
    const doctorId = this.bookingForm.controls.doctorId.value;
    const date = this.bookingForm.controls.appointmentDate.value;

    if (!doctorId || !date) {
      this.slots = [];
      this.isLoadingSlots = false;
      return;
    }

    const token = ++this.slotsRequestToken;
    this.isLoadingSlots = true;

    this.apiService
      .get<any[]>('doctors/' + doctorId + '/available-slots?date=' + date)
      .pipe(
        finalize(() => {
          if (token === this.slotsRequestToken) {
            this.isLoadingSlots = false;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (slots) => {
          if (token !== this.slotsRequestToken) {
            return;
          }

          const dateStr = this.bookingForm.controls.appointmentDate.value;
          this.slots = slots.map((slot) => mapAvailableSlot(slot, dateStr));
        },
        error: async (error) => {
          if (token !== this.slotsRequestToken) {
            return;
          }

          this.slots = [];
          await this.presentToast(extractApiErrorMessage(error, 'Failed to load available slots.'), 'danger');
        }
      });
  }

  private refreshCurrentStep(): void {
    if (!this.selectedPatient) {
      this.currentWalkInStep = 1;
      return;
    }

    if (this.canSubmitBooking) {
      this.currentWalkInStep = 3;
      return;
    }

    this.currentWalkInStep = 2;
  }

  private async presentToast(message: string, color: 'success' | 'danger' = 'success'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2400,
      color,
      position: 'top'
    });
    await toast.present();
  }
}

function mapSearchPatient(patient: PatientSummary): WalkInPatient {
  return {
    id: patient.id,
    patientCode: trimText(patient.patientCode) || patient.id,
    firstName: trimText(patient.firstName) || '',
    middleName: trimText(patient.middleName),
    lastName: trimText(patient.lastName) || '',
    fullName: trimText(patient.fullName) || buildPatientName(patient.firstName, patient.middleName, patient.lastName),
    dateOfBirth: trimText(patient.dateOfBirth) || '',
    sex: trimText(patient.sex) || '',
    contactNumber: trimText(patient.contactNumber),
    email: trimText(patient.email),
    userId: trimText(patient.userId),
    hasAccount: Boolean(patient.hasAccount),
    isGuest: Boolean(patient.isGuest)
  };
}

function mapCreatedPatient(patient: PatientDetail): WalkInPatient {
  return {
    id: patient.id,
    patientCode: trimText(patient.patientCode) || patient.id,
    firstName: trimText(patient.firstName) || '',
    middleName: trimText(patient.middleName),
    lastName: trimText(patient.lastName) || '',
    fullName: buildPatientName(patient.firstName, patient.middleName, patient.lastName),
    dateOfBirth: trimText(patient.dateOfBirth) || '',
    sex: trimText(patient.sex) || '',
    contactNumber: trimText(patient.contactNumber),
    email: trimText(patient.email),
    userId: trimText(patient.userId),
    hasAccount: Boolean(patient.hasAccount),
    isGuest: Boolean(patient.isGuest)
  };
}

function mapAvailableSlot(slot: AvailableSlot, appointmentDate?: string | null): TimeSlot {
  const time = trimText(slot.time || slot.slotStartTime) || '';
  const endTime = trimText(slot.endTime || slot.slotEndTime) || '';
  const bookedCount = typeof slot.bookedCount === 'number' ? slot.bookedCount : 0;
  const capacity = typeof slot.capacity === 'number' ? slot.capacity : 0;
  const isAvailable = typeof slot.isAvailable === 'boolean' ? slot.isAvailable : typeof slot.IsAvailable === 'boolean' ? slot.IsAvailable : true;
  const isFull = capacity > 0 ? bookedCount >= capacity : false;

  // Mark past-time slots as disabled (only for today's date)
  const isPastTime = time && appointmentDate ? isSlotTimeInPast(time, appointmentDate) : false;

  let status: 'available' | 'full' | 'disabled' | 'pending';
  if (isPastTime) {
    status = 'disabled';
  } else if (!isAvailable) {
    status = 'disabled';
  } else if (isFull) {
    status = 'full';
  } else {
    status = 'available';
  }

  return {
    time,
    endTime,
    status
  };
}

function isSlotTimeInPast(slotTime: string, appointmentDate: string): boolean {
  // Only compare against current time if the appointment is for today
  const now = new Date();
  const todayStr = toLocalIsoDate(now);

  if (appointmentDate !== todayStr) {
    return false;
  }

  const [hours, minutes] = slotTime.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    return false;
  }

  const slotMinutes = hours * 60 + minutes;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return slotMinutes <= nowMinutes;
}

function buildPatientName(firstName?: string | null, middleName?: string | null, lastName?: string | null): string {
  const parts = [firstName, middleName, lastName].map((value) => trimText(value)).filter((value): value is string => Boolean(value));
  return parts.length ? parts.join(' ') : 'Patient';
}

function toLocalIsoDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatLocalDateLabel(value: string): string {
  if (!value) {
    return 'No date selected';
  }

  const [year, month, day] = value.split('-').map((part) => Number(part));
  if (!year || !month || !day) {
    return value;
  }

  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

function formatPhpAmount(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0
  }).format(amount);
}

function trimText(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function optionalText(value: string | null | undefined): string | undefined {
  const trimmed = trimText(value);
  return trimmed || undefined;
}

function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const body = (error as { error?: unknown }).error;
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (typeof body === 'object' && body !== null && 'message' in body) {
      const message = (body as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }

  return fallback;
}

function trimOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
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

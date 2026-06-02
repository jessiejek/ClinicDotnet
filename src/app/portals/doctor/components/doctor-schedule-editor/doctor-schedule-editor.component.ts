import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonChip, IonIcon, IonInput, IonNote, IonToggle } from '@ionic/angular/standalone';
import { DayOfWeek, DoctorBlockedDate, TimeSlot } from '../../../../core/models';
import { SlotGridComponent } from '../../../../shared/components/slot-grid/slot-grid.component';

export interface DoctorWeeklyScheduleDraft {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isActive: boolean;
  slotDurationMinutes: number;
  slotCapacity: number;
}

export interface DoctorScheduleSavePayload {
  schedules: DoctorWeeklyScheduleDraft[];
  dailyPatientLimit: number | null;
}

@Component({
  selector: 'app-doctor-schedule-editor',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, FormsModule, IonChip, IonIcon, IonInput, IonNote, IonToggle, SlotGridComponent],
  templateUrl: './doctor-schedule-editor.component.html',
  styleUrl: './doctor-schedule-editor.component.scss'
})
export class DoctorScheduleEditorComponent implements OnChanges {
  @Input() schedules: DoctorWeeklyScheduleDraft[] = [];
  @Input() blockedDates: DoctorBlockedDate[] = [];
  @Input() previewSlots: TimeSlot[] = [];
  @Input() previewDate = '';
  @Input() isSaving = false;
  @Input() dailyPatientLimit: number | string | null = null;
  @Input() previewDayIsActive = false;
  @Input() previewDayHasSlots = false;
  @Input() previewDayIsBlocked = false;

  @Output() schedulesSaved = new EventEmitter<DoctorScheduleSavePayload>();
  @Output() blockedDateAdded = new EventEmitter<{ blockedDate: string; reason: string }>();
  @Output() blockedDateRemoved = new EventEmitter<string>();
  @Output() previewDateChanged = new EventEmitter<string>();
  @Output() dirtyChanged = new EventEmitter<void>();

  draftSchedules: DoctorWeeklyScheduleDraft[] = [];
  blockedDateValue = '';
  blockedReason = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schedules']) {
      this.draftSchedules = this.schedules.map((schedule) => ({ ...schedule }));
    }
    if (changes['previewDate']) {
      this.blockedDateValue = this.blockedDateValue || '';
    }
  }

  save(): void {
    this.schedulesSaved.emit({
      schedules: this.draftSchedules.map((schedule) => ({ ...schedule })),
      dailyPatientLimit:
        this.dailyPatientLimit === null || this.dailyPatientLimit === undefined || this.dailyPatientLimit === ''
          ? null
          : Number(this.dailyPatientLimit)
    });
  }

  addBlockedDate(): void {
    const blockedDate = this.blockedDateValue.trim();
    const reason = this.blockedReason.trim();
    if (!blockedDate) {
      return;
    }
    this.dirtyChanged.emit();
    this.blockedDateAdded.emit({
      blockedDate,
      reason: reason || 'Unavailable'
    });
    this.blockedDateValue = '';
    this.blockedReason = '';
  }

  removeBlockedDate(id: string): void {
    this.dirtyChanged.emit();
    this.blockedDateRemoved.emit(id);
  }

  onPreviewDateInput(event: Event): void {
    const custom = event as CustomEvent<{ value?: string | number | null }>;
    const value = String(custom.detail?.value ?? '').trim();
    if (!value) {
      return;
    }
    this.previewDate = value;
    this.previewDateChanged.emit(value);
  }

  markDirty(): void {
    this.dirtyChanged.emit();
  }
}

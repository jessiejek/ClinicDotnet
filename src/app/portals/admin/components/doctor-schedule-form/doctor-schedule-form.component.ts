import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DayOfWeek } from '../../../../core/models';

export interface DoctorScheduleDraft {
  dayOfWeek: DayOfWeek;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-doctor-schedule-form',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './doctor-schedule-form.component.html',
  styleUrl: './doctor-schedule-form.component.scss'
})
export class DoctorScheduleFormComponent {
  @Input() value: DoctorScheduleDraft[] = this.defaultRows();
  @Output() valueChange = new EventEmitter<DoctorScheduleDraft[]>();

  get rows(): DoctorScheduleDraft[] {
    return this.value.length ? this.value : this.defaultRows();
  }

  toggle(index: number, enabled: boolean): void {
    const next = this.rows.map((row, rowIndex) => (rowIndex === index ? { ...row, enabled } : row));
    this.value = next;
    this.valueChange.emit(next);
  }

  updateTime(index: number, key: 'startTime' | 'endTime', value: string): void {
    const next = this.rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row));
    this.value = next;
    this.valueChange.emit(next);
  }

  private defaultRows(): DoctorScheduleDraft[] {
    return [
      { dayOfWeek: 'Monday', enabled: true, startTime: '08:00', endTime: '17:00' },
      { dayOfWeek: 'Tuesday', enabled: true, startTime: '08:00', endTime: '17:00' },
      { dayOfWeek: 'Wednesday', enabled: true, startTime: '08:00', endTime: '17:00' },
      { dayOfWeek: 'Thursday', enabled: true, startTime: '08:00', endTime: '17:00' },
      { dayOfWeek: 'Friday', enabled: true, startTime: '08:00', endTime: '17:00' },
      { dayOfWeek: 'Saturday', enabled: false, startTime: '08:00', endTime: '12:00' },
      { dayOfWeek: 'Sunday', enabled: false, startTime: '08:00', endTime: '12:00' }
    ];
  }
}

import { NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  inject
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FollowUp } from '../../../../core/models';
import { IonCheckbox, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';

export interface FollowUpDraftView {
  id: string;
  followUpDate: string;
  reason: string;
  reminderEnabled: boolean;
}

@Component({
  selector: 'app-follow-up-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, IonCheckbox, IonInput, IonItem, IonLabel],
  templateUrl: './follow-up-form.component.html',
  styleUrl: './follow-up-form.component.scss'
})
export class FollowUpFormComponent implements OnChanges {
  @Input() value: FollowUpDraftView | null = null;
  @Input() locked = false;
  @Output() followUpChange = new EventEmitter<FollowUpDraftView | null>();

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.group({
    followUpDate: [this.getDefaultFollowUpDate()],
    reason: [''],
    reminderEnabled: [false]
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.emitValue();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.form.patchValue(
        {
          followUpDate: this.value?.followUpDate ?? this.getDefaultFollowUpDate(),
          reason: this.value?.reason ?? '',
          reminderEnabled: this.value?.reminderEnabled ?? false
        },
        { emitEvent: false }
      );
      this.emitValue();
    }

    if (changes['locked']) {
      if (this.locked) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
    }
  }

  private emitValue(): void {
    const value = this.form.getRawValue();
    const followUpDate = value.followUpDate ?? '';
    const reason = value.reason ?? '';

    if (!followUpDate && !reason) {
      this.followUpChange.emit(null);
      return;
    }
    this.followUpChange.emit({
      id: `fu-${Date.now()}`,
      followUpDate,
      reason,
      reminderEnabled: Boolean(value.reminderEnabled)
    });
  }

  private getDefaultFollowUpDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().slice(0, 10);
  }
}

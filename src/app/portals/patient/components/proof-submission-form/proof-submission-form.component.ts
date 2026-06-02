import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { Booking, ProofType } from '../../../../core/models';

interface ProofSubmissionPayload {
  bookingId: string;
  proofType: ProofType;
  proofValue: string;
}

@Component({
  selector: 'app-proof-submission-form',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton
  ],
  templateUrl: './proof-submission-form.component.html',
  styleUrl: './proof-submission-form.component.scss'
})
export class ProofSubmissionFormComponent {
  @Input({ required: true }) booking!: Booking;
  @Input() isSubmitting = false;
  @Output() proofSubmitted = new EventEmitter<ProofSubmissionPayload>();

  readonly form = this.fb.group({
    proofType: this.fb.control<ProofType | null>(null, Validators.required),
    referenceNumber: this.fb.control('', Validators.required),
    screenshotFilename: this.fb.control('', Validators.required)
  });

  constructor(private readonly fb: FormBuilder) {
    this.form.controls.proofType.valueChanges.subscribe((proofType) => {
      if (proofType === 'ReferenceNumber') {
        this.form.controls.referenceNumber.setValidators([Validators.required]);
        this.form.controls.screenshotFilename.clearValidators();
        this.form.controls.screenshotFilename.setValue('');
      } else if (proofType === 'Screenshot') {
        this.form.controls.referenceNumber.clearValidators();
        this.form.controls.referenceNumber.setValue('');
        this.form.controls.screenshotFilename.setValidators([Validators.required]);
      } else {
        this.form.controls.referenceNumber.clearValidators();
        this.form.controls.screenshotFilename.clearValidators();
      }

      this.form.controls.referenceNumber.updateValueAndValidity({ emitEvent: false });
      this.form.controls.screenshotFilename.updateValueAndValidity({ emitEvent: false });
    });
  }

  submit(): void {
    if (this.form.invalid || !this.form.controls.proofType.value) {
      this.form.markAllAsTouched();
      return;
    }

    const proofType = this.form.controls.proofType.value;
    const proofValue =
      proofType === 'ReferenceNumber'
        ? String(this.form.controls.referenceNumber.value ?? '').trim()
        : String(this.form.controls.screenshotFilename.value ?? '').trim();

    if (!proofValue) {
      this.form.markAllAsTouched();
      return;
    }

    this.proofSubmitted.emit({
      bookingId: this.booking.id,
      proofType,
      proofValue
    });
  }
}

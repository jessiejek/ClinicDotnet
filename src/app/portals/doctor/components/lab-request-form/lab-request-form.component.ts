import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  inject,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IonButton, IonInput, IonItem, IonLabel, IonTextarea } from '@ionic/angular/standalone';

export interface LabRequestDraftView {
  id: string;
  testName: string;
  reason?: string;
  fileName?: string;
}

@Component({
  selector: 'app-lab-request-form',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, ReactiveFormsModule, IonButton, IonInput, IonItem, IonLabel, IonTextarea],
  templateUrl: './lab-request-form.component.html',
  styleUrl: './lab-request-form.component.scss'
})
export class LabRequestFormComponent implements OnChanges {
  @Input() value: LabRequestDraftView[] = [];
  @Input() auditText = 'Not yet edited this visit';
  @Input() locked = false;
  @Input() actionMode: 'edit' | 'request' = 'edit';
  @Output() requestsChange = new EventEmitter<LabRequestDraftView[]>();
  @Output() requestAttendingPhysician = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly quickTests = ['CBC', 'Urinalysis', 'Chest X-ray', 'Fasting Blood Sugar', 'Lipid Profile'];
  selectedLabOrders: string[] = [];

  readonly form = this.fb.group({
    testName: [''],
    reason: [''],
    fileName: ['']
  });

  requests: LabRequestDraftView[] = [];
  editIndex = -1;

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      // Draft form only; emit happens on add.
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.requests = this.value.map((request) => ({ ...request }));
      this.requestsChange.emit([...this.requests]);
    }

    if (changes['locked']) {
      if (this.locked) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
    }
  }

  toggleQuickTest(value: string): void {
    if (this.locked) {
      return;
    }

    if (this.selectedLabOrders.includes(value)) {
      this.selectedLabOrders = this.selectedLabOrders.filter((item) => item !== value);
      return;
    }

    this.selectedLabOrders = [...this.selectedLabOrders, value];
  }

  isQuickSelected(value: string): boolean {
    return this.selectedLabOrders.includes(value);
  }

  removeSelectedLabOrder(value: string): void {
    this.selectedLabOrders = this.selectedLabOrders.filter((item) => item !== value);
  }

  onFileChange(event: Event): void {
    if (this.locked) {
      return;
    }
    const input = event.target as HTMLInputElement;
    const fileName = input.files?.[0]?.name ?? '';
    this.form.patchValue({ fileName });
    input.value = '';
  }

  addRequest(): void {
    if (this.locked) {
      return;
    }
    const value = this.form.getRawValue();
    const pendingTests = Array.from(
      new Set([
        ...this.selectedLabOrders,
        value.testName?.trim() || ''
      ].filter((test) => test.length > 0))
    );

    if (pendingTests.length === 0) {
      return;
    }

    const nextRequests = pendingTests.map((testName, index) => ({
      id: `labreq-${Date.now()}-${this.requests.length + index + 1}`,
      testName,
      reason: value.reason || undefined,
      fileName: value.fileName || undefined
    }));

    this.requests = [...this.requests, ...nextRequests];
    this.selectedLabOrders = [];
    this.requestsChange.emit([...this.requests]);
    this.clearForm();
  }

  editRequest(index: number): void {
    const req = this.requests[index];
    if (!req) return;
    this.editIndex = index;
    this.form.patchValue({ testName: req.testName, reason: req.reason || '', fileName: req.fileName || '' });
  }

  updateRequest(): void {
    if (this.editIndex < 0 || this.editIndex >= this.requests.length) return;
    const v = this.form.getRawValue();
    if (!v.testName) return;
    this.requests = this.requests.map((r, i) => i === this.editIndex
      ? { ...r, testName: v.testName || '', reason: v.reason || undefined, fileName: v.fileName || undefined }
      : r);
    this.requestsChange.emit([...this.requests]);
    this.editIndex = -1;
    this.clearForm();
  }

  removeRequest(index: number): void {
    this.requests = this.requests.filter((_, i) => i !== index);
    if (this.editIndex === index) this.editIndex = -1;
    else if (this.editIndex > index) this.editIndex--;
    this.requestsChange.emit([...this.requests]);
  }

  private clearForm(): void {
    this.form.patchValue({ testName: '', reason: '', fileName: '' }, { emitEvent: false });
  }
}

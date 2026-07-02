import { NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  inject
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BannerComponent } from '../../../../shared/components/banner/banner.component';
import { IonItem, IonLabel, IonTextarea } from '@ionic/angular/standalone';

export interface SoapFormValue {
  chiefComplaint: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

@Component({
  selector: 'app-soap-form',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, BannerComponent, IonItem, IonLabel, IonTextarea],
  templateUrl: './soap-form.component.html',
  styleUrl: './soap-form.component.scss'
})
export class SoapFormComponent implements OnChanges, AfterViewInit {
  @Input() value: SoapFormValue | null = null;
  @Input() lastVisitSoap: SoapFormValue | null = null;
  @Input() auditText = 'Not yet edited this visit';
  @Input() locked = false;
  @Input() validationRequested = false;

  @Output() soapChange = new EventEmitter<SoapFormValue>();
  @Output() validityChange = new EventEmitter<boolean>();
  @Output() loadFromLastVisit = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  @ViewChild('chiefComplaintInput') chiefComplaintInput?: IonTextarea;
  @ViewChild('subjectiveInput') subjectiveInput?: IonTextarea;
  @ViewChild('objectiveInput') objectiveInput?: IonTextarea;
  @ViewChild('assessmentInput') assessmentInput?: IonTextarea;
  @ViewChild('planInput') planInput?: IonTextarea;

  readonly form = this.fb.group({
    chiefComplaint: ['', Validators.required],
    subjective: [''],
    objective: [''],
    assessment: [''],
    plan: ['']
  });

  readonly templatePhrases = {
    chiefComplaint: [
      'Fever and chills for 3 days',
      'Persistent cough',
      'Abdominal pain',
      'Follow-up for hypertension',
      'Routine check-up',
      'Headache with nausea',
      'Shortness of breath on exertion'
    ],
    subjective: [
      'Symptoms started gradually and have been worsening.',
      'Reports intermittent discomfort and poor sleep.',
      'Denies chest pain or syncope.',
      'States the medication helped initially but symptoms recurred.',
      'No known recent sick contacts.'
    ],
    objective: [
      'Alert, oriented, and not in acute distress.',
      'Lungs clear to auscultation bilaterally.',
      'Abdomen soft with mild tenderness.',
      'Mild erythema noted on examination.',
      'Vital signs reviewed and documented.'
    ],
    assessment: [
      'Likely viral upper respiratory infection.',
      'Hypertension, currently controlled.',
      'Gastritis versus peptic ulcer disease.',
      'Possible musculoskeletal strain.',
      'Improving clinical course with conservative care.'
    ],
    plan: [
      'Advised rest and increased fluid intake',
      'Prescribed medications as listed',
      'Referred to specialist',
      'Return if symptoms worsen',
      'Follow up in 1 week',
      'Monitor symptoms and keep a home log',
      'Counseled on warning signs and when to seek care'
    ]
  } as const;

  openTemplateFor: keyof SoapFormValue | null = null;

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.emitValue();
    });
    this.form.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.validityChange.emit(this.form.valid);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.form.patchValue(
        {
          chiefComplaint: this.value?.chiefComplaint ?? '',
          subjective: this.value?.subjective ?? '',
          objective: this.value?.objective ?? '',
          assessment: this.value?.assessment ?? '',
          plan: this.value?.plan ?? ''
        },
        { emitEvent: false }
      );
      this.emitValue();
      queueMicrotask(() => this.resizeTextareas());
    }

    if (changes['locked']) {
      if (this.locked) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
    }
  }

  ngAfterViewInit(): void {
    this.resizeTextareas();
    this.maybeAutoFocusChiefComplaint();
  }

  private maybeAutoFocusChiefComplaint(): void {
    if (this.locked) {
      return;
    }

    const isBrandNew = !this.value || Object.values(this.value).every((field) => !field?.trim());
    if (!isBrandNew) {
      return;
    }

    void this.chiefComplaintInput?.setFocus();
  }

  private resizeTextareas(): void {
    const inputs = [
      this.chiefComplaintInput,
      this.subjectiveInput,
      this.objectiveInput,
      this.assessmentInput,
      this.planInput
    ];

    for (const ionTextarea of inputs) {
      if (!ionTextarea) {
        continue;
      }

      void ionTextarea.getInputElement().then((el) => {
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.hostRef.nativeElement.contains(event.target as Node)) {
      this.openTemplateFor = null;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.openTemplateFor = null;
  }

  toggleTemplate(field: keyof SoapFormValue, event: MouseEvent): void {
    event.stopPropagation();
    this.openTemplateFor = this.openTemplateFor === field ? null : field;
  }

  async insertTemplatePhrase(field: keyof SoapFormValue, phrase: string): Promise<void> {
    if (this.locked) {
      return;
    }

    const controlMap: Record<keyof SoapFormValue, IonTextarea | undefined> = {
      chiefComplaint: this.chiefComplaintInput,
      subjective: this.subjectiveInput,
      objective: this.objectiveInput,
      assessment: this.assessmentInput,
      plan: this.planInput
    };

    const ctrl = controlMap[field];
    const input = ctrl ? await ctrl.getInputElement() : null;
    const current = String(this.form.get(field)?.value ?? '');
    const start = input?.selectionStart ?? current.length;
    const end = input?.selectionEnd ?? current.length;
    const nextValue = `${current.slice(0, start)}${phrase}${current.slice(end)}`;

    this.form.patchValue({ [field]: nextValue } as Partial<SoapFormValue>);
    this.openTemplateFor = null;
    queueMicrotask(() => input?.setSelectionRange(start + phrase.length, start + phrase.length));
  }

  charCount(field: keyof SoapFormValue): number {
    return String(this.form.get(field)?.value ?? '').length;
  }

  private emitValue(): void {
    this.soapChange.emit(this.form.getRawValue() as SoapFormValue);
    this.validityChange.emit(this.form.valid);
  }
}

import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  inject
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VitalSigns } from '../../../../core/models';
import { IonBadge, IonInput, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';

const VITAL_FIELD_ORDER: VitalFieldKey[] = [
  'bloodPressureSystolic',
  'bloodPressureDiastolic',
  'heartRate',
  'respiratoryRate',
  'painScore',
  'temperatureCelsius',
  'oxygenSaturation',
  'weightKg',
  'heightCm'
];

const optionalRange = (min: number, max: number): ValidatorFn => (control) => {
  const raw = control.value;
  if (raw === null || raw === undefined || raw === '') {
    return null;
  }
  const value = Number(raw);
  if (Number.isNaN(value) || value < min || value > max) {
    return { range: true };
  }
  return null;
};

const optionalPositive = (): ValidatorFn => (control) => {
  const raw = control.value;
  if (raw === null || raw === undefined || raw === '') {
    return null;
  }
  const value = Number(raw);
  if (Number.isNaN(value) || value <= 0) {
    return { positive: true };
  }
  return null;
};

type VitalFieldKey =
  | 'bloodPressureSystolic'
  | 'bloodPressureDiastolic'
  | 'heartRate'
  | 'respiratoryRate'
  | 'painScore'
  | 'temperatureCelsius'
  | 'oxygenSaturation'
  | 'weightKg'
  | 'heightCm';

interface CriticalAlert {
  key: VitalFieldKey;
  label: string;
  value: string;
}

@Component({
  selector: 'app-vital-signs-form',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, IonBadge, IonInput, IonItem, IonLabel, IonNote],
  templateUrl: './vital-signs-form.component.html',
  styleUrl: './vital-signs-form.component.scss'
})
export class VitalSignsFormComponent implements OnChanges {
  @Input() value: VitalSigns | null = null;
  @Input() locked = false;
  @Input() validationRequested = false;

  @Output() vitalSignsChange = new EventEmitter<VitalSigns>();
  @Output() validityChange = new EventEmitter<boolean>();

  @ViewChild('bloodPressureSystolicInput') bloodPressureSystolicInput?: IonInput;
  @ViewChild('bloodPressureDiastolicInput') bloodPressureDiastolicInput?: IonInput;
  @ViewChild('heartRateInput') heartRateInput?: IonInput;
  @ViewChild('respiratoryRateInput') respiratoryRateInput?: IonInput;
  @ViewChild('painScoreInput') painScoreInput?: IonInput;
  @ViewChild('temperatureCelsiusInput') temperatureCelsiusInput?: IonInput;
  @ViewChild('oxygenSaturationInput') oxygenSaturationInput?: IonInput;
  @ViewChild('weightKgInput') weightKgInput?: IonInput;
  @ViewChild('heightCmInput') heightCmInput?: IonInput;

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.group({
    bloodPressureSystolic: [''],
    bloodPressureDiastolic: [''],
    heartRate: [''],
    respiratoryRate: [''],
    painScore: ['', [optionalRange(0, 10)]],
    temperatureCelsius: ['', [optionalRange(30, 45)]],
    oxygenSaturation: ['', [optionalRange(0, 100)]],
    weightKg: ['', [optionalPositive()]],
    heightCm: ['', [optionalPositive()]],
    bmi: [{ value: '', disabled: true }]
  });

  bmiDisplay = '-';
  touchedFields = new Set<VitalFieldKey>();
  acknowledgedCriticalKeys = new Set<VitalFieldKey>();

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.syncDerivedState();
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
          bloodPressureSystolic: this.toInputValue(this.value?.bloodPressureSystolic),
          bloodPressureDiastolic: this.toInputValue(this.value?.bloodPressureDiastolic),
          heartRate: this.toInputValue(this.value?.heartRate),
          respiratoryRate: this.toInputValue(this.value?.respiratoryRate),
          painScore: this.toInputValue(this.value?.painScore),
          temperatureCelsius: this.toInputValue(this.value?.temperatureCelsius ?? this.value?.temperature),
          oxygenSaturation: this.toInputValue(this.value?.oxygenSaturation),
          weightKg: this.toInputValue(this.value?.weightKg ?? this.value?.weight),
          heightCm: this.toInputValue(this.value?.heightCm ?? this.value?.height),
          bmi: this.toInputValue(this.value?.bmi)
        },
        { emitEvent: false }
      );
      this.syncDerivedState();
      this.emitValue();
    }

    if (changes['locked']) {
      if (this.locked) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
      this.form.get('bmi')?.disable({ emitEvent: false });
    }
  }

  markTouched(field: VitalFieldKey): void {
    this.touchedFields.add(field);
  }

  focusNext(current: VitalFieldKey, event: Event): void {
    const currentIndex = VITAL_FIELD_ORDER.indexOf(current);
    const nextField = VITAL_FIELD_ORDER[currentIndex + 1];
    if (!nextField) {
      return;
    }

    event.preventDefault();
    const inputMap: Record<VitalFieldKey, IonInput | undefined> = {
      bloodPressureSystolic: this.bloodPressureSystolicInput,
      bloodPressureDiastolic: this.bloodPressureDiastolicInput,
      heartRate: this.heartRateInput,
      respiratoryRate: this.respiratoryRateInput,
      painScore: this.painScoreInput,
      temperatureCelsius: this.temperatureCelsiusInput,
      oxygenSaturation: this.oxygenSaturationInput,
      weightKg: this.weightKgInput,
      heightCm: this.heightCmInput
    };

    void inputMap[nextField]?.setFocus();
  }

  hasValue(field: VitalFieldKey): boolean {
    const value = this.form.get(field)?.value;
    return value !== null && value !== undefined && String(value).trim().length > 0;
  }

  acknowledgeCriticalAlerts(): void {
    for (const alert of this.computeCriticalAlerts()) {
      this.acknowledgedCriticalKeys.add(alert.key);
    }
  }

  getDisplayStatus(field: VitalFieldKey): 'Normal' | 'Borderline' | 'Critical' | null {
    if (!this.touchedFields.has(field) && !this.hasValue(field)) {
      return null;
    }

    const status = this.computeStatus(field);
    return status;
  }

  getStatusAriaLabel(field: VitalFieldKey, status: 'Normal' | 'Borderline' | 'Critical'): string {
    const value = this.toNumber(this.form.get(field)?.value);
    const label = this.getFieldLabel(field);
    if (value === undefined) {
      return `${label}: ${status}`;
    }

    const range = this.getNormalRangeLabel(field);
    return `${label}: ${status} - ${value} ${range ? `exceeds normal range of ${range}` : ''}`.trim();
  }

  get visibleCriticalAlerts(): CriticalAlert[] {
    return this.computeCriticalAlerts().filter((alert) => !this.acknowledgedCriticalKeys.has(alert.key));
  }

  private emitValue(): void {
    this.vitalSignsChange.emit(this.normalizeValue());
    this.validityChange.emit(this.form.valid);
  }

  private syncDerivedState(): void {
    const value = this.normalizeValue();
    const bmi = this.calculateBmi(value.weightKg, value.heightCm);
    this.bmiDisplay = bmi === null ? '-' : bmi.toFixed(1);
    this.form.patchValue({ bmi: this.bmiDisplay }, { emitEvent: false });
  }

  private normalizeValue(): VitalSigns {
    const raw = this.form.getRawValue();
    return {
      bloodPressureSystolic: this.toNumber(raw.bloodPressureSystolic),
      bloodPressureDiastolic: this.toNumber(raw.bloodPressureDiastolic),
      heartRate: this.toNumber(raw.heartRate),
      respiratoryRate: this.toNumber(raw.respiratoryRate),
      painScore: this.toNumber(raw.painScore),
      temperatureCelsius: this.toNumber(raw.temperatureCelsius),
      oxygenSaturation: this.toNumber(raw.oxygenSaturation),
      weightKg: this.toNumber(raw.weightKg),
      heightCm: this.toNumber(raw.heightCm),
      bmi: this.calculateBmi(this.toNumber(raw.weightKg), this.toNumber(raw.heightCm)) ?? undefined
    };
  }

  private computeStatus(field: VitalFieldKey): 'Normal' | 'Borderline' | 'Critical' | null {
    const value = this.toNumber(this.form.get(field)?.value);
    if (value === undefined) {
      return null;
    }

    switch (field) {
      case 'bloodPressureSystolic':
        if (value < 90 || value >= 140) return 'Critical';
        if (value >= 120) return 'Borderline';
        return 'Normal';
      case 'bloodPressureDiastolic':
        if (value < 60 || value >= 90) return 'Critical';
        if (value >= 80) return 'Borderline';
        return 'Normal';
      case 'heartRate':
        if (value < 50 || value > 110) return 'Critical';
        if (value >= 101 || value >= 50 && value <= 59) return 'Borderline';
        return 'Normal';
      case 'respiratoryRate':
        if (value < 12 || value > 24) return 'Critical';
        if (value >= 21) return 'Borderline';
        return 'Normal';
      case 'temperatureCelsius':
        if (value < 36 || value > 38) return 'Critical';
        if (value <= 36 || value >= 37.3) return 'Borderline';
        return 'Normal';
      case 'oxygenSaturation':
        if (value < 90) return 'Critical';
        if (value <= 94) return 'Borderline';
        return 'Normal';
      case 'painScore':
        if (value >= 7) return 'Critical';
        if (value >= 4) return 'Borderline';
        return 'Normal';
      case 'weightKg':
      case 'heightCm':
        return 'Normal';
      default:
        return null;
    }
  }

  private getFieldLabel(field: VitalFieldKey): string {
    const map: Record<VitalFieldKey, string> = {
      bloodPressureSystolic: 'Blood pressure systolic',
      bloodPressureDiastolic: 'Blood pressure diastolic',
      heartRate: 'Heart rate',
      respiratoryRate: 'Respiratory rate',
      painScore: 'Pain score',
      temperatureCelsius: 'Temperature',
      oxygenSaturation: 'Oxygen saturation',
      weightKg: 'Weight',
      heightCm: 'Height'
    };

    return map[field];
  }

  private getNormalRangeLabel(field: VitalFieldKey): string {
    switch (field) {
      case 'bloodPressureSystolic':
        return 'under 120';
      case 'bloodPressureDiastolic':
        return 'under 80';
      case 'heartRate':
        return '60-100 bpm';
      case 'respiratoryRate':
        return '12-20 breaths/min';
      case 'painScore':
        return '0-3';
      case 'temperatureCelsius':
        return '36.1-37.2°C';
      case 'oxygenSaturation':
        return '95-100%';
      case 'weightKg':
      case 'heightCm':
        return 'positive number';
    }
  }

  private computeCriticalAlerts(): CriticalAlert[] {
    const alerts: CriticalAlert[] = [];
    const entries: Array<[VitalFieldKey, string]> = [
      ['bloodPressureSystolic', 'Blood Pressure Systolic'],
      ['bloodPressureDiastolic', 'Blood Pressure Diastolic'],
      ['heartRate', 'Heart Rate'],
      ['respiratoryRate', 'Respiratory Rate'],
      ['temperatureCelsius', 'Temperature'],
      ['oxygenSaturation', 'Oxygen Saturation'],
      ['painScore', 'Pain Score']
    ];

    for (const [key, label] of entries) {
      if (this.computeStatus(key) === 'Critical') {
        alerts.push({
          key,
          label,
          value: String(this.form.get(key)?.value ?? '')
        });
      }
    }

    return alerts;
  }

  private toNumber(value: string | number | null | undefined): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  private toInputValue(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    return String(value);
  }

  private calculateBmi(weightKg?: number, heightCm?: number): number | null {
    if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
      return null;
    }
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }
}

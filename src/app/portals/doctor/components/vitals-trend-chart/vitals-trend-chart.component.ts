import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Consultation } from '../../../../core/models';

interface TrendPoint {
  date: string;
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  weightKg?: number;
  oxygenSaturation?: number;
}

interface TrendMetric {
  key: keyof Omit<TrendPoint, 'date'>;
  label: string;
  unit: string;
  color: string;
}

@Component({
  selector: 'app-vitals-trend-chart',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf],
  templateUrl: './vitals-trend-chart.component.html',
  styleUrl: './vitals-trend-chart.component.scss'
})
export class VitalsTrendChartComponent implements OnChanges {
  @Input() consultations: Consultation[] = [];
  expanded = false;

  readonly metrics: TrendMetric[] = [
    { key: 'systolic', label: 'Blood Pressure Systolic', unit: 'mmHg', color: '#2563EB' },
    { key: 'diastolic', label: 'Blood Pressure Diastolic', unit: 'mmHg', color: '#7C3AED' },
    { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', color: '#DC2626' },
    { key: 'weightKg', label: 'Weight', unit: 'kg', color: '#059669' },
    { key: 'oxygenSaturation', label: 'Oxygen Saturation', unit: '%', color: '#D97706' }
  ];

  points: TrendPoint[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['consultations']) {
      this.points = this.buildPoints();
    }
  }

  isMobileViewport(): boolean {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  }

  latestValue(key: TrendMetric['key']): string {
    const values = this.points.map((point) => point[key]).filter((value): value is number => typeof value === 'number');
    const value = values[values.length - 1];
    return value === undefined ? '-' : this.formatValue(value, key);
  }

  linePoints(key: TrendMetric['key']): Array<{ x: number; y: number }> {
    const values = this.points.map((point) => point[key]).filter((value): value is number => typeof value === 'number');
    if (values.length < 2) {
      return [];
    }

    const range = this.getRange(values);
    const width = 288;
    const height = 88;
    const startX = 16;
    const startY = 16;
    const xStep = width / Math.max(this.points.length - 1, 1);

    return this.points.flatMap((point, index) => {
      const value = point[key];
      if (typeof value !== 'number') {
        return [];
      }
      return [
        {
          x: startX + xStep * index,
          y: startY + this.normalize(value, range.min, range.max, height)
        }
      ];
    });
  }

  linePath(key: TrendMetric['key']): string {
    const points = this.linePoints(key);
    if (points.length < 2) {
      return '';
    }
    return points.reduce((path, point, index) => `${path}${index === 0 ? 'M' : 'L'} ${point.x} ${point.y} `, '').trim();
  }

  areaPath(key: TrendMetric['key']): string {
    const points = this.linePoints(key);
    if (points.length < 2) {
      return '';
    }
    const first = points[0];
    const last = points[points.length - 1];
    return `${this.linePath(key)} L ${last.x} 104 L ${first.x} 104 Z`;
  }

  private buildPoints(): TrendPoint[] {
    return [...this.consultations]
      .filter((consultation) => Boolean(consultation.vitalSigns))
      .sort((a, b) => new Date(a.consultationDate).getTime() - new Date(b.consultationDate).getTime())
      .slice(-5)
      .map((consultation) => ({
        date: consultation.consultationDate,
        systolic: consultation.vitalSigns?.bloodPressureSystolic,
        diastolic: consultation.vitalSigns?.bloodPressureDiastolic,
        heartRate: consultation.vitalSigns?.heartRate,
        weightKg: consultation.vitalSigns?.weightKg,
        oxygenSaturation: consultation.vitalSigns?.oxygenSaturation
      }));
  }

  private getRange(values: number[]): { min: number; max: number } {
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (min === max) {
      return { min: min - 1, max: max + 1 };
    }
    return { min, max };
  }

  private normalize(value: number, min: number, max: number, height: number): number {
    const ratio = (value - min) / (max - min);
    return height - ratio * height;
  }

  private formatValue(value: number, key: TrendMetric['key']): string {
    if (key === 'oxygenSaturation' || key === 'heartRate' || key === 'systolic' || key === 'diastolic') {
      return `${Math.round(value)}`;
    }
    return value.toFixed(1);
  }
}

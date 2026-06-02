import { Component, Input } from '@angular/core';
import { NgClass, NgFor, NgStyle } from '@angular/common';

export type SkeletonVariant = 'text' | 'title' | 'card' | 'avatar' | 'stat' | 'row';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [NgClass, NgFor, NgStyle],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent {
  @Input() variant: SkeletonVariant = 'text';
  @Input() width?: string;
  @Input() count = 1;

  get variantClass(): string {
    return `skeleton-${this.variant}`;
  }

  get countArray(): unknown[] {
    return Array.from({ length: Math.max(1, this.count) });
  }
}

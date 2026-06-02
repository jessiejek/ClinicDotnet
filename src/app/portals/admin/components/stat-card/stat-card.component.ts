import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  host: { style: 'display: block; min-width: 0;' },
  imports: [NgIf, NgClass, IonIcon],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss'
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() icon = 'grid-outline';
  @Input() color: 'green' | 'blue' | 'amber' | 'red' | 'gray' = 'green';
  @Input() badgeLabel?: string;
}

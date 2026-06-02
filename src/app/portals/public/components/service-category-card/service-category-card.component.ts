import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bandageOutline,
  chevronForwardOutline,
  flaskOutline,
  medkitOutline,
  scanOutline
} from 'ionicons/icons';
import { ServiceCategory } from '../../../../core/models';

@Component({
  selector: 'app-service-category-card',
  standalone: true,
  imports: [NgClass, IonIcon],
  templateUrl: './service-category-card.component.html',
  styleUrl: './service-category-card.component.scss'
})
export class ServiceCategoryCardComponent {
  @Input({ required: true }) category!: ServiceCategory;
  @Input({ required: true }) count!: number;
  @Input({ required: true }) description!: string;
  @Output() selected = new EventEmitter<ServiceCategory>();

  constructor() {
    addIcons({ medkitOutline, bandageOutline, flaskOutline, scanOutline, chevronForwardOutline });
  }

  get gradientClass(): string {
    const map: Record<ServiceCategory, string> = {
      Consultation: 'gradient-card-green',
      Procedure: 'gradient-card-blue',
      Laboratory: 'gradient-card-amber',
      Diagnostic: 'gradient-card-rose'
    };
    return map[this.category];
  }

  get iconName(): string {
    const map: Record<ServiceCategory, string> = {
      Consultation: 'medkit-outline',
      Procedure: 'bandage-outline',
      Laboratory: 'flask-outline',
      Diagnostic: 'scan-outline'
    };
    return map[this.category];
  }
}

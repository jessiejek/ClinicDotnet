import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

export type BannerVariant = 'warning' | 'danger' | 'info' | 'success';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [NgIf, NgClass, IonIcon],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent {
  @Input() variant: BannerVariant = 'info';
  @Input() message = '';
  @Input() dismissible = false;
  @Input() icon?: string;

  @Output() dismissed = new EventEmitter<void>();

  visible = true;

  get iconResolved(): string {
    if (this.icon) {
      return this.icon;
    }
    switch (this.variant) {
      case 'warning':
        return 'warning-outline';
      case 'danger':
        return 'alert-circle-outline';
      case 'success':
        return 'checkmark-circle-outline';
      default:
        return 'information-circle-outline';
    }
  }

  onDismiss(): void {
    this.visible = false;
    this.dismissed.emit();
  }
}

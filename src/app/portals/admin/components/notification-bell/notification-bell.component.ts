import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline } from 'ionicons/icons';
import { NotificationPanelComponent } from '../../../../shared/components/notification-panel/notification-panel.component';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [NgIf, IonIcon, NotificationPanelComponent],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.scss'
})
export class NotificationBellComponent {
  @Input() unreadCount = 0;

  isOpen = false;

  constructor() {
    addIcons({ notificationsOutline });
  }

  togglePanel(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  closePanel(): void {
    this.isOpen = false;
  }
}

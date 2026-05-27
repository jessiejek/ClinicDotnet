import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  cashOutline,
  medicalOutline,
  notificationsOutline,
  refreshOutline
} from 'ionicons/icons';
import { catchError, map, of } from 'rxjs';
import { Notification } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { AuthStateService } from '../../../core/services/auth-state.service';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, IonButton, IonIcon],
  template: `
    <div class="notification-panel">
      <div class="notification-panel__header">
        <div>
          <h3>Notifications</h3>
          <p>{{ unreadCount() }} unread</p>
        </div>
        <button
          type="button"
          class="notification-panel__mark-all"
          [disabled]="unreadCount() === 0"
          (click)="markAllRead()"
        >
          Mark all read
        </button>
      </div>

      <div class="notification-panel__list" *ngIf="notifications().length > 0; else emptyTpl">
        <button
          type="button"
          class="notification-panel__item"
          *ngFor="let notification of latestNotifications()"
          [class.is-unread]="!notification.isRead"
          (click)="openNotification(notification)"
        >
          <div class="notification-panel__icon">
            <ion-icon [name]="iconFor(notification)"></ion-icon>
          </div>
          <div class="notification-panel__body">
            <div class="notification-panel__topline">
              <strong>{{ notification.title }}</strong>
              <span>{{ timeAgo(notification.createdAt) }}</span>
            </div>
            <p>{{ notification.message }}</p>
          </div>
        </button>
      </div>

      <ng-template #emptyTpl>
        <div class="notification-panel__empty">
          <ion-icon name="notifications-outline"></ion-icon>
          <p>No notifications yet.</p>
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: './notification-panel.component.scss'
})
export class NotificationPanelComponent implements OnInit {
  private readonly authState = inject(AuthStateService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  readonly notifications = signal<Notification[]>([]);
  readonly unreadCount = computed(() => this.notifications().filter((notification) => !notification.isRead).length);
  readonly currentUser = this.authState.currentUser;

  constructor() {
    addIcons({
      calendarOutline,
      cashOutline,
      medicalOutline,
      notificationsOutline,
      refreshOutline
    });
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  latestNotifications(): Notification[] {
    return [...this.notifications()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }

  markAllRead(): void {
    const userId = this.currentUser()?.id;
    if (!userId) {
      return;
    }
    this.apiService.put('notifications/read-all', {}).subscribe({
      next: () => {
        this.notifications.update((items) =>
          items.map((notification) =>
            notification.userId === userId ? { ...notification, isRead: true } : notification
          )
        );
      }
    });
  }

  openNotification(notification: Notification): void {
    this.apiService.put(`notifications/${notification.id}/read`, {}).subscribe({
      next: () => {
        this.notifications.update((items) =>
          items.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item))
        );
        if (notification.navigateTo) {
          void this.router.navigateByUrl(notification.navigateTo);
        }
      }
    });
  }

  iconFor(notification: Notification): string {
    const text = `${notification.title} ${notification.message}`.toLowerCase();
    if (text.includes('payment')) {
      return 'cash-outline';
    }
    if (text.includes('booking')) {
      return 'calendar-outline';
    }
    if (text.includes('follow-up')) {
      return 'refresh-outline';
    }
    if (text.includes('doctor')) {
      return 'medical-outline';
    }
    return 'notifications-outline';
  }

  timeAgo(value: string): string {
    const diffMs = Math.max(0, Date.now() - new Date(value).getTime());
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) {
      return 'Just now';
    }
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  private loadNotifications(): void {
    this.apiService
      .get<NotificationDto[]>('notifications')
      .pipe(
        map((data) => (data ?? []).map(dtoToNotification)),
        catchError(() => of([] as Notification[]))
      )
      .subscribe((items) => {
        this.notifications.set(items.filter((notification) => notification.userId === this.currentUser()?.id));
      });
  }
}

interface NotificationDto {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  navigateTo?: string;
}

function dtoToNotification(dto: NotificationDto): Notification {
  return {
    id: dto.id,
    userId: dto.userId,
    title: dto.title,
    message: dto.message,
    isRead: dto.isRead,
    createdAt: dto.createdAt,
    navigateTo: dto.navigateTo
  };
}

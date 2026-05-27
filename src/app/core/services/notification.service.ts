import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, filter, map } from 'rxjs';
import { Notification } from '../models';
import { AuthStateService } from './auth-state.service';
import { PushNotificationService, InAppNotification } from './push-notification.service';

function liveToLegacyNotification(n: InAppNotification): Notification {
  return {
    id: n.id,
    userId: n.userId,
    title: n.title,
    message: n.message,
    isRead: n.isRead,
    createdAt: n.createdAt,
    navigateTo: n.navigateTo
  };
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly authState = inject(AuthStateService);
  private readonly pushNotificationService = inject(PushNotificationService);
  private readonly notificationsSubject = new BehaviorSubject<Notification[]>([]);

  readonly notifications$ = this.notificationsSubject.asObservable();

  readonly currentUserNotifications$ = combineLatest([
    this.notifications$,
    this.authState.currentUser$
  ]).pipe(
    map(([notifications, user]) =>
      user ? notifications.filter((n) => n.userId === user.id) : []
    )
  );
  readonly unreadNotifications$ = this.currentUserNotifications$.pipe(
    map((notifications) => notifications.filter((n) => !n.isRead))
  );
  readonly unreadCount$ = this.unreadNotifications$.pipe(
    map((notifications) => notifications.length)
  );

  readonly unreadCount = toSignal(this.unreadCount$, { initialValue: 0 });

  constructor() {
    // Clear on logout
    this.authState.currentUser$.pipe(
      filter((user) => !user)
    ).subscribe(() => {
      this.notificationsSubject.next([]);
    });

    this.pushNotificationService.notifications$.subscribe((live) => {
      const liveMapped = live.map(liveToLegacyNotification);
      const current = this.notificationsSubject.value;
      const liveIds = new Set(liveMapped.map((n) => n.id));
      const merged = [
        ...liveMapped,
        ...current.filter((n) => !liveIds.has(n.id))
      ].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this.notificationsSubject.next(merged);
    });
  }

  setNotifications(notifications: Notification[]): void {
    this.notificationsSubject.next(this.sortNotifications(notifications));
  }

  replaceNotifications(notifications: Notification[]): void {
    this.setNotifications(notifications);
  }

  markRead(id: string): void {
    this.notificationsSubject.next(
      this.notificationsSubject.value.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  }

  markAllRead(userId?: string): void {
    const uid = userId || this.authState.currentUser()?.id;
    if (!uid) return;

    this.notificationsSubject.next(
      this.notificationsSubject.value.map((n) =>
        n.userId === uid ? { ...n, isRead: true } : n
      )
    );
  }

  markReadLocal(id: string): void {
    this.markRead(id);
  }

  markAllReadLocal(userId?: string): void {
    this.markAllRead(userId);
  }

  refresh(): void {
    // State-only helper: notifications are owned by the panel or push stream.
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next(this.sortNotifications(current));
  }

  private sortNotifications(notifications: Notification[]): Notification[] {
    return [...notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

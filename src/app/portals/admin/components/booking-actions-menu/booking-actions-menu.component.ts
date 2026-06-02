import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon, IonPopover } from '@ionic/angular/standalone';

export interface BookingActionItem {
  label: string;
  value: string;
  danger?: boolean;
}

@Component({
  selector: 'app-booking-actions-menu',
  standalone: true,
  imports: [NgFor, IonIcon, IonPopover],
  templateUrl: './booking-actions-menu.component.html',
  styleUrl: './booking-actions-menu.component.scss'
})
export class BookingActionsMenuComponent {
  @Input() actions: BookingActionItem[] = [
    { label: 'View', value: 'view' },
    { label: 'Confirm', value: 'confirm' },
    { label: 'Confirm Payment', value: 'confirm-payment' },
    { label: 'Waive Payment', value: 'waive-payment' },
    { label: 'Refund Payment', value: 'refund-payment', danger: true },
    { label: 'Reject', value: 'reject', danger: true }
  ];

  @Output() actionSelected = new EventEmitter<string>();

  readonly triggerId = `booking-actions-${Math.random().toString(36).slice(2)}`;
}

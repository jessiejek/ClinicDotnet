import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { Booking } from '../../../../core/models';

@Component({
  selector: 'app-waive-payment-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonTextarea
  ],
  templateUrl: './waive-payment-modal.component.html',
  styleUrl: './waive-payment-modal.component.scss'
})
export class WaivePaymentModalComponent {
  @Input() booking!: Booking;
  @Input() paymentId: string | null = null;
  @Input() isOpen = false;
  @Input() testIdPrefix = 'waive-payment';
  @Output() confirmed = new EventEmitter<{ bookingId: string; paymentId?: string | null; reason: string }>();
  @Output() cancelled = new EventEmitter<void>();

  reason = '';

  get reasonTrimmed(): string {
    return this.reason.trim();
  }

  confirm(): void {
    if (!this.booking || this.reasonTrimmed.length < 5) {
      return;
    }
    this.confirmed.emit({ bookingId: this.booking.id, paymentId: this.paymentId, reason: this.reasonTrimmed });
    this.reason = '';
  }
}

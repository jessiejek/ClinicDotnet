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
  selector: 'app-refund-payment-modal',
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
  templateUrl: './refund-payment-modal.component.html',
  styleUrl: './refund-payment-modal.component.scss'
})
export class RefundPaymentModalComponent {
  @Input() booking!: Booking;
  @Input() paymentId: string | null = null;
  @Input() isOpen = false;
  @Input() testIdPrefix = 'refund-payment';
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

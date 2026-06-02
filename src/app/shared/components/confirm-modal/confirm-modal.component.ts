import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure?';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel = 'Cancel';
  @Input() isDanger = false;
  @Input() requireReason = false;
  @Input() reasonLabel = 'Reason (required)';
  @Input() reasonMinLength = 10;
  @Input() testIdPrefix = 'confirm-modal';

  @Output() confirmed = new EventEmitter<string | undefined>();
  @Output() cancelled = new EventEmitter<void>();

  reason = '';

  get reasonTrimmed(): string {
    return this.reason.trim();
  }

  cancel(): void {
    this.reason = '';
    this.cancelled.emit();
  }

  onConfirm(): void {
    const reason = this.requireReason ? this.reasonTrimmed : undefined;
    this.reason = '';
    this.confirmed.emit(reason);
  }
}

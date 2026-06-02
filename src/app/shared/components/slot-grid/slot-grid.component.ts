import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { TimeSlot } from '../../../core/models';
import { BannerComponent } from '../banner/banner.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { TimeSlotPipe } from '../../pipes/time-slot.pipe';

@Component({
  selector: 'app-slot-grid',
  standalone: true,
  imports: [NgIf, NgFor, BannerComponent, EmptyStateComponent, TimeSlotPipe],
  templateUrl: './slot-grid.component.html',
  styleUrl: './slot-grid.component.scss'
})
export class SlotGridComponent {
  @Input() slots: TimeSlot[] = [];
  @Input() selectedSlot: string | null = null;
  @Input() runningLate = false;
  @Input() runningLateMinutes = 0;
  @Input() unavailableToday = false;
  @Input() isLoading = false;

  @Output() slotSelected = new EventEmitter<{ slot: string; slotEnd: string }>();

  private readonly toastCtrl = inject(ToastController);

  async onSlotClick(slot: TimeSlot): Promise<void> {
    if (slot.status === 'full' || slot.status === 'pending' || slot.status === 'disabled') {
      const toast = await this.toastCtrl.create({
        message: 'This slot is not available.',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
      return;
    }

    this.slotSelected.emit({ slot: slot.time, slotEnd: slot.endTime });
  }
}

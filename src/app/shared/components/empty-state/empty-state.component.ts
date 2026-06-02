import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  documentTextOutline,
  folderOpenOutline,
  medkitOutline,
  medicalOutline,
  notificationsOutline,
  peopleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [NgIf, IonIcon, RouterLink],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  @Input() icon = 'folder-open-outline';
  @Input() title = 'Nothing here';
  @Input() description = '';
  @Input() ctaLabel?: string;
  @Input() ctaRoute?: string;
  @Output() ctaClick = new EventEmitter<void>();

  constructor() {
    addIcons({
      calendarOutline,
      documentTextOutline,
      folderOpenOutline,
      medkitOutline,
      medicalOutline,
      notificationsOutline,
      peopleOutline
    });
  }
}

import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Announcement } from '../../../../core/models';
import { announcementDisplayDate } from '../../utils/time-format';

@Component({
  selector: 'app-announcement-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './announcement-card.component.html',
  styleUrl: './announcement-card.component.scss'
})
export class AnnouncementCardComponent {
  @Input({ required: true }) announcement!: Announcement;

  get dateLabel(): string {
    return announcementDisplayDate(this.announcement.createdAt);
  }
}

import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Announcement } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { AnnouncementCardComponent } from '../components/announcement-card/announcement-card.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-announcements-page',
  standalone: true,
  imports: [NgIf, NgFor, AnnouncementCardComponent, SkeletonComponent],
  templateUrl: './announcements.page.html',
  styleUrl: './announcements.page.scss'
})
export class AnnouncementsPage implements OnInit {
  private readonly apiService = inject(ApiService);

  isLoading = true;
  announcements: Announcement[] = [];
  readonly skeletonPlaceholders = [0, 1, 2];

  ngOnInit(): void {
    this.apiService.get<Announcement[]>('announcements').subscribe((list) => {
      this.announcements = list;
      this.isLoading = false;
    });
  }
}

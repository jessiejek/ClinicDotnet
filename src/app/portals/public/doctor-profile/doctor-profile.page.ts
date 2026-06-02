import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { addIcons } from 'ionicons';
import { alertCircleOutline, personOutline, warningOutline } from 'ionicons/icons';
import { DoctorDayStatus, Review, Service, ServiceCategory } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BannerComponent } from '../../../shared/components/banner/banner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PesoPipe } from '../../../shared/pipes/peso.pipe';
import { ReviewCardComponent } from '../components/review-card/review-card.component';
import { DoctorDetail } from '../services/public.service';
import { formatDoctorScheduleLines } from '../utils/time-format';
import { DoctorStateService } from '../../../core/services/doctor-state.service';

@Component({
  selector: 'app-doctor-profile-page',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    RouterLink,
    BannerComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
    AvatarComponent,
    PesoPipe,
    ReviewCardComponent
  ],
  templateUrl: './doctor-profile.page.html',
  styleUrl: './doctor-profile.page.scss'
})
export class DoctorProfilePage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly doctorState = inject(DoctorStateService);
  private readonly route = inject(ActivatedRoute);

  isLoading = true;
  doctor?: DoctorDetail;
  reviews: Review[] = [];
  services: Service[] = [];
  scheduleLines: string[] = [];
  dayStatus?: DoctorDayStatus;

  constructor() {
    addIcons({ alertCircleOutline, personOutline, warningOutline });
  }

  badgeClass(cat: ServiceCategory): string {
    const kebab = cat.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    return `badge--${kebab}`;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading = false;
      return;
    }
    this.apiService.get<DoctorDayStatus | null>('doctor-day-status/' + id).pipe(
      catchError(() => of(null as DoctorDayStatus | null))
    ).subscribe((status) => {
      this.dayStatus = status ?? undefined;
      this.doctorState.setTodayStatus(status);
    });
    forkJoin({
      doctor: this.apiService.get<DoctorDetail>('doctors/' + id),
      reviews: this.apiService.get<Review[]>('reviews?doctorId=' + id),
      schedules: this.apiService.get<any[]>('doctors/' + id + '/schedule')
    }).subscribe(({ doctor, reviews, schedules }) => {
      this.doctor = doctor;
      this.reviews = reviews;
      this.services = doctor?.services ?? [];
      this.scheduleLines = formatDoctorScheduleLines(schedules);
      this.isLoading = false;
    });
  }
}

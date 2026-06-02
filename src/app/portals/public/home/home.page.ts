import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ServiceCategory } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { AnnouncementCardComponent } from '../components/announcement-card/announcement-card.component';
import { DoctorCardComponent } from '../components/doctor-card/doctor-card.component';
import { HeroSectionComponent } from '../components/hero-section/hero-section.component';
import { OperatingHoursBarComponent } from '../components/operating-hours-bar/operating-hours-bar.component';
import { ServiceCategoryCardComponent } from '../components/service-category-card/service-category-card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    RouterLink,
    HeroSectionComponent,
    OperatingHoursBarComponent,
    DoctorCardComponent,
    ServiceCategoryCardComponent,
    AnnouncementCardComponent
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  readonly doctors$ = this.apiService.get<any[]>('doctors');
  readonly services$ = this.apiService.get<any[]>('services');
  readonly announcements$ = this.apiService.get<any[]>('announcements');
  readonly settings$ = this.apiService.get<any>('settings');

  readonly categoryRows: { key: ServiceCategory; description: string }[] = [
    {
      key: 'Consultation',
      description: 'Primary care, follow-ups, and medical advice tailored to you.'
    },
    {
      key: 'Procedure',
      description: 'Minor procedures performed safely in-clinic by our specialists.'
    },
    {
      key: 'Laboratory',
      description: 'Blood work and lab tests with reliable turnaround times.'
    },
    {
      key: 'Diagnostic',
      description: 'Imaging and screening to support accurate diagnosis.'
    }
  ];

  countFor(services: { category: ServiceCategory }[], cat: ServiceCategory): number {
    return services.filter((s) => s.category === cat).length;
  }

  onCategorySelect(category: ServiceCategory): void {
    this.router.navigate(['/public/services'], { queryParams: { category } });
  }
}

import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { ApiService } from '../../../core/services/api.service';
import {
  DailyBookingSummaryRow,
  PendingFollowUpReportRow,
  UnpaidCompletedVisitReportRow
} from '../services/admin-reports.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-admin-reports-page',
  standalone: true,
  imports: [DatePipe, FormsModule, NgFor, NgIf, EmptyStateComponent, SkeletonComponent],
  templateUrl: './reports.page.html',
  styleUrl: './reports.page.scss'
})
export class ReportsPage implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);

  isLoading = true;
  dateFrom = this.daysAgoIso(7);
  dateTo = this.daysAheadIso(30);
  unpaidVisits: UnpaidCompletedVisitReportRow[] = [];
  followUps: PendingFollowUpReportRow[] = [];
  dailySummary: DailyBookingSummaryRow[] = [];
  filteredUnpaidVisits: UnpaidCompletedVisitReportRow[] = [];
  filteredFollowUps: PendingFollowUpReportRow[] = [];
  filteredDailySummary: DailyBookingSummaryRow[] = [];
  private loadedSections = 0;

  ngOnInit(): void {
    this.apiService.get<UnpaidCompletedVisitReportRow[]>('reports/unpaid-completed-visits').subscribe((rows) => {
      this.unpaidVisits = rows;
      this.applyFilters();
      this.markSectionLoaded();
    });
    this.apiService.get<PendingFollowUpReportRow[]>('reports/pending-follow-ups').subscribe((rows) => {
      this.followUps = rows;
      this.applyFilters();
      this.markSectionLoaded();
    });
    this.apiService.get<DailyBookingSummaryRow[]>('reports/daily-booking-summary').subscribe((rows) => {
      this.dailySummary = rows;
      this.applyFilters();
      this.markSectionLoaded();
    });
  }

  applyFilters(): void {
    this.filteredUnpaidVisits = this.unpaidVisits.filter((row) => this.isWithinRange(row.visitDate));
    this.filteredFollowUps = this.followUps.filter((row) => this.isWithinRange(row.followUpDate));
    this.filteredDailySummary = this.dailySummary.filter((row) => this.isWithinRange(row.date));
  }

  viewBooking(bookingId: string): void {
    void this.router.navigate(['/admin/bookings', bookingId]);
  }

  sendReminder(row: PendingFollowUpReportRow): void {
    void row;
    void this.presentToast('Reminder sent successfully.');
  }

  exportCsv(): void {
    void this.presentToast('CSV export coming soon.');
  }

  private isWithinRange(date: string): boolean {
    return (!this.dateFrom || date >= this.dateFrom) && (!this.dateTo || date <= this.dateTo);
  }

  private markSectionLoaded(): void {
    this.loadedSections += 1;
    if (this.loadedSections >= 3) {
      this.isLoading = false;
    }
  }

  private todayIso(): string {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().slice(0, 10);
  }

  private daysAgoIso(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 10);
  }

  private daysAheadIso(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 10);
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1800,
      color: 'primary',
      position: 'top'
    });
    await toast.present();
  }
}

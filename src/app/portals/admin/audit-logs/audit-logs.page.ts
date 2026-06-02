import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditLog } from '../../../core/models';
import { ApiService } from '../../../core/services/api.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

type EntityFilter = 'All' | AuditLog['entityType'];

@Component({
  selector: 'app-admin-audit-logs-page',
  standalone: true,
  imports: [DatePipe, FormsModule, NgClass, NgFor, NgIf, EmptyStateComponent, SkeletonComponent],
  templateUrl: './audit-logs.page.html',
  styleUrl: './audit-logs.page.scss'
})
export class AuditLogsPage implements OnInit {
  private readonly apiService = inject(ApiService);

  isLoading = true;
  logs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];
  entityOptions: AuditLog['entityType'][] = ['Booking', 'Patient', 'Doctor', 'Payment', 'Settings', 'Consultation'];
  entityFilter: EntityFilter = 'All';
  searchTerm = '';
  dateFrom = this.daysAgoIso(30);
  dateTo = this.todayIso();

  ngOnInit(): void {
    this.apiService.get<AuditLog[]>('audit-logs').subscribe((logs) => {
      this.logs = logs;
      this.applyFilters();
      this.isLoading = false;
    });
  }

  applyFilters(): void {
    const query = this.searchTerm.trim().toLowerCase();
    this.filteredLogs = this.logs.filter((log) => {
      const matchesEntity = this.entityFilter === 'All' || log.entityType === this.entityFilter;
      const matchesQuery =
        !query ||
        [log.action, log.performedBy, log.entityId, log.details ?? ''].join(' ').toLowerCase().includes(query);
      const matchesDate = (!this.dateFrom || log.performedAt.slice(0, 10) >= this.dateFrom) && (!this.dateTo || log.performedAt.slice(0, 10) <= this.dateTo);
      return matchesEntity && matchesQuery && matchesDate;
    });
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
}

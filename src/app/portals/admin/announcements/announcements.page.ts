import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { Announcement } from '../../../core/models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { IonModal } from '@ionic/angular/standalone';
import { BaseComponent } from '../../../core/base/base.component';

@Component({
  selector: 'app-admin-announcements-page',
  standalone: true,
  imports: [DatePipe, FormsModule, NgFor, NgIf, ConfirmModalComponent, EmptyStateComponent, StatusBadgeComponent, IonModal],
  templateUrl: './announcements.page.html',
})
export class AnnouncementsPage extends BaseComponent implements OnInit {
  private readonly api = inject(ApiService);

  announcements: Announcement[] = [];
  isLoading = false;
  loadError = false;
  loadErrorDescription = '';

  modalOpen = false;
  editingId: string | null = null;
  deletingId: string | null = null;

  draft = this.emptyDraft();

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  private loadAnnouncements(): void {
    this.isLoading = true;
    this.loadError = false;
    this.api.get<any[]>('announcements').pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (data: any) => {
        this.announcements = ((data ?? []) as Record<string, unknown>[]).map(mapApiRow);
        this.isLoading = false;
      },
      error: (err: any) => {
        this.loadError = true;
        this.loadErrorDescription = 'Failed to load announcements.';
        console.error('[AnnouncementsPage] Error loading announcements:', err?.message ?? err);
        this.announcements = [];
        this.isLoading = false;
      }
    });
  }

  openModal(): void {
    this.editingId = null;
    this.draft = this.emptyDraft();
    this.modalOpen = true;
  }

  edit(ann: Announcement): void {
    this.editingId = ann.id;
    this.draft = { ...ann };
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.editingId = null;
    this.draft = this.emptyDraft();
  }

  save(): void {
    const obs$ = this.editingId
      ? this.api.put('announcements/' + this.editingId, { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive })
      : this.api.post('announcements', { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive });
    obs$.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        void this.showToast(this.editingId ? 'Announcement updated.' : 'Announcement created.');
        this.loadAnnouncements();
        this.closeModal();
      },
      error: (err) => console.error('Failed to save announcement.', err)
    });
  }

  toggle(id: string): void {
    const target = this.announcements.find((a) => a.id === id);
    if (!target) return;
    const newActive = !target.isActive;
    this.api.put('announcements/' + id, { isActive: newActive }).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => this.loadAnnouncements(),
      error: (err) => console.error('Failed to toggle announcement.', err)
    });
  }

  askDelete(id: string): void {
    this.deletingId = id;
  }

  closeDeleteModal(): void {
    this.deletingId = null;
  }

  confirmDelete(): void {
    if (this.deletingId) {
      this.api.delete('announcements/' + this.deletingId).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
        next: () => {
          this.loadAnnouncements();
          this.closeDeleteModal();
        },
        error: (err) => console.error('Failed to delete announcement.', err)
      });
    }
  }

  private emptyDraft(): Announcement {
    return { id: '', title: '', body: '', isActive: true, createdAt: new Date().toISOString() };
  }
}

function mapApiRow(row: Record<string, unknown>): Announcement {
  return {
    id: (row['id'] ?? '') as string,
    title: (row['title'] ?? '') as string,
    body: (row['body'] ?? '') as string,
    isActive: (row['isActive'] ?? row['is_active'] ?? true) as boolean,
    createdAt: (row['createdAt'] ?? row['created_at'] ?? new Date().toISOString()) as string,
  };
}

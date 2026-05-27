import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular/standalone';
import { Announcement } from '../../../core/models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { IonModal } from '@ionic/angular/standalone';

@Component({
  selector: 'app-admin-announcements-page',
  standalone: true,
  imports: [DatePipe, FormsModule, NgFor, NgIf, ConfirmModalComponent, EmptyStateComponent, StatusBadgeComponent, IonModal],
  template: `
    <section class="page-shell">
      <div class="page-shell__header">
        <div>
          <h2 class="page-title">Announcements</h2>
          <p class="page-subtitle">Create and manage clinic announcements.</p>
        </div>
        <button class="btn-primary" type="button" (click)="openModal()">Add Announcement</button>
      </div>

      <div class="clinic-card" *ngIf="announcements.length > 0">
        <div class="table-scroll-wrap">
        <table class="clinic-table">
          <thead><tr><th>Title</th><th>Status</th><th>Created Date</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let ann of announcements">
              <td>{{ ann.title }}</td>
              <td><app-status-badge [status]="ann.isActive ? 'Active' : 'Inactive'"></app-status-badge></td>
              <td>{{ ann.createdAt | date:'mediumDate' }}</td>
              <td>
                <button class="btn-ghost" type="button" (click)="edit(ann)">Edit</button>
                <button class="btn-ghost" type="button" (click)="toggle(ann.id)">{{ ann.isActive ? 'Deactivate' : 'Activate' }}</button>
                <button class="btn-ghost" type="button" (click)="askDelete(ann.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      <app-empty-state *ngIf="announcements.length === 0 && !isLoading && !loadError" icon="megaphone-outline" title="No announcements" description="Create your first announcement."></app-empty-state>

      <app-empty-state *ngIf="loadError" icon="cloud-offline-outline" title="Announcements unavailable" [description]="loadErrorDescription"></app-empty-state>

      <p *ngIf="announcements.length === 0 && isLoading" class="muted" style="text-align:center;padding:var(--space-8)">Loading announcements…</p>
    </section>

    <ion-modal [isOpen]="modalOpen" (didDismiss)="modalOpen = false">
      <ng-template>
        <div class="modal-shell">
          <h3>{{ editingId ? 'Edit Announcement' : 'Add Announcement' }}</h3>
          <p *ngIf="saveError" class="error-message" style="color:var(--color-danger);margin-bottom:var(--space-2)">{{ saveError }}</p>
          <form class="modal-form" (ngSubmit)="save()">
            <input class="filter-input" name="title" [(ngModel)]="draft.title" placeholder="Title" />
            <textarea class="textarea" name="body" [(ngModel)]="draft.body" placeholder="Body"></textarea>
            <label><input type="checkbox" name="isActive" [(ngModel)]="draft.isActive" /> Active</label>
            <div class="modal-actions">
              <button type="button" class="btn-ghost" (click)="modalOpen = false" [disabled]="isSaving">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="isSaving">{{ isSaving ? 'Saving…' : 'Save' }}</button>
            </div>
          </form>
        </div>
      </ng-template>
    </ion-modal>

    <app-confirm-modal
      [isOpen]="deleteOpen"
      title="Delete Announcement"
      message="Delete this announcement?"
      confirmLabel="Delete"
      [isDanger]="true"
      (confirmed)="deleteConfirmed()"
      (cancelled)="deleteOpen = false"
    ></app-confirm-modal>
  `,
  styleUrl: './announcements.page.scss'
})
export class AnnouncementsPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toastCtrl = inject(ToastController);

  announcements: Announcement[] = [];
  isLoading = false;
  isSaving = false;
  loadError = false;
  loadErrorDescription = '';
  saveError = '';
  modalOpen = false;
  deleteOpen = false;
  editingId: string | null = null;
  deletingId: string | null = null;
  draft: Announcement = this.emptyDraft();

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  private async loadAnnouncements(): Promise<void> {
    this.isLoading = true;
    this.loadError = false;
    try {
      const data: any[] = await this.api.get<any[]>('announcements').toPromise() ?? [];
      this.announcements = data.map(mapApiRow);
    } catch (err: any) {
      this.loadError = true;
      this.loadErrorDescription = 'Failed to load announcements.';
      console.error('[AnnouncementsPage] Error loading announcements:', err?.message ?? err);
      this.announcements = [];
    }
    this.isLoading = false;
  }

  openModal(): void {
    this.editingId = null;
    this.draft = this.emptyDraft();
    this.saveError = '';
    this.modalOpen = true;
  }

  edit(announcement: Announcement): void {
    this.editingId = announcement.id;
    this.draft = { ...announcement };
    this.saveError = '';
    this.modalOpen = true;
  }

  async save(): Promise<void> {
    this.isSaving = true;
    this.saveError = '';

    if (this.editingId) {
      await this.api.put('announcements/' + this.editingId, { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive }).toPromise();

      this.announcements = this.announcements.map((announcement) =>
        announcement.id === this.editingId ? { ...this.draft } : announcement
      );
      this.modalOpen = false;
    } else {
      await this.api.post('announcements', { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive }).toPromise();

      this.announcements = [
        { ...this.draft, createdAt: new Date().toISOString() },
        ...this.announcements
      ];
      this.modalOpen = false;
    }
    this.isSaving = false;
  }

  async toggle(id: string): Promise<void> {
    const target = this.announcements.find((a) => a.id === id);
    if (!target) { return; }

    const newActive = !target.isActive;
    await this.api.put('announcements/' + id, { isActive: newActive }).toPromise();

    this.announcements = this.announcements.map((announcement) =>
      announcement.id === id ? { ...announcement, isActive: newActive } : announcement
    );
  }

  askDelete(id: string): void {
    this.deletingId = id;
    this.deleteOpen = true;
  }

  async deleteConfirmed(): Promise<void> {
    if (this.deletingId) {
      await this.api.delete('announcements/' + this.deletingId).toPromise();

      this.announcements = this.announcements.filter((announcement) => announcement.id !== this.deletingId);
    }
    this.deleteOpen = false;
  }

  private async presentToast(message: string, color: 'success' | 'danger' = 'danger'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  private emptyDraft(): Announcement {
    return {
      id: '',
      title: '',
      body: '',
      isActive: true,
      createdAt: new Date().toISOString()
    };
  }
}

function mapApiRow(row: Record<string, unknown>): Announcement {
  return {
    id: String(row['id'] ?? ''),
    title: String(row['title'] ?? ''),
    body: String(row['body'] ?? ''),
    imageUrl: row['imageUrl'] ? String(row['imageUrl']) : undefined,
    isActive: Boolean(row['isActive'] ?? true),
    createdAt: String(row['createdAt'] ?? row['created_at'] ?? new Date().toISOString())
  };
}

import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ToastController } from '@ionic/angular/standalone';

interface StaffRow {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string; // 'Active' | 'Inactive' | 'Invited'
  isInvite: boolean;
}

interface UpdateStatusResponse {
  userId: string;
  status: 'Active' | 'Inactive';
  banned: boolean;
}

@Component({
  selector: 'app-admin-staff-page',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, EmptyStateComponent, SkeletonComponent, StatusBadgeComponent],
  templateUrl: './staff.page.html',
  styleUrl: './staff.page.scss'
})
export class StaffPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toastCtrl = inject(ToastController);

  staff: StaffRow[] = [];
  loading = true;
  error: string | null = null;

  showAddStaffForm = false;
  draft = { fullName: '', email: '', phone: '' };
  addError: string | null = null;
  addSubmitting = false;

  /** Track which staff IDs have an in-flight toggle request */
  toggleBusy = new Set<string>();
  busyRevoke = false;

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.error = null;
    await this.loadStaff();
  }

  private async loadStaff(): Promise<void> {
    try {
      // Step 1: fetch user_ids from user_roles where role = 'staff'
      const staffRows: StaffRow[] = [];
      const data: any[] = (await firstValueFrom(this.api.get<any[]>('admin/staff'))) ?? [];
      for (const s of data) {
        staffRows.push({
          id: s.id,
          fullName: s.fullName ?? s.full_name ?? '',
          email: s.email ?? '',
          role: s.role ?? 'Staff',
          status: s.inactive || s.status === 'Inactive' ? 'Inactive' : 'Active',
          isInvite: s.isInvite ?? false,
        });
      }



      // invites will be handled via the admin/staff endpoint

      this.staff = staffRows;
    } catch (err: any) {
      console.error('Failed to load staff:', err);
      this.error = err?.message || 'Could not load staff accounts. Please try again.';
      this.staff = [];
    } finally {
      this.loading = false;
    }
  }

  openAddStaffForm(): void {
    this.draft = { fullName: '', email: '', phone: '' };
    this.addError = null;
    this.addSubmitting = false;
    this.showAddStaffForm = true;
  }

  closeAddStaffForm(): void {
    this.showAddStaffForm = false;
    this.draft = { fullName: '', email: '', phone: '' };
    this.addError = null;
    this.addSubmitting = false;
  }

  async save(): Promise<void> {
    this.addError = null;
    this.addSubmitting = true;

    try {
      const accessToken = '';

      if (!accessToken) {
        const msg = 'Your admin session expired. Please log in again.';
        this.addError = msg;
        const toast = await this.toastCtrl.create({
          message: msg,
          duration: 5000,
          position: 'bottom',
          color: 'danger',
        });
        await toast.present();
        return;
      }

      const normalizedEmail = this.draft.email.trim().toLowerCase();

      // Insert pending staff invite
      const payload: Record<string, unknown> = {
        email: normalizedEmail,
        full_name: this.draft.fullName.trim(),
        phone: this.draft.phone.trim() || null,
        status: 'pending',
      };

      const data = await firstValueFrom(this.api.post('admin/staff/invite', payload));

      if (!data) {
        throw new Error('Failed to invite staff member.');
      }

      const inviteResult = data as { id?: string; email?: string; fullName?: string; full_name?: string } | null;

      // Success - hide inline form and reload
      this.showAddStaffForm = false;
      await this.loadStaff();

      const toast = await this.toastCtrl.create({
        message: `Invite sent to ${inviteResult?.full_name || this.draft.fullName} (${normalizedEmail})`,
        duration: 4000,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();
    } catch (err: any) {
      const message = err?.message || 'Could not send staff invite.';
      this.addError = message;

      const toast = await this.toastCtrl.create({
        message,
        duration: 5000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.addSubmitting = false;
    }
  }

  async revokeInvite(inviteId: string): Promise<void> {
    this.busyRevoke = true;
    try {
      await firstValueFrom(this.api.put('admin/staff/invite/' + inviteId + '/revoke', {}));

      await this.loadStaff();

      const toast = await this.toastCtrl.create({
        message: 'Staff invite revoked.',
        duration: 3000,
        position: 'bottom',
        color: 'warning',
      });
      await toast.present();
    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: err?.message || 'Could not revoke invite.',
        duration: 5000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.busyRevoke = false;
    }
  }

  async toggle(id: string): Promise<void> {
    if (this.toggleBusy.has(id)) return;
    this.toggleBusy.add(id);

    try {
      const member = this.staff.find(s => s.id === id);
      if (!member) return;

      const action = member.status === 'Active' ? 'ban' : 'unban';

      const data: any = await firstValueFrom(this.api.put('admin/staff/' + id + '/update-status', { action }));

      await this.loadStaff();

      const toast = await this.toastCtrl.create({
        message: data?.status === 'Active'
          ? 'Staff account reactivated.'
          : 'Staff account deactivated.',
        duration: 3000,
        position: 'bottom',
        color: data?.status === 'Active' ? 'success' : 'warning',
      });
      await toast.present();
    } catch (err: any) {
      const message = err?.message || 'Could not update staff status.';

      const toast = await this.toastCtrl.create({
        message,
        duration: 5000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.toggleBusy.delete(id);
    }
  }
}

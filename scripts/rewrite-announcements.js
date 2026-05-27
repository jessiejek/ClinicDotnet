const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/announcements/announcements.page.ts';
let c = fs.readFileSync(f, 'utf8');

// Replace loadAnnouncements - the entire method body (from the try/async to before openModal)
c = c.replace(
  `private async loadAnnouncements(): Promise<void> {
    this.isLoading = true;
    this.loadError = false;

    const { data, error } = await this.api
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error && isTableMissing(error)) {
      this.loadError = true;
      this.loadErrorDescription = 'The announcements table has not been created yet. An administrator needs to apply the database migration.';
      console.warn('[AnnouncementsPage] announcements table not available:', error.message);
      this.announcements = [];
    } else if (error) {
      this.loadError = true;
      this.loadErrorDescription = 'Failed to load announcements. Please try again.';
      console.error('[AnnouncementsPage] Error loading announcements:', error.message);
      this.announcements = [];
    } else {
      this.announcements = ((data ?? []) as Record<string, unknown>[]).map(mapSupabaseRow);
    }
    this.isLoading = false;
  }`,
  `private async loadAnnouncements(): Promise<void> {
    this.isLoading = true;
    this.loadError = false;
    try {
      const data = await this.api.get('announcements').toPromise();
      this.announcements = (data ?? []).map(mapApiRow);
    } catch (err: any) {
      this.loadError = true;
      this.loadErrorDescription = 'Failed to load announcements.';
      console.error('[AnnouncementsPage] Error loading announcements:', err?.message ?? err);
      this.announcements = [];
    }
    this.isLoading = false;
  }`
);

// Replace save() insert
c = c.replace(
  `const { data, error } = await this.api
        .from('announcements')
        .insert({ title: this.draft.title, body: this.draft.body, is_active: this.draft.isActive })
        .select()
        .single();`,
  `const data = await this.api.post('announcements', { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive }).toPromise();`
);

// Replace save() update
c = c.replace(
  `const { error } = await this.api
        .from('announcements')
        .update({ title: this.draft.title, body: this.draft.body, is_active: this.draft.isActive })
        .eq('id', this.editingId);`,
  `await this.api.put('announcements/' + this.editingId, { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive }).toPromise();`
);

// Replace toggle()
c = c.replace(
  `const { error } = await this.api
      .from('announcements')
      .update({ is_active: newActive })
      .eq('id', id);`,
  `await this.api.put('announcements/' + id, { isActive: newActive }).toPromise();`
);

// Replace deleteConfirmed()
c = c.replace(
  `const { error } = await this.api
        .from('announcements')
        .delete()
        .eq('id', this.deletingId);`,
  `await this.api.delete('announcements/' + this.deletingId).toPromise();`
);

// Remove isTableMissing and mapSupabaseRow functions since they're no longer used
c = c.replace(
  `function mapSupabaseRow(row: Record<string, unknown>): Announcement {
  return {
    id: String(row['id'] ?? ''),
    title: String(row['title'] ?? ''),
    body: String(row['body'] ?? ''),
    imageUrl: row['image_url'] ? String(row['image_url']) : undefined,
    isActive: Boolean(row['is_active'] ?? true),
    createdAt: String(row['created_at'] ?? new Date().toISOString())
  };
}

function isTableMissing(error: { code?: string; message?: string }): boolean {
  const msg = (error?.message ?? '').toLowerCase();
  return msg.includes('relation') || msg.includes('does not exist') || error?.code === '42P01';
}`,
  `function mapApiRow(row: Record<string, unknown>): Announcement {
  return {
    id: String(row['id'] ?? ''),
    title: String(row['title'] ?? ''),
    body: String(row['body'] ?? ''),
    imageUrl: row['imageUrl'] ? String(row['imageUrl']) : undefined,
    isActive: Boolean(row['isActive'] ?? true),
    createdAt: String(row['createdAt'] ?? row['created_at'] ?? new Date().toISOString())
  };
}`
);

// Fix the error handling in save after insert/update
c = c.replace(
  `if (error) {
        this.isSaving = false;
        this.saveError = 'Failed to save announcement. The database may not be ready yet.';
        console.error('[AnnouncementsPage] Failed to update announcement:', error.message);
        return;
      }

      this.announcements = this.announcements.map((announcement) =>
        announcement.id === this.editingId ? { ...this.draft } : announcement
      );
      this.modalOpen = false;
    } else {`,
  `this.announcements = this.announcements.map((announcement) =>
        announcement.id === this.editingId ? { ...this.draft } : announcement
      );
      this.modalOpen = false;
    }`
);

// Fix error handling for insert in the else branch
c = c.replace(
  `if (error) {
        this.isSaving = false;
        this.saveError = 'Failed to create announcement. The database may not be ready yet.';
        console.error('[AnnouncementsPage] Failed to insert announcement:', error.message);
        return;
      }

      const inserted = data as Record<string, unknown>;
      this.announcements = [
        {
          id: String(inserted['id'] ?? ''),
          title: this.draft.title,
          body: this.draft.body,
          isActive: this.draft.isActive,
          createdAt: String(inserted['created_at'] ?? new Date().toISOString())
        },
        ...this.announcements
      ];
      this.modalOpen = false;
    }
    this.isSaving = false;`,
  `this.announcements = [
        { ...this.draft, createdAt: new Date().toISOString() },
        ...this.announcements
      ];
      this.modalOpen = false;
    }
    this.isSaving = false;`
);

// Replace error handling in toggle
c = c.replace(
  `if (error) {
      console.error('[AnnouncementsPage] Failed to toggle announcement:', error.message);
      await this.presentToast('Failed to update announcement status. The database may not be ready yet.', 'danger');
      return;
    }

    this.announcements = this.announcements.map((announcement) =>
      announcement.id === id ? { ...announcement, isActive: newActive } : announcement
    );`,
  `this.announcements = this.announcements.map((announcement) =>
      announcement.id === id ? { ...announcement, isActive: newActive } : announcement
    );`
);

// Replace error handling in delete
c = c.replace(
  `if (error) {
        console.error('[AnnouncementsPage] Failed to delete announcement:', error.message);
        this.deleteOpen = false;
        await this.presentToast('Failed to delete announcement. The database may not be ready yet.', 'danger');
        return;
      }

      this.announcements = this.announcements.filter((announcement) => announcement.id !== this.deletingId);
    }
    this.deleteOpen = false;
  }`,
  `this.announcements = this.announcements.filter((announcement) => announcement.id !== this.deletingId);
    }
    this.deleteOpen = false;
  }`
);

fs.writeFileSync(f, c);
console.log('announcements page clean rewrite done');

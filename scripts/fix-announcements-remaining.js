const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/announcements/announcements.page.ts';
let c = fs.readFileSync(f, 'utf8');

// Replace all remaining .from('announcements') patterns
// 1. Load all announcements (select * from announcements order by created_at desc)
c = c.replace(
  "this.api\n      .from('announcements')\n      .select('*')\n      .order('created_at', { ascending: false });\n\n    if (error) {\n      console.error('[AnnouncementsPage] Failed to load announcements:', error.message);\n      return;\n    }",
  "this.api.get('announcements').toPromise();\n\n    if (!data) {\n      console.error('[AnnouncementsPage] Failed to load announcements:');\n      return;\n    }"
);

// 2. Insert announcement
c = c.replace(
  "this.api\n      .from('announcements')\n      .insert({\n        title: this.form.value.title,\n        body: this.form.value.body,\n        image_url: this.form.value.imageUrl || null,\n        is_active: this.form.value.isActive\n      })\n      .select()\n      .single();\n\n    if (error) {\n      console.error('[AnnouncementsPage] Failed to create announcement:', error.message);\n      return undefined;\n    }",
  "this.api.post('announcements', {\n        title: this.form.value.title,\n        body: this.form.value.body,\n        imageUrl: this.form.value.imageUrl || null,\n        isActive: this.form.value.isActive\n      }).toPromise();\n\n    if (!data) {\n      console.error('[AnnouncementsPage] Failed to create announcement:');\n      return undefined;\n    }"
);

// 3. Update announcement
c = c.replace(
  "this.api\n      .from('announcements')\n      .update({\n        title: this.editingAnnouncement.title,\n        body: this.editingAnnouncement.body,\n        image_url: this.editingAnnouncement.imageUrl || null,\n        is_active: this.editingAnnouncement.isActive\n      })\n      .eq('id', this.editingAnnouncement.id);\n\n    if (error) {\n      console.error('[AnnouncementsPage] Failed to update announcement:', error.message);\n      return;\n    }",
  "this.api.put('announcements/' + this.editingAnnouncement.id, {\n        title: this.editingAnnouncement.title,\n        body: this.editingAnnouncement.body,\n        imageUrl: this.editingAnnouncement.imageUrl || null,\n        isActive: this.editingAnnouncement.isActive\n      }).toPromise();\n\n    if (error) {\n      console.error('[AnnouncementsPage] Failed to update announcement:');\n      return;\n    }"
);

// 4. Delete announcement
c = c.replace(
  "this.api\n      .from('announcements')\n      .delete()\n      .eq('id', id);",
  "this.api.delete('announcements/' + id).toPromise();"
);

// 5. Toggle active
c = c.replace(
  "this.api\n      .from('announcements')\n      .update({ is_active: isActive })\n      .eq('id', id);\n\n    if (error) {\n      console.error('[AnnouncementsPage] Failed to toggle announcement:', error.message);\n      return;\n    }",
  "this.api.put('announcements/' + id, { isActive }).toPromise();\n\n    if (error) {\n      console.error('[AnnouncementsPage] Failed to toggle announcement:');\n      return;\n    }"
);

// Fix the result patterns: the .from replaced left dangling lines
// After the replaces, clean up leftover issues

fs.writeFileSync(f, c);
console.log('fixed remaining announcements patterns');

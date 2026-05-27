const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/announcements/announcements.page.ts';
let c = fs.readFileSync(f, 'utf8');

// Add ApiService import
c = c.replace(
  'import { Component, inject, OnInit }',
  "import { Component, inject, OnInit }\nimport { ApiService } from '../../../core/services/api.service';"
);

// Replace SupabaseService injection with ApiService
c = c.replace(
  "private readonly supabase = inject(SupabaseService).client;",
  "private readonly api = inject(ApiService);"
);

// Remove SupabaseService import
c = c.replace(
  "import { SupabaseService } from '../../../core/services/supabase.service';\n",
  ""
);

// Replace loadAnnouncements: select from announcements
c = c.replace(
  "const { data, error } = await this.supabase\n      .from('announcements')\n      .select('*')\n      .order('created_at', { ascending: false });\n\n    if (error) {\n      console.error('[AnnouncementsPage] Failed to load announcements:', error.message);\n      return;\n    }\n\n    this.announcements = (data ?? []).map((row) => ({\n      id: row.id,\n      title: row.title,\n      body: row.body,\n      imageUrl: row.image_url,\n      isActive: row.is_active,\n      createdAt: row.created_at\n    }));",
  "try {\n      const data = await this.api.get('announcements').toPromise();\n      this.announcements = (data ?? []).map((row) => ({\n        id: row.id,\n        title: row.title,\n        body: row.body,\n        imageUrl: row.imageUrl ?? row.image_url,\n        isActive: row.isActive ?? row.is_active,\n        createdAt: row.createdAt ?? row.created_at\n      }));\n    } catch (err) {\n      console.error('[AnnouncementsPage] Failed to load announcements:', err);\n    }"
);

// Replace create announcement
c = c.replace(
  "const { data, error } = await this.supabase\n      .from('announcements')\n      .insert({\n        title: this.form.value.title,\n        body: this.form.value.body,\n        image_url: this.form.value.imageUrl || null,\n        is_active: this.form.value.isActive\n      })\n      .select()\n      .single();\n\n    if (error) {\n      console.error('[AnnouncementsPage] Failed to create announcement:', error.message);\n      return undefined;\n    }\n\n    return data;",
  "try {\n      const data = await this.api.post('announcements', {\n        title: this.form.value.title,\n        body: this.form.value.body,\n        imageUrl: this.form.value.imageUrl || null,\n        isActive: this.form.value.isActive\n      }).toPromise();\n      return data;\n    } catch (err) {\n      console.error('[AnnouncementsPage] Failed to create announcement:', err);\n      return undefined;\n    }"
);

// Replace update announcement
c = c.replace(
  "const { error } = await this.supabase\n      .from('announcements')\n      .update({\n        title: this.editingAnnouncement.title,\n        body: this.editingAnnouncement.body,\n        image_url: this.editingAnnouncement.imageUrl || null,\n        is_active: this.editingAnnouncement.isActive\n      })\n      .eq('id', this.editingAnnouncement.id);\n\n    if (error) {\n      console.error('[AnnouncementsPage] Failed to update announcement:', error.message);\n      return;\n    }",
  "try {\n      await this.api.put('announcements/' + this.editingAnnouncement.id, {\n        title: this.editingAnnouncement.title,\n        body: this.editingAnnouncement.body,\n        imageUrl: this.editingAnnouncement.imageUrl || null,\n        isActive: this.editingAnnouncement.isActive\n      }).toPromise();\n    } catch (err) {\n      console.error('[AnnouncementsPage] Failed to update announcement:', err);\n    }"
);

// Replace delete announcement
c = c.replace(
  "await this.supabase\n      .from('announcements')\n      .delete()\n      .eq('id', id);",
  "await this.api.delete('announcements/' + id).toPromise();"
);

// Replace toggle active override (the last pattern)
c = c.replace(
  "const { error } = await this.supabase\n      .from('announcements')\n      .update({ is_active: isActive })\n      .eq('id', id);\n\n    if (error) {\n      console.error('[AnnouncementsPage] Failed to toggle announcement:', error.message);\n      return;\n    }",
  "try {\n      await this.api.put('announcements/' + id, { isActive }).toPromise();\n    } catch (err) {\n      console.error('[AnnouncementsPage] Failed to toggle announcement:', err);\n    }"
);

fs.writeFileSync(f, c);
console.log('fixed announcements.page.ts');

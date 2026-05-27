const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/announcements/announcements.page.ts';
let c = fs.readFileSync(f, 'utf8');

// Read the full file, find the methods that use .from and replace them
// Method: loadAnnouncements()
c = c.replace(
  /private async loadAnnouncements\(\)[\s\S]*?await this\.api[\s\S]*?\.from\('announcements'\)[\s\S]*?\.select\('\*'\)[\s\S]*?\.order\('created_at',\s*\{ ascending:\s*false \}\)/,
  "private async loadAnnouncements() {\n    const data = await this.api.get('announcements').toPromise()"
);

// Find and replace the .from patterns for insert, update, delete, toggle
// After the replacements above, there should be no .from calls left

// Now fix: the catch blocks that destructure { data, error }
c = c.replace(/const\s*\{\s*data,\s*error\s*\}\s*=\s*await this\.api\.get/g, "const data = await this.api.get");
c = c.replace(/const\s*\{\s*error\s*\}\s*=\s*await this\.api\.post/g, "await this.api.post");
c = c.replace(/const\s*\{\s*error\s*\}\s*=\s*await this\.api\.put/g, "await this.api.put");
c = c.replace(/const\s*\{\s*error\s*\}\s*=\s*await this\.api\.delete/g, "await this.api.delete");
c = c.replace(/const\s*\{\s*data,\s*error\s*\}\s*=\s*await this\.api\.post/g, "const data = await this.api.post");
c = c.replace(/const\s*\{\s*data,\s*error\s*\}\s*=\s*await this\.api\.put/g, "const data = await this.api.put");

// Remove dangling .from, .select, .eq, .order chains
// After the replacements, ApiService methods don't have these chains
c = c.replace(/\n\s*\.from\('[^']*'\)[\s\S]*?(?=\n\s*if\s*\()/g, '');

// Clean up empty if(error) blocks that remain
c = c.replace(/if\s*\(\s*error\s*\)\s*\{[^}]*\}/g, '');

fs.writeFileSync(f, c);
console.log('announcements page rewritten');

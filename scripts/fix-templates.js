const fs = require('fs');
const path = require('path');
const f = path.join(__dirname, '..', 'src', 'app', 'core', 'services', 'booking.service.ts');
let c = fs.readFileSync(f, 'utf8');

// Fix broken template literals from PowerShell edits
c = c.replace(/payments\/\/waive/g, '`payments/${bookingId}/waive`');
c = c.replace(/\/id\/confirm/g, '/${bookingId}/confirm');

// Check remaining this.supabase references
const supabaseCount = (c.match(/this\.supabase/g) || []).length;
console.log('Remaining this.supabase references: ' + supabaseCount);

fs.writeFileSync(f, c);
console.log('Done');

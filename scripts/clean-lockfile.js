const fs = require('fs');

let content = fs.readFileSync('Z:/CLINIC/clinic_fe_dotnet/package-lock.json', 'utf8');

// Split into lines, filter out any with @supabase, reassemble
const lines = content.split(/\r?\n/);
const filtered = lines.filter(line => !line.includes('@supabase'));
content = filtered.join('\n');

// Remove trailing commas before closing braces/brackets (that resulted from removed lines)
content = content.replace(/,\n(\s*[}\]])/g, '\n$1');

fs.writeFileSync('Z:/CLINIC/clinic_fe_dotnet/package-lock.json', content);

const count = (content.match(/@supabase/gi) || []).length;
console.log('Remaining @supabase references: ' + count);

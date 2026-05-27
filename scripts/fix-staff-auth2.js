const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/staff/staff.page.ts';
let c = fs.readFileSync(f, 'utf8');

// 1. Replace auth.getSession() at line ~173 with accessToken = ''
c = c.replace(
  "const { data: sessionData } = await this.api.auth.getSession();\n      const accessToken = sessionData?.session?.access_token;",
  "const accessToken = '';"
);

// 2. Replace functions.invoke with a direct API call
// Use double quotes for the JS string to avoid conflicting with single quotes in the TypeScript
c = c.replace(
  'const { data, error } = await this.api.functions.invoke<UpdateStatusResponse>(\n' +
  "        'update-staff-status',\n" +
  '        {\n' +
  '          body: { userId: staffId, status, banned },\n' +
  '          headers: {\n' +
  "            Authorization: `Bearer ${accessToken}`,\n" +
  '          },\n' +
  '        }\n' +
  '      );\n' +
  "\n" +
  "      if (error) {\n" +
  "        throw new Error(error.message || 'Failed to update staff status via Edge Function.');\n" +
  '      }',
  "const data = await this.api.put('admin/staff/' + staffId + '/status', { status, banned }).toPromise();"
);

fs.writeFileSync(f, c);
console.log('fixed staff auth/functions');

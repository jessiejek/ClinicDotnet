const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/staff/staff.page.ts';
let c = fs.readFileSync(f, 'utf8');

// Replace the entire loadStaff method body (from try to end of the method)
c = c.replace(
  `private async loadStaff(): Promise<void> {
    try {
      // Step 1: fetch user_ids from user_roles where role = 'staff'
      const { data: roles, error: rolesError } = await this.api
        .from('user_roles')
        .select('user_id')
        .eq('role', 'staff');

      if (rolesError) throw new Error(rolesError.message);

      const staffRows: StaffRow[] = [];

      if (roles && roles.length > 0) {
        const userIds = roles.map(r => r.user_id);

        // Step 2: fetch profiles for those user_ids
        try {
          const { data: profiles, error: profilesError } = await this.api
            .from('profiles')
            .select('id, full_name, email, status')
            .in('id', userIds);

          if (profilesError) throw profilesError;
          if (profiles) {
            for (const p of profiles) {
              staffRows.push({
                id: p.id,
                fullName: p.full_name,
                email: p.email || '',
                role: 'Staff',
                status: (p.status === 'Inactive' ? 'Inactive' : 'Active') as 'Active' | 'Inactive',
                isInvite: false,
              });
            }
          }
        } catch (_profileQueryErr: any) {
          // Column may not exist yet - retry without `status`
          console.warn('profiles.status column not found, falling back without it.');
          const { data: profiles, error: fallbackError } = await this.api
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds);

          if (fallbackError) throw new Error(fallbackError.message);
          if (profiles) {
            for (const p of profiles) {
              staffRows.push({
                id: p.id,
                fullName: p.full_name,
                email: p.email || '',
                role: 'Staff',
                status: 'Active',
                isInvite: false,
              });
            }
          }
        }
      }

      // Step 3: also load pending staff invites
      try {
        const { data: invites, error: invitesError } = await this.api
          .from('staff_invites')
          .select('id, email, full_name, status, created_at')
          .in('status', ['pending', 'accepted']);

        if (!invitesError && invites) {
          const activatedEmails = new Set(staffRows.map(s => s.email.toLowerCase()));
          for (const inv of invites) {
            // Only show pending invites (accepted ones are already in staffRows via profiles)
            if (inv.status === 'pending') {
              staffRows.push({
                id: inv.id,
                fullName: inv.full_name,
                email: inv.email,
                role: 'Staff',
                status: 'Invited',
                isInvite: true,
              });
            }
          }
        }
      } catch (_invitesErr: any) {
        console.warn('[StaffPage] staff_invites table not available:', _invitesErr?.message);
      }

      this.staffMembers = staffRows;
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to load staff.';
      console.error('[StaffPage] Failed to load staff:', err);
    } finally {
      this.isLoading = false;
    }
  }`,
  `private async loadStaff(): Promise<void> {
    try {
      const data: any[] = await this.api.get('admin/staff').toPromise() ?? [];
      this.staffMembers = data.map((s: any) => ({
        id: s.id,
        fullName: s.fullName ?? s.full_name ?? '',
        email: s.email ?? '',
        role: s.role ?? 'Staff',
        status: (s.inactive || s.status === 'Inactive') ? 'Inactive' : 'Active',
        isInvite: s.isInvite ?? false,
      }));
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to load staff.';
      console.error('[StaffPage] Failed to load staff:', err);
    } finally {
      this.isLoading = false;
    }
  }`
);

// Also fix the other .from() methods (inviteStaff, revokeInvite, removeStaff)  
// inviteStaff
c = c.replace(
  /const { data, error } = await this\.api\n?\s*\.from\('staff_invites'\)\n?\s*\.insert\(\{[\s\S]*?\}\)\n?\s*\)\.select\(\)\.single\(\);/,
  "const data = await this.api.post('admin/staff/invite', { email, fullName: name }).toPromise();"
);

// revokeInvite
c = c.replace(
  /const { error } = await this\.api\n?\s*\.from\('staff_invites'\)\n?\s*\.delete\(\)\n?\s*\.eq\('id', inviteId\);/,
  "await this.api.delete('admin/staff/invite/' + inviteId).toPromise();"
);

// removeStaff - update profiles.status = 'Inactive'
c = c.replace(
  /const { error } = await this\.api\n?\s*\.from\('profiles'\)\n?\s*\.update\(\{ status: 'Inactive' \}\)\n?\s*\.eq\('id', staffId\);/,
  "await this.api.put('admin/staff/' + staffId + '/deactivate', {}).toPromise();"
);

fs.writeFileSync(f, c);
console.log('fixed staff page .from() patterns');

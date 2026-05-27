const fs = require('fs');
const f = 'Z:/CLINIC/clinic_fe_dotnet/src/app/portals/admin/staff/staff.page.ts';
let c = fs.readFileSync(f, 'utf8');

// Replace individual .from() patterns with API-style calls
// These replace the query chain including destructuring and error handling

// 1. .from('user_roles').select('user_id').eq('role', 'staff')
c = c.replace(
  'const { data: roles, error: rolesError } = await this.api\n        .from(\'user_roles\')\n        .select(\'user_id\')\n        .eq(\'role\', \'staff\');\n\n      if (rolesError) throw new Error(rolesError.message);\n\n      const staffRows: StaffRow[] = [];\n\n      if (roles && roles.length > 0) {\n        const userIds = roles.map(r => r.user_id);',
  'const staffRows: StaffRow[] = [];\n      const data: any[] = await this.api.get(\'admin/staff\').toPromise() ?? [];\n      for (const s of data) {\n        staffRows.push({\n          id: s.id,\n          fullName: s.fullName ?? s.full_name ?? \'\',\n          email: s.email ?? \'\',\n          role: s.role ?? \'Staff\',\n          status: s.inactive || s.status === \'Inactive\' ? \'Inactive\' : \'Active\',\n          isInvite: s.isInvite ?? false,\n        });\n      }'
);

// 2. .from('staff_invites').insert... select().single()
c = c.replace(
  'const { data, error } = await this.api\n        .from(\'staff_invites\')\n        .insert({\n          email,\n          full_name: name,\n          status: \'pending\'\n        })\n        .select()\n        .single();',
  'const data = await this.api.post(\'admin/staff/invite\', { email, fullName: name }).toPromise();'
);

// 3. .from('staff_invites').delete().eq('id', inviteId)
c = c.replace(
  'const { error } = await this.api\n        .from(\'staff_invites\')\n        .delete()\n        .eq(\'id\', inviteId);',
  'await this.api.delete(\'admin/staff/invite/\' + inviteId).toPromise();'
);

// 4. .from('profiles').update({ status: 'Inactive' }).eq('id', staffId)
c = c.replace(
  'const { error } = await this.api\n        .from(\'profiles\')\n        .update({ status: \'Inactive\' })\n        .eq(\'id\', staffId);',
  'await this.api.put(\'admin/staff/\' + staffId + \'/deactivate\', {}).toPromise();'
);

// Now remove the remaining parts that reference the old .from() approach
// Remove: Step 2 profiles query (profiles.select in try block)
c = c.replace(
  '\n        // Step 2: fetch profiles for those user_ids\n        try {\n          const { data: profiles, error: profilesError } = await this.api\n            .from(\'profiles\')\n            .select(\'id, full_name, email, status\')\n            .in(\'id\', userIds);\n\n          if (profilesError) throw profilesError;\n          if (profiles) {\n            for (const p of profiles) {\n              staffRows.push({\n                id: p.id,\n                fullName: p.full_name,\n                email: p.email || \'\',\n                role: \'Staff\',\n                status: (p.status === \'Inactive\' ? \'Inactive\' : \'Active\') as \'Active\' | \'Inactive\',\n                isInvite: false,\n              });\n            }\n          }\n        } catch (_profileQueryErr: any) {\n          // Column may not exist yet - retry without `status`\n          console.warn(\'profiles.status column not found, falling back without it.\');\n          const { data: profiles, error: fallbackError } = await this.api\n            .from(\'profiles\')\n            .select(\'id, full_name, email\')\n            .in(\'id\', userIds);\n\n          if (fallbackError) throw new Error(fallbackError.message);\n          if (profiles) {\n            for (const p of profiles) {\n              staffRows.push({\n                id: p.id,\n                fullName: p.full_name,\n                email: p.email || \'\',\n                role: \'Staff\',\n                status: \'Active\',\n                isInvite: false,\n              });\n            }\n          }\n        }\n      }',
  ''
);

// Remove: Step 3 staff_invites query
c = c.replace(
  '\n      // Step 3: also load pending staff invites\n      try {\n        const { data: invites, error: invitesError } = await this.api\n          .from(\'staff_invites\')\n          .select(\'id, email, full_name, status, created_at\')\n          .in(\'status\', [\'pending\', \'accepted\']);\n\n        if (!invitesError && invites) {\n          const activatedEmails = new Set(staffRows.map(s => s.email.toLowerCase()));\n          for (const inv of invites) {\n            // Only show pending invites (accepted ones are already in staffRows via profiles)\n            if (inv.status === \'pending\') {\n              staffRows.push({\n                id: inv.id,\n                fullName: inv.full_name,\n                email: inv.email,\n                role: \'Staff\',\n                status: \'Invited\',\n                isInvite: true,\n              });\n            }\n          }\n        }\n      } catch (_invitesErr: any) {\n        console.warn(\'[StaffPage] staff_invites table not available:\', _invitesErr?.message);\n      }\n\n      this.staffMembers = staffRows;',
  '\n      this.staffMembers = staffRows;'
);

fs.writeFileSync(f, c);
console.log('Staff page .from() patterns replaced');

import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * SupabaseService — kept as a thin stub for the 3 remaining services
 * that still use Supabase queries internally (booking, medical-records, admin-doctors).
 *
 * TODO: Convert these services to use ApiService + .NET endpoints entirely,
 * then delete this file and remove @supabase/supabase-js from package.json.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(
      'https://czswgpjjanllkmmwhmdh.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6c3dncGpqYW5sbGttbXdobWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MjY3OTYsImV4cCI6MjA5NTEwMjc5Nn0.XKv-TPuASM6SZGjH9foqsRrF5GYCWyHagMdXIP4QduQ'
    );
  }
}

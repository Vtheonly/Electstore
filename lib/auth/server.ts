import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Check if the current user is an admin (server-side)
 */
export async function isAdminServer() {
  const supabase = (await createClient()) as SupabaseClient<Database>;
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    return false;
  }

  return (data as any).role === 'admin';
}

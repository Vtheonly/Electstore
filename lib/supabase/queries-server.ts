import { createClient } from './server';
import { Database } from '@/types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

// Admin helper for server-side operations
export async function isUserAdmin(userId: string): Promise<boolean> {
  const supabase = (await createClient()) as SupabaseClient<Database>;
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return false;
  }

  return (data as any).role === 'admin';
}

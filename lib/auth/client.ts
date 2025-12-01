import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createClient();
  
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/**
 * Get the current user (client-side)
 */
export async function getCurrentUser() {
  const supabase = createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}

/**
 * Check if the current user is an admin (client-side)
 */
export async function isAdmin() {
  const supabase = createClient() as SupabaseClient<Database>;
  
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

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string) {
  const supabase = createClient() as SupabaseClient<Database>;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  // Create user profile
  if (data.user) {
    await supabase
      .from('user_profiles')
      .insert({ id: data.user.id, role: 'user' } as any);
  }

  return data;
}

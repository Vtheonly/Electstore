import { createClient } from './server';
import { Database } from '@/types/database.types';


// Admin helper for server-side operations
export async function isUserAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();
  
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

export async function getAdminStats() {
  const supabase = await createClient();

  const [productsCount, usersCount] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('user_profiles').select('*', { count: 'exact', head: true })
  ]);

  return {
    products: productsCount.count || 0,
    clients: usersCount.count || 0,
    orders: 0, // Orders table not yet implemented
    revenue: 0, // Orders table not yet implemented
  };
}

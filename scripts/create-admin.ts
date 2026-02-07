
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  const email = 'admin@tamani.dz';
  const password = 'admin123456';

  console.log(`Creating admin user: ${email}...`);

  // 1. Create the user in Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log('User already exists in Auth. Proceeding to update profile...');
      // Get existing user ID
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError || !usersData || !usersData.users) {
        console.error('Error listing users:', listError?.message);
        return;
      }

      const existingUser = usersData.users.find((u: any) => u.email === email);
      if (existingUser) {
        await promoteAdmin(existingUser.id);
      }
    } else {
      console.error('Error creating user:', authError.message);
    }
    return;
  }

  if (authData.user) {
    console.log('User created successfully. ID:', authData.user.id);
    await promoteAdmin(authData.user.id);
  }
}

async function promoteAdmin(userId: string) {
  console.log(`Promoting user ${userId} to admin...`);

  const { error: profileError } = await supabase
    .from('user_profiles')
    .upsert({ id: userId, role: 'admin' }, { onConflict: 'id' });

  if (profileError) {
    console.error('Error promoting user:', profileError.message);
  } else {
    console.log('User promoted to admin successfully!');
    console.log('\n--- CREDENTIALS ---');
    console.log(`Email: admin@tamani.dz`);
    console.log(`Password: admin123456`);
    console.log('-------------------\n');
  }
}

createAdmin().catch(console.error);

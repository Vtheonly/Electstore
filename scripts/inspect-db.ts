import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create client pointing to pg_catalog schema to query system views
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'pg_catalog' },
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  console.log("Fetching RLS policies for storage.objects...");
  
  const { data, error } = await supabase
    .from('pg_policies')
    .select('schemaname, tablename, policyname, roles, cmd, qual, with_check')
    .eq('tablename', 'objects')
    .eq('schemaname', 'storage');

  if (error) {
    console.error("Error fetching policies:", error);
    return;
  }

  if (!data || data.length === 0) {
    console.log("⚠️ No policies found for storage.objects table! This means RLS is enabled but there are no rules allowing uploads/downloads.");
  } else {
    console.log(`Found ${data.length} policies for storage.objects:`);
    console.log(JSON.stringify(data, null, 2));
  }
}

main().catch(console.error);

import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

async function main() {
  const url = `${supabaseUrl}/rest/v1/`;
  console.log(`Fetching OpenAPI schema from: ${url}...`);
  
  const response = await fetch(url, {
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`
    }
  });

  if (!response.ok) {
    console.error(`Failed to fetch schema: ${response.statusText}`);
    return;
  }

  const schema = await response.json() as any;
  const paths = Object.keys(schema.paths || {});
  
  const rpcs = paths.filter(p => p.startsWith('/rpc/'));
  console.log("Exposed RPC functions:");
  console.log(rpcs);
}

main().catch(console.error);

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

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  console.log("Listing Supabase storage buckets...");
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Error listing buckets:", error);
    return;
  }
  console.log("Existing buckets:", buckets.map(b => b.name));
  
  const bucketName = 'product-images';
  const hasBucket = buckets.some(b => b.name === bucketName);
  
  if (!hasBucket) {
    console.log(`Bucket '${bucketName}' does not exist. Creating public bucket...`);
    const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 5242880 // 5MB
    });
    if (createError) {
      console.error("Error creating bucket:", createError);
    } else {
      console.log(`Bucket '${bucketName}' created successfully!`, data);
    }
  } else {
    console.log(`Bucket '${bucketName}' already exists.`);
    
    // Check if it is public
    const bucket = buckets.find(b => b.name === bucketName);
    if (bucket && !bucket.public) {
      console.log(`Bucket '${bucketName}' is private. Updating to public...`);
      const { data, error: updateError } = await supabase.storage.updateBucket(bucketName, {
        public: true
      });
      if (updateError) {
        console.error("Error updating bucket to public:", updateError);
      } else {
        console.log(`Bucket '${bucketName}' updated to public successfully!`);
      }
    } else {
      console.log(`Bucket '${bucketName}' is already public.`);
    }
  }
}

main().catch(console.error);

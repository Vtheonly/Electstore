import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create client with anon key (like the browser does)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log("1. Logging in as admin...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@tamani.dz',
    password: 'admin123456'
  });

  if (authError) {
    console.error("Auth error:", authError);
    return;
  }

  console.log("Logged in successfully as:", authData.user?.email);

  console.log("2. Attempting to upload a test file to 'product-images'...");
  const testFileContent = 'hello world';
  const testFileBuffer = Buffer.from(testFileContent);
  const testFileName = `test_${Date.now()}.txt`;
  const testFilePath = `products/${testFileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(testFilePath, testFileBuffer, {
      contentType: 'text/plain',
      upsert: true
    });

  if (uploadError) {
    console.error("❌ Upload failed!");
    console.error("Error Details:", JSON.stringify(uploadError, null, 2));
  } else {
    console.log("✅ Upload succeeded!", uploadData);
    
    // Clean up
    console.log("Cleaning up...");
    const { error: deleteError } = await supabase.storage
      .from('product-images')
      .remove([testFilePath]);
      
    if (deleteError) {
      console.error("Cleanup error:", deleteError);
    } else {
      console.log("Cleanup succeeded.");
    }
  }
}

main().catch(console.error);

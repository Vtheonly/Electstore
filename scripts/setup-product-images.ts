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

async function setupProductImages() {
  console.log('Setting up product_images table...');

  // Try to create the table by doing a test insert and catching the error
  // If the table doesn't exist, we'll use an RPC call or direct REST

  // First, let's check if the table exists by trying to query it
  const { data, error } = await supabase
    .from('product_images')
    .select('id')
    .limit(1);

  if (error) {
    if (error.message.includes('does not exist') || error.code === '42P01' || error.message.includes('relation')) {
      console.log('❌ product_images table does not exist.');
      console.log('\n📋 Please run this SQL in your Supabase Dashboard (SQL Editor):');
      console.log('═'.repeat(60));
      console.log(`
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product images are viewable by everyone"
  ON product_images FOR SELECT
  USING (true);

CREATE POLICY "Product images are manageable by admins"
  ON product_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );
`);
      console.log('═'.repeat(60));
      return false;
    } else {
      console.error('Error checking table:', error.message);
      return false;
    }
  }

  console.log('✅ product_images table exists!');
  
  // Now populate with images from existing products
  console.log('\nPopulating product_images from existing products...');
  
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id, image_url')
    .not('image_url', 'is', null);

  if (prodError) {
    console.error('Error fetching products:', prodError.message);
    return false;
  }

  if (!products || products.length === 0) {
    console.log('No products with images found.');
    return true;
  }

  for (const product of products) {
    // Check if images already exist for this product
    const { data: existing } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', product.id)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(`  - ${product.id}: Already has images, skipping`);
      continue;
    }

    // Add the main image
    const { error: insertError } = await supabase
      .from('product_images')
      .insert({
        product_id: product.id,
        url: product.image_url,
        is_main: true,
        display_order: 0
      });

    if (insertError) {
      console.error(`  - ${product.id}: Error inserting image:`, insertError.message);
    } else {
      console.log(`  - ${product.id}: Added main image`);
    }
  }

  console.log('\n✅ Product images populated!');
  return true;
}

setupProductImages().catch(console.error);

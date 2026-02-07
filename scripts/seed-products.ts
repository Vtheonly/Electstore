
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

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

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const BUCKET_NAME = 'product-images';

async function uploadImage(filename: string): Promise<string | null> {
  try {
    const filePath = path.join(IMAGES_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filename}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileExt = path.extname(filename);
    const storagePath = `products/${Date.now()}_${filename}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: fileExt === '.png' ? 'image/png' : 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading ${filename}:`, error.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    console.log(`Uploaded ${filename} -> ${publicUrl}`);
    return publicUrl;
  } catch (err) {
    console.error(`Exception uploading ${filename}:`, err);
    return null;
  }
}

async function seedProducts() {
  console.log('Starting product seed...');

  // 1. Clean up existing data (optional, but good for dev)
  console.log('Cleaning up existing products...');
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  if (deleteError) console.error('Error deleting products:', deleteError.message);


  // 2. Upload Images
  const images = {
    lgFridge: await uploadImage('refrigerateur-lg.jpg'),
    samsungFridge: await uploadImage('refrigerateur-samsung.jpg'),
    boschWasher: await uploadImage('lave-linge-bosch.jpg'),
    whirlpoolWasher: await uploadImage('lave-linge-whirlpool.jpg'),
    lgTv: await uploadImage('tv-lg.jpg'),
    samsungTv: await uploadImage('tv-samsung.jpg'),
  };

  // 3. Define Products
  const products = [
    {
      name: 'Réfrigérateur LG 450L',
      description: 'Réfrigérateur intelligent avec technologie DoorCooling+™ pour un refroidissement plus rapide et plus uniforme. Grande capacité de 450L idéale pour les familles.',
      price: 125000,
      original_price: 135000,
      category: 'Réfrigérateurs',
      stock: 15,
      featured: true,
      image_keys: ['lgFridge', 'lgFridge'] // Simulate gallery with same image
    },
    {
      name: 'Réfrigérateur Samsung Twin Cooling',
      description: 'Gardez vos aliments frais plus longtemps avec le système Twin Cooling Plus™. Conversion facile entre congélateur et réfrigérateur selon vos besoins.',
      price: 118000,
      original_price: null,
      category: 'Réfrigérateurs',
      stock: 8,
      featured: true,
      image_keys: ['samsungFridge', 'samsungFridge']
    },
    {
      name: 'Lave-linge Bosch Série 6',
      description: 'Lave-linge EcoSilence Drive™ : extrêmement silencieux et durable. Programme AllergiePlus pour les peaux sensibles.',
      price: 85000,
      original_price: 92000,
      category: 'Lave-linge',
      stock: 20,
      featured: true,
      image_keys: ['boschWasher', 'boschWasher']
    },
    {
      name: 'Lave-linge Whirlpool 9kg',
      description: 'Technologie 6ème Sens qui adapte automatiquement les ressources en eau et en énergie à la charge de linge.',
      price: 72000,
      original_price: null,
      category: 'Lave-linge',
      stock: 5, // Low stock
      featured: false,
      image_keys: ['whirlpoolWasher']
    },
    {
      name: 'TV LG OLED 55"',
      description: 'L\'expérience cinéma à la maison avec des noirs parfaits et des couleurs éclatantes. Processeur α9 Gen4 AI 4K.',
      price: 18500, // Typo in price? 185000? Let's assume 185000
      original_price: 210000,
      category: 'TV',
      stock: 3,
      featured: true,
      image_keys: ['lgTv', 'lgTv']
    },
    {
      name: 'TV Samsung QLED 65"',
      description: 'Technologie Quantum Dot pour 100% du volume couleur. Design AirSlim ultra-fin.',
      price: 165000,
      original_price: null,
      category: 'TV',
      stock: 12,
      featured: false,
      image_keys: ['samsungTv']
    }
  ];

  // 4. Insert Products
  for (const p of products) {
    const mainImageUrl = images[p.image_keys[0] as keyof typeof images];
    
    // Fix price if it was 18500 -> 185000
    const price = p.name.includes('OLED') && p.price < 20000 ? 185000 : p.price;

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: p.name,
        description: p.description,
        price: price,
        original_price: p.original_price,
        category: p.category,
        stock: p.stock,
        featured: p.featured,
        image_url: mainImageUrl // Legacy field, keeping for compatibility
      })
      .select()
      .single();

    if (productError) {
      console.error(`Error creating product ${p.name}:`, productError.message);
      continue;
    }

    console.log(`Created product: ${p.name} (ID: ${product.id})`);

    // NOTE: Skipping product_images insertion - the table needs to be created first.
    // The main image URL is stored in products.image_url which is sufficient for now.
    // To enable gallery support, run the migration: supabase/migrations/002_add_product_images.sql
  }

  console.log('\\n✅ Seeding completed!');
  console.log('Products have been created with images stored in the image_url field.');
  console.log('\\n⚠️  To enable multi-image gallery support, run this SQL in Supabase Dashboard:');
  console.log('    File: supabase/migrations/002_add_product_images.sql');
}

seedProducts().catch(console.error);

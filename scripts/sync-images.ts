
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function syncProducts() {
  // Update existing
  await supabase.from('products').update({ image_url: '/images/refrigerateur-lg.jpg' }).eq('name', 'Réfrigérateur LG 450L');
  await supabase.from('products').update({ image_url: '/images/tv-samsung.jpg' }).eq('name', 'TV Samsung 55" 4K');

  // Insert missing ones to match public/images
  const newProducts = [
    { name: 'Lave-linge Bosch 8kg', description: 'Machine à laver efficace', price: 58500, category: 'Lave-linge', image_url: '/images/lave-linge-bosch.jpg', stock: 10 },
    { name: 'Lave-linge Whirlpool 10kg', description: 'Grande capacité', price: 78750, category: 'Lave-linge', image_url: '/images/lave-linge-whirlpool.jpg', stock: 5 },
    { name: 'Réfrigérateur Samsung 380L', description: 'No Frost Technology', price: 71000, category: 'Réfrigérateurs', image_url: '/images/refrigerateur-samsung.jpg', stock: 8 },
    { name: 'TV LG 65" OLED', description: 'Premium OLED TV', price: 171000, category: 'TV', image_url: '/images/tv-lg.jpg', stock: 3 },
  ];

  for (const p of newProducts) {
    const { data: existing } = await supabase.from('products').select('id').eq('name', p.name).single();
    if (!existing) {
      await supabase.from('products').insert(p);
      console.log(`Inserted ${p.name}`);
    } else {
      await supabase.from('products').update({ image_url: p.image_url }).eq('id', existing.id);
      console.log(`Updated ${p.name}`);
    }
  }
}

syncProducts();

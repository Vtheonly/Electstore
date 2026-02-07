import { createClient } from './client';
import { Product, ProductInsert, ProductUpdate, Tag } from '@/types';
import { Database } from '@/types/database.types';


// Product Queries

export async function getProducts(options?: {
  category?: string;
  tag?: string;
  featured?: boolean;
  limit?: number;
}) {
  const supabase = createClient();
  
  let query = supabase
    .from('products')
    .select(`
      *,
      product_tags(
        tags(*)
      ),
      product_images(*)
    `)
    .order('created_at', { ascending: false });

  if (options?.category) {
    query = query.eq('category', options.category);
  }

  if (options?.featured) {
    query = query.eq('featured', true);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.tag) {
    // Filter by tag using inner join on product_tags
    query = query.eq('product_tags.tags.slug', options.tag).not('product_tags', 'is', null);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export async function getProductById(id: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_tags(
        tags(*)
      ),
      product_images(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function createProduct(product: ProductInsert, tagIds?: string[], images?: { url: string; is_main: boolean }[]) {
  const supabase = createClient();
  
  const { data, error } = await (supabase
    .from('products') as any)
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  const productId = data.id;

  // 1. Handle Tags
  if (tagIds && tagIds.length > 0) {
    const productTags = tagIds.map(tagId => ({
      product_id: productId,
      tag_id: tagId
    }));

    const { error: tagsError } = await (supabase
      .from('product_tags') as any)
      .insert(productTags);

    if (tagsError) {
      console.error('Error adding tags to product:', tagsError);
    }
  }

  // 2. Handle Images
  if (images && images.length > 0) {
    const productImages = images.map((img, index) => ({
      product_id: productId,
      url: img.url,
      is_main: img.is_main,
      display_order: index
    }));

    const { error: imagesError } = await (supabase
      .from('product_images') as any)
      .insert(productImages);

    if (imagesError) {
      console.error('Error adding images to product:', imagesError);
    }
  }

  return data;
}

export async function updateProduct(
  id: string, 
  updates: ProductUpdate, 
  tagIds?: string[], 
  images?: { url: string; is_main: boolean }[]
) {
  const supabase = createClient();
  
  const { data, error } = await (supabase
    .from('products') as any)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  // 1. Handle Tag synchronization
  if (tagIds !== undefined) {
    await supabase.from('product_tags').delete().eq('product_id', id);

    if (tagIds.length > 0) {
      const productTags = tagIds.map(tagId => ({
        product_id: id,
        tag_id: tagId
      }));

      const { error: tagsError } = await (supabase.from('product_tags') as any).insert(productTags);
      if (tagsError) console.error('Error updating tags:', tagsError);
    }
  }

  // 2. Handle Image synchronization
  if (images !== undefined) {
    await supabase.from('product_images').delete().eq('product_id', id);

    if (images.length > 0) {
      const productImages = images.map((img, index) => ({
        product_id: id,
        url: img.url,
        is_main: img.is_main,
        display_order: index
      }));

      const { error: imagesError } = await (supabase.from('product_images') as any).insert(productImages);
      if (imagesError) console.error('Error updating images:', imagesError);
    }
  }

  return data;
}

/**
 * Uploads an image to Supabase Storage
 */
export async function uploadProductImage(file: File) {
  const supabase = createClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteProduct(id: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }

  return true;
}

// Tag Queries

export async function getTags() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }

  return data || [];
}

export async function createTag(name: string, slug: string) {
  const supabase = createClient();
  
  const { data, error } = await (supabase
    .from('tags') as any)
    .insert({ name, slug })
    .select()
    .single();

  if (error) {
    console.error('Error creating tag:', error);
    throw error;
  }

  return data;
}

export async function addTagToProduct(productId: string, tagId: string) {
  const supabase = createClient();
  
  const { error } = await (supabase
    .from('product_tags') as any)
    .insert({ product_id: productId, tag_id: tagId });

  if (error) {
    console.error('Error adding tag to product:', error);
    throw error;
  }

  return true;
}

export async function removeTagFromProduct(productId: string, tagId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('product_tags')
    .delete()
    .eq('product_id', productId)
    .eq('tag_id', tagId);

  if (error) {
    console.error('Error removing tag from product:', error);
    throw error;
  }

  return true;
}

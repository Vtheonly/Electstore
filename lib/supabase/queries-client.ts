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
      )
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
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function createProduct(product: ProductInsert, tagIds?: string[]) {
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

  // If there are tags, insert them into product_tags junction table
  if (tagIds && tagIds.length > 0) {
    const productTags = tagIds.map(tagId => ({
      product_id: data.id,
      tag_id: tagId
    }));

    const { error: tagsError } = await (supabase
      .from('product_tags') as any)
      .insert(productTags);

    if (tagsError) {
      console.error('Error adding tags to product:', tagsError);
      // We don't throw here to avoid failing product creation, 
      // but in a real app you might want to handle this.
    }
  }

  return data;
}

export async function updateProduct(id: string, updates: ProductUpdate, tagIds?: string[]) {
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

  // Handle tag synchronization if tagIds is provided
  if (tagIds !== undefined) {
    // 1. Remove all existing tags
    await supabase
      .from('product_tags')
      .delete()
      .eq('product_id', id);

    // 2. Insert new tags
    if (tagIds.length > 0) {
      const productTags = tagIds.map(tagId => ({
        product_id: id,
        tag_id: tagId
      }));

      const { error: tagsError } = await (supabase
        .from('product_tags') as any)
        .insert(productTags);

      if (tagsError) {
        console.error('Error updating tags for product:', tagsError);
      }
    }
  }

  return data;
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

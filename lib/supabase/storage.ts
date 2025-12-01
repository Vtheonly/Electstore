// /lib/supabase/storage.ts

import { createClient } from './client';

const BUCKET_NAME = 'product-images';

/**
 * Upload an image to Supabase Storage
 * @param file - File object to upload
 * @param path - Storage path (e.g., 'products/image-name.jpg')
 * @returns Public URL of the uploaded image or null if error
 */
export async function uploadImage(file: File, path: string): Promise<string | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Delete an image from Supabase Storage
 * @param path - Storage path to delete
 * @returns True if successful
 */
export async function deleteImage(path: string): Promise<boolean> {
  const supabase = createClient();
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) {
    console.error('Error deleting image:', error);
    return false;
  }

  return true;
}

/**
 * Get public URL for an image
 * @param path - Storage path
 * @returns Public URL
 */
export function getImageUrl(path: string): string {
  const supabase = createClient();
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

return data.publicUrl;
}

/**
 * Extract path from full Supabase storage URL
 * @param url - Full storage URL
 * @returns Path or null
 */
export function extractPathFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/storage\/v1\/object\/public\/product-images\/(.+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

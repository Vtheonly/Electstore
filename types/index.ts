// /types/index.ts

import { Database } from './database.types';

// Supabase table row types
export type Product = Database['public']['Tables']['products']['Row'] & {
  product_images?: Database['public']['Tables']['product_images']['Row'][];
  product_tags?: { tags: Database['public']['Tables']['tags']['Row'] }[];
};
export type Tag = Database['public']['Tables']['tags']['Row'];
export type ProductTag = Database['public']['Tables']['product_tags']['Row'];
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

// Insert types for creating new records
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type TagInsert = Database['public']['Tables']['tags']['Insert'];

// Update types for modifying records
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export type ProductImage = Database['public']['Tables']['product_images']['Row'];
export type ProductImageInsert = Database['public']['Tables']['product_images']['Insert'];

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  stock: number;
  featured: boolean;
  images: { url: string; is_main: boolean; file?: File }[];
  tags: string[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

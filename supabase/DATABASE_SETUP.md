# Database Setup Guide

## Initial Setup

1. **Run the migration script** in your Supabase SQL Editor:

   - Go to your Supabase project dashboard: https://jaadytgfzeptzrvykptv.supabase.co
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Click "Run" to execute

2. **Create the Storage Bucket**:

   - Go to Storage in Supabase dashboard
   - Click "Create a new bucket"
   - Name: `product-images`
   - Make it Public: ✓
   - Click "Create bucket"

3. **Set up Storage Policies** (if not automatically created):

   ```sql
   -- Allow public read access
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'product-images' );

   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated'  );
   ```

## Creating an Admin User

1. **Create a new user** via Supabase Auth dashboard or by signing up through your app
2. **Get the user's UUID** from the Authentication > Users page
3. **Run this SQL** to make them an admin:
   ```sql
   INSERT INTO user_profiles (id, role)
   VALUES ('YOUR_USER_UUID_HERE', 'admin');
   ```

## Sample Data

The migration script includes sample products with DZD pricing. All prices have been converted from EUR to DZD (approximate rate: 1 EUR = 131.5 DZD).

## Testing the Setup

Run these queries to verify:

```sql
-- Check products
SELECT * FROM products;

-- Check tags
SELECT * FROM tags;

-- Check admin users
SELECT * FROM user_profiles WHERE role = 'admin';
```

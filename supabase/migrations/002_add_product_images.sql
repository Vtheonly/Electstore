-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create policies for product_images
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

-- Create a helper function to replicate 'is_main' logic if needed
-- But generally handled by application logic

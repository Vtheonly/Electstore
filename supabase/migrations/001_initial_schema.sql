-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create product_tags junction table
CREATE TABLE IF NOT EXISTS product_tags (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Products are insertable by admins"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Products are updatable by admins"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Products are deletable by admins"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create policies for tags
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Tags are manageable by admins"
  ON tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create policies for product_tags
CREATE POLICY "Product tags are viewable by everyone"
  ON product_tags FOR SELECT
  USING (true);

CREATE POLICY "Product tags are manageable by admins"
  ON product_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create policies for user_profiles
CREATE POLICY "User profiles are viewable by authenticated users"
  ON user_profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for products table
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (convert EUR to DZD)
INSERT INTO products (name, description, price, original_price, category, image_url, stock, featured) VALUES
  ('Réfrigérateur LG 450L', 'Grand réfrigérateur moderne avec compartiment freezer', 91875, 101875, 'Réfrigérateurs', 'https://images.unsplash.com/photo-1617933622489-5e2a2d6e5a40?q=80&w=1974&auto=format&fit=crop', 15, true),
  ('Réfrigérateur Samsung 380L', 'Réfrigérateur Samsung avec technologie No Frost', 71000, 79000, 'Réfrigérateurs', 'https://images.unsplash.com/photo-1617933622489-5e2a2d6e5a40?q=80&w=1974&auto=format&fit=crop', 12, true),
  ('Lave-linge Bosch 8kg', 'Machine à laver efficace et silencieuse', 58500, NULL, 'Lave-linge', 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=2070&auto=format&fit=crop', 20, false),
  ('TV Samsung 55" 4K', 'Téléviseur LED 4K Smart TV', 105000, NULL, 'TV', 'https://images.unsplash.com/photo-1593784944526-659f83562b66?q=80&w=2070&auto=format&fit=crop', 8, true),
  ('TV LG 65" OLED', 'Téléviseur OLED premium avec HDR', 171000, NULL, 'TV', 'https://images.unsplash.com/photo-1593784944526-659f83562b66?q=80&w=2070&auto=format&fit=crop', 5, false),
  ('Lave-linge Whirlpool 10kg', 'Grande capacité pour les familles', 78750, NULL, 'Lave-linge', 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=2070&auto=format&fit=crop', 10, false);

-- Insert some sample tags
INSERT INTO tags (name, slug) VALUES
  ('Économie d''énergie', 'economie-energie'),
  ('Grande capacité', 'grande-capacite'),
  ('Smart', 'smart'),
  ('Premium', 'premium'),
  ('Silencieux', 'silencieux'),
  ('No Frost', 'no-frost');

-- Create storage bucket for product images (this needs to be run via Supabase dashboard or API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

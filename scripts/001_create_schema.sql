-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_tags junction table (many-to-many)
CREATE TABLE IF NOT EXISTS product_tags (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- Enable Row Level Security (public read access, since this is a simple e-commerce)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on product_tags" ON product_tags FOR SELECT USING (true);

-- Admin write access policies (using service role key on server)
CREATE POLICY "Allow insert on categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow delete on categories" ON categories FOR DELETE USING (true);

CREATE POLICY "Allow insert on tags" ON tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on tags" ON tags FOR UPDATE USING (true);
CREATE POLICY "Allow delete on tags" ON tags FOR DELETE USING (true);

CREATE POLICY "Allow insert on products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow delete on products" ON products FOR DELETE USING (true);

CREATE POLICY "Allow insert on product_tags" ON product_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete on product_tags" ON product_tags FOR DELETE USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_product_tags_product ON product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON product_tags(tag_id);

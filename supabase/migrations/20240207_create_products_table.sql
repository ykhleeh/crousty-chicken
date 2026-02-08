-- ============================================
-- Products Table Migration
-- Gestion du menu dans l'Admin — Crousty Chicken
-- ============================================

-- Create products table
CREATE TABLE products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category      TEXT NOT NULL CHECK (category IN ('dish', 'entry', 'drink', 'dessert')),

  -- Multilingual names (no translation keys)
  name_fr       TEXT NOT NULL,
  name_nl       TEXT,
  name_en       TEXT,

  -- Multilingual descriptions (for dishes)
  description_fr TEXT,
  description_nl TEXT,
  description_en TEXT,

  -- Image
  image_url     TEXT,

  -- Prices (in cents to avoid float errors)
  price_m       INTEGER,          -- M price (dishes only)
  price_l       INTEGER,          -- L price (dishes only)
  price_xl      INTEGER,          -- XL price (dishes only)
  price         INTEGER,          -- Single price (drinks, desserts)

  -- Entries: quantities per portion
  qty_small     INTEGER,          -- e.g. 5 pcs
  qty_large     INTEGER,          -- e.g. 10 pcs
  price_small   INTEGER,          -- Small price
  price_large   INTEGER,          -- Large price

  -- Options
  is_available  BOOLEAN DEFAULT true,
  is_single_price BOOLEAN DEFAULT false,  -- For 50/50 Box
  sort_order    INTEGER DEFAULT 0,

  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Indexes for frequent queries
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_products_sort_order ON products(sort_order);

-- ============================================
-- RLS Policies
-- ============================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access (the website displays the menu)
CREATE POLICY "Public read" ON products FOR SELECT USING (true);

-- Modifications: authenticated only
CREATE POLICY "Admin insert" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete" ON products FOR DELETE TO authenticated USING (true);

-- ============================================
-- Updated_at trigger
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Storage Bucket for menu images
-- ============================================

-- Create a public bucket for menu images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: upload for authenticated only
CREATE POLICY "Admin can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'menu-images');

-- Policy: public read
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'menu-images');

-- Policy: authenticated can update
CREATE POLICY "Admin can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'menu-images');

-- Policy: authenticated can delete
CREATE POLICY "Admin can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'menu-images');

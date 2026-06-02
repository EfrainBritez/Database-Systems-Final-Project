-- Run this in Supabase before deploying the soft-delete product behavior.
-- Products with order history should be archived instead of physically deleted.

ALTER TABLE product
ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

UPDATE product
SET is_active = true
WHERE is_active IS NULL;

CREATE INDEX IF NOT EXISTS idx_product_is_active
ON product(is_active);

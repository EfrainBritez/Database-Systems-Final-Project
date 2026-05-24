-- Run this in the Supabase SQL editor before using image uploads.
-- It creates a public Storage bucket and allows anonymous uploads for this class project.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow public read access to product images'
  ) THEN
    CREATE POLICY "Allow public read access to product images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'product-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow public uploads to product images'
  ) THEN
    CREATE POLICY "Allow public uploads to product images"
    ON storage.objects
    FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'product-images');
  END IF;
END $$;

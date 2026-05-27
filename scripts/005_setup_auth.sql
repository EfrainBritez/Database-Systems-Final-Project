-- RUN THIS IN SUPABASE SQL EDITOR TO SET UP AUTHENTICATION
-- Copy and paste this entire script into your Supabase SQL Editor

-- Step 1: Add password column to customer table if it doesn't exist
ALTER TABLE public.customer 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Step 2: Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_customer_email ON public.customer(customer_email);

-- Step 3: Enable Row Level Security on customer table
ALTER TABLE public.customer ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies to recreate them cleanly
DROP POLICY IF EXISTS "Enable read access for all users" ON public.customer;
DROP POLICY IF EXISTS "Enable insert for unauthenticated users" ON public.customer;
DROP POLICY IF EXISTS "Enable update for users" ON public.customer;

-- Step 5: Create policies for unauthenticated access (needed for sign up/sign in)
-- Allow anyone to read (needed to check email during signup)
CREATE POLICY "Enable read access for all users" ON public.customer
  FOR SELECT
  USING (true);

-- Allow anyone to insert (needed for signup)
CREATE POLICY "Enable insert for unauthenticated users" ON public.customer
  FOR INSERT
  WITH CHECK (true);

-- Step 6: Verify the setup worked
-- Run this SELECT to check if password column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'customer' AND column_name = 'password';

-- Run this SELECT to see your customers table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'customer'
ORDER BY ordinal_position;

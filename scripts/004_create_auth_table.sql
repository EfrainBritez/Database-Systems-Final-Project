-- Migration: Add password field to customer table for authentication
-- This adds password storage directly in the customer table for simpler architecture

-- Add password column if it doesn't exist
ALTER TABLE public.customer 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Create index for faster lookups by email
CREATE INDEX IF NOT EXISTS idx_customer_email ON public.customer(customer_email);

-- Note: Make sure to enable RLS on the customer table if not already done
-- ALTER TABLE public.customer ENABLE ROW LEVEL SECURITY;

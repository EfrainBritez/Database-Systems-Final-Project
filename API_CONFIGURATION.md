# Database API Configuration Guide

This document describes the Supabase PostgreSQL API configuration and query patterns for the e-commerce database system.

## Environment Setup

### Required Environment Variables

Create a `.env.local` file with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These variables are used by the Supabase client to authenticate with your PostgreSQL database.

## Database Schema Overview

### Core Tables

1. **product** - Product catalog
   - `product_id` (PK): Unique product identifier
   - `product_name`: Product name
   - `description`: Product description (nullable)
   - `photo_url`: Product image URL (nullable)
   - `price`: Product price (smallint)

2. **customer** - Customer information
   - `customer_id` (PK): Unique customer identifier
   - `customer_name`: Full name
   - `customer_email`: Email (unique)
   - `customer_phone`: Phone number (nullable)
   - `street`: Street address (nullable)
   - `city`: City (nullable)
   - `isAdmin`: Check admin access (nullable)

3. **order** - Orders
   - `order_id` (PK): Unique order identifier
   - `cutomer_id` (FK): Customer reference (note: column name is misspelled in DB)
   - `order_date`: Order date
   - `status`: Order status (nullable)
   - `total_amount`: Total order amount

4. **order_item** - Items in orders
   - `order_id` (PK part): Order reference
   - `product_id` (PK part, FK): Product reference
   - `quantity`: Quantity ordered
   - `price`: Item price

5. **inventory** - Product inventory
   - `inventory_id` (PK): Unique identifier
   - `product_id` (FK): Product reference
   - `quantity`: Current quantity (nullable)
   - `reorder_level`: Reorder threshold (nullable)
   - `last_update`: Last update date (nullable)

6. **payment** - Payment records
   - `payment_id` (PK): Unique identifier
   - `order_id` (FK): Order reference
   - `date_time`: Payment date
   - `method`: Payment method (nullable)
   - `amount`: Payment amount (nullable)
   - `payment_status`: Payment status (nullable)

7. **supplier** - Supplier information
   - `suplier_id` (PK): Unique identifier (note: column name is misspelled)
   - `supplier_name`: Supplier name
   - `contact_name`: Contact name (nullable)
   - `supplier_email`: Email (nullable)
   - `supplier_phone`: Phone (nullable)

8. **product_supplier** - Product-supplier relationships
   - `product_id` (PK part, FK): Product reference
   - `supplier_id` (PK part, FK): Supplier reference
   - `supply_price`: Supply price (nullable)
   - `lead_time_days`: Lead time (nullable)

9. **shipment** - Shipment tracking
   - `shipment_id` (PK): Unique identifier
   - `date_time`: Shipment date
   - `delivery_date`: Delivery date (nullable)
   - `shipment_status`: Status (nullable, default: 'preparing')
   - `tracking_number`: Tracking number (nullable)

10. **order_shipment** - Order-shipment relationships (junction)
    - `order_id` (PK part, FK): Order reference
    - `shipment_id` (PK part, FK): Shipment reference

11. **stock_movement** - Inventory movements
    - `movement_id` (PK): Unique identifier
    - `inventory_id` (FK): Inventory reference
    - `movement_date`: Movement date
    - `quantity_change`: Quantity change (nullable)
    - `movement_type`: Type of movement (nullable)
    - `reference_id`: Reference ID (nullable)

## API Query Patterns

### Product Queries

All product queries use the `getProducts` function from `lib/supabase/queries.ts`:

```typescript
// Get all products with sorting
const products = await getProducts('name-asc', 1, 12)

// Get single product
const product = await getProductById(1)

// Search products
const results = await searchProducts('laptop', 10)
```

**Supported Sort Options:**
- `name-asc`: Sort by name (A-Z)
- `name-desc`: Sort by name (Z-A)
- `price-asc`: Sort by price (low to high)
- `price-desc`: Sort by price (high to low)

**Pagination:**
- Uses LIMIT/OFFSET pattern
- Default page size: 12 items
- Page numbers are 1-indexed

### Customer Queries

```typescript
// Get customer by ID
const customer = await getCustomerById(1)

// Get customer by email
const customer = await getCustomerByEmail('user@example.com')

// Get customer orders
const orders = await getCustomerOrders(1, 10)
```

### Order Queries

```typescript
// Get order with all details (items, customer, payments)
const orderDetails = await getOrderWithDetails(1)

// Get customer's orders
const orders = await getCustomerOrders(customerId)
```

### Inventory & Supplier Queries

```typescript
// Get product inventory
const inventory = await getProductInventory(productId)

// Get suppliers for a product
const suppliers = await getProductSuppliers(productId)

// Get payment info
const payment = await getOrderPayment(orderId)
```

## Page Implementation Details

### Product Catalog Page

Location: `app/page.tsx`

**Features:**
- Displays products in a responsive grid (1-4 columns)
- Server-side sorting by name/price
- Pagination support (12 items per page)
- Product cards with image, name, description, and price

**Data Flow:**
1. Page receives `sort` and `page` parameters from URL
2. Calls `getProducts()` with current sort/page
3. Products are rendered via `ProductGrid` component
4. Each product displays in `ProductCard` component

**Component Structure:**
- `page.tsx` - Server component handling data fetching
- `components/product-grid.tsx` - Grid layout
- `components/product-card.tsx` - Individual product card
- `components/sort-controls.tsx` - Sorting UI (client component)

## Row-Level Security (RLS)

All tables have RLS enabled. The following is assumed:
- Access is limited by RLS policies unless a policy explicitly allows the action
- Anonymous access may be restricted to certain tables/operations
- Authenticated users have access based on their role/permissions

## Common Join Patterns

```typescript
// Order with customer
SELECT * FROM public.order
JOIN public.customer ON public.order.cutomer_id = public.customer.customer_id

// Order with items and products
SELECT * FROM public.order
JOIN public.order_item ON public.order.order_id = public.order_item.order_id
JOIN public.product ON public.order_item.product_id = public.product.product_id

// Product with suppliers
SELECT * FROM public.product
JOIN public.product_supplier ON public.product.product_id = public.product_supplier.product_id
JOIN public.supplier ON public.product_supplier.supplier_id = public.supplier.suplier_id

// Order with shipments
SELECT * FROM public.order
JOIN public.order_shipment ON public.order.order_id = public.order_shipment.order_id
JOIN public.shipment ON public.order_shipment.shipment_id = public.shipment.shipment_id
```

## Important Notes

1. **Column Name Typos**: The database has intentional misspellings:
   - `order.cutomer_id` (should be customer_id)
   - `supplier.suplier_id` (should be supplier_id)
   - Always use these exact names in queries

2. **Field Selection**: Always select only the columns you need
   - Reduces data transfer
   - Improves query performance

3. **Pagination**: Use LIMIT/OFFSET pattern
   - Default: 12 items per page
   - Calculated as: offset = (page - 1) * pageSize

4. **Error Handling**: All query functions return null/empty arrays on error
   - Check the console for detailed error messages
   - Implement user-facing error messages as needed

## Testing Queries

You can test queries directly in the Supabase dashboard SQL editor:

```sql
-- List all products with pagination
SELECT product_id, product_name, description, photo_url, price
FROM public.product
ORDER BY product_name ASC
LIMIT 12 OFFSET 0;

-- Get product by ID
SELECT * FROM public.product
WHERE product_id = 1;

-- Get customer with orders
SELECT c.*, o.*
FROM public.customer c
LEFT JOIN public.order o ON c.customer_id = o.cutomer_id
WHERE c.customer_id = 1;

-- Get order details
SELECT o.*, oi.product_id, oi.quantity, oi.price, p.product_name
FROM public.order o
JOIN public.order_item oi ON o.order_id = oi.order_id
JOIN public.product p ON oi.product_id = p.product_id
WHERE o.order_id = 1;
```

## Troubleshooting

**Products not displaying?**
- Check environment variables in `.env.local`
- Verify Supabase URL and anon key are correct
- Check browser console for errors
- Ensure RLS policies allow anonymous SELECT on product table

**Sorting not working?**
- Verify sort parameter is passed correctly in URL
- Check that sort values match the enum: 'price-asc', 'price-desc', 'name-asc', 'name-desc'

**Pagination issues?**
- Ensure page parameter is a positive integer
- Verify pageSize calculation: offset = (page - 1) * pageSize

**Type errors?**
- Ensure types in `lib/types.ts` match the database schema
- Use exact column names from the database

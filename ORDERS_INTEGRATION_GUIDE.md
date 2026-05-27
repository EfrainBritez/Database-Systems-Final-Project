# Orders Management System - Integration Guide

## Overview

I've created a complete orders management system with payment gateway integration. Here's what's been implemented:

## 📊 Database Schema

### New Tables Created
Created in `/scripts/003_create_orders_schema.sql`:

1. **customers** - Customer information
   - UUID primary key
   - Email (unique)
   - Full name, phone, address details
   - Timestamps

2. **orders** - Order management
   - UUID primary key
   - Customer reference (foreign key)
   - Order number (unique)
   - Status: pending, confirmed, processing, shipped, delivered, cancelled
   - Payment status: unpaid, paid, failed
   - Total amount with tax included
   - Payment method and gateway ID

3. **order_items** - Line items per order
   - UUID primary key
   - Order and product references
   - Quantity and price
   - Cascading delete with order

4. **payments** - Payment records
   - UUID primary key
   - Order reference
   - Amount, status, payment method
   - Payment gateway ID and response JSON
   - Timestamps

## 🔌 API Endpoints

### Customers API
**POST /api/customers**
- Create a new customer
- Request body:
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "email": "string (unique)",
    "phone": "string (optional)",
    "street_address": "string (optional)",
    "city": "string (optional)",
    "state": "string (optional)",
    "zip_code": "string (optional)",
    "country": "string (default: US)"
  }
  ```
- Returns: Customer object with UUID

### Orders API
**GET /api/orders**
- Fetch all orders with pagination
- Query params: `limit` (default: 50), `offset` (default: 0)
- Returns: Array of orders with customer details and items

**POST /api/orders**
- Create a new order
- Request body:
  ```json
  {
    "customer_id": "uuid",
    "items": [
      {
        "product_id": "uuid",
        "quantity": number,
        "price": number
      }
    ],
    "total_amount": number,
    "payment_method": "string (optional)",
    "notes": "string (optional)"
  }
  ```
- Returns: Order object

**GET /api/orders/[id]**
- Fetch a specific order with full details
- Returns: Order with customer, items, and payment information

### Payments API
**POST /api/payments**
- Create a payment record
- Request body:
  ```json
  {
    "order_id": "uuid",
    "amount": number,
    "payment_method": "string",
    "payment_gateway_id": "string (optional)",
    "gateway_response": "object (optional)"
  }
  ```
- Returns: Payment object
- Side effect: Updates order status to 'confirmed' and payment_status to 'paid'

## 📄 Pages

### Admin Orders Dashboard
**URL:** `/admin/orders`
- View all orders in a table
- See customer name, email, total, status, payment status
- Quick action to view order details
- Shows item count per order
- Create new order button

### Order Details Page
**URL:** `/admin/orders/[id]`
- Complete order information
- Customer details section
- Order items table with pricing
- Payment and shipping status
- Status update controls (change from pending → confirmed → processing → shipped → delivered)
- Order notes display

### Updated Checkout Page
**URL:** `/checkout`
- Integrated payment processing
- Collects customer information
- Links to payment gateway
- Creates customer record on submission
- Creates order with cart items
- Creates payment record
- Shows order ID on success
- Link to view order details

## 🛠️ Server Actions

File: `/app/admin/order-actions.ts`

### `createCustomer(customerData)`
- Creates a new customer or returns existing if email matches
- Auto-returns existing customer with same email (prevents duplicates)

### `createOrder(orderData)`
- Creates order with items
- Generates unique order number
- Validates items array is not empty
- Returns error if item creation fails, and deletes order

### `createPayment(paymentData)`
- Creates payment record
- Updates order to 'confirmed' status
- Updates payment_status to 'paid'

### `updateOrderStatus(orderId, status)`
- Updates order status to one of: pending, confirmed, processing, shipped, delivered, cancelled

## 🔄 Checkout Flow

1. **User fills checkout form**
   - Collects shipping and payment information
   - Validates all required fields

2. **Customer Created**
   - POST to `/api/customers` with form data
   - Email must be unique
   - Returns customer UUID

3. **Order Created**
   - POST to `/api/orders` with:
     - Customer UUID
     - Cart items with product_id, quantity, price
     - Total amount with tax (10%)
     - Payment method = "card"
   - Generates unique order number

4. **Payment Processed**
   - POST to `/api/payments` with:
     - Order UUID
     - Amount (total with tax)
     - Payment gateway ID (simulated)
     - Gateway response (status, card last 4, timestamp)

5. **Order Confirmed**
   - Order status → 'confirmed'
   - Payment status → 'paid'
   - Cart cleared
   - Success page shown with order ID

## 💳 Payment Gateway Integration

### Current Implementation
The checkout uses a **simulated payment gateway** for testing. In production, you would integrate:

- **Stripe**: Popular for credit cards and digital payments
- **PayPal**: Alternative payment gateway
- **Square**: For both online and in-person payments

### To integrate Stripe (example):

1. Install Stripe SDK:
   ```bash
   npm install stripe
   ```

2. Create a payment intent in your checkout:
   ```typescript
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
   const paymentIntent = await stripe.paymentIntents.create({
     amount: Math.round(totalWithTax * 100),
     currency: 'usd',
     payment_method: 'pm_xxx'
   })
   ```

3. Send `paymentIntent.id` as `payment_gateway_id` to payment API

4. Update payment status based on Stripe webhook responses

## 🚀 Setup Instructions

### 1. Run Database Migration
Execute the SQL migration in Supabase:
```sql
-- Copy contents of: scripts/003_create_orders_schema.sql
-- Run in Supabase SQL editor
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

The following new dependency was added:
- `uuid@^9.0.1` - For generating unique identifiers

### 3. Environment Variables
No new environment variables needed. Uses existing:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Test the Flow
1. Add products to cart
2. Go to `/checkout`
3. Fill in customer and payment info
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. View order at `/admin/orders`

## 📋 Types

New TypeScript types added to `/lib/types.ts`:

- `CustomerNew` - UUID-based customer
- `OrderNew` - UUID-based order
- `OrderItemNew` - Order line item
- `PaymentNew` - Payment record
- `OrderWithDetails` - Order with customer and items
- `CartItem` - Cart item representation

## 🔒 Security Considerations

### Current State (Development)
- RLS policies allow public insert/select/update
- Suitable for testing and development

### Production Recommendations
1. **Implement authentication**
   - Use Supabase Auth
   - Only allow users to see their own orders

2. **Update RLS policies**
   ```sql
   -- Example: Users can only view their own orders
   CREATE POLICY "Users can view own orders"
   ON orders FOR SELECT
   USING (auth.uid() = (SELECT auth.uid() FROM customers WHERE id = customer_id))
   ```

3. **Add input validation**
   - Validate email format
   - Sanitize order notes
   - Validate amount matches cart

4. **Implement webhook verification**
   - Verify payment gateway signatures
   - Validate webhook timestamps

5. **Add rate limiting**
   - Prevent order spam
   - Limit API calls per user

## 📱 Navigation Links

Add these to your header/navigation:

```tsx
<Link href="/admin/orders">Orders</Link>
<Link href="/checkout">Checkout</Link>
```

Or update your header component to include order management links for admins.

## 🧪 Testing

### Test Scenarios

**Scenario 1: New Customer Order**
1. Add item to cart
2. Go to checkout
3. Fill form with new email
4. Complete purchase
5. Verify in `/admin/orders`

**Scenario 2: Duplicate Customer**
1. Checkout with same email twice
2. System returns existing customer
3. Creates new order for same customer
4. Verify same customer on both orders

**Scenario 3: Multiple Items**
1. Add 2-3 products to cart
2. Verify all items in order
3. Check subtotal + tax calculation
4. Verify order items table

**Scenario 4: Order Status Updates**
1. View order in admin
2. Click different status buttons
3. Refresh page
4. Verify status persists

## 🐛 Troubleshooting

**Issue: "Customer already exists" error**
- This is expected! The system prevents duplicate emails
- Use a different email for testing, or update existing customer order

**Issue: Order not appearing in admin**
- Check browser console for errors
- Verify payment endpoint succeeded
- Check Supabase database directly

**Issue: Cart not clearing after checkout**
- Clear browser localStorage
- Or refresh page

## 📖 Next Steps

1. **Integrate with real payment gateway** (Stripe, PayPal, etc.)
2. **Add email notifications** for order confirmation
3. **Implement order tracking** with shipment updates
4. **Add refund/cancellation** functionality
5. **Create customer account** system
6. **Add order history** to customer dashboard
7. **Implement inventory management** to reduce stock on order
8. **Add order export** functionality (CSV, PDF)

## 📞 API Error Codes

- `400` - Bad request (missing/invalid fields)
- `404` - Order not found
- `500` - Server error (check console logs)

Check response body for specific error messages.

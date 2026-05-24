# ShopSimple - E-Commerce Database System

A modern, full-featured e-commerce application built with Next.js, React, and Supabase PostgreSQL. This is a final project for a Database Systems course demonstrating a complete CRUD system for products, customers, orders, suppliers, and inventory management.

## Live Features & Functionality

### 1. **User Authentication System**
   - **Sign Up / Registration**: Create new customer accounts with email and password
   - **Sign In / Login**: Authenticate with email and hashed password (bcryptjs)
   - **User Avatar**: Displays logged-in user's first initial in a circular avatar
   - **Logout**: Clear session and return to anonymous state
   - **Toast Notifications**: Real-time feedback for login success/failure and logout confirmation
   - **Session Persistence**: Stays logged in for 7 days using HTTP-only cookies
   - **Security**: Passwords are hashed with bcryptjs (10 rounds) before storage

### 2. **Product Catalog & Browsing**
   - **Product Grid Display**: Browse all products with images, descriptions, and prices
   - **Sorting Options**:
     - Sort by product name (A-Z or Z-A)
     - Sort by price (Low to High or High to Low)
   - **Pagination**: 12 products per page with navigation controls
   - **Product Details**: View product name, description, image, and price
   - **Dynamic Filtering**: Real-time sorting updates without page reload

### 3. **Shopping Cart Management**
   - **Add to Cart**: Add products with custom quantities
   - **Cart Item Counter**: Shows total number of items in cart (navbar badge)
   - **View Cart**: Dedicated cart page showing all items
   - **Quantity Controls**: Increase/decrease item quantities
   - **Remove Items**: Delete products from cart with one click
   - **Price Calculation**: Automatic total price calculation
   - **Clear Cart**: Remove all items at once
   - **Empty Cart State**: User-friendly message when cart is empty
   - **Persistent Cart**: Cart data saved in React context

### 4. **Checkout & Payment**
   - **Checkout Page**: Complete order review before payment
   - **Order Summary**: Display all cart items with total amount
   - **Customer Information**: Pre-fill or enter customer details
   - **Payment Integration**: Integrated payment flow

### 5. **Admin Dashboard**
   - **Product Management**:
     - View all products in a table
     - Add new products with name, description, image, and price
     - Edit existing products
     - Delete products
   - **Supplier Management**:
     - View all suppliers
     - Add new suppliers with contact information
     - Edit supplier details
     - Delete suppliers
   - **Inventory Tracking**:
     - Monitor stock levels
     - View inventory history
     - Track reorder levels
   - **Tab-Based Interface**: Switch between Products, Suppliers, and Inventory tabs

### 6. **Supplier Management Page**
   - **Supplier Listing**: Browse all suppliers with contact details
   - **Supplier Cards**: Visual display of supplier information
   - **Contact Information**: Email and phone number display

### 7. **Navigation & UI**
   - **Header Component**: Consistent navigation across all pages
   - **Responsive Design**: Mobile-friendly layout with Tailwind CSS
   - **User Menu**: Dropdown menu showing logout option when logged in
   - **Quick Links**: Easy access to Cart, Admin Dashboard, and Auth buttons
   - **ShopSimple Branding**: Logo/brand name in header

### 8. **Database Features**
   - **Customer Table**: Stores user information with authentication
   - **Product Table**: Full product catalog with details
   - **Order Table**: Order history and tracking
   - **Order Items**: Line items for each order
   - **Inventory Table**: Stock tracking and management
   - **Payment Table**: Payment records and status
   - **Supplier Table**: Supplier information
   - **Product-Supplier Relationship**: Link products to suppliers
   - **Shipment Tracking**: Monitor order shipments
   - **Stock Movements**: Track inventory changes

### 9. **API Routes**
   - `/api/auth/signin` - User login endpoint
   - `/api/auth/signup` - User registration endpoint
   - `/api/auth/me` - Get current user info
   - `/api/auth/logout` - Clear session
   - `/api/customers` - Customer management
   - `/api/orders` - Order management
   - `/api/orders/[id]` - Individual order details
   - `/api/payments` - Payment handling
   - REST API endpoints for products, suppliers, and inventory

### 10. **Component Architecture**
   - **Header**: Navigation and branding
   - **AuthButtons**: Sign in/up modal forms with user avatar
   - **ProductGrid**: Responsive product display
   - **SortControls**: Sorting and filtering UI
   - **CartButton**: Shopping cart access
   - **Admin Components**: Forms and tables for management
   - **UI Components**: Reusable design system (buttons, cards, dialogs, etc.)

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom auth system with bcryptjs
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for analytics
- **UI Library**: Radix UI components

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account

### Installation

```bash
# Install dependencies
pnpm install

# Create .env.local file
cp .env.example .env.local

# Add your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📚 Database Setup

Run the migration scripts in Supabase SQL Editor:

1. `scripts/001_create_schema.sql` - Create base tables
2. `scripts/002_seed_data.sql` - Populate sample data
3. `scripts/003_create_orders_schema.sql` - Create order tables
4. `scripts/005_setup_auth.sql` - Add authentication
5. `scripts/003_create_product_images_bucket.sql` - Create the Storage bucket and policies for product image uploads

## Authentication Setup

See [AUTH_SETUP.md](AUTH_SETUP.md) for complete authentication configuration.

## API Documentation

See [API_CONFIGURATION.md](API_CONFIGURATION.md) for detailed API endpoints and query patterns.

## Project Structure

```
├── app/
│   ├── api/auth/ - Authentication endpoints
│   ├── admin/ - Admin dashboard
│   ├── cart/ - Shopping cart
│   ├── checkout/ - Checkout page
│   ├── suppliers/ - Supplier listing
│   └── page.tsx - Home/product catalog
├── components/
│   ├── forms/ - Sign in/up forms
│   ├── admin/ - Admin components
│   ├── ui/ - Reusable UI components
│   └── auth-buttons.tsx - Authentication UI
├── lib/
│   ├── auth-context.tsx - Auth state management
│   ├── cart-context.tsx - Cart state management
│   └── supabase/ - Database client
└── scripts/ - Database migrations
```

## Key Features Workflow

### User Registration & Login
1. User clicks "Sign Up" button
2. Form validates email and password
3. System hashes password with bcryptjs
4. Customer record created in database
5. Auth cookie set for 7-day session
6. Toast notification confirms success
7. Avatar appears showing user's initial

### Product Discovery
1. Homepage displays product catalog
2. User can sort by name or price
3. Products paginate (12 per page)
4. Clicking product card shows details
5. Add to cart button available

### Shopping Cart
1. User adds products to cart
2. Cart icon in header shows item count
3. User navigates to cart page
4. Can modify quantities or remove items
5. Total price calculated automatically
6. Proceeds to checkout

### Admin Management
1. Admin navigates to Admin Dashboard
2. Tabs show Products, Suppliers, Inventory
3. Forms allow adding/editing items
4. Tables display all records
5. Delete buttons for removing records
6. Changes reflected in database immediately

## Contributing

This is a final project for Database Systems coursework.

## License

This project is part of an academic assignment.

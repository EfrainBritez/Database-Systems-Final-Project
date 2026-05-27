# Custom Authentication System Setup Guide

This project now includes a custom authentication system for user management using your existing `customer` database table with a simplified architecture.

## What Was Added

1. **Auth Context** (`lib/auth-context.tsx`) - Manages user state and authentication with toast notifications
2. **Auth Buttons Component** (`components/auth-buttons.tsx`) - Avatar with dropdown menu for logged-in users
3. **Sign In Form** (`components/forms/sign-in-form.tsx`) - Modal form for login
4. **Sign Up Form** (`components/forms/sign-up-form.tsx`) - Modal form for registration
5. **API Routes**:
   - `POST /api/auth/signin` - Authenticate user
   - `POST /api/auth/signup` - Register new user
   - `GET /api/auth/me` - Get current user
   - `POST /api/auth/logout` - Logout user
6. **Database Migration** (`scripts/004_create_auth_table.sql`) - Adds password field to customer table

## Setup Instructions

### 1. Add Password Field to Customer Table

In your Supabase dashboard, go to **SQL Editor** and run the migration:

```sql
-- Add password column if it doesn't exist
ALTER TABLE public.customer 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Create index for faster lookups by email
CREATE INDEX IF NOT EXISTS idx_customer_email ON public.customer(customer_email);
```

### 2. Enable RLS Policies

Make sure the `customer` table allows read access for authentication:

```sql
-- Enable RLS if not already enabled
ALTER TABLE public.customer ENABLE ROW LEVEL SECURITY;

-- Policy to allow checking email existence during signup
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON public.customer
  FOR SELECT
  USING (true);

-- Policy to allow signup to insert new customers
CREATE POLICY IF NOT EXISTS "Enable insert for unauthenticated users" ON public.customer
  FOR INSERT
  WITH CHECK (true);
```

## How It Works

### Authentication Flow

1. **Sign Up**:
   - User enters name, email, and password
   - System checks if email already exists
   - Password is hashed using bcryptjs (10 rounds)
   - New customer record is created with hashed password
   - Success toast notification appears
   - Auth cookie is set
   - User avatar appears in navbar

2. **Sign In**:
   - User enters email and password
   - System finds customer by email
   - Password is verified against stored hash
   - Success toast notification appears: "Welcome back, [Name]!"
   - Auth cookie is set
   - User avatar replaces sign in/up buttons

3. **Sign Out**:
   - Logout toast notification appears: "You have been successfully logged out."
   - Auth cookie is cleared
   - User context is reset
   - Sign in/up buttons reappear

### UI Behavior

**When Not Logged In:**
- Show "Sign In" and "Sign Up" buttons

**When Logged In:**
- Show user avatar (circle with first initial)
- Avatar has hover effect
- Click avatar to open dropdown menu
- Dropdown contains only "Log Out" button

### Features

- **Persistent Sessions**: Auth persists via HTTP-only cookies
- **Password Security**: Passwords are hashed with bcryptjs (10 rounds)
- **Toast Notifications**: Feedback on login success/failure and logout
- **Simple Architecture**: Password stored directly in customer table
- **User Avatar**: Shows first letter of customer name
- **Admin Badge**: Can show if user is admin (customize in dropdown)

## Database Schema

### customer table (simplified)
- `customer_id` - Primary key
- `customer_name` - User's full name
- `customer_email` - Email (unique)
- `customer_phone` - Phone number (nullable)
- `street` - Street address (nullable)
- `city` - City (nullable)
- `phone` - Phone (nullable)
- `isAdmin` - Admin flag (nullable)
- `password` - **NEW** - Bcryptjs hashed password (nullable)

## Using Authentication in Components

### In Client Components

Use the `useAuth` hook:

```tsx
'use client'

import { useAuth } from '@/lib/auth-context'

export function MyComponent() {
  const { customer, isSignedIn, signOut } = useAuth()

  if (isSignedIn) {
    return <p>Welcome, {customer?.customer_name}!</p>
  }

  return <p>Please sign in</p>
}
```

### Accessing Toast Notifications

Toast notifications are automatically shown for:
- **Successful sign in**: "Welcome back, [Name]!"
- **Failed sign in**: Shows error message
- **Successful sign up**: "Welcome, [Name]!"
- **Failed sign up**: Shows error message
- **Successful logout**: "You have been successfully logged out."

## Password Requirements

- Minimum 6 characters
- No special format requirements (customize as needed)

## Security Features

1. **HTTP-only Cookies**: Auth tokens cannot be accessed via JavaScript
2. **Password Hashing**: Uses bcryptjs with 10 rounds
3. **Email Uniqueness**: Prevents duplicate registrations
4. **Session Expiry**: Cookies expire after 7 days
5. **Secure Cookie**: Only transmitted over HTTPS in production

## Troubleshooting

### "Email already registered"
- Email is already in the database
- User should sign in or use a different email

### "Invalid email or password"
- Email doesn't exist or password is wrong
- Check spelling and try again

### User not staying logged in
- Check that cookies are enabled in browser
- Verify password field exists in customer table
- Check browser console for errors

### Toast notifications not appearing
- Make sure AuthProvider wraps your app in layout
- Check that toaster component is in layout

### No avatar appearing after login
- Ensure customer_name is not null
- Refresh the page

## Customization

### Change Password Requirements

Edit `app/api/auth/signup/route.ts`:

```typescript
if (password.length < 8) {  // Change minimum length
  return NextResponse.json(
    { error: 'Password must be at least 8 characters' },
    { status: 400 }
  )
}
```

### Change Session Duration

Edit `app/api/auth/signin/route.ts` and `app/api/auth/signup/route.ts`:

```typescript
maxAge: 60 * 60 * 24 * 30, // 30 days instead of 7
```

### Add More Menu Items to Dropdown

Edit `components/auth-buttons.tsx` to add more options:

```tsx
<DropdownMenuContent align="end">
  <DropdownMenuItem asChild>
    <a href="/profile">Profile</a>
  </DropdownMenuItem>
  <DropdownMenuItem asChild>
    <a href="/orders">My Orders</a>
  </DropdownMenuItem>
  <DropdownMenuItem onClick={signOut} className="text-red-600">
    Log Out
  </DropdownMenuItem>
</DropdownMenuContent>
```

### Customize Avatar Color

Edit `components/auth-buttons.tsx`:

```tsx
<button className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center ...">
  {/* Change bg-blue-500 to any color */}
</button>
```

## Database Migration for Existing Customers

If you have existing customers without passwords, you can:

1. Set temporary passwords via SQL:
   ```sql
   UPDATE public.customer 
   SET password = '$2a$10$temporary_hash_here' 
   WHERE password IS NULL;
   ```

2. Or require them to reset password on next login

## Next Steps

1. Run the SQL migration in Supabase
2. Test sign up with a new account
3. Test sign in and verify toast notifications
4. Test logout and verify success message
5. Implement additional features as needed

## File Locations

- **Components**: `components/auth-buttons.tsx`, `components/forms/sign-in-form.tsx`, `components/forms/sign-up-form.tsx`
- **Context**: `lib/auth-context.tsx`
- **API Routes**: `app/api/auth/`
- **Migration**: `scripts/004_create_auth_table.sql`

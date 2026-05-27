// Core Product type matching the database schema
export interface Product {
  product_id: number
  product_name: string
  description: string | null
  photo_url: string | null
  price: number
}

// Product with supplier information
export interface ProductWithSupplier extends Product {
  suppliers?: Supplier[]
}

// Inventory tracking
export interface Inventory {
  inventory_id: number
  product_id: number
  quantity: number | null
  reorder_level: number | null
  last_update: string | null
}

// Stock movement tracking
export interface StockMovement {
  movement_id: number
  inventory_id: number
  movement_date: string
  quantity_change: number | null
  movement_type: string | null
  reference_id: string | null
}

// Supplier information
export interface Supplier {
  suplier_id: number
  supplier_name: string
  contact_name: string | null
  supplier_email: string | null
  supplier_phone: string | null
}

// Product-Supplier junction
export interface ProductSupplier {
  product_id: number
  supplier_id: number
  supply_price: number | null
  lead_time_days: number | null
}

// Customer information
export interface Customer {
  customer_id: number
  customer_name: string
  customer_email: string
  customer_phone: string | null
  street: string | null
  city: string | null
  phone: string | null
  isAdmin: boolean | null
  password?: string
}

// Order information
export interface Order {
  order_id: number
  cutomer_id: number
  order_date: string
  status: string | null
  total_amount: number
}

// Order item
export interface OrderItem {
  order_id: number
  product_id: number
  quantity: number
  price: number
}

// Order with related data
export interface OrderWithItems extends Order {
  order_item?: OrderItem[]
  customer?: Customer
}

// Payment information
export interface Payment {
  payment_id: number
  order_id: number
  date_time: string
  method: string | null
  amount: number | null
  payment_status: string | null
}

// Shipment information
export interface Shipment {
  shipment_id: number
  date_time: string
  delivery_date: string | null
  shipment_status: string | null
  tracking_number: string | null
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[]
  count: number
  hasMore: boolean
}

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

// New Customer type (UUID-based)
export interface CustomerNew {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  street_address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  created_at: string
  updated_at: string
}

// Order type (UUID-based)
export interface OrderNew {
  id: string
  customer_id: string
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  payment_status: 'unpaid' | 'paid' | 'failed'
  payment_method?: string
  payment_gateway_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

// Order Item type
export interface OrderItemNew {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
}

// Order with items and customer
export interface OrderWithDetails extends OrderNew {
  customer?: CustomerNew
  items?: OrderItemNew[]
}

// Payment type
export interface PaymentNew {
  id: string
  order_id: string
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: string
  payment_gateway_id?: string
  gateway_response?: Record<string, any>
  created_at: string
  updated_at: string
}

// Cart item for checkout
export interface CartItem {
  product_id: string
  product_name: string
  price: number
  quantity: number
  photo_url?: string
}

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

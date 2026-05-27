/**
 * Supabase Query Helpers
 * Database schema-aware query builders for the e-commerce system
 */

import { createClient } from './server'
import type { 
  Product, 
  Customer, 
  Order, 
  OrderItem,
  Payment,
  Shipment,
  Inventory,
  Supplier,
  ProductSupplier,
  StockMovement,
  CustomerNew,
  OrderNew,
  OrderItemNew,
  PaymentNew,
  OrderWithDetails
} from '@/lib/types'

/**
 * PRODUCT QUERIES
 */

/**
 * Fetch all products with optional sorting and pagination
 * @param sort - Sort option (name-asc, name-desc, price-asc, price-desc)
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of items per page (default: 12)
 * @returns Array of products
 */
export async function getProducts(
  sort: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' = 'name-asc',
  page: number = 1,
  pageSize: number = 12
): Promise<Product[]> {
  const supabase = await createClient()
  const offset = (page - 1) * pageSize

  let query = supabase
    .from('product')
    .select('product_id, product_name, description, photo_url, price', { count: 'exact' })

  // Apply sorting
  switch (sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true })
      break
    case 'price-desc':
      query = query.order('price', { ascending: false })
      break
    case 'name-asc':
      query = query.order('product_name', { ascending: true })
      break
    case 'name-desc':
      query = query.order('product_name', { ascending: false })
      break
  }

  // Apply pagination
  query = query.range(offset, offset + pageSize - 1)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error.message)
    return []
  }

  return (data as Product[]) || []
}

/**
 * Fetch a single product by ID
 * @param productId - Product ID
 * @returns Product or null
 */
export async function getProductById(productId: number): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('product')
    .select('product_id, product_name, description, photo_url, price')
    .eq('product_id', productId)
    .single()

  if (error) {
    console.error('Error fetching product:', error.message)
    return null
  }

  return data as Product
}

/**
 * Search products by name
 * @param searchTerm - Search term to match against product_name
 * @param limit - Max number of results (default: 10)
 * @returns Array of matching products
 */
export async function searchProducts(
  searchTerm: string,
  limit: number = 10
): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('product')
    .select('product_id, product_name, description, photo_url, price')
    .ilike('product_name', `%${searchTerm}%`)
    .limit(limit)

  if (error) {
    console.error('Error searching products:', error.message)
    return []
  }

  return (data as Product[]) || []
}

/**
 * INVENTORY QUERIES
 */

/**
 * Get all inventory items with product information
 * @returns Array of inventory items with product details
 */
export async function getAllInventory() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('inventory')
    .select(
      `
      inventory_id,
      product_id,
      quantity,
      reorder_level,
      last_update,
      product:product_id (product_id, product_name, price)
      `
    )
    .order('product_id', { ascending: true })

  if (error) {
    console.error('Error fetching all inventory:', error.message)
    return []
  }

  return data || []
}

/**
 * Get inventory information for a product
 * @param productId - Product ID
 * @returns Inventory data or null
 */
export async function getProductInventory(productId: number): Promise<Inventory | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('inventory')
    .select('inventory_id, product_id, quantity, reorder_level, last_update')
    .eq('product_id', productId)
    .single()

  if (error) {
    console.error('Error fetching inventory:', error.message)
    return null
  }

  return data as Inventory
}

/**
 * CUSTOMER QUERIES
 */

/**
 * Get customer by ID
 * @param customerId - Customer ID
 * @returns Customer data or null
 */
export async function getCustomerById(customerId: number): Promise<Customer | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customer')
    .select('customer_id, customer_name, customer_email, customer_phone, street, city, phone')
    .eq('customer_id', customerId)
    .single()

  if (error) {
    console.error('Error fetching customer:', error.message)
    return null
  }

  return data as Customer
}

/**
 * Get customer by email
 * @param email - Customer email
 * @returns Customer data or null
 */
export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customer')
    .select('customer_id, customer_name, customer_email, customer_phone, street, city, phone')
    .eq('customer_email', email)
    .single()

  if (error) {
    console.error('Error fetching customer:', error.message)
    return null
  }

  return data as Customer
}

/**
 * ORDER QUERIES
 */

/**
 * Get order with related items and customer info
 * @param orderId - Order ID
 * @returns Order with items and customer data
 */
export async function getOrderWithDetails(orderId: number) {
  const supabase = await createClient()

  const { data: orderData, error: orderError } = await supabase
    .from('order')
    .select(
      `
      order_id,
      cutomer_id,
      order_date,
      status,
      total_amount,
      customer:cutomer_id (customer_id, customer_name, customer_email, customer_phone),
      order_item (order_id, product_id, quantity, price)
      `
    )
    .eq('order_id', orderId)
    .single()

  if (orderError) {
    console.error('Error fetching order:', orderError.message)
    return null
  }

  return orderData
}

/**
 * Get customer orders
 * @param customerId - Customer ID
 * @param limit - Max number of orders (default: 10)
 * @returns Array of orders
 */
export async function getCustomerOrders(customerId: number, limit: number = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('order')
    .select('order_id, cutomer_id, order_date, status, total_amount')
    .eq('cutomer_id', customerId)
    .order('order_date', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching customer orders:', error.message)
    return []
  }

  return data as Order[]
}

/**
 * PAYMENT QUERIES
 */

/**
 * Get payment information for an order
 * @param orderId - Order ID
 * @returns Payment data or null
 */
export async function getOrderPayment(orderId: number): Promise<Payment | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('payment')
    .select('payment_id, order_id, date_time, method, amount, payment_status')
    .eq('order_id', orderId)
    .single()

  if (error) {
    console.error('Error fetching payment:', error.message)
    return null
  }

  return data as Payment
}

/**
 * SUPPLIER QUERIES
 */

/**
 * Get suppliers for a product
 * @param productId - Product ID
 * @returns Array of suppliers with supply info
 */
export async function getProductSuppliers(productId: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('product_supplier')
    .select(
      `
      product_id,
      supplier_id,
      supply_price,
      lead_time_days,
      supplier:supplier_id (suplier_id, supplier_name, supplier_email, supplier_phone)
      `
    )
    .eq('product_id', productId)

  if (error) {
    console.error('Error fetching product suppliers:', error.message)
    return []
  }

  return data
}

/**
 * NEW QUERIES - UUID-based customers, orders, and payments
 */

/**
 * Get all orders with customer details
 * @param limit - Maximum number of orders to fetch
 * @param offset - Offset for pagination
 * @returns Array of orders with customer details
 */
export async function getAllOrders(limit: number = 50, offset: number = 0): Promise<OrderWithDetails[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      id,
      customer_id,
      order_number,
      status,
      total_amount,
      payment_status,
      payment_method,
      payment_gateway_id,
      notes,
      created_at,
      updated_at,
      customer:customer_id (
        id,
        first_name,
        last_name,
        email,
        phone,
        street_address,
        city,
        state,
        zip_code,
        country,
        created_at,
        updated_at
      ),
      order_items (
        id,
        order_id,
        product_id,
        quantity,
        price,
        created_at
      )
      `
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching orders:', error.message)
    return []
  }

  return (data as any[]).map((order) => ({
    ...order,
    customer: order.customer,
    items: order.order_items,
  })) || []
}

/**
 * Get order by ID with full details
 * @param orderId - Order ID
 * @returns Order with details or null
 */
export async function getOrderById(orderId: string): Promise<OrderWithDetails | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      id,
      customer_id,
      order_number,
      status,
      total_amount,
      payment_status,
      payment_method,
      payment_gateway_id,
      notes,
      created_at,
      updated_at,
      customer:customer_id (
        id,
        first_name,
        last_name,
        email,
        phone,
        street_address,
        city,
        state,
        zip_code,
        country,
        created_at,
        updated_at
      ),
      order_items (
        id,
        order_id,
        product_id,
        quantity,
        price,
        created_at
      )
      `
    )
    .eq('id', orderId)
    .single()

  if (error) {
    console.error('Error fetching order:', error.message)
    return null
  }

  return {
    ...data,
    customer: data.customer as any,
    items: data.order_items as any,
  } as OrderWithDetails
}

/**
 * Get customer by email
 * @param email - Customer email
 * @returns Customer or null
 */
export async function getCustomerByEmailNew(email: string): Promise<CustomerNew | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching customer:', error.message)
    return null
  }

  return data as CustomerNew
}

/**
 * Get customer by ID
 * @param customerId - Customer ID
 * @returns Customer or null
 */
export async function getCustomerByIdNew(customerId: string): Promise<CustomerNew | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single()

  if (error) {
    console.error('Error fetching customer:', error.message)
    return null
  }

  return data as CustomerNew
}

/**
 * Get all payments for an order
 * @param orderId - Order ID
 * @returns Array of payments
 */
export async function getOrderPayments(orderId: string): Promise<PaymentNew[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching payments:', error.message)
    return []
  }

  return (data as PaymentNew[]) || []
}

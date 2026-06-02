'use server'

import { createClient } from '@/lib/supabase/server'
import type { CustomerNew, OrderNew, OrderStatus, PaymentNew } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

/**
 * Create a new customer
 */
export async function createCustomer(customerData: {
  customer_name: string
  customer_email: string
  customer_phone?: string
  street?: string
  city?: string
}): Promise<{ success: boolean; customer?: CustomerNew; error?: string }> {
  try {
    const supabase = await createClient()

    // Check if customer already exists
    const { data: existingCustomer } = await supabase
      .from('customer')
      .select('*')
      .eq('customer_email', customerData.customer_email)
      .single()

    if (existingCustomer) {
      return {
        success: true,
        customer: existingCustomer as unknown as CustomerNew,
      }
    }

    // Create new customer (customer_id will be auto-incremented by database)
    const { data, error } = await supabase
      .from('customer')
      .insert([
        {
          customer_name: customerData.customer_name,
          customer_email: customerData.customer_email,
          customer_phone: customerData.customer_phone,
          street: customerData.street,
          city: customerData.city,
        },
      ])
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      customer: data as CustomerNew,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Create a new order with items
 */
export async function createOrder(orderData: {
  customer_id: string
  items: Array<{
    product_id: string
    quantity: number
    price: number
  }>
  total_amount: number
  payment_method?: string
  notes?: string
}): Promise<{ success: boolean; order?: OrderNew; error?: string }> {
  try {
    const supabase = await createClient()

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order
    const { data: orderData_result, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          id: uuidv4(),
          customer_id: orderData.customer_id,
          order_number: orderNumber,
          status: 'pending',
          total_amount: orderData.total_amount,
          payment_status: 'unpaid',
          payment_method: orderData.payment_method,
          notes: orderData.notes,
        },
      ])
      .select()
      .single()

    if (orderError) {
      return {
        success: false,
        error: orderError.message,
      }
    }

    const order = orderData_result as unknown as OrderNew

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      id: uuidv4(),
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      // Delete the order if items creation fails
      await supabase.from('orders').delete().eq('id', order.id)
      return {
        success: false,
        error: `Failed to create order items: ${itemsError.message}`,
      }
    }

    return {
      success: true,
      order,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Create a payment record
 */
export async function createPayment(paymentData: {
  order_id: string
  amount: number
  payment_method: string
  payment_gateway_id?: string
  gateway_response?: Record<string, any>
}): Promise<{ success: boolean; payment?: PaymentNew; error?: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          id: uuidv4(),
          ...paymentData,
          status: 'completed',
        },
      ])
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    // Update order payment status
    await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
      })
      .eq('id', paymentData.order_id)

    return {
      success: true,
      payment: data as PaymentNew,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

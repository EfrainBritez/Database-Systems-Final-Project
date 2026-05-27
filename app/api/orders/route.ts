import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/app/admin/order-actions'
import { getAllOrders } from '@/lib/supabase/queries'

/**
 * GET /api/orders
 * Get all orders with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const orders = await getAllOrders(limit, offset)

    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/orders
 * Create a new order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { customer_id, items, total_amount, payment_method, notes } = body

    if (!customer_id || !items || items.length === 0 || !total_amount) {
      return NextResponse.json(
        { error: 'Missing required fields: customer_id, items (non-empty array), total_amount' },
        { status: 400 }
      )
    }

    const result = await createOrder({
      customer_id,
      items,
      total_amount,
      payment_method,
      notes,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

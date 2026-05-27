import { NextRequest, NextResponse } from 'next/server'
import { createPayment } from '@/app/admin/order-actions'

/**
 * POST /api/payments
 * Create a new payment record
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { order_id, amount, payment_method, payment_gateway_id, gateway_response } = body

    if (!order_id || !amount || !payment_method) {
      return NextResponse.json(
        { error: 'Missing required fields: order_id, amount, payment_method' },
        { status: 400 }
      )
    }

    const result = await createPayment({
      order_id,
      amount,
      payment_method,
      payment_gateway_id,
      gateway_response,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.payment, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createCustomer } from '@/app/admin/order-actions'

/**
 * POST /api/customers
 * Create a new customer
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { customer_name, customer_email, customer_phone, street, city } = body

    if (!customer_name || !customer_email) {
      return NextResponse.json(
        { error: 'Missing required fields: customer_name, customer_email' },
        { status: 400 }
      )
    }

    const result = await createCustomer({
      customer_name,
      customer_email,
      customer_phone,
      street,
      city,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.customer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}

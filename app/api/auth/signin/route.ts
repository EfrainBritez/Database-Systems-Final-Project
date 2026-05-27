import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Customer } from '@/lib/types'
import bcryptjs from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('SignIn attempt:', { email, hasPassword: !!password })

    if (!email || !password) {
      console.log('Missing credentials')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get customer by email - select all fields
    const { data: customers, error } = await supabase
      .from('customer')
      .select()
      .eq('customer_email', email)
      .limit(1)

    console.log('Query result:', { error, customerCount: customers?.length })

    if (error) {
      console.error('Database query error:', error)
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 400 }
      )
    }

    if (!customers || customers.length === 0) {
      console.log('Customer not found for email:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const customer = customers[0]
    console.log('Customer found:', { id: customer.customer_id, email: customer.customer_email, name: customer.customer_name })

    // Check if password field exists
    if (!customer.password) {
      console.log('No password set for customer')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const passwordMatch = await bcryptjs.compare(password, customer.password)
    console.log('Password match result:', passwordMatch)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Remove password from response
    const { password: _, ...customerWithoutPassword } = customer

    // Create response with auth cookie
    const response = NextResponse.json(customerWithoutPassword)
    response.cookies.set('auth_customer', JSON.stringify(customerWithoutPassword), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log('Sign in successful')
    return response
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
  

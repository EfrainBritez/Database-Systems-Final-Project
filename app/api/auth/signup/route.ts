import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Customer } from '@/lib/types'
import bcryptjs from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    console.log('SignUp attempt:', { name, email, hasPassword: !!password })

    if (!name || !email || !password) {
      console.log('Missing required fields')
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if email already exists
    const { data: existingCustomers, error: checkError } = await supabase
      .from('customer')
      .select('customer_id')
      .eq('customer_email', email)
      .limit(1)

    if (checkError) {
      console.error('Check email error:', checkError)
      return NextResponse.json(
        { error: 'Database error: ' + checkError.message },
        { status: 400 }
      )
    }

    if (existingCustomers && existingCustomers.length > 0) {
      console.log('Email already exists:', email)
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Create new customer with password
    const { data: newCustomer, error: insertError } = await supabase
      .from('customer')
      .insert({
        customer_name: name,
        customer_email: email,
        password: hashedPassword,
        isAdmin: false,
      })
      .select()
      .single()

    if (insertError || !newCustomer) {
      console.error('Customer insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create customer: ' + (insertError?.message || 'Unknown error') },
        { status: 400 }
      )
    }

    console.log('Customer created:', { id: newCustomer.customer_id, name: newCustomer.customer_name, email: newCustomer.customer_email })

    // Remove password from response before sending
    const { password: _pwd, ...customerWithoutPassword } = newCustomer

    // Create response with auth cookie
    const response = NextResponse.json(customerWithoutPassword)
    response.cookies.set('auth_customer', JSON.stringify(customerWithoutPassword), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log('Sign up successful')
    return response
  } catch (error) {
    console.error('Sign up error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

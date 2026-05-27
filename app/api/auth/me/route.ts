import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('auth_customer')

    if (!authCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const customer = JSON.parse(authCookie.value)
    return NextResponse.json(customer)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid auth token' }, { status: 401 })
  }
}

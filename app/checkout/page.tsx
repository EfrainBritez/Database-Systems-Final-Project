'use client'

import { useCart } from '@/lib/cart-context'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate order processing
    setTimeout(() => {
      setOrderPlaced(true)
      clearCart()
      setIsProcessing(false)
    }, 2000)
  }

  if (orderPlaced) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="py-12 text-center">
            <div className="mb-4 text-4xl">✓</div>
            <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Shipping Address</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="cardExpiry"
                    placeholder="MM/YY"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    required
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    name="cardCVC"
                    placeholder="CVC"
                    value={formData.cardCVC}
                    onChange={handleChange}
                    required
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between text-sm">
                    <span>
                      {item.product_name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${(totalPrice * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link href="/cart">Back to Cart</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

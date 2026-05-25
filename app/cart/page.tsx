'use client'

import { useCart } from '@/lib/cart-context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
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
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.cartItemId}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                    {item.photo_url ? (
                      <img
                        src={item.photo_url}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.product_name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity - 1)
                          }
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} each
                        </p>
                        <p className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded text-red-500 flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
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

              <div className="space-y-2 pt-4">
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">Continue Shopping</Link>
                </Button>
                <button
                  onClick={clearCart}
                  className="w-full text-sm text-red-500 hover:text-red-700 py-2"
                >
                  Clear Cart
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

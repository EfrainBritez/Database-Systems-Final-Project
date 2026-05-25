'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Product } from '@/lib/types'

export interface CartItem extends Product {
  cartItemId: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
      }
    }
    setMounted(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product_id === product.product_id
      )

      if (existingItem) {
        return prevItems.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [
        ...prevItems,
        {
          ...product,
          cartItemId: `${product.product_id}-${Date.now()}`,
          quantity,
        },
      ]
    })
  }

  const removeItem = (cartItemId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.cartItemId !== cartItemId)
    )
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

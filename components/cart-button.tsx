'use client'

import { useCart } from '@/lib/cart-context'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function CartButton() {
  const { totalItems } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Link href="/cart">
      <button className="relative flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <ShoppingCart className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>
    </Link>
  )
}

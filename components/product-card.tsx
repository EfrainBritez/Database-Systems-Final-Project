'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/types"
import { ShoppingCart } from 'lucide-react'
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product, 1)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden rounded-t-lg">
          {product.photo_url ? (
            <img
              src={product.photo_url}
              alt={product.product_name}
              className="object-cover w-full h-full hover:scale-105 transition-transform"
            />
          ) : (
            <div className="text-muted-foreground text-sm">No image</div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">{product.product_name}</h3>
          <span className="font-bold text-primary whitespace-nowrap text-lg">
            ${product.price.toFixed(2)}
          </span>
        </div>
        {product.description && (
          <p className="text-muted-foreground text-sm line-clamp-3 flex-1">
            {product.description}
          </p>
        )}
        <button
          onClick={handleAddToCart}
          className={`mt-4 w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
            isAdded
              ? 'bg-green-500 text-white'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {isAdded ? 'Added to Cart!' : 'Add to Cart'}
        </button>
      </CardContent>
    </Card>
  )
}

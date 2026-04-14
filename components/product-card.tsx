import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const tags = product.product_tags?.map(pt => pt.tags) || []
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden rounded-t-lg">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="text-muted-foreground text-sm">No image</div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
          <span className="font-bold text-primary whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>
        {product.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {product.description}
          </p>
        )}
        {product.categories && (
          <Badge variant="secondary" className="mb-2">
            {product.categories.name}
          </Badge>
        )}
      </CardContent>
      {tags.length > 0 && (
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-1">
          {tags.map(tag => (
            <Badge key={tag.id} variant="outline" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  )
}

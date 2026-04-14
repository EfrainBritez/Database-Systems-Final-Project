"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deleteProduct } from "@/app/admin/actions"
import type { Product } from "@/lib/types"

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [isPending, startTransition] = useTransition()
  
  function handleDelete(productId: string, productName: string) {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
      return
    }
    
    startTransition(async () => {
      const result = await deleteProduct(productId)
      if (result.error) {
        alert(`Error: ${result.error}`)
      }
    })
  }
  
  if (products.length === 0) {
    return <p className="text-muted-foreground">No products yet. Create your first product above.</p>
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(product => {
            const tags = product.product_tags?.map(pt => pt.tags) || []
            return (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  {product.categories ? (
                    <Badge variant="secondary">{product.categories.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {tags.length > 0 ? (
                      tags.map(tag => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={isPending}
                  >
                    {isPending ? <Spinner /> : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

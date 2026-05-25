"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
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
  
  function handleDelete(productId: number, productName: string) {
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
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(product => (
            <TableRow key={product.product_id}>
              <TableCell className="font-medium">{product.product_name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell className="text-sm text-muted-foreground line-clamp-2">
                {product.description || "-"}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.product_id, product.product_name)}
                  disabled={isPending}
                >
                  {isPending ? <Spinner /> : "Delete"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

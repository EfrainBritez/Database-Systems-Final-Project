"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import type { Inventory } from "@/lib/types"

interface InventoryWithProduct extends Inventory {
  product?: {
    product_id: number
    product_name: string
    price: number
  }
}

interface InventoryTableProps {
  inventory: InventoryWithProduct[]
}

export function InventoryTable({ inventory }: InventoryTableProps) {
  if (inventory.length === 0) {
    return <p className="text-muted-foreground">No inventory items found.</p>
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const isStaleUpdate = (dateString: string | null) => {
    if (!dateString) return false
    try {
      const lastUpdate = new Date(dateString)
      const today = new Date()
      const daysDifference = Math.floor(
        (today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
      )
      return daysDifference > 15
    } catch {
      return false
    }
  }

  const getStatusBadge = (quantity: number | null, reorderLevel: number | null) => {
    if (quantity === null) return <Badge variant="outline">No Data</Badge>
    if (reorderLevel === null) return <Badge variant="secondary">Normal</Badge>

    if (quantity <= reorderLevel) {
      return <Badge variant="destructive">Low Stock</Badge>
    }
    return <Badge variant="secondary">In Stock</Badge>
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Reorder Level</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.inventory_id}>
              <TableCell className="font-medium">{item.product_id}</TableCell>
              <TableCell>{item.product?.product_name || "-"}</TableCell>
              <TableCell className="text-right font-semibold">
                {item.quantity ?? "-"}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {item.reorder_level ?? "-"}
              </TableCell>
              <TableCell className="text-center">
                {getStatusBadge(item.quantity ?? null, item.reorder_level ?? null)}
              </TableCell>
              <TableCell className="text-sm">
                <div className="flex items-center gap-2">
                  <span>{formatDate(item.last_update)}</span>
                  {isStaleUpdate(item.last_update) && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Stale
                    </Badge>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

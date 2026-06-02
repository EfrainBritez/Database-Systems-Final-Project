"use client"

import { useState, useTransition } from "react"
import { updateInventory } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
  const [isPending, startTransition] = useTransition()
  const [drafts, setDrafts] = useState(() =>
    Object.fromEntries(
      inventory.map((item) => [
        item.inventory_id,
        {
          quantity: String(item.quantity ?? 0),
          reorderLevel: item.reorder_level === null ? "" : String(item.reorder_level),
        },
      ])
    )
  )

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

  const updateDraft = (
    inventoryId: number,
    key: "quantity" | "reorderLevel",
    value: string
  ) => {
    setDrafts((current) => ({
      ...current,
      [inventoryId]: {
        ...current[inventoryId],
        [key]: value,
      },
    }))
  }

  const handleUpdate = (item: InventoryWithProduct) => {
    const draft = drafts[item.inventory_id]
    const quantity = Number.parseInt(draft.quantity, 10)
    const reorderLevel =
      draft.reorderLevel === "" ? undefined : Number.parseInt(draft.reorderLevel, 10)

    if (Number.isNaN(quantity) || quantity < 0) {
      alert("Quantity must be zero or greater.")
      return
    }

    if (reorderLevel !== undefined && (Number.isNaN(reorderLevel) || reorderLevel < 0)) {
      alert("Reorder level must be zero or greater.")
      return
    }

    startTransition(async () => {
      const result = await updateInventory(item.product_id, quantity, reorderLevel)

      if (result.error) {
        alert(`Error: ${result.error}`)
      } else {
        alert("Inventory updated successfully!")
        window.location.reload()
      }
    })
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
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => {
            const draft = drafts[item.inventory_id]

            return (
              <TableRow key={item.inventory_id}>
                <TableCell className="font-medium">{item.product_id}</TableCell>
                <TableCell>{item.product?.product_name || "-"}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={draft.quantity}
                    onChange={(event) =>
                      updateDraft(item.inventory_id, "quantity", event.target.value)
                    }
                    className="ml-auto w-24 text-right font-semibold"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={draft.reorderLevel}
                    onChange={(event) =>
                      updateDraft(item.inventory_id, "reorderLevel", event.target.value)
                    }
                    className="ml-auto w-24 text-right"
                  />
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
                <TableCell>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleUpdate(item)}
                    disabled={isPending}
                  >
                    {isPending ? <Spinner /> : "Update"}
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

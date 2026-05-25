import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InventoryTable } from "@/components/admin/inventory-table"
import type { Inventory } from "@/lib/types"

interface InventoryWithProduct extends Inventory {
  product?: {
    product_id: number
    product_name: string
    price: number
  }
}

async function getInventoryData() {
  const supabase = await createClient()

  const { data: inventoryData, error } = await supabase
    .from("inventory")
    .select(
      `
      inventory_id,
      product_id,
      quantity,
      reorder_level,
      last_update,
      product:product_id (product_id, product_name, price)
    `
    )
    .order("product_id", { ascending: true })

  if (error) {
    console.error("Error fetching inventory:", error)
    return []
  }

  return (inventoryData || []) as InventoryWithProduct[]
}

export default async function InventoryPage() {
  const inventory = await getInventoryData()

  const lowStockCount = inventory.filter(
    (item) => item.quantity !== null && item.reorder_level !== null && item.quantity <= item.reorder_level
  ).length

  const totalItems = inventory.reduce((sum, item) => sum + (item.quantity ?? 0), 0)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Inventory Management</h1>
            <p className="text-sm text-muted-foreground">Track stock levels and reorder points</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground mt-1">Total quantity in stock</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{lowStockCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Items below reorder level</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tracked Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{inventory.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total products in inventory</p>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Details</CardTitle>
            <CardDescription>View quantity, reorder levels, and last update times</CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryTable inventory={inventory} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

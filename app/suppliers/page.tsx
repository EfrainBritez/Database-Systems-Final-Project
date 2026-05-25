import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { SupplierGrid } from "@/components/supplier-grid"
import type { Supplier } from "@/lib/types"

async function getSuppliers(): Promise<Supplier[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("supplier")
    .select(
      `
      suplier_id,
      supplier_name,
      contact_name,
      supplier_email,
      supplier_phone
    `
    )
    .order("supplier_name", { ascending: true })

  if (error) {
    console.error("Error fetching suppliers:", error)
    return []
  }

  return (data as Supplier[]) || []
}

export default async function SuppliersPage() {
  const suppliers = await getSuppliers()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Our Suppliers</h1>
          <p className="text-muted-foreground mt-1">
            Browse our network of {suppliers.length} trusted suppliers
          </p>
        </div>

        {suppliers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No suppliers available at this time.
          </div>
        ) : (
          <SupplierGrid suppliers={suppliers} />
        )}
      </main>
    </div>
  )
}

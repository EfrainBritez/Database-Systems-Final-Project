import { SupplierCard } from "@/components/supplier-card"
import type { Supplier } from "@/lib/types"

interface SupplierGridProps {
  suppliers: Supplier[]
}

export function SupplierGrid({ suppliers }: SupplierGridProps) {
  if (suppliers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No suppliers found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {suppliers.map(supplier => (
        <SupplierCard key={supplier.suplier_id} supplier={supplier} />
      ))}
    </div>
  )
}

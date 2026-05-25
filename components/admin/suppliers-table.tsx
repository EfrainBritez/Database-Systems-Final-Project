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
import { deleteSupplier } from "@/app/admin/actions"
import type { Supplier } from "@/lib/types"

interface SuppliersTableProps {
  suppliers: Supplier[]
}

export function SuppliersTable({ suppliers }: SuppliersTableProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete(supplierId: number, supplierName: string) {
    if (
      !confirm(
        `Are you sure you want to delete "${supplierName}"? Products linked to this supplier will not be affected.`
      )
    ) {
      return
    }

    startTransition(async () => {
      const result = await deleteSupplier(supplierId)
      if (result.error) {
        alert(`Error: ${result.error}`)
      } else {
        alert("Supplier deleted successfully!")
      }
    })
  }

  if (suppliers.length === 0) {
    return (
      <p className="text-muted-foreground">
        No suppliers yet. Create your first supplier above.
      </p>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map(supplier => (
            <TableRow key={supplier.suplier_id}>
              <TableCell className="font-medium">
                {supplier.supplier_name}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {supplier.contact_name || "-"}
              </TableCell>
              <TableCell className="text-sm">
                {supplier.supplier_email ? (
                  <a
                    href={`mailto:${supplier.supplier_email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {supplier.supplier_email}
                  </a>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {supplier.supplier_phone ? (
                  <a
                    href={`tel:${supplier.supplier_phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {supplier.supplier_phone}
                  </a>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    handleDelete(supplier.suplier_id, supplier.supplier_name)
                  }
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

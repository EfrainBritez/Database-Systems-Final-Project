import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, User } from "lucide-react"
import type { Supplier } from "@/lib/types"

interface SupplierCardProps {
  supplier: Supplier
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <h3 className="font-bold text-lg line-clamp-2">{supplier.supplier_name}</h3>
        <Badge variant="secondary" className="w-fit">
          Supplier
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {supplier.contact_name && (
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium">Contact</p>
              <p className="text-sm text-muted-foreground break-words">
                {supplier.contact_name}
              </p>
            </div>
          </div>
        )}

        {supplier.supplier_email && (
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium">Email</p>
              <a
                href={`mailto:${supplier.supplier_email}`}
                className="text-sm text-blue-600 hover:underline break-all"
              >
                {supplier.supplier_email}
              </a>
            </div>
          </div>
        )}

        {supplier.supplier_phone && (
          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium">Phone</p>
              <a
                href={`tel:${supplier.supplier_phone}`}
                className="text-sm text-blue-600 hover:underline"
              >
                {supplier.supplier_phone}
              </a>
            </div>
          </div>
        )}

        {!supplier.contact_name &&
          !supplier.supplier_email &&
          !supplier.supplier_phone && (
            <p className="text-sm text-muted-foreground">
              No contact information available.
            </p>
          )}
      </CardContent>
    </Card>
  )
}

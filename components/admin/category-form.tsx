"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function CategoryForm() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Feature Not Available</AlertTitle>
      <AlertDescription>
        Categories are not currently supported in the database schema. Products are managed directly without category grouping.
      </AlertDescription>
    </Alert>
  )
}

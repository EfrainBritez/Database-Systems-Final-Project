"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function TagForm() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Feature Not Available</AlertTitle>
      <AlertDescription>
        Tags are not currently supported in the database schema. Products are managed with their core attributes (name, description, price, image).
      </AlertDescription>
    </Alert>
  )
}

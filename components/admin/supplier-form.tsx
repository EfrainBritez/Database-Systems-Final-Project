"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { createSupplier } from "@/app/admin/actions"

export function SupplierForm() {
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createSupplier(formData)
      if (result.error) {
        alert(`Error: ${result.error}`)
      } else {
        alert("Supplier created successfully!")
        const form = document.querySelector("form") as HTMLFormElement
        form?.reset()
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="supplier_name">Supplier Name *</FieldLabel>
          <Input
            id="supplier_name"
            name="supplier_name"
            required
            placeholder="Enter supplier name"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact_name">Contact Name</FieldLabel>
          <Input
            id="contact_name"
            name="contact_name"
            placeholder="Enter contact person name"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="supplier_email">Email</FieldLabel>
          <Input
            id="supplier_email"
            name="supplier_email"
            type="email"
            placeholder="Enter supplier email"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="supplier_phone">Phone</FieldLabel>
          <Input
            id="supplier_phone"
            name="supplier_phone"
            type="tel"
            placeholder="Enter supplier phone number"
          />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Spinner className="mr-2" />
            Creating...
          </>
        ) : (
          "Create Supplier"
        )}
      </Button>
    </form>
  )
}

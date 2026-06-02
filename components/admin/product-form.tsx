"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { createProduct } from "@/app/admin/actions"

export function ProductForm() {
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createProduct(formData)
      if (result.error) {
        alert(`Error: ${result.error}`)
      } else {
        alert("Product created successfully!")
        // Reset form
        const form = document.querySelector("form") as HTMLFormElement
        form?.reset()
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="product_name">Product Name *</FieldLabel>
          <Input
            id="product_name"
            name="product_name"
            required
            placeholder="Enter product name"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter product description"
            rows={4}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="price">Price * (in cents)</FieldLabel>
          <Input
            id="price"
            name="price"
            type="number"
            step="1"
            min="0"
            required
            placeholder="0"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="inventory_quantity">Initial Inventory Amount *</FieldLabel>
          <Input
            id="inventory_quantity"
            name="inventory_quantity"
            type="number"
            step="1"
            min="0"
            required
            placeholder="0"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="reorder_level">Reorder Level</FieldLabel>
          <Input
            id="reorder_level"
            name="reorder_level"
            type="number"
            step="1"
            min="0"
            placeholder="0"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="photo">Product Image</FieldLabel>
          <Input
            id="photo"
            name="photo"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="photo_url">Image URL</FieldLabel>
          <Input
            id="photo_url"
            name="photo_url"
            type="url"
            placeholder="https://example.com/image.jpg"
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
          "Create Product"
        )}
      </Button>
    </form>
  )
}

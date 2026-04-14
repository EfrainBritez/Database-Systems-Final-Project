"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { createCategory } from "@/app/admin/actions"

export function CategoryForm() {
  const [isPending, startTransition] = useTransition()
  
  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createCategory(formData)
      if (result.error) {
        alert(`Error: ${result.error}`)
      } else {
        alert("Category created successfully!")
        window.location.reload()
      }
    })
  }
  
  return (
    <form action={handleSubmit} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="category-name">Category Name *</FieldLabel>
          <Input id="category-name" name="name" required placeholder="Enter category name" />
        </Field>
        
        <Field>
          <FieldLabel htmlFor="category-description">Description</FieldLabel>
          <Textarea id="category-description" name="description" placeholder="Enter category description" />
        </Field>
      </FieldGroup>
      
      <Button type="submit" disabled={isPending}>
        {isPending ? <><Spinner className="mr-2" />Creating...</> : "Create Category"}
      </Button>
    </form>
  )
}

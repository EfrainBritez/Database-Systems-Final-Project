"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { createTag } from "@/app/admin/actions"

export function TagForm() {
  const [isPending, startTransition] = useTransition()
  
  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createTag(formData)
      if (result.error) {
        alert(`Error: ${result.error}`)
      } else {
        alert("Tag created successfully!")
        window.location.reload()
      }
    })
  }
  
  return (
    <form action={handleSubmit} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="tag-name">Tag Name *</FieldLabel>
          <Input id="tag-name" name="name" required placeholder="Enter tag name" />
        </Field>
      </FieldGroup>
      
      <Button type="submit" disabled={isPending}>
        {isPending ? <><Spinner className="mr-2" />Creating...</> : "Create Tag"}
      </Button>
    </form>
  )
}

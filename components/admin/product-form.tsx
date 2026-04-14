"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { createProduct } from "@/app/admin/actions"
import type { Category, Tag } from "@/lib/types"

interface ProductFormProps {
  categories: Category[]
  tags: Tag[]
}

export function ProductForm({ categories, tags }: ProductFormProps) {
  const [isPending, startTransition] = useTransition()
  
  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createProduct(formData)
      if (result.error) {
        alert(`Error: ${result.error}`)
      } else {
        alert("Product created successfully!")
        // Reset form by reloading the page
        window.location.reload()
      }
    })
  }
  
  return (
    <form action={handleSubmit} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Product Name *</FieldLabel>
          <Input id="name" name="name" required placeholder="Enter product name" />
        </Field>
        
        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea id="description" name="description" placeholder="Enter product description" />
        </Field>
        
        <Field>
          <FieldLabel htmlFor="price">Price *</FieldLabel>
          <Input id="price" name="price" type="number" step="0.01" min="0" required placeholder="0.00" />
        </Field>
        
        <Field>
          <FieldLabel htmlFor="image_url">Image URL</FieldLabel>
          <Input id="image_url" name="image_url" type="url" placeholder="https://example.com/image.jpg" />
        </Field>
        
        <Field>
          <FieldLabel htmlFor="category_id">Category</FieldLabel>
          <Select name="category_id">
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        
        <Field>
          <FieldLabel>Tags</FieldLabel>
          <div className="flex flex-wrap gap-4 mt-2">
            {tags.map(tag => (
              <div key={tag.id} className="flex items-center gap-2">
                <Checkbox id={`tag-${tag.id}`} name="tag_ids" value={tag.id} />
                <Label htmlFor={`tag-${tag.id}`} className="text-sm font-normal">
                  {tag.name}
                </Label>
              </div>
            ))}
          </div>
          {tags.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">No tags available. Create some tags first.</p>
          )}
        </Field>
      </FieldGroup>
      
      <Button type="submit" disabled={isPending}>
        {isPending ? <><Spinner className="mr-2" />Creating...</> : "Create Product"}
      </Button>
    </form>
  )
}

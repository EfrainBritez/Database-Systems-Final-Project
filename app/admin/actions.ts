"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = parseFloat(formData.get("price") as string)
  const imageUrl = formData.get("image_url") as string
  const categoryId = formData.get("category_id") as string
  const tagIds = formData.getAll("tag_ids") as string[]
  
  // Insert the product
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      name,
      description: description || null,
      price,
      image_url: imageUrl || null,
      category_id: categoryId || null,
    })
    .select()
    .single()
  
  if (productError) {
    return { error: productError.message }
  }
  
  // Insert product tags if any selected
  if (tagIds.length > 0) {
    const productTags = tagIds.map(tagId => ({
      product_id: product.id,
      tag_id: tagId,
    }))
    
    const { error: tagsError } = await supabase
      .from("product_tags")
      .insert(productTags)
    
    if (tagsError) {
      return { error: tagsError.message }
    }
  }
  
  revalidatePath("/")
  revalidatePath("/admin")
  
  return { success: true, product }
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  
  const { error } = await supabase
    .from("categories")
    .insert({
      name,
      description: description || null,
    })
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath("/admin")
  
  return { success: true }
}

export async function createTag(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  
  const { error } = await supabase
    .from("tags")
    .insert({ name })
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath("/admin")
  
  return { success: true }
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath("/")
  revalidatePath("/admin")
  
  return { success: true }
}

"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

/**
 * Create a new product
 * Maps form data to the correct database schema
 */
export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const productName = formData.get("product_name") as string
  const description = formData.get("description") as string
  const price = parseFloat(formData.get("price") as string)
  const photoUrl = formData.get("photo_url") as string
  const quantityRaw = formData.get("quantity") as string | null
  const reorderLevelRaw = formData.get("reorder_level") as string | null

  if (!productName || !price) {
    return { error: "Product name and price are required" }
  }

  // Insert the product
  const { data: product, error: productError } = await supabase
    .from("product")
    .insert({
      product_name: productName,
      description: description || null,
      price: Math.round(price), // price is smallint in DB
      photo_url: photoUrl || null,
    })
    .select()
    .single()

  if (productError) {
    return { error: productError.message }
  }

  // If quantity provided, add initial inventory row linked to the new product
  const quantity = quantityRaw ? parseInt(quantityRaw, 10) : null
  const reorderLevel = reorderLevelRaw ? parseInt(reorderLevelRaw, 10) : null

  if (quantity !== null && !Number.isNaN(quantity)) {
    const invResult = await addInventory(product.product_id, quantity, reorderLevel || undefined)
    if (invResult.error) {
      return { error: invResult.error }
    }
  }

  revalidatePath("/")
  revalidatePath("/admin")

  return { success: true, product }
}

/**
 * Update an existing product
 */
export async function updateProduct(productId: number, formData: FormData) {
  const supabase = await createClient()

  const productName = formData.get("product_name") as string
  const description = formData.get("description") as string
  const price = parseFloat(formData.get("price") as string)
  const photoUrl = formData.get("photo_url") as string

  if (!productName || !price) {
    return { error: "Product name and price are required" }
  }

  const { data: product, error: updateError } = await supabase
    .from("product")
    .update({
      product_name: productName,
      description: description || null,
      price: Math.round(price),
      photo_url: photoUrl || null,
    })
    .eq("product_id", productId)
    .select()
    .single()

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath("/")
  revalidatePath("/admin")

  return { success: true, product }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: number) {
  const supabase = await createClient()

  // Cascade-delete related rows to mimic ON DELETE CASCADE behavior
  // Delete order items referencing this product (if any)
  const { error: orderItemsError } = await supabase
    .from("order_item")
    .delete()
    .eq("product_id", productId)

  if (orderItemsError) {
    return { error: orderItemsError.message }
  }

  // Delete product-supplier links
  const { error: psError } = await supabase
    .from("product_supplier")
    .delete()
    .eq("product_id", productId)

  if (psError) {
    return { error: psError.message }
  }

  // Delete inventory rows for this product
  const { error: invError } = await supabase
    .from("inventory")
    .delete()
    .eq("product_id", productId)

  if (invError) {
    return { error: invError.message }
  }

  // Finally delete the product itself
  const { error } = await supabase
    .from("product")
    .delete()
    .eq("product_id", productId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin")

  return { success: true }
}

/**
 * Add inventory for a product
 */
export async function addInventory(
  productId: number,
  quantity: number,
  reorderLevel?: number
) {
  const supabase = await createClient()

  const { data: inventory, error } = await supabase
    .from("inventory")
    .insert({
      product_id: productId,
      quantity,
      reorder_level: reorderLevel || null,
      last_update: new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")

  return { success: true, inventory }
}

/**
 * Update inventory for a product
 */
export async function updateInventory(
  productId: number,
  quantity: number,
  reorderLevel?: number
) {
  const supabase = await createClient()

  const { data: inventory, error } = await supabase
    .from("inventory")
    .update({
      quantity,
      reorder_level: reorderLevel || null,
      last_update: new Date().toISOString().split('T')[0],
    })
    .eq("product_id", productId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")

  return { success: true, inventory }
}

/**
 * Create a new supplier
 */
export async function createSupplier(formData: FormData) {
  const supabase = await createClient()

  const supplierName = formData.get("supplier_name") as string
  const contactName = formData.get("contact_name") as string
  const supplierEmail = formData.get("supplier_email") as string
  const supplierPhone = formData.get("supplier_phone") as string

  if (!supplierName) {
    return { error: "Supplier name is required" }
  }

  const { data: supplier, error } = await supabase
    .from("supplier")
    .insert({
      supplier_name: supplierName,
      contact_name: contactName || null,
      supplier_email: supplierEmail || null,
      supplier_phone: supplierPhone || null,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")

  return { success: true, supplier }
}

/**
 * Link a supplier to a product
 */
export async function linkProductSupplier(
  productId: number,
  supplierId: number,
  supplyPrice?: number,
  leadTimeDays?: number
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("product_supplier")
    .insert({
      product_id: productId,
      supplier_id: supplierId,
      supply_price: supplyPrice || null,
      lead_time_days: leadTimeDays || null,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")

  return { success: true, data }
}

/**
 * Delete a supplier
 */
export async function deleteSupplier(supplierId: number) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("supplier")
    .delete()
    .eq("suplier_id", supplierId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")
  revalidatePath("/suppliers")

  return { success: true }
}

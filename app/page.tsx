import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { ProductGrid } from "@/components/product-grid"
import { SortControls } from "@/components/sort-controls"
import type { Product, SortOption } from "@/lib/types"

interface PageProps {
  searchParams: Promise<{ sort?: SortOption; page?: string }>
}

async function getProducts(
  sort: SortOption = "name-asc",
  page: number = 1,
  pageSize: number = 12
): Promise<Product[]> {
  const supabase = await createClient()

  // Calculate offset for pagination
  const offset = (page - 1) * pageSize

  let query = supabase.from("product").select(
    `
      product_id,
      product_name,
      description,
      photo_url,
      price
    `,
    { count: "exact" }
  )

  // Apply sorting
  switch (sort) {
    case "price-asc":
      query = query.order("price", { ascending: true })
      break
    case "price-desc":
      query = query.order("price", { ascending: false })
      break
    case "name-asc":
      query = query.order("product_name", { ascending: true })
      break
    case "name-desc":
      query = query.order("product_name", { ascending: false })
      break
  }

  // Apply pagination
  query = query.range(offset, offset + pageSize - 1)

  const { data, error } = await query

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return (data as Product[]) || []
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const sort = (params.sort || "name-asc") as SortOption
  const page = parseInt(params.page || "1", 10)
  const products = await getProducts(sort, page, 12)
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Product Catalog</h1>
            <p className="text-muted-foreground mt-1">
              Browse our collection of {products.length} products
            </p>
          </div>
          <Suspense fallback={<div className="h-10 w-[180px] bg-muted animate-pulse rounded-md" />}>
            <SortControls />
          </Suspense>
        </div>
        <ProductGrid products={products} />
      </main>
    </div>
  )
}

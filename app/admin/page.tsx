import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductForm } from "@/components/admin/product-form"
import { CategoryForm } from "@/components/admin/category-form"
import { TagForm } from "@/components/admin/tag-form"
import { ProductsTable } from "@/components/admin/products-table"
import type { Product } from "@/lib/types"

async function getData() {
  const supabase = await createClient()

  // Fetch all products from the database
  const { data: products, error } = await supabase
    .from("product")
    .select(
      `
      product_id,
      product_name,
      description,
      photo_url,
      price
    `
    )
    .order("product_name", { ascending: true })

  if (error) {
    console.error("Error fetching products:", error)
    return {
      products: [] as Product[],
    }
  }

  return {
    products: (products || []) as Product[],
  }
}

export default async function AdminPage() {
  const { products } = await getData()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <Button asChild variant="outline">
            <Link href="/">Back to Store</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Create a new product to add to your catalog.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Products ({products.length})</CardTitle>
                <CardDescription>Manage your existing products.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductsTable products={products} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Categories are not available in the current database schema.</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tags" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>Tags are not available in the current database schema.</CardDescription>
              </CardHeader>
              <CardContent>
                <TagForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

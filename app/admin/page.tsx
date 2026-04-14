import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductForm } from "@/components/admin/product-form"
import { CategoryForm } from "@/components/admin/category-form"
import { TagForm } from "@/components/admin/tag-form"
import { ProductsTable } from "@/components/admin/products-table"
import type { Category, Tag, Product } from "@/lib/types"

async function getData() {
  const supabase = await createClient()
  
  const [categoriesRes, tagsRes, productsRes] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("tags").select("*").order("name"),
    supabase.from("products").select(`
      *,
      categories (*),
      product_tags (
        tags (*)
      )
    `).order("created_at", { ascending: false }),
  ])
  
  return {
    categories: (categoriesRes.data || []) as Category[],
    tags: (tagsRes.data || []) as Tag[],
    products: (productsRes.data || []) as Product[],
  }
}

export default async function AdminPage() {
  const { categories, tags, products } = await getData()
  
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
                <ProductForm categories={categories} tags={tags} />
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
                <CardTitle>Add New Category</CardTitle>
                <CardDescription>Create categories to organize your products.</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryForm />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Existing Categories ({categories.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {categories.length > 0 ? (
                  <ul className="space-y-2">
                    {categories.map(category => (
                      <li key={category.id} className="flex items-center gap-2 p-2 border rounded-md">
                        <span className="font-medium">{category.name}</span>
                        {category.description && (
                          <span className="text-muted-foreground text-sm">- {category.description}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No categories yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tags" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Tag</CardTitle>
                <CardDescription>Create tags to label your products.</CardDescription>
              </CardHeader>
              <CardContent>
                <TagForm />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Existing Tags ({tags.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span key={tag.id} className="px-3 py-1 border rounded-full text-sm">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No tags yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

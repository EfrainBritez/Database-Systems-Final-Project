import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductForm } from "@/components/admin/product-form"
import { SupplierForm } from "@/components/admin/supplier-form"
import { ProductsTable } from "@/components/admin/products-table"
import { SuppliersTable } from "@/components/admin/suppliers-table"
import type { Product, Supplier } from "@/lib/types"

async function getData() {
  const supabase = await createClient()

  // Fetch all products from the database
  const { data: products, error: productsError } = await supabase
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

  // Fetch all suppliers from the database
  const { data: suppliers, error: suppliersError } = await supabase
    .from("supplier")
    .select(
      `
      suplier_id,
      supplier_name,
      contact_name,
      supplier_email,
      supplier_phone
    `
    )
    .order("supplier_name", { ascending: true })

  if (productsError) {
    console.error("Error fetching products:", productsError)
  }

  if (suppliersError) {
    console.error("Error fetching suppliers:", suppliersError)
  }

  return {
    products: (products || []) as Product[],
    suppliers: (suppliers || []) as Supplier[],
  }
}

export default async function AdminPage() {
  const { products, suppliers } = await getData()

  return (
    <>
      <div className="hidden sm:block">
        <div className="min-h-screen bg-background">
          <header className="border-b bg-background">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link href="/admin/inventory">Inventory</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/suppliers">View Suppliers</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Back to Store</Link>
                </Button>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <Tabs defaultValue="products" className="space-y-6">
              <TabsList>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
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

              <TabsContent value="suppliers" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Supplier</CardTitle>
                    <CardDescription>Add a new supplier to your network.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SupplierForm />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>All Suppliers ({suppliers.length})</CardTitle>
                    <CardDescription>Manage your existing suppliers.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SuppliersTable suppliers={suppliers} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      <main className="block sm:hidden min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md text-center">
          <h2 className="text-lg font-semibold mb-2">Admin dashboard not available on small screens</h2>
          <p className="text-sm text-muted-foreground mb-4">Please use a tablet or desktop to access the admin dashboard for full management features.</p>
          <div className="flex justify-center gap-2">
            <Button asChild variant="outline">
              <Link href="/">Back to Store</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}

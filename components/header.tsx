import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CartButton } from "@/components/cart-button"

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          ShopSimple
        </Link>
        <nav className="flex items-center gap-4">
          <CartButton />
          <Button asChild variant="outline">
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

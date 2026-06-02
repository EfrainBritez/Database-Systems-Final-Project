"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CartButton } from "@/components/cart-button"
import { AuthButtons } from "@/components/auth-buttons"

export function Header() {
  const pathname = usePathname() || "/"

  const showAdminLink = pathname !== "/"

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          ShopSimple
        </Link>
        <nav className="flex items-center gap-4">
          <CartButton />
          {showAdminLink && (
            <Button asChild variant="outline">
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          )}
          <AuthButtons />
        </nav>
      </div>
    </header>
  )
}

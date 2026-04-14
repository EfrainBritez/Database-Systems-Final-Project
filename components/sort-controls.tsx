"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SortOption } from "@/lib/types"

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
]

export function SortControls() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = (searchParams.get("sort") as SortOption) || "name-asc"

  function handleSortChange(value: SortOption) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

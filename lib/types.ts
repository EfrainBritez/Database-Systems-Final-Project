export interface Category {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Tag {
  id: string
  name: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category_id: string | null
  created_at: string
  updated_at: string
  categories?: Category | null
  product_tags?: { tags: Tag }[]
}

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

"use client"

import { WebsiteCard } from "@/components/website-card"
import { HydrationSafe } from "@/components/hydration-safe"
import type { Category } from "@/lib/types"
import { useDataStore } from "@/lib/store"

interface CategorySectionProps {
  category: Category
  showAll?: boolean
}

export function CategorySection({ category, showAll = false }: CategorySectionProps) {
  const getWebsitesByCategory = useDataStore((state) => state.getWebsitesByCategory)
  
  return (
    <HydrationSafe>
      <CategorySectionContent category={category} showAll={showAll} getWebsitesByCategory={getWebsitesByCategory} />
    </HydrationSafe>
  )
}

function CategorySectionContent({ 
  category, 
  showAll, 
  getWebsitesByCategory 
}: CategorySectionProps & { getWebsitesByCategory: (categoryId: string) => any[] }) {
  const websites = getWebsitesByCategory(category.id)

  if (websites.length === 0) {
    return null
  }

  return (
    <section id={`category-${category.id}`} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          {category.name} ({websites.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {websites.map((website) => (
          <WebsiteCard key={website.id} website={website} />
        ))}
      </div>
    </section>
  )
}

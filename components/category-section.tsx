"use client"

import { WebsiteCard } from "@/components/website-card"
import type { Category } from "@/lib/types"
import { useHydratedStore } from "@/lib/use-hydrated-store"

interface CategorySectionProps {
  category: Category
  showAll?: boolean
}

export function CategorySection({ category, showAll = false }: CategorySectionProps) {
  const { isHydrated, websites } = useHydratedStore()
  
  // 获取该分类下的网站
  const categoryWebsites = websites.filter(website => 
    website.categoryIds.includes(category.id)
  )

  // 在hydration完成之前显示骨架屏
  if (!isHydrated) {
    return (
      <section id={`category-${category.id}`} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-7 w-40 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </section>
    )
  }

  if (categoryWebsites.length === 0) {
    return null
  }

  return (
    <section id={`category-${category.id}`} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">
          {category.name} ({categoryWebsites.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {categoryWebsites.map((website) => (
          <WebsiteCard key={website.id} website={website} />
        ))}
      </div>
    </section>
  )
}

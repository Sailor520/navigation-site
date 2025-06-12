"use client"

import { WebsiteCard } from "@/components/website-card"
import { useHydratedStore } from "@/lib/use-hydrated-store"

export function FeaturedSection() {
  const { isHydrated, websites } = useHydratedStore()

  // 获取精品网站
  const featuredWebsites = websites.filter(website => website.isFeatured)

  // 在hydration完成之前，不显示内容
  if (!isHydrated) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </section>
    )
  }

  if (featuredWebsites.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-blue-500">⭐</span>
          精品推荐 ({featuredWebsites.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {featuredWebsites.map((website) => (
          <WebsiteCard key={website.id} website={website} />
        ))}
      </div>
    </section>
  )
}

"use client"

import { WebsiteCard } from "@/components/website-card"
import { useDataStore } from "@/lib/store"
import { useState, useEffect } from "react"

export function FeaturedSection() {
  const getFeaturedWebsites = useDataStore((state) => state.getFeaturedWebsites)
  const [featuredWebsites, setFeaturedWebsites] = useState<any[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // 确保组件已挂载，避免hydration错误
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 在客户端挂载后获取数据
  useEffect(() => {
    if (isMounted) {
      setFeaturedWebsites(getFeaturedWebsites())
    }
  }, [getFeaturedWebsites, isMounted])

  // 服务器端渲染时不显示内容，避免hydration不匹配
  if (!isMounted) {
    return null
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

"use client"

import { useState, useEffect } from "react"
import { CategorySection } from "@/components/category-section"
import { FeaturedSection } from "@/components/featured-section"
import { SearchBar } from "@/components/search-bar"
import { deduplicateCategories } from "@/lib/reset-all-data"
import { useHydratedStore } from "@/lib/use-hydrated-store"
import { useSmartDataStore } from "@/lib/smart-data-store"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  // 使用 useHydratedStore 确保 SSR 安全，但也直接监听 useSmartDataStore 的变化
  const { categories: hydratedCategories, websites: hydratedWebsites, isHydrated } = useHydratedStore()
  const { categories: smartCategories, websites: smartWebsites, dataSource, loadData } = useSmartDataStore()
  
  // 使用最新的数据源，优先使用智能数据存储的数据
  const categories = deduplicateCategories(smartCategories.length > 0 ? smartCategories : hydratedCategories)
  const websites = smartWebsites.length > 0 ? smartWebsites : hydratedWebsites

  // 监听数据变化，当数据更新时强制重新渲染
  useEffect(() => {
    console.log('🔄 主页面数据状态更新:', {
      categoriesCount: categories.length,
      websitesCount: websites.length,
      dataSource,
      isHydrated
    })
  }, [categories.length, websites.length, dataSource, isHydrated])

  // 添加一个效果来监听 localStorage 的变化，以防万一
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'navigation-categories' || e.key === 'navigation-websites') {
        console.log('📱 检测到localStorage变化，重新加载数据')
        loadData()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [loadData])

  // 过滤网站
  const filteredWebsites = websites.filter((website) =>
    website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    website.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    website.url.toLowerCase().includes(searchTerm.toLowerCase())
  )

  console.log('🏠 主页面渲染状态:', {
    categoriesCount: categories.length, 
    websitesCount: websites.length,
    filteredWebsitesCount: filteredWebsites.length,
    searchTerm: searchTerm.length > 0 ? `"${searchTerm}"` : '无',
    dataSource,
    isHydrated
  })

  if (!isHydrated) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">网站导航</h1>
          <p className="text-muted-foreground">正在加载数据...</p>
        </div>
        
        <div className="mb-6">
          <SearchBar />
        </div>

        <div className="space-y-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">数据加载中，请稍候...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">网站导航</h1>
        <p className="text-muted-foreground">
          发现优质网站资源 • 当前数据源: {dataSource === 'supabase' ? '云端数据库' : '本地存储'}
        </p>
      </div>
      
      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="space-y-6">
        {/* 精品推荐区域 */}
        <FeaturedSection websites={filteredWebsites} />

        {/* 分类区域 */}
        {categories.map((category) => (
          <CategorySection
            key={`category-${category.id}`}
            category={category}
            websites={filteredWebsites}
          />
        ))}

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无分类，请先到管理员页面添加分类和网站</p>
          </div>
        )}
      </div>
    </div>
  )
}

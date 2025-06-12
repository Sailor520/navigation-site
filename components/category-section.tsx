"use client"

import { useState } from "react"
import { WebsiteCard } from "@/components/website-card"
import type { Category } from "@/lib/types"
import { useHydratedStore } from "@/lib/use-hydrated-store"
import { useAdminStore, useDataStore } from "@/lib/store"

interface CategorySectionProps {
  category: Category
  showAll?: boolean
}

export function CategorySection({ category, showAll = false }: CategorySectionProps) {
  const { isHydrated, websites } = useHydratedStore()
  const isAdminMode = useAdminStore((state) => state.isAdminMode)
  const { reorderWebsitesInCategory } = useDataStore()
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  
  // 获取该分类下的网站并按order排序
  const categoryWebsites = websites
    .filter(website => website.categoryIds.includes(category.id))
    .sort((a, b) => (a.order || 0) - (b.order || 0))

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

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!isAdminMode) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
    console.log("拖拽悬停在索引:", index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    if (!isAdminMode) return
    e.preventDefault()
    setDragOverIndex(null)
    
    const draggedWebsiteId = e.dataTransfer.getData("text/plain")
    console.log("拖放事件 - 被拖拽的网站ID:", draggedWebsiteId, "目标索引:", targetIndex)
    
    const draggedIndex = categoryWebsites.findIndex(w => w.id === draggedWebsiteId)
    console.log("被拖拽网站的当前索引:", draggedIndex)
    
    if (draggedIndex === -1 || draggedIndex === targetIndex) {
      console.log("拖放被忽略: 无效索引或相同位置")
      return
    }

    // 创建新的排序数组
    const newWebsites = [...categoryWebsites]
    const draggedWebsite = newWebsites[draggedIndex]
    
    // 移除拖拽的元素
    newWebsites.splice(draggedIndex, 1)
    // 插入到新位置
    newWebsites.splice(targetIndex, 0, draggedWebsite)
    
    // 更新排序
    const newWebsiteIds = newWebsites.map(website => website.id)
    console.log("新的排序:", newWebsiteIds)
    reorderWebsitesInCategory(category.id, newWebsiteIds)
  }

  return (
    <section id={`category-${category.id}`} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">
          {category.name} ({categoryWebsites.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {categoryWebsites.map((website, index) => (
          <WebsiteCard 
            key={website.id} 
            website={website}
            isDropTarget={isAdminMode && dragOverIndex === index}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          />
        ))}
      </div>
    </section>
  )
}

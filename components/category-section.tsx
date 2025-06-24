"use client"

import { useState } from "react"
import { WebsiteCard } from "@/components/website-card"
import type { Category, Website } from "@/lib/types"
import { useAdminStore } from "@/lib/store"
import { useSmartDataStore } from "@/lib/smart-data-store"
import { useAdminAuth } from "@/lib/admin-auth-context"

interface CategorySectionProps {
  category: Category
  websites: Website[]
  showAll?: boolean
}

export function CategorySection({ category, websites, showAll = false }: CategorySectionProps) {
  const { isAdminMode } = useAdminStore()
  const { isAuthenticated } = useAdminAuth()
  const { reorderWebsitesInCategory } = useSmartDataStore()
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  
  // 真正的管理模式状态：必须同时满足认证和管理模式开启
  const isRealAdminMode = isAuthenticated && isAdminMode
  
  // 获取该分类下的网站并按order排序
  const categoryWebsites = websites
    .filter(website => website.categoryIds.includes(category.id))
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  if (categoryWebsites.length === 0) {
    return null
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!isRealAdminMode) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
    console.log("🎯 拖拽悬停在索引:", index, "分类:", category.name)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    if (!isRealAdminMode) return
    e.preventDefault()
    setDragOverIndex(null)
    
    const draggedWebsiteId = e.dataTransfer.getData("text/plain")
    console.log("🔄 拖放事件 - 被拖拽的网站ID:", draggedWebsiteId, "目标索引:", targetIndex, "分类:", category.name)
    
    const draggedIndex = categoryWebsites.findIndex(w => w.id === draggedWebsiteId)
    console.log("📍 被拖拽网站的当前索引:", draggedIndex)
    
    if (draggedIndex === -1 || draggedIndex === targetIndex) {
      console.log("⏭️ 拖放被忽略: 无效索引或相同位置")
      return
    }

    try {
      // 创建新的排序数组
      const newWebsites = [...categoryWebsites]
      const draggedWebsite = newWebsites[draggedIndex]
      
      // 移除拖拽的元素
      newWebsites.splice(draggedIndex, 1)
      // 插入到新位置
      newWebsites.splice(targetIndex, 0, draggedWebsite)
      
      // 更新排序
      const newWebsiteIds = newWebsites.map(website => website.id)
      console.log("📋 新的排序:", newWebsiteIds)
      
      await reorderWebsitesInCategory(category.id, newWebsiteIds)
      console.log("✅ 拖拽排序完成")
    } catch (error) {
      console.error("❌ 拖拽排序失败:", error)
    }
  }

  return (
    <section id={`category-${category.id}`} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight category-header">
          {category.name} ({categoryWebsites.length})
          {isRealAdminMode && (
            <span className="ml-2 text-sm text-muted-foreground font-normal">
              拖拽排序
            </span>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {categoryWebsites.map((website, index) => (
          <WebsiteCard 
            key={website.id} 
            website={website}
            isDropTarget={isRealAdminMode && dragOverIndex === index}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          />
        ))}
      </div>
    </section>
  )
}

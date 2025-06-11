"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useSidebarStore, useDataStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { GripVertical } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAdminAuth } from "@/lib/admin-auth-context"

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, setIsOpen } = useSidebarStore()
  const { categories, reorderCategories, moveWebsiteToCategory } = useDataStore()
  const { isAuthenticated } = useAdminAuth()
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)

  // 确保组件已挂载
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (!isMounted) return

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        return
      }
      setIsOpen(false)
    }

    if (window.innerWidth < 768) {
      setIsOpen(false)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [pathname, setIsOpen, isMounted])

  // 如果还没有挂载，返回一个占位符
  if (!isMounted) {
    return (
      <div className={cn("hidden border-r bg-background transition-all duration-300 md:block", "w-[240px]")}>
        <div className="w-[240px]">
          <div className="h-full py-6">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">网站分类</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  全部分类
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet open={isOpen && window.innerWidth < 768} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[240px] p-0 md:hidden">
          <SidebarContent
            pathname={pathname}
            categories={categories}
            onReorderCategories={reorderCategories}
            onMoveWebsiteToCategory={moveWebsiteToCategory}
            isAdminMode={isAuthenticated}
            toast={toast}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar - 固定显示，不再可收起 */}
      <div className="hidden border-r bg-background md:block w-[240px]">
        <SidebarContent
          pathname={pathname}
          categories={categories}
          onReorderCategories={reorderCategories}
          onMoveWebsiteToCategory={moveWebsiteToCategory}
          isAdminMode={isAuthenticated}
          toast={toast}
        />
      </div>
    </>
  )
}

function SidebarContent({
  pathname,
  categories,
  onReorderCategories,
  onMoveWebsiteToCategory,
  isAdminMode,
  toast,
}: {
  pathname: string
  categories: any[]
  onReorderCategories: (categories: any[]) => void
  onMoveWebsiteToCategory: (websiteId: string, categoryId: string) => void
  isAdminMode: boolean
  toast: any
}) {
  const router = useRouter()
  const { getWebsitesByCategory } = useDataStore()
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleCategoryClick = (categoryId: string) => {
    if (pathname === "/admin") {
      // 如果在管理页面，跳转到主页并滚动到对应分类
      router.push(`/?category=${categoryId}`)
    } else {
      // 如果在主页，直接滚动到对应分类
      const element = document.getElementById(`category-${categoryId}`)
      element?.scrollIntoView({ behavior: "smooth" })
    }
  }

  // 处理URL参数，自动滚动到指定分类
  useEffect(() => {
    if (pathname === "/" && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const categoryId = urlParams.get("category")
      if (categoryId) {
        setTimeout(() => {
          const element = document.getElementById(`category-${categoryId}`)
          element?.scrollIntoView({ behavior: "smooth" })
        }, 100)
        // 清除URL参数
        window.history.replaceState({}, "", "/")
      }
    }
  }, [pathname])

  // 分类拖拽排序
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    const websiteId = e.dataTransfer.getData("text/plain")

    // 如果是网站卡片拖拽到分类
    if (websiteId && isAdminMode) {
      const category = categories[dropIndex]
      onMoveWebsiteToCategory(websiteId, category.id)
      toast({
        title: "网站分类已更新",
        description: `网站已添加到 "${category.name}" 分类`,
      })
      setDragOverIndex(null)
      return
    }

    // 如果是分类排序
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newCategories = [...categories]
    const draggedCategory = newCategories[draggedIndex]

    // 移除被拖拽的项
    newCategories.splice(draggedIndex, 1)

    // 在新位置插入
    newCategories.splice(dropIndex, 0, draggedCategory)

    onReorderCategories(newCategories)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  // 计算总网站数量
  const totalWebsites = categories.reduce((total, category) => {
    return total + getWebsitesByCategory(category.id).length
  }, 0)

  return (
    <ScrollArea className="h-full py-6">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">网站分类</h2>
        {isAdminMode && <p className="mb-4 px-4 text-xs text-muted-foreground">拖拽网站卡片到分类名称可添加分类</p>}
        <div className="space-y-1">
          <Button asChild variant={pathname === "/" ? "secondary" : "ghost"} className="w-full justify-start">
            <Link href="/">全部分类 ({totalWebsites})</Link>
          </Button>

          {categories.map((category, index) => {
            const websiteCount = getWebsitesByCategory(category.id).length
            return (
              <div
                key={category.id}
                className={cn(
                  "group relative flex items-center rounded-md transition-colors",
                  dragOverIndex === index && "bg-accent",
                  draggedIndex === index && "opacity-50",
                )}
                draggable={isAdminMode}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                {isAdminMode && (
                  <div className="flex h-9 w-6 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <Button
                  variant="ghost"
                  className={cn("flex-1 justify-start h-9", isAdminMode ? "px-2" : "px-4")}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name} ({websiteCount})
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </ScrollArea>
  )
}

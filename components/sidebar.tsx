"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useSidebarStore, useDataStore, useAdminStore } from "@/lib/store"
import { useSmartDataStore } from "@/lib/smart-data-store"
import { deduplicateCategories } from "@/lib/reset-all-data"
import { cn } from "@/lib/utils"
import { GripVertical, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAdminAuth } from "@/lib/admin-auth-context"

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, setIsOpen } = useSidebarStore()
  // 使用智能数据存储以保持与管理员页面一致
  const { categories: smartCategories, reorderCategories: smartReorderCategories } = useSmartDataStore()
  const { moveWebsiteToCategory } = useDataStore() // 这个功能仍使用本地存储
  const { isAuthenticated } = useAdminAuth()
  const { isAdminMode } = useAdminStore()
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // 对分类去重，确保与添加网站表单一致
  const categories = deduplicateCategories(smartCategories)

  // 确保组件已挂载
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 管理主内容区域的左边距
  useEffect(() => {
    if (!isMounted) return
    
    const mainElement = document.querySelector('main')
    if (mainElement && window.innerWidth >= 768) {
      if (isCollapsed) {
        mainElement.style.marginLeft = '64px'
      } else {
        mainElement.style.marginLeft = '240px'
      }
    }
  }, [isCollapsed, isMounted])

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (!isMounted) return

    const handleResize = () => {
      const mainElement = document.querySelector('main')
      if (window.innerWidth >= 768) {
        // 桌面端：应用侧边栏边距
        if (mainElement) {
          mainElement.style.marginLeft = isCollapsed ? '64px' : '240px'
        }
        return
      } else {
        // 移动端：重置边距并关闭侧边栏
        if (mainElement) {
          mainElement.style.marginLeft = '0px'
        }
        setIsOpen(false)
      }
    }

    // 初始调整
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [pathname, setIsOpen, isMounted, isCollapsed])

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
            onReorderCategories={smartReorderCategories}
            onMoveWebsiteToCategory={moveWebsiteToCategory}
            isAdminMode={isAuthenticated && isAdminMode}
            toast={toast}
            isCollapsed={false}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar - 新增收起/展开功能，固定定位 */}
      <div className={cn(
        "hidden md:block transition-all duration-300 border-r bg-background",
        "fixed left-0 top-16 bottom-0 z-30",
        isCollapsed ? "w-16" : "w-[240px]"
      )}>
        {/* 收起/展开按钮 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-3 top-6 z-40 h-6 w-6 rounded-full border bg-background p-0 shadow-md hover:shadow-lg",
            "flex items-center justify-center"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        <SidebarContent
          pathname={pathname}
          categories={categories}
          onReorderCategories={smartReorderCategories}
          onMoveWebsiteToCategory={moveWebsiteToCategory}
          isAdminMode={isAuthenticated && isAdminMode}
          toast={toast}
          isCollapsed={isCollapsed}
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
  isCollapsed = false,
}: {
  pathname: string
  categories: any[]
  onReorderCategories: (categories: any[]) => void
  onMoveWebsiteToCategory: (websiteId: string, categoryId: string) => void
  isAdminMode: boolean
  toast: any
  isCollapsed?: boolean
}) {
  const router = useRouter()
  // 使用智能数据存储获取网站数据，确保与管理员页面一致
  const { getWebsitesByCategory } = useSmartDataStore()
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
        {!isCollapsed && (
          <>
            <h2 className="mb-2 px-4 text-lg font-semibold">网站分类</h2>
            {isAdminMode && <p className="mb-4 px-4 text-xs text-muted-foreground">拖拽网站卡片到分类名称可添加分类</p>}
          </>
        )}
        <div className="space-y-1">
          <Button 
            asChild 
            variant={pathname === "/" ? "secondary" : "ghost"} 
            className={cn(
              "w-full",
              isCollapsed ? "justify-center px-2" : "justify-start"
            )}
            title={isCollapsed ? `全部分类 (${totalWebsites})` : undefined}
          >
            <Link href="/">
              {isCollapsed ? "全" : `全部分类 (${totalWebsites})`}
            </Link>
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
                draggable={isAdminMode && !isCollapsed}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                {isAdminMode && !isCollapsed && (
                  <div className="flex h-9 w-6 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <Button
                  variant="ghost"
                  className={cn(
                    "flex-1 h-9",
                    isCollapsed ? "justify-center px-2" : "justify-start",
                    isAdminMode && !isCollapsed ? "px-2" : !isCollapsed ? "px-4" : "px-2"
                  )}
                  onClick={() => handleCategoryClick(category.id)}
                  title={isCollapsed ? `${category.name} (${websiteCount})` : undefined}
                >
                  {isCollapsed ? category.name.charAt(0) : `${category.name} (${websiteCount})`}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </ScrollArea>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Star, Flame, Edit, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Website } from "@/lib/types"
import { useAdminStore, useDataStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { EditWebsiteDialog } from "@/components/edit-website-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"

interface WebsiteCardProps {
  website: Website
  isDropTarget?: boolean
  onDragOver?: (e: React.DragEvent) => void
  onDragLeave?: () => void
  onDrop?: (e: React.DragEvent) => void
}

export function WebsiteCard({ website, isDropTarget, onDragOver, onDragLeave, onDrop }: WebsiteCardProps) {
  const isAdminMode = useAdminStore((state) => state.isAdminMode)
  const { toggleWebsiteFeatured, toggleWebsiteHot } = useDataStore()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFeaturedClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWebsiteFeatured(website.id)
  }

  const handleHotClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWebsiteHot(website.id)
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditOpen(true)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDeleteOpen(true)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // 如果是管理模式且正在拖拽，不要跳转
    if (isAdminMode && isDragging) {
      e.preventDefault()
      return
    }
    
    // 如果点击的是管理按钮，不要跳转
    const target = e.target as HTMLElement
    if (target.closest(".admin-button")) {
      e.preventDefault()
      return
    }
    
    // 如果是管理模式，不跳转（避免与拖拽冲突）
    if (isAdminMode) {
      e.preventDefault()
      return
    }
    
    // 否则正常跳转
    window.open(website.url, "_blank", "noopener,noreferrer")
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (!isAdminMode) {
      console.log("拖拽被阻止: 不在管理模式")
      return
    }
    console.log("开始拖拽:", website.name, website.id)
    e.dataTransfer.setData("text/plain", website.id)
    e.dataTransfer.effectAllowed = "move"
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // 长按开始 - 支持移动端
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isAdminMode) return
    
    const timer = setTimeout(() => {
      // 触发长按效果
      const card = e.currentTarget as HTMLElement
      card.style.transform = "scale(1.05)"
      card.style.zIndex = "50"
      card.style.opacity = "0.8"
    }, 500) // 500ms长按触发
    
    setLongPressTimer(timer)
  }

  // 长按结束
  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
    
    // 重置样式
    const cards = document.querySelectorAll('.website-card')
    cards.forEach((card) => {
      ;(card as HTMLElement).style.transform = ""
      ;(card as HTMLElement).style.zIndex = ""
      ;(card as HTMLElement).style.opacity = ""
    })
  }

  return (
    <>
      <Card
        className={cn(
          "website-card group relative overflow-hidden transition-all hover:shadow-md cursor-pointer",
          isAdminMode && "cursor-grab active:cursor-grabbing hover:scale-[1.02]",
          isDragging && "opacity-50 scale-105 shadow-2xl",
          isDropTarget && "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50/50",
        )}
        draggable={isAdminMode}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
        title={isAdminMode ? "拖拽以重新排序" : "点击访问网站"}
      >
        <CardContent className="p-4" style={{ userSelect: isAdminMode ? 'none' : 'auto' }}>
          <div className="flex items-start gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
              <Image
                src={website.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(website.name.charAt(0))}&background=e5e7eb&color=6b7280&size=40&format=svg`}
                alt={website.name}
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== `https://ui-avatars.com/api/?name=${encodeURIComponent(website.name.charAt(0))}&background=e5e7eb&color=6b7280&size=40&format=svg`) {
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(website.name.charAt(0))}&background=e5e7eb&color=6b7280&size=40&format=svg`;
                  }
                }}
              />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">{website.name}</h3>
                {/* 移除跳转图标 */}
              </div>
              <p className="line-clamp-2 text-sm text-muted-foreground">{website.description}</p>
            </div>
          </div>

          {/* 管理员操作区域 */}
          {isAdminMode && (
            <div className="mt-3 space-y-2">
              {/* 第一行：HOT和精品按钮 */}
              <div className="flex items-center justify-between">
                <button
                  className="admin-button flex items-center gap-1 rounded-md px-2 py-1 text-xs"
                  onClick={handleHotClick}
                  title={website.isHot ? "取消热门" : "设为热门"}
                >
                  <Flame
                    className={cn(
                      "h-3 w-3 transition-colors",
                      website.isHot ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-400",
                    )}
                  />
                  <span
                    className={cn(
                      "font-medium transition-colors",
                      website.isHot ? "text-red-500" : "text-muted-foreground hover:text-red-400",
                    )}
                  >
                    HOT
                  </span>
                </button>

                <button
                  className="admin-button flex items-center gap-1 rounded-md px-2 py-1 text-xs"
                  onClick={handleFeaturedClick}
                  title={website.isFeatured ? "取消精品" : "设为精品"}
                >
                  <Star
                    className={cn(
                      "h-3 w-3 transition-colors",
                      website.isFeatured ? "fill-blue-500 text-blue-500" : "text-muted-foreground hover:text-blue-400",
                    )}
                  />
                  <span
                    className={cn(
                      "font-medium transition-colors",
                      website.isFeatured ? "text-blue-500" : "text-muted-foreground hover:text-blue-400",
                    )}
                  >
                    精品
                  </span>
                </button>
              </div>

              {/* 第二行：编辑和删除按钮 */}
              <div className="flex items-center justify-between">
                <button
                  className="admin-button flex items-center gap-1 rounded-md px-2 py-1 text-xs"
                  onClick={handleEditClick}
                  title="编辑网站"
                >
                  <Edit className="h-3 w-3 text-muted-foreground hover:text-blue-400" />
                  <span className="font-medium text-muted-foreground hover:text-blue-400">编辑</span>
                </button>

                <button
                  className="admin-button flex items-center gap-1 rounded-md px-2 py-1 text-xs"
                  onClick={handleDeleteClick}
                  title="删除网站"
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-400" />
                  <span className="font-medium text-muted-foreground hover:text-red-400">删除</span>
                </button>
              </div>
            </div>
          )}

          {/* 普通用户查看的标识 */}
          {!isAdminMode && (website.isHot || website.isFeatured) && (
            <div className="mt-3 flex items-center gap-2">
              {website.isHot && (
                <div className="hot-badge flex items-center gap-1 rounded-md px-2 py-1 text-xs">
                  <Flame className="h-3 w-3 fill-red-500 text-red-500" />
                  <span className="font-medium text-red-500">HOT</span>
                </div>
              )}
              {website.isFeatured && (
                <div className="featured-badge flex items-center gap-1 rounded-md px-2 py-1 text-xs">
                  <Star className="h-3 w-3 fill-blue-500 text-blue-500" />
                  <span className="font-medium text-blue-500">精品</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 编辑对话框 */}
      <EditWebsiteDialog website={website} open={isEditOpen} onOpenChange={setIsEditOpen} />

      {/* 删除确认对话框 */}
      <DeleteConfirmDialog website={website} open={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
    </>
  )
}

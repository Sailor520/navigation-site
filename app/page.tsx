"use client"

import { CategorySection } from "@/components/category-section"
import { FeaturedSection } from "@/components/featured-section"
import { ThemeInfo } from "@/components/theme-info"
import { HydrationSafe } from "@/components/hydration-safe"
import { useDataStore, useAdminStore } from "@/lib/store"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)

  // 确保组件已挂载
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    // 服务器端渲染的静态版本
    return (
      <div className="space-y-10">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">网站导航</h1>
              <p className="text-muted-foreground">发现并访问精选的优质网站资源，按分类整理便于查找</p>
            </div>
          </div>
        </section>
        {/* 精品推荐区域 - 服务器端不渲染 */}
        {/* 分类展示区域 - 服务器端不渲染 */}
      </div>
    )
  }

  return <HomeContent />
}

function HomeContent() {
  const categories = useDataStore((state) => state.categories)
  const websites = useDataStore((state) => state.websites)
  const isAdminMode = useAdminStore((state) => state.isAdminMode)
  const { theme } = useTheme()
  const [showThemeInfo, setShowThemeInfo] = useState(false)

  // 调试信息
  useEffect(() => {
    console.log("当前网站数据:", websites)
    console.log("管理员模式:", isAdminMode)
  }, [websites, isAdminMode])

  // 检查是否是护眼模式
  const isEyeCareMode = theme === "warm-beige" || theme === "eye-green" || theme === "warm-orange"

  // 当切换到护眼模式时显示主题信息
  useEffect(() => {
    if (isEyeCareMode) {
      setShowThemeInfo(true)
      const timer = setTimeout(() => setShowThemeInfo(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isEyeCareMode])

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">网站导航</h1>
            <p className="text-muted-foreground">发现并访问精选的优质网站资源，按分类整理便于查找</p>
            <HydrationSafe>
              {isEyeCareMode && (
                <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  当前使用护眼模式，有效减少眼部疲劳
                </p>
              )}
            </HydrationSafe>
          </div>
          <div className="flex items-center gap-4">
            <HydrationSafe>
              {showThemeInfo && <ThemeInfo />}
              {isAdminMode && (
                <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  🛡️ 管理员模式：点击网站卡片下方的按钮来设置精品和热门标识
                </div>
              )}
            </HydrationSafe>
          </div>
        </div>
      </section>

      {/* 精品推荐区域 */}
      <FeaturedSection />

      {/* 分类展示区域 */}
      <div className="space-y-10">
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} showAll={true} />
        ))}
      </div>
    </div>
  )
}

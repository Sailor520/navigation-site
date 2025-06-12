"use client"

import { CategorySection } from "@/components/category-section"
import { FeaturedSection } from "@/components/featured-section"


import { useAdminStore } from "@/lib/store"
import { useHydratedStore } from "@/lib/use-hydrated-store"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export default function Home() {
  return <HomeContent />
}

function HomeContent() {
  const { isHydrated, categories, websites } = useHydratedStore()
  const isAdminMode = useAdminStore((state) => state.isAdminMode)
  const { theme } = useTheme()


  // 调试信息
  useEffect(() => {
    console.log("当前网站数据:", websites)
    console.log("管理员模式:", isAdminMode)
    console.log("Hydration状态:", isHydrated)
  }, [websites, isAdminMode, isHydrated])

  // 检查是否是护眼模式（保留逻辑但不显示悬浮窗）
  const isEyeCareMode = theme === "warm-beige" || theme === "eye-green" || theme === "warm-orange"

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">网站导航</h1>
            <p className="text-muted-foreground">发现并访问精选的优质网站资源，按分类整理便于查找</p>
            {isEyeCareMode && (
              <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                当前使用护眼模式，有效减少眼部疲劳
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {isAdminMode && (
              <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                🛡️ 管理员模式：点击网站卡片下方的按钮来设置精品和热门标识
              </div>
            )}
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

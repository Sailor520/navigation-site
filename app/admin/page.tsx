"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WebsiteForm } from "@/components/website-form"
import { CategoryForm } from "@/components/category-form"
import { useDataStore } from "@/lib/store"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { AdminSafeWrapper } from "@/components/admin-safe-wrapper"

export default function AdminPage() {
  const categories = useDataStore((state) => state.categories)
  const { isAuthenticated } = useAdminAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // 确保组件已挂载
  useEffect(() => {
    setIsMounted(true)
    setIsLoading(false)
  }, [])

  // 如果未认证，重定向到首页
  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      console.log("未认证，重定向到首页")
      router.push("/")
    }
  }, [isAuthenticated, router, isMounted, isLoading])

  // 显示加载状态
  if (isLoading || !isMounted) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  // 如果未认证，显示错误信息
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>访问受限</AlertTitle>
          <AlertDescription>您需要管理员权限才能访问此页面。请先登录管理员账号。</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/")}>返回首页</Button>
      </div>
    )
  }

  return (
    <AdminSafeWrapper>
      <div className="space-y-10">
        <section className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">管理员控制台</h1>
            <p className="text-muted-foreground">管理网站和分类，系统将自动抓取网站信息</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              管理员设置
            </Link>
          </Button>
        </section>

        <Tabs defaultValue="website" className="space-y-6">
          <TabsList>
            <TabsTrigger value="website">添加网站</TabsTrigger>
            <TabsTrigger value="category">创建分类</TabsTrigger>
          </TabsList>

          <TabsContent value="website" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">添加新网站</h2>
              <p className="text-sm text-muted-foreground">添加网站到导航，系统将自动抓取网站信息</p>
            </div>
            <WebsiteForm categories={categories} />
          </TabsContent>

          <TabsContent value="category" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">创建新分类</h2>
              <p className="text-sm text-muted-foreground">创建新的网站分类来组织网站</p>
            </div>
            <CategoryForm />
          </TabsContent>
        </Tabs>
      </div>
    </AdminSafeWrapper>
  )
}

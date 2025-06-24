"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Settings, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WebsiteForm } from "@/components/website-form"
import { CategoryForm } from "@/components/category-form"
import { useSmartDataStore } from "@/lib/smart-data-store"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { MigrationPromptImproved } from "@/components/migration-prompt-improved"
import { MigrationTestPanel } from "@/components/migration-test-panel"
import { deduplicateCategories } from "@/lib/reset-all-data"


export default function AdminPage() {
  const { categories, isInitialized, dataSource, initialize } = useSmartDataStore()
  const { isAuthenticated } = useAdminAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  
  // 对分类去重，防止重复显示
  const uniqueCategories = deduplicateCategories(categories)
  
  // 调试日志
  useEffect(() => {
    console.log('Admin页面状态:', {
      isMounted,
      isLoading,
      isAuthenticated,
      isInitialized,
      dataSource,
      categoriesCount: categories.length,
      pathname: window.location.pathname
    })
  }, [isMounted, isLoading, isAuthenticated, isInitialized, dataSource, categories.length])

  // 确保组件已挂载并初始化智能数据存储
  useEffect(() => {
    setIsMounted(true)
    
    // 初始化智能数据存储
    const initializeStore = async () => {
      try {
        if (!isInitialized) {
          console.log('初始化智能数据存储...')
          await initialize()
        }
      } catch (error) {
        console.error('智能数据存储初始化失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeStore()
  }, [isInitialized, initialize])

  // 如果未认证，重定向到首页 - 添加延迟避免闪烁和路由冲突
  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      console.log("未认证，准备重定向到首页")
      // 添加小延迟确保所有状态都已稳定
      const timer = setTimeout(() => {
        console.log("执行重定向到首页")
        router.replace("/") // 使用 replace 而不是 push 避免历史记录问题
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, router, isMounted, isLoading])

  // 显示加载状态 - 确保在认证状态确定前不渲染内容
  if (isLoading || !isMounted || !isInitialized) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-muted-foreground">正在验证访问权限并初始化数据...</p>
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
    <div className="space-y-10">
      {/* 数据迁移提示 - 现在数据会自动保存到正确的数据源，暂时隐藏 */}
      {/* <MigrationPromptImproved /> */}
      
      {/* 开发环境测试面板 */}
      {process.env.NODE_ENV === "development" && <MigrationTestPanel />}
      
      {/* 数据源状态指示器 */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className={`w-2 h-2 rounded-full ${dataSource === 'supabase' ? 'bg-green-500' : 'bg-blue-500'}`} />
        <span className="text-sm text-muted-foreground">
          当前数据源: <span className={dataSource === 'supabase' ? 'text-green-600' : 'text-blue-600'}>
            {dataSource === 'supabase' ? '云端数据库' : '本地存储'}
          </span>
        </span>
      </div>
      
      <section className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">管理员控制台</h1>
          <p className="text-muted-foreground">管理网站和分类，系统将自动抓取网站信息</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/backup">
              <Shield className="mr-2 h-4 w-4" />
              数据备份
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              管理员设置
            </Link>
          </Button>
        </div>
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
          <WebsiteForm 
            categories={uniqueCategories} 
            onSuccess={() => {
              // 网站添加成功的回调处理
              console.log('✅ 网站添加成功，数据已自动同步到主页面')
              // 注意：不需要手动刷新，useSmartDataStore 已经自动处理状态更新
              // 主页面的 useHydratedStore 会自动监听并反映变化
            }}
          />
        </TabsContent>

        <TabsContent value="category" className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">创建新分类</h2>
            <p className="text-sm text-muted-foreground">创建新的网站分类来组织网站</p>
          </div>
          <CategoryForm 
            onSuccess={() => {
              // 分类添加成功的回调处理
              console.log('✅ 分类添加成功，数据已自动同步到主页面')
              // 注意：不需要手动刷新，useSmartDataStore 已经自动处理状态更新
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

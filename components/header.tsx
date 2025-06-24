"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

import { AdminToggle } from "@/components/admin-toggle"
import { SearchBar } from "@/components/search-bar"
import { AdminLoginDialog } from "@/components/admin-login-dialog"
import { useSidebarStore, useAdminStore } from "@/lib/store"
import { useAdminAuth } from "@/lib/admin-auth-context"

export default function Header() {
  const { toggleSidebar } = useSidebarStore()
  const { isAuthenticated, logout } = useAdminAuth()
  const { setAdminMode } = useAdminStore()
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // 确保组件已挂载
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAdminClick = () => {
    setIsLoginDialogOpen(true)
  }

  const handleLogout = () => {
    logout()
    setAdminMode(false) // 登出时自动关闭管理模式
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 移动端菜单按钮 */}
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">切换侧边栏</span>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold">AI工具导航</span>
            </Link>
          </div>

          {/* 搜索栏 - 居中显示 */}
          <div className="hidden md:flex flex-1 justify-center max-w-md mx-auto">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 md:ml-auto md:mr-12">
            {isMounted && isAuthenticated ? (
              <>
                <AdminToggle />
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    管理控制台
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  退出管理
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleAdminClick}>
                <Shield className="mr-2 h-4 w-4" />
                管理员
              </Button>
            )}
            <ModeToggle />
          </div>
        </div>

        {/* 移动端搜索栏 */}
        <div className="border-t px-4 py-3 md:hidden">
          <SearchBar />
        </div>
      </header>

      {/* 管理员登录对话框 */}
      <AdminLoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
    </>
  )
}

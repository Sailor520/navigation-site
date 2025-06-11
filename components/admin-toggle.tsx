"use client"

import { Shield, ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { useAdminStore } from "@/lib/store"

export function AdminToggle() {
  const { isAdminMode, setAdminMode } = useAdminStore()
  const { isAuthenticated } = useAdminAuth()
  const { toast } = useToast()

  // 如果未认证，不渲染组件
  if (!isAuthenticated) {
    return null
  }

  const toggleAdminMode = () => {
    const newMode = !isAdminMode
    setAdminMode(newMode)

    toast({
      title: newMode ? "✅ 管理员模式已开启" : "❌ 管理员模式已关闭",
      description: newMode
        ? "现在可以在网站卡片下方看到HOT和精品按钮，点击即可设置"
        : "已切换到普通浏览模式，只能查看网站",
    })
  }

  return (
    <Button
      variant={isAdminMode ? "default" : "outline"}
      size="sm"
      onClick={toggleAdminMode}
      className="flex items-center gap-2"
    >
      {isAdminMode ? (
        <>
          <Shield className="h-4 w-4" />
          管理模式
        </>
      ) : (
        <>
          <ShieldOff className="h-4 w-4" />
          普通模式
        </>
      )}
    </Button>
  )
}

"use client"

import * as React from "react"
import { Moon, Sun, Eye, Palette, Shield } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // 确保组件在客户端挂载后才渲染，避免水合错误
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">切换主题</span>
      </Button>
    )
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem]" />
      case "warm-beige":
      case "eye-green":
      case "warm-orange":
        return <Eye className="h-[1.2rem] w-[1.2rem] text-orange-500" />
      case "strong-blue-filter":
        return <Shield className="h-[1.2rem] w-[1.2rem] text-red-500" />
      default:
        return <Sun className="h-[1.2rem] w-[1.2rem]" />
    }
  }

  const isBlueFilterMode = ["warm-beige", "eye-green", "warm-orange", "strong-blue-filter"].includes(theme || "")

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            {getThemeIcon()}
            {isBlueFilterMode && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full animate-pulse" />
            )}
            <span className="sr-only">切换主题</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            主题模式
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* 基础主题 */}
          <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <div className="flex flex-col flex-1">
              <span>浅色模式</span>
              <span className="text-xs text-muted-foreground">经典白色主题</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <div className="flex flex-col flex-1">
              <span>深色模式</span>
              <span className="text-xs text-muted-foreground">护眼深色主题</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-sm border border-current" />
            <div className="flex flex-col flex-1">
              <span>跟随系统</span>
              <span className="text-xs text-muted-foreground">自动切换主题</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-orange-500" />
            防蓝光护眼模式
            <Badge variant="secondary" className="text-xs">
              NEW
            </Badge>
          </DropdownMenuLabel>

          {/* 防蓝光护眼主题 */}
          <DropdownMenuItem onClick={() => setTheme("warm-beige")} className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-sm bg-amber-200 border border-amber-300 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-amber-300 rounded-sm opacity-60" />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2">
                <span>暖米色</span>
                <Badge variant="outline" className="text-xs text-orange-600">
                  防蓝光
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">温暖舒适，减少蓝光刺激</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setTheme("eye-green")} className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-sm bg-green-200 border border-green-300 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-300 rounded-sm opacity-60" />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2">
                <span>护眼绿</span>
                <Badge variant="outline" className="text-xs text-green-600">
                  专业护眼
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">模拟自然环境，缓解疲劳</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setTheme("warm-orange")} className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-sm bg-orange-200 border border-orange-300 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-sm opacity-60" />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2">
                <span>暖橙色</span>
                <Badge variant="outline" className="text-xs text-orange-600">
                  强效护眼
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">温暖橙调，强力防蓝光</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setTheme("strong-blue-filter")} className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-sm bg-red-200 border border-red-300 relative">
              <Shield className="h-3 w-3 text-red-600 absolute inset-0 m-auto" />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2">
                <span>强力防蓝光</span>
                <Badge variant="destructive" className="text-xs">
                  MAX
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">夜间专用，最强防护</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <div className="px-2 py-1">
            <p className="text-xs text-muted-foreground">💡 防蓝光模式可有效减少电子屏幕对眼睛的伤害</p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

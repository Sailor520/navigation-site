"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { Eye, Shield, Clock, ChevronDown, ChevronUp, Minimize2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BlueLightIndicator() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isExpanded, setIsExpanded] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 自动收起逻辑：5秒后自动收起
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        setIsExpanded(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isExpanded, theme]) // 当主题变化时重新计时

  if (!mounted) return null

  const isBlueFilterMode = ["warm-beige", "eye-green", "warm-orange", "strong-blue-filter"].includes(theme || "")

  if (!isBlueFilterMode) return null

  const getFilterInfo = () => {
    switch (theme) {
      case "warm-beige":
        return { name: "暖米色防蓝光", level: "中等", color: "bg-amber-500", textColor: "text-amber-600", icon: Eye }
      case "eye-green":
        return { name: "护眼绿防蓝光", level: "专业", color: "bg-green-500", textColor: "text-green-600", icon: Eye }
      case "warm-orange":
        return { name: "暖橙防蓝光", level: "强效", color: "bg-orange-500", textColor: "text-orange-600", icon: Eye }
      case "strong-blue-filter":
        return { name: "强力防蓝光", level: "最强", color: "bg-red-500", textColor: "text-red-600", icon: Shield }
      default:
        return { name: "防蓝光", level: "开启", color: "bg-blue-500", textColor: "text-blue-600", icon: Eye }
    }
  }

  const filterInfo = getFilterInfo()
  const Icon = filterInfo.icon

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsVisible(false)
  }

  if (!isVisible) {
    return (
      <div className="fixed top-20 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="h-8 w-8 p-0 rounded-full shadow-lg"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out cursor-pointer",
        "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm",
        "border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg",
        "hover:shadow-xl",
        isExpanded ? "p-3" : "p-2",
      )}
      onClick={toggleExpanded}
    >
      {isExpanded ? (
        // 展开状态
        <div className="space-y-2 min-w-[200px]">
          {/* 头部 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={cn("h-4 w-4", filterInfo.textColor)} />
              <span className="font-medium text-sm">{filterInfo.name}</span>
              <div className={cn("h-2 w-2 rounded-full animate-pulse", filterInfo.color)} />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleExpanded}
                className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* 详细信息 */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{currentTime.toLocaleTimeString()}</span>
            <span>•</span>
            <span>防护等级: {filterInfo.level}</span>
          </div>

          {/* 防护状态条 */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all duration-1000", filterInfo.color)}
                style={{
                  width:
                    theme === "strong-blue-filter"
                      ? "100%"
                      : theme === "warm-orange"
                        ? "75%"
                        : theme === "eye-green"
                          ? "60%"
                          : "50%",
                }}
              />
            </div>
            <span className="text-xs font-medium">
              {theme === "strong-blue-filter"
                ? "60%"
                : theme === "warm-orange"
                  ? "45%"
                  : theme === "eye-green"
                    ? "35%"
                    : "30%"}
            </span>
          </div>

          {/* 提示文字 */}
          <div className="text-xs text-muted-foreground">点击收起 • 5秒后自动收起</div>
        </div>
      ) : (
        // 收起状态
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", filterInfo.textColor)} />
          <div className={cn("h-2 w-2 rounded-full animate-pulse", filterInfo.color)} />
          <span className="text-xs font-medium">{filterInfo.level}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

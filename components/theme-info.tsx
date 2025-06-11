"use client"

import { useTheme } from "next-themes"
import { Eye, Sun, Moon, Palette, Shield, Zap, Clock, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function ThemeInfo() {
  const { theme } = useTheme()

  const getThemeInfo = () => {
    switch (theme) {
      case "warm-beige":
        return {
          name: "暖米色防蓝光模式",
          description: "温暖的米黄色背景，有效过滤有害蓝光，减少眼部疲劳",
          icon: <Eye className="h-5 w-5 text-amber-600" />,
          benefits: ["减少眼部疲劳", "温暖舒适", "适合长时间使用", "过滤30%蓝光"],
          blueFilterLevel: 30,
          timeRecommendation: "全天候使用",
          badge: "防蓝光",
          badgeVariant: "secondary" as const,
        }
      case "eye-green":
        return {
          name: "护眼绿防蓝光模式",
          description: "专业护眼绿色调，模拟自然环境，科学配比减少视觉疲劳",
          icon: <Eye className="h-5 w-5 text-green-600" />,
          benefits: ["缓解视觉疲劳", "模拟自然环境", "保护视力", "过滤35%蓝光"],
          blueFilterLevel: 35,
          timeRecommendation: "办公学习推荐",
          badge: "专业护眼",
          badgeVariant: "outline" as const,
        }
      case "warm-orange":
        return {
          name: "暖橙防蓝光模式",
          description: "强效防蓝光橙色调，大幅减少蓝光辐射，营造温馨环境",
          icon: <Eye className="h-5 w-5 text-orange-600" />,
          benefits: ["强效防蓝光", "温馨舒适", "减少蓝光辐射", "过滤45%蓝光"],
          blueFilterLevel: 45,
          timeRecommendation: "晚间使用推荐",
          badge: "强效护眼",
          badgeVariant: "secondary" as const,
        }
      case "strong-blue-filter":
        return {
          name: "强力防蓝光模式",
          description: "最强防蓝光保护，专为夜间使用设计，最大程度减少蓝光伤害",
          icon: <Shield className="h-5 w-5 text-red-600" />,
          benefits: ["最强防护", "夜间专用", "深度过滤", "过滤60%蓝光"],
          blueFilterLevel: 60,
          timeRecommendation: "夜间专用模式",
          badge: "最强防护",
          badgeVariant: "destructive" as const,
        }
      case "dark":
        return {
          name: "深色模式",
          description: "深色背景，适合夜间使用，减少屏幕亮度对眼睛的刺激",
          icon: <Moon className="h-5 w-5" />,
          benefits: ["夜间友好", "省电模式", "减少眩光", "降低亮度"],
          blueFilterLevel: 0,
          timeRecommendation: "夜间使用",
          badge: "夜间模式",
          badgeVariant: "outline" as const,
        }
      case "light":
        return {
          name: "浅色模式",
          description: "经典的白色主题，清爽明亮，适合白天使用",
          icon: <Sun className="h-5 w-5" />,
          benefits: ["清爽明亮", "经典设计", "高对比度", "白天推荐"],
          blueFilterLevel: 0,
          timeRecommendation: "白天使用",
          badge: "经典模式",
          badgeVariant: "outline" as const,
        }
      default:
        return {
          name: "跟随系统",
          description: "自动跟随操作系统的主题设置，智能适配环境",
          icon: <Palette className="h-5 w-5" />,
          benefits: ["自动切换", "系统一致", "智能适配", "便捷省心"],
          blueFilterLevel: 0,
          timeRecommendation: "智能切换",
          badge: "智能模式",
          badgeVariant: "outline" as const,
        }
    }
  }

  const themeInfo = getThemeInfo()
  const isBlueFilterMode = themeInfo.blueFilterLevel > 0

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {themeInfo.icon}
          <span>当前主题</span>
          <Badge variant={themeInfo.badgeVariant}>{themeInfo.badge}</Badge>
        </CardTitle>
        <CardDescription>{themeInfo.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{themeInfo.description}</p>

        {/* 防蓝光等级显示 */}
        {isBlueFilterMode && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <Shield className="h-3 w-3" />
                蓝光过滤等级
              </span>
              <span className="text-sm font-bold text-blue-600">{themeInfo.blueFilterLevel}%</span>
            </div>
            <Progress value={themeInfo.blueFilterLevel} className="h-2" />
          </div>
        )}

        {/* 使用时间推荐 */}
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">推荐使用时间：{themeInfo.timeRecommendation}</span>
        </div>

        {/* 主要特点 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-1">
            <Star className="h-3 w-3" />
            主要特点：
          </h4>
          <ul className="space-y-1">
            {themeInfo.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1 w-1 rounded-full bg-current" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* 防蓝光提示 */}
        {isBlueFilterMode && (
          <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-md border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">防蓝光保护已激活</span>
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">正在有效过滤有害蓝光，保护您的眼睛健康</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

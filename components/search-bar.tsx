"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDataStore } from "@/lib/store"
import { WebsiteCard } from "@/components/website-card"
import type { Website } from "@/lib/types"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { websites, categories } = useDataStore()

  // 搜索逻辑
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase().trim()
    const results: { website: Website; score: number; matchType: string }[] = []

    websites.forEach((website) => {
      let score = 0
      let matchType = ""

      // 获取网站的分类名称
      const websiteCategories = categories.filter((cat) => website.categoryIds.includes(cat.id))
      const categoryNames = websiteCategories.map((cat) => cat.name).join(" ")

      // 完全匹配检查（最高优先级）
      if (website.name.toLowerCase() === query) {
        score = 100
        matchType = "网站名称完全匹配"
      } else if (website.description.toLowerCase() === query) {
        score = 95
        matchType = "描述完全匹配"
      } else if (categoryNames.toLowerCase().includes(query)) {
        score = 90
        matchType = "分类完全匹配"
      }
      // 模糊匹配检查
      else if (website.name.toLowerCase().includes(query)) {
        score = 80
        matchType = "网站名称匹配"
      } else if (website.description.toLowerCase().includes(query)) {
        score = 70
        matchType = "描述匹配"
      } else if (categoryNames.toLowerCase().includes(query)) {
        score = 60
        matchType = "分类匹配"
      }

      if (score > 0) {
        results.push({ website, score, matchType })
      }
    })

    // 按分数排序，分数高的在前
    return results.sort((a, b) => b.score - a.score)
  }, [searchQuery, websites, categories])

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false)
        setSearchQuery("")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleClear = () => {
    setSearchQuery("")
    setIsSearchOpen(false)
  }

  return (
    <div className="relative w-full max-w-md">
      {/* 搜索输入框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索网站... (Ctrl+K)"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsSearchOpen(e.target.value.length > 0)
          }}
          onFocus={() => searchQuery && setIsSearchOpen(true)}
          className="pl-10 pr-12"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 搜索结果下拉框 - 使用ScrollArea组件实现滚动 */}
      {isSearchOpen && searchQuery && (
        <Card className="search-dropdown absolute top-full z-50 mt-2 w-full border">
          <CardContent className="p-0">
            {searchResults.length > 0 ? (
              <ScrollArea className="h-[70vh] max-h-[500px]" type="always">
                <div className="p-2">
                  <div className="mb-2 px-2 text-xs text-muted-foreground">找到 {searchResults.length} 个结果</div>
                  <div className="space-y-2">
                    {searchResults.map(({ website, matchType }) => (
                      <div key={website.id} className="space-y-1">
                        <div className="text-xs text-blue-600 dark:text-blue-400">{matchType}</div>
                        <WebsiteCard website={website} />
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                没有找到匹配的网站
                <br />
                <span className="text-xs">尝试搜索网站名称、描述或分类</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 点击外部关闭搜索结果 */}
      {isSearchOpen && <div className="fixed inset-0 z-40" onClick={() => setIsSearchOpen(false)} />}
    </div>
  )
}

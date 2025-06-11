"use client"

import { useEffect, useState } from "react"
import type { Category } from "@/lib/types"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/categories", { cache: "no-store" })
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()

    // 监听分类创建事件
    const handleCategoryCreated = () => {
      fetchCategories()
    }

    window.addEventListener("categoryCreated", handleCategoryCreated)

    // 监听页面焦点，自动刷新
    const handleFocus = () => {
      fetchCategories()
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("categoryCreated", handleCategoryCreated)
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  return { categories, isLoading, refetch: fetchCategories }
}

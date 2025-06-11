"use client"

import { useState, useEffect, type ReactNode } from "react"

interface HydrationSafeProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * 防止hydration错误的包装组件
 * 确保服务器端和客户端渲染的一致性
 */
export function HydrationSafe({ children, fallback = null }: HydrationSafeProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * 用于包装使用了客户端状态的组件
 * 特别适用于使用了localStorage、sessionStorage或其他浏览器API的组件
 */
export function ClientOnly({ children, fallback }: HydrationSafeProps) {
  return <HydrationSafe fallback={fallback}>{children}</HydrationSafe>
} 
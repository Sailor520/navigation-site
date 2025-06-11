"use client"

import { useState, useEffect, type ReactNode } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { HydrationSafe } from "@/components/hydration-safe"
import { useToast } from "@/components/ui/use-toast"

interface AdminSafeWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * 管理功能专用的安全包装组件
 * 提供多层保护防止浏览器扩展干扰
 */
export function AdminSafeWrapper({ children, fallback }: AdminSafeWrapperProps) {
  const [isProtected, setIsProtected] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // 专门针对管理功能的错误监听
    const handleAdminError = (event: ErrorEvent) => {
      const error = event.error || event.message
      
      // 检查是否是会影响管理功能的错误
      const isInterferingError = 
        error?.stack?.includes?.('chrome-extension://') ||
        error?.message?.includes?.('chrome-extension') ||
        error?.message?.includes?.('Copy to clipboard') ||
        (error?.message?.includes?.('undefined') && error?.message?.includes?.('JSON'))

      if (isInterferingError) {
        console.warn('管理功能检测到扩展干扰，已自动处理:', error)
        event.preventDefault()
        
        // 显示一次性提示
        if (!isProtected) {
          toast({
            title: "检测到浏览器扩展",
            description: "为了更好的管理体验，建议使用无痕模式或禁用扩展",
            variant: "default",
          })
          setIsProtected(true)
        }
      }
    }

    // 为管理功能添加专门的错误监听
    window.addEventListener('error', handleAdminError, true) // 使用捕获阶段

    return () => {
      window.removeEventListener('error', handleAdminError, true)
    }
  }, [isProtected])

  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h3 className="text-lg font-medium text-red-800">管理功能遇到问题</h3>
            <p className="mt-2 text-sm text-red-600">
              可能是浏览器扩展导致的冲突。建议：
            </p>
            <ul className="mt-2 list-disc list-inside text-sm text-red-600">
              <li>刷新页面重试</li>
              <li>使用无痕模式</li>
              <li>临时禁用浏览器扩展</li>
            </ul>
          </div>
        )
      }
    >
      <HydrationSafe>
        {children}
      </HydrationSafe>
    </ErrorBoundary>
  )
}

/**
 * 专门用于表单提交的安全包装函数
 */
export function safeFormSubmit<T extends any[]>(
  submitFunction: (...args: T) => Promise<void>,
  errorHandler?: (error: any) => void
) {
  return async (...args: T) => {
    try {
      await submitFunction(...args)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      // 检查是否是扩展相关错误
      const isExtensionError = 
        errorMessage.includes('chrome-extension') ||
        (errorMessage.includes('undefined') && errorMessage.includes('JSON'))
      
             if (isExtensionError) {
         console.warn('表单提交遇到扩展干扰:', error)
         // 注意：这里无法直接使用toast，需要通过回调处理
         if (errorHandler) {
           errorHandler(new Error('浏览器扩展干扰'))
         }
       } else {
         console.error('表单提交失败:', error)
         if (errorHandler) {
           errorHandler(error)
         }
       }
    }
  }
} 
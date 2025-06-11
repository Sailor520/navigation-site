"use client"

import { useEffect, useRef, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function GlobalErrorHandler() {
  const { toast } = useToast()
  const hasShownExtensionWarning = useRef(false)
  
  useEffect(() => {
    // 强化的错误捕获处理器
    const handleError = (event: ErrorEvent) => {
      const error = event.error || event.message
      const filename = event.filename || ''
      const message = error?.message || event.message || ''
      const stack = error?.stack || ''
      
      // 更全面的扩展错误检测
      const isExtensionError = 
        filename.includes('chrome-extension://') ||
        filename.includes('moz-extension://') ||
        filename.includes('safari-extension://') ||
        filename.includes('edge-extension://') ||
        stack.includes('chrome-extension://') ||
        stack.includes('moz-extension://') ||
        stack.includes('safari-extension://') ||
        stack.includes('edge-extension://') ||
        message.includes('chrome-extension') ||
        message.includes('moz-extension') ||
        message.includes('Copy to clipboard') ||
        message.includes('clipboard') ||
        message.includes('frame_ant') ||
        (message.includes('undefined') && message.includes('JSON')) ||
        (message.includes('null') && message.includes('JSON')) ||
        message.includes('Script error')

      if (isExtensionError) {
        console.warn('🔒 [全局拦截] 浏览器扩展错误已被自动处理:', {
          type: '扩展错误',
          filename: filename.substring(0, 100),
          message: message.substring(0, 100),
          line: event.lineno,
          column: event.colno
        })
        
        // 强制阻止错误传播
        event.preventDefault()
        event.stopImmediatePropagation()
        
        // 只显示一次用户提示
        if (!hasShownExtensionWarning.current) {
          hasShownExtensionWarning.current = true
          toast({
            title: "检测到浏览器扩展干扰",
            description: "系统已自动处理，不影响正常使用。建议使用无痕模式以获得更好体验。",
            variant: "default",
          })
        }
        
        return true
      }

      // 处理应用相关错误
      console.error('❌ [应用错误]:', {
        message: message,
        filename: filename,
        line: event.lineno,
        column: event.colno
      })
      
      toast({
        title: "出现了一个错误",
        description: "页面遇到了问题，但不影响基本功能的使用",
        variant: "destructive",
      })
    }

    // 强化的Promise拒绝处理器
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      const message = error?.message || String(error) || ''
      const stack = error?.stack || ''
      
      // 检查是否是扩展相关的Promise拒绝
      const isExtensionError = 
        stack.includes('chrome-extension://') ||
        stack.includes('moz-extension://') ||
        stack.includes('safari-extension://') ||
        stack.includes('edge-extension://') ||
        message.includes('chrome-extension') ||
        message.includes('moz-extension') ||
        message.includes('Copy to clipboard') ||
        message.includes('clipboard') ||
        message.includes('frame_ant') ||
        (message.includes('undefined') && message.includes('JSON')) ||
        (message.includes('null') && message.includes('JSON'))

      if (isExtensionError) {
        console.warn('🔒 [Promise拦截] 扩展相关Promise拒绝已被自动处理:', {
          type: '扩展Promise拒绝',
          reason: message.substring(0, 100),
          stack: stack.substring(0, 100)
        })
        event.preventDefault()
        return
      }

      console.error('❌ [未处理的Promise拒绝]:', error)
      toast({
        title: "网络或数据错误",
        description: "某个操作失败了，请稍后重试",
        variant: "destructive",
      })
    }

    // 在最早阶段注册错误监听器，使用捕获阶段确保最高优先级
    window.addEventListener('error', handleError, true) // true = 捕获阶段
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true)

    // 重写JSON.parse作为额外保护
    const originalJSONParse = JSON.parse
    JSON.parse = function(text: string, reviver?: any) {
      try {
        return originalJSONParse.call(this, text, reviver)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (errorMessage.includes('undefined') || errorMessage.includes('null')) {
          console.warn('🔒 [JSON保护] 拦截了潜在的扩展JSON错误:', errorMessage)
          return null // 返回安全的默认值而不是抛出错误
        }
        throw error // 重新抛出应用相关的JSON错误
      }
    }

    // 清理监听器和恢复原始方法
    return () => {
      window.removeEventListener('error', handleError, true)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true)
      JSON.parse = originalJSONParse
    }
  }, [])

  return null // 这个组件不渲染任何内容
}

// 用于捕获特定的剪贴板错误
export function handleClipboardError(error: any) {
  if (error?.message?.includes?.('Copy to clipboard')) {
    console.warn('剪贴板功能不可用，但这不影响其他功能')
    toast({
      title: "剪贴板不可用",
      description: "您的浏览器或环境不支持剪贴板功能，请手动复制内容",
      variant: "default",
    })
    return true // 表示已处理
  }
  return false // 表示未处理
} 
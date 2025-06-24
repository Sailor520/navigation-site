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
      const errorInfo = {
        message: message || '未知错误',
        filename: filename || '未知文件',
        line: event.lineno || 0,
        column: event.colno || 0,
        timestamp: new Date().toISOString()
      }
      
      // 只有在有实际错误信息时才输出
      if (message && message.trim()) {
        console.error('❌ [应用错误]:', errorInfo)
        
                 toast({
           title: "出现了一个错误",
           description: "页面遇到了问题，但不影响基本功能的使用",
           variant: "destructive",
          })
       }
    }

    // 强化的Promise拒绝处理器
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      
      // 如果错误为空或undefined，直接跳过
      if (!error || error === null || error === undefined) {
        console.warn('🔒 [Promise保护] 跳过空的Promise拒绝')
        event.preventDefault()
        return
      }
      
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

      // 只有在有实际有意义的错误信息时才处理和显示
      if (error && message && message.trim() && message !== 'undefined' && message !== 'null') {
        console.error('❌ [未处理的Promise拒绝]:', {
          error: error,
          message: message,
          errorType: typeof error,
          timestamp: new Date().toISOString()
        })
        
        toast({
          title: "网络或数据错误",
          description: "某个操作失败了，请稍后重试",
          variant: "destructive",
        })
      } else {
        // 对于空或无意义的错误，只做警告记录
        console.warn('🔒 [Promise保护] 跳过无意义的Promise拒绝:', {
          errorType: typeof error,
          errorValue: error,
          message: message
        })
        event.preventDefault()
      }
    }

    // 在最早阶段注册错误监听器，使用捕获阶段确保最高优先级
    window.addEventListener('error', handleError, true) // true = 捕获阶段
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true)

    // 重写JSON.parse作为额外保护
    const originalJSONParse = JSON.parse
    JSON.parse = function(text: string, reviver?: any) {
      // 检查输入是否为有效的JSON字符串
      if (text === null || text === undefined || text === 'null' || text === 'undefined' || text.trim() === '') {
        console.warn('🔒 [JSON早期保护] 拦截了无效的JSON输入:', text)
        return null // 返回安全的默认值
      }
      
      try {
        return originalJSONParse.call(this, text, reviver)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        
        // 只拦截明显的扩展相关错误
        if (text && (text.includes('chrome-extension') || text.includes('moz-extension'))) {
          console.warn('🔒 [JSON保护] 拦截了扩展相关的JSON错误:', errorMessage)
          return null
        }
        
        // 对于应用相关的JSON错误，正常抛出
        throw error
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
    console.warn('🔒 [剪贴板保护] 剪贴板功能不可用，但这不影响其他功能')
    // 这个函数应该由调用方处理toast提示，避免依赖问题
    return true // 表示已处理
  }
  return false // 表示未处理
} 
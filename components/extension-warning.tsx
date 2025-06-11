"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ExtensionWarning() {
  const [show, setShow] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // 检查是否之前已经显示过警告
    const hasShownWarning = localStorage.getItem('extension-warning-shown')
    if (hasShownWarning) {
      setHasShown(true)
      return
    }

    // 监听扩展相关错误
    const handleExtensionError = (event: ErrorEvent) => {
      const error = event.error || event.message
      
      const isExtensionError = 
        error?.stack?.includes?.('chrome-extension://') ||
        error?.message?.includes?.('chrome-extension') ||
        (error?.message?.includes?.('undefined') && error?.message?.includes?.('JSON'))

      if (isExtensionError && !hasShown && !show) {
        setShow(true)
        setHasShown(true)
        // 记录已显示过警告
        localStorage.setItem('extension-warning-shown', 'true')
      }
    }

    window.addEventListener('error', handleExtensionError, true)

    return () => {
      window.removeEventListener('error', handleExtensionError, true)
    }
  }, [hasShown, show])

  if (!show) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert className="border-amber-200 bg-amber-50 text-amber-800">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="flex items-center justify-between">
          检测到浏览器扩展干扰
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 text-amber-600 hover:text-amber-800"
            onClick={() => setShow(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </AlertTitle>
        <AlertDescription className="mt-2 text-sm">
          为了获得更好的使用体验，建议：
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>使用无痕模式浏览</li>
            <li>临时禁用不必要的浏览器扩展</li>
          </ul>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-amber-700 border-amber-300 hover:bg-amber-100"
              onClick={() => {
                window.open(window.location.href, '_blank')
              }}
            >
              无痕模式打开
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-amber-600"
              onClick={() => setShow(false)}
            >
              我知道了
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
} 
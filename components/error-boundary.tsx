"use client"

import React, { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误信息
    console.error("ErrorBoundary caught an error:", error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // 检查是否是Chrome扩展相关错误
    const isExtensionError = error.stack?.includes("chrome-extension://") ||
                            error.message?.includes("chrome-extension") ||
                            error.message?.includes("undefined") && error.message?.includes("JSON")

    if (isExtensionError) {
      console.warn("检测到浏览器扩展错误，这不会影响网站正常功能")
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state
      const isExtensionError = error?.stack?.includes("chrome-extension://") ||
                             error?.message?.includes("chrome-extension") ||
                             (error?.message?.includes("undefined") && error?.message?.includes("JSON"))

      // 如果有自定义fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">
                {isExtensionError ? "浏览器扩展冲突" : "出现错误"}
              </CardTitle>
              <CardDescription>
                {isExtensionError 
                  ? "检测到浏览器扩展引起的错误，这不会影响网站的正常功能。"
                  : "应用程序遇到了意外错误，请尝试刷新页面。"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isExtensionError && (
                <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                  <p className="font-medium">建议解决方案：</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>尝试禁用浏览器扩展</li>
                    <li>使用无痕模式浏览</li>
                    <li>更新浏览器到最新版本</li>
                  </ul>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={this.handleReset} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isExtensionError ? "继续使用" : "重试"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  刷新页面
                </Button>
              </div>

              {process.env.NODE_ENV === "development" && error && (
                <details className="mt-4 rounded-lg bg-gray-50 p-3 text-sm">
                  <summary className="cursor-pointer font-medium">错误详情 (开发模式)</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-words text-xs">
                    {error.toString()}
                    {error.stack && `\n\n${error.stack}`}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook版本的错误边界，用于函数组件
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
} 
"use client"

import React from "react"
import { Button } from "@/components/ui/button"

interface ChunkErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ChunkErrorBoundaryProps {
  children: React.ReactNode
}

export class ChunkErrorBoundary extends React.Component<
  ChunkErrorBoundaryProps,
  ChunkErrorBoundaryState
> {
  constructor(props: ChunkErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ChunkErrorBoundaryState {
    // 检查是否是代码分割相关错误
    const isChunkError = 
      error.name === 'ChunkLoadError' ||
      error.message.includes('Loading chunk') ||
      error.message.includes('timeout') ||
      error.message.includes('failed to import')

    if (isChunkError) {
      console.warn('🔧 [代码分割边界] 捕获到代码块加载错误:', error.message)
    }

    return {
      hasError: true,
      error: error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误详情
    console.error('🔧 [代码分割边界] 详细错误信息:', {
      error: error,
      errorInfo: errorInfo,
      timestamp: new Date().toISOString()
    })

    // 如果是代码分割错误，自动尝试恢复
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }

  handleRetry = () => {
    // 清除错误状态并重新加载页面
    this.setState({ hasError: false })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.error
      const isChunkError = 
        error?.name === 'ChunkLoadError' ||
        error?.message.includes('Loading chunk') ||
        error?.message.includes('timeout')

      if (isChunkError) {
        return (
          <div className="flex min-h-screen flex-col items-center justify-center space-y-4 text-center p-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">页面加载遇到问题</h2>
              <p className="text-muted-foreground max-w-md">
                应用资源加载失败，这通常是网络问题导致的。页面将自动重新加载...
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={this.handleRetry}>
                立即重新加载
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
              >
                返回首页
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground max-w-md">
              <details>
                <summary className="cursor-pointer">技术详情</summary>
                <pre className="mt-2 text-left overflow-auto bg-muted p-2 rounded">
                  {error?.message}
                </pre>
              </details>
            </div>
          </div>
        )
      }

      // 对于其他类型的错误，显示通用错误页面
      return (
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4 text-center p-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">出现了一个错误</h2>
            <p className="text-muted-foreground max-w-md">
              应用遇到了意外错误，请尝试刷新页面。
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={this.handleRetry}>
              刷新页面
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
            >
              返回首页
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 
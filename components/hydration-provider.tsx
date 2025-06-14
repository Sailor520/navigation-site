"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useDataStore } from "@/lib/store"
import { initAutoBackup, setupBackupOnUnload } from "@/lib/auto-backup"

interface HydrationProviderProps {
  children: ReactNode
}

/**
 * 专门处理Zustand store hydration的Provider组件
 * 确保应用启动时store数据正确初始化
 */
export function HydrationProvider({ children }: HydrationProviderProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let mounted = true
    
    // 检查是否已经有数据
    const checkAndSetReady = () => {
      const state = useDataStore.getState()
      console.log('🔄 检查Store状态:', { 
        categoriesCount: state.categories.length, 
        websitesCount: state.websites.length,
        isReady 
      })
      
      // 如果有数据就设置为ready
      if (state.categories.length > 0 && mounted) {
        console.log('✅ 数据已就绪，启动应用')
        setIsReady(true)
        return true
      }
      return false
    }

    // 立即检查一次
    if (checkAndSetReady()) {
      return
    }

    // 监听hydration完成事件
    const unsubFinishHydration = useDataStore.persist.onFinishHydration(() => {
      console.log('🔧 Hydration完成，重新检查数据')
      checkAndSetReady()
    })

    // 设置超时保护
    const timeoutId = setTimeout(() => {
      if (!isReady && mounted) {
        console.warn('⏰ Hydration超时，强制启动应用')
        setIsReady(true)
      }
    }, 1500)

    return () => {
      mounted = false
      unsubFinishHydration()
      clearTimeout(timeoutId)
    }
  }, [])

  // 在组件挂载后初始化自动备份
  useEffect(() => {
    if (isReady) {
      console.log('🛡️ 初始化自动备份系统')
      initAutoBackup()
      setupBackupOnUnload()
    }
  }, [isReady])

  // 在ready之前显示加载状态
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">应用初始化中...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 
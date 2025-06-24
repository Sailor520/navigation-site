import { useEffect, useState, useRef } from 'react'
import { useSmartDataStore } from './smart-data-store'

/**
 * 确保智能数据存储已正确初始化和加载的hook
 * 解决SSR和客户端状态不匹配的问题，支持多数据源
 * 实时监听数据变化，确保主页面与管理页面数据同步
 */
export function useHydratedStore() {
  const [isHydrated, setIsHydrated] = useState(false)
  const initializeCalledRef = useRef(false)
  
  // 直接从智能数据存储获取状态，确保实时同步
  const { 
    categories, 
    websites, 
    isInitialized, 
    isLoading, 
    dataSource, 
    initialize 
  } = useSmartDataStore()

  // 只在初始化时执行一次
  useEffect(() => {
    const initializeStore = async () => {
      if (initializeCalledRef.current) return
      initializeCalledRef.current = true
      
      try {
        if (!isInitialized) {
          console.log('🔄 正在初始化智能数据存储...')
          await initialize()
        }
        
        // 当数据加载完成时设置为已hydrated
        if (isInitialized && !isLoading) {
          console.log('✅ 智能数据存储初始化完成')
          setIsHydrated(true)
        }
      } catch (error) {
        console.error('❌ 智能数据存储初始化失败:', error)
        // 即使失败也设置为已hydrated，避免无限加载
        setIsHydrated(true)
      }
    }

    initializeStore()
  }, [isInitialized, isLoading, initialize])

  // 实时监听数据变化 - 确保主页面与管理页面同步
  useEffect(() => {
    if (isInitialized && !isLoading) {
      console.log('🔄 数据状态更新:', {
        categories: categories.length,
        websites: websites.length,
        dataSource,
        isHydrated
      })
      
      // 确保hydrated状态正确
      if (!isHydrated) {
        setIsHydrated(true)
      }
    }
  }, [categories.length, websites.length, isInitialized, isLoading, dataSource, isHydrated])

  // 超时保护 - 确保不会无限等待，只执行一次
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isHydrated) {
        console.log('⏰ Hydration超时，强制设置为已完成')
        setIsHydrated(true)
      }
    }, 5000)

    return () => clearTimeout(timeoutId)
  }, [isHydrated])

  return {
    isHydrated,
    categories,
    websites,
    dataSource,
    isLoading,
  }
} 
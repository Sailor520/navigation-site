import { useEffect, useState } from 'react'
import { useDataStore } from './store'

/**
 * 确保Zustand store的数据已正确hydration的hook
 * 解决SSR和客户端状态不匹配的问题
 */
export function useHydratedStore() {
  const [isHydrated, setIsHydrated] = useState(false)
  const categories = useDataStore((state) => state.categories)
  const websites = useDataStore((state) => state.websites)

  useEffect(() => {
    console.log('useHydratedStore Effect - categories.length:', categories.length, 'websites.length:', websites.length)
    
    // 监听hydration完成
    const unsubFinishHydration = useDataStore.persist.onFinishHydration(() => {
      console.log('Hydration完成')
      setIsHydrated(true)
    })

    // 手动触发rehydrate确保数据加载
    useDataStore.persist.rehydrate()

    // 超时保护 - 无论是否有数据都要设置为已hydration
    const timeoutId = setTimeout(() => {
      console.log('Hydration超时，强制设置为已完成')
      setIsHydrated(true)
    }, 2000)

    return () => {
      unsubFinishHydration()
      clearTimeout(timeoutId)
    }
  }, [])

  return {
    isHydrated,
    categories,
    websites,
  }
} 
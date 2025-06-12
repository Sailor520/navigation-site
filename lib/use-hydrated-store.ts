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
    // 检查是否有数据
    if (categories.length > 0) {
      setIsHydrated(true)
      return
    }

    // 监听hydration完成
    const unsubFinishHydration = useDataStore.persist.onFinishHydration(() => {
      setIsHydrated(true)
    })

    // 超时保护
    const timeoutId = setTimeout(() => {
      setIsHydrated(true)
    }, 1000)

    return () => {
      unsubFinishHydration()
      clearTimeout(timeoutId)
    }
  }, [categories.length])

  return {
    isHydrated,
    categories,
    websites,
  }
} 
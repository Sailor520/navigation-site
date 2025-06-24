"use client"

import { create } from "zustand"
import type { Category, Website } from "@/lib/types"
import { useDataStore } from './store'
import { useSupabaseDataStore } from './supabase-data-store'

interface SmartDataState {
  categories: Category[]
  websites: Website[]
  isLoading: boolean
  error: string | null
  dataSource: 'localStorage' | 'supabase' | 'unknown'
  isInitialized: boolean
  
  // 初始化
  initialize: () => Promise<void>
  
  // 数据加载
  loadData: () => Promise<void>
  
  // 分类操作
  setCategories: (categories: Category[]) => void
  addCategory: (category: Category) => Promise<void>
  updateCategory: (categoryId: string, updates: Partial<Category>) => Promise<void>
  deleteCategory: (categoryId: string) => Promise<void>
  reorderCategories: (categories: Category[]) => Promise<void>
  
  // 网站操作  
  setWebsites: (websites: Website[]) => void
  addWebsite: (website: Website) => Promise<void>
  updateWebsite: (websiteId: string, updates: Partial<Website>) => Promise<void>
  deleteWebsite: (websiteId: string) => Promise<void>
  reorderWebsitesInCategory: (categoryId: string, websiteIds: string[]) => Promise<void>
  toggleWebsiteFeatured: (websiteId: string) => Promise<void>
  toggleWebsiteHot: (websiteId: string) => Promise<void>
  moveWebsiteToCategory: (websiteId: string, categoryId: string) => Promise<void>
  
  // 查询方法
  getWebsitesByCategory: (categoryId: string) => Website[]
  getFeaturedWebsites: () => Website[]
  
  // 数据源切换
  switchToSupabase: () => Promise<void>
  
  // 错误处理
  setError: (error: string | null) => void
  clearError: () => void
}

/**
 * 检查Supabase是否可用
 */
function hasSupabaseConfig(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(supabaseUrl && supabaseAnonKey)
}

/**
 * 检查是否已经迁移到Supabase
 */
function isMigratedToSupabase(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('supabase-migration-completed') === 'true'
}

export const useSmartDataStore = create<SmartDataState>((set, get) => ({
  categories: [],
  websites: [],
  isLoading: false,
  error: null,
  dataSource: 'unknown',
  isInitialized: false,

  // 初始化 - 智能选择数据源
  initialize: async () => {
    const { isInitialized } = get()
    if (isInitialized) return
    
    console.log('🚀 初始化智能数据存储')
    
    // 检查Supabase配置并尝试使用
    let dataSource: 'localStorage' | 'supabase' = 'localStorage'
    
    // 检查环境变量是否配置
    const hasConfig = hasSupabaseConfig()
    console.log('🔍 Supabase配置检查:', hasConfig)
    
    if (hasConfig) {
      try {
        // 测试Supabase连接
        const supabaseStore = useSupabaseDataStore.getState()
        await supabaseStore.loadData()
        
        if (!supabaseStore.error) {
          dataSource = 'supabase'
          console.log('✅ Supabase连接成功，使用云端数据库')
        } else {
          console.warn('⚠️ Supabase连接失败，使用localStorage:', supabaseStore.error)
        }
      } catch (error) {
        console.warn('⚠️ Supabase测试失败，使用localStorage:', error)
      }
    } else {
      console.log('📝 未配置Supabase环境变量，使用localStorage')
    }
    
    set({ dataSource })
    await get().loadData()
    set({ isInitialized: true })
  },

  // 加载数据
  loadData: async () => {
    try {
      set({ isLoading: true, error: null })
      const { dataSource } = get()
      
      console.log('🔄 开始加载数据，数据源:', dataSource)
      
      if (dataSource === 'supabase') {
        try {
          // 尝试使用Supabase数据源
          const supabaseStore = useSupabaseDataStore.getState()
          console.log('📡 尝试连接Supabase并加载数据...')
          
          await supabaseStore.loadData()
          
          // 检查是否有错误或数据为空
          if (supabaseStore.error) {
            throw new Error(`Supabase错误: ${supabaseStore.error}`)
          }
          
          const hasSupabaseData = supabaseStore.categories.length > 0 || supabaseStore.websites.length > 0
          
          if (hasSupabaseData) {
            set({ 
              categories: supabaseStore.categories,
              websites: supabaseStore.websites,
              error: null,
              isLoading: false 
            })
            console.log('✅ Supabase数据加载成功:', {
              categories: supabaseStore.categories.length,
              websites: supabaseStore.websites.length
            })
          } else {
            console.log('⚠️ Supabase连接成功但无数据，检查是否需要初始化...')
            
            // 检查localStorage是否有数据可以迁移
            const localStore = useDataStore.getState()
            const hasLocalData = localStore.categories.length > 0 || localStore.websites.length > 0
            
            if (hasLocalData) {
              console.log('📦 发现本地数据，将自动迁移到Supabase')
              
              // 使用批量初始化而不是逐个添加，避免状态重复累积
              try {
                await supabaseStore.initializeData?.(localStore.categories, localStore.websites)
                await supabaseStore.loadData()
                set({ 
                  categories: supabaseStore.categories,
                  websites: supabaseStore.websites,
                  isLoading: false 
                })
                console.log('✅ 本地数据批量迁移完成')
              } catch (error) {
                console.error('批量迁移失败，回退到逐个添加:', error)
                // 回退到逐个添加的方式
                for (const category of localStore.categories) {
                  try {
                    await supabaseStore.addCategory(category)
                  } catch (error) {
                    console.warn('分类迁移失败:', category.name, error)
                  }
                }
                
                for (const website of localStore.websites) {
                  try {
                    await supabaseStore.addWebsite(website)
                  } catch (error) {
                    console.warn('网站迁移失败:', website.name, error)
                  }
                }
                
                // 重新加载数据
                await supabaseStore.loadData()
                set({ 
                  categories: supabaseStore.categories,
                  websites: supabaseStore.websites,
                  isLoading: false 
                })
                console.log('✅ 逐个迁移完成')
              }
            } else {
              // 使用默认初始数据
              console.log('📋 使用默认初始数据')
              const { defaultCategories, defaultWebsites } = await import('./store')
              
              // 初始化Supabase数据
              try {
                await supabaseStore.initializeData?.(defaultCategories, defaultWebsites)
                await supabaseStore.loadData()
                set({ 
                  categories: supabaseStore.categories,
                  websites: supabaseStore.websites,
                  isLoading: false 
                })
                console.log('✅ 默认数据初始化完成')
              } catch (initError) {
                console.error('初始化Supabase数据失败:', initError)
                throw initError
              }
            }
          }
        } catch (supabaseError) {
          console.warn('⚠️ Supabase加载失败，回退到localStorage:', supabaseError)
          
          // 回退到localStorage
          set({ dataSource: 'localStorage' })
          const localStore = useDataStore.getState()
          
          // 确保localStorage有数据
          if (localStore.categories.length === 0 && localStore.websites.length === 0) {
            console.log('📋 localStorage也为空，触发rehydrate')
            await localStore.persist.rehydrate()
          }
          
          set({ 
            categories: localStore.categories,
            websites: localStore.websites,
            isLoading: false,
            error: null
          })
          
          console.log('✅ 已回退到localStorage数据源:', {
            categories: localStore.categories.length,
            websites: localStore.websites.length
          })
        }
      } else {
        // 使用localStorage数据源
        console.log('📂 使用localStorage数据源')
        const localStore = useDataStore.getState()
        
        // 如果数据为空，尝试rehydrate
        if (localStore.categories.length === 0 && localStore.websites.length === 0) {
          console.log('📋 触发localStorage rehydrate')
          await localStore.persist.rehydrate()
          
          // 等待一小段时间让rehydrate完成
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        
        set({ 
          categories: localStore.categories,
          websites: localStore.websites,
          isLoading: false 
        })
        
        console.log('✅ localStorage数据加载完成:', {
          categories: localStore.categories.length,
          websites: localStore.websites.length
        })
      }
    } catch (error) {
      console.error('❌ 加载数据失败:', error)
      
      // 最后的兜底方案：强制回退到localStorage
      set({ dataSource: 'localStorage' })
      const localStore = useDataStore.getState()
      
      set({ 
        categories: localStore.categories,
        websites: localStore.websites,
        error: error instanceof Error ? error.message : '加载数据失败',
        isLoading: false 
      })
      
      console.log('🛡️ 使用兜底方案，回退到localStorage')
    }
  },

  // 分类操作
  setCategories: (categories) => set({ categories }),
  
  addCategory: async (category) => {
    const { dataSource } = get()
    
    if (dataSource === 'supabase') {
      const supabaseStore = useSupabaseDataStore.getState()
      await supabaseStore.addCategory(category)
      // 直接使用已更新的状态，不需要重新加载
      set({ categories: supabaseStore.categories })
    } else {
      const localStore = useDataStore.getState()
      localStore.addCategory(category)
      set({ categories: localStore.categories })
    }
  },

  updateCategory: async (categoryId, updates) => {
    const { dataSource } = get()
    
    if (dataSource === 'supabase') {
      const supabaseStore = useSupabaseDataStore.getState()
      await supabaseStore.updateCategory(categoryId, updates)
      set({ categories: supabaseStore.categories })
    } else {
      // localStorage版本暂不支持updateCategory，需要实现
      console.warn('localStorage版本暂不支持updateCategory')
    }
  },

  deleteCategory: async (categoryId) => {
    const { dataSource } = get()
    
    if (dataSource === 'supabase') {
      const supabaseStore = useSupabaseDataStore.getState()
      await supabaseStore.deleteCategory(categoryId)
      set({ 
        categories: supabaseStore.categories,
        websites: supabaseStore.websites 
      })
    } else {
      // localStorage版本暂不支持deleteCategory，需要实现
      console.warn('localStorage版本暂不支持deleteCategory')
    }
  },

  reorderCategories: async (categories) => {
    const { dataSource } = get()
    
    if (dataSource === 'supabase') {
      const supabaseStore = useSupabaseDataStore.getState()
      await supabaseStore.reorderCategories(categories)
      set({ categories: supabaseStore.categories })
    } else {
      const localStore = useDataStore.getState()
      localStore.reorderCategories(categories)
      set({ categories: localStore.categories })
    }
  },

  // 网站操作
  setWebsites: (websites) => set({ websites }),
  
  addWebsite: async (website) => {
    const { dataSource } = get()
    
    if (dataSource === 'supabase') {
      const supabaseStore = useSupabaseDataStore.getState()
      await supabaseStore.addWebsite(website)
      // 直接使用已更新的状态，不需要重新加载
      set({ websites: supabaseStore.websites })
    } else {
      const localStore = useDataStore.getState()
      localStore.addWebsite(website)
      set({ websites: localStore.websites })
    }
  },

  updateWebsite: async (websiteId, updates) => {
    const { dataSource } = get()
    
    if (dataSource === 'supabase') {
      const supabaseStore = useSupabaseDataStore.getState()
      await supabaseStore.updateWebsite(websiteId, updates)
      set({ websites: supabaseStore.websites })
    } else {
      const localStore = useDataStore.getState()
      localStore.updateWebsite(websiteId, updates)
      set({ websites: localStore.websites })
    }
  },

  deleteWebsite: async (websiteId) => {
    const { dataSource } = get()
    
    if (dataSource === 'supabase') {
      const supabaseStore = useSupabaseDataStore.getState()
      await supabaseStore.deleteWebsite(websiteId)
      set({ websites: supabaseStore.websites })
    } else {
      const localStore = useDataStore.getState()
      localStore.deleteWebsite(websiteId)
      set({ websites: localStore.websites })
    }
  },

  reorderWebsitesInCategory: async (categoryId, websiteIds) => {
    const { dataSource } = get()
    
    if (dataSource === 'supabase') {
      const supabaseStore = useSupabaseDataStore.getState()
      await supabaseStore.reorderWebsitesInCategory(categoryId, websiteIds)
      set({ websites: supabaseStore.websites })
    } else {
      const localStore = useDataStore.getState()
      localStore.reorderWebsitesInCategory(categoryId, websiteIds)
      set({ websites: localStore.websites })
    }
  },

  toggleWebsiteFeatured: async (websiteId) => {
    const { dataSource } = get()
    
    try {
      // 乐观更新：先更新本地状态，提供即时反馈
      const currentWebsites = get().websites
      const optimisticWebsites = currentWebsites.map(website =>
        website.id === websiteId 
          ? { ...website, isFeatured: !website.isFeatured }
          : website
      )
      set({ websites: optimisticWebsites })
      
      console.log('⭐ 乐观更新精品状态:', websiteId)
      
      // 然后进行数据库更新
      if (dataSource === 'supabase') {
        const supabaseStore = useSupabaseDataStore.getState()
        await supabaseStore.toggleWebsiteFeatured(websiteId)
        
        // 确保状态同步：用数据库的最新状态覆盖本地状态
        console.log('✅ 精品状态数据库更新完成，同步最新状态')
        set({ websites: supabaseStore.websites })
      } else {
        const localStore = useDataStore.getState()
        localStore.toggleWebsiteFeatured(websiteId)
        set({ websites: localStore.websites })
      }
      
      console.log('✅ 精品状态切换完成')
    } catch (error) {
      console.error('❌ 精品状态切换失败，恢复原状态:', error)
      
      // 错误时恢复原状态
      const currentWebsites = get().websites
      const revertedWebsites = currentWebsites.map(website =>
        website.id === websiteId 
          ? { ...website, isFeatured: !website.isFeatured }
          : website
      )
      set({ websites: revertedWebsites })
      
      // 重新抛出错误，让UI组件可以处理
      throw error
    }
  },

  toggleWebsiteHot: async (websiteId) => {
    const { dataSource } = get()
    
    try {
      // 乐观更新：先更新本地状态，提供即时反馈
      const currentWebsites = get().websites
      const optimisticWebsites = currentWebsites.map(website =>
        website.id === websiteId 
          ? { ...website, isHot: !website.isHot }
          : website
      )
      set({ websites: optimisticWebsites })
      
      console.log('🔥 乐观更新热门状态:', websiteId)
      
      // 然后进行数据库更新
      if (dataSource === 'supabase') {
        const supabaseStore = useSupabaseDataStore.getState()
        await supabaseStore.toggleWebsiteHot(websiteId)
        
        // 确保状态同步：用数据库的最新状态覆盖本地状态
        console.log('✅ 热门状态数据库更新完成，同步最新状态')
        set({ websites: supabaseStore.websites })
      } else {
        const localStore = useDataStore.getState()
        localStore.toggleWebsiteHot(websiteId)
        set({ websites: localStore.websites })
      }
      
      console.log('✅ 热门状态切换完成')
    } catch (error) {
      console.error('❌ 热门状态切换失败，恢复原状态:', error)
      
      // 错误时恢复原状态
      const currentWebsites = get().websites
      const revertedWebsites = currentWebsites.map(website =>
        website.id === websiteId 
          ? { ...website, isHot: !website.isHot }
          : website
      )
      set({ websites: revertedWebsites })
      
      // 重新抛出错误，让UI组件可以处理
      throw error
    }
  },

  moveWebsiteToCategory: async (websiteId, categoryId) => {
    const { dataSource } = get()
    
    if (dataSource === 'supabase') {
      const supabaseStore = useSupabaseDataStore.getState()
      await supabaseStore.moveWebsiteToCategory(websiteId, categoryId)
      set({ websites: supabaseStore.websites })
    } else {
      const localStore = useDataStore.getState()
      localStore.moveWebsiteToCategory(websiteId, categoryId)
      set({ websites: localStore.websites })
    }
  },

  // 查询方法
  getWebsitesByCategory: (categoryId) => {
    const { websites } = get()
    return websites.filter((website) => website.categoryIds.includes(categoryId))
  },

  getFeaturedWebsites: () => {
    const { websites } = get()
    return websites.filter((website) => website.isFeatured)
  },

  // 切换到Supabase
  switchToSupabase: async () => {
    console.log('🔄 切换到Supabase数据源')
    set({ dataSource: 'supabase' })
    
    // 标记已迁移
    if (typeof window !== 'undefined') {
      localStorage.setItem('supabase-migration-completed', 'true')
    }
    
    await get().loadData()
  },

  // 错误处理
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}))

// 自动初始化
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useSmartDataStore.getState().initialize()
  }, 100)
}

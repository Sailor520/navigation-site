"use client"

import { create } from "zustand"
import type { Category, Website } from "@/lib/types"
import { 
  getCategories, 
  getWebsites, 
  addCategory as addCategoryDB, 
  updateCategory as updateCategoryDB,
  deleteCategory as deleteCategoryDB,
  addWebsite as addWebsiteDB,
  updateWebsite as updateWebsiteDB,
  deleteWebsite as deleteWebsiteDB,
  reorderCategories as reorderCategoriesDB,
  reorderWebsites as reorderWebsitesDB,
  initializeData as initializeDataDB
} from './supabase-store'

interface SupabaseDataState {
  categories: Category[]
  websites: Website[]
  isLoading: boolean
  error: string | null
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
  
  // 错误处理
  setError: (error: string | null) => void
  clearError: () => void
  
  // 初始化数据
  initializeData: (categories: Category[], websites: Website[]) => Promise<void>
}

export const useSupabaseDataStore = create<SupabaseDataState>((set, get) => ({
  categories: [],
  websites: [],
  isLoading: false,
  error: null,
  isInitialized: false,

  // 初始化 - 只在首次使用时调用
  initialize: async () => {
    const { isInitialized } = get()
    if (isInitialized) return
    
    console.log('🚀 初始化Supabase数据存储')
    await get().loadData()
    set({ isInitialized: true })
  },

  // 加载所有数据
  loadData: async () => {
    try {
      set({ isLoading: true, error: null })
      console.log('📥 从Supabase加载数据')
      
      const [categories, websites] = await Promise.all([
        getCategories(),
        getWebsites()
      ])
      
      console.log('✅ 数据加载成功', { 
        categories: categories.length, 
        websites: websites.length 
      })
      
      set({ 
        categories, 
        websites, 
        isLoading: false 
      })
    } catch (error) {
      console.error('❌ 加载数据失败:', error)
      set({ 
        error: error instanceof Error ? error.message : '加载数据失败',
        isLoading: false 
      })
    }
  },

  // 分类操作
  setCategories: (categories) => set({ categories }),
  
  addCategory: async (category) => {
    try {
      set({ error: null })
      console.log('➕ 添加分类:', category.name)
      
      const newCategory = await addCategoryDB(category)
      
      set((state) => ({
        categories: [...state.categories, newCategory]
      }))
      
      console.log('✅ 分类添加成功:', newCategory.name)
    } catch (error) {
      console.error('❌ 添加分类失败:', error)
      const errorMessage = error instanceof Error ? error.message : '添加分类失败'
      set({ error: errorMessage })
      throw error
    }
  },

  updateCategory: async (categoryId, updates) => {
    try {
      set({ error: null })
      console.log('✏️ 更新分类:', categoryId, updates)
      
      const updated = await updateCategoryDB(categoryId, updates)
      
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === categoryId ? updated : category
        )
      }))
      
      console.log('✅ 分类更新成功:', updated.name)
    } catch (error) {
      console.error('❌ 更新分类失败:', error)
      const errorMessage = error instanceof Error ? error.message : '更新分类失败'
      set({ error: errorMessage })
      throw error
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      set({ error: null })
      console.log('🗑️ 删除分类:', categoryId)
      
      await deleteCategoryDB(categoryId)
      
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== categoryId),
        websites: state.websites.map((website) => ({
          ...website,
          categoryIds: website.categoryIds.filter((id) => id !== categoryId)
        }))
      }))
      
      console.log('✅ 分类删除成功')
    } catch (error) {
      console.error('❌ 删除分类失败:', error)
      const errorMessage = error instanceof Error ? error.message : '删除分类失败'
      set({ error: errorMessage })
      throw error
    }
  },

  reorderCategories: async (categories) => {
    try {
      set({ error: null })
      console.log('🔄 重新排序分类')
      
      await reorderCategoriesDB(categories)
      set({ categories })
      
      console.log('✅ 分类排序成功')
    } catch (error) {
      console.error('❌ 重新排序分类失败:', error)
      const errorMessage = error instanceof Error ? error.message : '重新排序分类失败'
      set({ error: errorMessage })
      throw error
    }
  },

  // 网站操作
  setWebsites: (websites) => set({ websites }),
  
  addWebsite: async (website) => {
    try {
      set({ error: null })
      console.log('➕ 添加网站:', website.name)
      console.log('📊 网站数据:', {
        id: website.id,
        name: website.name,
        url: website.url,
        categoryIds: website.categoryIds,
        description: website.description?.length || 0,
        logo: website.logo?.length || 0
      })
      
      // 验证分类ID是否存在
      const { categories } = get()
      const validCategoryIds = website.categoryIds.filter(id => 
        categories.some(cat => cat.id === id)
      )
      
      if (validCategoryIds.length !== website.categoryIds.length) {
        console.warn('⚠️ 部分分类ID无效:', {
          原始: website.categoryIds,
          有效: validCategoryIds,
          无效: website.categoryIds.filter(id => !validCategoryIds.includes(id))
        })
      }
      
      // 使用有效的分类ID
      const websiteWithValidCategories = {
        ...website,
        categoryIds: validCategoryIds.length > 0 ? validCategoryIds : categories.slice(0, 1).map(c => c.id)
      }
      
      const newWebsite = await addWebsiteDB(websiteWithValidCategories)
      
      set((state) => ({
        websites: [...state.websites, newWebsite]
      }))
      
      console.log('✅ 网站添加成功:', newWebsite.name)
    } catch (error) {
      console.error('❌ 添加网站失败:', error)
      const errorMessage = error instanceof Error ? error.message : '添加网站失败'
      set({ error: errorMessage })
      throw error
    }
  },

  updateWebsite: async (websiteId, updates) => {
    try {
      set({ error: null })
      console.log('✏️ 更新网站:', websiteId, updates)
      
      const updated = await updateWebsiteDB(websiteId, updates)
      
      set((state) => ({
        websites: state.websites.map((website) =>
          website.id === websiteId ? updated : website
        )
      }))
      
      console.log('✅ 网站更新成功:', updated.name)
    } catch (error) {
      console.error('❌ 更新网站失败:', error)
      const errorMessage = error instanceof Error ? error.message : '更新网站失败'
      set({ error: errorMessage })
      throw error
    }
  },

  deleteWebsite: async (websiteId) => {
    try {
      set({ error: null })
      console.log('🗑️ 删除网站:', websiteId)
      
      await deleteWebsiteDB(websiteId)
      
      set((state) => ({
        websites: state.websites.filter((website) => website.id !== websiteId)
      }))
      
      console.log('✅ 网站删除成功')
    } catch (error) {
      console.error('❌ 删除网站失败:', error)
      const errorMessage = error instanceof Error ? error.message : '删除网站失败'
      set({ error: errorMessage })
      throw error
    }
  },

  reorderWebsitesInCategory: async (categoryId, websiteIds) => {
    try {
      set({ error: null })
      console.log('🔄 重新排序网站 - 分类:', categoryId, '网站IDs:', websiteIds)
      
      // 直接调用底层数据库方法进行排序
      await reorderWebsitesDB(categoryId, websiteIds)
      
      // 重新加载数据以确保本地状态同步
      await get().loadData()
      
      console.log('✅ 网站排序成功')
    } catch (error) {
      console.error('❌ 重新排序网站失败:', error)
      const errorMessage = error instanceof Error ? error.message : '重新排序网站失败'
      set({ error: errorMessage })
      throw error
    }
  },

  toggleWebsiteFeatured: async (websiteId) => {
    try {
      set({ error: null })
      console.log('⭐ 切换网站精品状态:', websiteId)
      
      const { websites } = get()
      const website = websites.find(w => w.id === websiteId)
      if (!website) throw new Error('网站不存在')
      
      const updated = await updateWebsiteDB(websiteId, {
        isFeatured: !website.isFeatured
      })
      
      set((state) => ({
        websites: state.websites.map((w) =>
          w.id === websiteId ? updated : w
        )
      }))
      
      console.log('✅ 精品状态切换成功')
    } catch (error) {
      console.error('❌ 切换精品状态失败:', error)
      const errorMessage = error instanceof Error ? error.message : '切换精品状态失败'
      set({ error: errorMessage })
      throw error
    }
  },

  toggleWebsiteHot: async (websiteId) => {
    try {
      set({ error: null })
      console.log('🔥 切换网站热门状态:', websiteId)
      
      const { websites } = get()
      const website = websites.find(w => w.id === websiteId)
      if (!website) throw new Error('网站不存在')
      
      const updated = await updateWebsiteDB(websiteId, {
        isHot: !website.isHot
      })
      
      set((state) => ({
        websites: state.websites.map((w) =>
          w.id === websiteId ? updated : w
        )
      }))
      
      console.log('✅ 热门状态切换成功')
    } catch (error) {
      console.error('❌ 切换热门状态失败:', error)
      const errorMessage = error instanceof Error ? error.message : '切换热门状态失败'
      set({ error: errorMessage })
      throw error
    }
  },

  moveWebsiteToCategory: async (websiteId, categoryId) => {
    try {
      set({ error: null })
      console.log('📁 移动网站到分类:', websiteId, '->', categoryId)
      
      const { websites } = get()
      const website = websites.find(w => w.id === websiteId)
      if (!website) throw new Error('网站不存在')
      
      const newCategoryIds = website.categoryIds.includes(categoryId)
        ? website.categoryIds
        : [...website.categoryIds, categoryId]
      
      const updated = await updateWebsiteDB(websiteId, {
        categoryIds: newCategoryIds
      })
      
      set((state) => ({
        websites: state.websites.map((w) =>
          w.id === websiteId ? updated : w
        )
      }))
      
      console.log('✅ 网站移动成功')
    } catch (error) {
      console.error('❌ 移动网站失败:', error)
      const errorMessage = error instanceof Error ? error.message : '移动网站失败'
      set({ error: errorMessage })
      throw error
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

  // 错误处理
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  // 初始化数据
  initializeData: async (categories, websites) => {
    try {
      set({ error: null })
      console.log('📥 初始化数据')
      
      await initializeDataDB(categories, websites)
      
      set({ 
        categories, 
        websites, 
        isLoading: false 
      })
      
      console.log('✅ 数据初始化成功')
    } catch (error) {
      console.error('❌ 初始化数据失败:', error)
      const errorMessage = error instanceof Error ? error.message : '初始化数据失败'
      set({ 
        error: errorMessage,
        isLoading: false 
      })
      throw error
    }
  }
}))

// 自动初始化 - 移除自动初始化，由智能数据存储控制
// if (typeof window !== 'undefined') {
//   // 延迟初始化以避免SSR问题
//   setTimeout(() => {
//     useSupabaseDataStore.getState().initialize()
//   }, 100)
// } 
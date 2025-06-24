"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Category, Website } from "@/lib/types"

interface SidebarState {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  toggleSidebar: () => void
}

interface AdminState {
  isAdminMode: boolean
  setAdminMode: (isAdmin: boolean) => void
}

interface DataState {
  categories: Category[]
  websites: Website[]
  setCategories: (categories: Category[]) => void
  setWebsites: (websites: Website[]) => void
  addCategory: (category: Category) => void
  addWebsite: (website: Website) => void
  updateWebsite: (websiteId: string, updates: Partial<Website>) => void
  deleteWebsite: (websiteId: string) => void
  reorderCategories: (categories: Category[]) => void
  reorderWebsitesInCategory: (categoryId: string, websiteIds: string[]) => void
  toggleWebsiteFeatured: (websiteId: string) => void
  toggleWebsiteHot: (websiteId: string) => void
  moveWebsiteToCategory: (websiteId: string, categoryId: string) => void
  getWebsitesByCategory: (categoryId: string) => Website[]
  getFeaturedWebsites: () => Website[]
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdminMode: false,
      setAdminMode: (isAdmin) => {
        console.log("设置管理员模式:", isAdmin)
        set({ isAdminMode: isAdmin })
      },
    }),
    {
      name: "admin-mode",
    },
  ),
)

// 初始数据 - 更新为多分类格式
const defaultCategories: Category[] = [
  {
    id: "1",
    name: "社交媒体",
    slug: "social-media",
    description: "各类社交媒体平台",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "在线教育",
    slug: "online-education",
    description: "在线学习平台和教育资源",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "实用工具",
    slug: "useful-tools",
    description: "实用的在线工具和服务",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "技术博客",
    slug: "tech-blogs",
    description: "技术相关的博客和资讯",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const defaultWebsites: Website[] = [
  {
    id: "1",
    name: "GitHub",
    url: "https://github.com",
    description: "全球最大的代码托管平台",
    logo: "",
    categoryIds: ["4"],
    isFeatured: true,
    isHot: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Stack Overflow",
    url: "https://stackoverflow.com",
    description: "程序员问答社区",
    logo: "",
    categoryIds: ["4"],
    isFeatured: false,
    isHot: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Coursera",
    url: "https://coursera.org",
    description: "在线课程平台",
    logo: "",
    categoryIds: ["2"],
    isFeatured: true,
    isHot: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Figma",
    url: "https://figma.com",
    description: "在线设计工具",
    logo: "",
    categoryIds: ["3"],
    isFeatured: false,
    isHot: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Notion",
    url: "https://notion.so",
    description: "多功能笔记和协作工具",
    logo: "",
    categoryIds: ["3"],
    isFeatured: true,
    isHot: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Discord",
    url: "https://discord.com",
    description: "游戏社交平台",
    logo: "",
    categoryIds: ["1"],
    isFeatured: false,
    isHot: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Twitter",
    url: "https://twitter.com",
    description: "微博社交平台",
    logo: "",
    categoryIds: ["1"],
    isFeatured: false,
    isHot: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "YouTube",
    url: "https://youtube.com",
    description: "视频分享平台",
    logo: "",
    categoryIds: ["1", "2"],
    isFeatured: true,
    isHot: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// 导出默认数据
export { defaultCategories, defaultWebsites }

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      categories: defaultCategories,
      websites: defaultWebsites,
      setCategories: (categories: Category[]) => set({ categories }),
      setWebsites: (websites: Website[]) => set({ websites }),
      addCategory: (category: Category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),
      addWebsite: (website: Website) =>
        set((state) => ({
          websites: [...state.websites, website],
        })),
      updateWebsite: (websiteId: string, updates: Partial<Website>) =>
        set((state) => ({
          websites: state.websites.map((website) => (website.id === websiteId ? { ...website, ...updates } : website)),
        })),
      deleteWebsite: (websiteId: string) =>
        set((state) => ({
          websites: state.websites.filter((website) => website.id !== websiteId),
        })),
      reorderCategories: (categories: Category[]) => set({ categories }),
              reorderWebsitesInCategory: (categoryId: string, websiteIds: string[]) => {
        console.log('🔄 重新排序网站 - 分类:', categoryId, '网站IDs:', websiteIds)
        
        set((state) => ({
          websites: state.websites.map((website) => {
            if (websiteIds.includes(website.id)) {
              const newOrder = websiteIds.indexOf(website.id)
              return {
                ...website,
                order: newOrder,
                updatedAt: new Date().toISOString(),
              }
            }
            return website
          }),
        }))
      },
      toggleWebsiteFeatured: (websiteId: string) => {
        console.log('⭐ 切换网站精品状态:', websiteId)
        set((state) => {
          const updatedWebsites = state.websites.map((website) =>
            website.id === websiteId ? { ...website, isFeatured: !website.isFeatured } : website
          )
          return { websites: updatedWebsites }
        })
      },
      toggleWebsiteHot: (websiteId: string) => {
        console.log('🔥 切换网站热门状态:', websiteId)
        set((state) => {
          const updatedWebsites = state.websites.map((website) =>
            website.id === websiteId ? { ...website, isHot: !website.isHot } : website
          )
          return { websites: updatedWebsites }
        })
      },
      moveWebsiteToCategory: (websiteId: string, categoryId: string) => {
        set((state) => ({
          websites: state.websites.map((website) =>
            website.id === websiteId
              ? {
                  ...website,
                  categoryIds: website.categoryIds.includes(categoryId)
                    ? website.categoryIds
                    : [...website.categoryIds, categoryId],
                }
              : website
          ),
        }))
      },
      getWebsitesByCategory: (categoryId: string) => {
        const { websites } = get()
        return websites.filter((website) => website.categoryIds.includes(categoryId))
      },
      getFeaturedWebsites: () => {
        const { websites } = get()
        return websites.filter((website) => website.isFeatured)
      },
    }),
    {
      name: "navigation-data",
      partialize: (state) => ({
        categories: state.categories,
        websites: state.websites,
      }),
      skipHydration: true,
      // 强化merge函数，绝对确保管理员数据不被覆盖
      merge: (persistedState: any, currentState: any) => {
        console.log('🔄 merge函数被调用')
        console.log('📥 persistedState:', persistedState)
        console.log('🔧 currentState keys:', Object.keys(currentState))
        
        // 如果没有持久化数据，使用初始数据
        if (!persistedState || typeof persistedState !== 'object') {
          console.log('❌ 没有持久化数据，使用初始数据')
          console.log('📊 初始数据统计 - categories:', defaultCategories.length, 'websites:', defaultWebsites.length)
          return {
            ...currentState,
            categories: defaultCategories,
            websites: defaultWebsites,
          }
        }
        
        // 检查持久化数据的完整性和有效性
        const hasPersistedCategories = persistedState.categories && 
          Array.isArray(persistedState.categories) && 
          persistedState.categories.length > 0
        
        const hasPersistedWebsites = persistedState.websites && 
          Array.isArray(persistedState.websites) && 
          persistedState.websites.length > 0
        
        console.log('🔍 数据检查结果:')
        console.log('  - 有持久化分类:', hasPersistedCategories, '数量:', persistedState.categories?.length || 0)
        console.log('  - 有持久化网站:', hasPersistedWebsites, '数量:', persistedState.websites?.length || 0)
        
        // 如果有任何持久化的用户数据，优先保护用户数据
        if (hasPersistedCategories || hasPersistedWebsites) {
          console.log('✅ 检测到用户数据，优先使用持久化数据')
          console.log('🛡️ 保护用户数据 - categories:', persistedState.categories?.length, 'websites:', persistedState.websites?.length)
          
          // 创建安全的合并结果
          const safeResult = {
            ...currentState,
            categories: hasPersistedCategories ? persistedState.categories : defaultCategories,
            websites: hasPersistedWebsites ? persistedState.websites : defaultWebsites,
          }
          
          console.log('📤 merge结果 - categories:', safeResult.categories.length, 'websites:', safeResult.websites.length)
          return safeResult
        }
        
        // 如果持久化数据存在但为空，使用初始数据
        console.log('⚠️ 持久化数据为空，使用初始数据')
        return {
          ...currentState,
          categories: defaultCategories,
          websites: defaultWebsites,
        }
      },
      // 添加版本控制和错误处理
      version: 2,
      migrate: (persistedState: any, version: number) => {
        console.log('migrate函数被调用 - version:', version, 'persistedState:', persistedState)
        
        if (version === 0 || version === 1) {
          // 处理旧版本数据，确保数据结构正确
          if (persistedState && typeof persistedState === 'object') {
            return {
              categories: persistedState.categories || [],
              websites: persistedState.websites || [],
            }
          }
        }
        return persistedState
      },
    },
  ),
)

// 手动触发hydration
if (typeof window !== 'undefined') {
  useDataStore.persist.rehydrate()
}

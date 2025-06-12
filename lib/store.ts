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
const initialCategories: Category[] = [
  {
    id: "1",
    name: "社交媒体",
    slug: "social-media",
    description: "各类社交媒体平台",
  },
  {
    id: "2",
    name: "学习资源",
    slug: "learning-resources",
    description: "在线学习平台和教育资源",
  },
  {
    id: "3",
    name: "工具网站",
    slug: "tools",
    description: "实用的在线工具和服务",
  },
  {
    id: "4",
    name: "技术博客",
    slug: "tech-blogs",
    description: "技术相关的博客和资讯",
  },
]

const initialWebsites: Website[] = [
  {
    id: "1",
    name: "GitHub",
    url: "https://github.com",
    description: "面向开源及私有软件项目的托管平台",
    logo: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
    categoryIds: ["3"], // 改为数组
    createdAt: new Date(),
    isFeatured: false,
    isHot: false,
  },
  {
    id: "2",
    name: "Stack Overflow",
    url: "https://stackoverflow.com",
    description: "程序设计领域的问答网站",
    logo: "https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png",
    categoryIds: ["3", "2"], // 多分类示例
    createdAt: new Date(),
    isFeatured: false,
    isHot: false,
  },
  {
    id: "3",
    name: "Twitter",
    url: "https://twitter.com",
    description: "社交网络及微博客服务",
    logo: "https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png",
    categoryIds: ["1"],
    createdAt: new Date(),
    isFeatured: false,
    isHot: false,
  },
  {
    id: "4",
    name: "Coursera",
    url: "https://www.coursera.org",
    description: "大规模开放在线课程平台",
    logo: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera.s3.amazonaws.com/media/coursera-logo-square.png",
    categoryIds: ["2"],
    createdAt: new Date(),
    isFeatured: false,
    isHot: false,
  },
  {
    id: "5",
    name: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "Web技术的学习平台",
    logo: "https://developer.mozilla.org/apple-touch-icon.6803c6f0.png",
    categoryIds: ["2", "4"], // 多分类示例
    createdAt: new Date(),
    isFeatured: false,
    isHot: false,
  },
  {
    id: "6",
    name: "CSS-Tricks",
    url: "https://css-tricks.com",
    description: "关于CSS、HTML等前端技术的博客",
    logo: "https://css-tricks.com/apple-touch-icon.png",
    categoryIds: ["4"],
    createdAt: new Date(),
    isFeatured: false,
    isHot: false,
  },
  {
    id: "7",
    name: "Smashing Magazine",
    url: "https://www.smashingmagazine.com",
    description: "为Web设计师和开发者提供的专业杂志",
    logo: "https://www.smashingmagazine.com/images/favicon/apple-touch-icon.png",
    categoryIds: ["4"],
    createdAt: new Date(),
    isFeatured: false,
    isHot: false,
  },
  {
    id: "8",
    name: "LinkedIn",
    url: "https://www.linkedin.com",
    description: "商业和就业导向的社交网络服务",
    logo: "https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca",
    categoryIds: ["1"],
    createdAt: new Date(),
    isFeatured: false,
    isHot: false,
  },
]

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      categories: initialCategories,
      websites: initialWebsites,
      setCategories: (categories) => set({ categories }),
      setWebsites: (websites) => set({ websites }),
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),
      addWebsite: (website) =>
        set((state) => ({
          websites: [...state.websites, website],
        })),
      updateWebsite: (websiteId, updates) =>
        set((state) => ({
          websites: state.websites.map((website) => (website.id === websiteId ? { ...website, ...updates } : website)),
        })),
      deleteWebsite: (websiteId) =>
        set((state) => ({
          websites: state.websites.filter((website) => website.id !== websiteId),
        })),
      reorderCategories: (categories) => set({ categories }),
      toggleWebsiteFeatured: (websiteId) => {
        console.log("执行切换精品状态:", websiteId)
        set((state) => {
          const updatedWebsites = state.websites.map((website) =>
            website.id === websiteId ? { ...website, isFeatured: !website.isFeatured } : website,
          )
          return { websites: updatedWebsites }
        })
      },
      toggleWebsiteHot: (websiteId) => {
        console.log("执行切换热门状态:", websiteId)
        set((state) => {
          const updatedWebsites = state.websites.map((website) =>
            website.id === websiteId ? { ...website, isHot: !website.isHot } : website,
          )
          return { websites: updatedWebsites }
        })
      },
      moveWebsiteToCategory: (websiteId, categoryId) => {
        set((state) => ({
          websites: state.websites.map((website) =>
            website.id === websiteId
              ? {
                  ...website,
                  categoryIds: website.categoryIds.includes(categoryId)
                    ? website.categoryIds
                    : [...website.categoryIds, categoryId],
                }
              : website,
          ),
        }))
      },
      getWebsitesByCategory: (categoryId) => {
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
      // 增加merge函数，确保初始数据正确合并
      merge: (persistedState, currentState) => {
        // 如果没有持久化数据，使用当前状态（包含初始数据）
        if (!persistedState) {
          return currentState
        }
        
        // 如果有持久化数据，合并状态
        return {
          ...currentState,
          ...persistedState,
        }
      },
      // 添加版本控制和错误处理
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // 处理旧版本数据
          return persistedState
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

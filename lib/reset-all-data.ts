"use client"

import { supabase } from './supabase'
import type { Category, Website } from './types'

// 最原始的4个基础分类（去重后的标准版本）
export const CLEAN_INITIAL_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "社交媒体",
    slug: "social-media", 
    description: "各类社交媒体平台",
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2", 
    name: "学习资源",
    slug: "learning-resources",
    description: "在线学习平台和教育资源",
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "工具网站", 
    slug: "tools",
    description: "实用的在线工具和服务",
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "技术博客",
    slug: "tech-blogs", 
    description: "技术相关的博客和资讯",
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

export const CLEAN_INITIAL_WEBSITES: Website[] = [
  {
    id: "1",
    name: "GitHub",
    url: "https://github.com",
    description: "全球最大的代码托管平台",
    logo: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
    categoryIds: ["3"],
    createdAt: new Date().toISOString(),
    isFeatured: true,
    isHot: false,
    order: 0,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2", 
    name: "Stack Overflow",
    url: "https://stackoverflow.com",
    description: "程序员问答社区",
    logo: "https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png",
    categoryIds: ["3"],
    createdAt: new Date().toISOString(),
    isFeatured: false,
    isHot: true,
    order: 1,
    updatedAt: new Date().toISOString(),
  }
]

// 去重函数
export function deduplicateCategories(categories: Category[]): Category[] {
  const seen = new Set<string>()
  return categories.filter(category => {
    if (seen.has(category.id)) {
      console.warn('发现重复分类ID:', category.id, category.name)
      return false
    }
    seen.add(category.id)
    return true
  })
}

export function deduplicateWebsites(websites: Website[]): Website[] {
  const seen = new Set<string>()
  return websites.filter(website => {
    if (seen.has(website.id)) {
      console.warn('发现重复网站ID:', website.id, website.name)
      return false
    }
    seen.add(website.id)
    return true
  })
}

// 完整重置功能
export class DataReset {
  /**
   * 清除localStorage中的所有数据
   */
  static clearLocalStorage(): void {
    if (typeof window === 'undefined') return
    
    console.log('🧹 清除localStorage数据...')
    
    // 清除主数据
    localStorage.removeItem('navigation-data')
    
    // 清除其他可能的相关数据
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.includes('navigation') || key.includes('admin') || key.includes('data'))) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => {
      console.log('移除localStorage键:', key)
      localStorage.removeItem(key)
    })
    
    console.log('✅ localStorage清理完成')
  }

  /**
   * 清除Supabase数据库中的所有数据
   */
  static async clearSupabaseData(): Promise<void> {
    try {
      console.log('🧹 清除Supabase数据...')
      
      // 删除所有网站数据
      const { error: websitesError } = await supabase
        .from('websites')
        .delete()
        .neq('id', 'impossible-id') // 删除所有记录的技巧
      
      if (websitesError) {
        console.warn('清除网站数据失败:', websitesError)
      }
      
      // 删除所有分类数据
      const { error: categoriesError } = await supabase
        .from('categories')
        .delete()
        .neq('id', 'impossible-id') // 删除所有记录的技巧
      
      if (categoriesError) {
        console.warn('清除分类数据失败:', categoriesError)
      }
      
      console.log('✅ Supabase数据清理完成')
    } catch (error) {
      console.error('❌ 清除Supabase数据失败:', error)
      throw error
    }
  }

  /**
   * 重新初始化干净的数据到Supabase
   */
  static async initializeCleanData(): Promise<void> {
    try {
      console.log('📥 初始化干净的数据到Supabase...')
      
      // 插入干净的分类数据
      const { error: categoriesError } = await supabase
        .from('categories')
        .insert(CLEAN_INITIAL_CATEGORIES.map(category => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          order_index: category.order || 0,
          created_at: category.createdAt,
          updated_at: category.updatedAt,
        })))
      
      if (categoriesError) {
        console.error('插入分类数据失败:', categoriesError)
        throw categoriesError
      }
      
      // 插入干净的网站数据
      const { error: websitesError } = await supabase
        .from('websites')
        .insert(CLEAN_INITIAL_WEBSITES.map(website => ({
          id: website.id,
          name: website.name,
          url: website.url,
          description: website.description,
          logo: website.logo,
          category_ids: website.categoryIds,
          is_featured: website.isFeatured,
          is_hot: website.isHot,
          order_index: website.order || 0,
          created_at: typeof website.createdAt === 'string' ? website.createdAt : new Date().toISOString(),
          updated_at: typeof website.updatedAt === 'string' ? website.updatedAt : new Date().toISOString(),
        })))
      
      if (websitesError) {
        console.error('插入网站数据失败:', websitesError)
        throw websitesError
      }
      
      console.log('✅ 干净数据初始化完成')
    } catch (error) {
      console.error('❌ 初始化干净数据失败:', error)
      throw error
    }
  }

  /**
   * 完整重置：清除所有数据并重新初始化
   */
  static async fullReset(): Promise<void> {
    try {
      console.log('🔄 开始完整数据重置...')
      
      // 1. 清除localStorage
      this.clearLocalStorage()
      
      // 2. 清除Supabase数据
      await this.clearSupabaseData()
      
      // 3. 重新初始化干净数据
      await this.initializeCleanData()
      
      console.log('✅ 完整数据重置成功！')
      console.log('请刷新页面以加载干净的数据')
      
    } catch (error) {
      console.error('❌ 完整数据重置失败:', error)
      throw error
    }
  }

  /**
   * 验证数据完整性
   */
  static async validateData(): Promise<{ categories: number, websites: number, duplicates: boolean }> {
    try {
      // 从Supabase获取数据
      const { data: categories } = await supabase
        .from('categories')
        .select('*')
      
      const { data: websites } = await supabase
        .from('websites')
        .select('*')
      
      // 检查重复
      const categoryIds = (categories || []).map((c: any) => c.id)
      const websiteIds = (websites || []).map((w: any) => w.id)
      
      const uniqueCategoryIds = [...new Set(categoryIds)]
      const uniqueWebsiteIds = [...new Set(websiteIds)]
      
      const hasDuplicates = categoryIds.length !== uniqueCategoryIds.length || 
                           websiteIds.length !== uniqueWebsiteIds.length
      
      console.log('📊 数据验证结果:', {
        categories: categories?.length || 0,
        websites: websites?.length || 0,
        duplicates: hasDuplicates
      })
      
      return {
        categories: categories?.length || 0,
        websites: websites?.length || 0,
        duplicates: hasDuplicates
      }
    } catch (error) {
      console.error('❌ 数据验证失败:', error)
      throw error
    }
  }
} 
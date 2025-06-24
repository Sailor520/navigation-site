import { supabase } from './supabase'
import type { Category, Website } from './types'
import type { Database } from './types/database'
import { validateWebsiteInsert } from './validate-supabase-insert'

type CategoryRow = Database['public']['Tables']['categories']['Row']
type WebsiteRow = Database['public']['Tables']['websites']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']
type WebsiteInsert = Database['public']['Tables']['websites']['Insert']

// 数据转换函数
const dbCategoryToCategory = (dbCategory: CategoryRow): Category => ({
  id: dbCategory.id,
  name: dbCategory.name,
  slug: dbCategory.slug,
  description: dbCategory.description || '',
  order: dbCategory.order_index,
  createdAt: dbCategory.created_at,
  updatedAt: dbCategory.updated_at,
})

const categoryToDbCategory = (category: Category): CategoryInsert => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  order_index: category.order || 0,
})

const dbWebsiteToWebsite = (dbWebsite: WebsiteRow): Website => ({
  id: dbWebsite.id,
  name: dbWebsite.name,
  url: dbWebsite.url,
  description: dbWebsite.description || '',
  logo: dbWebsite.logo,
  categoryIds: dbWebsite.category_ids || [],
  isFeatured: dbWebsite.is_featured,
  isHot: dbWebsite.is_hot,
  order: dbWebsite.order_index,
  createdAt: dbWebsite.created_at,
  updatedAt: dbWebsite.updated_at,
})

const websiteToDbWebsite = (website: Website): WebsiteInsert => ({
  id: website.id,
  name: website.name,
  url: website.url,
  description: website.description || '',
  logo: website.logo || '',
  category_ids: website.categoryIds || [],
  is_featured: website.isFeatured || false,
  is_hot: website.isHot || false,
  order_index: website.order || 0,
  created_at: website.createdAt || new Date().toISOString(),
  updated_at: website.updatedAt || new Date().toISOString(),
})

// 分类操作
export const supabaseStore = {
  // 获取所有分类
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('获取分类失败:', error)
      throw error
    }

    return data.map(dbCategoryToCategory)
  },

  // 添加分类
  async addCategory(category: Category): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryToDbCategory(category))
      .select()
      .single()

    if (error) {
      console.error('添加分类失败:', error)
      throw error
    }

    return dbCategoryToCategory(data)
  },

  // 更新分类
  async updateCategory(categoryId: string, updates: Partial<Category>): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .update({
        name: updates.name,
        slug: updates.slug,
        description: updates.description,
        order_index: updates.order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', categoryId)

    if (error) {
      console.error('更新分类失败:', error)
      throw error
    }
  },

  // 删除分类
  async deleteCategory(categoryId: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (error) {
      console.error('删除分类失败:', error)
      throw error
    }
  },

  // 重新排序分类
  async reorderCategories(categories: Category[]): Promise<void> {
    console.log('🔄 开始重新排序分类，数量:', categories.length)
    
    if (categories.length === 0) {
      console.log('⚠️ 没有需要更新的分类')
      return
    }

    try {
      // 逐个更新每个分类的排序索引，这样更安全
      const updatePromises = categories.map(async (category, index) => {
        const { error } = await supabase
          .from('categories')
          .update({ 
            order_index: index,
            updated_at: new Date().toISOString()
          })
          .eq('id', category.id)

        if (error) {
          console.error(`更新分类 ${category.id} 排序失败:`, error)
          throw error
        }
        
        console.log(`✅ 分类 ${category.name} 排序更新为 ${index}`)
        return true
      })

      await Promise.all(updatePromises)
      console.log('✅ 所有分类排序更新完成')
    } catch (error) {
      console.error('重新排序分类失败:', error)
      throw error
    }
  },

  // 获取所有网站
  async getWebsites(): Promise<Website[]> {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('获取网站失败:', error)
      throw error
    }

    return data.map(dbWebsiteToWebsite)
  },

  // 添加网站
  async addWebsite(website: Website): Promise<Website> {
    const dbWebsite = websiteToDbWebsite(website)
    console.log('🔄 准备插入网站数据:', dbWebsite)
    
    // 验证数据
    const validation = await validateWebsiteInsert(dbWebsite)
    if (!validation.valid) {
      console.error('❌ 数据验证失败:', validation.error)
      throw new Error('数据验证失败: ' + validation.error)
    }
    
    const { data, error } = await supabase
      .from('websites')
      .insert(dbWebsite)
      .select()
      .single()

    if (error) {
      console.error('❌ 添加网站失败:')
      console.error('错误消息:', error.message || '未知错误')
      console.error('错误代码:', error.code || '无代码')
      console.error('错误详情:', error.details || '无详情')
      console.error('错误提示:', error.hint || '无提示')
      
      // 尝试不同的方式打印错误对象
      console.error('完整错误对象:')
      console.dir(error, { depth: null })
      console.table(error)
      
      console.error('📊 尝试插入的数据:')
      console.dir(dbWebsite, { depth: null })
      console.table(dbWebsite)
      
      // 额外的调试信息
      console.error('数据类型检查:')
      Object.entries(dbWebsite).forEach(([key, value]) => {
        console.error(`- ${key}: ${typeof value} = ${Array.isArray(value) ? '[Array]' : value}`)
      })
      
      throw error
    }

    console.log('✅ 网站添加成功:', data)
    return dbWebsiteToWebsite(data)
  },

  // 更新网站
  async updateWebsite(websiteId: string, updates: Partial<Website>): Promise<Website> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.url !== undefined) updateData.url = updates.url
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.logo !== undefined) updateData.logo = updates.logo
    if (updates.categoryIds !== undefined) updateData.category_ids = updates.categoryIds || []
    if (updates.isFeatured !== undefined) updateData.is_featured = updates.isFeatured
    if (updates.isHot !== undefined) updateData.is_hot = updates.isHot
    if (updates.order !== undefined) updateData.order_index = updates.order

    const { data, error } = await supabase
      .from('websites')
      .update(updateData)
      .eq('id', websiteId)
      .select()
      .single()

    if (error) {
      console.error('更新网站失败:', error)
      throw error
    }

    console.log('✅ 网站更新成功:', data)
    return dbWebsiteToWebsite(data)
  },

  // 删除网站
  async deleteWebsite(websiteId: string): Promise<void> {
    const { error } = await supabase
      .from('websites')
      .delete()
      .eq('id', websiteId)

    if (error) {
      console.error('删除网站失败:', error)
      throw error
    }
  },

  // 切换网站精品状态
  async toggleWebsiteFeatured(websiteId: string): Promise<void> {
    // 获取当前状态
    const { data: website, error: fetchError } = await supabase
      .from('websites')
      .select('is_featured')
      .eq('id', websiteId)
      .single()

    if (fetchError) {
      console.error('获取网站状态失败:', fetchError)
      throw fetchError
    }

    // 切换状态
    const { error } = await supabase
      .from('websites')
      .update({ 
        is_featured: !website.is_featured,
        updated_at: new Date().toISOString()
      })
      .eq('id', websiteId)

    if (error) {
      console.error('切换精品状态失败:', error)
      throw error
    }
  },

  // 切换网站热门状态
  async toggleWebsiteHot(websiteId: string): Promise<void> {
    // 获取当前状态
    const { data: website, error: fetchError } = await supabase
      .from('websites')
      .select('is_hot')
      .eq('id', websiteId)
      .single()

    if (fetchError) {
      console.error('获取网站状态失败:', fetchError)
      throw fetchError
    }

    // 切换状态
    const { error } = await supabase
      .from('websites')
      .update({ 
        is_hot: !website.is_hot,
        updated_at: new Date().toISOString()
      })
      .eq('id', websiteId)

    if (error) {
      console.error('切换热门状态失败:', error)
      throw error
    }
  },

  // 重新排序分类中的网站
  async reorderWebsitesInCategory(categoryId: string, websiteIds: string[]): Promise<void> {
    console.log('🔄 开始重新排序网站 - 分类:', categoryId, '网站IDs:', websiteIds)
    
    if (websiteIds.length === 0) {
      console.log('⚠️ 没有需要更新的网站')
      return
    }

    try {
      // 逐个更新每个网站的排序索引，这样更安全
      const updatePromises = websiteIds.map(async (websiteId, index) => {
        const { error } = await supabase
          .from('websites')
          .update({ 
            order_index: index,
            updated_at: new Date().toISOString()
          })
          .eq('id', websiteId)

        if (error) {
          console.error(`更新网站 ${websiteId} 排序失败:`, error)
          throw error
        }
        
        console.log(`✅ 网站 ${websiteId} 排序更新为 ${index}`)
        return true
      })

      await Promise.all(updatePromises)
      console.log('✅ 所有网站排序更新完成')
    } catch (error) {
      console.error('重新排序网站失败:', error)
      throw error
    }
  },

  // 移动网站到分类（支持多分类）
  async moveWebsiteToCategory(websiteId: string, categoryId: string): Promise<void> {
    // 获取当前网站数据
    const { data: website, error: fetchError } = await supabase
      .from('websites')
      .select('category_ids')
      .eq('id', websiteId)
      .single()

    if (fetchError) {
      console.error('获取网站数据失败:', fetchError)
      throw fetchError
    }

    // 添加新分类到category_ids数组（如果不存在）
    const currentCategoryIds = website.category_ids || []
    const newCategoryIds = currentCategoryIds.includes(categoryId) 
      ? currentCategoryIds 
      : [...currentCategoryIds, categoryId]

    const { error } = await supabase
      .from('websites')
      .update({
        category_ids: newCategoryIds,
        updated_at: new Date().toISOString(),
      })
      .eq('id', websiteId)

    if (error) {
      console.error('移动网站到分类失败:', error)
      throw error
    }
  },

  // 初始化数据（迁移localStorage数据到Supabase）
  async initializeData(categories: Category[], websites: Website[]): Promise<void> {
    try {
      // 检查是否已有数据
      const { data: existingCategories } = await supabase
        .from('categories')
        .select('id')
        .limit(1)

      const { data: existingWebsites } = await supabase
        .from('websites')
        .select('id')
        .limit(1)

      // 如果没有数据，则初始化
      if (!existingCategories?.length && !existingWebsites?.length) {
        console.log('🔄 开始初始化数据到Supabase...')

        // 插入分类
        if (categories.length > 0) {
          const { error: categoriesError } = await supabase
            .from('categories')
            .insert(categories.map(categoryToDbCategory))

          if (categoriesError) {
            console.error('初始化分类失败:', categoriesError)
            throw categoriesError
          }
        }

        // 插入网站
        if (websites.length > 0) {
          const { error: websitesError } = await supabase
            .from('websites')
            .insert(websites.map(websiteToDbWebsite))

          if (websitesError) {
            console.error('初始化网站失败:', websitesError)
            throw websitesError
          }
        }

        console.log('✅ 数据初始化完成')
      }
    } catch (error) {
      console.error('初始化数据失败:', error)
      throw error
    }
  },
} 
// 导出单独的函数以便于导入
export const getCategories = supabaseStore.getCategories;
export const addCategory = supabaseStore.addCategory;
export const updateCategory = supabaseStore.updateCategory;
export const deleteCategory = supabaseStore.deleteCategory;
export const reorderCategories = supabaseStore.reorderCategories;

export const getWebsites = supabaseStore.getWebsites;
export const addWebsite = supabaseStore.addWebsite;
export const updateWebsite = supabaseStore.updateWebsite;
export const deleteWebsite = supabaseStore.deleteWebsite;
export const reorderWebsites = supabaseStore.reorderWebsitesInCategory;
export const toggleWebsiteFeatured = supabaseStore.toggleWebsiteFeatured;
export const toggleWebsiteHot = supabaseStore.toggleWebsiteHot;
export const moveWebsiteToCategory = supabaseStore.moveWebsiteToCategory;
export const initializeData = supabaseStore.initializeData;


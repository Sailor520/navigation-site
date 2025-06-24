"use client"

import { useState, useEffect } from 'react'
import { useDataStore } from './store'
import { useSupabaseDataStore } from './supabase-data-store'
import type { Category, Website } from './types'

interface MigrationResult {
  success: boolean
  message: string
  categoriesCount?: number
  websitesCount?: number
  error?: string
}

/**
 * 改进的数据迁移工具
 */
export class DataMigrationImproved {
  
  /**
   * 检查是否有Supabase配置
   */
  static hasSupabaseConfig(): boolean {
    if (typeof window === 'undefined') return false
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    return !!(supabaseUrl && supabaseAnonKey)
  }

  /**
   * 检查localStorage是否有数据且未迁移
   */
  static shouldShowMigrationPrompt(): boolean {
    if (!this.hasSupabaseConfig()) return false
    if (typeof window === 'undefined') return false
    
    try {
      // 检查是否已经迁移过的标记
      const migrationFlag = localStorage.getItem('supabase-migration-completed')
      if (migrationFlag === 'true') return false
      
      // 检查是否手动隐藏了迁移提示
      const hideFlag = localStorage.getItem('hide-migration-prompt')
      if (hideFlag === 'true') return false
      
      // 检查localStorage是否有数据
      const localData = localStorage.getItem('navigation-data')
      if (!localData) return false
      
      const parsed = JSON.parse(localData)
      const hasCategories = parsed?.state?.categories?.length > 0
      const hasWebsites = parsed?.state?.websites?.length > 0
      
      return hasCategories || hasWebsites
    } catch (error) {
      console.error('检查迁移状态失败:', error)
      return false
    }
  }

  /**
   * 获取localStorage中的数据
   */
  static getLocalStorageData(): { categories: Category[], websites: Website[] } | null {
    if (typeof window === 'undefined') return null
    
    try {
      const localData = localStorage.getItem('navigation-data')
      if (!localData) return null
      
      const parsed = JSON.parse(localData)
      const categories = parsed?.state?.categories || []
      const websites = parsed?.state?.websites || []
      
      return { categories, websites }
    } catch (error) {
      console.error('获取localStorage数据失败:', error)
      return null
    }
  }

  /**
   * 执行数据迁移
   */
  static async migrateToSupabase(): Promise<MigrationResult> {
    try {
      console.log('🚀 开始数据迁移...')
      
      if (!this.hasSupabaseConfig()) {
        return {
          success: false,
          message: 'Supabase配置不完整',
          error: 'MISSING_CONFIG'
        }
      }
      
      // 检查localStorage数据
      const localData = this.getLocalStorageData()
      if (!localData) {
        return {
          success: false,
          message: '没有找到本地数据',
          error: 'NO_LOCAL_DATA'
        }
      }

      const { categories, websites } = localData
      console.log('📊 发现本地数据:', { 
        categories: categories.length, 
        websites: websites.length 
      })

      // 获取Supabase store
      const supabaseStore = useSupabaseDataStore.getState()
      
      // 确保Supabase已初始化
      await supabaseStore.initialize()
      
      let migratedCategories = 0
      let migratedWebsites = 0

      // 迁移分类
      console.log('📁 开始迁移分类...')
      for (const category of categories) {
        try {
          await supabaseStore.addCategory(category)
          migratedCategories++
          console.log(`✅ 分类迁移成功: ${category.name}`)
        } catch (error) {
          console.warn(`⚠️ 分类迁移失败: ${category.name}`, error)
          // 继续迁移其他分类
        }
      }

      // 迁移网站
      console.log('🌐 开始迁移网站...')
      for (const website of websites) {
        try {
          await supabaseStore.addWebsite(website)
          migratedWebsites++
          console.log(`✅ 网站迁移成功: ${website.name}`)
        } catch (error) {
          console.warn(`⚠️ 网站迁移失败: ${website.name}`, error)
          // 继续迁移其他网站
        }
      }

      // 重新加载数据以确保同步
      await supabaseStore.loadData()

      // 标记迁移完成
      localStorage.setItem('supabase-migration-completed', 'true')

      const result: MigrationResult = {
        success: true,
        message: `数据迁移完成！成功迁移 ${migratedCategories} 个分类和 ${migratedWebsites} 个网站`,
        categoriesCount: migratedCategories,
        websitesCount: migratedWebsites
      }

      console.log('🎉 数据迁移完成:', result)
      return result

    } catch (error) {
      console.error('❌ 数据迁移失败:', error)
      return {
        success: false,
        message: '数据迁移失败',
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  /**
   * 清理localStorage数据（迁移成功后）
   */
  static clearLocalStorageData(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem('navigation-data')
      console.log('🧹 localStorage数据已清理')
    } catch (error) {
      console.error('清理localStorage失败:', error)
    }
  }

  /**
   * 备份localStorage数据
   */
  static backupLocalStorageData(): string | null {
    if (typeof window === 'undefined') return null
    
    try {
      const localData = localStorage.getItem('navigation-data')
      if (!localData) return null
      
      const backup = {
        timestamp: new Date().toISOString(),
        data: JSON.parse(localData)
      }
      
      return JSON.stringify(backup, null, 2)
    } catch (error) {
      console.error('备份localStorage数据失败:', error)
      return null
    }
  }

  /**
   * 重置迁移状态（用于测试）
   */
  static resetMigrationFlag(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('supabase-migration-completed')
  }

  /**
   * 隐藏迁移提示
   */
  static hideMigrationPrompt(): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('hide-migration-prompt', 'true')
  }
}

/**
 * React Hook for improved data migration
 */
export function useDataMigrationImproved() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<MigrationResult | null>(null)
  
  const shouldShow = DataMigrationImproved.shouldShowMigrationPrompt()
  const hasSupabaseConfig = DataMigrationImproved.hasSupabaseConfig()
  
  const migrate = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const migrationResult = await DataMigrationImproved.migrateToSupabase()
      setResult(migrationResult)
      
      // 如果迁移成功，可选择性清理localStorage
      if (migrationResult.success) {
        // 暂时不清理localStorage，让用户选择
        console.log('🎯 迁移成功，数据已同步到Supabase')
      }
    } catch (error) {
      setResult({
        success: false,
        message: '迁移过程中发生错误',
        error: error instanceof Error ? error.message : '未知错误'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const backup = () => {
    return DataMigrationImproved.backupLocalStorageData()
  }
  
  const clearLocalData = () => {
    DataMigrationImproved.clearLocalStorageData()
  }

  const hidePrompt = () => {
    DataMigrationImproved.hideMigrationPrompt()
  }
  
  return {
    shouldShow,
    hasSupabaseConfig,
    isLoading,
    result,
    migrate,
    backup,
    clearLocalData,
    hidePrompt
  }
}

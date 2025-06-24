"use client"

import { useState } from 'react'
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
 * 数据迁移工具
 * 从localStorage迁移数据到Supabase
 */
export class DataMigration {
  
  /**
   * 检查localStorage是否有数据
   */
  static hasLocalStorageData(): boolean {
    if (typeof window === 'undefined') return false
    
    try {
      const localData = localStorage.getItem('navigation-data')
      if (!localData) return false
      
      const parsed = JSON.parse(localData)
      const hasCategories = parsed?.state?.categories?.length > 0
      const hasWebsites = parsed?.state?.websites?.length > 0
      
      return hasCategories || hasWebsites
    } catch (error) {
      console.error('检查localStorage数据失败:', error)
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
   * 检查Supabase连接状态
   */
  static async checkSupabaseConnection(): Promise<boolean> {
    try {
      const supabaseStore = useSupabaseDataStore.getState()
      await supabaseStore.loadData()
      return supabaseStore.error === null
    } catch (error) {
      console.error('Supabase连接检查失败:', error)
      return false
    }
  }
}

/**
 * React Hook for data migration
 */
export function useDataMigration() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<MigrationResult | null>(null)
  
  const hasLocalData = DataMigration.hasLocalStorageData()
  
  const migrate = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const migrationResult = await DataMigration.migrateToSupabase()
      setResult(migrationResult)
      
      // 如果迁移成功，清理localStorage
      if (migrationResult.success) {
        DataMigration.clearLocalStorageData()
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
    return DataMigration.backupLocalStorageData()
  }
  
  return {
    hasLocalData,
    isLoading,
    result,
    migrate,
    backup
  }
}

 
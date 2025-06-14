/**
 * 自动备份功能
 * 在每次应用启动时自动创建数据备份，防止数据丢失
 */

import { useDataStore } from './store'

interface BackupData {
  version: string
  timestamp: string
  categories: any[]
  websites: any[]
  userAgent: string
  domain: string
}

export class AutoBackup {
  private static instance: AutoBackup
  private backupKey = 'navigation-auto-backup'
  private maxBackups = 10

  static getInstance(): AutoBackup {
    if (!AutoBackup.instance) {
      AutoBackup.instance = new AutoBackup()
    }
    return AutoBackup.instance
  }

  /**
   * 创建自动备份
   */
  async createBackup(): Promise<boolean> {
    try {
      const store = useDataStore.getState()
      const categories = store.categories || []
      const websites = store.websites || []

      // 只有在有用户数据时才创建备份
      if (categories.length === 0 && websites.length === 0) {
        console.log('🔄 没有用户数据，跳过自动备份')
        return false
      }

      const backupData: BackupData = {
        version: '2.0',
        timestamp: new Date().toISOString(),
        categories,
        websites,
        userAgent: navigator.userAgent,
        domain: window.location.hostname
      }

      // 获取现有备份
      const existingBackups = this.getExistingBackups()
      
      // 检查是否需要创建新备份（避免重复备份）
      const lastBackup = existingBackups[0]
      if (lastBackup) {
        const lastBackupTime = new Date(lastBackup.timestamp)
        const now = new Date()
        const timeDiff = now.getTime() - lastBackupTime.getTime()
        
        // 如果距离上次备份不到1小时，则跳过
        if (timeDiff < 60 * 60 * 1000) {
          console.log('⏰ 距离上次备份不到1小时，跳过自动备份')
          return false
        }
      }

      // 创建新备份
      const backupKey = `${this.backupKey}-${Date.now()}`
      localStorage.setItem(backupKey, JSON.stringify(backupData))

      // 清理旧备份
      this.cleanupOldBackups()

      console.log('✅ 自动备份创建成功:', backupKey)
      console.log('📊 备份数据统计 - categories:', categories.length, 'websites:', websites.length)
      
      return true
    } catch (error) {
      console.error('❌ 自动备份失败:', error)
      return false
    }
  }

  /**
   * 获取所有现有备份
   */
  getExistingBackups(): BackupData[] {
    try {
      const backups: BackupData[] = []
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.backupKey)) {
          const data = localStorage.getItem(key)
          if (data) {
            try {
              const backupData = JSON.parse(data)
              backups.push(backupData)
            } catch {
              // 忽略解析错误的备份
            }
          }
        }
      }

      // 按时间排序，最新的在前
      return backups.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    } catch (error) {
      console.error('获取备份列表失败:', error)
      return []
    }
  }

  /**
   * 清理旧备份
   */
  private cleanupOldBackups(): void {
    try {
      const allKeys = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.backupKey)) {
          allKeys.push(key)
        }
      }

      // 按时间排序，保留最新的
      const sortedKeys = allKeys.sort((a, b) => {
        const timeA = parseInt(a.split('-').pop() || '0')
        const timeB = parseInt(b.split('-').pop() || '0')
        return timeB - timeA
      })

      // 删除超出限制的旧备份
      if (sortedKeys.length > this.maxBackups) {
        for (let i = this.maxBackups; i < sortedKeys.length; i++) {
          localStorage.removeItem(sortedKeys[i])
          console.log('🗑️ 删除旧备份:', sortedKeys[i])
        }
      }
    } catch (error) {
      console.error('清理备份失败:', error)
    }
  }

  /**
   * 恢复备份
   */
  async restoreBackup(backupData: BackupData): Promise<boolean> {
    try {
      const store = useDataStore.getState()
      
      if (backupData.categories) {
        store.setCategories(backupData.categories)
      }
      
      if (backupData.websites) {
        store.setWebsites(backupData.websites)
      }

      console.log('✅ 备份恢复成功')
      console.log('📊 恢复数据统计 - categories:', backupData.categories?.length, 'websites:', backupData.websites?.length)
      
      return true
    } catch (error) {
      console.error('❌ 备份恢复失败:', error)
      return false
    }
  }

  /**
   * 导出所有备份为JSON文件
   */
  exportAllBackups(): void {
    try {
      const backups = this.getExistingBackups()
      const exportData = {
        exportTime: new Date().toISOString(),
        totalBackups: backups.length,
        backups
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(dataBlob)
      link.download = `navigation-all-backups-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      
      console.log('📤 所有备份导出成功')
    } catch (error) {
      console.error('❌ 导出备份失败:', error)
    }
  }
}

/**
 * 在应用启动时自动创建备份
 */
export function initAutoBackup(): void {
  if (typeof window === 'undefined') return

  // 延迟执行，确保store已经初始化
  setTimeout(() => {
    const autoBackup = AutoBackup.getInstance()
    autoBackup.createBackup()
  }, 3000) // 3秒后执行
}

/**
 * 监听页面卸载，创建最后备份
 */
export function setupBackupOnUnload(): void {
  if (typeof window === 'undefined') return

  window.addEventListener('beforeunload', () => {
    try {
      const autoBackup = AutoBackup.getInstance()
      autoBackup.createBackup()
      console.log('🔄 页面卸载前创建备份')
    } catch (error) {
      console.error('页面卸载备份失败:', error)
    }
  })
} 
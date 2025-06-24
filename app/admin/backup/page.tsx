"use client"

import { useState, useRef } from 'react'
import { useDataStore, useAdminStore } from '@/lib/store'
import { useHydratedStore } from '@/lib/use-hydrated-store'
import type { Category, Website } from '@/lib/types'

interface BackupData {
  version: string
  timestamp: string
  categories: Category[]
  websites: Website[]
  adminMode: boolean
}

export default function BackupPage() {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { isHydrated, categories, websites } = useHydratedStore()
  const { isAdminMode } = useAdminStore()
  const { setCategories, setWebsites } = useDataStore()

  const showStatus = (type: 'success' | 'error' | 'info', message: string) => {
    setStatus({ type, message })
    setTimeout(() => setStatus(null), 5000)
  }

  const exportData = () => {
    try {
      const backupData: BackupData = {
        version: '2.0',
        timestamp: new Date().toISOString(),
        categories,
        websites,
        adminMode: isAdminMode
      }

      const dataStr = JSON.stringify(backupData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(dataBlob)
      link.download = `navigation-backup-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      
      showStatus('success', '数据导出成功！备份文件已下载')
    } catch (error) {
      console.error('导出数据失败:', error)
      showStatus('error', `导出失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const backupData: BackupData = JSON.parse(content)
        
        // 验证数据格式
        if (!backupData.categories || !backupData.websites || !backupData.version) {
          throw new Error('备份文件格式无效')
        }

        // 确认导入
        const confirmImport = confirm(
          `确定要导入备份数据吗？\n\n` +
          `备份时间: ${new Date(backupData.timestamp).toLocaleString()}\n` +
          `版本: ${backupData.version}\n` +
          `分类数量: ${backupData.categories.length}\n` +
          `网站数量: ${backupData.websites.length}\n\n` +
          `注意：这将覆盖当前所有数据！`
        )

        if (confirmImport) {
          setCategories(backupData.categories)
          setWebsites(backupData.websites)
          showStatus('success', `数据导入成功！已恢复 ${backupData.categories.length} 个分类和 ${backupData.websites.length} 个网站`)
        }
      } catch (error) {
        console.error('导入数据失败:', error)
        showStatus('error', `导入失败: ${error instanceof Error ? error.message : '文件格式错误'}`)
      }
    }
    
    reader.readAsText(file)
    // 清空input值，允许重新选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const downloadTemplate = () => {
    const template: BackupData = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      categories: [
        {
          id: 'example-1',
          name: '示例分类',
          slug: 'example-category',
          description: '这是一个示例分类',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ],
      websites: [
        {
          id: 'example-1',
          name: '示例网站',
          url: 'https://example.com',
          description: '这是一个示例网站',
          logo: 'https://example.com/favicon.ico',
          categoryIds: ['example-1'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isFeatured: false,
          isHot: false,
          order: 0
        }
      ],
      adminMode: false
    }

    const dataStr = JSON.stringify(template, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = 'navigation-template.json'
    link.click()
    
    showStatus('info', '模板文件已下载，您可以参考此格式手动编辑数据')
  }

  const createAutoBackup = () => {
    try {
      // 创建自动备份到localStorage
      const backupKey = `navigation-backup-${Date.now()}`
      const backupData: BackupData = {
        version: '2.0',
        timestamp: new Date().toISOString(),
        categories,
        websites,
        adminMode: isAdminMode
      }
      
      localStorage.setItem(backupKey, JSON.stringify(backupData))
      
      // 保持最多5个自动备份
      const allKeys = Object.keys(localStorage).filter(key => key.startsWith('navigation-backup-'))
      if (allKeys.length > 5) {
        const oldestKey = allKeys.sort()[0]
        localStorage.removeItem(oldestKey)
      }
      
      showStatus('success', `已创建自动备份: ${new Date().toLocaleString()}`)
    } catch (error) {
      console.error('创建自动备份失败:', error)
      showStatus('error', '创建自动备份失败')
    }
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载数据...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">数据备份与恢复</h1>
          <p className="text-gray-600">确保您的管理员数据安全，防止部署时数据丢失</p>
        </div>

        {/* 状态提示 */}
        {status && (
          <div className={`mb-6 p-4 rounded-lg ${
            status.type === 'success' ? 'bg-green-100 text-green-800' :
            status.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {status.message}
          </div>
        )}

        {/* 当前数据统计 */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">当前数据统计</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
              <div className="text-sm text-gray-600">分类</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-green-600">{websites.length}</div>
              <div className="text-sm text-gray-600">网站</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-purple-600">
                {websites.filter(w => w.isFeatured).length}
              </div>
              <div className="text-sm text-gray-600">精选网站</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-orange-600">
                {websites.filter(w => w.isHot).length}
              </div>
              <div className="text-sm text-gray-600">热门网站</div>
            </div>
          </div>
        </div>

        {/* 操作区域 */}
        <div className="space-y-6">
          {/* 导出数据 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">📤 导出数据</h3>
            <p className="text-gray-600 mb-4">
              将当前所有数据导出为JSON文件，建议在每次重要修改后都创建备份
            </p>
            <div className="flex gap-4">
              <button
                onClick={exportData}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                导出完整备份
              </button>
              <button
                onClick={createAutoBackup}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                创建本地备份
              </button>
            </div>
          </div>

          {/* 导入数据 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">📥 导入数据</h3>
            <p className="text-gray-600 mb-4">
              从备份文件恢复数据。注意：这将完全替换当前所有数据！
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
            <div className="flex gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                选择备份文件
              </button>
              <button
                onClick={downloadTemplate}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                下载模板文件
              </button>
            </div>
          </div>

          {/* 重要提醒 */}
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ 重要提醒</h3>
            <div className="space-y-2 text-yellow-700">
              <p>• <strong>定期备份</strong>：建议每次添加重要数据后都创建备份</p>
              <p>• <strong>多处保存</strong>：将备份文件保存到云盘、邮箱等多个地方</p>
              <p>• <strong>部署前备份</strong>：每次代码更新部署前务必先备份数据</p>
              <p>• <strong>测试导入</strong>：在生产环境导入前，建议先在测试环境验证</p>
            </div>
          </div>
        </div>

        {/* 返回按钮 */}
        <div className="mt-8 text-center">
          <a
            href="/admin"
            className="inline-block px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            返回管理页面
          </a>
        </div>
      </div>
    </div>
  )
} 
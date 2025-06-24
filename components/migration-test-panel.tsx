"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataMigrationImproved } from '@/lib/data-migration-improved'

export function MigrationTestPanel() {
  const [status, setStatus] = useState<any>(null)

  const checkStatus = () => {
    const status = {
      hasSupabaseConfig: DataMigrationImproved.hasSupabaseConfig(),
      shouldShowPrompt: DataMigrationImproved.shouldShowMigrationPrompt(),
      hasLocalData: !!DataMigrationImproved.getLocalStorageData(),
      migrationFlag: typeof window !== 'undefined' ? localStorage.getItem('supabase-migration-completed') : null,
    }
    setStatus(status)
    console.log('📊 迁移状态检查:', status)
  }

  const resetMigration = () => {
    DataMigrationImproved.resetMigrationFlag()
    console.log('�� 迁移标记已重置')
    checkStatus()
  }

  return (
    <Card className="border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          🧪 迁移测试面板
          <Badge variant="outline" className="text-xs">开发工具</Badge>
        </CardTitle>
        <CardDescription>
          用于测试和调试数据迁移功能
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={checkStatus} variant="outline" size="sm">
            检查状态
          </Button>
          <Button onClick={resetMigration} variant="outline" size="sm">
            重置迁移标记
          </Button>
        </div>
        
        {status && (
          <div className="space-y-2">
            <h4 className="font-medium">当前状态：</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className={`p-2 rounded ${status.hasSupabaseConfig ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Supabase配置: {status.hasSupabaseConfig ? '✅' : '❌'}
              </div>
              <div className={`p-2 rounded ${status.hasLocalData ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                本地数据: {status.hasLocalData ? '✅' : '❌'}
              </div>
              <div className={`p-2 rounded ${status.shouldShowPrompt ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                显示提示: {status.shouldShowPrompt ? '✅' : '❌'}
              </div>
              <div className={`p-2 rounded ${status.migrationFlag === 'true' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                迁移完成: {status.migrationFlag === 'true' ? '✅' : '❌'}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

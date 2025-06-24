"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Database, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  X
} from 'lucide-react'
import { useDataMigration } from '@/lib/data-migration'

interface MigrationPromptProps {
  onClose?: () => void
}

export function MigrationPrompt({ onClose }: MigrationPromptProps) {
  const { hasLocalData, isLoading, result, migrate, backup } = useDataMigration()
  const [showDetails, setShowDetails] = useState(false)
  const [backupData, setBackupData] = useState<string | null>(null)

  // 如果没有本地数据，不显示组件
  if (!hasLocalData && !result) {
    return null
  }

  const handleMigrate = async () => {
    // 先备份数据
    const backupJson = backup()
    setBackupData(backupJson)
    
    // 执行迁移
    await migrate()
  }

  const downloadBackup = () => {
    if (!backupData) return
    
    const blob = new Blob([backupData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `navigation-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg">数据迁移到云端</CardTitle>
            <Badge variant="secondary" className="text-xs">推荐</Badge>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription>
          检测到您的数据存储在浏览器本地，建议迁移到云端数据库以确保数据安全。
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 迁移前的提示 */}
        {!result && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium text-sm">云端存储的优势</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 数据永久保存，不会因清理浏览器缓存而丢失</li>
                  <li>• 多设备同步，随时随地访问您的网站收藏</li>
                  <li>• 自动备份，数据更安全可靠</li>
                  <li>• 更快的加载速度和更好的性能</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleMigrate}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    迁移中...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    开始迁移
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowDetails(!showDetails)}
                size="sm"
              >
                {showDetails ? '隐藏' : '详情'}
              </Button>
            </div>

            {/* 详细信息 */}
            {showDetails && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>迁移过程：</strong>
                  <br />1. 自动备份您的本地数据
                  <br />2. 将数据上传到Supabase云数据库
                  <br />3. 验证数据完整性
                  <br />4. 清理本地缓存
                  <br /><br />
                  <strong>注意：</strong>迁移过程是安全的，我们会先备份您的数据。如果迁移失败，您的本地数据不会受到影响。
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* 迁移进度 */}
        {isLoading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">正在迁移数据...</span>
            </div>
            <Progress value={50} className="h-2" />
            <p className="text-xs text-muted-foreground">
              请稍候，正在将您的数据安全迁移到云端...
            </p>
          </div>
        )}

        {/* 迁移结果 */}
        {result && (
          <div className="space-y-3">
            {result.success ? (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <strong className="text-green-800 dark:text-green-200">迁移成功！</strong>
                  <br />
                  {result.message}
                  {result.categoriesCount !== undefined && result.websitesCount !== undefined && (
                    <div className="mt-2 text-xs">
                      已迁移 {result.categoriesCount} 个分类和 {result.websitesCount} 个网站
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>迁移失败</strong>
                  <br />
                  {result.message}
                  {result.error && (
                    <div className="mt-1 text-xs opacity-75">
                      错误详情: {result.error}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* 备份下载 */}
            {backupData && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadBackup}
                  className="text-xs"
                >
                  <Download className="mr-1 h-3 w-3" />
                  下载备份文件
                </Button>
                <span className="text-xs text-muted-foreground">
                  建议保存备份文件以防万一
                </span>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-2">
              {result.success ? (
                <Button onClick={() => window.location.reload()} className="flex-1">
                  刷新页面
                </Button>
              ) : (
                <Button onClick={handleMigrate} variant="outline" className="flex-1">
                  重试迁移
                </Button>
              )}
              {onClose && (
                <Button variant="ghost" onClick={onClose}>
                  关闭
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
"use client"

import { useEffect, useState } from "react"
import { useSmartDataStore } from "@/lib/smart-data-store"
import { useSupabaseDataStore } from "@/lib/supabase-data-store"
import { useDataStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataReset, deduplicateCategories, deduplicateWebsites } from "@/lib/reset-all-data"
import { AlertTriangle, RefreshCw, Trash2, CheckCircle } from "lucide-react"

export default function DebugDataPage() {
  const smartStore = useSmartDataStore()
  const supabaseStore = useSupabaseDataStore()
  const localStore = useDataStore()
  const [mounted, setMounted] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [resetMessage, setResetMessage] = useState('')
  const [validationResult, setValidationResult] = useState<{categories: number, websites: number, duplicates: boolean} | null>(null)

  useEffect(() => {
    setMounted(true)
    // 只初始化智能存储，它会自动管理其他存储的初始化
    smartStore.initialize()
  }, [])

  const handleTestSupabaseConnection = async () => {
    try {
      console.log('测试Supabase连接...')
      await supabaseStore.loadData()
      console.log('Supabase连接成功')
    } catch (error) {
      console.error('Supabase连接失败:', error)
    }
  }

  const handleForceLoadData = async () => {
    try {
      console.log('强制重新加载数据...')
      await smartStore.loadData()
      console.log('数据重新加载成功')
    } catch (error) {
      console.error('数据重新加载失败:', error)
    }
  }

  const handleValidateData = async () => {
    try {
      const result = await DataReset.validateData()
      setValidationResult(result)
    } catch (error) {
      console.error('验证数据失败:', error)
      setResetMessage('验证数据失败: ' + (error as Error).message)
    }
  }

  const handleFullReset = async () => {
    if (!confirm('⚠️ 警告：这将清除所有数据并重新初始化！确定要继续吗？')) {
      return
    }
    
    setIsResetting(true)
    setResetMessage('')
    
    try {
      await DataReset.fullReset()
      setResetMessage('✅ 数据重置成功！请刷新页面查看效果')
      // 自动刷新页面
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('数据重置失败:', error)
      setResetMessage('❌ 数据重置失败: ' + (error as Error).message)
    } finally {
      setIsResetting(false)
    }
  }

  const handleClearLocalStorage = () => {
    if (!confirm('确定要清除localStorage数据吗？')) {
      return
    }
    
    DataReset.clearLocalStorage()
    setResetMessage('✅ localStorage已清除，请刷新页面')
  }

  if (!mounted) {
    return <div>加载中...</div>
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">数据存储调试页面</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 智能数据存储状态 */}
        <Card>
          <CardHeader>
            <CardTitle>智能数据存储 (Smart Store)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>数据源: <span className="font-mono">{smartStore.dataSource}</span></div>
            <div>已初始化: <span className={smartStore.isInitialized ? "text-green-600" : "text-red-600"}>{smartStore.isInitialized ? "是" : "否"}</span></div>
            <div>加载中: <span className={smartStore.isLoading ? "text-yellow-600" : "text-green-600"}>{smartStore.isLoading ? "是" : "否"}</span></div>
            <div>分类数量: <span className="font-mono">{smartStore.categories.length}</span></div>
            <div>网站数量: <span className="font-mono">{smartStore.websites.length}</span></div>
            <div>错误: <span className={smartStore.error ? "text-red-600" : "text-green-600"}>{smartStore.error || "无"}</span></div>
            <Button onClick={handleForceLoadData} size="sm">强制重新加载</Button>
          </CardContent>
        </Card>

        {/* Supabase数据存储状态 */}
        <Card>
          <CardHeader>
            <CardTitle>Supabase 数据存储</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>已初始化: <span className={supabaseStore.isInitialized ? "text-green-600" : "text-red-600"}>{supabaseStore.isInitialized ? "是" : "否"}</span></div>
            <div>加载中: <span className={supabaseStore.isLoading ? "text-yellow-600" : "text-green-600"}>{supabaseStore.isLoading ? "是" : "否"}</span></div>
            <div>分类数量: <span className="font-mono">{supabaseStore.categories.length}</span></div>
            <div>网站数量: <span className="font-mono">{supabaseStore.websites.length}</span></div>
            <div>错误: <span className={supabaseStore.error ? "text-red-600" : "text-green-600"}>{supabaseStore.error || "无"}</span></div>
            <Button onClick={handleTestSupabaseConnection} size="sm">测试连接</Button>
          </CardContent>
        </Card>

        {/* 本地数据存储状态 */}
        <Card>
          <CardHeader>
            <CardTitle>本地数据存储 (LocalStorage)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>分类数量: <span className="font-mono">{localStore.categories.length}</span></div>
            <div>网站数量: <span className="font-mono">{localStore.websites.length}</span></div>
          </CardContent>
        </Card>
      </div>

      {/* 数据详情 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>当前分类数据</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-60 bg-gray-100 p-2 rounded">
              {JSON.stringify(smartStore.categories, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>当前网站数据</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-60 bg-gray-100 p-2 rounded">
              {JSON.stringify(smartStore.websites, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* 数据验证和重置工具 */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            数据重置工具
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleValidateData} variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              验证数据
            </Button>
            <Button onClick={handleClearLocalStorage} variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              清除本地存储
            </Button>
            <Button 
              onClick={handleFullReset} 
              variant="destructive" 
              size="sm"
              disabled={isResetting}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
              {isResetting ? '重置中...' : '完整数据重置'}
            </Button>
          </div>
          
          {validationResult && (
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-semibold mb-2">数据验证结果:</h4>
              <div className="space-y-1 text-sm">
                <div>分类数量: {validationResult.categories}</div>
                <div>网站数量: {validationResult.websites}</div>
                <div className={validationResult.duplicates ? "text-red-600" : "text-green-600"}>
                  重复数据: {validationResult.duplicates ? "发现重复!" : "无重复"}
                </div>
              </div>
            </div>
          )}
          
          {resetMessage && (
            <div className={`p-3 rounded ${
              resetMessage.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {resetMessage}
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <p><strong>说明:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>验证数据</strong>: 检查Supabase中是否有重复数据</li>
              <li><strong>清除本地存储</strong>: 只清除localStorage，不影响Supabase</li>
              <li><strong>完整数据重置</strong>: 清除所有数据并重新初始化为4个原始分类</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 环境变量检查 */}
      <Card>
        <CardHeader>
          <CardTitle>环境变量检查</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>SUPABASE_URL: <span className="font-mono">{process.env.NEXT_PUBLIC_SUPABASE_URL ? "已配置" : "未配置"}</span></div>
          <div>SUPABASE_ANON_KEY: <span className="font-mono">{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "已配置" : "未配置"}</span></div>
        </CardContent>
      </Card>
    </div>
  )
} 
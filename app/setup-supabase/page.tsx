"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  Copy,
  Download
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// 简单的Supabase诊断函数
async function diagnoseSupabase() {
  try {
    // 测试基本连接
    const { data: connectionTest, error: connectionError } = await supabase
      .from('categories')
      .select('count', { count: 'exact', head: true })
    
    if (connectionError) {
      return {
        success: false,
        needSetup: true,
        error: connectionError.message,
        details: connectionError
      }
    }
    
    return {
      success: true,
      needSetup: false,
      message: 'Supabase连接正常'
    }
  } catch (error) {
    return {
      success: false,
      needSetup: true,
      error: error instanceof Error ? error.message : '未知错误',
      details: error
    }
  }
}

export default function SetupSupabasePage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [diagResult, setDiagResult] = useState<any>(null)
  const [sqlExecuted, setSqlExecuted] = useState(false)

  const sqlScript = `-- 创建 categories 表
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  color VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建 websites 表
CREATE TABLE IF NOT EXISTS public.websites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  logo VARCHAR(500),
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 启用 RLS (Row Level Security)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;

-- 创建允许所有操作的策略（开发阶段用）
CREATE POLICY "Allow all operations on categories" ON public.categories
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on websites" ON public.websites
  FOR ALL USING (true) WITH CHECK (true);`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('已复制到剪贴板！')
  }

  const downloadSql = () => {
    const blob = new Blob([sqlScript], { type: 'text/sql' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'supabase-setup.sql'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const result = await diagnoseSupabase()
      setDiagResult(result)
      
      if (result.success) {
        setStep(4) // 直接跳到成功步骤
      } else if (result.needSetup) {
        setStep(3) // 跳到SQL执行步骤
      }
    } catch (error) {
      setDiagResult({ success: false, error })
    } finally {
      setIsLoading(false)
    }
  }

  const markSqlExecuted = () => {
    setSqlExecuted(true)
    setStep(4)
  }

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Supabase 设置向导</h1>
        <p className="text-muted-foreground">
          按照以下步骤设置云端数据库，让您的导航网站数据永久保存
        </p>
      </div>

      {/* 步骤指示器 */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > i ? <CheckCircle className="w-4 h-4" /> : i}
            </div>
            {i < 4 && <div className={`w-12 h-0.5 ${step > i ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* 步骤 1: 环境变量检查 */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              步骤 1: 检查环境变量
            </CardTitle>
            <CardDescription>
              首先检查您的Supabase配置是否正确
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                请确保在 <code>.env.local</code> 文件中配置了：
                <br />• <code>NEXT_PUBLIC_SUPABASE_URL</code>
                <br />• <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
              </AlertDescription>
            </Alert>
            <Button onClick={() => setStep(2)} className="w-full">
              配置完成，下一步
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 步骤 2: 测试连接 */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>步骤 2: 测试连接</CardTitle>
            <CardDescription>
              测试与Supabase数据库的连接
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testConnection} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  测试连接中...
                </>
              ) : (
                '测试 Supabase 连接'
              )}
            </Button>

            {diagResult && (
              <Alert variant={diagResult.success ? "default" : "destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {diagResult.success ? '✅ 连接成功！' : '❌ 连接失败，需要创建数据库表'}
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                    {JSON.stringify(diagResult, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* 步骤 3: 执行SQL */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>步骤 3: 创建数据库表</CardTitle>
            <CardDescription>
              在Supabase中执行SQL脚本创建必要的表结构
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">SQL脚本</h4>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(sqlScript)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    复制
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={downloadSql}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    下载
                  </Button>
                </div>
              </div>
              <Textarea 
                value={sqlScript}
                readOnly
                className="h-40 text-xs font-mono"
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>执行步骤：</strong>
                <br />1. 打开 <a href="https://your-project-ref.supabase.co" target="_blank" className="text-blue-600 underline">您的Supabase项目 <ExternalLink className="inline w-3 h-3" /></a>
                <br />2. 点击左侧菜单的 "SQL Editor"
                <br />3. 点击 "New query" 创建新查询
                <br />4. 复制粘贴上面的SQL代码
                <br />5. 点击 "Run" 执行查询
              </AlertDescription>
            </Alert>

            <Button onClick={markSqlExecuted} className="w-full">
              SQL已执行完成，下一步
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 步骤 4: 完成 */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              设置完成！
            </CardTitle>
            <CardDescription>
              Supabase数据库已设置完成，现在可以开始数据迁移了
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">✅ 环境变量配置</Badge>
              <Badge variant="secondary">✅ 数据库连接</Badge>
              <Badge variant="secondary">✅ 表结构创建</Badge>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                现在您可以：
                <br />• 返回管理页面进行数据迁移
                <br />• 开始使用云端数据存储功能
                <br />• 享受多设备同步和永久数据保存
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <a href="/admin">前往管理页面</a>
              </Button>
              <Button 
                variant="outline" 
                onClick={testConnection}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  '重新测试'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
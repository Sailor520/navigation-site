"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function DebugEnvPage() {
  const [envInfo, setEnvInfo] = useState({
    supabaseUrl: '',
    supabaseAnonKey: '',
    hasSupabaseUrl: false,
    hasSupabaseAnonKey: false,
  })

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    console.log('环境变量调试:')
    console.log('- URL:', url)
    console.log('- KEY前20位:', key ? key.substring(0, 20) + '...' : '无')
    
    setEnvInfo({
      supabaseUrl: url,
      supabaseAnonKey: key ? key.substring(0, 20) + '...' : '',
      hasSupabaseUrl: !!url,
      hasSupabaseAnonKey: !!key,
    })
  }, [])

  const testSupabaseConnection = async () => {
    try {
      console.log('🔗 测试Supabase连接...')
      const { supabase } = await import('@/lib/supabase')
      
      const { data, error } = await supabase
        .from('categories')
        .select('count')
        .limit(1)
      
      if (error) {
        console.error('连接测试失败:', error)
        alert('连接失败: ' + error.message)
      } else {
        console.log('连接测试成功:', data)
        alert('连接成功!')
      }
    } catch (error) {
      console.error('测试出错:', error)
      alert('测试出错: ' + (error as Error).message)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">环境变量调试</h1>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Supabase 环境变量状态</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SUPABASE_URL</span>
                <div className="flex items-center gap-2">
                  <Badge variant={envInfo.hasSupabaseUrl ? 'default' : 'destructive'}>
                    {envInfo.hasSupabaseUrl ? '已配置' : '未配置'}
                  </Badge>
                  {envInfo.hasSupabaseUrl && (
                    <span className="text-sm text-muted-foreground">
                      {envInfo.supabaseUrl}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                <div className="flex items-center gap-2">
                  <Badge variant={envInfo.hasSupabaseAnonKey ? 'default' : 'destructive'}>
                    {envInfo.hasSupabaseAnonKey ? '已配置' : '未配置'}
                  </Badge>
                  {envInfo.hasSupabaseAnonKey && (
                    <span className="text-sm text-muted-foreground">
                      {envInfo.supabaseAnonKey}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <button 
                onClick={testSupabaseConnection}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                测试Supabase连接
              </button>
            </div>
            
            {(!envInfo.hasSupabaseUrl || !envInfo.hasSupabaseAnonKey) && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h3 className="font-semibold text-destructive">环境变量配置问题</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  请检查 .env 文件中的 Supabase 配置，并重启开发服务器。
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
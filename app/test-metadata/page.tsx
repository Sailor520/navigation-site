"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchWebsiteMetadata, selectBestLogo } from '@/lib/website-metadata'
import { Loader2, Globe } from 'lucide-react'
import { toast } from 'sonner'

export default function TestMetadataPage() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [metadata, setMetadata] = useState<any>(null)

  const handleTest = async () => {
    if (!url.trim()) {
      toast.error('请输入URL')
      return
    }

    setIsLoading(true)
    try {
      console.log('🔍 测试获取元数据:', url)
      const result = await fetchWebsiteMetadata(url.trim())
      const bestLogo = selectBestLogo(result, url)
      
      setMetadata({
        ...result,
        bestLogo
      })
      
      toast.success('✅ 获取成功')
    } catch (error) {
      console.error('测试失败:', error)
      toast.error('获取失败')
      setMetadata(null)
    } finally {
      setIsLoading(false)
    }
  }

  const testUrls = [
    'https://github.com',
    'https://vercel.com', 
    'https://nextjs.org',
    'https://tailwindcss.com',
    'https://openai.com',
    'https://anthropic.com',
    'https://twitter.com',
    'https://google.com',
    'https://youtube.com',
    'https://stackoverflow.com',
    'https://reddit.com',
    'https://medium.com',
    'https://figma.com',
    'https://notion.so',
    'https://discord.com',
    'https://stripe.com',
    'https://supabase.com',
    'https://firebase.google.com',
    'https://aws.amazon.com',
    'https://cloudflare.com',
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">网站元数据获取测试</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>测试URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="输入要测试的网站URL"
                className="flex-1"
              />
              <Button
                onClick={handleTest}
                disabled={isLoading || !url.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Globe className="h-4 w-4" />
                )}
                测试
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {testUrls.map((testUrl) => (
                <Button
                  key={testUrl}
                  variant="outline"
                  size="sm"
                  onClick={() => setUrl(testUrl)}
                >
                  {testUrl.replace('https://', '')}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {metadata && (
          <Card>
            <CardHeader>
              <CardTitle>获取结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <label className="font-semibold">标题:</label>
                  <p className="text-muted-foreground">{metadata.title || '未获取到'}</p>
                </div>
                
                <div>
                  <label className="font-semibold">描述:</label>
                  <p className="text-muted-foreground">{metadata.description || '未获取到'}</p>
                </div>
                
                <div>
                  <label className="font-semibold">最佳Logo:</label>
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-sm">{metadata.bestLogo || '未获取到'}</p>
                    {metadata.bestLogo && (
                      <img 
                        src={metadata.bestLogo} 
                        alt="Logo预览" 
                        className="w-8 h-8 object-contain border rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="font-semibold">原始数据:</label>
                  <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(metadata, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 
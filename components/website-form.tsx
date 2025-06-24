"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import type { Website, Category } from "@/lib/types"
import { useSmartDataStore } from "@/lib/smart-data-store"
import { deduplicateCategories } from "@/lib/reset-all-data"
import { generateId } from "@/lib/utils"
import { fetchWebsiteMetadata, selectBestLogo } from "@/lib/website-metadata"
import { Loader2, Globe, CheckCircle } from "lucide-react"

interface WebsiteFormProps {
  categories: Category[]
  onSuccess?: () => void
  website?: Website
  mode?: 'add' | 'edit'
}

export function WebsiteForm({ categories, onSuccess, website, mode = 'add' }: WebsiteFormProps) {
  const { addWebsite, updateWebsite, dataSource } = useSmartDataStore()
  
  // 对分类去重，防止重复显示
  const uniqueCategories = deduplicateCategories(categories)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false)
  const [metadataFetched, setMetadataFetched] = useState(false)
  const [formData, setFormData] = useState({
    name: website?.name || '',
    url: website?.url || '',
    description: website?.description || '',
    logo: website?.logo || '',
    categoryIds: website?.categoryIds || [],
    isFeatured: website?.isFeatured || false,
    isHot: website?.isHot || false,
  })

  // 当URL变化时自动获取元数据（防抖处理）
  useEffect(() => {
    if (!formData.url.trim() || mode === 'edit') return
    
    const timer = setTimeout(async () => {
      // 检查是否是有效的URL
      if (formData.url.match(/^https?:\/\/.+/)) {
        await handleFetchMetadata(true) // 静默获取
      }
    }, 1000) // 1秒后自动获取

    return () => clearTimeout(timer)
  }, [formData.url, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error('请填写网站名称和URL')
      return
    }

    if (formData.categoryIds.length === 0) {
      toast.error('请至少选择一个分类')
      return
    }

    setIsSubmitting(true)

    try {
      // 如果没有获取过元数据且URL有效，先获取一次
      if (!metadataFetched && formData.url.match(/^https?:\/\/.+/) && mode === 'add') {
        console.log('🔄 提交前先获取元数据...')
        await handleFetchMetadata(true)
      }

      const websiteData: Website = {
        id: website?.id || generateId(),
        name: formData.name.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
        logo: formData.logo.trim() || null,
        categoryIds: formData.categoryIds,
        isFeatured: formData.isFeatured,
        isHot: formData.isHot,
        order: website?.order || 0,
        createdAt: website?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (mode === 'edit' && website) {
        await updateWebsite(website.id, websiteData)
        toast.success(`✅ 网站已更新到${dataSource === 'supabase' ? '云端数据库' : '本地存储'}`)
      } else {
        // 添加网站
        await addWebsite(websiteData)
        toast.success(`✅ 网站已添加到${dataSource === 'supabase' ? '云端数据库' : '本地存储'}，主页面将自动显示新网站`)
      }

      // 重置表单
      if (mode === 'add') {
        setFormData({
          name: '',
          url: '',
          description: '',
          logo: '',
          categoryIds: [],
          isFeatured: false,
          isHot: false,
        })
        setMetadataFetched(false)
      }

      onSuccess?.()
    } catch (error) {
      console.error('❌ 提交失败:', error)
      const errorMessage = (error as Error).message || '未知错误'
      toast.error(`${mode === 'edit' ? '更新' : '添加'}网站失败: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 自动获取网站元数据
  const handleFetchMetadata = async (silent = false) => {
    if (!formData.url.trim()) {
      if (!silent) toast.error('请先输入网站URL')
      return
    }

    setIsFetchingMetadata(true)
    try {
      if (!silent) console.log('🔍 开始获取网站元数据...')
      const metadata = await fetchWebsiteMetadata(formData.url.trim())
      
      if (metadata.title || metadata.description || metadata.logo || metadata.ogImage) {
        const bestLogo = selectBestLogo(metadata, formData.url)
        
        setFormData(prev => ({
          ...prev,
          // 只在字段为空时才更新，避免覆盖用户手动输入的内容
          name: prev.name || metadata.title || prev.name,
          description: prev.description || metadata.description || prev.description,
          logo: prev.logo || bestLogo || prev.logo,
        }))
        
        setMetadataFetched(true)
        
        if (!silent) {
          toast.success('✅ 已自动获取网站信息')
          console.log('✅ 元数据获取成功:', {
            title: metadata.title,
            description: metadata.description,
            logo: bestLogo
          })
        }
      } else {
        if (!silent) toast.warning('未能获取到网站信息，请手动填写')
      }
    } catch (error) {
      console.error('❌ 获取元数据失败:', error)
      if (!silent) toast.error('获取网站信息失败，请手动填写')
    } finally {
      setIsFetchingMetadata(false)
    }
  }

  const handleCategoryChange = (categoryId: string, checked: boolean | string) => {
    const isChecked = checked === true || checked === 'true'
    if (isChecked) {
      setFormData(prev => ({
        ...prev,
        categoryIds: [...prev.categoryIds, categoryId]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        categoryIds: prev.categoryIds.filter(id => id !== categoryId)
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 数据源状态指示器 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className={`w-2 h-2 rounded-full ${dataSource === 'supabase' ? 'bg-green-500' : 'bg-blue-500'}`} />
          <span>数据将保存到: {dataSource === 'supabase' ? '云端数据库' : '本地存储'}</span>
        </div>
        {metadataFetched && (
          <div className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle className="h-3 w-3" />
            <span>已获取元数据</span>
          </div>
        )}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="name">网站名称 *</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="请输入网站名称（输入URL后可自动获取）"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="url">网站链接 *</Label>
        <div className="flex gap-2">
          <Input
            id="url"
            type="text"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="请输入完整的网站URL，包括https://"
            required
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => handleFetchMetadata()}
            disabled={isFetchingMetadata || !formData.url.trim()}
            className="px-3"
          >
            {isFetchingMetadata ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : metadataFetched ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {isFetchingMetadata ? 
            "正在自动获取网站信息..." : 
            metadataFetched ? 
              "✅ 已自动获取网站信息" : 
              `输入有效URL后会自动获取，也可点击 ${metadataFetched ? '✓' : '🌐'} 按钮手动获取`
          }
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">网站描述</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="请输入网站描述"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="logo">网站Logo</Label>
        <div className="flex gap-2 items-center">
          <Input
            id="logo"
            type="text"
            value={formData.logo}
            onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
            placeholder="请输入网站Logo的URL（可自动获取）"
            className="flex-1"
          />
          {formData.logo && (
            <div className="w-8 h-8 border rounded flex items-center justify-center bg-muted overflow-hidden">
              <img
                src={formData.logo}
                alt="Logo预览"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const nextElement = target.nextElementSibling as HTMLElement
                  if (nextElement) {
                    nextElement.style.display = 'block'
                  }
                }}
              />
              <div className="hidden text-xs text-muted-foreground">❌</div>
            </div>
          )}
        </div>
        {formData.logo && (
          <p className="text-xs text-muted-foreground">
            Logo预览 - 如无法显示请检查URL是否正确
          </p>
        )}
      </div>

             <div className="grid gap-2">
         <Label htmlFor="categoryIds">网站分类 *</Label>
         <div className="grid grid-cols-2 gap-4">
           {uniqueCategories.map((category) => (
             <div key={category.id} className="flex items-center space-x-2">
               <Checkbox
                 id={`category-${category.id}`}
                 checked={formData.categoryIds.includes(category.id)}
                 onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
               />
               <Label htmlFor={`category-${category.id}`} className="text-sm font-normal">
                 {category.name}
               </Label>
             </div>
           ))}
         </div>
       </div>

      <div className="grid gap-2">
        <Label htmlFor="isFeatured">是否推荐</Label>
        <Checkbox
          id="isFeatured"
          checked={formData.isFeatured}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked as boolean }))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="isHot">是否热门</Label>
        <Checkbox
          id="isHot"
          checked={formData.isHot}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isHot: checked as boolean }))}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '提交中...' : (mode === 'edit' ? '更新网站' : '添加网站')}
      </Button>
    </form>
  )
}

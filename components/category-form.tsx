"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { Category } from "@/lib/types"
import { useSmartDataStore } from "@/lib/smart-data-store"
import { generateId } from "@/lib/utils"

interface CategoryFormProps {
  onSuccess?: () => void
  category?: Category
  mode?: 'add' | 'edit'
}

export function CategoryForm({ onSuccess, category, mode = 'add' }: CategoryFormProps) {
  const { addCategory, updateCategory, categories, dataSource } = useSmartDataStore()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('请输入分类名称')
      return
    }

    const slug = formData.slug.trim() || generateSlug(formData.name)
    
    // 检查slug是否重复
    const existingCategory = categories.find(cat => 
      cat.slug === slug && (mode === 'add' || cat.id !== category?.id)
    )
    
    if (existingCategory) {
      toast.error('分类标识已存在，请使用不同的名称或手动输入标识')
      return
    }

    setIsSubmitting(true)

    try {
      const categoryData: Category = {
        id: category?.id || generateId(),
        name: formData.name.trim(),
        slug,
        description: formData.description.trim(),
        order: category?.order || categories.length,
        createdAt: category?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (mode === 'edit' && category) {
        await updateCategory(category.id, categoryData)
        toast.success(`✅ 分类已更新到${dataSource === 'supabase' ? '云端数据库' : '本地存储'}`)
      } else {
        await addCategory(categoryData)
        toast.success(`✅ 分类已保存到${dataSource === 'supabase' ? '云端数据库' : '本地存储'}，左侧边栏将自动显示新分类`)
      }

      // 重置表单
      if (mode === 'add') {
        setFormData({
          name: '',
          slug: '',
          description: '',
        })
      }

      onSuccess?.()
    } catch (error) {
      console.error('提交失败:', error)
      toast.error(mode === 'edit' ? '更新分类失败' : '添加分类失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 数据源状态指示器 */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className={`w-2 h-2 rounded-full ${dataSource === 'supabase' ? 'bg-green-500' : 'bg-blue-500'}`} />
        <span>数据将保存到: {dataSource === 'supabase' ? '云端数据库' : '本地存储'}</span>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="name">分类名称 *</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => {
            const name = e.target.value
            setFormData(prev => ({ 
              ...prev, 
              name,
              slug: prev.slug || generateSlug(name)
            }))
          }}
          placeholder="请输入分类名称"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="slug">分类标识</Label>
        <Input
          id="slug"
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
          placeholder="自动生成或手动输入"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">分类描述</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="请输入分类描述"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '提交中...' : (mode === 'edit' ? '更新分类' : '添加分类')}
      </Button>
    </form>
  )
}

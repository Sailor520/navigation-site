"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import type { Website } from "@/lib/types"
import { useSmartDataStore } from "@/lib/smart-data-store"
import { ErrorBoundary } from "@/components/error-boundary"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "网站名称至少需要2个字符",
  }),
  url: z.string().url({
    message: "请输入有效的URL",
  }),
  description: z.string().optional(),
  categoryIds: z.array(z.string()).min(1, {
    message: "至少选择一个分类",
  }),
})

interface EditWebsiteDialogProps {
  website: Website
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditWebsiteDialog({ website, open, onOpenChange, onSuccess }: EditWebsiteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { categories, updateWebsite, dataSource, loadData } = useSmartDataStore()

  // 数据验证和默认值处理
  const safeWebsite = {
    id: website?.id || '',
    name: website?.name || '',
    url: website?.url || '',
    description: website?.description || '',
    categoryIds: Array.isArray(website?.categoryIds) ? website.categoryIds : [],
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: safeWebsite.name,
      url: safeWebsite.url,
      description: safeWebsite.description,
      categoryIds: safeWebsite.categoryIds,
    },
  })

  // 当网站数据变化时更新表单
  useEffect(() => {
    if (website && open) {
      const safeData = {
        name: website.name || '',
        url: website.url || '',
        description: website.description || '',
        categoryIds: Array.isArray(website.categoryIds) ? website.categoryIds : [],
      }
      
      console.log('🔄 更新编辑表单数据:', safeData)
      form.reset(safeData)
    }
  }, [website, form, open])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      
      // 数据验证
      if (!safeWebsite.id) {
        throw new Error('网站ID无效')
      }

      const updateData = {
        name: values.name.trim(),
        url: values.url.trim(),
        description: values.description?.trim() || '', // 处理可选字段
        categoryIds: values.categoryIds,
        updatedAt: new Date().toISOString(),
      }
      
      console.log('📝 更新网站数据:', updateData)
      await updateWebsite(safeWebsite.id, updateData)

      console.log('✅ 网站更新操作完成，强制刷新数据')
      
      // 强制重新加载数据确保状态同步
      await loadData()

      toast({
        title: "网站更新成功",
        description: `网站信息已成功更新到${dataSource === 'supabase' ? '云端数据库' : '本地存储'}，页面数据已刷新`,
      })

      // 调用成功回调
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error('❌ 更新网站失败:', error)
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      toast({
        title: "更新失败",
        description: `更新网站时出现错误: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 如果没有有效的网站数据，不渲染对话框
  if (!website || !safeWebsite.id) {
    return null
  }

  return (
    <ErrorBoundary>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>编辑网站</DialogTitle>
            <DialogDescription>修改网站的基本信息和分类</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>网站名称</FormLabel>
                    <FormControl>
                      <Input placeholder="输入网站名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>网站链接</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>网站描述 (可选)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="输入网站描述，可留空" className="resize-none" rows={3} {...field} />
                    </FormControl>
                    <FormDescription>可选字段，留空也可以保存</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryIds"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">网站分类</FormLabel>
                      <FormDescription>选择一个或多个分类</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <FormField
                          key={category.id}
                          control={form.control}
                          name="categoryIds"
                          render={({ field }) => {
                            return (
                              <FormItem key={category.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, category.id])
                                        : field.onChange(field.value?.filter((value) => value !== category.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">{category.name}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  取消
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  保存
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  )
}

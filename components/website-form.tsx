"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import type { Category, Website } from "@/lib/types"
import { useDataStore } from "@/lib/store"
import { extractMetadata } from "@/lib/metadata-client"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "网站名称至少需要2个字符",
  }),
  url: z.string().url({
    message: "请输入有效的URL",
  }),
  categoryIds: z.array(z.string()).min(1, {
    message: "至少选择一个分类",
  }),
})

interface WebsiteFormProps {
  categories: Category[]
}

export function WebsiteForm({ categories }: WebsiteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const addWebsite = useDataStore((state) => state.addWebsite)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
      categoryIds: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // 双重错误保护：包装整个提交过程
    const safeSubmit = async () => {
      setIsSubmitting(true)

      try {
        console.log('开始添加网站:', values)

        // 抓取网站元数据，增加超时和错误处理
        let metadata
        try {
          const metadataPromise = extractMetadata(values.url)
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('元数据获取超时')), 10000)
          )
          
          metadata = await Promise.race([metadataPromise, timeoutPromise]) as any
          console.log('元数据获取成功:', metadata)
        } catch (metadataError) {
          console.warn('元数据获取失败，使用默认值:', metadataError)
          metadata = {
            title: values.name,
            description: "无描述",
            logo: null,
          }
        }

        // 创建新网站对象
        const newWebsite: Website = {
          id: Date.now().toString(),
          name: values.name,
          url: values.url,
          description: metadata.description || "无描述",
          logo: metadata.logo || null,
          categoryIds: values.categoryIds,
          createdAt: new Date(),
          isFeatured: false,
          isHot: false,
        }

        console.log('准备添加网站到store:', newWebsite)

        // 添加到store，用try-catch包装
        try {
          addWebsite(newWebsite)
          console.log('网站添加到store成功')
        } catch (storeError) {
          console.error('Store操作失败:', storeError)
          throw new Error('数据保存失败')
        }

        // 显示成功消息
        toast({
          title: "网站添加成功",
          description: "网站信息已成功添加到导航，页面已自动更新",
        })

        // 重置表单
        form.reset()
        console.log('表单重置成功')

      } catch (error) {
        console.error('添加网站失败:', error)
        
        // 检查是否是浏览器扩展错误
        const errorMessage = error instanceof Error ? error.message : String(error)
        const isExtensionError = errorMessage.includes('chrome-extension') || 
                                errorMessage.includes('undefined') && errorMessage.includes('JSON')
        
        if (isExtensionError) {
          toast({
            title: "检测到浏览器扩展干扰",
            description: "请尝试禁用浏览器扩展后重试，或使用无痕模式",
            variant: "destructive",
          })
        } else {
          toast({
            title: "添加失败",
            description: `添加网站时出现错误：${errorMessage}`,
            variant: "destructive",
          })
        }
      } finally {
        setIsSubmitting(false)
      }
    }

    // 使用额外的错误边界
    try {
      await safeSubmit()
    } catch (criticalError) {
      console.error('严重错误:', criticalError)
      setIsSubmitting(false)
      toast({
        title: "系统错误",
        description: "遇到了严重错误，请刷新页面后重试",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>网站名称</FormLabel>
              <FormControl>
                <Input placeholder="输入网站名称" {...field} />
              </FormControl>
              <FormDescription>网站的显示名称</FormDescription>
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
              <FormDescription>完整的网站URL，包括https://</FormDescription>
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
                <FormDescription>选择一个或多个分类，网站将在所选分类中展示</FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-4">
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          添加网站
        </Button>
      </form>
    </Form>
  )
}

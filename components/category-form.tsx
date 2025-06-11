"use client"

import React from "react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { Category } from "@/lib/types"
import { useDataStore } from "@/lib/store"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "分类名称至少需要2个字符",
  }),
  slug: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 2 && /^[a-z0-9-]+$/.test(val)), {
      message: "分类标识至少需要2个字符，只能包含小写字母、数字和连字符",
    }),
  description: z.string().optional(),
})

export function CategoryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { categories, addCategory } = useDataStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  })

  // 自动生成slug
  const watchName = form.watch("name")
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  // 当名称改变时自动更新slug（如果slug为空）
  React.useEffect(() => {
    if (watchName && !form.getValues("slug")) {
      form.setValue("slug", generateSlug(watchName))
    }
  }, [watchName, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      // 如果没有提供slug，自动生成
      const slug = values.slug || generateSlug(values.name)

      // 检查slug是否已存在
      const slugExists = categories.some((category) => category.slug === slug)
      if (slugExists) {
        toast({
          title: "创建失败",
          description: "分类标识已存在，请使用其他标识",
          variant: "destructive",
        })
        return
      }

      // 创建新分类对象
      const newCategory: Category = {
        id: Date.now().toString(),
        name: values.name,
        slug: slug,
        description: values.description || `${values.name}相关网站`,
      }

      // 添加到store
      addCategory(newCategory)

      toast({
        title: "分类创建成功",
        description: "新分类已成功添加，左侧栏和网站分类选择中已自动更新",
      })

      form.reset()
    } catch (error) {
      toast({
        title: "创建失败",
        description: "创建分类时出现错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
              <FormLabel>分类名称 *</FormLabel>
              <FormControl>
                <Input placeholder="输入分类名称" {...field} />
              </FormControl>
              <FormDescription>分类的显示名称（必填）</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>分类标识（选填）</FormLabel>
              <FormControl>
                <Input placeholder="留空将自动生成" {...field} />
              </FormControl>
              <FormDescription>用于URL的唯一标识，留空将根据分类名称自动生成</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>分类描述（选填）</FormLabel>
              <FormControl>
                <Textarea placeholder="留空将自动生成描述" className="resize-none" rows={3} {...field} />
              </FormControl>
              <FormDescription>描述该分类包含的网站类型，留空将自动生成</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          创建分类
        </Button>
      </form>
    </Form>
  )
}

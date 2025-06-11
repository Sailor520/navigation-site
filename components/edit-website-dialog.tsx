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
import { useDataStore } from "@/lib/store"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "网站名称至少需要2个字符",
  }),
  url: z.string().url({
    message: "请输入有效的URL",
  }),
  description: z.string().min(5, {
    message: "描述至少需要5个字符",
  }),
  categoryIds: z.array(z.string()).min(1, {
    message: "至少选择一个分类",
  }),
})

interface EditWebsiteDialogProps {
  website: Website
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditWebsiteDialog({ website, open, onOpenChange }: EditWebsiteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { categories, updateWebsite } = useDataStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: website.name,
      url: website.url,
      description: website.description,
      categoryIds: website.categoryIds,
    },
  })

  // 当网站数据变化时更新表单
  useEffect(() => {
    form.reset({
      name: website.name,
      url: website.url,
      description: website.description,
      categoryIds: website.categoryIds,
    })
  }, [website, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      updateWebsite(website.id, {
        name: values.name,
        url: values.url,
        description: values.description,
        categoryIds: values.categoryIds,
      })

      toast({
        title: "网站更新成功",
        description: "网站信息已成功更新",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "更新失败",
        description: "更新网站时出现错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
                  <FormLabel>网站描述</FormLabel>
                  <FormControl>
                    <Textarea placeholder="输入网站描述" className="resize-none" rows={3} {...field} />
                  </FormControl>
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
  )
}

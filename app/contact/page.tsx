"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Mail, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const contactSchema = z.object({
  name: z.string().min(2, "姓名至少需要2个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  subject: z.string().min(5, "主题至少需要5个字符"),
  message: z.string().min(10, "消息内容至少需要10个字符"),
})

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    setIsSubmitting(true)

    // 模拟提交延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("联系表单提交:", values)

    toast({
      title: "消息发送成功",
      description: "我们已收到您的消息，会在24小时内回复您。",
    })

    form.reset()
    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8 py-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">联系我们</h1>
        <p className="text-xl text-muted-foreground">有任何问题或建议？我们很乐意听到您的声音</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 联系信息 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                邮箱联系
              </CardTitle>
              <CardDescription>发送邮件给我们，我们会尽快回复</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">janemen92@gmail.com</p>
              <p className="text-sm text-muted-foreground mt-2">工作日24小时内回复</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                在线客服
              </CardTitle>
              <CardDescription>实时在线支持服务</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">工作时间：9:00 - 18:00</p>
              <p className="text-sm text-muted-foreground mt-2">周一至周五（节假日除外）</p>
              <Button className="mt-3" size="sm">
                开始对话
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 联系表单 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>发送消息</CardTitle>
              <CardDescription>填写下面的表单，我们会尽快与您取得联系</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>姓名 *</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入您的姓名" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>邮箱 *</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>主题 *</FormLabel>
                        <FormControl>
                          <Input placeholder="请简要描述您的问题或建议" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>详细内容 *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="请详细描述您的问题、建议或需求..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <>
                        <Send className="mr-2 h-4 w-4 animate-pulse" />
                        发送中...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        发送消息
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* 常见问题 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>常见问题</CardTitle>
              <CardDescription>在联系我们之前，您可能想了解这些常见问题</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">如何提交新的AI工具？</h3>
                <p className="text-sm text-muted-foreground">
                  您可以通过管理控制台提交新工具，或发送邮件给我们，包含工具的详细信息。
                </p>
              </div>
              <div>
                <h3 className="font-semibold">工具信息更新需要多长时间？</h3>
                <p className="text-sm text-muted-foreground">我们通常在收到提交后的1-3个工作日内完成审核和更新。</p>
              </div>
              <div>
                <h3 className="font-semibold">如何成为合作伙伴？</h3>
                <p className="text-sm text-muted-foreground">请通过邮件联系我们，详细说明您的合作意向和方案。</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

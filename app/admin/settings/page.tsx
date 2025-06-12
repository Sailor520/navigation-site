"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Settings, User, Shield, Activity, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { getAdminInfo } from "@/lib/admin-auth-server"


export default function AdminSettingsPage() {
  const [adminInfo, setAdminInfo] = useState<{ username: string; hasCustomCredentials: boolean } | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated, currentUsername, getLoginRecords } = useAdminAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // 确保组件已挂载
  useEffect(() => {
    setIsMounted(true)
    setIsLoading(false)
  }, [])

  // 如果未认证，重定向到首页
  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      console.log("未认证，重定向到首页")
      router.push("/")
    }
  }, [isAuthenticated, router, isMounted, isLoading])

  // 获取管理员信息
  useEffect(() => {
    async function fetchAdminInfo() {
      try {
        if (isAuthenticated) {
          const info = await getAdminInfo()
          setAdminInfo(info)
        }
      } catch (error) {
        console.error("获取管理员信息失败:", error)
      }
    }

    if (isAuthenticated && isMounted) {
      fetchAdminInfo()
    }
  }, [isAuthenticated, isMounted])

  // 显示加载状态
  if (isLoading || !isMounted) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  // 如果未认证，显示错误信息
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>访问受限</AlertTitle>
          <AlertDescription>您需要管理员权限才能访问此页面。请先登录管理员账号。</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/")}>返回首页</Button>
      </div>
    )
  }

  const loginRecords = getLoginRecords()

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold tracking-tight">管理员设置</h1>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">账号信息</TabsTrigger>
          <TabsTrigger value="logs">登录日志</TabsTrigger>
          <TabsTrigger value="setup">环境配置</TabsTrigger>
          <TabsTrigger value="version">版本检查</TabsTrigger>
        </TabsList>

        {/* 账号信息 */}
        <TabsContent value="info" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* 当前登录信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  当前登录信息
                </CardTitle>
                <CardDescription>当前登录的管理员账号信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">当前用户</label>
                  <p className="text-lg font-mono">{currentUsername}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">认证状态</label>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      已认证
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">存储方式</label>
                  <p className="text-sm text-muted-foreground">
                    {adminInfo?.hasCustomCredentials ? "环境变量（服务器端）" : "默认凭据"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 安全状态 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  安全状态
                </CardTitle>
                <CardDescription>账号安全配置状态</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {adminInfo?.hasCustomCredentials ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>安全配置已启用</AlertTitle>
                    <AlertDescription>
                      您已配置自定义管理员凭据，数据存储在服务器端环境变量中，安全性较高。
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>使用默认凭据</AlertTitle>
                    <AlertDescription>
                      当前使用默认管理员凭据，建议在 Vercel 中配置自定义环境变量以提高安全性。
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">安全特性：</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      服务器端验证
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      登录记录追踪
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      会话管理
                    </li>
                    <li className="flex items-center gap-2">
                      {adminInfo?.hasCustomCredentials ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 text-yellow-500" />
                      )}
                      自定义凭据配置
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 默认凭据信息 */}
          {!adminInfo?.hasCustomCredentials && (
            <Card>
              <CardHeader>
                <CardTitle>默认管理员凭据</CardTitle>
                <CardDescription>系统默认的管理员账号信息（建议修改）</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">默认账号</label>
                    <p className="text-lg font-mono">admin</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">默认密码</label>
                    <p className="text-lg font-mono">admin123456</p>
                  </div>
                </div>
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>安全建议</AlertTitle>
                  <AlertDescription>
                    为了提高安全性，建议在 Vercel 环境变量中配置自定义的 ADMIN_USERNAME 和 ADMIN_PASSWORD。
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 登录日志 */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                登录日志
              </CardTitle>
              <CardDescription>查看管理员登录尝试记录</CardDescription>
            </CardHeader>
            <CardContent>
              {loginRecords.length > 0 ? (
                <div className="space-y-4">
                  {loginRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={record.success ? "default" : "destructive"}>
                            {record.success ? "成功" : "失败"}
                          </Badge>
                          <span className="text-sm">账号: {record.username}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(record.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">暂无登录记录</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 环境配置说明 */}
        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vercel 环境变量配置</CardTitle>
              <CardDescription>如何在 Vercel 中配置自定义管理员凭据</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">配置步骤：</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">登录 Vercel Dashboard</p>
                      <p className="text-sm text-muted-foreground">访问 vercel.com 并登录您的账号</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">选择您的项目</p>
                      <p className="text-sm text-muted-foreground">在项目列表中找到并点击您的导航网站项目</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">进入设置页面</p>
                      <p className="text-sm text-muted-foreground">点击项目顶部的 "Settings" 选项卡</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                      4
                    </div>
                    <div>
                      <p className="font-medium">添加环境变量</p>
                      <p className="text-sm text-muted-foreground">在左侧菜单中点击 "Environment Variables"</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                      5
                    </div>
                    <div>
                      <p className="font-medium">配置变量</p>
                      <p className="text-sm text-muted-foreground">添加以下两个环境变量：</p>
                      <div className="mt-2 space-y-2">
                        <div className="rounded bg-gray-100 p-2 font-mono text-sm dark:bg-gray-800">
                          <div>
                            Name: <span className="text-blue-600">ADMIN_USERNAME</span>
                          </div>
                          <div>
                            Value: <span className="text-green-600">your_custom_username</span>
                          </div>
                        </div>
                        <div className="rounded bg-gray-100 p-2 font-mono text-sm dark:bg-gray-800">
                          <div>
                            Name: <span className="text-blue-600">ADMIN_PASSWORD</span>
                          </div>
                          <div>
                            Value: <span className="text-green-600">your_secure_password</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                      6
                    </div>
                    <div>
                      <p className="font-medium">重新部署</p>
                      <p className="text-sm text-muted-foreground">保存环境变量后，触发一次重新部署以使配置生效</p>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>配置完成后</AlertTitle>
                <AlertDescription>
                  环境变量配置完成并重新部署后，您就可以使用自定义的用户名和密码登录了。
                  原有的默认凭据将不再有效，数据将永久存储在 Vercel 服务器端。
                </AlertDescription>
              </Alert>

              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">💡 优势说明</h4>
                <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>• 完全免费，无额外成本</li>
                  <li>• 数据存储在服务器端，不会因清除浏览器数据而丢失</li>
                  <li>• 高安全性，凭据不会暴露在客户端代码中</li>
                  <li>• 支持在任何设备和浏览器上使用相同凭据</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 版本检查 */}
        <TabsContent value="version" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>版本信息</CardTitle>
              <CardDescription>当前部署的版本和构建信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">应用版本</label>
                <p className="text-lg font-mono">v1.0.0</p>
              </div>
              <div>
                <label className="text-sm font-medium">构建时间</label>
                <p className="text-sm text-muted-foreground">{new Date().toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium">运行环境</label>
                <p className="text-sm text-muted-foreground">Next.js 15.2.4</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>系统状态</CardTitle>
              <CardDescription>当前系统运行状态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>系统运行正常</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

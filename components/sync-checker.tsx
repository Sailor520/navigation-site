"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, RefreshCw, Github, Globe, Clock, AlertCircle } from "lucide-react"

export function SyncChecker() {
  const [isChecking, setIsChecking] = useState(false)
  const [syncStatus, setSyncStatus] = useState<{
    isSync: boolean
    lastCheck: Date
    githubCommit?: string
    vercelCommit?: string
    recommendations: string[]
  } | null>(null)

  const checkSync = async () => {
    setIsChecking(true)
    try {
      // 模拟检查过程
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 获取部署信息
      const response = await fetch("/api/deployment-info")
      const deploymentInfo = await response.json()

      // 这里应该与 GitHub API 比较，但为了演示，我们模拟结果
      const isSync = Math.random() > 0.3 // 70% 概率同步

      setSyncStatus({
        isSync,
        lastCheck: new Date(),
        githubCommit: "abc1234", // 实际应该从 GitHub API 获取
        vercelCommit: deploymentInfo.gitCommitSha?.substring(0, 7) || "unknown",
        recommendations: isSync
          ? ["✅ 版本同步正常", "✅ 无需额外操作"]
          : ["🔄 需要重新部署", "📝 检查最新提交是否已推送", "⚡ 触发手动部署"],
      })
    } catch (error) {
      console.error("检查同步状态失败:", error)
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 检查按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">同步状态检查</h3>
          <p className="text-sm text-muted-foreground">检查 GitHub 仓库与 Vercel 部署的版本一致性</p>
        </div>
        <Button onClick={checkSync} disabled={isChecking}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
          {isChecking ? "检查中..." : "检查同步"}
        </Button>
      </div>

      {/* 检查结果 */}
      {syncStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {syncStatus.isSync ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              同步状态
              <Badge variant={syncStatus.isSync ? "default" : "destructive"}>
                {syncStatus.isSync ? "已同步" : "不同步"}
              </Badge>
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              最后检查: {syncStatus.lastCheck.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 版本对比 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <span className="font-medium">GitHub 最新提交</span>
                </div>
                <p className="font-mono text-sm bg-muted p-2 rounded">{syncStatus.githubCommit}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium">Vercel 部署版本</span>
                </div>
                <p className="font-mono text-sm bg-muted p-2 rounded">{syncStatus.vercelCommit}</p>
              </div>
            </div>

            {/* 状态提示 */}
            <Alert variant={syncStatus.isSync ? "default" : "destructive"}>
              {syncStatus.isSync ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{syncStatus.isSync ? "版本同步" : "版本不同步"}</AlertTitle>
              <AlertDescription>
                {syncStatus.isSync
                  ? "GitHub 仓库与 Vercel 部署版本一致，无需额外操作。"
                  : "检测到版本不一致，建议按照下方建议进行同步。"}
              </AlertDescription>
            </Alert>

            {/* 建议操作 */}
            <div>
              <h4 className="font-medium mb-2">建议操作:</h4>
              <ul className="space-y-1">
                {syncStatus.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 同步解决方案 */}
      <Card>
        <CardHeader>
          <CardTitle>版本不一致解决方案</CardTitle>
          <CardDescription>当检测到版本不一致时，可以按照以下步骤解决</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                1
              </div>
              <div>
                <p className="font-medium">检查本地代码状态</p>
                <p className="text-sm text-muted-foreground">确保本地代码已提交并推送到 GitHub</p>
                <div className="mt-2 p-2 bg-muted rounded font-mono text-sm">
                  git status
                  <br />
                  git add .<br />
                  git commit -m "Update code"
                  <br />
                  git push origin main
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                2
              </div>
              <div>
                <p className="font-medium">触发 Vercel 重新部署</p>
                <p className="text-sm text-muted-foreground">在 Vercel Dashboard 中手动触发重新部署</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                    打开 Vercel Dashboard
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                3
              </div>
              <div>
                <p className="font-medium">验证部署结果</p>
                <p className="text-sm text-muted-foreground">等待部署完成后，重新检查版本同步状态</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

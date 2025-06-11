"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Github, Globe, Calendar, GitBranch } from "lucide-react"

export function VersionInfo() {
  const [buildInfo, setBuildInfo] = useState({
    buildTime: new Date().toISOString(),
    version: "1.0.0",
    gitCommit: "latest",
    environment: process.env.NODE_ENV || "development",
  })

  const [deploymentInfo, setDeploymentInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 获取构建时间（这会在每次构建时更新）
  useEffect(() => {
    setBuildInfo({
      buildTime: new Date().toISOString(),
      version: "1.0.0",
      gitCommit: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || "unknown",
      environment: process.env.NODE_ENV || "development",
    })
  }, [])

  // 获取 Vercel 部署信息
  const fetchDeploymentInfo = async () => {
    setIsLoading(true)
    try {
      // 尝试获取 Vercel 部署信息
      const response = await fetch("/api/deployment-info")
      if (response.ok) {
        const data = await response.json()
        setDeploymentInfo(data)
      }
    } catch (error) {
      console.error("获取部署信息失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDeploymentInfo()
  }, [])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          版本信息
          <Button variant="outline" size="sm" onClick={fetchDeploymentInfo} disabled={isLoading} className="ml-auto">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            刷新
          </Button>
        </CardTitle>
        <CardDescription>当前部署的版本和构建信息</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 构建信息 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">构建时间</label>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(buildInfo.buildTime).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">版本号</label>
            <p className="text-sm text-muted-foreground">{buildInfo.version}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Git Commit</label>
            <p className="text-sm text-muted-foreground font-mono">{buildInfo.gitCommit}</p>
          </div>
          <div>
            <label className="text-sm font-medium">环境</label>
            <Badge variant={buildInfo.environment === "production" ? "default" : "secondary"}>
              {buildInfo.environment}
            </Badge>
          </div>
        </div>

        {/* Vercel 部署信息 */}
        {deploymentInfo && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Vercel 部署信息
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium">部署 ID</label>
                <p className="text-muted-foreground font-mono text-xs">{deploymentInfo.deploymentId || "N/A"}</p>
              </div>
              <div>
                <label className="font-medium">部署时间</label>
                <p className="text-muted-foreground">
                  {deploymentInfo.deployedAt ? new Date(deploymentInfo.deployedAt).toLocaleString() : "N/A"}
                </p>
              </div>
              <div>
                <label className="font-medium">Git 分支</label>
                <p className="text-muted-foreground">{deploymentInfo.gitBranch || "main"}</p>
              </div>
              <div>
                <label className="font-medium">部署状态</label>
                <Badge variant="default">已部署</Badge>
              </div>
            </div>
          </div>
        )}

        {/* 快速链接 */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">快速链接</h4>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://github.com/${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <Github className="h-3 w-3" />
                GitHub 仓库
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <Globe className="h-3 w-3" />
                Vercel 控制台
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

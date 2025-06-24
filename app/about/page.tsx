import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "关于我们 - AI工具导航",
  description: "了解AI工具导航平台的使命、愿景和团队信息。我们致力于为用户提供最优质的AI工具资源导航服务。",
  keywords: "AI工具, 人工智能, 工具导航, 关于我们, AI资源",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">关于AI工具导航</h1>
        <p className="text-xl text-muted-foreground">发现、探索和使用最优质的AI工具资源</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>我们的使命</CardTitle>
            <CardDescription>为什么创建这个平台</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              在人工智能快速发展的时代，每天都有新的AI工具和服务涌现。我们的使命是帮助用户发现、评估和使用最适合他们需求的AI工具。
            </p>
            <p>
              通过精心策划和分类整理，我们为用户提供一个可信赖的AI工具资源中心，让每个人都能轻松找到提高工作效率和创造力的AI解决方案。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>我们的愿景</CardTitle>
            <CardDescription>未来的发展方向</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>成为全球领先的AI工具发现和评估平台，帮助个人和企业在AI时代保持竞争优势。</p>
            <p>我们致力于构建一个活跃的AI工具社区，让用户不仅能发现工具，还能分享使用经验、最佳实践和创新应用案例。</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>平台特色</CardTitle>
            <CardDescription>我们的核心优势</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>精心策划的AI工具集合，确保质量和实用性</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>智能分类系统，快速找到所需工具类型</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>实时更新，紧跟AI技术发展趋势</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>用户友好的界面设计，支持多种浏览方式</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>专业的工具评估和推荐系统</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>加入我们</CardTitle>
            <CardDescription>成为AI工具社区的一员</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              我们欢迎AI工具开发者、用户和爱好者加入我们的社区。无论您是想推荐新工具、分享使用经验，还是寻求技术支持，我们都期待您的参与。
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/contact">联系我们</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin">提交工具</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>发展历程</CardTitle>
          <CardDescription>我们的成长轨迹</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-2 border-blue-500 pl-4">
              <h3 className="font-semibold">2025年6月 - 平台启动</h3>
              <p className="text-sm text-muted-foreground">AI工具导航平台正式上线，开始收集和整理优质AI工具资源</p>
            </div>
            <div className="border-l-2 border-green-500 pl-4">
              <h3 className="font-semibold">持续发展</h3>
              <p className="text-sm text-muted-foreground">不断完善平台功能，扩大工具库规模，优化用户体验</p>
            </div>
            <div className="border-l-2 border-purple-500 pl-4">
              <h3 className="font-semibold">未来规划</h3>
              <p className="text-sm text-muted-foreground">计划推出AI工具评测、用户评价系统、个性化推荐等高级功能</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

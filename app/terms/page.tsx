import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "使用条款 - AI工具导航",
  description: "AI工具导航平台的使用条款和服务协议。了解您在使用我们服务时的权利和义务。",
  keywords: "使用条款, 服务协议, 法律声明, AI工具导航, 用户协议",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">使用条款</h1>
        <p className="text-xl text-muted-foreground">最后更新时间：2025年6月</p>
        <p className="text-muted-foreground">
          欢迎使用AI工具导航平台。请仔细阅读以下使用条款，使用我们的服务即表示您同意遵守这些条款。
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. 服务说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>AI工具导航（以下简称"本平台"）是一个专注于AI工具发现和导航的在线服务平台。我们为用户提供：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>精心策划的AI工具资源库</li>
              <li>智能分类和搜索功能</li>
              <li>工具评估和推荐服务</li>
              <li>用户社区和交流平台</li>
              <li>相关的技术支持和客户服务</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. 用户责任</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold">2.1 账户安全</h3>
            <p>
              用户有责任保护自己的账户信息安全，包括但不限于用户名、密码等。因用户自身原因导致的账户安全问题，本平台不承担责任。
            </p>

            <h3 className="font-semibold">2.2 内容规范</h3>
            <p>用户在使用本平台时，不得：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>发布违法、有害、威胁、辱骂、骚扰、诽谤、粗俗、淫秽或其他不当内容</li>
              <li>侵犯他人的知识产权、隐私权或其他合法权益</li>
              <li>传播病毒、恶意代码或其他可能损害系统的内容</li>
              <li>进行任何可能干扰或破坏服务正常运行的行为</li>
              <li>使用自动化工具过度访问或抓取网站内容</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. 知识产权</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold">3.1 平台内容</h3>
            <p>
              本平台的设计、文本、图片、软件、数据库等内容受知识产权法保护。未经授权，用户不得复制、修改、传播或商业使用这些内容。
            </p>

            <h3 className="font-semibold">3.2 用户内容</h3>
            <p>
              用户提交的内容（如评论、建议、工具推荐等）仍归用户所有，但用户授予本平台在全球范围内免费、非独占的使用权，用于改善和推广服务。
            </p>

            <h3 className="font-semibold">3.3 第三方工具</h3>
            <p>
              本平台展示的第三方AI工具的知识产权归其各自所有者所有。本平台仅提供导航和介绍服务，不拥有这些工具的知识产权。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. 隐私保护</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>我们重视用户隐私保护，具体的隐私政策请参见我们的隐私政策页面。主要原则包括：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>仅收集提供服务所必需的用户信息</li>
              <li>不会向第三方出售或泄露用户个人信息</li>
              <li>采用行业标准的安全措施保护用户数据</li>
              <li>用户有权查看、修改或删除自己的个人信息</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. 免责声明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold">5.1 服务可用性</h3>
            <p>
              本平台努力确保服务的稳定性和可用性，但不保证服务不会中断。因系统维护、升级或不可抗力因素导致的服务中断，本平台不承担责任。
            </p>

            <h3 className="font-semibold">5.2 第三方工具</h3>
            <p>
              本平台展示的第三方AI工具信息仅供参考。用户使用这些工具时，应自行评估风险。本平台不对第三方工具的功能、安全性、可靠性承担责任。
            </p>

            <h3 className="font-semibold">5.3 内容准确性</h3>
            <p>
              虽然我们努力确保平台内容的准确性和时效性，但不保证所有信息都是完全准确、完整或最新的。用户应自行验证相关信息。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. 服务变更和终止</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold">6.1 服务变更</h3>
            <p>本平台有权随时修改、暂停或终止部分或全部服务功能。重大变更会提前通知用户。</p>

            <h3 className="font-semibold">6.2 账户终止</h3>
            <p>如用户违反本使用条款，本平台有权暂停或终止用户账户。用户也可以随时申请注销账户。</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. 法律适用</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              本使用条款受中华人民共和国法律管辖。如发生争议，双方应友好协商解决；协商不成的，可向本平台所在地人民法院提起诉讼。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. 联系我们</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>如您对本使用条款有任何疑问或建议，请通过以下方式联系我们：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>邮箱：janemen92@gmail.com</li>
              <li>
                在线联系：
                <Link href="/contact" className="text-blue-600 hover:underline ml-1">
                  联系我们页面
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="rounded-lg bg-muted p-6">
          <p className="text-sm text-muted-foreground">
            <strong>重要提示：</strong>
            本使用条款可能会不定期更新。我们会在条款发生重大变更时通过网站公告、邮件等方式通知用户。
            继续使用本服务即表示您接受更新后的条款。建议您定期查看本页面以了解最新的使用条款。
          </p>
        </div>
      </div>
    </div>
  )
}

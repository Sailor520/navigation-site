import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { BlueLightIndicator } from "@/components/blue-light-indicator"
import { AuthProvider } from "@/lib/admin-auth-context"
import { ErrorBoundary } from "@/components/error-boundary"
import { GlobalErrorHandler } from "@/app/global-error-handler"
import { ExtensionWarning } from "@/components/extension-warning"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI工具导航 - 发现最优质的AI工具资源",
  description:
    "专业的AI工具导航平台，精心策划和分类整理各类人工智能工具，帮助您快速找到最适合的AI解决方案。包含机器学习、自然语言处理、计算机视觉等多个领域的优质工具。",
  keywords: "AI工具, 人工智能, 机器学习, 深度学习, 自然语言处理, 计算机视觉, AI导航, 工具推荐",
  authors: [{ name: "AI工具导航团队" }],
  creator: "AI工具导航",
  publisher: "AI工具导航",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://aitoolsnav.com",
    title: "AI工具导航 - 发现最优质的AI工具资源",
    description: "专业的AI工具导航平台，精心策划和分类整理各类人工智能工具",
    siteName: "AI工具导航",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 最早期的扩展错误保护 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 最早阶段的浏览器扩展错误拦截器
              (function() {
                const originalError = window.onerror;
                window.onerror = function(message, source, lineno, colno, error) {
                  const isExtensionError = 
                    (source && source.includes('chrome-extension://')) ||
                    (source && source.includes('moz-extension://')) ||
                    (source && source.includes('frame_ant')) ||
                    (message && message.includes('chrome-extension')) ||
                    (message && message.includes('undefined') && message.includes('JSON'));
                  
                  if (isExtensionError) {
                    console.warn('🔒 [早期拦截] 扩展错误被提前处理:', message);
                    return true; // 阻止错误传播
                  }
                  
                  // 调用原始错误处理器
                  if (originalError) {
                    return originalError.apply(this, arguments);
                  }
                  return false;
                };
                
                // 拦截JSON.parse错误
                const originalJSONParse = JSON.parse;
                JSON.parse = function(text, reviver) {
                  if (text === undefined || text === null || text === 'undefined' || text === 'null') {
                    console.warn('🔒 [JSON早期保护] 拦截了无效的JSON输入:', text);
                    return null;
                  }
                  return originalJSONParse.call(this, text, reviver);
                };
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="ai-tools-nav-theme"
            themes={["light", "dark", "system", "warm-beige", "eye-green", "warm-orange", "strong-blue-filter"]}
          >
            <AuthProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar />
                  <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
                </div>
                <Footer />
              </div>
              <BlueLightIndicator />
              <Toaster />
              <GlobalErrorHandler />
              <ExtensionWarning />
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

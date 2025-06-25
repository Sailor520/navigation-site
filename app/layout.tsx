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
import { ChunkErrorBoundary } from "@/components/chunk-error-boundary"
import { GlobalErrorHandler } from "@/app/global-error-handler"
import { ExtensionWarning } from "@/components/extension-warning"
import { HydrationProvider } from "@/components/hydration-provider"

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
                // 全局错误处理器
                const originalError = window.onerror;
                window.onerror = function(message, source, lineno, colno, error) {
                  const isExtensionError = 
                    (source && (source.includes('chrome-extension://') || source.includes('moz-extension://'))) ||
                    (message && (message.includes('chrome-extension') || message.includes('moz-extension'))) ||
                    (message && message.includes('web_accessible_resources')) ||
                    (message && message.includes('Extension')) ||
                    (source && source.includes('frame_ant'));
                  
                  if (isExtensionError) {
                    console.warn('🔒 [扩展错误拦截] 已处理扩展相关错误:', { message, source });
                    return true; // 阻止错误传播
                  }
                  
                  return originalError ? originalError.apply(this, arguments) : false;
                };
                
                // Promise 拒绝处理器 - 关键修复
                window.addEventListener('unhandledrejection', function(event) {
                  const reason = event.reason;
                  const isExtensionError = 
                    (reason && reason.message && (
                      reason.message.includes('chrome-extension://') ||
                      reason.message.includes('moz-extension://') ||
                      reason.message.includes('web_accessible_resources') ||
                      reason.message.includes('dynamically imported module')
                    )) ||
                    (reason && reason.stack && (
                      reason.stack.includes('chrome-extension://') ||
                      reason.stack.includes('moz-extension://')
                    ));
                  
                  if (isExtensionError) {
                    console.warn('🔒 [Promise错误拦截] 已处理扩展相关Promise错误:', reason);
                    event.preventDefault();
                    return;
                  }
                  
                  // 处理代码分割加载失败
                  if (reason && reason.name === 'ChunkLoadError') {
                    console.warn('🔧 [代码分割错误] 检测到代码块加载失败，将重新加载页面');
                    event.preventDefault();
                    setTimeout(() => window.location.reload(), 1000);
                    return;
                  }
                });
                
                // 拦截动态导入错误
                const originalImport = window.import || (() => {});
                if (typeof window.import === 'undefined') {
                  window.import = function(specifier) {
                    if (specifier && specifier.includes('chrome-extension://')) {
                      console.warn('🔒 [动态导入拦截] 阻止扩展模块导入:', specifier);
                      return Promise.reject(new Error('Extension import blocked'));
                    }
                    return originalImport.apply(this, arguments);
                  };
                }
                
                // JSON 解析保护
                const originalJSONParse = JSON.parse;
                JSON.parse = function(text, reviver) {
                  if (text === undefined || text === null || text === 'undefined' || text === 'null') {
                    console.warn('🔒 [JSON保护] 拦截无效JSON输入:', text);
                    return null;
                  }
                  return originalJSONParse.call(this, text, reviver);
                };
                
                // 服务工作者注册（仅在支持的环境中）
                if ('serviceWorker' in navigator && !navigator.serviceWorker.controller) {
                  navigator.serviceWorker.register('/sw.js')
                    .then(registration => console.log('🔧 [SW] 注册成功'))
                    .catch(error => console.log('🔧 [SW] 注册失败:', error.message));
                }
                
                console.log('🔒 [扩展防护] 浏览器扩展错误防护已启用');
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ChunkErrorBoundary>
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
              <HydrationProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar />
                  <main className="flex-1 overflow-auto p-4 md:p-6 transition-all duration-300">{children}</main>
                </div>
                <Footer />
              </div>
              <BlueLightIndicator />
              <Toaster />
              <GlobalErrorHandler />
              <ExtensionWarning />
              </HydrationProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
        </ChunkErrorBoundary>
      </body>
    </html>
  )
}

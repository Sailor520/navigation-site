"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // 检查是否是剪贴板相关错误
  const isClipboardError = error.message?.includes('clipboard') || error.message?.includes('Copy to clipboard')
  
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4 text-center px-4">
          <h1 className="text-4xl font-bold text-red-600">出错了</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            {isClipboardError ? '剪贴板功能错误' : '应用程序遇到了错误'}
          </h2>
          <p className="text-gray-600 max-w-md">
            {isClipboardError 
              ? '您的浏览器不支持剪贴板功能，但这不影响其他功能的正常使用。请尝试使用更新版本的浏览器。'
              : '抱歉，应用程序遇到了意外错误。请尝试刷新页面。'
            }
          </p>
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {isClipboardError ? '继续使用' : '重试'}
          </button>
        </div>
      </body>
    </html>
  )
}

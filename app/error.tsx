"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 text-center px-4">
      <h1 className="text-4xl font-bold text-red-600">出错了</h1>
      <h2 className="text-2xl font-semibold text-gray-700">页面加载失败</h2>
      <p className="text-gray-600 max-w-md">抱歉，页面加载时遇到了错误。请尝试刷新页面。</p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        重试
      </button>
    </div>
  )
}

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 text-center px-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">页面未找到</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">抱歉，您访问的页面不存在或已被移除。</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        返回首页
      </Link>
    </div>
  )
}

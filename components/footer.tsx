import Link from "next/link"
export default function Footer() {
  return (
    <footer className="border-t bg-background py-6">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} AI工具导航. 保留所有权利.
        </p>
        <div className="flex gap-4">
          <Link href="/about" className="text-sm text-muted-foreground hover:underline">
            关于我们
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
            联系方式
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
            使用条款
          </Link>
        </div>
      </div>
    </footer>
  )
}

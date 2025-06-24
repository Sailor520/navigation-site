import Link from "next/link"
export default function Footer() {
  return (
    <footer className="border-t bg-background py-6">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="text-center text-sm text-muted-foreground order-2 md:order-1 md:ml-[88px]">
            &copy; 2025 AI工具导航. 保留所有权利.
        </p>
          <div className="flex gap-6 order-1 md:order-2 md:mr-12">
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
      </div>
    </footer>
  )
}

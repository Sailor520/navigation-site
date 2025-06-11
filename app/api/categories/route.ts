import { NextResponse } from "next/server"
import { getCategories } from "@/lib/data"

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("获取分类失败:", error)
    return NextResponse.json({ error: "获取分类失败" }, { status: 500 })
  }
}

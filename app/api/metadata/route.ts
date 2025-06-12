import { type NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const response = await fetch(url, { next: { revalidate: 60 * 60 } })
    const html = await response.text()
    const $ = cheerio.load(html)

    // 提取标题
    const title = $("title").text() || $('meta[property="og:title"]').attr("content") || null

    // 提取描述
    const description =
      $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || null

    // 提取logo - 扩展更多可能的logo来源
    let logo =
      $('link[rel="apple-touch-icon"]').attr("href") ||
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="apple-touch-icon-precomposed"]').attr("href") ||
      $('meta[property="og:image"]').attr("content") ||
      $('link[rel="mask-icon"]').attr("href") ||
      $('link[sizes="192x192"]').attr("href") ||
      $('link[sizes="180x180"]').attr("href") ||
      null

    // 如果logo是相对路径，转换为绝对路径
    if (logo && !logo.startsWith("http")) {
      const urlObj = new URL(url)
      logo = logo.startsWith("/")
        ? `${urlObj.protocol}//${urlObj.host}${logo}`
        : `${urlObj.protocol}//${urlObj.host}/${logo}`
    }

    // 如果仍然没有找到logo，尝试通用的favicon路径
    if (!logo) {
      try {
        const urlObj = new URL(url)
        const faviconUrl = `${urlObj.protocol}//${urlObj.host}/favicon.ico`
        // 简单检查favicon是否存在（不做实际请求，避免性能问题）
        logo = faviconUrl
      } catch (e) {
        // URL解析失败，保持logo为null
      }
    }

    return NextResponse.json({ title, description, logo })
  } catch (error) {
    console.error("提取元数据失败:", error)
    
    // 返回一个明确的错误响应，确保JSON格式正确
    const errorResponse = {
      title: null,
      description: "无描述",
      logo: null,
      error: error instanceof Error ? error.message : '未知错误'
    }
    
    return NextResponse.json(errorResponse, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }
}

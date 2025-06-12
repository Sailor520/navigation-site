import { type NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const response = await fetch(url, { 
      next: { revalidate: 60 * 60 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const html = await response.text()
    const $ = cheerio.load(html)

    // 提取标题 - 增强容错能力
    let title = $("title").text().trim() || 
                $('meta[property="og:title"]').attr("content")?.trim() || 
                $('meta[name="title"]').attr("content")?.trim() ||
                $('h1').first().text().trim() || 
                null
    
    // 如果标题为空，尝试从URL推断
    if (!title) {
      const urlObj = new URL(url)
      title = urlObj.hostname.replace('www.', '')
    }

    // 提取描述 - 增强容错能力  
    let description =
      $('meta[name="description"]').attr("content")?.trim() || 
      $('meta[property="og:description"]').attr("content")?.trim() || 
      $('meta[name="twitter:description"]').attr("content")?.trim() ||
      null
    
    // 如果描述为空，提供基础描述
    if (!description) {
      description = `${title || 'Website'} - 网站链接`
    }

    // 提取logo - 优先使用真正的favicon，避免误用og:image
    let logo =
      $('link[rel="apple-touch-icon"]').attr("href") ||
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="apple-touch-icon-precomposed"]').attr("href") ||
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

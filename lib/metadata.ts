"use server"

import * as cheerio from "cheerio"

interface Metadata {
  title: string | null
  description: string | null
  logo: string | null
}

export async function extractMetadata(url: string): Promise<Metadata> {
  try {
    const response = await fetch(url, { next: { revalidate: 60 * 60 } }) // 1小时缓存
    const html = await response.text()
    const $ = cheerio.load(html)

    // 提取标题
    const title = $("title").text() || $('meta[property="og:title"]').attr("content") || null

    // 提取描述
    const description =
      $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || null

    // 提取logo
    let logo =
      $('link[rel="apple-touch-icon"]').attr("href") ||
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      null

    // 如果logo是相对路径，转换为绝对路径
    if (logo && !logo.startsWith("http")) {
      const urlObj = new URL(url)
      logo = logo.startsWith("/")
        ? `${urlObj.protocol}//${urlObj.host}${logo}`
        : `${urlObj.protocol}//${urlObj.host}/${logo}`
    }

    return { title, description, logo }
  } catch (error) {
    console.error("提取元数据失败:", error)
    return { title: null, description: null, logo: null }
  }
}

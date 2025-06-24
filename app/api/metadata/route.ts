import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(request: NextRequest) {
  let url: string = ''
  
  try {
    // 先解析请求体，保存URL以备后用
    const body = await request.json()
    url = body.url
    
    if (!url) {
      return NextResponse.json({ error: '缺少URL参数' }, { status: 400 })
    }
    
    console.log('📡 正在获取网站元数据:', url)
    
    // 特殊网站处理
    const specialSiteMetadata = handleSpecialSites(url)
    if (specialSiteMetadata) {
      console.log('✅ 使用特殊网站预设元数据:', specialSiteMetadata)
      return NextResponse.json(specialSiteMetadata)
    }
    
    // 获取网页HTML内容
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      // 增加超时时间，某些网站（如GitHub）响应较慢
      signal: AbortSignal.timeout(15000), // 15秒超时
    })
    
    if (!response.ok) {
      console.warn('获取网页失败:', response.status, response.statusText)
      return NextResponse.json({ 
        title: extractDomainName(url),
        description: '',
        logo: getFaviconUrl(url),
        favicon: getFaviconUrl(url),
        ogImage: ''
      })
    }
    
    const html = await response.text()
    const $ = cheerio.load(html)
    
    // 提取元数据
    const metadata = {
      title: extractTitle($, url),
      description: extractDescription($),
      logo: selectBestLogo($, url),
      favicon: extractFavicon($, url),
      ogImage: extractOgImage($, url),
    }
    
    console.log('✅ 成功提取元数据:', metadata)
    
    return NextResponse.json(metadata)
    
  } catch (error) {
    console.error('❌ 获取元数据失败:', error)
    
    // 返回基本信息作为回退，使用预先保存的URL
    return NextResponse.json({
      title: url ? extractDomainName(url) : '未知网站',
      description: '',
      logo: url ? getFaviconUrl(url) : '',
      favicon: url ? getFaviconUrl(url) : '',
      ogImage: ''
    }, { status: 200 }) // 返回200而不是500，避免前端报错
  }
}

// 提取页面标题
function extractTitle($: cheerio.CheerioAPI, url: string): string {
  // 优先级：og:title > title > domain
  const ogTitle = $('meta[property="og:title"]').attr('content')
  if (ogTitle) return ogTitle.trim()
  
  const title = $('title').text()
  if (title) return title.trim()
  
  return extractDomainName(url)
}

// 提取页面描述
function extractDescription($: cheerio.CheerioAPI): string {
  // 优先级：og:description > meta description > first p tag
  const ogDescription = $('meta[property="og:description"]').attr('content')
  if (ogDescription) return ogDescription.trim()
  
  const metaDescription = $('meta[name="description"]').attr('content')
  if (metaDescription) return metaDescription.trim()
  
  // 尝试获取第一段文字
  const firstP = $('p').first().text()
  if (firstP && firstP.length > 20) {
    return firstP.substring(0, 200).trim() + (firstP.length > 200 ? '...' : '')
  }
  
  return ''
}

// 智能选择最佳Logo
function selectBestLogo($: cheerio.CheerioAPI, url: string): string {
  const candidates: Array<{ url: string; score: number; source: string }> = []
  const baseUrl = getBaseUrl(url)

  // 1. 页面中的真实Logo图片（最高优先级）
  const logoSelectors = [
    { selector: 'img[class*="logo" i][src*="logo"]', bonus: 50 }, // 明确包含logo的
    { selector: 'img[id*="logo" i]', bonus: 45 },
    { selector: 'img[alt*="logo" i]', bonus: 45 },
    { selector: '.logo img', bonus: 40 },
    { selector: '#logo img', bonus: 40 },
    { selector: 'header img[class*="logo" i]', bonus: 35 },
    { selector: '.navbar img[class*="logo" i]', bonus: 35 },
    { selector: '.nav img[class*="logo" i]', bonus: 30 },
    { selector: '[class*="brand"] img', bonus: 30 },
    { selector: 'header img[alt*="logo" i]', bonus: 25 },
    { selector: '.header img[alt*="logo" i]', bonus: 25 },
    // 针对常见的logo容器
    { selector: '.site-logo img', bonus: 40 },
    { selector: '.brand-logo img', bonus: 40 },
    { selector: '.company-logo img', bonus: 40 },
    { selector: 'a[class*="logo"] img', bonus: 35 },
  ]

  logoSelectors.forEach(({ selector, bonus }) => {
    $(selector).each((_, element) => {
      const src = $(element).attr('src')
      if (src && !src.includes('data:')) {
        const logoUrl = resolveUrl(src, baseUrl)
        if (isValidImageUrl(logoUrl)) {
          let score = 60 + bonus
          
          // 根据图片特征调整分数
          const urlLower = logoUrl.toLowerCase()
          if (urlLower.includes('logo')) score += 20
          if (urlLower.includes('brand')) score += 15
          if (urlLower.includes('company')) score += 10
          
          // 检查尺寸信息
          const width = $(element).attr('width')
          const height = $(element).attr('height')
          if (width && height) {
            const w = parseInt(width)
            const h = parseInt(height)
            if (w >= 100 && w <= 300 && h >= 50 && h <= 200) {
              score += 10 // 合适的logo尺寸
            }
          }
          
          candidates.push({ url: logoUrl, score, source: 'page-logo' })
        }
      }
    })
  })

  // 2. SVG图标和高质量Favicon（中等优先级）
  $('link[rel="icon"]').each((_, element) => {
    const href = $(element).attr('href')
    const sizes = $(element).attr('sizes')
    const type = $(element).attr('type')
    
    if (href && !href.includes('data:')) {
      const logoUrl = resolveUrl(href, baseUrl)
      let score = 45
      
      // SVG格式大幅加分（矢量图通常是logo）
      if (type === 'image/svg+xml') {
        score += 35
      }
      
      // 根据尺寸加分，但不如真实logo
      if (sizes && sizes !== 'any') {
        const size = parseInt(sizes.split('x')[0])
        if (size >= 192) score += 15
        else if (size >= 96) score += 10
        else if (size >= 32) score += 5
      }
      
      // 检查文件名
      const urlLower = logoUrl.toLowerCase()
      if (urlLower.includes('logo')) score += 15
      if (urlLower.includes('brand')) score += 10
      
      candidates.push({ url: logoUrl, score, source: 'favicon' })
    }
  })

  // 3. Apple Touch Icons（降低优先级，主要用于移动设备）
  $('link[rel="apple-touch-icon"]').each((_, element) => {
    const href = $(element).attr('href')
    const sizes = $(element).attr('sizes')
    if (href && !href.includes('data:')) {
      const logoUrl = resolveUrl(href, baseUrl)
      let score = 25 // 大幅降低基础分数
      
      // 只有明确包含logo关键词才加分
      const urlLower = logoUrl.toLowerCase()
      if (urlLower.includes('logo')) score += 20
      else if (urlLower.includes('brand')) score += 15
      
      // 尺寸加分也减少
      if (sizes) {
        const size = parseInt(sizes.split('x')[0])
        if (size >= 180) score += 10
        else if (size >= 120) score += 8
        else if (size >= 96) score += 5
      }
      
      candidates.push({ url: logoUrl, score, source: 'apple-touch-icon' })
    }
  })

  // 4. OpenGraph图片（最低优先级，通常是截图）
  const ogImage = $('meta[property="og:image"]').attr('content')
  if (ogImage && !ogImage.includes('data:')) {
    const logoUrl = resolveUrl(ogImage, baseUrl)
    let score = 15 // 很低的基础分数
    
    // 只有明确包含logo关键词才考虑
    const urlLower = logoUrl.toLowerCase()
    if (urlLower.includes('logo')) {
      score += 25
      candidates.push({ url: logoUrl, score, source: 'og:image' })
    }
  }

  // 如果没有找到任何候选项，使用默认favicon
  if (candidates.length === 0) {
    return getFaviconUrl(url)
  }

  // 去重并按分数排序
  const uniqueCandidates = candidates
    .filter((candidate, index, self) => 
      self.findIndex(c => c.url === candidate.url) === index
    )
    .sort((a, b) => b.score - a.score)

  console.log('🎯 Logo候选项:', uniqueCandidates.slice(0, 5))
  
  // 返回分数最高的logo
  return uniqueCandidates[0].url
}

// 验证图片URL
function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname.toLowerCase()
    const fullUrl = url.toLowerCase()
    
    // 有效的图片扩展名
    const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp', '.avif']
    
    // 检查扩展名
    const hasValidExtension = validExtensions.some(ext => pathname.endsWith(ext))
    if (!hasValidExtension) return false
    
    // 明确排除的关键词（更严格）
    const excludeKeywords = [
      'banner', 'background', 'bg', 'hero', 'cover', 'thumb', 'thumbnail',
      'avatar', 'profile', 'photo', 'image', 'picture', 'gallery',
      'advertisement', 'ad', 'promo', 'social', 'share', 'screenshot',
      'header-bg', 'footer-bg', 'body-bg', 'wallpaper', 'backdrop',
      'preview', 'sample', 'demo', 'example', 'placeholder',
      'carousel', 'slider', 'slide', 'feature', 'showcase',
      'og:image', 'twitter:image', 'meta-image', 'share-image',
      'home-og', 'page-image', 'content-image', 'article-image'
    ]
    const hasExcludeKeyword = excludeKeywords.some(keyword => fullUrl.includes(keyword))
    if (hasExcludeKeyword) return false
    
    // 检查logo相关的关键词（加分项）
    const logoKeywords = ['logo', 'icon', 'favicon', 'brand', 'trademark', 'symbol', 'mark', 'emblem']
    const hasLogoKeyword = logoKeywords.some(keyword => fullUrl.includes(keyword))
    
    // 检查尺寸提示（logo通常有特定尺寸特征）
    const sizePattern = /(\d+)x(\d+)/
    const sizeMatch = url.match(sizePattern)
    let hasSuitableSize = true // 默认认为合适，除非明确不合适
    if (sizeMatch) {
      const width = parseInt(sizeMatch[1])
      const height = parseInt(sizeMatch[2])
      
      // 排除明显不是logo的尺寸
      // 过大的图片通常是截图或装饰图
      if (width > 800 || height > 600) hasSuitableSize = false
      
      // 过小的图片可能是icon，但不是主logo
      if (width < 16 || height < 16) hasSuitableSize = false
      
      // 极端宽高比的图片通常不是logo
      const aspectRatio = width / height
      if (aspectRatio > 4 || aspectRatio < 0.25) hasSuitableSize = false
    }
    
    // 检查路径结构（logo通常在特定位置）
    const pathSegments = pathname.split('/').filter(Boolean)
    const isInSuitableLocation = pathSegments.length <= 4 || 
                                pathSegments.some(segment => 
                                  ['assets', 'static', 'images', 'img', 'icons', 'logos', 'brand'].includes(segment))
    
    // 检查文件名是否看起来像logo
    const filename = pathSegments[pathSegments.length - 1] || ''
    const filenameKeywords = ['logo', 'brand', 'icon', 'symbol', 'mark', 'emblem']
    const hasLogoFilename = filenameKeywords.some(keyword => filename.includes(keyword))
    
    // 综合判断
    // 必须满足基本条件：有效扩展名 + 没有排除关键词 + 合适尺寸
    let isValid = hasValidExtension && !hasExcludeKeyword && hasSuitableSize
    
    // 如果在合适位置或有logo关键词，更容易通过
    if (hasLogoKeyword || hasLogoFilename || isInSuitableLocation) {
      isValid = isValid || (hasValidExtension && !hasExcludeKeyword)
    }
    
    return isValid
  } catch {
    return false
  }
}

// 提取Favicon
function extractFavicon($: cheerio.CheerioAPI, url: string): string {
  const baseUrl = getBaseUrl(url)
  
  const faviconSelectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
  ]
  
  for (const selector of faviconSelectors) {
    const href = $(selector).attr('href')
    if (href) {
      return resolveUrl(href, baseUrl)
    }
  }
  
  return getFaviconUrl(url)
}

// 提取Open Graph图片
function extractOgImage($: cheerio.CheerioAPI, url: string): string {
  const baseUrl = getBaseUrl(url)
  const ogImage = $('meta[property="og:image"]').attr('content')
  
  if (ogImage) {
    return resolveUrl(ogImage, baseUrl)
  }
  
  return ''
}

// 工具函数：获取域名
function extractDomainName(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

// 工具函数：获取基础URL
function getBaseUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return `${urlObj.protocol}//${urlObj.host}`
  } catch {
    return url
  }
}

// 解析相对URL为绝对URL
function resolveUrl(url: string, baseUrl: string): string {
  try {
    // 如果已经是绝对URL，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    
    // 如果是协议相对URL（//example.com/path）
    if (url.startsWith('//')) {
      const baseUrlObj = new URL(baseUrl)
      return baseUrlObj.protocol + url
    }
    
    // 如果是根路径相对URL（/path）
    if (url.startsWith('/')) {
      const baseUrlObj = new URL(baseUrl)
      return `${baseUrlObj.protocol}//${baseUrlObj.host}${url}`
    }
    
    // 如果是相对路径（path 或 ./path）
    const baseUrlObj = new URL(baseUrl)
    // 移除查询参数和hash，只保留路径
    const basePath = baseUrlObj.pathname.endsWith('/') 
      ? baseUrlObj.pathname 
      : baseUrlObj.pathname.substring(0, baseUrlObj.pathname.lastIndexOf('/') + 1)
    
    return `${baseUrlObj.protocol}//${baseUrlObj.host}${basePath}${url.replace(/^\.\//, '')}`
  } catch (error) {
    console.error('解析URL失败:', error, 'url:', url, 'baseUrl:', baseUrl)
    return url
  }
}

// 工具函数：获取默认favicon
function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`
  } catch {
    return ''
  }
}

// 处理特殊网站
function handleSpecialSites(url: string): any | null {
  const domain = extractDomainName(url).toLowerCase()
  
  // 预设的特殊网站元数据
  const specialSites: Record<string, any> = {
    'bilibili.com': {
      title: '哔哩哔哩 (゜-゜)つロ 干杯~-bilibili',
      description: '哔哩哔哩（bilibili）是国内知名的视频弹幕网站，这里有及时的动漫新番，活跃的ACG氛围，有创意的Up主。大家可以在这里找到许多欢乐。',
      logo: 'https://www.bilibili.com/favicon.ico',
      favicon: 'https://www.bilibili.com/favicon.ico',
      ogImage: ''
    },
    'www.bilibili.com': {
      title: '哔哩哔哩 (゜-゜)つロ 干杯~-bilibili',
      description: '哔哩哔哩（bilibili）是国内知名的视频弹幕网站，这里有及时的动漫新番，活跃的ACG氛围，有创意的Up主。大家可以在这里找到许多欢乐。',
      logo: 'https://www.bilibili.com/favicon.ico',
      favicon: 'https://www.bilibili.com/favicon.ico',
      ogImage: ''
    },
    'backlinkwatch.com': {
      title: 'Backlink Watch - Free Real-time Backlinks Checker Tool',
      description: 'Today search engine optimization greatly depends on quality of inbound links to increase your serp rank and ultimately increase affiliate or ppc adsense,ypn revenue.',
      logo: 'https://www.backlinkwatch.com/images/logo.gif',
      favicon: 'https://www.backlinkwatch.com/favicon.ico',
      ogImage: ''
    },
    'www.backlinkwatch.com': {
      title: 'Backlink Watch - Free Real-time Backlinks Checker Tool',
      description: 'Today search engine optimization greatly depends on quality of inbound links to increase your serp rank and ultimately increase affiliate or ppc adsense,ypn revenue.',
      logo: 'https://www.backlinkwatch.com/images/logo.gif',
      favicon: 'https://www.backlinkwatch.com/favicon.ico',
      ogImage: ''
    }
  }
  
  return specialSites[domain] || null
}

"use client"

export interface WebsiteMetadata {
  title?: string
  description?: string
  logo?: string
  favicon?: string
  ogImage?: string
}

// 获取网站元数据（带重试机制）
export async function fetchWebsiteMetadata(url: string, retries = 2): Promise<WebsiteMetadata> {
  try {
    console.log('🔍 正在获取网站元数据:', url, retries > 0 ? `(剩余重试: ${retries})` : '')
    
    // 确保URL格式正确
    const normalizedUrl = normalizeUrl(url)
    
    // 使用我们的API端点获取元数据
    const response = await fetch('/api/metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: normalizedUrl }),
    })
    
    if (!response.ok) {
      console.warn('获取元数据失败:', response.status, response.statusText)
      
      // 如果是5xx错误且还有重试次数，进行重试
      if (response.status >= 500 && retries > 0) {
        console.log('🔄 服务器错误，进行重试...')
        await new Promise(resolve => setTimeout(resolve, 1000)) // 等待1秒
        return fetchWebsiteMetadata(url, retries - 1)
      }
      
      // 返回基础元数据作为回退
      return {
        title: extractDomainName(url),
        description: '',
        logo: getFaviconUrl(url),
        favicon: getFaviconUrl(url),
        ogImage: ''
      }
    }
    
    const metadata = await response.json()
    console.log('✅ 成功获取元数据:', {
      title: metadata.title?.substring(0, 50) + '...',
      description: metadata.description?.substring(0, 50) + '...',
      logo: metadata.logo,
      hasLogo: !!metadata.logo
    })
    
    return metadata
  } catch (error) {
    console.error('❌ 获取元数据出错:', error)
    
    // 如果是网络错误且还有重试次数，进行重试
    if (retries > 0) {
      console.log('🔄 网络错误，进行重试...')
      await new Promise(resolve => setTimeout(resolve, 1000)) // 等待1秒
      return fetchWebsiteMetadata(url, retries - 1)
    }
    
    // 返回基础元数据作为回退
    return {
      title: extractDomainName(url),
      description: '',
      logo: getFaviconUrl(url),
      favicon: getFaviconUrl(url),
      ogImage: ''
    }
  }
}

// 标准化URL格式
function normalizeUrl(url: string): string {
  try {
    // 如果没有协议，添加https://
    if (!url.match(/^https?:\/\//)) {
      url = 'https://' + url
    }
    
    const urlObj = new URL(url)
    return urlObj.toString()
  } catch (error) {
    console.error('URL格式化失败:', error)
    return url
  }
}

// 从域名提取网站名称
function extractDomainName(url: string): string {
  try {
    const urlObj = new URL(normalizeUrl(url))
    return urlObj.hostname.replace('www.', '')
  } catch (error) {
    console.error('提取域名失败:', error)
    return url
  }
}

// 从URL获取favicon
export function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(normalizeUrl(url))
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`
  } catch (error) {
    console.error('获取favicon URL失败:', error)
    return ''
  }
}

// 智能选择最佳logo
export function selectBestLogo(metadata: WebsiteMetadata, url: string): string {
  // 收集所有可能的logo候选者
  const candidates: Array<{ url: string; score: number; source: string }> = []
  
  // 从metadata中提取所有可能的logo
  if (metadata.logo) {
    const logoUrls = Array.isArray(metadata.logo) ? metadata.logo : [metadata.logo]
    logoUrls.forEach(logoUrl => {
      const score = calculateLogoScore(logoUrl, url)
      if (score > 0) {
        candidates.push({
          url: logoUrl,
          score,
          source: 'extracted-logo'
        })
      }
    })
  }
  
  // OpenGraph图片（作为备选）
  if (metadata.ogImage) {
    const score = calculateImageScore(metadata.ogImage, 'og-image')
    if (score > 0) {
      candidates.push({
        url: metadata.ogImage,
        score,
        source: 'og-image'
      })
    }
  }
  
  // Favicon（优先级较低）
  if (metadata.favicon) {
    const score = calculateImageScore(metadata.favicon, 'favicon')
    if (score > 0) {
      candidates.push({
        url: metadata.favicon,
        score,
        source: 'favicon'
      })
    }
  }
  
  // 如果没有找到合适的候选者，使用默认favicon
  if (candidates.length === 0) {
    return getFaviconUrl(url)
  }
  
  // 按分数排序，选择最高分的
  candidates.sort((a, b) => b.score - a.score)
  
  console.log('🎯 Logo候选者评分结果:', candidates.map(c => ({
    url: c.url.substring(0, 50) + '...',
    score: c.score,
    source: c.source
  })))
  
  return candidates[0].url
}

// 计算Logo分数（针对从页面提取的logo）
function calculateLogoScore(logoUrl: string, baseUrl: string): number {
  let score = 0
  const url = logoUrl.toLowerCase()
  const filename = url.split('/').pop() || ''
  
  try {
    const urlObj = new URL(logoUrl)
    const path = urlObj.pathname.toLowerCase()
    
    // === 页面真实Logo检测（高优先级 60-110分） ===
    
    // 明确的logo路径和文件名
    if (path.includes('/logo') || path.includes('/brand') || path.includes('/assets/logo')) {
      score += 80
    }
    
    // Logo相关的文件名
    if (filename.includes('logo')) {
      if (filename.includes('main') || filename.includes('primary') || filename.includes('header')) {
        score += 70
      } else {
        score += 60
      }
    }
    
    // 品牌相关的文件名
    if (filename.includes('brand') || filename.includes('identity')) {
      score += 65
    }
    
    // 高质量图片格式加分
    if (url.includes('.svg')) {
      score += 30 // SVG最佳
    } else if (url.includes('.png')) {
      score += 20
    } else if (url.includes('.webp')) {
      score += 15
    }
    
    // 尺寸提示（从文件名推断）
    const sizeMatch = filename.match(/(\d+)x(\d+)/)
    if (sizeMatch) {
      const size = parseInt(sizeMatch[1])
      if (size >= 200) {
        score += 20 // 大尺寸加分
      } else if (size >= 100) {
        score += 10
      }
    }
    
    // === Apple Touch Icons（大幅降低优先级 25-45分） ===
    if (url.includes('apple-touch-icon') || url.includes('apple-icon')) {
      score = Math.max(score, 25) // 基础分数很低
      
      // 只有高分辨率的才稍微加分
      if (url.includes('192') || url.includes('180') || url.includes('256')) {
        score += 20
      } else if (url.includes('120') || url.includes('152')) {
        score += 10
      }
    }
    
    // === SVG图标和高质量favicon（中等优先级 40-70分） ===
    if (url.includes('favicon') && !url.includes('apple')) {
      score = Math.max(score, 40)
      
      if (url.includes('.svg')) {
        score += 30
      } else if (url.includes('.png')) {
        score += 15
      }
    }
    
    // === 严格过滤低质量图片 ===
    
    // 严重减分项
    if (isScreenshotOrDecorative(url, filename)) {
      score -= 50 // 大幅减分
    }
    
    // 太小的图片减分
    if (filename.includes('16x16') || filename.includes('32x32')) {
      score -= 15
    }
    
    // 基于CDN/路径的质量判断
    if (isHighQualityImagePath(urlObj.pathname)) {
      score += 15
    }
    
    // 确保分数不为负数
    return Math.max(0, score)
    
  } catch (error) {
    console.warn('计算Logo分数时出错:', error)
    return 0
  }
}

// 计算一般图片分数
function calculateImageScore(imageUrl: string, type: 'og-image' | 'favicon'): number {
  let score = 0
  const url = imageUrl.toLowerCase()
  
  if (type === 'og-image') {
    score = 30 // OG图片基础分数
    
    // 如果OG图片看起来像logo，加分
    if (url.includes('logo') || url.includes('brand')) {
      score += 25
    }
    
    // 过滤明显的截图或装饰图片
    if (isScreenshotOrDecorative(url)) {
      score -= 20
    }
  } else if (type === 'favicon') {
    score = 35 // Favicon基础分数
    
    if (url.includes('.svg')) {
      score += 20
    } else if (url.includes('.png')) {
      score += 10
    }
  }
  
  return Math.max(0, score)
}

// 检测是否为截图或装饰性图片
function isScreenshotOrDecorative(url: string, filename?: string): boolean {
  const lowerUrl = url.toLowerCase()
  const lowerFilename = filename?.toLowerCase() || ''
  
  // 明确的截图指示器
  const screenshotIndicators = [
    'screenshot', 'screen-shot', 'preview', 'demo', 'example',
    'thumbnail', 'cover', 'banner', 'hero', 'background',
    'social', 'share', 'og-', 'twitter', 'facebook',
    'card', 'feature', 'gallery', 'slide'
  ]
  
  return screenshotIndicators.some(indicator => 
    lowerUrl.includes(indicator) || lowerFilename.includes(indicator)
  )
}

// 检测是否为高质量图片路径
function isHighQualityImagePath(path: string): boolean {
  const highQualityPaths = [
    '/assets/', '/static/', '/images/', '/img/',
    '/brand/', '/logos/', '/icons/', '/media/'
  ]
  
  return highQualityPaths.some(qualityPath => 
    path.includes(qualityPath)
  )
}

// 验证图片URL有效性
function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']
    const pathname = urlObj.pathname.toLowerCase()
    
    // 检查是否有有效的图片扩展名，或者是已知的图片服务
    return validExtensions.some(ext => pathname.endsWith(ext)) ||
           pathname.includes('logo') ||
           pathname.includes('icon') ||
           url.includes('favicon')
  } catch {
    return false
  }
} 
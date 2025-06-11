interface Metadata {
  title: string | null
  description: string | null
  logo: string | null
}

export async function extractMetadata(url: string): Promise<Metadata> {
  try {
    console.log('开始获取元数据:', url)
    
    // 在客户端，我们使用一个简化的元数据提取
    // 在实际应用中，这应该通过API路由来处理以避免CORS问题
    const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 添加超时控制
      signal: AbortSignal.timeout(15000) // 15秒超时
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch metadata`)
    }
    
    const text = await response.text()
    console.log('API响应文本:', text)
    
    // 安全解析JSON
    let result
    try {
      // 检查响应是否为空或无效
      if (!text || text.trim() === '') {
        throw new Error('Empty response from server')
      }
      
      // 检查是否包含明显的HTML错误页面
      if (text.includes('<html>') || text.includes('<!DOCTYPE')) {
        throw new Error('Server returned HTML instead of JSON')
      }
      
      result = JSON.parse(text)
    } catch (parseError) {
      console.error('JSON解析失败:', parseError, '原始文本:', text)
      throw new Error('Invalid JSON response from server')
    }
    
    console.log('元数据解析成功:', result)
    return result
  } catch (error) {
    console.error("提取元数据失败:", error)
    
    // 检查是否是扩展相关错误
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('chrome-extension') || 
        (errorMessage.includes('undefined') && errorMessage.includes('JSON'))) {
      console.warn('检测到浏览器扩展干扰，返回默认元数据')
    }
    
    // 返回默认值
    return {
      title: null,
      description: "无描述",
      logo: null,
    }
  }
}

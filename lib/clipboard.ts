/**
 * 剪贴板工具函数
 * 提供跨浏览器兼容性和错误处理
 */

export interface ClipboardResult {
  success: boolean
  error?: string
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<ClipboardResult>
 */
export async function copyToClipboard(text: string): Promise<ClipboardResult> {
  try {
    // 检查基本环境
    if (typeof window === "undefined") {
      return { 
        success: false, 
        error: '服务器端不支持剪贴板功能' 
      }
    }

    // 检查是否支持现代剪贴板 API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text)
        return { success: true }
      } catch (clipboardError) {
        console.warn('现代剪贴板API失败，尝试降级方案:', clipboardError)
        // 现代API失败，尝试降级方案
        return fallbackCopyToClipboard(text)
      }
    }

    // 降级方案：使用传统的 document.execCommand
    return fallbackCopyToClipboard(text)
  } catch (error) {
    console.warn('剪贴板操作失败:', error)
    
    // 最后尝试降级方案
    try {
      return fallbackCopyToClipboard(text)
    } catch (fallbackError) {
      return { 
        success: false, 
        error: '剪贴板功能在当前环境下不可用，请手动复制内容' 
      }
    }
  }
}

/**
 * 降级剪贴板复制方案
 * @param text 要复制的文本
 * @returns ClipboardResult
 */
function fallbackCopyToClipboard(text: string): ClipboardResult {
  try {
    // 创建临时文本域
    const textArea = document.createElement('textarea')
    textArea.value = text
    
    // 设置样式使其不可见
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    textArea.style.opacity = '0'
    
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    // 尝试复制
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    if (successful) {
      return { success: true }
    } else {
      return { 
        success: false, 
        error: '浏览器不支持复制功能，请手动复制内容' 
      }
    }
  } catch (error) {
    return { 
      success: false, 
      error: '复制失败，请手动复制内容' 
    }
  }
}

/**
 * 检查浏览器是否支持剪贴板功能
 * @returns boolean
 */
export function isClipboardSupported(): boolean {
  if (typeof window === "undefined") {
    return false
  }
  
  return !!(
    (navigator.clipboard && window.isSecureContext) || 
    document.queryCommandSupported?.('copy')
  )
}

/**
 * 安全地复制文本到剪贴板，包含完整的错误处理
 * @param text 要复制的文本
 * @param onSuccess 成功回调
 * @param onError 错误回调
 */
export async function safeCopyToClipboard(
  text: string,
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<void> {
  try {
    const result = await copyToClipboard(text)
    
    if (result.success) {
      onSuccess?.()
    } else {
      onError?.(result.error || '复制失败')
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    console.warn('剪贴板复制异常:', errorMessage)
    onError?.(errorMessage)
  }
} 
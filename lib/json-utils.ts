/**
 * 安全的JSON处理工具函数
 * 防止因undefined、null等无效值导致的解析错误
 */

export interface SafeParseResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * 安全地解析JSON字符串
 * @param jsonString JSON字符串
 * @param fallback 解析失败时的默认值
 * @returns 解析结果
 */
export function safeJsonParse<T>(
  jsonString: string | null | undefined,
  fallback?: T
): SafeParseResult<T> {
  try {
    // 检查输入值是否有效
    if (!jsonString || 
        jsonString === "undefined" || 
        jsonString === "null" || 
        jsonString.trim() === "") {
      return {
        success: false,
        error: "Invalid JSON string: empty or undefined",
        data: fallback
      }
    }

    const parsed = JSON.parse(jsonString)
    
    // 检查解析结果是否有效
    if (parsed === null || parsed === undefined) {
      return {
        success: false,
        error: "Parsed result is null or undefined",
        data: fallback
      }
    }

    return {
      success: true,
      data: parsed
    }
  } catch (error) {
    console.warn("JSON parse error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown parse error",
      data: fallback
    }
  }
}

/**
 * 安全地将对象序列化为JSON字符串
 * @param obj 要序列化的对象
 * @returns JSON字符串或null
 */
export function safeJsonStringify(obj: any): string | null {
  try {
    if (obj === undefined || obj === null) {
      return null
    }
    
    return JSON.stringify(obj)
  } catch (error) {
    console.warn("JSON stringify error:", error)
    return null
  }
}

/**
 * 从localStorage安全地获取和解析数据
 * @param key localStorage键名
 * @param fallback 默认值
 * @returns 解析后的数据
 */
export function getFromLocalStorage<T>(key: string, fallback?: T): T | undefined {
  if (typeof window === "undefined" || !window.localStorage) {
    return fallback
  }

  try {
    const item = localStorage.getItem(key)
    const result = safeJsonParse<T>(item, fallback)
    return result.success ? result.data : fallback
  } catch (error) {
    console.warn(`Failed to get ${key} from localStorage:`, error)
    return fallback
  }
}

/**
 * 安全地将数据保存到localStorage
 * @param key localStorage键名
 * @param value 要保存的值
 * @returns 是否保存成功
 */
export function setToLocalStorage(key: string, value: any): boolean {
  if (typeof window === "undefined" || !window.localStorage) {
    return false
  }

  try {
    const jsonString = safeJsonStringify(value)
    if (jsonString === null) {
      console.warn(`Failed to stringify value for key ${key}`)
      return false
    }

    localStorage.setItem(key, jsonString)
    return true
  } catch (error) {
    console.warn(`Failed to set ${key} to localStorage:`, error)
    return false
  }
} 
export interface Website {
  id: string
  name: string
  url: string
  description: string
  logo: string | null
  categoryIds: string[] // 支持多分类
  isFeatured?: boolean
  isHot?: boolean
  order?: number
  createdAt: string // 改为 string 类型，与数据库匹配
  updatedAt: string // 添加 updatedAt 字段
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  order?: number // 添加排序字段
  createdAt: string // 添加创建时间
  updatedAt: string // 添加更新时间
}

export interface Website {
  id: string
  name: string
  url: string
  description: string
  logo: string | null
  categoryIds: string[] // 改为数组，支持多分类
  createdAt: Date
  isFeatured?: boolean
  isHot?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
}

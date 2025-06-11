import type { Category, Website } from "@/lib/types"

// 使用可变的数据存储 - 在实际应用中，这些数据会从数据库中获取
const categories: Category[] = [
  {
    id: "1",
    name: "社交媒体",
    slug: "social-media",
    description: "各类社交媒体平台",
  },
  {
    id: "2",
    name: "学习资源",
    slug: "learning-resources",
    description: "在线学习平台和教育资源",
  },
  {
    id: "3",
    name: "工具网站",
    slug: "tools",
    description: "实用的在线工具和服务",
  },
  {
    id: "4",
    name: "技术博客",
    slug: "tech-blogs",
    description: "技术相关的博客和资讯",
  },
]

const websites: Website[] = [
  {
    id: "1",
    name: "GitHub",
    url: "https://github.com",
    description: "面向开源及私有软件项目的托管平台",
    logo: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
    categoryId: "3",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Stack Overflow",
    url: "https://stackoverflow.com",
    description: "程序设计领域的问答网站",
    logo: "https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png",
    categoryId: "3",
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Twitter",
    url: "https://twitter.com",
    description: "社交网络及微博客服务",
    logo: "https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png",
    categoryId: "1",
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Coursera",
    url: "https://www.coursera.org",
    description: "大规模开放在线课程平台",
    logo: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera.s3.amazonaws.com/media/coursera-logo-square.png",
    categoryId: "2",
    createdAt: new Date(),
  },
  {
    id: "5",
    name: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "Web技术的学习平台",
    logo: "https://developer.mozilla.org/apple-touch-icon.6803c6f0.png",
    categoryId: "2",
    createdAt: new Date(),
  },
  {
    id: "6",
    name: "CSS-Tricks",
    url: "https://css-tricks.com",
    description: "关于CSS、HTML等前端技术的博客",
    logo: "https://css-tricks.com/apple-touch-icon.png",
    categoryId: "4",
    createdAt: new Date(),
  },
  {
    id: "7",
    name: "Smashing Magazine",
    url: "https://www.smashingmagazine.com",
    description: "为Web设计师和开发者提供的专业杂志",
    logo: "https://www.smashingmagazine.com/images/favicon/apple-touch-icon.png",
    categoryId: "4",
    createdAt: new Date(),
  },
  {
    id: "8",
    name: "LinkedIn",
    url: "https://www.linkedin.com",
    description: "商业和就业导向的社交网络服务",
    logo: "https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca",
    categoryId: "1",
    createdAt: new Date(),
  },
]

// 获取所有分类
export async function getCategories(): Promise<Category[]> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 100))
  return [...categories]
}

// 获取特定分类
export async function getCategory(slug: string): Promise<Category | null> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 100))
  return categories.find((category) => category.slug === slug) || null
}

// 获取特定分类的网站
export async function getWebsitesByCategory(categoryId: string): Promise<Website[]> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 100))
  return websites.filter((website) => website.categoryId === categoryId)
}

// 获取所有网站
export async function getWebsites(): Promise<Website[]> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 100))
  return [...websites]
}

// 添加新网站
export async function createWebsite(websiteData: Omit<Website, "id" | "createdAt">): Promise<Website> {
  const newWebsite: Website = {
    ...websiteData,
    id: Date.now().toString(),
    createdAt: new Date(),
  }
  websites.push(newWebsite)
  return newWebsite
}

// 添加新分类
export async function createCategory(categoryData: Omit<Category, "id">): Promise<Category> {
  const newCategory: Category = {
    ...categoryData,
    id: Date.now().toString(),
  }
  categories.push(newCategory)
  return newCategory
}

// 检查分类slug是否已存在
export async function checkCategorySlugExists(slug: string): Promise<boolean> {
  return categories.some((category) => category.slug === slug)
}

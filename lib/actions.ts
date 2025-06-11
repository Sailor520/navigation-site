"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { extractMetadata } from "@/lib/metadata"
import { createWebsite, createCategory, checkCategorySlugExists } from "@/lib/data"

const websiteSchema = z.object({
  name: z.string().min(2),
  url: z.string().url(),
  categoryId: z.string(),
})

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().min(5),
})

export async function addWebsite(formData: z.infer<typeof websiteSchema>) {
  try {
    const validatedFields = websiteSchema.parse(formData)

    // 抓取网站元数据
    const metadata = await extractMetadata(validatedFields.url)

    // 创建新网站
    const newWebsite = await createWebsite({
      name: validatedFields.name,
      url: validatedFields.url,
      description: metadata.description || "无描述",
      logo: metadata.logo || null,
      categoryId: validatedFields.categoryId,
    })

    console.log("添加网站成功:", newWebsite)

    // 重新验证所有相关路径
    revalidatePath("/")
    revalidatePath("/admin")
    revalidatePath("/api/categories")

    return { success: true, data: newWebsite }
  } catch (error) {
    console.error("添加网站失败:", error)
    throw new Error("添加网站失败")
  }
}

export async function addCategory(formData: z.infer<typeof categorySchema>) {
  try {
    const validatedFields = categorySchema.parse(formData)

    // 检查slug是否已存在
    const slugExists = await checkCategorySlugExists(validatedFields.slug)
    if (slugExists) {
      throw new Error("分类标识已存在，请使用其他标识")
    }

    // 创建新分类
    const newCategory = await createCategory(validatedFields)

    console.log("创建分类成功:", newCategory)

    // 重新验证所有相关路径
    revalidatePath("/")
    revalidatePath("/admin")
    revalidatePath("/api/categories")

    return { success: true, data: newCategory }
  } catch (error) {
    console.error("创建分类失败:", error)
    throw new Error(error instanceof Error ? error.message : "创建分类失败")
  }
}

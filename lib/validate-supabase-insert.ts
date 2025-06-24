"use client"

import { supabase } from './supabase'

export async function validateWebsiteInsert(websiteData: any) {
  console.log('🔍 开始验证网站插入数据...')
  
  // 1. 检查必需字段
  const requiredFields = ['id', 'name', 'url']
  const missingFields = requiredFields.filter(field => !websiteData[field])
  
  if (missingFields.length > 0) {
    console.error('❌ 缺少必需字段:', missingFields)
    return { valid: false, error: '缺少必需字段: ' + missingFields.join(', ') }
  }
  
  // 2. 检查分类ID是否存在
  if (websiteData.category_ids && websiteData.category_ids.length > 0) {
    console.log('📋 检查分类ID有效性:', websiteData.category_ids)
    
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('id')
        .in('id', websiteData.category_ids)
      
      if (error) {
        console.error('❌ 查询分类失败:', error)
        return { valid: false, error: '查询分类失败: ' + error.message }
      }
      
      const existingCategoryIds = categories?.map(c => c.id) || []
      const invalidCategoryIds = websiteData.category_ids.filter(id => !existingCategoryIds.includes(id))
      
      if (invalidCategoryIds.length > 0) {
        console.error('❌ 无效的分类ID:', invalidCategoryIds)
        console.log('✅ 有效的分类ID:', existingCategoryIds)
        return { valid: false, error: '无效的分类ID: ' + invalidCategoryIds.join(', ') }
      }
      
      console.log('✅ 所有分类ID都有效')
    } catch (error) {
      console.error('❌ 分类验证出错:', error)
      return { valid: false, error: '分类验证出错: ' + (error as Error).message }
    }
  }
  
  // 3. 检查数据类型
  const typeChecks = {
    id: 'string',
    name: 'string', 
    url: 'string',
    description: 'string',
    logo: 'string',
    category_ids: 'object',
    is_featured: 'boolean',
    is_hot: 'boolean',
    order_index: 'number',
    created_at: 'string',
    updated_at: 'string'
  }
  
  for (const [field, expectedType] of Object.entries(typeChecks)) {
    if (websiteData[field] !== undefined && websiteData[field] !== null) {
      const actualType = typeof websiteData[field]
      if (expectedType === 'object' && !Array.isArray(websiteData[field])) {
        console.error(`❌ 字段 ${field} 应该是数组，实际是 ${actualType}`)
        return { valid: false, error: `字段 ${field} 类型错误` }
      } else if (expectedType !== 'object' && actualType !== expectedType) {
        console.error(`❌ 字段 ${field} 应该是 ${expectedType}，实际是 ${actualType}`)
        return { valid: false, error: `字段 ${field} 类型错误` }
      }
    }
  }
  
  console.log('✅ 数据验证通过')
  return { valid: true }
} 
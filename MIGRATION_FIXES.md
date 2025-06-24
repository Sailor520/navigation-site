# 数据迁移修复指南

## 问题背景

在开发过程中，用户数据从 localStorage 迁移到 Supabase 时可能遇到各种问题。本文档记录了常见问题及其解决方案。

## 环境变量配置

确保正确配置环境变量：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_placeholder
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_placeholder
```

⚠️ **重要提醒**: 
- 绝不要在代码仓库中提交真实的API密钥
- 使用 `.env.local` 文件存储敏感信息
- 确保 `.gitignore` 包含了环境变量文件

## 数据迁移流程

### 自动迁移
系统会在首次连接 Supabase 时自动检测本地数据并进行迁移。

### 手动迁移
如果自动迁移失败，可以使用管理员面板进行手动数据迁移。

## 常见问题

### 1. 连接超时
- 检查网络连接
- 验证 Supabase 项目状态
- 确认环境变量配置

### 2. 权限错误
- 检查 RLS 策略
- 验证服务角色密钥权限
- 确认表结构正确

### 3. 数据重复
- 使用去重功能
- 检查数据完整性
- 清理无效记录

## 故障排除

1. 查看浏览器控制台错误
2. 检查网络请求状态
3. 验证数据库连接
4. 重置本地数据（如有必要）

## 安全最佳实践

- 定期轮换 API 密钥
- 限制服务角色密钥的使用范围
- 监控数据库访问日志
- 使用环境变量管理敏感信息

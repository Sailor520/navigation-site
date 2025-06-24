# Supabase 数据库设置指南

## 📋 概览

本指南将帮助您将导航网站的数据存储从浏览器 localStorage 迁移到 Supabase 云数据库。

### 🎯 为什么要迁移到 Supabase？

- ✅ **数据永久保存** - 不会因清理浏览器缓存而丢失
- ✅ **多设备同步** - 随时随地访问您的网站收藏  
- ✅ **自动备份** - 数据更安全可靠
- ✅ **更好性能** - 更快的加载速度
- ✅ **免费额度** - 500MB 数据库 + 5GB 带宽

## 🚀 快速开始

### 第一步：在 Supabase 中执行 SQL 脚本

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目：`your-project-ref`
3. 点击左侧菜单中的 **SQL Editor**
4. 复制 `supabase-setup.sql` 文件中的所有内容
5. 粘贴到 SQL Editor 中
6. 点击 **Run** 按钮执行

### 第二步：验证数据库设置

执行 SQL 脚本后，您应该看到：
- ✅ 3 个表已创建（categories, websites, admin_users）
- ✅ 4 个初始分类已插入
- ✅ 8 个示例网站已插入
- ✅ RLS 策略已启用

### 第三步：使用迁移工具

1. 访问您的网站管理页面：`http://localhost:3000/admin`
2. 登录管理员账号
3. 您会看到蓝色的 **"数据迁移到云端"** 提示卡片
4. 点击 **"开始迁移"** 按钮
5. 等待迁移完成
6. 下载备份文件（推荐）

## 📊 数据库结构

### Categories 表
```sql
- id: UUID (主键)
- name: 分类名称
- slug: URL友好的标识符
- description: 分类描述
- order: 排序顺序
- created_at/updated_at: 时间戳
```

### Websites 表
```sql
- id: UUID (主键)
- name: 网站名称
- url: 网站地址
- description: 网站描述
- logo: 网站图标URL
- category_ids: 所属分类ID数组
- is_featured: 是否精品
- is_hot: 是否热门
- order: 排序顺序
- created_at/updated_at: 时间戳
```

### Admin_users 表
```sql
- id: UUID (主键)
- username: 管理员用户名
- password_hash: 密码哈希
- created_at: 创建时间
- last_login: 最后登录时间
```

## 🔒 安全设置

### Row Level Security (RLS)

已为所有表启用 RLS 策略：

- **Categories & Websites**: 所有人可读，只有认证用户可写
- **Admin_users**: 只有服务角色可访问

### 环境变量

确保 `.env.local` 文件包含：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 🛠️ 故障排查

### 常见问题

**Q: 迁移失败，显示连接错误**
A: 检查环境变量是否正确设置，确保 Supabase 项目正在运行

**Q: RLS 策略阻止了数据访问**
A: 确保已正确执行 SQL 脚本中的策略设置

**Q: 数据重复**
A: SQL 脚本使用 `ON CONFLICT DO NOTHING`，不会创建重复数据

**Q: 迁移后本地数据丢失**
A: 迁移前会自动创建备份，可以从下载的备份文件恢复

### 调试步骤

1. 打开浏览器开发者工具
2. 查看 Console 标签页的日志
3. 查看 Network 标签页的网络请求
4. 检查 Supabase Dashboard 中的数据

## 📱 使用说明

### 自动切换

项目已配置为自动检测数据源：
- 如果检测到 Supabase 配置，优先使用云端数据
- 如果 Supabase 不可用，回退到 localStorage
- 管理页面会显示迁移提示

### 手动操作

如需手动操作：

```javascript
// 检查本地数据
import { DataMigration } from '@/lib/data-migration'
const hasLocal = DataMigration.hasLocalStorageData()

// 执行迁移
const result = await DataMigration.migrateToSupabase()

// 备份数据
const backup = DataMigration.backupLocalStorageData()
```

## 🎉 完成！

设置完成后，您的网站将：
- 使用 Supabase 云数据库存储数据
- 支持多设备同步
- 自动备份数据
- 提供更好的性能

如有问题，请查看控制台日志或联系技术支持。

## 数据库连接测试指南

### 1. 准备测试环境

1. 确保已安装所有依赖项：`npm install`
2. 选择您的项目：`your-project-ref`

// ... existing code ... 
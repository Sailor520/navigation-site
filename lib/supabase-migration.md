# Supabase 数据库迁移指南

## 📋 前置准备

### 1. 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 点击 "New Project"
3. 选择组织并填写项目信息：
   - Name: `navigation-site`
   - Database Password: 生成强密码并保存
   - Region: 选择离你最近的区域

### 2. 获取项目配置

项目创建后，在 Settings > API 页面获取：
- Project URL
- Project API keys (anon public 和 service_role)

## 🗄️ 数据库表结构

在 Supabase SQL Editor 中执行以下 SQL 语句：

```sql
-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建分类表
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建网站表
CREATE TABLE public.websites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    logo TEXT,
    category_ids UUID[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    is_hot BOOLEAN DEFAULT FALSE,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建管理员用户表
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX idx_categories_order ON public.categories("order");
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_websites_order ON public.websites("order");
CREATE INDEX idx_websites_category_ids ON public.websites USING GIN(category_ids);
CREATE INDEX idx_websites_is_featured ON public.websites(is_featured);
CREATE INDEX idx_websites_is_hot ON public.websites(is_hot);
CREATE INDEX idx_admin_users_username ON public.admin_users(username);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为表添加更新时间触发器
CREATE TRIGGER handle_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_websites_updated_at
    BEFORE UPDATE ON public.websites
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
```

## 🔐 Row Level Security (RLS)

```sql
-- 启用 RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 分类表权限：所有人可读，只有认证用户可写
CREATE POLICY "分类表公开读取" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "分类表认证用户可写" ON public.categories
    FOR ALL USING (auth.role() = 'authenticated');

-- 网站表权限：所有人可读，只有认证用户可写
CREATE POLICY "网站表公开读取" ON public.websites
    FOR SELECT USING (true);

CREATE POLICY "网站表认证用户可写" ON public.websites
    FOR ALL USING (auth.role() = 'authenticated');

-- 管理员表权限：只有服务角色可访问
CREATE POLICY "管理员表服务角色访问" ON public.admin_users
    FOR ALL USING (auth.role() = 'service_role');
```

## ⚙️ 环境变量配置

在项目根目录创建 `.env.local` 文件：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 📦 安装依赖

```bash
npm install @supabase/supabase-js
```

## 🔄 数据迁移步骤

### 1. 备份现有数据

在浏览器控制台执行：

```javascript
// 导出现有的 localStorage 数据
const backupData = {
  categories: JSON.parse(localStorage.getItem('navigation-data') || '{}').state?.categories || [],
  websites: JSON.parse(localStorage.getItem('navigation-data') || '{}').state?.websites || [],
  adminAuth: JSON.parse(localStorage.getItem('admin-auth') || '{}'),
  adminMode: JSON.parse(localStorage.getItem('admin-mode') || '{}')
}

console.log('备份数据:', JSON.stringify(backupData, null, 2))
```

### 2. 手动插入初始数据

如果你有现有数据，可以通过 Supabase Dashboard 的 Table Editor 手动插入，或者使用 SQL：

```sql
-- 插入初始分类数据
INSERT INTO public.categories (id, name, slug, description, "order") VALUES
('1', '社交媒体', 'social-media', '各类社交媒体平台', 0),
('2', '学习资源', 'learning-resources', '在线学习平台和教育资源', 1),
('3', '工具网站', 'tools', '实用的在线工具和服务', 2),
('4', '技术博客', 'tech-blogs', '技术相关的博客和资讯', 3);

-- 插入初始网站数据
INSERT INTO public.websites (id, name, url, description, logo, category_ids, is_featured, is_hot, "order") VALUES
('1', 'GitHub', 'https://github.com', '面向开源及私有软件项目的托管平台', 'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png', '{"3"}', false, false, 0),
('2', 'Stack Overflow', 'https://stackoverflow.com', '程序设计领域的问答网站', 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png', '{"3","2"}', false, false, 1);
```

## 🔧 代码集成

### 1. 更新 package.json

```bash
npm install @supabase/supabase-js
```

### 2. 更新 store 以使用 Supabase

修改现有的 store 逻辑，使其从 Supabase 获取数据而不是 localStorage。

### 3. 测试连接

在组件中测试 Supabase 连接：

```typescript
import { supabase } from '@/lib/supabase'

// 测试连接
const testConnection = async () => {
  const { data, error } = await supabase.from('categories').select('count(*)')
  console.log('Supabase 连接测试:', { data, error })
}
```

## 🚀 部署注意事项

### Vercel 部署

1. 在 Vercel Dashboard 中添加环境变量
2. 确保 `NEXT_PUBLIC_` 前缀的变量在构建时可用
3. 重新部署项目

### 域名配置

在 Supabase Dashboard > Authentication > URL Configuration 中添加你的域名到 Site URL 和 Redirect URLs。

## 🔍 监控和维护

### 1. 数据库监控

- 在 Supabase Dashboard 查看数据库使用情况
- 监控 API 请求量
- 设置使用量警报

### 2. 备份策略

- Supabase 自动提供日常备份
- 考虑设置定期数据导出
- 重要更改前手动备份

### 3. 性能优化

- 合理使用索引
- 优化查询语句
- 考虑使用 Supabase 的实时功能

## 🆘 故障排除

### 常见问题

1. **连接失败**：检查环境变量和网络连接
2. **权限错误**：检查 RLS 策略配置
3. **类型错误**：确保数据库类型定义正确
4. **迁移失败**：检查数据格式和约束条件

### 回滚计划

如果迁移出现问题，可以：
1. 暂时禁用 Supabase 集成
2. 恢复到 localStorage 版本
3. 修复问题后重新迁移 
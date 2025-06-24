-- Supabase 数据库初始化脚本 - 修复版本（避免PostgreSQL关键字冲突）
-- 在 Supabase SQL Editor 中执行此脚本

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建分类表（匹配 TypeScript Category 接口）
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    order_index INTEGER DEFAULT 0,  -- 使用 order_index 避免关键字冲突
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建网站表（匹配 TypeScript Website 接口，支持多分类）
CREATE TABLE IF NOT EXISTS public.websites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    logo TEXT,
    category_ids UUID[] DEFAULT '{}', -- 支持多分类的 UUID 数组
    is_featured BOOLEAN DEFAULT FALSE,
    is_hot BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,   -- 使用 order_index 避免关键字冲突
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建管理员用户表
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_categories_order_index ON public.categories(order_index);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_websites_order_index ON public.websites(order_index);
CREATE INDEX IF NOT EXISTS idx_websites_category_ids ON public.websites USING GIN(category_ids);
CREATE INDEX IF NOT EXISTS idx_websites_is_featured ON public.websites(is_featured);
CREATE INDEX IF NOT EXISTS idx_websites_is_hot ON public.websites(is_hot);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON public.admin_users(username);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为表添加更新时间触发器
DROP TRIGGER IF EXISTS handle_categories_updated_at ON public.categories;
CREATE TRIGGER handle_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_websites_updated_at ON public.websites;
CREATE TRIGGER handle_websites_updated_at
    BEFORE UPDATE ON public.websites
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- 启用 Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 删除现有策略（如果存在）
DROP POLICY IF EXISTS "分类表公开读取" ON public.categories;
DROP POLICY IF EXISTS "分类表公开写入" ON public.categories;
DROP POLICY IF EXISTS "网站表公开读取" ON public.websites;
DROP POLICY IF EXISTS "网站表公开写入" ON public.websites;
DROP POLICY IF EXISTS "管理员表服务角色访问" ON public.admin_users;

-- 分类表权限：所有人可读，所有人可写（开发阶段）
CREATE POLICY "分类表公开读取" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "分类表公开写入" ON public.categories
    FOR ALL USING (true) WITH CHECK (true);

-- 网站表权限：所有人可读，所有人可写（开发阶段）
CREATE POLICY "网站表公开读取" ON public.websites
    FOR SELECT USING (true);

CREATE POLICY "网站表公开写入" ON public.websites
    FOR ALL USING (true) WITH CHECK (true);

-- 管理员表权限：只有服务角色可访问
CREATE POLICY "管理员表服务角色访问" ON public.admin_users
    FOR ALL USING (auth.role() = 'service_role');

-- 插入初始分类数据
INSERT INTO public.categories (id, name, slug, description, order_index) VALUES
('11111111-1111-1111-1111-111111111111', '社交媒体', 'social-media', '各类社交媒体平台', 0),
('22222222-2222-2222-2222-222222222222', '学习资源', 'learning-resources', '在线学习平台和教育资源', 1),
('33333333-3333-3333-3333-333333333333', '工具网站', 'tools', '实用的在线工具和服务', 2),
('44444444-4444-4444-4444-444444444444', '技术博客', 'tech-blogs', '技术相关的博客和资讯', 3)
ON CONFLICT (id) DO NOTHING;

-- 插入初始网站数据（使用多分类数组）
INSERT INTO public.websites (id, name, url, description, logo, category_ids, is_featured, is_hot, order_index) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'GitHub', 'https://github.com', '面向开源及私有软件项目的托管平台', 'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png', '{"33333333-3333-3333-3333-333333333333"}', false, false, 0),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Stack Overflow', 'https://stackoverflow.com', '程序设计领域的问答网站', 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png', '{"33333333-3333-3333-3333-333333333333","22222222-2222-2222-2222-222222222222"}', false, false, 1),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Twitter', 'https://twitter.com', '社交网络及微博客服务', 'https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png', '{"11111111-1111-1111-1111-111111111111"}', false, false, 0),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Coursera', 'https://www.coursera.org', '大规模开放在线课程平台', 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera.s3.amazonaws.com/media/coursera-logo-square.png', '{"22222222-2222-2222-2222-222222222222"}', false, false, 0),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'MDN Web Docs', 'https://developer.mozilla.org', 'Web技术的学习平台', 'https://developer.mozilla.org/apple-touch-icon.6803c6f0.png', '{"22222222-2222-2222-2222-222222222222","44444444-4444-4444-4444-444444444444"}', false, false, 1),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'CSS-Tricks', 'https://css-tricks.com', '关于CSS、HTML等前端技术的博客', 'https://css-tricks.com/apple-touch-icon.png', '{"44444444-4444-4444-4444-444444444444"}', false, false, 0),
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'Smashing Magazine', 'https://www.smashingmagazine.com', '为Web设计师和开发者提供的专业杂志', 'https://www.smashingmagazine.com/images/favicon/apple-touch-icon.png', '{"44444444-4444-4444-4444-444444444444"}', false, false, 1),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'LinkedIn', 'https://www.linkedin.com', '商业和就业导向的社交网络服务', 'https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca', '{"11111111-1111-1111-1111-111111111111"}', false, false, 1)
ON CONFLICT (id) DO NOTHING;

-- 验证数据插入
SELECT 'Setup completed!' as status, 
       (SELECT COUNT(*) FROM public.categories) as categories_count,
       (SELECT COUNT(*) FROM public.websites) as websites_count; 
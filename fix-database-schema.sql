-- 修复数据库表结构
-- 添加缺失的列到 websites 表

-- 检查并添加 category_ids 列（JSON数组）
ALTER TABLE websites 
ADD COLUMN IF NOT EXISTS category_ids jsonb DEFAULT '[]'::jsonb;

-- 检查并添加 description 列
ALTER TABLE websites 
ADD COLUMN IF NOT EXISTS description text DEFAULT '';

-- 检查并添加 logo 列
ALTER TABLE websites 
ADD COLUMN IF NOT EXISTS logo text DEFAULT '';

-- 检查并添加 is_featured 列
ALTER TABLE websites 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- 检查并添加 is_hot 列
ALTER TABLE websites 
ADD COLUMN IF NOT EXISTS is_hot boolean DEFAULT false;

-- 检查并添加 order_index 列
ALTER TABLE websites 
ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;

-- 检查并添加时间戳列
ALTER TABLE websites 
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

ALTER TABLE websites 
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 为 categories 表添加缺失的列（如果需要）
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS slug text DEFAULT '';

ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS description text DEFAULT '';

-- 创建索引以提高性能
CREATE INDEX IF NOT EXISTS idx_websites_category_ids ON websites USING GIN (category_ids);
CREATE INDEX IF NOT EXISTS idx_websites_is_featured ON websites (is_featured);
CREATE INDEX IF NOT EXISTS idx_websites_is_hot ON websites (is_hot);
CREATE INDEX IF NOT EXISTS idx_websites_order_index ON websites (order_index);

-- 创建更新时间戳的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 websites 表创建触发器
DROP TRIGGER IF EXISTS update_websites_updated_at ON websites;
CREATE TRIGGER update_websites_updated_at 
    BEFORE UPDATE ON websites 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 为 categories 表创建触发器
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全策略（如果还没有启用）
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 创建允许所有操作的策略（匿名用户可以读写）
DROP POLICY IF EXISTS "Allow all operations on websites" ON websites;
CREATE POLICY "Allow all operations on websites" ON websites
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on categories" ON categories;
CREATE POLICY "Allow all operations on categories" ON categories
    FOR ALL USING (true) WITH CHECK (true); 
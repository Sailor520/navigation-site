# Supabase 数据存储测试指南 - 更新版

这个指南将帮助你验证添加的网站数据确实保存到了 Supabase 数据库中，而不会因为清除浏览器缓存而丢失。

## 1. 数据库设置

### 第一步：在 Supabase 中执行 SQL 脚本

1. 访问你的 Supabase 项目：https://supabase.com/dashboard/projects
2. 选择你的项目（URL: `https://your-project-ref.supabase.co`）
3. 点击左侧菜单的 "SQL Editor"
4. 创建一个新查询，复制并执行 `supabase-setup-fixed.sql` 文件的内容
5. 确认所有表和初始数据创建成功

### 第二步：验证数据库结构

在 Supabase SQL Editor 中运行以下查询来验证表结构：

```sql
-- 检查表是否存在
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('categories', 'websites');

-- 检查初始数据
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'websites' as table_name, COUNT(*) as count FROM websites;
```

## 2. 应用配置验证

### 重启开发服务器

```bash
pnpm dev
```

## 3. 使用调试页面检查数据状态

**新增功能！** 现在可以访问调试页面来实时监控数据存储状态：

1. 访问：http://localhost:3000/debug-data
2. 查看三个数据存储的状态：
   - 智能数据存储（应该显示`dataSource: supabase`）
   - Supabase数据存储
   - 本地数据存储
3. 查看分类和网站数量
4. 检查是否有错误信息

## 4. 数据存储测试步骤

### 测试前检查数据源状态

1. 访问调试页面：http://localhost:3000/debug-data
2. 确认智能数据存储显示：
   - 数据源: `supabase`
   - 已初始化: `是`
   - 加载中: `否`
   - 无错误

### 测试 1：添加新分类

1. 以管理员身份登录：http://localhost:3000/admin
2. 切换到"创建分类"标签
3. 添加一个新分类：
   - 名称：`测试分类`
   - 描述：`这是一个测试分类`
4. 观察页面显示：`✅ 分类已保存到云端数据库`
5. 立即检查调试页面，分类数量应该增加

### 测试 2：添加新网站

1. 在管理页面切换到"添加网站"标签
2. 添加一个新网站：
   - 名称：`测试网站`
   - URL：`https://example.com`
   - 描述：`这是一个测试网站`
   - 选择刚创建的测试分类
3. 观察页面显示：`✅ 网站已保存到云端数据库`
4. 立即检查调试页面，网站数量应该增加

### 测试 3：主页显示验证

1. 访问主页：http://localhost:3000
2. 确认能看到刚添加的测试分类和网站
3. 检查网站卡片是否正常显示

## 5. 数据持久性验证

### 验证方法 1：清除浏览器缓存

1. **记录当前数据**：在调试页面记下当前的分类和网站数量
2. **清除所有浏览器数据**：
   - Chrome: 设置 → 隐私和安全 → 清除浏览数据 → 选择"所有时间" → 勾选所有选项 → 清除数据
3. **重新访问应用**：http://localhost:3000
4. **验证数据还在**：你的测试分类和网站应该仍然显示在页面上
5. **再次检查调试页面**：数据量应该保持一致

### 验证方法 2：直接查询数据库

在 Supabase SQL Editor 中运行：

```sql
-- 查看所有分类（包括你的测试分类）
SELECT * FROM categories ORDER BY created_at DESC;

-- 查看所有网站（包括你的测试网站）
SELECT * FROM websites ORDER BY created_at DESC;

-- 查看最近添加的数据
SELECT 'Latest Category' as type, name, created_at 
FROM categories 
ORDER BY created_at DESC 
LIMIT 1

UNION ALL

SELECT 'Latest Website' as type, name, created_at 
FROM websites 
ORDER BY created_at DESC 
LIMIT 1;
```

## 6. 故障排除

### 如果调试页面显示数据源为"localStorage"

1. 检查环境变量是否正确配置
2. 在调试页面点击"测试连接"按钮
3. 查看浏览器控制台错误信息

### 如果网站无法在主页显示

1. 检查调试页面的"当前网站数据"
2. 确认网站的`categoryIds`字段包含正确的分类ID
3. 检查浏览器控制台是否有JavaScript错误

### 如果添加数据时出错

1. 检查调试页面的错误信息
2. 确认Supabase数据库表结构正确
3. 查看浏览器网络标签页是否有API请求失败

## 7. 成功标志

✅ **数据存储成功的标志：**
- 调试页面显示数据源为"supabase"
- 添加数据后调试页面的数量立即增加
- 主页能正常显示新添加的网站
- 在 Supabase 数据库中可以直接查询到数据
- 清除浏览器缓存后数据仍然存在

✅ **完整测试流程：**
1. 访问调试页面确认连接状态
2. 添加测试分类和网站
3. 确认主页显示正常
4. 清除浏览器缓存测试持久性
5. 在 Supabase 控制台验证数据存在

## 8. 调试工具

- **调试页面**：http://localhost:3000/debug-data
- **管理页面**：http://localhost:3000/admin  
- **主页**：http://localhost:3000
- **Supabase控制台**：https://supabase.com/dashboard/projects

这样你就可以全面测试和验证数据确实保存到了 Supabase 数据库中！ 
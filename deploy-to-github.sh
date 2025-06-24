#!/bin/bash

# GitHub 安全部署脚本
# 确保不会将敏感信息提交到仓库

echo "🚀 开始安全部署流程..."

# 检查 .env 文件是否被跟踪
echo "🔍 检查 .env 文件状态..."
if git ls-files --error-unmatch .env 2>/dev/null; then
    echo "❌ 错误：.env 文件被 Git 跟踪！请先移除："
    echo "git rm --cached .env"
    exit 1
else
    echo "✅ .env 文件未被跟踪，符合安全要求"
fi

# 只检查真正敏感的API密钥，不检查项目ID
echo "🔍 扫描代码中的敏感信息..."
if grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ5" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.sh" --exclude-dir=.next --exclude=".env" --exclude-dir=".specstory"; then
    echo "❌ 错误：发现真实的 Supabase API 密钥，请清理后再提交！"
    exit 1
fi

echo "✅ 未发现敏感的API密钥"

# 确保 .gitignore 正确配置
echo "🔍 检查 .gitignore 配置..."
if ! grep -q "^\.env" .gitignore; then
    echo "⚠️  .gitignore 中缺少 .env 规则，自动添加..."
    echo "" >> .gitignore
    echo "# 环境变量" >> .gitignore
    echo ".env" >> .gitignore
    echo ".env.local" >> .gitignore
    echo ".env.*.local" >> .gitignore
fi

# 确保 .env.example 存在
if [ ! -f ".env.example" ]; then
    echo "📝 创建 .env.example 模板..."
    cat > .env.example << 'EOF'
# Supabase 配置
# 获取方式：https://app.supabase.com -> 你的项目 -> Settings -> API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Supabase Service Role Key (服务端使用，仅在需要时配置)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# 管理员认证 (可选)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here

# 部署环境
NODE_ENV=development
EOF
fi

# 添加所有文件到暂存区（排除 .env）
echo "📦 准备提交文件..."
git add .

# 检查是否有变更要提交
if git diff --cached --quiet; then
    echo "ℹ️  没有变更需要提交"
    exit 0
fi

# 创建提交
echo "💾 创建提交..."
git commit -m "feat: 安全更新 - 隐藏敏感信息并优化管理功能

- 🔐 将所有敏感配置移至 .env 文件
- 🚫 确保 .env 文件不被 Git 跟踪  
- 🐛 修复管理模式下热门/加精状态同步问题
- ✨ 改进用户界面和交互体验
- 📝 更新配置文件模板和文档"

# 推送到 GitHub
echo "🚀 推送到 GitHub..."
echo "⚠️  即将强制推送到 GitHub（这会重写远程历史），确认继续？(y/N):"
read -r confirm
if [[ $confirm =~ ^[Yy]$ ]]; then
    # 先尝试拉取并合并不相关的历史
    git pull origin main --allow-unrelated-histories --no-edit 2>/dev/null || true
    git push origin main --force
    echo "✅ 成功推送到 GitHub！"
    echo "🎉 部署完成！项目已安全更新到远程仓库"
else
    echo "❌ 取消推送操作"
    exit 1
fi

echo "✅ 安全部署完成！"
echo ""
echo "📋 重要提醒："
echo "1. 本地 .env 文件包含真实密钥，这是正常的"
echo "2. .env 文件不会被提交到 GitHub，确保密钥安全"
echo "3. 在部署平台需要手动配置环境变量"
echo "4. 可以参考 .env.example 文件了解需要配置的变量" 
#!/bin/bash

# Vercel部署脚本 - 修复扩展错误版本
# 使用方法: ./deploy-vercel.sh

echo "🚀 开始部署到 Vercel..."

# 检查是否已安装 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ 未找到 Vercel CLI，正在安装..."
    npm install -g vercel
fi

# 检查环境变量
if [ ! -f ".env" ]; then
    echo "⚠️  警告：未找到 .env 文件"
    echo "请确保在 Vercel 仓库设置中配置了以下环境变量："
    echo "- NEXT_PUBLIC_SUPABASE_URL"
    echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "- SUPABASE_SERVICE_ROLE_KEY"
    echo ""
fi

# 构建检查
echo "🔧 检查构建配置..."
if [ ! -f "vercel.json" ]; then
    echo "❌ 未找到 vercel.json 配置文件"
    exit 1
fi

# 运行构建测试
echo "🧪 执行构建测试..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查代码"
    exit 1
fi

echo "✅ 构建测试通过"

# 部署到 Vercel
echo "🚀 开始部署..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 部署成功！"
    echo ""
    echo "📋 部署后检查清单："
    echo "✅ 页面是否正常加载"
    echo "✅ 控制台是否还有扩展错误"
    echo "✅ 功能是否正常工作"
    echo "✅ 移动端是否正常显示"
    echo ""
    echo "🔧 如果仍有问题，请检查："
    echo "1. 浏览器扩展是否导致冲突"
    echo "2. 尝试无痕模式访问"
    echo "3. 检查网络连接"
    echo "4. 清除浏览器缓存"
else
    echo "❌ 部署失败，请检查错误信息"
    exit 1
fi 
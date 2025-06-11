#!/bin/bash

echo "🚀 AI工具导航网站 - GitHub部署脚本"
echo "=================================="

# 检查是否提供了GitHub用户名
if [ -z "$1" ]; then
    echo "❌ 请提供您的GitHub用户名"
    echo "用法: ./deploy-to-github.sh 您的GitHub用户名"
    echo "例如: ./deploy-to-github.sh siauun"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_URL="https://github.com/$GITHUB_USERNAME/navigation-site.git"

echo "📋 准备部署到: $REPO_URL"
echo ""

# 检查git状态
echo "🔍 检查Git状态..."
git status

# 添加远程仓库
echo "🔗 添加GitHub远程仓库..."
git remote add origin $REPO_URL

# 推送到GitHub
echo "📤 推送代码到GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ 代码成功推送到GitHub!"
    echo ""
    echo "🎯 下一步: 部署到Vercel"
    echo "1. 访问 https://vercel.com"
    echo "2. 使用GitHub账号登录"
    echo "3. 点击 'Import Project'"
    echo "4. 选择 'navigation-site' 仓库"
    echo "5. 点击 'Deploy'"
    echo ""
    echo "🌐 GitHub仓库地址: $REPO_URL"
else
    echo "❌ 推送失败，请检查:"
    echo "1. GitHub仓库是否存在"
    echo "2. 是否有推送权限"
    echo "3. 用户名是否正确"
fi 
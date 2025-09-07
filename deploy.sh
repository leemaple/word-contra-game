#!/bin/bash

# 单词魂斗罗游戏 - Vercel部署脚本
echo "🎮 开始部署单词魂斗罗游戏到Vercel..."

# 检查是否安装了Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI未安装"
    echo "📦 正在安装Vercel CLI..."
    npm i -g vercel
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建是否成功
if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

echo "✅ 构建成功！"

# 部署到Vercel
echo "🚀 部署到Vercel..."
vercel --prod

echo "🎉 部署完成！"
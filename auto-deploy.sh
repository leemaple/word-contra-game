#!/bin/bash

# 自动部署脚本 - 交互式引导
echo "🎮 单词魂斗罗 - GitHub + Vercel 自动部署向导"
echo "============================================"
echo ""

# 检查git状态
echo "📦 检查Git状态..."
if [ ! -d .git ]; then
    echo "❌ 未找到Git仓库"
    exit 1
fi

# 检查是否有远程仓库
if git remote | grep -q origin; then
    echo "✅ 远程仓库已配置"
    REMOTE_URL=$(git remote get-url origin)
    echo "   当前远程仓库: $REMOTE_URL"
else
    echo "⚠️  未配置远程仓库"
    echo ""
    echo "请输入你的GitHub用户名："
    read -p "> " GITHUB_USERNAME
    
    if [ -z "$GITHUB_USERNAME" ]; then
        echo "❌ 用户名不能为空"
        exit 1
    fi
    
    REPO_URL="https://github.com/$GITHUB_USERNAME/word-contra-game.git"
    echo ""
    echo "将添加远程仓库: $REPO_URL"
    git remote add origin $REPO_URL
    echo "✅ 远程仓库已添加"
fi

echo ""
echo "📤 准备推送代码到GitHub..."
echo ""
echo "⚠️  重要提示："
echo "1. 请先在GitHub创建仓库: https://github.com/new"
echo "   仓库名称: word-contra-game"
echo ""
echo "2. 创建完成后，按Enter继续推送代码..."
read -p "按Enter继续..." 

echo ""
echo "🚀 推送代码到GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ 代码推送成功！"
else
    echo "❌ 推送失败，可能的原因："
    echo "   1. GitHub仓库未创建"
    echo "   2. 认证失败（需要使用Personal Access Token）"
    echo "   3. 仓库名称不匹配"
    echo ""
    echo "请解决问题后重新运行脚本"
    exit 1
fi

echo ""
echo "🎉 GitHub部分完成！"
echo ""
echo "📌 接下来请完成Vercel部署："
echo ""
echo "1. 打开浏览器访问: https://vercel.com/new"
echo "2. 点击 'Import Git Repository'"
echo "3. 选择 'word-contra-game' 仓库"
echo "4. 点击 'Deploy'"
echo ""
echo "部署URL将是: https://word-contra-game-$GITHUB_USERNAME.vercel.app"
echo ""
echo "✨ 祝贺！你的游戏即将上线！"
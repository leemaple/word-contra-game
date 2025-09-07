#!/bin/bash

# Git初始化脚本
echo "📦 初始化Git仓库..."

# 检查是否已经是git仓库
if [ -d .git ]; then
    echo "⚠️  已经是Git仓库"
else
    git init
    echo "✅ Git仓库初始化成功"
fi

# 添加所有文件
echo "📝 添加文件到暂存区..."
git add .

# 创建初始提交
echo "💾 创建初始提交..."
git commit -m "🎮 Initial commit: Word Contra Game - 单词魂斗罗游戏

Features:
- 任务模式（选择题关卡）
- Boss战（拼写挑战）
- 单词兵工厂（词库浏览）
- 成就系统
- 设置页面
- PWA支持（离线游戏）
- 像素风格UI"

echo "✅ Git初始化完成！"
echo ""
echo "下一步："
echo "1. 在GitHub创建新仓库"
echo "2. 运行以下命令添加远程仓库："
echo "   git remote add origin https://github.com/YOUR_USERNAME/word-contra-game.git"
echo "3. 推送代码："
echo "   git push -u origin main"
echo ""
echo "然后就可以在Vercel导入GitHub仓库进行部署了！"
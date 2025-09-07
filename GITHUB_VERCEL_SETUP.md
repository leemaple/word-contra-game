# 🚀 GitHub + Vercel 快速部署指南

## 当前进度
✅ Git仓库已初始化
✅ 代码已提交到本地
✅ Vercel配置文件已准备
✅ GitHub Actions配置已创建

## 接下来你需要做的（只需3步）

### 步骤1：创建GitHub仓库（1分钟）
1. 打开浏览器访问：https://github.com/new
2. 填写仓库信息：
   - Repository name: `word-contra-game`
   - Description: `单词魂斗罗 - 高中英语学习游戏`
   - 选择：Public（公开）或 Private（私有）
3. 点击 **Create repository**
4. 创建后会显示一个页面，**保持这个页面打开**

### 步骤2：推送代码到GitHub（30秒）
在终端运行以下命令（替换YOUR_USERNAME为你的GitHub用户名）：

```bash
# 添加远程仓库（替换YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/word-contra-game.git

# 推送代码
git push -u origin main
```

如果提示输入密码，使用GitHub的Personal Access Token而不是账户密码。

### 步骤3：在Vercel导入项目（1分钟）
1. 打开浏览器访问：https://vercel.com/new
2. 点击 **Import Git Repository**
3. 如果没看到你的仓库，点击 **Adjust GitHub App Permissions**
4. 选择 `word-contra-game` 仓库
5. Vercel会自动检测到项目配置：
   - Framework Preset: **Vite**
   - Build Command: `npm run build`（自动填充）
   - Output Directory: `dist`（自动填充）
6. 点击 **Deploy**

## 🎉 完成！
部署将在1-2分钟内完成，你会获得：
- 生产URL：`https://word-contra-game-[你的用户名].vercel.app`
- 自动HTTPS证书
- 全球CDN加速
- 每次推送代码自动部署

## 可选：获取Vercel Token（用于GitHub Actions自动部署）
如果你想使用GitHub Actions进行更高级的CI/CD：

1. 访问：https://vercel.com/account/tokens
2. 点击 **Create Token**
3. 给Token命名（如：`github-actions`）
4. 复制Token

然后在GitHub仓库设置中添加Secrets：
1. 进入仓库 Settings -> Secrets and variables -> Actions
2. 添加以下Secrets：
   - `VERCEL_TOKEN`: 刚才复制的token
   - `VERCEL_ORG_ID`: 在Vercel项目设置中找到
   - `VERCEL_PROJECT_ID`: 在Vercel项目设置中找到

## 常用命令
```bash
# 查看远程仓库
git remote -v

# 推送新更改
git add .
git commit -m "更新内容"
git push

# 查看部署状态
vercel ls
```

## 故障排除
- **推送失败？** 检查是否正确替换了YOUR_USERNAME
- **Vercel看不到仓库？** 调整GitHub App权限
- **部署失败？** 查看Vercel Dashboard的构建日志

## 需要帮助？
- GitHub文档：https://docs.github.com
- Vercel文档：https://vercel.com/docs
- 项目问题：在GitHub仓库创建Issue
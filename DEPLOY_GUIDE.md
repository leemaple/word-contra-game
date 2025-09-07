# 部署到Vercel指南

## 前置准备
1. 确保你有一个Vercel账号（如果没有，请访问 https://vercel.com 注册）
2. 安装Vercel CLI（可选）：`npm i -g vercel`

## 方法一：通过GitHub部署（推荐）

### 步骤1：推送代码到GitHub
```bash
# 初始化git仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: Word Contra Game"

# 添加远程仓库（替换为你的GitHub仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/word-contra-game.git

# 推送到GitHub
git push -u origin main
```

### 步骤2：在Vercel导入项目
1. 访问 https://vercel.com/new
2. 点击"Import Git Repository"
3. 选择你的GitHub仓库
4. Vercel会自动检测到Vite配置
5. 点击"Deploy"

## 方法二：使用Vercel CLI

### 步骤1：安装并登录Vercel CLI
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login
```

### 步骤2：部署项目
```bash
# 在项目根目录运行
vercel

# 按照提示操作：
# 1. Set up and deploy? Y
# 2. Which scope? 选择你的账号
# 3. Link to existing project? N
# 4. Project name? word-contra-game（或自定义）
# 5. In which directory is your code located? ./
# 6. Detected framework: Vite
# 7. Build Command: npm run build
# 8. Output Directory: dist
# 9. Development Command: npm run dev
```

### 步骤3：后续更新
```bash
# 部署新版本
vercel --prod
```

## 方法三：直接拖拽部署

### 步骤1：本地构建
```bash
npm run build
```

### 步骤2：上传到Vercel
1. 访问 https://vercel.com/new
2. 选择"Upload"选项
3. 将`dist`文件夹拖拽到上传区域
4. 等待部署完成

## 环境变量配置（如需要）
在Vercel项目设置中：
1. 进入项目Dashboard
2. 点击"Settings" -> "Environment Variables"
3. 添加需要的环境变量

## 自定义域名（可选）
1. 在Vercel项目Dashboard中
2. 点击"Settings" -> "Domains"
3. 添加你的自定义域名
4. 按照提示配置DNS

## 部署后检查清单
- [ ] 访问部署的URL，确认页面正常加载
- [ ] 测试路由导航是否正常
- [ ] 检查localStorage功能是否正常
- [ ] 测试PWA功能（离线访问）
- [ ] 检查音效是否正常播放
- [ ] 测试所有游戏功能

## 常见问题

### Q: 部署后页面404？
A: 确保`vercel.json`中的rewrites配置正确，所有路由都重定向到index.html

### Q: 构建失败？
A: 检查Node.js版本，Vercel默认使用Node 18.x，确保项目兼容

### Q: 资源加载失败？
A: 检查base路径配置，确保vite.config.ts中的base设置正确

## 项目信息
- 框架：Vite + React + TypeScript
- Node版本：18.x或更高
- 包管理器：npm
- 构建输出：dist目录

## 部署配置已包含
✅ vercel.json - Vercel配置文件
✅ PWA支持 - Service Worker和manifest
✅ SPA路由 - 所有路由重定向到index.html
✅ 静态资源缓存 - 优化加载性能

## 预估部署时间
- 首次部署：2-3分钟
- 后续更新：1-2分钟

## 部署成功后
你将获得：
- 生产环境URL：https://word-contra-game.vercel.app
- 预览环境URL（每次提交自动生成）
- 自动HTTPS证书
- 全球CDN加速
- 自动部署（GitHub集成）
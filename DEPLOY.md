# 部署指南

本文档教你如何把「小熊记账」部署上线，包括 Web 版和微信小程序版。

---

## 目录

1. [Web 版部署（Vercel）](#1-web-版部署vercel)
2. [Supabase 云数据库配置（可选）](#2-supabase-云数据库配置可选)
3. [微信小程序部署](#3-微信小程序部署)
4. [常见问题](#4-常见问题)

---

## 1. Web 版部署（Vercel）

### 前置条件

- Node.js 18+ 已安装
- GitHub 账号
- Vercel 账号（用 GitHub 登录即可）

### 步骤

#### 1.1 Fork 项目到你的 GitHub

1. 打开 https://github.com/xiao-098/MoneyApk
2. 点击右上角 **Fork** 按钮
3. 等待 Fork 完成

#### 1.2 克隆到本地

```bash
git clone https://github.com/你的用户名/MoneyApk.git
cd MoneyApk
```

#### 1.3 安装依赖

```bash
npm install
```

#### 1.4 本地测试

```bash
npm run dev
```

浏览器打开 `http://localhost:5173`，确认功能正常。

#### 1.5 部署到 Vercel

**方法一：通过 Vercel 网站（推荐新手）**

1. 打开 https://vercel.com/new
2. 用 GitHub 登录
3. 选择你 Fork 的 MoneyApk 仓库
4. 点击 **Deploy**
5. 等待部署完成（约 1-2 分钟）
6. 部署成功后会分配一个 `xxx.vercel.app` 域名

**方法二：通过命令行**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

#### 1.6 自动部署

Vercel 部署后，每次你 `git push` 到 GitHub，Vercel 会自动重新部署。

```bash
# 修改代码后
git add .
git commit -m "更新内容"
git push origin main
# Vercel 会自动重新部署
```

---

## 2. Supabase 云数据库配置（可选）

如果不配置 Supabase，数据保存在浏览器 localStorage，关闭浏览器后数据仍在。配置 Supabase 后可实现多设备云同步。

### 前置条件

- Supabase 账号（https://supabase.com 免费注册）

### 步骤

#### 2.1 创建 Supabase 项目

1. 登录 https://supabase.com
2. 点击 **New Project**
3. 填写项目名称（如 `moneyapk`）
4. 设置数据库密码（记住它）
5. 选择离你最近的区域（推荐 Singapore）
6. 点击 **Create new project**
7. 等待项目创建完成（约 1 分钟）

#### 2.2 获取连接信息

在项目 Dashboard 中：

1. 点击左侧 **Project Settings**（齿轮图标）
2. 点击 **API**
3. 复制以下两个值：
   - **Project URL** — 格式为 `https://xxxxx.supabase.co`
   - **Project API keys > anon public** — 以 `eyJ` 开头的长字符串

#### 2.3 执行建表脚本

1. 在 Supabase Dashboard 左侧点击 **SQL Editor**
2. 点击 **New query**
3. 复制项目中 `supabase-schema.sql` 的内容
4. 粘贴到编辑器中
5. 点击 **Run** 执行

执行成功后会出现 `records` 和 `budgets` 两张表。

#### 2.4 配置环境变量

**方法一：本地开发**

在项目根目录创建 `.env` 文件：

```
VITE_SUPABASE_URL=https://你的项目.supabase.co
VITE_SUPABASE_ANON_KEY=你的匿名密钥
```

**方法二：Vercel 部署**

1. 打开 Vercel Dashboard → 你的项目
2. 点击 **Settings** → **Environment Variables**
3. 添加两个变量：
   - Name: `VITE_SUPABASE_URL`，Value: `https://你的项目.supabase.co`
   - Name: `VITE_SUPABASE_ANON_KEY`，Value: `你的匿名密钥`
4. 点击 **Save**
5. 重新部署（Deployments → 点击最新的一条 → ··· → Redeploy）

---

## 3. 微信小程序部署

项目包含 `miniprogram/` 目录，使用 Web-View 嵌入网页版。

### 前置条件

- 微信开发者工具已安装
- 微信小程序账号（https://mp.weixin.qq.com 注册）
- 已备案的域名（指向你的 Vercel 部署地址）

### 步骤

#### 3.1 注册微信小程序

1. 打开 https://mp.weixin.qq.com
2. 注册小程序账号（需要身份证/手机号）
3. 登录后，在 **开发管理** → **开发设置** 中找到你的 **AppID**

#### 3.2 配置 AppID

编辑 `miniprogram/project.config.json`，将 `appid` 改为你的：

```json
{
  "appid": "wx1234567890abcdef"
}
```

#### 3.3 配置业务域名

微信小程序要求网页域名在白名单中：

1. 登录 https://mp.weixin.qq.com
2. **开发管理** → **开发设置** → **业务域名**
3. 添加你的域名（如 `moneyapk.vercel.app`）

> **注意**：微信要求域名已通过 ICP 备案。如果用 Vercel 默认域名，需要绑定自己的备案域名。

**备案域名方案：**
1. 买一个域名（阿里云/腾讯云，约 30-60 元/年）
2. 完成 ICP 备案（约 1-2 周）
3. 在 Vercel 中绑定自定义域名
4. 将自定义域名添加到小程序业务域名

#### 3.4 导入项目到微信开发者工具

1. 打开微信开发者工具
2. 点击 **导入项目**
3. 项目目录选择 `miniprogram/` 文件夹
4. AppID 填写你的小程序 AppID
5. 点击 **确定**

#### 3.5 修改网页地址

编辑 `miniprogram/pages/index/index.js`：

```javascript
Page({
  data: {
    url: 'https://你的域名'
  }
})
```

#### 3.6 预览和发布

1. 在微信开发者工具中点击 **预览** 扫码测试
2. 测试通过后，点击 **上传**
3. 登录 https://mp.weixin.qq.com → **版本管理**
4. 提交审核，等待通过后发布

---

## 4. 常见问题

### Q: 部署后页面空白？

A: 检查浏览器控制台（F12）是否有报错。常见原因是环境变量未配置。

### Q: Supabase 连不上？

A: 确认 `.env` 文件中的 URL 和 Key 是否正确。检查 Supabase 项目是否处于 Active 状态。

### Q: 微信小程序 Web-View 打不开？

A: 
1. 确认域名已备案
2. 确认域名已添加到小程序后台的业务域名白名单
3. 域名必须是 HTTPS

### Q: 数据丢失了？

A: 如果没有配置 Supabase，数据保存在浏览器 localStorage。清除浏览器数据会丢失。建议配置 Supabase 实现云同步。

### Q: 怎么更新代码？

```bash
# 拉取最新代码
git pull origin main

# 如果 Vercel 连接了 GitHub，push 后会自动部署
git push origin main
```

---

## 技术支持

遇到问题？在 GitHub 提 Issue：https://github.com/xiao-098/MoneyApk/issues

# 小熊记账 - 手账风格个人记账本

一款手账杂志风的个人记账 Web App，像和可爱的小熊助手对话一样轻松记账。

**在线体验：** https://moneyapk.vercel.app

## 功能特性

### 对话式记账
输入文字和金额，自动识别分类并记账：
- `午餐 35` → 自动匹配餐饮分类
- `打车 28.5` → 自动匹配交通分类
- `100` → 弹出分类选择器让你选

### 智能分类
12 个消费分类 + 4 个收入分类，每个都有专属可爱动物图标：

| 分类 | 动物 | 关键词示例 |
|------|------|-----------|
| 餐饮 | 小熊 | 午餐、外卖、火锅、奶茶 |
| 交通 | 小兔 | 打车、地铁、加油、机票 |
| 购物 | 小猫 | 淘宝、京东、超市 |
| 娱乐 | 小狐狸 | 电影、游戏、KTV |
| 医疗 | 小狗 | 医院、药、体检 |
| 教育 | 小熊猫 | 书、课程、培训 |
| 住房 | 小猪 | 房租、水电、物业 |
| 日用 | 小鸭 | 日用、洗衣、纸巾 |
| 服饰 | 小鹿 | 衣服、裤子、鞋 |
| 礼物 | 小企鹅 | 礼物、红包 |
| 咖啡 | 小仓鼠 | 咖啡、星巴克 |
| 其他 | 小星星 | 其他杂项 |

### 消费看板
- **日/周/月** 三种视图切换
- 分类占比环形图 + 7天趋势折线图
- 每日消费小计（周/月视图）
- 电子收支小票（可打印）

### 预算管理
- 为每个分类设置月度预算
- 进度条可视化
- 超支提醒（80% 警告，100% 超支提示）

### 存钱目标
- 设定存钱目标（名称、金额、截止日期）
- 存入进度跟踪
- 状态显示：进行中 / 已完成 / 已过期

### 收入记录
- 4 个收入分类：工资、奖金、投资、其他收入
- 收入金额显示为绿色，支出显示为珊瑚色

### 手动记账
- 右下角 `+` 按钮快速打开
- 支持支出/收入切换
- 选择分类、填金额、选日期

## 技术栈

| 层 | 技术 | 说明 |
|---|------|------|
| 前端 | React 19 + Vite 8 | 快速开发 |
| 样式 | TailwindCSS 4 | 手账风格主题 |
| 状态 | Zustand | 轻量状态管理（localStorage 持久化） |
| 图表 | Recharts | 趋势图、饼图 |
| 后端 | Supabase | 云数据库 + 认证（可选） |
| 动画 | Framer Motion | 聊天动画 |
| 部署 | Vercel | 自动部署 |

## 项目结构

```
MoneyApk/
├── src/
│   ├── components/          # UI 组件
│   │   ├── ChatView.jsx     # 对话式记账主页
│   │   ├── ChatBubble.jsx   # 聊天气泡
│   │   ├── ChatInput.jsx    # 输入框
│   │   ├── Dashboard.jsx    # 消费看板
│   │   ├── BudgetManager.jsx # 预算管理
│   │   ├── SavingsGoal.jsx  # 存钱目标
│   │   ├── AddRecordModal.jsx # 手动记账
│   │   ├── ReceiptModal.jsx # 电子小票
│   │   ├── StickerAnimal.jsx # 动物贴纸
│   │   └── ...
│   ├── store/               # Zustand 状态管理
│   ├── utils/               # 工具函数
│   ├── data/                # 分类数据、关键词
│   └── lib/                 # Supabase 客户端
├── public/animals/           # 12个动物PNG图标
├── miniprogram/             # 微信小程序（Web-View）
└── supabase-schema.sql      # 数据库建表脚本
```

## 快速开始

```bash
# 1. 克隆项目
git clone https://github.com/xiao-098/MoneyApk.git
cd MoneyApk

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 浏览器打开 http://localhost:5173
```

> 无需配置 Supabase 即可使用，数据保存在浏览器 localStorage。配置 Supabase 可实现多设备云同步。

## 环境变量（可选）

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

填入你的 Supabase 信息：

```
VITE_SUPABASE_URL=https://你的项目.supabase.co
VITE_SUPABASE_ANON_KEY=你的匿名密钥
```

## 部署

### Vercel 部署（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

详细部署步骤请查看 [DEPLOY.md](./DEPLOY.md)。

### 微信小程序部署

项目包含 `miniprogram/` 目录，使用 Web-View 嵌入网页版。详见 [DEPLOY.md](./DEPLOY.md) 中的微信小程序部分。

## License

MIT

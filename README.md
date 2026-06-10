# 拼假Go — AI 假期参谋

> 帮打工人用最少年假拼出最长假期，AI 规划行程，匹配旅行搭子

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 构建生产版本
npm run build
```

## 技术栈

- **React 18** + **Vite 5** — 快速开发体验
- **Zustand** — 轻量级状态管理
- **React Router v6** — 页面路由
- **dayjs** — 日期处理
- **lucide-react** — 图标库
- **framer-motion** — 动画

## 项目结构

```
src/
├── components/common/   # 通用组件（TabBar, NavBar, Button, Tag）
├── pages/               # 页面组件
│   ├── HomePage         # 首页
│   ├── PinjiaPage       # AI 拼假计算器
│   ├── PinjiaResultPage # 拼假结果
│   ├── PlanPage         # 行程规划输入
│   ├── PlanResultPage   # 行程详情
│   ├── PartnerPage      # 旅行搭子匹配
│   └── ProfilePage      # 个人中心
├── services/api.js      # API 服务层
├── store/index.js       # Zustand 全局状态
├── utils/
│   ├── holidays.js      # 2026 年法定假日 + 拼假算法
│   └── matching.js      # 四维搭子匹配算法
└── styles/              # 设计令牌 + 全局样式
```

## 核心算法

### 拼假算法
遍历法定假日，尝试前拼/后拼/前后拼，扩展到相邻周末，按**性价比**（`实际假期天数 / 请假天数`）排序。

### 搭子匹配（四维加权）
| 维度 | 权重 | 计算方式 |
|------|------|----------|
| 行程重合度 | 40% | 日期 + POI 重合 |
| 兴趣相似度 | 25% | 标签 cosine 相似度 |
| 人口统计 | 20% | 年龄/性别偏好 |
| 预算重叠 | 15% | 区间重叠度 |

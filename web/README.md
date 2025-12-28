# Moana Web 管理端

Moana 儿童教育平台的 Web 家长管理端，基于 Vue 3 + TypeScript + TailwindCSS 开发。

## 🌐 功能特性

### 仪表盘
- **数据概览** - 今日学习时长、本周学习、内容统计
- **快速访问** - 常用功能快捷入口
- **最近活动** - 最近播放记录
- **学习趋势** - 可视化学习数据图表

### 内容管理
- **内容库** - 浏览所有创作内容
- **类型筛选** - 按绘本、儿歌、视频分类
- **内容详情** - 查看素材参数和生成日志
- **批量操作** - 删除、导出等批量管理

### 创作中心
- **绘本创作** - 完整的绘本生成参数配置
- **儿歌创作** - 儿歌歌词和音乐生成
- **视频创作** - 视频内容生成
- **智能创作** - AI 智能创作助手
- **实时预览** - 创作过程实时预览
- **进度追踪** - 生成进度可视化

### 收藏管理
- **收藏列表** - 查看所有收藏内容
- **分类管理** - 按类型组织收藏
- **快速访问** - 一键打开收藏内容

### 学习报告
- **时长统计** - 每日、每周、每月学习时长
- **内容分析** - 内容类型分布图表
- **趋势分析** - 学习趋势可视化
- **报告导出** - 导出学习报告数据

### 孩子管理
- **多孩子支持** - 管理多个孩子账号
- **个人信息** - 编辑孩子基本信息
- **学习设置** - 配置学习偏好和限制
- **数据隔离** - 每个孩子独立的数据

### 设置中心
- **账号设置** - 编辑个人信息
- **通知设置** - 消息推送配置
- **隐私设置** - 数据隐私管理
- **系统设置** - 应用偏好配置

## 🛠️ 技术栈

- **框架**: Vue 3 (Composition API) + TypeScript
- **路由**: Vue Router 4.x
- **状态管理**: Pinia 2.x
- **UI 框架**: TailwindCSS 3.x
- **HTTP 客户端**: Axios
- **图表库**: ECharts 5.x
- **构建工具**: Vite 5.x
- **CSS 预处理**: PostCSS + Autoprefixer

## 🚀 快速开始

### 环境要求

- Node.js >= 16.x
- npm >= 8.x

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 启动开发服务器
npm run dev
```

应用将在 `http://localhost:5173` 运行

### 生产构建

```bash
# 构建生产版本
npm run build

# 本地预览构建产物
npm run preview
```

### 类型检查

```bash
# TypeScript 类型检查
npm run build
# 或单独运行类型检查（如果配置了）
npx vue-tsc --noEmit
```

## 📂 项目结构

```
web/
├── src/
│   ├── views/                    # 页面视图
│   │   ├── Dashboard.vue         # 仪表盘
│   │   ├── Login.vue             # 登录页
│   │   ├── ContentLibrary.vue    # 内容库
│   │   ├── Favorites.vue         # 收藏
│   │   ├── Player.vue            # 播放器
│   │   ├── Reports.vue           # 学习报告
│   │   ├── Children.vue          # 孩子管理
│   │   ├── Settings.vue          # 设置
│   │   └── create/               # 创作页面
│   │       ├── PictureBook.vue   # 绘本创作
│   │       ├── NurseryRhyme.vue  # 儿歌创作
│   │       ├── Video.vue         # 视频创作
│   │       └── SmartCreation.vue # 智能创作
│   │
│   ├── components/               # 公共组件
│   │   ├── layout/               # 布局组件
│   │   │   ├── Sidebar.vue       # 侧边栏
│   │   │   ├── Header.vue        # 顶部栏
│   │   │   └── Layout.vue        # 主布局
│   │   ├── ContentCard.vue       # 内容卡片
│   │   ├── LoadingSpinner.vue    # 加载动画
│   │   └── ...
│   │
│   ├── api/                      # API 接口
│   │   ├── auth.ts               # 认证相关
│   │   ├── content.ts            # 内容相关
│   │   ├── favorite.ts           # 收藏相关
│   │   ├── children.ts           # 孩子管理
│   │   ├── reports.ts            # 报告相关
│   │   └── request.ts            # Axios 封装
│   │
│   ├── stores/                   # Pinia 状态管理
│   │   ├── user.ts               # 用户状态
│   │   ├── content.ts            # 内容状态
│   │   ├── children.ts           # 孩子状态
│   │   └── app.ts                # 应用状态
│   │
│   ├── router/                   # 路由配置
│   │   └── index.ts              # 路由定义
│   │
│   ├── utils/                    # 工具函数
│   │   ├── auth.ts               # 认证工具
│   │   ├── storage.ts            # 存储工具
│   │   ├── format.ts             # 格式化工具
│   │   └── validators.ts         # 验证工具
│   │
│   ├── types/                    # TypeScript 类型
│   │   ├── content.ts            # 内容类型
│   │   ├── user.ts               # 用户类型
│   │   └── api.ts                # API 类型
│   │
│   ├── assets/                   # 静态资源
│   │   ├── images/               # 图片
│   │   └── styles/               # 样式
│   │
│   ├── App.vue                   # 根组件
│   └── main.ts                   # 应用入口
│
├── public/                       # 公共资源
│   └── favicon.ico
│
├── index.html                    # HTML 模板
├── vite.config.ts               # Vite 配置
├── tsconfig.json                # TypeScript 配置
├── tailwind.config.js           # TailwindCSS 配置
├── postcss.config.js            # PostCSS 配置
└── package.json                 # 项目依赖
```

## 🎯 开发指南

### 路由配置

使用 Vue Router 进行页面导航：

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

// 编程式导航
router.push('/content-library')
router.push({ name: 'Player', params: { id: 'xxx' } })
```

路由表：

| 路径 | 名称 | 组件 | 说明 |
|------|------|------|------|
| `/` | Dashboard | Dashboard.vue | 仪表盘 |
| `/login` | Login | Login.vue | 登录页 |
| `/content-library` | ContentLibrary | ContentLibrary.vue | 内容库 |
| `/favorites` | Favorites | Favorites.vue | 收藏 |
| `/player/:id` | Player | Player.vue | 播放器 |
| `/reports` | Reports | Reports.vue | 学习报告 |
| `/children` | Children | Children.vue | 孩子管理 |
| `/settings` | Settings | Settings.vue | 设置 |
| `/create/picture-book` | CreatePictureBook | create/PictureBook.vue | 绘本创作 |
| `/create/nursery-rhyme` | CreateNurseryRhyme | create/NurseryRhyme.vue | 儿歌创作 |
| `/create/video` | CreateVideo | create/Video.vue | 视频创作 |
| `/create/smart` | SmartCreation | create/SmartCreation.vue | 智能创作 |

### API 调用

使用封装的 API 函数：

```typescript
import { getContentList, createPictureBookAsync } from '@/api/content'

// 获取内容列表
const { data } = await getContentList({
  page: 1,
  page_size: 20,
  content_type: 'picture_book'
})

// 创建绘本（异步）
const { task_id } = await createPictureBookAsync({
  theme: '太空探险',
  art_style: 'watercolor',
  // ... 其他参数
})
```

### 状态管理

使用 Pinia stores：

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useContentStore } from '@/stores/content'

const userStore = useUserStore()
const contentStore = useContentStore()

// 访问状态
console.log(userStore.userInfo)

// 调用 actions
await userStore.login(email, password)
await contentStore.loadContentList()
</script>
```

### TailwindCSS 使用

使用 Tailwind 实用类：

```vue
<template>
  <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-semibold text-gray-800">标题</h2>
    <button class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition">
      按钮
    </button>
  </div>
</template>
```

自定义主题配置在 `tailwind.config.js`：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      }
    }
  }
}
```

### ECharts 图表

使用 ECharts 创建图表：

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLElement>()

onMounted(() => {
  const chart = echarts.init(chartRef.value!)

  chart.setOption({
    title: { text: '学习时长统计' },
    xAxis: { type: 'category', data: ['周一', '周二', '周三'] },
    yAxis: { type: 'value' },
    series: [{
      data: [120, 200, 150],
      type: 'line'
    }]
  })
})
</script>

<template>
  <div ref="chartRef" class="w-full h-96"></div>
</template>
```

### 响应式设计

使用 TailwindCSS 响应式前缀：

```vue
<template>
  <!-- 移动端垂直，桌面端水平 -->
  <div class="flex flex-col md:flex-row gap-4">
    <!-- 移动端全宽，桌面端 1/3 宽 -->
    <div class="w-full md:w-1/3">侧边栏</div>
    <div class="w-full md:w-2/3">主内容</div>
  </div>
</template>
```

断点：
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔐 认证与授权

### 登录流程

```typescript
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// 登录
await userStore.login(email, password)

// 跳转到首页
router.push('/')
```

### 路由守卫

```typescript
// router/index.ts
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})
```

### Token 管理

Token 自动添加到请求头：

```typescript
// api/request.ts
import axios from 'axios'
import { getToken } from '@/utils/auth'

const request = axios.create({
  baseURL: 'https://kids.jackverse.cn/api/v1'
})

request.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## 📊 数据可视化

### 学习时长图表

```typescript
{
  title: { text: '每日学习时长' },
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value',
    name: '分钟'
  },
  series: [{
    name: '学习时长',
    type: 'bar',
    data: [30, 45, 60, 40, 55, 90, 120],
    itemStyle: {
      color: '#3B82F6'
    }
  }]
}
```

### 内容类型分布

```typescript
{
  title: { text: '内容类型分布' },
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left' },
  series: [{
    name: '内容类型',
    type: 'pie',
    radius: '50%',
    data: [
      { value: 45, name: '绘本' },
      { value: 30, name: '儿歌' },
      { value: 25, name: '视频' }
    ]
  }]
}
```

## 🎨 主题定制

### 颜色方案

```css
/* TailwindCSS 配置 */
colors: {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  }
}
```

### 暗色模式

```vue
<template>
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
    内容
  </div>
</template>
```

## 🐛 调试技巧

### Vue DevTools

1. 安装 [Vue DevTools](https://devtools.vuejs.org/)
2. 打开浏览器开发者工具
3. 切换到 Vue 面板
4. 查看组件树、状态、路由等

### Network 调试

在浏览器开发者工具的 Network 面板查看 API 请求：
- 请求 URL
- 请求/响应头
- 请求/响应体
- 状态码
- 耗时

### 打印调试

```typescript
// 开发环境打印
if (import.meta.env.DEV) {
  console.log('Debug info:', data)
}
```

## 📋 开发规范

### 代码风格

- 使用 TypeScript，充分利用类型系统
- 使用 Vue 3 Composition API (`<script setup>`)
- 组件命名使用 PascalCase
- 文件命名使用 PascalCase（组件）或 kebab-case（其他）
- 使用 TailwindCSS 实用类，避免自定义 CSS

### 组件设计原则

- **单一职责**: 每个组件只做一件事
- **可复用**: 抽取通用组件
- **Props 验证**: 使用 TypeScript 类型
- **事件命名**: 使用 `on` 前缀（`@click="onClick"`）

### 提交规范

遵循 Conventional Commits：

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
perf: 性能优化
test: 测试
chore: 构建/工具
```

## 🚀 部署

### 构建

```bash
npm run build
```

构建产物在 `dist` 目录。

### 部署到 Nginx

```nginx
server {
  listen 80;
  server_name your-domain.com;

  root /path/to/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 环境变量

创建 `.env.production`：

```env
VITE_API_BASE_URL=https://kids.jackverse.cn/api/v1
```

在代码中使用：

```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
```

## 📚 相关文档

- [项目主 README](../README.md)
- [产品设计文档](../docs/)
- [Vue 3 文档](https://vuejs.org/)
- [TailwindCSS 文档](https://tailwindcss.com/)
- [ECharts 文档](https://echarts.apache.org/)

## 🔗 API 接口

**基础地址**: `https://kids.jackverse.cn/api/v1`

主要接口：
- 认证: `POST /auth/login`, `POST /auth/register`
- 内容: `GET /content/list`, `POST /content/picture-book/async`
- 收藏: `GET /favorite/list`, `POST /favorite/add`
- 孩子: `GET /children/list`, `POST /children/add`
- 报告: `GET /reports/learning-time`, `GET /reports/content-stats`

## 📞 技术支持

如有问题，请查看：
- [项目主 README](../README.md)
- 提交 Issue

---

Made with ❤️ using [Vue 3](https://vuejs.org/) + [TailwindCSS](https://tailwindcss.com/)

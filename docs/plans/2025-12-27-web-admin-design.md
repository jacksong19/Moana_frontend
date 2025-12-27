# Moana 家长管理端 - 网页版设计文档

> 创建日期：2025-12-27

## 一、项目概述

### 定位
家长管理端，用于在电脑/平板上管理孩子、查看学习报告、浏览和验证内容。

### 核心功能
1. 简单密码登录
2. 孩子管理（添加、切换、编辑信息）
3. 时间设置（每日/单次限制、休息提醒）
4. 学习报告（时长统计、主题分布）
5. 内容库（浏览、删除、收藏管理）
6. 播放器（绘本、儿歌、视频）

### 不包含
- 创作功能（在小程序端完成）
- 儿童模式（网页版仅家长使用）

### 技术栈
- Vue 3 + TypeScript
- Vite 构建
- Pinia 状态管理
- TailwindCSS 样式
- ECharts 图表

### 设计风格
- 现代卡片式，类似 Notion/Figma
- 完全响应式（桌面、平板、手机）

---

## 二、页面结构与路由

```
/login                 # 登录页
/                      # 重定向到 /dashboard
/dashboard             # 仪表盘：今日概览 + 快捷入口
/children              # 孩子管理列表
/children/:id          # 孩子详情/编辑
/children/add          # 添加孩子
/settings              # 时间限制设置
/report                # 学习报告
/library               # 内容库列表
/library/:id           # 内容详情
/play/:type/:id        # 播放页（type: picture-book/nursery-rhyme/video）
/favorites             # 收藏管理
```

### 布局结构

| 设备 | 布局 |
|------|------|
| 桌面（>1200px） | 左侧固定侧边栏（200px）+ 右侧主内容区 |
| 平板（768-1200px） | 可折叠侧边栏 + 主内容区 |
| 手机（<768px） | 顶部 Header + 主内容区 + 底部 TabBar |

### 导航项
1. 📊 仪表盘
2. 👶 孩子管理
3. 📚 内容库
4. ❤️ 收藏
5. 📈 学习报告
6. ⚙️ 设置

---

## 三、页面详细设计

### 1. 登录页 `/login`

简洁居中卡片：
- Logo + 标题「Moana 家长管理」
- 密码输入框（无需用户名）
- 登录按钮
- 密码错误时显示红色提示

登录成功后存储 token 到 localStorage，跳转仪表盘。

### 2. 仪表盘 `/dashboard`

四块卡片网格布局：

| 今日学习 | 内容统计 |
|---------|---------|
| 已学 X 分钟 / 限制 60 分钟 | 绘本 X · 儿歌 X · 视频 X |
| 进度条可视化 | 饼图或数字展示 |

| 当前孩子 | 快捷操作 |
|---------|---------|
| 头像 + 名字 + 年龄 | 查看内容库 → |
| 点击切换孩子 | 查看报告 → |

下方：最近播放记录列表（3-5 条）

### 3. 孩子管理 `/children`

卡片列表展示所有孩子：
- 头像、姓名、年龄、兴趣标签
- 「当前」徽章标识选中的孩子
- 点击卡片进入详情编辑
- 右上角「+ 添加孩子」按钮

### 4. 内容库 `/library`

**顶部筛选栏**：
- 类型切换：全部 | 绘本 | 儿歌 | 视频
- 搜索框（按标题搜索）

**内容卡片网格**（响应式：桌面4列、平板3列、手机2列）：
- 封面图（16:9 或 1:1）
- 标题、创建时间
- 类型图标角标
- 收藏心形按钮
- 悬浮显示操作：播放、删除

**空状态**：插画 + 「还没有内容，去小程序创作吧」

### 5. 播放页 `/play/:type/:id`

**绘本播放器**：
- 全屏沉浸式，深色背景
- 中央大图 + 底部文字
- 左右箭头翻页（键盘←→支持）
- 自动播放音频，可暂停
- 顶部：返回按钮、标题、页码（3/8）
- 底部：缩略图导航条（可选）

**儿歌播放器**：
- 封面图居中显示
- 歌词滚动展示（当前行高亮）
- 播放控制条：进度、播放/暂停、音量
- 循环播放开关

**视频播放器**：
- 原生 video 标签
- 全屏控制、进度条、音量

### 6. 收藏页 `/favorites`

与内容库类似的卡片布局：
- 只显示已收藏内容
- 点击心形可取消收藏（带确认提示）
- 空状态：「还没有收藏内容」

### 7. 学习报告 `/report`

**时间范围选择**：近7天 | 近30天 | 全部

**统计卡片**：
- 总学习时长（分钟/小时）
- 连续学习天数
- 完成内容数

**图表区域**：
- 每日学习时长柱状图（ECharts）
- 内容类型分布饼图
- 常看主题 TOP 5 列表

### 8. 设置页 `/settings`

表单卡片布局：

**时间限制**
- 每日限制：滑块 30-120 分钟
- 单次限制：滑块 15-60 分钟
- 休息提醒：开关

**其他**
- 退出登录按钮

底部「保存设置」按钮，保存成功显示 Toast 提示。

---

## 四、技术架构

### 项目结构

```
/Users/jack/coding/kids/web/
├── src/
│   ├── api/              # API 层（从小程序复用改造）
│   │   ├── request.ts    # Axios 封装
│   │   ├── auth.ts       # 登录相关
│   │   ├── child.ts      # 孩子管理
│   │   ├── content.ts    # 内容库
│   │   ├── play.ts       # 播放记录
│   │   └── favorite.ts   # 收藏
│   ├── stores/           # Pinia（复用小程序逻辑）
│   │   ├── user.ts
│   │   ├── child.ts
│   │   └── content.ts
│   ├── views/            # 页面组件
│   ├── components/       # 通用组件
│   │   ├── Layout/       # 布局（Sidebar, Header, TabBar）
│   │   ├── ContentCard/
│   │   ├── PlayerPictureBook/
│   │   ├── PlayerNurseryRhyme/
│   │   └── PlayerVideo/
│   ├── router/           # Vue Router
│   ├── styles/           # 全局样式
│   └── utils/            # 工具函数
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

### API 层改造

小程序用 `uni.request`，网页版改用 `axios`：
- 复用相同的接口路径和参数结构
- Token 存储改为 localStorage
- 移除微信特有逻辑

### 认证方案

简单密码登录：
- 密码：`Jack@kids`
- 登录成功后生成简单 token 存储到 localStorage
- 后续请求携带 token（复用小程序的 token 机制）

---

## 五、实现计划

### 第一阶段：基础框架
- [ ] Vite + Vue 3 + TypeScript 项目初始化
- [ ] TailwindCSS 配置
- [ ] 路由配置
- [ ] 布局组件（响应式 Sidebar/Header/TabBar）
- [ ] 登录页 + 简单认证

### 第二阶段：核心功能
- [ ] API 层（从小程序复用改造）
- [ ] Pinia stores
- [ ] 仪表盘页面
- [ ] 孩子管理（列表、详情、添加）

### 第三阶段：内容与播放
- [ ] 内容库页面
- [ ] 收藏页面
- [ ] 绘本播放器
- [ ] 儿歌播放器
- [ ] 视频播放器

### 第四阶段：报告与设置
- [ ] 学习报告（含图表）
- [ ] 设置页面

### 依赖库

```json
{
  "vue": "^3.4",
  "vue-router": "^4",
  "pinia": "^2",
  "axios": "^1",
  "tailwindcss": "^3",
  "echarts": "^5"
}
```

---

## 六、部署方案

### 构建
```bash
cd /Users/jack/coding/kids/web
npm run build
# 生成 dist/ 目录
```

### 服务器部署
```bash
scp -r dist/* root@server:/var/www/kids-web/
```

### Nginx 配置
```nginx
server {
    listen 443 ssl;
    server_name kids.jackverse.cn;

    # 网页前端
    location /web {
        alias /var/www/kids-web;
        try_files $uri $uri/ /web/index.html;
    }

    # API 保持不变
    location /api {
        proxy_pass http://127.0.0.1:8000;
    }
}
```

访问地址：`https://kids.jackverse.cn/web`

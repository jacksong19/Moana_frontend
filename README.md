# Moana - 儿童教育内容生成平台

<div align="center">

**基于 AI 的儿童教育内容创作平台**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![WeChat MiniProgram](https://img.shields.io/badge/WeChat-MiniProgram-07C160?logo=wechat)](https://mp.weixin.qq.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)

</div>

## 📖 项目简介

Moana 是一个基于 AI 技术的儿童教育内容生成平台，支持自动生成绘本、儿歌、视频等多种教育内容。平台由微信小程序（儿童端）和 Web 管理端（家长端）组成，提供完整的内容创作、播放、管理体验。

### 核心功能

- 🎨 **AI 绘本生成** - 基于文本描述自动生成带插图的绘本故事
- 🎵 **AI 儿歌创作** - 自动生成儿歌歌词和音频，支持歌词同步高亮
- 🎬 **AI 视频制作** - 生成教育视频内容
- 🧠 **智能创作助手** - 基于标签和灵感自动生成创意内容
- 👶 **儿童模式** - 安全的儿童使用界面，带时间限制和内容过滤
- 📊 **学习报告** - 详细的学习数据统计和分析
- ⭐ **收藏管理** - 内容收藏和分类管理

## 🏗️ 项目结构

```
kids/
├── miniprogram/          # 微信小程序（儿童端）
│   ├── src/             # 源代码
│   │   ├── pages/       # 页面
│   │   ├── components/  # 组件
│   │   ├── api/         # API 接口
│   │   ├── stores/      # Pinia 状态管理
│   │   └── utils/       # 工具函数
│   ├── dist/            # 编译输出
│   ├── docs/            # 小程序文档
│   └── package.json
│
├── web/                 # Web 管理端（家长端）
│   ├── src/
│   │   ├── views/       # 页面视图
│   │   ├── components/  # 组件
│   │   ├── api/         # API 接口
│   │   ├── stores/      # Pinia 状态管理
│   │   ├── router/      # 路由配置
│   │   └── utils/       # 工具函数
│   └── package.json
│
└── docs/                # 项目文档
    ├── frontend-*.md    # 前端开发指南
    └── plans/           # 产品计划文档
```

## 🛠️ 技术栈

### 微信小程序端

- **框架**: uni-app 3.x + Vue 3 + TypeScript
- **UI 库**: Wot Design Uni
- **状态管理**: Pinia 3.x
- **构建工具**: Vite 5.x
- **包管理**: npm

### Web 管理端

- **框架**: Vue 3 + TypeScript
- **路由**: Vue Router 4.x
- **状态管理**: Pinia 2.x
- **UI 框架**: TailwindCSS 3.x
- **HTTP 客户端**: Axios
- **图表库**: ECharts 5.x
- **构建工具**: Vite 5.x

### 后端服务

- **API 基础地址**: `https://kids.jackverse.cn/api/v1`
- **认证方式**: Token-based Authentication
- **主要接口**:
  - 内容生成（绘本、儿歌、视频）
  - 用户管理
  - 收藏管理
  - 播放记录
  - 学习报告

## 🚀 快速开始

### 前置要求

- Node.js >= 16.x
- npm >= 8.x
- 微信开发者工具（仅小程序开发需要）

### 微信小程序开发

```bash
# 1. 进入小程序目录
cd miniprogram

# 2. 安装依赖
npm install

# 3. 配置微信小程序 AppID（首次）
cp project.config.json.template project.config.json
cp project.private.config.json.template project.private.config.json
cp src/manifest.json.template src/manifest.json
# 编辑这些文件，将 YOUR_WECHAT_APPID_HERE 替换为你的 AppID

# 4. 开发模式编译
npm run dev:mp-weixin

# 5. 生产模式编译（发布前）
npm run build:mp-weixin

# 6. 使用微信开发者工具导入
# 开发: dist/dev/mp-weixin
# 生产: dist/build/mp-weixin
```

**⚠️ 重要提示**:
- 每次代码修改后需要同时编译 dev 和 build 两个目录
- 详细配置说明请查看 [`miniprogram/README.sensitive-config.md`](miniprogram/README.sensitive-config.md)
- 开发文档请查看 [`miniprogram/CLAUDE.md`](miniprogram/CLAUDE.md)

### Web 管理端开发

```bash
# 1. 进入 web 目录
cd web

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 构建生产版本
npm run build

# 5. 预览生产构建
npm run preview
```

访问 `http://localhost:5173` 查看应用

## 📚 文档导航

### 小程序文档
- [开发指南](miniprogram/CLAUDE.md) - 小程序开发完整指南
- [开发笔记](miniprogram/DEV-NOTES.md) - 开发过程记录
- [敏感配置说明](miniprogram/README.sensitive-config.md) - AppID 配置指南

### 产品设计文档
- [前端配置指南](docs/frontend-config-guide.md)
- [前端样式选择指南](docs/frontend-style-selection-guide.md)
- [绘本优化指南](docs/frontend-picture-book-optimization-guide.md)
- [Veo 3.1 视频集成](docs/frontend-veo31-guide.md)
- [儿歌 v2 前端指南](docs/nursery-rhyme-v2-frontend-guide.md)
- [智能创作 API](docs/smart-creation-backend-api.md)
- [素材详情 API](docs/nursery-rhyme-asset-details-api.md)

### API 文档

#### 内容生成 API

**绘本生成（异步）**
```http
POST /content/picture-book/async
GET  /content/picture-book/status/{task_id}
```

**儿歌生成（异步）**
```http
POST /content/nursery-rhyme/async
GET  /content/nursery-rhyme/status/{task_id}
```

**视频生成**
```http
POST /content/video
```

**内容管理**
```http
GET  /content/list              # 内容列表
GET  /content/{id}              # 内容详情
GET  /content/{id}/asset-details # 素材参数
GET  /content/{id}/generation-logs # 生成日志
```

详细 API 文档请查看 [`miniprogram/CLAUDE.md`](miniprogram/CLAUDE.md#联调架构)

## 🔒 安全配置

本项目的敏感配置文件（包含微信小程序 AppID）已从 Git 仓库中排除，使用模板文件进行管理。

### 首次设置

1. 复制配置模板：
```bash
cd miniprogram
cp project.config.json.template project.config.json
cp project.private.config.json.template project.private.config.json
cp src/manifest.json.template src/manifest.json
```

2. 编辑配置文件，将 `YOUR_WECHAT_APPID_HERE` 替换为你的微信小程序 AppID

3. 这些文件已添加到 `.gitignore`，不会被 Git 跟踪

详细说明请查看 [敏感配置指南](miniprogram/README.sensitive-config.md)

## 📁 内容类型

平台支持三种内容类型，每种有对应的播放器页面：

| 类型 | 标识 | 播放器路径 | 说明 |
|------|------|-----------|------|
| 绘本 | `picture_book` | `/pages/play/picture-book` | 图文结合的故事书 |
| 儿歌 | `nursery_rhyme` | `/pages/play/nursery-rhyme` | 音频+歌词同步 |
| 视频 | `video` | `/pages/play/video` | 教育视频内容 |

## 🎯 核心特性

### AI 内容生成

- **异步生成机制**: 避免 Cloudflare 超时，支持长时间生成任务
- **实时进度反馈**: 生成过程分阶段显示（文本生成 → 图片生成 → 音频合成 → 完成）
- **智能参数控制**: 支持绘画风格、时长、角色设定等高级参数
- **生成日志**: 完整的生成过程记录，便于故障排查

### 用户体验

- **儿童模式**: 简化界面、时间限制（30分钟）、防误操作
- **内容收藏**: 快速访问喜欢的内容
- **播放记录**: 自动记录学习进度
- **离线缓存**: 音频和图片缓存，减少流量消耗

### 数据统计

- **学习时长**: 每日、每周、每月统计
- **内容分析**: 内容类型分布、最受欢迎内容
- **成长报告**: 可视化的学习成长轨迹

## 🚀 部署

### 小程序发布

1. 使用生产模式编译：
```bash
npm run build:mp-weixin
```

2. 使用微信开发者工具导入 `dist/build/mp-weixin`

3. 上传代码并提交审核

### Web 端部署

```bash
# 构建生产版本
npm run build

# 部署 dist 目录到服务器
# 推荐使用 Nginx 或 Vercel
```

## 🛠️ 开发规范

### 代码风格

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 风格
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

### Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具配置
```

### 开发流程

1. 从 `main` 分支创建功能分支
2. 开发并测试功能
3. 提交代码（遵循提交规范）
4. 创建 Pull Request
5. 代码审查通过后合并

## 📝 版本历史

### v1.0.0 (当前)

**功能特性**
- ✅ 绘本生成（支持多种绘画风格）
- ✅ 儿歌创作（Suno 音乐生成 + 歌词同步）
- ✅ 视频生成（基于 Veo 3.1）
- ✅ 智能创作（标签灵感生成）
- ✅ 儿童模式（时间限制 + 安全界面）
- ✅ 内容库管理
- ✅ 收藏功能
- ✅ 学习报告
- ✅ Web 家长管理端

**技术优化**
- ✅ 异步生成机制
- ✅ 生成日志系统
- ✅ 性能优化（图片懒加载、音频预加载）
- ✅ 错误处理和用户提示
- ✅ 敏感配置保护

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [Vue 3 官方文档](https://vuejs.org/)
- [TailwindCSS 文档](https://tailwindcss.com/)

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/jacksong19/Moana_frontend/issues)
- Email: [您的邮箱]

---

<div align="center">

**用 ❤️ 为孩子们打造的教育平台**

Made with [Claude Code](https://claude.com/claude-code)

</div>

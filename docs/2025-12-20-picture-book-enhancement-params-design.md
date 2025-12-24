# 绘本创作增强参数设计文档

## 概述

为前端智能创作模式提供更丰富的创作参数，让普通家长可以通过简单选项控制绘本的故事风格和视觉表现，无需了解专业术语。

## 设计原则

1. **所有新参数可选** - 省略时由 Gemini 智能推断
2. **前端自由扩展** - 后端不做参数映射，由 Gemini 理解参数语义
3. **嵌套结构清晰** - `story_enhancement` 和 `visual_enhancement` 分离
4. **面向普通家长** - 使用简单易懂的中文选项

## 整体结构

```json
{
  // === 现有参数（保持不变）===
  "child_name": "玥玥",
  "age_months": 36,
  "theme_topic": "去海边玩",
  "theme_category": "cognition",
  "art_style": "pixar_3d",
  "protagonist": { "animal": "bunny", "color": "white", "accessory": "blue_overalls" },
  "color_palette": "pastel",
  "voice_id": "Kore",
  "creation_mode": "smart",
  "custom_prompt": "小兔子去海边堆沙堡",

  // === 新增：故事增强参数 ===
  "story_enhancement": {
    "narrative_pace": "relaxed",
    "interaction_density": "moderate",
    "educational_focus": "cognitive",
    "language_style": "rhythmic",
    "plot_complexity": "simple",
    "ending_style": "warm"
  },

  // === 新增：视觉增强参数 ===
  "visual_enhancement": {
    "time_atmosphere": "afternoon",
    "scene_environment": "beach",
    "emotional_tone": "cheerful",
    "composition_style": "narrative",
    "lighting_effect": "warm_sunlight"
  }
}
```

---

## 故事增强参数 (story_enhancement)

| 参数 | 字段名 | 选项值 | 显示名称 | 说明 |
|-----|-------|--------|---------|------|
| **叙事节奏** | `narrative_pace` | `relaxed` | 轻松舒缓 | 适合睡前，节奏慢 |
| | | `lively` | 紧凑活泼 | 适合日间，节奏快 |
| | | `progressive` | 循序渐进 | 逐步展开，有铺垫 |
| **互动密度** | `interaction_density` | `minimal` | 少互动 | 纯阅读体验 |
| | | `moderate` | 适中 | 每2-3页一个互动 |
| | | `intensive` | 多互动 | 几乎每页都有 |
| **教育侧重** | `educational_focus` | `cognitive` | 认知学习 | 认识事物、概念 |
| | | `behavioral` | 行为引导 | 习惯养成、规则 |
| | | `emotional` | 情感培养 | 情绪管理、共情 |
| | | `imaginative` | 想象激发 | 创意、幻想 |
| **语言风格** | `language_style` | `simple` | 简洁直白 | 短句，易懂 |
| | | `rhythmic` | 韵律押韵 | 朗朗上口 |
| | | `onomatopoeia` | 拟声丰富 | 哗啦、咕噜 |
| | | `repetitive` | 重复强化 | 关键词重复 |
| **情节复杂度** | `plot_complexity` | `linear` | 简单线性 | 单一主线 |
| | | `twist` | 有小波折 | 小问题→解决 |
| | | `ensemble` | 多角色互动 | 配角戏份多 |
| **结局风格** | `ending_style` | `warm` | 温馨收尾 | 美好结局 |
| | | `open` | 开放想象 | 留有想象空间 |
| | | `summary` | 总结回顾 | 重述要点 |

---

## 视觉增强参数 (visual_enhancement)

| 参数 | 字段名 | 选项值 | 显示名称 | 说明 |
|-----|-------|--------|---------|------|
| **时间氛围** | `time_atmosphere` | `morning` | 清晨阳光 | 柔和晨光，清新 |
| | | `afternoon` | 午后温暖 | 明亮温暖 |
| | | `sunset` | 傍晚金色 | 黄金时刻，浪漫 |
| | | `night` | 夜晚星空 | 月光、星空 |
| | | `dreamy` | 梦幻魔法 | 光晕、粒子效果 |
| **场景环境** | `scene_environment` | `indoor` | 温馨室内 | 家、卧室、厨房 |
| | | `garden` | 花园户外 | 花草、阳光 |
| | | `forest` | 森林探险 | 树木、小动物 |
| | | `beach` | 海边沙滩 | 大海、沙滩 |
| | | `clouds` | 云端梦境 | 云朵、天空 |
| **情感基调** | `emotional_tone` | `cheerful` | 欢乐活泼 | 明快、跳跃 |
| | | `cozy` | 温馨甜蜜 | 柔和、亲密 |
| | | `playful` | 轻松幽默 | 俏皮、搞笑 |
| | | `peaceful` | 安静祥和 | 宁静、放松 |
| | | `curious` | 神秘好奇 | 探索、发现 |
| **画面构图** | `composition_style` | `close_up` | 角色特写 | 表情细节 |
| | | `panorama` | 全景场景 | 环境展示 |
| | | `interaction` | 互动场景 | 角色互动 |
| | | `narrative` | 故事叙事 | 动作连贯 |
| **光照效果** | `lighting_effect` | `soft_natural` | 柔和自然 | 均匀漫射光 |
| | | `warm_sunlight` | 温暖阳光 | 金色暖调 |
| | | `dreamy_glow` | 梦幻光晕 | 柔焦发光 |
| | | `cozy_lamp` | 夜灯温馨 | 暖黄灯光 |

---

## 后端实现方案

### 1. 数据模型 (src/moana/agents/story.py)

```python
@dataclass
class StoryEnhancement:
    """故事增强配置（全部可选）."""
    narrative_pace: str | None = None
    interaction_density: str | None = None
    educational_focus: str | None = None
    language_style: str | None = None
    plot_complexity: str | None = None
    ending_style: str | None = None


@dataclass
class VisualEnhancement:
    """视觉增强配置（全部可选）."""
    time_atmosphere: str | None = None
    scene_environment: str | None = None
    emotional_tone: str | None = None
    composition_style: str | None = None
    lighting_effect: str | None = None


@dataclass
class StyleConfig:
    """完整风格配置."""
    art_style: str = "pixar_3d"
    protagonist_animal: str = "bunny"
    protagonist_color: str = "white"
    protagonist_accessory: str = "blue overalls"
    color_palette: str = "pastel"
    story_enhancement: StoryEnhancement | None = None
    visual_enhancement: VisualEnhancement | None = None
```

### 2. System Prompt 增强 (src/moana/agents/story.py)

```python
def build_system_prompt(style: StyleConfig) -> str:
    # ... 现有代码 ...

    # === 构建故事增强描述 ===
    story_hints = []
    if style.story_enhancement:
        se = style.story_enhancement
        if se.narrative_pace:
            story_hints.append(f"叙事节奏：{se.narrative_pace}")
        if se.interaction_density:
            story_hints.append(f"互动密度：{se.interaction_density}")
        if se.educational_focus:
            story_hints.append(f"教育侧重：{se.educational_focus}")
        if se.language_style:
            story_hints.append(f"语言风格：{se.language_style}")
        if se.plot_complexity:
            story_hints.append(f"情节复杂度：{se.plot_complexity}")
        if se.ending_style:
            story_hints.append(f"结局风格：{se.ending_style}")

    story_text = "\n".join(f"- {h}" for h in story_hints) if story_hints else "（由你根据主题智能推断）"

    # === 构建视觉增强描述 ===
    visual_hints = []
    if style.visual_enhancement:
        ve = style.visual_enhancement
        if ve.time_atmosphere:
            visual_hints.append(f"时间氛围：{ve.time_atmosphere}")
        if ve.scene_environment:
            visual_hints.append(f"场景环境：{ve.scene_environment}")
        if ve.emotional_tone:
            visual_hints.append(f"情感基调：{ve.emotional_tone}")
        if ve.composition_style:
            visual_hints.append(f"画面构图：{ve.composition_style}")
        if ve.lighting_effect:
            visual_hints.append(f"光照效果：{ve.lighting_effect}")

    visual_text = "\n".join(f"- {h}" for h in visual_hints) if visual_hints else "（由你根据主题智能推断）"

    return f"""你是一位专业的儿童绘本作家...

【故事创作增强指引】
用户希望的故事风格：
{story_text}

请根据以上指引调整故事的节奏、语言、互动设计和情节安排。
如果某项未指定，请根据主题和孩子年龄智能选择最合适的方式。

【图像提示词增强指引】
用户希望的视觉风格：
{visual_text}

请在生成每页的 image_prompt 时，将以上视觉元素自然融入。例如：
- 如果指定了 "sunset"（傍晚），添加 "golden hour lighting, warm orange glow"
- 如果指定了 "cheerful"（欢乐），添加 "bright colors, happy expressions, dynamic poses"
- 如果未指定某项，根据故事情节智能选择最合适的表现

... 其余现有 prompt ..."""
```

### 3. API 接口 (src/moana/api/content.py)

```python
class StoryEnhancementConfig(BaseModel):
    """故事增强配置（全部可选）."""
    narrative_pace: str | None = Field(default=None)
    interaction_density: str | None = Field(default=None)
    educational_focus: str | None = Field(default=None)
    language_style: str | None = Field(default=None)
    plot_complexity: str | None = Field(default=None)
    ending_style: str | None = Field(default=None)


class VisualEnhancementConfig(BaseModel):
    """视觉增强配置（全部可选）."""
    time_atmosphere: str | None = Field(default=None)
    scene_environment: str | None = Field(default=None)
    emotional_tone: str | None = Field(default=None)
    composition_style: str | None = Field(default=None)
    lighting_effect: str | None = Field(default=None)


class PictureBookRequest(BaseModel):
    # ... 现有字段 ...

    story_enhancement: StoryEnhancementConfig | None = Field(default=None)
    visual_enhancement: VisualEnhancementConfig | None = Field(default=None)
```

---

## 参数传递链路

```
前端请求
    ↓
PictureBookRequest (接收 story_enhancement, visual_enhancement)
    ↓
_generate_picture_book_background (传递参数)
    ↓
PictureBookPipeline.generate (传递参数)
    ↓
StoryAgent.generate_outline (传递参数)
    ↓
build_system_prompt (构建包含增强参数的 system prompt)
    ↓
Gemini 3 Pro (理解参数，生成符合要求的故事和 image_prompt)
    ↓
Nano Banana Pro (根据 image_prompt 生成图片)
```

---

## 前端 UI 建议

### 布局

| 区域 | 展示方式 | 交互 |
|-----|---------|------|
| **基础设置** | 当前已有 | 保持不变 |
| **故事风格** | 折叠面板「高级设置」 | 6 组单选卡片 |
| **视觉风格** | 折叠面板「画面设置」 | 5 组单选卡片 |

### 卡片设计示例

```
┌─────────────────────────────────────────┐
│  叙事节奏                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ 😌 舒缓  │ │ 🎵 活泼  │ │ 📖 渐进  │   │
│  │ 适合睡前 │ │ 适合日间 │ │ 娓娓道来 │   │
│  └─────────┘ └─────────┘ └─────────┘   │
└─────────────────────────────────────────┘
```

---

## 技术要点

### 为什么不做后端参数映射？

1. **更简单** - 后端不需要维护映射表
2. **更灵活** - 前端可以随时增加新参数，不需要后端同步更新
3. **避免不一致** - 不会出现前端参数不在后端映射表中的问题
4. **利用 LLM 能力** - Gemini 3 Pro 本身就擅长理解自然语言参数

### 模型配置

- **LLM**: `gemini-3-pro-preview` (Gemini 3 Pro) - 理解参数并生成 image_prompt
- **图像生成**: `gemini-3-pro-image-preview` (Nano Banana Pro) - 根据 prompt 生成图片

---

## 文档信息

- **创建日期**: 2025-12-20
- **状态**: 设计完成，待实现
- **相关文件**:
  - `src/moana/agents/story.py` - StoryAgent 和 StyleConfig
  - `src/moana/api/content.py` - API 接口定义
  - `src/moana/pipelines/picture_book.py` - 绘本生成流水线

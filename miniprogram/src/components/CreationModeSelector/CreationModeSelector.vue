<template>
  <view class="mode-selector">
    <!-- 梦幻背景装饰 -->
    <view class="floating-decor">
      <view class="bubble bubble-1"></view>
      <view class="bubble bubble-2"></view>
      <view class="bubble bubble-3"></view>
      <view class="star star-1">✦</view>
      <view class="star star-2">✧</view>
      <view class="star star-3">✦</view>
    </view>

    <!-- 标题区 -->
    <view class="header-area">
      <view class="mascot">
        <text class="mascot-emoji">{{ contentTypeEmoji }}</text>
        <view class="mascot-glow"></view>
      </view>
      <text class="title">{{ title }}</text>
      <text class="subtitle">选择你喜欢的创作方式</text>
    </view>

    <!-- 模式选择卡片 -->
    <view class="mode-cards">
      <!-- 主题预设模式 -->
      <view
        class="mode-card preset-card"
        :class="{ selected: selectedMode === 'preset' }"
        @tap="selectMode('preset')"
      >
        <view class="card-glow"></view>
        <view class="card-content">
          <view class="card-icon-area">
            <view class="icon-bg preset-icon-bg">
              <text class="card-icon">📋</text>
            </view>
            <view class="icon-sparkle">✨</view>
          </view>
          <view class="card-text">
            <text class="card-title">主题精选</text>
            <text class="card-desc">从精心准备的主题中选择</text>
          </view>
          <view class="card-tags">
            <view class="tag">快速开始</view>
            <view class="tag">推荐</view>
          </view>
        </view>
        <view v-if="selectedMode === 'preset'" class="check-mark">
          <text>✓</text>
        </view>
      </view>

      <!-- 智能创作模式 -->
      <view
        class="mode-card smart-card"
        :class="{ selected: selectedMode === 'smart' }"
        @tap="selectMode('smart')"
      >
        <view class="card-glow"></view>
        <view class="card-content">
          <view class="card-icon-area">
            <view class="icon-bg smart-icon-bg">
              <text class="card-icon">🪄</text>
            </view>
            <view class="icon-sparkle magic">✨</view>
          </view>
          <view class="card-text">
            <text class="card-title">智能创作</text>
            <text class="card-desc">描述你的想法，AI 帮你实现</text>
          </view>
          <view class="card-tags">
            <view class="tag magic-tag">自由创意</view>
            <view class="tag magic-tag">个性化</view>
          </view>
        </view>
        <view v-if="selectedMode === 'smart'" class="check-mark magic-check">
          <text>✓</text>
        </view>
      </view>
    </view>

    <!-- 智能创作输入区 (当选择智能模式时展开) -->
    <view v-if="selectedMode === 'smart'" class="smart-input-area animate-slideIn">
      <view class="input-container">
        <view class="input-header">
          <text class="input-icon">💭</text>
          <text class="input-label">告诉 AI 你的想法</text>
        </view>
        <textarea
          v-model="smartPrompt"
          class="prompt-textarea"
          placeholder="例如：宝宝不爱刷牙，做一个有趣的刷牙故事..."
          :maxlength="300"
          auto-height
        />
        <view class="input-footer">
          <text class="char-count">{{ smartPrompt.length }}/300</text>
        </view>
      </view>

      <!-- 快捷灵感标签 -->
      <view class="inspiration-area">
        <text class="inspiration-title">💡 快捷灵感</text>
        <view class="inspiration-tags">
          <view
            v-for="(tag, index) in inspirationTags"
            :key="index"
            class="inspiration-tag"
            @tap="fillInspiration(tag)"
          >
            <text class="tag-emoji">{{ tag.emoji }}</text>
            <text class="tag-text">{{ tag.label }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作区 -->
    <view class="action-area">
      <view
        class="start-btn"
        :class="{ disabled: !canStart, [contentTypeClass]: true }"
        @tap="handleStart"
      >
        <view class="btn-shine"></view>
        <view class="btn-content">
          <text class="btn-icon">{{ selectedMode === 'smart' ? '✨' : '🚀' }}</text>
          <text class="btn-text">{{ startButtonText }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type ContentType = 'picture_book' | 'nursery_rhyme' | 'video'
type CreationMode = 'preset' | 'smart'

const props = defineProps<{
  contentType: ContentType
}>()

const emit = defineEmits<{
  (e: 'select', mode: CreationMode, prompt?: string): void
}>()

const selectedMode = ref<CreationMode | ''>('')
const smartPrompt = ref('')

// 根据内容类型显示不同的标题和图标
const contentTypeConfig = computed(() => {
  const configs: Record<ContentType, { title: string; emoji: string; class: string }> = {
    picture_book: { title: '创作绘本', emoji: '📚', class: 'book' },
    nursery_rhyme: { title: '创作儿歌', emoji: '🎵', class: 'song' },
    video: { title: '创作视频', emoji: '🎬', class: 'video' }
  }
  return configs[props.contentType]
})

const title = computed(() => contentTypeConfig.value.title)
const contentTypeEmoji = computed(() => contentTypeConfig.value.emoji)
const contentTypeClass = computed(() => contentTypeConfig.value.class)

// 灵感标签
const inspirationTags = [
  { emoji: '🦷', label: '刷牙习惯', text: '宝宝不爱刷牙，做一个有趣的刷牙故事' },
  { emoji: '🥦', label: '爱吃蔬菜', text: '宝宝挑食不吃蔬菜，帮我做一个关于蔬菜的内容' },
  { emoji: '🛏️', label: '早睡早起', text: '宝宝晚上不愿意睡觉，需要一个睡前故事' },
  { emoji: '🚿', label: '洗澡洗手', text: '教宝宝养成爱干净的好习惯' },
  { emoji: '💬', label: '礼貌用语', text: '教宝宝说请、谢谢、对不起等礼貌用语' },
  { emoji: '🖐️', label: '学会分享', text: '宝宝不愿意和小朋友分享玩具' },
  { emoji: '👭', label: '交朋友', text: '帮助宝宝学会和其他小朋友交朋友' },
  { emoji: '😌', label: '情绪管理', text: '宝宝容易发脾气，教他管理情绪' },
  { emoji: '🏠', label: '认识家人', text: '教宝宝认识家庭成员和亲情关系' }
]

const canStart = computed(() => {
  if (!selectedMode.value) return false
  if (selectedMode.value === 'smart' && !smartPrompt.value.trim()) return false
  return true
})

const startButtonText = computed(() => {
  if (!selectedMode.value) return '请选择创作方式'
  if (selectedMode.value === 'smart' && !smartPrompt.value.trim()) return '请输入创意描述'
  return selectedMode.value === 'smart' ? '开始智能创作' : '选择主题'
})

function selectMode(mode: CreationMode) {
  selectedMode.value = mode
}

function fillInspiration(tag: { text: string }) {
  smartPrompt.value = tag.text
}

function handleStart() {
  if (!canStart.value) return
  emit('select', selectedMode.value as CreationMode, smartPrompt.value || undefined)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.mode-selector {
  min-height: 100%;
  padding: 0 32rpx;
  padding-bottom: 200rpx;
  position: relative;
  overflow: hidden;
}

// 浮动装饰
.floating-decor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400rpx;
  pointer-events: none;
  z-index: 0;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;

  &.bubble-1 {
    width: 120rpx;
    height: 120rpx;
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.4), rgba(139, 92, 246, 0.2));
    top: 80rpx;
    right: 40rpx;
    animation: float 4s ease-in-out infinite;
  }

  &.bubble-2 {
    width: 80rpx;
    height: 80rpx;
    background: linear-gradient(135deg, rgba(244, 114, 182, 0.4), rgba(236, 72, 153, 0.2));
    top: 160rpx;
    left: 60rpx;
    animation: float 3.5s ease-in-out infinite 0.5s;
  }

  &.bubble-3 {
    width: 60rpx;
    height: 60rpx;
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.4), rgba(59, 130, 246, 0.2));
    top: 240rpx;
    right: 120rpx;
    animation: float 5s ease-in-out infinite 1s;
  }
}

.star {
  position: absolute;
  font-size: 24rpx;
  color: rgba(251, 191, 36, 0.7);
  animation: twinkle 2s ease-in-out infinite;

  &.star-1 { top: 100rpx; left: 30%; animation-delay: 0s; }
  &.star-2 { top: 180rpx; right: 25%; animation-delay: 0.7s; font-size: 20rpx; }
  &.star-3 { top: 280rpx; left: 50%; animation-delay: 1.4s; font-size: 16rpx; }
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20rpx) scale(1.05); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

// 标题区
.header-area {
  position: relative;
  z-index: 1;
  text-align: center;
  padding-top: 60rpx;
  margin-bottom: 48rpx;
}

.mascot {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 24rpx;
}

.mascot-emoji {
  font-size: 64rpx;
  position: relative;
  z-index: 1;
  animation: bounce 2s ease-in-out infinite;
}

.mascot-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140rpx;
  height: 140rpx;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8rpx); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 12rpx;
  letter-spacing: 2rpx;
}

.subtitle {
  display: block;
  font-size: 28rpx;
  color: $text-tertiary;
}

// 模式卡片
.mode-cards {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.mode-card {
  position: relative;
  background: $bg-card;
  border-radius: 32rpx;
  padding: 32rpx;
  border: 3rpx solid $border-light;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;

  &:active {
    transform: scale(0.98);
  }

  &.selected {
    border-color: transparent;
    box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.1);

    .card-glow {
      opacity: 1;
    }
  }
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.preset-card {
  .card-glow {
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%);
  }

  &.selected {
    border-color: rgba(59, 130, 246, 0.4);
  }
}

.smart-card {
  .card-glow {
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%);
  }

  &.selected {
    border-color: rgba(139, 92, 246, 0.4);
  }
}

.card-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.card-icon-area {
  position: relative;
  width: fit-content;
}

.icon-bg {
  width: 80rpx;
  height: 80rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &.preset-icon-bg {
    background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
  }

  &.smart-icon-bg {
    background: linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%);
  }
}

.card-icon {
  font-size: 40rpx;
}

.icon-sparkle {
  position: absolute;
  top: -8rpx;
  right: -12rpx;
  font-size: 20rpx;
  animation: sparkle 1.5s ease-in-out infinite;

  &.magic {
    animation: magicSparkle 1.5s ease-in-out infinite;
  }
}

@keyframes sparkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(20deg); }
}

@keyframes magicSparkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
  33% { opacity: 1; transform: scale(1.2) rotate(20deg); }
  66% { opacity: 0.6; transform: scale(1) rotate(-10deg); }
}

.card-text {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.card-title {
  font-size: 36rpx;
  font-weight: 700;
  color: $text-primary;
}

.card-desc {
  font-size: 26rpx;
  color: $text-secondary;
  line-height: 1.5;
}

.card-tags {
  display: flex;
  gap: 12rpx;
  margin-top: 8rpx;
}

.tag {
  padding: 8rpx 16rpx;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #3B82F6;

  &.magic-tag {
    background: rgba(139, 92, 246, 0.1);
    color: #8B5CF6;
  }
}

.check-mark {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  width: 48rpx;
  height: 48rpx;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  text {
    color: white;
    font-size: 28rpx;
    font-weight: bold;
  }

  &.magic-check {
    background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  }
}

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

// 智能输入区
.smart-input-area {
  position: relative;
  z-index: 1;
  margin-bottom: 32rpx;
}

.animate-slideIn {
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideIn {
  0% { opacity: 0; transform: translateY(-20rpx); }
  100% { opacity: 1; transform: translateY(0); }
}

.input-container {
  background: $bg-card;
  border-radius: 24rpx;
  padding: 24rpx;
  border: 2rpx solid rgba(139, 92, 246, 0.2);
  margin-bottom: 24rpx;
}

.input-header {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.input-icon {
  font-size: 28rpx;
}

.input-label {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
}

.prompt-textarea {
  width: 100%;
  min-height: 120rpx;
  padding: 20rpx;
  background: $bg-soft;
  border: 1rpx solid $border-light;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: $text-primary;
  line-height: 1.6;
  box-sizing: border-box;
}

.input-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12rpx;
}

.char-count {
  font-size: 22rpx;
  color: $text-placeholder;
}

.inspiration-area {
  background: rgba(139, 92, 246, 0.05);
  border-radius: 20rpx;
  padding: 20rpx;
}

.inspiration-title {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: $text-secondary;
  margin-bottom: 16rpx;
}

.inspiration-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.inspiration-tag {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 10rpx 16rpx;
  background: $bg-card;
  border: 1rpx solid $border-light;
  border-radius: 20rpx;
  transition: all 0.2s;

  &:active {
    background: rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.3);
  }
}

.tag-emoji {
  font-size: 20rpx;
}

.tag-text {
  font-size: 24rpx;
  color: $text-secondary;
}

// 底部操作区
.action-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: rgba(255, 251, 247, 0.95);
  backdrop-filter: blur(20rpx);
  border-top: 1rpx solid $border-light;
  z-index: 100;
}

.start-btn {
  position: relative;
  height: 100rpx;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s;

  // 根据内容类型应用不同的渐变色
  &.book {
    background: $book-gradient;
  }

  &.song {
    background: $song-gradient;
  }

  &.video {
    background: $video-gradient;
  }

  &.disabled {
    background: $border-medium !important;

    .btn-shine {
      display: none;
    }
  }

  &:active:not(.disabled) {
    transform: scale(0.98);
  }
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 2.5s infinite;
}

@keyframes shine {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}

.btn-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.btn-icon {
  font-size: 32rpx;
}

.btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: white;
}
</style>

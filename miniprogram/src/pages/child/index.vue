<template>
  <view class="child-mode-container">
    <!-- 背景装饰 -->
    <view class="bg-decor">
      <view class="star s1">⭐</view>
      <view class="star s2">🌟</view>
      <view class="star s3">✨</view>
      <view class="cloud c1">☁️</view>
      <view class="cloud c2">☁️</view>
    </view>

    <!-- 主内容 -->
    <view class="main-area">
      <!-- 顶部时间显示 -->
      <view class="time-display">
        <view class="time-ring">
          <view class="time-progress" :style="timeProgressStyle"></view>
          <view class="time-center">
            <text class="time-value">{{ remainingMinutes }}</text>
            <text class="time-label">分钟</text>
          </view>
        </view>
      </view>

      <!-- 内容卡片 -->
      <view v-if="currentContent" class="content-card" @tap="startPlay">
        <view class="card-cover">
          <image
            v-if="currentContent.cover_url"
            :src="currentContent.cover_url"
            mode="aspectFill"
          />
          <text v-else class="cover-emoji">📚</text>
        </view>
        <text class="card-title">{{ currentContent.title }}</text>
        <view class="play-indicator">
          <text>▶</text>
          <text>点我播放</text>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-state">
        <text class="empty-emoji">🎨</text>
        <text class="empty-text">还没有内容</text>
        <text class="empty-hint">请家长添加内容</text>
      </view>

      <!-- 素材库标题 -->
      <view v-if="contentList.length > 0" class="library-header">
        <text class="library-title">📦 我的宝贝盒子</text>
      </view>

      <!-- 内容列表 - 玩具盒子风格 -->
      <view v-if="contentList.length > 0" class="content-list">
        <view
          v-for="item in contentList"
          :key="item.id"
          class="list-item"
          :class="[
            getContentTypeClass(item),
            { active: currentContent?.id === item.id }
          ]"
          @tap="selectContent(item)"
        >
          <!-- 内容类型徽章 -->
          <view class="item-badge">
            <text>{{ getContentTypeBadge(item) }}</text>
          </view>
          <!-- 图标区域 -->
          <view class="item-icon-wrap">
            <view class="item-icon">
              <text>{{ getContentEmoji(item) }}</text>
            </view>
          </view>
          <!-- 标题 -->
          <text class="item-title">{{ formatTitle(item.title) }}</text>
          <!-- 选中指示器 -->
          <view v-if="currentContent?.id === item.id" class="item-indicator">
            <text>▶</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 退出按钮 (长按) -->
    <view
      class="exit-area"
      @longpress="showExitConfirm"
      @touchstart="startExitTimer"
      @touchend="cancelExitTimer"
    >
      <view class="exit-hint">
        <text v-if="exitProgress > 0">{{ exitProgress }}%</text>
        <text v-else>长按 3 秒退出</text>
      </view>
    </view>

    <!-- 退出确认弹窗 -->
    <view v-if="showExitModal" class="exit-modal-overlay">
      <view class="exit-modal animate-scaleIn">
        <text class="modal-title">回答问题才能退出</text>
        <text class="modal-question">{{ mathQuestion.question }}</text>
        <view class="answer-options">
          <view
            v-for="opt in mathQuestion.options"
            :key="opt"
            class="answer-option"
            @tap="checkAnswer(opt)"
          >
            <text>{{ opt }}</text>
          </view>
        </view>
        <view class="modal-cancel" @tap="showExitModal = false">
          <text>继续观看</text>
        </view>
      </view>
    </view>

    <!-- 休息提醒 -->
    <view v-if="showRestReminder" class="rest-overlay">
      <view class="rest-modal animate-scaleIn">
        <view class="rest-animation">
          <text class="rest-emoji animate-bounce">😊</text>
        </view>
        <text class="rest-title">休息一下眼睛</text>
        <text class="rest-desc">闭上眼睛数到 10</text>
        <view class="rest-countdown">
          <text>{{ restCountdown }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useChildStore } from '@/stores/child'
import { useContentStore } from '@/stores/content'
import timeLimitManager from '@/utils/time-limit'
import type { PictureBook } from '@/api/content'

const childStore = useChildStore()
const contentStore = useContentStore()

// 状态
const currentContent = ref<PictureBook | null>(null)
const contentList = ref<PictureBook[]>([])
const remainingMinutes = ref(20)

// 退出相关
const showExitModal = ref(false)
const exitProgress = ref(0)
let exitTimer: number | null = null

// 数学题
const mathQuestion = ref({
  question: '2 + 3 = ?',
  answer: 5,
  options: [4, 5, 6, 7]
})

// 休息提醒
const showRestReminder = ref(false)
const restCountdown = ref(10)
let restTimer: number | null = null
let checkTimer: number | null = null

// 时间进度样式
const timeProgressStyle = computed(() => {
  const total = childStore.settings.session_limit_minutes
  const remaining = remainingMinutes.value
  const percent = (remaining / total) * 100
  const deg = (1 - remaining / total) * 360

  return {
    background: `conic-gradient(#FF6B6B ${deg}deg, rgba(255, 107, 107, 0.2) ${deg}deg)`
  }
})

function selectContent(item: PictureBook) {
  currentContent.value = item
}

function startPlay() {
  if (!currentContent.value) return

  const content = currentContent.value as any
  const type = content.content_type || 'picture_book'

  // 根据内容类型跳转到对应播放器
  const playerMap: Record<string, string> = {
    'picture_book': '/pages/play/picture-book',
    'nursery_rhyme': '/pages/play/nursery-rhyme',
    'video': '/pages/play/video'
  }

  const playerPath = playerMap[type] || '/pages/play/picture-book'

  uni.navigateTo({
    url: `${playerPath}?id=${content.id}&autoplay=1`
  })
}

// 根据内容类型返回不同的 emoji 图标
function getContentEmoji(item: any): string {
  const type = item.content_type || 'picture_book'
  const emojiMap: Record<string, string> = {
    'picture_book': '📖',
    'nursery_rhyme': '🎵',
    'video': '🎬'
  }
  return emojiMap[type] || '📖'
}

// 根据内容类型返回 CSS 类名
function getContentTypeClass(item: any): string {
  const type = item.content_type || 'picture_book'
  return `type-${type.replace('_', '-')}`
}

// 根据内容类型返回类型徽章文字
function getContentTypeBadge(item: any): string {
  const type = item.content_type || 'picture_book'
  const badgeMap: Record<string, string> = {
    'picture_book': '绘本',
    'nursery_rhyme': '儿歌',
    'video': '视频'
  }
  return badgeMap[type] || '绘本'
}

// 格式化标题，截取关键部分
function formatTitle(title: string): string {
  if (!title) return ''
  // 移除 "的" 前面的名字，保留主题
  const match = title.match(/的(.+)/)
  if (match && match[1].length > 2) {
    return match[1].slice(0, 6)
  }
  return title.slice(0, 6)
}

// 退出逻辑
function startExitTimer() {
  exitProgress.value = 0
  let count = 0

  exitTimer = setInterval(() => {
    count++
    exitProgress.value = Math.min(100, Math.round((count / 30) * 100))

    if (count >= 30) {
      cancelExitTimer()
      showExitConfirm()
    }
  }, 100)
}

function cancelExitTimer() {
  if (exitTimer) {
    clearInterval(exitTimer)
    exitTimer = null
  }
  exitProgress.value = 0
}

function showExitConfirm() {
  generateMathQuestion()
  showExitModal.value = true
}

function generateMathQuestion() {
  const a = Math.floor(Math.random() * 5) + 1
  const b = Math.floor(Math.random() * 5) + 1
  const answer = a + b

  const options = [answer]
  while (options.length < 4) {
    const opt = answer + Math.floor(Math.random() * 5) - 2
    if (opt > 0 && !options.includes(opt)) {
      options.push(opt)
    }
  }

  mathQuestion.value = {
    question: `${a} + ${b} = ?`,
    answer,
    options: options.sort(() => Math.random() - 0.5)
  }
}

function checkAnswer(opt: number) {
  if (opt === mathQuestion.value.answer) {
    showExitModal.value = false
    uni.navigateBack()
  } else {
    uni.showToast({ title: '再想想哦~', icon: 'none' })
    generateMathQuestion()
  }
}

// 时间检查
function checkTime() {
  const info = timeLimitManager.getRemainingInfo()
  remainingMinutes.value = info.sessionRemaining

  const result = timeLimitManager.checkLimits()

  if (result.exceeded) {
    // 时间到，强制退出
    uni.showToast({ title: result.message, icon: 'none' })
    setTimeout(() => uni.navigateBack(), 2000)
  } else if (result.reminder) {
    // 显示休息提醒
    showRestReminder.value = true
    restCountdown.value = 10
    startRestCountdown()
  }
}

function startRestCountdown() {
  restTimer = setInterval(() => {
    restCountdown.value--
    if (restCountdown.value <= 0) {
      clearInterval(restTimer!)
      showRestReminder.value = false
      timeLimitManager.resetReminder()
    }
  }, 1000)
}

async function loadContent() {
  try {
    await contentStore.fetchGeneratedList()
    contentList.value = contentStore.generatedList.slice(0, 6)
    if (contentList.value.length > 0) {
      currentContent.value = contentList.value[0]
    }
  } catch (e) {
    console.log('加载内容失败')
  }
}

onLoad((options) => {
  if (options?.contentId) {
    // 加载指定内容
    contentStore.fetchContentDetail(options.contentId).then(() => {
      currentContent.value = contentStore.currentContent
    })
  }

  timeLimitManager.startSession()
})

onMounted(() => {
  loadContent()
  checkTimer = setInterval(checkTime, 30000)
  checkTime()
})

onUnmounted(() => {
  if (checkTimer) clearInterval(checkTimer)
  if (restTimer) clearInterval(restTimer)
  cancelExitTimer()
  timeLimitManager.endSession()
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.child-mode-container {
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg, #FFE4D4 0%, #FFF9F0 50%, #E8F4F8 100%);
  overflow: hidden;
}

// 背景装饰
.bg-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  font-size: 40rpx;
  animation: twinkle 2s ease-in-out infinite;

  &.s1 { top: 15%; left: 10%; animation-delay: 0s; }
  &.s2 { top: 20%; right: 15%; animation-delay: 0.5s; }
  &.s3 { top: 10%; left: 50%; animation-delay: 1s; }
}

.cloud {
  position: absolute;
  font-size: 80rpx;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;

  &.c1 { top: 25%; left: -10%; animation-duration: 8s; }
  &.c2 { top: 15%; right: -5%; animation-delay: 2s; }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes float {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(30rpx); }
}

// 主内容区
.main-area {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx $spacing-lg 200rpx;
  min-height: 100vh;
}

// 时间显示
.time-display {
  margin-bottom: $spacing-xl;
}

.time-ring {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  padding: 16rpx;
}

.time-progress {
  position: absolute;
  inset: 0;
  border-radius: 50%;
}

.time-center {
  position: relative;
  width: 100%;
  height: 100%;
  background: $bg-card;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-md;
}

.time-value {
  font-size: 56rpx;
  font-weight: $font-bold;
  color: $primary;
  line-height: 1;
}

.time-label {
  font-size: $font-sm;
  color: $text-secondary;
}

// 内容卡片
.content-card {
  width: 100%;
  max-width: 500rpx;
  background: $bg-card;
  border-radius: $radius-xl;
  padding: $spacing-lg;
  box-shadow: $shadow-lg;
  text-align: center;
  margin-bottom: $spacing-lg;

  &:active {
    transform: scale(0.98);
  }
}

.card-cover {
  width: 100%;
  height: 300rpx;
  border-radius: $radius-lg;
  background: $gradient-warm;
  overflow: hidden;
  margin-bottom: $spacing-md;
  display: flex;
  align-items: center;
  justify-content: center;

  image {
    width: 100%;
    height: 100%;
  }

  .cover-emoji {
    font-size: 100rpx;
  }
}

.card-title {
  font-size: $font-lg;
  font-weight: $font-bold;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.play-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  background: $gradient-primary;
  border-radius: $radius-full;
  box-shadow: $shadow-button;

  text {
    font-size: $font-md;
    color: $text-white;
    font-weight: $font-semibold;
  }
}

// 空状态
.empty-state {
  text-align: center;
  padding: $spacing-xl;
}

.empty-emoji {
  display: block;
  font-size: 120rpx;
  margin-bottom: $spacing-md;
}

.empty-text {
  display: block;
  font-size: $font-lg;
  font-weight: $font-bold;
  color: $text-primary;
  margin-bottom: $spacing-xs;
}

.empty-hint {
  font-size: $font-base;
  color: $text-secondary;
}

// 素材库标题
.library-header {
  width: 100%;
  margin-top: $spacing-lg;
  margin-bottom: $spacing-sm;
  text-align: center;
}

.library-title {
  font-size: $font-md;
  font-weight: $font-bold;
  color: $text-secondary;
  letter-spacing: 2rpx;
}

// 内容列表 - 玩具盒子风格
.content-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24rpx;
  padding: 0 $spacing-sm;
  max-width: 650rpx;
}

.list-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180rpx;
  padding: 20rpx 16rpx 16rpx;
  background: $bg-card;
  border-radius: 32rpx;
  border: 4rpx solid transparent;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;

  // 绘本 - 珊瑚粉色系
  &.type-picture-book {
    background: linear-gradient(160deg, #FFF5F3 0%, #FFE8E3 100%);
    border-color: rgba(255, 138, 118, 0.3);

    .item-icon-wrap {
      background: linear-gradient(135deg, #FF8A76 0%, #FF6B6B 100%);
    }
    .item-badge {
      background: #FF8A76;
    }
  }

  // 儿歌 - 薄荷绿色系
  &.type-nursery-rhyme {
    background: linear-gradient(160deg, #F0FFF4 0%, #E0F5E9 100%);
    border-color: rgba(102, 187, 106, 0.3);

    .item-icon-wrap {
      background: linear-gradient(135deg, #81C784 0%, #66BB6A 100%);
    }
    .item-badge {
      background: #66BB6A;
    }
  }

  // 视频 - 琥珀金色系
  &.type-video {
    background: linear-gradient(160deg, #FFFBF0 0%, #FFF3E0 100%);
    border-color: rgba(255, 183, 77, 0.3);

    .item-icon-wrap {
      background: linear-gradient(135deg, #FFCA28 0%, #FFB74D 100%);
    }
    .item-badge {
      background: #FFB74D;
    }
  }

  // 选中状态 - 弹跳效果
  &.active {
    transform: scale(1.08) translateY(-8rpx);
    border-color: $primary;
    box-shadow:
      0 16rpx 40rpx rgba(255, 107, 107, 0.25),
      0 0 0 4rpx rgba(255, 107, 107, 0.15);

    .item-icon-wrap {
      animation: wiggle 0.6s ease-in-out;
    }

    .item-indicator {
      opacity: 1;
      transform: scale(1);
    }
  }

  &:active {
    transform: scale(0.95);
  }
}

// 类型徽章
.item-badge {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4rpx 16rpx;
  border-radius: 0 28rpx 0 16rpx;

  text {
    font-size: 18rpx;
    color: white;
    font-weight: $font-semibold;
  }
}

// 图标外包装（带阴影）
.item-icon-wrap {
  width: 100rpx;
  height: 100rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
  box-shadow:
    0 6rpx 16rpx rgba(0, 0, 0, 0.15),
    inset 0 2rpx 4rpx rgba(255, 255, 255, 0.4);
  transition: transform 0.3s ease;
}

// 内部图标
.item-icon {
  text {
    font-size: 52rpx;
    filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.2));
  }
}

// 标题
.item-title {
  font-size: 24rpx;
  font-weight: $font-semibold;
  color: $text-primary;
  text-align: center;
  line-height: 1.3;
  max-width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}

// 选中指示器
.item-indicator {
  position: absolute;
  bottom: -4rpx;
  left: 50%;
  transform: translateX(-50%) scale(0);
  width: 40rpx;
  height: 40rpx;
  background: $primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.4);

  text {
    font-size: 20rpx;
    color: white;
    margin-left: 4rpx;
  }
}

// 图标晃动动画
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-8deg); }
  40% { transform: rotate(8deg); }
  60% { transform: rotate(-4deg); }
  80% { transform: rotate(4deg); }
}

// 退出区域
.exit-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-lg;
  padding-bottom: calc(#{$spacing-lg} + env(safe-area-inset-bottom));
  text-align: center;
}

.exit-hint {
  display: inline-block;
  padding: $spacing-xs $spacing-md;
  background: rgba(0, 0, 0, 0.1);
  border-radius: $radius-full;

  text {
    font-size: $font-sm;
    color: $text-secondary;
  }
}

// 退出确认弹窗
.exit-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: $spacing-lg;
}

.exit-modal {
  width: 100%;
  max-width: 500rpx;
  background: $bg-card;
  border-radius: $radius-xl;
  padding: $spacing-xl $spacing-lg;
  text-align: center;
}

.modal-title {
  display: block;
  font-size: $font-lg;
  font-weight: $font-bold;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.modal-question {
  display: block;
  font-size: 72rpx;
  font-weight: $font-bold;
  color: $primary;
  margin-bottom: $spacing-lg;
}

.answer-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;
}

.answer-option {
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-base;
  border-radius: $radius-lg;
  border: 4rpx solid transparent;
  transition: all $duration-fast;

  &:active {
    border-color: $primary;
    background: rgba($primary, 0.1);
  }

  text {
    font-size: $font-xl;
    font-weight: $font-bold;
    color: $text-primary;
  }
}

.modal-cancel {
  padding: $spacing-sm;

  text {
    font-size: $font-base;
    color: $text-secondary;
  }
}

// 休息提醒
.rest-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.rest-modal {
  text-align: center;
  padding: $spacing-xl;
}

.rest-animation {
  margin-bottom: $spacing-lg;
}

.rest-emoji {
  font-size: 150rpx;
}

.rest-title {
  display: block;
  font-size: $font-xxl;
  font-weight: $font-bold;
  color: $text-white;
  margin-bottom: $spacing-sm;
}

.rest-desc {
  display: block;
  font-size: $font-lg;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: $spacing-lg;
}

.rest-countdown {
  width: 160rpx;
  height: 160rpx;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    font-size: 80rpx;
    font-weight: $font-bold;
    color: $text-white;
  }
}
</style>

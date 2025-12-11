<template>
  <view class="page-container">
    <NavBar title="学习报告" :show-back="true" />

    <scroll-view class="main-scroll" scroll-y>
      <!-- 总览卡片 -->
      <view class="overview-card animate-slideUp">
        <view class="overview-header">
          <text class="overview-title">{{ childName }} 的学习报告</text>
          <text class="overview-period">本周数据</text>
        </view>

        <view class="stats-grid">
          <view class="stat-item">
            <text class="stat-value">{{ stats.totalDuration }}</text>
            <text class="stat-label">总学习时长</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ stats.totalBooks }}</text>
            <text class="stat-label">阅读绘本</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ stats.streakDays }}</text>
            <text class="stat-label">连续打卡</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ stats.interactionRate }}%</text>
            <text class="stat-label">答题正确率</text>
          </view>
        </view>
      </view>

      <!-- 日历视图 -->
      <view class="section animate-slideUp delay-1">
        <view class="section-header">
          <text class="section-title">📅 学习日历</text>
        </view>
        <view class="calendar-card">
          <view class="calendar-week">
            <view
              v-for="day in weekDays"
              :key="day.date"
              class="calendar-day"
              :class="{ active: day.hasActivity, today: day.isToday }"
            >
              <text class="day-name">{{ day.name }}</text>
              <text class="day-icon">{{ day.hasActivity ? '✅' : '○' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 最常阅读主题 -->
      <view class="section animate-slideUp delay-2">
        <view class="section-header">
          <text class="section-title">🏆 最爱主题</text>
        </view>
        <view class="topics-card">
          <view
            v-for="(topic, index) in topTopics"
            :key="topic.name"
            class="topic-item"
          >
            <text class="topic-rank">{{ index + 1 }}</text>
            <text class="topic-icon">{{ topic.icon }}</text>
            <text class="topic-name">{{ topic.name }}</text>
            <text class="topic-count">{{ topic.count }}次</text>
          </view>
        </view>
      </view>

      <!-- 鼓励语 -->
      <view class="encourage-section animate-slideUp delay-3">
        <text class="encourage-icon">🌟</text>
        <text class="encourage-text">{{ encourageText }}</text>
      </view>

      <view class="safe-bottom"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useChildStore } from '@/stores/child'
import { getPlayStats } from '@/api/play'
import NavBar from '@/components/NavBar/NavBar.vue'

const childStore = useChildStore()

const childName = computed(() => childStore.currentChild?.name || '宝贝')

const stats = ref({
  totalDuration: '0分钟',
  totalBooks: 0,
  streakDays: 0,
  interactionRate: 0
})

const weekDays = ref([
  { name: '一', date: '', hasActivity: false, isToday: false },
  { name: '二', date: '', hasActivity: false, isToday: false },
  { name: '三', date: '', hasActivity: false, isToday: false },
  { name: '四', date: '', hasActivity: false, isToday: false },
  { name: '五', date: '', hasActivity: false, isToday: false },
  { name: '六', date: '', hasActivity: false, isToday: false },
  { name: '日', date: '', hasActivity: false, isToday: false }
])

const topTopics = ref([
  { name: '习惯养成', icon: '🌟', count: 5 },
  { name: '认知世界', icon: '🌍', count: 3 },
  { name: '情感社交', icon: '💝', count: 2 }
])

const encourageText = computed(() => {
  if (stats.value.streakDays >= 7) {
    return `太棒了！${childName.value}已经连续学习${stats.value.streakDays}天，继续保持！`
  } else if (stats.value.streakDays >= 3) {
    return `${childName.value}表现很棒，再坚持几天就能获得周徽章！`
  } else {
    return `每天学习一点点，${childName.value}会越来越棒！`
  }
})

async function loadStats() {
  if (!childStore.currentChild) return

  try {
    const res = await getPlayStats(childStore.currentChild.id)
    // 从答题统计中获取数据
    stats.value = {
      totalDuration: '30分钟', // 模拟数据，后续可从播放历史计算
      totalBooks: res.total_questions > 0 ? Math.ceil(res.total_questions / 3) : 0,
      streakDays: 3, // 模拟数据
      interactionRate: Math.round(res.accuracy_rate * 100)
    }
  } catch (e) {
    console.log('加载统计失败')
  }
}

function initWeekDays() {
  const today = new Date()
  const dayOfWeek = today.getDay() || 7 // 周日是0，转为7

  weekDays.value = weekDays.value.map((day, index) => {
    const diff = index + 1 - dayOfWeek
    const date = new Date(today)
    date.setDate(today.getDate() + diff)

    return {
      ...day,
      date: date.toISOString().split('T')[0],
      isToday: diff === 0,
      hasActivity: diff <= 0 && Math.random() > 0.3 // 模拟数据
    }
  })
}

onMounted(() => {
  initWeekDays()
  loadStats()
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page-container {
  min-height: 100vh;
  background: $gradient-warm;
  width: 750rpx;
  box-sizing: border-box;
  overflow-x: hidden;
}

.main-scroll {
  padding: $spacing-md;
  width: 750rpx;
  box-sizing: border-box;
}

.overview-card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;
  box-shadow: $shadow-lg;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.overview-title {
  font-size: $font-lg;
  font-weight: $font-bold;
  color: $text-primary;
}

.overview-period {
  font-size: $font-sm;
  color: $text-secondary;
  background: $bg-base;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-full;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
}

.stat-item {
  text-align: center;
  padding: $spacing-sm;
  background: $bg-base;
  border-radius: $radius-md;
}

.stat-value {
  display: block;
  font-size: $font-xl;
  font-weight: $font-bold;
  color: $primary;
  margin-bottom: $spacing-xs;
}

.stat-label {
  font-size: $font-sm;
  color: $text-secondary;
}

.section {
  margin-bottom: $spacing-lg;
}

.section-header {
  margin-bottom: $spacing-sm;
}

.section-title {
  font-size: $font-md;
  font-weight: $font-bold;
  color: $text-primary;
}

.calendar-card {
  background: $bg-card;
  border-radius: $radius-md;
  padding: $spacing-md;
}

.calendar-week {
  display: flex;
  justify-content: space-between;
}

.calendar-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm;
  border-radius: $radius-md;

  &.today {
    background: rgba($primary, 0.1);
  }

  &.active {
    .day-icon {
      color: $success;
    }
  }
}

.day-name {
  font-size: $font-sm;
  color: $text-secondary;
}

.day-icon {
  font-size: 28rpx;
  color: $text-light;
}

.topics-card {
  background: $bg-card;
  border-radius: $radius-md;
  padding: $spacing-sm;
}

.topic-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm;
  border-bottom: 1rpx solid $uni-border-color;

  &:last-child {
    border-bottom: none;
  }
}

.topic-rank {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gradient-primary;
  border-radius: 50%;
  font-size: $font-sm;
  font-weight: $font-bold;
  color: $text-white;
}

.topic-icon {
  font-size: 32rpx;
}

.topic-name {
  flex: 1;
  font-size: $font-base;
  color: $text-primary;
}

.topic-count {
  font-size: $font-sm;
  color: $text-secondary;
}

.encourage-section {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  background: rgba($accent, 0.2);
  border-radius: $radius-md;
}

.encourage-icon {
  font-size: 40rpx;
}

.encourage-text {
  flex: 1;
  font-size: $font-base;
  color: #8B7000;
  line-height: 1.5;
}

.safe-bottom {
  height: 100rpx;
}
</style>

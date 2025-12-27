<template>
  <div class="card p-0 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
    <!-- 封面图 -->
    <div class="relative aspect-video bg-gray-100">
      <img
        v-if="cover"
        :src="cover"
        :alt="content.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-4xl">
        {{ typeIcon }}
      </div>

      <!-- 类型角标 -->
      <span class="absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full bg-black/50 text-white">
        {{ typeLabel }}
      </span>

      <!-- 悬浮操作 -->
      <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
        <button
          @click.stop="$emit('play')"
          class="w-12 h-12 rounded-full bg-white text-gray-900 flex items-center justify-center hover:scale-110 transition-transform"
          title="播放"
        >
          <span class="text-xl">&#9654;</span>
        </button>
        <button
          @click.stop="$emit('delete')"
          class="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
          title="删除"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 信息 -->
    <div class="p-4">
      <h3 class="font-medium text-gray-900 truncate">{{ content.title }}</h3>
      <p class="text-sm text-gray-500 mt-1">{{ formatDate(content.created_at) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Content } from '@/api/types'

const props = defineProps<{
  content: Content
}>()

defineEmits<{
  play: []
  delete: []
}>()

const contentType = computed(() => {
  if ('pages' in props.content) return 'picture_book'
  if ('lyrics' in props.content) return 'nursery_rhyme'
  return 'video'
})

const cover = computed(() => {
  const c = props.content as any
  return c.cover_url || c.cover_thumb_url || c.suno_cover_url
})

const typeIcon = computed(() => {
  const icons: Record<string, string> = {
    picture_book: '📖',
    nursery_rhyme: '🎵',
    video: '🎬'
  }
  return icons[contentType.value]
})

const typeLabel = computed(() => {
  const labels: Record<string, string> = {
    picture_book: '绘本',
    nursery_rhyme: '儿歌',
    video: '视频'
  }
  return labels[contentType.value]
})

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  // 使用香港时区
  const hkDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' }))
  return `${hkDate.getMonth() + 1}月${hkDate.getDate()}日`
}
</script>

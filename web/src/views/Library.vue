<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">内容库</h1>
    </div>

    <!-- 筛选栏 -->
    <div class="flex flex-wrap gap-4">
      <div class="flex bg-gray-100 rounded-lg p-1">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="currentType = tab.value"
          class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
          :class="currentType === tab.value ? 'bg-white shadow text-primary-600' : 'text-gray-600 hover:text-gray-900'"
        >
          {{ tab.label }}
        </button>
      </div>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索标题..."
        class="input max-w-xs"
      />
    </div>

    <!-- 内容网格 -->
    <div v-if="loading" class="text-center py-12 text-gray-500">
      加载中...
    </div>

    <div v-else-if="filteredItems.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📭</div>
      <p class="text-gray-500">还没有内容，去小程序创作吧</p>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ContentCard
        v-for="item in filteredItems"
        :key="item.id"
        :content="item"
        @click="handlePlay(item)"
        @play="handlePlay(item)"
        @delete="handleDelete(item)"
      />
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore && !loading && filteredItems.length > 0" class="text-center">
      <button @click="loadMore" class="btn btn-primary" :disabled="loadingMore">
        {{ loadingMore ? '加载中...' : '加载更多' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ContentCard from '@/components/ContentCard.vue'
import { getContentList, deleteContent } from '@/api/content'
import type { Content } from '@/api/types'

const router = useRouter()

type ContentType = '' | 'picture_book' | 'nursery_rhyme' | 'video'

const tabs: Array<{ value: ContentType; label: string }> = [
  { value: '', label: '全部' },
  { value: 'picture_book', label: '绘本' },
  { value: 'nursery_rhyme', label: '儿歌' },
  { value: 'video', label: '视频' },
]

const currentType = ref<'' | 'picture_book' | 'nursery_rhyme' | 'video'>('')
const searchQuery = ref('')
const items = ref<Content[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(false)
const offset = ref(0)
const limit = 20

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  return items.value.filter(item =>
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

async function fetchItems(reset = false) {
  if (reset) {
    offset.value = 0
    items.value = []
  }

  loading.value = reset
  loadingMore.value = !reset

  try {
    const res = await getContentList({
      type: currentType.value || undefined,
      limit,
      offset: offset.value,
    })
    items.value = reset ? res.items : [...items.value, ...res.items]
    hasMore.value = res.has_more
    offset.value += res.items.length
  } catch (e) {
    console.error('获取内容列表失败:', e)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function loadMore() {
  fetchItems(false)
}

function handlePlay(item: Content) {
  const type = 'pages' in item ? 'picture-book' : 'lyrics' in item ? 'nursery-rhyme' : 'video'
  router.push(`/play/${type}/${item.id}`)
}

async function handleDelete(item: Content) {
  if (!confirm(`确定删除「${item.title}」吗？`)) return

  try {
    await deleteContent(item.id)
    items.value = items.value.filter(i => i.id !== item.id)
  } catch (e) {
    console.error('删除失败:', e)
    alert('删除失败')
  }
}

watch(currentType, () => fetchItems(true))

onMounted(() => fetchItems(true))
</script>

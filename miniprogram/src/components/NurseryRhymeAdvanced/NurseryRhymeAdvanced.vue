<template>
  <view class="advanced-settings">
    <view class="settings-header" @tap="toggleExpand">
      <view class="header-left">
        <text class="header-icon">⚙️</text>
        <text class="header-title">高级设置</text>
        <text class="header-hint">（可选）</text>
      </view>
      <view class="header-arrow" :class="{ expanded: isExpanded }">
        <text>›</text>
      </view>
    </view>

    <view v-if="isExpanded" class="settings-panels">
      <!-- 音乐风格面板 -->
      <view class="panel">
        <view class="panel-header" @tap="togglePanel('music')">
          <text class="panel-icon">🎵</text>
          <text class="panel-title">音乐风格</text>
          <text class="panel-arrow" :class="{ open: openPanels.music }">›</text>
        </view>
        <view v-if="openPanels.music" class="panel-content">
          <!-- 音乐流派 -->
          <view class="field-group">
            <text class="field-label">音乐流派</text>
            <text class="field-help">{{ getHelp('music_genre') }}</text>
            <scroll-view class="chips-scroll" scroll-x>
              <view class="chips-row">
                <view
                  v-for="group in musicGenres"
                  :key="group.group"
                  class="chip-group"
                >
                  <text class="group-label">{{ group.group }}</text>
                  <view class="group-chips">
                    <view
                      v-for="opt in group.options"
                      :key="opt.value"
                      class="chip"
                      :class="{ selected: params.music_genre?.includes(opt.value) }"
                      @tap="toggleArrayValue('music_genre', opt.value)"
                    >
                      {{ opt.label }}
                    </view>
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>

          <!-- 节奏速度 -->
          <view class="field-group">
            <view class="field-header">
              <text class="field-label">节奏速度</text>
              <text class="field-value">{{ params.tempo || 100 }} BPM · {{ tempoHint }}</text>
            </view>
            <text class="field-help">{{ getHelp('tempo') }}</text>
            <slider
              class="custom-slider"
              :value="params.tempo || 100"
              :min="60"
              :max="180"
              :step="5"
              activeColor="#FF6B6B"
              @change="(e: any) => updateParam('tempo', e.detail.value)"
            />
            <view class="slider-labels">
              <text>60</text>
              <text>极慢</text>
              <text>中速</text>
              <text>快速</text>
              <text>180</text>
            </view>
          </view>

          <!-- 能量强度 -->
          <view class="field-group">
            <view class="field-header">
              <text class="field-label">能量强度</text>
              <text class="field-value">{{ params.energy_level || 5 }} · {{ energyHint }}</text>
            </view>
            <text class="field-help">{{ getHelp('energy_level') }}</text>
            <slider
              class="custom-slider"
              :value="params.energy_level || 5"
              :min="1"
              :max="10"
              :step="1"
              activeColor="#4ECDC4"
              @change="(e: any) => updateParam('energy_level', e.detail.value)"
            />
            <view class="slider-labels">
              <text>静谧</text>
              <text>轻柔</text>
              <text>温和</text>
              <text>活力</text>
              <text>激昂</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 人声演唱面板 -->
      <view class="panel">
        <view class="panel-header" @tap="togglePanel('vocal')">
          <text class="panel-icon">🎤</text>
          <text class="panel-title">人声演唱</text>
          <text class="panel-arrow" :class="{ open: openPanels.vocal }">›</text>
        </view>
        <view v-if="openPanels.vocal" class="panel-content">
          <!-- 音域 -->
          <view class="field-group">
            <text class="field-label">音域选择</text>
            <view class="option-row">
              <view
                v-for="range in vocalRanges"
                :key="range.value"
                class="option-card small"
                :class="{ selected: params.vocal_range === range.value }"
                @tap="updateParam('vocal_range', range.value)"
              >
                <text class="opt-label">{{ range.label }}</text>
                <text class="opt-desc">{{ range.description }}</text>
              </view>
            </view>
          </view>

          <!-- 情感表达 -->
          <view class="field-group">
            <text class="field-label">情感表达</text>
            <view class="chips-wrap">
              <view
                v-for="emotion in vocalEmotions"
                :key="emotion.value"
                class="chip"
                :class="{ selected: params.vocal_emotion === emotion.value }"
                @tap="updateParam('vocal_emotion', emotion.value)"
              >
                {{ emotion.label }}
              </view>
            </view>
          </view>

          <!-- 演唱技巧 -->
          <view class="field-group">
            <text class="field-label">演唱技巧</text>
            <view class="chips-wrap">
              <view
                v-for="tech in vocalTechniques"
                :key="tech.value"
                class="chip"
                :class="{ selected: params.vocal_style?.includes(tech.value) }"
                @tap="toggleArrayValue('vocal_style', tech.value)"
              >
                {{ tech.label }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 乐器配置面板 -->
      <view class="panel">
        <view class="panel-header" @tap="togglePanel('instruments')">
          <text class="panel-icon">🎹</text>
          <text class="panel-title">乐器配置</text>
          <text class="panel-arrow" :class="{ open: openPanels.instruments }">›</text>
        </view>
        <view v-if="openPanels.instruments" class="panel-content">
          <scroll-view class="chips-scroll vertical" scroll-y style="max-height: 300rpx;">
            <view
              v-for="group in instrumentsByFamily"
              :key="group.group"
              class="chip-group"
            >
              <text class="group-label">{{ group.icon }} {{ group.group }}</text>
              <view class="chips-wrap">
                <view
                  v-for="inst in group.options"
                  :key="inst.value"
                  class="chip"
                  :class="{ selected: params.instruments?.includes(inst.value) }"
                  @tap="toggleArrayValue('instruments', inst.value)"
                >
                  {{ inst.label }}
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- 音效元素面板 -->
      <view class="panel">
        <view class="panel-header" @tap="togglePanel('effects')">
          <text class="panel-icon">🔊</text>
          <text class="panel-title">音效元素</text>
          <text class="panel-arrow" :class="{ open: openPanels.effects }">›</text>
        </view>
        <view v-if="openPanels.effects" class="panel-content">
          <scroll-view class="chips-scroll vertical" scroll-y style="max-height: 300rpx;">
            <view
              v-for="group in soundEffects"
              :key="group.group"
              class="chip-group"
            >
              <text class="group-label">{{ group.icon }} {{ group.group }}</text>
              <view class="chips-wrap">
                <view
                  v-for="effect in group.options"
                  :key="effect.value"
                  class="chip"
                  :class="{ selected: params.sound_effects?.includes(effect.value) }"
                  @tap="toggleArrayValue('sound_effects', effect.value)"
                >
                  {{ effect.label }}
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- 歌词设置面板 -->
      <view class="panel">
        <view class="panel-header" @tap="togglePanel('lyrics')">
          <text class="panel-icon">📝</text>
          <text class="panel-title">歌词设置</text>
          <text class="panel-arrow" :class="{ open: openPanels.lyrics }">›</text>
        </view>
        <view v-if="openPanels.lyrics" class="panel-content">
          <!-- 歌词复杂度 -->
          <view class="field-group">
            <view class="field-header">
              <text class="field-label">歌词复杂度</text>
              <text class="field-value">{{ lyricComplexityHint }}</text>
            </view>
            <text class="field-help">{{ getHelp('lyric_complexity') }}</text>
            <slider
              class="custom-slider"
              :value="params.lyric_complexity || 5"
              :min="1"
              :max="10"
              :step="1"
              activeColor="#9B59B6"
              @change="(e: any) => updateParam('lyric_complexity', e.detail.value)"
            />
          </view>

          <!-- 重复程度 -->
          <view class="field-group">
            <view class="field-header">
              <text class="field-label">重复程度</text>
              <text class="field-value">{{ repetitionHint }}</text>
            </view>
            <text class="field-help">{{ getHelp('repetition_level') }}</text>
            <slider
              class="custom-slider"
              :value="params.repetition_level || 6"
              :min="1"
              :max="10"
              :step="1"
              activeColor="#E74C3C"
              @change="(e: any) => updateParam('repetition_level', e.detail.value)"
            />
          </view>
        </view>
      </view>

      <!-- 歌曲结构面板 -->
      <view class="panel">
        <view class="panel-header" @tap="togglePanel('structure')">
          <text class="panel-icon">🎼</text>
          <text class="panel-title">歌曲结构</text>
          <text class="panel-arrow" :class="{ open: openPanels.structure }">›</text>
        </view>
        <view v-if="openPanels.structure" class="panel-content">
          <!-- 结构类型 -->
          <view class="field-group">
            <text class="field-label">结构类型</text>
            <view class="option-row wrap">
              <view
                v-for="structure in songStructures"
                :key="structure.value"
                class="option-card small"
                :class="{ selected: params.song_structure === structure.value }"
                @tap="updateParam('song_structure', structure.value)"
              >
                <text class="opt-label">{{ structure.label }}</text>
                <text class="opt-desc">{{ structure.description }}</text>
              </view>
            </view>
          </view>

          <!-- 动作指引 -->
          <view class="field-group">
            <text class="field-label">动作指引</text>
            <view class="chips-wrap">
              <view
                v-for="action in actionTypes"
                :key="action.value"
                class="chip"
                :class="{ selected: params.action_types?.includes(action.value) }"
                @tap="toggleArrayValue('action_types', action.value)"
              >
                {{ action.icon }} {{ action.label }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 语言文化面板 -->
      <view class="panel">
        <view class="panel-header" @tap="togglePanel('language')">
          <text class="panel-icon">🌍</text>
          <text class="panel-title">语言文化</text>
          <text class="panel-arrow" :class="{ open: openPanels.language }">›</text>
        </view>
        <view v-if="openPanels.language" class="panel-content">
          <!-- 语言 -->
          <view class="field-group">
            <text class="field-label">歌曲语言</text>
            <view class="chips-wrap">
              <view
                v-for="group in languages"
                :key="group.group"
                class="chip-group-inline"
              >
                <view
                  v-for="lang in group.options"
                  :key="lang.value"
                  class="chip"
                  :class="{ selected: params.language === lang.value }"
                  @tap="updateParam('language', lang.value)"
                >
                  {{ lang.label }}
                </view>
              </view>
            </view>
          </view>

          <!-- 文化风格 -->
          <view class="field-group">
            <text class="field-label">文化风格</text>
            <scroll-view class="chips-scroll vertical" scroll-y style="max-height: 240rpx;">
              <view
                v-for="group in culturalStyles"
                :key="group.group"
                class="chip-group"
              >
                <text class="group-label">{{ group.group }}</text>
                <view class="chips-wrap">
                  <view
                    v-for="style in group.options"
                    :key="style.value"
                    class="chip"
                    :class="{ selected: params.cultural_style === style.value }"
                    @tap="updateParam('cultural_style', style.value)"
                  >
                    {{ style.label }}
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>

      <!-- 个性化面板 -->
      <view class="panel">
        <view class="panel-header" @tap="togglePanel('personal')">
          <text class="panel-icon">✨</text>
          <text class="panel-title">个性化定制</text>
          <text class="panel-arrow" :class="{ open: openPanels.personal }">›</text>
        </view>
        <view v-if="openPanels.personal" class="panel-content">
          <!-- 教育目标 -->
          <view class="field-group">
            <text class="field-label">教育目标</text>
            <scroll-view class="chips-scroll vertical" scroll-y style="max-height: 200rpx;">
              <view
                v-for="group in educationalFocus"
                :key="group.group"
                class="chip-group"
              >
                <text class="group-label">{{ group.group }}</text>
                <view class="chips-wrap">
                  <view
                    v-for="focus in group.options"
                    :key="focus.value"
                    class="chip"
                    :class="{ selected: params.educational_focus?.includes(focus.value) }"
                    @tap="toggleArrayValue('educational_focus', focus.value)"
                  >
                    {{ focus.label }}
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>

          <!-- 喜欢的颜色 -->
          <view class="field-group">
            <text class="field-label">喜欢的颜色</text>
            <view class="chips-wrap">
              <view
                v-for="group in favoriteColors"
                :key="group.group"
                class="chip-group-inline"
              >
                <view
                  v-for="color in group.options"
                  :key="color.value"
                  class="chip color-chip"
                  :class="{ selected: params.favorite_colors?.includes(color.value) }"
                  @tap="toggleArrayValue('favorite_colors', color.value)"
                >
                  {{ color.icon }} {{ color.label }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- Suno 进阶面板 -->
      <view class="panel">
        <view class="panel-header" @tap="togglePanel('suno')">
          <text class="panel-icon">🎛️</text>
          <text class="panel-title">Suno 进阶</text>
          <text class="panel-arrow" :class="{ open: openPanels.suno }">›</text>
        </view>
        <view v-if="openPanels.suno" class="panel-content">
          <!-- 预设组合 -->
          <view class="field-group">
            <text class="field-label">预设组合</text>
            <view class="option-row">
              <view
                v-for="preset in sunoPresets"
                :key="preset.id"
                class="option-card"
                :class="{ selected: currentSunoPreset === preset.id }"
                @tap="applySunoPreset(preset)"
              >
                <text class="opt-icon">{{ preset.icon }}</text>
                <text class="opt-label">{{ preset.name }}</text>
                <text class="opt-desc">{{ preset.description }}</text>
              </view>
            </view>
          </view>

          <!-- 风格权重 -->
          <view class="field-group">
            <view class="field-header">
              <text class="field-label">风格权重</text>
              <text class="field-value">{{ Math.round((params.style_weight || 0.5) * 100) }}%</text>
            </view>
            <text class="field-help">{{ getHelp('style_weight') }}</text>
            <slider
              class="custom-slider"
              :value="(params.style_weight || 0.5) * 100"
              :min="0"
              :max="100"
              :step="5"
              activeColor="#3498DB"
              @change="(e: any) => updateParam('style_weight', e.detail.value / 100)"
            />
          </view>

          <!-- 创意程度 -->
          <view class="field-group">
            <view class="field-header">
              <text class="field-label">创意程度</text>
              <text class="field-value">{{ Math.round((params.creativity || 0.5) * 100) }}%</text>
            </view>
            <text class="field-help">{{ getHelp('creativity') }}</text>
            <slider
              class="custom-slider"
              :value="(params.creativity || 0.5) * 100"
              :min="0"
              :max="100"
              :step="5"
              activeColor="#E67E22"
              @change="(e: any) => updateParam('creativity', e.detail.value / 100)"
            />
          </view>

          <!-- 排除标签 -->
          <view class="field-group">
            <text class="field-label">排除风格</text>
            <view class="chips-wrap">
              <view
                v-for="tag in negativeTagOptions"
                :key="tag.value"
                class="chip negative"
                :class="{ selected: selectedNegativeTags.includes(tag.value) }"
                @tap="toggleNegativeTag(tag.value)"
              >
                {{ tag.label }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { GenerateNurseryRhymeParams } from '@/api/content'
import {
  MUSIC_GENRES,
  VOCAL_RANGES,
  VOCAL_EMOTIONS,
  VOCAL_TECHNIQUES,
  INSTRUMENTS_BY_FAMILY,
  SOUND_EFFECTS,
  SONG_STRUCTURES,
  ACTION_TYPES,
  LANGUAGES,
  CULTURAL_STYLES,
  FAVORITE_COLORS,
  EDUCATIONAL_FOCUS,
  SUNO_PRESETS,
  COMMON_NEGATIVE_TAGS,
  PARAM_HELP,
  getTempoHint,
  getEnergyHint,
  getLyricComplexityHint,
  getRepetitionHint
} from '@/config/nurseryRhymeConfig'

const props = defineProps<{
  modelValue: Partial<GenerateNurseryRhymeParams>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Partial<GenerateNurseryRhymeParams>): void
}>()

// 面板展开状态
const isExpanded = ref(false)
const openPanels = ref<Record<string, boolean>>({
  music: false,
  vocal: false,
  instruments: false,
  effects: false,
  lyrics: false,
  structure: false,
  language: false,
  personal: false,
  suno: false
})

// 配置数据
const musicGenres = MUSIC_GENRES
const vocalRanges = VOCAL_RANGES
const vocalEmotions = VOCAL_EMOTIONS
const vocalTechniques = VOCAL_TECHNIQUES
const instrumentsByFamily = INSTRUMENTS_BY_FAMILY
const soundEffects = SOUND_EFFECTS
const songStructures = SONG_STRUCTURES
const actionTypes = ACTION_TYPES
const languages = LANGUAGES
const culturalStyles = CULTURAL_STYLES
const favoriteColors = FAVORITE_COLORS
const educationalFocus = EDUCATIONAL_FOCUS
const sunoPresets = SUNO_PRESETS
const negativeTagOptions = COMMON_NEGATIVE_TAGS

// 当前参数
const params = computed(() => props.modelValue)

// 负向标签
const selectedNegativeTags = ref<string[]>([])
const currentSunoPreset = ref<string>('balanced')

// 计算属性
const tempoHint = computed(() => getTempoHint(params.value.tempo || 100))
const energyHint = computed(() => getEnergyHint(params.value.energy_level || 5))
const lyricComplexityHint = computed(() => getLyricComplexityHint(params.value.lyric_complexity || 5))
const repetitionHint = computed(() => getRepetitionHint(params.value.repetition_level || 6))

// 方法
function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

function togglePanel(panel: string) {
  openPanels.value[panel] = !openPanels.value[panel]
}

function getHelp(key: string): string {
  return PARAM_HELP[key] || ''
}

function updateParam(key: keyof GenerateNurseryRhymeParams, value: any) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  })
}

function toggleArrayValue(key: keyof GenerateNurseryRhymeParams, value: string) {
  const current = (props.modelValue[key] as string[]) || []
  const index = current.indexOf(value)
  let newArray: string[]

  if (index > -1) {
    newArray = current.filter(v => v !== value)
  } else {
    newArray = [...current, value]
  }

  emit('update:modelValue', {
    ...props.modelValue,
    [key]: newArray
  })
}

function applySunoPreset(preset: typeof SUNO_PRESETS[0]) {
  currentSunoPreset.value = preset.id
  emit('update:modelValue', {
    ...props.modelValue,
    style_weight: preset.style_weight,
    creativity: preset.creativity
  })
}

function toggleNegativeTag(tag: string) {
  const index = selectedNegativeTags.value.indexOf(tag)
  if (index > -1) {
    selectedNegativeTags.value.splice(index, 1)
  } else {
    selectedNegativeTags.value.push(tag)
  }
  // 更新负向标签字符串
  updateParam('negative_tags', selectedNegativeTags.value.join(', '))
}

// 监听外部参数变化同步负向标签
watch(() => props.modelValue.negative_tags, (val) => {
  if (val) {
    selectedNegativeTags.value = val.split(',').map(s => s.trim()).filter(Boolean)
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.advanced-settings {
  margin: 24rpx 0;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 24rpx;
  overflow: hidden;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 32rpx;
  background: rgba(255, 255, 255, 0.05);

  .header-left {
    display: flex;
    align-items: center;
    gap: 12rpx;
  }

  .header-icon {
    font-size: 36rpx;
  }

  .header-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #fff;
  }

  .header-hint {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.5);
  }

  .header-arrow {
    font-size: 36rpx;
    color: rgba(255, 255, 255, 0.6);
    transition: transform 0.3s;
    transform: rotate(90deg);

    &.expanded {
      transform: rotate(-90deg);
    }
  }
}

.settings-panels {
  padding: 16rpx;
}

.panel {
  margin-bottom: 16rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16rpx;
  overflow: hidden;

  &:last-child {
    margin-bottom: 0;
  }
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 24rpx;
  gap: 12rpx;

  .panel-icon {
    font-size: 32rpx;
  }

  .panel-title {
    flex: 1;
    font-size: 28rpx;
    color: #fff;
  }

  .panel-arrow {
    font-size: 32rpx;
    color: rgba(255, 255, 255, 0.5);
    transition: transform 0.2s;
    transform: rotate(90deg);

    &.open {
      transform: rotate(-90deg);
    }
  }
}

.panel-content {
  padding: 0 24rpx 24rpx;
}

.field-group {
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.field-label {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8rpx;
  display: block;
}

.field-value {
  font-size: 24rpx;
  color: #4ECDC4;
}

.field-help {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 12rpx;
  display: block;
}

.chips-scroll {
  white-space: nowrap;

  &.vertical {
    white-space: normal;
  }
}

.chips-row {
  display: inline-flex;
  gap: 24rpx;
}

.chip-group {
  margin-bottom: 16rpx;

  .group-label {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 8rpx;
    display: block;
  }

  .group-chips {
    display: inline-flex;
    gap: 12rpx;
    flex-wrap: wrap;
  }
}

.chip-group-inline {
  display: inline;
}

.chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 12rpx 20rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s;

  &.selected {
    background: linear-gradient(135deg, #FF6B6B, #FF8E53);
    color: #fff;
  }

  &.negative {
    background: rgba(231, 76, 60, 0.2);
    border: 1rpx solid rgba(231, 76, 60, 0.3);

    &.selected {
      background: #E74C3C;
      border-color: #E74C3C;
    }
  }

  &.color-chip {
    gap: 6rpx;
  }
}

.option-row {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;

  &.wrap {
    flex-wrap: wrap;
  }
}

.option-card {
  flex: 1;
  min-width: 140rpx;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16rpx;
  text-align: center;
  transition: all 0.2s;

  &.small {
    min-width: 120rpx;
    padding: 16rpx;
  }

  &.selected {
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(255, 142, 83, 0.3));
    border: 2rpx solid #FF6B6B;
  }

  .opt-icon {
    font-size: 36rpx;
    display: block;
    margin-bottom: 8rpx;
  }

  .opt-label {
    font-size: 24rpx;
    color: #fff;
    display: block;
  }

  .opt-desc {
    font-size: 20rpx;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 4rpx;
    display: block;
  }
}

.custom-slider {
  margin: 16rpx 0;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
  padding: 0 8rpx;
}
</style>

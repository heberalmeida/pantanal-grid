<template>
  <div
    class="pg pg-row"
    :class="tailwind ? 'flex flex-wrap items-center justify-center gap-1 sm:gap-2' : ''"
    :dir="rtl ? 'rtl' : undefined"
    style="flex-wrap: wrap; justify-content: center;"
  >
    <!-- Custom template slot (before) -->
    <slot name="before" :context="paginationContext" />
    
    <!-- Custom template -->
    <div v-if="customTemplate" v-html="renderCustomTemplate()"></div>
    
    <!-- Default pagination (if no custom template) -->
    <template v-else>
      <!-- seletor de page size -->
      <div
        v-if="showPageSize"
        class="pg-row"
        :class="tailwind ? 'flex items-center gap-1 sm:gap-2 flex-shrink-0' : ''"
        style="flex: 0 0 auto;"
      >
        <label class="pg-label" :class="tailwind ? 'text-xs sm:text-sm whitespace-nowrap' : ''">{{ M.rowsPerPage }}</label>
        <select
          v-if="!showCustomPageSize"
          class="pg-select"
          :class="tailwind ? 'border border-slate-300 rounded-md bg-white text-xs sm:text-sm px-1 sm:px-2 py-1 min-w-[50px] sm:min-w-[60px]' : ''"
          :value="isCustomPageSize ? 'custom' : (modelPageSize === total && pageSizeOptions?.includes('all') ? 'all' : modelPageSize)"
          @change="handlePageSizeChange(($event.target as HTMLSelectElement).value)"
          style="flex-shrink: 0;"
        >
          <option v-for="n in pageSizeOptions" :key="n" :value="n">
            {{ n === 'all' ? (M.pageableAllPages || 'All') : n }}
          </option>
          <option v-if="customPageSize" value="custom">{{ M.pageableCustom || 'Custom' }}</option>
        </select>
        <div v-else :class="tailwind ? 'flex items-center gap-1' : ''" style="display: flex; align-items: center; gap: 0.25rem;">
          <input
            type="number"
            :min="1"
            :max="10000"
            :value="customPageSizeValue"
            @input="customPageSizeValue = ($event.target as HTMLInputElement).value"
            @keydown.enter="handleCustomPageSize"
            @blur="handleCustomPageSize"
            :class="tailwind ? 'border border-slate-300 rounded-md bg-white text-xs sm:text-sm px-1 sm:px-2 py-1 w-16 sm:w-20 text-center' : 'pg-input'"
            style="flex-shrink: 0;"
          />
          <button
            @click="showCustomPageSize = false; customPageSizeValue = String(modelPageSize)"
            :class="tailwind ? 'px-1.5 py-1 text-xs border border-slate-300 rounded-md bg-white hover:bg-slate-50' : ''"
            :title="M.pageableCancel || 'Cancel'"
            style="flex-shrink: 0;"
          >
            ×
          </button>
        </div>
      </div>

      <!-- variant: simple -->
      <div
        v-if="activeVariant==='simple' && !numeric"
        class="pg-row"
        :class="tailwind ? 'flex items-center gap-0.5 sm:gap-1 flex-wrap justify-center' : ''"
        style="flex-wrap: wrap; justify-content: center;"
      >
        <!-- First button (if previousNext) -->
        <button 
          v-if="previousNext"
          :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
          :disabled="modelPage<=1" 
          @click="goToPage(1)"
          :aria-label="M.pageableFirst || 'First'"
          :title="M.pageableFirst || 'First'"
          style="flex-shrink: 0;"
        >
          <img v-if="showIcons" :src="iconFirst" :class="[iconClass, tailwind && iconTW]" alt="first" />
        </button>

        <button 
          :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
          :disabled="modelPage<=1" 
          @click="goToPage(modelPage-1)"
          style="flex-shrink: 0;"
        >
          <img v-if="showIcons" :src="iconPrev" :class="[iconClass, tailwind && iconTW]" alt="prev" />
          <span v-if="showText" :class="tailwind ? 'hidden sm:inline' : ''">{{ M.pageablePrevious || M.previous }}</span>
        </button>

        <!-- Page input (if input is enabled) -->
        <template v-if="input">
          <label :class="tailwind ? 'text-xs sm:text-sm whitespace-nowrap' : ''">{{ M.pageablePage || M.page }}:</label>
          <input
            type="number"
            :min="1"
            :max="totalPages"
            :value="modelPage"
            @input="pageInputValue = ($event.target as HTMLInputElement).value"
            @keydown.enter="handlePageInput"
            @blur="handlePageInput"
            :class="tailwind ? 'border border-slate-300 rounded-md bg-white text-xs sm:text-sm px-1 sm:px-2 py-1 w-12 sm:w-16 text-center flex-shrink-0' : 'pg-input'"
            style="flex-shrink: 0;"
          />
          <span v-if="M.pageableOf" :class="tailwind ? 'text-xs sm:text-sm whitespace-nowrap' : ''">{{ formatOfMessage(M.pageableOf) }}</span>
        </template>

        <button 
          :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
          :disabled="modelPage>=totalPages" 
          @click="goToPage(modelPage+1)"
          style="flex-shrink: 0;"
        >
          <span v-if="showText" :class="tailwind ? 'hidden sm:inline' : ''">{{ M.pageableNext || M.next }}</span>
          <img v-if="showIcons" :src="iconNext" :class="[iconClass, tailwind && iconTW]" alt="next" />
        </button>

        <!-- Last button (if previousNext) -->
        <button 
          v-if="previousNext"
          :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
          :disabled="modelPage>=totalPages" 
          @click="goToPage(totalPages)"
          :aria-label="M.pageableLast || 'Last'"
          :title="M.pageableLast || 'Last'"
          style="flex-shrink: 0;"
        >
          <img v-if="showIcons" :src="iconLast" :class="[iconClass, tailwind && iconTW]" alt="last" />
        </button>

        <!-- Refresh button (if refresh is enabled) -->
        <button 
          v-if="refresh"
          :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
          @click="handleRefresh"
          :aria-label="M.pageableRefresh || 'Refresh'"
          :title="M.pageableRefresh || 'Refresh'"
          style="flex-shrink: 0;"
        >
          <span v-if="showText" :class="tailwind ? 'hidden sm:inline' : ''">{{ M.pageableRefresh || 'Refresh' }}</span>
        </button>
      </div>

      <!-- variant: pages (1 2 3 ...) -->
      <div
        v-else-if="numeric || activeVariant==='pages'"
        class="pg-row"
        :class="tailwind ? 'flex items-center gap-0.5 sm:gap-1 flex-wrap justify-center' : ''"
        style="flex-wrap: wrap; justify-content: center;"
      >
        <!-- First button (if previousNext) -->
        <button
          v-if="previousNext"
          :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
          :disabled="modelPage<=1"
          @click="goToPage(1)"
          :aria-label="M.pageableFirst || 'First'"
          :title="M.pageableFirst || 'First'"
          style="flex-shrink: 0;"
        >
          <img v-if="showIcons" :src="iconFirst" :class="[iconClass, tailwind && iconTW]" alt="first" />
        </button>

        <button
          :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
          :disabled="modelPage<=1"
          @click="goToPage(modelPage-1)"
          :aria-label="M.pageablePrevious || M.previous"
          :title="M.pageablePrevious || M.previous"
          style="flex-shrink: 0;"
        >
          <img v-if="showIcons" :src="iconPrev" :class="[iconClass, tailwind && iconTW]" alt="prev" />
          <span v-if="showText" :class="tailwind ? 'hidden sm:inline' : ''">{{ M.pageablePrevious || M.previous }}</span>
        </button>

        <!-- Ellipsis before pages -->
        <span v-if="showEllipsis && pages[0] > 1" :class="tailwind ? 'px-1 sm:px-2 text-slate-600 text-xs sm:text-sm flex-shrink-0' : ''" style="flex-shrink: 0;">
          <button
            v-if="buttonCount && pages[0] > 2"
            :class="[btnClass, tailwind && btnTW, tailwind && 'px-1 sm:px-2 py-1 text-xs sm:text-sm']"
            :aria-label="M.pageableMorePages || 'More pages'"
            :title="M.pageableMorePages || 'More pages'"
            @click="goToPage(Math.max(1, pages[0] - buttonCount))"
          >
            ...
          </button>
          <span v-else>...</span>
        </span>

        <button
          v-for="p in pages"
          :key="p"
          class="pg-pill"
          :class="[
            pillSize,
            { 'is-active': p===modelPage },
            tailwind && 'inline-flex items-center justify-center border rounded-md flex-shrink-0',
            tailwind && 'px-2 sm:px-3 py-1 text-xs sm:text-sm min-w-[28px] sm:min-w-[32px]',
            tailwind && (p===modelPage ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-slate-300 hover:bg-slate-50')
          ]"
          @click="goToPage(p)"
          style="flex-shrink: 0;"
        >
          {{ p }}
        </button>

        <!-- Ellipsis after pages -->
        <span v-if="showEllipsis && pages[pages.length - 1] < totalPages" :class="tailwind ? 'px-1 sm:px-2 text-slate-600 text-xs sm:text-sm flex-shrink-0' : ''" style="flex-shrink: 0;">
          <button
            v-if="buttonCount && pages[pages.length - 1] < totalPages - 1"
            :class="[btnClass, tailwind && btnTW, tailwind && 'px-1 sm:px-2 py-1 text-xs sm:text-sm']"
            :aria-label="M.pageableMorePages || 'More pages'"
            :title="M.pageableMorePages || 'More pages'"
            @click="goToPage(Math.min(totalPages, pages[pages.length - 1] + buttonCount + 1))"
          >
            ...
          </button>
          <span v-else>...</span>
        </span>

        <button
          :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
          :disabled="modelPage>=totalPages"
          @click="goToPage(modelPage+1)"
          :aria-label="M.pageableNext || M.next"
          :title="M.pageableNext || M.next"
          style="flex-shrink: 0;"
        >
          <span v-if="showText" :class="tailwind ? 'hidden sm:inline' : ''">{{ M.pageableNext || M.next }}</span>
          <img v-if="showIcons" :src="iconNext" :class="[iconClass, tailwind && iconTW]" alt="next" />
        </button>

        <!-- Last button (if previousNext) -->
        <button
          v-if="previousNext"
          :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
          :disabled="modelPage>=totalPages"
          @click="goToPage(totalPages)"
          :aria-label="M.pageableLast || 'Last'"
          :title="M.pageableLast || 'Last'"
          style="flex-shrink: 0;"
        >
          <img v-if="showIcons" :src="iconLast" :class="[iconClass, tailwind && iconTW]" alt="last" />
        </button>

        <!-- Refresh button (if refresh is enabled) -->
        <button 
          v-if="refresh"
          :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
          @click="handleRefresh"
          :aria-label="M.pageableRefresh || 'Refresh'"
          :title="M.pageableRefresh || 'Refresh'"
          style="flex-shrink: 0;"
        >
          <span v-if="showText" :class="tailwind ? 'hidden sm:inline' : ''">{{ M.pageableRefresh || 'Refresh' }}</span>
        </button>
      </div>

      <!-- variant: edges (<< < 1 2 3 > >>) -->
      <div
        v-else-if="activeVariant==='edges'"
        class="pg-row"
        :class="tailwind ? 'flex items-center gap-0.5 sm:gap-1 flex-wrap justify-center' : ''"
        style="flex-wrap: wrap; justify-content: center;"
      >
        <button 
          v-if="previousNext"
          :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
          :disabled="modelPage<=1" 
          @click="goToPage(1)" 
          :aria-label="M.pageableFirst || 'First'"
          :title="M.pageableFirst || 'First'"
          style="flex-shrink: 0;"
        >
          <img v-if="showIcons" :src="iconFirst" :class="[iconClass, tailwind && iconTW]" alt="first" />
        </button>

        <button
          :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
          :disabled="modelPage<=1"
          @click="goToPage(modelPage-1)"
          :aria-label="M.pageablePrevious || M.previous"
          :title="M.pageablePrevious || M.previous"
          style="flex-shrink: 0;"
        >
          <img v-if="showIcons" :src="iconPrev" :class="[iconClass, tailwind && iconTW]" alt="prev" />
          <span v-if="showText" :class="tailwind ? 'hidden sm:inline' : ''">{{ M.pageablePrevious || M.previous }}</span>
        </button>

        <button
          v-for="p in pages"
          :key="p"
          class="pg-pill"
          :class="[
            pillSize,
            { 'is-active': p===modelPage },
            tailwind && 'inline-flex items-center justify-center border rounded-md flex-shrink-0',
            tailwind && 'px-2 sm:px-3 py-1 text-xs sm:text-sm min-w-[28px] sm:min-w-[32px]',
            tailwind && (p===modelPage ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-slate-300 hover:bg-slate-50')
          ]"
          @click="goToPage(p)"
          style="flex-shrink: 0;"
        >
          {{ p }}
        </button>

        <button
          :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
          :disabled="modelPage>=totalPages"
          @click="goToPage(modelPage+1)"
          :aria-label="M.pageableNext || M.next"
          :title="M.pageableNext || M.next"
          style="flex-shrink: 0;"
        >
          <span v-if="showText" :class="tailwind ? 'hidden sm:inline' : ''">{{ M.pageableNext || M.next }}</span>
          <img v-if="showIcons" :src="iconNext" :class="[iconClass, tailwind && iconTW]" alt="next" />
        </button>

        <button
          v-if="previousNext"
          :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
          :disabled="modelPage>=totalPages"
          @click="goToPage(totalPages)"
          :aria-label="M.pageableLast || 'Last'"
          :title="M.pageableLast || 'Last'"
          style="flex-shrink: 0;"
        >
          <img v-if="showIcons" :src="iconLast" :class="[iconClass, tailwind && iconTW]" alt="last" />
        </button>

        <!-- Refresh button (if refresh is enabled) -->
        <button 
          v-if="refresh"
          :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
          @click="handleRefresh"
          :aria-label="M.pageableRefresh || 'Refresh'"
          :title="M.pageableRefresh || 'Refresh'"
          style="flex-shrink: 0;"
        >
          <span v-if="showText" :class="tailwind ? 'hidden sm:inline' : ''">{{ M.pageableRefresh || 'Refresh' }}</span>
        </button>
      </div>
    </template>

    <!-- Custom template slot (after) -->
    <slot name="after" :context="paginationContext" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { getMessages } from '../i18n/messages'
import type { Messages, Locale } from '../types'

// Import icons
import iconFirstSrc from '../assets/arrow-right.svg?url'
import iconPrevSrc from '../assets/arrow-right.svg?url'
import iconNextSrc from '../assets/arrow-right.svg?url'
import iconLastSrc from '../assets/arrow-right.svg?url'

const iconFirst = iconFirstSrc
const iconPrev = iconPrevSrc
const iconNext = iconNextSrc
const iconLast = iconLastSrc

const props = withDefaults(defineProps<{
  page: number
  pageSize: number
  total: number
  variant?: 'simple' | 'pages' | 'edges'
  showText?: boolean
  showIcons?: boolean
  showTotal?: boolean
  maxPages?: number
  locale?: Locale | string
  messages?: Partial<Messages>
  rtl?: boolean
  previousNext?: boolean
  customPageSize?: boolean
  numeric?: boolean
  buttonCount?: number
  input?: boolean
  refresh?: boolean
  responsive?: boolean
  info?: boolean
  template?: string | ((context: any) => string)
  mobileBreakpoint?: number
  mobileVariant?: 'simple' | 'pages' | 'edges'
  pageSizeOptions?: (number | 'all')[]
  tailwind?: boolean
}>(), {
  variant: 'simple',
  showText: true,
  showIcons: true,
  showTotal: false,
  maxPages: 5,
  locale: 'en',
  previousNext: true,
  customPageSize: false,
  numeric: false,
  buttonCount: 5,
  input: false,
  refresh: false,
  responsive: true,
  info: false,
  tailwind: true,
  pageSizeOptions: () => [10, 20, 50, 100],
  mobileBreakpoint: 768,
})

const emit = defineEmits<{
  (e: 'update:page', v: number): void
  (e: 'update:pageSize', v: number): void
  (e: 'refresh'): void
}>()

// Internal model - always sync with props
const modelPage = computed({
  get: () => props.page,
  set: (v) => emit('update:page', v)
})

const modelPageSize = computed({
  get: () => props.pageSize,
  set: (v) => emit('update:pageSize', v)
})

const M = computed(() => getMessages(String(props.locale), props.messages))

const totalPages = computed(() =>
  Math.max(1, Math.ceil((props.total || 0) / Math.max(1, modelPageSize.value)))
)

// Mobile detection
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)
const isMobile = computed(() => {
  if (!props.responsive || !props.mobileBreakpoint) return false
  return windowWidth.value < props.mobileBreakpoint
})

const activeVariant = computed(() => {
  if (isMobile.value && props.mobileVariant) {
    return props.mobileVariant
  }
  return props.variant
})

const pages = computed(() => {
  const max = Math.max(1, props.buttonCount ?? props.maxPages!)
  const tp = totalPages.value
  const cur = Math.min(tp, Math.max(1, modelPage.value))
  const half = Math.floor(max / 2)
  let start = Math.max(1, cur - half)
  let end = Math.min(tp, start + max - 1)
  start = Math.max(1, end - max + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const showEllipsis = computed(() => {
  if (!props.numeric && activeVariant.value !== 'pages' && activeVariant.value !== 'edges') return false
  const tp = totalPages.value
  const pagesList = pages.value
  return pagesList.length > 0 && (pagesList[0] > 1 || pagesList[pagesList.length - 1] < tp)
})

const pageInputValue = ref<string>('')
const showCustomPageSize = ref(false)
const customPageSizeValue = ref<string>('')

const isCustomPageSize = computed(() => {
  if (Array.isArray(props.pageSizeOptions)) {
    return !props.pageSizeOptions.some(n => {
      const val = typeof n === 'string' && n === 'all' ? props.total : (typeof n === 'number' ? n : Number(n))
      return val === modelPageSize.value
    })
  }
  return false
})

// Button classes
const btnClass = 'pg-btn'
const btnTW = 'border border-slate-300 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'
const iconClass = 'pg-icon'
const iconTW = 'w-3 h-3 sm:w-4 sm:h-4'
const pillSize = 'pg-pill-size'

function goToPage(p: number) {
  const next = Math.min(totalPages.value, Math.max(1, p))
  if (next !== modelPage.value) {
    modelPage.value = next
  }
}

function handlePageInput() {
  const num = parseInt(pageInputValue.value, 10)
  if (!Number.isNaN(num) && num >= 1 && num <= totalPages.value) {
    modelPage.value = num
  } else {
    pageInputValue.value = String(modelPage.value)
  }
}

function handlePageSizeChange(v: string) {
  if (v === 'custom') {
    showCustomPageSize.value = true
    customPageSizeValue.value = String(modelPageSize.value)
    return
  }
  if (v === 'all') {
    modelPageSize.value = props.total
    return
  }
  const n = Number(v)
  if (!Number.isNaN(n) && n > 0) {
    modelPageSize.value = n
  }
}

function handleCustomPageSize() {
  const num = parseInt(customPageSizeValue.value, 10)
  if (!Number.isNaN(num) && num > 0 && num <= 10000) {
    modelPageSize.value = num
    showCustomPageSize.value = false
  } else {
    customPageSizeValue.value = String(modelPageSize.value)
    showCustomPageSize.value = false
  }
}

function handleRefresh() {
  emit('refresh')
}

function formatOfMessage(template: string): string {
  if (!template) return ''
  return template.replace('{0}', String(totalPages.value))
}

// Custom template rendering
const customTemplate = computed(() => props.template)
function renderCustomTemplate(): string {
  if (!customTemplate.value) return ''
  if (typeof customTemplate.value === 'function') {
    return customTemplate.value(paginationContext.value)
  }
  return customTemplate.value
}

const paginationContext = computed(() => ({
  page: modelPage.value,
  pageSize: modelPageSize.value,
  total: props.total,
  totalPages: totalPages.value,
  firstItem: props.total > 0 ? (modelPage.value - 1) * modelPageSize.value + 1 : 0,
  lastItem: Math.min(modelPage.value * modelPageSize.value, props.total),
  canGoPrevious: modelPage.value > 1,
  canGoNext: modelPage.value < totalPages.value,
  canGoFirst: modelPage.value > 1,
  canGoLast: modelPage.value < totalPages.value,
  messages: M.value,
}))

// Window resize handler
let resizeHandler: (() => void) | null = null
onMounted(() => {
  if (typeof window !== 'undefined') {
    resizeHandler = () => {
      windowWidth.value = window.innerWidth
    }
    window.addEventListener('resize', resizeHandler)
  }
  // Initialize pageInputValue
  pageInputValue.value = String(modelPage.value)
})

onBeforeUnmount(() => {
  if (resizeHandler && typeof window !== 'undefined') {
    window.removeEventListener('resize', resizeHandler)
  }
})

// Watch page changes to sync pageInputValue
watch(() => modelPage.value, (v) => {
  pageInputValue.value = String(v)
})
</script>


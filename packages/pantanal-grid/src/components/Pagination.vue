<template>
  <div
    class="pg pg-row"
    :class="tailwind ? 'flex flex-wrap items-center justify-center gap-1 sm:gap-2' : ''"
    :dir="rtl ? 'rtl' : undefined"
    style="flex-wrap: wrap; justify-content: center;"
  >
    <!-- Info display (pageableInfo) - only show if not already shown in Grid footer -->
    <!-- This is handled in Grid.vue footer, so we don't show it here to avoid duplication -->

    <!-- seletor de page size -->
    <div
      v-if="showPageSize"
      class="pg-row"
      :class="tailwind ? 'flex items-center gap-1 sm:gap-2 flex-shrink-0' : ''"
      style="flex: 0 0 auto;"
    >
      <label class="pg-label" :class="tailwind ? 'text-xs sm:text-sm whitespace-nowrap' : ''">{{ M.rowsPerPage }}</label>
      <select
        class="pg-select"
        :class="tailwind ? 'border border-slate-300 rounded-md bg-white text-xs sm:text-sm px-1 sm:px-2 py-1 min-w-[50px] sm:min-w-[60px]' : ''"
        :value="pageSize"
        @change="changeSize(($event.target as HTMLSelectElement).value)"
        style="flex-shrink: 0;"
      >
        <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>

    <!-- variant: simple -->
    <div
      v-if="variant==='simple'"
      class="pg-row"
      :class="tailwind ? 'flex items-center gap-0.5 sm:gap-1 flex-wrap justify-center' : ''"
      style="flex-wrap: wrap; justify-content: center;"
    >
      <!-- First button (if previousNext) -->
      <button 
        v-if="previousNext"
        :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
        :disabled="page<=1" 
        @click="go(1)"
        :aria-label="M.pageableFirst || 'First'"
        :title="M.pageableFirst || 'First'"
        style="flex-shrink: 0;"
      >
        <img v-if="showIcons" :src="iconFirst" :class="[iconClass, tailwind && iconTW]" alt="first" />
      </button>

      <button 
        :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
        :disabled="page<=1" 
        @click="go(page-1)"
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
          :value="page"
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
        :disabled="page>=totalPages" 
        @click="go(page+1)"
        style="flex-shrink: 0;"
      >
        <span v-if="showText" :class="tailwind ? 'hidden sm:inline' : ''">{{ M.pageableNext || M.next }}</span>
        <img v-if="showIcons" :src="iconNext" :class="[iconClass, tailwind && iconTW]" alt="next" />
      </button>

      <!-- Last button (if previousNext) -->
      <button 
        v-if="previousNext"
        :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
        :disabled="page>=totalPages" 
        @click="go(totalPages)"
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
      v-else-if="numeric || variant==='pages'"
      class="pg-row"
      :class="tailwind ? 'flex items-center gap-0.5 sm:gap-1 flex-wrap justify-center' : ''"
      style="flex-wrap: wrap; justify-content: center;"
    >
      <!-- First button (if previousNext) -->
      <button
        v-if="previousNext"
        :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
        :disabled="page<=1"
        @click="go(1)"
        :aria-label="M.pageableFirst || 'First'"
        :title="M.pageableFirst || 'First'"
        style="flex-shrink: 0;"
      >
        <img v-if="showIcons" :src="iconFirst" :class="[iconClass, tailwind && iconTW]" alt="first" />
      </button>

      <button
        :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
        :disabled="page<=1"
        @click="go(page-1)"
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
          @click="go(Math.max(1, pages[0] - buttonCount))"
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
          { 'is-active': p===page },
          tailwind && 'inline-flex items-center justify-center border rounded-md flex-shrink-0',
          tailwind && 'px-2 sm:px-3 py-1 text-xs sm:text-sm min-w-[28px] sm:min-w-[32px]',
          tailwind && (p===page ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-slate-300 hover:bg-slate-50')
        ]"
        @click="go(p)"
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
          @click="go(Math.min(totalPages, pages[pages.length - 1] + buttonCount + 1))"
        >
          ...
        </button>
        <span v-else>...</span>
      </span>

      <button
        :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
        :disabled="page>=totalPages"
        @click="go(page+1)"
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
        :disabled="page>=totalPages"
        @click="go(totalPages)"
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
      v-else-if="variant==='edges' && !numeric"
      class="pg-row"
      :class="tailwind ? 'flex items-center gap-0.5 sm:gap-1 flex-wrap justify-center' : ''"
      style="flex-wrap: wrap; justify-content: center;"
    >
      <button 
        v-if="previousNext"
        :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
        :disabled="page<=1" 
        @click="go(1)" 
        :aria-label="M.pageableFirst || 'First'"
        :title="M.pageableFirst || 'First'"
        style="flex-shrink: 0;"
      >
        <img v-if="showIcons" :src="iconFirst" :class="[iconClass, tailwind && iconTW]" alt="first" />
      </button>

      <button
        :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
        :disabled="page<=1"
        @click="go(page-1)"
        :aria-label="M.pageablePrevious || M.previous"
        :title="M.pageablePrevious || M.previous"
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
          :value="page"
          @input="pageInputValue = ($event.target as HTMLInputElement).value"
          @keydown.enter="handlePageInput"
          @blur="handlePageInput"
          :class="tailwind ? 'border border-slate-300 rounded-md bg-white text-xs sm:text-sm px-1 sm:px-2 py-1 w-12 sm:w-16 text-center flex-shrink-0' : 'pg-input'"
          style="flex-shrink: 0;"
        />
        <span v-if="M.pageableOf" :class="tailwind ? 'text-xs sm:text-sm whitespace-nowrap' : ''">{{ formatOfMessage(M.pageableOf) }}</span>
      </template>

      <button
        v-for="p in pages"
        :key="p"
        class="pg-pill"
        :class="[
          pillSize,
          { 'is-active': p===page },
          tailwind && 'inline-flex items-center justify-center border rounded-md flex-shrink-0',
          tailwind && 'px-2 sm:px-3 py-1 text-xs sm:text-sm min-w-[28px] sm:min-w-[32px]',
          tailwind && (p===page ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-slate-300 hover:bg-slate-50')
        ]"
        @click="go(p)"
        style="flex-shrink: 0;"
      >
        {{ p }}
      </button>

      <button
        :class="[btnClass, tailwind && btnTW, tailwind && 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm flex-shrink-0']"
        :disabled="page>=totalPages"
        @click="go(page+1)"
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
        :disabled="page>=totalPages" 
        @click="go(totalPages)" 
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Locale, Messages } from '../types'
import { getMessages } from '../i18n/messages'

type Variant = 'simple' | 'pages' | 'edges'

const props = withDefaults(defineProps<{
  page: number
  pageSize: number
  total: number

  variant?: Variant
  showTotal?: boolean
  maxPages?: number
  locale?: Locale | string
  messages?: Partial<Messages>
  showText?: boolean
  showIcons?: boolean

  showPageSize?: boolean
  pageSizeOptions?: number[]
  dense?: boolean

  tailwind?: boolean
  rtl?: boolean

  // New pageable props
  previousNext?: boolean
  numeric?: boolean
  buttonCount?: number
  input?: boolean
  refresh?: boolean
  responsive?: boolean
  info?: boolean
}>(), {
  variant: 'simple',
  showTotal: true,
  maxPages: 5,
  locale: 'en',
  showText: true,
  showIcons: true,
  showPageSize: false,
  pageSizeOptions: () => [10, 20, 50, 100],
  dense: false,
  tailwind: true,
  previousNext: true,
  numeric: false,
  buttonCount: 5,
  input: false,
  refresh: false,
  responsive: true,
  info: true,
})

const emit = defineEmits<{
  (e:'update:page', v:number): void
  (e:'update:pageSize', v:number): void
  (e:'refresh'): void
}>()

const M = computed(() => getMessages(String(props.locale), props.messages))

const totalPages = computed(() =>
  Math.max(1, Math.ceil((props.total || 0) / Math.max(1, props.pageSize)))
)

function go(p: number) {
  const next = Math.min(totalPages.value, Math.max(1, p))
  if (next !== props.page) emit('update:page', next)
}
function changeSize(v: string) {
  const n = Number(v)
  if (!Number.isNaN(n) && n > 0) emit('update:pageSize', n)
}

const pages = computed(() => {
  const max = Math.max(1, props.buttonCount ?? props.maxPages!)
  const tp = totalPages.value
  const cur = Math.min(tp, Math.max(1, props.page))
  const half = Math.floor(max / 2)
  let start = Math.max(1, cur - half)
  let end = Math.min(tp, start + max - 1)
  start = Math.max(1, end - max + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const showEllipsis = computed(() => {
  if (!props.numeric && props.variant !== 'pages') return false
  const tp = totalPages.value
  const pagesList = pages.value
  return pagesList.length > 0 && (pagesList[0] > 1 || pagesList[pagesList.length - 1] < tp)
})

const firstItem = computed(() => {
  if (props.total === 0) return 0
  return (props.page - 1) * props.pageSize + 1
})

const lastItem = computed(() => {
  if (props.total === 0) return 0
  return Math.min(props.page * props.pageSize, props.total)
})

const pageInputValue = ref<string>('')

function formatDisplayMessage(template: string): string {
  return template
    .replace('{0}', String(firstItem.value))
    .replace('{1}', String(lastItem.value))
    .replace('{2}', String(props.total))
}

function formatOfMessage(template: string): string {
  return template.replace('{0}', String(totalPages.value))
}

function handlePageInput() {
  const num = Number.parseInt(pageInputValue.value, 10)
  if (!Number.isNaN(num) && num >= 1 && num <= totalPages.value) {
    go(num)
  } else {
    pageInputValue.value = String(props.page)
  }
}

function handleRefresh() {
  emit('refresh')
}

const btnClass = computed(() => props.dense ? 'pg-btn pg-btn--dense' : 'pg-btn pg-btn--normal')
const iconClass = computed(() => (props.dense ? 'pg-icon--dense' : 'pg-icon--normal'))
const pillSize  = computed(() => (props.dense ? 'pg-pill--dense' : 'pg-pill--normal'))

const tailwind = computed(() => !!props.tailwind)
const btnTW = 'inline-flex items-center gap-1.5 border border-slate-300 rounded-md bg-white disabled:opacity-50'
const iconTW = 'w-3.5 h-3.5'

const iconPrev  = new URL('../assets/arrow-left.svg',  import.meta.url).href
const iconNext  = new URL('../assets/arrow-right.svg', import.meta.url).href
const iconFirst = new URL('../assets/previous.svg',    import.meta.url).href
const iconLast  = new URL('../assets/next.svg',        import.meta.url).href

// Sync pageInputValue with page prop
watch(() => props.page, (newPage) => {
  pageInputValue.value = String(newPage)
}, { immediate: true })
</script>

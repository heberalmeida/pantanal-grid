<template>
  <div class="flex flex-wrap items-center gap-3">
    <div v-if="showTotal" class="text-sm opacity-80">
      {{ M.total }}: {{ total }}
    </div>

    <div v-if="showPageSize" class="flex items-center gap-2">
      <label class="text-sm">{{ M.rowsPerPage }}</label>
      <select
        class="border border-slate-300 rounded-md bg-white text-sm px-2 py-1"
        :value="pageSize"
        @change="changeSize(($event.target as HTMLSelectElement).value)"
      >
        <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>

    <div v-if="variant==='simple'" class="flex items-center gap-1">
      <button :class="btnClass" :disabled="page<=1" @click="go(page-1)">
        <img v-if="showIcons" :src="iconPrev" :class="iconClass" alt="prev" />
        <span v-if="showText">{{ M.previous }}</span>
      </button>

      <button :class="btnClass" :disabled="page>=totalPages" @click="go(page+1)">
        <span v-if="showText">{{ M.next }}</span>
        <img v-if="showIcons" :src="iconNext" :class="iconClass" alt="next" />
      </button>
    </div>

    <!-- variant: pages (1 2 3 ...) -->
    <div v-else-if="variant==='pages'" class="flex items-center gap-1">
      <button
        :class="btnClass"
        :disabled="page<=1"
        @click="go(page-1)"
        :aria-label="M.previous"
        :title="M.previous"
      >
        <img v-if="showIcons" :src="iconPrev" :class="iconClass" alt="prev" />
        <span v-if="showText">{{ M.previous }}</span>
      </button>

      <button
        v-for="p in pages"
        :key="p"
        class="inline-flex items-center justify-center border rounded-md"
        :class="[pillClass, p===page ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-slate-300 hover:bg-slate-50']"
        @click="go(p)"
      >
        {{ p }}
      </button>

      <button
        :class="btnClass"
        :disabled="page>=totalPages"
        @click="go(page+1)"
        :aria-label="M.next"
        :title="M.next"
      >
        <span v-if="showText">{{ M.next }}</span>
        <img v-if="showIcons" :src="iconNext" :class="iconClass" alt="next" />
      </button>
    </div>

    <div v-else class="flex items-center gap-1">
      <button :class="btnClass" :disabled="page<=1" @click="go(1)" aria-label="first" title="first">
        <img v-if="showIcons" :src="iconFirst" :class="iconClass" alt="first" />
      </button>

      <button
        :class="btnClass"
        :disabled="page<=1"
        @click="go(page-1)"
        :aria-label="M.previous"
        :title="M.previous"
      >
        <img v-if="showIcons" :src="iconPrev" :class="iconClass" alt="prev" />
        <span v-if="showText">{{ M.previous }}</span>
      </button>

      <button
        v-for="p in pages"
        :key="p"
        class="inline-flex items-center justify-center border rounded-md"
        :class="[pillClass, p===page ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-slate-300 hover:bg-slate-50']"
        @click="go(p)"
      >
        {{ p }}
      </button>

      <button
        :class="btnClass"
        :disabled="page>=totalPages"
        @click="go(page+1)"
        :aria-label="M.next"
        :title="M.next"
      >
        <span v-if="showText">{{ M.next }}</span>
        <img v-if="showIcons" :src="iconNext" :class="iconClass" alt="next" />
      </button>

      <button :class="btnClass" :disabled="page>=totalPages" @click="go(totalPages)" aria-label="last" title="last">
        <img v-if="showIcons" :src="iconLast" :class="iconClass" alt="last" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { defaultMsgs } from '../i18n/messages'
import type { Locale } from '../types'

type Variant = 'simple' | 'pages' | 'edges'

const props = withDefaults(defineProps<{
  page: number
  pageSize: number
  total: number

  variant?: Variant
  showTotal?: boolean
  maxPages?: number
  locale?: Locale
  showText?: boolean
  showIcons?: boolean

  showPageSize?: boolean
  pageSizeOptions?: number[]
  dense?: boolean
}>(), {
  variant: 'simple',
  showTotal: true,
  maxPages: 5,
  locale: 'pt',
  showText: true,
  showIcons: true,
  showPageSize: false,
  pageSizeOptions: () => [10, 20, 50, 100],
  dense: false,
})

const emit = defineEmits<{
  (e:'update:page', v:number): void
  (e:'update:pageSize', v:number): void
}>()

const M = computed(() => defaultMsgs[props.locale!])

const totalPages = computed(() => Math.max(1, Math.ceil((props.total || 0) / Math.max(1, props.pageSize))))
function go(p: number) { emit('update:page', Math.min(totalPages.value, Math.max(1, p))) }
function changeSize(v: string) { emit('update:pageSize', Number(v)) }

const pages = computed(() => {
  const max = Math.max(1, props.maxPages!)
  const tp = totalPages.value
  const cur = Math.min(tp, Math.max(1, props.page))
  const half = Math.floor(max / 2)
  let start = Math.max(1, cur - half)
  let end = Math.min(tp, start + max - 1)
  start = Math.max(1, end - max + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const btnClass = computed(() =>
  props.dense
    ? 'inline-flex items-center gap-1 px-2 py-1 border border-slate-300 rounded-md bg-white disabled:opacity-50 h-8'
    : 'inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-md bg-white disabled:opacity-50 h-9'
)
const iconClass = computed(() => (props.dense ? 'w-3 h-3' : 'w-3.5 h-3.5'))
const pillClass = computed(() => (props.dense ? 'w-8 h-8' : 'w-9 h-9'))

const iconPrev  = new URL('../assets/arrow-left.svg',  import.meta.url).href
const iconNext  = new URL('../assets/arrow-right.svg', import.meta.url).href
const iconFirst = new URL('../assets/previous.svg',    import.meta.url).href
const iconLast  = new URL('../assets/next.svg',        import.meta.url).href
</script>

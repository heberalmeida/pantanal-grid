<template>
  <div
    class="pg pg-row"
    :class="tailwind ? 'flex flex-wrap items-center gap-3' : ''"
  >
    <!-- total -->
    <div
      v-if="showTotal"
      class="pg-total"
      :class="tailwind ? 'text-sm opacity-80' : ''"
    >
      {{ M.total }}: {{ total }}
    </div>

    <!-- seletor de page size -->
    <div
      v-if="showPageSize"
      class="pg-row"
      :class="tailwind ? 'flex items-center gap-2' : ''"
    >
      <label class="pg-label" :class="tailwind ? 'text-sm' : ''">{{ M.rowsPerPage }}</label>
      <select
        class="pg-select"
        :class="tailwind ? 'border border-slate-300 rounded-md bg-white text-sm px-2 py-1' : ''"
        :value="pageSize"
        @change="changeSize(($event.target as HTMLSelectElement).value)"
      >
        <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>

    <!-- variant: simple -->
    <div
      v-if="variant==='simple'"
      class="pg-row"
      :class="tailwind ? 'flex items-center gap-1' : ''"
    >
      <button :class="[btnClass, tailwind && btnTW]" :disabled="page<=1" @click="go(page-1)">
        <img v-if="showIcons" :src="iconPrev" :class="[iconClass, tailwind && iconTW]" alt="prev" />
        <span v-if="showText">{{ M.previous }}</span>
      </button>

      <button :class="[btnClass, tailwind && btnTW]" :disabled="page>=totalPages" @click="go(page+1)">
        <span v-if="showText">{{ M.next }}</span>
        <img v-if="showIcons" :src="iconNext" :class="[iconClass, tailwind && iconTW]" alt="next" />
      </button>
    </div>

    <!-- variant: pages (1 2 3 ...) -->
    <div
      v-else-if="variant==='pages'"
      class="pg-row"
      :class="tailwind ? 'flex items-center gap-1' : ''"
    >
      <button
        :class="[btnClass, tailwind && btnTW]"
        :disabled="page<=1"
        @click="go(page-1)"
        :aria-label="M.previous"
        :title="M.previous"
      >
        <img v-if="showIcons" :src="iconPrev" :class="[iconClass, tailwind && iconTW]" alt="prev" />
        <span v-if="showText">{{ M.previous }}</span>
      </button>

      <button
        v-for="p in pages"
        :key="p"
        class="pg-pill"
        :class="[
          pillSize,
          { 'is-active': p===page },
          tailwind && 'inline-flex items-center justify-center border rounded-md',
          tailwind && (p===page ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-slate-300 hover:bg-slate-50')
        ]"
        @click="go(p)"
      >
        {{ p }}
      </button>

      <button
        :class="[btnClass, tailwind && btnTW]"
        :disabled="page>=totalPages"
        @click="go(page+1)"
        :aria-label="M.next"
        :title="M.next"
      >
        <span v-if="showText">{{ M.next }}</span>
        <img v-if="showIcons" :src="iconNext" :class="[iconClass, tailwind && iconTW]" alt="next" />
      </button>
    </div>

    <!-- variant: edges (<< < 1 2 3 > >>) -->
    <div
      v-else
      class="pg-row"
      :class="tailwind ? 'flex items-center gap-1' : ''"
    >
      <button :class="[btnClass, tailwind && btnTW]" :disabled="page<=1" @click="go(1)" aria-label="first" title="first">
        <img v-if="showIcons" :src="iconFirst" :class="[iconClass, tailwind && iconTW]" alt="first" />
      </button>

      <button
        :class="[btnClass, tailwind && btnTW]"
        :disabled="page<=1"
        @click="go(page-1)"
        :aria-label="M.previous"
        :title="M.previous"
      >
        <img v-if="showIcons" :src="iconPrev" :class="[iconClass, tailwind && iconTW]" alt="prev" />
        <span v-if="showText">{{ M.previous }}</span>
      </button>

      <button
        v-for="p in pages"
        :key="p"
        class="pg-pill"
        :class="[
          pillSize,
          { 'is-active': p===page },
          tailwind && 'inline-flex items-center justify-center border rounded-md',
          tailwind && (p===page ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-slate-300 hover:bg-slate-50')
        ]"
        @click="go(p)"
      >
        {{ p }}
      </button>

      <button
        :class="[btnClass, tailwind && btnTW]"
        :disabled="page>=totalPages"
        @click="go(page+1)"
        :aria-label="M.next"
        :title="M.next"
      >
        <span v-if="showText">{{ M.next }}</span>
        <img v-if="showIcons" :src="iconNext" :class="[iconClass, tailwind && iconTW]" alt="next" />
      </button>

      <button :class="[btnClass, tailwind && btnTW]" :disabled="page>=totalPages" @click="go(totalPages)" aria-label="last" title="last">
        <img v-if="showIcons" :src="iconLast" :class="[iconClass, tailwind && iconTW]" alt="last" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
})

const emit = defineEmits<{
  (e:'update:page', v:number): void
  (e:'update:pageSize', v:number): void
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
  const max = Math.max(1, props.maxPages!)
  const tp = totalPages.value
  const cur = Math.min(tp, Math.max(1, props.page))
  const half = Math.floor(max / 2)
  let start = Math.max(1, cur - half)
  let end = Math.min(tp, start + max - 1)
  start = Math.max(1, end - max + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

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
</script>

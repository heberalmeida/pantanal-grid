<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h2 class="text-2xl font-semibold leading-tight">Responsive cards & table</h2>
      <p class="text-sm text-slate-500 dark:text-slate-300">
        Switch between card and table modes automatically based on container width. Use the slider to mimic different
        breakpoints.
      </p>
    </header>

    <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr),minmax(0,280px)]">
      <div class="space-y-4 rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
        <label class="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Simulated width
          <div class="flex items-center gap-3">
            <input
              type="range"
              min="320"
              max="1280"
              step="20"
              v-model.number="containerWidth"
              class="flex-1 cursor-pointer accent-cyan-500 dark:accent-cyan-300"
            />
            <span class="w-16 text-right text-xs font-semibold text-slate-600 dark:text-slate-200">
              {{ containerWidth }}px
            </span>
          </div>
        </label>

        <div class="grid gap-3 text-sm md:grid-cols-3">
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 font-medium transition-colors"
            :class="responsiveMode === 'auto'
              ? 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/40 dark:bg-cyan-500/20 dark:text-cyan-100'
              : 'border-transparent bg-slate-100 text-slate-600 hover:border-slate-300 dark:bg-slate-800/70 dark:text-slate-300'"
            @click="responsiveMode = 'auto'">
            Auto (cards &lt; {{ cardBreakpoint }}px)
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 font-medium transition-colors"
            :class="responsiveMode === 'cards'
              ? 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/40 dark:bg-cyan-500/20 dark:text-cyan-100'
              : 'border-transparent bg-slate-100 text-slate-600 hover:border-slate-300 dark:bg-slate-800/70 dark:text-slate-300'"
            @click="responsiveMode = 'cards'">
            Force cards
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 font-medium transition-colors"
            :class="responsiveMode === 'table'
              ? 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/40 dark:bg-cyan-500/20 dark:text-cyan-100'
              : 'border-transparent bg-slate-100 text-slate-600 hover:border-slate-300 dark:bg-slate-800/70 dark:text-slate-300'"
            @click="responsiveMode = 'table'">
            Force table
          </button>
        </div>

        <label class="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Card breakpoint (auto)
          <input
            type="number"
            v-model.number="cardBreakpoint"
            class="w-28 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-cyan-400/60 dark:focus:ring-cyan-500/20"
          />
        </label>
      </div>

      <aside class="rounded-2xl border border-slate-200/80 bg-white/85 p-4 text-sm leading-relaxed text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200">
        <ul class="space-y-2">
          <li><strong>Auto:</strong> switches between cards and table based on container width.</li>
          <li><strong>Force cards/table:</strong> useful when you want hard-coded layouts at any size.</li>
          <li><strong>Breakpoint:</strong> controls when auto mode flips into card view.</li>
        </ul>
      </aside>
    </div>

    <div class="overflow-x-auto">
      <div class="mx-auto transition-all duration-300" :style="{ width: containerWidth + 'px', maxWidth: '100%' }">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :responsive="responsiveMode"
          :card-breakpoint="cardBreakpoint"
          :striped="true"
          :show-filters-in-cards="true"
          :height="responsiveMode === 'cards' ? 680 : 420"
          locale="en"
        />
      </div>
    </div>
    <ExampleCode :source="codeSnippet" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './ResponsiveCardsPage.vue?raw'

type ResponsiveMode = 'auto' | 'cards' | 'table'

const responsiveMode = ref<ResponsiveMode>('auto')
const cardBreakpoint = ref(768)
const containerWidth = ref(940)

const rows = computed(() =>
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: ['Wireless Headphones', 'Smart Lamp', 'Notebook 14"', 'Mechanical Keyboard', 'Noise Cancelling Buds'][i % 5],
    brand: ['Aurora', 'Neon', 'Skyline', 'North', 'Pulse'][i % 5],
    status: ['In stock', 'In production', 'In transit', 'Made to order'][i % 4],
    price: 199 + i * 12,
    updatedAt: new Date(Date.now() - i * 86400000).toLocaleDateString('en-US')
  }))
)

const columns = [
  { field: 'id', title: '#', width: 70, pinned: 'left' },
  { field: 'name', title: 'Product', filterable: true, sortable: true },
  { field: 'brand', title: 'Brand', filterable: true },
  { field: 'status', title: 'Status', filterable: true },
  { field: 'price', title: 'Price', sortable: true, format: (v: number) => `$ ${v.toFixed(2)}` },
  { field: 'updatedAt', title: 'Updated at', width: 160 }
]

const codeSnippet = exampleSource
</script>

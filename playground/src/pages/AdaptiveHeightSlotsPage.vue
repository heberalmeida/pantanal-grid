<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h2 class="text-2xl font-semibold leading-tight">Adaptive height &amp; column slots</h2>
      <p class="text-sm text-slate-500 dark:text-slate-300">
        Let the grid stretch vertically according to the visible rows while customizing individual columns through
        named slots.
      </p>
    </header>

    <div class="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-200">
      <span class="font-medium uppercase tracking-wide text-xs text-slate-400 dark:text-slate-500">Visible orders</span>
      <button
        v-for="option in rowOptions"
        :key="option"
        type="button"
        class="rounded-full border px-3 py-1 font-semibold transition"
        :class="option === visibleCount
          ? 'border-cyan-500 bg-cyan-500 text-white shadow-sm'
          : 'border-slate-300/70 bg-white/70 text-slate-600 hover:border-cyan-300 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-200'"
        @click="visibleCount = option"
      >
        {{ option }}
      </button>
      <span class="text-xs opacity-80">
        The body grows with the dataset until the <code class="rounded bg-slate-200 px-1 py-0.5 text-xs dark:bg-slate-700">maxBodyHeight</code> limit (360&nbsp;px) kicks in.
      </span>
    </div>

    <div class="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/40">
      <PantanalGrid
        :rows="rows"
        key-field="id"
        auto-height
        :max-body-height="360"
        :row-height="48"
        :responsive="'table'"
        :show-filter-row="false"
        locale="en"
      >
        <PantanalColumn field="order" title="Order" :width="220" :filterable="true" />
        <PantanalColumn field="status" title="Status" :template="renderStatus as ColumnTemplateFn" :width="140" :filterable="true" />
        <PantanalColumn field="assignee" title="Owner" :template="renderAssignee as ColumnTemplateFn" :width="220" :filterable="true" />
        <PantanalColumn
          field="eta"
          title="ETA"
          :width="140"
          :format="formatDate"
        />
        <PantanalColumn field="progress" title="Progress" :template="renderProgress as ColumnTemplateFn" :width="180" />
      </PantanalGrid>
    </div>

    <ExampleCode :source="codeSnippet" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { PantanalColumn, PantanalGrid, type ColumnTemplateContext, type ColumnTemplateFn } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './AdaptiveHeightSlotsPage.vue?raw'

const baseRows = [
  { id: 101, order: 'Weekend Essentials Pack', status: 'Scheduled', assignee: 'Laura Campos', role: 'Merchandising', eta: '2024-07-02', progress: 68 },
  { id: 102, order: 'Coastal Summer Bundle', status: 'In transit', assignee: 'Bruno Azevedo', role: 'Logistics', eta: '2024-06-28', progress: 82 },
  { id: 103, order: 'Kids Discovery Crate', status: 'Awaiting pickup', assignee: 'Maya Ribeiro', role: 'Fulfillment', eta: '2024-07-05', progress: 41 },
  { id: 104, order: 'Zero Waste Starter Kit', status: 'Delayed', assignee: 'Igor Baptista', role: 'Supplier Ops', eta: '2024-07-08', progress: 23 },
  { id: 105, order: 'Nordic Living Set', status: 'In transit', assignee: 'Camila Duarte', role: 'Merchandising', eta: '2024-06-30', progress: 77 },
  { id: 106, order: 'Festival Roadtrip Pack', status: 'Scheduled', assignee: 'Henrique Sales', role: 'Fulfillment', eta: '2024-07-04', progress: 54 },
  { id: 107, order: 'Wellness Morning Ritual', status: 'Delivered', assignee: 'Ana Beatriz', role: 'Customer Care', eta: '2024-06-21', progress: 100 },
  { id: 108, order: 'Studio Creator Bundle', status: 'In transit', assignee: 'Diego Freitas', role: 'Logistics', eta: '2024-07-01', progress: 64 },
  { id: 109, order: 'Premium Coffee Sampler', status: 'Scheduled', assignee: 'Renata Prado', role: 'Merchandising', eta: '2024-07-09', progress: 48 },
  { id: 110, order: 'Home Office Refresh', status: 'Awaiting pickup', assignee: 'Elisa Novaes', role: 'Fulfillment', eta: '2024-07-06', progress: 37 },
  { id: 111, order: 'City Cycling Kit', status: 'Delayed', assignee: 'Victor Nunes', role: 'Supplier Ops', eta: '2024-07-10', progress: 19 },
  { id: 112, order: 'Luxe Evening Essentials', status: 'Scheduled', assignee: 'Patricia Lima', role: 'Merchandising', eta: '2024-07-07', progress: 59 },
]

const rowOptions = [4, 6, 8, 12] as const
const visibleCount = ref<typeof rowOptions[number]>(6)

const rows = computed(() => baseRows.slice(0, visibleCount.value))

type OrderRow = typeof baseRows[number]

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const renderStatus = ((ctx?: ColumnTemplateContext<OrderRow>) => {
  const value = String(ctx?.value ?? '')
  return `
    <span class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(value)}">
      <span class="h-2 w-2 rounded-full ${statusDot(value)}"></span>
      ${value}
    </span>
  `
}) as ColumnTemplateFn

const renderAssignee = ((ctx?: ColumnTemplateContext<OrderRow>) => {
  const row = ctx?.row ?? baseRows[0]
  if (!row) return ''
  const avatar = avatarColor(row.assignee)
  const initialsText = initials(row.assignee)
  return `
    <span class="flex items-center gap-3">
      <span class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white shadow" style="background:${avatar}">
        ${initialsText}
      </span>
      <span>
        <span class="block text-sm font-semibold text-slate-700 dark:text-slate-100">${row.assignee}</span>
        <span class="block text-xs text-slate-400 dark:text-slate-300">${row.role}</span>
      </span>
    </span>
  `
}) as ColumnTemplateFn

const renderProgress = ((ctx?: ColumnTemplateContext<OrderRow>) => {
  const raw = ctx?.value
  const numeric = typeof raw === 'number' ? raw : Number(raw ?? 0)
  const width = Math.min(100, Math.max(0, isNaN(numeric) ? 0 : numeric))
  return `
    <div class="flex items-center gap-3 w-52">
      <div class="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
        <div class="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-all" style="width:${width}%"></div>
      </div>
      <span class="text-xs font-semibold text-slate-600 dark:text-slate-200">${width}%</span>
    </div>
  `
}) as ColumnTemplateFn

function statusClass(status: string) {
  switch (status) {
    case 'Delivered':
      return 'bg-emerald-500/15 text-emerald-600 border border-emerald-400/40'
    case 'In transit':
      return 'bg-sky-500/15 text-sky-600 border border-sky-400/40'
    case 'Scheduled':
      return 'bg-indigo-500/15 text-indigo-600 border border-indigo-400/40'
    case 'Awaiting pickup':
      return 'bg-amber-500/15 text-amber-600 border border-amber-400/40'
    case 'Delayed':
      return 'bg-rose-500/15 text-rose-600 border border-rose-400/40'
    default:
      return 'bg-slate-200/70 text-slate-600 border border-slate-300'
  }
}

function statusDot(status: string) {
  switch (status) {
    case 'Delivered':
      return 'bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]'
    case 'In transit':
      return 'bg-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.18)]'
    case 'Scheduled':
      return 'bg-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.18)]'
    case 'Awaiting pickup':
      return 'bg-amber-500 shadow-[0_0_0_4px_rgba(251,191,36,0.22)]'
    case 'Delayed':
      return 'bg-rose-500 shadow-[0_0_0_4px_rgba(244,63,94,0.22)]'
    default:
      return 'bg-slate-400 shadow-[0_0_0_4px_rgba(148,163,184,0.25)]'
  }
}

function avatarColor(name: string) {
  const palette = ['#0ea5e9', '#6366f1', '#14b8a6', '#ec4899', '#f97316', '#facc15', '#22c55e']
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return palette[hash % palette.length]
}

function initials(name: string) {
  return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
}

const codeSnippet = exampleSource
</script>

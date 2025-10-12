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
        :columns="columns"
        key-field="id"
        auto-height
        :max-body-height="360"
        :row-height="48"
        :responsive="'table'"
        :show-filter-row="false"
        locale="en"
      >
        <template #status="{ value }">
          <span class="status-chip" :class="statusClass(value)">
            <span class="status-dot" :class="statusDot(value)"></span>
            {{ value }}
          </span>
        </template>

        <template #assignee="{ row }">
          <span class="assignee">
            <span class="assignee-avatar" :style="{ background: avatarColor(row.assignee) }">
              {{ initials(row.assignee) }}
            </span>
            <span>
              <span class="assignee-name">{{ row.assignee }}</span>
              <span class="assignee-role">{{ row.role }}</span>
            </span>
          </span>
        </template>

        <template #progress="{ value }">
          <div class="progress-wrap">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: Math.min(100, value) + '%' }"></div>
            </div>
            <span class="progress-label">{{ value }}%</span>
          </div>
        </template>
      </PantanalGrid>
    </div>

    <ExampleCode :source="codeSnippet" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { PantanalGrid } from '@pantanal/grid'
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

const columns = [
  { field: 'order', title: 'Order', width: 220, filterable: true },
  { field: 'status', title: 'Status', width: 140, slot: 'status', filterable: true },
  { field: 'assignee', title: 'Owner', width: 220, slot: 'assignee', filterable: true },
  { field: 'eta', title: 'ETA', width: 140, format: (value: string) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) },
  { field: 'progress', title: 'Progress', width: 160, slot: 'progress' },
]

function statusClass(status: string) {
  switch (status) {
    case 'Delivered':
      return 'status-chip--delivered'
    case 'In transit':
      return 'status-chip--transit'
    case 'Scheduled':
      return 'status-chip--scheduled'
    case 'Awaiting pickup':
      return 'status-chip--awaiting'
    case 'Delayed':
      return 'status-chip--delayed'
    default:
      return 'status-chip--default'
  }
}

function statusDot(status: string) {
  switch (status) {
    case 'Delivered':
      return 'bg-emerald-500'
    case 'In transit':
      return 'bg-sky-500'
    case 'Scheduled':
      return 'bg-indigo-500'
    case 'Awaiting pickup':
      return 'bg-amber-500'
    case 'Delayed':
      return 'bg-rose-500'
    default:
      return 'bg-slate-400'
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

<style scoped>
.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border-radius: 9999px;
  padding: 0.35rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.status-dot {
  display: inline-flex;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
}
.status-chip--delivered { background: rgba(16, 185, 129, 0.16); color: #047857; }
.status-chip--transit   { background: rgba(56, 189, 248, 0.16); color: #0369a1; }
.status-chip--scheduled { background: rgba(129, 140, 248, 0.16); color: #4338ca; }
.status-chip--awaiting  { background: rgba(251, 191, 36, 0.18); color: #b45309; }
.status-chip--delayed   { background: rgba(248, 113, 113, 0.18); color: #b91c1c; }
.status-chip--default   { background: rgba(148, 163, 184, 0.18); color: #475569; }

.assignee {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}
.assignee-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
}
.assignee-name {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
}
.assignee-role {
  display: block;
  font-size: 0.75rem;
  opacity: 0.65;
}

.progress-wrap {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  width: 12rem;
}
.progress-bar {
  flex: 1;
  height: 0.5rem;
  border-radius: 9999px;
  background: rgba(148, 163, 184, 0.3);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, #0ea5e9, #6366f1);
  transition: width 0.2s ease-out;
}
.progress-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}
</style>

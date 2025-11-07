<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h2 class="text-2xl font-semibold leading-tight">Local state persistence</h2>
      <p class="text-sm text-slate-500 dark:text-slate-300">
        Pantanal Grid can persist sort order, filters, page size and column widths into
        <code class="rounded bg-slate-200 px-1 py-0.5 text-xs dark:bg-slate-700">localStorage</code>. Interact with the grid below,
        reload the page and inspect the stored snapshot.
      </p>
    </header>

    <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr),minmax(0,280px)] xl:grid-cols-[minmax(0,1fr),minmax(0,320px)]">
      <div class="space-y-4 rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/65 dark:shadow-none">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          v-model:sort="sort"
          v-model:filter="filters"
          v-model:page="page"
          v-model:pageSize="pageSize"
          persist-state-key="pantanal-demo-persisted"
          :show-filter-row="true"
          :enable-column-resize="true"
          :enable-column-reorder="true"
          striped
          locale="en"
        />
      </div>

      <aside class="flex h-full flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/85 p-4 text-sm leading-relaxed text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/65 dark:text-slate-200">
        <div class="space-y-3">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
            Current snapshot
          </h3>
          <pre
            class="max-h-64 overflow-y-auto rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 text-xs text-slate-700 shadow-inner dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200">
{{ snapshot }}
          </pre>
        </div>

        <div class="mt-auto grid gap-3">
          <button type="button"
            class="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-cyan-600 transition-colors"
            @click="refreshSnapshot">
            Refresh snapshot
          </button>
          <button type="button"
            class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="clearState">
            Clear persisted state
          </button>
        </div>

        <p class="text-xs text-slate-400 dark:text-slate-400">
          Key: <code>pantanal-demo-persisted</code>. The snapshot stores sort, filters, column order and widths.
        </p>
      </aside>
    </div>
    <ExampleCode :source="codeSnippet" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { PantanalGrid, type FilterDescriptor, type SortDescriptor } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './PersistedStatePage.vue?raw'

const persistKey = 'pantanal-demo-persisted'

const rows = ref(
  Array.from({ length: 80 }, (_, i) => ({
    id: i + 1,
    customer: ['North Channel', 'Blue Bird', 'Magma Labs', 'Orion Foods'][i % 4],
    city: ['New York', 'Chicago', 'Austin', 'Portland', 'Seattle'][i % 5],
    status: ['Active', 'Suspended', 'Trial'][i % 3],
    mrr: 1200 + (i % 7) * 180,
    since: 2016 + (i % 7)
  }))
)

const columns = [
  { field: 'id', title: '#', width: 70, sortable: true, filterable: true },
  { field: 'customer', title: 'Customer', sortable: true, filterable: true },
  { field: 'city', title: 'City', sortable: true, filterable: true },
  { field: 'status', title: 'Status', sortable: true, filterable: true },
  { field: 'mrr', title: 'MRR', sortable: true, filterable: true, format: (v: number) => `$ ${v.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
  { field: 'since', title: 'Customer since', sortable: true, filterable: true }
]

const sort = ref<SortDescriptor[]>([])
const filters = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(5)
const snapshot = ref<string>('—')
const codeSnippet = exampleSource

function refreshSnapshot() {
  if (typeof window === 'undefined') return
  try {
    const raw = window.localStorage.getItem(persistKey)
    snapshot.value = raw ? JSON.stringify(JSON.parse(raw), null, 2) : '—'
  } catch (err) {
    snapshot.value = 'Unable to read from storage'
  }
}

function clearState() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(persistKey)
  sort.value = []
  filters.value = []
  page.value = 1
  pageSize.value = 5
  refreshSnapshot()
}

onMounted(() => {
  refreshSnapshot()
})

watch([sort, filters, page, pageSize], () => {
  refreshSnapshot()
}, { deep: true })
</script>

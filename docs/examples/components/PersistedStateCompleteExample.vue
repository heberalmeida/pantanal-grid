<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

const rows = ref(Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  customer: ['North Channel', 'Blue Bird', 'Magma Labs', 'Orion Foods'][i % 4],
  city: ['New York', 'Chicago', 'Austin', 'Portland', 'Seattle'][i % 5],
  status: ['Active', 'Suspended', 'Trial'][i % 3],
  mrr: 1200 + (i % 7) * 180,
  since: 2016 + (i % 7)
})))

const columns: ColumnDef[] = [
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
const pageSize = ref(10)

const persistKey = 'pantanal-demo-persisted'
const snapshot = ref<string>('—')

function refreshSnapshot() {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem(persistKey)
  snapshot.value = stored ? JSON.stringify(JSON.parse(stored), null, 2) : '—'
}

function clearState() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(persistKey)
  refreshSnapshot()
  // Reset grid state
  sort.value = []
  filters.value = []
  page.value = 1
  pageSize.value = 10
}

onMounted(() => {
  refreshSnapshot()
})

watch([sort, filters, page, pageSize], () => {
  setTimeout(refreshSnapshot, 100)
}, { deep: true })
</script>

<template>
  <div class="space-y-8">
    <!-- Persisted State Grid -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Persisted State</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Pantanal Grid can persist sort order, filters, page size, and column widths into <code>localStorage</code>.
        Interact with the grid below (sort, filter, resize columns, change page), then reload the page to see the state persisted.
        The state is stored with key: <code>{{ persistKey }}</code>
      </p>
      <PantanalGrid
        :rows="rows"
        :columns="columns"
        key-field="id"
        v-model:sort="sort"
        v-model:filter="filters"
        v-model:page="page"
        v-model:pageSize="pageSize"
        :persist-state-key="persistKey"
        :show-filter-row="true"
        :enable-column-resize="true"
        :enable-column-reorder="true"
        :striped="true"
        :pageable="true"
        :height="400"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Current Snapshot -->
    <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-semibold">Current Snapshot</h3>
        <div class="flex gap-2">
          <button
            @click="refreshSnapshot"
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Refresh
          </button>
          <button
            @click="clearState"
            class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Clear State
          </button>
        </div>
      </div>
      <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
        The snapshot stores sort, filters, column order, and widths. Try interacting with the grid above and watch this snapshot update.
      </p>
      <pre class="p-3 bg-white dark:bg-gray-900 border rounded text-xs overflow-auto max-h-64">{{ snapshot }}</pre>
    </div>
  </div>
</template>

<style scoped>
.space-y-8 > * + * {
  margin-top: 2rem;
}
.text-lg {
  font-size: 1.125rem;
}
.font-semibold {
  font-weight: 600;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-600 {
  color: #4b5563;
}
.dark .text-gray-400 {
  color: #9ca3af;
}
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
.p-4 {
  padding: 1rem;
}
.bg-gray-50 {
  background-color: #f9fafb;
}
.dark .bg-gray-800 {
  background-color: #1f2937;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.gap-2 {
  gap: 0.5rem;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.bg-blue-500 {
  background-color: #3b82f6;
}
.text-white {
  color: #fff;
}
.rounded {
  border-radius: 0.25rem;
}
.hover\:bg-blue-600:hover {
  background-color: #2563eb;
}
.bg-red-500 {
  background-color: #ef4444;
}
.hover\:bg-red-600:hover {
  background-color: #dc2626;
}
.text-xs {
  font-size: 0.75rem;
}
.p-3 {
  padding: 0.75rem;
}
.bg-white {
  background-color: #fff;
}
.dark .bg-gray-900 {
  background-color: #111827;
}
.border {
  border-width: 1px;
  border-color: #e5e7eb;
}
.overflow-auto {
  overflow: auto;
}
.max-h-64 {
  max-height: 16rem;
}
</style>






<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid } from '@pantanal/grid'
import '@pantanal/grid/styles.css'
import type { GroupDescriptor, AggregateName } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './GroupingPage.vue?raw'

const rows = ref<any[]>([])
const loading = ref(false)
const columns = [
  { field: 'id', title: 'ID', width: 80 },
  {
    field: 'title',
    title: 'Title',
    filterable: true,
    width: 260,
    template: ({ value }: any) => `
      <span class="block font-semibold text-slate-700 dark:text-slate-100">${value}</span>
    `,
  },
  {
    field: 'brand',
    title: 'Brand',
    filterable: true,
    width: 220,
    template: ({ value }: any) => `
      <span class="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
        <span class="h-2 w-2 rounded-full bg-slate-300"></span>
        ${value}
      </span>
    `,
  },
  {
    field: 'category',
    title: 'Category',
    filterable: true,
    width: 200,
    template: ({ value }: any) => `
      <span class="inline-flex items-center gap-2 rounded-full bg-sky-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
        ${value}
      </span>
    `,
  },
  {
    field: 'price',
    title: 'Price',
    sortable: true,
    width: 140,
    template: ({ value }: any) => `
      <span class="font-semibold text-slate-800 dark:text-slate-100">${formatCurrency(value)}</span>
    `,
  },
]

const group = ref<GroupDescriptor[]>([{ field:'category', dir:'asc' }, { field:'brand', dir:'asc' }])
const aggregates: Record<string, AggregateName[]> = {
  price: ['sum','avg'] as AggregateName[],
  id: ['count'] as AggregateName[],
}

onMounted(async () => {
  loading.value = true
  const res = await fetch('https://dummyjson.com/products?limit=100')
  const data = await res.json()
  rows.value = data.products
  loading.value = false
})

const codeSnippet = exampleSource

function formatCurrency(value: number) {
  return value == null ? '' : `$ ${Number(value).toFixed(2)}`
}
</script>

<template>
  <section class="space-y-6 px-4 py-6">
    <header class="space-y-2">
      <h2 class="text-2xl font-semibold leading-tight">Grouping + Aggregates</h2>
      <p class="text-sm text-slate-500 dark:text-slate-300">
        Explore nested groups with expandable rows, custom renderers and summary footers styled in-line.
      </p>
    </header>

    <PantanalGrid
      :rows="rows"
      :columns="columns"
      :group="group"
      :aggregates="aggregates"
      :showGroupFooters="true"
      :pageSize="15"
      auto-height
      :maxBodyHeight="520"
      locale="en"
      :loading="loading"
      class="rounded-3xl border border-slate-200/70 bg-white/95 p-5 shadow-lg shadow-slate-200/40 dark:border-slate-800/70 dark:bg-slate-900/70"
    />

    <ExampleCode :source="codeSnippet" />
  </section>
</template>

<style scoped>
:deep(.v3grid__group) {
  background: rgba(14, 165, 233, 0.08);
  font-weight: 600;
  color: #0369a1;
}

:deep(.v3grid__groupfooter) {
  background: rgba(148, 163, 184, 0.12);
  font-style: normal;
  font-weight: 500;
  color: #1f2937;
}

:deep(.v3grid__cardvalue) {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>

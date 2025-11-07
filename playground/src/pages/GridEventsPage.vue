<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Grid Events</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The Grid component emits various events that allow you to react to user interactions and data operations.
        This page demonstrates all available Grid events.
      </p>
    </header>

    <!-- Events Log -->
    <div class="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Events Log</h2>
        <button
          @click="clearLog"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          Clear Log
        </button>
      </div>
      <div class="max-h-96 overflow-y-auto space-y-2">
        <div
          v-for="(event, index) in eventsLog"
          :key="index"
          class="p-2 bg-white dark:bg-slate-700 rounded text-sm font-mono"
        >
          <span class="font-semibold text-blue-600 dark:text-blue-400">[{{ event.timestamp }}]</span>
          <span class="ml-2 text-green-600 dark:text-green-400">{{ event.name }}:</span>
          <pre class="mt-1 text-xs overflow-x-auto">{{ JSON.stringify(event.data, null, 2) }}</pre>
        </div>
        <div v-if="eventsLog.length === 0" class="text-slate-500 dark:text-slate-400 text-sm">
          No events logged yet. Interact with the grid to see events.
        </div>
      </div>
    </div>

    <!-- Grid with Events -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">Interactive Grid</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Try sorting, filtering, grouping, selecting rows, and expanding/collapsing groups to see events in action.
      </p>

      <PantanalGrid
        :rows="rows"
        :columns="columns as any"
        key-field="id"
        v-model:sort="sort"
        v-model:filter="filter"
        v-model:page="page"
        v-model:pageSize="pageSize"
        v-model:group="group"
        :selectable="true"
        :sortable="true"
        :filterable="true"
        :groupable="true"
        :show-filter-row="true"
        :enable-column-resize="true"
        :enable-column-reorder="true"
        :aggregates="aggregates"
        :show-group-footers="true"
        @databinding="onDataBinding"
        @databound="onDataBound"
        @sort="onSort"
        @filter="onFilter"
        @group="onGroup"
        @groupexpand="onGroupExpand"
        @groupcollapse="onGroupCollapse"
        @selectionChange="onSelectionChange"
        @rowClick="onRowClick"
        @columnResize="onColumnResize"
        @columnReorder="onColumnReorder"
        @loading="onLoading"
        @error="onError"
      />
    </div>

    <ExampleCode :source="codeSnippet" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type SortDescriptor, type FilterDescriptor, type GroupDescriptor } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './GridEventsPage.vue?raw'

interface EventLogEntry {
  timestamp: string
  name: string
  data: any
}

const eventsLog = ref<EventLogEntry[]>([])

function addEvent(name: string, data: any) {
  const timestamp = new Date().toLocaleTimeString()
  eventsLog.value.unshift({ timestamp, name, data })
  // Keep only last 50 events
  if (eventsLog.value.length > 50) {
    eventsLog.value = eventsLog.value.slice(0, 50)
  }
}

function clearLog() {
  eventsLog.value = []
}

const rows = ref(Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  productName: `Product ${i + 1}`,
  unitPrice: Math.round(Math.random() * 100000) / 100,
  unitsInStock: Math.floor(Math.random() * 100),
  discontinued: i % 5 === 0,
  category: ['Beverages', 'Condiments', 'Confections', 'Dairy Products', 'Grains/Cereals'][i % 5]
})))

const columns = [
  { field: 'id', title: 'ID', width: 60, sortable: true, filterable: true },
  { field: 'productName', title: 'Product Name', width: 200, sortable: true, filterable: true },
  { field: 'unitPrice', title: 'Unit Price', width: 120, sortable: true, filterable: true, format: (v: any) => `$ ${Number(v).toFixed(2)}` },
  { field: 'unitsInStock', title: 'Units In Stock', width: 140, sortable: true, filterable: true },
  { field: 'discontinued', title: 'Discontinued', width: 120, sortable: true, filterable: true, format: (v: any) => v ? 'Yes' : 'No' },
  { field: 'category', title: 'Category', width: 150, sortable: true, filterable: true },
]

const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(10)
const group = ref<GroupDescriptor[]>([])

const aggregates = {
  unitPrice: ['sum', 'avg'] as const,
  unitsInStock: ['sum', 'avg', 'min', 'max'] as const,
}

// Event handlers
function onDataBinding(options: any) {
  addEvent('databinding', options)
  console.log('Grid data binding:', options)
}

function onDataBound(data: any[]) {
  addEvent('databound', { count: data.length })
  console.log('Grid data bound:', data.length, 'items')
}

function onSort(options: { sort: SortDescriptor[] }) {
  addEvent('sort', options)
  console.log('Sorting on field:', options.sort.map(s => `${s.field} ${s.dir || 'none'}`).join(', '))
}

function onFilter(options: { filter: FilterDescriptor[] }) {
  addEvent('filter', options)
  console.log('Filter:', options.filter)
}

function onGroup(options: { groups: GroupDescriptor[] }) {
  addEvent('group', options)
  console.log('Group on:', options.groups.map(g => g.field).join(', '))
}

function onGroupExpand(options: { group: { field: string; value: unknown; aggregates?: Record<string, any> } }) {
  addEvent('groupexpand', options)
  console.log('Group expanded:', options.group)
}

function onGroupCollapse(options: { group: { field: string; value: unknown; aggregates?: Record<string, any> } }) {
  addEvent('groupcollapse', options)
  console.log('Group collapsed:', options.group)
}

function onSelectionChange(selected: unknown[]) {
  addEvent('selectionChange', { count: selected.length, items: selected })
  console.log('Selected:', selected.length, 'item(s)')
}

function onRowClick(row: unknown) {
  addEvent('rowClick', row)
  console.log('Row clicked:', row)
}

function onColumnResize(options: { field: string; width: number }) {
  addEvent('columnResize', options)
  console.log('Column resized:', options.field, 'to', options.width, 'px')
}

function onColumnReorder(options: { from: number; to: number }) {
  addEvent('columnReorder', options)
  console.log('Column reordered:', options.from, 'to', options.to)
}

function onLoading(loading: boolean) {
  addEvent('loading', { loading })
  console.log('Loading:', loading)
}

function onError(error: unknown) {
  addEvent('error', { error: String(error) })
  console.error('Error:', error)
}

const codeSnippet = exampleSource
</script>


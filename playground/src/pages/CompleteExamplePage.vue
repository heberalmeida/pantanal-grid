<template>
  <div class="space-y-8 p-6">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Complete Grid Example</h1>
      <p class="text-slate-600 dark:text-slate-400">
        This example demonstrates all major features of the PantanalGrid component including
        sorting, filtering, pagination, selection, editing, grouping, and export capabilities.
      </p>
    </header>

    <!-- Toolbar Actions -->
    <div class="flex gap-2 flex-wrap">
      <button
        @click="handleExportPdf"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Export to PDF
      </button>
      <button
        @click="handleExportExcel"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Export to Excel
      </button>
      <button
        @click="handleExportCSV"
        class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Export to CSV
      </button>
      <button
        @click="handleGetOptions"
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Get Options
      </button>
      <button
        @click="handleSetOptions"
        class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        Set Options
      </button>
      <button
        @click="handleSelectAll"
        class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
      >
        Select All
      </button>
      <button
        @click="handleClearSelection"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Clear Selection
      </button>
    </div>

    <!-- Selection Info -->
    <div v-if="selectedKeys.length > 0" class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
      <p class="text-sm font-medium">
        Selected: {{ selectedKeys.length }} row(s) - IDs: {{ selectedKeys.join(', ') }}
      </p>
    </div>

    <!-- Grid -->
    <PantanalGrid
      ref="gridRef"
      :rows="rows"
      :columns="columns"
      key-field="id"
      :selectable="'multiple'"
      :sortable="true"
      :filterable="true"
      :pageable="true"
      :editable="true"
      :groupable="true"
      :navigatable="true"
      :toolbar="['create', 'save', 'cancel', 'excel', 'pdf', 'csv']"
      :persist-selection="true"
      v-model:sort="sort"
      v-model:filter="filter"
      v-model:page="page"
      v-model:pageSize="pageSize"
      v-model:selectedKeys="selectedKeys"
      v-model:group="group"
      @selectionChange="handleSelectionChange"
      @edit="handleEdit"
      @editCommit="handleEditCommit"
      @save="handleSave"
      @create="handleCreate"
      @destroy="handleDestroy"
      @rowClick="handleRowClick"
    />

    <!-- Options Display -->
    <div v-if="currentOptions" class="p-4 bg-gray-50 dark:bg-gray-900/20 rounded">
      <h3 class="text-lg font-semibold mb-2">Current Grid Options:</h3>
      <pre class="text-sm overflow-auto">{{ JSON.stringify(currentOptions, null, 2) }}</pre>
    </div>

    <!-- Code Example -->
    <ExampleCode :source="codeSnippet" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PantanalGrid, type SortDescriptor, type FilterDescriptor, type GroupDescriptor, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './CompleteExamplePage.vue?raw'

// Data
const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', price: 299.99, stock: 150, active: true },
  { id: 2, name: 'Product B', category: 'Clothing', price: 49.99, stock: 200, active: true },
  { id: 3, name: 'Product C', category: 'Electronics', price: 599.99, stock: 50, active: false },
  { id: 4, name: 'Product D', category: 'Home', price: 129.99, stock: 75, active: true },
  { id: 5, name: 'Product E', category: 'Clothing', price: 79.99, stock: 300, active: true },
  { id: 6, name: 'Product F', category: 'Electronics', price: 899.99, stock: 25, active: false },
  { id: 7, name: 'Product G', category: 'Home', price: 199.99, stock: 100, active: true },
  { id: 8, name: 'Product H', category: 'Clothing', price: 39.99, stock: 250, active: true },
  { id: 9, name: 'Product I', category: 'Electronics', price: 399.99, stock: 80, active: true },
  { id: 10, name: 'Product J', category: 'Home', price: 249.99, stock: 60, active: false },
])

// Columns
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true, resizable: true },
  { field: 'name', title: 'Product Name', sortable: true, filterable: true, editable: true },
  {
    field: 'category',
    title: 'Category',
    sortable: true,
    filterable: true,
    editable: true,
    values: [
      { text: 'Electronics', value: 'Electronics' },
      { text: 'Clothing', value: 'Clothing' },
      { text: 'Home', value: 'Home' },
    ],
  },
  {
    field: 'price',
    title: 'Price',
    sortable: true,
    filterable: true,
    editable: true,
    format: (v: any) => `$${Number(v).toFixed(2)}`,
    type: 'number',
  },
  {
    field: 'stock',
    title: 'Stock',
    sortable: true,
    filterable: true,
    editable: true,
    type: 'number',
  },
  {
    field: 'active',
    title: 'Active',
    sortable: true,
    filterable: true,
    editable: true,
    type: 'boolean',
    values: [
      { text: 'Yes', value: true },
      { text: 'No', value: false },
    ],
  },
]

// State
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(10)
const selectedKeys = ref<number[]>([])
const group = ref<GroupDescriptor[]>([])
const currentOptions = ref<any>(null)

// Refs
const gridRef = ref<InstanceType<typeof PantanalGrid>>()

// Computed
const codeSnippet = computed(() => exampleSource)

// Handlers
function handleSelectionChange(keys: number[]) {
  selectedKeys.value = keys
  console.log('Selection changed:', keys)
}

function handleEdit({ row }: { row: any }) {
  console.log('Edit started:', row)
}

function handleEditCommit({ row, field, value }: { row: any; field: string; value: any }) {
  console.log('Edit committed:', { row, field, value })
}

function handleSave({ changes }: { changes: Array<{ type: string; row: any }> }) {
  console.log('Save:', changes)
  alert(`Saved ${changes.length} change(s)`)
}

function handleCreate({ row }: { row: any }) {
  console.log('Create:', row)
  rows.value.push({ ...row, id: Math.max(...rows.value.map(r => r.id)) + 1 })
}

function handleDestroy({ row }: { row: any }) {
  console.log('Destroy:', row)
  const index = rows.value.findIndex(r => r.id === row.id)
  if (index > -1) {
    rows.value.splice(index, 1)
  }
}

function handleRowClick(row: any) {
  console.log('Row clicked:', row)
}

async function handleExportPdf() {
  try {
    await gridRef.value?.exportToPdf()
    console.log('PDF exported successfully')
  } catch (error) {
    console.error('PDF export failed:', error)
  }
}

async function handleExportExcel() {
  try {
    await gridRef.value?.exportToExcel()
    console.log('Excel exported successfully')
  } catch (error) {
    console.error('Excel export failed:', error)
  }
}

async function handleExportCSV() {
  try {
    await gridRef.value?.exportToCSV()
    console.log('CSV exported successfully')
  } catch (error) {
    console.error('CSV export failed:', error)
  }
}

function handleGetOptions() {
  currentOptions.value = gridRef.value?.getOptions()
  console.log('Current options:', currentOptions.value)
}

function handleSetOptions() {
  gridRef.value?.setOptions({
    sort: [{ field: 'price', dir: 'desc' }],
    page: 1,
    pageSize: 5,
  })
  console.log('Options set')
}

function handleSelectAll() {
  selectedKeys.value = rows.value.map(r => r.id)
}

function handleClearSelection() {
  selectedKeys.value = []
}
</script>


<template>
  <div class="space-y-4">
    <div class="flex gap-2 flex-wrap">
      <button
        @click="handleExportPdf"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
      >
        Export to PDF
      </button>
      <button
        @click="handleExportExcel"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
      >
        Export to Excel
      </button>
      <button
        @click="handleGetOptions"
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
      >
        Get Options
      </button>
    </div>

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
      :toolbar="['create', 'save', 'cancel', 'excel', 'pdf']"
      v-model:sort="sort"
      v-model:filter="filter"
      v-model:page="page"
      v-model:pageSize="pageSize"
      v-model:selectedKeys="selectedKeys"
      @selectionChange="handleSelectionChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type SortDescriptor, type FilterDescriptor, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', price: 299.99, stock: 150, active: true },
  { id: 2, name: 'Product B', category: 'Clothing', price: 49.99, stock: 200, active: true },
  { id: 3, name: 'Product C', category: 'Electronics', price: 599.99, stock: 50, active: false },
  { id: 4, name: 'Product D', category: 'Home', price: 129.99, stock: 75, active: true },
  { id: 5, name: 'Product E', category: 'Clothing', price: 79.99, stock: 300, active: true },
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
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
  },
  { field: 'stock', title: 'Stock', sortable: true, filterable: true, editable: true },
]

const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(10)
const selectedKeys = ref<number[]>([])

const gridRef = ref<InstanceType<typeof PantanalGrid>>()

function handleSelectionChange(keys: number[]) {
  console.log('Selection changed:', keys)
}

async function handleExportPdf() {
  try {
    await gridRef.value?.exportToPdf()
  } catch (error) {
    console.error('PDF export failed:', error)
  }
}

async function handleExportExcel() {
  try {
    await gridRef.value?.exportToExcel()
  } catch (error) {
    console.error('Excel export failed:', error)
  }
}

function handleGetOptions() {
  const options = gridRef.value?.getOptions()
  console.log('Current options:', options)
  alert(`Current page: ${options?.page}, Page size: ${options?.pageSize}`)
}
</script>


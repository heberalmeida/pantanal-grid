<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor, type AggregateName } from '@pantanal/grid'

// Basic Grouping
const basicRows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', brand: 'Brand X', price: 29.99, stock: 150 },
  { id: 2, name: 'Product B', category: 'Electronics', brand: 'Brand X', price: 49.99, stock: 75 },
  { id: 3, name: 'Product C', category: 'Electronics', brand: 'Brand Y', price: 19.99, stock: 200 },
  { id: 4, name: 'Product D', category: 'Electronics', brand: 'Brand Y', price: 39.99, stock: 50 },
  { id: 5, name: 'Product E', category: 'Clothing', brand: 'Brand X', price: 39.99, stock: 50 },
  { id: 6, name: 'Product F', category: 'Clothing', brand: 'Brand X', price: 59.99, stock: 100 },
  { id: 7, name: 'Product G', category: 'Clothing', brand: 'Brand Z', price: 24.99, stock: 300 },
  { id: 8, name: 'Product H', category: 'Accessories', brand: 'Brand X', price: 14.99, stock: 200 }
])

const basicColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'brand', title: 'Brand', width: 150 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'stock', title: 'Stock', width: 100 }
]

const basicGroup = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' }
])

// Multi-Level Grouping with Aggregates
const multiRows = ref([...basicRows.value])
const multiColumns: ColumnDef[] = [...basicColumns]

const multiGroup = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' },
  { field: 'brand', dir: 'asc' }
])

const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum'],
  id: ['count']
}

// Grouping with Sorting
const sortedRows = ref([...basicRows.value])
const sortedColumns: ColumnDef[] = [...basicColumns]
const sortedGroup = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'desc' }
])
</script>

<template>
  <div class="space-y-8">
    <!-- Basic Grouping -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Basic Grouping</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Group data by a single column. Click group headers to expand or collapse groups.
      </p>
      <PantanalGrid
        :rows="basicRows"
        :columns="basicColumns"
        key-field="id"
        :group="basicGroup"
        :height="400"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Multi-Level Grouping with Aggregates -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Multi-Level Grouping with Aggregates</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Group data by multiple columns (category, then brand). Group footers show aggregate values (sum, average, count).
        Click group headers to expand or collapse groups.
      </p>
      <PantanalGrid
        :rows="multiRows"
        :columns="multiColumns"
        key-field="id"
        :group="multiGroup"
        :aggregates="aggregates"
        :show-group-footers="true"
        :height="500"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Grouping with Sorting -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Grouping with Sorting</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Groups can be sorted in ascending or descending order. Set the <code>dir</code> property to <code>'asc'</code> or <code>'desc'</code>.
      </p>
      <PantanalGrid
        :rows="sortedRows"
        :columns="sortedColumns"
        key-field="id"
        :group="sortedGroup"
        :height="400"
        locale="en"
        responsive="table"
      />
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
</style>









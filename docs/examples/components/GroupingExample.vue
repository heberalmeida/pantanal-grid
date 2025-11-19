<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor, type AggregateName } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', brand: 'Brand X', price: 29.99, stock: 150 },
  { id: 2, name: 'Product B', category: 'Electronics', brand: 'Brand X', price: 49.99, stock: 75 },
  { id: 3, name: 'Product C', category: 'Electronics', brand: 'Brand Y', price: 19.99, stock: 200 },
  { id: 4, name: 'Product D', category: 'Electronics', brand: 'Brand Y', price: 39.99, stock: 50 },
  { id: 5, name: 'Product E', category: 'Clothing', brand: 'Brand X', price: 39.99, stock: 50 },
  { id: 6, name: 'Product F', category: 'Clothing', brand: 'Brand X', price: 59.99, stock: 100 },
  { id: 7, name: 'Product G', category: 'Clothing', brand: 'Brand Z', price: 24.99, stock: 300 },
  { id: 8, name: 'Product H', category: 'Accessories', brand: 'Brand X', price: 14.99, stock: 200 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Product Name' },
  { field: 'category', title: 'Category' },
  { field: 'brand', title: 'Brand' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'stock', title: 'Stock' }
]

const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' },
  { field: 'brand', dir: 'asc' }
])

const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum'],
  id: ['count']
}
</script>

<template>
  <div>
    <p class="mb-4 text-sm text-gray-600">
      Data is grouped by category and brand. Click group headers to expand or collapse groups. 
      Group footers show aggregate values (sum, average, count).
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :group="group"
      :aggregates="aggregates"
      :show-group-footers="true"
      :height="500"
      locale="en"
      responsive="table"
    />
  </div>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-600 {
  color: #4b5563;
}
</style>










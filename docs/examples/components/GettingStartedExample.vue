<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics', stock: 50 },
  { id: 5, name: 'Product E', price: 59.99, category: 'Clothing', stock: 100 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true },
  { field: 'price', title: 'Price', sortable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', filterable: true },
  { field: 'stock', title: 'Stock', sortable: true }
]
</script>

<template>
  <div class="getting-started-example">
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      A simple grid with sorting, filtering, and formatting. Try clicking column headers to sort, or use the filter inputs.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      locale="en"
      :height="350"
      responsive="table"
    />
  </div>
</template>

<style scoped>
.getting-started-example {
  padding: 1rem;
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

.mb-4 {
  margin-bottom: 1rem;
}
</style>



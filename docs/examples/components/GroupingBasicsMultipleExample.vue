<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', brand: 'Brand X', price: 29.99, stock: 150 },
  { id: 2, name: 'Product B', category: 'Electronics', brand: 'Brand X', price: 49.99, stock: 75 },
  { id: 3, name: 'Product C', category: 'Electronics', brand: 'Brand Y', price: 19.99, stock: 200 },
  { id: 4, name: 'Product D', category: 'Clothing', brand: 'Brand X', price: 39.99, stock: 50 },
  { id: 5, name: 'Product E', category: 'Clothing', brand: 'Brand Z', price: 59.99, stock: 100 },
  { id: 6, name: 'Product F', category: 'Accessories', brand: 'Brand X', price: 14.99, stock: 200 }
])

const columns: ColumnDef[] = [
  { field: 'name', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'brand', title: 'Brand', width: 150 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'stock', title: 'Stock', width: 100 }
]
</script>

<template>
  <div class="grouping-example">
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Drag "Category" first, then drag "Brand" to create nested groups (Category → Brand).
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      groupable
      key-field="id"
      locale="en"
      :height="400"
      responsive="table"
    />
  </div>
</template>

<style scoped>
.grouping-example {
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


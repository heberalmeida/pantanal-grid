<script setup lang="ts">
import { ref } from 'vue'
import { PantanalSimpleGrid, useGrid } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics', stock: 50 },
  { id: 5, name: 'Product E', price: 59.99, category: 'Clothing', stock: 100 }
])

const { sort, filter, page, pageSize, gridProps } = useGrid({
  rows,
  keyField: 'id',
  preset: 'interactive',
  locale: 'en',
  columns: [
    { field: 'id', title: 'ID', width: 80 },
    { field: 'name', title: 'Name' },
    { field: 'price', title: 'Price', format: 'currency' },
    { field: 'category', title: 'Category' },
    { field: 'stock', title: 'Stock', type: 'number' },
  ],
})
</script>

<template>
  <div class="getting-started-example">
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Simple API with <code>useGrid</code> and <code>PantanalSimpleGrid</code>. Sorting, filtering, pagination and keyboard navigation come from the <code>interactive</code> preset.
    </p>
    <PantanalSimpleGrid
      v-bind="gridProps"
      v-model:sort="sort"
      v-model:filter="filter"
      v-model:page="page"
      v-model:page-size="pageSize"
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

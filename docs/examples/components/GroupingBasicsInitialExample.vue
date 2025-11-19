<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', brand: 'Brand X', price: 29.99 },
  { id: 2, name: 'Product B', category: 'Electronics', brand: 'Brand Y', price: 49.99 },
  { id: 3, name: 'Product C', category: 'Clothing', brand: 'Brand X', price: 19.99 },
  { id: 4, name: 'Product D', category: 'Clothing', brand: 'Brand Z', price: 39.99 }
])

const columns: ColumnDef[] = [
  { field: 'name', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'brand', title: 'Brand', width: 150 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` }
]

// Start with initial grouping by category
const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' }
])
</script>

<template>
  <div class="grouping-example">
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      The grid starts with initial grouping by category. You can still drag columns to add more groups or remove existing ones.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      groupable
      :group="group"
      key-field="id"
      locale="en"
      :height="350"
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


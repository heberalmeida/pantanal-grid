<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', brand: 'Brand X', price: 29.99 },
  { id: 2, name: 'Product B', category: 'Electronics', brand: 'Brand Y', price: 49.99 },
  { id: 3, name: 'Product C', category: 'Clothing', brand: 'Brand X', price: 19.99 },
  { id: 4, name: 'Product D', category: 'Clothing', brand: 'Brand Z', price: 39.99 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, groupable: false }, // Cannot be grouped
  { field: 'name', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}`, groupable: false }, // Cannot be grouped
  { field: 'brand', title: 'Brand', width: 150 }
]
</script>

<template>
  <div class="grouping-example">
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Try dragging columns. Notice that "ID" and "Price" columns cannot be dragged to the drop zone because they have <code>groupable: false</code>.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      groupable
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

code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.dark code {
  background-color: #374151;
}
</style>


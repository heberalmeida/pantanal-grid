<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150, actions: '...' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75, actions: '...' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200, actions: '...' },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics', stock: 50, actions: '...' }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, pinned: 'left' },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'stock', title: 'Stock', width: 100 },
  { field: 'actions', title: 'Actions', width: 120, pinned: 'right' }
]
</script>

<template>
  <div>
    <p class="mb-4 text-sm text-gray-600">
      Drag column borders to resize. Drag column headers to reorder. 
      ID column is pinned left, Actions column is pinned right.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :enable-column-resize="true"
      :enable-column-reorder="true"
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









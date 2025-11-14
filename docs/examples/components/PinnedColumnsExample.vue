<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref(Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100,
  category: ['Electronics', 'Clothing', 'Accessories'][i % 3],
  stock: Math.floor(Math.random() * 1000),
  actions: '...'
})))

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
      Scroll horizontally to see pinned columns in action. ID column is pinned left, 
      Actions column is pinned right. These columns remain visible while scrolling.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :height="400"
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






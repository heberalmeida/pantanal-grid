<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const allRows = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100,
  category: ['Electronics', 'Clothing', 'Accessories'][i % 3]
}))

const rows = ref(allRows)
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Product Name' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category' }
]

const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <div>
    <p class="mb-4 text-sm text-gray-600">
      Navigate through pages using the pagination controls. Try changing the page size.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      v-model:page="page"
      v-model:pageSize="pageSize"
      :pageable="true"
      :pageable-page-sizes="[5, 10, 20, 50]"
      :pageable-numeric="true"
      :pageable-button-count="5"
      :height="400"
      locale="en"
      responsive="table"
    />
    <div class="mt-4 text-sm">
      <strong>Current page:</strong> {{ page }} | 
      <strong>Page size:</strong> {{ pageSize }} | 
      <strong>Total items:</strong> {{ rows.length }}
    </div>
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
.mt-4 {
  margin-top: 1rem;
}
</style>


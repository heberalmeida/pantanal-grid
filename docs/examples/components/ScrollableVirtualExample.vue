<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100,
  category: ['Electronics', 'Clothing', 'Accessories', 'Home', 'Sports'][i % 5],
  inStock: i % 3 !== 0
})))

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true },
  { field: 'price', title: 'Price', sortable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', filterable: true },
  { field: 'inStock', title: 'In Stock', width: 100 }
]
</script>

<template>
  <div>
    <p class="mb-4 text-sm text-gray-600">
      Virtual scrolling with 10,000 rows using <code>scrollable-virtual</code> prop.
      Only visible rows are rendered for optimal performance. Scroll through the data to see smooth performance.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      scrollable-virtual
      :height="420"
      :row-height="44"
      locale="en"
      responsive="table"
      sortable
      filterable
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
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
</style>


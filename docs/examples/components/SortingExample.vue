<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics', stock: 50 },
  { id: 5, name: 'Product E', price: 59.99, category: 'Clothing', stock: 100 },
  { id: 6, name: 'Product F', price: 24.99, category: 'Accessories', stock: 300 },
  { id: 7, name: 'Product G', price: 69.99, category: 'Electronics', stock: 25 },
  { id: 8, name: 'Product H', price: 34.99, category: 'Clothing', stock: 120 }
])

const columns: ColumnDef[] = [
  { 
    field: 'id', 
    title: 'ID', 
    width: 80, 
    sortable: true 
  },
  { 
    field: 'name', 
    title: 'Product Name', 
    sortable: true 
  },
  { 
    field: 'price', 
    title: 'Price', 
    sortable: true,
    format: (v: number) => `$${v.toFixed(2)}`
  },
  { 
    field: 'category', 
    title: 'Category', 
    sortable: true 
  },
  { 
    field: 'stock', 
    title: 'Stock', 
    sortable: true 
  }
]

const sort = ref<SortDescriptor[]>([])
</script>

<template>
  <div>
    <p class="mb-4 text-sm text-gray-600">
      Click column headers to sort. Try multiple column sorting by holding Shift and clicking.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      v-model:sort="sort"
      sortable-mode="multiple"
      :sortable-show-indexes="true"
      :height="400"
      locale="en"
      responsive="table"
    />
    <div v-if="sort.length > 0" class="mt-4 text-sm">
      <strong>Current sort:</strong>
      <ul class="list-disc list-inside">
        <li v-for="(s, idx) in sort" :key="idx">
          {{ s.field }} ({{ s.dir }})
        </li>
      </ul>
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
.list-disc {
  list-style-type: disc;
}
.list-inside {
  list-style-position: inside;
}
</style>


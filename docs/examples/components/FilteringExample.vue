<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type FilterDescriptor } from '@pantanal/grid'

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
    filterable: true,
    filterableMode: 'row'
  },
  { 
    field: 'name', 
    title: 'Product Name', 
    filterable: true,
    filterableMode: 'row'
  },
  { 
    field: 'price', 
    title: 'Price', 
    filterable: true,
    filterableMode: 'row'
  },
  { 
    field: 'category', 
    title: 'Category', 
    filterable: true,
    filterableMode: 'row',
    filterableUI: 'dropdown',
    filterableOptions: [
      { value: 'Electronics', label: 'Electronics' },
      { value: 'Clothing', label: 'Clothing' },
      { value: 'Accessories', label: 'Accessories' }
    ]
  },
  { 
    field: 'stock', 
    title: 'Stock', 
    filterable: true,
    filterableMode: 'row'
  }
]

const filter = ref<FilterDescriptor[]>([])
</script>

<template>
  <div>
    <p class="mb-4 text-sm text-gray-600">
      Use the filter inputs in the header row to filter data. Try filtering by name, price, or category.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      v-model:filter="filter"
      :height="400"
      locale="en"
      responsive="table"
    />
    <div v-if="filter.length > 0" class="mt-4 text-sm">
      <strong>Active filters:</strong>
      <pre class="mt-2 p-2 bg-gray-100 rounded text-xs">{{ JSON.stringify(filter, null, 2) }}</pre>
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
.mt-2 {
  margin-top: 0.5rem;
}
.p-2 {
  padding: 0.5rem;
}
.bg-gray-100 {
  background-color: #f3f4f6;
}
.rounded {
  border-radius: 0.25rem;
}
.text-xs {
  font-size: 0.75rem;
}
</style>


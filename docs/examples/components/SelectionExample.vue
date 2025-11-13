<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories' },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics' },
  { id: 5, name: 'Product E', price: 59.99, category: 'Clothing' },
  { id: 6, name: 'Product F', price: 24.99, category: 'Accessories' }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Product Name' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category' }
]

const selectedKeys = ref<number[]>([])

function handleSelectionChange(keys: number[]) {
  selectedKeys.value = keys
}
</script>

<template>
  <div>
    <p class="mb-4 text-sm text-gray-600">
      Select rows using the checkboxes. Try selecting multiple rows.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      selectable="multiple"
      @selectionChange="handleSelectionChange"
      :height="300"
      locale="en"
      responsive="table"
    />
    <div v-if="selectedKeys.length > 0" class="mt-4 text-sm">
      <strong>Selected rows ({{ selectedKeys.length }}):</strong>
      <div class="mt-2">
        <span v-for="(key, idx) in selectedKeys" :key="key" class="inline-block mr-2 px-2 py-1 bg-blue-100 rounded">
          ID: {{ key }}
        </span>
      </div>
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
.mr-2 {
  margin-right: 0.5rem;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.bg-blue-100 {
  background-color: #dbeafe;
}
.rounded {
  border-radius: 0.25rem;
}
.inline-block {
  display: inline-block;
}
</style>


<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', editable: true },
  { 
    field: 'price', 
    title: 'Price', 
    editable: true,
    format: (v: number) => `$${v.toFixed(2)}`,
    validation: {
      required: true,
      min: 0
    }
  },
  { field: 'category', title: 'Category', editable: true },
  { field: 'stock', title: 'Stock', editable: true },
  {
    field: 'command',
    title: 'Actions',
    width: 150,
    command: ['edit', 'destroy']
  }
]

function handleDestroy(row: any) {
  const index = rows.value.findIndex(r => r.id === row.id)
  if (index !== -1) {
    rows.value.splice(index, 1)
  }
}
</script>

<template>
  <div>
    <p class="mb-4 text-sm text-gray-600">
      Click on editable cells to modify values. Use the Edit button to enter edit mode for a row.
      Use the Delete button to remove rows. Price must be positive.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :editable="true"
      :toolbar="['save', 'cancel']"
      @destroy="handleDestroy"
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






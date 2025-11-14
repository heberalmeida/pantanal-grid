<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, status: 'active', rating: 4.5 },
  { id: 2, name: 'Product B', price: 49.99, status: 'inactive', rating: 3.8 },
  { id: 3, name: 'Product C', price: 19.99, status: 'active', rating: 4.2 },
  { id: 4, name: 'Product D', price: 39.99, status: 'active', rating: 5.0 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  {
    field: 'price',
    title: 'Price',
    template: ({ value }) => `<strong style="color: #2563eb;">$${value.toFixed(2)}</strong>`
  },
  {
    field: 'status',
    title: 'Status',
    template: ({ value }) => {
      const color = value === 'active' ? '#10b981' : '#ef4444'
      return `<span style="color: ${color}; font-weight: 600;">${value}</span>`
    }
  },
  {
    field: 'rating',
    title: 'Rating',
    template: ({ value }) => {
      const stars = '⭐'.repeat(Math.floor(value))
      return `<div>${stars} ${value}/5</div>`
    }
  }
]
</script>

<template>
  <div>
    <p class="mb-4 text-sm text-gray-600">
      Custom cell templates with formatting and styling. Price is styled in blue, 
      status uses color coding, and rating displays stars.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
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






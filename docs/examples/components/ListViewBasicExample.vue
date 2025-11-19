<template>
  <PantanalListView
    :data-source="items"
    :template="template"
    :auto-bind="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalListView } from '@pantanal/grid'

const items = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories' },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics' },
])

const template = (item: any) => `
  <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem;">
    <div>
      <strong>${item.name}</strong>
      <div style="color: #6b7280; font-size: 0.875rem;">${item.category}</div>
    </div>
    <div style="font-weight: bold; color: #059669;">$${item.price.toFixed(2)}</div>
  </div>
`
</script>


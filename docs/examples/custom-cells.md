# Custom Cells

Demonstrates custom cell templates with formatting and styling.

<ExamplePreview>
  <CustomCellsCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import CustomCellsCompleteExample from './components/CustomCellsCompleteExample.vue'
import CustomCellsExample from './components/CustomCellsExample.vue'
</script>

## Basic Custom Cells

<ExamplePreview>
  <CustomCellsExample />
</ExamplePreview>

## Code

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, status: 'active', rating: 4.5 },
  { id: 2, name: 'Product B', price: 49.99, status: 'inactive', rating: 3.8 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  {
    field: 'price',
    title: 'Price',
    template: ({ value }) => `<strong class="text-blue-600">$${value.toFixed(2)}</strong>`
  },
  {
    field: 'status',
    title: 'Status',
    template: ({ value }) => {
      const color = value === 'active' ? 'green' : 'red'
      return `<span class="text-${color}-500 font-semibold">${value}</span>`
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
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    locale="en"
    responsive="table"
  />
</template>
```

## Features Demonstrated

- **Custom formatting**: Price with custom styling
- **Conditional styling**: Status with color coding
- **Complex templates**: Rating with stars


# Responsive Cards

Demonstrates responsive card layout for mobile devices.

<ExamplePreview>
  <ResponsiveCardsCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import ResponsiveCardsCompleteExample from './components/ResponsiveCardsCompleteExample.vue'
</script>

## Code

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category' },
  { field: 'stock', title: 'Stock' }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    responsive="cards"
    :card-breakpoint="768"
    locale="en"
  />
</template>
```

## Features

- Automatic card layout on mobile
- Table layout on desktop
- Responsive breakpoint configuration


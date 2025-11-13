# Pinned Columns Example

Demonstrates columns pinned to the left and right sides of the grid.

<ExamplePreview>
  <PinnedColumnsExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import PinnedColumnsExample from './components/PinnedColumnsExample.vue'
</script>

## Code

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref(Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100,
  category: ['Electronics', 'Clothing', 'Accessories'][i % 3],
  stock: Math.floor(Math.random() * 1000),
  actions: '...'
})))

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, pinned: 'left' },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'price', title: 'Price', width: 120 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'stock', title: 'Stock', width: 100 },
  { field: 'actions', title: 'Actions', width: 120, pinned: 'right' }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :height="400"
    locale="en"
    responsive="table"
  />
</template>
```

## Features Demonstrated

- **Pinned left**: ID column stays visible when scrolling horizontally
- **Pinned right**: Actions column stays visible when scrolling horizontally
- **Scrollable middle**: Other columns scroll normally




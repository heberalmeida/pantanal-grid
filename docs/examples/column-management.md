# Column Management

Demonstrates column resizing, reordering, and pinned columns.

<ExamplePreview>
  <ColumnManagementCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import ColumnManagementCompleteExample from './components/ColumnManagementCompleteExample.vue'
import ColumnManagementExample from './components/ColumnManagementExample.vue'
</script>

## Basic Column Management

<ExamplePreview>
  <ColumnManagementExample />
</ExamplePreview>

## Code

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150, actions: '...' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75, actions: '...' }
])

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
    :enable-column-resize="true"
    :enable-column-reorder="true"
    locale="en"
    responsive="table"
  />
</template>
```

## Features Demonstrated

- **Column resizing**: Drag column borders to resize
- **Column reordering**: Drag column headers to reorder
- **Pinned columns**: ID column pinned left, Actions pinned right


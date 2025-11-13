# Basic Grid

A simple grid example with basic features enabled.

<ExamplePreview>
  <BasicExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import BasicExample from './components/BasicExample.vue'
</script>

## Code

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

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
    sortable: true, 
    filterable: true,
    resizable: true
  },
  { 
    field: 'name', 
    title: 'Product Name', 
    sortable: true, 
    filterable: true,
    resizable: true
  },
  { 
    field: 'price', 
    title: 'Price', 
    sortable: true, 
    filterable: true,
    format: (v: number) => `$${v.toFixed(2)}`,
    resizable: true
  },
  { 
    field: 'category', 
    title: 'Category', 
    filterable: true,
    resizable: true
  },
  { 
    field: 'stock', 
    title: 'Stock', 
    sortable: true,
    resizable: true
  }
]

const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    v-model:sort="sort"
    v-model:filter="filter"
    v-model:page="page"
    v-model:pageSize="pageSize"
    :height="400"
    locale="en"
  />
</template>
```

## Features Demonstrated

- **Sorting**: Click column headers to sort
- **Filtering**: Use filter inputs in the header row
- **Pagination**: Navigate through pages
- **Column Resizing**: Drag column borders to resize
- **Responsive**: Works on different screen sizes

## Column Configuration

### Basic Column

```vue
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 }
]
```

### Sortable Column

```vue
const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', sortable: true }
]
```

### Filterable Column

```vue
const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', filterable: true }
]
```

### Resizable Column

```vue
const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', resizable: true }
]
```

### Formatted Column

```vue
const columns: ColumnDef[] = [
  { 
    field: 'price', 
    title: 'Price', 
    format: (v: number) => `$${v.toFixed(2)}` 
  }
]
```

## State Management

The grid uses v-model for two-way binding of state:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  v-model:sort="sort"
  v-model:filter="filter"
  v-model:page="page"
  v-model:pageSize="pageSize"
/>
```

## Responsive Behavior

The grid automatically adapts to different screen sizes:

- **Desktop**: Table layout
- **Tablet**: Table layout (may scroll horizontally)
- **Mobile**: Card layout (when `responsive="auto"` or `responsive="cards"`)

## See Also

- [Getting Started Guide](/guide/getting-started) - Quick start tutorial
- [PantanalGrid API](/api/grid) - Complete API reference


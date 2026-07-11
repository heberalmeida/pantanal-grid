# Quick Start

This guide will walk you through creating your first Pantanal Grid with common features enabled.

## Simple API (recommended)

For most apps, use `useGrid` + `PantanalSimpleGrid` instead of configuring dozens of props manually:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalSimpleGrid, useGrid } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99 },
  { id: 2, name: 'Product B', price: 49.99 },
])

const { sort, filter, page, pageSize, gridProps } = useGrid({
  rows,
  keyField: 'id',
  preset: 'interactive',
  columns: [
    { field: 'id', width: 80 },
    { field: 'name' },
    { field: 'price', format: 'currency' },
  ],
})
</script>

<template>
  <PantanalSimpleGrid
    v-bind="gridProps"
    v-model:sort="sort"
    v-model:filter="filter"
    v-model:page="page"
    v-model:page-size="pageSize"
    :height="400"
  />
</template>
```

### Presets

| Preset | Use case |
|--------|----------|
| `minimal` | Read-only table with sort, filter and pagination |
| `interactive` | Default dashboard grid with keyboard navigation |
| `selectable` | Interactive grid + multiple row selection |
| `server` | Server-side paging, sort and filter |
| `readonly` | Display-only, no interaction |

Override any preset default by passing the prop directly to `PantanalSimpleGrid`.

## Basic Example

Here's a minimal working example using the full API:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics', stock: 50 },
  { id: 5, name: 'Product E', price: 59.99, category: 'Clothing', stock: 100 }
])

const columns: ColumnDef[] = [
  { 
    field: 'id', 
    title: 'ID', 
    width: 80, 
    sortable: true, 
    filterable: true 
  },
  { 
    field: 'name', 
    title: 'Product Name', 
    sortable: true, 
    filterable: true 
  },
  { 
    field: 'price', 
    title: 'Price', 
    sortable: true, 
    filterable: true,
    format: (v: number) => `$${v.toFixed(2)}`
  },
  { 
    field: 'category', 
    title: 'Category', 
    filterable: true 
  },
  { 
    field: 'stock', 
    title: 'Stock', 
    sortable: true 
  }
]

const sort = ref<SortDescriptor[]>([])
const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    v-model:sort="sort"
    v-model:page="page"
    v-model:pageSize="pageSize"
    :height="400"
    locale="en"
  />
</template>
```

## With Sorting and Filtering

Enable sorting and filtering:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

const rows = ref([/* ... your data ... */])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true, filterable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true },
  { field: 'price', title: 'Price', sortable: true, filterable: true },
  { field: 'category', title: 'Category', filterable: true }
]

const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    v-model:sort="sort"
    v-model:filter="filter"
    :height="400"
  />
</template>
```

## With Pagination

Add pagination controls:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([/* ... your data ... */])
const columns: ColumnDef[] = [/* ... your columns ... */]

const page = ref(1)
const pageSize = ref(20)
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    v-model:page="page"
    v-model:pageSize="pageSize"
    :pageable="true"
    :pageable-page-sizes="[10, 20, 50, 100]"
    :height="400"
  />
</template>
```

## With Selection

Enable row selection:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([/* ... your data ... */])
const columns: ColumnDef[] = [/* ... your columns ... */]

const selectedKeys = ref<number[]>([])

function handleSelectionChange(keys: number[]) {
  selectedKeys.value = keys
  console.log('Selected rows:', keys)
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    selectable="multiple"
    @selectionChange="handleSelectionChange"
    :height="400"
  />
</template>
```

## Complete Example

Here's a complete example with multiple features:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 29.99, category: 'Electronics', stock: 150 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 75 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Accessories', stock: 200 },
  { id: 4, name: 'Product D', price: 39.99, category: 'Electronics', stock: 50 },
  { id: 5, name: 'Product E', price: 59.99, category: 'Clothing', stock: 100 }
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
const selectedKeys = ref<number[]>([])
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
    selectable="multiple"
    @selectionChange="selectedKeys = $event"
    :enable-column-resize="true"
    :enable-column-reorder="true"
    :height="400"
    locale="en"
    persist-state-key="my-grid-state"
  />
</template>
```

## Next Steps

- Explore [Sorting](/guide/sorting) features
- Learn about [Filtering](/guide/filtering)
- Check out [Pagination](/guide/pagination) options
- See more [Examples](/examples/basic)










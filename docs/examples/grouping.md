# Grouping

Pantanal Grid supports multi-level grouping with aggregates, group footers, and expandable/collapsible groups.

<ExamplePreview>
  <GroupingCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import GroupingCompleteExample from './components/GroupingCompleteExample.vue'
</script>

## Code

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor, type AggregateName } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', brand: 'Brand X', price: 29.99, stock: 150 },
  { id: 2, name: 'Product B', category: 'Electronics', brand: 'Brand X', price: 49.99, stock: 75 },
  { id: 3, name: 'Product C', category: 'Electronics', brand: 'Brand Y', price: 19.99, stock: 200 },
  { id: 4, name: 'Product D', category: 'Electronics', brand: 'Brand Y', price: 39.99, stock: 50 },
  { id: 5, name: 'Product E', category: 'Clothing', brand: 'Brand X', price: 39.99, stock: 50 },
  { id: 6, name: 'Product F', category: 'Clothing', brand: 'Brand X', price: 59.99, stock: 100 },
  { id: 7, name: 'Product G', category: 'Clothing', brand: 'Brand Z', price: 24.99, stock: 300 },
  { id: 8, name: 'Product H', category: 'Accessories', brand: 'Brand X', price: 14.99, stock: 200 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Product Name' },
  { field: 'category', title: 'Category' },
  { field: 'brand', title: 'Brand' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'stock', title: 'Stock' }
]

const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' },
  { field: 'brand', dir: 'asc' }
])

const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum'],
  id: ['count']
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :group="group"
    :aggregates="aggregates"
    :show-group-footers="true"
    :height="500"
    locale="en"
    responsive="table"
  />
</template>
```

## Basic Grouping

Group data by a single column:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type GroupDescriptor } from '@pantanal/grid'

const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' }
])
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :group="group"
  />
</template>
```

## Multi-Level Grouping

Group by multiple columns in a hierarchy:

```vue
<script setup lang="ts">
const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' },
  { field: 'brand', dir: 'asc' }
])
</script>
```

## Aggregates

Calculate aggregate values for grouped data:

```vue
<script setup lang="ts">
import { type AggregateName } from '@pantanal/grid'

const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum'],
  id: ['count']
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :group="group"
    :aggregates="aggregates"
    :show-group-footers="true"
  />
</template>
```

## Available Aggregates

- `sum`: Sum of values
- `avg`: Average of values
- `min`: Minimum value
- `max`: Maximum value
- `count`: Count of items

## Group Footers

Show aggregate values in group footer rows:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :group="group"
  :aggregates="aggregates"
  :show-group-footers="true"
/>
```

## Expand/Collapse

Groups are expandable/collapsible by default. Click group headers to toggle:

- **Click header**: Expand/collapse group
- **Keyboard**: Use `Enter` when focused on group header

## Sort Direction

Control group sort direction:

```vue
const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' },  // Ascending
  { field: 'brand', dir: 'desc' }     // Descending
])
```

## Server-Side Grouping

For large datasets, perform grouping on the server:

```vue
<script setup lang="ts">
const dataProvider: DataProvider = async (args) => {
  // Send group descriptors to server
  const params = new URLSearchParams({
    group: JSON.stringify(args.group)
  })
  
  const response = await fetch(`/api/data?${params}`)
  const data = await response.json()
  
  return {
    rows: data.items,
    total: data.total
  }
}
</script>
```

## See Also

- [Grouping Guide](/guide/grouping) - Complete grouping documentation
- [Aggregates API](/api/types) - Aggregate types reference


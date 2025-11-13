# Grouping

Pantanal Grid supports multi-level grouping with optional aggregations and group footers. Group rows can be expanded and collapsed to show or hide their child rows.

## Basic Grouping

Enable grouping by providing a `group` prop with an array of `GroupDescriptor`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', brand: 'Brand X', price: 29.99 },
  { id: 2, name: 'Product B', category: 'Electronics', brand: 'Brand Y', price: 49.99 },
  { id: 3, name: 'Product C', category: 'Clothing', brand: 'Brand X', price: 19.99 },
  { id: 4, name: 'Product D', category: 'Clothing', brand: 'Brand Z', price: 39.99 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'category', title: 'Category' },
  { field: 'brand', title: 'Brand' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` }
]

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
    :height="400"
  />
</template>
```

## Multi-Level Grouping

Group by multiple fields to create nested groups:

```vue
<script setup lang="ts">
const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' },
  { field: 'brand', dir: 'asc' }
])
</script>
```

This creates groups first by category, then by brand within each category.

## Group Direction

Control the sort direction for each group level:

```vue
<script setup lang="ts">
const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' },   // Ascending
  { field: 'brand', dir: 'desc' }      // Descending
])
</script>
```

## Aggregates

Calculate aggregate values for grouped data:

```vue
<script setup lang="ts">
import type { AggregateName } from '@pantanal/grid'

const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
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
  />
</template>
```

### Available Aggregate Functions

- `sum` - Sum of values
- `avg` - Average of values
- `min` - Minimum value
- `max` - Maximum value
- `count` - Count of items

## Group Footers

Show aggregate values in group footers:

```vue
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

## Custom Group Headers

Customize group header display using `groupHeaderTemplate`:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'category',
    title: 'Category',
    groupHeaderTemplate: (group) => {
      return `<strong>${group.field}: ${group.value}</strong> (${group.items.length} items)`
    }
  }
]
</script>
```

## Custom Group Footers

Customize group footer display using `groupFooterTemplate`:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'price',
    title: 'Price',
    groupFooterTemplate: (group) => {
      const sum = group.aggregates?.price_sum || 0
      const avg = group.aggregates?.price_avg || 0
      return `Total: $${sum.toFixed(2)} | Avg: $${avg.toFixed(2)}`
    }
  }
]
</script>
```

## Expand/Collapse Groups

Groups are collapsed by default. Users can click the expand/collapse button to toggle visibility. You can also programmatically control expansion:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const expandedGroups = ref<Set<string>>(new Set())

function handleToggleGroup(key: string, expanded: boolean) {
  if (expanded) {
    expandedGroups.value.add(key)
  } else {
    expandedGroups.value.delete(key)
  }
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :group="group"
    @toggleGroup="handleToggleGroup"
  />
</template>
```

## Expand All / Collapse All

The grid provides buttons in the footer to expand or collapse all groups at once when grouping is enabled.

## Column Grouping Options

### Disable Grouping for a Column

Prevent a column from being grouped:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'id',
    title: 'ID',
    groupable: false  // Cannot be grouped
  }
]
</script>
```

### Custom Group Sort

Provide a custom sort function for grouping:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'category',
    title: 'Category',
    groupableSortCompare: (a, b) => {
      // Custom comparison logic
      return a.localeCompare(b)
    },
    groupableSortDir: 'asc'
  }
]
</script>
```

## Server-Side Grouping

For server-side grouping, compute groups and aggregates on the backend and provide pre-grouped data:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type GroupDescriptor } from '@pantanal/grid'

const rows = ref([/* pre-grouped data from server */])
const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' }
])

async function fetchGroupedData() {
  const response = await fetch('/api/products?group=category')
  const data = await response.json()
  rows.value = data.rows
}
</script>
```

## Complete Example

Here's a complete example with multi-level grouping and aggregates:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor, type AggregateName } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', brand: 'Brand X', price: 29.99, stock: 150 },
  { id: 2, name: 'Product B', category: 'Electronics', brand: 'Brand X', price: 49.99, stock: 75 },
  { id: 3, name: 'Product C', category: 'Electronics', brand: 'Brand Y', price: 19.99, stock: 200 },
  { id: 4, name: 'Product D', category: 'Clothing', brand: 'Brand X', price: 39.99, stock: 50 },
  { id: 5, name: 'Product E', category: 'Clothing', brand: 'Brand Z', price: 59.99, stock: 100 }
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
  />
</template>
```

## Tips

- Group headers render full-width rows with the field/value and aggregate count
- Use the built-in footer buttons (or `toggleGroup` event) to expand/collapse all groups at once
- For server-side grouping, compute aggregates on the backend and feed the grid with pre-grouped rows
- Custom templates allow you to style group headers and footers to match your design
- Use `groupable: false` to prevent certain columns from being grouped




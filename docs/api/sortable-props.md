---
title: sortableProps API
description: "API Index | sortableProps"
api_reference: true
slug: api_grid_sortableprops
---

# SortableProps

The `sortableProps` provide fine-grained control over sorting behavior in the Pantanal Grid component.

## sortable-allow-unsort `Boolean`

If `sortable-allow-unsort` is set to `true`, the user can get the Grid in unsorted state by clicking the sorted column header.

### Behavior

- When `true`: Clicking a sorted column cycles through: ascending → descending → unsorted
- When `false`: Clicking a sorted column cycles through: ascending → descending → ascending (no unsorted state)

### Default Value

`true`

### Usage

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    :sortable-allow-unsort="true"
  />
</template>
```

### Example: Disable Unsort

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    :sortable-allow-unsort="false"
  />
</template>
```

## sortable-show-indexes `Boolean`

If `sortable-show-indexes` is set to `true`, the user will see the sort sequence indicators for the sorted columns when using multiple column sorting.

### Behavior

- Only relevant when `sortable-mode` is set to `'multiple'`
- Displays numeric indicators (1, 2, 3...) showing the sort priority
- Helps users understand the order of multiple sorts

### Default Value

`false`

### Usage

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    sortable-mode="multiple"
    :sortable-show-indexes="true"
  />
</template>
```

## sortable-initial-direction `String`

Determines the initial (from unsorted to sorted state) sort direction.

### Supported Values

- `'asc'` - Ascending order (default)
- `'desc'` - Descending order

### Behavior

- Applies when a column is first clicked to enable sorting
- Subsequent clicks follow the normal sort cycle
- Can be overridden by column-level `sortableInitialDirection`

### Default Value

`'asc'`

### Usage

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    sortable-initial-direction="desc"
  />
</template>
```

### Column-Level Override

You can also set initial direction per column:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { 
    field: 'name', 
    title: 'Name', 
    sortable: true,
    sortableInitialDirection: 'asc'  // Column-level setting
  },
  { 
    field: 'date', 
    title: 'Date', 
    sortable: true,
    sortableInitialDirection: 'desc'  // Different for this column
  }
]
</script>
```

## sortable-mode `String`

The sorting mode determines whether users can sort by one or multiple columns.

### Supported Values

- `'single'` - User can sort by one column at a time (default)
- `'multiple'` - User can sort by multiple columns simultaneously

### Behavior

#### Single Mode (`'single'`)

- Clicking a column header removes any existing sort
- Only one column can be sorted at a time
- Simpler UX for basic sorting needs

#### Multiple Mode (`'multiple'`)

- Clicking a column header adds it to the sort list
- Multiple columns can be sorted in priority order
- Use with `sortable-show-indexes` to show sort priority
- More powerful for complex data analysis

### Default Value

`'single'`

### Usage: Single Mode

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    sortable-mode="single"
  />
</template>
```

### Usage: Multiple Mode

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    sortable-mode="multiple"
    :sortable-show-indexes="true"
  />
</template>
```

## Complete Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 99.99, category: 'Electronics', date: '2024-01-15' },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', date: '2024-02-20' },
  { id: 3, name: 'Product C', price: 19.99, category: 'Books', date: '2024-03-10' }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true },
  { field: 'price', title: 'Price', sortable: true },
  { field: 'category', title: 'Category', sortable: true },
  { field: 'date', title: 'Date', sortable: true, sortableInitialDirection: 'desc' }
]

const sort = ref<SortDescriptor[]>([])
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    sortable-mode="multiple"
    :sortable-allow-unsort="true"
    :sortable-show-indexes="true"
    sortable-initial-direction="asc"
    v-model:sort="sort"
  />
</template>
```

## Prop Combinations

### Recommended Combinations

| Use Case | sortable-mode | sortable-allow-unsort | sortable-show-indexes |
|----------|--------------|----------------------|----------------------|
| Simple sorting | `single` | `true` | `false` |
| Always sorted | `single` | `false` | `false` |
| Multi-column analysis | `multiple` | `true` | `true` |
| Complex data exploration | `multiple` | `true` | `true` |

## Column-Level Overrides

All sortable props can be overridden at the column level:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Name',
    sortable: true,
    sortableAllowUnsort: false,        // Column-level override
    sortableInitialDirection: 'asc'     // Column-level override
  },
  {
    field: 'price',
    title: 'Price',
    sortable: true,
    sortableInitialDirection: 'desc'    // Different initial direction
  }
]
</script>
```

## Server-Side Sorting

All sortable props work seamlessly with server-side sorting:

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([])
const sort = ref<SortDescriptor[]>([])

watchEffect(async () => {
  const params = new URLSearchParams()
  
  // Handle multiple sorts
  sort.value.forEach((s, index) => {
    params.append(`sort[${index}][field]`, s.field)
    params.append(`sort[${index}][dir]`, s.dir)
  })
  
  const response = await fetch(`/api/data?${params}`)
  const data = await response.json()
  rows.value = data.items
})
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    sortable-mode="multiple"
    :sortable-show-indexes="true"
    :server-side="true"
    v-model:sort="sort"
  />
</template>
```

## Suggested Links

* [Sorting Guide](/guide/sorting) - Complete sorting documentation
* [Sorting Examples](/examples/sorting) - Practical examples
* [Grid Props API](/api/grid-props) - All grid props


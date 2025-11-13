# Filtering

Pantanal Grid provides powerful filtering capabilities with multiple operators, filter modes, and custom filter UIs.

## Basic Filtering

Enable filtering by setting `filterable: true` on columns:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type FilterDescriptor } from '@pantanal/grid'

const rows = ref([/* ... */])
const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', filterable: true },
  { field: 'price', title: 'Price', filterable: true }
]

const filter = ref<FilterDescriptor[]>([])
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    v-model:filter="filter"
  />
</template>
```

## Filter Modes

### Filter Row Mode

Display filter inputs directly in the header row:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Name',
    filterable: true,
    filterableMode: 'row'
  }
]
</script>
```

### Filter Menu Mode

Use a dropdown menu for filtering:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Name',
    filterable: true,
    filterableMode: 'menu'
  }
]
</script>
```

## Filter Operators

Available operators:

- `contains` - Contains text (default for strings)
- `eq` - Equals
- `neq` - Not equals
- `gt` - Greater than
- `gte` - Greater than or equal
- `lt` - Less than
- `lte` - Less than or equal
- `startswith` - Starts with
- `endswith` - Ends with
- `isnull` - Is null
- `isnotnull` - Is not null
- `isempty` - Is empty
- `isnotempty` - Is not empty

## Filter UI Types

### Textbox (Default)

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Name',
    filterable: true,
    filterableUI: 'textbox'
  }
]
</script>
```

### Numeric

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'price',
    title: 'Price',
    filterable: true,
    filterableUI: 'numeric'
  }
]
</script>
```

### Date

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'createdAt',
    title: 'Created At',
    filterable: true,
    filterableUI: 'date'
  }
]
</script>
```

### Boolean

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'active',
    title: 'Active',
    filterable: true,
    filterableUI: 'boolean'
  }
]
</script>
```

### Dropdown

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'category',
    title: 'Category',
    filterable: true,
    filterableUI: 'dropdown',
    filterableOptions: [
      { value: 'Electronics', label: 'Electronics' },
      { value: 'Clothing', label: 'Clothing' },
      { value: 'Accessories', label: 'Accessories' }
    ]
  }
]
</script>
```

## Multiple Filters

Enable multiple filter criteria for a column:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'price',
    title: 'Price',
    filterable: true,
    filterableMulti: true,
    filterableExtra: true  // Allow second filter criterion
  }
]
</script>
```

## Custom Filter Operator

Set default filter operator:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Name',
    filterable: true,
    filterableOperator: 'startswith'
  }
]
</script>
```

## Filter Events

Listen to filter changes:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    @update:filter="handleFilterChange"
  />
</template>

<script setup lang="ts">
import type { FilterDescriptor } from '@pantanal/grid'

function handleFilterChange(newFilter: FilterDescriptor[]) {
  console.log('Filter changed:', newFilter)
  // Update server-side data, etc.
}
</script>
```

## Server-Side Filtering

For server-side filtering, handle the filter change event:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type FilterDescriptor } from '@pantanal/grid'

const rows = ref([/* ... */])
const filter = ref<FilterDescriptor[]>([])

async function handleFilterChange(newFilter: FilterDescriptor[]) {
  filter.value = newFilter
  // Fetch filtered data from server
  const response = await fetch(`/api/data?filter=${JSON.stringify(newFilter)}`)
  rows.value = await response.json()
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :server-side="true"
    v-model:filter="filter"
    @update:filter="handleFilterChange"
  />
</template>
```

## Case-Insensitive Filtering

Enable case-insensitive filtering:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Name',
    filterable: true,
    filterableIgnoreCase: true
  }
]
</script>
```

## Tips

- Use `filterableMode: 'row'` for quick filtering
- Use `filterableMode: 'menu'` for advanced filtering with multiple operators
- Provide `filterableOptions` for dropdown filters to improve UX
- For server-side filtering, always handle the `update:filter` event
- Use `filterableMulti: true` for complex filtering scenarios




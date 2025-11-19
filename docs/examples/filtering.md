# Filtering

Pantanal Grid provides powerful filtering capabilities with multiple operators and filter modes.

<ExamplePreview>
  <FilteringCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import FilteringCompleteExample from './components/FilteringCompleteExample.vue'
import FilteringExample from './components/FilteringExample.vue'
</script>

## Filter Row Mode

<ExamplePreview>
  <FilteringExample />
</ExamplePreview>

Display filter inputs directly in the header row:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type FilterDescriptor } from '@pantanal/grid'

const rows = ref([/* ... */])
const columns: ColumnDef[] = [
  { 
    field: 'name', 
    title: 'Name', 
    filterable: true,
    filterableMode: 'row'
  },
  { 
    field: 'price', 
    title: 'Price', 
    filterable: true,
    filterableMode: 'row'
  }
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

## Filter Menu Mode

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

## Custom Filter UI

Provide a custom filter UI:

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

Enable multiple filter criteria:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'price',
    title: 'Price',
    filterable: true,
    filterableMulti: true,
    filterableExtra: true
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
    @filter="handleFilter"
  />
</template>

<script setup lang="ts">
function handleFilterChange(newFilter: FilterDescriptor[]) {
  console.log('Filter changed:', newFilter)
}

function handleFilter(event: { filter: FilterDescriptor[] }) {
  console.log('Filter event:', event.filter)
}
</script>
```

## Filter Descriptor

The filter descriptor has the following structure:

```typescript
interface FilterDescriptor {
  field: string           // Column field name
  operator: string        // Filter operator (contains, eq, gt, etc.)
  value: any              // Filter value
}
```

## Filter Operators

Available filter operators:

- **String operators**: `contains`, `eq`, `neq`, `startswith`, `endswith`, `isnull`, `isnotnull`, `isempty`, `isnotempty`
- **Number operators**: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`
- **Date operators**: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`
- **Boolean operators**: `eq`, `neq`

## Default Filter Operator

Set a default operator for a column:

```vue
const columns: ColumnDef[] = [
  { 
    field: 'price', 
    title: 'Price', 
    filterable: true,
    filterableDefaultOperator: 'gte'  // Greater than or equal
  }
]
```

## Filter UI Types

### Text Input (Default)

```vue
const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', filterable: true }
]
```

### Dropdown

```vue
const columns: ColumnDef[] = [
  { 
    field: 'status', 
    title: 'Status', 
    filterable: true,
    filterableUI: 'dropdown',
    filterableOptions: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  }
]
```

### Date Picker

```vue
const columns: ColumnDef[] = [
  { 
    field: 'date', 
    title: 'Date', 
    filterable: true,
    type: 'date'
  }
]
```

## Server-Side Filtering

For server-side filtering, send filter descriptors to your API:

```vue
<script setup lang="ts">
watchEffect(async () => {
  const params = new URLSearchParams({
    page: String(page.value),
    pageSize: String(pageSize.value)
  })
  
  if (filter.value.length > 0) {
    filter.value.forEach(f => {
      params.append(`filter[${f.field}][${f.operator}]`, String(f.value))
    })
  }
  
  const response = await fetch(`/api/data?${params}`)
  // ...
})
</script>
```

## See Also

- [Filtering Guide](/guide/filtering) - Complete filtering documentation
- [Server-Side Guide](/guide/server-side) - Server-side filtering


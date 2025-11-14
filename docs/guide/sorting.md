# Sorting

Pantanal Grid provides flexible sorting capabilities with support for single and multiple column sorting.

## Basic Sorting

Enable sorting by setting `sortable: true` on columns:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([/* ... */])
const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', sortable: true },
  { field: 'price', title: 'Price', sortable: true }
]

const sort = ref<SortDescriptor[]>([])
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    v-model:sort="sort"
  />
</template>
```

## Single Column Sorting

By default, clicking a column header cycles through:
- No sort → Ascending → Descending → No sort

This is controlled by the `sortableAllowUnsort` prop (default: `true`).

## Multiple Column Sorting

Enable multiple column sorting:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    v-model:sort="sort"
    sortable-mode="multiple"
    :sortable-show-indexes="true"
  />
</template>
```

When `sortableShowIndexes` is enabled, sort order indicators (1, 2, 3...) are displayed on sorted columns.

## Custom Sort Function

Provide a custom comparison function for a column:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Name',
    sortable: true,
    sortableCompare: (a, b, descending) => {
      // Custom comparison logic
      const result = a.localeCompare(b, undefined, { sensitivity: 'base' })
      return descending ? -result : result
    }
  }
]
</script>
```

## Initial Sort

Set initial sort order:

```vue
<script setup lang="ts">
const sort = ref<SortDescriptor[]>([
  { field: 'price', dir: 'desc' },
  { field: 'name', dir: 'asc' }
])
</script>
```

## Sort Direction

Control initial sort direction per column:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'price',
    title: 'Price',
    sortable: true,
    sortableInitialDirection: 'desc'
  }
]
</script>
```

## Disable Unsorting

Prevent clearing sort (always keep at least one column sorted):

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    v-model:sort="sort"
    :sortable-allow-unsort="false"
  />
</template>
```

## Sort Events

Listen to sort changes:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    @update:sort="handleSortChange"
  />
</template>

<script setup lang="ts">
import type { SortDescriptor } from '@pantanal/grid'

function handleSortChange(newSort: SortDescriptor[]) {
  console.log('Sort changed:', newSort)
  // Update server-side data, etc.
}
</script>
```

## Server-Side Sorting

For server-side sorting, handle the sort change event and fetch sorted data:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type SortDescriptor } from '@pantanal/grid'

const rows = ref([/* ... */])
const sort = ref<SortDescriptor[]>([])

async function handleSortChange(newSort: SortDescriptor[]) {
  sort.value = newSort
  // Fetch sorted data from server
  const response = await fetch(`/api/data?sort=${JSON.stringify(newSort)}`)
  rows.value = await response.json()
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :server-side="true"
    v-model:sort="sort"
    @update:sort="handleSortChange"
  />
</template>
```

## Tips

- Use `sortableMode="multiple"` for complex data analysis
- Show sort indexes with `sortableShowIndexes` to help users understand sort order
- Provide custom sort functions for complex data types (dates, custom formats, etc.)
- For server-side sorting, always handle the `update:sort` event






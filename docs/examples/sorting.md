# Sorting

Pantanal Grid supports single and multiple column sorting. Click column headers to toggle sorting.

<ExamplePreview>
  <SortingCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import SortingCompleteExample from './components/SortingCompleteExample.vue'
import SortingExample from './components/SortingExample.vue'
</script>

## Single Column Sorting

<ExamplePreview>
  <SortingExample />
</ExamplePreview>

By default, clicking a column header cycles through: none → ascending → descending → none.

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

## Multiple Column Sorting

Enable multiple column sorting by setting `sortableMode` to `'multiple'`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([/* ... */])
const columns: ColumnDef[] = [
  { field: 'name', title: 'Name', sortable: true },
  { field: 'price', title: 'Price', sortable: true },
  { field: 'category', title: 'Category', sortable: true }
]

const sort = ref<SortDescriptor[]>([])
</script>

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

## Custom Sort Function

You can provide a custom sort function for a column:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Name',
    sortable: true,
    sortableCompare: (a, b, descending) => {
      // Custom comparison logic
      const result = a.localeCompare(b)
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

## Sort Events

Listen to sort changes:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    @update:sort="handleSortChange"
    @sort="handleSort"
  />
</template>

<script setup lang="ts">
function handleSortChange(newSort: SortDescriptor[]) {
  console.log('Sort changed:', newSort)
}

function handleSort(event: { sort: SortDescriptor[] }) {
  console.log('Sort event:', event.sort)
}
</script>
```

## Sort Descriptor

The sort descriptor has the following structure:

```typescript
interface SortDescriptor {
  field: string      // Column field name
  dir: 'asc' | 'desc'  // Sort direction
}
```

## Disabling Sort

Disable sorting for specific columns:

```vue
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', sortable: false },
  { field: 'name', title: 'Name', sortable: true }
]
```

Or disable globally:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :sortable="false"
/>
```

## Custom Sort Function

Provide a custom comparison function:

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

## Server-Side Sorting

For server-side sorting, send sort descriptors to your API:

```vue
<script setup lang="ts">
watchEffect(async () => {
  const params = new URLSearchParams({
    page: String(page.value),
    pageSize: String(pageSize.value)
  })
  
  if (sort.value.length > 0) {
    params.append('sortBy', sort.value[0].field)
    params.append('order', sort.value[0].dir)
  }
  
  const response = await fetch(`/api/data?${params}`)
  // ...
})
</script>
```

## See Also

- [Sorting Guide](/guide/sorting) - Complete sorting documentation
- [Server-Side Guide](/guide/server-side) - Server-side sorting


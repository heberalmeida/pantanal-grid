# Sortable Props

Pantanal Grid provides comprehensive sorting configuration through `sortableProps`, allowing fine-grained control over sorting behavior.

<ExamplePreview>
  <SortablePropsCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import SortablePropsCompleteExample from './components/SortablePropsCompleteExample.vue'
import SortablePropsExample from './components/SortablePropsExample.vue'
</script>

## Basic Sortable Props

<ExamplePreview>
  <SortablePropsExample />
</ExamplePreview>

## sortable-allow-unsort

Control whether users can remove sorting from columns.

### Allow Unsort (Default)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 99.99 },
  { id: 2, name: 'Product B', price: 49.99 },
  { id: 3, name: 'Product C', price: 19.99 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
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
    :sortable="true"
    :sortable-allow-unsort="true"
    v-model:sort="sort"
  />
</template>
```

### Disable Unsort

When `sortable-allow-unsort` is `false`, clicking a sorted column cycles between ascending and descending only:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    :sortable-allow-unsort="false"
    v-model:sort="sort"
  />
</template>
```

## sortable-show-indexes

Display sort sequence indicators when using multiple column sorting.

### With Indexes

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 99.99, category: 'Electronics', stock: 50 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', stock: 100 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Books', stock: 25 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true },
  { field: 'price', title: 'Price', sortable: true },
  { field: 'category', title: 'Category', sortable: true },
  { field: 'stock', title: 'Stock', sortable: true }
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
    :sortable-show-indexes="true"
    v-model:sort="sort"
  />
</template>
```

### Without Indexes

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    sortable-mode="multiple"
    :sortable-show-indexes="false"
    v-model:sort="sort"
  />
</template>
```

## sortable-initial-direction

Set the initial sort direction when a column is first clicked.

### Initial Descending

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true },
  { field: 'price', title: 'Price', sortable: true },
  { 
    field: 'date', 
    title: 'Date', 
    sortable: true,
    sortableInitialDirection: 'desc'  // Column-level override
  }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    sortable-initial-direction="asc"
    v-model:sort="sort"
  />
</template>
```

### Global Initial Direction

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    sortable-initial-direction="desc"
    v-model:sort="sort"
  />
</template>
```

## sortable-mode

Choose between single or multiple column sorting.

### Single Mode (Default)

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    sortable-mode="single"
    v-model:sort="sort"
  />
</template>
```

### Multiple Mode

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    sortable-mode="multiple"
    :sortable-show-indexes="true"
    v-model:sort="sort"
  />
</template>
```

## Complete Example

Combining all sortable props:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', price: 99.99, category: 'Electronics', date: '2024-01-15', stock: 50 },
  { id: 2, name: 'Product B', price: 49.99, category: 'Clothing', date: '2024-02-20', stock: 100 },
  { id: 3, name: 'Product C', price: 19.99, category: 'Books', date: '2024-03-10', stock: 25 },
  { id: 4, name: 'Product D', price: 79.99, category: 'Electronics', date: '2024-01-05', stock: 75 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true },
  { field: 'price', title: 'Price', sortable: true },
  { field: 'category', title: 'Category', sortable: true },
  { 
    field: 'date', 
    title: 'Date', 
    sortable: true,
    sortableInitialDirection: 'desc'  // Newest first
  },
  { field: 'stock', title: 'Stock', sortable: true }
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

## Column-Level Overrides

Override sortable props per column:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'name',
    title: 'Name',
    sortable: true,
    sortableAllowUnsort: false,        // Cannot unsort this column
    sortableInitialDirection: 'asc'
  },
  {
    field: 'price',
    title: 'Price',
    sortable: true,
    sortableInitialDirection: 'desc'    // Starts descending
  },
  {
    field: 'date',
    title: 'Date',
    sortable: true,
    sortableInitialDirection: 'desc'    // Newest first
  }
]
</script>
```

## Use Cases

### Simple Data Table

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    sortable-mode="single"
    :sortable-allow-unsort="true"
  />
</template>
```

### Always Sorted Table

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    sortable-mode="single"
    :sortable-allow-unsort="false"
  />
</template>
```

### Multi-Column Analysis

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :sortable="true"
    sortable-mode="multiple"
    :sortable-show-indexes="true"
    :sortable-allow-unsort="true"
  />
</template>
```

## Server-Side Sorting

All sortable props work with server-side sorting:

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor } from '@pantanal/grid'

const rows = ref([])
const sort = ref<SortDescriptor[]>([])

watchEffect(async () => {
  const params = new URLSearchParams()
  
  // Send all sorts to server
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

## See Also

- [SortableProps API](/api/sortable-props) - Complete API reference
- [Sorting Guide](/guide/sorting) - Sorting documentation
- [Sorting Examples](/examples/sorting) - More sorting examples


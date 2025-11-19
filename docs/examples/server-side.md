# Server-Side

Pantanal Grid supports server-side data operations for pagination, sorting, and filtering, ideal for large datasets.

<ExamplePreview>
  <ServerSideCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import ServerSideCompleteExample from './components/ServerSideCompleteExample.vue'
import ServerSideExample from './components/ServerSideExample.vue'
</script>

## Basic Server-Side Data

<ExamplePreview>
  <ServerSideExample />
</ExamplePreview>

## Code

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

const rows = ref([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'title', title: 'Title', filterable: true },
  { field: 'brand', title: 'Brand' },
  { field: 'category', title: 'Category' },
  { field: 'price', title: 'Price', sortable: true }
]

watchEffect(async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: String(page.value),
      pageSize: String(pageSize.value),
      sort: JSON.stringify(sort.value),
      filter: JSON.stringify(filter.value)
    })
    
    const response = await fetch(`https://dummyjson.com/products?limit=${pageSize.value}&skip=${(page.value - 1) * pageSize.value}`)
    const data = await response.json()
    rows.value = data.products
    total.value = data.total
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :server-side="true"
    :total="total"
    :loading="loading"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
    locale="en"
    responsive="table"
  />
</template>
```

## Basic Server-Side Setup

Enable server-side mode and provide total count:

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)

watchEffect(async () => {
  loading.value = true
  try {
    const response = await fetch(`/api/data?page=${page.value}&pageSize=${pageSize.value}`)
    const data = await response.json()
    rows.value = data.items
    total.value = data.total
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :server-side="true"
    :total="total"
    :loading="loading"
    v-model:page="page"
    v-model:pageSize="pageSize"
  />
</template>
```

## Using DataProvider

The `dataProvider` prop provides a cleaner API:

```vue
<script setup lang="ts">
import { PantanalGrid, type DataProvider } from '@pantanal/grid'

const dataProvider: DataProvider = async (args) => {
  const params = new URLSearchParams({
    page: String(args.page),
    pageSize: String(args.pageSize),
    sort: JSON.stringify(args.sort),
    filter: JSON.stringify(args.filter)
  })
  
  const response = await fetch(`/api/data?${params}`)
  const data = await response.json()
  
  return {
    rows: data.items,
    total: data.total
  }
}
</script>

<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="id"
    :data-provider="dataProvider"
    :auto-bind="true"
    server-side
  />
</template>
```

## Server-Side Sorting

Send sort descriptors to your server:

```vue
<script setup lang="ts">
watchEffect(async () => {
  const params = new URLSearchParams({
    page: String(page.value),
    pageSize: String(pageSize.value)
  })
  
  // Add sorting
  if (sort.value.length > 0) {
    params.append('sortBy', sort.value[0].field)
    params.append('order', sort.value[0].dir)
  }
  
  const response = await fetch(`/api/data?${params}`)
  // ...
})
</script>
```

## Server-Side Filtering

Send filter descriptors to your server:

```vue
<script setup lang="ts">
watchEffect(async () => {
  const params = new URLSearchParams({
    page: String(page.value),
    pageSize: String(pageSize.value)
  })
  
  // Add filtering
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

## Loading State

Show loading indicator during data fetch:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :server-side="true"
  :total="total"
  :loading="loading"
/>
```

## Error Handling

Handle errors gracefully:

```vue
<script setup lang="ts">
watchEffect(async () => {
  loading.value = true
  try {
    const response = await fetch('/api/data')
    if (!response.ok) throw new Error('Failed to fetch')
    const data = await response.json()
    rows.value = data.items
    total.value = data.total
  } catch (error) {
    console.error('Error:', error)
    rows.value = []
    total.value = 0
    // Show error message to user
  } finally {
    loading.value = false
  }
})
</script>
```

## Best Practices

1. **Debounce requests**: Wait for user to finish typing before filtering
2. **Cache responses**: Cache data when possible
3. **Handle errors**: Show user-friendly error messages
4. **Optimize queries**: Use database indexes for sorting/filtering
5. **Limit page size**: Don't fetch too many rows at once

## See Also

- [Server-Side Guide](/guide/server-side) - Complete server-side documentation
- [DataProvider API](/api/types) - DataProvider interface reference


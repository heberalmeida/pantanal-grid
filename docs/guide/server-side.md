# Server-Side Mode

Pantanal Grid supports server-side data operations, allowing you to handle sorting, filtering, and pagination on the server. This is essential for large datasets that cannot be loaded entirely into the browser.

## Basic Server-Side Setup

Enable server-side mode by setting `serverSide="true"`:

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

const rows = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', filterable: true },
  { field: 'price', title: 'Price', sortable: true }
]

// Fetch data when state changes
watchEffect(async () => {
  const response = await fetch(`/api/products?page=${page.value}&pageSize=${pageSize.value}&sort=${JSON.stringify(sort.value)}&filter=${JSON.stringify(filter.value)}`)
  const data = await response.json()
  rows.value = data.rows
  total.value = data.total
})
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :server-side="true"
    :total="total"
    v-model:page="page"
    v-model:pageSize="pageSize"
    v-model:sort="sort"
    v-model:filter="filter"
  />
</template>
```

## Using Data Provider

Alternatively, use a `dataProvider` function that returns `{ rows, total }`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price' }
]

async function dataProvider(state: any) {
  const { page, pageSize, sort, filter } = state
  const response = await fetch(`/api/products?page=${page}&pageSize=${pageSize}&sort=${JSON.stringify(sort)}&filter=${JSON.stringify(filter)}`)
  const data = await response.json()
  return {
    rows: data.rows,
    total: data.total
  }
}
</script>

<template>
  <PantanalGrid
    :columns="columns"
    key-field="id"
    :data-provider="dataProvider"
  />
</template>
```

## Server-Side Sorting

Handle sorting on the server:

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type SortDescriptor } from '@pantanal/grid'

const rows = ref([])
const total = ref(0)
const sort = ref<SortDescriptor[]>([])

watchEffect(async () => {
  const sortParam = sort.value.length > 0 
    ? sort.value.map(s => `${s.field}:${s.dir}`).join(',')
    : ''
  
  const response = await fetch(`/api/products?sort=${sortParam}`)
  const data = await response.json()
  rows.value = data.rows
  total.value = data.total
})
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :server-side="true"
    :total="total"
    v-model:sort="sort"
  />
</template>
```

## Server-Side Filtering

Handle filtering on the server:

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type FilterDescriptor } from '@pantanal/grid'

const rows = ref([])
const total = ref(0)
const filter = ref<FilterDescriptor[]>([])

watchEffect(async () => {
  const filterParam = JSON.stringify(filter.value)
  const response = await fetch(`/api/products?filter=${encodeURIComponent(filterParam)}`)
  const data = await response.json()
  rows.value = data.rows
  total.value = data.total
})
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :server-side="true"
    :total="total"
    v-model:filter="filter"
  />
</template>
```

## Server-Side Pagination

Handle pagination on the server:

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const rows = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)

watchEffect(async () => {
  const response = await fetch(`/api/products?page=${page.value}&pageSize=${pageSize.value}`)
  const data = await response.json()
  rows.value = data.rows
  total.value = data.total
})
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :server-side="true"
    :total="total"
    v-model:page="page"
    v-model:pageSize="pageSize"
  />
</template>
```

## Loading State

Handle loading state during data fetching:

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const rows = ref([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)

watchEffect(async () => {
  loading.value = true
  try {
    const response = await fetch(`/api/products?page=${page.value}&pageSize=${pageSize.value}`)
    const data = await response.json()
    rows.value = data.rows
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

## Complete Example

Here's a complete example with all server-side features:

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

const rows = ref([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)
const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true },
  { field: 'category', title: 'Category', filterable: true },
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
    
    const response = await fetch(`/api/products?${params}`)
    const data = await response.json()
    rows.value = data.rows
    total.value = data.total
  } catch (error) {
    console.error('Error fetching data:', error)
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
  />
</template>
```

## API Response Format

Your server API should return data in this format:

```json
{
  "rows": [
    { "id": 1, "name": "Product 1", "price": 29.99 },
    { "id": 2, "name": "Product 2", "price": 49.99 }
  ],
  "total": 100
}
```

## Tips

- Always provide the `total` prop for accurate pagination
- Use `watchEffect` or `watch` to react to state changes
- Handle loading states for better UX
- Debounce filter inputs to reduce server requests
- Cache responses when possible to improve performance
- Handle errors gracefully with try/catch blocks




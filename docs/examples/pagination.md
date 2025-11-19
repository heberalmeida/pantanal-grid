# Pagination

Pantanal Grid provides flexible pagination options with customizable page sizes and navigation controls.

<ExamplePreview>
  <PaginationCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import PaginationCompleteExample from './components/PaginationCompleteExample.vue'
import PaginationExample from './components/PaginationExample.vue'
</script>

## Basic Pagination

<ExamplePreview>
  <PaginationExample />
</ExamplePreview>

Enable pagination with default settings:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([/* ... */])
const columns: ColumnDef[] = [/* ... */]

const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    v-model:page="page"
    v-model:pageSize="pageSize"
    :pageable="true"
  />
</template>
```

## Custom Page Sizes

Configure available page sizes:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    v-model:page="page"
    v-model:pageSize="pageSize"
    :pageable-page-sizes="[5, 10, 20, 50, 100]"
  />
</template>
```

## Pagination Variants

Choose from different pagination styles:

### Simple

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  pagination-variant="simple"
/>
```

### Pages (Numeric)

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  pagination-variant="pages"
  :pageable-numeric="true"
  :pageable-button-count="5"
/>
```

### Edges

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  pagination-variant="edges"
  :pageable-previous-next="true"
/>
```

## Pagination Features

### Always Visible

Keep pagination visible even when items are fewer than page size:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :pageable-always-visible="true"
/>
```

### Page Input

Allow users to type page number:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :pageable-input="true"
/>
```

### Refresh Button

Add a refresh button:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :pageable-refresh="true"
    @refresh="handleRefresh"
  />
</template>

<script setup lang="ts">
function handleRefresh() {
  // Reload data
  console.log('Refresh clicked')
}
</script>
```

## Server-Side Pagination

For server-side pagination, use `serverSide` mode:

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([])
const total = ref(1000) // Total items on server
const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)

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

## Pagination Events

Listen to pagination changes:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    @update:page="handlePageChange"
    @update:pageSize="handlePageSizeChange"
  />
</template>

<script setup lang="ts">
function handlePageChange(newPage: number) {
  console.log('Page changed:', newPage)
}

function handlePageSizeChange(newPageSize: number) {
  console.log('Page size changed:', newPageSize)
}
</script>
```

## Disabling Pagination

Disable pagination:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :pageable="false"
/>
```

## Custom Page Sizes

Provide custom page size options:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :pageable-page-sizes="[5, 10, 20, 50, 100, 'all']"
/>
```

The `'all'` option shows all rows on a single page.

## Pagination Info

Show or hide pagination info text:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :pageable-info="true"  // Shows "1-10 of 100"
/>
```

## See Also

- [Pagination Guide](/guide/pagination) - Complete pagination documentation
- [Pagination API](/api/pagination) - Pagination API reference
- [Server-Side Guide](/guide/server-side) - Server-side pagination


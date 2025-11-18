# Pagination

Pantanal Grid provides flexible pagination with customizable page sizes, navigation controls, and server-side support.

## Basic Pagination

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

You can also use `'all'` as a page size option:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :pageable-page-sizes="[10, 20, 50, 'all']"
  />
</template>
```

## Pagination Variants

### Simple

Simple pagination with previous/next buttons:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  pagination-variant="simple"
/>
```

### Pages (Numeric)

Numeric pagination with page numbers:

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

Pagination with first/last page buttons:

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

### Hide Page Size Selector

Hide the page size selector:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :pageable-page-sizes="false"
/>
```

### Custom Page Size

Enable custom page size input to allow users to enter any number of items per page:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :pageable="true"
    :pageable-page-sizes="[10, 20, 50, 100]"
    :pageable-custom-page-size="true"
  />
</template>
```

When `pageableCustomPageSize` is `true`, a "Custom" option appears in the page size selector. Selecting it reveals an input field where users can enter any number between 1 and 10,000.

**Features:**
- Input validation (min: 1, max: 10,000)
- Cancel button to return to previous selection
- Automatically detects when current pageSize is not in the predefined options
- Works with both client-side and server-side pagination

**Use Cases:**
- Allow users to view specific number of items (e.g., 25, 75, 150)
- Support flexible pagination requirements
- Provide more control over data display

## Server-Side Pagination

For server-side pagination, use `serverSide` mode:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([/* ... */])
const columns: ColumnDef[] = [/* ... */]
const total = ref(1000) // Total items on server
const page = ref(1)
const pageSize = ref(20)

async function handlePageChange(newPage: number) {
  page.value = newPage
  // Fetch data for new page
  const response = await fetch(`/api/data?page=${newPage}&pageSize=${pageSize.value}`)
  const data = await response.json()
  rows.value = data.rows
  total.value = data.total
}
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
    @update:page="handlePageChange"
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

## Custom Messages

Customize pagination messages:

```vue
<script setup lang="ts">
const messages = {
  pageableDisplay: 'Displaying {0}-{1} of {2} items',
  pageableEmpty: 'No items to display',
  pageablePage: 'Page',
  pageableOf: 'of {0}',
  pageableItemsPerPage: 'Items per page',
  pageableFirst: 'First',
  pageableLast: 'Last',
  pageableNext: 'Next',
  pageablePrevious: 'Previous'
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :messages="messages"
  />
</template>
```

## URL Synchronization

Synchronize pagination state with URL query parameters to enable shareable links and browser navigation support.

### Basic Usage

Enable URL synchronization:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    v-model:page="page"
    v-model:pageSize="pageSize"
    :pageable="true"
    :pageable-sync-url="true"
  />
</template>
```

When enabled, the grid will:
- Read initial `page` and `pageSize` from URL query parameters
- Update URL when pagination changes
- Support browser back/forward navigation
- Allow sharing links with specific pagination state

### Custom URL Parameter Names

Customize the URL parameter names:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :pageable-sync-url="true"
  pageable-url-param-page="p"
  pageable-url-param-page-size="size"
/>
```

### Server-Side with URL Sync

URL synchronization works seamlessly with server-side pagination:

```vue
<template>
  <PantanalGrid
    :rows="[]"
    :columns="columns"
    key-field="id"
    :server-side="true"
    :pageable="true"
    :pageable-sync-url="true"
    :data-provider="dataProvider"
    v-model:page="page"
    v-model:pageSize="pageSize"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type DataProvider } from '@pantanal/grid'

const page = ref(1)
const pageSize = ref(20)

const dataProvider: DataProvider = async (args) => {
  // URL parameters are automatically read on mount
  const response = await fetch(`/api/data?page=${args.page}&pageSize=${args.pageSize}`)
  const data = await response.json()
  return {
    rows: data.items,
    total: data.total,
  }
}
</script>
```

### Browser Navigation

The grid automatically handles browser back/forward buttons. When users navigate using browser history, the grid updates its pagination state to match the URL.

## Tips

- Use `pageableAlwaysVisible: false` to hide pagination when not needed
- For server-side pagination, always provide the `total` prop
- Use `pageablePageSizes` to match your data size requirements
- Avoid using `pageableNumeric` and `pageableInput` together
- Enable `pageableSyncUrl` for shareable pagination links
- URL sync works with both client-side and server-side pagination
- Enable `pageableCustomPageSize` to allow users to enter custom page sizes
- Custom page size is disabled by default - enable it explicitly when needed








# Persisted State

Pantanal Grid can persist user preferences (sort, filters, pagination, column widths) to localStorage for a better user experience.

<ExamplePreview>
  <PersistedStateCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import PersistedStateCompleteExample from './components/PersistedStateCompleteExample.vue'
</script>

## Basic Usage

Enable state persistence by setting the `persistStateKey` prop:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  persist-state-key="my-grid-state"
  v-model:sort="sort"
  v-model:filter="filter"
  v-model:page="page"
  v-model:pageSize="pageSize"
/>
```

## What Gets Persisted

The following state is automatically persisted:

- **Sort order** - Column sorting preferences
- **Filters** - Active filter values
- **Pagination** - Current page and page size
- **Column widths** - Resized column widths
- **Column order** - Reordered column positions

## Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

const rows = ref([/* ... */])
const columns: ColumnDef[] = [/* ... */]

const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    persist-state-key="my-app-grid"
    v-model:sort="sort"
    v-model:filter="filter"
    v-model:page="page"
    v-model:pageSize="pageSize"
    :enable-column-resize="true"
    :enable-column-reorder="true"
  />
</template>
```

## Clearing Persisted State

You can programmatically clear the persisted state:

```vue
<script setup lang="ts">
function clearPersistedState() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('my-app-grid')
    // Reset grid state
    sort.value = []
    filter.value = []
    page.value = 1
    pageSize.value = 10
  }
}
</script>

<template>
  <div>
    <button @click="clearPersistedState">Clear Saved State</button>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      persist-state-key="my-app-grid"
      v-model:sort="sort"
      v-model:filter="filter"
      v-model:page="page"
      v-model:pageSize="pageSize"
    />
  </div>
</template>
```

## Multiple Grids

Use different keys for different grids:

```vue
<PantanalGrid
  persist-state-key="products-grid"
  <!-- ... -->
/>

<PantanalGrid
  persist-state-key="orders-grid"
  <!-- ... -->
/>
```

## Best Practices

1. **Use unique keys**: Each grid should have a unique `persistStateKey`
2. **Namespace keys**: Use prefixes like `myapp-` to avoid conflicts
3. **Clear on logout**: Remove persisted state when users log out
4. **Version keys**: Include version numbers for breaking changes

## See Also

- [PantanalGrid API](/api/grid) - Complete API reference
- [Column Management](/examples/column-management) - Column resizing and reordering










# Virtual Scrolling

Virtual scrolling allows the grid to efficiently render large datasets by only rendering the visible portion of the data. This dramatically improves performance when dealing with thousands of rows.

## Basic Virtual Scrolling

Enable virtual scrolling by setting `virtual="true"`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref(Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100
})))

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :virtual="true"
    :height="420"
    :row-height="44"
  />
</template>
```

## Configuration

### Height

Set a fixed height for the virtual scrolling container:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :virtual="true"
  :height="500"
/>
```

### Row Height

Specify the height of each row in pixels:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :virtual="true"
  :height="420"
  :row-height="44"
/>
```

The default row height is 44 pixels. Make sure to set this accurately for optimal performance.

## Performance Considerations

### When to Use Virtual Scrolling

Use virtual scrolling when:
- You have more than 100-200 rows
- Performance is important
- Users need to scroll through large datasets

### When NOT to Use Virtual Scrolling

Avoid virtual scrolling when:
- You have fewer than 100 rows
- You need grouping (virtual scrolling doesn't support grouping)
- You need pagination (virtual scrolling replaces pagination)

## Features with Virtual Scrolling

Virtual scrolling works with:
- ✅ Sorting
- ✅ Filtering
- ✅ Selection
- ✅ Column resizing
- ✅ Column reordering
- ✅ Custom cell templates

Virtual scrolling does NOT work with:
- ❌ Pagination (virtual scrolling replaces it)
- ❌ Grouping
- ❌ Group footers

## Auto Height

You can use `autoHeight` with virtual scrolling, but you must still provide a `maxBodyHeight`:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :virtual="true"
  :auto-height="true"
  :max-body-height="600"
  :row-height="44"
/>
```

## Complete Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type SortDescriptor, type FilterDescriptor } from '@pantanal/grid'

// Generate 10,000 rows
const rows = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  category: ['Electronics', 'Clothing', 'Accessories'][i % 3],
  price: Math.round(Math.random() * 100000) / 100,
  stock: Math.floor(Math.random() * 1000)
})))

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true },
  { field: 'category', title: 'Category', filterable: true },
  { field: 'price', title: 'Price', sortable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'stock', title: 'Stock', sortable: true }
]

const sort = ref<SortDescriptor[]>([])
const filter = ref<FilterDescriptor[]>([])
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :virtual="true"
    :height="500"
    :row-height="44"
    v-model:sort="sort"
    v-model:filter="filter"
    locale="en"
  />
</template>
```

## Tips

- Always set `height` when using virtual scrolling
- Set `rowHeight` accurately for smooth scrolling
- Virtual scrolling automatically handles scroll position
- Use virtual scrolling for datasets with 500+ rows for best performance
- Remember that pagination is disabled when virtual scrolling is enabled





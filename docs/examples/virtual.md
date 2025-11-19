# Virtual Scrolling

Virtual scrolling renders only visible rows, providing smooth performance even with thousands of rows.

<ExamplePreview>
  <VirtualCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import VirtualCompleteExample from './components/VirtualCompleteExample.vue'
import VirtualExample from './components/VirtualExample.vue'
</script>

## Basic Virtual Scrolling

<ExamplePreview>
  <VirtualExample />
</ExamplePreview>

## Code

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref(Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100,
  category: ['Electronics', 'Clothing', 'Accessories'][i % 3]
})))

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true },
  { field: 'price', title: 'Price', sortable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', filterable: true }
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
    locale="en"
    responsive="table"
  />
</template>
```

## How Virtual Scrolling Works

Virtual scrolling only renders the rows that are currently visible in the viewport, plus a small buffer above and below. This dramatically improves performance for large datasets.

### Benefits

- **Performance**: Smooth scrolling even with 10,000+ rows
- **Memory efficient**: Only visible DOM elements are created
- **Fast initial render**: Grid appears instantly regardless of data size
- **Works with all features**: Sorting, filtering, and grouping work seamlessly

## Configuration

### Row Height

Set a fixed row height for optimal performance:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :virtual="true"
  :row-height="44"
  :height="400"
/>
```

### Dynamic Row Height

For variable row heights, omit `row-height` (performance may be slightly reduced):

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :virtual="true"
  :height="400"
/>
```

## When to Use Virtual Scrolling

- ✅ **Large datasets**: 1,000+ rows
- ✅ **Performance critical**: Need smooth scrolling
- ✅ **Memory constrained**: Limited device memory
- ❌ **Small datasets**: < 100 rows (overhead not worth it)
- ❌ **Variable row heights**: May cause layout shifts

## Performance Tips

1. **Set row height**: Fixed height improves performance
2. **Limit columns**: Fewer columns = faster rendering
3. **Avoid complex templates**: Simple cell templates perform better
4. **Use server-side**: For very large datasets, combine with server-side mode

## See Also

- [Server-Side Mode](/guide/server-side) - For extremely large datasets


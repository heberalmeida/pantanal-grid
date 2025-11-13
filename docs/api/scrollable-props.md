---
title: scrollableProps API
description: "API Index | scrollableProps"
api_reference: true
slug: api_grid_scrollableprops
---

# ScrollableProps

The `scrollable-virtual` and `scrollable-endless` props provide advanced scrolling capabilities for the Grid component, allowing you to handle large datasets efficiently.

## scrollable-virtual `Boolean`

If `scrollable-virtual` is set to `true`, the Grid will always display a single page of data. Scrolling changes only the data which is currently displayed.

### Behavior

- Only renders visible rows plus a small buffer
- Maintains smooth scrolling performance with large datasets
- Automatically calculates which rows to display based on scroll position
- Uses virtual padding to maintain scrollbar height

### Usage

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    scrollable-virtual
    :height="420"
    :row-height="44"
  />
</template>
```

### When to Use

- Large datasets (thousands of rows)
- Performance is critical
- You want to maintain a fixed viewport height
- Memory usage needs to be minimized

### Notes

- Requires `height` prop to be set
- Works best with fixed `rowHeight`
- Disables pagination when enabled
- Compatible with `virtual` prop (both enable virtual scrolling)

## scrollable-endless `Boolean`

If `scrollable-endless` is set to `true`, the Grid will always display a single page of data. Scrolling to the end will gradually load more items until all items are displayed.

### Behavior

- Initially displays a page of data
- Automatically loads more items as you scroll near the bottom
- Progressively reveals all data without pagination controls
- Shows a loading indicator while fetching more items

### Usage

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    scrollable-endless
    :height="420"
    :row-height="44"
  />
</template>
```

### When to Use

- Large datasets that should be progressively loaded
- You want infinite scroll behavior
- User experience benefits from continuous scrolling
- You want to avoid pagination controls

### Notes

- Requires `height` prop to be set
- Loads more items when within 100px of the bottom
- Uses `pageSize` to determine initial and incremental load amounts
- Shows loading indicator during data fetch
- Compatible with local data (not server-side)

## Alternative: scrollable Object

You can also use the `scrollable` prop as an object to configure both options:

```vue
<template>
  <!-- Virtual scrolling -->
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :scrollable="{ virtual: true }"
    :height="420"
  />

  <!-- Endless scrolling -->
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    :scrollable="{ endless: true }"
    :height="420"
  />
</template>
```

## Comparison

| Feature | scrollable-virtual | scrollable-endless | Standard Pagination |
|---------|-------------------|-------------------|-------------------|
| Initial Load | Single page | Single page | Single page |
| Scrolling | Virtual (renders visible only) | Progressive load | Page navigation |
| Memory Usage | Low | Medium | Low |
| Performance | Excellent | Good | Good |
| User Experience | Smooth scrolling | Infinite scroll | Page-based |
| Pagination Controls | Hidden | Hidden | Visible |

## Examples

### Virtual Scrolling Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100,
  category: ['Electronics', 'Clothing', 'Accessories'][i % 3]
})))

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category' }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    scrollable-virtual
    :height="420"
    :row-height="44"
  />
</template>
```

### Endless Scrolling Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref(Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`,
  status: ['Active', 'Inactive', 'Pending'][i % 3]
})))

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'description', title: 'Description' },
  { field: 'status', title: 'Status' }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    scrollable-endless
    :height="420"
    :row-height="44"
    :page-size="20"
  />
</template>
```

## Suggested Links

* [`Scrollable` in Kendo UI Grid for jQuery](https://docs.telerik.com/kendo-ui/api/javascript/ui/grid/configuration/scrollable)
* [Virtual Scrolling Guide](/guide/virtual-scrolling)
* [Grid Props API](/api/grid-props)


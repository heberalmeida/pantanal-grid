---
title: Grouping Basics
description: Learn how to enable and use drag-and-drop grouping in Pantanal Grid
---

# Grouping Basics

By default, grouping in Pantanal Grid is disabled. To enable grouping, set the `groupable` prop to `true`. This will render a drop zone above the grid header where you can drag column headers to group the data by that column.

<ExamplePreview>
  <GroupingBasicsCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import GroupingBasicsCompleteExample from './components/GroupingBasicsCompleteExample.vue'
import GroupingBasicsMultipleExample from './components/GroupingBasicsMultipleExample.vue'
import GroupingBasicsInitialExample from './components/GroupingBasicsInitialExample.vue'
import GroupingBasicsListenExample from './components/GroupingBasicsListenExample.vue'
import GroupingBasicsDisabledExample from './components/GroupingBasicsDisabledExample.vue'
import GroupingBasicsColumnControlExample from './components/GroupingBasicsColumnControlExample.vue'
</script>

## Basic Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  {
    ProductID: 1,
    ProductName: 'Chai',
    UnitPrice: 18,
    UnitsInStock: 39,
    Discontinued: false,
    Category: 'Beverages'
  },
  {
    ProductID: 4,
    ProductName: 'Chef Anton',
    UnitPrice: 22,
    UnitsInStock: 53,
    Discontinued: false,
    Category: 'Beverages'
  },
  {
    ProductID: 5,
    ProductName: 'Chef Gumbo Mix',
    UnitPrice: 21.35,
    UnitsInStock: 0,
    Discontinued: true,
    Category: 'Dairy Products'
  },
  {
    ProductID: 6,
    ProductName: 'Boysenberry Spread',
    UnitPrice: 25,
    UnitsInStock: 120,
    Discontinued: false,
    Category: 'Condiments'
  }
])

const columns: ColumnDef[] = [
  { field: 'ProductName', title: 'Product Name', width: 180 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'Category', title: 'Category', width: 180 },
  { field: 'Discontinued', title: 'Discontinued', width: 120 }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    groupable
    key-field="ProductID"
    locale="en"
  />
</template>
```

## How It Works

1. **Enable Grouping**: Set `groupable` to `true` on the Grid component
2. **Drag Column Headers**: Click and drag any column header to the drop zone above the grid
3. **Multiple Groups**: You can group by multiple columns by dragging additional column headers
4. **Reorder Groups**: Drag group badges within the drop zone to reorder the grouping hierarchy
5. **Remove Groups**: Click the × button on a group badge to remove that grouping

## Column-Level Control

You can disable grouping for specific columns by setting `groupable: false` on the column definition:

<ExamplePreview>
  <GroupingBasicsColumnControlExample />
</ExamplePreview>

```vue
const columns: ColumnDef[] = [
  { field: 'ProductName', title: 'Product Name', width: 180 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, groupable: false }, // Cannot be grouped
  { field: 'Category', title: 'Category', width: 180 },
]
```

## Group Direction

Groups are sorted in ascending order by default. The group direction is indicated by an arrow (↑ for ascending, ↓ for descending) in the group badge.

## Multiple Groups Example

You can group by multiple columns by dragging additional column headers to the drop zone. The order of groups determines the hierarchy:

<ExamplePreview>
  <GroupingBasicsMultipleExample />
</ExamplePreview>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', brand: 'Brand X', price: 29.99, stock: 150 },
  { id: 2, name: 'Product B', category: 'Electronics', brand: 'Brand X', price: 49.99, stock: 75 },
  { id: 3, name: 'Product C', category: 'Electronics', brand: 'Brand Y', price: 19.99, stock: 200 },
  { id: 4, name: 'Product D', category: 'Clothing', brand: 'Brand X', price: 39.99, stock: 50 },
  { id: 5, name: 'Product E', category: 'Clothing', brand: 'Brand Z', price: 59.99, stock: 100 },
  { id: 6, name: 'Product F', category: 'Accessories', brand: 'Brand X', price: 14.99, stock: 200 }
])

const columns: ColumnDef[] = [
  { field: 'name', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'brand', title: 'Brand', width: 150 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'stock', title: 'Stock', width: 100 }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    groupable
    key-field="id"
    locale="en"
    :height="400"
  />
</template>
```

**Try it:** Drag "Category" first, then drag "Brand" to create nested groups (Category → Brand).

## Initial Grouping with Drag-and-Drop

You can set initial groups programmatically while still allowing users to modify them via drag-and-drop:

<ExamplePreview>
  <GroupingBasicsInitialExample />
</ExamplePreview>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', brand: 'Brand X', price: 29.99 },
  { id: 2, name: 'Product B', category: 'Electronics', brand: 'Brand Y', price: 49.99 },
  { id: 3, name: 'Product C', category: 'Clothing', brand: 'Brand X', price: 19.99 },
  { id: 4, name: 'Product D', category: 'Clothing', brand: 'Brand Z', price: 39.99 }
])

const columns: ColumnDef[] = [
  { field: 'name', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'brand', title: 'Brand', width: 150 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` }
]

// Start with initial grouping by category
const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' }
])
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    groupable
    :group="group"
    key-field="id"
    locale="en"
  />
</template>
```

Users can still drag columns to add more groups or remove existing ones.

## Listening to Group Changes

You can listen to group changes when users modify groups via drag-and-drop:

<ExamplePreview>
  <GroupingBasicsListenExample />
</ExamplePreview>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', brand: 'Brand X', price: 29.99 },
  { id: 2, name: 'Product B', category: 'Electronics', brand: 'Brand Y', price: 49.99 },
  { id: 3, name: 'Product C', category: 'Clothing', brand: 'Brand X', price: 19.99 }
])

const columns: ColumnDef[] = [
  { field: 'name', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'brand', title: 'Brand', width: 150 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}` }
]

const group = ref<GroupDescriptor[]>([])

function handleGroupChange(newGroup: GroupDescriptor[]) {
  group.value = newGroup
  console.log('Group changed:', newGroup)
  // You can save to localStorage, send to server, etc.
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    groupable
    :group="group"
    @update:group="handleGroupChange"
    key-field="id"
    locale="en"
  />
</template>
```

## Disabling Grouping for Specific Columns

Prevent certain columns from being grouped by setting `groupable: false`:

<ExamplePreview>
  <GroupingBasicsDisabledExample />
</ExamplePreview>

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, groupable: false }, // Cannot be grouped
  { field: 'name', title: 'Product Name', width: 200 },
  { field: 'category', title: 'Category', width: 150 },
  { field: 'price', title: 'Price', width: 120, format: (v: number) => `$${v.toFixed(2)}`, groupable: false }, // Cannot be grouped
  { field: 'brand', title: 'Brand', width: 150 }
]
</script>
```

Columns with `groupable: false` won't be draggable to the drop zone.

## Related Features

- [Grouping with Aggregates](/examples/aggregates) - Learn how to add aggregate calculations to grouped data
- [Grouping API Reference](/api/grid#group) - Complete API documentation for grouping


---
title: Grouping Basics
description: Learn how to enable and use drag-and-drop grouping in Pantanal Grid
---

# Grouping Basics

By default, grouping in Pantanal Grid is disabled. To enable grouping, set the `groupable` prop to `true`. This will render a drop zone above the grid header where you can drag column headers to group the data by that column.

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

```vue
const columns: ColumnDef[] = [
  { field: 'ProductName', title: 'Product Name', width: 180 },
  { field: 'UnitPrice', title: 'Unit Price', width: 120, groupable: false }, // Cannot be grouped
  { field: 'Category', title: 'Category', width: 180 },
]
```

## Group Direction

Groups are sorted in ascending order by default. The group direction is indicated by an arrow (↑ for ascending, ↓ for descending) in the group badge.

## Related Features

- [Grouping with Aggregates](/examples/aggregates) - Learn how to add aggregate calculations to grouped data
- [Grouping API Reference](/api/grid#group) - Complete API documentation for grouping

